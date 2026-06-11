/*
 * ERI Brand Design System — Governance & Methodology Page
 *
 * A top-level page explaining the full ERI human-AI governance model:
 * four governance layers, the self-improving system, the skill ecosystem,
 * the three-layer governance model (Activation → Accountability → Curation),
 * the task lifecycle (8-step workflow), the project instructions system,
 * the agent-bridge pattern, technical debt governance, collaboration
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
  Plug, Database, Terminal, Copy, Activity, BarChart2,
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
        { Icon: FileText,    name: "CODEBASE-CONTEXT.md", desc: "Codebase memory: decisions made, known errors, pending work — survives session resets" },
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

// ── Task lifecycle flow — 8-step workflow ─────────────────────────────────────

function TaskLifecycleFlow() {
  const steps = [
    { label: "Load state",        sub: "Skills, context, codebase memory",  color: "#17b7dd" },
    { label: "Research",          sub: "Clarify purpose, explore options",   color: "#3ba559" },
    { label: "Design",            sub: "Propose approach, surface trade-offs", color: "#3ba559" },
    { label: "Plan & accept",     sub: "Wait for explicit go-ahead",         color: "#f59e0b" },
    { label: "Implement",         sub: "Execute the agreed plan",            color: "#6b7280" },
    { label: "Test",              sub: "Verify the output works",            color: "#6b7280" },
    { label: "Iterate",           sub: "Refine until the solution works",    color: "#6b7280" },
    { label: "Close",             sub: "Update codebase memory, log skills", color: "#3ba559" },
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
      example: "eri-skills-orchestrator (entry point — identifies which other skills apply), eri-human-ai-collaboration, eri-bds-reference",
    },
    {
      label: "Tier 2 — Per-action gate",
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.30)",
      when: "Re-read immediately before a specific action — even within the same task.",
      why: "These skills are guardrails for high-risk actions. Reading them once at task start is not enough — they must be consulted at the moment of action.",
      constraint: "Can be longer. Only loaded when the specific action is about to happen.",
      example: "eri-trpc (before adding a router or procedure), eri-bds-site (before extending the BDS site)",
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

export default function Governance() {
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
          <PageGuide text="This is how ERI ensures that every task — from building a data pipeline to drafting a member report — is executed with the same rigour and institutional knowledge, regardless of who starts it. No technical background required: the page is written for the whole team and for anyone who wants to understand ERI's approach to AI-native operations." />
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
              Skills are not written once and left unchanged. They are living documents that improve after every task. The same mistake cannot recur once it has been encoded into a skill — every future task benefits from the correction automatically.
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
                ERI is driven by climate science and planetary boundaries — and it pursues that mission through the lens of business. The fastest economic transition in history is underway. Companies that act now can drive growth, build resilience, and shape the new economy. Sustainability is not a cost of doing business; it is the source of exponential growth. The Exponential Platform covers more than 52,000 companies in its data lake, mapping the full landscape of that opportunity. A system that gets measurably better with every task is not a productivity tool — it is a strategic asset at the scale of the transformation ERI is helping companies navigate. The Human-AI Lab's premise is that organisations pairing human judgement with AI-powered execution capture a 5× advantage over those that do not. The self-improving system is how ERI demonstrates that premise through its own work.
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

            {/* Orchestrator callout */}
            <div className="rounded-lg border border-dashed p-4 flex items-start gap-3" style={{ borderColor: "rgba(59,165,89,0.4)", backgroundColor: "rgba(59,165,89,0.04)" }}>
              <Brain className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#3ba559" }} />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">The orchestrator — the entry point to the whole system</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The <span className="font-medium text-foreground">eri-skills-orchestrator</span> is a Tier 1 skill whose sole job is to tell Manus which other skills to read for each type of task. Rather than scanning all 25+ skills on every task, Manus reads the orchestrator first, matches the task to a task type (e.g. "add a data source", "write a router", "extend the BDS site"), and reads only the skills listed for that type. This keeps context lean and ensures the right knowledge is always loaded — without overloading every task with irrelevant detail.
                </p>
              </div>
            </div>

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

        {/* Section 4 — The three-layer governance model */}
        <Section
          title="The three-layer governance model"
          subtitle="How the system activates, holds itself accountable, and improves over time"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The skill ecosystem is not just a library of documents — it is a self-governing system with three distinct layers. Each layer plays a different role in keeping the system healthy and improving over time.
            </p>

            <div className="space-y-3">
              {[
                {
                  n: "1",
                  Icon: Brain,
                  color: "#3ba559",
                  title: "Activation",
                  label: "The orchestrator identifies which skills apply",
                  desc: "At the start of every task, Manus reads the orchestrator skill. The orchestrator matches the task to a task type and tells Manus exactly which skills to read. No scanning. No guessing. The right knowledge is loaded before any work begins.",
                },
                {
                  n: "2",
                  Icon: Activity,
                  color: "#f59e0b",
                  title: "Accountability",
                  label: "Usage logs close the feedback loop",
                  desc: "After every task, the agent logs which skills were read and whether they were helpful, stale, or missing. These logs are the only signal the library has about which skills are actually being used. Without them, the library cannot improve itself — it becomes a write-only system.",
                },
                {
                  n: "3",
                  Icon: BarChart2,
                  color: "#17b7dd",
                  title: "Curation",
                  label: "The Health Dashboard surfaces what needs attention",
                  desc: "The Skills page shows a Health Dashboard: last-used dates, helpful vs stale verdicts, and a list of skills that have never been logged. Quarterly review uses this data to identify candidates for retirement, merging, or promotion to a higher tier. The library stays lean and relevant.",
                },
              ].map(layer => {
                const LayerIcon = layer.Icon;
                return (
                  <div key={layer.n} className="rounded-lg border border-border p-4 bg-muted/10">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${layer.color}18`, border: `1.5px solid ${layer.color}50` }}
                      >
                        <LayerIcon className="w-3.5 h-3.5" style={{ color: layer.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold" style={{ color: layer.color }}>Layer {layer.n} — {layer.title}</p>
                          <p className="text-xs text-foreground/70 font-medium">{layer.label}</p>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{layer.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">The accountability layer matters most.</span> A skills library with no usage data is a write-only system — it can only be improved by the people who wrote it, not by the tasks that use it. The usage log is the mechanism that makes the library self-improving rather than self-referential.
            </div>

            <div className="pt-1">
              <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:underline">
                View the Skills Health Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 5 — Task lifecycle */}
        <Section
          title="The task lifecycle"
          subtitle="The 8-step workflow every ERI task follows — from loading context to closing with updated memory"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every ERI task follows the same eight-step sequence. The governance model is not a set of rules to remember — it is baked into the sequence itself. The task cannot start without loading the right context (step 1), cannot proceed without an accepted plan (step 4), and cannot close without updating the codebase memory (step 8).
            </p>
            <TaskLifecycleFlow />
            <div className="grid grid-cols-1 gap-3 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
              {[
                { step: "Load current state",    desc: "Fetch the latest BDS skill and project instructions. Read CODEBASE-CONTEXT.md in full. Scan the skills list and read all relevant skills before taking any action." },
                { step: "Research",              desc: "Clarify purpose, understand current context and existing assets, explore possible solutions." },
                { step: "Design",                desc: "Propose an approach; surface trade-offs and assumptions." },
                { step: "Plan and get acceptance", desc: "Present the plan to the user and wait for explicit go-ahead before proceeding." },
                { step: "Implement",             desc: "Execute the agreed plan. Save a checkpoint after every 3–5 file changes." },
                { step: "Test",                  desc: "Verify the output works as intended." },
                { step: "Iterate",               desc: "Refine until the solution works." },
                { step: "Close",                 desc: "Update CODEBASE-CONTEXT.md with new decisions, corrected errors, or newly discovered issues. Log skill usage." },
              ].map((item, i) => (
                <div key={i} className="rounded-lg border border-border p-3 bg-muted/10">
                  <p className="text-xs font-semibold text-foreground mb-1">{String(i + 1).padStart(2, "0")} {item.step}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The most common failure mode is jumping from step 1 directly to step 5. If Manus starts implementing before a plan has been accepted, that is a governance failure — not a capability limitation. Steps 1 and 8 are the bookends that make the system self-sustaining: step 1 loads accumulated knowledge, step 8 adds to it.
            </p>
          </div>
        </Section>

        {/* Section 6 — Project instructions system */}
        <Section
          title="The project instructions system"
          subtitle="How the skill ecosystem is compiled into a persistent governance layer"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The project instructions block is the compiled output of the skill ecosystem. It is generated from the skills registry and injected into every Manus task as the always-on governance layer. It tells Manus what to always check, what to never skip, and which skills to read for which types of work.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The current format is a compact, workflow-first document: a single 8-step task workflow followed by the three-tier skill list. When a skill is added, improved, or promoted to a higher tier, the project instructions block is regenerated. This means the governance layer is always in sync with the current state of the skills library.
            </p>
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">What the project instructions block controls</p>
              <ul className="space-y-1.5">
                {[
                  "The 8-step task workflow (load state → research → design → plan → implement → test → iterate → close)",
                  "Which skills to read at the start of every task (Tier 1 — always-on)",
                  "Which skills to read before specific actions (Tier 2 — per-action gates)",
                  "Which skills to read when a domain applies (Tier 3 — conditional)",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-[#3ba559] mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-1">
              <Link href="/project-instructions" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:underline">
                Generate or audit the project instructions block <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 7 — The agent-bridge pattern */}
        <Section
          title="The agent-bridge pattern"
          subtitle="How to surface Manus system assets in a web application"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Manus platform has no API to read project instructions, skill files, or other system assets from a web application. These assets only exist inside the agent's context window — they are injected by the platform at task start and are never exposed to the browser.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The <strong className="text-foreground">agent-bridge pattern</strong> solves this. Instead of trying to fetch system assets directly, the web application asks a Manus agent to read them and write the result back via a tRPC mutation. The agent acts as the bridge between the Manus platform context and the application database.
            </p>

            {/* Three-step diagram */}
            <div className="rounded-xl border border-border p-4 bg-muted/5">
              <p className="text-xs font-semibold text-foreground mb-3">How it works</p>
              <div className="flex items-start gap-0">
                {[
                  { Icon: Copy,     color: "#17b7dd", step: "1", label: "Copy prompt",     desc: "User clicks \"Copy sync prompt\" in the web app. The prompt instructs the agent to read a specific context block and call a named tRPC mutation." },
                  { Icon: Terminal, color: "#f59e0b", step: "2", label: "Agent reads",     desc: "User pastes the prompt into a new Manus task. The agent reads the system asset from its context — project instructions, skill file, or sandbox state." },
                  { Icon: Database, color: "#3ba559", step: "3", label: "Agent writes back", desc: "The agent calls the tRPC mutation with the asset text. The mutation upserts a single row in the database. The web app fetches it on next load." },
                ].map(({ Icon, color, step, label, desc }, idx) => (
                  <div key={step} className="flex items-start">
                    <div className="flex flex-col items-center gap-1.5" style={{ minWidth: "120px", maxWidth: "160px" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}50` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <p className="text-[11px] font-semibold text-foreground text-center">{step}. {label}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed text-center">{desc}</p>
                    </div>
                    {idx < 2 && (
                      <ArrowRight className="w-3 h-3 text-muted-foreground/40 mx-2 mt-2.5 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* When to use */}
            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">When to use this pattern</p>
              <ul className="space-y-1.5">
                {[
                  "A UI needs to display the current Manus project instructions",
                  "A UI needs to show the contents of a skill file from the sandbox",
                  "A UI needs to reflect the current state of a sandbox file or environment variable",
                  "Any time a web app needs data that only exists inside an agent's context window",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                    <span className="text-[#3ba559] mt-0.5 flex-shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation note */}
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Plug className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-xs font-semibold text-foreground">Implementation note for agents</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When a feature requires displaying data that only an agent can read, <strong className="text-foreground">propose the agent-bridge pattern before building a static fallback</strong>. A static fallback (hardcoded constant) goes stale the moment the source changes. The agent-bridge keeps the UI accurate whenever the user chooses to sync. The tRPC mutation should be admin-only to prevent arbitrary injection, and the table should use a single upserted row (id=1) since only one live version exists at a time.
              </p>
            </div>

            <div className="pt-1">
              <Link href="/project-instructions" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3ba559] hover:underline">
                See it in action on the Project Instructions page <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Section>

        {/* Section 8 — Technical debt governance */}
        <Section
          title="Technical debt governance: prevention vs remediation"
          subtitle="Why skills prevent new debt but cannot fix existing debt — and how opportunistic remediation bridges the gap"
        >
          <div className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              The skills library is a <span className="font-medium text-foreground">prevention-only system by default</span>. Every gate in a skill stops a known mistake from being introduced into new code. But it cannot reach back in time to fix debt that accumulated before the skill was written. A lean code audit of the ERI Exponential Platform in June 2026 made this concrete: seven categories of technical debt were identified — almost all of it pre-existing, invisible to the skill gates that would have caught it if they had existed earlier.
            </p>

            <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
              {[
                {
                  label: "Prevention",
                  color: "#3ba559",
                  desc: "Skills with code-quality gates stop known anti-patterns from entering new code. Every task that reads the relevant skill benefits from every previous improvement.",
                  example: "Gate: no private getDb() in router files."
                },
                {
                  label: "Remediation",
                  color: "#f59e0b",
                  desc: "Pre-existing debt requires a different mechanism. A dedicated refactoring sprint is expensive and disruptive. The alternative is opportunistic remediation — paying down debt as a side effect of normal work.",
                  example: "Rule: if you are already editing a router, also fix any private getDb() you find there."
                },
              ].map(item => (
                <div key={item.label} className="rounded-lg border border-border p-4 bg-muted/10">
                  <p className="text-xs font-semibold mb-1" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/70 bg-muted/30 rounded px-2 py-1">{item.example}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">The opportunistic remediation principle</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                When a skill identifies a category of pre-existing debt, it adds an <span className="font-medium text-foreground">opportunistic remediation rule</span>: if you are already touching an affected file for any reason, apply the fix as part of the same task. The fix must be mechanical and bounded — if it takes more than 10 minutes or touches more than 3 files, note it and move on. Over time, this compounds: each task that touches an affected area pays down a small amount of debt without requiring a dedicated sprint.
              </p>
              <div className="grid grid-cols-1 gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {[
                  { title: "Known debt catalogues", desc: "Skills name pre-existing issues explicitly so agents know to fix them when they encounter them." },
                  { title: "Rolling reduction", desc: "No sprint required. Debt shrinks as a side effect of normal feature work and bug fixes." },
                  { title: "Compounding improvement", desc: "Each fix raises the baseline for the next agent. The system improves continuously, not in batches." },
                  { title: "Bounded scope", desc: "Opportunistic rules are mechanical and time-boxed. They never expand into unplanned refactoring." },
                ].map(item => (
                  <div key={item.title} className="rounded border border-border/50 p-2.5 bg-background/50">
                    <p className="text-[11px] font-semibold text-foreground mb-0.5">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">In practice:</span> the <code className="font-mono text-[10px] px-1 rounded bg-muted">eri-trpc</code> and <code className="font-mono text-[10px] px-1 rounded bg-muted">data-source-integration</code> skills contain opportunistic remediation rules added after the June 2026 lean code audit. The Skills registry on this hub shows the current version of each skill.
            </div>
          </div>
        </Section>

        {/* Section 9 — Human-AI collaboration principles */}
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

        {/* Start a Project callout */}
        <div className="rounded-xl border border-border bg-muted/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Ready to start a new ERI web project?</p>
            <p className="text-xs text-muted-foreground leading-relaxed">The Start a Project page walks you through bootstrapping a new ERI codebase — from fetching the BDS skill to publishing a compliant <code className="font-mono text-[10px] px-1 rounded bg-muted">bds-meta.json</code>.</p>
          </div>
          <Link href="/new-webproject" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3ba559] hover:underline shrink-0">
            Start a Project <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Section 10 — Further reading */}
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
