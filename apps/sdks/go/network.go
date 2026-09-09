// Hand-written lomi. Network surface (not regenerated from OpenAPI).
//
// lomi. Network lets an Operator organization charge on behalf of Member
// Accounts ("acct_…"):
//
//   - Direct charges: send Lomi-Account on the regular endpoints
//     (NewClient(key, WithAccount("acct_…")) or client.ForAccount("acct_…")).
//   - Destination charges: charge on your own account with
//     transfer_data{destination} (+ application_fee_amount).
//   - Separate charges and transfers: charge with a transfer_group, then move
//     funds later with Transfers.Create.
//
// Transfers, login links and account sessions are Operator-level calls: they
// use your Operator API key and never send Lomi-Account (this file strips the
// client default for those routes).
//
// Two-step money confirmation: POST /transfers and POST /transfers/{id}/reversals
// first return {requires_confirmation: true, confirmation_token, expires_at,
// preview}; call again with ConfirmationToken set to execute. Idempotency-Key is
// required on the executing call; the SDK generates one when WithIdempotencyKey
// is not passed, and CreateConfirmed / ReverseConfirmed reuse the same key for
// both calls.
package lomi

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strconv"
)

// requestOptions carries per-call header overrides for doRequestWithOptions.
type requestOptions struct {
	account        string
	accountSet     bool
	idempotencyKey string
}

// RequestOption tunes a single request (Lomi-Account override, Idempotency-Key).
type RequestOption func(*requestOptions)

// WithRequestAccount overrides Lomi-Account for one call. Pass "" to send no
// Lomi-Account even when the client was built with WithAccount.
func WithRequestAccount(account string) RequestOption {
	return func(o *requestOptions) {
		o.account = account
		o.accountSet = true
	}
}

// WithIdempotencyKey sets the Idempotency-Key header for one call.
func WithIdempotencyKey(key string) RequestOption {
	return func(o *requestOptions) {
		o.idempotencyKey = key
	}
}

func applyRequestOptions(opts []RequestOption) requestOptions {
	var o requestOptions
	for _, opt := range opts {
		if opt != nil {
			opt(&o)
		}
	}
	return o
}

// newIdempotencyKey returns a random 32-hex-char key.
func newIdempotencyKey() string {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		panic(fmt.Sprintf("lomi: idempotency key: %v", err))
	}
	return hex.EncodeToString(b)
}

// ForAccount returns a shallow copy of the client scoped to a Member Account:
// every request sends Lomi-Account: account. Pass "" for an Operator-scoped copy.
func (c *Client) ForAccount(account string) *Client {
	scoped := NewClient(c.APIKey, WithBaseURL(c.BaseURL), WithHTTPClient(c.HTTPClient))
	scoped.LomiAccount = account
	return scoped
}

func decodeInto(body []byte, out interface{}) error {
	if len(body) == 0 {
		return nil
	}
	return json.Unmarshal(body, out)
}

// MoneyConfirmation is the preview returned by the first call of a two-step
// money operation (transfers, reversals).
type MoneyConfirmation struct {
	RequiresConfirmation bool                   `json:"requires_confirmation"`
	ConfirmationToken    string                 `json:"confirmation_token"`
	ExpiresAt            string                 `json:"expires_at"`
	Preview              map[string]interface{} `json:"preview"`
}

// Transfer is the lomi. Network transfer object (object: "transfer").
type Transfer struct {
	ID                  string                 `json:"id"`
	Object              string                 `json:"object"`
	Amount              float64                `json:"amount"`
	CurrencyCode        string                 `json:"currency_code"`
	SettledAmount       *float64               `json:"settled_amount"`
	SettledCurrency     *string                `json:"settled_currency"`
	TransferType        string                 `json:"transfer_type"`
	Status              string                 `json:"status"`
	Environment         string                 `json:"environment"`
	Destination         string                 `json:"destination"`
	Source              *string                `json:"source"`
	SourceTransactionID *string                `json:"source_transaction_id"`
	RefundID            *string                `json:"refund_id"`
	ReversedTransferID  *string                `json:"reversed_transfer_id"`
	ReversedAmount      *float64               `json:"reversed_amount"`
	TransferGroup       *string                `json:"transfer_group"`
	Description         *string                `json:"description"`
	Metadata            map[string]interface{} `json:"metadata"`
	CreatedAt           string                 `json:"created_at"`
	UpdatedAt           string                 `json:"updated_at"`
}

