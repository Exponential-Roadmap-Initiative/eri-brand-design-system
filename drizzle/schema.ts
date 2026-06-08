import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Skill Improvement Log ───────────────────────────────────────────────────
// Append-only — never delete entries. One row per logged improvement.
// skillId matches the directory name under /home/ubuntu/skills/ (e.g. "eri-bds-reference").
// Skill content lives in SKILL.md files on the filesystem — NOT in the DB.
export const skillImprovements = mysqlTable("skill_improvements", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skill_id", { length: 64 }).notNull(),
  version: varchar("version", { length: 16 }).notNull(),  // version after this improvement
  summary: text("summary").notNull(),                      // what changed and why
  taskContext: text("task_context"),                       // optional: which task surfaced this
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
});
export type SkillImprovement = typeof skillImprovements.$inferSelect;
export type InsertSkillImprovement = typeof skillImprovements.$inferInsert;

// ─── Project Instructions (“Preamble”) ──────────────────────────────────────────────
// One row per project ID. Stores the custom preamble text that appears before
// the auto-generated skill trigger block in the combined project instructions output.
// projectId is a free-form string (e.g. Manus project ID or slug).

export const projectInstructions = mysqlTable("project_instructions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: varchar("project_id", { length: 128 }).notNull().unique(),
  preamble: text("preamble").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectInstruction = typeof projectInstructions.$inferSelect;
export type InsertProjectInstruction = typeof projectInstructions.$inferInsert;

// ─── Project Instructions Version History ────────────────────────────────────
// Append-only snapshot table. One row per "Mark as Applied" action.
// Stores the full generated instructions text so diffs can be computed.
export const projectInstructionsVersions = mysqlTable("project_instructions_versions", {
  id: int("id").primaryKey().autoincrement(),
  version: varchar("version", { length: 20 }).notNull(),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  generatedSnapshot: text("generated_snapshot").notNull(),
  changeNote: varchar("change_note", { length: 500 }),
  charCount: int("char_count"),
  budgetPct: int("budget_pct"),
  publishedAt: timestamp("published_at"),  // null = not yet published to /api/project-instructions/latest
});
export type ProjectInstructionsVersion = typeof projectInstructionsVersions.$inferSelect;
export type InsertProjectInstructionsVersion = typeof projectInstructionsVersions.$inferInsert;

// ─── Project Instructions Audit Findings ─────────────────────────────────────
// Append-only. One row per agent-run audit. Stores structured findings as JSON.
// The Manus agent reads the live project instructions from its context, runs the
// analysis, and writes findings here via trpc.skills.saveInstructionsAudit.
export const projectInstructionsAudits = mysqlTable("project_instructions_audits", {
  id: int("id").primaryKey().autoincrement(),
  auditedAt: timestamp("audited_at").notNull().defaultNow(),
  charCount: int("char_count"),
  budgetPct: int("budget_pct"),
  sectionsJson: text("sections_json").notNull(), // JSON array of AuditSection
  discrepanciesJson: text("discrepancies_json"),  // JSON array of strings
  summary: text("summary"),
  agentNote: varchar("agent_note", { length: 500 }),
});
export type ProjectInstructionsAudit = typeof projectInstructionsAudits.$inferSelect;
export type InsertProjectInstructionsAudit = typeof projectInstructionsAudits.$inferInsert;

// ─── Current Instructions Sync ───────────────────────────────────────────────
// Stores the live project instructions text as written back by a Manus agent.
// The Manus platform has no API to read project instructions — only an agent
// can read them from its context. This table is the agent-bridge: the agent
// reads the <project_instructions> block and writes it here via
// trpc.skills.syncCurrentInstructions so the web app can display it.
// One row only — always upserted with id=1.
export const currentInstructionsSync = mysqlTable("current_instructions_sync", {
  id: int("id").primaryKey().default(1),
  instructionsText: text("instructions_text").notNull(),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
  agentNote: varchar("agent_note", { length: 500 }),
});
export type CurrentInstructionsSync = typeof currentInstructionsSync.$inferSelect;