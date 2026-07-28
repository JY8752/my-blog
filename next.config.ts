import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const config: NextConfig = {
  turbopack: {
    resolveAlias: {
      shiki: "./src/lib/shiki.ts",
    },
  },
};

export default config;
