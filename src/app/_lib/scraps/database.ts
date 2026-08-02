import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getScrapsDatabase(): D1Database {
  return getCloudflareContext().env.SCRAPS_DB;
}

export function getAccessConfiguration() {
  const { env } = getCloudflareContext();

  return {
    teamDomain: env.ACCESS_TEAM_DOMAIN,
    audience: env.ACCESS_AUD,
  };
}
