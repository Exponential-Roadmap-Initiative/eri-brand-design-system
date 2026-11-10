# @eri/components changelog

The `version` in `package.json` is the only version number. Each release is one merge on BDS main, one version bump,
one entry here and one tag, `eri-components-v<version>`, on the merge commit.

## Unreleased: design tokens (design-system step 1)

The version is set at merge: the next free minor after #2, #3 and #4.

- **Added:** `tokens/tokens.json`, the one source of ERI design values, in the W3C Design Tokens Community Group format:
  primitives (raw brand values), semantic tokens (refer to primitives) and component tokens (refer to semantic tokens),
  each with a light and a dark value.
- **Added:** built files `dist/tokens.css` (light on `:root`, dark on `.dark`), `dist/tokens.ts` (`eriTokens`,
  `EriTokenName`) and `dist/token-names.json`; exports `@eri/components/tokens.css` and `@eri/components/tokens`.
- **Added:** `scripts/build-tokens.mjs` and `scripts/check-tokens.mjs` (`npm run build:tokens`, `npm run check`), and the
  repository's first workflow, `.github/workflows/eri-components.yml`.
- **No name changes:** the semantic names the components already read (`--background`, `--primary`, `--space-1…6`,
  `--shadow-sm` and the rest) keep their names and values.
- **BDS site:** `client/src/index.css` takes its values from `dist/tokens.css`. Body text is now Open Sans, as the written
  rules say; it was Archivo.
