/**
 * NewProject.tsx — "Start a New Project" onboarding page
 *
 * Audience: Manus AI agents and developers starting a new ERI application.
 * Purpose:  Provide the canonical setup sequence, copy-paste project instructions,
 *           and track-specific guides — all in one place.
 *
 * Design rules:
 * - Uses PublicLayout (same wrapper as BrandDesignSystem and AlignmentTracker)
 * - Semantic tokens only — no hardcoded structural colours
 * - Two tracks: Track 1 (Static Website) and Track 2 (Full-Stack Application)
 */
import { useState } from "react";
import {
  Copy, Check, ExternalLink, Rocket, Layers, Zap, BookOpen,
  Terminal, Package, FileText, ChevronRight, AlertTriangle,
  Database, Shield, Users, Server, Type, Palette,
} from "lucide-react";
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
const TRACK1_INSTRUCTIONS = `Critical: At the start of every task, run:
  curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\
    > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"
Then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action.

Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files.

Critical: This is a Track 1 ERI static website. Read https://bds.exponentialroadmap.org/new-project#track1 and follow all instructions before writing any code.

Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`;

// ─── Track 2 project instructions ────────────────────────────────────────────
const TRACK2_INSTRUCTIONS = `Critical: At the start of every task, run:
  curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\
    > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"
Then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action.

Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files.

Critical: This is a Track 2 ERI full-stack application. Read https://bds.exponentialroadmap.org/new-project#track2 and follow all instructions before writing any code.

Critical: Always follow the ERI development workflow: 1. Research: clarify purpose, understand current context and existing assets, explore possible solutions. 2. Design. 3. Plan and get acceptance for plan. 4. Implement. 5. Test. 6. Iterate until solution works.

Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.

EARTH-ALIGNED SKILLS — PLACEHOLDER: An Earth-aligned skills management package is being developed as part of the Earth-Aligned AI Lab project. When available, it will populate Earth-aligned learning, impact assessment, and ERI-specific development guidelines. This placeholder will be replaced with the full package when it is ready.`;

// ─── Track 1 setup steps ─────────────────────────────────────────────────────
const TRACK1_STEPS = [
  {
    number: "01",
    icon: Terminal,
    title: "Fetch the eri-bds-reference skill",
    description: "Run at the start of every task — updates the local skill file with the latest BDS guidance.",
    code: `curl -sL https://bds.exponentialroadmap.org/api/skill/latest \\\n  > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"`,
    codeId: "t1-step-01",
  },
  {
    number: "02",
    icon: FileText,
    title: "Create PROJECT-CONTEXT.md",
    description: "Read at the start of every subsequent task. This file survives context compaction.",
    code: null,
    codeId: null,
  },
  {
    number: "03",
    icon: Package,
    title: "Install @eri/components",
    description: "Pin to the latest stable release — check components.latestVersion in the spec endpoint for the current pin.",
    code: `pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.17.0&path:packages/eri-components"`,
    codeId: "t1-step-03",
  },
  {
    number: "04",
    icon: Layers,
    title: "Add @eri/components CSS import to index.css",
    description: "This is a critical step — add as the very first line in index.css, before all other @tailwind or @theme directives. Without it, all components will be invisible.",
    code: `@import "@eri/components/dist/eri-components.css";`,
    codeId: "t1-step-04",
  },
  {
    number: "05",
    icon: Type,
    title: "Self-host Archivo + Open Sans fonts",
    description: "Download WOFF2 files to client/public/fonts/ and add @font-face declarations. Remove any Google Fonts <link> tags from index.html — required for GDPR compliance.",
    code: null,
    codeId: null,
  },
  {
    number: "06",
    icon: Rocket,
    title: "Wrap App.tsx in EriPageLayout",
    description: "Use EriPageLayout as the top-level wrapper. Pass headerTheme=\"auto\", showThemeToggle={true}, showCTA={true}. See the Standard Components section for full props.",
    code: null,
    codeId: null,
  },
  {
    number: "07",
    icon: Palette,
    title: "Add EriHeroSection to the homepage",
    description: "Use ERI_HERO_IMAGE_DEFAULT, ERI_HERO_IMAGE_TRUST, or crocodileDecoupling as the background. Never use a custom background image for the hero.",
    code: null,
    codeId: null,
  },
  {
    number: "08",
    icon: Server,
    title: "Register a Contact Us source ID",
    description: "Choose a stable lowercase ID (e.g. \"hal\", \"taxonomy\"). Pass it as the source prop to EriContactUsButton and EriPageLayout.",
    code: null,
    codeId: null,
  },
  {
    number: "09",
    icon: FileText,
    title: "Create client/public/bds-meta.json",
    description: "Fetch the live template from the Project Alignment Tracker. Do not use the template in the skill — it may be stale.",
    code: `# Fetch the live template from:
# https://bds.exponentialroadmap.org/tracker
# (scroll to "How this tracker works" section)`,
    codeId: "t1-step-09",
  },
  {
    number: "10",
    icon: Check,
    title: "Run the Project Alignment Checklist",
    description: "Open the Project Alignment Tracker tab and verify all checkboxes before closing this task.",
    code: null,
    codeId: null,
  },
];

