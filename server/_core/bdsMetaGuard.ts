const ALLOWED_BDS_META_HOSTS = new Set([
  "earth-aligned-ai-lab.exponentialroadmap.org",
  "contact-us.exponentialroadmap.org",
  "psm.exponentialroadmap.org",
  "taxonomy.exponentialroadmap.org",
  "framework.exponentialroadmap.org",
  "crocodile.exponentialroadmap.org",
  "platform.exponentialroadmap.org",
  "methodology.exponentialroadmap.org",
  "trust.exponentialroadmap.org",
]);

/**
 * Returns a permitted registered-project metadata URL, or null for every other
 * target. Keep this guard narrow: the proxy exists only for bds-meta.json.
 */
export function getAllowedBdsMetaTarget(raw: string): URL | null {
  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return null;
  }

  const isRegisteredMetadataFile =
    target.protocol === "https:" &&
    target.port === "" &&
    target.username === "" &&
    target.password === "" &&
    target.pathname === "/bds-meta.json" &&
    target.search === "" &&
    target.hash === "" &&
    ALLOWED_BDS_META_HOSTS.has(target.hostname);

  return isRegisteredMetadataFile ? target : null;
}
