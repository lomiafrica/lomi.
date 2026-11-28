import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { kvDataAdapter } from "@vinext/cloudflare/cache/kv-data-adapter";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import mdx from "fumadocs-mdx/vite";
import * as sourceConfig from "./source.config";

export default defineConfig(async () => ({
  build: {
    // Worker uploads cap encoded sourcemaps at 60 MiB; the docs bundle alone exceeds that.
    sourcemap: false,
  },
  plugins: [
    await mdx(sourceConfig),
    vinext({
      prerender: true,
      cache: { cdn: staticAssetsAdapter(), data: kvDataAdapter() },
      images: { optimizer: imagesOptimizer() },
    }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
}));
