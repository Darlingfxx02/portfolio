# Serve the committed Vite build without requiring a Node image during deploy.
# GHCR is used because the Coolify host cannot reliably reach Docker Hub.
# Pin the multi-arch manifest so production builds stay reproducible.
FROM ghcr.io/nginx/nginx-unprivileged:1.29.4-alpine@sha256:a6c4f61f456b85b8fdf7ec7ab28cc3e299440e6fb4a9dea520e5fd8fd440025e

COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 dist /usr/share/nginx/html

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
