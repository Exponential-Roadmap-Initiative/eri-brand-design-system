
---

## Shared ERI logotype — administrator escalation (2026-10-07)

- The operator explicitly confirmed the ERI administrator mandate. The BDS WebDev File storage interface was inspected: it exposes uploads but no mechanism to edit object metadata or replace the three existing stable public CDN keys.
- The linked administrator browser session had no AWS CloudFront/S3 session, confirming that underlying object metadata remains a Manus-managed delivery-layer control rather than an ERI BDS application setting.
- An authorised technical-support escalation was sent from `nicklas.lemon@exponentialroadmap.org` to `api-support@manus.ai`, with the three exact URLs, the observed `application/octet-stream` + `nosniff` headers, the requested `image/svg+xml` / inline correction, project identifiers, and explicit requirement to preserve the stable URLs.
- No BDS application code or consuming-site source was altered. Next action is response-header and visual verification immediately after Manus confirms the in-place correction; only if the stable URLs cannot be repaired should a separate, versioned components fallback be accepted and implemented.
