/**
 * Tests for the skills tRPC router (filesystem-first architecture).
 *
 * Covers:
 *   - list: returns SKILLS_METADATA array (public)
 *   - get: returns null for unknown id (public)
 *   - get: returns meta + empty improvements for known id (public)
 *   - getContent: returns null for unknown id (public)
 *   - logImprovement: throws UNAUTHORIZED when unauthenticated
 *   - logImprovement: throws FORBIDDEN when user is not admin
 *   - logImprovement: throws NOT_FOUND for unknown skill id (even as admin)
 *   - getProjectInstructions: throws UNAUTHORIZED when unauthenticated
 *   - getProjectInstructions: returns null for unknown project (authenticated)
 *   - saveProjectInstructions: throws UNAUTHORIZED when unauthenticated
 *   - saveProjectInstructions: succeeds when authenticated
 *   - saveInstructionsVersion: throws UNAUTHORIZED when unauthenticated
 *   - saveInstructionsVersion: succeeds when authenticated
 *   - listInstructionsVersions: throws UNAUTHORIZED when unauthenticated
 *   - listInstructionsVersions: returns array when authenticated
 *   - saveInstructionsAudit: throws UNAUTHORIZED when unauthenticated
 *   - saveInstructionsAudit: succeeds when authenticated
 *   - listInstructionsAudits: throws UNAUTHORIZED when unauthenticated
 *   - listInstructionsAudits: returns array when authenticated
 */

import { describe, it, expect, vi } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

// ── Mock DB ─────────────────────────────────────────────────────────────────

vi.mock("../server/db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        onDuplicateKeyUpdate: vi.fn().mockResolvedValue([{}]),
      }),
    }),
  }),
}));

// ── Mock fs (getContent reads SKILL.md from filesystem) ──────────────────────────────────────────────

vi.mock("fs", () => ({
  existsSync: vi.fn().mockReturnValue(false),
  readFileSync: vi.fn().mockReturnValue(""),
}));

// ── Context helpers ─────────────────────────────────────────────────────────────────

function makeCtx(overrides?: Partial<TrpcContext>): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
    ...overrides,
  };
}

function makeUser(role: "user" | "admin" = "user"): NonNullable<TrpcContext["user"]> {
  return {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("skills.list", () => {
  it("returns a non-empty array when unauthenticated (public procedure)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("each entry has required SkillMeta fields and no DB-backed fields", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.list();
    const first = result[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("description");
    expect(first).toHaveProperty("tier");
    expect(first).toHaveProperty("version");
    expect(first).toHaveProperty("readWhen");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("hasReferences");
    expect(first).not.toHaveProperty("improvements");
    expect(first).not.toHaveProperty("createdAt");
  });
});

describe("skills.get", () => {
  it("returns null for an unknown skill id", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.get({ id: "non-existent-skill-xyz" });
    expect(result).toBeNull();
  });

  it("returns meta + empty improvements for a known skill id", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.get({ id: "eri-bds-reference" });
    expect(result).not.toBeNull();
    // get returns { ...meta, improvements } (flat, not nested)
    expect(result?.id).toBe("eri-bds-reference");
    expect(Array.isArray(result?.improvements)).toBe(true);
  });
});

describe("skills.getContent", () => {
  it("returns null for an unknown skill id", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.getContent({ id: "non-existent-skill-xyz" });
    expect(result).toBeNull();
  });

  it("returns null when SKILL.md does not exist on disk (mocked fs)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.getContent({ id: "eri-bds-reference" });
    expect(result).toBeNull();
  });
});

describe("skills.logImprovement", () => {
  it("throws FORBIDDEN when unauthenticated (adminProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.logImprovement({
        skillId: "eri-bds-reference",
        version: "1.0.1",
        summary: "Fixed a bug",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(
      caller.skills.logImprovement({
        skillId: "eri-bds-reference",
        version: "1.0.1",
        summary: "Fixed a bug",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws NOT_FOUND for an unknown skill id (even as admin)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("admin") }));
    await expect(
      caller.skills.logImprovement({
        skillId: "non-existent-skill-xyz",
        version: "1.0.1",
        summary: "Fixed a bug",
      })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("skills.getProjectInstructions", () => {
  it("throws UNAUTHORIZED when unauthenticated (protectedProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.getProjectInstructions({ projectId: "test-project" })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns null for an unknown project when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.getProjectInstructions({ projectId: "test-project" });
    expect(result).toBeNull();
  });
});

describe("skills.saveProjectInstructions", () => {
  it("throws UNAUTHORIZED when unauthenticated (protectedProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.saveProjectInstructions({
        projectId: "test-project",
        preamble: "My custom preamble",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("succeeds when authenticated as a regular user", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.saveProjectInstructions({
      projectId: "test-project",
      preamble: "My custom preamble",
    });
    expect(result).toEqual({ success: true });
  });

  it("succeeds when authenticated as admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("admin") }));
    const result = await caller.skills.saveProjectInstructions({
      projectId: "test-project",
      preamble: "Admin preamble",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills.saveInstructionsVersion", () => {
  it("throws UNAUTHORIZED when unauthenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.saveInstructionsVersion({
        version: "v1.0",
        generatedSnapshot: "Critical: do X\nCritical: do Y",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("succeeds when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.saveInstructionsVersion({
      version: "v1.0",
      generatedSnapshot: "Critical: do X\nCritical: do Y",
      changeNote: "Initial version",
      charCount: 42,
      budgetPct: 1,
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills.listInstructionsVersions", () => {
  it("throws UNAUTHORIZED when unauthenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(caller.skills.listInstructionsVersions()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns an array when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.listInstructionsVersions();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("skills.saveInstructionsAudit", () => {
  it("throws UNAUTHORIZED when unauthenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.saveInstructionsAudit({
        sectionsJson: "[]",
      })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("succeeds when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.saveInstructionsAudit({
      sectionsJson: JSON.stringify([{ id: "skill-update", chars: 285 }]),
      summary: "Audit complete",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills.listInstructionsAudits", () => {
  it("throws UNAUTHORIZED when unauthenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(caller.skills.listInstructionsAudits()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns an array when authenticated", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    const result = await caller.skills.listInstructionsAudits();
    expect(Array.isArray(result)).toBe(true);
  });
});

