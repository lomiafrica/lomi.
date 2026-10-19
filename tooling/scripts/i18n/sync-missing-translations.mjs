#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_LOCALES = ["fr", "es", "zh"];

function readArg(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  if (match) return match.slice(prefix.length);
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

/** Target locales. Defaults stay fr, es, zh so existing apps are unchanged. */
const LOCALES = readArg("--locales", DEFAULT_LOCALES.join(","))
  .split(",")
  .map((locale) => locale.trim())
  .filter(Boolean);
/** Record missing keys in sync-diff.json without copying English into the locale file. */
const NO_FILL = process.argv.includes("--no-fill");

const LOCALES_DIR = path.resolve(
  process.cwd(),
  readArg("--locales-dir", "src/lib/locales"),
);
const DIFF_PATH = path.join(LOCALES_DIR, "sync-diff.json");

/**
 * Sync missing translation keys from English to all locales (fr, es, zh)
 * Compares each locale with English and adds any missing keys
 * using the corresponding values from en.json
 *
 * Also writes locales/sync-diff.json — a flat key → English value map per locale
 * for every key added (merged across runs) so you can translate them later.
 *
 * Usage:
 *   node sync-missing-translations.js           # add missing keys only
 *   node sync-missing-translations.js --sort    # also sort keys alphabetically
 *   node sync-missing-translations.js --locales fr,es,zh
 *   node sync-missing-translations.js --no-fill # record missing keys, do not copy English
 */

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function isTranslationLeaf(value) {
  const tag = Object.prototype.toString.call(value);
  return (
    tag === "[object String]" ||
    tag === "[object Number]" ||
    tag === "[object Boolean]"
  );
}

function getNestedValue(obj, keys) {
  return keys.reduce((current, key) => current?.[key], obj);
}

/** Resolve nested paths and flat dotted keys (e.g. logs.events.update_webhook.update). */
function getTranslationValue(obj, key) {
  const keyParts = key.split(".");
  const nested = getNestedValue(obj, keyParts);
  if (nested !== undefined && isTranslationLeaf(nested)) {
    return nested;
  }

  for (let i = keyParts.length - 1; i >= 0; i--) {
    const prefix = keyParts.slice(0, i);
    const flatKey = keyParts.slice(i).join(".");
    const parent = prefix.length ? getNestedValue(obj, prefix) : obj;
    if (isPlainObject(parent) && flatKey in parent) {
      const value = parent[flatKey];
      if (isTranslationLeaf(value)) {
        return value;
      }
    }
  }

  return undefined;
}

function setNestedValue(obj, keys, value) {
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Recursively get all translation keys from nested object
function getAllKeys(obj, prefix = "") {
  const keys = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value) || Array.isArray(value)) {
      const nestedKeys = getAllKeys(value, fullKey);
      nestedKeys.forEach((k) => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

function findMissingKeys(enTranslations, localeTranslations) {
  const enKeys = getAllKeys(enTranslations);
  const localeKeys = getAllKeys(localeTranslations);

  const missingKeys = [];
  enKeys.forEach((key) => {
    if (!localeKeys.has(key)) {
      missingKeys.push(key);
    }
  });

  return missingKeys;
}

// Sort object keys alphabetically (recursive)
function sortObjectKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (!isPlainObject(obj)) {
    return obj;
  }

  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObjectKeys(obj[key]);
    });

  return sorted;
}

function readSyncDiff() {
  if (!fs.existsSync(DIFF_PATH)) {
    return { added: Object.fromEntries(LOCALES.map((l) => [l, {}])) };
  }

  const diff = JSON.parse(fs.readFileSync(DIFF_PATH, "utf8"));
  diff.added ??= {};

  for (const locale of LOCALES) {
    diff.added[locale] ??= {};
  }

  return diff;
}

function pruneSyncDiff(diff, enTranslations, localeTranslationsByLocale) {
  let pruned = 0;

  for (const locale of LOCALES) {
    const localeTranslations = localeTranslationsByLocale[locale];

    for (const key of Object.keys(diff.added[locale])) {
      const englishValue = getTranslationValue(enTranslations, key);
      const localeValue = getTranslationValue(localeTranslations, key);

      if (
        localeValue !== undefined &&
        englishValue !== undefined &&
        localeValue !== englishValue
      ) {
        delete diff.added[locale][key];
        pruned++;
      }
    }
  }

  return pruned;
}

