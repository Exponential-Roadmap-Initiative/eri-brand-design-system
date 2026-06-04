# New Project Onboarding — Content Spec & Design
## Date: 4 June 2026 | Status: DRAFT FOR REVIEW

---

## Audit Summary — What Already Exists (Do Not Duplicate)

| Asset | Location | Status |
|---|---|---|
| Skill fetch command (curl) | Machine Instructions → Step 0 | ✅ Exists — reference only |
| PROJECT-CONTEXT.md guidance | Machine Instructions → System Operations | ✅ Exists — reference only |
| bds-meta.json template + schema | Machine Instructions + /tracker | ✅ Exists — reference only |
| @eri/components install command | Standard Components → Install | ✅ Exists — reference only |
| Canonical App.tsx code block | Standard Components → EriPageLayout | ✅ Exists — reference only |
| Contact Us source ID setup | Contact Us Integration section | ✅ Exists — reference only |
| Font self-hosting instructions | Standard Components → GDPR fonts | ✅ Exists — reference only |
| Pre-action checklist | Machine Instructions | ✅ Exists — reference only |
| Asset CDN URLs | Machine Instructions → Asset URL Reference | ✅ Exists — reference only |
| Registered projects table | projectRegistry.ts (used by Tracker) | ✅ Exists — reference only |
| Source ID naming rules | Contact Us Integration section | ✅ Exists — reference only |
| handoff_prompt (full 9-step) | bdsSpec.getSpec endpoint | ✅ Exists — reference only |

---

## Gaps — What Needs to Be Added/Upgraded

### GAP 1: No Track 1 vs Track 2 distinction anywhere on the site
**Where to add:** New /new-project page (the primary purpose of this work)
**What:** A clear decision tree — "Does your project need a database, user accounts, or server-side logic?" → Track 1 or Track 2

### GAP 2: No Manus template selection guide
**Where to add:** New /new-project page
**What:** Which Manus template to use (`web-static` vs `web-db-user`), what features to enable (`db`, `server`, `user`), what the Manus project creation command looks like

### GAP 3: No Track 2 specific guidance (tRPC, Drizzle, OAuth, workspace isolation)
**Where to add:** New /new-project page — Track 2 section
**What:** The Track 2 setup steps that are NOT covered by the existing BDS sections (which focus on @eri/components and brand). These are Manus-platform-specific: template choice, feature flags, auth setup, database schema conventions.

### GAP 4: No single copy-paste Manus project instructions block
**Where to add:** New /new-project page — one for Track 1, one for Track 2
**What:** The exact text to paste into a new Manus project's "Project Instructions" field. Currently the handoff_prompt in bdsSpec.ts is close but not formatted as a ready-to-paste project instructions block.

### GAP 5: No project naming / domain conventions documented
**Where to add:** New /new-project page — shared section
**What:** Domain pattern (`{name}.exponentialroadmap.org`), Manus project name convention, source ID convention, version string format (`V.YYYY.MM.DD`), bds-meta.json `id` field convention.

### GAP 6: handoff_prompt in bdsSpec.ts does not distinguish Track 1 / Track 2
**Where to upgrade:** `server/routers/bdsSpec.ts`
**What:** Add `handoff_prompt_track1` and `handoff_prompt_track2` fields alongside the existing generic `handoff_prompt`. The new /new-project page will expose these as copy-paste blocks.

### GAP 7: Standard Components section has no "Track 1 complete setup checklist"
**Where to upgrade:** `standard-components` section in BrandDesignSystem.tsx — add a numbered checklist subsection
**What:** A numbered 10-step checklist that references the existing subsections (install, CSS import, App.tsx, fonts, bds-meta.json, etc.) in order. The /new-project page will link to this anchor.

---

## New Page Architecture: /new-project

### URL: `https://bds.exponentialroadmap.org/new-project`
### Tab label: "Start a Project"
### Anchor: `#new-project` (top of page)

---

### Page Structure

```
/new-project
├── Page Guide (brief human-readable orientation — 2 sentences)
├── Decision Card (Track 1 vs Track 2 — the single question)
├── Track 1 Section
│   ├── When to use Track 1
│   ├── Manus template: web-static
│   ├── Step-by-step setup checklist (links to existing BDS sections)
│   ├── Copy-paste Manus project instructions block (Track 1)
│   └── Example projects: Exponential Framework, Earth-Aligned AI Lab
├── Track 2 Section
│   ├── When to use Track 2
│   ├── Manus template: web-db-user
│   ├── Step-by-step setup checklist (links to existing BDS sections + new Track 2 steps)
│   ├── Copy-paste Manus project instructions block (Track 2)
│   └── Example project: Professional Services Matrix
└── Shared Section
    ├── Project naming conventions
    ├── Registered ERI projects table (sourced from projectRegistry.ts)
    └── After you build → link to /tracker
```

---

### Page Guide (top of page — human orientation)

> **This page is the starting point for every new ERI web project.**
> It tells a Manus AI agent exactly what to do, step by step, for two project types: Track 1 (static/marketing site) and Track 2 (full-stack application). Humans: use the decision card below to pick a track, then hand the URL to your Manus task.

---

### Decision Card

**Single question:** "Does your project need a database, user accounts, or server-side logic?"

| Answer | Track |
|---|---|
| No — it is a marketing site, content site, or interactive visualisation | **Track 1 — Static Website** |
| Yes — it needs login, data storage, workspaces, or AI features | **Track 2 — Full-Stack Application** |

