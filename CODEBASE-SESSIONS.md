# ERI Brand Design System — Session Log

**Rolling session log.** Contains the last 4–6 sessions. Older sessions are archived to `CODEBASE-CONTEXT-archive.md`.

**READ THIS AFTER `CODEBASE-CONTEXT.md`.** After compaction, re-read `CODEBASE-CONTEXT.md` first (static reference), then this file for recent decisions.

---


---

## v3.16.0 — Skills Governance System: Usage Logging + Health Dashboard (2026-06-10)

### Changes in this session

**1. CODEBASE-CONTEXT.md migration guard (project instructions)**

The project instructions Fixed Section "CODEBASE-CONTEXT.md guard" was updated to include a one-time self-healing migration step:

> *"If it does not exist but PROJECT-CONTEXT.md does, rename it first: `mv PROJECT-CONTEXT.md CODEBASE-CONTEXT.md`"*

This ensures existing projects with `PROJECT-CONTEXT.md` automatically migrate on the next task run — no manual intervention needed per project. Published to API at 5,488 chars (69% of 8,000 budget).

**2. Version History refetch bug fixed**

`saveVersionMutation.onSuccess` in `ProjectInstructions.tsx` was not calling `versionsQuery.refetch()` after saving. Fixed — Version History now updates immediately after clicking "Mark as Applied".

**3. skill_usage_logs DB table**

New table added to `drizzle/schema.ts`:
```
skill_usage_logs (id, logged_at, task_description, skills_read_json, agent_note)
```
- `skills_read_json`: JSON array of `{ skillId, verdict }` where verdict is `"helpful" | "stale" | "missing"`
- Append-only, no foreign keys (skill IDs are strings, not DB rows)
- Created via `webdev_execute_sql` (migration runner failed due to pre-existing tables; SQL applied directly)

**4. New tRPC procedures in `server/routers/skills.ts`**

- **`skills.logUsage`** (protectedProcedure) — any authenticated user can submit a post-task usage log
- **`skills.listUsageLogs`** (protectedProcedure) — returns up to 100 logs, newest first

**5. Skills page UI additions**

- **Log Usage button** in admin toolbar — opens `LogUsageDialog` (multi-skill selector with verdict per skill)
- **Skill Health section** at bottom of page — shows `HealthDashboard` component with:
  - Summary row: skills used / flagged stale / never logged
  - "Recently used" table: per-skill last-used date + helpful/stale/missing counts
  - "Never logged" chip list: skills with no usage data yet
  - Empty state when no logs exist yet

**6. Test status**

36/36 tests passing. TypeScript: 0 real errors (13 false positives from stale typescript@5.6.3 watcher).

### DB mock pattern (important for future tests)

The `insert().values()` mock in `skills.test.ts` now uses `Object.assign(Promise.resolve([{ insertId: 42 }]), { onDuplicateKeyUpdate: ... })` to support both:
- `insert().values()` (direct await — used by `logUsage`)
- `insert().values().onDuplicateKeyUpdate()` (chained — used by `saveProjectInstructions`)

### Remaining pending work

- [ ] Update Current tab by running sync prompt in a new task (eri-skills-orchestrator SKILL.md needs the post-task usage log instruction added to the task-type lookup table)
- [ ] Rename PROJECT-CONTEXT.md → CODEBASE-CONTEXT.md in this repository (the file already exists as CODEBASE-CONTEXT.md — confirm the old file is gone)

---

## Session update — 2026-06-10 (continued)

### CODEBASE-CONTEXT.md migration — complete

All `PROJECT-CONTEXT.md` references have been updated across the ERI skills ecosystem:

| Skill | Old version | New version | Change |
|---|---|---|---|
| `eri-bds-reference` | 3.11.0 | 3.11.1 | Step 1 now uses `CODEBASE-CONTEXT.md` with `mv` rename fallback; CDN updated |
| `eri-trpc` | 3.0.0 | 3.0.1 | Section heading updated |
| `data-source-integration` | 1.1.0 | 1.1.1 | Layer 10 note updated |
| `eri-code-quality` | retired | — | Retired skill, not updated |

- CDN URL for `eri-bds-reference` v3.11.1: `https://files.manuscdn.com/user_upload_by_module/session_file/310519663319595517/zuJbeOCbKWpbbXcH.md`
- `server/_core/index.ts` `SKILL_LATEST_URL` updated to point to v3.11.1
- `SKILLS_METADATA` versions updated in `server/routers/skills.ts`
- "Sync from skill files" run — 6 fields updated in DB

### Version History bug — fixed

`saveVersionMutation.onSuccess` now calls `versionsQuery.refetch()` so the Version History list updates immediately after clicking "Mark as Applied".

