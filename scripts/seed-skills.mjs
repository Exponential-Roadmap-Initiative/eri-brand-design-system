/**
 * Seed script — inserts all known ERI skills into the skills table.
 * Run once after the schema migration: node scripts/seed-skills.mjs
 *
 * Uses onDuplicateKeyUpdate so it is safe to re-run (idempotent).
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
    id: "exponential-human-ai-collaboration",
    name: "Exponential Human-AI Collaboration",
    description: "Collaboration principles for ERI human-AI work. Activates peer-colleague mode: direct answers, named objections, calibrated confidence, no flattery. Use at the start of any ERI task where the quality of thinking matters.",
    tier: 1,
    version: "1.0.0",
    readWhen: "Every ERI task — activates peer-colleague mode and calibrated confidence.",
  },
  {
    id: "eri-bds-reference",
    name: "ERI Brand Design System Reference",
    description: "Portable ERI brand reference. Covers colour tokens, typography, navigation tiers, header anatomy, hero layout rules, CTA/badge/footer standards, dark/light theme system, and critical rules (no Tailwind responsive classes in @eri/components source). Use when building or updating any ERI product.",
    tier: 1,
    version: "3.11.0",
    readWhen: "When building or updating any ERI product (web apps, presentations, visual assets).",
  },
  {
    id: "skill-creator",
    name: "Skill Creator",
    description: "Guide for creating or updating skills that extend Manus via specialised knowledge, workflows, and tool integrations. Every task is a skill improvement opportunity — treat failures as the primary input to the improvement loop.",
    tier: 1,
    version: "1.0.0",
    readWhen: "After completing any task — review whether skills used need updating.",
  },

  // ── Tier 2 — Per-action gate ─────────────────────────────────────────────────
  {
    id: "code-quality-gate",
    name: "Code Quality Gate",
    description: "Pre-implementation checklist (7 gates) for the ERI codebase. Prevents new technical debt. Run before writing any code. Covers: no as-any, no unauthenticated mutations, mandatory pagination, transactions for multi-write ops, tests for new routers, no hardcoded secrets, Drizzle array-destructure.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before writing any new code in an ERI project.",
  },
  {
    id: "trpc-router-patterns",
    name: "tRPC Router Patterns",
    description: "Canonical patterns for writing, structuring, and testing tRPC routers in the ERI codebase. Use when creating a new router file, adding a procedure, deciding between publicProcedure/protectedProcedure/adminProcedure, splitting an oversized router, or writing a vitest test.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before creating or editing any tRPC router file.",
  },
  {
    id: "decision-framework",
    name: "Decision Framework",
    description: "Framework for preventing tunnel vision when implementing solutions. Use when starting any non-trivial implementation, when the user says 'think about this first', or to present options before coding.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before starting any non-trivial implementation — present options first.",
  },
  {
    id: "database-design",
    name: "Database Design",
    description: "Database and data table design best practices for relational databases (MySQL/TiDB) with Drizzle ORM. Use for reviewing or designing schemas, auditing table structure, checking migration safety, identifying anti-patterns, and enforcing naming conventions.",
    tier: 2,
    version: "1.0.0",
    readWhen: "Before designing or modifying any database schema.",
  },

  // ── Tier 3 — Conditional ─────────────────────────────────────────────────────
  {
    id: "data-source-explorer",
    name: "Data Source Explorer",
    description: "Replication playbook for adding or upgrading a climate/ESG data source in the ERI Exponential Framework. Use when implementing a new data source explorer page, upgrading an existing explorer, adding a widget tab, or auditing widget data coverage.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When adding or upgrading a data source in the ERI Exponential Platform.",
  },
  {
    id: "explorer-compare-view",
    name: "Explorer Compare View",
    description: "Design and implement the Browse + Compare tab pattern for ERI data-source explorer pages (SBTi, TPI, CDP, NZT, LobbyMap, B Corp, etc.). Use when adding a Sector filter, checkbox-selection column, or Compare tab to any DataExplorer page.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When adding a Compare tab or Sector filter to any ERI data explorer page.",
  },
  {
    id: "widget-component-standard",
    name: "Widget Component Standard",
    description: "Standard widget component design and implementation for the ERI Exponential Platform. Use when creating a new data source or analytical widget, building a Widget Hub demo page, registering a widget in widgetRegistry.ts, or wiring a widget into a workspace tab page.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When creating or auditing a widget component in the ERI Exponential Platform.",
  },
  {
    id: "earth-aligned-agent",
    name: "Earth-Aligned Agent",
    description: "Architecture, modes, pipeline lifecycle, scoring model, known errors, and canonical file locations for the ERI Earth-aligned AI Agent subsystem. Use when working on any Earth-aligned agent task: adding a new mode, modifying the diagnostic or report pipeline, fixing rendering bugs, or debugging stalled jobs.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When working on the Earth-aligned AI Agent in the ERI Exponential Platform.",
  },
  {
    id: "eri-user-management",
    name: "ERI User Management",
    description: "Design and implement the three-domain user management system: ERI employees, company workspaces, and workspace users. Covers magic-link invites, role management, upgrade requests, OAuth domain auto-assign, and MFA enforcement.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When building or auditing user management features in any ERI project.",
  },
  {
    id: "trust-security",
    name: "Trust & Security",
    description: "Cyber security and data integrity best practices for SaaS web applications. Covers authentication (OAuth + TOTP MFA), workspace data isolation, API security (rate limiting, CSP, input validation), audit logging, and vulnerability management.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When building or auditing security features, or building a Trust & Security page.",
  },
  {
    id: "rest-api-creator",
    name: "REST API Creator",
    description: "Design and implement production-ready REST APIs on the ERI Platform (Express + TypeScript + Drizzle + MySQL). Covers API key authentication, response envelopes, error formats, admin UI for API management, public API documentation, and OpenAPI spec.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When designing or implementing a REST API endpoint on the ERI Platform.",
  },
  {
    id: "corporate-report-finder",
    name: "Corporate Report Finder",
    description: "Systematic methodology for finding, storing, and validating corporate reporting URLs across five types (Annual, Sustainability, Transition, Biodiversity, Social). Covers the 5-tier discovery pipeline (ESEF, Klimatkollen, SRN, SERP, Perplexity).",
    tier: 3,
    version: "1.0.0",
    readWhen: "When implementing or extending the corporate report URL discovery pipeline.",
  },
  {
    id: "data-source-integration",
    name: "Data Source Integration",
    description: "Canonical checklist for integrating a new external data source into the ERI Exponential Platform end-to-end — from database schema through server router, admin explorer, widget, workspace page, and all shared config files.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When adding a brand-new data source to the ERI Exponential Platform.",
  },
  {
    id: "ueil-inline-widget-navigation",
    name: "UEIL Inline Widget Navigation",
    description: "Pattern for adding per-row inline widget navigation to the UEIL Company Data Lookup table. Use when implementing the 'click a linked source row → view its widget inline' feature for any of the 14 data sources.",
    tier: 3,
    version: "1.0.0",
    readWhen: "When implementing inline widget navigation in the UEIL Company Data Lookup table.",
  },
  {
    id: "eri-brand-design-system-site",
    name: "ERI Brand Design System Site",
    description: "Build or update the standalone ERI Brand Design System website from the brand package zip. Covers the full workflow: package inspection, asset upload, component porting, logo rendering fixes, and deployment.",
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
