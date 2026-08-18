import fs from "fs";
import path from "path";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  skillRegistryReleases,
  skillReleaseEvents,
  skillReleaseProposals,
} from "../../drizzle/schema";
import { canTransitionSkillRelease } from "../_core/skillReleasePolicy";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { SKILLS_METADATA, type SkillMeta } from "./skills";

const REGISTRY_JSON_PATH = path.resolve(process.cwd(), "skills-registry.json");
const proposalStatusSchema = z.enum(["submitted", "approved", "rejected", "released"]);

const skillProposalInput = z.object({
  skillId: z.string().regex(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/, "Use a lowercase kebab-case skill ID"),
  name: z.string().min(2).max(256),
  description: z.string().min(20).max(12000),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: z.string().min(2).max(64),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Use semantic version X.Y.Z"),
  readWhen: z.string().min(10).max(4000),
  hasReferences: z.boolean(),
  proposedContent: z.string().min(100).max(60000),
  changeSummary: z.string().min(10).max(12000),
  taskContext: z.string().min(2).max(256).optional(),
});

function loadRuntimeRegistry(): SkillMeta[] {
  try {
    if (fs.existsSync(REGISTRY_JSON_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(REGISTRY_JSON_PATH, "utf-8")) as SkillMeta[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // The durable database release remains the audit source; use the shipped
    // registry while a local runtime cache is unavailable.
  }
  return SKILLS_METADATA;
}

function writeRuntimeRegistry(registry: SkillMeta[]) {
  const temporaryPath = `${REGISTRY_JSON_PATH}.${Date.now()}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(registry, null, 2), "utf-8");
  fs.renameSync(temporaryPath, REGISTRY_JSON_PATH);
}

function proposalToMetadata(proposal: {
  skillId: string;
  name: string;
  description: string;
  tier: number;
  category: string;
  version: string;
  readWhen: string;
  hasReferences: "true" | "false";
}): SkillMeta {
  return {
    id: proposal.skillId,
    name: proposal.name,
    description: proposal.description,
    tier: proposal.tier as SkillMeta["tier"],
    category: proposal.category,
    version: proposal.version,
    readWhen: proposal.readWhen,
    hasReferences: proposal.hasReferences === "true",
  };
}

export const skillReleasesRouter = router({
  listProposals: adminProcedure
    .input(z.object({ status: proposalStatusSchema.optional(), limit: z.number().int().min(1).max(100).default(25), offset: z.number().int().min(0).default(0) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const query = db.select().from(skillReleaseProposals).orderBy(desc(skillReleaseProposals.createdAt)).limit(input.limit).offset(input.offset);
      return input.status ? query.where(eq(skillReleaseProposals.status, input.status)) : query;
    }),

  getProposal: adminProcedure
    .input(z.object({ proposalId: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const [proposal] = await db.select().from(skillReleaseProposals).where(eq(skillReleaseProposals.id, input.proposalId)).limit(1);
      if (!proposal) throw new TRPCError({ code: "NOT_FOUND", message: "Skill proposal not found" });
      const events = await db.select().from(skillReleaseEvents).where(eq(skillReleaseEvents.proposalId, input.proposalId)).orderBy(asc(skillReleaseEvents.createdAt)).limit(100);
      return { proposal, events };
    }),

  createProposal: adminProcedure
    .input(skillProposalInput)
    .mutation(async ({ input, ctx }) => {
      if (/BDS_AGENT_SECRET\s*=\s*["']?[A-Za-z0-9!@#$%^&*()_+\-=]{20,}/.test(input.proposedContent)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Proposed skill content appears to include a credential" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const now = Date.now();
      const current = loadRuntimeRegistry().find((skill) => skill.id === input.skillId);
      const proposalType = current ? "update" : "create";

      const proposalId = await db.transaction(async (tx) => {
        const active = await tx.select({ id: skillReleaseProposals.id }).from(skillReleaseProposals)
          .where(and(eq(skillReleaseProposals.skillId, input.skillId), inArray(skillReleaseProposals.status, ["submitted", "approved"])))
          .limit(1);
        if (active.length > 0) throw new TRPCError({ code: "CONFLICT", message: "An active proposal already exists for this skill" });
        const [result] = await tx.insert(skillReleaseProposals).values({
          skillId: input.skillId,
          proposalType,
          status: "submitted",
          name: input.name,
          description: input.description,
          tier: input.tier,
          category: input.category,
          version: input.version,
          readWhen: input.readWhen,
          hasReferences: input.hasReferences ? "true" : "false",
          proposedContent: input.proposedContent,
          changeSummary: input.changeSummary,
          taskContext: input.taskContext ?? null,
          submittedByUserId: ctx.user.id,
          createdAt: now,
          updatedAt: now,
        });
        await tx.insert(skillReleaseEvents).values({ proposalId: result.insertId, eventType: "submitted", actorUserId: ctx.user.id, createdAt: now });
        return result.insertId;
      });
      return { success: true, proposalId, proposalType };
    }),

  reviewProposal: adminProcedure
    .input(z.object({ proposalId: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), reviewNote: z.string().max(1000).optional() }))
    .mutation(async ({ input, ctx }) => {
      if (input.decision === "rejected" && !input.reviewNote?.trim()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A rejection requires a review note" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const now = Date.now();
      await db.transaction(async (tx) => {
        const [proposal] = await tx.select().from(skillReleaseProposals).where(eq(skillReleaseProposals.id, input.proposalId)).limit(1);
        if (!proposal) throw new TRPCError({ code: "NOT_FOUND", message: "Skill proposal not found" });
        if (!canTransitionSkillRelease(proposal.status, input.decision)) throw new TRPCError({ code: "CONFLICT", message: "Only submitted proposals can be reviewed" });
        await tx.update(skillReleaseProposals).set({ status: input.decision, reviewedByUserId: ctx.user.id, reviewNote: input.reviewNote?.trim() ?? null, reviewedAt: now, updatedAt: now })
          .where(and(eq(skillReleaseProposals.id, input.proposalId), eq(skillReleaseProposals.status, "submitted")));
        await tx.insert(skillReleaseEvents).values({ proposalId: input.proposalId, eventType: input.decision, actorUserId: ctx.user.id, note: input.reviewNote?.trim() ?? null, createdAt: now });
      });
      return { success: true, status: input.decision };
    }),

  releaseProposal: adminProcedure
    .input(z.object({ proposalId: z.number().int().positive(), releaseNote: z.string().max(1000).optional() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });
      const now = Date.now();
      const [proposal] = await db.select().from(skillReleaseProposals).where(eq(skillReleaseProposals.id, input.proposalId)).limit(1);
      if (!proposal) throw new TRPCError({ code: "NOT_FOUND", message: "Skill proposal not found" });
      if (!canTransitionSkillRelease(proposal.status, "released")) throw new TRPCError({ code: "CONFLICT", message: "Only approved proposals can be released" });

      const nextRegistry = [...loadRuntimeRegistry()];
      const nextMetadata = proposalToMetadata(proposal);
      const existingIndex = nextRegistry.findIndex((skill) => skill.id === proposal.skillId);
      if (existingIndex >= 0) nextRegistry[existingIndex] = nextMetadata;
      else nextRegistry.push(nextMetadata);
      const registrySnapshot = JSON.stringify(nextRegistry);

      await db.transaction(async (tx) => {
        await tx.update(skillReleaseProposals).set({ status: "released", updatedAt: now })
          .where(and(eq(skillReleaseProposals.id, input.proposalId), eq(skillReleaseProposals.status, "approved")));
        await tx.insert(skillRegistryReleases).values({ proposalId: input.proposalId, registrySnapshot, releasedByUserId: ctx.user.id, releasedAt: now });
        await tx.insert(skillReleaseEvents).values({ proposalId: input.proposalId, eventType: "released", actorUserId: ctx.user.id, note: input.releaseNote?.trim() ?? null, createdAt: now });
      });
      writeRuntimeRegistry(nextRegistry);
      return { success: true, releasedAt: now, registryCount: nextRegistry.length };
    }),
});