### Usage logging + Health dashboard — complete

- `skill_usage_logs` DB table created (id, userId, taskDescription, skillsRead JSON, verdict enum, improvementNote, loggedAt)
- `logUsage` and `listUsageLogs` tRPC procedures added to `skills.ts`
- `LogUsageDialog` component added to Skills page (admin toolbar button)
- `HealthDashboard` section added at the bottom of Skills page (shows last-used, verdict breakdown, never-logged chips)
- 36/36 tests passing

### Remaining pending work

None — all items from this session are complete.

---

## Session update — 2026-06-10 (workflow redesign)

### Project Instructions page — workflow-based redesign

The Project Instructions page (`/project-instructions`) was redesigned to be workflow-driven rather than tab-driven.

**PipelineStatus component** added above the Manager card:
- 4-step horizontal bar: Generate → Apply to Manus → Publish to API → Agent Verified
- Each step derives live status from existing queries (`versionsQuery`, `currentInstructionsQuery`)
- Step 1: always green unless char count > 8,000
- Step 2: green if any version applied; amber if no versions yet
- Step 3: green if latest applied version has `publishedAt`; amber if not yet published
- Step 4: green if `syncedAt` > latest `appliedAt`; amber if stale or no sync
- Each step has an action button (jumps to relevant tab or triggers action directly)

**Stale-sync audit issue** added as computed `useMemo`:
- Compares `syncedRow.instructionsText` vs `CURRENT_INSTRUCTIONS`
- If DB text differs: generates diff summary (added/removed lines, char delta, why it matters)
- Integrated into `allIssues` array alongside static `KNOWN_ISSUES`

**Tab reordering**: Generator → Status → History → Audit
- "Current" renamed to "Status"
- Generator moved first (starting point of workflow)

**Issues banner**: green with ✅ when 0 issues, amber with ⚠️ when issues exist

**Sync prompt redesigned**: agent now edits `CURRENT_INSTRUCTIONS` in source file directly (no auth needed) + optional DB sync

### Known state after this session

- DB-stored instructions text (3,435 chars) is stale vs `CURRENT_INSTRUCTIONS` (5,488 chars)
- This shows as a Medium audit issue in the Status tab until sync prompt is run
- **To fix**: click "Copy sync prompt" on the Status tab → paste into new ERI Shared Dev Assets task → run it
- The agent will edit `CURRENT_INSTRUCTIONS` in `ProjectInstructions.tsx` with the live 5,488-char text

### Checkpoint
- `30e02ce2` — workflow redesign complete

---

## Session update — 2026-06-10 (compact rewrite)

### Project Instructions compact rewrite — complete

The project instructions were compacted from 5,488 chars (68.6% of budget) to **3,427 chars (42.8% of budget)** — saving 2,061 chars.

**Changes made:**

1. **All 22 Tier 2 + Tier 3 `readWhen` values** in `SKILLS_METADATA` (`server/routers/skills.ts`) shortened to concise trigger phrases (e.g. `"New router, new procedure, procedure type decision, quality gate before writing code."` instead of the long sentence).

2. **`FIXED_SECTIONS` array** in `ProjectInstructions.tsx` collapsed from 6 separate "Critical:" sections to a single `S_ERI_WORKFLOW` section (1,284 chars):
   - Old: `S_BDS_UPDATE` (285) + `S_PROJECT_CONTEXT` (570) + `S_CHECKPOINT` (480) + `S_DEV_WORKFLOW` (257) + `S_INSTRUCTIONS_UPDATE` (220) = 1,812 chars in 5 sections
   - New: single 8-step numbered workflow where step 1 = "Load current state" (all 4 startup actions combined)
   - The optional `S_FRAMEWORK` section (530 chars, defaultOn: false) is unchanged

3. **Generator assembly** updated: removed the redundant `skillsBlock` scan header (was `"Critical: At the start of every task, scan the skills..."`) since that instruction is now embedded in step 1 of the workflow. `skillsBlock` now emits just the tier blocks directly.

4. **`CURRENT_INSTRUCTIONS` constant** updated to match the new Generator output exactly (verified ✅ MATCH at 3,427 chars).

5. **`SYNC_PROMPT`** updated to reference the new `Critical: Follow this workflow...` starting text.

### Known state after this session

- `CURRENT_INSTRUCTIONS` in `ProjectInstructions.tsx` now matches the Generator output (3,427 chars)
- DB-stored instructions text is still the old 5,488-char version (stale) — shows as Medium audit issue in Status tab
- **To fix**: click "Copy sync prompt" on the Status tab → paste into new ERI Shared Dev Assets task → run it
- After sync: the Status tab will show 0 issues and the stale-sync audit issue will clear
- **Then**: click "Mark as Applied" in Generator tab (add change note "compact rewrite: 5488→3427 chars, workflow-first structure"), then click "Publish to API" in Version History

