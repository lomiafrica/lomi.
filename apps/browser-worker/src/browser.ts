import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import type { BrowserContext, Page } from "playwright";
import { WorkerError } from "./errors.ts";
import {
  asJson,
  isJsonObject,
  jsonBoolean,
  jsonNumber,
  jsonString,
  type Json,
  type JsonObject,
} from "./json.ts";
import { validatePublicUrl } from "./network.ts";
import { startEgressProxy } from "./proxy.ts";
import {
  assertRef,
  inspectExpression,
  SNAPSHOT_EXPRESSION,
} from "./snapshot.ts";
import { mintConsoleToken } from "./token.ts";

export interface Session {
  id: string;
  owner: string;
  title: string;
  url: string;
  status: "active" | "closed" | "error";
  updatedAt: string;
}

export interface BrowserField {
  ref: string;
  name: string;
  value: string;
  secret: boolean;
}

export interface PageSnapshot {
  url: string;
  title: string;
  text: string;
  needsPassword: boolean;
  needsCaptcha: boolean;
  fields: BrowserField[];
  consolePath?: string;
}

type Running = {
  context: BrowserContext;
  page: Page;
  touched: number;
};

const SESSION_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OWNER = /^[0-9a-f-]{36}:[0-9a-z-]{1,80}$/i;
const AGENT_KEYS =
  /^(Tab|Escape|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End)$/;
const HUMAN_KEYS =
  /^(Enter|Tab|Escape|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Home|End|PageUp|PageDown)$/;

export function validateSessionId(id: string): string {
  if (!SESSION_ID.test(id))
    throw new WorkerError(
      "INVALID_SESSION",
      "A valid UUID session ID is required.",
    );
  return id.toLowerCase();
}

function validateOwner(owner: string): string {
  if (!OWNER.test(owner))
    throw new WorkerError("INVALID_OWNER", "A session owner is required.");
  return owner.toLowerCase();
}

