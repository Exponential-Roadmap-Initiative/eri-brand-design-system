# Why BDS Instructions Fail to Land — Root-Cause Analysis

**Version:** 1.0 (2026-05-27)  
**Author:** Manus (AI agent)  
**Audience:** ERI BDS maintainers

---

## Summary

The ERI Brand Design System skill (`eri-bds-reference`) is comprehensive and technically accurate. The problem is not what it says — it is how it is structured for AI consumption. AI agents do not read documents the way humans do. They process tokens sequentially, weight earlier content more heavily, lose context across long spans, and are highly sensitive to the phrasing of individual sentences. The BDS skill has six structural failure modes that cause agents to misread, ignore, or contradict its instructions even when those instructions are technically correct.

---

## Failure Mode 1 — Volume overwhelm

**What happens:** The skill is 1,810 lines across 22 top-level sections. An AI agent reading it in full consumes a large fraction of its available context window before it begins implementing. By the time it reaches the implementation phase, the earlier sections have been compressed or dropped from the active context.

**Evidence:** The `headerTheme="auto"` rule appears at line 194 (EriAppHeader props table), line 212 (EriPageLayout props table), line 229 (Setup Checklist step 6), and line 250 (canonical App.tsx pattern). Despite four appearances, agents implementing the Trust Centre omitted it — because by the time they wrote `App.tsx`, the props table context had been compressed.

**Fix:** The most critical rules must appear at the point of use, not only in a reference section. The canonical `App.tsx` pattern (line 235–262) is the single most-read section — it must be self-contained and include every required prop with an inline comment explaining why it is required.

**Status:** Partially fixed in v3.7.0 — the canonical App.tsx pattern now includes `headerTheme="auto"` with a comment. The deeper fix is to reduce total skill length by moving historical/changelog content out of the skill and into `CODEBASE-CONTEXT.md`.

---

## Failure Mode 2 — Status notes read as prohibitions

**What happens:** Descriptive statements about the current state of the codebase are read as prescriptive rules. The sentence "Only the BDS site currently uses `headerTheme='auto'`" was written as an observation but was interpreted as "other projects must not use it."

**Evidence:** This is the direct cause of the Trust Centre `headerTheme` issue. The sentence appeared in a blockquote (visually emphasised), which amplified its authority. The agent read it as a prohibition.

**Root cause:** AI agents do not distinguish between "this is how things currently are" and "this is how things must be." Any sentence in a skill is treated as a rule unless explicitly labelled otherwise.

**Fix:** Never write status observations in a skill. Either remove them, or rewrite them as forward-looking rules. "Only the BDS site currently uses X" should be "Use X whenever Y condition is met — all ERI apps should adopt it."

**Status:** Fixed in v3.7.0 — the sentence was removed and replaced with the positive rule.

---

## Failure Mode 3 — Contradictions between sections

**What happens:** Two sections of the skill give different instructions for the same situation. The agent follows whichever it reads last, or whichever is phrased more assertively.

**Evidence (all fixed as of v3.7.0):**
- Section 3 (Setup Checklist, line 229): "Pass `showThemeToggle={true}` and `headerTheme="auto"`" — correct.
- Section 4 (Common Mistakes table, line 1313): "Only pass `headerTheme='auto'` if the app explicitly needs a white header in light mode" — contradicts Section 3 by framing it as an opt-in special case.
- Section 5 (blockquote, line 1303): "Only the BDS site currently uses `headerTheme='auto'`" — contradicts Sections 3 and 4.

**Root cause:** The skill has grown incrementally. Each new section was added without auditing existing sections for contradictions. The skill has no single canonical statement for each rule — the rule is spread across multiple sections, and they have drifted.

**Fix:** Each rule must have one canonical location. All other mentions must reference that location, not restate the rule. The canonical location for `headerTheme` is the EriPageLayout props table — all other sections should say "see the EriPageLayout props table."

**Status:** Partially fixed. The contradictions are resolved, but the skill still has multiple restatements of the same rule across sections. A full deduplication pass is needed.

---

## Failure Mode 4 — Missing specificity at the point of decision

**What happens:** The skill explains what a prop does but not when to use it. The agent must infer the decision rule, and infers incorrectly.

**Evidence:**
- `showThemeToggle` prop description (pre-v3.7.0): "Show the dark/light mode toggle in the header." — This tells the agent what the prop does, not that it is required on every ERI app.
- `headerTheme` prop description (pre-v3.7.0): "`'auto'`: white header in light mode, `#232323` in dark mode." — This describes the behaviour but does not say "always pair with `showThemeToggle={true}`."

**Root cause:** Prop tables are written as API references, not as decision guides. An API reference describes what a prop does; a decision guide says when and why to use it.

**Fix:** Every prop that has a non-obvious usage rule must include that rule inline in the prop table description. The fix in v3.7.0 added "**Pass `true` on every ERI app**" to `showThemeToggle` and "**Pass `'auto'` whenever `showThemeToggle={true}`**" to `headerTheme`. This is the correct pattern.

**Status:** Fixed in v3.7.0 for `showThemeToggle` and `headerTheme`. The same audit should be applied to all other props with non-obvious usage rules.

---

## Failure Mode 5 — Implicit requirements

**What happens:** A feature requires multiple steps, but only one step is documented. The agent completes the documented step and considers the feature done.

**Evidence:**
- Dark/light mode requires: (1) FOLC-prevention script in `index.html`, (2) canonical CSS token block in `index.css`, (3) `ThemeContext.tsx` with `eri-theme` key, (4) `ThemeProvider` wrapping the app, (5) `showThemeToggle={true}` on `EriPageLayout`, (6) `headerTheme="auto"` on `EriPageLayout`. The skill documents all six steps, but they are spread across three sections (Setup Checklist, Cross-Site Theme System, and the props tables). An agent reading only the Setup Checklist sees steps 5 and 6 but not steps 1–4.
- The CSS import (`@import "@eri/components/dist/eri-components.css"`) is documented in the Setup Checklist but is also the single most common failure point. If an agent skips step 2 of the checklist, every component is invisible — but there is no error message, only a blank page.

