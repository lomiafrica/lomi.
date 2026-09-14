# SDK CI/CD Workflows

This document explains how to use the automated workflows for SDK regeneration and publishing.

## 🔄 SDK Regeneration Workflow

**File:** `.github/workflows/sdk-regeneration.yml`

This workflow automatically regenerates all SDKs when `spec.yaml` changes.

### Manual Trigger

You can manually trigger SDK regeneration anytime:

1. Go to **Actions** tab in GitHub
2. Select **SDK Regeneration** workflow
3. Click **Run workflow**
4. Choose which SDKs to regenerate (all/ts/js/python/go/php)
5. Click **Run workflow** button

### Automatic Trigger (Toggle)

The workflow can automatically run when `spec.yaml` is updated:

**Currently:** `DISABLED` (default for safety while API is evolving)

**To enable automatic regeneration:**

1. Edit `.github/workflows/sdk-regeneration.yml`
2. Change line 29: `AUTO_REGENERATE_ENABLED: 'false'` → `AUTO_REGENERATE_ENABLED: 'true'`
3. Commit and push

Now every push to `spec.yaml` on `main` branch will automatically regenerate SDKs and create a PR.

**To disable:**  
Change back to `'false'`

## 📦 SDK Publishing Workflow

npm kits publish from **`app-publish-npm.yml`** with Trusted Publisher (OIDC). No `NPM_TOKEN`.

1. Bump only the patch in that package's `package.json` (`1.6.0` → `1.6.1`).
2. Push `main`, or run **lomi · publish · npm**.
3. CI publishes if that version is not on npm yet. Same version is a no-op.

CLI (`lomi.cli`) publishes from **`app-release-cli.yml`**: bump `apps/cli/Cargo.toml` and `apps/cli/npm/package.json` to the same patch, push `main`. CI builds binaries, cuts `cli-v*`, then publishes.

Python still uses **`app-release-sdks.yml`** and `PYPI_TOKEN`.

## 📋 Current Published Packages

### TypeScript SDK

- **Package:** `@lomi./sdk`
- **Install:** `npm i @lomi./sdk`
- **Registry:** https://www.npmjs.com/package/@lomi./sdk

### JavaScript SDK

- **Package:** `@lomi./sdk-js`
- **Version:** `1.0.0` ✅
- **Install:** `npm i @lomi./sdk-js`
- **Registry:** https://www.npmjs.com/package/@lomi./sdk-js

### Python SDK

- **Package:** `lomi-sdk`
- **Version:** `1.5.11` (publish via workflow when ready)
- **Install:** `pip install lomi-sdk`
- **Registry:** https://pypi.org/project/lomi-sdk/

### Embed SDK

- **Package:** `@lomi./embed`
- **Version:** `0.2.0`
- **Install:** `npm i @lomi./embed`
- **Registry:** https://www.npmjs.com/package/@lomi./embed
- **Publish:** bump the patch in `apps/sdks/embed/package.json` and push `main` (`app-publish-npm.yml`).

## 🚀 Quick Commands

### Publish Locally (Manual)

**TypeScript:**

```bash
cd apps/sdks/ts
npm run build
npm publish --access public
```

**JavaScript:**

```bash
cd apps/sdks/js
npm run build
npm publish --access public
```

**Python:**

```bash
cd apps/sdks/python
python -m build
twine upload dist/*
```

### Regenerate SDKs Locally

```bash
cd apps/sdks
pnpm run generate:ts
pnpm run generate:python
# or all at once
pnpm run generate:all
```
