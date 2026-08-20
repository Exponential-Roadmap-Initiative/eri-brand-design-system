/**
 * Returns true only when a project uses the exact released component version
 * advertised by BDS. Floating references such as `main` are deliberately not
 * treated as reproducible or current.
 */
export function isCurrentReleasedComponentPin(
  pin: string | undefined,
  latestVersion: string,
): boolean {
  return Boolean(pin) && pin === latestVersion;
}
