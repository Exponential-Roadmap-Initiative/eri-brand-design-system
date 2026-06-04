/**
 * ERI — Start a New Project
 *
 * Design: AI-agent-optimised onboarding page
 * - pt-[120px] mobile / pt-[104px] sm+ to clear fixed header + TabNav
 * - Track 1 (static website) and Track 2 (full-stack app) setup guides
 * - Zero duplication: links to existing BDS sections for all canonical content
 * - Copy-paste Manus project instructions blocks for each track
 * - Earth-Aligned Skills placeholder for future package integration
 */

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  dark:  "#232323",
  lime:  "#93E07D",
  green: "#3ba559",
  blue:  "#17b7dd",
};

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
      style={{
        backgroundColor: copied ? T.green : T.lime,
        color: T.dark,
      }}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ── Step badge ────────────────────────────────────────────────────────────────
function StepBadge({ n, color = T.green }: { n: number; color?: string }) {
  return (
    <span
      className="shrink-0 w-6 h-6 rounded-full text-white text-[11px] font-bold flex items-center justify-center mt-0.5"
      style={{ backgroundColor: color }}
    >
      {n}
    </span>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ track, color, title, subtitle }: {
  track: string; color: string; title: string; subtitle: string;
}) {
  return (
    <div className="rounded-t-xl px-6 py-5" style={{ backgroundColor: color }}>
      <div className="flex items-center gap-3 mb-1">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "rgba(0,0,0,0.25)", color: "#fff" }}
        >
          {track}
        </span>
      </div>
      <h2 className="font-archivo text-2xl font-extrabold text-white mb-1">{title}</h2>
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{subtitle}</p>
    </div>
  );
}

// ── Track 1 project instructions ──────────────────────────────────────────────
const TRACK1_INSTRUCTIONS = `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files.
Critical: This is a Track 1 ERI static website. Read https://bds.exponentialroadmap.org/new-project#track-1 and follow all instructions before writing any code.
Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`;

// ── Track 2 project instructions ──────────────────────────────────────────────
const TRACK2_INSTRUCTIONS = `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files.
Critical: This is a Track 2 ERI full-stack application. Read https://bds.exponentialroadmap.org/new-project#track-2 and follow all instructions before writing any code.
Critical: Always follow the ERI development workflow: 1. Research: clarify purpose, understand current context and existing assets, explore possible solutions. 2. Design. 3. Plan and get acceptance for plan. 4. Implement. 5. Test. 6. Iterate until solution works.
Critical: Apply the exponential-human-ai-collaboration skill to every task in this project.
Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.
[EARTH-ALIGNED SKILLS — placeholder: will be populated when the Earth-aligned skills management package is available from the Earth-Aligned AI Lab project]`;

// ── Track 1 steps ─────────────────────────────────────────────────────────────
const TRACK1_STEPS: { label: string; anchor: string; hint: string; code?: string }[] = [
  {
    label: "Fetch the eri-bds-reference skill",
    anchor: "https://bds.exponentialroadmap.org/#ai-instructions",
    hint: "Run at the start of every task — updates the local skill file with the latest BDS guidance.",
    code: `curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"`,
  },
  {
    label: "Create PROJECT-CONTEXT.md",
    anchor: "https://bds.exponentialroadmap.org/#ai-instructions",
    hint: "Seed with canonical values from the skill. Read it at the start of every subsequent task. This file survives context compaction.",
  },
  {
    label: "Install @eri/components",
    anchor: "https://bds.exponentialroadmap.org/#standard-components",
    hint: "Pin to the latest stable release. Check components.latestVersion in the spec endpoint for the current pin.",
    code: `pnpm add "github:Exponential-Roadmap-Initiative/eri-brand-design-system#v2.16.1&path:packages/eri-components"`,
  },
  {
    label: "Add @eri/components CSS import to index.css",
    anchor: "https://bds.exponentialroadmap.org/#standard-components",
    hint: "This is the single most common failure point. Must be the FIRST line in index.css, before all @tailwind or @theme directives.",
    code: `@import "@eri/components/dist/eri-components.css";`,
  },
  {
    label: "Self-host Archivo + Open Sans fonts",
    anchor: "https://bds.exponentialroadmap.org/#standard-components",
    hint: "Download WOFF2 files to client/public/fonts/. Remove any Google Fonts <link> tags from index.html. Required for GDPR compliance.",
  },
  {
    label: "Wrap App.tsx in EriPageLayout",
    anchor: "https://bds.exponentialroadmap.org/#standard-components",
    hint: "Pass appName, showCTA={true}, showThemeToggle={true}, headerTheme=\"auto\". See the canonical App.tsx code block in the Standard Components section.",
  },
  {
    label: "Add EriHeroSection to the homepage",
    anchor: "https://bds.exponentialroadmap.org/#standard-components",
    hint: "Use ERI_HERO_IMAGE_DEFAULT or ERI_HERO_IMAGE_TRUST as the background. Never use a custom background image for the hero.",
  },
  {
    label: "Register a Contact Us source ID",
    anchor: "https://bds.exponentialroadmap.org/#contact-us",
    hint: "Choose a short, stable, lowercase slug (e.g. \"hal\", \"taxonomy\"). Pass it as the source prop to EriPageLayout.",
  },
  {
    label: "Create client/public/bds-meta.json",
    anchor: "https://bds.exponentialroadmap.org/tracker",
    hint: "Fetch the canonical template from the Project Alignment Tracker tab. Publish at the root URL of your deployed site.",
  },
  {
    label: "Run the Project Alignment Checklist",
    anchor: "https://bds.exponentialroadmap.org/tracker",
    hint: "Open the Project Alignment Tracker tab and verify all checks pass before closing the task.",
  },
];