---

### Track 1 — Static Website

**When to use:** Marketing sites, landing pages, content sites, interactive data visualisations, public-facing tools with no user accounts.
**Examples:** Exponential Framework, Earth-Aligned AI Lab, Crocodile Economics, Taxonomy

**Manus template:** `web-static` (Vite + React + Tailwind 4, no server, no database)

**Setup checklist (10 steps — each step links to the relevant BDS section):**

1. Fetch and read the eri-bds-reference skill → [Machine Instructions #ai-instructions]
2. Create PROJECT-CONTEXT.md → [Machine Instructions → System Operations]
3. Install @eri/components → [Standard Components #standard-components]
4. Add @eri/components CSS import to index.css → [Standard Components → CSS Import]
5. Self-host Archivo + Open Sans fonts → [Standard Components → GDPR Fonts]
6. Wrap App.tsx in EriPageLayout → [Standard Components → EriPageLayout]
7. Add EriHeroSection to homepage → [Standard Components → EriHeroSection]
8. Register a Contact Us source ID → [Contact Us Integration #contact-us]
9. Create client/public/bds-meta.json → [Machine Instructions → bds-meta.json]
10. Run Project Alignment Checklist → [/tracker]

**Copy-paste Manus project instructions (Track 1):**
```
Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work.
Critical: This is a Track 1 ERI static website. Read https://bds.exponentialroadmap.org/new-project#track-1 and follow all instructions before writing any code.
Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.
```

---

### Track 2 — Full-Stack Application

**When to use:** Interactive analytical tools, workspace-based apps, authenticated platforms, AI-powered tools, anything requiring user accounts, data storage, or server-side logic.
**Examples:** Professional Services Matrix, Exponential Platform (Playbook), Earth-Aligned AI Agent

**Manus template:** `web-db-user` (React + Express + tRPC + MySQL/TiDB + Manus OAuth)
**Feature flags to enable:** `db`, `server`, `user`

**Setup checklist (15 steps):**

Steps 1–9 are identical to Track 1 (above).

10. Enable web-db-user features (db, server, user) → Manus webdev_add_feature tool
11. Run `pnpm db:push` to sync the database schema
12. Set up Manus OAuth (protectedProcedure, useAuth hook) → [Standard Components → Auth]
13. Create workspace isolation schema in drizzle/schema.ts
14. Set up user management (invite, roles, admin) → eri-user-management skill
15. Run Project Alignment Checklist → [/tracker]

**Copy-paste Manus project instructions (Track 2):**
```
Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action — it contains canonical values, known errors, and pending work that are lost during context compaction and sandbox resets. If it does not exist, create one before starting work.
Critical: This is a Track 2 ERI full-stack application. Read https://bds.exponentialroadmap.org/new-project#track-2 and follow all instructions before writing any code.
Critical: After completing any task, update PROJECT-CONTEXT.md with new decisions, corrected errors, or newly discovered issues.
Critical: Always follow the ERI development workflow: 1. Research 2. Design 3. Plan and get acceptance 4. Implement 5. Test 6. Iterate
Critical: Apply the exponential-human-ai-collaboration skill to every task in this project.
```

---

### Shared Section — Project Naming Conventions

| Convention | Rule | Example |
|---|---|---|
| Domain | `{name}.exponentialroadmap.org` | `psm.exponentialroadmap.org` |
| Manus project name | kebab-case, descriptive | `eri-professional-services-matrix` |
| Source ID (Contact Us) | lowercase, short, stable | `psm`, `hal`, `taxonomy` |
| Version string | `V.YYYY.MM.DD` | `V.2026.06.04` |
| bds-meta.json id | Same as source ID | `psm` |
| Status badge | ALPHA → BETA → PILOT → LIVE | `BETA` |

---

## Required Upgrades to Existing Sections

### Upgrade 1: bdsSpec.ts — Add track-specific handoff prompts
**File:** `server/routers/bdsSpec.ts`
**Change:** Add `handoff_prompt_track1` and `handoff_prompt_track2` fields to the spec response alongside the existing `handoff_prompt`.

### Upgrade 2: Standard Components — Add numbered setup checklist subsection
**File:** `client/src/pages/BrandDesignSystem.tsx`
**Where:** At the top of the `#standard-components` section, before the install instructions
**Change:** Add a "Track 1 Setup Checklist" numbered list (10 items) that references the existing subsections. This is the canonical checklist that the /new-project page links to.
**Note:** This does NOT duplicate content — it is a navigation index into the existing content.

### Upgrade 3: Machine Instructions — Add Track 1 and Track 2 project instructions blocks
**File:** `client/src/pages/BrandDesignSystem.tsx`
**Where:** In the `#ai-instructions` section, after the existing handoff_prompt display
**Change:** Add two copy-paste blocks: "Track 1 Project Instructions" and "Track 2 Project Instructions". These are the canonical text blocks that go into a new Manus project's instructions field.

---

## Implementation Order

1. Upgrade bdsSpec.ts (add track-specific handoff prompts)
2. Upgrade Standard Components section (add setup checklist)
3. Upgrade Machine Instructions section (add copy-paste project instructions blocks)
4. Build NewProject.tsx page (orchestration layer)
5. Wire route + navigation
6. Update SKILL.md with /new-project URL
7. TypeScript check + checkpoint
