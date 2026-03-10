/**
 * Canonical pillar colors for the Exponential Framework
 * Source: eri-brand-package/source/pillarColors.ts
 *
 * Always import from this file to ensure color consistency.
 * Never hardcode pillar colours elsewhere.
 */

export const pillarColors = {
  pillar1: "#6B8068",  // Gray-green — Cut Operational Emissions
  pillar2: "#00B8D4",  // Cyan — Decarbonize Value Chain
  pillar3: "#3ba559",  // Green — Build & Scale Solutions (= ERI primary green)
  pillar4: "#F97316",  // Orange — Mobilize Finance & Investment
  pillar5: "#EF4444",  // Red — Shape Policy & Narrative
} as const;

// Tailwind-compatible inline style bg values
export const pillarBgClasses = {
  pillar1: "bg-[#6B8068]",
  pillar2: "bg-[#00B8D4]",
  pillar3: "bg-[#3ba559]",
  pillar4: "bg-[#F97316]",
  pillar5: "bg-[#EF4444]",
} as const;

// Light background variants (10% opacity)
export const pillarLightBgClasses = {
  pillar1: "bg-[#6B8068]/10",
  pillar2: "bg-[#00B8D4]/10",
  pillar3: "bg-[#3ba559]/10",
  pillar4: "bg-[#F97316]/10",
  pillar5: "bg-[#EF4444]/10",
} as const;

// Pillar metadata
export const pillarMeta = [
  { id: 1, key: "pillar1", name: "Cut Operational Emissions",       shortName: "Operations", color: pillarColors.pillar1 },
  { id: 2, key: "pillar2", name: "Decarbonize Value Chain",         shortName: "Value Chain", color: pillarColors.pillar2 },
  { id: 3, key: "pillar3", name: "Build & Scale Solutions",         shortName: "Solutions",   color: pillarColors.pillar3 },
  { id: 4, key: "pillar4", name: "Mobilize Finance & Investment",   shortName: "Finance",     color: pillarColors.pillar4 },
  { id: 5, key: "pillar5", name: "Shape Policy & Narrative",        shortName: "Policy",      color: pillarColors.pillar5 },
] as const;

export function getPillarColor(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarColors;
  return pillarColors[key] || pillarColors.pillar1;
}

export function getPillarBgClass(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarBgClasses;
  return pillarBgClasses[key] || pillarBgClasses.pillar1;
}

export type PillarKey = keyof typeof pillarColors;
