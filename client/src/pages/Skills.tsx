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

import { useState, useCallback } from "react";
import { Layers, SlidersHorizontal, Lightbulb, Clock, AlertTriangle, Eye, Download, Code2, BookOpen, Palette, Shield, Users, Search, Settings, Cloud, Music, Copy, CheckCircle2, History, ClipboardList, ChevronDown, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
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

// ── System Overview (collapsible) ─────────────────────────────────────────────

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
            Philosophy, tier model, self-improvement loop, and eval framework
          </p>
        </div>
        <span className="text-muted-foreground text-xs ml-4">{open ? "Collapse ↑" : "Expand ↓"}</span>
      </button>

      {open && (
        <div className="border-t border-border px-5 py-6 space-y-8 bg-muted/10">

          {/* Philosophy */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              The Core Idea
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Skills are living knowledge modules — not static documents. Each skill encodes how a specific type of work is done well: the sequence of steps, the failure patterns to avoid, the guardrails that prevent known mistakes. Every task that applies a skill is an opportunity to make it better. The system compounds: each improvement makes the next task easier, and the next, and the next.
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed mt-2">
              The self-improvement loop is the engine. At the end of every task where skills were applied, a structured post-task reflection surfaces what worked, what was underspecified, and what should be added as a guardrail. Improvements are applied immediately, the version is bumped, and the change is logged here. Over time, the skill ecosystem becomes a precise, battle-tested record of how this team does its best work.
            </p>
          </section>

          {/* Tier model */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              The Tier Model
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {([1, 2, 3] as const).map(tier => {
                const cfg = TIER_CONFIG[tier];
                return (
                  <div key={tier} className="rounded-md border border-l-4 border-border p-3 space-y-2" style={{ borderLeftColor: cfg.accentColor, backgroundColor: cfg.tintBg }}>
                    <span className="text-xs font-semibold" style={{ color: cfg.accentColor }}>{cfg.label}</span>
                    <p className="text-xs text-foreground/80 leading-relaxed">
                      <span className="font-medium">When:</span> {cfg.when}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <span className="font-medium">Constraint:</span> {cfg.constraint}
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
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              The Self-Improvement Loop
            </h3>
            <ol className="space-y-2">
              {[
                { n: "1", title: "Apply skill", desc: "Task runs with the skill in context. The AI reads it and follows its instructions." },
                { n: "2", title: "Post-task reflection", desc: "At the end of the task, surface a structured review: what worked, what was underspecified, what should be a guardrail?" },
                { n: "3", title: "Improve + bump version", desc: "Update the SKILL.md with the new guardrail or correction. Increment the version. Log the change here." },
                { n: "4", title: "Next task is better", desc: "The improvement is in context from now on. The failure cannot recur. The system compounds." },
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
              The reflection is not a failure review — it is a quality review on a spectrum. A task can complete without failures and still have been run at 60% of its potential quality. The question is always: what would have made the output better?
            </p>
          </section>

          {/* Using this page */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Using This Page
            </h3>
            <ul className="space-y-1.5">
              {[
                "Click any skill row to expand its improvement log — a timeline of every change made after real task use.",
                "Use 'Log Improvement' after completing a task where a skill was applied and you identified something to improve.",
                "Use 'Add Skill' to register a new skill. The ID should match the skill's directory name in /home/ubuntu/skills/.",
                "Version numbers follow semver: patch bump (1.0.1) for minor additions, minor bump (1.1.0) for structural changes.",
                "Skills are grouped by tier. Tier 1 should be the shortest list — if it grows beyond 5–6 skills, review whether each is truly always-on.",
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
  const improvements = detail?.improvements ?? [];
  const hasSelfImprovement = improvements.length > 0;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = detail?.content ??
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
            {/* Top row: icon + name + tier badge + category badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 text-muted-foreground/50 text-sm font-mono mt-0.5">&lt;/&gt;</span>
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
              </div>
            </div>

            {/* Description preview */}
            <p className="text-sm text-foreground/75 leading-relaxed mt-3 ml-7">{skill.description}</p>

            {/* readWhen callout */}
            {skill.readWhen && (
              <div className="ml-7 mt-3 rounded-md bg-muted/40 border border-border px-4 py-2.5 flex items-start gap-2">
                <Clock size={12} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  <span className="font-semibold">When:</span> {skill.readWhen}
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
              {isOpen && !hasSelfImprovement && !detailLoading && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle size={11} />
                no improvements logged
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-7 px-3 inline-flex items-center gap-1.5">
                <Eye size={12} /> View
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

            {/* Improvement log — lazy loaded */}
            {detailLoading && (
              <div className="h-12 rounded bg-muted animate-pulse" />
            )}
            {!detailLoading && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Improvement Log
                </p>
                <ImprovementLog improvements={improvements} />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ── Project Instructions ─────────────────────────────────────────────────────

const CHAR_BUDGET = 8000;

// ── Fixed Sections ─────────────────────────────────────────────────────────────
// These are non-skill CRITICAL blocks that belong in project instructions.
// Each has an id, label, char count, and the actual text content.

interface FixedSection {
  id: string;
  label: string;
  chars: number;
  content: string;
  defaultOn: boolean;
  description: string;
}

const FIXED_SECTIONS: FixedSection[] = [
  {
    id: "S_BDS_UPDATE",
    label: "BDS skill auto-update",
    chars: 285,
    defaultOn: true,
    description: "Fetches the latest BDS reference skill at the start of every task.",
    content: `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action`,
  },
  {
    id: "S_PROJECT_CONTEXT",
    label: "PROJECT-CONTEXT.md guard",
    chars: 448,
    defaultOn: true,
    description: "Preserves project-specific knowledge across context compaction and sandbox resets.",
    content: `Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files (audit reports, feedback notes, spec files, etc.). After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`,
  },
  {
    id: "S_CHECKPOINT",
    label: "Checkpoint discipline",
    chars: 480,
    defaultOn: true,
    description: "Prevents losing work to sandbox resets by enforcing frequent checkpoints.",
    content: `Critical: Checkpoint discipline — save a checkpoint after every 3–5 file changes. Never treat an entire feature sprint as a single checkpoint unit. Specifically:\n- Save a checkpoint immediately after writing each logical group of files (e.g., after the router, after the widget components, after the explorer page, after config wiring, after route wiring)\n- Never run \`pnpm test\` (the full test suite) before saving a checkpoint — it takes 90+ seconds and triggers sandbox resets. Instead: save checkpoint first, then run only the specific test file with \`pnpm vitest run server/<file>.test.ts\`\n- If a sandbox reset occurs mid-task, the last checkpoint is the recovery point — all unsaved work is lost`,
  },
  {
    id: "S_DEV_WORKFLOW",
    label: "ERI development workflow",
    chars: 257,
    defaultOn: true,
    description: "6-step workflow: Research → Design → Plan → Implement → Test → Iterate.",
    content: `Critical: Always follow the ERI development workflow:\n1. Research: clarify purpose, understand current context and existing assets, explore possible solutions\n2. Design\n3. Plan and get acceptance for plan\n4. Implement\n5. Test\n6. Iterate until solution works`,
  },
  {
    id: "S_FRAMEWORK",
    label: "Exponential Framework matrix",
    chars: 530,
    defaultOn: false,
    description: "5×4 matrix reference for projects using the Exponential Framework. Disable for non-framework projects.",
    content: `## Exponential Framework — Always Remember\nThe ERI Exponential Framework is a 5 pillars (columns) x 4 horizontals (rows) matrix = 20 cells.\n\n5 Pillars: P1=Cut Operational Emissions, P2=Decarbonise Value Chain, P3=Build & Scale Solutions, P4=Mobilise Finance & Investment, P5=Shape Policy & Narrative\n\n4 Horizontals (rows, top to bottom): H1=Earth-aligned Vision & Mission, H2=Set Targets & Strategy, H3=Develop Transition Plan & Take Action, H4=Measure, Report & Disclose\n\nReference: https://exponentialroadmap.org/exponential-framework/`,
  },
];

const RECOMMENDATION_CONFIG: Record<string, { label: string; accentColor: string; tintBg: string }> = {
  keep:     { label: "Keep",     accentColor: "#3ba559", tintBg: "rgba(59,165,89,0.08)" },
  replace:  { label: "Replace",  accentColor: "#17b7dd", tintBg: "rgba(23,183,221,0.08)" },
  compress: { label: "Compress", accentColor: "#f59e0b", tintBg: "rgba(245,158,11,0.08)" },
  evaluate: { label: "Evaluate", accentColor: "#8b5cf6", tintBg: "rgba(139,92,246,0.08)" },
  move:     { label: "Move",     accentColor: "#f97316", tintBg: "rgba(249,115,22,0.08)" },
};

// Trigger-only format: strips "Read before/when" prefix from readWhen.
// Saves ~35 chars/entry vs verbose format (~980 chars total for 28 skills).
function generateSkillTriggers(skills: Skill[]): string {
  if (!skills || skills.length === 0) return "";

  const tier1 = skills.filter(s => s.tier === 1);
  const tier2 = skills.filter(s => s.tier === 2);
  const tier3 = skills.filter(s => s.tier === 3);

  const lines: string[] = [];

  if (tier1.length > 0) {
    lines.push("## Tier 1 — Always-on (read at the start of every task)");
    for (const s of tier1) {
      lines.push(`• ${s.id}: every task.`);
    }
  }

  if (tier2.length > 0) {
    lines.push("");
    lines.push("## Tier 2 — Per-action (read immediately before the indicated action)");
    for (const s of tier2) {
      // Trigger-only: strip leading "Read (this skill|SKILL.md) (before|when|for)"
      const raw = s.readWhen ?? `using ${s.name}`;
      const trigger = raw
        .replace(/^Read (this skill |SKILL\.md )?(before |when |for |to )?/i, "")
        .replace(/^(before |when |for )/i, "")
        .replace(/\.$/, "");
      lines.push(`• ${s.id}: ${trigger}.`);
    }
  }

  if (tier3.length > 0) {
    lines.push("");
    lines.push("## Tier 3 — Conditional (read when the domain applies)");
    for (const s of tier3) {
      const raw = s.readWhen ?? `working on ${s.name}`;
      const trigger = raw
        .replace(/^Read (this skill |SKILL\.md )?(before |when |for |to )?/i, "")
        .replace(/^(before |when |for )/i, "")
        .replace(/\.$/, "");
      lines.push(`• ${s.id}: ${trigger}.`);
    }
  }

  return lines.join("\n");
}

const AUDIT_PROMPT = `Read the current project instructions from your context (<project_instructions> block) and run a section-by-section audit.

For each section:
1. Assign a verdict: Keep / Keep-compress / Move to skill / Remove
2. Estimate character savings if compressed or removed
3. Reasoning: would a capable Manus agent do the right thing here without this instruction?

Also check:
- Broken skill references (e.g. "see §9 of ht-dev-ops" where §9 doesn't exist)
- Tier discrepancies (skills listed in wrong tier vs the registry)
- Character budget: total chars used vs the 8,000-char limit

Write findings to the database using trpc.skills.saveInstructionsAudit with:
- sectionsJson: array of { id, label, chars, verdict, saving, reasoning }
- discrepanciesJson: array of string descriptions
- charCount: total chars of current instructions
- budgetPct: percentage of 8,000 used
- summary: 2-3 sentence overall assessment`;

interface ProjectInstructionsProps {
  skills: Skill[];
}

function ProjectInstructions({ skills }: ProjectInstructionsProps) {
  const [activeTab, setActiveTab] = useState<"generator" | "history" | "audit">("generator");
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    FIXED_SECTIONS.forEach(s => { defaults[s.id] = s.defaultOn; });
    return defaults;
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [versionNote, setVersionNote] = useState("");
  const [versionLabel, setVersionLabel] = useState(() => {
    const d = new Date();
    return `v${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
  });
  const [markAppliedOpen, setMarkAppliedOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedAuditPrompt, setCopiedAuditPrompt] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // DB queries (only when logged in)
  const versionsQuery = trpc.skills.listInstructionsVersions.useQuery(undefined, { enabled: isAdmin });
  const auditsQuery = trpc.skills.listInstructionsAudits.useQuery(undefined, { enabled: isAdmin });
  const saveVersionMutation = trpc.skills.saveInstructionsVersion.useMutation({
    onSuccess: () => {
      versionsQuery.refetch();
      setMarkAppliedOpen(false);
      setVersionNote("");
    },
  });

  // Assemble the generated output
  const fixedText = FIXED_SECTIONS
    .filter(s => enabledSections[s.id])
    .map(s => s.content)
    .join("\n");
  const skillTriggers = generateSkillTriggers(skills);
  const skillsBlock = skills.length > 0
    ? `Critical: At the start of every task, scan the skills listed in the system prompt and identify which ones apply to this task. Read the full SKILL.md for each relevant skill before taking any action.\n\n${skillTriggers}`
    : "";
  const combined = [fixedText.trim(), skillsBlock.trim()].filter(Boolean).join("\n\n");
  const charCount = combined.length;
  const budgetPct = Math.min(100, (charCount / CHAR_BUDGET) * 100);
  const budgetColor = charCount > CHAR_BUDGET * 0.9 ? "text-red-500" : charCount > CHAR_BUDGET * 0.7 ? "text-amber-500" : "text-green-500";
  const barColor = charCount > CHAR_BUDGET * 0.9 ? "bg-red-500" : charCount > CHAR_BUDGET * 0.7 ? "bg-amber-500" : "bg-green-500";

  const handleCopyOutput = useCallback(() => {
    navigator.clipboard.writeText(combined).then(() => {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    });
  }, [combined]);

  const handleCopyAuditPrompt = useCallback(() => {
    navigator.clipboard.writeText(AUDIT_PROMPT).then(() => {
      setCopiedAuditPrompt(true);
      setTimeout(() => setCopiedAuditPrompt(false), 2000);
    });
  }, []);

  const handleMarkApplied = () => {
    saveVersionMutation.mutate({
      version: versionLabel,
      generatedSnapshot: combined,
      changeNote: versionNote || undefined,
      charCount,
      budgetPct: Math.round(budgetPct),
    });
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-8">
      {/* Header */}
      <div className="w-full flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Project Instructions Manager</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Assemble skill triggers · Manage Fixed Sections · Track version history · Run audits
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className={`text-xs font-mono font-semibold ${budgetColor}`}>
            {charCount.toLocaleString()} / {CHAR_BUDGET.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="border-t border-border">
        {/* Tab bar */}
        <div className="flex border-b border-border bg-muted/20">
          {([
            { id: "generator" as const, label: "Generator", Icon: SlidersHorizontal },
            { id: "history" as const,   label: "Version History", Icon: History },
            { id: "audit" as const,     label: "Audit", Icon: ClipboardList },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.Icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Generator tab ── */}
        {activeTab === "generator" && (
          <div className="px-5 py-6 space-y-6">

            {/* Budget bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-foreground">Character budget</p>
                <span className={`text-xs font-mono font-semibold ${budgetColor}`}>
                  {charCount.toLocaleString()} / {CHAR_BUDGET.toLocaleString()} ({Math.round(budgetPct)}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${budgetPct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {CHAR_BUDGET - charCount > 0
                  ? `${(CHAR_BUDGET - charCount).toLocaleString()} chars remaining · target: under 65% (5,200 chars)`
                  : `${(charCount - CHAR_BUDGET).toLocaleString()} chars over budget`}
              </p>
            </div>

            {/* Fixed Sections */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fixed Sections</p>
              <div className="space-y-2">
                {FIXED_SECTIONS.map(section => (
                  <div key={section.id} className="border border-border rounded-md overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3">
                      <button
                        onClick={() => setEnabledSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        title={enabledSections[section.id] ? "Disable" : "Enable"}
                      >
                        {enabledSections[section.id]
                          ? <ToggleRight size={18} className="text-green-500" />
                          : <ToggleLeft size={18} className="text-muted-foreground" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${
                            enabledSections[section.id] ? "text-foreground" : "text-muted-foreground line-through"
                          }`}>{section.label}</span>
                          <span className="text-xs text-muted-foreground font-mono">{section.chars} chars</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{section.description}</p>
                      </div>
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                        title="Expand content"
                      >
                        {expandedSection === section.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    </div>
                    {expandedSection === section.id && (
                      <div className="border-t border-border bg-muted/20 px-4 py-3">
                        <pre className="text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed font-mono">{section.content}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skill triggers block */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills Block (trigger-only format)</p>
                <span className="text-xs text-muted-foreground font-mono">{skillTriggers.length} chars</span>
              </div>
              <div className="rounded-md bg-muted/20 border border-border p-3">
                <pre className="text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed font-mono">{skillTriggers || "No skills registered."}</pre>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Trigger-only format saves ~35 chars/skill vs verbose format. Derived from each skill's <span className="font-mono">readWhen</span> field.
              </p>
            </div>

            {/* Copy + Mark as Applied */}
            <div className="flex gap-3">
              <Button
                onClick={handleCopyOutput}
                variant="outline"
                className="flex-1 gap-2"
                disabled={charCount === 0}
              >
                {copiedOutput ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedOutput ? "Copied!" : `Copy (${charCount.toLocaleString()} chars)`}
              </Button>
              {isAdmin && (
                <Button
                  onClick={() => setMarkAppliedOpen(true)}
                  className="flex-1 gap-2"
                  disabled={charCount === 0}
                >
                  <CheckCircle2 size={14} />
                  Mark as Applied
                </Button>
              )}
            </div>

            {charCount > CHAR_BUDGET && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-xs text-red-800 dark:text-red-300 font-semibold">
                  Over budget by {(charCount - CHAR_BUDGET).toLocaleString()} characters. Disable optional Fixed Sections or review the Audit tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Version History tab ── */}
        {activeTab === "history" && (
          <div className="px-5 py-6 space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              Each time you paste generated instructions into Manus project settings, click <span className="font-medium">Mark as Applied</span> in the Generator tab to record a snapshot here. This creates a permanent record of what was active and when.
            </p>
            {!isAdmin && (
              <div className="rounded-md bg-muted/30 border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">Sign in as admin to view version history.</p>
              </div>
            )}
            {isAdmin && versionsQuery.isLoading && (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />)}
              </div>
            )}
            {isAdmin && !versionsQuery.isLoading && (versionsQuery.data?.length ?? 0) === 0 && (
              <div className="rounded-md bg-muted/30 border border-border p-6 text-center">
                <History size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">No versions recorded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Generate instructions and click "Mark as Applied" to create the first snapshot.</p>
              </div>
            )}
            {isAdmin && (versionsQuery.data ?? []).map(v => (
              <div key={v.id} className="border border-border rounded-md p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-sm font-semibold text-foreground font-mono">{v.version}</span>
                    {v.changeNote && <p className="text-xs text-muted-foreground mt-0.5">{v.changeNote}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground">{new Date(v.appliedAt).toLocaleDateString()}</p>
                    {v.charCount != null && (
                      <p className={`text-xs font-mono font-semibold ${
                        (v.budgetPct ?? 0) > 90 ? "text-red-500" : (v.budgetPct ?? 0) > 70 ? "text-amber-500" : "text-green-500"
                      }`}>{v.charCount.toLocaleString()} chars ({v.budgetPct}%)</p>
                    )}
                  </div>
                </div>
                <div className="rounded bg-muted/20 border border-border p-2 max-h-32 overflow-y-auto">
                  <pre className="text-xs text-foreground/60 whitespace-pre-wrap font-mono leading-relaxed">{v.generatedSnapshot.slice(0, 400)}{v.generatedSnapshot.length > 400 ? "..." : ""}</pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Audit tab ── */}
        {activeTab === "audit" && (
          <div className="px-5 py-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                The Manus platform has no API to read live project instructions — only the agent itself can read them from its context. Use the <span className="font-medium">Run Audit</span> button to copy a prompt, paste it into a new Manus task in this project, and the agent will write findings back to this page.
              </p>
              <Button
                onClick={() => setAuditModalOpen(true)}
                variant="outline"
                className="flex-shrink-0 gap-2 text-xs"
              >
                <ClipboardList size={13} />
                Run Audit
              </Button>
            </div>

            {/* Stored audit findings */}
            {!isAdmin && (
              <div className="rounded-md bg-muted/30 border border-border p-4 text-center">
                <p className="text-xs text-muted-foreground">Sign in as admin to view stored audit findings.</p>
              </div>
            )}
            {isAdmin && auditsQuery.isLoading && (
              <div className="space-y-2">
                {[1,2].map(i => <div key={i} className="h-20 rounded-md bg-muted animate-pulse" />)}
              </div>
            )}
            {isAdmin && !auditsQuery.isLoading && (auditsQuery.data?.length ?? 0) === 0 && (
              <div className="rounded-md bg-muted/30 border border-border p-6 text-center">
                <ClipboardList size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">No audit findings yet</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Run Audit" to copy the prompt and run it in a new Manus task.</p>
              </div>
            )}
            {isAdmin && (auditsQuery.data ?? []).map(a => (
              <div key={a.id} className="border border-border rounded-md p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{new Date(a.auditedAt).toLocaleString()}</p>
                    {a.summary && <p className="text-sm text-foreground mt-1 leading-relaxed">{a.summary}</p>}
                  </div>
                  {a.charCount != null && (
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-mono font-semibold ${
                        (a.budgetPct ?? 0) > 90 ? "text-red-500" : (a.budgetPct ?? 0) > 70 ? "text-amber-500" : "text-green-500"
                      }`}>{a.charCount.toLocaleString()} chars ({a.budgetPct}%)</p>
                    </div>
                  )}
                </div>
                {a.discrepanciesJson && (() => {
                  try {
                    const discrepancies = JSON.parse(a.discrepanciesJson) as string[];
                    if (discrepancies.length > 0) return (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-amber-600 mb-1">Discrepancies</p>
                        <ul className="space-y-1">
                          {discrepancies.map((d, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <AlertTriangle size={11} className="flex-shrink-0 mt-0.5 text-amber-500" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  } catch {}
                  return null;
                })()}
              </div>
            ))}

            {/* Static analysis (legacy — pre-agent audit) */}
            <details className="border border-border rounded-md overflow-hidden">
              <summary className="px-4 py-3 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Static analysis (pre-agent, for reference)
              </summary>
              <div className="px-4 pb-4 pt-2 space-y-3 border-t border-border">
                {[
                  { id: "skill-update", title: "BDS skill auto-update", chars: 285, recommendation: "keep" as const, reason: "Essential — fetches the latest BDS skill before every task." },
                  { id: "project-context", title: "PROJECT-CONTEXT.md guard", chars: 448, recommendation: "keep" as const, reason: "Essential — context compaction erases session memory." },
                  { id: "skill-scan", title: "Skill scan instruction", chars: 340, recommendation: "replace" as const, reason: "Superseded by the auto-generated trigger block in the Generator tab." },
                  { id: "skill-update-post", title: "Post-task skill update", chars: 440, recommendation: "compress" as const, reason: "Valuable but verbose — core directive is 60 chars." },
                  { id: "dev-workflow", title: "ERI development workflow", chars: 257, recommendation: "evaluate" as const, reason: "May be redundant if Manus already follows this loop by default." },
                  { id: "collab-skill", title: "Apply exponential-human-ai-collaboration", chars: 91, recommendation: "replace" as const, reason: "Redundant once this skill is in Tier 1." },
                  { id: "framework", title: "Exponential Framework matrix", chars: 530, recommendation: "evaluate" as const, reason: "Only relevant for framework projects — disable for BDS." },
                  { id: "agent-files", title: "Earth-aligned AI Agent key files", chars: 230, recommendation: "move" as const, reason: "Belongs in the eri-playbook-team PROJECT-CONTEXT.md, not BDS." },
                ].map(section => {
                  const cfg = RECOMMENDATION_CONFIG[section.recommendation];
                  return (
                    <div key={section.id} className="border border-border rounded-md p-3">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">{section.title}</span>
                          <span className="text-xs text-muted-foreground font-mono">{section.chars}c</span>
                        </div>
                        <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                          style={{ color: cfg.accentColor, borderColor: `${cfg.accentColor}50`, backgroundColor: cfg.tintBg }}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{section.reason}</p>
                    </div>
                  );
                })}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Mark as Applied dialog */}
      <Dialog open={markAppliedOpen} onOpenChange={setMarkAppliedOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Applied</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Record a snapshot of the current generated instructions. Use this after pasting into Manus project settings.
            </p>
            <div className="space-y-2">
              <Label htmlFor="version-label">Version label</Label>
              <Input
                id="version-label"
                value={versionLabel}
                onChange={e => setVersionLabel(e.target.value)}
                placeholder="e.g. v2026.06.05"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version-note">Change note (optional)</Label>
              <Textarea
                id="version-note"
                value={versionNote}
                onChange={e => setVersionNote(e.target.value)}
                placeholder="What changed in this version?"
                className="text-sm min-h-[80px]"
              />
            </div>
            <div className="rounded-md bg-muted/30 border border-border p-3">
              <p className="text-xs text-muted-foreground">
                Snapshot: <span className="font-mono">{charCount.toLocaleString()} chars</span> · <span className={budgetColor}>{Math.round(budgetPct)}% of budget</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setMarkAppliedOpen(false)} className="flex-1">Cancel</Button>
              <Button
                onClick={handleMarkApplied}
                disabled={!versionLabel.trim() || saveVersionMutation.isPending}
                className="flex-1"
              >
                {saveVersionMutation.isPending ? "Saving..." : "Save snapshot"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Run Audit modal */}
      <Dialog open={auditModalOpen} onOpenChange={setAuditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Run Audit — copy prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Copy this prompt and paste it into a <span className="font-medium">new Manus task in this project</span>. The agent will read the live project instructions from its context, run the analysis, and call <span className="font-mono text-xs">trpc.skills.saveInstructionsAudit</span> to write findings back to this page.
            </p>
            <div className="rounded-md bg-muted/20 border border-border p-4 max-h-64 overflow-y-auto">
              <pre className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-mono">{AUDIT_PROMPT}</pre>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setAuditModalOpen(false)} className="flex-1">Close</Button>
              <Button onClick={handleCopyAuditPrompt} className="flex-1 gap-2">
                {copiedAuditPrompt ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedAuditPrompt ? "Copied!" : "Copy prompt"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
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
  const [activePageTab, setActivePageTab] = useState<"skills" | "projectInstructions" | "philosophy">("skills");
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
          <PageGuide text="Skills encode how work is done well — not just how mistakes are avoided. Each skill is a living knowledge module built from real decisions, real deliverables, and real experience. Use the Skills tab to browse and filter the registry. Use Project Instructions to generate or audit the instructions block for your Manus project. Use Philosophy to understand the tier model and self-improvement loop." />
          {skillsList && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-sm text-white/70">
                <span className="text-white font-semibold">{skillsList.length}</span> skills in the ecosystem
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-1">
            {([
              { id: "skills" as const,              label: "Skills",               Icon: Layers },
              { id: "projectInstructions" as const,  label: "Project Instructions", Icon: SlidersHorizontal },
              { id: "philosophy" as const,           label: "Philosophy",           Icon: Lightbulb },
            ]).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActivePageTab(id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activePageTab === id
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activePageTab === "philosophy" && <SystemOverview />}
        {activePageTab === "projectInstructions" && skillsList && <ProjectInstructions skills={skillsList} />}

        {activePageTab === "skills" && (
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
            <button onClick={() => { setTierFilter(null); setCategoryFilter(null); setMissingImprovementOnly(false); setEcosystemFilter("all"); }}
              className="text-xs underline hover:text-foreground">Clear all filters</button>
          </div>
        )}

        {/* Skill groups */}
        {([1, 2, 3] as const).map((tier) =>
          grouped[tier].length > 0 ? (
            <div key={tier} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: TIER_CONFIG[tier].accentColor }}>
                  {TIER_CONFIG[tier].label}
                </h2>
                <span className="text-xs text-muted-foreground">{grouped[tier].length} skill{grouped[tier].length !== 1 ? "s" : ""}</span>
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
        )}
      </div>
    </PublicLayout>
  );
}
