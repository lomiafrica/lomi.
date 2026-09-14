#!/usr/bin/env node
/**
 * PHP SDK generator — public merchant surface from OpenAPI + allowlist.
 */

import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  readSpecAndAllowlist,
  getNormalizedOperations,
  sdkPropertyName,
  expandSdkManifestMethods,
} from "./public-sdk-operations.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sdksRoot = join(__dirname, "..");
const srcDir = join(sdksRoot, "php/src");
const servicesDir = join(srcDir, "Services");
const testsDir = join(sdksRoot, "php/tests");

console.log("🔨 Generating PHP SDK from OpenAPI + allowlist…");

execSync("node scripts/pre-generate.js", {
  cwd: sdksRoot,
  stdio: "inherit",
});

rmSync(servicesDir, { recursive: true, force: true });
rmSync(testsDir, { recursive: true, force: true });
mkdirSync(servicesDir, { recursive: true });
mkdirSync(testsDir, { recursive: true });

const modelsDir = join(srcDir, "Models");
rmSync(modelsDir, { recursive: true, force: true });
mkdirSync(modelsDir, { recursive: true });

writeFileSync(
  join(modelsDir, "Placeholder.php"),
  `<?php
namespace Lomi\Models;

/** Reserved — define DTOs locally or from OpenAPI schemas. */
final class Placeholder {}
`,
);

const { spec, allowed } = readSpecAndAllowlist();
const { byService } = getNormalizedOperations(spec, allowed);

function svcPhpClass(serviceClassName) {
  return serviceClassName;
}

function svcPhpFile(serviceClassName) {
  return `${serviceClassName}.php`;
}

/** @param {string} s */
function phpEscape(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

/**
 * @param {any} nop
 */
function phpMethod(nop) {
  const name = nop.sdkMethodName;
  const tmpl = nop.pathTemplate;
  const ids = nop.pathParamNames;
  const hasQ = nop.httpMethodLower === "get" && nop.queryParams.length > 0;
  const hasB = nop.wantsBody;

  const paramsPhp = [];
  for (const id of ids) paramsPhp.push(`string $${id}`);
  if (hasQ) paramsPhp.push("?array $params = null");
  if (hasB) paramsPhp.push("?array $body = null");
  const sig = paramsPhp.length ? paramsPhp.join(", ") : "";

  let pathCode = `        $path = '${phpEscape(tmpl)}';\n`;
  for (const id of ids) {
    pathCode += `        $path = str_replace('{${id}}', $${id}, $path);\n`;
  }

  let req = `return $this->client->request('${nop.httpMethodLower.toUpperCase()}', $path`;
  const opts = [];
  if (hasQ) opts.push("'query' => \$params ?? []");
  if (hasB) opts.push("'json' => \$body");
  if (opts.length) req += `, [${opts.join(", ")}]`;
  req += ");";

  const doc = nop.summary
    ? phpEscape(nop.summary.replace(/\r?\n/g, " "))
    : name;

  return `
    /**
     * ${doc}
     */
    public function ${name}(${sig}): array
    {
${pathCode}
        ${req}
    }
`;
}

const sortedSvc = [...byService.keys()].sort((a, b) => a.localeCompare(b));

for (const serviceClassName of sortedSvc) {
  const ops = [...byService.get(serviceClassName)].sort((a, b) =>
    a.sdkMethodName.localeCompare(b.sdkMethodName),
  );
  const meth = ops.map((o) => phpMethod(o)).join("\n");
  const cls = svcPhpClass(serviceClassName);

  const file = `<?php

namespace Lomi\\Services;

use Lomi\\LomiClient;

/**
 * Public merchant API (${cls})
 */
class ${cls}
{
    private LomiClient $client;

    public function __construct(LomiClient $client)
    {
        $this->client = $client;
    }
${meth}
}
`;

  writeFileSync(join(servicesDir, svcPhpFile(serviceClassName)), file);
}

let useLines = "";
let propLines = "";
let ctorLines = "";

for (const svcClass of sortedSvc) {
  const cpp = svcPhpClass(svcClass);
  useLines += `use Lomi\\Services\\${cpp};\n`;
  const camelProp = sdkPropertyName(svcClass);
  propLines += `    public ${cpp} $${camelProp};\n`;
  ctorLines += `        $this->${camelProp} = new ${cpp}($this);\n`;
}

const lomiClientPhp = `<?php
/**
 * lomi. PHP SDK — public merchant allowlist
 */
namespace Lomi;

use GuzzleHttp\\Client;
use GuzzleHttp\\Exception\\RequestException;
${useLines}
class LomiClient
{
    private string $apiKey;
    private string $baseUrl;
    private Client $httpClient;

${propLines}
    public function __construct(string $apiKey, array $options = [])
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = $options['base_url'] ?? 'https://api.lomi.africa';

        if (($options['environment'] ?? 'live') === 'test') {
            $this->baseUrl = 'https://sandbox.api.lomi.africa';
        }

        $this->httpClient = new Client([
            'base_uri' => $this->baseUrl,
            'headers' => [
                'X-API-KEY' => $this->apiKey,
                'Content-Type' => 'application/json',
            ],
        ]);

${ctorLines}
    }

    public function request(string $method, string $path, array $options = []): array
    {
        try {
            $response = $this->httpClient->request($method, $path, $options);
            $body = $response->getBody()->getContents();
            return json_decode($body, true) ?? [];
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
                throw new LomiException(
                    $e->getMessage(),
                    $response->getStatusCode(),
                    json_decode($response->getBody()->getContents(), true)
                );
            }
            throw new LomiException($e->getMessage());
        }
    }
}

class LomiException extends \\Exception
{
    public ?array $body;

    public function __construct(string $message, int $code = 0, ?array $body = null)
    {
        parent::__construct($message, $code);
        $this->body = $body;
    }
}
`;

writeFileSync(join(srcDir, "LomiClient.php"), lomiClientPhp);

const manifestSdk = {};
for (const svc of sortedSvc) {
  manifestSdk[sdkPropertyName(svc)] = expandSdkManifestMethods(
    svc,
    [...byService.get(svc)].map((o) => o.sdkMethodName),
  );
}

writeFileSync(
  join(srcDir, "sdk_php_methods.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      language: "php",
      sdk: manifestSdk,
    },
    null,
    2,
  )}\n`,
);

writeFileSync(
  join(testsDir, "SurfaceTest.php"),
  `<?php

namespace Lomi\\Tests;

use Lomi\\LomiClient;
use PHPUnit\\Framework\\TestCase;

class SurfaceTest extends TestCase
{
    public function testClientConstructs(): void
    {
        $c = new LomiClient('test');
        $this->assertInstanceOf(LomiClient::class, $c);
        $this->assertTrue(property_exists($c, 'charges'));
        $this->assertTrue(property_exists($c, 'payouts'));
    }
}
`,
);

console.log(
  `✅ PHP SDK generated — ${allowed.length} operations, ${byService.size} services.`,
);
