# Build the Vite SPA, then serve the static output with nginx.
# Coolify builds this image from the repo (Dockerfile build pack) and maps the
# container's port 3000.
ARG NODE_VERSION=22-bookworm-slim

# Pull Docker Official Images through Google's public Docker Hub cache. This
# keeps Coolify builds working when registry-1.docker.io is unavailable.
# ---------- builder ----------
FROM mirror.gcr.io/library/node:${NODE_VERSION} AS builder
WORKDIR /app
RUN npm install -g pnpm@10
# Install deps first for layer caching; lockfile is pnpm v9.0 format.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Base URL of the Directus CMS, baked into the SPA at build time. Defaults to the
# same-origin /directus path (nginx proxies it to the Directus container), so no
# build arg is needed. Override only to target an absolute Directus instance.
ARG VITE_DIRECTUS_URL=/directus
ENV VITE_DIRECTUS_URL=$VITE_DIRECTUS_URL
RUN pnpm build

# ---------- runner ----------
FROM mirror.gcr.io/library/nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
