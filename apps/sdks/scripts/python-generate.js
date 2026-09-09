#!/usr/bin/env node
/**
 * Python SDK generator — public merchant surface from OpenAPI + allowlist.
 * Matches TypeScript naming via sdk-public-methods parity manifest.
 */

import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import {
  readSpecAndAllowlist,
  getNormalizedOperations,
  sdkPropertyName,
  camelSdkPropToSnake,
  tsMethodToPythonName,
  expandSdkManifestMethods,
  withoutHandwrittenServices,
} from './public-sdk-operations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sdksRoot = join(__dirname, '..');
const outputDir = join(sdksRoot, 'python/lomi');
const testsDir = join(sdksRoot, 'python/tests');
const servicesDir = join(outputDir, 'services');

console.log('🔨 Generating Python SDK from OpenAPI + allowlist…');

execSync('node scripts/pre-generate.js', {
  cwd: sdksRoot,
  stdio: 'inherit',
});

// Only the generated smoke test is owned by this script; hand-written tests
// (tests/test_network.py) survive regeneration.
const generatedTestPath = join(testsDir, 'test_generated_surface.py');
if (existsSync(servicesDir)) rmSync(servicesDir, { recursive: true });
if (existsSync(generatedTestPath)) rmSync(generatedTestPath);

mkdirSync(outputDir, { recursive: true });
mkdirSync(servicesDir, { recursive: true });
mkdirSync(testsDir, { recursive: true });

const { spec, allowed } = readSpecAndAllowlist();
// `lomi/network.py` (transfers, balance, network) is hand-written.
const byService = withoutHandwrittenServices(
  getNormalizedOperations(spec, allowed).byService,
);

