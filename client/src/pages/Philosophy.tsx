/*
 * ERI Brand Design System — Governance & Methodology Page
 *
 * A top-level page explaining the full ERI human-AI governance model:
 * four governance layers, the self-improving system, the skill ecosystem,
 * the task lifecycle, the project instructions system, collaboration
 * principles, and curated further reading.
 *
 * This page is intentionally non-technical — it is written for the whole
 * ERI team, not just developers.
 *
 * BDS compliance:
 * - PublicLayout wrapper (correct header clearance, semantic bg/text tokens, ERI footer)
 * - Hero: bg-[#232323], font-extrabold font-archivo, eyebrow #93E07D, --eri-content-inset
 * - Section eyebrow labels: #93E07D (Accent Lime) — never #3ba559 (Primary Green)
 * - Card accents: left border + tint (≤8% opacity), no full four-side coloured outline
 * - No emoji — Lucide icons only
 * - Semantic tokens for structural surfaces (bg-card, bg-muted, border-border, text-foreground)
 */

import { useState } from "react";
import { Link } from "wouter";
import {
  ExternalLink, ChevronDown, ChevronUp, ArrowRight,
  Globe, Building2, Code2, Zap,
  Wrench, BookOpen, Settings, ClipboardList, Brain, FolderOpen,
  FileText, CheckSquare, Layers, MessageSquare, Paperclip, RefreshCw,
} from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { PageGuide } from "@/components/PageGuide";

// ── Governance Diagram ────────────────────────────────────────────────────────

type AssetIcon = typeof Wrench;

interface GovernanceLevel {
  id: string;
  Icon: AssetIcon;
  title: string;
  subtitle: string;
  color: string;
  tint: string;
  border: string;
  assets: { Icon: AssetIcon; name: string; desc: string }[];
}

