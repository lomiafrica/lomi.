// AUTO-GENERATED — public merchant allowlist
package lomi

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

type Client struct {
	APIKey     string
	BaseURL    string
	HTTPClient *http.Client
	// LomiAccount (lomi. Network): default Lomi-Account header, see WithAccount / ForAccount.
	LomiAccount string
	Account *AccountService
	Accounts *AccountsService
	ApiKeys *ApiKeysService
	Charges *ChargesService
	CheckoutSessions *CheckoutSessionsService
	Coupons *CouponsService
	Customers *CustomersService
	Disputes *DisputesService
	Exports *ExportsService
	Finance *FinanceService
	Invoices *InvoicesService
	Logs *LogsService
	Merchants *MerchantsService
	Meters *MetersService
	Organizations *OrganizationsService
	PaymentLinks *PaymentLinksService
	PaymentRequests *PaymentRequestsService
	PayoutMethods *PayoutMethodsService
	Payouts *PayoutsService
	Products *ProductsService
	Providers *ProvidersService
	Refunds *RefundsService
	RiskAssessments *RiskAssessmentsService
	Settings *SettingsService
	Settlements *SettlementsService
	Subscriptions *SubscriptionsService
	SupportRequests *SupportRequestsService
	Team *TeamService
	Transactions *TransactionsService
	Usage *UsageService
	Webhooks *WebhooksService
	// lomi. Network (hand-written, see network.go)
	Transfers *TransfersService
	Balance   *BalanceService
	Network   *NetworkService
}

func NewClient(apiKey string, opts ...ClientOption) *Client {
	c := &Client{
		APIKey:     apiKey,
		BaseURL:    DefaultBaseURL,
		HTTPClient: http.DefaultClient,
	}
	for _, opt := range opts {
		opt(c)
	}
	c.Account = &AccountService{client: c}
	c.Accounts = &AccountsService{client: c}
	c.ApiKeys = &ApiKeysService{client: c}
	c.Charges = &ChargesService{client: c}
	c.CheckoutSessions = &CheckoutSessionsService{client: c}
	c.Coupons = &CouponsService{client: c}
	c.Customers = &CustomersService{client: c}
	c.Disputes = &DisputesService{client: c}
	c.Exports = &ExportsService{client: c}
	c.Finance = &FinanceService{client: c}
	c.Invoices = &InvoicesService{client: c}
	c.Logs = &LogsService{client: c}
	c.Merchants = &MerchantsService{client: c}
	c.Meters = &MetersService{client: c}
	c.Organizations = &OrganizationsService{client: c}
	c.PaymentLinks = &PaymentLinksService{client: c}
	c.PaymentRequests = &PaymentRequestsService{client: c}
	c.PayoutMethods = &PayoutMethodsService{client: c}
	c.Payouts = &PayoutsService{client: c}
	c.Products = &ProductsService{client: c}
	c.Providers = &ProvidersService{client: c}
	c.Refunds = &RefundsService{client: c}
	c.RiskAssessments = &RiskAssessmentsService{client: c}
	c.Settings = &SettingsService{client: c}
	c.Settlements = &SettlementsService{client: c}
	c.Subscriptions = &SubscriptionsService{client: c}
	c.SupportRequests = &SupportRequestsService{client: c}
	c.Team = &TeamService{client: c}
	c.Transactions = &TransactionsService{client: c}
	c.Usage = &UsageService{client: c}
	c.Webhooks = &WebhooksService{client: c}
	c.Transfers = &TransfersService{client: c}
	c.Balance = &BalanceService{client: c}
	c.Network = newNetworkService(c)
	return c
}

func (c *Client) doRequest(method, path string, query url.Values, body interface{}) ([]byte, error) {
	return c.doRequestWithOptions(method, path, query, body, requestOptions{})
}

func (c *Client) doRequestWithOptions(method, path string, query url.Values, body interface{}, ro requestOptions) ([]byte, error) {
	baseURL, err := url.Parse(c.BaseURL)
	if err != nil {
		return nil, err
	}
	ref, err := url.Parse(path)
	if err != nil {
		return nil, err
	}
	u := baseURL.ResolveReference(ref).String()
	if query != nil {
		u += "?" + query.Encode()
	}
	var reqBody io.Reader
	if body != nil {
		jsonBody, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		reqBody = bytes.NewReader(jsonBody)
	}
	req, err := http.NewRequest(method, u, reqBody)
	if err != nil {
		return nil, err
	}
	req.Header.Set("X-API-KEY", c.APIKey)
	req.Header.Set("Content-Type", "application/json")
	account := c.LomiAccount
	if ro.accountSet {
		account = ro.account
	}
	if account != "" {
		req.Header.Set("Lomi-Account", account)
	}
	if ro.idempotencyKey != "" {
		req.Header.Set("Idempotency-Key", ro.idempotencyKey)
	}
	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode >= 400 {
		return nil, &Error{StatusCode: resp.StatusCode, Message: string(respBody)}
	}
	return respBody, nil
}
