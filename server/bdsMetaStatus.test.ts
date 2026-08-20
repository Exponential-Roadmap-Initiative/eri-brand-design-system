import { describe, expect, it } from "vitest";
import type { BdsMeta } from "../client/src/data/bdsMetaTypes";
import { deriveStatus } from "../client/src/pages/AlignmentTracker";

const baseMeta: BdsMeta = {
  schemaVersion: "1.4",
  project: "test",
  displayName: "Test Project",
  url: "https://test.exponentialroadmap.org",
  eriComponentsPin: "v2.18.0",
  cssImportMethod: "dist",
  components: {},
  systemOps: {},
  brand: {},
  layout: {},
  antiAi: {},
  knownViolations: [],
  overallStatus: "green",
  lastUpdated: "2026-08-20",
  updatedBy: "Manus",
};

describe("deriveStatus component pin safety", () => {
  it("reports an exact immutable release as green when no other violation exists", () => {
    expect(deriveStatus(baseMeta)).toBe("green");
  });

  it.each([undefined, "main", "latest", "github:eri/components#main"]) (
    "reports %s as amber rather than green",
    (eriComponentsPin) => {
      expect(deriveStatus({ ...baseMeta, eriComponentsPin })).toBe("amber");
    },
  );
});
