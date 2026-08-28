#!/usr/bin/env node
import fs from "fs";
import path from "path";

function readArg(name, fallback) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  if (match) return match.slice(prefix.length);
  const index = process.argv.indexOf(name);
  if (index !== -1 && process.argv[index + 1] && !String(process.argv[index + 1]).startsWith("-")) {
    return process.argv[index + 1];
  }
  return fallback;
}

function collectRepeatable(name) {
  const values = [];
  for (let i = 0; i < process.argv.length; i += 1) {
    const arg = process.argv[i];
    if (arg === name && process.argv[i + 1] && !String(process.argv[i + 1]).startsWith("-")) {
      values.push(process.argv[i + 1]);
    } else if (arg.startsWith(`${name}=`)) {
      values.push(arg.slice(`${name}=`.length));
    }
  }
  return values;
}

function walkSourceFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name === ".next" ||
      entry.name === "build"
    ) {
      continue;
    }
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSourceFiles(abs, files);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(abs);
    }
  }
  return files;
}

const COMMAND = process.argv[2] && !process.argv[2].startsWith("-") ? process.argv[2] : "clean";
const SRC_DIR = path.resolve(process.cwd(), readArg("--src-dir", "src"));
const LOCALES_DIR = path.resolve(
  process.cwd(),
  readArg("--locales-dir", "src/lib/locales"),
);
const LOCALES = ["en", "fr", "es", "zh"];
const PROTECTED_PREFIXES = collectRepeatable("--protect");

