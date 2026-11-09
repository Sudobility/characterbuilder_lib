# CLAUDE.md — characterbuilder_lib

Frontend business logic for CharacterBuilder. zustand (peer) stores + the form
metadata + a local prompt-composer re-export. **No network calls of its own** —
the app drives `characterbuilder_client`'s hooks. Pure TS library, built to ESM
with Vite; published to **GitHub Packages**.

## Commands (all verified)
- `bun run typecheck` — `tsc --noEmit`
- `bun run test:unit` — `vitest run` (node env)
- `bun run build` — `vite build` (ESM lib) + `tsc -p tsconfig.build.json` +
  `node scripts/fix-esm-imports.mjs` (rewrites emitted `.d.ts` specifiers)
- `bun run lint` — `eslint src`
- `bun run format` — `prettier --write src/**/*.ts`
- Pre-publish gate: `bun run typecheck && bun run test:unit && bun run build`

## Shape
- `src/form/metadata.ts` — `FEATURE_GROUPS` (the whole comprehensive form) built
  from the `_types` option arrays; control `kind` is one of
  `enum | multi | text | number | slider`; `humanize()` with `LABEL_OVERRIDES`
  for proper nouns/acronyms/symbols; `FEATURE_BY_KEY`, `filledCount`.
- `src/stores/draft-store.ts` — `createDraftStore()` zustand **vanilla** store:
  spec + params + meta, undo/redo history, `mergeSpec`, `randomizeMissing`,
  `prompt()`.
- `src/react/index.ts` — `DraftStoreProvider`, `useDraftStore`, `useDraft(selector)`.
- `src/index.ts` — re-exports the above + `composePrompt`, `castFaceSpec`,
  `buildDistributions`, `ageBandForYears`, `resolveAgeBand` from `_types`.

## Rules / conventions
- The form is data-driven: to add a feature, add it in `_types`, then add one line
  to the right group in `metadata.ts`. The app renders it generically. A test
  asserts every `FEATURE_GROUPS` key is a valid `FaceSpec` field.
- Keep prompt composition in `_types` (`composePrompt`); lib only re-exports it.
- Measured (`slider`, mm/%) controls supersede their legacy categorical fields;
  `draft-store` clears the old field when the measured one is set, and
  `upgradeLegacyLipMeasurements` migrates old drafts on `load`/`mergeSpec`.
- `applyFemaleFacialHairRule` is applied on every spec mutation (keep it live).
- Tests run in the `node` vitest environment (vanilla store + metadata; no DOM).
- `react`, `zustand`, `@tanstack/react-query` are **peers** and are `external` in
  the Vite build — never bundle them.

## Dependency resolution (important)
- `@sudobility/*` deps resolve from **GitHub Packages** via normal version ranges
  (`.npmrc` maps `@sudobility:registry=https://npm.pkg.github.com`; install needs
  a GitHub token with `read:packages`). There is **no** bun `link:` setup.
- For local cross-repo dev, `vite.config.ts` / `vitest.config.ts` auto-alias the
  `@sudobility/characterbuilder_{types,client}` imports to a sibling checkout's
  `src/index.ts` when present, else fall back to the published `node_modules`
  copy. No manual linking step.
- CI (`.github/workflows/ci-cd.yml`) calls the shared `johnqh/workflows`
  unified-cicd with `publish-target: github`.
