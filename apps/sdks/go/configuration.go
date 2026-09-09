// AUTO-GENERATED — public merchant allowlist SDK
package lomi

import "net/http"

const (
	DefaultBaseURL   = "https://api.lomi.africa"
	SandboxBaseURL   = "https://sandbox.api.lomi.africa"
)

type ClientOption func(*Client)

func WithBaseURL(url string) ClientOption {
	return func(c *Client) {
		c.BaseURL = url
	}
}

func WithSandbox() ClientOption {
	return func(c *Client) {
		c.BaseURL = SandboxBaseURL
	}
}

func WithHTTPClient(client *http.Client) ClientOption {
	return func(c *Client) {
		c.HTTPClient = client
	}
}

// WithAccount (lomi. Network) sends Lomi-Account: acct_… on every request so
// calls run on behalf of that Member Account (direct charges). Transfers,
// login links and account sessions ignore it (Operator-level routes).
func WithAccount(account string) ClientOption {
	return func(c *Client) {
		c.LomiAccount = account
	}
}
