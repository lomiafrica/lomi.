import { loadLomiCheckout } from "/vendor/lomi-embed.js";

const output = document.getElementById("output");
const eventsOutput = document.getElementById("events-output");
const checkoutEmbed = document.getElementById("checkout-embed");
const publicKeyInput = document.getElementById("public-key");

function isTranslationLeaf(value) {
  return Object(value) !== value;
}
function isStringValue(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

let lastCheckoutUrl = null;
let lastEmbeddedCheckoutUrl = null;
let lastCheckoutSessionId = null;
let embeddedHandle = null;

function printJson(element, value) {
  element.textContent = JSON.stringify(value, null, 2);
}

function withEmbeddedParam(url) {
  if (!url || !isStringValue(url)) return null;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("embedded", "true");
    return parsed.toString();
  } catch {
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}embedded=true`;
  }
}

function checkoutUrlFromSession(payload) {
  if (!payload || isTranslationLeaf(payload)) return null;
  if (payload.checkout_url) return payload.checkout_url;
  const id = payload.checkout_session?.checkout_session_id;
  return id ? `https://checkout.lomi.africa/checkout/${id}` : null;
}

function ensureLastSession() {
  if (!lastCheckoutSessionId || !lastCheckoutUrl) {
    alert("No checkout session yet. Create one first.");
    return false;
  }
  return true;
}

async function submitCheckout(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  printJson(output, data);

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  const checkoutUrl = checkoutUrlFromSession(data);
  if (checkoutUrl) {
    lastCheckoutUrl = checkoutUrl;
    lastEmbeddedCheckoutUrl = data.embedded_checkout_url || withEmbeddedParam(checkoutUrl);
    lastCheckoutSessionId = data.checkout_session?.checkout_session_id || null;
  }
}

function embedLastCheckoutUrl() {
  if (!lastEmbeddedCheckoutUrl) {
    alert("No checkout URL available yet. Create a session first.");
    return;
  }
  checkoutEmbed.src = lastEmbeddedCheckoutUrl;
}

function openEmbedModal() {
  if (!ensureLastSession()) return;
  const publicKey = publicKeyInput.value.trim();
  if (!publicKey) {
    alert("Set a lomi public key first (lomi_pk_...).");
    return;
  }

  if (embeddedHandle?.unmount) {
    embeddedHandle.unmount();
  }

  embeddedHandle = loadLomiCheckout({
    publicKey,
    sessionId: lastCheckoutSessionId,
    checkoutUrl: lastCheckoutUrl,
    mode: "modal",
  });
}

document.getElementById("dynamic-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {
    amount: Number(form.get("amount")),
    currency_code: String(form.get("currency_code") || "XOF"),
    customer_email: String(form.get("customer_email") || ""),
    title: "Dynamic amount payment",
    description: "Created from SDK reference UI",
  };

  try {
    await submitCheckout("/api/checkout/dynamic", payload);
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("price-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {
    price_id: String(form.get("price_id") || ""),
    quantity: Number(form.get("quantity") || 1),
    customer_email: String(form.get("customer_email") || ""),
    title: "Price checkout payment",
    description: "Created from SDK reference UI",
  };

  try {
    await submitCheckout("/api/checkout/price", payload);
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("open-last-session").addEventListener("click", () => {
  if (!ensureLastSession()) return;
  window.open(lastCheckoutUrl, "_blank", "noopener,noreferrer");
});

document.getElementById("embed-last-session").addEventListener("click", embedLastCheckoutUrl);
document.getElementById("embed-sdk-modal").addEventListener("click", openEmbedModal);
document.getElementById("clear-embed").addEventListener("click", () => {
  checkoutEmbed.removeAttribute("src");
  if (embeddedHandle?.unmount) {
    embeddedHandle.unmount();
    embeddedHandle = null;
  }
});

document.getElementById("refresh-events").addEventListener("click", async () => {
  const response = await fetch("/api/webhooks/events");
  const data = await response.json();
  printJson(eventsOutput, data);
});

fetch("/api/config")
  .then((res) => res.json())
  .then((config) => {
    if (config.lomi_public_key) {
      publicKeyInput.value = config.lomi_public_key;
    }
  })
  .catch(() => {
    // Keep empty when config endpoint is unavailable.
  });