function writeSyncDiff(
  diff,
  addedThisRun,
  enTranslations,
  localeTranslationsByLocale,
) {
  for (const locale of LOCALES) {
    Object.assign(diff.added[locale], addedThisRun[locale]);
  }

  const pruned = pruneSyncDiff(
    diff,
    enTranslations,
    localeTranslationsByLocale,
  );
  const hasAdds = LOCALES.some(
    (locale) => Object.keys(addedThisRun[locale]).length > 0,
  );

  if (!hasAdds && pruned === 0) {
    return { pruned: 0, pending: 0 };
  }

  diff.lastSyncAt = new Date().toISOString();

  fs.writeFileSync(DIFF_PATH, JSON.stringify(diff, null, 2) + "\n", "utf8");

  const pending = LOCALES.reduce(
    (sum, locale) => sum + Object.keys(diff.added[locale]).length,
    0,
  );

  return { pruned, pending };
}

function syncTranslations({ sort = false } = {}) {
  try {
    // Read the English translations
    const enPath = path.join(LOCALES_DIR, "en.json");
    const enTranslations = JSON.parse(fs.readFileSync(enPath, "utf8"));

    const diff = readSyncDiff();
    const addedThisRun = Object.fromEntries(LOCALES.map((l) => [l, {}]));
    const localeTranslationsByLocale = {};
    let totalAddedCount = 0;

    for (const locale of LOCALES) {
      console.log(`\n🔄 Processing ${locale.toUpperCase()} locale...`);

      // Read the target locale file. A missing file counts as empty.
      const localePath = path.join(LOCALES_DIR, `${locale}.json`);
      const localeTranslations = fs.existsSync(localePath)
        ? JSON.parse(fs.readFileSync(localePath, "utf8"))
        : {};
      localeTranslationsByLocale[locale] = localeTranslations;

      // Find missing keys by comparing with English
      const missingKeys = findMissingKeys(enTranslations, localeTranslations);

      if (missingKeys.length === 0) {
        console.log(`No missing keys for ${locale.toUpperCase()}`);
        continue;
      }

      console.log(
        `Found ${missingKeys.length} missing keys for ${locale.toUpperCase()}`,
      );

      let addedCount = 0;

      // Process each missing key
      for (const key of missingKeys) {
        const keyParts = key.split(".");

        // Get the English value
        const englishValue = getNestedValue(enTranslations, keyParts);

        if (englishValue === undefined) {
          console.warn(`Warning: Key "${key}" not found in en.json`);
          continue;
        }

        if (!NO_FILL) {
          setNestedValue(localeTranslations, keyParts, englishValue);
        }
        addedThisRun[locale][key] = englishValue;
        addedCount++;

        console.log(
          NO_FILL
            ? `• Missing in ${locale.toUpperCase()}: ${key}`
            : `✓ Added to ${locale.toUpperCase()}: ${key}`,
        );
      }

      if (!NO_FILL) {
        const output = sort
          ? sortObjectKeys(localeTranslations)
          : localeTranslations;

        fs.writeFileSync(
          localePath,
          JSON.stringify(output, null, 2) + "\n",
          "utf8",
        );
        console.log(`Updated file: ${localePath}`);
      }

      console.log(
        NO_FILL
          ? `📋 Recorded ${addedCount} missing keys for ${locale.toUpperCase()} without copying English`
          : `✅ Successfully synced ${addedCount} translation keys from English to ${locale.toUpperCase()}`,
      );

      totalAddedCount += addedCount;
    }

    const { pruned, pending } = writeSyncDiff(
      diff,
      addedThisRun,
      enTranslations,
      localeTranslationsByLocale,
    );

    console.log(
      `\n🎉 Total: Synced ${totalAddedCount} translation keys across all locales`,
    );

    if (totalAddedCount > 0) {
      console.log(`Diff file: ${DIFF_PATH}`);
      for (const locale of LOCALES) {
        const count = Object.keys(addedThisRun[locale]).length;
        if (count > 0) {
          console.log(
            `  ${locale.toUpperCase()}: ${count} keys added this run`,
          );
        }
      }
    }

    if (pruned > 0) {
      console.log(`🧹 Pruned ${pruned} translated keys from sync-diff.json`);
    }

    if (pending === 0) {
      console.log(
        "✅ sync-diff.json is empty — all pending translations are done",
      );
    } else {
      console.log(
        `📋 ${pending} keys still need translation in sync-diff.json`,
      );
    }
  } catch (error) {
    console.error("❌ Error syncing translations:", error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  const sort = process.argv.includes("--sort");
  syncTranslations({ sort });
}

export { syncTranslations };
