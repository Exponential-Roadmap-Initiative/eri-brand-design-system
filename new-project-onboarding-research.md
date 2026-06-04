# New Project Onboarding — Research Notes
## Date: 4 June 2026

---

## What the user wants

A new section (or page) on the BDS site that a brand-new Manus AI task can be pointed to and immediately understand:

- **Track 1**: Static/marketing website (like Exponential Framework site)
- **Track 2**: Full-stack web application with auth, database, user management (like PSM)

The agent reads the BDS site, picks a track, and gets everything needed to start building correctly — no back-and-forth, no missing pieces.

---

## Current state of the BDS site

### What exists

1. **Introduction section** — "Two Paths A/B" cards (A = brand only, B = building an app). These are broad and don't map to Track 1 / Track 2.
2. **"For Manus AI Agents — Read This First"** callout — 5 bullet points, generic, no track distinction.
3. **Standard Components section** — install instructions, component docs, setup checklist (10 steps). This covers the @eri/components package but assumes you already know what kind of project you're building.
4. **Machine Instructions section** — AI-readable colour tokens, typography rules, component specs, quick-reference cards. Dense reference material, not an onboarding guide.
5. **Project Alignment Tracker** — compliance checking tool. Post-build, not pre-build.

### What is missing

- **No "Start a New ERI Project" page or section** — there is no dedicated onboarding entry point for new Manus tasks.
- **No Track 1 vs Track 2 distinction** — the site doesn't distinguish between a static marketing site and a full-stack app. Both use @eri/components but the Manus template, project setup, and feature set are completely different.
- **No copy-paste Manus project instructions** — there is no ready-made project instructions block that a new task can use verbatim.
- **No template selection guide** — which Manus template to use (web-static vs web-db-user), what features to enable, what the first 10 commands are.
- **No project naming/slug/domain conventions** — no guidance on how to name a new ERI project.
- **No bds-meta.json seed for new projects** — the tracker has a seed template but it's buried in the compliance tool, not in the onboarding flow.

---

## The three reference sites — what track they are

| Site | URL | Track | Key characteristics |
|---|---|---|---|
| Exponential Framework | framework.exponentialroadmap.org | Track 1 | Static React SPA, no auth, no DB, @eri/components, EriPageLayout, EriHeroSection, interactive matrix |
| Earth-Aligned AI Lab | earth-aligned-ai-lab.exponentialroadmap.org | Track 1 | Static React SPA, no auth, no DB, @eri/components, marketing/landing site |
| Professional Services Matrix | psm.exponentialroadmap.org | Track 2 | Full-stack: React + Express + tRPC + MySQL/TiDB, Manus OAuth, workspace isolation, user management, AI features |

---

## Track 1 — Static/Marketing Website

**Manus template:** `web-static` (no server, no DB, no auth)
**Purpose:** Marketing sites, content sites, interactive data visualisations, public-facing landing pages
**Examples:** Exponential Framework, Earth-Aligned AI Lab, Trust Centre, Taxonomy

**What a Track 1 project needs:**
- Vite + React + Tailwind 4
- @eri/components installed and imported
- EriPageLayout wrapping the app
- EriHeroSection on the homepage
- Self-hosted fonts (Archivo + Open Sans WOFF2)
- bds-meta.json
- No backend, no database, no OAuth

**Manus project instructions block (Track 1):**
```
Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action.
Critical: This is a Track 1 ERI static website. Follow the Track 1 setup guide at https://bds.exponentialroadmap.org/new-project#track-1
```

---

## Track 2 — Full-Stack Application

**Manus template:** `web-db-user` (React + Express + tRPC + MySQL + Manus OAuth)
**Purpose:** Interactive analytical tools, workspace-based apps, authenticated platforms
**Examples:** PSM, Earth-Aligned AI Lab (future), Exponential Playbook

**What a Track 2 project needs:**
- Everything in Track 1 PLUS:
- Express server + tRPC routers
- Drizzle ORM + MySQL/TiDB schema
- Manus OAuth (protectedProcedure, useAuth hook)
- Workspace isolation (multi-tenant)
- User management (invite, roles, admin)
- bds-meta.json with full schema

**Manus project instructions block (Track 2):**
```
Critical: At the start of every task, run: curl -sL https://bds.exponentialroadmap.org/api/skill/latest > /home/ubuntu/skills/eri-bds-reference/SKILL.md && echo "Skill updated" — then read /home/ubuntu/skills/eri-bds-reference/SKILL.md in full before taking any action
Critical: At the start of every task, check whether a PROJECT-CONTEXT.md file exists in the project root. If it does, read it in full before taking any other action.
Critical: This is a Track 2 ERI full-stack application. Follow the Track 2 setup guide at https://bds.exponentialroadmap.org/new-project#track-2
```

---

## Design proposal: New "Start a New Project" page

### Option A: New top-level tab in the BDS site navigation
- Add a third tab: "Start a Project" (alongside "Brand Design System" and "Project Alignment Tracker")
- URL: /new-project
- Contains: Track 1 and Track 2 setup guides, copy-paste project instructions, setup checklists

### Option B: New section within the existing BDS page
- Add a "New Project Setup" section to the existing BDS page
- Accessible via the left nav under "WEB & DEVELOPMENT"
- Less disruptive, but harder to link to directly

### Option C: Dedicated standalone page at /start
- Separate from the main BDS page
- Optimised purely for AI agent consumption
- Can be linked to directly from project instructions

**Recommendation: Option A** — a new top-level tab "Start a Project" at /new-project. This is:
- Easy to link to from Manus project instructions
- Clearly separated from the reference documentation
- Can be structured as a step-by-step wizard/guide
- Consistent with the existing tab pattern (BDS + Tracker)

---

## What the new page should contain

### Hero / entry point
- Clear "Track 1" and "Track 2" cards with decision criteria
- Decision question: "Does your project need a database, user accounts, or server-side logic?"

### Track 1 section
1. When to use Track 1
2. Manus template: web-static
3. Step-by-step setup checklist (10 steps)
4. Copy-paste Manus project instructions block
5. Copy-paste bds-meta.json seed
6. Example: Exponential Framework site

### Track 2 section
1. When to use Track 2
2. Manus template: web-db-user
3. Step-by-step setup checklist (15 steps)
4. Copy-paste Manus project instructions block
5. Copy-paste bds-meta.json seed
6. Example: PSM application

### Shared elements
- Project naming conventions (slug, domain, display name)
- Registered projects table (BDS, HAL, PSM, Trust, Taxonomy, Framework)
- "After you build" — link to Project Alignment Tracker

---

## Key decisions needed from user before implementation

1. **New tab vs new section vs standalone page?** (Recommendation: new tab)
2. **Should the page be AI-optimised (dense, structured) or human-readable (visual, cards)?** (Recommendation: both — human-readable UI with copy-paste blocks for AI)
3. **Should Track 1 include a full App.tsx template?** (Recommendation: yes — verbatim copy-paste)
4. **Should Track 2 include a full App.tsx + routers.ts template?** (Recommendation: yes)
5. **Should there be a "project naming" section?** (Recommendation: yes — domain pattern, slug convention)
