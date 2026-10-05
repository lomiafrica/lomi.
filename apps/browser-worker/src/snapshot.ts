/** In-page walk. Assigns [ref=eN] on interactive elements and keeps the handles on the page. */
export const SNAPSHOT_EXPRESSION = `(() => {
  const doc = document;
  const win = window;
  const root = doc.body;
  if (!root) {
    return { url: location.href, title: "", text: "(empty page)", needsPassword: false, needsCaptcha: false, fields: [] };
  }
  const refs = new Map();
  globalThis.__sandRefs = refs;
  let refCounter = 0;
  const lines = [];
  const fields = [];
  const maxNodes = 400;
  let nodeCount = 0;
  const interactiveMatcher = "a[href], button, input, select, textarea, summary, [role='button'], [role='link'], [role='checkbox'], [role='radio'], [role='tab'], [role='menuitem'], [role='combobox'], [role='option'], [role='switch'], [role='searchbox'], [role='textbox'], [role='slider'], [contenteditable='true']";
  const needsPassword = !!doc.querySelector("input[type='password']");
  const needsCaptcha = !!doc.querySelector("iframe[src*='recaptcha'], iframe[src*='hcaptcha'], iframe[src*='turnstile'], .g-recaptcha, .h-captcha, #cf-challenge-running");
  const trim = (text, max) => {
    const t = String(text ?? "").replace(/\\s+/g, " ").trim();
    return t.length > max ? t.slice(0, max) + "…" : t;
  };
  const secretOf = (el) => {
    const type = (el.getAttribute("type") || "").toLowerCase();
    const auto = (el.getAttribute("autocomplete") || "").toLowerCase();
    const blob = [el.getAttribute("name"), el.id, auto, el.getAttribute("aria-label"), el.getAttribute("placeholder")].join(" ").toLowerCase();
    return type === "password" || auto === "current-password" || auto === "new-password" || auto === "cc-number" || auto === "cc-csc" || auto === "one-time-code" || /password|cc-number|cc-csc|cvc|cvv|cardnumber|one-time-code|otp/.test(blob);
  };
  const nameOf = (el) => {
    const aria = el.getAttribute("aria-label");
    if (aria) return trim(aria, 80);
    if (el.labels && el.labels.length > 0) return trim(el.labels[0].innerText, 80);
    const placeholder = el.getAttribute("placeholder");
    if (placeholder) return trim(placeholder, 80);
    return trim(el.innerText || el.value || el.getAttribute("name") || "", 80);
  };
  const roleOf = (el) => {
    const explicit = el.getAttribute("role");
    if (explicit) return explicit;
    const tag = el.tagName.toLowerCase();
    if (tag === "a") return "link";
    if (tag === "button" || tag === "summary") return "button";
    if (tag === "select") return "combobox";
    if (tag === "textarea") return "textbox";
    if (tag === "input") {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      if (type === "button" || type === "submit" || type === "reset") return "button";
      if (type === "checkbox") return "checkbox";
      if (type === "radio") return "radio";
      return "textbox";
    }
    if (/^h[1-6]$/.test(tag)) return "heading";
    return tag;
  };
  const isVisible = (el) => {
    if (el.getAttribute("aria-hidden") === "true") return false;
    const style = win.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  const walk = (el, depth) => {
    if (nodeCount >= maxNodes || depth > 20) return;
    if (!(el instanceof win.HTMLElement)) return;
    const tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "noscript") return;
    if (!isVisible(el)) return;
    const isInteractive = el.matches(interactiveMatcher);
    const isHeading = /^h[1-6]$/.test(tag);
    const isTextual = tag === "p" || tag === "li" || tag === "label" || tag === "td" || tag === "th";
    let childDepth = depth;
    if (isInteractive || isHeading || (isTextual && trim(el.innerText, 10).length > 0 && el.querySelector(interactiveMatcher) === null)) {
      nodeCount += 1;
      const role = roleOf(el);
      const name = nameOf(el);
      let line = "  ".repeat(Math.min(depth, 6)) + "- " + role;
      if (name) line += " " + JSON.stringify(name);
      let ref = "";
      if (isInteractive && !el.disabled) {
        refCounter += 1;
        ref = "e" + String(refCounter);
        refs.set(ref, el);
        line += " [ref=" + ref + "]";
      }
      if (el.disabled) line += " disabled";
      const secret = secretOf(el);
      if ((tag === "input" || tag === "textarea" || tag === "select") && typeof el.value === "string" && el.value.length > 0) {
        line += " value=" + (secret ? '"<redacted>"' : JSON.stringify(trim(el.value, 40)));
      }
      if (tag === "a") {
        const href = el.getAttribute("href");
        if (href && !href.startsWith("javascript:")) line += " href=" + JSON.stringify(trim(href, 80));
      }
      if (ref && (tag === "input" || tag === "textarea" || tag === "select")) {
        fields.push({ ref, name, value: secret ? "" : trim(el.value || "", 80), secret });
      }
      lines.push(line);
      childDepth = depth + 1;
      if (isInteractive || isTextual) return;
    }
    for (const child of el.children) walk(child, childDepth);
  };
  walk(root, 0);
  if (nodeCount >= maxNodes) lines.push("(snapshot truncated at 400 elements)");
  return {
    url: location.href,
    title: doc.title.slice(0, 300),
    text: lines.join("\\n").slice(0, 24000),
    needsPassword,
    needsCaptcha,
    fields: fields.slice(0, 80),
  };
})()`;

const REF_PATTERN = /^e[1-9]\d{0,3}$/;

/** A ref the snapshot just assigned. Anything else is rejected before it reaches the page. */
export function assertRef(value: string): string {
  if (!REF_PATTERN.test(value)) {
    throw new Error("A ref like e1 from the latest snapshot is required.");
  }
  return value;
}

/** Read whether a ref is a secret field or a form submit control. */
export function inspectExpression(ref: string): string {
  const safe = assertRef(ref);
  return `(() => {
    const map = globalThis.__sandRefs;
    const el = map instanceof Map ? map.get(${JSON.stringify(safe)}) : null;
    if (!el) return { found: false, secret: false, submits: false };
    const tag = el.tagName.toLowerCase();
    const type = (el.getAttribute("type") || "").toLowerCase();
    const auto = (el.getAttribute("autocomplete") || "").toLowerCase();
    const blob = [el.getAttribute("name"), el.id, auto, el.getAttribute("aria-label"), el.getAttribute("placeholder")].join(" ").toLowerCase();
    const secret = type === "password" || auto === "current-password" || auto === "new-password" || auto === "cc-number" || auto === "cc-csc" || auto === "one-time-code" || /password|cc-number|cc-csc|cvc|cvv|cardnumber|one-time-code|otp/.test(blob);
    const submits = type === "submit" || (tag === "button" && type !== "button" && type !== "reset" && !!el.closest("form"));
    return { found: true, secret, submits };
  })()`;
}