// TransferResult is either an executed Transfer or a confirmation preview.
type TransferResult struct {
	Transfer     *Transfer
	Confirmation *MoneyConfirmation
}

// RequiresConfirmation reports whether the API asked for a second call.
func (r *TransferResult) RequiresConfirmation() bool {
	return r != nil && r.Confirmation != nil && r.Confirmation.RequiresConfirmation
}

func decodeTransferResult(body []byte) (*TransferResult, error) {
	var probe struct {
		RequiresConfirmation bool `json:"requires_confirmation"`
	}
	if err := decodeInto(body, &probe); err != nil {
		return nil, err
	}
	res := &TransferResult{}
	if probe.RequiresConfirmation {
		res.Confirmation = &MoneyConfirmation{}
		return res, decodeInto(body, res.Confirmation)
	}
	res.Transfer = &Transfer{}
	return res, decodeInto(body, res.Transfer)
}

// TransferList is a cursor page of transfers.
type TransferList struct {
	Data       []Transfer `json:"data"`
	HasMore    bool       `json:"has_more"`
	NextCursor *string    `json:"next_cursor"`
}

// CreateTransferParams is the body of POST /transfers.
type CreateTransferParams struct {
	Amount              float64                `json:"amount"`
	CurrencyCode        string                 `json:"currency_code"`
	Destination         string                 `json:"destination"`
	TransferGroup       string                 `json:"transfer_group,omitempty"`
	SourceTransactionID string                 `json:"source_transaction_id,omitempty"`
	Description         string                 `json:"description,omitempty"`
	Metadata            map[string]interface{} `json:"metadata,omitempty"`
	// ConfirmationToken from the preview call; leave empty to request a preview.
	ConfirmationToken string `json:"confirmation_token,omitempty"`
}

// ReverseTransferParams is the body of POST /transfers/{id}/reversals.
type ReverseTransferParams struct {
	// Amount to reverse; zero reverses the full remaining amount.
	Amount            float64                `json:"amount,omitempty"`
	Description       string                 `json:"description,omitempty"`
	Metadata          map[string]interface{} `json:"metadata,omitempty"`
	ConfirmationToken string                 `json:"confirmation_token,omitempty"`
}

// ListTransfersParams filters GET /transfers.
type ListTransfersParams struct {
	Destination         string
	TransferGroup       string
	SourceTransactionID string
	// TransferType is comma-separated: destination, separate, operator_fee,
	// processing_fee_cover, fee_reversal, transfer_reversal, loss_cover.
	TransferType string
	Cursor       string
	Limit        int
}

func (p *ListTransfersParams) query() url.Values {
	if p == nil {
		return nil
	}
	q := url.Values{}
	set := func(k, v string) {
		if v != "" {
			q.Set(k, v)
		}
	}
	set("destination", p.Destination)
	set("transfer_group", p.TransferGroup)
	set("source_transaction_id", p.SourceTransactionID)
	set("transfer_type", p.TransferType)
	set("cursor", p.Cursor)
	if p.Limit > 0 {
		q.Set("limit", strconv.Itoa(p.Limit))
	}
	if len(q) == 0 {
		return nil
	}
	return q
}

// TransfersService moves Operator funds to Member Accounts (/transfers).
type TransfersService struct {
	client *Client
}

