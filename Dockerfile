# syntax=docker/dockerfile:1.7
# Build the Vite SPA, then serve the static output with nginx.
# Coolify builds this image from the repo (Dockerfile build pack) and maps the
# container's port 3000.
ARG NODE_VERSION=22-bookworm-slim

# ---------- builder ----------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
RUN npm install -g pnpm@10
# Install deps first for layer caching; lockfile is pnpm v9.0 format.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---------- runner ----------
FROM nginx:1.27-alpine AS runner
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
