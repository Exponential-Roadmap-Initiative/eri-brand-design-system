// server/routers/skills.ts
// Skills management router for the BDS skill-manager system.
// Reads are public (the skill registry is openly visible).
// Writes are admin-only (only ERI staff can add/update/delete skills or log improvements).
// Project instructions (preamble) are protected — any authenticated user can save/load.

import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { projectInstructions, skillImprovements, skills } from "../../drizzle/schema";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const skillsRouter = router({

  /**
   * List all skills ordered by tier then name, each with their full improvement log.
   * Public — the skill registry is openly visible.
   */
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

    const allSkills = await db
      .select()
      .from(skills)
      .orderBy(skills.tier, skills.name)
      .limit(500); // safety cap — registry will never be this large

    const allImprovements = await db
      .select()
      .from(skillImprovements)
      .orderBy(desc(skillImprovements.loggedAt))
      .limit(2000); // safety cap

    return allSkills.map((skill) => ({
      ...skill,
      improvements: allImprovements.filter((i) => i.skillId === skill.id),
    }));
  }),

  /**
   * Get a single skill with its full improvement log.
   * Public.
   */
  get: publicProcedure
    .input(z.object({ id: z.string().min(1).max(64) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const [skill] = await db
        .select()
        .from(skills)
        .where(eq(skills.id, input.id))
        .limit(1);

      if (!skill) return null;

      const improvements = await db
        .select()
        .from(skillImprovements)
        .where(eq(skillImprovements.skillId, input.id))
        .orderBy(desc(skillImprovements.loggedAt))
        .limit(500);

      return { ...skill, improvements };
    }),

  /**
   * Create or update a skill.
   * Admin-only.
   */
  upsert: adminProcedure
    .input(
      z.object({
        id: z.string().min(1).max(64),
        name: z.string().min(1).max(128),
        description: z.string().min(1).max(2000),
        tier: z.number().int().min(1).max(3),
        version: z.string().min(1).max(16),
        readWhen: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db
        .insert(skills)
        .values(input)
        .onDuplicateKeyUpdate({
          set: {
            name: input.name,
            description: input.description,
            tier: input.tier,
            version: input.version,
            readWhen: input.readWhen ?? null,
          },
        });

      return { success: true };
    }),

  /**
   * Log an improvement for a skill and bump its version.
   * Two writes — wrapped in a transaction.
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
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db.transaction(async (tx) => {
        // Bump the skill's version to match the improvement
        await tx
          .update(skills)
          .set({ version: input.version })
          .where(eq(skills.id, input.skillId));

        // Append the improvement log entry
        const [_result] = await tx.insert(skillImprovements).values({
          skillId: input.skillId,
          version: input.version,
          summary: input.summary,
          taskContext: input.taskContext ?? null,
        });
        void _result; // insertId not needed here
      });

      return { success: true };
    }),

  /**
   * Delete a skill and cascade its improvement log entries.
   * Admin-only.
   */
  delete: adminProcedure
    .input(z.object({ id: z.string().min(1).max(64) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      await db.delete(skills).where(eq(skills.id, input.id));
      return { success: true };
    }),

  // ─── Project Instructions ────────────────────────────────────────────────────

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
});
