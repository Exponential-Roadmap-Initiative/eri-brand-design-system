/**
 * NewProject.tsx — "Start a Project" onboarding page
 *
 * Audience: Manus AI agents and developers starting a new ERI application.
 * Purpose:  Provide the canonical setup sequence, copy-paste project instructions,
 *           and track-specific guides — all in one place.
 *
 * Design rules:
 * - Uses PublicLayout (same wrapper as BrandDesignSystem and AlignmentTracker)
 * - Semantic tokens only — no hardcoded structural colours
 * - Two tracks: Track 1 (static/Tier B) and Track 2 (full-stack/Tier A)
 * - Zero duplication of BDS content — links to existing sections instead
 */
import { useState } from "react";
import { Copy, Check, ExternalLink, Rocket, Layers, Zap, BookOpen, Terminal, Package, FileText, ChevronRight } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

// ─── Copy-to-clipboard hook ───────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  };
  return { copied, copy };
}

// ─── CopyBlock component ──────────────────────────────────────────────────────
function CopyBlock({ id, text, label }: { id: string; text: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative group">
      {label && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      )}
      <pre className="bg-[#232323] text-[#93E07D] text-sm rounded-lg p-4 pr-12 overflow-x-auto leading-relaxed whitespace-pre-wrap font-mono">
        {text}
      </pre>
      <button
        onClick={() => copy(text, id)}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
        aria-label="Copy to clipboard"
      >
        {copied === id ? <Check className="w-4 h-4 text-[#93E07D]" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Track 1 project instructions ────────────────────────────────────────────
const TRACK1_INSTRUCTIONS = `ERI PROJECT SETUP — TRACK 1 (Static / Tier B)

You are building a public-facing ERI application. Before writing any code:

STEP 0 — Update and read the ERI brand skill
  curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\
    > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"
Then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full.

STEP 1 — Read or create PROJECT-CONTEXT.md in the project root
Every ERI project must have a PROJECT-CONTEXT.md. Read it before acting.
If it does not exist, create one using the seed template at:
https://bds.exponentialroadmap.org/tracker (System Operations section).

STEP 2 — Check client/public/bds-meta.json exists and is up to date
Fetch the live template from https://bds.exponentialroadmap.org/tracker
(scroll to "How this tracker works"). Do not use the template in the skill.

STEP 3 — Install @eri/components
  pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.17.0&path:packages/eri-components"

STEP 3b — Add the CSS import (FIRST line in client/src/index.css)
  @import "@eri/components/dist/eri-components.css";

STEP 4 — Use EriPageLayout as the top-level wrapper in App.tsx
  import { EriPageLayout } from '@eri/components';
  Required props: appName, appId, showCTA={true}, showThemeToggle={true},
                  headerTheme="auto", returnUrl (hardcoded production URL)

STEP 5 — Copy the canonical CSS token block into client/src/index.css
  Fetch from: https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec
  Use the semanticTokens.cssBlock field verbatim.

STEP 6 — Self-host fonts (GDPR-compliant — no Google Fonts CDN)
  Download WOFF2 files to client/public/fonts/
  Add @font-face declarations to index.css.
  See typography.fontFaceTemplate in the bdsSpec endpoint.

STEP 7 — Implement the Cross-Site Theme System
  ThemeContext.tsx, FOLC-prevention script, localStorage key "eri-theme".
  DEFAULT_THEME = "light" (from v2.17.0).
  See the skill's Cross-Site Theme System section for full implementation.

STEP 8 — Run the Project Alignment Checklist before closing any task
  https://bds.exponentialroadmap.org/tracker

STEP 9 — After pnpm add or webdev_add_feature: clear Vite cache
  rm -rf node_modules/.vite
  Then restart the dev server and hard-reload the browser (Cmd+Shift+R).`;

// ─── Track 2 project instructions ────────────────────────────────────────────
const TRACK2_INSTRUCTIONS = `ERI PROJECT SETUP — TRACK 2 (Full-Stack / Tier A)

You are building a full-stack ERI application (tRPC + database + auth).
Complete Track 1 steps first, then add:

TRACK 2 ADDITIONS

A — Server-side tRPC router for brand spec
  Add a bdsSpec router (see server/routers/bdsSpec.ts on the BDS site for
  the canonical pattern). Expose it at /api/trpc/bdsSpec.getSpec.

B — Database schema
  Follow the ERI database-design skill before writing any schema.
  Store UTC timestamps as Unix milliseconds. Never store file bytes in DB.

C — Authentication
  Use protectedProcedure for all user-specific data.
  Use publicProcedure for brand/reference data.
  Never expose JWT_SECRET or BUILT_IN_FORGE_API_KEY to the client.

D — Multi-tenancy
  If the app has company workspaces, apply row-level isolation on every
  query. See the eri-user-management skill for the canonical pattern.

E — bds-meta.json
  Full-stack apps must still publish client/public/bds-meta.json.
  The tracker at https://bds.exponentialroadmap.org/tracker fetches it
  from the production domain.

REMINDER — Vite cache
  After any dependency install or webdev_add_feature upgrade:
    rm -rf node_modules/.vite
  Then restart the dev server. Stale Vite pre-bundle cache causes blank
  pages with no error messages — this is the most common failure mode.`;

// ─── Setup step cards ─────────────────────────────────────────────────────────
const SETUP_STEPS = [
  {
    number: "01",
    icon: Terminal,
    title: "Update the brand skill",
    description: "Fetch the latest eri-bds-reference skill from the CDN. This is mandatory before writing any code — the skill contains colour tokens, component specs, and known errors not in AI training data.",
    code: `curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\\n  > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"`,
    codeId: "step-01",
  },
  {
    number: "02",
    icon: FileText,
    title: "Read PROJECT-CONTEXT.md",
    description: "Every ERI project has a PROJECT-CONTEXT.md at its root. Read it before taking any action — it contains canonical decisions, known errors, and pending work that survive context compaction.",
    code: `cat PROJECT-CONTEXT.md`,
    codeId: "step-02",
  },
  {
    number: "03",
    icon: Package,
    title: "Install @eri/components",
    description: "The canonical component package. Contains EriPageLayout, EriAppHeader, EriHeroSection, EriAppFooter, EriStatusBadge, EriContactUsButton, and EriCrocodileChart. Pin to a stable release.",
    code: `pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.17.0&path:packages/eri-components"`,
    codeId: "step-03",
  },
  {
    number: "04",
    icon: Layers,
    title: "Add the CSS import",
    description: "This is the single most common failure point. Add this as the FIRST line in client/src/index.css, before any @tailwind or @theme directives. Without it, all components render without ERI styles.",
    code: `@import "@eri/components/dist/eri-components.css";\n/* Add this as the very first line in index.css */`,
    codeId: "step-04",
  },
  {
    number: "05",
    icon: Zap,
    title: "Clear Vite cache after installs",
    description: "After any pnpm add or webdev_add_feature upgrade, clear the Vite pre-bundle cache. Stale cache causes blank pages with no error messages — the most common failure mode in ERI projects.",
    code: `rm -rf node_modules/.vite\n# Then restart the dev server and hard-reload (Cmd+Shift+R)`,
    codeId: "step-05",
  },
];

// ─── Component list ───────────────────────────────────────────────────────────
const COMPONENTS = [
  { name: "EriPageLayout",      purpose: "Full-page wrapper — renders header and footer once. Use in App.tsx only." },
  { name: "EriAppHeader",       purpose: "Fixed 64px header — ERI logo, app name, status badge, theme toggle, CTA." },
  { name: "EriHeroSection",     purpose: "Full-viewport hero — S-curve image, overlay, headline, CTAs." },
  { name: "EriAppFooter",       purpose: "Four-column dark footer — About · Newsletter · Follow us · Contact us." },
  { name: "EriStatusBadge",     purpose: "Transparent pill badge — ALPHA / BETA / PREVIEW / LIVE." },
  { name: "EriContactUsButton", purpose: "Accent Lime CTA linking to the shared ERI contact service." },
  { name: "EriCrocodileChart",  purpose: "Crocodile Economy decoupling chart — pure SVG, zero dependencies." },
];

// ─── Quick links ──────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Standard Components",    href: "/#standard-components",    description: "Full component docs with live previews" },
  { label: "Machine Instructions",   href: "/#ai-instructions",        description: "AI-readable spec and setup checklist" },
  { label: "Project Alignment Tracker", href: "/tracker",             description: "Check your project against the BDS" },
  { label: "Visual Identity",        href: "/#visual-identity",        description: "Colour tokens and pillar palette" },
  { label: "Typography",             href: "/#typography",             description: "Archivo + Open Sans, self-hosted WOFF2" },
  { label: "Surface Modes",          href: "/#surface-modes",          description: "Light/dark theme system and FOLC script" },
  { label: "bdsSpec API",            href: "https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec", description: "Machine-readable brand spec JSON", external: true },
  { label: "GitHub — eri-components", href: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/tree/main/packages/eri-components", description: "Component source code", external: true },
];

// ─── Page component ───────────────────────────────────────────────────────────
export default function NewProject() {
  const [activeTrack, setActiveTrack] = useState<"track1" | "track2">("track1");
  const { copied, copy } = useCopy();

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#232323] text-white pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-3">
            ERI Brand Design System
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Start a Project
          </h1>
          <p className="text-lg text-white/75 max-w-2xl leading-relaxed">
            The canonical setup sequence for any new ERI application — whether you are a Manus AI agent
            or a developer. Follow these steps before writing any code.
          </p>
        </div>
      </section>

      {/* ── Two-path intro ────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-xl font-extrabold text-foreground mb-2">Two paths through the setup</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Choose the track that matches your project type. Both tracks share the same mandatory first steps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Track 1 */}
            <div className="rounded-xl border-2 border-[#3ba559]/40 bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#3ba559]/15 text-[#3ba559] font-bold text-sm">A</span>
                <span className="font-semibold text-foreground text-sm">Brand &amp; Communications only</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Colour tokens, typography, logo usage, verbal identity. No component installation required.
              </p>
              <p className="text-xs text-muted-foreground mt-3 font-medium">
                Sections: Visual Identity → Verbal Identity
              </p>
            </div>
            {/* Track 2 */}
            <div className="rounded-xl border-2 border-[#93E07D]/40 bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#93E07D]/15 text-[#2d8a47] font-bold text-sm">B</span>
                <span className="font-semibold text-foreground text-sm">Building an ERI application</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Install <code className="text-xs bg-muted px-1 py-0.5 rounded font-mono">@eri/components</code> and follow the Standard Components section.
                Mandatory starting point for all ERI public-facing apps.
              </p>
              <p className="text-xs text-muted-foreground mt-3 font-medium">
                Sections: Standard Components → UI Components
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mandatory setup steps ─────────────────────────────────────────── */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Mandatory setup steps</h2>
          <p className="text-muted-foreground text-sm mb-8">
            These steps apply to every ERI project regardless of track. Do not skip any of them.
          </p>
          <div className="flex flex-col gap-6">
            {SETUP_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex gap-5">
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[#93E07D]" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground">{step.number}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                    <CopyBlock id={step.codeId} text={step.code} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Component overview ────────────────────────────────────────────── */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">The seven canonical components</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Every ERI public-facing application uses these components unchanged. Install once, import, and the
            layout, header, hero, footer, badges, contact button, and chart are all handled.{" "}
            <a href="/#standard-components" className="text-[#3ba559] hover:underline">
              Full docs with live previews →
            </a>
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">Component</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {COMPONENTS.map((c, i) => (
                  <tr key={c.name} className={i < COMPONENTS.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 font-mono text-xs text-[#3ba559] whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground leading-relaxed">{c.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3 flex-wrap">
            <a
              href="/#standard-components"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:text-[#2d8a47] transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Standard Components docs
            </a>
            <a
              href="https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/tree/main/packages/eri-components"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:text-[#2d8a47] transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Component source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Copy-paste project instructions ──────────────────────────────── */}
      <section className="bg-background">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Copy-paste project instructions</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Paste these into the Manus project instructions field when creating a new ERI project.
            They tell the AI agent exactly what to do before writing any code.
          </p>

          {/* Track selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTrack("track1")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                activeTrack === "track1"
                  ? "bg-[#232323] text-white border-[#232323]"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              ].join(" ")}
            >
              Track 1 — Static / Tier B
            </button>
            <button
              onClick={() => setActiveTrack("track2")}
              className={[
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                activeTrack === "track2"
                  ? "bg-[#232323] text-white border-[#232323]"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              ].join(" ")}
            >
              Track 2 — Full-Stack / Tier A
            </button>
          </div>

          {activeTrack === "track1" && (
            <CopyBlock id="track1-instructions" text={TRACK1_INSTRUCTIONS} label="Track 1 — Static / Tier B project instructions" />
          )}
          {activeTrack === "track2" && (
            <CopyBlock id="track2-instructions" text={TRACK2_INSTRUCTIONS} label="Track 2 — Full-Stack / Tier A project instructions" />
          )}

          <p className="text-xs text-muted-foreground mt-4">
            These instructions are also available via the{" "}
            <a
              href="https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3ba559] hover:underline"
            >
              bdsSpec API
            </a>{" "}
            as <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">handoff_prompt_track1</code> and{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-xs">handoff_prompt_track2</code>.
          </p>
        </div>
      </section>

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <section className="bg-muted/40 border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Quick links</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Key sections of the BDS and external resources for building ERI applications.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-[#3ba559]/50 hover:bg-[#3ba559]/5 transition-colors group"
              >
                <ChevronRight className="w-4 h-4 text-[#3ba559] mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    {link.label}
                    {link.external && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vite cache warning callout ────────────────────────────────────── */}
      <section className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-1">
                  Vite cache — the most common failure mode
                </p>
                <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed">
                  After any <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-xs">pnpm add</code> or{" "}
                  <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-xs">webdev_add_feature</code> upgrade,
                  always run <code className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-xs">rm -rf node_modules/.vite</code>,
                  restart the dev server, and hard-reload the browser (<kbd className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded text-xs">Cmd+Shift+R</kbd>).
                  A stale Vite pre-bundle cache causes a blank page with no error messages — it is silent and misleading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