**Root cause:** Multi-step features are documented across multiple sections. The agent must synthesise instructions from several places to complete the feature correctly. Any missed section produces a partial implementation with no visible error.

**Fix:** For every multi-step feature, add a "Complete implementation checklist" at the point where the agent is most likely to start implementing (typically the Setup Checklist or the canonical App.tsx pattern). Each item in the checklist must link to the full documentation section. The checklist for dark/light mode should be a single numbered list: (1) FOLC script, (2) CSS tokens, (3) ThemeContext, (4) ThemeProvider, (5) showThemeToggle, (6) headerTheme.

**Status:** Partially addressed. The Setup Checklist step 10 says "read the Cross-Site Theme System section" but does not enumerate the sub-steps. A self-contained dark mode checklist would be more reliable.

---

## Failure Mode 6 — The skill is the wrong format for AI agents

**What happens:** The skill is written as a human-readable reference document. AI agents are better served by a format closer to a decision tree or a flat numbered checklist.

**Evidence:** The Trust Centre agent read the skill but still omitted `headerTheme="auto"`. This is not a comprehension failure — the agent understood what the prop does. It is a decision failure — the agent did not know it was required in this context.

**Root cause:** A reference document answers "what does X do?" A decision guide answers "given that I am doing Y, what must I do?" The skill is primarily a reference document. Agents implementing a new project need a decision guide.

**The deeper problem:** The skill is read once at the start of a task and then compressed out of context. By the time the agent writes `App.tsx`, it is working from a compressed summary of the skill, not the full text. The canonical `App.tsx` pattern is the only part of the skill that survives compression intact — because it is code, and code is preserved more faithfully than prose.

**Fix:** The canonical `App.tsx` pattern must be the single authoritative implementation guide. Every required prop must appear in it with an inline comment. Every required file (FOLC script, CSS tokens, ThemeContext) must be referenced from it. An agent that copies the canonical pattern verbatim and follows its comments should produce a correct implementation without reading any other section.

**Status:** The canonical App.tsx pattern was improved in v3.7.0. It now includes `headerTheme="auto"` with a comment. The FOLC script, CSS tokens, and ThemeContext are still documented only in the Cross-Site Theme System section — they should be referenced from the canonical pattern as well.

---

## Summary table

| # | Failure mode | Root cause | Fix applied | Completeness |
|---|---|---|---|---|
| 1 | Volume overwhelm | Skill is 1,810 lines; early context is compressed before implementation | Canonical App.tsx pattern is self-contained | Partial — skill still too long |
| 2 | Status notes read as prohibitions | "Only X currently uses Y" interpreted as "others must not use Y" | Removed the sentence; replaced with positive rule | Complete |
| 3 | Contradictions between sections | Incremental growth without cross-section audit | All three contradictions resolved | Partial — deduplication pass needed |
| 4 | Missing specificity at point of decision | Prop tables describe behaviour, not usage rules | Added "Pass X on every ERI app" to critical props | Complete for headerTheme/showThemeToggle |
| 5 | Implicit requirements | Multi-step features documented across multiple sections | Setup Checklist references Cross-Site Theme section | Partial — no self-contained dark mode checklist |
| 6 | Wrong format for AI agents | Reference document vs. decision guide | Canonical App.tsx pattern improved | Partial — FOLC/CSS/ThemeContext not referenced from pattern |

---

## Recommended next actions

**High priority (will prevent recurrence of the Trust Centre issue):**

1. **Add a self-contained dark mode implementation checklist** to the Setup Checklist section — six numbered steps, each with a one-line description and a link to the full section.

2. **Reference FOLC script, CSS tokens, and ThemeContext from the canonical App.tsx pattern** — add three comment lines pointing to the required files.

3. **Audit all prop tables** for props with non-obvious usage rules — add inline decision guidance to each one using the pattern established for `showThemeToggle` and `headerTheme`.

**Medium priority (will reduce future drift):**

4. **Move all changelog/historical content from the skill to `CODEBASE-CONTEXT.md`** — the skill should contain only current rules, not the history of how they evolved. This would reduce the skill from ~1,810 lines to ~800 lines.

5. **Add a "Contradictions audit" step to the skill release process** — before uploading a new version, run a grep for every rule that appears in more than one section and verify the statements are consistent.

**Low priority (structural improvement):**

6. **Rewrite the skill as a decision tree** — replace the reference-document structure with a flat numbered checklist keyed to implementation tasks: "If you are implementing a new ERI app, do steps 1–14. If you are updating an existing app, do steps 15–20." This format survives context compression better than prose.

---

## What the Trust Centre–specific document does differently

The `TRUST-CENTRE-IMPLEMENTATION.md` document in this repository addresses failure modes 1, 4, 5, and 6 directly:

- **Failure mode 1 (volume):** 14 numbered steps, ~300 lines. The agent reads the whole document before starting.
- **Failure mode 4 (specificity):** Every prop has a "Why" explanation in the table. `headerTheme="auto"` has a dedicated row explaining exactly what breaks without it.
- **Failure mode 5 (implicit requirements):** All six dark mode steps are in a single numbered sequence (Steps 4–7). No cross-referencing required.
- **Failure mode 6 (format):** The document is a decision guide, not a reference. Every step answers "what do I do now?" not "what does X do?"

The document does not replace the BDS skill — it is a project-specific accelerator that removes the need for the agent to synthesise instructions from a 1,810-line reference document.
