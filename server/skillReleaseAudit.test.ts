import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const database = vi.hoisted(() => ({ current: null as unknown }));

vi.mock("./db", () => ({
  getDb: vi.fn(async () => database.current),
}));

import { appRouter } from "./routers";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 702,
      openId: "admin-test-user",
      email: "admin@example.com",
      name: "Admin Test",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("skill release audit trail", () => {
  beforeEach(() => {
    const eventValues = vi.fn(async () => []);
    const updateWhere = vi.fn(async () => []);
    const tx = {
      select: vi.fn(() => ({
        from: () => ({
          where: () => ({ limit: async () => [{ id: 41, status: "submitted" }] }),
        }),
      })),
      update: vi.fn(() => ({ set: () => ({ where: updateWhere }) })),
      insert: vi.fn(() => ({ values: eventValues })),
    };
    database.current = { transaction: async (callback: (transaction: typeof tx) => Promise<void>) => callback(tx) };
    Object.assign(database, { eventValues, updateWhere });
  });

  it("records approval status and an immutable approval event in one transaction", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    await expect(caller.skillReleases.reviewProposal({ proposalId: 41, decision: "approved", reviewNote: "Reviewed against the proposed diff." })).resolves.toEqual({ success: true, status: "approved" });

    const eventValues = (database as unknown as { eventValues: ReturnType<typeof vi.fn> }).eventValues;
    expect(eventValues).toHaveBeenCalledWith(expect.objectContaining({ proposalId: 41, eventType: "approved", actorUserId: 702, note: "Reviewed against the proposed diff." }));
  });
});
