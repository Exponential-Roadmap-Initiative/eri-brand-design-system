# bds-meta.json — ERI Project BDS Alignment Metadata Spec
# Version: 1.1 | 2026-04-24

## Purpose
Each ERI project publishes a static `bds-meta.json` file at the root of its deployed site
(e.g. `https://psm.exponentialroadmap.org/bds-meta.json`). The BDS Alignment Tracker
fetches this file from all known projects and renders a live compliance dashboard.

## File location in each project
`client/public/bds-meta.json`

This file is served at `https://{project-domain}/bds-meta.json` automatically by Vite's
static file serving.

## Schema (v1.1)

```json
{
  "schemaVersion": "1.1",
  "project": "hal",
  "displayName": "Human-AI Lab",
  "url": "https://human-ai-lab.exponentialroadmap.org",
  "eriComponentsPin": "v2.11.1",
  "cssImportMethod": "dist",
  "components": {
    "EriAppHeader":       { "used": true,  "compliant": true  },
    "EriPageLayout":      { "used": true,  "compliant": true  },
    "EriHeroSection":     { "used": true,  "compliant": true  },
    "EriAppFooter":       { "used": true,  "compliant": true  },
    "EriStatusBadge":     { "used": true,  "compliant": true  },
    "EriContactUsButton": { "used": true,  "compliant": true  }
  },
  "systemOps": {
    "projectContextExists":          true,
    "manusPlatformInstructionsRead": true
  },
  "brand": {
    "hexTokensOnly":     true,
    "archivoHeadings":   true,
    "openSansBody":      true,
    "bodyTextHex383838": true,
    "ctaAccentLime":     true,
    "noHardcodedGreys":  true
  },
  "layout": {
    "eriPageLayoutInAppTsx": true,
    "showCtaExplicit":       true,
    "sourcePropsPresent":    true,
    "noStaleComponentNames": true
  },
  "knownViolations": [],
  "overallStatus": "green",
  "lastUpdated": "2026-04-22",
  "updatedBy": "Manus"
}
```

## Field definitions

### Core fields (required)

| Field | Type | Description |
|---|---|---|
| `schemaVersion` | string | Current schema version (`"1.1"`). Increment when new fields are added. Check `https://bds.exponentialroadmap.org/bds-meta-changelog.json` for the latest version. |
| `project` | string | Short project code, e.g. `"hal"`, `"psm"`, `"taxonomy"` |
| `displayName` | string | Full human-readable project name |
| `url` | string | Canonical deployed URL |
| `eriComponentsPin` | string | Current `@eri/components` pin, e.g. `"v2.11.1"` |
| `cssImportMethod` | string | `"dist"` (correct) or `"source-workaround"` (legacy) or `"none"` |
| `components` | object | One entry per standard component — see Component fields below |
| `knownViolations` | array | Known non-conformant patterns for `used: true` components only |
| `overallStatus` | string | `"green"`, `"amber"`, or `"red"` — informational; tracker computes independently |
| `lastUpdated` | string | ISO date of last update, e.g. `"2026-04-22"` |
| `updatedBy` | string | `"Manus"` or team member name |

### Component fields

| Field | Type | Description |
|---|---|---|
| `components[name].used` | boolean | Whether the component is used in this project |
| `components[name].compliant` | boolean | Whether usage matches the BDS spec |
| `components[name].showCTA` | string | For `EriAppHeader` only: the value passed to `showCTA` prop |
| `components[name].note` | string | Optional free-text note about this component's usage |

### systemOps fields (optional — self-reported)

These fields are self-certified by the AI agent after running the Project Alignment Checklist.
Missing fields are shown as "—" in the tracker (not as failures).

| Field | Type | Pass condition |
|---|---|---|
| `systemOps.projectContextExists` | boolean | `PROJECT-CONTEXT.md` exists at project root and was read at task start |
| `systemOps.manusPlatformInstructionsRead` | boolean | Manus platform project instructions were read before acting |

### brand fields (optional — self-reported)

| Field | Type | Pass condition |
|---|---|---|
| `brand.hexTokensOnly` | boolean | All brand colour values use exact hex tokens — no Tailwind colour names |
| `brand.archivoHeadings` | boolean | Heading font is Archivo loaded from Google Fonts CDN |
| `brand.openSansBody` | boolean | Body font is Open Sans loaded from Google Fonts CDN |
| `brand.bodyTextHex383838` | boolean | Body paragraph text uses `#383838` (not `#232323`) on white/light backgrounds |
| `brand.ctaAccentLime` | boolean | All filled CTA buttons use `#93E07D` (Accent Lime) |
| `brand.noHardcodedGreys` | boolean | No structural `text-gray-*`, `bg-gray-*`, or `bg-white` Tailwind classes used for text or backgrounds outside intentional documentation specimens |

### layout fields (optional — self-reported)

| Field | Type | Pass condition |
|---|---|---|
| `layout.eriPageLayoutInAppTsx` | boolean | `EriPageLayout` wraps all public pages in `App.tsx` only — not in individual page files |
| `layout.showCtaExplicit` | boolean | `showCTA={true}` is passed explicitly on all `EriPageLayout` instances |
| `layout.sourcePropsPresent` | boolean | `source`, `sourceLabel`, and `returnUrl` are all passed when `showCTA={true}` |
| `layout.noStaleComponentNames` | boolean | No stale component names (`EriNavDrawer`, `EriFooter`) anywhere in the codebase |

## overallStatus rules

- `"green"` — all used components are compliant, `cssImportMethod` is `"dist"`, no active violations
- `"amber"` — minor issues: `cssImportMethod` is `"source-workaround"`, or `eriComponentsPin` is more than 2 minor versions behind latest
- `"red"` — any `used: true` component has `compliant: false`, or `knownViolations` contains an entry for a `used: true` component

The tracker computes status independently from the component data and ignores the `overallStatus` field value.

## Manus agent instructions

When working on any ERI project, you MUST update `client/public/bds-meta.json` as part of
your task whenever you:
- Upgrade `@eri/components` to a new version
- Change the CSS import method
- Add, remove, or fix usage of any standard component
- Resolve a known violation
- Complete the Project Alignment Checklist (update `systemOps`, `brand`, `layout` fields)

Update `lastUpdated` to today's date and `updatedBy` to `"Manus"`.

After running the Project Alignment Checklist, set each field to `true` if the check passes,
`false` if it fails (and add an entry to `knownViolations` explaining the failure), or omit
the field if it is not applicable to this project.

## Schema versioning

The `schemaVersion` field tracks which version of this spec the file conforms to. When new
fields are added to the schema, the version is incremented (e.g. `"1.0"` → `"1.1"`).

A machine-readable changelog is published at:
`https://bds.exponentialroadmap.org/bds-meta-changelog.json`

This file lists every schema version, its date, the fields added, and default values for
those fields. AI agents should fetch this changelog at Step 2 of the pre-action checklist
and apply any missing fields automatically.

**Rule for BDS maintainers:** Whenever a new field is added to this spec, you MUST:
1. Increment `schemaVersion` in this spec and in the BDS site’s own `bds-meta.json`.
2. Add a new entry to `client/public/bds-meta-changelog.json` with the new version, date,
   `fieldsAdded` list, and `defaultValues`.
3. Bump the `eri-bds-reference` skill version and upload the updated skill to CDN.
4. Update the `AlignmentTracker.tsx` clipboard template and field reference to the new version.
