import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "lomi-docs",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-28",
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      IMAGES: bindings.images(),
      VINEXT_KV_CACHE: bindings.kv({ id: "60c190c5095b432f8d73a3020e512e91" }),
    },
  }),
});
