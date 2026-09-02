# Dresser for Figma — local development

1. In Figma Desktop choose **Plugins → Development → New plugin…**, create a plugin, and copy its numeric ID.
2. Run `FIGMA_PLUGIN_ID=<numeric-id> pnpm dev:figma-plugin`.
3. Import the printed `figma-plugin/manifest.json`, select exactly one Frame, then open Dresser.

The command builds a secret-free bootstrap, sandboxed main bundle, and self-contained UI, then starts the fixed loopback companion at `127.0.0.1:4783`. The browser session is an ephemeral HttpOnly cookie; it is never available to plugin JavaScript. Stopping or restarting the companion invalidates it.

This is a local development plugin. Do not publish the generated manifest or `dist`; both are ignored. Figma Community publication and remote rendering are outside scope.
