const crypto = require("crypto");
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3002);
const appBaseUrl = process.env.APP_BASE_URL || `http://localhost:${port}`;
const lomiBaseUrl = process.env.LOMI_BASE_URL || "https://sandbox.api.lomi.africa";
const lomiApiKey = process.env.LOMI_SECRET_KEY;
const lomiPublishableKey =
  process.env.LOMI_PUBLISHABLE_KEY || process.env.LOMI_PUBLIC_KEY || "";
const webhookSecret =
  process.env.LOMI_WEBHOOK_SECRET || process.env.LOMI_WEBHOOK_VERIFICATION_TOKEN || "";

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cors({ origin: appBaseUrl }));
app.use(express.static(path.join(__dirname, "..", "frontend")));

const eventStore = [];
const MAX_EVENTS = 50;

function isStringValue(value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

function toNumber(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

async function lomiRequest(method, routePath, body) {
  if (!lomiApiKey) {
    throw new Error("LOMI_SECRET_KEY is missing. Set it in .env.");
  }

  const response = await fetch(`${lomiBaseUrl}${routePath}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": lomiApiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || "lomi API request failed";
    throw new Error(isStringValue(message) ? message : JSON.stringify(message));
  }

  return { status: response.status, data };
}

function buildCustomer(body) {
  const name = String(body.customer_name || body.name || "").trim();
  const email = String(body.customer_email || body.email || "").trim();
  const phoneNumber = String(body.customer_phone || body.phoneNumber || "").trim();

  if (!name) {
    throw new Error("customer_name (or name) is required");
  }
  if (!phoneNumber) {
    throw new Error("customer_phone (or phoneNumber) is required for mobile-money demos");
  }

  return {
    name,
    email: email || undefined,
    phoneNumber,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    lomi_base_url: lomiBaseUrl,
    configured: {
      lomi_api_key: Boolean(lomiApiKey),
      lomi_publishable_key: Boolean(lomiPublishableKey),
      webhook_secret: Boolean(webhookSecret),
    },
  });
});

app.get("/api/config", (_req, res) => {
  res.json({
    lomi_publishable_key: lomiPublishableKey || null,
    lomi_base_url: lomiBaseUrl,
    app_base_url: appBaseUrl,
  });
});

app.post("/api/charge/wave", async (req, res) => {
  try {
    const amount = toNumber(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const payload = {
      amount,
      currency: String(req.body.currency || "XOF"),
      customer: buildCustomer(req.body),
      description: req.body.description || "Direct Wave charge (reference demo)",
      successUrl: req.body.success_url || `${appBaseUrl}/?status=success&provider=wave`,
      errorUrl: req.body.error_url || `${appBaseUrl}/?status=error&provider=wave`,
    };

    const result = await lomiRequest("POST", "/charge/wave", payload);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/charge/mtn", async (req, res) => {
  try {
    const amount = toNumber(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const payload = {
      amount,
      currency: String(req.body.currency || "XOF"),
      customer: buildCustomer(req.body),
      description: req.body.description || "Direct MTN charge (reference demo)",
      countryCode: req.body.country_code || "CI",
      quantity: toNumber(req.body.quantity) || 1,
    };

    const result = await lomiRequest("POST", "/charge/mtn", payload);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/charge/card", async (req, res) => {
  try {
    const amount = toNumber(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    const email = String(req.body.customer_email || "").trim();
    const name = String(req.body.customer_name || "").trim();
    if (!email || !name) {
      return res.status(400).json({
        error: "customer_email and customer_name are required for card charge reconciliation",
      });
    }

    const payload = {
      amount,
      currency_code: String(req.body.currency_code || "XOF"),
      customer_email: email,
      customer_name: name,
      customer_phone: req.body.customer_phone || undefined,
      description: req.body.description || "Direct card charge (reference demo)",
      appearance_theme: req.body.appearance_theme || "light",
      appearance_border_radius: toNumber(req.body.appearance_border_radius) ?? 6,
      appearance_billing_address: req.body.appearance_billing_address || "never",
      metadata: req.body.metadata || { source: "direct-charge-reference" },
    };

    const result = await lomiRequest("POST", "/charge/card", payload);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/api/charge/card/:id", async (req, res) => {
  try {
    const result = await lomiRequest("GET", `/charge/card/${encodeURIComponent(req.params.id)}`);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.post("/api/charge/card/:id/cancel", async (req, res) => {
  try {
    const result = await lomiRequest(
      "POST",
      `/charge/card/${encodeURIComponent(req.params.id)}/cancel`,
    );
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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

  console.log("[webhook]", payload.event || eventName || "unknown", payload.data || payload);
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
  console.log(`Direct charge reference server running on ${appBaseUrl}`);
  console.log(`Using lomi base URL: ${lomiBaseUrl}`);
});
