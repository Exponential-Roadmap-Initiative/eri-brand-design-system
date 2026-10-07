import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ERI_LOGO_DARK_SRC,
  ERI_LOGO_LIGHT_SRC,
} from "../packages/eri-components/src/eriLogoAssets";

function decodeSvgDataUri(dataUri: string) {
  const encodedPayload = dataUri.split(",", 2)[1];
  return Buffer.from(encodedPayload, "base64").toString("utf8");
}

describe("packaged ERI logo assets", () => {
  it.each([
    ["dark wordmark", ERI_LOGO_DARK_SRC],
    ["full-colour wordmark", ERI_LOGO_LIGHT_SRC],
  ])("packages the approved %s as a browser-safe SVG data URI", (_label, dataUri) => {
    expect(dataUri).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(decodeSvgDataUri(dataUri)).toMatch(/^<svg\b/);
  });

  it("uses packaged assets in the shared header and footer instead of runtime SVG object URLs", () => {
    const header = readFileSync(
      resolve(process.cwd(), "packages/eri-components/src/EriAppHeader.tsx"),
      "utf8",
    );
    const footer = readFileSync(
      resolve(process.cwd(), "packages/eri-components/src/EriAppFooter.tsx"),
      "utf8",
    );

    expect(header).toContain("ERI_LOGO_DARK_SRC");
    expect(header).toContain("ERI_LOGO_LIGHT_SRC");
    expect(footer).toContain("ERI_LOGO_DARK_SRC");
    expect(header).toMatch(
      /const logoSrc = isHeaderDark \? ERI_LOGO_DARK_SRC : ERI_LOGO_LIGHT_SRC;/,
    );
    expect(footer).toMatch(/src=\{ERI_LOGO_DARK_SRC\}/);
  });
});
