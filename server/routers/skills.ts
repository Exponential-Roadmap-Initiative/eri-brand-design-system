// server/routers/skills.ts
// Skills management router for the BDS skill-manager system.
//
// Architecture (post-migration):
//   - Skill CONTENT lives on the filesystem in /home/ubuntu/skills/<id>/SKILL.md
//   - Skill METADATA (tier, category, version, readWhen) lives in SKILLS_METADATA below
//   - Skill IMPROVEMENT LOG lives in the `skill_improvements` DB table (append-only)
//   - Project instructions PREAMBLE lives in `project_instructions` DB table
//   - Project instructions VERSION HISTORY lives in `project_instructions_versions` DB table
//   - Project instructions AUDIT FINDINGS live in `project_instructions_audits` DB table
//
// Reads are public. Writes are admin-only (except preamble which is protected).

import fs from "fs";
import path from "path";
import { TRPCError } from "@trpc/server";
import { desc, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import {
  currentInstructionsSync,
  projectInstructions,
  projectInstructionsAudits,
  projectInstructionsVersions,
  skillImprovements,
} from "../../drizzle/schema";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

// ─── Canonical skill metadata ─────────────────────────────────────────────────
// This is the single source of truth for tier, category, version, and readWhen.
// Content (the full SKILL.md text) is read from the filesystem via getContent.
// To add a skill: add an entry here AND create /home/ubuntu/skills/<id>/SKILL.md.

export interface SkillMeta {
  id: string;
  name: string;
  description: string;
  tier: 1 | 2 | 3;
  category: string;
  version: string;
  readWhen: string;
  hasReferences: boolean;
}

export const SKILLS_METADATA: SkillMeta[] = [
  // ── Tier 1: Always-on ──────────────────────────────────────────────────────
  {
    id: "eri-bds-reference",
    name: "ERI Brand Design System Reference",
    description: "Portable ERI brand reference. Use when building or updating any ERI product (web apps, presentations, visual assets).",
    tier: 1,
    category: "brand",
    version: "3.11.0",
    readWhen: "Before any ERI product work — web apps, presentations, visual assets.",
    hasReferences: true,
  },
  {
    id: "eri-human-ai-collaboration",
    name: "Exponential Human-AI Collaboration",
    description: "Collaboration principles for ERI human-AI work. Activates peer-colleague mode.",
    tier: 1,
    category: "process",
    version: "1.0.0",
    readWhen: "At the start of every ERI task where the quality of thinking matters.",
    hasReferences: false,
  },
  // ── Tier 2: Per-action gate ────────────────────────────────────────────────────────────────────────────
  {
    id: "eri-skill-creator",
    name: "ERI Skill Creator",
    description: "Full lifecycle governance for ERI skills: create, improve, register, and maintain the self-improving ERI skill ecosystem.",
    tier: 2,
    category: "process",
    version: "2.2.0",
    readWhen: "Before writing a single line of any eri- skill file. Before running the post-task reflection loop.",
    hasReferences: true,
  },
  {
    id: "eri-earth-aligned-agent",
    name: "Earth-aligned AI Agent",
    description: "Architecture, modes, pipeline lifecycle, scoring, and known failure patterns for the Earth-aligned Agent subsystem.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "When working on any Earth-aligned agent task: adding a mode, modifying the diagnostic or report pipeline, changing scoring.",
    hasReferences: true,
  },
  {
    id: "eri-bds-site",
    name: "ERI Brand Design System Site",
    description: "Build or update the standalone ERI Brand Design System website.",
    tier: 2,
    category: "brand",
    version: "1.0.0",
    readWhen: "When asked to build, rebuild, update, or extend the ERI Brand Design System site.",
    hasReferences: false,
  },
  {
    id: "eri-trpc",
    name: "tRPC Router Patterns",
    description: "Canonical patterns for writing, structuring, and testing tRPC routers in the ERI codebase. Includes What Done Means checklist for procedures, canonical paginationSchema, and opportunistic remediation rules for pre-existing debt.",
    tier: 2,
    category: "platform",
    version: "2.2.0",
    readWhen: "Creating a new router file, adding a procedure, deciding between procedure types, writing middleware, or marking a procedure done.",
    hasReferences: false,
  },
  {
    id: "eri-database",
    name: "Database Design",
    description: "Best practices for designing, reviewing, and evolving relational database schemas in MySQL/TiDB + Drizzle.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Designing or reviewing a DB schema, writing migrations, adding indexes, planning multi-tenant data isolation.",
    hasReferences: true,
  },
  {
    id: "eri-widget",
    name: "Widget Component Standard",
    description: "Standard widget component design and implementation for the ERI Exponential Platform.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Creating a new data source or analytical widget, building a Widget Hub demo page, registering a widget.",
    hasReferences: true,
  },
  {
    id: "eri-user-management",
    name: "ERI User Management",
    description: "Design and implement the three-domain user management system used across ERI platform applications.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building or auditing ERI employee management, company workspaces, or workspace user features.",
    hasReferences: true,
  },
  {
    id: "eri-security",
    name: "Trust & Security",
    description: "Cyber security and data integrity best practices for SaaS web applications with public and authenticated surfaces.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building or auditing a Trust & Security page, implementing auth, enforcing workspace isolation.",
    hasReferences: true,
  },
  {
    id: "eri-rest-api",
    name: "REST API Creator",
    description: "Design and implement production-ready REST APIs on the ERI Platform stack. Includes What Done Means checklist for endpoints.",
    tier: 2,
    category: "platform",
    version: "2.2.0",
    readWhen: "Designing a new REST endpoint, adding external partner access, implementing API key auth, or marking an endpoint done.",
    hasReferences: true,
  },
  {
    id: "automation-and-scheduling",
    name: "Automation and Scheduling",
    description: "Read before building any automation, scheduled task, recurring workflow, bot, or monitoring system.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before building any automation, scheduled task, recurring workflow, bot, or 'if X then Y' system.",
    hasReferences: true,
  },
  {
    id: "persistent-computing",
    name: "Persistent Computing",
    description: "MUST read when user needs persistent services, Docker, fixed IP, background jobs, or heavy compute.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "When user needs persistent services, Docker, fixed IP, background jobs, or a reusable environment.",
    hasReferences: true,
  },
  {
    id: "imagegen",
    name: "ImageGen",
    description: "Visual deliverable routing and image generation/editing tasks.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before any image generation, editing, or visual deliverable task.",
    hasReferences: true,
  },
  {
    id: "skill-creator",
    name: "Skill Creator",
    description: "Guide for creating or updating skills that extend Manus via specialised knowledge and workflows.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before creating a new skill or modifying an existing SKILL.md file.",
    hasReferences: true,
  },
  // ── Tier 3: Reference ──────────────────────────────────────────────────────
  {
    id: "eri-exponential-framework",
    name: "ERI Exponential Framework",
    description: "Canonical knowledge base for the ERI Exponential Framework data model, CPR assessment methodology, and three-application architecture (CPR, Marketing EF app, Earth-aligned AI Agent).",
    tier: 3,
    category: "data",
    version: "1.0.0",
    readWhen: "Designing or extending the Exponential Framework data model, working on CPR assessment pipeline, adding cpr_action_templates or cpr_data_source_mappings, building Marketing EF pages, or working on Earth-aligned AI Agent framework cells.",
    hasReferences: true,
  },
  {
    id: "data-source-integration",
    name: "Data Source Integration",
    description: "End-to-end checklist for integrating a new external data source into the ERI platform: DB schema, server router, admin explorer, widget, workspace page, and all shared config files. Read this first. For the explorer page and widget steps specifically, also read eri-data-source-explorer. Includes known debt catalogue for 11 workspace shell pages and opportunistic migration rule.",
    tier: 3,
    category: "data",
    version: "1.1.0",
    readWhen: "Implementing a new data source integration end-to-end, or auditing an existing one for completeness across all surfaces.",
    hasReferences: false,
  },
  {
    id: "eri-data-source-explorer",
    name: "Data Source Explorer",
    description: "Deep implementation reference for the ERI data source explorer pattern: Browse + Compare tab, sector filter, checkbox selection, workspace wrapper, widget compact layout, and known pitfalls. The SBTi Data Explorer is the canonical reference — every other source must reach parity with it. Read data-source-integration first for the full integration checklist; read this skill when you reach the explorer page and widget steps. Version: 1.1.0",
    tier: 3,
    category: "data",
    version: "1.1.0",
    readWhen: "Implementing or upgrading a data source explorer page, Browse + Compare tab, widget, or workspace wrapper.",
    hasReferences: true,
  },
  {
    id: "eri-report-finder",
    name: "Corporate Report Finder",
    description: "Systematic methodology for finding, storing, and validating corporate reporting URLs.",
    tier: 3,
    category: "data",
    version: "1.0.0",
    readWhen: "Implementing or extending the corporate report discovery pipeline, auditing pipeline violations.",
    hasReferences: false,
  },

  {
    id: "eri-ueil-nav",
    name: "UEIL Inline Widget Navigation",
    description: "Pattern for adding per-row inline widget navigation to the UEIL Company Data Lookup table.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "Implementing or extending the click-a-source-row → view-widget-inline feature.",
    hasReferences: false,
  },
  {
    id: "eri-decision",
    name: "Decision Framework",
    description: "Framework for preventing tunnel vision when implementing solutions. Includes Generic Architecture Check (Hard Stop 6) with four-question paste format.",
    tier: 3,
    category: "process",
    version: "1.1.0",
    readWhen: "Starting any non-trivial implementation, when the user says 'think about this first', or before implementing any new feature to check for reusability.",
    hasReferences: false,
  },
  {
    id: "eri-code-quality",
    name: "Code Quality Gate",
    description: "Pre-implementation checklist (10 gates) for the eri-playbook-team codebase. Covers: no as-any, auth on writes, pagination, transactions, tests, no secrets, Drizzle destructure, frontend architecture (search-first + useTabState), content ownership, file placement and db.ts size.",
    tier: 3,
    category: "process",
    version: "2.2.0",
    readWhen: "Before writing any code in the eri-playbook-team project.",
    hasReferences: false,
  },
  {
    id: "manus-api",
    name: "Manus API",
    description: "Manage tasks, projects, and other data in Manus via API, build OAuth2 integrations.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building or troubleshooting integrations that call the Manus API or automate Manus agents.",
    hasReferences: false,
  },
  {
    id: "manus-config",
    name: "Manus Config",
    description: "Manage connectors, project instructions, shared files, and scheduled task execution.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "When enabling, inspecting, or modifying connectors; managing project-level config or scheduled tasks.",
    hasReferences: false,
  },
  {
    id: "music-prompter",
    name: "Music Prompter",
    description: "MUST read before entering generate mode for music tasks.",
    tier: 3,
    category: "process",
    version: "1.0.0",
    readWhen: "Before entering generate mode for any music generation task.",
    hasReferences: false,
  },
];

// ─── Filesystem helpers ──────────────────────────────────────────────────────
const SKILLS_BASE_DIR = "/home/ubuntu/skills";

function readSkillContent(skillId: string): string | null {
  const skillPath = path.join(SKILLS_BASE_DIR, skillId, "SKILL.md");
  try {
    if (!fs.existsSync(skillPath)) return null;
    return fs.readFileSync(skillPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Parse YAML frontmatter from a SKILL.md file.
 * Returns only the fields we trust from frontmatter: name, description, version.
 * Tier, category, readWhen, and hasReferences are governance decisions — they stay
 * hardcoded in SKILLS_METADATA and are never overridden by frontmatter.
 *
 * Handles both flat quoted strings and block scalars (>).
 */
function parseFrontmatterMeta(content: string): { name?: string; description?: string; version?: string } {
  // Extract the frontmatter block (between first --- and second ---)
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = match[1];

  // Parse name (flat string only)
  const nameMatch = fm.match(/^name:\s*["']?([^"'\n]+)["']?/m);
  const name = nameMatch ? nameMatch[1].trim() : undefined;

  // Parse description — handles quoted strings and block scalars
  let description: string | undefined;
  const descQuotedMatch = fm.match(/^description:\s*"([^"]*)"/m);
  if (descQuotedMatch) {
    description = descQuotedMatch[1].trim();
  } else {
    // Block scalar (>) or unquoted — take first non-empty line after the key
    const descBlockMatch = fm.match(/^description:\s*>?\s*\n(([\s\S]*?)(?=\n\S|$))/);
    if (descBlockMatch) {
      // Collapse the block scalar into a single line
      description = descBlockMatch[1]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(" ")
        .trim();
    } else {
      const descInlineMatch = fm.match(/^description:\s*(.+)/m);
      if (descInlineMatch) description = descInlineMatch[1].trim();
    }
  }

  // Parse metadata.version (nested block)
  const versionMatch = fm.match(/^metadata:\s*\n\s+version:\s*["']?([\d.]+)["']?/m);
  const version = versionMatch ? versionMatch[1].trim() : undefined;

  return { name, description, version };
}

/**
 * Merge live frontmatter values over the hardcoded SKILLS_METADATA entry.
 * name and description always come from the filesystem if the file exists.
 * version comes from metadata.version in frontmatter if present; otherwise
 * falls back to the hardcoded value.
 * Tier, category, readWhen, hasReferences are always from SKILLS_METADATA.
 */
function enrichWithFrontmatter(meta: SkillMeta): SkillMeta {
  const content = readSkillContent(meta.id);
  if (!content) return meta;
  const fm = parseFrontmatterMeta(content);
  return {
    ...meta,
    name: fm.name ?? meta.name,
    description: fm.description ?? meta.description,
    version: fm.version ?? meta.version,
  };
}

// ─── Router ───────────────────────────────────────────────────────────────────────
export const skillsRouter = router({
  /**
   * List all skills with their metadata.
   * name, description, and version are read live from SKILL.md frontmatter.
   * tier, category, readWhen, hasReferences come from SKILLS_METADATA (governance decisions).
   * Public.
   */
  list: publicProcedure.query(() => {
    return SKILLS_METADATA.map(enrichWithFrontmatter);
  }),

  /**
   * Get a single skill with its metadata and full improvement log.
   * Returns null if the skill ID is not in SKILLS_METADATA.
   * Public.
   */
  get: publicProcedure
    .input(z.object({ id: z.string().min(1).max(64) }))
    .query(async ({ input }) => {
      const raw = SKILLS_METADATA.find((s) => s.id === input.id);
      if (!raw) return null;
      const meta = enrichWithFrontmatter(raw);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const improvements = await db
        .select()
        .from(skillImprovements)
        .where(eq(skillImprovements.skillId, input.id))
        .orderBy(desc(skillImprovements.loggedAt))
        .limit(500);
      return { ...meta, improvements };
    }),

  /**
   * Read the raw SKILL.md content from the filesystem.
   * Returns null if the file does not exist.
   * Public.
   */
  getContent: publicProcedure
    .input(z.object({ id: z.string().min(1).max(64) }))
    .query(({ input }) => {
      const meta = SKILLS_METADATA.find((s) => s.id === input.id);
      if (!meta) return null;
      const content = readSkillContent(input.id);
      return content ?? null;
    }),

  /**
   * Log an improvement for a skill.
   * Append-only — never deletes entries.
   * Admin-only.
   */
  logImprovement: adminProcedure
    .input(
      z.object({
        skillId: z.string().min(1).max(64),
        version: z.string().min(1).max(16),
        summary: z.string().min(1).max(2000),
        taskContext: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const meta = SKILLS_METADATA.find((s) => s.id === input.skillId);
      if (!meta) {
        throw new TRPCError({ code: "NOT_FOUND", message: `Skill '${input.skillId}' not found in SKILLS_METADATA` });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(skillImprovements).values({
        skillId: input.skillId,
        version: input.version,
        summary: input.summary,
        taskContext: input.taskContext ?? null,
      });
      return { success: true };
    }),

  // ─── Project Instructions ──────────────────────────────────────────────────────────

  /**
   * Load the saved preamble for a given project ID.
   * Protected — any authenticated user can read their project's preamble.
   * Returns null if no preamble has been saved yet.
   */
  getProjectInstructions: protectedProcedure
    .input(z.object({ projectId: z.string().min(1).max(128) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const [row] = await db
        .select()
        .from(projectInstructions)
        .where(eq(projectInstructions.projectId, input.projectId))
        .limit(1);
      return row ?? null;
    }),

  /**
   * Save (upsert) the preamble for a given project ID.
   * Protected — any authenticated user can save their project's preamble.
   */
  saveProjectInstructions: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1).max(128),
        preamble: z.string().max(8000),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db
        .insert(projectInstructions)
        .values({ projectId: input.projectId, preamble: input.preamble })
        .onDuplicateKeyUpdate({ set: { preamble: input.preamble } });
      return { success: true };
    }),

  /**
   * Save a version snapshot of the generated project instructions.
   * Called when the user clicks "Mark as Applied".
   * Protected.
   */
  saveInstructionsVersion: protectedProcedure
    .input(
      z.object({
        version: z.string().min(1).max(20),
        generatedSnapshot: z.string().min(1).max(32000),
        changeNote: z.string().max(500).optional(),
        charCount: z.number().int().min(0).optional(),
        budgetPct: z.number().int().min(0).max(200).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(projectInstructionsVersions).values({
        version: input.version,
        generatedSnapshot: input.generatedSnapshot,
        changeNote: input.changeNote ?? null,
        charCount: input.charCount ?? null,
        budgetPct: input.budgetPct ?? null,
      });
      return { success: true };
    }),

  /**
   * List all saved version snapshots, newest first.
   * Protected.
   */
  listInstructionsVersions: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    const rows = await db
      .select()
      .from(projectInstructionsVersions)
      .orderBy(desc(projectInstructionsVersions.appliedAt))
      .limit(50);
    return rows;
  }),

  /**
   * Save an audit finding from an agent-run audit.
   * Protected.
   */
  saveInstructionsAudit: protectedProcedure
    .input(
      z.object({
        charCount: z.number().int().min(0).optional(),
        budgetPct: z.number().int().min(0).max(200).optional(),
        sectionsJson: z.string().min(2).max(32000),
        discrepanciesJson: z.string().max(16000).optional(),
        summary: z.string().max(4000).optional(),
        agentNote: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db.insert(projectInstructionsAudits).values({
        charCount: input.charCount ?? null,
        budgetPct: input.budgetPct ?? null,
        sectionsJson: input.sectionsJson,
        discrepanciesJson: input.discrepanciesJson ?? null,
        summary: input.summary ?? null,
        agentNote: input.agentNote ?? null,
      });
      return { success: true };
    }),

  /**
   * List all audit findings, newest first.
   * Protected.
   */
  listInstructionsAudits: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
    const rows = await db
      .select()
      .from(projectInstructionsAudits)
      .orderBy(desc(projectInstructionsAudits.auditedAt))
      .limit(20);
    return rows;
  }),

  /**
   * Publish a version snapshot to the public /api/project-instructions/latest endpoint.
   * Sets publishedAt on the given version row. Admin only.
   */
  publishInstructions: protectedProcedure
    .input(z.object({ versionId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db
        .update(projectInstructionsVersions)
        .set({ publishedAt: new Date() })
        .where(eq(projectInstructionsVersions.id, input.versionId));
      return { success: true };
    }),

  /**
   * Agent-bridge: sync the live project instructions text from an agent's context.
   *
   * The Manus platform has no API to read project instructions — only a Manus agent
   * can read them from its <project_instructions> context block. This mutation is the
   * bridge: the agent reads the block and writes the text here so the web app can
   * display it. One row only (id=1), always upserted.
   *
   * HOW TO TRIGGER: On the Project Instructions page, click "Sync from agent" to copy
   * a prompt. Paste it into a new Manus task in this project. The agent will call this
   * mutation automatically.
   *
   * Admin-only — prevents arbitrary text injection.
   */
  syncCurrentInstructions: adminProcedure
    .input(
      z.object({
        instructionsText: z.string().min(1).max(32000),
        agentNote: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      await db
        .insert(currentInstructionsSync)
        .values({ id: 1, instructionsText: input.instructionsText, agentNote: input.agentNote ?? null })
        .onDuplicateKeyUpdate({ set: { instructionsText: input.instructionsText, syncedAt: new Date(), agentNote: input.agentNote ?? null } });
      return { success: true };
    }),

  /**
   * Get the agent-synced current project instructions text.
   * Public — the Current tab reads this to display the live instructions.
   * Returns null if no sync has been performed yet.
   */
  getCurrentInstructions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db
      .select()
      .from(currentInstructionsSync)
      .limit(1);
    return row ?? null;
  }),

  /**
   * Get the currently published project instructions snapshot.
   * Public — used by /api/project-instructions/latest endpoint.
   */
  getPublishedInstructions: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return null;
    const [row] = await db
      .select()
      .from(projectInstructionsVersions)
      .where(isNotNull(projectInstructionsVersions.publishedAt))
      .orderBy(desc(projectInstructionsVersions.publishedAt))
      .limit(1);
    return row ?? null;
  }),
});
