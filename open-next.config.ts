import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  // Blog articles change only at build time; Scrap routes remain force-dynamic.
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