### Checkpoint

- `f5c74a04` — compact rewrite complete, 36/36 tests passing

---

## v3.17.0 — Governance page upgrade (2026-06-11)

### Changes in this session

**1. Renamed `Philosophy.tsx` → `Governance.tsx`**

- File: `client/src/pages/Philosophy.tsx` → `client/src/pages/Governance.tsx`
- Route was already `/governance` and tab label was already "Governance" — only the filename and component name were stale.
- `App.tsx` import and `<Route>` component prop updated accordingly.
- `Philosophy.tsx` deleted.
- Rationale: the old filename created naming ambiguity between "ERI philosophy" and the governance operating model. `Governance.tsx` is unambiguous.

**2. Fixed stale Tier 2 example in `TierModelCards`**

- `eri-code-quality` (retired skill) → `eri-trpc` in the Tier 2 example field.

**3. Added orchestrator explanation to the skill ecosystem section**

- New callout card below the tier model intro paragraph explaining that `eri-skills-orchestrator` is the Tier 1 skill whose sole job is to tell Manus which other skills to read for each task type.

**4. Updated task lifecycle to show 8-step workflow**

- `TaskLifecycleFlow` component updated from 6 nodes to 8 nodes.
- The six development steps (Research → Design → Plan → Implement → Test → Iterate) are now steps 2–7 of the 8-step workflow.
- Step 1: "Load state" (fetch BDS skill, read CODEBASE-CONTEXT.md, scan skills).
- Step 8: "Close" (update CODEBASE-CONTEXT.md, log skill usage).
- The eight step cards below the flow diagram now describe all 8 steps.

**5. Added "The three-layer governance model" section**

- New Section 4 (inserted between "skill ecosystem" and "task lifecycle").
- Explains the three layers from `eri-skills-orchestrator`:
  - Layer 1 — Activation: orchestrator identifies which skills apply
  - Layer 2 — Accountability: usage logs close the feedback loop
  - Layer 3 — Curation: Health Dashboard surfaces what needs attention
- Includes a callout: "The accountability layer matters most."
- Links to `/skills` Health Dashboard.

**6. Updated project instructions section**

- Bullet list updated to reflect the compact 8-step workflow-first format.
- Link updated from `/skills` to `/project-instructions`.

### Test status

36/36 tests passing (no new server-side code added). TypeScript: 0 real errors (13 false positives from stale typescript@5.6.3 watcher).

### Checkpoint

`2f813fca` — Governance page upgrade complete.

---

## v3.18.0 — External-facing landing page & site-wide readability (2026-06-11)

### Context

The site previously had no front door. An external visitor — a partner, collaborator, or member company sent the link — would land on the Brand Design System, a 96,000-pixel technical reference document with no explanation of what the site is, who built it, or what the seven tabs collectively represent. This session adds a proper landing page and makes every page readable to a non-technical external audience.

### Route change — IMPORTANT

The Brand Design System has moved from `/` to `/brand-design-system`. Any bookmarks or shared links to `/` now land on the Overview landing page, not the BDS reference. This was an intentional decision approved by the team.

| Old route | New route | Component |
|---|---|---|
| `/` | `/brand-design-system` | `BrandDesignSystem.tsx` |
| (new) | `/` | `Overview.tsx` |

### Changes in this session

**1. New `Overview.tsx` landing page at `/`**

- File: `client/src/pages/Overview.tsx` (new)
- Partner-facing landing page. Tells the full story of the hub in plain language without assuming technical background.
- Sections: Hero (ERI_HERO_IMAGE_DEFAULT, showScrollIndicator), "What this hub is" (52,000+ companies, self-improving, 5× advantage), "The story" (4-step compounding loop), "What is in this hub" (7-section card map), "About ERI", "Get started" CTA.
- All seven hub sections are described with audience guidance ("Start here if you want to understand the system as a whole", etc.).
- BDS compliant: semantic tokens, left-border accent cards, Accent Lime eyebrows, no emoji, British English.

**2. `App.tsx` route wiring updated**

- `Overview` added as import and `<Route path="/">` component.
- `BrandDesignSystem` moved to `<Route path="/brand-design-system">`.
- `TabNav` updated: "Overview" added as first tab; "Brand Design System" now links to `/brand-design-system`.

**3. `BdsNavDrawer.tsx` updated**

- "On this page" section anchor links remain (BDS-specific, still useful on `/brand-design-system`).
- "Other pages" section renamed to "All pages" and now includes Overview (`/`) as the first link, with Brand Design System linking to `/brand-design-system`.
- Page order: Overview → Brand Design System → Governance → Skills → Project Instructions → Team Guide → Project Alignment Tracker → New Web Project.

