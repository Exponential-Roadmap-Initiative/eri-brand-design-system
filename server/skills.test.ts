/**
 * Tests for the skills tRPC router.
 *
 * Covers:
 *   - list: returns array (public)
 *   - get: returns null for unknown id (public)
 *   - upsert: throws UNAUTHORIZED when unauthenticated
 *   - upsert: throws FORBIDDEN when user is not admin
 *   - logImprovement: throws UNAUTHORIZED when unauthenticated
 *   - delete: throws UNAUTHORIZED when unauthenticated
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

// ── Mock DB ───────────────────────────────────────────────────────────────────

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
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{}]),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([{}]),
    }),
    transaction: vi.fn().mockImplementation(async (fn: (tx: unknown) => Promise<void>) => {
      await fn({
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([{}]) }) }),
        insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue([[{ insertId: 1 }]]) }),
      });
    }),
  }),
}));

// ── Context helpers ───────────────────────────────────────────────────────────

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

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("skills.list", () => {
  it("returns an array when unauthenticated (public procedure)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("skills.get", () => {
  it("returns null for an unknown skill id", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.skills.get({ id: "non-existent-skill" });
    expect(result).toBeNull();
  });
});

describe("skills.upsert", () => {
  it("throws FORBIDDEN when unauthenticated (adminProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.upsert({
        id: "test-skill",
        name: "Test Skill",
        description: "A test skill",
        tier: 3,
        version: "1.0.0",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(
      caller.skills.upsert({
        id: "test-skill",
        name: "Test Skill",
        description: "A test skill",
        tier: 3,
        version: "1.0.0",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("succeeds when user is admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("admin") }));
    const result = await caller.skills.upsert({
      id: "test-skill",
      name: "Test Skill",
      description: "A test skill",
      tier: 3,
      version: "1.0.0",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills.logImprovement", () => {
  it("throws FORBIDDEN when unauthenticated (adminProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.logImprovement({
        skillId: "test-skill",
        version: "1.0.1",
        summary: "Fixed a bug",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(
      caller.skills.logImprovement({
        skillId: "test-skill",
        version: "1.0.1",
        summary: "Fixed a bug",
      })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("skills.delete", () => {
  it("throws FORBIDDEN when unauthenticated (adminProcedure gate)", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: null }));
    await expect(
      caller.skills.delete({ id: "test-skill" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("throws FORBIDDEN when user is not admin", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(
      caller.skills.delete({ id: "test-skill" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
