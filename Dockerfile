# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-bookworm-slim

# ---------- deps ----------
# Install dependencies. Build tools are only needed if better-sqlite3 has to
# fall back to compiling from source (the Linux x64/glibc prebuild normally
# satisfies it, but we ship the toolchain just in case).
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 build-essential \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- builder ----------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runner ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_PATH=/data/counter.db

# Non-root user; /data must exist and be writable for the SQLite file.
RUN groupadd --system --gid 1001 app \
 && useradd  --system --uid 1001 --gid app --create-home --shell /usr/sbin/nologin app \
 && mkdir -p /data \
 && chown -R app:app /data

COPY --from=builder --chown=app:app /app/public         ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static   ./.next/static

USER app
EXPOSE 3000

CMD ["node", "server.js"]