/** Headless Chromium. One live page per session, cookies kept in the profile directory. */
export async function createBrowserManager(options: {
  dataDir: string;
  token: string;
  maxSessions?: number;
  idleTimeoutMs?: number;
}) {
  const {
    dataDir,
    token,
    maxSessions = 3,
    idleTimeoutMs = 10 * 60_000,
  } = options;
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const sessions = new Map<string, Session>();
  const running = new Map<string, Running>();
  const queues = new Map<string, Promise<unknown>>();
  const proxy = await startEgressProxy();
  for (const id of await readdir(dataDir)) {
    if (!SESSION_ID.test(id)) continue;
    try {
      // SAFETY: session.json is written by persist() as a Session.
      const stored = JSON.parse(
        await readFile(join(dataDir, id, "session.json"), "utf8"),
      ) as Session;
      if (stored.owner) sessions.set(id, { ...stored, id, status: "closed" });
    } catch {
      /* A failed first launch has nothing to restore. */
    }
  }
  const directory = (id: string) => join(dataDir, validateSessionId(id));
  async function persist(session: Session) {
    const path = join(directory(session.id), "session.json");
    await writeFile(`${path}.tmp`, JSON.stringify(session), { mode: 0o600 });
    await rename(`${path}.tmp`, path);
  }
  async function serial<T>(id: string, fn: () => Promise<T>): Promise<T> {
    const previous = queues.get(id) ?? Promise.resolve();
    const next = previous.catch(() => undefined).then(fn);
    queues.set(id, next);
    try {
      return await next;
    } finally {
      if (queues.get(id) === next) queues.delete(id);
    }
  }
  function readFields(value: Json | undefined): BrowserField[] {
    if (!Array.isArray(value)) return [];
    const fields: BrowserField[] = [];
    for (const item of value) {
      if (!isJsonObject(item)) continue;
      const ref = jsonString(item.ref);
      const name = jsonString(item.name);
      const fieldValue = jsonString(item.value);
      const secret = jsonBoolean(item.secret);
      if (
        !ref ||
        name === undefined ||
        fieldValue === undefined ||
        secret === undefined
      )
        continue;
      fields.push({ ref, name, value: fieldValue, secret });
    }
    return fields;
  }
  function active(id: string) {
    const value = running.get(id);
    if (!value || value.page.isClosed())
      throw new WorkerError(
        "SESSION_CLOSED",
        "Open this browser session before using it.",
        409,
      );
    value.touched = Date.now();
    return value;
  }
  async function snapshotOf(id: string, page: Page): Promise<PageSnapshot> {
    if (page.url() !== "about:blank") await validatePublicUrl(page.url());
    const raw = asJson(await page.evaluate(SNAPSHOT_EXPRESSION));
    const url = isJsonObject(raw) ? jsonString(raw.url) : undefined;
    const text = isJsonObject(raw) ? jsonString(raw.text) : undefined;
    if (!isJsonObject(raw) || !url || text === undefined)
      throw new WorkerError(
        "SNAPSHOT_FAILED",
        "The page snapshot could not be read.",
        502,
      );
    await validatePublicUrl(url);
    const title = jsonString(raw.title) ?? "";
    const needsPassword = jsonBoolean(raw.needsPassword) === true;
    const needsCaptcha = jsonBoolean(raw.needsCaptcha) === true;
    const session: Session = {
      id,
      owner: sessions.get(id)?.owner ?? "",
      title,
      url,
      status: "active",
      updatedAt: new Date().toISOString(),
    };
    sessions.set(id, session);
    await persist(session);
    const needsMerchant = needsPassword || needsCaptcha;
    return {
      url,
      title,
      text,
      needsPassword,
      needsCaptcha,
      fields: readFields(raw.fields),
      consolePath: needsMerchant
        ? `/sessions/${id}/console?token=${mintConsoleToken(token, id)}`
        : undefined,
    };
  }
  async function navigate(id: string, url: string) {
    const target = await validatePublicUrl(url);
    const { page } = active(id);
    try {
      await page.goto(target.url.href, {
        waitUntil: "domcontentloaded",
        timeout: 20_000,
      });
      await validatePublicUrl(page.url());
    } catch (error) {
      if (error instanceof WorkerError && error.code === "BLOCKED_URL") {
        await page
          .goto("about:blank", { timeout: 5000 })
          .catch(() => undefined);
      }
      throw new WorkerError(
        "NAVIGATION_FAILED",
        "The page could not be loaded. It may be unreachable or contain a blocked destination.",
        502,
      );
    }
    return snapshotOf(id, page);
  }
  async function closeSession(id: string) {
    const instance = running.get(id);
    const stored = sessions.get(id);
    if (!stored)
      throw new WorkerError(
        "SESSION_NOT_FOUND",
        "Browser session not found.",
        404,
      );
    if (instance) {
      await instance.context.storageState({
        path: join(directory(id), "storage.json"),
      });
      await instance.context.close();
      running.delete(id);
    }
    const result: Session = {
      ...stored,
      status: "closed",
      updatedAt: new Date().toISOString(),
    };
    sessions.set(id, result);
    await persist(result);
    return result;
  }
  async function createSession(id: string, url: string, owner: string) {
    await validatePublicUrl(url);
    const existing = sessions.get(id);
    if (existing && existing.owner !== owner)
      throw new WorkerError(
        "SESSION_OWNER",
        "This session belongs to another job.",
        403,
      );
    if (running.has(id)) return navigate(id, url);
    if (running.size >= maxSessions)
      throw new WorkerError(
        "SESSION_LIMIT",
        `Close an active session before opening another (limit ${maxSessions}).`,
        409,
      );
    if (!existing && sessions.size >= 100)
      throw new WorkerError(
        "PROFILE_LIMIT",
        "The worker has reached its saved-profile limit.",
        409,
      );
    const profileDir = join(directory(id), "profile");
    await mkdir(profileDir, { recursive: true, mode: 0o700 });
    let context: BrowserContext;
    try {
      const { chromium } = await import("playwright");
      context = await chromium.launchPersistentContext(profileDir, {
        env: {
          HOME: process.env.HOME ?? "/tmp",
          PATH: process.env.PATH ?? "/usr/bin:/bin",
          LANG: "C.UTF-8",
        },
        headless: true,
        viewport: { width: 1280, height: 800 },
        proxy: { server: proxy.url, bypass: "<-loopback>" },
        serviceWorkers: "block",
        acceptDownloads: false,
        timeout: 25_000,
        args: [
          "--disable-quic",
          "--force-webrtc-ip-handling-policy=disable_non_proxied_udp",
          "--disable-extensions",
          "--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1",
        ],
      });
    } catch {
      if (!existing) await rm(directory(id), { recursive: true, force: true });
      throw new WorkerError(
        "BROWSER_UNAVAILABLE",
        "Chromium could not start. Rebuild the browser-worker image and check its resource limits.",
        503,
      );
    }
    try {
      const statePath = join(directory(id), "storage.json");
      try {
        // SAFETY: storage.json is Playwright storageState written by closeSession.
        const state = JSON.parse(await readFile(statePath, "utf8")) as Awaited<
          ReturnType<BrowserContext["storageState"]>
        >;
        if (state.cookies.length > 0) await context.addCookies(state.cookies);
      } catch (error) {
        if (
          !(
            error instanceof Error &&
            "code" in error &&
            error.code === "ENOENT"
          )
        )
          throw error;
      }
      await context.route("**/*", async (route) => {
        try {
          await validatePublicUrl(route.request().url());
          await route.continue();
        } catch {
          await route.abort("blockedbyclient").catch(() => undefined);
        }
      });
      await context.routeWebSocket("**/*", (socket) => socket.close());
      for (const old of context.pages()) await old.close();
      const page = await context.newPage();
      page.setDefaultTimeout(10_000);
      running.set(id, { context, page, touched: Date.now() });
      context.on("page", (popup) => {
        void popup.close();
      });
      page.on("dialog", (dialog) => {
        void dialog.dismiss();
      });
      const initial: Session = {
        id,
        owner,
        title: existing?.title ?? "New session",
        url,
        status: "active",
        updatedAt: new Date().toISOString(),
      };
      sessions.set(id, initial);
      await persist(initial);
      return await navigate(id, url);
    } catch (error) {
      await context.close().catch(() => undefined);
      running.delete(id);
      if (!existing) {
        sessions.delete(id);
        await rm(directory(id), { recursive: true, force: true });
      }
      throw error;
    }
  }
  async function elementFor(page: Page, ref: string) {
    let parsed: string;
    try {
      parsed = assertRef(ref);
    } catch (error) {
      throw new WorkerError(
        "INVALID_REF",
        error instanceof Error ? error.message : "Invalid ref.",
      );
    }
    const handle = await page.evaluateHandle(
      `globalThis.__sandRefs instanceof Map ? (globalThis.__sandRefs.get(${JSON.stringify(parsed)}) ?? null) : null`,
    );
    const element = handle.asElement();
    if (!element) {
      await handle.dispose();
      throw new WorkerError(
        "STALE_REF",
        "That ref is gone. Take a fresh snapshot and use a ref from it.",
        409,
      );
    }
    return { handle, element };
  }
  async function clickRef(id: string, page: Page, ref: string) {
    const { handle, element } = await elementFor(page, ref);
    try {
      await element.click();
      await page
        .waitForLoadState("domcontentloaded", { timeout: 3000 })
        .catch(() => undefined);
    } finally {
      await handle.dispose();
    }
    return snapshotOf(id, page);
  }
  async function inspect(page: Page, ref: string) {
    let expression: string;
    try {
      expression = inspectExpression(ref);
    } catch (error) {
      throw new WorkerError(
        "INVALID_REF",
        error instanceof Error ? error.message : "Invalid ref.",
      );
    }
    const raw = asJson(await page.evaluate(expression));
    const row = isJsonObject(raw) ? raw : undefined;
    return {
      found: jsonBoolean(row?.found) === true,
      secret: jsonBoolean(row?.secret) === true,
      submits: jsonBoolean(row?.submits) === true,
    };
  }
  const sweeper = setInterval(() => {
    for (const [id, instance] of running)
      if (Date.now() - instance.touched > idleTimeoutMs)
        void serial(id, () => closeSession(id)).catch(() => undefined);
  }, 60_000);
  sweeper.unref();
  return {
    list: () => [...sessions.values()],
    create: (id: string, url: string, owner: string) =>
      serial("create", () =>
        serial(id, () => createSession(id, url, validateOwner(owner))),
      ),
    navigate: (id: string, url: string) => serial(id, () => navigate(id, url)),
    closeSession: (id: string) => serial(id, () => closeSession(id)),
    snapshot: (id: string) => serial(id, () => snapshotOf(id, active(id).page)),
    screenshot: (id: string) =>
      serial(id, () =>
        active(id).page.screenshot({ type: "png", timeout: 10_000 }),
      ),
    click: (id: string, ref: string) =>
      serial(id, async () => {
        const { page } = active(id);
        const info = await inspect(page, ref);
        if (!info.found)
          throw new WorkerError(
            "STALE_REF",
            "That ref is gone. Take a fresh snapshot.",
            409,
          );
        if (info.submits)
          throw new WorkerError(
            "USE_SUBMIT",
            "That control submits the form. Use browser_submit so the merchant can approve it.",
          );
        return clickRef(id, page, ref);
      }),
    submit: (id: string, ref: string) =>
      serial(id, async () => {
        const { page } = active(id);
        const info = await inspect(page, ref);
        if (!info.found)
          throw new WorkerError(
            "STALE_REF",
            "That ref is gone. Take a fresh snapshot.",
            409,
          );
        return clickRef(id, page, ref);
      }),
    fill: (id: string, ref: string, value: string) =>
      serial(id, async () => {
        if (value.length > 2_000)
          throw new WorkerError(
            "VALUE_TOO_LONG",
            "A field value can be at most 2000 characters.",
          );
        const { page } = active(id);
        const info = await inspect(page, ref);
        if (!info.found)
          throw new WorkerError(
            "STALE_REF",
            "That ref is gone. Take a fresh snapshot.",
            409,
          );
        if (info.secret)
          throw new WorkerError(
            "SECRET_FIELD",
            "Passwords, card numbers, and one-time codes stay with the merchant. Open the live view.",
          );
        const { handle, element } = await elementFor(page, ref);
        try {
          await element.fill(value);
        } finally {
          await handle.dispose();
        }
        return snapshotOf(id, page);
      }),
    select: (id: string, ref: string, value: string) =>
      serial(id, async () => {
        const { page } = active(id);
        const { handle, element } = await elementFor(page, ref);
        try {
          try {
            await element.selectOption(value);
          } catch {
            await element.selectOption({ label: value });
          }
        } finally {
          await handle.dispose();
        }
        return snapshotOf(id, page);
      }),
    press: (id: string, key: string) =>
      serial(id, async () => {
        if (!AGENT_KEYS.test(key))
          throw new WorkerError(
            "INVALID_KEY",
            "That key is not available. Enter submits a form and needs browser_submit.",
          );
        const { page } = active(id);
        await page.keyboard.press(key);
        return snapshotOf(id, page);
      }),
    input: (id: string, input: JsonObject) =>
      serial(id, async () => {
        const { page } = active(id);
        const type = jsonString(input.type);
        const x = jsonNumber(input.x);
        const y = jsonNumber(input.y);
        const key = jsonString(input.key);
        const text = jsonString(input.text);
        const deltaY = jsonNumber(input.deltaY);
        if (
          type === "click" &&
          x !== undefined &&
          y !== undefined &&
          x >= 0 &&
          x < 1280 &&
          y >= 0 &&
          y < 800
        )
          await page.mouse.click(x, y);
        else if (type === "text" && text !== undefined && text.length <= 10_000)
          await page.keyboard.insertText(text);
        else if (type === "key" && key !== undefined && HUMAN_KEYS.test(key))
          await page.keyboard.press(key);
        else if (
          type === "scroll" &&
          deltaY !== undefined &&
          Math.abs(deltaY) <= 5000
        )
          await page.mouse.wheel(0, deltaY);
        else
          throw new WorkerError("INVALID_INPUT", "Unsupported browser input.");
        return snapshotOf(id, page);
      }),
    close: async () => {
      clearInterval(sweeper);
      await Promise.allSettled([...queues.values()]);
      await Promise.allSettled(
        [...running.keys()].map((id) => closeSession(id)),
      );
      await proxy.close();
    },
  };
}
