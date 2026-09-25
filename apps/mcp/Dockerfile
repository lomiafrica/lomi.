# syntax=docker/dockerfile:1.7
# production MCP HTTP server image (tests run in CI; image build stays slim)
# Build from monorepo root: docker build -f apps/mcp/Dockerfile .
# Railway must use root directory `/` and dockerfile path `apps/mcp/Dockerfile`.
FROM node:22-bookworm-slim

WORKDIR /app

# file: dependencies live outside apps/mcp and dist/ is gitignored.
# Public tree or an initialized packages submodule supplies this copy.
# Isolated Railway clones of the public repo get an empty submodule: the
# next RUN fetches lomiafrica/packages with a BuildKit secret / deploy key.
COPY packages/shared ./packages/shared
COPY apps/sdks/scripts ./apps/sdks/scripts
COPY apps/mcp/package.json apps/mcp/pnpm-lock.yaml ./apps/mcp/

# Railway injects service variables as build-args. The value is not echoed.
ARG LOMI_PACKAGES_SSH_KEY

RUN if [ ! -f /app/packages/shared/package.json ]; then \
      if [ -z "${LOMI_PACKAGES_SSH_KEY:-}" ]; then \
        echo "packages/shared missing and LOMI_PACKAGES_SSH_KEY is unset" >&2; \
        exit 1; \
      fi; \
      apt-get update \
        && apt-get install -y --no-install-recommends git openssh-client ca-certificates \
        && rm -rf /var/lib/apt/lists/*; \
      keyfile="$(mktemp)"; \
      printf '%s\n' "$LOMI_PACKAGES_SSH_KEY" > "$keyfile"; \
      chmod 600 "$keyfile"; \
      GIT_SSH_COMMAND="ssh -i ${keyfile} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new" \
        git clone --depth 1 git@github.com:lomiafrica/packages.git /tmp/packages; \
      rm -f "$keyfile"; \
      mkdir -p /app/packages; \
      rm -rf /app/packages/shared; \
      cp -R /tmp/packages/shared /app/packages/shared; \
      rm -rf /tmp/packages; \
    fi \
    && test -f /app/packages/shared/package.json

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
