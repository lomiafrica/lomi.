import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { LomiSDK } from "@lomi./sdk";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;
const appBaseUrl = `http://localhost:${port}`;
const checkoutBaseUrl = "https://checkout.lomi.africa";
const lomiBaseUrl = process.env.LOMI_BASE_URL || "https://api.lomi.africa";
const lomiApiKey = process.env.LOMI_SECRET_KEY || "";
const lomiPublicKey = process.env.LOMI_PUBLIC_KEY || "";
const webhookSecret =
  process.env.LOMI_WEBHOOK_SECRET || process.env.LOMI_WEBHOOK_VERIFICATION_TOKEN || "";

const eventStore = [];
const MAX_EVENTS = 50;

function isStringValue(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}

const sdk = lomiApiKey
  ? new LomiSDK({
      apiKey: lomiApiKey,
      baseUrl: lomiBaseUrl,
    })
  : null;

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cors({ origin: appBaseUrl }));
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/vendor/lomi-embed.js", (_req, res) => {
  const embedDistPath = path.join(
    __dirname,
    "..",
    "node_modules",
    "@lomi.",
    "embed",
    "dist",
    "index.js",
  );
  res.sendFile(embedDistPath, (error) => {
    if (!error) return;
    res.status(404).json({
      error: "Embed SDK bundle not found. Run pnpm install in payment-integration-sdk-reference.",
    });
  });
});

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
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

function normalizeCheckoutUrl(data) {
  if (!data || isTranslationLeaf(data)) return null;
  const direct =
    data.url || data.checkout_url || data.checkout_page_url || data.redirect_url || null;
  if (direct) return direct;
  if (data.checkout_session_id) {
    return `${checkoutBaseUrl}/checkout/${data.checkout_session_id}`;
  }
  return null;
}

function buildCommonCheckoutFields(body) {
  const defaults = {
    success_url: `${appBaseUrl}/?status=success`,
    cancel_url: `${appBaseUrl}/?status=cancel`,
  };

  return {
    currency_code: body.currency_code || "XOF",
    customer_email: body.customer_email || undefined,
    customer_name: body.customer_name || undefined,
    customer_phone: body.customer_phone || undefined,
    title: body.title || undefined,
    description: body.description || undefined,
    metadata: body.metadata || undefined,
    success_url: body.success_url || defaults.success_url,
    cancel_url: body.cancel_url || defaults.cancel_url,
    allow_coupon_code: Boolean(body.allow_coupon_code),
    require_billing_address: Boolean(body.require_billing_address),
  };
}

async function createCheckoutSession(payload) {
  if (!sdk) {
    throw new Error("LOMI_SECRET_KEY is missing. Set it in .env.");
  }
  return sdk.checkoutSessions.create(payload);
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    lomi_base_url: lomiBaseUrl,
    configured: {
      lomi_api_key: Boolean(lomiApiKey),
      lomi_public_key: Boolean(lomiPublicKey),
      webhook_secret: Boolean(webhookSecret),
    },
    transport: "official_sdk",
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    lomi_public_key: lomiPublicKey || null,
  });
});

app.post("/api/checkout/dynamic", async (req, res) => {
  try {
    const amount = toNumber(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const payload = {
      ...buildCommonCheckoutFields(req.body),
      amount,
    };

    const checkoutSession = await createCheckoutSession(payload);
    const checkoutUrl = normalizeCheckoutUrl(checkoutSession);
    return res.status(201).json({
      mode: "dynamic",
      checkout_url: checkoutUrl,
      embedded_checkout_url: withEmbeddedParam(checkoutUrl),
      checkout_session: checkoutSession,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create checkout session" });
  }
});

app.post("/api/checkout/price", async (req, res) => {
  try {
    if (!req.body.price_id) {
      return res.status(400).json({ error: "price_id is required" });
    }

    const quantity = toNumber(req.body.quantity) || 1;
    const payload = {
      ...buildCommonCheckoutFields(req.body),
      price_id: req.body.price_id,
      quantity,
      allow_quantity: req.body.allow_quantity !== undefined ? Boolean(req.body.allow_quantity) : true,
    };

    const checkoutSession = await createCheckoutSession(payload);
    const checkoutUrl = normalizeCheckoutUrl(checkoutSession);
    return res.status(201).json({
      mode: "price",
      checkout_url: checkoutUrl,
      embedded_checkout_url: withEmbeddedParam(checkoutUrl),
      checkout_session: checkoutSession,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create checkout session" });
  }
});

app.post("/api/checkout/line-items", async (req, res) => {
  try {
    if (!Array.isArray(req.body.line_items) || req.body.line_items.length === 0) {
      return res.status(400).json({ error: "line_items must be a non-empty array" });
    }

    const lineItems = req.body.line_items
      .map((item) => ({
        price_id: item.price_id,
        quantity: toNumber(item.quantity) || 1,
      }))
      .filter((item) => Boolean(item.price_id));

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "Each line item requires a price_id" });
    }

    const payload = {
      ...buildCommonCheckoutFields(req.body),
      line_items: lineItems,
    };

    const checkoutSession = await createCheckoutSession(payload);
    const checkoutUrl = normalizeCheckoutUrl(checkoutSession);
    return res.status(201).json({
      mode: "line_items",
      checkout_url: checkoutUrl,
      embedded_checkout_url: withEmbeddedParam(checkoutUrl),
      checkout_session: checkoutSession,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create checkout session" });
  }
});

app.post("/api/webhooks/lomi", (req, res) => {
  const signature = req.get("X-Lomi-Signature");
  const eventName = req.get("X-Lomi-Event");

  if (!signature) {
    return res.status(401).json({ ok: false, error: "Missing X-Lomi-Signature header" });
  }

  if (!webhookSecret) {
    return res.status(500).json({
      ok: false,
      error:
        "Missing webhook secret. Set LOMI_WEBHOOK_SECRET (preferred) or LOMI_WEBHOOK_VERIFICATION_TOKEN in .env",
    });
  }

  const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const isValid =
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

  if (!isValid) {
    return res.status(401).json({ ok: false, error: "Invalid signature" });
  }

  const payload = req.body;
  eventStore.unshift({
    received_at: new Date().toISOString(),
    event_header: eventName || null,
    event_body: payload.event || null,
    payload,
  });
  if (eventStore.length > MAX_EVENTS) {
    eventStore.length = MAX_EVENTS;
  }

  return res.status(200).json({ ok: true });
});

app.get("/api/webhooks/events", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token && req.get("Authorization") !== `Bearer ${token}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json({ count: eventStore.length, events: eventStore });
});

app.listen(port, () => {
  console.log(`SDK reference server running on ${appBaseUrl}`);
  console.log(`Using lomi base URL: ${lomiBaseUrl}`);
});
