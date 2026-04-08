/**
 * Canonical pillar colours for the Exponential Framework
 * Source: ERI Brand Design System Feedback — 20.3.2026
 *
 * Corrected values replacing previous incorrect hex codes.
 * Always import from this file to ensure colour consistency.
 * Never hardcode pillar colours elsewhere.
 */

export const pillarColors = {
  pillar1: "#9aa08c",  // Sage — Cut Operational Emissions      RGB 154, 160, 140
  pillar2: "#17b7dd",  // Cyan — Decarbonize Value Chain         RGB 23, 183, 221
  pillar3: "#00ac58",  // Green — Build & Scale Solutions        RGB 0, 172, 88
  pillar4: "#ff8b00",  // Amber — Mobilize Finance & Investment  RGB 255, 139, 0
  pillar5: "#ff5133",  // Red-orange — Shape Policy & Narrative  RGB 255, 81, 51
} as const;

// Tailwind-compatible inline style bg values
export const pillarBgClasses = {
  pillar1: "bg-[#9aa08c]",
  pillar2: "bg-[#17b7dd]",
  pillar3: "bg-[#00ac58]",
  pillar4: "bg-[#ff8b00]",
  pillar5: "bg-[#ff5133]",
} as const;

// Light background variants (10% opacity)
export const pillarLightBgClasses = {
  pillar1: "bg-[#9aa08c]/10",
  pillar2: "bg-[#17b7dd]/10",
  pillar3: "bg-[#00ac58]/10",
  pillar4: "bg-[#ff8b00]/10",
  pillar5: "bg-[#ff5133]/10",
} as const;

// Pillar metadata
export const pillarMeta = [
  { id: 1, key: "pillar1", name: "Cut Operational Emissions",       shortName: "Operations",  color: pillarColors.pillar1 },
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
