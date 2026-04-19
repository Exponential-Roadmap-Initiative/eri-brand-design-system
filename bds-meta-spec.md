# bds-meta.json — ERI Project BDS Alignment Metadata Spec
# Version: 1.0 | 2026-04-19

## Purpose
Each ERI project publishes a static `bds-meta.json` file at the root of its deployed site
(e.g. `https://psm.exponentialroadmap.org/bds-meta.json`). The BDS Alignment Tracker
fetches this file from all known projects and renders a live compliance dashboard.

## File location in each project
`client/public/bds-meta.json`

This file is served at `https://{project-domain}/bds-meta.json` automatically by Vite's
static file serving.

## Schema

```json
{
  "schemaVersion": "1.0",
  "project": "PSM",
  "displayName": "Planetary Stewardship Monitor",
  "url": "https://psm.exponentialroadmap.org",
  "eriComponentsPin": "v2.10.0",
  "cssImportMethod": "dist",
  "components": {
    "EriAppHeader":   { "used": true,  "showCTA": "true",  "compliant": true  },
    "EriPageLayout":  { "used": true,  "compliant": true  },
    "EriHeroSection": { "used": true,  "compliant": true  },
    "EriNavDrawer":   { "used": true,  "compliant": true  },
    "EriFooter":      { "used": true,  "compliant": true  }
  },
  "knownViolations": [],
  "overallStatus": "green",
  "lastUpdated": "2026-04-19",
  "updatedBy": "Manus"
}
```

## Field definitions

| Field | Type | Description |
|---|---|---|
| `schemaVersion` | string | Always `"1.0"` for this version |
| `project` | string | Short project code, e.g. `"PSM"`, `"HAL"`, `"Taxonomy"` |
| `displayName` | string | Full human-readable project name |
| `url` | string | Canonical deployed URL |
| `eriComponentsPin` | string | Current `@eri/components` pin, e.g. `"v2.10.0"` or `"main"` |
| `cssImportMethod` | string | `"dist"` (correct) or `"source-workaround"` (legacy) or `"none"` (not set up) |
| `components` | object | One entry per standard component |
| `components[name].used` | boolean | Whether the component is used in this project |
| `components[name].showCTA` | string | For EriAppHeader only: the value passed to showCTA prop |
| `components[name].compliant` | boolean | Whether usage matches BDS spec |
| `knownViolations` | string[] | List of known non-conformant patterns, e.g. `["showCTA={!isAuthenticated}"]` |
| `overallStatus` | string | `"green"`, `"amber"`, or `"red"` |
| `lastUpdated` | string | ISO date of last update, e.g. `"2026-04-19"` |
| `updatedBy` | string | `"Manus"` or team member name |

## overallStatus rules

- `"green"` — all used components are compliant, no known violations, cssImportMethod is `"dist"`
- `"amber"` — minor issues: cssImportMethod is `"source-workaround"`, or eriComponentsPin is more than 2 minor versions behind latest
- `"red"` — any component has `compliant: false`, or knownViolations is non-empty

## Manus agent instructions

When working on any ERI project, you MUST update `client/public/bds-meta.json` as part of
your task whenever you:
- Upgrade `@eri/components` to a new version
- Change the CSS import method
- Add, remove, or fix usage of any standard component
- Resolve a known violation

Update `lastUpdated` to today's date and `updatedBy` to `"Manus"`.
