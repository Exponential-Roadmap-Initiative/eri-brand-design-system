/**
 * Seed script — inserts all known ERI skills into the skills table.
 * Run once after the schema migration: npx tsx scripts/seed-skills.mjs
 *
 * Uses onDuplicateKeyUpdate so it is safe to re-run (idempotent).
 *
 * Naming convention:
 *   - ERI-owned skills: eri-<domain> prefix
 *   - Manus platform skills: original name (no prefix)
 */

import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Import schema — use dynamic import to handle ESM
// Use tsx to run this script: npx tsx scripts/seed-skills.mjs
const { skills } = await import("../drizzle/schema.ts");

// ── Skill definitions ─────────────────────────────────────────────────────────
// tier: 1 = always-on, 2 = per-action gate, 3 = conditional

const SKILLS = [
  // ── Tier 1 — Always-on ──────────────────────────────────────────────────────
  {
    id: "eri-bds-reference",
    name: "ERI Brand Design System Reference",
    description: "Portable ERI brand reference. Covers colour tokens, typography, navigation tiers, header anatomy, hero layout rules, CTA/badge/footer standards, dark/light theme system, and critical rules (no Tailwind responsive classes in @eri/components source). Use when building or updating any ERI product.",
    tier: 1,
    version: "3.11.0",
    readWhen: "When building or updating any ERI product (web apps, presentations, visual assets).",
  },
  {
    id: "eri-human-ai-collaboration",
    name: "ERI Human-AI Collaboration",
    description: "Collaboration principles for ERI human-AI work. Activates peer-colleague mode: direct answers, named objections, calibrated confidence, no flattery. Use at the start of any ERI task where the quality of thinking matters.",
    tier: 1,
    version: "1.0.0",
    readWhen: "Every ERI task — activates peer-colleague mode and calibrated confidence.",
  },
  {
    id: "eri-skill-manager",
    name: "ERI Skill Manager",
    description: "Governs the full lifecycle of the ERI self-improving skill ecosystem: creating new skills, assigning tiers, running the post-task reflection loop, encoding failure guardrails, updating the BDS /skills registry, and managing project instructions within the 8,000-char budget. Replaces the built-in skill-creator for all ERI tasks.",
    tier: 1,
    version: "1.0.0",
    readWhen: "After completing any ERI task — run the post-task reflection loop and update skills as needed.",
  },

  // ── Tier 2 — Per-action gate ─────────────────────────────────────────────────
  {
    id: "eri-code-quality",
    name: "ERI Code Quality Gate",
    description: "Pre-implementation checklist (7 gates) for the ERI codebase. Prevents new technical debt. Run before writing any code. Covers: no as-any, no unauthenticated mutations, mandatory pagination, transactions for multi-write ops, tests for new routers, no hardcoded secrets, Drizzle array-destructure.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before writing any new code in an ERI project.",
  },
  {
    id: "eri-trpc",
    name: "ERI tRPC Router Patterns",
    description: "Canonical patterns for writing, structuring, and testing tRPC routers in the ERI codebase. Use when creating a new router file, adding a procedure, deciding between publicProcedure/protectedProcedure/adminProcedure, writing middleware, splitting an oversized router, or registering a new router.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before creating or modifying any tRPC router in an ERI project.",
  },
  {
    id: "eri-decision",
    name: "ERI Decision Framework",
    description: "Framework for preventing tunnel vision when implementing solutions. Use when starting any non-trivial implementation, the user says 'think about this first', or the user references this skill to present options before coding.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before starting any non-trivial implementation — present options first.",
  },

  // ── Tier 3 — Conditional ─────────────────────────────────────────────────────
  {
    id: "eri-data-source",
    name: "ERI Data Source Integration & Explorer",
    description: "Canonical playbook for integrating, replicating, and upgrading climate/ESG data sources in the ERI Exponential Platform. Covers the full lifecycle: database schema → server router → scheduler → shared config → admin explorer → widget → workspace page → Browse+Compare pattern. Use when adding a brand-new data source, upgrading an existing explorer, adding the Browse+Compare tab pattern, or auditing an existing source.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When adding, upgrading, or auditing a climate/ESG data source in the ERI Exponential Platform.",
  },
  {
    id: "eri-widget",
    name: "ERI Widget Component Standard",
    description: "Standard widget component design and implementation for the ERI Exponential Platform. Use when creating a new data source or analytical widget (Widget.tsx + Card.tsx), building a Widget Hub demo page, registering a widget in widgetRegistry.ts, wiring a widget into a workspace tab page, or auditing an existing widget.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When creating or auditing a widget component in the ERI Exponential Platform.",
  },
  {
    id: "eri-database",
    name: "ERI Database Design",
    description: "Database and data table design best practices for relational databases (MySQL/TiDB) used in TypeScript/Node.js applications with Drizzle ORM. Use for reviewing or designing database schemas, auditing table structure, evaluating nullable discipline, checking migration safety, identifying anti-patterns, enforcing naming conventions, and reviewing multi-tenancy row-level isolation.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When designing or reviewing database schemas in an ERI project.",
  },
  {
    id: "eri-security",
    name: "ERI Trust & Security",
    description: "Cyber security and data integrity best practices for SaaS web applications. Use for building or auditing a Trust & Security page, implementing authentication (OAuth + TOTP MFA + session management), enforcing workspace data isolation (multi-tenancy), hardening API security, setting up audit logging, and planning a security roadmap.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When implementing or auditing security features in an ERI web application.",
  },
  {
    id: "eri-rest-api",
    name: "ERI REST API Creator",
    description: "Design and implement production-ready REST APIs on the ERI Platform (Express + TypeScript + Drizzle + MySQL). Use when designing a new REST endpoint, adding external partner access to ERI data, implementing API key authentication, writing REST route files, designing response envelopes or error formats, or reviewing an existing REST API.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When designing or implementing a REST API endpoint on the ERI Platform.",
  },
  {
    id: "eri-earth-aligned-agent",
    name: "ERI Earth-Aligned Agent",
    description: "Architecture, modes, pipeline lifecycle, scoring model, known errors, and canonical file locations for the ERI Earth-aligned AI Agent subsystem. Use when working on any Earth-aligned agent task: adding a new mode, modifying the diagnostic or report pipeline, changing the scoring model, fixing a rendering bug, or debugging a job that stalls or returns wrong data.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When working on the Earth-aligned AI Agent subsystem in eri-playbook-team.",
  },
  {
    id: "eri-report-finder",
    name: "ERI Corporate Report Finder",
    description: "Systematic methodology for finding, storing, and validating corporate reporting URLs across five types (Annual, Sustainability, Transition, Biodiversity, Social). Covers the 5-tier discovery pipeline (ESEF, Klimatkollen, SRN, SERP, Perplexity).",
    tier: 3,
    version: "1.0.0",
    readWhen: "When implementing or extending the corporate report URL discovery pipeline.",
  },
  {
    id: "eri-ueil-nav",
    name: "ERI UEIL Inline Widget Navigation",
    description: "Pattern for adding per-row inline widget navigation to the UEIL Company Data Lookup table. Use when implementing the 'click a linked source row → view its widget inline' feature for any of the 14 data sources.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When implementing inline widget navigation in the UEIL Company Data Lookup table.",
  },
  {
    id: "eri-user-management",
    name: "ERI User Management",
    description: "Design and implement the three-domain user management system used across ERI platform applications: ERI employees, company workspaces, and workspace users. Use when building or auditing user management features including magic-link invites, role management, upgrade requests, OAuth domain auto-assign, and MFA enforcement.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When building or auditing user management features in an ERI project.",
  },
  {
    id: "eri-bds-site",
    name: "ERI Brand Design System Site",
    description: "Build or update the standalone ERI Brand Design System website from the brand package zip. Use when asked to build, rebuild, update, or extend the ERI Brand Design System site — including adding new logo variants, sections, or design tokens. Covers the full workflow: package inspection, asset upload, component porting, logo rendering fixes, and deployment.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When building or updating the ERI Brand Design System website.",
  },
  {
    id: "manus-api",
    name: "Manus API",
    description: "Manage tasks, projects, and other data in Manus via API, build OAuth2 third-party integrations, or create Manus tasks programmatically to build services or workflows that need agentic capabilities.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When integrating with the Manus API or building programmatic task creation.",
  },
  {
    id: "manus-config",
    name: "Manus Config",
    description: "Manage connectors (App, Custom API, Custom MCP), project instructions and shared files, and scheduled task execution with manus-config. Use when managing integrations, project-level configuration, or scheduled tasks.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When managing Manus connectors, project instructions, or scheduled tasks.",
  },
  {
    id: "automation-and-scheduling",
    name: "Automation & Scheduling",
    description: "MUST read before requests involving automated execution, recurring execution, background execution, event-triggered execution, bots, auto-updating systems, or ANY system that integrates with external APIs, synchronises data, handles webhooks, or requires background processes.",
    tier: 3,
    version: "1.0.0",
    readWhen: "Before building any automated, scheduled, or background-process system.",
  },
  {
    id: "persistent-computing",
    name: "Persistent Computing",
    description: "MUST read when user needs to run persistent services (automation scripts, game servers, self-hosted apps), or requires Docker, fixed IP, background jobs, heavy compute, or a reusable environment across sessions.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When deploying a resource-intensive or persistent service.",
  },
  {
    id: "imagegen",
    name: "Image Generation Routing",
    description: "Visual deliverable routing and image generation/editing tasks. Helps choose between Mermaid, Python plotting, static layout/code screenshots, web/app development, and AI image generation/editing.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When the task involves creating or editing visual assets.",
  },
  {
    id: "music-prompter",
    name: "Music Prompter",
    description: "MUST read before entering generate mode for music tasks. Covers prompt crafting framework, structure syntax, and multi-clip strategy.",
    tier: 3,
    version: "1.0.0",
    readWhen: "Before generating or editing music or audio content.",
  },
];

// ── Insert ────────────────────────────────────────────────────────────────────
console.log(`Seeding ${SKILLS.length} skills…`);
for (const skill of SKILLS) {
  await db
    .insert(skills)
    .values(skill)
    .onDuplicateKeyUpdate({
      set: {
        name: skill.name,
        description: skill.description,
        tier: skill.tier,
        version: skill.version,
        readWhen: skill.readWhen ?? null,
      },
    });
  console.log(`  ✓ ${skill.id}`);
}
console.log("\nDone.");
await connection.end();