// Create previews or executes a transfer (POST /transfers). Without
// ConfirmationToken the result carries a Confirmation; call again with the
// token to execute. Pass the same WithIdempotencyKey on both calls
// (auto-generated when omitted).
func (s *TransfersService) Create(params CreateTransferParams, opts ...RequestOption) (*TransferResult, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	if ro.idempotencyKey == "" {
		ro.idempotencyKey = newIdempotencyKey()
	}
	body, err := s.client.doRequestWithOptions("POST", "/transfers", nil, params, ro)
	if err != nil {
		return nil, err
	}
	return decodeTransferResult(body)
}

// CreateConfirmed previews then executes a transfer (two HTTP calls, one key).
func (s *TransfersService) CreateConfirmed(params CreateTransferParams, opts ...RequestOption) (*Transfer, error) {
	ro := applyRequestOptions(opts)
	if ro.idempotencyKey == "" {
		opts = append(opts, WithIdempotencyKey(newIdempotencyKey()))
	}
	params.ConfirmationToken = ""
	first, err := s.Create(params, opts...)
	if err != nil {
		return nil, err
	}
	if !first.RequiresConfirmation() {
		return first.Transfer, nil
	}
	params.ConfirmationToken = first.Confirmation.ConfirmationToken
	second, err := s.Create(params, opts...)
	if err != nil {
		return nil, err
	}
	if second.RequiresConfirmation() {
		return nil, errors.New("lomi: API asked for confirmation twice; aborting transfer")
	}
	return second.Transfer, nil
}

// List returns transfers created by your Network (GET /transfers).
func (s *TransfersService) List(params *ListTransfersParams, opts ...RequestOption) (*TransferList, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	body, err := s.client.doRequestWithOptions("GET", "/transfers", params.query(), nil, ro)
	if err != nil {
		return nil, err
	}
	out := &TransferList{}
	return out, decodeInto(body, out)
}

// Get retrieves one transfer (GET /transfers/{id}).
func (s *TransfersService) Get(id string, opts ...RequestOption) (*Transfer, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	body, err := s.client.doRequestWithOptions("GET", "/transfers/"+url.PathEscape(id), nil, nil, ro)
	if err != nil {
		return nil, err
	}
	out := &Transfer{}
	return out, decodeInto(body, out)
}

// Reverse reverses a transfer fully or partially (POST /transfers/{id}/reversals).
// Same two-step confirmation as Create.
func (s *TransfersService) Reverse(id string, params ReverseTransferParams, opts ...RequestOption) (*TransferResult, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	if ro.idempotencyKey == "" {
		ro.idempotencyKey = newIdempotencyKey()
	}
	body, err := s.client.doRequestWithOptions("POST", "/transfers/"+url.PathEscape(id)+"/reversals", nil, params, ro)
	if err != nil {
		return nil, err
	}
	return decodeTransferResult(body)
}

// ReverseConfirmed previews then executes a reversal (two HTTP calls, one key).
func (s *TransfersService) ReverseConfirmed(id string, params ReverseTransferParams, opts ...RequestOption) (*Transfer, error) {
	ro := applyRequestOptions(opts)
	if ro.idempotencyKey == "" {
		opts = append(opts, WithIdempotencyKey(newIdempotencyKey()))
	}
	params.ConfirmationToken = ""
	first, err := s.Reverse(id, params, opts...)
	if err != nil {
		return nil, err
	}
	if !first.RequiresConfirmation() {
		return first.Transfer, nil
	}
	params.ConfirmationToken = first.Confirmation.ConfirmationToken
	second, err := s.Reverse(id, params, opts...)
	if err != nil {
		return nil, err
	}
	if second.RequiresConfirmation() {
		return nil, errors.New("lomi: API asked for confirmation twice; aborting reversal")
	}
	return second.Transfer, nil
}

// BalanceRow is one currency line of GET /accounts/balance.
type BalanceRow struct {
	CurrencyCode string  `json:"currency_code"`
	Balance      float64 `json:"balance"`
	LastUpdated  string  `json:"last_updated"`
}

