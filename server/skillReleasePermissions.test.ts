import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMemberContext(): TrpcContext {
  return {
    user: {
      id: 701,
      openId: "member-test-user",
      email: "member@example.com",
      name: "Member Test",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("skill release permissions", () => {
  it("rejects a non-admin before listing proposals or mutating the release workflow", async () => {
    const caller = appRouter.createCaller(createMemberContext());

    await expect(caller.skillReleases.listProposals({ limit: 25, offset: 0 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.skillReleases.createProposal({
      skillId: "eri-test-release",
      name: "Test release",
      description: "A valid description for a proposed controlled release.",
      tier: 3,
      category: "process",
      version: "1.0.0",
      readWhen: "Before testing a controlled skill release.",
      hasReferences: false,
      proposedContent: "---\nname: eri-test-release\ndescription: Test content for a controlled release permission check.\n---\n\n# Test\n\nThis content is long enough for validation.",
      changeSummary: "Validate that a non-administrator cannot submit a release proposal.",
    })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