// ─── Track 2 setup steps ─────────────────────────────────────────────────────
const TRACK2_STEPS_EXTRA = [
  {
    number: "11",
    icon: Server,
    title: "Enable web-db-user features in Manus",
    description: "Use webdev_add_feature, which will require \"web-db-user\" to enable database, server, and user capabilities in the Manus template.",
    code: null,
    codeId: null,
  },
  {
    number: "12",
    icon: Database,
    title: "Push the database schema",
    description: "After updating drizzle/schema.ts, run pnpm db:push to generate migrations and sync the remote database.",
    code: `pnpm db:push`,
    codeId: "t2-step-12",
  },
  {
    number: "13",
    icon: Shield,
    title: "Set up Manus OAuth authentication",
    description: "Use protectedProcedure for authenticated tRPC procedures. Use publicProcedure for brand/reference data. Never expose credentials to the client.",
    code: null,
    codeId: null,
  },
  {
    number: "14",
    icon: Layers,
    title: "Design workspace isolation schema",
    description: "If the app has company workspaces, apply row-level isolation on every query. Every workspace-scoped table must filter by the authenticated user's workspace.",
    code: null,
    codeId: null,
  },
  {
    number: "15",
    icon: Users,
    title: "Set up user management",
    description: "Read the eri-user-management skill for invite flows, role management (viewer/analyst/admin), workspace creation, and member removal.",
    code: null,
    codeId: null,
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

// ─── Project naming conventions ───────────────────────────────────────────────
const NAMING_CONVENTIONS = [
  { convention: "Domain",              role: "Production URL",                example: "{app}.exponentialroadmap.org" },
  { convention: "Manus project name",  role: "Human-readable label",          example: "eri-{appname}-{descriptor}" },
  { convention: "Source ID",           role: "Contact Us / bds-meta ID",      example: "hal, taxonomy, trust" },
  { convention: "Version string",      role: "Header badge + bds-meta",       example: "V.YYYY.MM.DD" },
  { convention: "bds-meta.json id",    role: "Tracker lookup key",            example: "hal, psm, trust" },
  { convention: "Status badge",        role: "EriStatusBadge status prop",    example: "ALPHA → BETA → PILOT → LIVE" },
];

// ─── Quick links ──────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Standard Components",       href: "/#standard-components",    description: "Full component docs with live previews" },
  { label: "Machine Instructions",      href: "/#ai-instructions",        description: "AI-readable spec and setup checklist" },
  { label: "Project Alignment Tracker", href: "/tracker",                 description: "Check your project against the BDS" },
  { label: "Visual Identity",           href: "/#visual-identity",        description: "Colour tokens and pillar palette" },
  { label: "Typography",                href: "/#typography",             description: "Archivo + Open Sans, self-hosted WOFF2" },
  { label: "Surface Modes",             href: "/#surface-modes",          description: "Light/dark theme system and FOLC script" },
  { label: "bdsSpec API",               href: "https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec", description: "Machine-readable brand spec JSON", external: true },
  { label: "GitHub — eri-components",   href: "https://github.com/Exponential-Roadmap-Initiative/eri-brand-design-system/tree/main/packages/eri-components", description: "Component source code", external: true },
];

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({ step }: { step: typeof TRACK1_STEPS[number] }) {
  const Icon = step.icon;
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#93E07D]" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground">{step.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
        {step.code && step.codeId && (
          <CopyBlock id={step.codeId} text={step.code} />
        )}
      </div>
    </div>
  );
}

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
            ERI Web Projects
          </p>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Start a New Project
          </h1>
          {/* PAGE GUIDE callout */}
          <div className="mt-4 rounded-lg border border-white/20 bg-white/5 px-5 py-4 max-w-2xl">
            <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-1">Page Guide</p>
            <p className="text-sm text-white/80 leading-relaxed">
              This page is the starting point for every new ERI web project. Use the decision card below to pick a track,
              copy the project instructions block, and paste it into your new Manus project instructions field — the
              agent will read this page and follow the correct setup steps automatically.
            </p>
          </div>
        </div>
      </section>

      {/* ── Track selector ────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-xl font-extrabold text-foreground mb-2">Which track is your project?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Track 1 */}
            <button
              onClick={() => setActiveTrack("track1")}
              className={[
                "rounded-xl border-2 p-5 text-left transition-all",
                activeTrack === "track1"
                  ? "border-[#3ba559] bg-[#3ba559]/5"
                  : "border-[#3ba559]/30 bg-card hover:border-[#3ba559]/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#3ba559] text-white font-bold text-xs">1</span>
                <span className="font-bold text-foreground text-sm">Static Website</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Pure content and marketing sites — no user accounts, no database, no server-side logic. The simplest ERI project type.
              </p>
              <p className="text-xs text-[#3ba559] font-medium">
                Examples: Exponential Framework, Earth-Aligned AI Lab, Exponential Taxonomy →
              </p>
            </button>
            {/* Track 2 */}
            <button
              onClick={() => setActiveTrack("track2")}
              className={[
                "rounded-xl border-2 p-5 text-left transition-all",
                activeTrack === "track2"
                  ? "border-[#00B8D4] bg-[#00B8D4]/5"
                  : "border-[#00B8D4]/30 bg-card hover:border-[#00B8D4]/60",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#00B8D4] text-white font-bold text-xs">2</span>
                <span className="font-bold text-foreground text-sm">Full-Stack Application</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Any project with data, AI, authentication, or workspaces — this covers the majority of ERI applications.
              </p>
              <p className="text-xs text-[#00B8D4] font-medium">
                Examples: Professional Services Matrix, Exponential Platform →
              </p>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Decision rule:</span> Does your project need a database, user accounts, or server-side logic?{" "}
            If <span className="font-semibold">no</span> → Track 1. If <span className="font-semibold">yes</span> → Track 2.
          </p>
        </div>
      </section>

      {/* ── Track 1 section ───────────────────────────────────────────────── */}
      {activeTrack === "track1" && (
        <section className="bg-background" id="track1">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Track header */}
            <div className="rounded-xl bg-[#3ba559] px-6 py-4 mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Track 1</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Static Website</h2>
              <p className="text-sm text-white/80 mt-1">
                Manus template: <code className="font-mono bg-white/10 px-1 rounded">web-static</code> •
                Vite + Tailwind 4 • No server, no database
              </p>
            </div>

            {/* Step 1: Project instructions */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Step 1 of 1 — Paste this into your Manus project instructions
                </p>
                <button
                  onClick={() => copy(TRACK1_INSTRUCTIONS, "track1-copy-btn")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3ba559] text-white text-xs font-semibold hover:bg-[#2d8a47] transition-colors"
                >
                  {copied === "track1-copy-btn" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Track 1 Instructions
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Create a new Manus project, open Project Settings → Instructions, and paste the block below. The agent will read this page and follow the 10-step checklist automatically on every task.
              </p>
              <CopyBlock id="track1-instructions-block" text={TRACK1_INSTRUCTIONS} />
            </div>

            {/* 10-step checklist */}
            <h3 className="text-lg font-extrabold text-foreground mb-2">10-Step Setup Checklist</h3>
            <p className="text-sm text-muted-foreground mb-8">
              The agent follows these steps automatically after reading the project instructions above. Each step links to the canonical documentation in the BDS — no duplication, no approximation.
            </p>
            <div className="flex flex-col gap-6">
              {TRACK1_STEPS.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Track 2 section ───────────────────────────────────────────────── */}
      {activeTrack === "track2" && (
        <section className="bg-background" id="track2">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Track header */}
            <div className="rounded-xl bg-[#00B8D4] px-6 py-4 mb-8">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Track 2</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">Full-Stack Application</h2>
              <p className="text-sm text-white/90 mt-1">
                Manus template: <code className="font-mono bg-white/10 px-1 rounded">web-db-user</code> •
                Express + tRPC + MySQL • Manus OAuth
              </p>
            </div>

            {/* Step 1: Project instructions */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Step 1 of 2 — Paste this into your Manus project instructions
                </p>
                <button
                  onClick={() => copy(TRACK2_INSTRUCTIONS, "track2-copy-btn")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B8D4] text-white text-xs font-semibold hover:bg-[#0099b3] transition-colors"
                >
                  {copied === "track2-copy-btn" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Track 2 Instructions
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Create a new Manus project, open Project Settings → Instructions, and paste the block below. The agent will read this page and follow all setup steps automatically.
              </p>
              <CopyBlock id="track2-instructions-block" text={TRACK2_INSTRUCTIONS} />
            </div>

            {/* Earth-Aligned Skills placeholder */}
            <div className="rounded-lg border border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1">
                    Earth-Aligned Skills — Placeholder
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                    An Earth-aligned skills management package is being developed as part of the{" "}
                    <a href="https://hal.exponentialroadmap.org" target="_blank" rel="noopener noreferrer" className="underline">
                      Earth-Aligned AI Lab
                    </a>{" "}
                    project. When available, it will populate Earth-aligned learning, impact assessment, and ERI-specific
                    development guidelines. This placeholder will be replaced with the full package when it is ready.
                  </p>
                </div>
              </div>
            </div>

            {/* 10-step checklist — Track 2 */}
            <h3 className="text-lg font-extrabold text-foreground mb-2">10-Step Setup Checklist</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Steps 1–10 are the same as Track 1 — follow the BDS checklist, install @eri/components, create PROJECT-CONTEXT.md, add CSS import, and run the Project Alignment Tracker check. Then add the Track 2 steps below.
            </p>

            {/* Track 2 same as Track 1 note */}
            <div className="rounded-lg border border-border bg-muted/40 px-5 py-4 mb-6">
              <p className="text-sm font-semibold text-foreground mb-1">Steps 1–10: Same as Track 1</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Follow the same 10-step checklist — fetch skill, create PROJECT-CONTEXT.md, install @eri/components, add CSS import, self-host fonts, wrap App.tsx in EriPageLayout, add EriHeroSection, register Contact Us source ID, create bds-meta.json, and run the Project Alignment Tracker check.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {TRACK2_STEPS_EXTRA.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* ── Project Naming Conventions ────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-extrabold text-foreground mb-2">Project Naming Conventions</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Consistent naming across domains, Manus project names, source IDs, and version strings ensures the
            Project Alignment Tracker can locate and validate every ERI project automatically.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">Convention</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs uppercase tracking-wider">Example</th>
                </tr>
              </thead>
              <tbody>
                {NAMING_CONVENTIONS.map((row, i) => (
                  <tr key={row.convention} className={i < NAMING_CONVENTIONS.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 font-semibold text-foreground text-sm whitespace-nowrap">{row.convention}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#3ba559]">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Machine-Readable Spec Endpoint ────────────────────────────────── */}
      <section className="bg-muted/40 border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-xl font-extrabold text-foreground mb-2">Machine-Readable Spec Endpoint</h2>
          <p className="text-muted-foreground text-sm mb-5">
            The bdsSpec API returns the full ERI brand specification as structured JSON — colours, typography,
            semantic tokens, dark mode rules, component versions, and copy-pasteable project instructions.
            AI agents can fetch this endpoint directly to get up-to-date brand guidance.
          </p>
          <div className="rounded-lg bg-[#232323] px-5 py-4 mb-4 flex items-center gap-3">
            <span className="text-xs font-bold text-[#93E07D] font-mono">GET</span>
            <code className="text-sm text-white/90 font-mono break-all">
              https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec
            </code>
          </div>
          <a
            href="https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3ba559] text-white text-sm font-semibold hover:bg-[#2d8a47] transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Open Spec Endpoint
          </a>
        </div>
      </section>

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border">
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