// BalanceService reads GET /accounts/balance for you or a Member Account.
type BalanceService struct {
	client *Client
}

// Get returns balance rows. account = "acct_…" reads a Member Account balance
// (Lomi-Account); "" uses the client-level account when set.
func (s *BalanceService) Get(account string, opts ...RequestOption) ([]BalanceRow, error) {
	if account != "" {
		opts = append(opts, WithRequestAccount(account))
	}
	body, err := s.client.doRequestWithOptions("GET", "/accounts/balance", nil, nil, applyRequestOptions(opts))
	if err != nil {
		return nil, err
	}
	var out []BalanceRow
	return out, decodeInto(body, &out)
}

// LoginLink is a single-use dashboard login URL for a Member Account.
type LoginLink struct {
	Object    string `json:"object"`
	Account   string `json:"account"`
	URL       string `json:"url"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
}

// AccountSessionComponent toggles one embedded component.
type AccountSessionComponent struct {
	Enabled bool `json:"enabled"`
}

// AccountSessionComponents selects embedded components for an account session.
type AccountSessionComponents struct {
	Onboarding         *AccountSessionComponent `json:"onboarding,omitempty"`
	Payments           *AccountSessionComponent `json:"payments,omitempty"`
	Payouts            *AccountSessionComponent `json:"payouts,omitempty"`
	Balance            *AccountSessionComponent `json:"balance,omitempty"`
	NotificationBanner *AccountSessionComponent `json:"notification_banner,omitempty"`
}

// AccountSession is the client secret handed to embedded Member components.
type AccountSession struct {
	Object       string                 `json:"object"`
	Account      string                 `json:"account"`
	ClientSecret string                 `json:"client_secret"`
	ExpiresAt    string                 `json:"expires_at"`
	Components   map[string]interface{} `json:"components"`
	EmbedBaseURL string                 `json:"embed_base_url"`
}

// NetworkAccountsService: /network/accounts/{account}/… helpers.
type NetworkAccountsService struct {
	client *Client
}

// CreateLoginLink creates a single-use dashboard login link for a Member Account
// (POST /network/accounts/{account}/login_links).
func (s *NetworkAccountsService) CreateLoginLink(account string, opts ...RequestOption) (*LoginLink, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	path := "/network/accounts/" + url.PathEscape(account) + "/login_links"
	body, err := s.client.doRequestWithOptions("POST", path, nil, nil, ro)
	if err != nil {
		return nil, err
	}
	out := &LoginLink{}
	return out, decodeInto(body, out)
}

// NetworkAccountSessionsService: /network/account-sessions.
type NetworkAccountSessionsService struct {
	client *Client
}

type accountSessionBody struct {
	Account    string                    `json:"account"`
	Components *AccountSessionComponents `json:"components,omitempty"`
}

// Create issues an account session for embedded Member onboarding/payments UI
// (POST /network/account-sessions). components may be nil.
func (s *NetworkAccountSessionsService) Create(account string, components *AccountSessionComponents, opts ...RequestOption) (*AccountSession, error) {
	ro := applyRequestOptions(opts)
	ro.account, ro.accountSet = "", true
	body, err := s.client.doRequestWithOptions(
		"POST", "/network/account-sessions", nil,
		accountSessionBody{Account: account, Components: components}, ro,
	)
	if err != nil {
		return nil, err
	}
	out := &AccountSession{}
	return out, decodeInto(body, out)
}

// NetworkService groups Member Account helpers: client.Network.Accounts and
// client.Network.AccountSessions.
type NetworkService struct {
	Accounts        *NetworkAccountsService
	AccountSessions *NetworkAccountSessionsService
}

func newNetworkService(c *Client) *NetworkService {
	return &NetworkService{
		Accounts:        &NetworkAccountsService{client: c},
		AccountSessions: &NetworkAccountSessionsService{client: c},
	}
}
