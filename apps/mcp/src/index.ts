#!/usr/bin/env node
import { getTransportMode } from "./env-config.js";
import { startHttpServer } from "./http.js";
import { startStdioServer } from "./server.js";

const mode = getTransportMode();
if (mode === "http") {
  await startHttpServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  await startStdioServer().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
