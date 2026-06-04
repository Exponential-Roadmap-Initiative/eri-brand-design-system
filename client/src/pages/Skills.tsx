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
// Types inlined to avoid cross-boundary import from client to server/drizzle
interface Skill {
  id: string;
  name: string;
  description: string;
  tier: number;
  version: string;
  readWhen: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  badge: string;
  border: string;
  bg: string;
  heading: string;
  when: string;
  constraint: string;
  example: string;
}> = {
  1: {
    label: "Tier 1 — Always-on",
    shortLabel: "Tier 1",
    badge: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
    border: "border-teal-200 dark:border-teal-800",
    bg: "bg-teal-50/50 dark:bg-teal-950/20",
    heading: "text-teal-700 dark:text-teal-400",
    when: "Read at the start of every task, without exception.",
    constraint: "Must be lean — every token costs on every task. Keep under 200 lines.",
    example: "Core operating procedures, collaboration principles, dev standards.",
  },
  2: {
    label: "Tier 2 — Per-action gate",
    shortLabel: "Tier 2",
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
    border: "border-amber-200 dark:border-amber-800",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    heading: "text-amber-700 dark:text-amber-400",
    when: "Re-read immediately before a specific action — even within the same task.",
    constraint: "Can be longer. Only loaded when the specific action is about to happen.",
    example: "UI design rules before writing any component. Router guard before adding a procedure.",
  },
  3: {
    label: "Tier 3 — Conditional",
    shortLabel: "Tier 3",
    badge: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    heading: "text-blue-700 dark:text-blue-400",
    when: "Read when the domain or trigger condition applies.",
    constraint: "Can be detailed. Only loaded when the domain is relevant.",
    example: "ERI brand rules when building a web project. Data source patterns when adding a new source.",
  },
};

// ── Tier badge ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: number }) {
  const cfg = TIER_CONFIG[tier] ?? {
    shortLabel: `Tier ${tier}`,
    badge: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cfg.badge}`}>
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
                  <div key={tier} className={`rounded-md border ${cfg.border} ${cfg.bg} p-3 space-y-2`}>
                    <span className={`text-xs font-semibold ${cfg.heading}`}>{cfg.label}</span>
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

// ── Add / Edit Skill dialog ───────────────────────────────────────────────────

interface AddSkillDialogProps {
  onSuccess: () => void;
  prefill?: Partial<Skill>;
}

function AddSkillDialog({ onSuccess, prefill }: AddSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(prefill?.id ?? "");
  const [name, setName] = useState(prefill?.name ?? "");
  const [description, setDescription] = useState(prefill?.description ?? "");
  const [tier, setTier] = useState(String(prefill?.tier ?? "3"));
  const [version, setVersion] = useState(prefill?.version ?? "1.0.0");
  const [readWhen, setReadWhen] = useState(prefill?.readWhen ?? "");

  const isEdit = Boolean(prefill?.id);

  const upsertMutation = trpc.skills.upsert.useMutation({
    onSuccess: () => {
      setOpen(false);
      if (!isEdit) {
        setId(""); setName(""); setDescription(""); setTier("3"); setVersion("1.0.0"); setReadWhen("");
      }
      onSuccess();
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="sm">Edit</Button>
        ) : (
          <Button>Add Skill</Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit — ${prefill?.id}` : "Add Skill"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>ID</Label>
              <Input
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="eri-bds-reference"
                className="mt-1"
                disabled={isEdit}
              />
            </div>
            <div>
              <Label>Version</Label>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ERI Brand Design System Reference"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Tier</Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Tier 1 — Always-on</SelectItem>
                <SelectItem value="2">Tier 2 — Per-action gate</SelectItem>
                <SelectItem value="3">Tier 3 — Conditional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
              placeholder="What this skill does and when to use it. Make it slightly pushy — 'use whenever X' rather than just 'for X'."
            />
          </div>
          <div>
            <Label>Read when (optional)</Label>
            <Input
              value={readWhen}
              onChange={(e) => setReadWhen(e.target.value)}
              placeholder="When building or updating any ERI product"
              className="mt-1"
            />
          </div>
          <Button
            onClick={() =>
              upsertMutation.mutate({
                id,
                name,
                description,
                tier: parseInt(tier),
                version,
                readWhen: readWhen || undefined,
              })
            }
            disabled={!id.trim() || !name.trim() || !description.trim() || upsertMutation.isPending}
            className="w-full"
          >
            {upsertMutation.isPending ? "Saving…" : "Save Skill"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────

interface DeleteSkillButtonProps {
  skillId: string;
  onSuccess: () => void;
}

function DeleteSkillButton({ skillId, onSuccess }: DeleteSkillButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const deleteMutation = trpc.skills.delete.useMutation({
    onSuccess: () => {
      setConfirming(false);
      onSuccess();
    },
  });

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-destructive">Delete?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteMutation.mutate({ id: skillId })}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting…" : "Confirm"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setConfirming(true)}>
      Delete
    </Button>
  );
}

