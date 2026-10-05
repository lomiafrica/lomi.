import { createHash, timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage } from "node:http";
import { browserConsole } from "./console.ts";
import { createBrowserManager, validateSessionId } from "./browser.ts";
import { WorkerError } from "./errors.ts";
import {
  asJson,
  isJsonObject,
  jsonString,
  type Json,
  type JsonObject,
} from "./json.ts";
import { verifyConsoleToken } from "./token.ts";

async function readBody(request: IncomingMessage): Promise<JsonObject> {
  if (!request.headers["content-type"]?.startsWith("application/json"))
    throw new WorkerError("INVALID_BODY", "A JSON request body is required.");
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += Buffer.byteLength(chunk);
    if (size > 64 * 1024)
      throw new WorkerError(
        "BODY_TOO_LARGE",
        "Request body exceeds 64 KiB.",
        413,
      );
    chunks.push(Buffer.from(chunk));
  }
  try {
    const result = asJson(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    if (!isJsonObject(result)) throw new Error("Invalid object");
    return result;
  } catch (error) {
    if (error instanceof WorkerError) throw error;
    throw new WorkerError("INVALID_BODY", "A JSON object is required.");
  }
}

function requiredString(body: JsonObject, key: string, max: number): string {
  const value = jsonString(body[key]);
  if (!value || value.length > max)
    throw new WorkerError("INVALID_BODY", `${key} is required.`);
  return value;
}

/** HTTP API in front of the browser manager. Health is open. Everything else needs the bearer token or a live-view token. */
export async function createWorkerServer(options: {
  token: string;
  dataDir: string;
  maxSessions?: number;
  idleTimeoutMs?: number;
}) {
  if (options.token.length < 32)
    throw new Error("WORKER_TOKEN must contain at least 32 characters.");
  const tokenHash = createHash("sha256")
    .update(`Bearer ${options.token}`)
    .digest();
  const browser = await createBrowserManager(options);
  const server = createServer(async (request, response) => {
    response.setHeader("cache-control", "no-store");
    response.setHeader("x-content-type-options", "nosniff");
    const json = (status: number, body: Json) => {
      response.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
      });
      response.end(JSON.stringify(body));
    };
    try {
      const url = new URL(request.url ?? "/", "http://worker");
      const pathname = url.pathname;
      if (request.method === "GET" && pathname === "/health") {
        json(200, { status: "ok" });
        return;
      }
      const sessionMatch =
        /^\/sessions\/([^/]+)\/(navigate|close|snapshot|click|fill|select|press|submit|screenshot|input|console)$/.exec(
          pathname,
        );
      const sessionId = sessionMatch ? validateSessionId(sessionMatch[1]) : "";
      const consoleToken = url.searchParams.get("token") ?? "";
      const consoleOk =
        sessionId !== "" &&
        verifyConsoleToken(options.token, sessionId, consoleToken);
      const headerHash = createHash("sha256")
        .update(request.headers.authorization ?? "")
        .digest();
      const bearerOk = timingSafeEqual(headerHash, tokenHash);
      if (!bearerOk && !consoleOk)
        throw new WorkerError(
          "UNAUTHORIZED",
          "Worker authentication is required.",
          401,
        );
      if (
        !bearerOk &&
        sessionMatch &&
        sessionMatch[2] !== "screenshot" &&
        sessionMatch[2] !== "input" &&
        sessionMatch[2] !== "console"
      )
        throw new WorkerError(
          "UNAUTHORIZED",
          "Worker authentication is required.",
          401,
        );
      if (pathname === "/sessions" && request.method === "GET") {
        json(200, browser.list());
        return;
      }
      if (pathname === "/sessions" && request.method === "POST") {
        const body = await readBody(request);
        json(
          201,
          await browser.create(
            validateSessionId(body.id),
            requiredString(body, "url", 8192),
            requiredString(body, "owner", 120),
          ),
        );
        return;
      }
      if (!sessionMatch)
        throw new WorkerError("NOT_FOUND", "Worker endpoint not found.", 404);
      const action = sessionMatch[2];
      if (action === "console" && request.method === "GET") {
        if (!consoleOk)
          throw new WorkerError("UNAUTHORIZED", "This view expired.", 401);
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(browserConsole(sessionId, consoleToken));
        return;
      }
      if (action === "navigate" && request.method === "POST")
        json(
          200,
          await browser.navigate(
            sessionId,
            requiredString(await readBody(request), "url", 8192),
          ),
        );
      else if (action === "close" && request.method === "POST")
        json(200, await browser.closeSession(sessionId));
      else if (action === "snapshot" && request.method === "POST")
        json(200, await browser.snapshot(sessionId));
      else if (action === "click" && request.method === "POST")
        json(
          200,
          await browser.click(
            sessionId,
            requiredString(await readBody(request), "ref", 8),
          ),
        );
      else if (action === "fill" && request.method === "POST") {
        const body = await readBody(request);
        const value = jsonString(body.value);
        if (value === undefined || value.length > 2000)
          throw new WorkerError("INVALID_BODY", "value is required.");
        json(
          200,
          await browser.fill(sessionId, requiredString(body, "ref", 8), value),
        );
      } else if (action === "select" && request.method === "POST") {
        const body = await readBody(request);
        json(
          200,
          await browser.select(
            sessionId,
            requiredString(body, "ref", 8),
            requiredString(body, "value", 200),
          ),
        );
      } else if (action === "submit" && request.method === "POST")
        json(
          200,
          await browser.submit(
            sessionId,
            requiredString(await readBody(request), "ref", 8),
          ),
        );
      else if (action === "press" && request.method === "POST")
        json(
          200,
          await browser.press(
            sessionId,
            requiredString(await readBody(request), "key", 32),
          ),
        );
      else if (action === "input" && request.method === "POST")
        json(200, await browser.input(sessionId, await readBody(request)));
      else if (action === "screenshot" && request.method === "GET") {
        const bytes = await browser.screenshot(sessionId);
        response.writeHead(200, {
          "content-type": "image/png",
          "content-length": bytes.length,
        });
        response.end(bytes);
      } else
        throw new WorkerError("NOT_FOUND", "Worker endpoint not found.", 404);
    } catch (error) {
      const safe =
        error instanceof WorkerError
          ? error
          : new WorkerError(
              "WORKER_FAILURE",
              "The browser operation failed. Check worker health and reopen the session.",
              500,
            );
      if (!response.headersSent && !response.destroyed)
        json(safe.status, {
          error: { code: safe.code, message: safe.message },
        });
      else response.end();
    }
  });
  server.requestTimeout = 30_000;
  server.headersTimeout = 10_000;
  server.keepAliveTimeout = 5_000;
  return {
    server,
    close: async () => {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await browser.close();
    },
  };
}
