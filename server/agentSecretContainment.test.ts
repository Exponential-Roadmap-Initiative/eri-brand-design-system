import { describe, expect, it } from "vitest";

describe("rotated BDS agent credential containment", () => {
  it("does not re-enable the retired agent sync endpoint", async () => {
    const secret = process.env.BDS_AGENT_SECRET;
    expect(secret).toBeTruthy();

    const response = await fetch("http://localhost:3000/api/agent/skill-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    await expect(response.json()).resolves.toMatchObject({
      code: "SKILL_SYNC_PAUSED",
    });
    expect(response.status).toBe(410);
  });
});
