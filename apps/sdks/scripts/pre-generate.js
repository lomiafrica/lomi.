#!/usr/bin/env node
/**
 * Language generators still call this step.
 * Database types are not copied into the public SDK tree.
 * The only Database type is packages/shared/src/database.ts
 * (private lomiafrica/packages, generated from production).
 * Merchant SDK types come from apps/docs/openapi.json.
 */

console.log(
  "Database types stay in packages/shared/src/database.ts. Merchant SDKs use the public OpenAPI contract.",
);
