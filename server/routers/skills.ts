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
    name: "eri-bds-reference",
    description: "Portable ERI brand reference. Use when building or updating any ERI product (web apps, presentations, visual assets). Covers: pre-action checklist, colour tokens, typography (GDPR self-hosted WOFF2 only), navigation tiers, header anatomy (headerTheme prop, mobile two-row layout), hero layout rules (ERI_HERO_IMAGE_DEFAULT/TRUST/crocodileDecoupling), CTA/badge/footer standards, layout wrapper, Contact Us integration, dark/light theme system (CSS tokens, ThemeContext, FOLC script), overlay/nav d...",
    tier: 1,
    category: "brand",
    version: "3.11.0",
    readWhen: "Before any ERI product work — web apps, presentations, visual assets.",
    hasReferences: true,
  },
  {
    id: "eri-human-ai-collaboration",
    name: "eri-human-ai-collaboration",
    description: "Collaboration principles for ERI human-AI work. Activates peer-colleague mode: direct answers, named objections, calibrated confidence, no flattery. Includes the Decision Framework (merged from eri-decision): stop-and-present-options before non-trivial implementation, 2-3 option template, wait-for-user-choice hard stop, and Generic Architecture Check. Version: 2.0.0",
    tier: 1,
    category: "process",
    version: "2.0.0",
    readWhen: "At the start of every ERI task where the quality of thinking matters.",
    hasReferences: false,
  },
  // ── Tier 2: Per-action gate ────────────────────────────────────────────────────────────────────────────
  {
    id: "eri-skill-creator",
    name: "eri-skill-creator",
    description: "Full lifecycle governance for ERI skills. MUST read before writing any eri- skill — Tier 2 per-action gate. Use whenever: creating or improving an ERI skill, running the post-task reflection loop, a workflow keeps causing repeated mistakes, a user says 'turn this into a skill' or 'improve this skill', optimising a skill description, updating the BDS /skills improvement log, managing the project instructions budget, or registering a skill. HARD STOP: do not write SKILL.md content until Steps 1...",
    tier: 2,
    category: "process",
    version: '2.4.0',
    readWhen: 'Before writing a single line of any eri- skill file. Before running the post-task reflection loop.',
    hasReferences: true,
  },
  {
    id: "eri-earth-aligned-agent",
    name: "eri-earth-aligned-agent",
    description: ">-",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "When working on any Earth-aligned agent task: adding a mode, modifying the diagnostic or report pipeline, changing scoring.",
    hasReferences: true,
  },
  {
    id: "eri-bds-site",
    name: "eri-bds-site",
    description: "Build or update the standalone ERI Brand Design System website from the brand package zip. Use when asked to build, rebuild, update, or extend the ERI Brand Design System site — including adding new logo variants, sections, or design tokens. Covers the full workflow: package inspection, asset upload, component porting, logo rendering fixes, and deployment.",
    tier: 2,
    category: "brand",
    version: "1.0.0",
    readWhen: "When asked to build, rebuild, update, or extend the ERI Brand Design System site.",
    hasReferences: false,
  },
  {
    id: "eri-trpc",
    name: "eri-trpc",
    description: "Canonical patterns for writing, structuring, and testing tRPC routers in the ERI eri-playbook-team codebase. Includes the 10-gate Code Quality pre-implementation checklist (merged from eri-code-quality). Use when: creating a new router file, adding a procedure, deciding between procedure types, writing middleware, splitting a router, registering a new router, writing vitest tests, or running the pre-implementation quality gate before writing any code. Version: 3.0.0",
    tier: 2,
    category: "platform",
    version: "3.0.0",
    readWhen: "Creating a new router file, adding a procedure, deciding between procedure types, writing middleware, or running the pre-implementation quality gate before writing any code.",
    hasReferences: false,
  },
  {
    id: "eri-database",
    name: "eri-database",
    description: ">",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Designing or reviewing a DB schema, writing migrations, adding indexes, planning multi-tenant data isolation.",
    hasReferences: true,
  },
  {
    id: "eri-widget",
    name: "eri-widget",
    description: "Standard widget component design and implementation for the ERI Exponential Platform. Use when: creating a new data source or analytical widget (Widget.tsx + Card.tsx), building a Widget Hub demo page, registering a widget in widgetRegistry.ts, wiring a widget into a workspace tab page, choosing between live DB / static registry / external API data paths, or auditing an existing widget for conformance with the DataWidgetCard pattern.",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Creating a new data source or analytical widget, building a Widget Hub demo page, registering a widget.",
    hasReferences: true,
  },
  {
    id: "eri-user-management",
    name: "eri-user-management",
    description: "Design and implement the three-domain user management system used across ERI platform applications (React + tRPC + Drizzle + MySQL): (1) ERI employees — list, promote/demote admin role, delete, generate invite emails; (2) company workspaces — create with slug/domain uniqueness, update settings, manage credits, soft/hard delete with name-confirmation guard; (3) workspace users — magic-link invites, role management (viewer/analyst/admin), upgrade requests, member removal, OAuth domain auto-assi...",
    tier: 2,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building or auditing ERI employee management, company workspaces, or workspace user features.",
    hasReferences: true,
  },
  {
    id: "eri-security",
    name: "eri-security",
    description: "Cyber security and data integrity best practices for SaaS web applications. Covers Trust & Security page, auth (OAuth + TOTP MFA + session management), workspace data isolation, API security (rate limiting, CSP, input validation), audit logging, vulnerability management, and security roadmap. Demoted to Tier 3 — only read when the task explicitly involves security architecture.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building a Trust & Security page from scratch, implementing auth or MFA, auditing workspace isolation, or conducting a security review.",
    hasReferences: true,
  },
  {
    id: "eri-rest-api",
    name: "eri-rest-api",
    description: "Design and implement production-ready REST APIs on the ERI Platform (Express + TypeScript + Drizzle + MySQL). Use when: designing a new REST endpoint or API surface, adding external partner access to ERI data, implementing API key authentication, writing REST route files, designing response envelopes or error formats, reviewing an existing REST API for correctness and security, building the admin UI surface for API management, or building the public API documentation page. Covers the full lif...",
    tier: 2,
    category: "platform",
    version: "2.2.0",
    readWhen: "Designing a new REST endpoint, adding external partner access, implementing API key auth, or marking an endpoint done.",
    hasReferences: true,
  },
  {
    id: "automation-and-scheduling",
    name: "automation-and-scheduling",
    description: "MUST read before requests involving automated execution, recurring execution, background execution, event-triggered execution, bot/agent execution, auto-updating systems, or ANY system that integrates with external APIs, synchronizes data, handles webhooks, or requires background processes — even if the primary ask is a website, web app, or bot. Use it to choose the right implementation approach before building.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before building any automation, scheduled task, recurring workflow, bot, or 'if X then Y' system.",
    hasReferences: true,
  },
  {
    id: "persistent-computing",
    name: "persistent-computing",
    description: "MUST read when user needs to run persistent services that WebDev or the default sandbox may not support (automation scripts, game servers, self-hosted open-source apps), or requires Docker, fixed IP, background jobs, heavy compute, or a reusable environment across sessions. MUST also read before deploying a resource-intensive service to an attached persistent VM. Guides persistent computing solutions vs sandbox vs WebDev. Demoted to Tier 3 — only read when persistent infrastructure is explicitly required.",
    tier: 3,
    category: "process",
    version: "1.0.0",
    readWhen: "User explicitly needs Docker, fixed IP, persistent background services, heavy compute, or a reusable VM environment across sessions.",
    hasReferences: true,
  },
  {
    id: "imagegen",
    name: "imagegen",
    description: "Use for visual deliverable routing and image generation/editing tasks, including new images, image edits, image upscaling/restoration/enhancement, UI mockups, diagrams, infographics, posters, icons, logos, charts, visual assets, and ambiguous visual requests. Helps choose between Mermaid, Python plotting, static layout/code screenshots, web/app development, and AI image generation/editing.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before any image generation, editing, or visual deliverable task.",
    hasReferences: true,
  },
  {
    id: "skill-creator",
    name: "skill-creator",
    description: "Guide for creating or updating skills that extend Manus via specialized knowledge, workflows, or tool integrations. For any modification or improvement request, MUST first read this skill and follow its update workflow instead of editing files directly.",
    tier: 2,
    category: "process",
    version: "1.0.0",
    readWhen: "Before creating a new skill or modifying an existing SKILL.md file.",
    hasReferences: true,
  },
  // ── Tier 3: Reference ──────────────────────────────────────────────────────
  {
    id: "eri-exponential-framework",
    name: "eri-exponential-framework",
    description: "Canonical knowledge base for the ERI Exponential Framework data model, CPR data pipeline, and three-application architecture (CPR tool, Marketing EF app, Earth-aligned AI Agent). Use whenever: designing or extending the Exponential Framework data model, working on the CPR evidence pipeline, adding or updating cpr_action_templates or cpr_data_source_mappings, building the Marketing EF application pages, working on the Earth-aligned AI Agent framework cells, reasoning about primary vs secondary...",
    tier: 3,
    category: "data",
    version: "1.0.0",
    readWhen: "Designing or extending the Exponential Framework data model, working on CPR assessment pipeline, adding cpr_action_templates or cpr_data_source_mappings, building Marketing EF pages, or working on Earth-aligned AI Agent framework cells.",
    hasReferences: true,
  },
  {
    id: "data-source-integration",
    name: "data-source-integration",
    description: ">",
    tier: 3,
    category: "data",
    version: "1.1.0",
    readWhen: "Implementing a new data source integration end-to-end, or auditing an existing one for completeness across all surfaces.",
    hasReferences: false,
  },
  {
    id: "eri-data-source-explorer",
    name: "eri-data-source-explorer",
    description: "Deep implementation reference for the ERI data source explorer pattern: Browse + Compare tab, sector filter, checkbox selection, workspace wrapper, widget compact layout, and known pitfalls. The SBTi Data Explorer is the canonical reference — every other source must reach parity with it. Read data-source-integration first for the full integration checklist across all surfaces; read this skill when you reach the explorer page and widget steps. Version: 1.1.0",
    tier: 3,
    category: "data",
    version: "1.1.0",
    readWhen: "Implementing or upgrading a data source explorer page, Browse + Compare tab, widget, or workspace wrapper.",
    hasReferences: true,
  },
  {
    id: "eri-report-finder",
    name: "eri-report-finder",
    description: "Systematic methodology for finding, storing, and validating corporate reporting URLs across five types (Annual, Sustainability, Transition, Biodiversity, Social). Use for: implementing or extending the integrated 5-tier discovery pipeline (ESEF, Klimatkollen, SRN, SERP, Perplexity), adding new data source tiers, auditing pipeline violations, running coverage gap analysis across 29 ERI members, updating the corporateReportUrls or corporateReportCompanies schema, or debugging slot-key conflicts...",
    tier: 3,
    category: "data",
    version: "1.0.0",
    readWhen: "Implementing or extending the corporate report discovery pipeline, auditing pipeline violations.",
    hasReferences: false,
  },
  {
    id: "eri-pdf-pipeline",
    name: "eri-pdf-pipeline",
    description: "PDF ingestion, extraction, storage, and multi-consumer access patterns for ERI full-stack applications. Use whenever: designing or modifying how corporate reports (annual, sustainability, transition plan) are fetched, parsed, cached, or served to consumers; deciding between parser options (unpdf vs file_url vs third-party); implementing keyword-based page selection for long documents; designing a two-pass extract-then-classify pipeline; building a document registry or extract store; enabling ...",
    tier: 3,
    category: "data",
    version: "2.0.0",
    readWhen: "When designing or modifying how corporate reports are fetched, parsed, page-selected, extracted, classified, cached, or queried across any ERI application.",
    hasReferences: true,
  },

  // RETIRED: eri-ueil-nav merged into eri-data-source-explorer v1.2.0 (2026-06-10)
  // RETIRED: eri-decision merged into eri-human-ai-collaboration v2.0.0 (2026-06-10)
  // RETIRED: eri-code-quality merged into eri-trpc v3.0.0 (2026-06-10)
  {
    id: "manus-api",
    name: "manus-api",
    description: "Manage tasks, projects, and other data in Manus via API, build OAuth2 third-party integrations, or create Manus tasks programmatically to build services or workflows that need agentic capabilities.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "Building or troubleshooting integrations that call the Manus API or automate Manus agents.",
    hasReferences: false,
  },
  {
    id: "manus-config",
    name: "manus-config",
    description: "Manage connectors (App, Custom API, Custom MCP), project instructions and shared files, and scheduled task execution with manus-config. Use when the user asks to enable, inspect, or modify integrations; manage project-level configuration or shared project files; or create, update, inspect, pause, expire, or troubleshoot scheduled tasks using cron, intervals, connector UIDs, or run-as-new behavior.",
    tier: 3,
    category: "platform",
    version: "1.0.0",
    readWhen: "When enabling, inspecting, or modifying connectors; managing project-level config or scheduled tasks.",
    hasReferences: false,
  },
  {
    id: "music-prompter",
    name: "music-prompter",
    description: "MUST read this skill BEFORE entering generate mode for music tasks. Covers prompt crafting framework, structure syntax, and multi-clip strategy.",
    tier: 3,
    category: "process",
    version: "1.0.0",
    readWhen: "Before entering generate mode for any music generation task.",
    hasReferences: false,
  },
