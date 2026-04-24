/**
 * BDS Alignment Metadata — type definitions
 * Schema version 1.0 (extended with self-reported compliance fields)
 *
 * Each ERI project publishes a static bds-meta.json at:
 *   client/public/bds-meta.json  →  https://{project-domain}/bds-meta.json
 *
 * The BDS Alignment Tracker fetches this file from every registered project
 * and renders a live compliance dashboard.
 */

export type CssImportMethod = "dist" | "source-workaround" | "none";
export type OverallStatus = "green" | "amber" | "red" | "unknown";

/**
 * Canonical component names exported from @eri/components.
 * These must match the actual exports in packages/eri-components/src/index.ts.
 */
export type ComponentName =
  | "EriAppHeader"
  | "EriPageLayout"
  | "EriHeroSection"
  | "EriAppFooter"
  | "EriStatusBadge"
  | "EriContactUsButton";

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

/**
 * Self-reported System Operations compliance fields.
 * Set after running the Project Alignment Checklist.
 * Missing fields are shown as "—" in the tracker (not as failures).
 */
export interface SystemOpsCompliance {
  /** PROJECT-CONTEXT.md exists at project root and was read at task start */
  projectContextExists?: boolean;
  /** Manus platform project instructions were read before acting */
  manusPlatformInstructionsRead?: boolean;
}

/**
 * Self-reported Brand compliance fields.
 * Set after running the Project Alignment Checklist.
 */
export interface BrandCompliance {
  /** All brand colour values use exact hex tokens — no Tailwind colour names */
  hexTokensOnly?: boolean;
  /** Heading font is Archivo loaded from Google Fonts CDN */
  archivoHeadings?: boolean;
  /** Body font is Open Sans loaded from Google Fonts CDN */
  openSansBody?: boolean;
  /** Body paragraph text uses #383838 (not #232323) on white/light backgrounds */
  bodyTextHex383838?: boolean;
  /** All filled CTA buttons use #93E07D (Accent Lime) */
  ctaAccentLime?: boolean;
  /** No structural Tailwind grey classes (text-gray-*, bg-white, bg-gray-*) used for text or backgrounds — semantic tokens only */
  noHardcodedGreys?: boolean;
}

/**
 * Self-reported Layout compliance fields.
 * Set after running the Project Alignment Checklist.
 */
export interface LayoutCompliance {
  /** EriPageLayout wraps all public pages in App.tsx only — not in individual page files */
  eriPageLayoutInAppTsx?: boolean;
  /** showCTA={true} is passed explicitly on EriPageLayout — not relying on default */
  showCtaExplicit?: boolean;
  /** source, sourceLabel, and returnUrl are all passed when showCTA={true} */
  sourcePropsPresent?: boolean;
  /** No stale component names (EriNavDrawer, EriFooter) anywhere in the codebase */
  noStaleComponentNames?: boolean;
}

export interface BdsMeta {
  schemaVersion: "1.0";
  /** Short project code matching PROJECT_REGISTRY id */
  project: string;
  /** Full human-readable project name */
  displayName: string;
  /** Canonical deployed URL */
  url: string;
  /** Current @eri/components pin, e.g. "v2.11.1" or "main" */
  eriComponentsPin: string;
  /** How the pre-built CSS is imported */
  cssImportMethod: CssImportMethod;
  /** Per-component compliance status */
  components: Partial<Record<ComponentName, ComponentStatus>>;
  /** Self-reported System Operations compliance (optional) */
  systemOps?: SystemOpsCompliance;
  /** Self-reported Brand compliance (optional) */
  brand?: BrandCompliance;
  /** Self-reported Layout compliance (optional) */
  layout?: LayoutCompliance;
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
