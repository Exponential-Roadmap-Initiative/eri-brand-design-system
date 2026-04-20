/**
 * ERI Project Registry
 * Central list of all ERI projects tracked by the BDS Alignment Tracker.
 * To add a new project: append an entry to this array. No other changes needed.
 */

export interface ProjectRegistryEntry {
  /** Short code used in bds-meta.json */
  id: string;
  /** Full human-readable name */
  displayName: string;
  /** Canonical deployed URL (no trailing slash) */
  url: string;
  /** Brief description of the project */
  description: string;
  /** Whether the project is live / deployed */
  status: "live" | "in-development" | "planned";
}

export const PROJECT_REGISTRY: ProjectRegistryEntry[] = [
  {
    id: "HAL",
    displayName: "Human-AI Lab",
    url: "https://human-ai-lab.exponentialroadmap.org",
    description: "Main ERI lab website showcasing human-AI collaboration research.",
    status: "live",
  },
  {
    id: "ContactUs",
    displayName: "Contact Us",
    url: "https://contact-us.exponentialroadmap.org",
    description: "ERI contact and enquiry portal.",
    status: "live",
  },
  {
    id: "PSM",
    displayName: "Professional Services Matrix",
    url: "https://psm.exponentialroadmap.org",
    description: "ERI professional services and partnership enquiry platform.",
    status: "live",
  },
  {
    id: "Taxonomy",
    displayName: "Exponential Taxonomy",
    url: "https://taxonomy.exponentialroadmap.org",
    description: "Exponential climate solutions taxonomy and classification system.",
    status: "live",
  },
  {
    id: "Framework",
    displayName: "Exponential Framework",
    url: "https://framework.exponentialroadmap.org",
    description: "The ERI Exponential Roadmap framework and methodology.",
    status: "live",
  },
  {
    id: "Crocodile",
    displayName: "Crocodile Economics",
    url: "https://crocodile.exponentialroadmap.org",
    description: "Crocodile Economics visualisation and education tool.",
    status: "live",
  },
  {
    id: "Platform",
    displayName: "Exponential Platform",
    url: "https://platform.exponentialroadmap.org",
    description: "ERI collaborative platform for exponential solutions.",
    status: "live",
  },
  {
    id: "Methodology",
    displayName: "ERI Methodology Hub",
    url: "https://methodology.exponentialroadmap.org",
    description: "Methodology documentation and guidance hub.",
    status: "in-development",
  },
  {
    id: "Trust",
    displayName: "Trust & Security",
    url: "https://trust.exponentialroadmap.org",
    description: "ERI trust, security, and data integrity information.",
    status: "in-development",
  },
];

/** URL to fetch bds-meta.json from a given project.
 *  Routes through the server-side proxy so the browser never makes a
 *  cross-origin request — CORS headers on the target site are irrelevant.
 */
export function getBdsMetaUrl(projectUrl: string): string {
  const target = encodeURIComponent(`${projectUrl}/bds-meta.json`);
  return `/api/fetch-bds-meta?url=${target}`;
}