**4. All page guides rewritten for external audience**

| Page | Old guide | New guide |
|---|---|---|
| Governance | Internal instructions about reading sections | "This is how ERI ensures every task is executed with the same rigour… No technical background required." |
| Skills | Internal filter instructions | "These 25 knowledge modules are ERI's accumulated expertise, encoded so it cannot be lost and improves automatically after every task." |
| Project Instructions | Internal pipeline instructions | "The standing brief that every Manus AI agent reads before starting any ERI task." |
| Brand Design System | Internal implementation instructions | "The single source of truth for all visual, verbal, and component decisions across ERI digital products." |

**5. `index.html` meta description updated**

- Old: "Design and Development Hub — brand reference, governance, skills registry, and project instructions for ERI AI-assisted development."
- New: "The ERI Design and Development Hub — where ERI builds for climate accountability. Explore the governance model, skills registry, brand design system, and project instructions that power ERI's AI-native operations across a platform covering 52,000+ companies."

**6. Stale internal links fixed**

- `AlignmentTracker.tsx` line 986: `href="/"` → `href="/brand-design-system"` (BDS reference link).
- `NewProject.tsx` line 82: `eri-code-quality` → `eri-trpc` (retired skill reference in TRACK2_INSTRUCTIONS).

### Test status

No new server-side code. TypeScript: 0 real errors (13 false positives from stale typescript@5.6.3 watcher).

### Checkpoint

`616476e6` — External-facing landing page and site-wide readability upgrade complete.

---

## Session record — v3.19.0 (2026-06-11)

### Framing corrections (checkpoint acd0c2b2)

Corrected framing across Overview.tsx and Governance.tsx. ERI is driven by climate science and planetary boundaries — but engages companies through the lens of business growth, resilience, and competitive advantage. "Climate accountability" framing was removed; it is for politicians, not companies. The 52,000+ companies figure refers to companies in the Exponential Platform data lake — a proof point of scale and business opportunity, not a compliance database.

### Post-mortem governance fixes (after context compaction event)

Following a governance failure (context compaction mid-session causing the agent to answer from stale memory), four fixes were applied:

1. **eri-skills-orchestrator SKILL.md** bumped to v1.1.0: added `eri-report-finder` and `eri-pdf-pipeline` to the T4 signal set in the task-type table.
2. **eri-report-finder SKILL.md** bumped to v4.1.0: added zero-results guardrail in Section 8 — if `corporateReportUrls` returns zero rows, assume the query is wrong before assuming no data exists.
3. **eri-pdf-pipeline SKILL.md** bumped to v2.0.0: added zero-results guardrail in Anti-Patterns section (same logic as above).
4. **ProjectInstructions.tsx** `CURRENT_INSTRUCTIONS` and `FIXED_SECTIONS`: added compaction re-read rule — if `<compacted_history>` appears in context, treat it as a session restart and re-read CODEBASE-CONTEXT.md before answering any system-state question.
5. **server/routers/skills.ts** `SKILLS_METADATA`: bumped eri-skills-orchestrator to 1.1.0, eri-report-finder to 4.1.0.

### Governance page upgrade (checkpoint 3bc04c02)

**Anchor navigation**

Added `GovernanceAnchorNav` component — a sticky pill nav bar that tracks the active section via `IntersectionObserver`. Eight anchors: How it works, System components, Self-improving, Skill ecosystem, How it improves, Task lifecycle, Human operator guide (marked Essential/lime), Collaboration principles, Further reading.

**Plain-language opening frame**

Added a "What this is — in plain language" block before the four system components section. Uses the employee handbook analogy: every task reads the handbook, every completed task makes the handbook better, the system compounds over time.

**Section renames**

- "Four governance layers" → "The four system components"
- "Three-layer governance model" → "How the system improves"

**Managing AI working memory section** (id="working-memory")

New section between task lifecycle and project instructions. Three columns:

| Risk | How the agent governs it | Human operator guide |
|---|---|---|
| Context compaction (working memory compressed mid-session) | Re-read CODEBASE-CONTEXT.md rule; phase-close discipline | One focused request per message; wait for phase-close signal |
| Session reset (sandbox hibernates) | CODEBASE-CONTEXT.md persists; skills persist | Send screenshots instead of browser navigation |
| Stale memory (answering from pre-compaction context) | Compaction re-read rule in project instructions | Paste text instead of asking agent to read files |

The "Human operator guide" column is visually distinguished with lime accent and an "Essential" badge.

**Step 8 annotation**

Step 8 (Close) sub-text updated from "Update codebase memory, log skills" to "Update context memory, log skills. Makes the next session recoverable." — making the phase-close discipline rationale explicit in the task lifecycle diagram.

