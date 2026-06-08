/**
 * ERI Brand Design System — Skills Management Page
 *
 * The self-improving skills ecosystem for ERI's Manus AI agent work.
 * Reads are public. Writes (add/edit/log improvement/delete) are admin-only.
 *
 * Sections:
 *   1. Hero — title, stats, system overview (collapsible)
 *   2. Skill registry — grouped by tier, collapsible rows with improvement log
 *   3. Add / Log Improvement dialogs (admin only)
 */

import { useState } from "react";
import { Layers, Clock, Download, Code2, BookOpen, Palette, Shield, Search, Settings, Cloud, Music, ChevronDown, ChevronUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PublicLayout from "@/components/PublicLayout";
import { PageGuide } from "@/components/PageGuide";
// Types inlined to avoid cross-boundary import from client to server/drizzle
interface Skill {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  version: string;
  readWhen: string;
  category: string;
  hasReferences: boolean;
}

// ── Category config ───────────────────────────────────────────────────────────

// BDS six-slot accent palette — left border colour + tinted bg
const CATEGORY_CONFIG: Record<string, { label: string; Icon: React.ElementType; accentColor: string; tintBg: string }> = {
  brand:       { label: "brand",       Icon: Palette,  accentColor: "#f59e0b", tintBg: "rgba(245,158,11,0.08)" },
  process:     { label: "process",     Icon: Settings, accentColor: "#8b5cf6", tintBg: "rgba(139,92,246,0.08)" },
  platform:    { label: "platform",    Icon: Cloud,    accentColor: "#06b6d4", tintBg: "rgba(6,182,212,0.08)" },
  data:        { label: "data",        Icon: Search,   accentColor: "#3ba559", tintBg: "rgba(59,165,89,0.08)" },
  security:    { label: "security",    Icon: Shield,   accentColor: "#ef4444", tintBg: "rgba(239,68,68,0.08)" },
  development: { label: "development", Icon: Code2,    accentColor: "#17b7dd", tintBg: "rgba(23,183,221,0.08)" },
  domain:      { label: "domain",      Icon: BookOpen, accentColor: "#3ba559", tintBg: "rgba(59,165,89,0.08)" },
  design:      { label: "design",      Icon: Palette,  accentColor: "#f59e0b", tintBg: "rgba(245,158,11,0.08)" },
  meta:        { label: "meta",        Icon: Settings, accentColor: "#8b5cf6", tintBg: "rgba(139,92,246,0.08)" },
  media:       { label: "media",       Icon: Music,    accentColor: "#f97316", tintBg: "rgba(249,115,22,0.08)" },
};

function CategoryBadge({ category }: { category: string }) {
  if (!category) return null;
  const cfg = CATEGORY_CONFIG[category] ?? { label: category, Icon: Settings, accentColor: "#6b7280", tintBg: "rgba(107,114,128,0.08)" };
  const { Icon } = cfg;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide border"
      style={{ color: cfg.accentColor, borderColor: `${cfg.accentColor}50`, backgroundColor: cfg.tintBg }}
    >
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

interface SkillImprovement {
  id: number;
  skillId: string;
  version: string;
  summary: string;
  taskContext: string | null;
  loggedAt: Date;
}

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<number, {
  label: string;
  shortLabel: string;
  accentColor: string;
  tintBg: string;
  heading: string;
  when: string;
  constraint: string;
  example: string;
}> = {
  1: {
    label: "Tier 1 — Always-on",
    shortLabel: "Tier 1",
    accentColor: "#3ba559",
    tintBg: "rgba(59,165,89,0.06)",
    heading: "text-[#3ba559]",
    when: "Read at the start of every task, without exception.",
    constraint: "Must be lean — every token costs on every task. Keep under 200 lines.",
    example: "Core operating procedures, collaboration principles, dev standards.",
  },
  2: {
    label: "Tier 2 — Per-action gate",
    shortLabel: "Tier 2",
    accentColor: "#f59e0b",
    tintBg: "rgba(245,158,11,0.06)",
    heading: "text-amber-600 dark:text-amber-400",
    when: "Re-read immediately before a specific action — even within the same task.",
    constraint: "Can be longer. Only loaded when the specific action is about to happen.",
    example: "UI design rules before writing any component. Router guard before adding a procedure.",
  },
  3: {
    label: "Tier 3 — Conditional",
    shortLabel: "Tier 3",
    accentColor: "#17b7dd",
    tintBg: "rgba(23,183,221,0.06)",
    heading: "text-[#17b7dd]",
    when: "Read when the domain or trigger condition applies.",
    constraint: "Can be detailed. Only loaded when the domain is relevant.",
    example: "ERI brand rules when building a web project. Data source patterns when adding a new source.",
  },
};

// ── Tier badge ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: number }) {
  const cfg = TIER_CONFIG[tier] ?? { shortLabel: `Tier ${tier}`, accentColor: "#6b7280" };
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-widest uppercase border"
      style={{ color: cfg.accentColor, borderColor: `${cfg.accentColor}80` }}
    >
      {cfg.shortLabel}
    </span>
  );
}

