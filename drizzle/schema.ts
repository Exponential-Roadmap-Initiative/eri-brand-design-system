import { bigint, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

// ─── Skill Usage Logs ────────────────────────────────────────────────────────
// Append-only. One row per post-task usage log submitted by an agent or user.
// Records which skills were read during a task, with a verdict per skill
// (helpful / stale / missing) and an optional task description.
// Used to power the Health dashboard: last-used dates, read-rates, stale flags.
export const skillUsageLogs = mysqlTable("skill_usage_logs", {
  id: int("id").primaryKey().autoincrement(),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
  taskDescription: varchar("task_description", { length: 500 }),  // optional: what the task was
  skillsReadJson: text("skills_read_json").notNull(),              // JSON: [{skillId, verdict}]
  agentNote: varchar("agent_note", { length: 500 }),              // optional: free-form note
});
export type SkillUsageLog = typeof skillUsageLogs.$inferSelect;
export type InsertSkillUsageLog = typeof skillUsageLogs.$inferInsert;

// ─── Skill Evolution Log ─────────────────────────────────────────────────────
// Append-only. One row per add/update/remove event produced by syncMetadataFromFilesImpl().
// Written automatically — no human input required.
// Groups of rows with the same syncRunId represent a single sync operation.
export const skillEvolutionLog = mysqlTable("skill_evolution_log", {
  id: int("id").primaryKey().autoincrement(),
  syncRunId: varchar("sync_run_id", { length: 36 }).notNull(),  // UUID grouping rows from one sync call
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
  triggerSource: varchar("trigger_source", { length: 32 }).notNull(), // 'heartbeat' | 'agent-sync' | 'manual-sync'
  taskName: varchar("task_name", { length: 256 }),               // e.g. "Exponential Platform task" — from --task-context
  eventType: mysqlEnum("event_type", ["added", "updated", "removed"]).notNull(),
  skillId: varchar("skill_id", { length: 64 }).notNull(),
  skillName: varchar("skill_name", { length: 256 }),
  tier: int("tier"),
  versionBefore: varchar("version_before", { length: 16 }),
  versionAfter: varchar("version_after", { length: 16 }),
  changedFields: text("changed_fields"),                         // JSON array of field names that changed
  summary: varchar("summary", { length: 512 }).notNull(),        // auto-generated one-liner
});
export type SkillEvolutionEntry = typeof skillEvolutionLog.$inferSelect;
export type InsertSkillEvolutionEntry = typeof skillEvolutionLog.$inferInsert;

// ─── Skill Release Proposals ─────────────────────────────────────────────────
// A submitted revision is immutable. Administrators review it, then either reject
// it or promote it as a controlled release. Skill content is retained here so the
// public skill reader never depends on an external task sandbox after promotion.
export const skillReleaseProposals = mysqlTable("skill_release_proposals", {
  id: int("id").primaryKey().autoincrement(),
  skillId: varchar("skill_id", { length: 64 }).notNull(),
  proposalType: mysqlEnum("proposal_type", ["create", "update"]).notNull(),
  status: mysqlEnum("status", ["submitted", "approved", "rejected", "released"]).notNull().default("submitted"),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").notNull(),
  tier: int("tier").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  version: varchar("version", { length: 16 }).notNull(),
  readWhen: text("read_when").notNull(),
  hasReferences: mysqlEnum("has_references", ["true", "false"]).notNull(),
  proposedContent: text("proposed_content").notNull(),
  changeSummary: text("change_summary").notNull(),
  taskContext: varchar("task_context", { length: 256 }),
  submittedByUserId: int("submitted_by_user_id").notNull().references(() => users.id),
  reviewedByUserId: int("reviewed_by_user_id").references(() => users.id),
  reviewNote: varchar("review_note", { length: 1000 }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  reviewedAt: bigint("reviewed_at", { mode: "number" }),
}, (table) => [
  index("idx_skill_release_proposals_status_created").on(table.status, table.createdAt),
  index("idx_skill_release_proposals_skill_created").on(table.skillId, table.createdAt),
]);
export type SkillReleaseProposal = typeof skillReleaseProposals.$inferSelect;

// ─── Skill Release Events ────────────────────────────────────────────────────
// Append-only audit trail. Events are never edited or deleted after creation.
export const skillReleaseEvents = mysqlTable("skill_release_events", {
  id: int("id").primaryKey().autoincrement(),
  proposalId: int("proposal_id").notNull().references(() => skillReleaseProposals.id),
  eventType: mysqlEnum("event_type", ["submitted", "approved", "rejected", "released"]).notNull(),
  actorUserId: int("actor_user_id").notNull().references(() => users.id),
  note: varchar("note", { length: 1000 }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (table) => [
  index("idx_skill_release_events_proposal_created").on(table.proposalId, table.createdAt),
]);
export type SkillReleaseEvent = typeof skillReleaseEvents.$inferSelect;

// ─── Skill Registry Releases ─────────────────────────────────────────────────
// One immutable registry snapshot per released proposal. This is the durable
// release record behind the runtime skills-registry.json cache.
export const skillRegistryReleases = mysqlTable("skill_registry_releases", {
  id: int("id").primaryKey().autoincrement(),
  proposalId: int("proposal_id").notNull().unique().references(() => skillReleaseProposals.id),
  registrySnapshot: text("registry_snapshot").notNull(),
  releasedByUserId: int("released_by_user_id").notNull().references(() => users.id),
  releasedAt: bigint("released_at", { mode: "number" }).notNull(),
});
export type SkillRegistryRelease = typeof skillRegistryReleases.$inferSelect;
