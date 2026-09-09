#!/usr/bin/env node
/**
 * Post-generation script to automatically create SDK wrapper
 *
 * The wrapper exposes every generated service (ts/src/generated/services) plus
 * the hand-written resources in ts/src/resources (lomi. Network surface:
 * transfers, network). Hand-written files follow `<prop>.ts` exporting
 * `<Prop>Resource`.
 */

import { writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const servicesDir = join(__dirname, '../ts/src/generated/services');
const resourcesDir = join(__dirname, '../ts/src/resources');
const sdkPath = join(__dirname, '../ts/src/sdk.ts');

console.log('🔧 Generating SDK wrapper from services...');

if (!existsSync(servicesDir)) {
  console.error('❌ Services directory not found:', servicesDir);
  process.exit(1);
}

const serviceFiles = readdirSync(servicesDir).filter((f) => f.endsWith('.ts'));
const services = serviceFiles.map((f) => f.replace('.ts', ''));

function getPropertyName(serviceName) {
  const withoutService = serviceName.replace(/Service$/, '');
  return withoutService.charAt(0).toLowerCase() + withoutService.slice(1);
}

/** @type {{ prop: string; className: string; importPath: string }[]} */
const handwritten = existsSync(resourcesDir)
  ? readdirSync(resourcesDir)
      .filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'))
      .map((f) => {
        const stem = f.replace(/\.ts$/, '');
        const className = `${stem.charAt(0).toUpperCase()}${stem.slice(1)}Resource`;
        return { prop: stem, className, importPath: `./resources/${stem}.js` };
      })
      .sort((a, b) => a.prop.localeCompare(b.prop))
  : [];

const generatedProps = new Set(services.map(getPropertyName));
for (const resource of handwritten) {
  if (generatedProps.has(resource.prop)) {
    throw new Error(
      `Hand-written resource "${resource.prop}" collides with a generated service. Add it to HANDWRITTEN_SDK_PROPERTIES in public-sdk-operations.js or remove ts/src/resources/${resource.prop}.ts.`,
    );
  }
}

const sdkContent = `/**
 * Main lomi. SDK class
 * AUTO-GENERATED - Do not edit manually
 */

import type { LomiConfig } from './config.js';
import { LomiClient } from './client.js';
import {
${services.map((s) => `  ${s},`).join('\n')}
} from './generated/index.js';
${handwritten
  .map((r) => `import { ${r.className} } from '${r.importPath}';`)
  .join('\n')}

export class LomiSDK {
  private readonly client: LomiClient;

${services
  .map((s) => {
    const propName = getPropertyName(s);
    return `  public readonly ${propName}: ${s};`;
  })
  .join('\n')}
${handwritten
  .map((r) => `  /** lomi. Network (hand-written resource). */\n  public readonly ${r.prop}: ${r.className};`)
  .join('\n')}

  constructor(config: LomiConfig) {
    this.client = new LomiClient(config);

${services
  .map((s) => {
    const propName = getPropertyName(s);
    return `    this.${propName} = new ${s}(this.client);`;
  })
  .join('\n')}
${handwritten
  .map((r) => `    this.${r.prop} = new ${r.className}(this.client);`)
  .join('\n')}
  }

  /** Rotate the secret API key on this client instance. */
  setApiKey(apiKey: string): void {
    this.client.setApiKey(apiKey);
  }

  /** Current API base URL for this client instance. */
  getBaseUrl(): string {
    return this.client.baseUrl;
  }
}
`;

writeFileSync(sdkPath, sdkContent, 'utf-8');
console.log('✅ SDK wrapper generated successfully!');
console.log(
  `   Available services: ${[...services.map((s) => getPropertyName(s)), ...handwritten.map((r) => r.prop)].join(', ')}`,
);