// ── Governance Diagram ────────────────────────────────────────────────────────

/**
 * Four-level governance diagram — rendered as HTML/CSS, no external images.
 * Designed to be readable by non-technical colleagues.
 * Levels: Manus System → ERI Project → Codebase → Task
 * Feedback loop: Task improvements flow back into Project Skills.
 */
function GovernanceDiagram() {
  const levels = [
    {
      id: "system",
      emoji: "🌐",
      title: "Manus Platform",
      subtitle: "The foundation — always present, not configurable by ERI",
      color: "#6b7280",
      tint: "rgba(107,114,128,0.06)",
      border: "rgba(107,114,128,0.25)",
      assets: [
        { icon: "🛠", name: "Built-in tools", desc: "Browser, code editor, file system, image generation, search" },
        { icon: "📖", name: "General skills", desc: "Skill creator, image routing, API access, scheduling" },
        { icon: "⚙️", name: "System behaviour", desc: "Safety rules, tool use patterns, response format" },
      ],
    },
    {
      id: "project",
      emoji: "🏢",
      title: "ERI Project",
      subtitle: "Shared across every ERI task — the team's accumulated knowledge",
      color: "#3ba559",
      tint: "rgba(59,165,89,0.06)",
      border: "rgba(59,165,89,0.30)",
      assets: [
        { icon: "📋", name: "Project Instructions", desc: "Always-on rules: how to behave, what to always check, what to never skip" },
        { icon: "🧠", name: "Project Skills", desc: "Living knowledge modules: how ERI work is done well — improving after every task" },
        { icon: "📁", name: "Project Files", desc: "Shared domain knowledge: framework PDFs, specs, canonical reference documents" },
      ],
    },
    {
      id: "codebase",
      emoji: "💻",
      title: "Codebase",
      subtitle: "Specific to one application — persists across tasks on that codebase",
      color: "#f59e0b",
      tint: "rgba(245,158,11,0.06)",
      border: "rgba(245,158,11,0.30)",
      assets: [
        { icon: "🗂", name: "CODEBASE-CONTEXT.md", desc: "Codebase memory: decisions made, known errors, pending work — survives session resets" },
        { icon: "✅", name: "todo.md", desc: "Active work tracking: what is in progress, what is done, what is next" },
        { icon: "🏗", name: "The codebase itself", desc: "The actual application being built — code, database schema, tests" },
      ],
    },
    {
      id: "task",
      emoji: "⚡",
      title: "Task",
      subtitle: "A single session — ephemeral, exists only while the task is running",
      color: "#17b7dd",
      tint: "rgba(23,183,221,0.06)",
      border: "rgba(23,183,221,0.30)",
      assets: [
        { icon: "💬", name: "Conversation", desc: "Everything said in this session — the brief, the decisions, the feedback" },
        { icon: "📎", name: "Attached files", desc: "Documents or images shared for this specific task" },
        { icon: "🔄", name: "Sandbox state", desc: "Installed packages, running processes, downloaded files — reset between sessions" },
      ],
    },
  ];

  return (
    <div className="space-y-2">
      {/* Diagram: nested zones */}
      <div className="relative">
        {levels.map((level, idx) => (
          <div
            key={level.id}
            className="rounded-xl border p-4 mb-2"
            style={{
              borderColor: level.border,
              backgroundColor: level.tint,
              marginLeft: `${idx * 16}px`,
            }}
          >
            {/* Level header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg leading-none">{level.emoji}</span>
              <div>
                <span className="text-sm font-semibold" style={{ color: level.color }}>{level.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{level.subtitle}</span>
              </div>
            </div>
            {/* Assets */}
            <div className="flex flex-wrap gap-2">
              {level.assets.map(asset => (
                <div
                  key={asset.name}
                  className="group relative flex items-start gap-2 rounded-lg border px-3 py-2 cursor-default"
                  style={{ borderColor: level.border, backgroundColor: "var(--card)" }}
                >
                  <span className="text-base leading-none mt-0.5 flex-shrink-0">{asset.icon}</span>
                  <div>
                    <p className="text-xs font-medium text-foreground">{asset.name}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{asset.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback loop callout */}
      <div className="rounded-lg border border-dashed p-3 flex items-start gap-3" style={{ borderColor: "rgba(59,165,89,0.4)", backgroundColor: "rgba(59,165,89,0.04)" }}>
        <span className="text-lg leading-none flex-shrink-0 mt-0.5">🔁</span>
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

// ── System Overview (Philosophy tab) ─────────────────────────────────────────

function SystemOverview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-8">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">How this system works</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Governance layers, tier model, and the self-improvement loop
          </p>
        </div>
        <span className="text-muted-foreground text-xs ml-4">{open ? "Collapse ↑" : "Expand ↓"}</span>
      </button>

      {open && (
        <div className="border-t border-border px-5 py-6 space-y-10 bg-muted/10">

          {/* The big idea */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">The big idea</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Every ERI task runs inside a layered knowledge system. Before Manus writes a single line of code or drafts a single sentence, it has already read the team's operating principles, the domain expertise relevant to this work, and the memory of every decision made on this codebase before. The result is that each task starts from a higher baseline — and when the task is done, what was learned raises that baseline further.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mt-2">
              This is not automation replacing judgement. It is a system that makes human–AI collaboration more consistent, more informed, and more efficient with every task completed.
            </p>
          </section>

          {/* Governance diagram */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">The four governance layers</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Think of these as concentric rings. The outer rings are always present — they form the foundation every task builds on. The inner rings are more specific — they carry knowledge about a particular codebase or session. Every task draws from all four layers simultaneously.
            </p>
            <GovernanceDiagram />
          </section>

          {/* Tier model */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">How skills are prioritised — the tier model</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Not every skill needs to be read on every task. The tier system controls when each skill is loaded — keeping the most critical knowledge always present while loading specialist knowledge only when it is relevant.
            </p>
            <div className="grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {([1, 2, 3] as const).map(tier => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <div key={tier} className="rounded-md border border-l-4 border-border p-3 space-y-2" style={{ borderLeftColor: cfg.accentColor, backgroundColor: cfg.tintBg }}>
                    <span className="text-xs font-semibold" style={{ color: cfg.accentColor }}>{cfg.label}</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      <span className="font-medium">When:</span> {cfg.when}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium">Size limit:</span> {cfg.constraint}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium">Example:</span> {cfg.example}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              <span className="font-medium text-foreground/70">Assigning tiers:</span> Ask — if this skill were not read, how often would a task fail or produce a worse output? Always → Tier 1. Before a specific risky action → Tier 2. When a specific domain applies → Tier 3. Resist the temptation to promote everything to Tier 1 — a bloated Tier 1 list degrades performance across all tasks.
            </p>
          </section>

          {/* Self-improvement loop */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">How skills get better — the improvement loop</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Skills are not written once and left unchanged. They are living documents that improve after every task. The loop is simple:
            </p>
            <ol className="space-y-2">
              {[
                { n: "1", title: "Task runs", desc: "Manus reads the relevant skills and follows their instructions. The work is done." },
                { n: "2", title: "Reflect", desc: "At the end of the task: what worked well? What was missing? What should be a guardrail next time?" },
                { n: "3", title: "Improve", desc: "The skill is updated with the new insight. The version number is bumped. The change is logged here." },
                { n: "4", title: "Every future task benefits", desc: "The improvement is in context from now on. The same mistake cannot recur. The system compounds." },
              ].map(step => (
                <li key={step.n} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted border border-border text-[10px] font-bold flex items-center justify-center text-muted-foreground mt-0.5">
                    {step.n}
                  </span>
                  <div>
                    <span className="text-sm font-medium text-foreground">{step.title}</span>
                    <span className="text-sm text-muted-foreground"> — {step.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              This is not a failure review — it is a quality review. A task can complete successfully and still have been run at 60% of its potential. The question is always: what would have made this output better?
            </p>
          </section>

          {/* Using this page */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Using this page</h3>
            <ul className="space-y-1.5">
              {[
                "Browse the Skills tab to see every registered skill, its tier, and its full improvement history.",
                "Use 'Log Improvement' after a task to record what changed and why — this is the improvement loop in action.",
                "Use 'Add Skill' to register a new skill. The ID must match the skill's directory name in /home/ubuntu/skills/.",
                "Use the Project Instructions tab to generate the instructions block for your Manus project settings.",
                "Version numbers follow semver: patch (1.0.1) for small additions, minor (1.1.0) for structural changes.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="text-muted-foreground/40 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      )}
    </div>
  );
}

// ── Improvement log ───────────────────────────────────────────────────────────

interface ImprovementLogProps {
  improvements: Array<Pick<SkillImprovement, "id" | "version" | "summary" | "taskContext" | "loggedAt">>;
}

function ImprovementLog({ improvements }: ImprovementLogProps) {
  if (improvements.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-2">
        No improvements logged yet. After applying this skill in a task, use 'Log Improvement' to record what you learned.
      </div>
    );
  }
  return (
    <ol className="relative border-l border-border ml-2 space-y-4">
      {improvements.map((imp) => (
        <li key={imp.id} className="ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-muted-foreground" />
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-xs font-mono font-semibold">v{imp.version}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(imp.loggedAt).toLocaleDateString("en-GB")}
            </span>
            {imp.taskContext && (
              <span className="text-xs text-muted-foreground italic">· {imp.taskContext}</span>
            )}
          </div>
          <p className="text-sm text-foreground">{imp.summary}</p>
        </li>
      ))}
    </ol>
  );
}

// ── Log Improvement dialog ────────────────────────────────────────────────────

interface LogImprovementDialogProps {
  skillId: string;
  currentVersion: string;
  onSuccess: () => void;
}

function LogImprovementDialog({ skillId, currentVersion, onSuccess }: LogImprovementDialogProps) {
  const [open, setOpen] = useState(false);
  const [version, setVersion] = useState(currentVersion);
  const [summary, setSummary] = useState("");
  const [taskContext, setTaskContext] = useState("");

  const logMutation = trpc.skills.logImprovement.useMutation({
    onSuccess: () => {
      setOpen(false);
      setSummary("");
      setTaskContext("");
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Log Improvement</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Improvement — {skillId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>New version</Label>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 1.1.0"
              className="mt-1"
            />
          </div>
          <div>
            <Label>What changed and why</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe the improvement — what was wrong, what the fix is, and why it matters. Be specific enough that someone reading this in 6 months understands the context."
              className="mt-1"
              rows={4}
            />
          </div>
          <div>
            <Label>Task context (optional)</Label>
            <Input
              value={taskContext}
              onChange={(e) => setTaskContext(e.target.value)}
              placeholder="e.g. BDS site — Skills tab integration"
              className="mt-1"
            />
          </div>
          <Button
            onClick={() =>
              logMutation.mutate({
                skillId,
                version,
                summary,
                taskContext: taskContext || undefined,
              })
            }
            disabled={!summary.trim() || !version.trim() || logMutation.isPending}
            className="w-full"
          >
            {logMutation.isPending ? "Saving…" : "Save Improvement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Skill row ─────────────────────────────────────────────────────────────────

interface SkillRowProps {
  skill: Skill;
  isAdmin: boolean;
  onRefresh: () => void;
}

function SkillRow({ skill, isAdmin, onRefresh }: SkillRowProps) {
  const cfg = TIER_CONFIG[skill.tier] ?? TIER_CONFIG[3];
  const [isOpen, setIsOpen] = useState(false);

  // Lazy-load improvements + SKILL.md content only when the row is expanded
  const { data: detail, isLoading: detailLoading } = trpc.skills.get.useQuery(
    { id: skill.id },
    { enabled: isOpen }
  );
  const { data: rawContent, isLoading: contentLoading } = trpc.skills.getContent.useQuery(
    { id: skill.id },
    { enabled: isOpen }
  );
  const improvements = detail?.improvements ?? [];
  const hasSelfImprovement = improvements.length > 0;

  // Extract a short preview from the SKILL.md body (strip frontmatter, take first ~350 chars)
  const contentPreview = rawContent
    ? (() => {
        const body = rawContent.replace(/^---[\s\S]*?---\s*/m, "").trim();
        return body.length > 350 ? body.slice(0, 350).trimEnd() + "…" : body;
      })()
    : null;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content =
      `# ${skill.name}\n\nID: ${skill.id}\nVersion: ${skill.version}\nTier: ${skill.tier}\nCategory: ${skill.category}\n\n## Description\n\n${skill.description}\n\n## When to Read\n\n${skill.readWhen}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skill.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const catCfg = skill.category ? (CATEGORY_CONFIG[skill.category] ?? null) : null;
  const accentColor = catCfg ? catCfg.accentColor : cfg.accentColor;
  const tintBg = catCfg ? catCfg.tintBg : cfg.tintBg;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div
        className="border border-border border-l-4 rounded-xl overflow-hidden bg-card"
        style={{ borderLeftColor: accentColor, backgroundColor: tintBg }}
      >
        {/* Card header — always visible */}
        <CollapsibleTrigger className="w-full text-left">
          <div className="px-5 pt-5 pb-3 hover:bg-muted/20 transition-colors">
            {/* Top row: name + tier badge + category badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-base text-foreground leading-snug">{skill.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{skill.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                <TierBadge tier={skill.tier} />
                <CategoryBadge category={skill.category} />
                {/* Expand affordance — rotates on open */}
                <span className="ml-1 text-muted-foreground transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-flex' }}>
                  <ChevronDown size={16} />
                </span>
              </div>
            </div>

            {/* Description preview */}
            <p className="text-sm text-foreground/75 leading-relaxed mt-3">{skill.description}</p>

            {/* readWhen callout — most important signal on the card */}
            {skill.readWhen && (
              <div
                className="mt-3 rounded-md border-l-2 px-4 py-2.5 flex items-start gap-2"
                style={{ borderLeftColor: accentColor, backgroundColor: `${accentColor}0d` }}
              >
                <Clock size={12} className="flex-shrink-0 mt-0.5" style={{ color: accentColor }} />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  <span className="font-semibold" style={{ color: accentColor }}>When:</span>{" "}
                  {skill.readWhen}
                </p>
              </div>
            )}
          </div>
        </CollapsibleTrigger>

          {/* Card footer — always visible */}
          <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">v{skill.version}</span>
              {isOpen && improvements.length > 0 && (
                <span className="text-xs text-muted-foreground">· {improvements.length} improvement{improvements.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-7 px-3 inline-flex items-center gap-1.5">
                {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {isOpen ? 'Close' : 'Details'}
              </Button>
            </CollapsibleTrigger>
            <Button variant="outline" size="sm" className="text-xs h-7 px-3 inline-flex items-center gap-1.5" onClick={handleDownload}>
              <Download size={12} /> Download
            </Button>
          </div>
        </div>

        {/* Expanded content */}
          <CollapsibleContent>
          <div className="border-t border-border px-5 py-5 space-y-4 bg-muted/10">
            {/* File path hint */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/30 rounded px-3 py-1.5">
              <span className="text-muted-foreground/50">/</span>
              /home/ubuntu/skills/{skill.id}/SKILL.md
              {skill.hasReferences && (
                <span className="ml-2 text-muted-foreground/60">+ references/</span>
              )}
            </div>

            {/* Admin: Log Improvement */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap">
                <LogImprovementDialog
                  skillId={skill.id}
                  currentVersion={skill.version}
                  onSuccess={onRefresh}
                />
              </div>
            )}

            {/* Content preview — first ~350 chars of SKILL.md body */}
            {(contentLoading) && (
              <div className="h-16 rounded bg-muted animate-pulse" />
            )}
            {!contentLoading && contentPreview && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Preview
                </p>
                <div className="rounded-md bg-muted/20 border border-border px-4 py-3">
                  <p className="text-xs text-foreground/70 leading-relaxed whitespace-pre-wrap font-mono">{contentPreview}</p>
                </div>
              </div>
            )}

            {/* Improvement log — lazy loaded */}
            {detailLoading && (
              <div className="h-12 rounded bg-muted animate-pulse" />
            )}
            {!detailLoading && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Improvement Log
                </p>
                {!hasSelfImprovement ? (
                  <div className="rounded-md bg-muted/20 border border-dashed border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      No improvements logged yet. After applying this skill in a task, expand this card and use{" "}
                      <span className="font-medium">Log Improvement</span> to record what you learned.
                    </p>
                  </div>
                ) : (
                  <ImprovementLog improvements={improvements} />
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
// ── Pagee ────────────────────────────────────────────────────────────────────────────────

type EcosystemFilter = "eri" | "manus" | "all";

export default function Skills() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const { data: skillsList, isLoading } = trpc.skills.list.useQuery();

  const refresh = () => utils.skills.list.invalidate();

  // ── Filter state
  const [ecosystemFilter, setEcosystemFilter] = useState<EcosystemFilter>("all");
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // ── Derived stats (improvements are NOT in the list response — lazy-loaded per row)
  const eriSkills = skillsList?.filter(s => s.id.startsWith("eri-")) ?? [];
  const manusSkills = skillsList?.filter(s => !s.id.startsWith("eri-")) ?? [];
  const allCategories = Array.from(
    new Set((skillsList ?? []).map(s => s.category).filter(Boolean) as string[])
  ).sort();

  const ecosystemBase =
    ecosystemFilter === "eri" ? eriSkills :
    ecosystemFilter === "manus" ? manusSkills :
    (skillsList ?? []);

  const filteredSkills = ecosystemBase.filter(s => {
    if (tierFilter !== null && s.tier !== tierFilter) return false;
    if (categoryFilter !== null && s.category !== categoryFilter) return false;
    return true;
  });

  const grouped = {
    1: filteredSkills.filter(s => s.tier === 1),
    2: filteredSkills.filter(s => s.tier === 2),
    3: filteredSkills.filter(s => s.tier === 3),
  };

  const toggleTier = (t: number) => setTierFilter(prev => prev === t ? null : t);
  const toggleCategory = (c: string) => setCategoryFilter(prev => prev === c ? null : c);

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-[#232323] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
            ERI SKILL ECOSYSTEM
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Skills — Operational Knowledge System</h1>
          <PageGuide text="Skills encode how work is done well — not just how mistakes are avoided. Each skill is a living knowledge module built from real decisions, real deliverables, and real experience. Use the filter controls below to browse the registry by tier, category, or ecosystem. Visit the Governance tab to understand the tier model and self-improvement loop. Use the Project Instructions tab to generate or audit the instructions block for your Manus project." />
          {skillsList && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-sm text-white/70">
                <span className="text-white font-semibold">{skillsList.length}</span> skills in the ecosystem
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <>
        {isAdmin && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-muted-foreground">Logged in as admin — expand any skill to log improvements.</p>
          </div>
        )}

        {/* Filter bar */}
        <div className="mb-6 space-y-3">
          {/* Row 1: Ecosystem tabs */}
          <div className="flex items-center gap-1 border-b border-border pb-3 flex-wrap">
            {([
              { id: "all" as const,   label: "All",            count: skillsList?.length ?? 0 },
              { id: "eri" as const,   label: "ERI skills",     count: eriSkills.length },
              { id: "manus" as const, label: "Manus standard", count: manusSkills.length },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setEcosystemFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  ecosystemFilter === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {tab.label}
                <span className={`text-xs ${ecosystemFilter === tab.id ? "opacity-60" : "text-muted-foreground/60"}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Row 2: Tier chips + Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {([1, 2, 3] as const).map(t => {
              const count = (skillsList ?? []).filter(s => s.tier === t).length;
              const cfg = TIER_CONFIG[t];
              return (
                <button key={t} onClick={() => toggleTier(t)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors"
                  style={tierFilter === t
                    ? { borderColor: cfg.accentColor, color: cfg.accentColor, backgroundColor: cfg.tintBg }
                    : undefined
                  }
                >
                  {cfg.shortLabel} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
            {allCategories.length > 0 && <span className="text-border select-none">|</span>}
            {allCategories.map(cat => {
              const count = (skillsList ?? []).filter(s => s.category === cat).length;
              const catCfg = CATEGORY_CONFIG[cat] ?? { label: cat, Icon: Settings, accentColor: "#6b7280", tintBg: "rgba(107,114,128,0.08)" };
              const CatIcon = catCfg.Icon;
              return (
                <button key={cat} onClick={() => toggleCategory(cat)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors"
                  style={categoryFilter === cat
                    ? { borderColor: catCfg.accentColor, color: catCfg.accentColor, backgroundColor: catCfg.tintBg }
                    : undefined
                  }
                >
                  <CatIcon size={10} />
                  {cat} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredSkills.length}</span> of {skillsList?.length ?? 0} skills
            {(tierFilter !== null || categoryFilter !== null) && (
              <button onClick={() => { setTierFilter(null); setCategoryFilter(null); }}
                className="ml-2 text-muted-foreground/70 hover:text-foreground underline">
                Clear filters
              </button>
            )}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}
          </div>
        )}

        {/* Empty registry */}
        {!isLoading && skillsList?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No skills registered yet.</p>
            <p className="text-sm">{isAdmin ? "Add your first skill using the button above." : "The skills registry is empty."}</p>
          </div>
        )}

        {/* No filter results */}
        {!isLoading && skillsList && skillsList.length > 0 && filteredSkills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm font-medium mb-1">No skills match the current filters.</p>
            <button onClick={() => { setTierFilter(null); setCategoryFilter(null); setEcosystemFilter("all"); }}
              className="text-xs underline hover:text-foreground">Clear all filters</button>
          </div>
        )}

        {/* Skill groups */}
        {([1, 2, 3] as const).map((tier) =>
          grouped[tier].length > 0 ? (
            <div key={tier} className="mb-8">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: TIER_CONFIG[tier].accentColor }}>
                    {TIER_CONFIG[tier].label}
                  </h2>
                  <span className="text-xs text-muted-foreground">{grouped[tier].length} skill{grouped[tier].length !== 1 ? "s" : ""}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tier === 1 && "Read at the start of every task, without exception. These skills define how ERI work is done — collaboration principles, brand standards, and core operating procedures."}
                  {tier === 2 && "Read immediately before a specific action, even within the same task. These are gate skills — they prevent mistakes by ensuring the right pattern is applied at the right moment."}
                  {tier === 3 && "Read when the domain or trigger condition applies. These are reference skills — deep knowledge for specific areas of the platform, data sources, or tooling."}
                </p>
              </div>
              <div className="space-y-3">
                {grouped[tier].map((skill) => (
                  <SkillRow key={skill.id} skill={skill} isAdmin={isAdmin} onRefresh={refresh} />
                ))}
              </div>
            </div>
          ) : null
        )}

        {/* Stats footer */}
        {skillsList && skillsList.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
            <span><span className="font-semibold text-foreground">{skillsList.length}</span> total skills</span>
            <span><span className="font-semibold text-foreground">{eriSkills.length}</span> ERI skills</span>
            <span><span className="font-semibold text-foreground">{manusSkills.length}</span> Manus standard skills</span>
          </div>
        )}
         </>
      </div>
    </PublicLayout>
  );
}
