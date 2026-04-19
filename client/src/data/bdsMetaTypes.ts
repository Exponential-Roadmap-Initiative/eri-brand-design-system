/**
 * BDS Alignment Metadata — type definitions
 * Schema version 1.0
 *
 * Each ERI project publishes a static bds-meta.json at:
 *   client/public/bds-meta.json  →  https://{project-domain}/bds-meta.json
 *
 * The BDS Alignment Tracker fetches this file from every registered project
 * and renders a live compliance dashboard.
 */

export type CssImportMethod = "dist" | "source-workaround" | "none";
export type OverallStatus = "green" | "amber" | "red" | "unknown";
export type ComponentName =
  | "EriAppHeader"
  | "EriPageLayout"
  | "EriHeroSection"
  | "EriNavDrawer"
  | "EriFooter";

export interface ComponentStatus {
  /** Whether the component is used in this project */
  used: boolean;
  /** Whether usage matches the BDS spec */
  compliant: boolean;
  /** For EriAppHeader only: the value passed to showCTA prop */
  showCTA?: string;
  /** Optional free-text note about this component's usage */
  note?: string;
}

export interface BdsMeta {
  schemaVersion: "1.0";
  /** Short project code matching PROJECT_REGISTRY id */
  project: string;
  /** Full human-readable project name */
  displayName: string;
  /** Canonical deployed URL */
  url: string;
  /** Current @eri/components pin, e.g. "v2.10.0" or "main" */
  eriComponentsPin: string;
  /** How the pre-built CSS is imported */
  cssImportMethod: CssImportMethod;
  /** Per-component compliance status */
  components: Partial<Record<ComponentName, ComponentStatus>>;
  /** List of known non-conformant patterns */
  knownViolations: string[];
  /** RAG overall status */
  overallStatus: OverallStatus;
  /** ISO date of last update */
  lastUpdated: string;
  /** Who last updated this file */
  updatedBy: string;
}

/** Represents the fetch result for a single project */
export interface ProjectFetchResult {
  projectId: string;
  url: string;
  status: "ok" | "error" | "loading";
  meta?: BdsMeta;
  error?: string;
}
