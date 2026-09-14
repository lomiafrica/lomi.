#!/usr/bin/env node
import { startHttpServer } from "./http.js";

await startHttpServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