// Extract translation keys and patterns from code
function extractTranslationKeys(content) {
  const keys = new Set();
  const keyPrefixes = new Set(); // Track key prefixes that are dynamically used

  // Match patterns: t("key"), t('key'), t(`key`)
  const tPatterns = [/t\(["']([^"']+)["']\)/g, /t\(`([^`]+)`\)/g];

  tPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      keys.add(match[1]);
    }
  });

  // Match template literals with variables: t(`prefix.${variable}`)
  // Allow comma/newline between closing quote and ) so formatted calls are detected
  const templatePatterns = [
    /t\(\s*`([^`]+)\$\{[^}]+\}([^`]*)`\s*[,)]/g,
    /t\(\s*"([^"]+)\$\{[^}]+\}([^"]*)"\s*[,)]/g,
    /t\(\s*'([^']+)\$\{[^}]+\}([^']*)'\s*[,)]/g,
  ];

  templatePatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const prefix = match[1] || "";

      // Extract the base pattern (e.g., "portal.top_nav." from "portal.top_nav.${title}")
      if (prefix) {
        // Remove the variable part and add the prefix
        const basePrefix = prefix.replace(/\$\{[^}]+\}$/, "");
        if (basePrefix && basePrefix.includes(".")) {
          keyPrefixes.add(basePrefix);
        }
      }
    }
  });

  // Also match string literals that look like translation keys
  // Pattern: "word.word" or 'word.word' or `word.word`
  // But exclude common patterns like URLs, file paths, etc.
  const keyPatterns = [
    /"([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)"/g,
    /'([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)'/g,
    /`([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)+)`/g,
  ];

  keyPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const potentialKey = match[1];

      // Skip if it looks like a file path, URL, or other non-translation patterns
      if (
        potentialKey.includes("/") || // file paths
        potentialKey.includes("http") || // URLs
        potentialKey.includes("@") || // emails
        potentialKey.includes("class") || // CSS classes
        potentialKey.includes("function") || // function names
        potentialKey.includes("import") || // import statements
        potentialKey.includes("export") || // export statements
        potentialKey.includes("const") || // variable declarations
        potentialKey.includes("let") || // variable declarations
        potentialKey.includes("var") || // variable declarations
        potentialKey.match(/^[A-Z]/) || // starts with capital (likely not a translation key)
        potentialKey.length > 100 // too long to be a translation key
      ) {
        continue;
      }

      keys.add(potentialKey);
    }
  });

  return { keys, keyPrefixes };
}

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
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

// Remove unused keys from object recursively
function removeUnusedKeys(obj, unusedKeys, prefix = "") {
  const keysToRemove = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value) || Array.isArray(value)) {
      removeUnusedKeys(value, unusedKeys, fullKey);
      // Remove empty objects
      if (Object.keys(value).length === 0) {
        keysToRemove.push(key);
      }
    } else if (unusedKeys.has(fullKey)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => delete obj[key]);
}

async function analyzeTranslations() {
  const files = walkSourceFiles(SRC_DIR).map((file) => path.relative(SRC_DIR, file));

  console.log(`📁 Found ${files.length} source files`);

  // 2. Extract used translation keys and dynamic prefixes (only need to do this once)
  const usedKeys = new Set();
  const dynamicPrefixes = new Set();

  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const { keys, keyPrefixes } = extractTranslationKeys(content);
      keys.forEach((key) => usedKeys.add(key));
      keyPrefixes.forEach((prefix) => dynamicPrefixes.add(prefix));
    } catch (error) {
      console.warn(`⚠️  Could not read ${file}: ${error.message}`);
    }
  }

  // Always protect configured prefixes (e.g. dynamic option keys)
  PROTECTED_PREFIXES.forEach((prefix) => dynamicPrefixes.add(prefix));

  console.log(`🔑 Found ${usedKeys.size} used translation keys`);
  console.log(`🔄 Found ${dynamicPrefixes.size} dynamic key prefixes\n`);

  // Process each locale
  for (const locale of LOCALES) {
    const localeFile = path.join(LOCALES_DIR, `${locale}.json`);

    console.log(`🔍 Analyzing ${locale.toUpperCase()} translation keys...`);

    // Check if locale file exists
    if (!fs.existsSync(localeFile)) {
      console.log(`⚠️  Locale file ${locale}.json not found, skipping...\n`);
      continue;
    }

    // 3. Load translations
    const translations = JSON.parse(fs.readFileSync(localeFile, "utf-8"));
    const allDefinedKeys = getAllKeys(translations);

    console.log(`📝 Found ${allDefinedKeys.size} defined translation keys`);

    // 4. Find unused keys (be conservative with dynamic prefixes)
    const unusedKeys = new Set();
    allDefinedKeys.forEach((key) => {
      // Don't remove keys if their prefix is used dynamically
      const hasDynamicPrefix = Array.from(dynamicPrefixes).some((prefix) =>
        key.startsWith(prefix),
      );

      if (!usedKeys.has(key) && !hasDynamicPrefix) {
        unusedKeys.add(key);
      }
    });

    console.log(`🗑️  Found ${unusedKeys.size} unused translation keys`);
    console.log(
      `🛡️  Protected ${allDefinedKeys.size - unusedKeys.size} keys (including dynamic prefixes)`,
    );

    if (unusedKeys.size === 0) {
      console.log(`✅ No unused keys found for ${locale.toUpperCase()}\n`);
      continue;
    }

    // 5. Create backup
    const backupFile = `${localeFile}.backup.${Date.now()}`;
    fs.writeFileSync(backupFile, JSON.stringify(translations, null, 2));
    console.log(
      `💾 Backup created: ${path.relative(process.cwd(), backupFile)}`,
    );

    // 6. Create cleaned version (without unused keys, sorted)
    const cleanedTranslations = JSON.parse(JSON.stringify(translations));

    removeUnusedKeys(cleanedTranslations, unusedKeys);
    const finalCleaned = sortObjectKeys(cleanedTranslations);

    const tmp = `${localeFile}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(finalCleaned, null, 2));
    fs.renameSync(tmp, localeFile);
    console.log(
      `✅ Updated ${locale.toUpperCase()} file: ${path.relative(process.cwd(), localeFile)}`,
    );

    console.log(`📈 Summary for ${locale.toUpperCase()}:`);
    console.log(`  - Used keys: ${usedKeys.size}`);
    console.log(`  - Defined keys: ${allDefinedKeys.size}`);
    console.log(`  - Unused keys: ${unusedKeys.size}`);
    console.log(`  - Protected: ${allDefinedKeys.size - unusedKeys.size}`);
    console.log(
      `  - Savings: ${((unusedKeys.size / allDefinedKeys.size) * 100).toFixed(1)}%\n`,
    );
  }

  console.log(
    "🎉 All locales processed! Original files have been cleaned and sorted.",
  );
  console.log("\n🔒 Dynamic prefixes protected:");
  Array.from(dynamicPrefixes)
    .sort()
    .forEach((prefix) => {
      console.log(`  - ${prefix}*`);
    });
}

