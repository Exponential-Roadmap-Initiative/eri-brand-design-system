/**
 * bdsSpec router — machine-readable ERI Brand Design System specification
 *
 * Public endpoint: GET /api/trpc/bdsSpec.getSpec
 * Returns the full ERI brand spec as structured JSON.
 * Mirrors the Holocen /api/trpc/brandIdentity.holocenSpec pattern.
 *
 * No authentication required — this is a public reference endpoint.
 */

import { publicProcedure, router } from "../_core/trpc";

const BDS_VERSION = "3.0.0";
const LAST_UPDATED = "2026-04-29";

export const bdsSpecRouter = router({
  getSpec: publicProcedure.query(() => {
    return {
      version: BDS_VERSION,
      lastUpdated: LAST_UPDATED,
      siteUrl: "https://bds.exponentialroadmap.org",
      skillUrl: "https://bds.exponentialroadmap.org/api/skill/latest",

      // ─── AI Agent handoff prompt ──────────────────────────────────────────
      handoff_prompt: `ERI BRAND DESIGN SYSTEM — MANDATORY SETUP (v${BDS_VERSION})

Before writing any CSS, Tailwind classes, or component code for any ERI surface,
complete the following steps in order. Do not skip any step.

STEP 0 — Fetch and read the live skill file
Run this command in the sandbox terminal, then read the file in full:
  curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\
    > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"

STEP 1 — Read or create PROJECT-CONTEXT.md in the project root
Every ERI project must have a PROJECT-CONTEXT.md at its root. Read it in full
before taking any action. If it does not exist, create one.

STEP 2 — Check client/public/bds-meta.json exists and is up to date
Fetch the live template from https://bds.exponentialroadmap.org/tracker
(scroll to "How this tracker works" section). Do not rely on the skill template.

STEP 3 — Install @eri/components
  pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.11.1&path:packages/eri-components"

STEP 4 — Use EriPageLayout as the top-level wrapper in App.tsx
Import: import { EriPageLayout } from '@eri/components';
Required props: appName, appId, showCTA={true}, showThemeToggle={true}

STEP 5 — Copy the canonical CSS token block into client/src/index.css
Fetch from: https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec
Use the semanticTokens.cssBlock field verbatim.

STEP 6 — Self-host fonts (GDPR-compliant)
Download WOFF2 files to client/public/fonts/ and add @font-face declarations
to index.css. See typography.fontFaceTemplate in this spec.
Remove any Google Fonts <link> tags from index.html.

STEP 7 — Implement the Cross-Site Theme System
ThemeContext.tsx, FOLC-prevention script, localStorage key "eri-theme".
See the skill's Cross-Site Theme System section for full implementation.

STEP 8 — Never use hardcoded structural colours
Use semantic tokens: bg-background, bg-card, text-foreground, border-border.
See darkModeRules in this spec for the complete rule table.

STEP 9 — Run the Project Alignment Checklist before closing any task
See https://bds.exponentialroadmap.org/tracker for the full checklist.`,

      // ─── Colours ──────────────────────────────────────────────────────────
      colors: {
        brand: [
          { name: "Primary Green",    hex: "#3ba559", cssVar: "--color-eri-green",      tailwind: "text-[#3ba559]",  role: "interactive elements, active nav, admin links, stat numbers" },
          { name: "Accent Lime",      hex: "#93E07D", cssVar: null,                     tailwind: "text-[#93E07D]",  role: "filled CTA buttons on dark bg, section eyebrow labels, uppercase tracking labels" },
          { name: "ERI Dark",         hex: "#232323", cssVar: "--color-eri-heading",     tailwind: "text-[#232323]",  role: "headings on light bg, header/footer background (always)" },
          { name: "Body Text",        hex: "#383838", cssVar: null,                     tailwind: "text-[#383838]",  role: "body paragraph text on white/light backgrounds" },
          { name: "Page Background",  hex: "#F9FAFB", cssVar: "--color-eri-page-bg",    tailwind: "bg-[#F9FAFB]",   role: "light mode page background only — use bg-background semantic token" },
          { name: "ERI Blue",         hex: "#00B8D4", cssVar: "--color-eri-blue",       tailwind: "text-[#00B8D4]",  role: "card category accent (slot 2) — left border + tint only, never full outline" },
        ],
        pillars: [
          { pillar: 1, name: "Renewable Energy",    hex: "#F59E0B", tintDark: "rgba(245,158,11,0.08)",  tintLight: "rgba(245,158,11,0.06)" },
          { pillar: 2, name: "Energy Efficiency",   hex: "#3B82F6", tintDark: "rgba(59,130,246,0.08)",  tintLight: "rgba(59,130,246,0.06)" },
          { pillar: 3, name: "Sustainable Land",    hex: "#10B981", tintDark: "rgba(16,185,129,0.08)",  tintLight: "rgba(16,185,129,0.06)" },
          { pillar: 4, name: "Industry & Cities",   hex: "#8B5CF6", tintDark: "rgba(139,92,246,0.08)",  tintLight: "rgba(139,92,246,0.06)" },
          { pillar: 5, name: "Consumption & Waste", hex: "#EF4444", tintDark: "rgba(239,68,68,0.08)",   tintLight: "rgba(239,68,68,0.06)" },
          { pillar: 6, name: "ERI Blue (general)",  hex: "#00B8D4", tintDark: "rgba(0,184,212,0.08)",   tintLight: "rgba(0,184,212,0.06)" },
        ],
        doNotUse: ["purple", "teal", "pink", "Tailwind colour names (e.g. text-green-500, bg-gray-900)"],
      },

      // ─── Typography ───────────────────────────────────────────────────────
      typography: {
        headingFont: "Archivo",
        bodyFont: "Open Sans",
        headingWeight: 800,
        bodyWeight: 400,
        bodyLineHeight: 1.6,
        bodySize: "16px",
        gdprCompliance: "Self-hosted WOFF2 — no external font requests. Remove Google Fonts <link> tags from index.html.",
        fontFiles: {
          archivo: [400, 500, 600, 700, 800],
          openSans: [400, 600, 700],
          location: "client/public/fonts/",
          naming: "Archivo-{weight}.woff2, OpenSans-{weight}.woff2",
        },
        fontFaceTemplate: `/* Add to client/src/index.css — replaces Google Fonts <link> tags */
/* Archivo */
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/Archivo-400.woff2') format('woff2'); }
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 500; font-display: swap; src: url('/fonts/Archivo-500.woff2') format('woff2'); }
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 600; font-display: swap; src: url('/fonts/Archivo-600.woff2') format('woff2'); }
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 700; font-display: swap; src: url('/fonts/Archivo-700.woff2') format('woff2'); }
@font-face { font-family: 'Archivo'; font-style: normal; font-weight: 800; font-display: swap; src: url('/fonts/Archivo-800.woff2') format('woff2'); }
/* Open Sans */
@font-face { font-family: 'Open Sans'; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/OpenSans-400.woff2') format('woff2'); }
@font-face { font-family: 'Open Sans'; font-style: normal; font-weight: 600; font-display: swap; src: url('/fonts/OpenSans-600.woff2') format('woff2'); }
@font-face { font-family: 'Open Sans'; font-style: normal; font-weight: 700; font-display: swap; src: url('/fonts/OpenSans-700.woff2') format('woff2'); }`,
        doNotUse: ["Inter", "Roboto", "font-weight 600 for headings (use 800)"],
      },

      // ─── Semantic tokens ──────────────────────────────────────────────────
      semanticTokens: {
        description: "Copy the cssBlock verbatim into client/src/index.css. Never invent values.",
        lightMode: {
          "--background": { value: "oklch(0.98 0 0)", hex: "#F9FAFB", usage: "page background" },
          "--foreground": { value: "oklch(0.24 0.005 285)", hex: "#383838", usage: "body text" },
          "--card":       { value: "oklch(1 0 0)", hex: "#FFFFFF", usage: "card background" },
          "--border":     { value: "oklch(0.91 0 0)", hex: "#E5E7EB", usage: "structural borders" },
          "--muted":      { value: "oklch(0.96 0 0)", hex: "#F3F4F6", usage: "muted section background" },
          "--muted-foreground": { value: "oklch(0.45 0.01 247)", hex: "#6B7280", usage: "secondary text" },
        },
        darkMode: {
          "--background": { value: "oklch(0.09 0 0)", hex: "#111111", usage: "page background" },
          "--foreground": { value: "oklch(0.97 0 0)", hex: "#F9FAFB", usage: "body text" },
          "--card":       { value: "oklch(0.16 0 0)", hex: "#222222", usage: "card background" },
          "--border":     { value: "oklch(0.28 0 0)", hex: "#3d3d3d", usage: "structural borders" },
          "--muted":      { value: "oklch(0.17 0 0)", hex: "#252525", usage: "muted section background" },
          "--muted-foreground": { value: "oklch(0.65 0.01 247)", hex: "#9CA3AF", usage: "secondary text" },
        },
        rule: "NEVER use hardcoded hex for structural colours. Always use semantic Tailwind classes: bg-background, bg-card, text-foreground, text-muted-foreground, border-border.",
      },

      // ─── Dark mode rules ──────────────────────────────────────────────────
      darkModeRules: [
        { rule: "Never use bg-white or bg-[#F9FAFB] for structural backgrounds",      correct: "bg-background",              antiPattern: "bg-white, bg-[#F9FAFB], bg-gray-50" },
        { rule: "Never use text-gray-900 or text-[#383838] for structural text",       correct: "text-foreground",            antiPattern: "text-gray-900, text-gray-800, text-[#383838]" },
        { rule: "Never use border-gray-200 for structural borders",                    correct: "border-border",              antiPattern: "border-gray-200, border-[#e5e7eb]" },
        { rule: "Never use bg-white for card backgrounds",                             correct: "bg-card",                    antiPattern: "bg-white, bg-[#FFFFFF]" },
        { rule: "Never use inline style={{ backgroundColor: '#F9FAFB' }} on structural elements", correct: "className=\"bg-background\"", antiPattern: "style={{ backgroundColor: T.offWhite }}" },
        { rule: "Never use bg-{colour}-50/100 without dark: variant",                 correct: "bg-green-100 dark:bg-green-900/30", antiPattern: "bg-green-100 (alone)" },
        { rule: "Never use text-{colour}-700/800 without dark: variant",              correct: "text-green-800 dark:text-green-300", antiPattern: "text-green-800 (alone)" },
        { rule: "Never use border-{colour}-200 without dark: variant",                correct: "border-amber-200 dark:border-amber-700/50", antiPattern: "border-amber-200 (alone)" },
        { rule: "Semantic tokens are always safe — no dark: variant needed",           correct: "bg-muted text-foreground border-border", antiPattern: "none" },
        { rule: "Header and footer are always #232323 — never respond to theme",       correct: "bg-[#232323] (hardcoded, intentional)", antiPattern: "bg-background on header/footer" },
        { rule: "Never use dark green (#0d2b1e, #1a3c2a) for dark mode backgrounds",  correct: "bg-background (oklch(0.09 0 0) = #111111)", antiPattern: "bg-[#0d2b1e], bg-[#1a3c2a]" },
        { rule: "localStorage theme key must be exactly 'eri-theme'",                 correct: "localStorage.setItem('eri-theme', theme)", antiPattern: "'theme', 'hal-theme', 'dark-mode'" },
      ],

      // ─── Card accent colours ──────────────────────────────────────────────
      cardAccentColors: {
        rule: "Left border (4px) + background tint (8% opacity) only. Never full four-side coloured outlines.",
        eyebrowRule: "Section eyebrow labels are ALWAYS #93E07D (Accent Lime) regardless of card accent colour.",
        pattern: `{/* ✅ Canonical category accent card */}
<div style={{
  borderLeft: '4px solid #3ba559',
  backgroundColor: 'rgba(59,165,89,0.08)',
}} className="bg-card rounded-lg p-6">`,
        palette: [
          { slot: 1, name: "Primary Green",  hex: "#3ba559", tintDark: "rgba(59,165,89,0.08)",  tintLight: "rgba(59,165,89,0.06)",  useCase: "Applications, primary content" },
          { slot: 2, name: "ERI Blue",       hex: "#00B8D4", tintDark: "rgba(0,184,212,0.08)",  tintLight: "rgba(0,184,212,0.06)",  useCase: "Strategic Frameworks, data" },
          { slot: 3, name: "Amber",          hex: "#F59E0B", tintDark: "rgba(245,158,11,0.08)", tintLight: "rgba(245,158,11,0.06)", useCase: "Pillar 1 / Energy" },
          { slot: 4, name: "Blue",           hex: "#3B82F6", tintDark: "rgba(59,130,246,0.08)", tintLight: "rgba(59,130,246,0.06)", useCase: "Pillar 2 / Efficiency" },
          { slot: 5, name: "Emerald",        hex: "#10B981", tintDark: "rgba(16,185,129,0.08)", tintLight: "rgba(16,185,129,0.06)", useCase: "Pillar 3 / Land" },
          { slot: 6, name: "Violet",         hex: "#8B5CF6", tintDark: "rgba(139,92,246,0.08)", tintLight: "rgba(139,92,246,0.06)", useCase: "Pillar 4 / Industry" },
        ],
      },

      // ─── Components ───────────────────────────────────────────────────────
      components: {
        npmInstall: 'pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.11.1&path:packages/eri-components"',
        latestVersion: "v2.11.1",
        available: ["EriPageLayout", "EriHeroSection", "EriAppHeader", "EriAppFooter", "EriStatusBadge", "EriContactUsButton"],
        requiredProps: {
          EriPageLayout: ["appName (string)", "appId (string)", "showCTA={true}", "showThemeToggle={true}"],
        },
        cssImport: "@import \"@eri/components/dist/eri-components.css\"; /* Add to top of index.css */",
        scope: "Public-facing ERI apps only (Taxonomy, PSM, HAL, Trust, future apps). BDS site is exempt.",
      },

      // ─── Navigation tiers ─────────────────────────────────────────────────
      navigationTiers: {
        overlay: {
          background: "#232323",
          width: "w-80 (320px)",
          backdrop: "bg-black/50",
          transition: "translate-x-full → translate-x-0, duration-300 ease-in-out",
          closeButton: "size-9 rounded-md hover:bg-white/10, Lucide X icon",
          inactiveItem: "text-white/80 hover:text-white hover:bg-white/5 rounded-md px-3 py-2",
          activeItem: "text-[#3ba559] bg-[#3ba559]/10 font-medium rounded-md px-3 py-2",
          adminLinks: "text-[#3ba559] + Lucide ExternalLink icon (size 14)",
          separator: "border-t border-white/10 my-2",
          userFooter: "name text-white text-sm font-medium, email text-white/60 text-xs, role badge #3ba559, Log Out border border-white/20",
          rule: "NEVER use pure black (#000000) or near-black for the overlay background. Always use #232323.",
        },
      },

      // ─── bds-meta.json schema ─────────────────────────────────────────────
      bdsMeta: {
        schemaVersion: "1.1",
        changelogUrl: "https://bds.exponentialroadmap.org/bds-meta-changelog.json",
        trackerUrl: "https://bds.exponentialroadmap.org/tracker",
        rule: "Always fetch the live template from the tracker page before writing or updating bds-meta.json.",
        fields: {
          systemOps: ["projectContextMd", "manusProjectInstructions", "bdsMeta"],
          theme: ["darkDefault", "themeToggle", "eriThemeKey", "noFolc", "semanticTokens"],
          brand: ["hexTokensOnly", "archivoHeadings", "openSansBody", "bodyTextHex383838", "ctaAccentLime", "noHardcodedGreys", "cardAccentPattern", "eyebrowAccentLime"],
          layout: ["eriPageLayout", "singleHeaderFooter", "noStaleComponentNames", "overlayBackground"],
          components: {
            EriPageLayout: ["used", "version", "knownViolations"],
            EriHeroSection: ["used", "version", "knownViolations"],
            EriAppHeader: ["used", "version", "knownViolations"],
            EriAppFooter: ["used", "version", "knownViolations"],
            EriStatusBadge: ["used", "version", "knownViolations"],
            EriContactUsButton: ["used", "version", "knownViolations"],
          },
        },
      },

      // ─── Canonical source files ───────────────────────────────────────────
      canonicalSourceFiles: [
        { file: "client/src/pages/BrandDesignSystem.tsx",          description: "Canonical reference page — every BDS rule applied in practice",    githubUrl: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/blob/main/client/src/pages/BrandDesignSystem.tsx" },
        { file: "client/src/components/NavigationPatterns.tsx",    description: "Canonical nav overlay implementation with all tier specs",          githubUrl: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/blob/main/client/src/components/NavigationPatterns.tsx" },
        { file: "client/src/index.css",                            description: "CSS variables — semantic tokens, dark mode, @font-face declarations", githubUrl: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/blob/main/client/src/index.css" },
        { file: "packages/eri-components/src/EriPageLayout.tsx",   description: "Full-page layout wrapper — header, footer, theme toggle",           githubUrl: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/blob/main/packages/eri-components/src/EriPageLayout.tsx" },
        { file: "packages/eri-components/src/EriAppHeader.tsx",    description: "64px fixed header — logo, nav, hamburger, theme toggle",            githubUrl: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/blob/main/packages/eri-components/src/EriAppHeader.tsx" },
      ],
    };
  }),
});