// ── Skill row ─────────────────────────────────────────────────────────────────

interface SkillRowProps {
  skill: Skill & { improvements: ImprovementLogProps["improvements"] };
  isAdmin: boolean;
  onRefresh: () => void;
}

function SkillRow({ skill, isAdmin, onRefresh }: SkillRowProps) {
  const cfg = TIER_CONFIG[skill.tier] ?? TIER_CONFIG[3];

  return (
    <Collapsible>
      <div className={`border rounded-lg overflow-hidden ${cfg.border}`}>
        <CollapsibleTrigger className="w-full text-left">
          <div className={`flex items-start justify-between p-4 hover:bg-muted/40 transition-colors ${cfg.bg}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-semibold">{skill.id}</span>
                <TierBadge tier={skill.tier} />
                <span className="text-xs font-mono text-muted-foreground">v{skill.version}</span>
                {skill.improvements.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {skill.improvements.length} improvement{skill.improvements.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-foreground mt-1">{skill.name}</p>
              {skill.readWhen && (
                <p className="text-xs text-muted-foreground mt-0.5 italic">{skill.readWhen}</p>
              )}
            </div>
            <span className="text-muted-foreground text-xs ml-4 flex-shrink-0 mt-1">↓</span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-border px-4 py-4 space-y-4 bg-background">
            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{skill.description}</p>
            </div>

            {/* Admin actions */}
            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border">
                <LogImprovementDialog
                  skillId={skill.id}
                  currentVersion={skill.version}
                  onSuccess={onRefresh}
                />
                <AddSkillDialog prefill={skill} onSuccess={onRefresh} />
                <DeleteSkillButton skillId={skill.id} onSuccess={onRefresh} />
              </div>
            )}

            {/* Improvement log */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Improvement Log
              </p>
              <ImprovementLog improvements={skill.improvements} />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// ── Project Instructions ─────────────────────────────────────────────────────

const CHAR_BUDGET = 8000;

const DEFAULT_PREAMBLE = `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files (audit reports, feedback notes, spec files, etc.). After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`;

const AUDIT_SECTIONS = [
  {
    id: "skill-update",
    title: "Skill update command",
    chars: 285,
    recommendation: "keep" as const,
    reason: "Essential — fetches the latest BDS skill before every task. Without this, the agent uses a stale skill version. The curl command is specific and cannot be inferred.",
  },
  {
    id: "project-context",
    title: "PROJECT-CONTEXT.md instruction",
    chars: 448,
    recommendation: "keep" as const,
    reason: "Essential — context compaction erases session memory. This instruction is the only mechanism that preserves project-specific knowledge across sessions. Cannot be moved to a skill because it must run before any skill is read.",
  },
  {
    id: "skill-scan",
    title: "Skill scan instruction",
    chars: 340,
    recommendation: "replace" as const,
    reason: "Partially redundant — the auto-generated skill trigger block below replaces the generic 'scan and identify' instruction with precise per-skill triggers. The generic instruction can be shortened to a single line: 'Read the SKILL.md for each relevant skill listed below before taking action.'",
  },
  {
    id: "skill-update-post",
    title: "Post-task skill update instruction",
    chars: 440,
    recommendation: "compress" as const,
    reason: "Still valuable but verbose. The core instruction ('update the relevant SKILL.md after every task') is 60 chars. The explanation of why (350 chars) is now covered by the Skills page philosophy. Compressing to the essential directive saves ~380 chars.",
  },
  {
    id: "dev-workflow",
    title: "ERI development workflow (6 steps)",
    chars: 257,
    recommendation: "evaluate" as const,
    reason: "Manus now follows a structured research → design → plan → implement → test loop by default. The question is whether the explicit ERI framing ('get acceptance for plan') adds value beyond the default agent behaviour. If the agent already does this, these 257 chars are recoverable.",
  },
  {
    id: "collab-skill",
    title: "Apply exponential-human-ai-collaboration skill",
    chars: 91,
    recommendation: "replace" as const,
    reason: "Redundant once this skill is in Tier 1 — the auto-generated trigger block will include it with 'Read at the start of every task'. The explicit instruction duplicates the tier assignment.",
  },
  {
    id: "framework",
    title: "Exponential Framework matrix",
    chars: 530,
    recommendation: "evaluate" as const,
    reason: "Project-specific context that the agent cannot infer. However, this is only relevant for projects that work with the Exponential Framework (e.g. PSM, Exponential Platform). For the BDS project specifically, this section is rarely used. Consider moving to PROJECT-CONTEXT.md for projects where it is not central.",
  },
  {
    id: "agent-files",
    title: "Earth-aligned AI Agent key files",
    chars: 230,
    recommendation: "move" as const,
    reason: "This is project-specific context for the eri-playbook-team project, not the BDS project. It belongs in that project's PROJECT-CONTEXT.md, not in shared project instructions. Removing it from the BDS project instructions saves 230 chars with no loss.",
  },
];

const RECOMMENDATION_CONFIG = {
  keep: { label: "Keep", badge: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300", icon: "✓" },
  replace: { label: "Replace", badge: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300", icon: "↻" },
  compress: { label: "Compress", badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300", icon: "⇩" },
  evaluate: { label: "Evaluate", badge: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300", icon: "?" },
  move: { label: "Move", badge: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300", icon: "→" },
};

function generateSkillTriggers(skills: Skill[]): string {
  if (!skills || skills.length === 0) return "";

  const tier1 = skills.filter(s => s.tier === 1);
  const tier2 = skills.filter(s => s.tier === 2);
  const tier3 = skills.filter(s => s.tier === 3);

  const lines: string[] = [];

  if (tier1.length > 0) {
    lines.push("## Always-on skills (read at the start of every task)");
    for (const s of tier1) {
      lines.push(`Read /home/ubuntu/skills/${s.id}/SKILL.md before every task.`);
    }
  }

  if (tier2.length > 0) {
    lines.push("");
    lines.push("## Per-action skills (read immediately before the indicated action)");
    for (const s of tier2) {
      const trigger = s.readWhen ? s.readWhen.replace(/^Read (this skill |SKILL\.md )?/i, "").replace(/\.$/, "") : `using ${s.name}`;
      lines.push(`Read /home/ubuntu/skills/${s.id}/SKILL.md before ${trigger}.`);
    }
  }

  if (tier3.length > 0) {
    lines.push("");
    lines.push("## Conditional skills (read when the domain applies)");
    for (const s of tier3) {
      const trigger = s.readWhen ? s.readWhen.replace(/^Read (this skill |SKILL\.md )?/i, "").replace(/\.$/, "") : `working on ${s.name}`;
      lines.push(`Read /home/ubuntu/skills/${s.id}/SKILL.md when ${trigger}.`);
    }
  }

  return lines.join("\n");
}

interface ProjectInstructionsProps {
  skills: Skill[];
}

function ProjectInstructions({ skills }: ProjectInstructionsProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"audit" | "triggers" | "output">("audit");
  const [preamble, setPreamble] = useState(() => {
    try { return localStorage.getItem("eri-pi-preamble") ?? DEFAULT_PREAMBLE; }
    catch { return DEFAULT_PREAMBLE; }
  });
  const [copied, setCopied] = useState(false);

  const skillTriggers = generateSkillTriggers(skills);
  const combined = [preamble.trim(), skillTriggers.trim()].filter(Boolean).join("\n\n");
  const charCount = combined.length;
  const budgetPct = Math.min(100, (charCount / CHAR_BUDGET) * 100);
  const budgetColor = charCount > CHAR_BUDGET * 0.9 ? "text-red-600" : charCount > CHAR_BUDGET * 0.7 ? "text-amber-600" : "text-green-600";
  const barColor = charCount > CHAR_BUDGET * 0.9 ? "bg-red-500" : charCount > CHAR_BUDGET * 0.7 ? "bg-amber-500" : "bg-green-500";

  const savePreamble = (v: string) => {
    setPreamble(v);
    try { localStorage.setItem("eri-pi-preamble", v); } catch {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(combined).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetPreamble = () => savePreamble(DEFAULT_PREAMBLE);

  const totalAuditChars = AUDIT_SECTIONS.reduce((s, a) => s + a.chars, 0);
  const keepChars = AUDIT_SECTIONS.filter(a => a.recommendation === "keep").reduce((s, a) => s + a.chars, 0);
  const potentialSavings = totalAuditChars - keepChars;

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-8">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">Project Instructions Manager</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit existing instructions · Auto-generate skill triggers · Optimise character budget
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className={`text-xs font-mono font-semibold ${budgetColor}`}>
            {charCount.toLocaleString()} / {CHAR_BUDGET.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">{open ? "Collapse ↑" : "Expand ↓"}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-border">

          {/* Tab bar */}
          <div className="flex border-b border-border bg-muted/20">
            {([
              { id: "audit", label: "Instruction Audit" },
              { id: "triggers", label: "Skill Triggers" },
              { id: "output", label: "Combined Output" },
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Audit tab */}
          {activeTab === "audit" && (
            <div className="px-5 py-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The current project instructions were written incrementally over several months. Some sections may now be redundant — either because Manus handles them by default, or because the content has been moved into a skill or PROJECT-CONTEXT.md. This audit evaluates each section against the question: <span className="italic">"Would a capable Manus agent do the right thing here without this instruction?"</span>
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-muted-foreground">Potential savings</p>
                  <p className="text-lg font-bold text-amber-600">~{potentialSavings} chars</p>
                  <p className="text-xs text-muted-foreground">{Math.round((potentialSavings / totalAuditChars) * 100)}% of current</p>
                </div>
              </div>

              <div className="space-y-3">
                {AUDIT_SECTIONS.map(section => {
                  const cfg = RECOMMENDATION_CONFIG[section.recommendation];
                  return (
                    <div key={section.id} className="border border-border rounded-md p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{section.title}</span>
                          <span className="text-xs text-muted-foreground font-mono">{section.chars} chars</span>
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${cfg.badge}`}>
                          <span>{cfg.icon}</span> {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{section.reason}</p>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-md bg-muted/30 border border-border p-4">
                <p className="text-xs font-semibold text-foreground mb-2">Legend</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(RECOMMENDATION_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${cfg.badge}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {key === "keep" && "Essential — cannot be removed"}
                        {key === "replace" && "Superseded by skill trigger block"}
                        {key === "compress" && "Valuable but can be shortened"}
                        {key === "evaluate" && "May be redundant in current Manus — test"}
                        {key === "move" && "Belongs in PROJECT-CONTEXT.md"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Skill triggers tab */}
          {activeTab === "triggers" && (
            <div className="px-5 py-6 space-y-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                This block is auto-generated from the skill registry above. It replaces the generic "scan the skills" instruction with precise, per-skill triggers ordered by tier. Update skill tiers or <span className="font-mono text-xs">readWhen</span> fields in the registry to change the output.
              </p>
              <div className="rounded-md bg-muted/20 border border-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated output</p>
                  <span className="text-xs text-muted-foreground font-mono">{skillTriggers.length} chars</span>
                </div>
                <pre className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-mono">{skillTriggers || "No skills registered yet."}</pre>
              </div>
              <div className="rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3">
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <span className="font-semibold">Note:</span> The trigger text is derived from each skill's <span className="font-mono">readWhen</span> field in the registry. If a skill has no <span className="font-mono">readWhen</span> value, a generic trigger is used. Edit the skill in the registry above to set a precise trigger.
                </p>
              </div>
            </div>
          )}

          {/* Combined output tab */}
          {activeTab === "output" && (
            <div className="px-5 py-6 space-y-5">

              {/* Character budget bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-foreground">Character budget</p>
                  <span className={`text-xs font-mono font-semibold ${budgetColor}`}>
                    {charCount.toLocaleString()} / {CHAR_BUDGET.toLocaleString()} ({Math.round(budgetPct)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${budgetPct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {CHAR_BUDGET - charCount > 0
                    ? `${(CHAR_BUDGET - charCount).toLocaleString()} characters remaining`
                    : `${(charCount - CHAR_BUDGET).toLocaleString()} characters over budget`
                  }
                </p>
              </div>

              {/* Preamble editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-foreground">Preamble (editable)</p>
                  <button
                    onClick={resetPreamble}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Reset to default
                  </button>
                </div>
                <Textarea
                  value={preamble}
                  onChange={(e) => savePreamble(e.target.value)}
                  className="font-mono text-xs leading-relaxed min-h-[160px]"
                  placeholder="Paste your project-specific preamble here..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {preamble.length.toLocaleString()} chars · Saved to browser storage automatically
                </p>
              </div>

              {/* Skill triggers (read-only) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-semibold text-foreground">Skill triggers (auto-generated)</p>
                  <span className="text-xs text-muted-foreground font-mono">{skillTriggers.length} chars</span>
                </div>
                <div className="rounded-md bg-muted/20 border border-border p-3">
                  <pre className="text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed font-mono">{skillTriggers || "No skills registered."}</pre>
                </div>
              </div>

              {/* Copy button */}
              <Button
                onClick={handleCopy}
                className="w-full"
                disabled={charCount === 0}
              >
                {copied ? "Copied to clipboard ✓" : `Copy full instructions (${charCount.toLocaleString()} chars)`}
              </Button>

              {charCount > CHAR_BUDGET && (
                <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-3">
                  <p className="text-xs text-red-800 dark:text-red-300 font-semibold">
                    Over budget by {(charCount - CHAR_BUDGET).toLocaleString()} characters.
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                    Review the Instruction Audit tab for compression opportunities. The "Evaluate" and "Compress" sections together offer ~{potentialSavings} chars of savings.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Skills() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const utils = trpc.useUtils();
  const { data: skillsList, isLoading } = trpc.skills.list.useQuery();

  const refresh = () => utils.skills.list.invalidate();

  const grouped = {
    1: skillsList?.filter((s) => s.tier === 1) ?? [],
    2: skillsList?.filter((s) => s.tier === 2) ?? [],
    3: skillsList?.filter((s) => s.tier === 3) ?? [],
  };

  const totalImprovements = skillsList?.reduce((sum, s) => sum + s.improvements.length, 0) ?? 0;

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-[#232323] text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">
            ERI SKILL ECOSYSTEM
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Skills</h1>
          <p className="text-sm text-white/70 max-w-2xl leading-relaxed">
            The self-improving knowledge base that governs how ERI's AI agents work. Each skill encodes a workflow, a set of failure guardrails, and a version history. Every task is an opportunity to make them better.
          </p>
          {skillsList && (
            <div className="flex items-center gap-6 mt-5 text-sm text-white/60">
              <span><span className="text-white font-semibold">{skillsList.length}</span> skills registered</span>
              <span><span className="text-white font-semibold">{totalImprovements}</span> improvements logged</span>
              <span>
                <span className="text-white font-semibold">{grouped[1].length}</span> Tier 1 ·{" "}
                <span className="text-white font-semibold">{grouped[2].length}</span> Tier 2 ·{" "}
                <span className="text-white font-semibold">{grouped[3].length}</span> Tier 3
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* System overview */}
        <SystemOverview />

        {/* Project Instructions Manager */}
        {skillsList && <ProjectInstructions skills={skillsList} />}

        {/* Admin header */}
        {isAdmin && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-muted-foreground">
              Logged in as admin — you can add, edit, and log improvements.
            </p>
            <AddSkillDialog onSuccess={refresh} />
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && skillsList?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">No skills registered yet.</p>
            <p className="text-sm">
              {isAdmin
                ? "Add your first skill using the button above. Begin with skill-manager as your Tier 1 meta-skill."
                : "The skills registry is empty. An admin can add skills via this page."}
            </p>
          </div>
        )}

        {/* Skill groups */}
        {([1, 2, 3] as const).map((tier) =>
          grouped[tier].length > 0 ? (
            <div key={tier} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${TIER_CONFIG[tier].heading}`}>
                  {TIER_CONFIG[tier].label}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {grouped[tier].length} skill{grouped[tier].length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2">
                {grouped[tier].map((skill) => (
                  <SkillRow
                    key={skill.id}
                    skill={skill}
                    isAdmin={isAdmin}
                    onRefresh={refresh}
                  />
                ))}
              </div>
            </div>
          ) : null
        )}

      </div>
    </PublicLayout>
  );
}