**Section ids added**

All 12 section ids are now present: `how-it-works`, `system-components`, `self-improving`, `skill-ecosystem`, `how-it-improves`, `task-lifecycle`, `working-memory`, `project-instructions`, `agent-bridge`, `technical-debt`, `collaboration`, `further-reading`.

### Known issues

- 13 TypeScript false positives from stale `typescript@5.6.3` watcher — confirmed not real errors.
- ProjectInstructions.tsx parse error (line 63) was from an earlier session; file is now syntactically correct.

### Test status

No new server-side code. TypeScript: 0 real errors (13 false positives from stale typescript@5.6.3 watcher).

### Checkpoint

`3bc04c02` — v3.19.0 Governance page upgrade complete.

---

## v3.20.0 — eri-bds-reference split + context reduction (2026-06-11)

### Changes in this session

**1. `eri-bds-reference` split into two skills**

The 124 KB / 1,887-line `eri-bds-reference` skill was split into:

- **`eri-bds-reference` v4.0.0** (23 KB / 445 lines) — compact always-on Tier 1 skill. Contains: system operations checklist (Steps 0–2), pre-action decision table, canonical colour tokens, typography rules, navigation tier decision, hero layout rules, dark mode enforcement (CSS token block + semantic token table), CTA/language/anti-AI design patterns, project alignment checklist (S/T/B/C/A), bds-meta.json schema pointer, and BDS section index.

- **`eri-bds-components` v1.0.0** (28 KB / 626 lines) — new Tier 2 skill. Contains: `@eri/components` install + version auto-sync, all six standard component prop tables (EriPageLayout, EriAppHeader, EriAppFooter, EriHeroSection, EriStatusBadge, EriContactUsButton), canonical App.tsx pattern, nav overlay/drawer implementation (NavDrawer.tsx verbatim), hero section manual fallback, web app header anatomy, favicon spec, hero images CDN table, key CDN asset URLs, footer standard, Contact Us integration, cross-site theme system (ThemeContext.tsx verbatim, FOLC script), layout wrapper pattern, and bds-meta.json full schema.

**2. Exponential Framework matrix pruned from `eri-bds-reference`**

The full 5×4 Exponential Framework matrix (previously lines 450–498 of the old skill) was removed entirely. It belongs in `eri-exponential-framework`, not in the brand reference skill.

**3. `eri-skills-orchestrator` updated**

- Added `eri-bds-components` to Tier 2 in the auto-generated skill index block
- Added task type T6b: "ERI component or app build (using `@eri/components`)" with signals: EriPageLayout, EriHeroSection, EriAppHeader, EriAppFooter, nav overlay, nav drawer, hero section, contact us integration, bds-meta.json, new ERI app, ERI web app, @eri/components

**4. `SKILLS_METADATA` in `server/routers/skills.ts` updated**

- `eri-bds-reference` version bumped to `4.0.0` with updated description (compact, always-on)
- New `eri-bds-components` entry added at Tier 2 (after `eri-bds-site`)

**5. `ProjectInstructions.tsx` updated**

- `CURRENT_INSTRUCTIONS` constant updated to include `eri-bds-components` in Tier 2
- `generateSkillTriggers()` will automatically include it in generated instructions (reads from SKILLS_METADATA)

**6. `CODEBASE-CONTEXT.md` archived**

- Session records v2.15.0–v3.15.0 (1,141 lines) moved to `CODEBASE-CONTEXT-archive.md`
- Main file reduced from 104 KB / 1,491 lines → 67 KB / 883 lines (36% reduction)

### Context load reduction achieved

| Asset | Before | After | Saving |
|---|---|---|---|
| `eri-bds-reference` SKILL.md | 124 KB | 23 KB | −101 KB |
| `CODEBASE-CONTEXT.md` | 104 KB | 67 KB | −37 KB |
| `eri-bds-components` SKILL.md (new) | — | 28 KB | +28 KB |
| **Net saving per compaction** | **228 KB** | **118 KB** | **−110 KB** |

### What to do next

- **Publish the updated project instructions** via the `/project-instructions` page (the generator now includes `eri-bds-components` in Tier 2)
- **Publish the updated `eri-bds-reference` v4.0.0 skill** via the BDS Skills page → "↻ Sync from skill files" button (admin only) — this pushes the compact skill to the `/api/skill/latest` endpoint that agents curl at task start
- **Register `eri-bds-components`** on the BDS Skills page (it is in SKILLS_METADATA but not yet in the live skills registry)
- **Log skill usage** on the BDS Skills page for: `eri-skill-creator`, `eri-bds-reference`, `eri-skills-orchestrator`

### Archive note

