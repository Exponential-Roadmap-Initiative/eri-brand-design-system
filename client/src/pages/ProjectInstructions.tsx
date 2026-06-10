/**
 * ERI Brand Design System — Project Instructions Manager (top-level page)
 *
 * Extracted from Skills.tsx. Provides the full instructions generator,
 * version history, and audit workflow as a standalone page at /project-instructions.
 *
 * Reads are public. Writes (save version, publish, save audit) are admin-only.
 */

import { useState, useCallback, useMemo } from "react";
import { Link } from "wouter";
import {
  SlidersHorizontal,
  AlertTriangle,
  Copy,
  CheckCircle2,
  History,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  CircleCheck,
  CircleAlert,
  Circle,
  Zap,
  Upload,
  Radio,
  Bot,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "@/components/PublicLayout";
import { PageGuide } from "@/components/PageGuide";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Constants ─────────────────────────────────────────────────────────────────

const CHAR_BUDGET = 8000;

// ── Current live project instructions (hardcoded — Manus has no API to read them) ──

const CURRENT_INSTRUCTIONS = `Critical: Follow this workflow at the start of every ERI task:
1. Load current state: run \`curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"\`; run \`curl -sL https://bds.exponentialroadmap.org/api/project-instructions/latest > /tmp/eri-project-instructions.md 2>/dev/null && cat /tmp/eri-project-instructions.md || true\`; check whether CODEBASE-CONTEXT.md exists in the project root — if PROJECT-CONTEXT.md exists instead, run \`mv PROJECT-CONTEXT.md CODEBASE-CONTEXT.md\` first; then read CODEBASE-CONTEXT.md in full; scan the skills in the system prompt and read all relevant SKILL.md files before taking any action.
2. Research: clarify purpose, understand current context and existing assets, explore possible solutions.
3. Design.
4. Plan and get acceptance before implementing.
5. Implement: save a checkpoint after every 3–5 file changes. Never run \`pnpm test\` before a checkpoint — it takes 90+ seconds and triggers sandbox resets. Instead: save checkpoint first, then run only the specific test file with \`pnpm vitest run server/<file>.test.ts\`.
6. Test.
7. Iterate until the solution works.
8. Close: update CODEBASE-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.

## Tier 1 — Always-on (read at the start of every task)
• eri-skills-orchestrator: every task.
• eri-bds-reference: every task.
• eri-human-ai-collaboration: every task.

## Tier 2 — Per-action (read immediately before the indicated action)
• eri-skill-creator: Writing any eri- skill file; post-task reflection loop.
• eri-earth-aligned-agent: Any Earth-aligned agent task.
• eri-bds-site: Building, rebuilding, or extending the ERI Brand Design System site.
• eri-trpc: New router, new procedure, procedure type decision, quality gate before writing code.
• eri-database: DB schema design, migrations, indexes, multi-tenant isolation.
• eri-widget: New data source or analytical widget, Widget Hub page, widget registry.
• eri-user-management: ERI employee management, company workspaces, or workspace user features.
• eri-rest-api: New REST endpoint, external partner access, API key auth.
• automation-and-scheduling: Any automation, scheduled task, recurring workflow, or bot.
• imagegen: Any image generation, editing, or visual deliverable.
• skill-creator: Creating or modifying any SKILL.md file.

## Tier 3 — Conditional (read when the domain applies)
• eri-security: Trust & Security page, auth/MFA, workspace isolation audit, security review.
• persistent-computing: Docker, fixed IP, persistent background services, heavy compute.
• eri-exponential-framework: Exponential Framework data model, CPR pipeline, cpr_action_templates, cpr_data_source_mappings, Marketing EF pages, Earth-aligned agent framework cells.
• data-source-integration: New data source integration end-to-end, or auditing an existing one.
• eri-data-source-explorer: Data source explorer page, Browse + Compare tab, widget, workspace wrapper.
• eri-report-finder: Corporate report discovery pipeline, pipeline violations.
• eri-pdf-pipeline: Corporate report fetch, parse, page-select, extract, classify, cache, or query.
• manus-api: Manus API integrations or automating Manus agents.
• manus-config: Connectors, project-level config, scheduled tasks.
• music-prompter: Any music generation task.
• tts-prompter: Any text-to-speech or voice generation task.`;

// ── Known issues in the current live instructions ─────────────────────────────

interface KnownIssue {
  id: string;
  severity: "high" | "medium";
  title: string;
  detail: string;
  pattern: string; // substring to highlight in the live text (empty = no highlight)
}

const KNOWN_ISSUES: KnownIssue[] = [];

// ── Fixed Sections ─────────────────────────────────────────────────────────────

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
    id: "S_ERI_WORKFLOW",
    label: "ERI task workflow (8 steps)",
    chars: 1284,
    defaultOn: true,
    description: "Unified 8-step workflow: step 1 loads all current state (BDS skill, project instructions, CODEBASE-CONTEXT.md, skill scan); steps 2–7 are Research → Design → Plan → Implement → Test → Iterate; step 8 closes with CODEBASE-CONTEXT.md update.",
    content: `Critical: Follow this workflow at the start of every ERI task:\n1. Load current state: run \`curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"\`; run \`curl -sL https://bds.exponentialroadmap.org/api/project-instructions/latest > /tmp/eri-project-instructions.md 2>/dev/null && cat /tmp/eri-project-instructions.md || true\`; check whether CODEBASE-CONTEXT.md exists in the project root — if PROJECT-CONTEXT.md exists instead, run \`mv PROJECT-CONTEXT.md CODEBASE-CONTEXT.md\` first; then read CODEBASE-CONTEXT.md in full; scan the skills in the system prompt and read all relevant SKILL.md files before taking any action.\n2. Research: clarify purpose, understand current context and existing assets, explore possible solutions.\n3. Design.\n4. Plan and get acceptance before implementing.\n5. Implement: save a checkpoint after every 3–5 file changes. Never run \`pnpm test\` before a checkpoint — it takes 90+ seconds and triggers sandbox resets. Instead: save checkpoint first, then run only the specific test file with \`pnpm vitest run server/<file>.test.ts\`.\n6. Test.\n7. Iterate until the solution works.\n8. Close: update CODEBASE-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`,
  },
  {
    id: "S_FRAMEWORK",
    label: "Exponential Framework structure",
    chars: 530,
    defaultOn: false,
    description: "Canonical Exponential Framework structure reference — always include for ERI tasks.",
    content: `## Exponential Framework — Always Remember\nThe ERI Exponential Framework has 5 Pillars and 4 Horizontals — two independent dimensions, not a matrix. H1, H2, and H4 are company-wide (not per-pillar). Only H3 (Develop Transition Plan & Take Action) contains the 21 pillar-specific action sub-sections.\n\n5 Pillars: P1=Cut Operational Emissions, P2=Decarbonise Value Chain, P3=Build & Scale Solutions, P4=Mobilise Finance & Investment, P5=Shape Policy & Narrative\n\n4 Horizontals: H1=Earth-aligned Vision & Mission, H2=Set Targets & Strategy, H3=Develop Transition Plan & Take Action (21 action sub-sections, pillar-specific), H4=Measure, Report & Disclose\n\nReference: https://exponentialroadmap.org/exponential-framework/`,
  },
];

