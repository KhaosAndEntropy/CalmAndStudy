FROM node:22-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates libc++1 \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable \
    && corepack prepare pnpm@10.0.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile \
    && pnpm --filter @calmandstudy/web build \
    && mkdir -p /out \
    && ./node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild/bin/esbuild \
      packages/research/src/index.ts \
      --bundle --platform=node --format=esm --target=node22 --outfile=/out/research-api.mjs \
    && cp server.mjs /out/server.mjs \
    && cp -R apps/web/dist /out/dist

FROM build AS pages-local

RUN mkdir -p /data /app/.wrangler \
    && ln -s /tmp /app/.wrangler/tmp \
    && ln -s /tmp /app/node_modules/.mf \
    && chown -R node:node /data /app/.wrangler

WORKDIR /app
USER node
ENV CI=1 HOME=/tmp NODE_ENV=development PORT=4173 WRANGLER_SEND_METRICS=false
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:4173/').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["sh", "scripts/docker-compose-entrypoint.sh"]

FROM node:22-alpine AS runtime

# Refresh Alpine packages at image-build time. The image is pulled fresh by
# Compose (`pull: true`), while the application dependencies stay locked by
# pnpm-lock.yaml in the build stage.
RUN apk upgrade --no-cache \
    && rm -rf \
      /usr/local/lib/node_modules/npm \
      /usr/local/lib/node_modules/corepack \
      /opt/yarn-v1.22.22 \
      /usr/local/bin/npm \
      /usr/local/bin/npx \
      /usr/local/bin/corepack \
      /root/.npm \
      /root/.cache \
      /usr/local/share/man

WORKDIR /app
COPY --from=build --chown=node:node /out/ /app/

USER node
ENV NODE_ENV=production PORT=4173
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:4173/').then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.mjs"]
