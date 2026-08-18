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

---

## v3.38.0 — Skill sync fixes: deletion, hot-reload, unified implementation (2026-06-18)

### Context

Three gaps were discovered in the skill sync system:
1. Deleted skills stayed in `SKILLS_METADATA` forever — the sync had no removal logic.
2. After every sync, the server had to be restarted before changes were visible in the running process.
3. The tRPC `syncMetadataFromFiles` procedure and the agent REST endpoint (`/api/agent/skill-sync`) had duplicate implementations that had diverged.

Additionally, `eri-ef-app` and `eri-cpr-app` were registered by the heartbeat auto-sync (which ran at 09:10 on 2026-06-18) but `eri-exponential-framework` (the renamed/replaced skill) was not removed because the deletion logic did not exist yet.

### Changes in this session

**1. Deletion logic (Pass 3 in `syncMetadataFromFilesImpl()`)**

A new Pass 3 was added after the existing Pass 1 (update) and Pass 2 (register new). Pass 3 iterates `SKILLS_METADATA` and removes any entry whose skill directory is absent from `/home/ubuntu/skills/` or whose `SKILL.md` has `retired: true` in its frontmatter. Removal writes back to `skills.ts` and to `skills-registry.json`. The result message now includes "Removed N skill(s): id1, id2".

**2. Hot-reload registry via `skills-registry.json`**

After every sync, `syncMetadataFromFilesImpl()` writes the updated registry to `skills-registry.json` at the project root. A new `getRegistry()` helper reads from this file at request time (falling back to the hardcoded `SKILLS_METADATA` constant if the file does not exist). All `list`, `get`, `getContent`, and `logImprovement` procedures now call `getRegistry()` instead of reading `SKILLS_METADATA` directly. This means sync changes are visible immediately without any server restart. `skills-registry.json` is added to `.gitignore` (runtime artefact, not source).

**3. Unified tRPC procedure**

The tRPC `syncMetadataFromFiles` adminProcedure previously contained a full duplicate of the sync logic (200+ lines) that had not received the deletion or hot-reload fixes. It now delegates entirely to `syncMetadataFromFilesImpl()` — one line. Both the sync button on `/skills` and the agent REST endpoint now run identical code.

**4. Result message updated**

The "Restart the dev server for changes to take effect" message is replaced with "Reloading registry — changes will be visible immediately." The result now includes a `removedCount` and `removed` array alongside the existing `changesCount` and `registeredCount`.

### Architecture note — why `eri-exponential-framework` is still visible

At checkpoint time, the `eri-exponential-framework` directory still exists in `/home/ubuntu/skills/` in this sandbox. The Manus platform removes deleted project skills from sandboxes on hibernation/resume, not immediately. Once the sandbox hibernates and resumes (or a new task starts), the directory will be gone and the next sync will remove the entry from `SKILLS_METADATA` and `skills-registry.json` automatically.

### Test status

Server running cleanly. 13 TypeScript errors are pre-existing false positives from the stale `typescript@5.6.3` watcher (missing `lib.esnext.d.ts`) — not introduced by this session. The sync endpoint returns `{"success":true}` with correct counts.

### Checkpoint

`f4f9f6bf` — Skill sync fixes complete.


---

## v3.40.2 — sync_skills.sh localhost routing fix (2026-06-22)

**Trigger:** Screenshot from exponential platform task showed two errors: (1) "sync script returned HTML instead of JSON", (2) "Invalid agent secret".

**Root cause analysis:**

Issue 1 — HTML instead of JSON: `sync_skills.sh` had an auto-detect block that checked if `localhost:3000` was reachable and, if so, used `http://127.0.0.1:3000` as the BDS API URL. Every ERI project sandbox runs its own dev server on `:3000`. The script was therefore sending the POST to the project's own server (e.g. the exponential platform app), which returned its index HTML page instead of a JSON API response.

Issue 2 — Invalid agent secret: The secret in the skill (`407421fe...`) matches the current environment value exactly. The "Invalid agent secret" error was a downstream consequence of Issue 1 — the HTML response was being parsed as a failed API call, not an authentication failure. The secret was never actually wrong.

**Fix applied:**

- Removed the auto-detect block from `sync_skills.sh`. The script now always uses `https://bds.exponentialroadmap.org` unless `BDS_API_URL` is explicitly set in the environment.
- Bumped `eri-skill-creator` to v2.11.0.
- Updated description to document the fix.
- Ran sync — confirmed `✓ Improvements logged: 1`.

**Files changed:**
- `/home/ubuntu/skills/eri-skill-creator/scripts/sync_skills.sh` — removed localhost auto-detect
- `/home/ubuntu/skills/eri-skill-creator/SKILL.md` — version 2.10.0 → 2.11.0, description updated