const RECOMMENDATION_CONFIG: Record<string, { label: string; accentColor: string; tintBg: string }> = {
  keep:     { label: "Keep",     accentColor: "#3ba559", tintBg: "rgba(59,165,89,0.08)" },
  replace:  { label: "Replace",  accentColor: "#17b7dd", tintBg: "rgba(23,183,221,0.08)" },
  compress: { label: "Compress", accentColor: "#f59e0b", tintBg: "rgba(245,158,11,0.08)" },
  evaluate: { label: "Evaluate", accentColor: "#8b5cf6", tintBg: "rgba(139,92,246,0.08)" },
  move:     { label: "Move",     accentColor: "#f97316", tintBg: "rgba(249,115,22,0.08)" },
};

// ── Skill trigger generator ───────────────────────────────────────────────────

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

// ── Current Instructions panel ────────────────────────────────────────────────

function CurrentInstructionsPanel() {
  const { data, isLoading } = trpc.skills.getPublishedInstructions.useQuery();
  const [expanded, setExpanded] = useState(false);

  const highIssues = KNOWN_ISSUES.filter(i => i.severity === "high");
  const mediumIssues = KNOWN_ISSUES.filter(i => i.severity === "medium");

  const liveText: string = (data as { generatedSnapshot?: string } | null)?.generatedSnapshot ?? "";
  const hasLive = liveText.length > 0;

  // Highlight known-issue patterns in the live text
  function renderHighlighted(text: string) {
    const patterns = KNOWN_ISSUES.map(i => i.pattern).filter(Boolean);
    if (patterns.length === 0) return <span>{text}</span>;

    // Split text into segments, marking matches
    const regex = new RegExp(`(${patterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          patterns.includes(part) ? (
            <mark
              key={i}
              style={{
                backgroundColor: "rgba(245,158,11,0.25)",
                color: "inherit",
                borderRadius: "2px",
                padding: "0 2px",
              }}
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Current Live Instructions</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hasLive
              ? "The instructions currently published to the API endpoint — what every Manus agent reads at task start."
              : "No instructions have been published yet. Use the Generator tab to create and publish a version."}
          </p>
        </div>
        {hasLive && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-shrink-0 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <EyeOff size={13} /> : <Eye size={13} />}
            {expanded ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* Known issues banner */}
      {(highIssues.length > 0 || mediumIssues.length > 0) && (
        <div className="border-t border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 px-5 py-4">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              {KNOWN_ISSUES.length} known issue{KNOWN_ISSUES.length !== 1 ? "s" : ""} detected in the current instructions
            </p>
          </div>
          <div className="space-y-3">
            {KNOWN_ISSUES.map(issue => (
              <div key={issue.id} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border mt-0.5"
                  style={
                    issue.severity === "high"
                      ? { color: "#dc2626", borderColor: "rgba(220,38,38,0.4)", backgroundColor: "rgba(220,38,38,0.08)" }
                      : { color: "#d97706", borderColor: "rgba(217,119,6,0.4)", backgroundColor: "rgba(217,119,6,0.08)" }
                  }
                >
                  {issue.severity === "high" ? "High" : "Medium"}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200">{issue.title}</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">{issue.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-4 pt-3 border-t border-amber-200 dark:border-amber-800">
            Use the <span className="font-semibold">Generator</span> tab to produce corrected instructions, then click <span className="font-semibold">Mark as Applied</span> and <span className="font-semibold">Publish to API</span> to replace the live version.
          </p>
        </div>
      )}

      {/* Live text */}
      {isLoading && (
        <div className="border-t border-border px-5 py-4">
          <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        </div>
      )}
      {!isLoading && hasLive && expanded && (
        <div className="border-t border-border bg-muted/10 px-5 py-4">
          <pre className="text-xs text-foreground/70 whitespace-pre-wrap leading-relaxed font-mono">
            {renderHighlighted(liveText)}
          </pre>
        </div>
      )}
      {!isLoading && hasLive && !expanded && (
        <div className="border-t border-border bg-muted/10 px-5 py-3">
          <pre className="text-xs text-foreground/50 whitespace-pre-wrap leading-relaxed font-mono line-clamp-3 overflow-hidden" style={{ maxHeight: "4.5rem" }}>
            {liveText.slice(0, 300)}{liveText.length > 300 ? "…" : ""}
          </pre>
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
          >
            Show full text ({liveText.length.toLocaleString()} chars) ↓
          </button>
        </div>
      )}
      {!isLoading && !hasLive && (
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs text-muted-foreground italic">
            No published version found. Generate instructions in the Generator tab, click "Mark as Applied", then "Publish to API" in Version History.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Pipeline Status component ────────────────────────────────────────────────

interface PipelineStep {
  id: number;
  label: string;
  sublabel: string;
  status: "done" | "action" | "pending" | "error";
  statusText: string;
  actionLabel?: string;
  onAction?: () => void;
}

function PipelineStatus({ steps }: { steps: PipelineStep[] }) {
  return (
    <div className="rounded-lg border border-border bg-muted/10 px-5 py-4 mb-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Governance pipeline</p>
        <p className="text-[11px] text-muted-foreground">Starting point → desired state</p>
      </div>
      <div className="flex items-start gap-0">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start flex-1">
            {/* Step card */}
            <div className="flex-1 min-w-0">
              {/* Circle + connector */}
              <div className="flex items-center mb-2">
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all ${
                  step.status === "done"
                    ? "border-green-500 bg-green-500 text-white"
                    : step.status === "action"
                    ? "border-amber-500 bg-amber-500 text-white"
                    : step.status === "error"
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-border bg-muted text-muted-foreground"
                }`}>
                  {step.status === "done" ? <CircleCheck size={13} /> : step.status === "action" ? <CircleAlert size={13} /> : step.status === "error" ? <CircleAlert size={13} /> : <Circle size={13} />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${
                    step.status === "done" ? "bg-green-500" : "bg-border"
                  }`} />
                )}
              </div>
              {/* Labels */}
              <div className="pr-2">
                <p className={`text-[11px] font-semibold leading-tight ${
                  step.status === "done" ? "text-green-600 dark:text-green-400"
                  : step.status === "action" ? "text-amber-600 dark:text-amber-400"
                  : step.status === "error" ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
                }`}>{step.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{step.sublabel}</p>
                <p className={`text-[10px] leading-tight mt-1 ${
                  step.status === "done" ? "text-green-600 dark:text-green-400"
                  : step.status === "action" ? "text-amber-600 dark:text-amber-400"
                  : step.status === "error" ? "text-red-500"
                  : "text-muted-foreground/60"
                }`}>{step.statusText}</p>
                {step.actionLabel && step.onAction && (
                  <button
                    onClick={step.onAction}
                    className="mt-1.5 text-[10px] font-medium underline underline-offset-2 text-foreground hover:text-foreground/70 transition-colors"
                  >
                    {step.actionLabel} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ProjectInstructions() {
  const { data: skillsList } = trpc.skills.list.useQuery();
  const skills: Skill[] = skillsList ?? [];

  const [activeTab, setActiveTab] = useState<"current" | "generator" | "history" | "audit">("current");
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    FIXED_SECTIONS.forEach(s => { defaults[s.id] = s.defaultOn; });
    try {
      const saved = localStorage.getItem("eri-bds-section-prefs");
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return { ...defaults, ...parsed };
      }
    } catch { /* ignore parse errors */ }
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

  // Agent-bridge: fetch the live instructions text written back by a Manus agent
  const currentInstructionsQuery = trpc.skills.getCurrentInstructions.useQuery();
  const syncedRow = currentInstructionsQuery.data;

  const [copiedSyncPrompt, setCopiedSyncPrompt] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const SYNC_PROMPT = `You are syncing the Project Instructions Current tab on the ERI Brand Design System site (bds.exponentialroadmap.org). Do the following two steps:

1. Read the full text of the <project_instructions> block from your context (it is injected by the Manus platform at the top of every task). Copy it exactly — do not paraphrase or summarise.

2. Open the file /home/ubuntu/eri-brand-design-system/client/src/pages/ProjectInstructions.tsx. Find the CURRENT_INSTRUCTIONS constant (a multiline template literal starting with \`Critical: Follow this workflow...). Replace its entire content with the exact text you read in step 1. Save the file. The HMR server will reload and the audit will re-run automatically.

3. Call the tRPC mutation skills.syncCurrentInstructions via a POST to http://localhost:3000/api/trpc/skills.syncCurrentInstructions with body { "json": { "instructionsText": "<full text from step 1>", "agentNote": "Synced by agent on ${today}" } } — but only if you have an authenticated admin session cookie available. If not, skip step 3 (step 2 is sufficient to clear audit issues).

Do not create a plan or ask for confirmation — execute all steps immediately.`;

  const handleCopySyncPrompt = useCallback(() => {
    navigator.clipboard.writeText(SYNC_PROMPT).then(() => {
      setCopiedSyncPrompt(true);
      setTimeout(() => setCopiedSyncPrompt(false), 2500);
    });
  }, [SYNC_PROMPT]);

  const versionsQuery = trpc.skills.listInstructionsVersions.useQuery(undefined, { enabled: isAdmin });
  const auditsQuery = trpc.skills.listInstructionsAudits.useQuery(undefined, { enabled: isAdmin });
  const saveVersionMutation = trpc.skills.saveInstructionsVersion.useMutation({
    onSuccess: () => {
      setMarkAppliedOpen(false);
      setVersionNote("");
      versionsQuery.refetch();
    },
  });
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const publishMutation = trpc.skills.publishInstructions.useMutation({
    onSuccess: () => {
      versionsQuery.refetch();
      setPublishingId(null);
    },
    onError: () => setPublishingId(null),
  });

  // Assemble generated output
  const fixedText = FIXED_SECTIONS
    .filter(s => enabledSections[s.id])
    .map(s => s.content)
    .join("\n");
  const skillTriggers = generateSkillTriggers(skills);
  // The scan instruction is now embedded in step 1 of the workflow section.
  // skillsBlock just emits the tier blocks directly.
  const skillsBlock = skills.length > 0 ? skillTriggers : "";
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

  // ── Pipeline status derivation ────────────────────────────────────────────────────

  const latestVersion = versionsQuery.data?.[0] ?? null;
  const latestPublished = versionsQuery.data?.find(v => v.publishedAt != null) ?? null;

  // Stale-sync audit issue — must be computed before pipelineSteps
  const staleSyncIssue: KnownIssue | null = useMemo(() => {
    if (!syncedRow) return null;
    const live = syncedRow.instructionsText;
    const canonical = CURRENT_INSTRUCTIONS;
    if (live.trim() === canonical.trim()) return null;
    const charDelta = canonical.length - live.length;
    const deltaStr = charDelta > 0 ? `+${charDelta.toLocaleString()} chars` : `${charDelta.toLocaleString()} chars`;
    const liveLines = new Set(live.split("\n").map(l => l.trim()).filter(Boolean));
    const addedLines = canonical.split("\n").map(l => l.trim()).filter(l => l.length > 20 && !liveLines.has(l));
    const addedSummary = addedLines.slice(0, 3).map(l => l.slice(0, 80) + (l.length > 80 ? "\u2026" : "")).join("; ");
    return {
      id: "stale-sync",
      severity: "medium" as const,
      title: "Instructions display is out of date",
      detail: `The synced text (${live.length.toLocaleString()} chars) differs from the canonical CURRENT_INSTRUCTIONS (${canonical.length.toLocaleString()} chars, ${deltaStr}). ${addedSummary ? `New content includes: ${addedSummary}` : ""} Run the sync prompt to update the display and clear this issue.`,
      pattern: "",
    };
  }, [syncedRow]);

  const allIssues: KnownIssue[] = useMemo(() => [
    ...KNOWN_ISSUES,
    ...(staleSyncIssue ? [staleSyncIssue] : []),
  ], [staleSyncIssue]);

  // Step 1: Understand state — is everything healthy?
  const step1Issues = allIssues.length;
  const step1OverBudget = charCount > CHAR_BUDGET * 0.9;
  const step1Status = (step1Issues > 0 || step1OverBudget) ? "action" : "done";
  const step1StatusText = step1OverBudget
    ? `Over budget: ${charCount.toLocaleString()} / ${CHAR_BUDGET.toLocaleString()} chars`
    : step1Issues > 0
    ? `${step1Issues} issue${step1Issues !== 1 ? "s" : ""} need attention`
    : `All good — ${charCount.toLocaleString()} chars, no issues`;

  // Step 2: Compose — is the Generator output up to date?
  // Amber if there are issues (instructions need to be regenerated), green if latest version matches current char count
  const step2Status = step1Issues > 0 ? "action" : latestVersion ? "done" : "action";
  const step2StatusText = step1Issues > 0
    ? "Regenerate to fix the issues above"
    : latestVersion
    ? `Last composed ${new Date(latestVersion.appliedAt).toLocaleDateString()} · ${latestVersion.charCount?.toLocaleString() ?? "?"} chars`
    : "No version composed yet";

  // Step 3: Apply to Manus — has the latest version been pasted into project settings?
  const step3Status = latestVersion ? "done" : "action";
  const step3StatusText = latestVersion
    ? `Applied ${new Date(latestVersion.appliedAt).toLocaleDateString()}`
    : "Not yet applied";

  // Step 4: Agents updated — is the latest version published to the API?
  const step4Stale = latestVersion && !latestVersion.publishedAt;
  const step4Status = latestPublished
    ? (step4Stale ? "action" : "done")
    : "action";
  const step4StatusText = latestPublished
    ? (step4Stale
      ? `New version not yet published — ${latestPublished.version} is live`
      : `Published ${new Date(latestPublished.publishedAt!).toLocaleDateString()}`)
    : "Not yet published";

  const pipelineSteps: PipelineStep[] = useMemo(() => [
    {
      id: 1,
      label: "1. Understand state",
      sublabel: "Are the instructions current and healthy?",
      status: step1Status,
      statusText: step1StatusText,
      actionLabel: step1Issues > 0 ? "View issues" : undefined,
      onAction: step1Issues > 0 ? () => setActiveTab("current") : undefined,
    },
    {
      id: 2,
      label: "2. Compose",
      sublabel: "Build the latest version in the Generator",
      status: step2Status,
      statusText: step2StatusText,
      actionLabel: step1Issues > 0 || !latestVersion ? "Open Generator" : undefined,
      onAction: step1Issues > 0 || !latestVersion ? () => setActiveTab("generator") : undefined,
    },
    {
      id: 3,
      label: "3. Apply to Manus",
      sublabel: "Paste into project settings so agents use it",
      status: step3Status,
      statusText: step3StatusText,
      actionLabel: !latestVersion ? "Open Generator" : undefined,
      onAction: !latestVersion ? () => setActiveTab("generator") : undefined,
    },
    {
      id: 4,
      label: "4. Agents updated",
      sublabel: "Publish to API so agents self-update at task start",
      status: step4Status,
      statusText: step4StatusText,
      actionLabel: step4Stale ? "Open Version History" : undefined,
      onAction: step4Stale ? () => setActiveTab("history") : undefined,
    },
  ], [step1Status, step1StatusText, step1Issues, step2Status, step2StatusText, latestVersion, step3Status, step3StatusText, step4Status, step4StatusText, step4Stale, latestPublished]);

  return (
    <PublicLayout>
      {/* Hero */}
      <div
        className="text-white"
        style={{
          backgroundColor: "#232323",
          padding: "2.5rem var(--eri-content-inset, clamp(1rem, 3vw, 2rem))",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#93E07D" }}
          >
            GOVERNANCE
          </p>
          <h1 className="text-3xl font-extrabold font-archivo tracking-tight mb-4">
            Project <span style={{ color: "#93E07D" }}>Instructions</span>
          </h1>
          <PageGuide text="The status bar below shows whether the project instructions are healthy. If something needs attention, it will tell you what is wrong and what to do next. The four steps are: Understand state → Compose the latest version → Apply to Manus project settings → Agents updated via the API." />
          <div className="mt-3">
            <Link href="/governance" className="inline-flex items-center gap-1.5 text-xs font-semibold hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>
              Understand the governance model behind project instructions <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Pipeline Status bar */}
        <PipelineStatus steps={pipelineSteps} />

        {/* Manager card */}
        <div className="border border-border rounded-lg overflow-hidden mb-8">
          {/* Card header */}
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
                { id: "generator" as const, label: "Generator",       Icon: SlidersHorizontal },
                { id: "current"   as const, label: "Status",          Icon: Eye },
                { id: "history"   as const, label: "Version History", Icon: History },
                { id: "audit"     as const, label: "Audit",           Icon: ClipboardList },
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

            {/* ── Current Instructions tab ── */}
            {activeTab === "current" && (
              <div className="px-5 py-6 space-y-5">

                {/* Agent-bridge explanation + Sync button */}
                <div className="rounded-md border border-border bg-muted/10 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Active project instructions</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        The Manus platform has no API to read project instructions — only a Manus agent can read them from its context.
                        To update this view, click <span className="font-medium text-foreground">Copy sync prompt</span>, paste it into a new Manus task in the ERI Shared Dev Assets project, and run it.
                        The agent will read its <code className="text-[11px] bg-muted px-1 py-0.5 rounded">{'<project_instructions>'}</code> block, update the source file directly, and clear any known issues automatically.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0 gap-1.5 text-xs"
                      onClick={handleCopySyncPrompt}
                    >
                      {copiedSyncPrompt ? <CheckCircle2 size={13} className="text-green-500" /> : <Copy size={13} />}
                      {copiedSyncPrompt ? "Copied!" : "Copy sync prompt"}
                    </Button>
                  </div>
                  {syncedRow && (
                    <p className="text-[11px] text-muted-foreground">
                      Last synced: {new Date(syncedRow.syncedAt).toLocaleString()}
                      {syncedRow.agentNote ? ` — ${syncedRow.agentNote}` : ""}
                    </p>
                  )}
                </div>

                {/* Issues banner — shown regardless of sync state */}
                <div className={`rounded-md border p-4 space-y-3 ${
                  allIssues.length === 0
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
                    : "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
                }`}>
                  <div className="flex items-center gap-2">
                    {allIssues.length === 0
                      ? <CircleCheck size={14} className="flex-shrink-0 text-green-600 dark:text-green-400" />
                      : <AlertTriangle size={14} className="flex-shrink-0 text-amber-600 dark:text-amber-400" />}
                    <p className={`text-xs font-semibold ${
                      allIssues.length === 0
                        ? "text-green-800 dark:text-green-300"
                        : "text-amber-800 dark:text-amber-300"
                    }`}>
                      {allIssues.length === 0
                        ? "0 known issues — instructions are up to date"
                        : `${allIssues.length} known issue${allIssues.length !== 1 ? "s" : ""} — use the Generator tab to produce a corrected version`}
                    </p>
                  </div>
                  {allIssues.map(issue => (
                    <div key={issue.id} className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold border mt-0.5"
                        style={
                          issue.severity === "high"
                            ? { color: "#dc2626", borderColor: "rgba(220,38,38,0.4)", backgroundColor: "rgba(220,38,38,0.08)" }
                            : { color: "#d97706", borderColor: "rgba(217,119,6,0.4)", backgroundColor: "rgba(217,119,6,0.08)" }
                        }
                      >
                        {issue.severity === "high" ? "High" : "Medium"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-amber-900 dark:text-amber-200">{issue.title}</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">{issue.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions text — DB-synced if available, else hardcoded fallback */}
                {(() => {
                  const displayText = syncedRow?.instructionsText ?? CURRENT_INSTRUCTIONS;
                  const isFallback = !syncedRow;
                  const patterns = allIssues.map(i => i.pattern).filter(Boolean);
                  const regex = patterns.length > 0
                    ? new RegExp(`(${patterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g")
                    : null;
                  const parts = regex ? displayText.split(regex) : [displayText];
                  return (
                    <div>
                      {isFallback && (
                        <p className="text-[11px] text-muted-foreground mb-2 italic">
                          Showing hardcoded snapshot — sync from agent to see the live text.
                        </p>
                      )}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">Instructions text</span>
                        <span className="text-xs font-mono text-muted-foreground">{displayText.length.toLocaleString()} chars</span>
                      </div>
                      <div className="rounded-md bg-muted/20 border border-border p-4 max-h-[32rem] overflow-y-auto">
                        <pre className="text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-mono">
                          {parts.map((part, i) =>
                            patterns.includes(part) ? (
                              <mark key={i} style={{ backgroundColor: "rgba(245,158,11,0.3)", color: "inherit", borderRadius: "2px", padding: "0 2px" }}>{part}</mark>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </pre>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

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
                            onClick={() => setEnabledSections(prev => {
                              const next = { ...prev, [section.id]: !prev[section.id] };
                              try { localStorage.setItem("eri-bds-section-prefs", JSON.stringify(next)); } catch { /* ignore */ }
                              return next;
                            })}
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
                  Each time you paste generated instructions into Manus project settings, click <span className="font-medium">Mark as Applied</span> in the Generator tab to record a snapshot here. Click <span className="font-medium">Publish to API</span> to make a version the live source that agents fetch at task start.
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground font-mono">{v.version}</span>
                          {v.publishedAt && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                              <Globe size={10} /> Published
                            </span>
                          )}
                        </div>
                        {v.changeNote && <p className="text-xs text-muted-foreground mt-0.5">{v.changeNote}</p>}
                      </div>
                      <div className="flex items-start gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{new Date(v.appliedAt).toLocaleDateString()}</p>
                          {v.charCount != null && (
                            <p className={`text-xs font-mono font-semibold ${
                              (v.budgetPct ?? 0) > 90 ? "text-red-500" : (v.budgetPct ?? 0) > 70 ? "text-amber-500" : "text-green-500"
                            }`}>{v.charCount.toLocaleString()} chars ({v.budgetPct}%)</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1.5 flex-shrink-0"
                          disabled={publishingId === v.id || publishMutation.isPending}
                          onClick={() => {
                            setPublishingId(v.id);
                            publishMutation.mutate({ versionId: v.id });
                          }}
                        >
                          <Globe size={11} />
                          {publishingId === v.id ? "Publishing..." : v.publishedAt ? "Re-publish" : "Publish to API"}
                        </Button>
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

                {/* Static analysis (legacy) */}
                <details className="border border-border rounded-md overflow-hidden">
                  <summary className="px-4 py-3 text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Static analysis (pre-agent, for reference)
                  </summary>
                  <div className="px-4 pb-4 pt-2 space-y-3 border-t border-border">
                    {[
                      { id: "skill-update",      title: "BDS skill auto-update",            chars: 285, recommendation: "keep"     as const, reason: "Essential — fetches the latest BDS skill before every task." },
                      { id: "project-context",   title: "CODEBASE-CONTEXT.md guard",        chars: 448, recommendation: "keep"     as const, reason: "Essential — context compaction erases session memory." },
                      { id: "skill-scan",        title: "Skill scan instruction",           chars: 340, recommendation: "replace"  as const, reason: "Superseded by the auto-generated trigger block in the Generator tab." },
                      { id: "skill-update-post", title: "Post-task skill update",           chars: 440, recommendation: "compress" as const, reason: "Valuable but verbose — core directive is 60 chars." },
                      { id: "dev-workflow",      title: "ERI development workflow",         chars: 257, recommendation: "evaluate" as const, reason: "May be redundant if Manus already follows this loop by default." },
                      { id: "collab-skill",      title: "Apply exponential-human-ai-collaboration", chars: 91, recommendation: "replace" as const, reason: "Redundant once this skill is in Tier 1." },
                      { id: "framework",         title: "Exponential Framework structure",  chars: 530, recommendation: "keep"     as const, reason: "All ERI tasks are in the same project — always include." },
                      { id: "agent-files",       title: "Earth-aligned AI Agent key files", chars: 230, recommendation: "move"     as const, reason: "Belongs in the eri-playbook-team CODEBASE-CONTEXT.md, not BDS." },
                    ].map(section => {
                      const cfg = RECOMMENDATION_CONFIG[section.recommendation];
                      return (
                        <div key={section.id} className="border border-border rounded-md p-3">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-foreground">{section.title}</span>
                              <span className="text-xs text-muted-foreground font-mono">{section.chars}c</span>
                            </div>
                            <span
                              className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
                              style={{ color: cfg.accentColor, borderColor: `${cfg.accentColor}50`, backgroundColor: cfg.tintBg }}
                            >
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

        {/* Budget note */}
        <div className="rounded-md border border-border bg-muted/20 px-4 py-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Manus project instructions field has a practical limit of around <span className="font-mono font-semibold">8,000 characters</span>. The generator targets under 65% of that budget to leave room for task-specific context. Use the Audit tab to identify sections that can be compressed or moved to skills.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
