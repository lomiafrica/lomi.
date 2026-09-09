package lomi

import (
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

type recordedRequest struct {
	Method  string
	Path    string
	Query   string
	Headers http.Header
	Body    map[string]interface{}
}

// newTestServer replays `responses` in order and records every request.
func newTestServer(t *testing.T, responses ...string) (*httptest.Server, *[]recordedRequest) {
	t.Helper()
	var seen []recordedRequest
	i := 0
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		raw, _ := io.ReadAll(r.Body)
		var body map[string]interface{}
		if len(raw) > 0 {
			_ = json.Unmarshal(raw, &body)
		}
		seen = append(seen, recordedRequest{
			Method: r.Method, Path: r.URL.Path, Query: r.URL.RawQuery,
			Headers: r.Header.Clone(), Body: body,
		})
		w.Header().Set("Content-Type", "application/json")
		if i < len(responses) {
			_, _ = io.WriteString(w, responses[i])
		} else {
			_, _ = io.WriteString(w, `{}`)
		}
		i++
	}))
	return srv, &seen
}

func TestWithAccountSetsHeaderOnGeneratedServices(t *testing.T) {
	srv, seen := newTestServer(t, `{"data":[]}`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL), WithAccount("acct_member"))
	if c.LomiAccount != "acct_member" {
		t.Fatalf("LomiAccount = %q", c.LomiAccount)
	}
	if _, err := c.Customers.List(nil); err != nil {
		t.Fatal(err)
	}
	if got := (*seen)[0].Headers.Get("Lomi-Account"); got != "acct_member" {
		t.Fatalf("Lomi-Account = %q", got)
	}
}

func TestForAccountScopesCopy(t *testing.T) {
	srv, seen := newTestServer(t, `{}`, `{}`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL))
	scoped := c.ForAccount("acct_scoped")
	if scoped == c || scoped.LomiAccount != "acct_scoped" || c.LomiAccount != "" {
		t.Fatal("ForAccount must return a scoped copy")
	}
	if scoped.BaseURL != c.BaseURL || scoped.APIKey != c.APIKey {
		t.Fatal("ForAccount must keep base URL and key")
	}
	if _, err := scoped.Customers.List(nil); err != nil {
		t.Fatal(err)
	}
	if _, err := c.Customers.List(nil); err != nil {
		t.Fatal(err)
	}
	if (*seen)[0].Headers.Get("Lomi-Account") != "acct_scoped" {
		t.Fatal("scoped client must send Lomi-Account")
	}
	if (*seen)[1].Headers.Get("Lomi-Account") != "" {
		t.Fatal("original client must not send Lomi-Account")
	}
}

func TestBalanceGetAccountOverride(t *testing.T) {
	srv, seen := newTestServer(t, `[{"currency_code":"XOF","balance":1500,"last_updated":"2026-01-01T00:00:00Z"}]`, `[]`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL), WithAccount("acct_default"))
	rows, err := c.Balance.Get("acct_other")
	if err != nil {
		t.Fatal(err)
	}
	if len(rows) != 1 || rows[0].CurrencyCode != "XOF" || rows[0].Balance != 1500 {
		t.Fatalf("rows = %+v", rows)
	}
	if _, err := c.Balance.Get(""); err != nil {
		t.Fatal(err)
	}
	if (*seen)[0].Path != "/accounts/balance" || (*seen)[0].Headers.Get("Lomi-Account") != "acct_other" {
		t.Fatalf("override request = %+v", (*seen)[0])
	}
	if (*seen)[1].Headers.Get("Lomi-Account") != "acct_default" {
		t.Fatal("empty account must fall back to client default")
	}
}

func TestTransfersCreateStripsAccountAndSendsIdempotencyKey(t *testing.T) {
	srv, seen := newTestServer(t, `{"id":"tr_1","object":"transfer","amount":5000,"currency_code":"XOF","destination":"acct_seller","status":"paid"}`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL), WithAccount("acct_default"))
	res, err := c.Transfers.Create(CreateTransferParams{
		Amount: 5000, CurrencyCode: "XOF", Destination: "acct_seller", TransferGroup: "order_42",
	}, WithIdempotencyKey("idem-1"))
	if err != nil {
		t.Fatal(err)
	}
	if res.RequiresConfirmation() || res.Transfer == nil || res.Transfer.ID != "tr_1" {
		t.Fatalf("res = %+v", res)
	}
	req := (*seen)[0]
	if req.Method != "POST" || req.Path != "/transfers" {
		t.Fatalf("req = %+v", req)
	}
	if req.Headers.Get("Lomi-Account") != "" {
		t.Fatal("transfers must not send Lomi-Account")
	}
	if req.Headers.Get("Idempotency-Key") != "idem-1" {
		t.Fatal("Idempotency-Key not sent")
	}
	if req.Body["transfer_group"] != "order_42" || req.Body["amount"] != float64(5000) {
		t.Fatalf("body = %+v", req.Body)
	}
	if _, has := req.Body["confirmation_token"]; has {
		t.Fatal("empty confirmation_token must be omitted")
	}
}

func TestTransfersCreateGeneratesIdempotencyKey(t *testing.T) {
	srv, seen := newTestServer(t, `{"id":"tr_1"}`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL))
	if _, err := c.Transfers.Create(CreateTransferParams{Amount: 1, CurrencyCode: "XOF", Destination: "acct_x"}); err != nil {
		t.Fatal(err)
	}
	if key := (*seen)[0].Headers.Get("Idempotency-Key"); len(key) != 32 {
		t.Fatalf("generated key = %q", key)
	}
}

