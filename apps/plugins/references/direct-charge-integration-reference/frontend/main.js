import {
  loadLomi,
  createLomiCardElements,
  mountLomiCardFields,
  mountLomiCardBrands,
  mountLomiExpressCheckout,
  applyLomiPayButton,
} from "/vendor/lomi-elements.js?v=wallets";

const output = document.getElementById("output");
const eventsOutput = document.getElementById("events-output");
const paymentErrors = document.getElementById("payment-errors");
const payCardButton = document.getElementById("pay-card-button");

const cardTargets = {
  number: "#lomi-card-number",
  expiry: "#lomi-card-expiry",
  cvc: "#lomi-card-cvc",
};

const cardAppearance = {
  borderRadiusPx: 4,
  pay: {
    background: "#121317",
    heightPx: 57,
    fontSizePx: 20,
    label: "Pay",
  },
};

let lomi = null;
let cardBrands = null;
let cardFields = null;
let activeClientSecret = null;
let cardTheme = "light";

function printJson(element, value) {
  element.textContent = JSON.stringify(value, null, 2);
}

function setPaymentError(message) {
  paymentErrors.textContent = message || "";
}

function updatePayButtonState() {
  payCardButton.disabled = !(lomi && cardFields && activeClientSecret);
}

async function mountCardFields(publishableKey) {
  if (!publishableKey) {
    throw new Error("LOMI_PUBLISHABLE_KEY is missing on the server (.env)");
  }
  if (cardFields) return;

  lomi = await loadLomi(publishableKey);
  if (!lomi) {
    throw new Error("Failed to initialize @lomi./sdk");
  }

  const elements = createLomiCardElements(lomi);
  cardFields = mountLomiCardFields(elements, cardTargets, { theme: cardTheme });
  watchCardBrand();
  updatePayButtonState();
}

function watchCardBrand() {
  cardFields.number.on("change", (event) => {
    cardBrands?.setBrand(event.brand ?? null);
  });
}

function setCardTheme(theme) {
  cardTheme = theme;
  document.getElementById("lomi-card-stack")?.setAttribute("data-theme", theme);
  document.getElementById("theme-light")?.classList.toggle("is-selected", theme === "light");
  document.getElementById("theme-dark")?.classList.toggle("is-selected", theme === "dark");
  if (!lomi) return;
  if (cardFields) {
    cardFields.number.unmount();
    cardFields.expiry.unmount();
    cardFields.cvc.unmount();
    cardFields = null;
  }
  cardFields = mountLomiCardFields(createLomiCardElements(lomi), cardTargets, {
    theme,
  });
  watchCardBrand();
  updatePayButtonState();
}

async function postJson(path, payload) {
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
  return data;
}

document.getElementById("wave-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await postJson("/api/charge/wave", {
      amount: Number(form.get("amount")),
      currency: "XOF",
      customer_name: String(form.get("customer_name") || ""),
      customer_email: String(form.get("customer_email") || ""),
      customer_phone: String(form.get("customer_phone") || ""),
    });
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("mtn-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    await postJson("/api/charge/mtn", {
      amount: Number(form.get("amount")),
      currency: "XOF",
      customer_name: String(form.get("customer_name") || ""),
      customer_email: String(form.get("customer_email") || ""),
      customer_phone: String(form.get("customer_phone") || ""),
      country_code: String(form.get("country_code") || "CI"),
    });
  } catch (error) {
    alert(error.message);
  }
});

document.getElementById("card-setup-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);

  try {
    const configResponse = await fetch("/api/config");
    const config = await configResponse.json();

    const charge = await postJson("/api/charge/card", {
      amount: Number(form.get("amount")),
      currency_code: String(form.get("currency_code") || "XOF"),
      customer_name: String(form.get("customer_name") || ""),
      customer_email: String(form.get("customer_email") || ""),
    });

    const clientSecret = charge?.data?.client_secret;
    if (!clientSecret) {
      throw new Error("Missing client_secret in card charge response");
    }

    activeClientSecret = clientSecret;
    await mountCardFields(config.lomi_publishable_key);
    if (lomi) {
      mountLomiExpressCheckout(lomi, clientSecret, "#lomi-wallets");
    }
    updatePayButtonState();
  } catch (error) {
    alert(error.message);
  }
});

payCardButton.addEventListener("click", async () => {
  if (!lomi || !cardFields || !activeClientSecret) {
    alert("Create a card charge first.");
    return;
  }

  payCardButton.disabled = true;
  setPaymentError("");

  try {
    const { error, paymentIntent } = await lomi.confirmCardPayment(
      activeClientSecret,
      {
        payment_method: { card: cardFields.number },
      },
    );

    if (error) {
      setPaymentError(error.message || "Payment failed");
      printJson(output, { error });
      return;
    }

    printJson(output, { paymentIntent });
    if (paymentIntent?.status === "succeeded") {
      alert("Payment succeeded. Check webhooks for final reconciliation.");
    } else if (paymentIntent?.status === "requires_action") {
      alert("Additional authentication required — follow the on-screen prompts.");
    } else {
      alert(`Payment status: ${paymentIntent?.status || "unknown"}`);
    }
  } catch (error) {
    setPaymentError(error.message || "Unexpected error");
  } finally {
    updatePayButtonState();
  }
});

document.getElementById("theme-light")?.addEventListener("click", () => {
  setCardTheme("light");
});
document.getElementById("theme-dark")?.addEventListener("click", () => {
  setCardTheme("dark");
});

const brandSlot = document.getElementById("lomi-card-brands");
if (brandSlot) {
  cardBrands = mountLomiCardBrands(brandSlot);
}
if (payCardButton) {
  applyLomiPayButton(payCardButton, cardAppearance);
}

document.getElementById("lomi-pay-colors")?.addEventListener("click", (event) => {
  const swatch = event.target.closest("[data-pay]");
  if (!swatch || !payCardButton) return;
  document.querySelectorAll(".lomi-pay-colors button").forEach((button) => {
    button.classList.toggle("is-selected", button === swatch);
  });
  applyLomiPayButton(payCardButton, {
    borderRadiusPx: 4,
    pay: {
      background: swatch.dataset.pay,
      heightPx: 57,
      fontSizePx: 20,
      label: "Pay",
    },
  });
});

fetch("/api/config")
  .then((response) => response.json())
  .then((config) => mountCardFields(config.lomi_publishable_key))
  .catch((error) => setPaymentError(error.message || "Could not load card fields"));

document.getElementById("refresh-events").addEventListener("click", async () => {
  const response = await fetch("/api/webhooks/events");
  const data = await response.json();
  printJson(eventsOutput, data);
});
