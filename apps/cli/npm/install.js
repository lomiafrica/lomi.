#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const VERSION = require("./package.json").version;
const REPO = "lomiafrica/lomi.";
const ROOT = path.join(__dirname);
const BINARY_NAME = process.platform === "win32" ? "lomi.exe" : "lomi";
const BINARY_PATH = path.join(ROOT, BINARY_NAME);
const VERSION_FILE = path.join(ROOT, ".lomi-version");

function platformPackage() {
  const platform = process.platform;
  const arch = process.arch;

  if (platform === "darwin" && arch === "arm64")
    return "lomi-aarch64-apple-darwin";
  if (platform === "darwin" && arch === "x64")
    return "lomi-x86_64-apple-darwin";
  if (platform === "linux" && arch === "x64")
    return "lomi-x86_64-unknown-linux-gnu";
  if (platform === "win32" && arch === "x64")
    return "lomi-x86_64-pc-windows-msvc.exe";

  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

function readInstalledVersion() {
  if (!fs.existsSync(VERSION_FILE)) return null;
  return fs.readFileSync(VERSION_FILE, "utf8").trim();
}

function needsInstall() {
  if (!fs.existsSync(BINARY_PATH)) return true;
  return readInstalledVersion() !== VERSION;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          file.close();
          fs.unlinkSync(dest);
          return download(response.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Download failed: HTTP ${response.statusCode} for ${url}`,
            ),
          );
          return;
        }
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

async function install() {
  if (!needsInstall()) {
    return;
  }

  if (fs.existsSync(BINARY_PATH)) {
    fs.unlinkSync(BINARY_PATH);
  }

  const asset = platformPackage();
  const tag = `cli-v${VERSION}`;
  const url = `https://github.com/${REPO}/releases/download/${tag}/${asset}`;

  console.log(`Installing lomi. CLI ${VERSION} (${asset})...`);

  const tmp = `${BINARY_PATH}.download`;
  try {
    await download(url, tmp);
    fs.renameSync(tmp, BINARY_PATH);
    if (process.platform !== "win32") {
      fs.chmodSync(BINARY_PATH, 0o755);
    }
    fs.writeFileSync(VERSION_FILE, VERSION);
    console.log("lomi. CLI installed successfully.");
  } catch (error) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.error(
      `Failed to download lomi. CLI binary from GitHub Releases.\n` +
        `Tag: ${tag}, Asset: ${asset}\n` +
        `Install from source: cd apps/cli && cargo install --path .\n` +
        `Error: ${error.message}`,
    );
    process.exit(1);
  }
}

install().catch((error) => {
  console.error(error);
  process.exit(1);
});