// Function to check translation completeness across locales
async function checkTranslationCompleteness() {
  console.log("🔍 Checking translation completeness across locales...\n");

  const locales = ["en", "fr", "es", "zh"];
  const localeData = {};

  // Load all locale files
  for (const locale of locales) {
    const localeFile = path.join(LOCALES_DIR, `${locale}.json`);

    if (!fs.existsSync(localeFile)) {
      console.log(`⚠️  Locale file ${locale}.json not found, skipping...`);
      continue;
    }

    try {
      const translations = JSON.parse(fs.readFileSync(localeFile, "utf-8"));
      const allKeys = getAllKeys(translations);
      localeData[locale] = {
        translations,
        keys: allKeys,
        count: allKeys.size,
      };
      console.log(`📁 Loaded ${locale.toUpperCase()}: ${allKeys.size} keys`);
    } catch (error) {
      console.error(`❌ Error loading ${locale}.json: ${error.message}`);
    }
  }

  if (!localeData.en) {
    console.error("❌ English locale (en.json) is required as reference!");
    return;
  }

  console.log("\n📊 Translation Completeness Report:");
  console.log("=".repeat(60));

  const referenceKeys = localeData.en.keys;
  const referenceCount = referenceKeys.size;

  console.log(`📝 Reference (EN): ${referenceCount} keys\n`);

  let totalMissing = 0;

  for (const locale of ["fr", "es", "zh"]) {
    if (!localeData[locale]) continue;

    const localeKeys = localeData[locale].keys;
    const localeCount = localeKeys.size;

    // Find missing keys
    const missingKeys = new Set();
    referenceKeys.forEach((key) => {
      if (!localeKeys.has(key)) {
        missingKeys.add(key);
      }
    });

    const missingCount = missingKeys.size;
    totalMissing += missingCount;

    const completeness = ((localeCount / referenceCount) * 100).toFixed(1);

    console.log(`🌐 ${locale.toUpperCase()} Locale:`);
    console.log(`   - Total keys: ${localeCount}`);
    console.log(`   - Missing keys: ${missingCount}`);
    console.log(`   - Completeness: ${completeness}%`);

    if (missingCount > 0) {
      console.log(`   - Missing keys (${missingCount}):`);
      Array.from(missingKeys)
        .sort()
        .slice(0, 20)
        .forEach((key) => {
          console.log(`     • ${key}`);
        });

      if (missingCount > 20) {
        console.log(`     ... and ${missingCount - 20} more`);
      }

      // Save missing keys to file
      const missingFile = path.join(LOCALES_DIR, `missing-keys-${locale}.txt`);
      const missingContent =
        `Missing translation keys in ${locale.toUpperCase()} (${missingCount} keys):\n\n` +
        Array.from(missingKeys)
          .sort()
          .map((key) => key)
          .join("\n");

      fs.writeFileSync(missingFile, missingContent);
      console.log(
        `   - Missing keys saved to: ${path.relative(process.cwd(), missingFile)}`,
      );
    }
    console.log("");
  }

  console.log("📈 Summary:");
  console.log(`   - Reference locale: EN (${referenceCount} keys)`);
  console.log(`   - Total missing keys across all locales: ${totalMissing}`);

  if (totalMissing === 0) {
    console.log("🎉 All locales are complete!");
  } else {
    console.log("💡 Run the script again after adding missing translations.");
  }
}

// Main execution
if (COMMAND === "check") {
  console.log("🔍 Running Translation Completeness Check\n");
  checkTranslationCompleteness().catch(console.error);
} else if (COMMAND === "clean") {
  console.log("🧹 Running Translation Key Cleanup\n");
  analyzeTranslations().catch(console.error);
} else {
  console.log("❌ Invalid command. Use:");
  console.log(
    "   node analyze-i18n.js clean [locales...]  - Clean unused keys",
  );
  console.log(
    "   node analyze-i18n.js check               - Check completeness vs EN",
  );
  process.exit(1);
}

// Export functions for separate use
export { checkTranslationCompleteness, analyzeTranslations };