`CODEBASE-CONTEXT-archive.md` contains the full session history from project inception through v3.15.0. It is not read by agents — it is a historical record only. Do not delete it.

---

## v3.21.0 — 2026-06-11 — eri-skill-creator compliance pass on eri-bds-reference + eri-bds-components

### What was done

Retroactively applied the eri-skill-creator §2 writing principles and §4 tier rules to both skills written in v3.20.0.

**`eri-bds-reference` v4.1.0** (445 → 260 lines, 23 KB → 15 KB):
- Removed verbatim CSS token block (`:root` + `.dark`) — replaced with pointer to `bdsSpec.getSpec → semanticTokens.cssBlock`
- Removed verbatim `@font-face` template — pointer to `bdsSpec.getSpec → typography.fontFaceTemplate` is sufficient
- Removed GDPR font setup steps — moved to `eri-bds-components` new-app setup checklist
- Removed BDS section index (25-row table) — low value, high token cost
- Removed card accent rgba values — hex values in the table are sufficient

**`eri-bds-components` v1.1.0** (627 → 399 lines, 28 KB → 19 KB):
- Moved `NavDrawer.tsx` verbatim code block → `templates/NavDrawer.tsx`
- Moved `ThemeContext.tsx` verbatim code block → `templates/ThemeContext.tsx`
- Moved `bds-meta.json` full schema example → `references/bds-meta-template.json`
- Moved manual hero fallback code block → `references/hero-fallback.jsx`
- Moved footer standard code block → `references/footer-standard.jsx`
- SKILL.md body now contains only instructional content (prop tables, rules, decision tables)

**`SKILLS_METADATA` updated:** eri-bds-reference → v4.1.0, eri-bds-components → v1.1.0 (in `server/routers/skills.ts`)

### Net context saving per compaction (cumulative from v3.19.0)

| Asset | v3.19.0 | v3.21.0 | Saving |
|---|---|---|---|
| `eri-bds-reference` SKILL.md | 124 KB | 15 KB | −109 KB |
| `CODEBASE-CONTEXT.md` | 104 KB | ~70 KB | −34 KB |
| `eri-bds-components` (new) | — | 19 KB | +19 KB |
| **Net** | **228 KB** | **104 KB** | **−124 KB** |

### What to do next

- **Publish updated project instructions** via `/project-instructions` page
- **Sync skills to BDS API** via Skills page → "↻ Sync from skill files" (pushes v4.1.0 and v1.1.0 to `/api/skill/latest`)
- **Log skill usage** for: `eri-skill-creator`, `eri-bds-reference`, `eri-bds-components`, `eri-skills-orchestrator`

---

## v3.22.0 — 2026-06-11 — Full eri-skill-creator compliance: Steps 6–10 + Post-task Reflection

### What was done

Completed all remaining eri-skill-creator steps that were skipped in v3.20.0 and v3.21.0.

**Step 6 — Evaluate:**
- `eri-bds-reference`: description undertriggering on maintenance tasks ("fixes and audits" not just new builds); Project Alignment Checklist HARD STOP missing
- `eri-bds-components`: `showThemeToggle`/`headerTheme` most-common-error callout buried in prop table; no pointer to New ERI App Setup Checklist at top

**Step 7 — Improve:**
- `eri-bds-reference` v4.1.0 → v4.2.0: updated description to include "fixes and audits"; added closing HARD STOP for Project Alignment Checklist
- `eri-bds-components` v1.1.0 → v1.2.0: added blockquote most-common-error callout; added top-of-skill pointer to setup checklist

**Step 8 — Register:** SKILLS_METADATA updated to v4.2.0 and v1.2.0 in `server/routers/skills.ts`

**Step 9 — Sync project instructions:** `CURRENT_INSTRUCTIONS` in `ProjectInstructions.tsx` already correct (eri-bds-components at line 81). User completed publish workflow on `/project-instructions` page.

**Step 10 — HARD STOP:** Both skill files sent as attachments. User confirmed both added to Manus platform and ERI Shared Dev Assets project.

**Post-task Reflection:**
- `eri-skill-creator` v2.4.0 → v2.5.0: added "Treating Step 10 as optional" to §10 Known Failure Patterns — encodes the real failure from this session (closing the task at Step 9 without sending the attachment)
- SKILLS_METADATA updated: eri-skill-creator → v2.5.0

### What to do next

