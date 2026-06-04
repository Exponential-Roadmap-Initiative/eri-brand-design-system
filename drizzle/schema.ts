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

// ─── Skills Registry ────────────────────────────────────────────────────────
// One row per skill. Source of truth for version and tier.
// Populated via the /skills admin UI or programmatically.

export const skills = mysqlTable("skills", {
  id: varchar("id", { length: 64 }).primaryKey(),        // e.g. "skill-manager", "eri-bds-reference"
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description").notNull(),
  tier: int("tier").notNull(),                            // 1 = always-on, 2 = per-action, 3 = conditional
  version: varchar("version", { length: 16 }).notNull(), // semver, e.g. "3.11.0"
  readWhen: text("read_when"),                            // human-readable trigger condition
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

// ─── Skill Improvement Log ───────────────────────────────────────────────────
// Append-only — never delete entries. One row per logged improvement.

export const skillImprovements = mysqlTable("skill_improvements", {
  id: int("id").autoincrement().primaryKey(),
  skillId: varchar("skill_id", { length: 64 }).notNull()
    .references(() => skills.id, { onDelete: "cascade" }),
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