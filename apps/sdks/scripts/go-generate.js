#!/usr/bin/env node
/**
 * Go SDK generator — public merchant surface from OpenAPI + allowlist.
 */

import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  unlinkSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  readSpecAndAllowlist,
  getNormalizedOperations,
  sdkPropertyName,
  sdkPropToGoField,
  tsMethodToGo,
  expandSdkManifestMethods,
  withoutHandwrittenServices,
} from './public-sdk-operations.js';

/** Hand-written lomi. Network files (transfers, balance, network) kept across regenerations. */
const HANDWRITTEN_GO_FILES = new Set(['network.go', 'network_test.go']);

const __dirname = dirname(fileURLToPath(import.meta.url));
const sdksRoot = join(__dirname, '..');
const outputDir = join(sdksRoot, 'go');

function stemSnake(serviceClassName) {
  const inner = serviceClassName.replace(/Service$/, '');
  return inner
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

function svcFileStem(serviceClassName) {
  return `${stemSnake(serviceClassName)}_service`;
}

console.log('🔨 Generating Go SDK from OpenAPI + allowlist…');

execSync('node scripts/pre-generate.js', {
  cwd: sdksRoot,
  stdio: 'inherit',
});

mkdirSync(outputDir, { recursive: true });

for (const f of readdirSync(outputDir)) {
  if (f.endsWith('.go') && !HANDWRITTEN_GO_FILES.has(f)) {
    unlinkSync(join(outputDir, f));
  }
}

const { spec, allowed } = readSpecAndAllowlist();
const byService = withoutHandwrittenServices(
  getNormalizedOperations(spec, allowed).byService,
);

const cfg = `// AUTO-GENERATED — public merchant allowlist SDK
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
`;

const response = `package lomi

import "fmt"

type Error struct {
	StatusCode int
	Message    string
}

func (e *Error) Error() string {
	return fmt.Sprintf("lomi API error (status %d): %s", e.StatusCode, e.Message)
}
`;

const utils = `package lomi

import "net/url"

func paramsToQuery(params map[string]string) url.Values {
	if params == nil || len(params) == 0 {
		return nil
	}
	q := url.Values{}
	for k, v := range params {
		q.Set(k, v)
	}
	return q
}
`;

writeFileSync(join(outputDir, 'configuration.go'), cfg);
writeFileSync(join(outputDir, 'response.go'), response);
writeFileSync(join(outputDir, 'utils.go'), utils);

const GO_RESERVED = new Set([
  'break', 'default', 'func', 'interface', 'select', 'case', 'defer', 'go', 'map', 'struct',
  'chan', 'else', 'goto', 'package', 'switch', 'const', 'fallthrough', 'if', 'range', 'type',
  'continue', 'for', 'import', 'return', 'var',
]);

/** @param {string} name */
function goParamName(name) {
  return GO_RESERVED.has(name) ? `${name}Param` : name;
}

/**
 * @param {string} serviceClassName
 * @param {any} nop
 */
function buildGoMethod(serviceClassName, nop) {
  const goName = tsMethodToGo(nop.sdkMethodName);
  const tmpl = nop.pathTemplate;
  const ids = nop.pathParamNames;
  const q = nop.httpMethodLower === 'get' && nop.queryParams.length > 0;
  const body = nop.wantsBody;

  const plist = [...ids.map((n) => `${goParamName(n)} string`)];
  if (q) plist.push('params map[string]string');
  if (body) plist.push('body interface{}');
  const plistStr = plist.join(', ');

  const pathLines = [`path := ${JSON.stringify(tmpl)}`];
  for (const n of ids) {
    const p = goParamName(n);
    pathLines.push(`path = strings.ReplaceAll(path, "{${n}}", ${p})`);
  }

  let queryExpr = 'nil';
  let bodyExpr = 'nil';
  if (q) queryExpr = 'paramsToQuery(params)';
  if (body) bodyExpr = 'body';
  const pathBlock =
    `${pathLines.map((ln) => '\t\t' + ln).join('\n')}\n` +
    `\t\tbodyResp, err := s.client.doRequest("${nop.httpMethodLower.toUpperCase()}", path, ${queryExpr}, ${bodyExpr})\n` +
    `\t\tif err != nil {\n\t\t\treturn nil, err\n\t\t}`;

  return `func (s *${serviceClassName}) ${goName}(${plistStr}) (interface{}, error) {
${pathBlock}
		if len(bodyResp) == 0 {
			return nil, nil
		}
		var out interface{}
		if err := json.Unmarshal(bodyResp, &out); err != nil {
			return nil, err
		}
		return out, nil
	}
`;
}

/** @type {string[]} serviceClass names sorted */
const sortedSvc = [...byService.keys()].sort((a, b) => a.localeCompare(b));

for (const serviceClassName of sortedSvc) {
  const ops = [...byService.get(serviceClassName)].sort((a, b) =>
    tsMethodToGo(a.sdkMethodName).localeCompare(tsMethodToGo(b.sdkMethodName)),
  );
  const methods = ops.map((o) => buildGoMethod(serviceClassName, o)).join('\n\n');
  const needsStrings = ops.some((o) => o.pathParamNames.length > 0);
  const imports = needsStrings
    ? `import (\n\t"encoding/json"\n\t"strings"\n)`
    : `import (\n\t"encoding/json"\n)`;

  const content = `// AUTO-GENERATED — public merchant allowlist
package lomi

${imports}

type ${serviceClassName} struct {
	client *Client
}

${methods}
`;

  writeFileSync(join(outputDir, `${svcFileStem(serviceClassName)}.go`), content);
}

const clientFields = sortedSvc.map(
  (svc) =>
    `\t${sdkPropToGoField(sdkPropertyName(svc))} *${svc}`,
);

const clientInits = sortedSvc.map(
  (svc) =>
    `\tc.${sdkPropToGoField(sdkPropertyName(svc))} = &${svc}{client: c}`,
);

const clientGo = `// AUTO-GENERATED — public merchant allowlist
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
${clientFields.join('\n')}
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
${clientInits.join('\n')}
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
`;

writeFileSync(join(outputDir, 'client.go'), clientGo);

const clientTest = `package lomi

import "testing"

func TestNewClient(t *testing.T) {
	c := NewClient("k")
	if c.APIKey != "k" {
		t.Fatal("api key")
	}
	if c.BaseURL != DefaultBaseURL {
		t.Fatal("base url")
	}
}

func TestWithSandbox(t *testing.T) {
	c := NewClient("k", WithSandbox())
	if c.BaseURL != SandboxBaseURL {
		t.Fatal("sandbox")
	}
}
`;

writeFileSync(join(outputDir, 'client_test.go'), clientTest);

const goModPath = join(outputDir, 'go.mod');
if (!existsSync(goModPath)) {
  writeFileSync(
    goModPath,
    `module github.com/lomiafrica/lomi-go

go 1.24
`,
  );
}

const manifestSdk = {};
for (const svc of sortedSvc) {
  manifestSdk[sdkPropertyName(svc)] = expandSdkManifestMethods(
    svc,
    [...byService.get(svc)].map((o) => o.sdkMethodName),
  );
}

writeFileSync(
  join(outputDir, 'sdk_go_methods.json'),
  `${JSON.stringify(
    { generatedAt: new Date().toISOString(), language: 'go', sdk: manifestSdk },
    null,
    2,
  )}\n`,
);

console.log(
  `✅ Go SDK generated — ${allowed.length} operations, ${byService.size} services.`,
);
