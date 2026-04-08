/**
 * Canonical pillar colours for the Exponential Framework
 * Source: ERI Brand Design System Feedback — 20.3.2026
 *
 * Corrected values replacing previous incorrect hex codes.
 * Always import from this file to ensure colour consistency.
 * Never hardcode pillar colours elsewhere.
 *
 * TINT SYSTEM (modern treatment):
 *   Background: very light tint (~10–12% of the pillar hue)
 *   Text / border / accent: full-saturation pillar colour
 *   Icon fill: full-saturation pillar colour on tint background
 *   Bold fills (CTA buttons, active states): full-saturation pillar colour
 */

export const pillarColors = {
  pillar1: "#9aa08c",  // Sage — Cut Operational Emissions      RGB 154, 160, 140
  pillar2: "#17b7dd",  // Cyan — Decarbonize Value Chain         RGB 23, 183, 221
  pillar3: "#00ac58",  // Green — Build & Scale Solutions        RGB 0, 172, 88
  pillar4: "#ff8b00",  // Amber — Mobilize Finance & Investment  RGB 255, 139, 0
  pillar5: "#ff5133",  // Red-orange — Shape Policy & Narrative  RGB 255, 81, 51
} as const;

/**
 * Explicit light-tint hex values (≈ 10–12% opacity on white).
 * Use as background colours for pillar badges, cards, and table cells.
 * Pair with the full-saturation colour for text/border.
 */
export const pillarTints = {
  pillar1: "#f0f1ee",  // Sage tint    — very light warm grey-green
  pillar2: "#e6f7fc",  // Cyan tint    — very light sky blue
  pillar3: "#e6f7ee",  // Green tint   — very light mint
  pillar4: "#fff3e0",  // Amber tint   — very light warm yellow
  pillar5: "#fdecea",  // Red tint     — very light blush
} as const;

// Tailwind-compatible inline style bg values (solid fill — for icons, CTAs, active states)
export const pillarBgClasses = {
  pillar1: "bg-[#9aa08c]",
  pillar2: "bg-[#17b7dd]",
  pillar3: "bg-[#00ac58]",
  pillar4: "bg-[#ff8b00]",
  pillar5: "bg-[#ff5133]",
} as const;

// Light tint background classes — for badges, cards, table cells
export const pillarTintBgClasses = {
  pillar1: "bg-[#f0f1ee]",
  pillar2: "bg-[#e6f7fc]",
  pillar3: "bg-[#e6f7ee]",
  pillar4: "bg-[#fff3e0]",
  pillar5: "bg-[#fdecea]",
} as const;

// Legacy alias (kept for backward compatibility)
export const pillarLightBgClasses = pillarTintBgClasses;

// Pillar metadata
export const pillarMeta = [
  { id: 1, key: "pillar1", name: "Cut Operational Emissions",       shortName: "Operations",  color: pillarColors.pillar1, tint: pillarTints.pillar1 },
  { id: 2, key: "pillar2", name: "Decarbonize Value Chain",         shortName: "Value Chain", color: pillarColors.pillar2, tint: pillarTints.pillar2 },
  { id: 3, key: "pillar3", name: "Build & Scale Solutions",         shortName: "Solutions",   color: pillarColors.pillar3, tint: pillarTints.pillar3 },
  { id: 4, key: "pillar4", name: "Mobilize Finance & Investment",   shortName: "Finance",     color: pillarColors.pillar4, tint: pillarTints.pillar4 },
  { id: 5, key: "pillar5", name: "Shape Policy & Narrative",        shortName: "Policy",      color: pillarColors.pillar5, tint: pillarTints.pillar5 },
] as const;

export function getPillarColor(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarColors;
  return pillarColors[key] || pillarColors.pillar1;
}

export function getPillarTint(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarTints;
  return pillarTints[key] || pillarTints.pillar1;
}

export function getPillarBgClass(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarBgClasses;
  return pillarBgClasses[key] || pillarBgClasses.pillar1;
}

export function getPillarTintBgClass(pillarNumber: number): string {
  const key = `pillar${pillarNumber}` as keyof typeof pillarTintBgClasses;
  return pillarTintBgClasses[key] || pillarTintBgClasses.pillar1;
}

export type PillarKey = keyof typeof pillarColors;