function escapeDocSummary(nop) {
  const t = nop.summary || nop.sdkMethodName;
  return String(t).replace(/\r?\n/g, ' ').replace(/\\/g, '\\\\').replace(/"""/g, '\\"\\"\\"');
}

/**
 * Build single method Python source from normalized op.
 * @param {any} nop
 */
function buildPythonMethod(nop) {
  const pyName = tsMethodToPythonName(nop.sdkMethodName);
  const tmpl = nop.pathTemplate;
  const pNames = nop.pathParamNames;
  const hasQuery = nop.httpMethodLower === 'get' && nop.queryParams.length > 0;
  const hasBody = nop.wantsBody;

  const sigParts = [...pNames.map((n) => `${n}: str`)];
  if (hasQuery) sigParts.push('params: Optional[Dict[str, Any]] = None');
  if (hasBody) sigParts.push('body: Optional[Dict[str, Any]] = None');

  const sigClause = sigParts.length ? `, ${sigParts.join(', ')}` : '';

  const pathBody = [`path = ${JSON.stringify(tmpl)}`];
  for (const n of pNames) {
    pathBody.push(`path = path.replace("{${n}}", str(${n}))`);
  }

  let req = `self._request("${nop.httpMethodLower.toUpperCase()}", path`;
  if (hasQuery) req += ', params=params';
  if (hasBody) req += ', data=body';
  req += ')';

  const indentedPath = pathBody.map((l) => `        ${l}`).join('\n');

  return `    def ${pyName}(self${sigClause}) -> Any:
        """${escapeDocSummary(nop)}"""
${indentedPath}
        return ${req}
`;
}

function escapePyStr(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** @type {Map<string,string>} serviceClass -> module stem (snake) */
const serviceModuleStem = new Map();

for (const svc of byService.keys()) {
  serviceModuleStem.set(svc, camelSdkPropToSnake(sdkPropertyName(svc)));
}

for (const [serviceClassName, ops] of byService) {
  const stem = serviceModuleStem.get(serviceClassName);
  const sorted = [...ops].sort((a, b) =>
    tsMethodToPythonName(a.sdkMethodName).localeCompare(
      tsMethodToPythonName(b.sdkMethodName),
    ),
  );
  const blocks = sorted.map((o) => buildPythonMethod(o)).join('\n');

  const content = `from __future__ import annotations

from typing import Any, Dict, Optional

from ..client_base import ClientBase


class ${serviceClassName}(ClientBase):
    """Public merchant API — generated from OpenAPI allowlist."""

${blocks}
`;

  writeFileSync(join(servicesDir, `${stem}.py`), content);
}

let servicesInit = '';
for (const [serviceClassName, stem] of [...serviceModuleStem.entries()].sort(
  (a, b) => a[1].localeCompare(b[1]),
)) {
  servicesInit += `from .${stem} import ${serviceClassName}\n`;
}
writeFileSync(join(servicesDir, '__init__.py'), servicesInit);

const modelsDir = join(outputDir, 'models');
if (existsSync(modelsDir)) rmSync(modelsDir, { recursive: true });
mkdirSync(modelsDir, { recursive: true });

writeFileSync(
  join(modelsDir, '__init__.py'),
  `"""Types are dictated by the public API OpenAPI schema; use Dict[str, Any] or narrow in your app."""
from typing import Any, Dict

__all__ = ["JSONDict"]
JSONDict = Dict[str, Any]
`,
);

const clientBaseContent = `
from typing import Optional, Dict, Any, TYPE_CHECKING
import warnings
import requests

from .exceptions import LomiError, LomiAuthError, LomiNotFoundError

if TYPE_CHECKING:
    from .client import LomiClient


class ClientBase:
    """HTTP helpers shared by generated services."""

    def __init__(self, client: "LomiClient"):
        self._client = client

    def _request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        account: Optional[str] = None,
        idempotency_key: Optional[str] = None,
    ) -> Any:
        """Make an HTTP request to the merchant API.

        account= overrides the client-level Lomi-Account for this call
        ("" sends no Lomi-Account header at all).
        """
        return self._client._request(
            method,
            path,
            params=params,
            data=data,
            account=account,
            idempotency_key=idempotency_key,
        )
`;

writeFileSync(join(outputDir, 'client_base.py'), clientBaseContent);

const exceptionsContent = `"""lomi-sdk exceptions."""

from typing import Optional, Any


class LomiError(Exception):
    """Base SDK error."""

    def __init__(self, message: str, status_code: Optional[int] = None, body: Any = None):
        super().__init__(message)
        self.status_code = status_code
        self.body = body


class LomiAuthError(LomiError):
    """Invalid API credentials."""


class LomiNotFoundError(LomiError):
    """Resource missing."""
`;

writeFileSync(join(outputDir, 'exceptions.py'), exceptionsContent);

const sortedServicesForClient = [...byService.keys()].sort((a, b) =>
  a.localeCompare(b),
);

let clientInits = '';
for (const serviceClassName of sortedServicesForClient) {
  const stem = camelSdkPropToSnake(sdkPropertyName(serviceClassName));
  const snakeAttr = stem;
  clientInits += `        self.${snakeAttr} = ${serviceClassName}(self)\n`;
}

const clientPy = `"""lomi. Python SDK — generated from OpenAPI + public allowlist."""

import requests
from typing import Optional, Dict, Any

from .exceptions import LomiError, LomiAuthError, LomiNotFoundError
from .network import BalanceResource, NetworkResource, TransfersResource
from .services import *

def _flatten_data(data):
    if data is None:
        return None
    if hasattr(data, "model_dump"):
        return data.model_dump(exclude_unset=True)
    if hasattr(data, "dict"):
        return data.dict(exclude_unset=True)
    return data


class LomiClient:
    """Merchant API client (public routes only).

    account="acct_..." (lomi. Network) sends Lomi-Account on every request so
    calls run on behalf of that Member Account (direct charges). Use
    with_account() for a scoped copy, or the account= kwarg on client.balance
    for a single call.
    """

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.lomi.africa",
        environment: str = "live",
        account: Optional[str] = None,
    ):
        self.api_key = api_key
        test_host = environment in ("test", "sandbox") or (
            isinstance(environment, str) and environment.lower() == "test"
        )
        self.base_url = (
            base_url if not test_host else "https://sandbox.api.lomi.africa"
        )
        # stored as lomi_account: "account" is the generated /account/* service
        self.lomi_account = account or None
        self.session = requests.Session()
        self.session.headers.update(
            {"X-API-KEY": api_key, "Content-Type": "application/json"}
        )
        if self.lomi_account:
            self.session.headers["Lomi-Account"] = self.lomi_account
${clientInits}
        # lomi. Network (hand-written, see lomi/network.py)
        self.transfers = TransfersResource(self)
        self.balance = BalanceResource(self)
        self.network = NetworkResource(self)

    def with_account(self, account: Optional[str]) -> "LomiClient":
        """Return a client scoped to a Member Account (Lomi-Account: acct_...).

        with_account(None) returns an Operator-scoped client (no header).
        """
        return LomiClient(
            api_key=self.api_key,
            base_url=self.base_url,
            environment="live",
            account=account,
        )

    def _request(
        self,
        method: str,
        path: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        account: Optional[str] = None,
        idempotency_key: Optional[str] = None,
    ) -> Any:
        url = f"{self.base_url}{path}"
        json_data = _flatten_data(data)
        headers: Dict[str, Optional[str]] = {}
        if account is not None:
            # "" removes the session-level Lomi-Account for this call.
            headers["Lomi-Account"] = account or None
        if idempotency_key:
            headers["Idempotency-Key"] = idempotency_key
        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=json_data,
                headers=headers or None,
            )

            if response.status_code == 401:
                raise LomiAuthError(
                    "Invalid API key",
                    response.status_code,
                    response.json() if response.content else None,
                )
            if response.status_code == 404:
                raise LomiNotFoundError(
                    "Resource not found",
                    response.status_code,
                    response.json() if response.content else None,
                )
            if response.status_code >= 400:
                raise LomiError(
                    f"API error: {response.text}",
                    response.status_code,
                    response.json() if response.text else None,
                )

            return response.json() if response.content else None
        except requests.RequestException as e:
            raise LomiError(f"Request failed: {type(e).__name__}: {e}") from e

`;

writeFileSync(join(outputDir, 'client.py'), clientPy);

const initContent = `"""lomi Python SDK — public merchant API surface."""

from .client import LomiClient
from .exceptions import LomiError, LomiAuthError, LomiNotFoundError

__all__ = ["LomiClient", "LomiError", "LomiAuthError", "LomiNotFoundError"]
`;

writeFileSync(join(outputDir, '__init__.py'), initContent);

const manifestSdk = {};
for (const svc of sortedServicesForClient) {
  const key = sdkPropertyName(svc);
  manifestSdk[key] = expandSdkManifestMethods(
    svc,
    [...byService.get(svc)].map((o) => o.sdkMethodName),
  );
}

writeFileSync(
  join(outputDir, 'sdk_python_methods.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      language: 'python',
      naming: 'ts_method_names_manifest_pep8_sdk_methods_are_snake_case_in_code',
      sdk: manifestSdk,
      python_methods: Object.fromEntries(
        Object.entries(manifestSdk).map(([k, methods]) => [
          camelSdkPropToSnake(k),
          methods.map((m) => tsMethodToPythonName(m)),
        ]),
      ),
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(testsDir, 'test_generated_surface.py'),
  `"""Smoke test: generated services attach to client."""
import unittest


class TestSurface(unittest.TestCase):
    def test_client_services(self):
        from lomi import LomiClient

        c = LomiClient(api_key="test")

        attrs = sorted(
            a
            for a in dir(c)
            if not a.startswith("_") and callable(getattr(c, a, None)) is False
        )
        # spot-check newly added surfaces
        self.assertTrue(hasattr(c, "charges"))
        self.assertTrue(hasattr(c, "payment_links"))
        # hand-written lomi. Network surface (lomi/network.py)
        self.assertTrue(hasattr(c, "transfers"))
        self.assertTrue(hasattr(c, "balance"))
        self.assertTrue(hasattr(c.network, "account_sessions"))

        expected = sorted(
            name
            for name in attrs
            if name
            not in ("api_key", "base_url", "session", "lomi_account")
        )

        services = sorted(
            a
            for a in attrs
            if not a.startswith('_')
            and getattr(c, a).__class__.__name__.endswith("Service")
        )
        assert len(expected) >= 10
        print("services:", services)


if __name__ == "__main__":
    unittest.main()
`,
);

console.log(`✅ Python SDK generated — ${allowed.length} operations, ${byService.size} services.`);
