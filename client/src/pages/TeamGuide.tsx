/**
 * TeamGuide — /team-guide
 *
 * Consolidates the Manus collaboration guide for ERI colleagues.
 * Audience: non-technical ERI team members learning how to use Manus effectively.
 * Distinct from the BDS developer reference — different layout, different tone.
 *
 * Content ported from eri-collaboration.manus.space (2026-06-04).
 */
import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { PageGuide } from "@/components/PageGuide";

// ── Copy-to-clipboard helper ──────────────────────────────────────────────────
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#3ba559] text-white hover:bg-[#2d8a47] transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ── Step number badge ─────────────────────────────────────────────────────────
function StepBadge({ n, time }: { n: string; time?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      <div className="w-10 h-10 rounded-full bg-[#3ba559] text-white flex items-center justify-center font-extrabold text-base font-archivo">
        {n}
      </div>
      {time && (
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
          {time}
        </span>
      )}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold text-[#3ba559] uppercase tracking-widest mb-2">{eyebrow}</p>
      <h2 className="text-2xl font-extrabold text-foreground font-archivo mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-base">{subtitle}</p>}
    </div>
  );
}

// ── Pre-prompt text (canonical v5) ────────────────────────────────────────────
const PRE_PROMPT_TEXT = `Critical: At the start of every task, run:
  curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated"
Then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action.

Critical: At the start of every task, check whether a CODEBASE-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work by consolidating any existing knowledge files.

Critical: Always follow the ERI development workflow:
1. Research: clarify purpose, understand current context and existing assets, explore possible solutions
2. Design
3. Plan and get acceptance for plan
4. Implement
5. Test
6. Iterate until solution works

Critical: Apply the exponential-human-ai-collaboration skill to every task in this project.

Critical: After completing any task, update CODEBASE-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.`;