function GovernanceDiagram() {
  const levels: GovernanceLevel[] = [
    {
      id: "system",
      Icon: Globe,
      title: "Manus Platform",
      subtitle: "The foundation — always present, not configurable by ERI",
      color: "#6b7280",
      tint: "rgba(107,114,128,0.06)",
      border: "rgba(107,114,128,0.25)",
      assets: [
        { Icon: Wrench,   name: "Built-in tools",    desc: "Browser, code editor, file system, image generation, search" },
        { Icon: BookOpen, name: "General skills",     desc: "Skill creator, image routing, API access, scheduling" },
        { Icon: Settings, name: "System behaviour",   desc: "Safety rules, tool use patterns, response format" },
      ],
    },
    {
      id: "project",
      Icon: Building2,
      title: "ERI Project",
      subtitle: "Shared across every ERI task — the team's accumulated knowledge",
      color: "#3ba559",
      tint: "rgba(59,165,89,0.06)",
      border: "rgba(59,165,89,0.30)",
      assets: [
        { Icon: ClipboardList, name: "Project Instructions", desc: "Always-on rules: how to behave, what to always check, what to never skip" },
        { Icon: Brain,         name: "Project Skills",       desc: "Living knowledge modules: how ERI work is done well — improving after every task" },
        { Icon: FolderOpen,    name: "Project Files",        desc: "Shared domain knowledge: framework PDFs, specs, canonical reference documents" },
      ],
    },
    {
      id: "codebase",
      Icon: Code2,
      title: "Codebase",
      subtitle: "Specific to one application — persists across tasks on that codebase",
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.30)",
      assets: [
        { Icon: FileText,    name: "PROJECT-CONTEXT.md", desc: "Codebase memory: decisions made, known errors, pending work — survives session resets" },
        { Icon: CheckSquare, name: "todo.md",             desc: "Active work tracking: what is in progress, what is done, what is next" },
        { Icon: Layers,      name: "The codebase itself", desc: "The actual application being built — code, database schema, tests" },
      ],
    },
    {
      id: "task",
      Icon: Zap,
      title: "Task",
      subtitle: "A single session — ephemeral, exists only while the task is running",
      color: "#17b7dd",
      tint: "rgba(23,183,221,0.06)",
      border: "rgba(23,183,221,0.30)",
      assets: [
        { Icon: MessageSquare, name: "Conversation",   desc: "Everything said in this session — the brief, the decisions, the feedback" },
        { Icon: Paperclip,     name: "Attached files", desc: "Documents or images shared for this specific task" },
        { Icon: RefreshCw,     name: "Sandbox state",  desc: "Installed packages, running processes, downloaded files — reset between sessions" },
      ],
    },
  ];

  return (
    <div className="space-y-2">
      <div className="relative">
        {levels.map((level, idx) => {
          const LevelIcon = level.Icon;
          return (
            <div
              key={level.id}
              className="rounded-xl border p-4 mb-2"
              style={{
                borderColor: level.border,
                backgroundColor: level.tint,
                marginLeft: `${idx * 16}px`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <LevelIcon className="w-4 h-4 flex-shrink-0" style={{ color: level.color }} />
                <div>
                  <span className="text-sm font-semibold" style={{ color: level.color }}>{level.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{level.subtitle}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.assets.map(asset => {
                  const AssetIconComp = asset.Icon;
                  return (
                    <div
                      key={asset.name}
                      className="flex items-start gap-2 rounded-lg border px-3 py-2"
                      style={{ borderColor: level.border, backgroundColor: "var(--card)" }}
                    >
                      <AssetIconComp className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{asset.name}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{asset.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {/* Feedback loop callout */}
      <div className="rounded-lg border border-dashed p-3 flex items-start gap-3" style={{ borderColor: "rgba(59,165,89,0.4)", backgroundColor: "rgba(59,165,89,0.04)" }}>
        <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#3ba559" }} />
        <div>
          <p className="text-xs font-semibold text-foreground">The self-improvement loop</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            Every completed task is an opportunity to improve the system. When something works better than expected — or fails — that insight flows back into the <span className="font-medium text-foreground">Project Skills</span> layer. The skill is updated, the version is bumped, and every future task benefits automatically. The system gets smarter with every piece of work.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Task lifecycle flow ───────────────────────────────────────────────────────

function TaskLifecycleFlow() {
  const steps = [
    { label: "Task starts",      sub: "User gives a brief",                color: "#17b7dd" },
    { label: "Tier 1 skills",    sub: "Always read — no exceptions",       color: "#3ba559" },
    { label: "Tier 2 gate",      sub: "Read before specific actions",      color: "#f59e0b" },
    { label: "Tier 3 reference", sub: "Read when domain applies",          color: "#17b7dd" },
    { label: "Work",             sub: "Execute with full context",         color: "#6b7280" },
    { label: "Reflect",          sub: "What worked? What was missing?",    color: "#8b5cf6" },
    { label: "Improve",          sub: "Update the skill, bump version",    color: "#3ba559" },
    { label: "Next task",        sub: "Starts from a higher baseline",     color: "#3ba559" },
  ];

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-0 min-w-max">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: step.color }}
              />
              <div className="text-center" style={{ width: "80px" }}>
                <p className="text-[11px] font-semibold text-foreground leading-tight">{step.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{step.sub}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <ArrowRight className="w-3 h-3 text-muted-foreground/40 mx-1 flex-shrink-0 -mt-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tier model cards ──────────────────────────────────────────────────────────

function TierModelCards() {
  const tiers = [
    {
      label: "Tier 1 — Always-on",
      color: "#3ba559",
      tint: "rgba(59,165,89,0.06)",
      border: "rgba(59,165,89,0.30)",
      when: "Read at the start of every task, without exception.",
      why: "These skills carry the team's core operating principles — collaboration mode, development workflow, brand standards. Missing them means every task starts from scratch.",
      constraint: "Must be lean — every token costs on every task. Keep under 200 lines.",
      example: "eri-human-ai-collaboration, eri-bds-reference",
    },
    {
      label: "Tier 2 — Per-action gate",
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.30)",
      when: "Re-read immediately before a specific action — even within the same task.",
      why: "These skills are guardrails for high-risk actions. Reading them once at task start is not enough — they must be consulted at the moment of action.",
      constraint: "Can be longer. Only loaded when the specific action is about to happen.",
      example: "eri-code-quality (before writing any code), eri-trpc (before adding a router)",
    },
    {
      label: "Tier 3 — Conditional",
      color: "#17b7dd",
      tint: "rgba(23,183,221,0.06)",
      border: "rgba(23,183,221,0.30)",
      when: "Read when the domain or trigger condition applies.",
      why: "These skills carry deep domain knowledge that is only relevant for specific work. Loading them on every task would bloat the context unnecessarily.",
      constraint: "Can be detailed. Only loaded when the domain is relevant.",
      example: "data-source-integration (when adding a new data source), eri-report-finder (when working on report URLs)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {tiers.map(tier => (
        <div
          key={tier.label}
          className="rounded-lg border-l-4 border border-border p-4 space-y-2"
          style={{ borderLeftColor: tier.color, backgroundColor: tier.tint }}
        >
          <p className="text-sm font-semibold" style={{ color: tier.color }}>{tier.label}</p>
          <p className="text-xs text-foreground/80 leading-relaxed">
            <span className="font-medium">When: </span>{tier.when}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{tier.why}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2 mt-2">
            <span className="font-medium">Size: </span>{tier.constraint}
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-medium">Examples: </span>{tier.example}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────────────────

function Section({ title, subtitle, children, defaultOpen = false }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between px-6 py-5 text-left hover:bg-muted/20 transition-colors gap-4"
      >
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <span className="flex-shrink-0 mt-0.5 text-muted-foreground">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-border px-6 py-6 bg-muted/5">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Further Reading ───────────────────────────────────────────────────────────

function FurtherReading() {
  const resources = [
    {
      title: "The Vibe Codex",
      source: "thevibecodex.com · April 2026",
      url: "https://thevibecodex.com/",
      desc: "The definitive cheat sheet for AI-assisted development — golden rules, prompt patterns, cursor rules, and workflows. The practical companion to ERI's governance model.",
      tag: "Reference",
      tagColor: "#3ba559",
    },
    {
      title: "AI's Quiet Elegance: The Vibe Codex",
      source: "Eclipse AI Consulting · April 2025",
      url: "https://www.eclipseai.ai/insights/vibe-codex",
      desc: "Defines the Vibe Codex as 'a living repository of a project's essence' — stylistic nuances, core principles, and unspoken rules. The conceptual origin of what ERI's skills library is.",
      tag: "Concept",
      tagColor: "#8b5cf6",
    },
    {
      title: "Beyond Vibe Coding: The Five Building Blocks of AI-Native Engineering",
      source: "Thoughtworks · March 2026",
      url: "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/beyond-vibe-coding-the-five-building-blocks-of-aI-native-engineering",
      desc: "Argues that context engineering and agent skills are the fifth and most critical building block of AI-native engineering. Explicitly names skills files (AGENTS.md, .cursorrules) as the governance mechanism.",
      tag: "Architecture",
      tagColor: "#f59e0b",
    },
    {
      title: "The AI Coding Agent Manifesto",
      source: "Wix Engineering · Medium",
      url: "https://medium.com/wix-engineering/the-ai-coding-agent-manifesto-c8f61629d677",
      desc: "'The era of vibe coding is over. Welcome to agentic engineering.' A production-grade perspective on what AI governance looks like at scale — the engineering discipline that makes agentic work reliable.",
      tag: "Manifesto",
      tagColor: "#17b7dd",
    },
    {
      title: "Vibe Coding: Don't Kill the Vibe, Govern It",
      source: "IAPP · September 2025",
      url: "https://iapp.org/news/a/vibe-coding-don-t-kill-the-vibe-govern-it",
      desc: "Governance framing for AI-assisted development — mandatory human-in-the-loop review, AI governance as a primary detective control in the development lifecycle.",
      tag: "Governance",
      tagColor: "#ef4444",
    },
    {
      title: "The Vibe Engineering Manifesto",
      source: "Feifan Wang · April 2025",
      url: "https://www.vibeengineering.ai/p/the-vibe-engineering-manifesto",
      desc: "Elevates vibe coding to vibe engineering — AI-aligned architecture, cursor rules configuration, and a plan/act methodology. Directly relevant to how ERI structures its Manus project instructions.",
      tag: "Manifesto",
      tagColor: "#17b7dd",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
      {resources.map(r => (
        <a
          key={r.url}
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 rounded-lg border border-border p-4 hover:border-foreground/30 hover:bg-muted/20 transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground group-hover:text-[#3ba559] transition-colors leading-snug">{r.title}</p>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          </div>
          <p className="text-[11px] text-muted-foreground">{r.source}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          <div className="mt-auto pt-1">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: r.tagColor, backgroundColor: `${r.tagColor}18`, border: `1px solid ${r.tagColor}40` }}
            >
              {r.tag}
            </span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Philosophy() {
  return (
    <PublicLayout>
      {/* Hero — BDS compliant: bg-[#232323], font-extrabold font-archivo, eyebrow #93E07D, --eri-content-inset */}
      <section className="bg-[#232323] text-white py-16 px-4">
        <div
          className="max-w-3xl mx-auto"
          style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}
        >
          <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-4">
            Exponential Roadmap Initiative ——— Governance &amp; Methodology
          </p>
          <h1 className="text-4xl font-extrabold font-archivo mb-4 leading-tight">
            How ERI Works<br />
            <span className="text-[#93E07D]">with AI</span>
          </h1>
          <PageGuide text="This page explains the operating model for human–AI collaboration at ERI — a system designed to get better with every task completed. Read the four governance layers to understand the architecture. Read the self-improving system to understand the principle at its heart. Use the Further Reading section to explore the broader field of AI-native engineering governance." />
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">

        {/* The big idea */}
        <div className="rounded-xl border border-l-4 border-border p-6" style={{ borderLeftColor: "#3ba559", backgroundColor: "rgba(59,165,89,0.06)" }}>
          <p className="text-xs font-semibold text-[#93E07D] uppercase tracking-widest mb-3">The big idea</p>
          <p className="text-sm text-foreground/80 leading-relaxed">
            Every ERI task runs inside a layered knowledge system. Before Manus writes a single line of code or drafts a single sentence, it has already read the team's operating principles, the domain expertise relevant to this work, and the memory of every decision made on this codebase before. The result is that each task starts from a higher baseline — and when the task is done, what was learned raises that baseline further.
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed mt-2">
            This is not automation replacing judgement. It is a system that makes human–AI collaboration more consistent, more informed, and more efficient with every task completed. The system compounds — and that compounding is the point.
          </p>
        </div>

        {/* Section 1 — Four governance layers */}
        <Section
          title="The four governance layers"
          subtitle="The architecture of context — what Manus knows before it starts any task"
          defaultOpen={true}
        >
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Think of these as concentric rings. The outer rings are always present — they form the foundation every task builds on. The inner rings are more specific — they carry knowledge about a particular codebase or session. Every task draws from all four layers simultaneously.
          </p>
          <GovernanceDiagram />
        </Section>

        {/* Section 2 — The self-improving system */}
        <Section
          title="The self-improving system"
          subtitle="The principle at the heart of the model — every task raises the baseline"
          defaultOpen={true}
        >
          <div className="space-y-6">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Skills are not written once and left unchanged. They are living documents that improve after every task. The same mistake cannot recur once it has been encoded into a skill. The same insight does not need to be rediscovered — it is already in context the next time it is relevant.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              This is not a failure review — it is a quality review. A task can complete successfully and still have been run at 60% of its potential. The question is always: what would have made this output better? That question, asked consistently, is what makes the system compound.
            </p>

            {/* The loop */}
            <div className="space-y-3">
              {[
                { n: "1", title: "Task runs",                   desc: "Manus reads the relevant skills and follows their instructions. The work is done." },
                { n: "2", title: "Reflect",                     desc: "At the end of the task: what worked well? What was missing? What should be a guardrail next time?" },
                { n: "3", title: "Improve",                     desc: "The skill is updated with the new insight. The version number is bumped. The change is logged in the Skills registry." },
                { n: "4", title: "Every future task benefits",  desc: "The improvement is in context from now on. The same mistake cannot recur. The system compounds." },
              ].map(step => (
                <div key={step.n} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3ba559]/15 border border-[#3ba559]/30 text-[11px] font-bold flex items-center justify-center text-[#3ba559] mt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-foreground">{step.title}</span>
                    <span className="text-sm text-muted-foreground"> — {step.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Compounding callout */}
            <div className="rounded-lg border border-dashed border-[#3ba559]/40 bg-[#3ba559]/4 p-4">
              <p className="text-xs font-semibold text-[#93E07D] uppercase tracking-widest mb-1">Why compounding matters for ERI</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ERI uses AI to accelerate its mission: halving global emissions by 2030. The work spans climate data infrastructure, corporate accountability tools, member engagement, and strategic communications. A system that gets measurably better with every task is not a productivity tool — it is a strategic asset. The Human-AI Lab's premise is that organisations pairing human judgement with AI-powered execution capture a 5× advantage over those that do not. The self-improving system is how ERI demonstrates that premise through its own work.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 3 — The skill ecosystem */}
        <Section
          title="The skill ecosystem"
          subtitle="How skills are the mechanism of self-improvement — and how they are prioritised"
        >
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              A skill is a structured knowledge module — a markdown file that tells Manus how to do a specific type of work well. It is not a prompt template. It is not a checklist. It is the accumulated knowledge of everyone who has done this type of work before, encoded in a form that Manus can read and act on.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Not every skill needs to be read on every task. The tier system controls when each skill is loaded — keeping the most critical knowledge always present while loading specialist knowledge only when it is relevant.
            </p>
            <TierModelCards />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground/70">Assigning tiers:</span> Ask — if this skill were not read, how often would a task fail or produce a worse output? Always → Tier 1. Before a specific risky action → Tier 2. When a specific domain applies → Tier 3. Resist the temptation to promote everything to Tier 1 — a bloated Tier 1 list degrades performance across all tasks.
            </p>
            <div className="pt-1">
              <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:underline">
                Browse the full Skills registry <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 4 — Task lifecycle */}
        <Section
          title="The task lifecycle"
          subtitle="How governance layers, tiers, and the improvement loop connect in a single task"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every ERI task follows the same sequence. The governance model is not a set of rules to remember — it is baked into the sequence itself. Manus cannot start work without reading the Tier 1 skills. It cannot write code without passing the Tier 2 gate. It cannot finish a task without reflecting on what could be improved.
            </p>
            <TaskLifecycleFlow />
            <div className="grid grid-cols-1 gap-3 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              {[
                { step: "Research",              desc: "Clarify purpose, understand current context and existing assets, explore possible solutions." },
                { step: "Design",                desc: "Propose an approach; surface trade-offs and assumptions." },
                { step: "Plan and get acceptance", desc: "Present the plan to the user and wait for explicit go-ahead before proceeding." },
                { step: "Implement",             desc: "Execute the agreed plan." },
                { step: "Test",                  desc: "Verify the output works as intended." },
                { step: "Iterate",               desc: "Refine until the solution works." },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-border p-3 bg-muted/10">
                  <p className="text-xs font-semibold text-foreground mb-1">{String(i + 1).padStart(2, "0")} {item.step}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The most common failure mode is jumping from step 1 directly to step 4. If Manus starts implementing before a plan has been accepted, that is a governance failure — not a capability limitation.
            </p>
          </div>
        </Section>

        {/* Section 5 — Project instructions system */}
        <Section
          title="The project instructions system"
          subtitle="How the skill ecosystem is compiled into a persistent governance layer"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The project instructions block is the compiled output of the skill ecosystem. It is not written by hand — it is generated from the skills registry and injected into every Manus task as the always-on governance layer. It tells Manus what to always check, what to never skip, and which skills to read for which types of work.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When a skill is added, improved, or promoted to a higher tier, the project instructions block is regenerated. This means the governance layer is always in sync with the current state of the skills library — there is no manual maintenance step.
            </p>
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">What the project instructions block controls</p>
              <ul className="space-y-1.5">
                {[
                  "Which skills to read at the start of every task (Tier 1 — always-on)",
                  "Which skills to read before specific actions (Tier 2 — per-action gates)",
                  "The ERI development workflow sequence (research → design → plan → implement → test → iterate)",
                  "The human-AI collaboration mode (peer-colleague, not assistant)",
                  "The post-task reflection requirement (skill improvement loop)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-[#3ba559] mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-1">
              <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:underline">
                Generate or audit the project instructions block <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 6 — Human-AI collaboration principles */}
        <Section
          title="Human-AI collaboration principles"
          subtitle="The behavioural contract — how ERI and Manus work together"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The collaboration model is peer-colleague, not assistant. Manus is expected to disagree plainly when it disagrees, surface the strongest objection to a proposal even when unasked, and admit ignorance or thin evidence rather than projecting false confidence. The goal is not a comfortable interaction — it is a sharper output.
            </p>
            <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {[
                { title: "Direct answers",       desc: "Answer the question first. Do not make the user earn the answer through Socratic questioning." },
                { title: "Named objections",     desc: "After answering, name the strongest objection or failure mode — one or two sentences, even when unasked." },
                { title: "Calibrated confidence", desc: "Admit ignorance, thin evidence, or questions outside competence. Confidence calibration matters more than confidence." },
                { title: "No flattery",          desc: "Never use 'great question', 'excellent point', 'fantastic idea' — including softened variants. Agree briefly when you agree, and move on." },
                { title: "Steelman first",       desc: "Before arguing against a position, state the strongest version the user could defend. Then go at its weakest joint." },
                { title: "Surface assumptions",  desc: "When a request rests on a shaky assumption, surface it before answering or executing — not mid-task." },
              ].map(p => (
                <div key={p.title} className="rounded-lg border border-border p-3 bg-muted/10">
                  <p className="text-xs font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">To invoke peer mode explicitly:</span> say "use the Exponential Human-AI Collaboration skill" or "sharpen my thinking on X". To switch to pure execution: say "just do X". If Manus drifts back to flattery in a long task, start a new task — instruction influence weakens over very long sessions.
            </div>
          </div>
        </Section>

        {/* Section 7 — Further reading */}
        <Section
          title="Further reading"
          subtitle="The broader field of AI-native engineering governance — curated references"
        >
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            ERI's governance model did not emerge in isolation. The field of AI-native engineering governance is developing rapidly — these are the most relevant references for understanding where the discipline is heading and how ERI's approach fits within it.
          </p>
          <FurtherReading />
        </Section>

      </div>
    </PublicLayout>
  );
}