/* SKILLS_END */
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

  /**
   * Agent-bridge: register a new skill in SKILLS_METADATA.
   *
   * Agents in non-BDS tasks cannot edit skills.ts directly. This mutation is the
   * bridge: the agent (or user via the Skills page form) provides the skill metadata
   * and this procedure appends a new entry to the SKILLS_METADATA array in this file.
   *
   * The mutation writes the new entry as a TypeScript object literal appended before
   * the closing `];` of the SKILLS_METADATA array. A server restart is required for
   * the change to take effect in the running process.
   *
   * Admin-only — prevents arbitrary registry manipulation.
   */
  registerSkill: adminProcedure
    .input(
      z.object({
        id: z.string().min(2).max(64).regex(/^[a-z][a-z0-9-]*$/, "Must be lowercase kebab-case"),
        name: z.string().min(2).max(120),
        description: z.string().min(10).max(1000),
        tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        category: z.enum(["brand", "development", "data", "process", "platform"]),
        readWhen: z.string().min(5).max(300),
        hasReferences: z.boolean(),
        version: z.string().min(1).max(20).regex(/^\d+\.\d+\.\d+$/, "Must be semver e.g. 1.0.0"),
      })
    )
    .mutation(async ({ input }) => {
      // Reject if the skill ID already exists
      const existing = SKILLS_METADATA.find((s) => s.id === input.id);
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Skill '${input.id}' is already registered in SKILLS_METADATA. To update it, edit skills.ts directly.`,
        });
      }

      // Build the new entry as a formatted TypeScript object literal
      const tierComment =
        input.tier === 1 ? "Tier 1: Always-on" :
        input.tier === 2 ? "Tier 2: Per-action gate" :
        "Tier 3: Conditional";

      const newEntry = [
        `  // ── ${tierComment} (registered via agent-bridge ${new Date().toISOString().slice(0, 10)}) ──`,
        `  {`,
        `    id: "${input.id}",`,
        `    name: "${input.name}",`,
        `    description: "${input.description.replace(/"/g, "'")}",`,
        `    tier: ${input.tier},`,
        `    category: "${input.category}",`,
        `    version: "${input.version}",`,
        `    readWhen: "${input.readWhen.replace(/"/g, "'")}",`,
        `    hasReferences: ${input.hasReferences},`,
        `  },`,
      ].join("\n");

      // Read the current file, insert before the unique end-of-array marker
      // import.meta.dirname resolves to server/routers/ at runtime
      const filePath = path.resolve(import.meta.dirname, "skills.ts");
      const source = fs.readFileSync(filePath, "utf-8");
      const insertMarker = "/* SKILLS_END */";
      const markerIdx = source.lastIndexOf(insertMarker);
      if (markerIdx === -1) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not locate SKILLS_METADATA closing marker in skills.ts",
        });
      }

      const updated = source.slice(0, markerIdx) + newEntry + "\n" + source.slice(markerIdx);
      fs.writeFileSync(filePath, updated, "utf-8");

      return {
        success: true,
        message: `Skill '${input.id}' appended to SKILLS_METADATA. Restart the dev server for the change to take effect.`,
      };
    }),

  /**
   * Agent-bridge: sync SKILLS_METADATA from SKILL.md frontmatters on the filesystem.
   *
   * Does two things in one pass:
   *   1. Updates existing entries — version, name, description from frontmatter.
   *      Fields left unchanged: tier, category, readWhen, hasReferences.
   *   2. Auto-registers new skills — any SKILL.md on the filesystem whose id is not
   *      yet in SKILLS_METADATA is appended as a new entry. Tier defaults to 3,
   *      category defaults to 'process'. The user should edit skills.ts to correct
   *      these after registration.
   *
   * Returns a diff summary of updates and a list of newly registered skills.
   *
   * Admin-only — prevents arbitrary registry manipulation.
   */
  syncMetadataFromFiles: adminProcedure.mutation(async () => {
    const skillsDir = path.resolve("/home/ubuntu/skills");
    const filePath = path.resolve(import.meta.dirname, "skills.ts");
    let source = fs.readFileSync(filePath, "utf-8");

    type Change = { id: string; field: string; from: string; to: string };
    const changes: Change[] = [];
    const registered: string[] = [];
    let updatedSource = source;

    // ── Helper: parse a single YAML frontmatter field ─────────────────────────
    const parseFmField = (fm: string, field: string): string | null => {
      const re = new RegExp(`^${field}:\s*(.+)$`, "m");
      const m = fm.match(re);
      if (!m) return null;
      return m[1].trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");
    };

    // ── Pass 1: update existing entries ───────────────────────────────────────
    for (const skill of SKILLS_METADATA) {
      const skillMdPath = path.join(skillsDir, skill.id, "SKILL.md");
      if (!fs.existsSync(skillMdPath)) continue;

      const content = fs.readFileSync(skillMdPath, "utf-8");
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!fmMatch) continue;
      const fm = fmMatch[1];

      const fmVersion = parseFmField(fm, "version");
      const fmName = parseFmField(fm, "name");
      const fmDescription = parseFmField(fm, "description");

      const replaceField = (field: string, oldVal: string, newVal: string) => {
        const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(
          `(id: "${skill.id}"[\\s\\S]*?${field}: ")${escaped}(")`,
          "m"
        );
        if (re.test(updatedSource)) {
          updatedSource = updatedSource.replace(re, `$1${newVal}$2`);
          changes.push({ id: skill.id, field, from: oldVal, to: newVal });
        }
      };

      if (fmVersion && fmVersion !== skill.version) {
        replaceField("version", skill.version, fmVersion);
      }
      if (fmName && fmName !== skill.name) {
        replaceField("name", skill.name, fmName);
      }
      if (fmDescription && fmDescription !== skill.description) {
        const truncated = fmDescription.length > 500 ? fmDescription.slice(0, 497) + "..." : fmDescription;
        if (truncated !== skill.description) {
          replaceField("description", skill.description, truncated.replace(/"/g, "'"));
        }
      }
    }

    // ── Pass 2: auto-register new skills ──────────────────────────────────────
    const registeredIds = new Set(SKILLS_METADATA.map((s) => s.id));

    // Scan all subdirectories of /home/ubuntu/skills/ for SKILL.md files
    let skillDirs: string[] = [];
    try {
      skillDirs = fs.readdirSync(skillsDir).filter((d) => {
        // Skip archive and hidden directories
        if (d.startsWith("_") || d.startsWith(".")) return false;
        const full = path.join(skillsDir, d);
        return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, "SKILL.md"));
      });
    } catch {
      skillDirs = [];
    }

    for (const dirName of skillDirs) {
      if (registeredIds.has(dirName)) continue; // already in SKILLS_METADATA

      const skillMdPath = path.join(skillsDir, dirName, "SKILL.md");
      const content = fs.readFileSync(skillMdPath, "utf-8");
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

      // Extract what we can from frontmatter; fall back to sensible defaults
      const fm = fmMatch ? fmMatch[1] : "";
      const fmName = parseFmField(fm, "name") ?? dirName;
      const fmVersion = parseFmField(fm, "version") ?? "1.0.0";
      const fmDescription = parseFmField(fm, "description") ?? `${fmName} skill.`;
      const fmTierRaw = parseFmField(fm, "tier");
      const fmTier = fmTierRaw === "1" ? 1 : fmTierRaw === "2" ? 2 : 3;
      const fmCategory = parseFmField(fm, "category") ?? "process";
      const fmReadWhen = parseFmField(fm, "readWhen") ?? `When working on ${fmName}-related tasks.`;
      const fmHasReferences = fs.existsSync(path.join(skillsDir, dirName, "references"));

      const descTruncated = fmDescription.length > 500
        ? fmDescription.slice(0, 497) + "..."
        : fmDescription;

      const newEntry = [
        `  // ── Auto-registered by syncMetadataFromFiles on ${new Date().toISOString().slice(0, 10)} ──`,
        `  {`,
        `    id: "${dirName}",`,
        `    name: "${fmName.replace(/"/g, "'")}",`,
        `    description: "${descTruncated.replace(/"/g, "'")}",`,
        `    tier: ${fmTier},`,
        `    category: "${fmCategory}",`,
        `    version: "${fmVersion}",`,
        `    readWhen: "${fmReadWhen.replace(/"/g, "'")}",`,
        `    hasReferences: ${fmHasReferences},`,
        `  },`,
      ].join("\n");

      // Insert before the unique end-of-array marker comment
      const markerIdx = updatedSource.lastIndexOf("/* SKILLS_END */");
      if (markerIdx !== -1) {
        updatedSource = updatedSource.slice(0, markerIdx) + newEntry + "\n" + updatedSource.slice(markerIdx);
        registered.push(dirName);
      }
    }

    // ── Write back if anything changed ────────────────────────────────────────
    if (changes.length > 0 || registered.length > 0) {
      fs.writeFileSync(filePath, updatedSource, "utf-8");
    }

    const totalActions = changes.length + registered.length;
    return {
      success: true,
      changesCount: changes.length,
      registeredCount: registered.length,
      changes,
      registered,
      message: totalActions === 0
        ? "SKILLS_METADATA is already in sync with the skill files."
        : [
            changes.length > 0 ? `Updated ${changes.length} field(s) in existing entries.` : "",
            registered.length > 0 ? `Auto-registered ${registered.length} new skill(s): ${registered.join(", ")}.` : "",
            "Restart the dev server for changes to take effect.",
          ].filter(Boolean).join(" "),
    };
  }),
});
