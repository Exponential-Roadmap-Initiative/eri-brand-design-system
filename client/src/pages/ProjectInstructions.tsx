/**
 * ERI Brand Design System — Project Instructions Manager (top-level page)
 *
 * Extracted from Skills.tsx. Provides the full instructions generator,
 * version history, and audit workflow as a standalone page at /project-instructions.
 *
 * Reads are public. Writes (save version, publish, save audit) are admin-only.
 */

import { useState, useCallback } from "react";
import {
  SlidersHorizontal,
  Clock,
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
    id: "S_BDS_UPDATE",
    label: "BDS skill auto-update",
    chars: 285,
    defaultOn: true,
    description: "Fetches the latest BDS reference skill at the start of every task.",
    content: `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action`,
  },
  {
    id: "S_PROJECT_CONTEXT",
    label: "CODEBASE-CONTEXT.md guard",
    chars: 448,
    defaultOn: true,
    description: "Preserves project-specific knowledge across context compaction and sandbox resets.",
    content: `Critical: At the start of every task, check whether a CODEBASE-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files (audit reports, feedback notes, spec files, etc.). After completing any task, update CODEBASE-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`,
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
    id: "S_INSTRUCTIONS_UPDATE",
    label: "Project instructions auto-update",
    chars: 220,
    defaultOn: false,
    description: "Fetches the latest published project instructions from the BDS site at task start. Enable once a version has been published via the Publish to API button.",
    content: `Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/project-instructions/latest > /tmp/eri-project-instructions.md 2>/dev/null && cat /tmp/eri-project-instructions.md || true`,
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

// ── Main component ────────────────────────────────────────────────────────────

export default function ProjectInstructions() {
  const { data: skillsList } = trpc.skills.list.useQuery();
  const skills: Skill[] = skillsList ?? [];

  const [activeTab, setActiveTab] = useState<"generator" | "history" | "audit">("generator");
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

  const versionsQuery = trpc.skills.listInstructionsVersions.useQuery(undefined, { enabled: isAdmin });
  const auditsQuery = trpc.skills.listInstructionsAudits.useQuery(undefined, { enabled: isAdmin });
  const saveVersionMutation = trpc.skills.saveInstructionsVersion.useMutation({
    onSuccess: () => {
      versionsQuery.refetch();
      setMarkAppliedOpen(false);
      setVersionNote("");
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
          <PageGuide text="Generate the instructions block for your Manus project, manage Fixed Sections, track version history, and run audits. The generator assembles skill triggers from the live registry plus any Fixed Sections you enable. Copy the output and paste it into Manus project settings." />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
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
