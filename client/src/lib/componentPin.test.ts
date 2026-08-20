import { describe, expect, it } from "vitest";
import { isCurrentReleasedComponentPin } from "./componentPin";

describe("isCurrentReleasedComponentPin", () => {
  const latest = "v2.18.0";

  it("accepts the exact published release", () => {
    expect(isCurrentReleasedComponentPin(latest, latest)).toBe(true);
  });

  it.each([undefined, "main", "latest", "v2.17.0"]) (
    "does not treat %s as the current immutable release",
    (pin) => {
      expect(isCurrentReleasedComponentPin(pin, latest)).toBe(false);
    },
  );
});