- **Sync skills to BDS API** via Skills page → "↻ Sync from skill files" (pushes v4.2.0, v1.2.0, v2.5.0)
- **Log improvement** on BDS Skills page for `eri-skill-creator` v2.5.0: "Added 'Treating Step 10 as optional' to §10 Known Failure Patterns"
- **Log improvement** on BDS Skills page for `eri-bds-reference` v4.2.0: "Added closing HARD STOP for Project Alignment Checklist; updated description to cover fixes and audits"
- **Log improvement** on BDS Skills page for `eri-bds-components` v1.2.0: "Added most-common-error callout for showThemeToggle/headerTheme; added pointer to setup checklist at top"
- **Send eri-skill-creator v2.5.0 as attachment** (Step 10 for the skill-creator improvement itself)

---

## v3.23.0 — Automated Skill Sync: /api/agent/skill-sync endpoint + sync_skills.sh (2026-06-11)

### Problem solved

The eri-skill-creator process required manual button clicks on the BDS Skills page to:
1. Log improvement entries (click "Log Improvement" on each skill card)
2. Sync SKILLS_METADATA from SKILL.md frontmatters (click "Sync Metadata")

This was never going to happen reliably. The fix: a pre-shared-secret REST endpoint that agents call directly.

### Changes

**`server/_core/env.ts`** — Added `agentSecret: process.env.BDS_AGENT_SECRET` to the env object.

**`server/_core/index.ts`** — Added `POST /api/agent/skill-sync` endpoint:
- Authenticates via `BDS_AGENT_SECRET` in request body (no session cookie required)
- Calls `syncMetadataFromFilesImpl()` from `server/routers/skills.ts`
- Inserts improvement log entries into `skill_improvements` table for each `{ skillId, version, summary, taskContext }` in the `improvements` array
- Returns `{ success, syncResult, logged, loggedSkills, errors }`

**`server/routers/skills.ts`** — Extracted `syncMetadataFromFilesImpl()` as a named export (was inline in the tRPC mutation). The tRPC mutation now calls the exported function.

**`/home/ubuntu/skills/eri-skill-creator/scripts/sync_skills.sh`** — New script. Usage:
```bash
BDS_AGENT_SECRET="<secret>" \
bash /home/ubuntu/skills/eri-skill-creator/scripts/sync_skills.sh \
  --skill eri-bds-reference --version 4.2.0 --summary "What changed and why" \
  --skill eri-skill-creator  --version 2.6.0 --summary "What changed and why" \
  --task-context "Session name or date"
```

**`/home/ubuntu/skills/eri-skill-creator/SKILL.md`** v2.6.0 — Step 8 now calls the script instead of Path A/B manual editing. Post-task reflection step 4 calls the script instead of "click Log Improvement". Known Failure Patterns updated.

### BDS_AGENT_SECRET

Set in the BDS project environment via `webdev_request_secrets`. Value is a 64-char hex string. Agents must ask the user for the secret value when running the script from a non-BDS task (it is not in the shared project files — it is an env var in the BDS webdev project).

### Test result

```
Calling http://localhost:3000/api/agent/skill-sync ...
✓ Sync: SKILLS_METADATA is already in sync with the skill files.
✓ Improvements logged: 1
```

### Remaining pending work

- [ ] Publish BDS site (click Publish button in Management UI) — includes the new /api/agent/skill-sync endpoint
- [ ] Add BDS_AGENT_SECRET to the eri-skill-creator SKILL.md instructions as a note about where to find it (Secrets panel in BDS Management UI)

---

## v3.24.0 — CODEBASE-SESSIONS.md split + automated skill sync (2026-06-11)

### What was done
- Split CODEBASE-CONTEXT.md into static reference (539 lines) + CODEBASE-SESSIONS.md (rolling log)
- Added sessionLogExists field to bds-meta.json schema v1.4 in AlignmentTracker.tsx and bdsMetaTypes.ts
- Updated /tracker System Ops section to describe CODEBASE-SESSIONS.md as part of Step 1
- Updated project instructions compaction re-read rule to reference both files
- Updated eri-skill-creator v2.7.0: session-close archiving rule in Post-task Reflection, Known Failure Pattern for wrong file, archive rule at >500 lines
- Added POST /api/agent/skill-sync REST endpoint to BDS server (requires BDS_AGENT_SECRET)
- Added sync_skills.sh to eri-skill-creator/scripts/ with auto-detect (127.0.0.1:3000 check)
- Fixed auto-detect: uses curl 127.0.0.1:3000 not nc (nc not available in Manus sandbox)
- Improvement log entries written via sync script (no manual button clicks)

### Key decisions
- Session records go in CODEBASE-SESSIONS.md, never in CODEBASE-CONTEXT.md
- Static reference file must never grow — only update if a canonical value permanently changes
- Archive CODEBASE-SESSIONS.md when it exceeds ~500 lines (keep last 4-6 sessions)
- sync_skills.sh defaults to auto-detect; BDS_API_URL env var overrides if needed
- Production endpoint only works after Publish — auto-detect always uses localhost in BDS task

