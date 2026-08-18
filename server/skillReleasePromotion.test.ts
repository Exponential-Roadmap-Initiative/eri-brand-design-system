import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const database = vi.hoisted(() => ({ current: null as unknown, proposal: null as Record<string, unknown> | null }));
const fileSystem = vi.hoisted(() => ({ writeFileSync: vi.fn(), renameSync: vi.fn() }));

vi.mock("./db", () => ({ getDb: vi.fn(async () => database.current) }));
vi.mock("fs", () => ({ default: { existsSync: () => false, writeFileSync: fileSystem.writeFileSync, renameSync: fileSystem.renameSync } }));

import { appRouter } from "./routers";

function createAdminContext(): TrpcContext {
  return {
    user: { id: 703, openId: "release-admin", email: "release@example.com", name: "Release Admin", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function configureDatabase(status: "approved" | "submitted") {
  const registryValues = vi.fn(async () => []);
  const updateWhere = vi.fn(async () => []);
  const proposal = {
    id: 51, skillId: "eri-release-test", status, name: "Release Test", description: "A skill released by the controlled promotion test.", tier: 3, category: "process", version: "1.0.0", readWhen: "Before testing controlled promotion.", hasReferences: "false", proposedContent: "---\nname: eri-release-test\ndescription: Controlled promotion test.\n---\n\n# Release test", changeSummary: "Test controlled promotion.", taskContext: null, submittedByUserId: 703, reviewedByUserId: 703, reviewNote: null, createdAt: Date.now(), updatedAt: Date.now(), reviewedAt: Date.now(),
  };
  const tx = {
    update: vi.fn(() => ({ set: () => ({ where: updateWhere }) })),
    insert: vi.fn(() => ({ values: registryValues })),
  };
  database.current = {
    select: () => ({ from: () => ({ where: () => ({ limit: async () => [proposal] }) }) }),
    transaction: async (callback: (transaction: typeof tx) => Promise<void>) => callback(tx),
  };
  return { registryValues, updateWhere };
}

describe("skill release promotion", () => {
  beforeEach(() => {
    fileSystem.writeFileSync.mockClear();
    fileSystem.renameSync.mockClear();
  });

  it("promotes only an approved proposal, snapshots its registry, and persists the runtime registry", async () => {
    const { registryValues } = configureDatabase("approved");
    const result = await appRouter.createCaller(createAdminContext()).skillReleases.releaseProposal({ proposalId: 51, releaseNote: "Approved release test" });

    expect(result.success).toBe(true);
    expect(registryValues).toHaveBeenCalledWith(expect.objectContaining({ proposalId: 51, releasedByUserId: 703 }));
    expect(registryValues).toHaveBeenCalledWith(expect.objectContaining({ proposalId: 51, eventType: "released", actorUserId: 703 }));
    expect(fileSystem.writeFileSync).toHaveBeenCalledWith(expect.stringContaining("skills-registry.json"), expect.stringContaining("eri-release-test"), "utf-8");
    expect(fileSystem.renameSync).toHaveBeenCalled();
  });

  it("rejects promotion before approval and does not persist a runtime registry", async () => {
    configureDatabase("submitted");
    await expect(appRouter.createCaller(createAdminContext()).skillReleases.releaseProposal({ proposalId: 51 })).rejects.toMatchObject({ code: "CONFLICT" });
    expect(fileSystem.writeFileSync).not.toHaveBeenCalled();
  });
});
