import { describe, expect, it } from "vitest";
import { BDS_RELEASE_LABEL } from "../shared/bdsRelease";

describe("BDS_RELEASE_LABEL", () => {
  it("identifies the current published governance release", () => {
    expect(BDS_RELEASE_LABEL).toBe("V.2026.08.20");
  });
});