### Files changed
- CODEBASE-CONTEXT.md — trimmed to static reference only (539 lines)
- CODEBASE-SESSIONS.md — created (this file)
- client/src/data/bdsMetaTypes.ts — added sessionLogExists to SystemOpsCompliance
- client/src/pages/AlignmentTracker.tsx — scoring, template, field reference, Step 1 description
- client/src/pages/ProjectInstructions.tsx — updated compaction rule and Step 8 close rule
- server/_core/index.ts — added POST /api/agent/skill-sync endpoint
- server/_core/env.ts — added BDS_AGENT_SECRET
- server/routers/skills.ts — extracted syncMetadataFromFilesImpl as named export
- skills/eri-skill-creator/SKILL.md — v2.7.0
- skills/eri-skill-creator/scripts/sync_skills.sh — new file with auto-detect

### Remaining pending work
- [ ] Publish BDS site (click Publish button in Management UI)
- [ ] Add eri-skill-creator v2.7.0 to ERI Shared Dev Assets project skills (Step 10)

---

## v3.25.0 — Tab reorder (2026-06-11)

### What was done
- Reordered tab bar to match Overview page card order: Overview → Governance → Skills → Project Instructions → Brand Design System → Project Alignment Tracker → New Web Project → Team Guide
- Confirmed ProjectInstructions.tsx parse error at 15:25:48 was stale (fixed by HMR at 15:26:08)

### Files changed
- client/src/App.tsx — tabs array reordered

## v3.26.0 — Security & Integrity page (2026-06-11)

**What was done:**
Added a new /security page (SecurityIntegrity.tsx) to the BDS site, making the eri-security skill visible to human operators in the same way the Governance page makes the task lifecycle visible. Also added a Security and Integrity section to the /governance page.

**Files changed:**
- client/src/pages/SecurityIntegrity.tsx — new top-level page (created)
- client/src/App.tsx — import + /security route + TabNav entry
- client/src/components/BdsNavDrawer.tsx — Security and Integrity link in All pages section
- client/src/pages/Overview.tsx — Security and Integrity card added to HUB_SECTIONS (red accent #ef4444)
- client/src/pages/Governance.tsx — new Section 9 Security and Integrity + anchor nav entry (essential: true); also fixed pre-existing missing AnchorSection interface

**SecurityIntegrity.tsx structure:**
Eight collapsible sections mirroring the eight control domains in the eri-security skill:
1. Why security is a governance domain (plain-language frame, always visible)
2. The eight control domains + status model (defaultOpen)
3. Authentication and session security (OAuth, JWT, TOTP)
4. Workspace data isolation — four enforcement layers + stakeholder Q&A (defaultOpen)
5. API security hardening (rate limiting, Helmet CSP dev/prod split, SSRF)
6. Audit logging (minimum event set table, alert patterns, admin access)
7. The eri-security skill (Tier 3 placement, nine sections, how to invoke)
8. The Trust site (what it is/is not, customer conversation guide)

**Governance assessment:**
Security and Integrity is correctly surfaced in /governance as a new section (Section 9) with essential: true in the anchor nav. Rationale: security is a first-class governance domain. The section is a summary with a Read the full guide link to /security.

**Accent colour:** #ef4444 (canonical for security category in Skills page).

**TypeScript:** 0 errors introduced. Pre-existing AnchorSection interface missing in Governance.tsx was fixed as a side effect.

## v3.27.0 — Bug fix: skill-sync HTTP 500 in production (2026-06-12)

**Root cause:**
syncMetadataFromFilesImpl() and the registerSkill tRPC procedure both used:
  const filePath = path.resolve(import.meta.dirname, 'skills.ts');

In development, import.meta.dirname = /home/ubuntu/eri-brand-design-system/server/routers/
so the path resolved correctly to skills.ts.

In production, esbuild bundles everything into dist/index.js, so import.meta.dirname = /usr/src/app/dist/
The path resolved to /usr/src/app/dist/skills.ts which does not exist -> ENOENT -> HTTP 500.

**Fix:**
Replaced import.meta.dirname with process.cwd() in both locations:
  const filePath = path.resolve(process.cwd(), 'server/routers/skills.ts');

process.cwd() is always the project root (/home/ubuntu/eri-brand-design-system in dev, /usr/src/app in prod).
The TypeScript source file server/routers/skills.ts is present in both environments.

**Files changed:**
- server/routers/skills.ts line 411 (syncMetadataFromFilesImpl)
- server/routers/skills.ts line 903 (registerSkill procedure)

**Verification:** TypeScript: 0 new errors. Local dev server responds correctly (401 on wrong secret, not 500).
After checkpoint/redeploy, the skill-sync endpoint will work from external project tasks.
