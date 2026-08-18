import { describe, expect, it } from "vitest";
import { canTransitionSkillRelease } from "./_core/skillReleasePolicy";

describe("skill release lifecycle policy", () => {
  it("permits only review decisions from a submitted proposal", () => {
    expect(canTransitionSkillRelease("submitted", "approved")).toBe(true);
    expect(canTransitionSkillRelease("submitted", "rejected")).toBe(true);
    expect(canTransitionSkillRelease("submitted", "released")).toBe(false);
  });

  it("permits release only after approval", () => {
    expect(canTransitionSkillRelease("approved", "released")).toBe(true);
    expect(canTransitionSkillRelease("approved", "rejected")).toBe(false);
  });

  it("keeps rejected and released proposals terminal", () => {
    for (const state of ["rejected", "released"] as const) {
      expect(canTransitionSkillRelease(state, "submitted")).toBe(false);
      expect(canTransitionSkillRelease(state, "approved")).toBe(false);
      expect(canTransitionSkillRelease(state, "released")).toBe(false);
    }
  });
});
