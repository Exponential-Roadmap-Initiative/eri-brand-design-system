import { describe, expect, it } from "vitest";
import { AGENT_SYNC_PAUSED_RESPONSE } from "./_core/agentSyncPolicy";
import { getAllowedBdsMetaTarget } from "./_core/bdsMetaGuard";
import { syncMetadataFromFilesImpl } from "./routers/skills";

describe("BDS containment policies", () => {
  it("permits only exact HTTPS bds-meta.json URLs for registered ERI applications", () => {
    const target = getAllowedBdsMetaTarget("https://taxonomy.exponentialroadmap.org/bds-meta.json");

    expect(target?.hostname).toBe("taxonomy.exponentialroadmap.org");
    expect(target?.pathname).toBe("/bds-meta.json");
  });

  it("rejects unregistered, redirected, credentialed, non-HTTPS, and non-metadata proxy targets", () => {
    const blockedTargets = [
      "https://example.com/bds-meta.json",
      "http://taxonomy.exponentialroadmap.org/bds-meta.json",
      "https://taxonomy.exponentialroadmap.org/other.json",
      "https://taxonomy.exponentialroadmap.org/bds-meta.json?redirect=https://example.com",
      "https://user:password@taxonomy.exponentialroadmap.org/bds-meta.json",
    ];

    for (const raw of blockedTargets) {
      expect(getAllowedBdsMetaTarget(raw)).toBeNull();
    }
  });

  it("keeps agent-originated sync unavailable with an explicit stable response", () => {
    expect(AGENT_SYNC_PAUSED_RESPONSE).toEqual({
      error: "Agent-driven skill synchronisation is temporarily disabled during the BDS security upgrade.",
      code: "SKILL_SYNC_PAUSED",
    });
  });

  it("makes the shared sync facade non-destructive", async () => {
    await expect(syncMetadataFromFilesImpl("manual-sync")).resolves.toMatchObject({
      success: false,
      changesCount: 0,
      registeredCount: 0,
      removedCount: 0,
    });
  });
});
