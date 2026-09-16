const IV_LENGTH = 12;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Infer WebCrypto key type so Node-only tsc (MCP Docker) does not need DOM libs. */
async function aesKey(secret: string) {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(secret),
  );
  return globalThis.crypto.subtle.importKey(
    "raw",
    digest,
    "AES-GCM",
    false,
    ["encrypt", "decrypt"],
  );
}

/** Encrypt a merchant FNE Bearer. Nest stores ciphertext; Postgres never sees the key. */
export async function sealFneOrgApiKey(
  plaintext: string,
  secret: string,
): Promise<string> {
  const key = await aesKey(secret);
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cipher = await globalThis.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  const packed = new Uint8Array(iv.length + cipher.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(cipher), iv.length);
  return bytesToBase64Url(packed);
}

/** Decrypt a merchant FNE Bearer. Returns null if the ciphertext is invalid. */
export async function openFneOrgApiKey(
  ciphertext: string,
  secret: string,
): Promise<string | null> {
  try {
    const packed = base64UrlToBytes(ciphertext);
    if (packed.length <= IV_LENGTH + 16) return null;
    const key = await aesKey(secret);
    const iv = new Uint8Array(packed.subarray(0, IV_LENGTH));
    const data = new Uint8Array(packed.subarray(IV_LENGTH));
    const plain = await globalThis.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );
    const value = new TextDecoder().decode(plain).trim();
    return value === "" ? null : value;
  } catch {
    return null;
  }
}
