import { createWorkerServer } from "./server.ts";

const token = process.env.WORKER_TOKEN ?? "";
const port = Number(process.env.PORT ?? 8790);
const worker = await createWorkerServer({
  token,
  dataDir: process.env.WORKER_DATA_DIR ?? ".browser-worker/profiles",
  maxSessions: 3,
  idleTimeoutMs: 10 * 60_000,
});
worker.server.listen(port, process.env.WORKER_HOST ?? "0.0.0.0", () => {
  console.log(`browser worker listening on port ${port}`);
});
let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  const deadline = setTimeout(() => process.exit(1), 30_000);
  deadline.unref();
  await worker.close();
  process.exit(0);
}
process.on("SIGTERM", () => {
  void stop();
});
process.on("SIGINT", () => {
  void stop();
});