// ── Hard stops data ───────────────────────────────────────────────────────────
const HARD_STOPS = [
  {
    id: "STEP 0",
    label: "Mandatory Startup",
    desc: "Before reading the task, update the BDS skill, confirm the server is running, read the mandatory skills (exponential-human-ai-collaboration, eri-bds-reference), and read CODEBASE-CONTEXT.md in full. This file contains canonical values, known errors, and pending work that are lost during context compaction.",
  },
  {
    id: "INHERITED SESSION",
    label: "Compacted Context Rule",
    desc: "If the conversation history shows compacted context tags, treat all unverified code as unreviewed. Run all applicable gates against every modified file and paste the results before proceeding with any new work.",
  },
  {
    id: "HARD STOP 0",
    label: "Health Score Context",
    desc: "State the current health score and the score for the category your task touches. If the category score is below 50 and there are open critical issues, address at least one critical issue before adding new code. This prevents building on a broken foundation.",
  },
  {
    id: "HARD STOP 1",
    label: "Database Writes",
    desc: "If your task involves any INSERT, UPDATE, or DELETE: run a SELECT first and paste the result. Confirm all foreign key IDs exist, all enum values are valid, and all string key formats match the existing data pattern.",
  },
  {
    id: "HARD STOP 2",
    label: "Frontend Component Edits",
    desc: "If your task involves changing anything visible in the UI, grep for a unique string literally visible in the target UI and paste the result. The file that owns that string is the correct file. Do not edit any other file, even if its name looks right.",
  },
  {
    id: "HARD STOP 3",
    label: "Feature Integration",
    desc: "If your task involves a new feature that reads or writes data, state the full data path before writing code: what writes it, what reads it, what renders it, and whether useEffect deps and state merging are correct.",
  },
  {
    id: "HARD STOP 4",
    label: "Schema Changes",
    desc: "If your task involves adding a table, column, or index: verify every FK column has an explicit index, every WHERE column has an index, no procedure has a per-row query inside a loop, and the migration is backward-compatible.",
  },
  {
    id: "HARD STOP 5",
    label: "Fix Planner Integration",
    desc: "If any hard stop reveals a defect that is not being fixed in this session, create a Fix Planner issue before closing the task. State the issue title, category, and severity in your response.",
  },
  {
    id: "HARD STOP 6",
    label: "Generic and Reusable Architecture",
    desc: "Before writing any design or code for a new endpoint, component, pipeline, schema, or service: confirm the solution works for the general case, not just one specific case. Every solution must be parameterised for reuse. A dedicated endpoint for a single portfolio or a dedicated component for a single data source is a violation of Critical Rule 1 unless explicitly justified.",
  },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function TeamGuide() {
  const [activeSection, setActiveSection] = useState<"new" | "share" | "stack">("new");

  return (
    <PublicLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#232323] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto" style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}>
          <p className="text-xs font-bold text-[#93E07D] uppercase tracking-widest mb-4">
            Exponential Roadmap Initiative · Team Onboarding
          </p>
          <h1 className="text-4xl font-extrabold font-archivo mb-4 leading-tight">
            Your ERI AI<br />
            <span className="text-[#93E07D]">Team</span> is Ready.
          </h1>
          <PageGuide text="Use the three cards below to jump to the section most relevant to you. New to Manus? Start with ‘I’m new to Manus’. Already onboarded and need to share a task with a colleague? Go to ‘I need to share a task’. Want to understand how ERI’s full AI stack fits together? Choose ‘I want the full picture’." />
          <p className="text-base text-white/80 mt-6 mb-8 max-w-xl">
            ERI uses Manus to build the Exponential Human–AI Lab — everything at the intersection of human expertise and AI, from early-stage experiments to live applications. This guide gets you from zero to your first output in 15 minutes.
          </p>
          {/* Entry cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: "new" as const,
                label: "I'M NEW TO MANUS",
                desc: "ERI uses Manus to build the Exponential Human–AI Lab — the applications, tools, and frameworks that power ERI's climate and business transformation work. Get your bearings in 15 minutes.",
                cta: "Start the guide",
              },
              {
                id: "share" as const,
                label: "I NEED TO SHARE A TASK",
                desc: "Learn the two sharing models — Project sharing for context, Collab for active work — and the four steps your team uses every day.",
                cta: "See how sharing works",
              },
              {
                id: "stack" as const,
                label: "I WANT THE FULL PICTURE",
                desc: "Understand how ERI uses Manus to build the Exponential Human\u2013AI Lab \u2014 the applications, tools, and frameworks that power ERI's climate and business transformation work.",
                cta: "Explore the AI stack",
              },
            ].map(({ id, label, desc, cta }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={[
                  "text-left rounded-lg border p-4 transition-all",
                  activeSection === id
                    ? "border-[#93E07D] bg-white/10"
                    : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10",
                ].join(" ")}
              >
                <p className="text-[10px] font-bold text-[#93E07D] uppercase tracking-widest mb-2">{label}</p>
                <p className="text-xs text-white/70 mb-3 leading-relaxed">{desc}</p>
                <span className="text-xs font-semibold text-[#93E07D]">{cta} →</span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── Getting Started ──────────────────────────────────────────────────────────────────────────────── */}
      <section id="section-new" className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto" style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}>
          <SectionHeading
            eyebrow="Getting Started"
            title="Your First 15 Minutes"
            subtitle="Four steps to your first successful Manus output — from joining the team account to running your first task."
          />

          <div className="flex flex-col gap-8">
            {[
              {
                n: "01", time: "2 min",
                title: "Understand what Manus is for at ERI",
                body: "ERI uses Manus to build the Exponential Human–AI Lab — a growing suite of applications at the intersection of human expertise and AI, from early-stage experiments to live applications, all powered by the same data and the same mission. Manus executes complete multi-step workflows and delivers finished outputs: web applications, research tools, assessment frameworks, and data-driven guides.",
              },
              {
                n: "02", time: "3 min",
                title: "Join your first project",
                body: "Ask your team lead to invite you to the relevant Manus project (e.g. CPR AI Assisted Framework). Once invited, you will have access to the shared instructions and reference files — the canonical context your whole team starts from.",
              },
              {
                n: "03", time: "5 min",
                title: "Get a shared task link",
                body: "Ask your team lead to share one active task with you via Manus Collab. Open it, read through the task history, and see how the AI has been prompted and what it has produced. This is the fastest way to understand how the team works.",
              },
              {
                n: "04", time: "5 min",
                title: "Run your first task — with the ERI pre-prompt",
                body: "Start a new task inside the project. Use the ERI pre-prompt as your opening message. It is not a reminder — it is a hard-stop protocol that ensures every task starts with the right context, the right brand standards, and the right quality gates. Your first output is your proof of concept.",
              },
            ].map(({ n, time, title, body }) => (
              <div key={n} className="flex gap-5">
                <StepBadge n={n} time={time} />
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground font-archivo mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pre-prompt callout */}
          <div className="mt-12 rounded-xl border border-border overflow-hidden">
            <div className="bg-[#232323] px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold text-[#93E07D] uppercase tracking-widest mb-1">ERI Task Pre-Prompt v5</p>
                <p className="text-white font-bold font-archivo">A hard-stop protocol, not a reminder</p>
              </div>
              <CopyButton text={PRE_PROMPT_TEXT} label="Copy Pre-Prompt" />
            </div>
            <div className="bg-muted/40 px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-foreground mb-1">What it is</p>
                <p className="text-muted-foreground text-xs leading-relaxed">A mandatory sequence of checks that must be completed before any code is written or any design is produced. If the AI proceeds without completing each applicable hard stop, interrupt it and ask: "Which hard stop did you just complete, and what was the result?"</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">When to use it</p>
                <p className="text-muted-foreground text-xs leading-relaxed">Attach it to every new Manus task in an ERI project — especially tasks that involve writing code, changing a UI, modifying a database, or designing a new feature.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Why it matters</p>
                <p className="text-muted-foreground text-xs leading-relaxed font-mono text-[10px] bg-muted rounded p-2">Grep → see something plausible → assume it is correct → build on it → ship broken code</p>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2">The pre-prompt forces the AI to verify before building — and forces you to confirm that verification happened.</p>
              </div>
            </div>
            {/* Hard stops table */}
            <div className="border-t border-border">
              <div className="px-6 py-3 bg-muted/20">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">The Hard Stops</p>
              </div>
              <div className="divide-y divide-border">
                {HARD_STOPS.map(({ id, label, desc }) => (
                  <div key={id} className="px-6 py-3 flex gap-4">
                    <div className="shrink-0 w-36">
                      <span className="text-[10px] font-bold text-[#3ba559] uppercase tracking-wide">{id}</span>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{label}</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-3 bg-muted/20 border-t border-border flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground italic">
                ERI principle: Define the human agenda before you start. Know what transformation goal your task should support, what assumptions you are challenging, and what a useful output looks like — then let Manus execute.
              </p>
              <a
                href="https://bds.exponentialroadmap.org/new-project"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#3ba559] hover:text-foreground transition-colors shrink-0"
              >
                View the full ERI Task Pre-Prompt v5 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Stack ──────────────────────────────────────────────────────── */}
      <section id="section-stack" className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto" style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}>
          <SectionHeading
            eyebrow="ERI AI Stack"
            title="Manus"
            subtitle="ERI uses Manus as its autonomous execution layer \u2014 building the applications, tools, and frameworks that power ERI's climate and business transformation work."
          />

          <div className="grid grid-cols-1 gap-6">
            {/* Manus */}
            <div className="rounded-xl border border-[#3ba559] bg-background overflow-hidden">
              <div className="bg-[#3ba559] px-5 py-4">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Manus · Execution Layer</p>
                <p className="text-white font-bold font-archivo text-lg">Execute, build, and deliver</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Manus is ERI's autonomous execution layer. ERI uses Manus to build the Exponential Human–AI Lab — the applications, tools, and frameworks that power ERI's climate and business transformation work. Manus executes complete multi-step workflows and delivers finished outputs.
                </p>
                <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">ERI use cases</p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  {[
                    "Building the Exponential Human–AI Lab application suite",
                    "CPR grading and corporate performance report analysis",
                    "Creating assessment frameworks and methodology hubs",
                    "Developing web tools grounded in the Exponential Playbook",
                  ].map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#3ba559] shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">Collaboration note:</span> Manus tasks are private by default. Share individual tasks via Collab, or use project shared files for team-wide context.
                  </p>
                  <a
                    href="https://manus.im/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-[#3ba559] hover:text-foreground transition-colors"
                  >
                    Manus Documentation →
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-background border border-border px-5 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">ERI principle:</span> Define the human agenda before you start. Know what transformation goal your task should support, what assumptions you are challenging, and what a useful output looks like \u2014 then let Manus execute.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sharing ───────────────────────────────────────────────────────── */}
      <section id="section-share" className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto" style={{ paddingInline: "var(--eri-content-inset, clamp(1rem, 3vw, 2rem))" }}>
          <SectionHeading
            eyebrow="Quick Summary"
            title="Four things to know about sharing"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              {
                n: "1",
                title: "Tasks are private by default",
                body: "Even within a shared project, every task is private unless explicitly shared. Being invited to a project does not automatically give you access to your colleagues' tasks.",
              },
              {
                n: "2",
                title: "This is how Manus is designed",
                body: "Tasks being private is not a bug, a misconfiguration, or something your team lead forgot to do. It is a deliberate platform choice to protect privacy and keep everyone focused.",
              },
              {
                n: "3",
                title: "Two separate sharing models",
                body: "Projects share instructions and files with your whole team. Individual tasks must be shared separately — your colleague needs to invite you to each task they want you to see.",
              },
              {
                n: "4",
                title: "How the ERI team shares work",
                body: "Your team shares key tasks explicitly using Manus Collab. Ask your team lead to share the relevant task links with you directly, or check the team's shared task index.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#3ba559] text-white text-xs font-bold flex items-center justify-center shrink-0">{n}</span>
                  <p className="font-semibold text-foreground text-sm">{title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <SectionHeading
            eyebrow="How it works"
            title="How Manus Task Sharing Works"
            subtitle="A clear explanation of how Manus handles project and task visibility — and why what you are seeing is by design, not a mistake."
          />

          <div className="flex flex-col gap-8 mb-12">
            {[
              {
                n: "01",
                title: "Being in a Project does not mean you can see all its Tasks",
                body: "In most collaboration tools, joining a project means you can see everything inside it. Manus works differently. A project in Manus is a persistent workspace with shared instructions and files — it gives everyone a consistent starting point, but it does not make tasks visible to all members automatically.",
                quote: "Projects and individual tasks are private by default. When you invite a colleague to a project, they gain access to the shared master instruction and knowledge base. However, they can only see the tasks they have created themselves within that project.",
                quoteSource: "Manus Documentation: Projects",
              },
              {
                n: "02",
                title: "Task Privacy by Default",
                body: "Manus enforces a strict privacy-by-default model for all tasks, even within Team plans. Simply being in the same Team plan or the same shared project does not automatically grant visibility into another user's tasks. This design is intentional: it protects sensitive work-in-progress from being inadvertently exposed to colleagues.",
                quote: "Manus is fully committed to respecting user privacy. All tasks are designated as private, and team members do not have access to tasks created by other members.",
                quoteSource: "Manus Help Centre: How can Manus Team members see the tasks I created?",
              },
              {
                n: "03",
                title: "The Intended Workflow for Team Collaboration",
                body: "Manus is designed around two distinct types of sharing, which serve different purposes. Project sharing is the foundation: it ensures everyone starts with the right context, canonical files, and master instructions. Task sharing (Collab) is the mechanism for active, visible collaboration on a specific piece of work. Both are necessary for effective team use.",
              },
              {
                n: "04",
                title: "Platform Limitation vs. Design Choice",
                body: "While this behaviour is working exactly as designed by Manus, it represents a workflow gap for teams that expect a 'shared folder' model where all work within a project is automatically visible to all members. Currently, there is no 'project-level task visibility' toggle in Manus. This is a confirmed limitation of the platform's collaboration model relative to tools like Notion, Linear, or Asana.",
              },
            ].map(({ n, title, body, quote, quoteSource }) => (
              <div key={n} className="flex gap-5">
                <StepBadge n={n} />
                <div className="flex-1 pt-1">
                  <h3 className="font-bold text-foreground font-archivo mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
                  {quote && (
                    <blockquote className="mt-3 border-l-2 border-[#3ba559] pl-4 text-xs text-muted-foreground italic leading-relaxed">
                      "{quote}"
                      <footer className="mt-1 text-[10px] font-semibold text-foreground not-italic">— {quoteSource}</footer>
                    </blockquote>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sharing models table */}
          <SectionHeading
            eyebrow="Sharing Models"
            title="The Two Sharing Models"
            subtitle="Manus provides two distinct sharing mechanisms. Both are needed for effective team collaboration."
          />
          <div className="overflow-x-auto rounded-lg border border-border mb-12">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-foreground uppercase tracking-wide">Sharing type</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-foreground uppercase tracking-wide">What is shared</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-foreground uppercase tracking-wide">How to enable</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-foreground uppercase tracking-wide">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground text-xs">Project Sharing</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Master instructions, knowledge base files (e.g. grading guidance, reference documents)</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Click "Invite" on the project</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Gives every team member a consistent starting point and shared context — automatically available once invited</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-foreground text-xs">Task Sharing (Collab)</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">The specific task execution, prompts, and AI outputs</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Click "Share" → "Collaboration" on the individual task</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">Allows multiple team members to view, prompt, and iterate on a single piece of work in real time</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Team workflow */}
          <SectionHeading
            eyebrow="Your Team's Workflow"
            title="How We Collaborate on Manus"
            subtitle="Four practices the ERI team uses to collaborate effectively within Manus — starting from your first day."
          />
          <div className="flex flex-col gap-6">
            {[
              {
                n: "1",
                title: "Projects give you context — tasks need to be shared separately",
                body: "Projects hold the shared files and instructions your team has set up — things like grading guidance and reference documents. You have access to these automatically once you are invited to a project. But the tasks your colleagues are running are separate — you will need them to share those with you directly.",
              },
              {
                n: "2",
                title: "Ask your colleague to share the task with you",
                body: "If you need to see or contribute to a colleague's task, ask them to share it with you via the Share button inside that task. They can invite you by name or send you a Collab link — either way, you will then see the task in your own Manus workspace.",
              },
              {
                n: "3",
                title: "Use Manus Collab for active collaboration",
                body: "For tasks where you need to contribute or review the AI's output, the \"Collaboration\" share option creates a single source of truth where everyone can see updates instantly. This is the primary way the ERI team works together on Manus.",
              },
              {
                n: "4",
                title: "Find the team's shared task index",
                body: "Ask your team lead where the shared task index is kept — it is typically a pinned document or message in your team's main channel. This is your starting point for finding all active shared tasks for the current project.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#3ba559] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{n}</div>
                <div>
                  <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing callout */}
          <div className="mt-10 rounded-lg bg-[#232323] text-white px-6 py-5">
            <p className="font-bold font-archivo mb-2">You now know how it works</p>
            <p className="text-sm text-white/80 leading-relaxed mb-4">
              The Manus platform intentionally keeps tasks private by default — even within a shared project — to protect privacy and maintain focus. This is not a limitation your team can change; it is simply how Manus works.
            </p>
            <p className="text-xs text-white/60">
              Your next step: ask your team lead to share the relevant task links with you, or check the team's shared task index for all active work.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://manus.im/docs/features/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#93E07D] hover:text-white transition-colors"
              >
                Manus Projects Docs →
              </a>
              <a
                href="https://manus.im/docs/features/collab"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#93E07D] hover:text-white transition-colors"
              >
                Manus Collab Docs →
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