// ── Track 2 additional steps ──────────────────────────────────────────────────
const TRACK2_EXTRA_STEPS: { label: string; hint: string; code?: string }[] = [
  {
    label: "Enable web-db-user features in Manus",
    hint: "Use the webdev_add_feature tool with feature=\"web-db-user\" to enable db, server, and user capabilities on the Manus template.",
  },
  {
    label: "Push the database schema",
    hint: "After updating drizzle/schema.ts, run pnpm db:push to generate migrations and sync the remote database.",
    code: `pnpm db:push`,
  },
  {
    label: "Set up Manus OAuth authentication",
    hint: "Use protectedProcedure for authenticated tRPC procedures. Use the useAuth() hook on the frontend. Never manipulate cookies manually.",
  },
  {
    label: "Design workspace isolation schema",
    hint: "Every multi-tenant table must have a companyId or workspaceId foreign key. Never return rows without filtering by the authenticated user's workspace.",
  },
  {
    label: "Set up user management",
    hint: "Read the eri-user-management skill for invite flows, role management (viewer/analyst/admin), and workspace creation patterns.",
  },
];

// ── Naming conventions ────────────────────────────────────────────────────────
const NAMING_CONVENTIONS = [
  { convention: "Domain",              rule: "{name}.exponentialroadmap.org",  example: "psm.exponentialroadmap.org" },
  { convention: "Manus project name",  rule: "kebab-case, descriptive",        example: "eri-professional-services-matrix" },
  { convention: "Source ID",           rule: "lowercase, short, stable",       example: "psm, hal, taxonomy" },
  { convention: "Version string",      rule: "V.YYYY.MM.DD",                   example: "V.2026.06.04" },
  { convention: "bds-meta.json id",    rule: "Same as source ID",              example: "psm" },
  { convention: "Status badge",        rule: "ALPHA → BETA → PILOT → LIVE",   example: "BETA" },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function NewProject() {
  return (
    // pt-[120px] on mobile (80px two-row header + 40px TabNav), pt-[104px] on sm+ (64px header + 40px TabNav)
    <div className="min-h-screen pt-[120px] sm:pt-[104px] bg-background">

      {/* ── Page header band ── */}
      <div className="px-4 sm:px-8 py-10" style={{ backgroundColor: T.dark }}>
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: T.lime }}
          >
            ERI Web Projects
          </p>
          <h1 className="font-archivo text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Start a New Project
          </h1>
          {/* Page Guide — brief human orientation */}
          <div
            className="rounded-lg p-4 max-w-2xl"
            style={{ backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: T.lime }}>
              Page Guide
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              This page is the starting point for every new ERI web project. Use the decision card below to
              pick a track, copy the project instructions block, and paste it into your new Manus project's
              instructions field — the agent will read this page and follow the correct setup steps automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">

        {/* ── Decision card ── */}
        <section className="mb-12" id="decision">
          <h2 className="font-archivo text-xl font-extrabold text-foreground mb-4">
            Which track is your project?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Track 1 card */}
            <a
              href="#track-1"
              className="block rounded-xl border-2 p-5 transition-all hover:shadow-md"
              style={{ borderColor: T.green, backgroundColor: "#f0faf3" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: T.green, color: "#fff" }}
                >
                  TRACK 1
                </span>
                <span className="font-bold text-foreground">Static Website</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Marketing sites, content sites, interactive visualisations, public-facing tools with no user accounts or server-side logic.
              </p>
              <p className="text-xs font-medium" style={{ color: T.green }}>
                Examples: Exponential Framework, Earth-Aligned AI Lab, Crocodile Economics →
              </p>
            </a>
            {/* Track 2 card */}
            <a
              href="#track-2"
              className="block rounded-xl border-2 p-5 transition-all hover:shadow-md"
              style={{ borderColor: T.blue, backgroundColor: "#f0f9fc" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: T.blue, color: "#fff" }}
                >
                  TRACK 2
                </span>
                <span className="font-bold text-foreground">Full-Stack Application</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Interactive analytical tools, authenticated platforms, workspace-based apps, AI-powered tools — anything requiring user accounts, data storage, or server-side logic.
              </p>
              <p className="text-xs font-medium" style={{ color: T.blue }}>
                Examples: Professional Services Matrix, Exponential Platform →
              </p>
            </a>
          </div>
          {/* Decision rule */}
          <div className="mt-4 rounded-lg p-4 border border-border bg-muted">
            <p className="text-sm text-foreground">
              <strong>Decision rule:</strong> Does your project need a database, user accounts, or server-side logic?
              If <strong>no</strong> → Track 1. If <strong>yes</strong> → Track 2.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TRACK 1                                                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-14" id="track-1">
          <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: T.green }}>
            <SectionHeading
              track="TRACK 1"
              color={T.green}
              title="Static Website"
              subtitle="Manus template: web-static · Vite + React + Tailwind 4 · No server, no database"
            />
            <div className="p-6 bg-card">

              {/* Copy-paste instructions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                    Step 1 of 1 — Paste this into your Manus project instructions
                  </h3>
                  <CopyButton text={TRACK1_INSTRUCTIONS} label="Copy Track 1 Instructions" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Create a new Manus project, open Project Settings → Instructions, and paste the block below.
                  The agent will read this page and follow the 10-step setup checklist automatically.
                </p>
                <pre
                  className="text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed"
                  style={{
                    backgroundColor: T.dark,
                    color: "rgba(255,255,255,0.85)",
                    border: `1px solid ${T.green}40`,
                  }}
                >{TRACK1_INSTRUCTIONS}</pre>
              </div>

              {/* 10-step checklist */}
              <div>
                <h3 className="font-bold text-foreground mb-4">10-Step Setup Checklist</h3>
                <p className="text-xs text-muted-foreground mb-5">
                  The agent follows these steps automatically after reading the project instructions above.
                  Each step links to the canonical documentation in the{" "}
                  <a href="/#standard-components" className="underline" style={{ color: T.green }}>
                    Standard Components
                  </a>{" "}
                  and{" "}
                  <a href="/#ai-instructions" className="underline" style={{ color: T.green }}>
                    Machine Instructions
                  </a>{" "}
                  sections — no duplication.
                </p>
                <ol className="space-y-4">
                  {TRACK1_STEPS.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <StepBadge n={i + 1} color={T.green} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <a
                            href={step.anchor}
                            target={step.anchor.startsWith("http") ? "_blank" : undefined}
                            rel={step.anchor.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="font-semibold text-sm text-foreground hover:underline flex items-center gap-1"
                            style={{ color: T.dark }}
                          >
                            {step.label}
                            <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.hint}</p>
                        {step.code && (
                          <div className="mt-2 flex items-center gap-2">
                            <pre
                              className="text-[11px] rounded px-3 py-1.5 flex-1 overflow-x-auto font-mono"
                              style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }}
                            >{step.code}</pre>
                            <CopyButton text={step.code} label="Copy" />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TRACK 2                                                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-14" id="track-2">
          <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: T.blue }}>
            <SectionHeading
              track="TRACK 2"
              color={T.blue}
              title="Full-Stack Application"
              subtitle="Manus template: web-db-user · React + Express + tRPC + MySQL + Manus OAuth"
            />
            <div className="p-6 bg-card">

              {/* Copy-paste instructions */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                    Step 1 of 1 — Paste this into your Manus project instructions
                  </h3>
                  <CopyButton text={TRACK2_INSTRUCTIONS} label="Copy Track 2 Instructions" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Create a new Manus project, open Project Settings → Instructions, and paste the block below.
                  The agent will read this page and follow the 15-step setup checklist automatically.
                </p>
                <pre
                  className="text-xs rounded-lg p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed"
                  style={{
                    backgroundColor: T.dark,
                    color: "rgba(255,255,255,0.85)",
                    border: `1px solid ${T.blue}40`,
                  }}
                >{TRACK2_INSTRUCTIONS}</pre>

                {/* Earth-Aligned Skills placeholder */}
                <div
                  className="mt-4 rounded-lg p-4 border-2 border-dashed"
                  style={{ borderColor: "#f59e0b", backgroundColor: "#fffbeb" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 text-base">⏳</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      Earth-Aligned Skills — Placeholder
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    An Earth-aligned skills management package is being developed as part of the{" "}
                    <a
                      href="https://earth-aligned-ai-lab.exponentialroadmap.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      Earth-Aligned AI Lab
                    </a>{" "}
                    project. When available, it will add additional <code className="font-mono bg-amber-100 px-1 rounded">Critical:</code> lines
                    to this block covering Earth-aligned reasoning, impact assessment, and ERI-specific AI behaviour guidelines.
                    This placeholder will be replaced with the full package when it is ready.
                  </p>
                </div>
              </div>

              {/* 15-step checklist */}
              <div>
                <h3 className="font-bold text-foreground mb-4">15-Step Setup Checklist</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Steps 1–10 are identical to Track 1 (see above). Steps 11–15 cover Track 2 specifics.
                </p>

                {/* Steps 1–10 reference */}
                <div
                  className="rounded-lg p-4 mb-5 border"
                  style={{ backgroundColor: "#f0f9fc", borderColor: `${T.blue}40` }}
                >
                  <p className="text-sm font-semibold mb-1" style={{ color: T.blue }}>
                    Steps 1–10: Same as Track 1
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Follow the same 10-step checklist as Track 1 above — skill fetch, PROJECT-CONTEXT.md, @eri/components install,
                    CSS import, fonts, EriPageLayout, EriHeroSection, Contact Us source ID, bds-meta.json, and Alignment Tracker check.
                    See the{" "}
                    <a href="#track-1" className="underline font-medium" style={{ color: T.blue }}>
                      Track 1 section
                    </a>{" "}
                    for the full list.
                  </p>
                </div>

                {/* Steps 11–15 */}
                <ol className="space-y-4" start={11}>
                  {TRACK2_EXTRA_STEPS.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <StepBadge n={i + 11} color={T.blue} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-foreground">{step.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.hint}</p>
                        {step.code && (
                          <div className="mt-2 flex items-center gap-2">
                            <pre
                              className="text-[11px] rounded px-3 py-1.5 flex-1 overflow-x-auto font-mono"
                              style={{ backgroundColor: "#f3f4f6", color: "#1f2937" }}
                            >{step.code}</pre>
                            <CopyButton text={step.code} label="Copy" />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SHARED — Project naming conventions                               */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-14" id="naming-conventions">
          <h2 className="font-archivo text-xl font-extrabold text-foreground mb-4">
            Project Naming Conventions
          </h2>
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: T.dark }}>
                    <th className="text-left px-4 py-3 text-white font-semibold text-xs uppercase tracking-wide">Convention</th>
                    <th className="text-left px-4 py-3 text-white font-semibold text-xs uppercase tracking-wide">Rule</th>
                    <th className="text-left px-4 py-3 text-white font-semibold text-xs uppercase tracking-wide">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {NAMING_CONVENTIONS.map(({ convention, rule, example }, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted"}>
                      <td className="px-4 py-3 font-semibold text-foreground text-xs">{convention}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{rule}</td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: T.green }}>{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* Machine-readable spec note                                        */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <section className="mb-10" id="spec-endpoint">
          <Card className="shadow-sm border border-border">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚡</span>
                <h3 className="font-bold text-foreground text-sm">Machine-Readable Spec Endpoint</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                The full ERI brand spec — including <code className="font-mono bg-muted px-1 rounded">handoff_prompt_track1</code>,{" "}
                <code className="font-mono bg-muted px-1 rounded">handoff_prompt_track2</code>, all colour tokens, typography rules, and the
                canonical CSS block — is available as structured JSON at:
              </p>
              <pre
                className="text-xs rounded p-3 mb-3 overflow-x-auto font-mono"
                style={{ backgroundColor: "#1a1a1a", color: T.lime }}
              >{`GET https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec`}</pre>
              <a
                href="https://bds.exponentialroadmap.org/api/trpc/bdsSpec.getSpec"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                style={{ backgroundColor: T.green, color: "#fff" }}
              >
                <ExternalLink className="w-3 h-3" />
                Open Spec Endpoint
              </a>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
}
