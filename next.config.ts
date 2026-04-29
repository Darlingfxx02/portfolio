import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Native module — keep it out of the bundler.
  serverExternalPackages: ["better-sqlite3"],
  // Make sure the native binding ships in `.next/standalone/`.
  outputFileTracingIncludes: {
    "/*": [
      "node_modules/better-sqlite3/build/Release/*.node",
      "node_modules/better-sqlite3/lib/**/*",
      "node_modules/better-sqlite3/package.json",
      "node_modules/bindings/**/*",
      "node_modules/file-uri-to-path/**/*",
    ],
  },
};

export default nextConfig;