func TestTransfersCreateConfirmedTwoStep(t *testing.T) {
	preview := `{"requires_confirmation":true,"confirmation_token":"tok_1","expires_at":"2026-01-01T00:00:00Z","preview":{"amount":100}}`
	srv, seen := newTestServer(t, preview, `{"id":"tr_2","status":"paid"}`)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL))

	first, err := c.Transfers.Create(CreateTransferParams{Amount: 100, CurrencyCode: "XOF", Destination: "acct_x"})
	if err != nil {
		t.Fatal(err)
	}
	if !first.RequiresConfirmation() || first.Confirmation.ConfirmationToken != "tok_1" {
		t.Fatalf("first = %+v", first)
	}

	srv2, seen2 := newTestServer(t, preview, `{"id":"tr_2","status":"paid"}`)
	defer srv2.Close()
	c2 := NewClient("k", WithBaseURL(srv2.URL))
	tr, err := c2.Transfers.CreateConfirmed(CreateTransferParams{Amount: 100, CurrencyCode: "XOF", Destination: "acct_x"})
	if err != nil {
		t.Fatal(err)
	}
	if tr.ID != "tr_2" {
		t.Fatalf("tr = %+v", tr)
	}
	if len(*seen2) != 2 {
		t.Fatalf("expected 2 calls, got %d", len(*seen2))
	}
	if _, has := (*seen2)[0].Body["confirmation_token"]; has {
		t.Fatal("first call must not carry confirmation_token")
	}
	if (*seen2)[1].Body["confirmation_token"] != "tok_1" {
		t.Fatal("second call must carry confirmation_token")
	}
	if (*seen2)[0].Headers.Get("Idempotency-Key") != (*seen2)[1].Headers.Get("Idempotency-Key") {
		t.Fatal("both calls must reuse one Idempotency-Key")
	}
	_ = seen
}

func TestTransfersListGetReverse(t *testing.T) {
	srv, seen := newTestServer(t,
		`{"data":[{"id":"tr_1"}],"has_more":true,"next_cursor":"c2"}`,
		`{"id":"tr_1","object":"transfer"}`,
		`{"id":"tr_3","transfer_type":"transfer_reversal"}`,
	)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL))

	page, err := c.Transfers.List(&ListTransfersParams{Destination: "acct_x", TransferType: "separate", Limit: 10})
	if err != nil {
		t.Fatal(err)
	}
	if len(page.Data) != 1 || !page.HasMore || page.NextCursor == nil || *page.NextCursor != "c2" {
		t.Fatalf("page = %+v", page)
	}
	tr, err := c.Transfers.Get("tr_1")
	if err != nil || tr.ID != "tr_1" {
		t.Fatalf("get = %+v err=%v", tr, err)
	}
	rev, err := c.Transfers.Reverse("tr_1", ReverseTransferParams{Amount: 50}, WithIdempotencyKey("idem-r"))
	if err != nil || rev.Transfer == nil || rev.Transfer.ID != "tr_3" {
		t.Fatalf("reverse = %+v err=%v", rev, err)
	}

	q := (*seen)[0].Query
	for _, want := range []string{"destination=acct_x", "transfer_type=separate", "limit=10"} {
		if !contains(q, want) {
			t.Fatalf("query %q missing %q", q, want)
		}
	}
	if (*seen)[1].Path != "/transfers/tr_1" {
		t.Fatalf("get path = %q", (*seen)[1].Path)
	}
	if (*seen)[2].Path != "/transfers/tr_1/reversals" || (*seen)[2].Body["amount"] != float64(50) ||
		(*seen)[2].Headers.Get("Idempotency-Key") != "idem-r" {
		t.Fatalf("reverse req = %+v", (*seen)[2])
	}
}

func TestNetworkLoginLinkAndAccountSession(t *testing.T) {
	srv, seen := newTestServer(t,
		`{"object":"login_link","account":"acct_m","url":"https://x","created_at":"a","expires_at":"b"}`,
		`{"object":"account_session","account":"acct_m","client_secret":"sec","expires_at":"b","components":{},"embed_base_url":"https://e"}`,
		`{"object":"account_session"}`,
	)
	defer srv.Close()
	c := NewClient("k", WithBaseURL(srv.URL), WithAccount("acct_default"))

	link, err := c.Network.Accounts.CreateLoginLink("acct_m")
	if err != nil || link.URL != "https://x" || link.Object != "login_link" {
		t.Fatalf("link = %+v err=%v", link, err)
	}
	sess, err := c.Network.AccountSessions.Create("acct_m", nil)
	if err != nil || sess.ClientSecret != "sec" {
		t.Fatalf("sess = %+v err=%v", sess, err)
	}
	if _, err := c.Network.AccountSessions.Create("acct_m", &AccountSessionComponents{
		Onboarding: &AccountSessionComponent{Enabled: true},
	}); err != nil {
		t.Fatal(err)
	}

	if (*seen)[0].Method != "POST" || (*seen)[0].Path != "/network/accounts/acct_m/login_links" {
		t.Fatalf("login link req = %+v", (*seen)[0])
	}
	if (*seen)[0].Headers.Get("Lomi-Account") != "" || (*seen)[1].Headers.Get("Lomi-Account") != "" {
		t.Fatal("network routes must not send Lomi-Account")
	}
	if (*seen)[1].Path != "/network/account-sessions" || (*seen)[1].Body["account"] != "acct_m" {
		t.Fatalf("session req = %+v", (*seen)[1])
	}
	if _, has := (*seen)[1].Body["components"]; has {
		t.Fatal("nil components must be omitted")
	}
	comps, _ := (*seen)[2].Body["components"].(map[string]interface{})
	onboarding, _ := comps["onboarding"].(map[string]interface{})
	if onboarding["enabled"] != true {
		t.Fatalf("components = %+v", (*seen)[2].Body["components"])
	}
}

func contains(s, sub string) bool {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}
