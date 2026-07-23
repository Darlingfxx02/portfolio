# Registry-free production image. The Coolify host cannot reliably reach
# external container registries, so the repository carries a small static
# Linux server for each supported architecture together with the Vite build.
FROM scratch

ARG TARGETARCH
COPY --chown=65532:65532 server/bin/portfolio-server-${TARGETARCH} /portfolio-server
COPY --chown=65532:65532 dist /app

USER 65532:65532
EXPOSE 3000
ENTRYPOINT ["/portfolio-server"]
