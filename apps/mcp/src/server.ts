import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import manifestJson from "./generated/tools-manifest.json" with { type: "json" };
import { parseManifest } from "./manifest-parse.js";
import { validateJsonValue } from "@lomi./shared";
import {
  getOptionalMerchantApiKey,
  getOptionalProvisioningKey,
} from "./env-config.js";
import { wireMcpServer } from "./wire-mcp-server.js";

export async function startStdioServer(): Promise<void> {
  const manifest = parseManifest(validateJsonValue(manifestJson));

  // A key minted during provisioning in this process takes precedence over the
  // env fallback, so a single stdio session can go 0->1 then drive the REST API.
  let promotedMerchantKey: string | null = null;
  let promotedProvisioningKey: string | null = null;

  const server = wireMcpServer({
    manifest,
    mode: "stdio",
    getApiKey: () => promotedMerchantKey ?? getOptionalMerchantApiKey(),
    getProvisioningKey: () =>
      promotedProvisioningKey ?? getOptionalProvisioningKey(),
    onMerchantKeyDiscovered: (secretKey) => {
      promotedMerchantKey = secretKey;
    },
    onProvisioningKeyDiscovered: (key) => {
      promotedProvisioningKey = key;
    },
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
