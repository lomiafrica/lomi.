# syntax=docker/dockerfile:1.7
# production MCP HTTP server image (tests run in CI; image build stays slim)
# Build from monorepo root: docker build -f apps/mcp/Dockerfile .
# Railway must use root directory `/` and dockerfile path `apps/mcp/Dockerfile`.
FROM node:22-bookworm-slim

WORKDIR /app

# file: dependencies live outside apps/mcp and dist/ is gitignored.
# packages/shared is a private submodule. Railway clones the public umbrella
# without initializing it, so do not COPY that path — it is absent and fails
# the build. Clone lomiafrica/packages with LOMI_PACKAGES_SSH_KEY (Railway
# ARG). The key is read from a script so it does not land in the RUN
# instruction or image history command.
COPY apps/sdks/scripts ./apps/sdks/scripts
COPY apps/mcp/package.json apps/mcp/pnpm-lock.yaml ./apps/mcp/
COPY apps/mcp/scripts/build/clone-packages-shared.sh /tmp/clone-packages-shared.sh

# Railway's Metal builder only accepts --mount=type=cache. Read the deploy
# key from ARG via the script so the value never appears in this RUN line.
ARG LOMI_PACKAGES_SSH_KEY
RUN sh /tmp/clone-packages-shared.sh \
    && rm -f /tmp/clone-packages-shared.sh

RUN corepack enable \
    && corepack prepare pnpm@9.15.9 --activate

WORKDIR /app/packages/shared
RUN pnpm install \
    && pnpm exec tsc -p tsconfig.build.json

WORKDIR /app/apps/mcp
RUN pnpm install --frozen-lockfile

COPY apps/mcp/tsconfig.json ./
COPY apps/mcp/src ./src

RUN pnpm exec tsc \
    && pnpm prune --prod

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/http-entry.js"]
