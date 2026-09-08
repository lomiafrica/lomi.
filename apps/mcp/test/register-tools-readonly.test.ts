import { describe, expect, it } from 'vitest';
import type { ToolsManifest } from '../src/manifest.js';

function groupedTool(
  name: string,
  readOnly: boolean,
): ToolsManifest['tools'][number] {
  return {
    name,
    title: name,
    description: name,
    tags: [],
    write: !readOnly,
    readOnly,
    destructive: false,
    searchHint: name,
    alwaysLoad: false,
    inputSchema: {
      type: 'object',
      required: ['action'],
      properties: { action: { type: 'string', enum: ['list'] } },
    },
    actions: {
      list: {
        operationKey: readOnly ? 'GET /items' : 'POST /items',
        method: readOnly ? 'get' : 'post',
        pathTemplate: '/items',
        pathParamNames: [],
        queryParamNames: [],
        operationId: name,
        write: !readOnly,
        wantsBody: !readOnly,
        title: name,
        description: name,
        tags: [],
        requiredInput: readOnly ? [] : ['body'],
      },
    },
  };
}

describe('registerMerchantTools read-only filter', () => {
  it('skips write tools when readOnlyOnly is true', async () => {
    const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
    const { registerMerchantTools } = await import('../src/register-tools.js');

    const manifest: ToolsManifest = {
      manifestVersion: 1,
      apiVersion: 'test',
      apiTitle: 'test',
      toolCount: 2,
      tools: [groupedTool('read_tool', true), groupedTool('write_tool', false)],
    };

    const server = new McpServer({ name: 'test', version: '0' });
    const registered: string[] = [];
    const original = server.registerTool.bind(server);
    // SAFETY: Test wrapper preserves registerTool's production signature while recording names.
    server.registerTool = ((
      name: string,
      ...rest: Parameters<typeof original> extends [string, ...infer R] ? R : never
    ) => {
      registered.push(name);
      return original(name, ...rest);
    }) as typeof server.registerTool;

    registerMerchantTools(server, manifest, {
      getApiKey: () => 'lomi_sk_test_example',
      readOnlyOnly: true,
    });

    expect(registered).toContain('read_tool');
    expect(registered).not.toContain('write_tool');
  });

  it('skips money tools when excludeMoney is true', async () => {
    const { McpServer } = await import('@modelcontextprotocol/sdk/server/mcp.js');
    const { registerMerchantTools } = await import('../src/register-tools.js');

    const manifest: ToolsManifest = {
      manifestVersion: 1,
      apiVersion: 'test',
      apiTitle: 'test',
      toolCount: 2,
      tools: [
        groupedTool('lomi_customers', true),
        groupedTool('lomi_payouts', false),
      ],
    };

    const server = new McpServer({ name: 'test', version: '0' });
    const registered: string[] = [];
    const original = server.registerTool.bind(server);
    // SAFETY: Test wrapper preserves registerTool's production signature while recording names.
    server.registerTool = ((
      name: string,
      ...rest: Parameters<typeof original> extends [string, ...infer R] ? R : never
    ) => {
      registered.push(name);
      return original(name, ...rest);
    }) as typeof server.registerTool;

    registerMerchantTools(server, manifest, {
      getApiKey: () => 'lomi_sk_test_example',
      excludeMoney: true,
      skipSearchTool: true,
    });

    expect(registered).toContain('lomi_customers');
    expect(registered).not.toContain('lomi_payouts');
  });
});