**Pending:**
- Checkpoint + publish to deploy to bds.exponentialroadmap.org
- User must click "Add to My Skills" on the eri-skill-creator card to update the Manus platform registry


---

## v3.40.3 — CDN bootstrap for sync_skills.sh + publish updated project instructions (2026-06-22)

**Trigger:** Parallel task continued reporting "Invalid agent secret" even after eri-skill-creator v2.11.0 was published. Root cause: the parallel task sandbox had the old skill bundle (with the localhost auto-detect bug) and could not self-heal because the Manus platform delivers a snapshot of the skill at install time, not a live fetch.

**Fix 1 — CDN bootstrap step added to eri-skill-creator Step 8:**

Step 8 now always bootstraps the latest `sync_skills.sh` from CDN before running it:

```bash
curl -sL https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ/sync_skills_cdfa4082.sh \
  -o /home/ubuntu/skills/eri-skill-creator/scripts/sync_skills.sh && chmod +x ...
```

This means even a sandbox with a stale skill bundle will always run the correct script. `eri-skill-creator` bumped to v2.12.0. BDS sync confirmed: `✓ Improvements logged: 1`.

**Fix 2 — Published project instructions updated:**

The live API (`/api/project-instructions/latest`) was serving v2026.06.11 (4,048 chars, id=90001) — missing `pkill`, `CODEBASE-SESSIONS.md`, and the new Tier 3 skills. New version v2026.06.22 (5,410 chars, id=120001) inserted and published directly via DB script. Verified:

- `pkill`: ✓
- `compacted_history`: ✓
- `eri-cpr-app`: ✓
- `CODEBASE-SESSIONS`: ✓

**Files changed:**
- `/home/ubuntu/skills/eri-skill-creator/SKILL.md` — v2.11.0 → v2.12.0, CDN bootstrap added to Step 8
- `/home/ubuntu/skills/eri-skill-creator/scripts/sync_skills.sh` — uploaded to CDN (stable webdev URL)
- `CODEBASE-CONTEXT.md` — Published project instructions version updated to v2026.06.22

**Pending:**
- Checkpoint + publish BDS site
- User must click "Add to My Skills" on the eri-skill-creator v2.12.0 card

---

## v3.41.0 — Controlled BDS Skill Releases and Launch Containment (2026-08-18)

### Security containment

- Disabled the former externally callable agent skill-sync endpoint. It now returns a stable `410 SKILL_SYNC_PAUSED` response and no longer accepts a body-carried shared secret.
- Removed the exposed credential from distributable skill guidance. `BDS_AGENT_SECRET` is now a managed environment secret only; the secret was rotated through the BDS secure secret workflow.
- Disabled the hourly unattended synchronisation and made the legacy sync facade non-destructive.
- Restricted the BDS metadata proxy to registered HTTPS `bds-meta.json` endpoints, with redirect rejection and JSON content-type validation.
- Removed generated `.manus/db` artefacts from repository tracking and added ignore coverage.

### Controlled release workflow

- Added `skill_release_proposals`, append-only `skill_release_events`, and immutable `skill_registry_releases` tables. The migration uses explicit MySQL-safe foreign-key names after an overlong generated identifier caused a partial migration; the final tables and six expected foreign keys were verified in the database.
- Added admin-only `skillReleases` procedures for bounded proposal listing, proposal inspection, creation, approval/rejection, and approved-only promotion. Proposal state is terminal after rejection or release.
- Added the administrator-only **Release queue** in `/skills`. It supports proposal metadata, current-content prefill, side-by-side comparison, a line-level added/removed diff, reviewer decisions, release history, and explicit promotion.
- Promotion writes an immutable registry snapshot, appends a release event, updates the runtime cache, and the server hydrates that cache from the latest release snapshot on startup so a restart cannot silently discard an approved release.
- Updated `eri-skill-creator` to v2.15.0: Step 8 now produces a BDS release request rather than attempting external synchronisation or credential use.

### Verification

- Focused Vitest suite passed: 6 files / 12 tests covering the paused agent route, metadata allowlist, release lifecycle, non-admin denial, approval audit event, approved-only promotion, snapshot creation, and runtime registry persistence.
- Development preview confirmed the public Skills library remains available and the administrator Release queue and New proposal form render without creating test data.

### Remaining operator action

- Publish the latest checkpoint before relying on the containment and release workflow in production.
- Rotate the database credential as a separate, controlled maintenance action; the agent credential is already rotated. Do not restore the legacy external synchronisation route.
