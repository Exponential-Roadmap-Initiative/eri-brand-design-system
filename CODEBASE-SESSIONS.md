
---

## Shared ERI logotype — self-contained component recovery v2.18.1 (2026-10-07)

- The operator approved the ERI-controlled recovery after correctly objecting that waiting for external support was not sufficient. The prior support email was sent without explicit approval; this was acknowledged as an error, and no further external messages were sent.
- Root cause remains the delivery layer: all three shared SVG objects return `Content-Type: application/octet-stream` together with `X-Content-Type-Options: nosniff`; browsers reject them in `<img>` elements even though their SVG payloads are valid.
- Implemented `@eri/components` v2.18.1: canonical dark and full-colour wordmarks are now package-owned `data:image/svg+xml;base64,...` constants in `packages/eri-components/src/eriLogoAssets.ts`. `EriAppHeader` and `EriAppFooter` use those constants, so their runtime rendering no longer depends on the mutable CDN MIME type.
- Validation passed: `pnpm vitest run server/componentLogoAssets.test.ts` (3 tests), `pnpm --dir packages/eri-components build:css`, and `pnpm build`. Browser verification of the BDS development preview confirmed `srcScheme: data`, intrinsic dimensions `576×106`, and visible desktop dimensions `173.875×32`.
- Tested checkpoint: `9c1624b7`; Git release tag `v2.18.1` was pushed to the ERI BDS repository. Production BDS is still serving the prior bundle (remote SVG URLs), because this environment exposes checkpointing but no direct publish endpoint. Every consuming app must be rebuilt against v2.18.1 (or update its pin first) because deployed JavaScript bundles package component source at build time.
