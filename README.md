# @sudobility/characterbuilder_lib

Frontend business logic for CharacterBuilder — the glue between
`@sudobility/characterbuilder_client` and the app. It owns the editor's form
metadata, the working-draft store, and a local prompt preview. It makes **no
network calls of its own**; the app drives `_client`'s hooks.

## What's in it

- **`FEATURE_GROUPS`** (`src/form/metadata.ts`) — the comprehensive editor's
  structure: features grouped head-to-chin, each with a label, a control `kind`
  (`enum` / `multi` / `text` / `number` / `slider`) and humanized options derived
  from the `_types` option arrays. Also `FEATURE_BY_KEY`, `humanize`,
  `filledCount`, and the `FeatureMeta` / `FeatureGroup` / `FeatureKind` types.
- **`createDraftStore`** (`src/stores/draft-store.ts`) — a zustand **vanilla**
  store for the working FaceSpec: `setFeature` / `mergeSpec` / `setParams` /
  `setMeta`, `undo` / `redo`, `load(character)`, `reset`, `randomizeMissing` (fill
  unset single-choice features for casting variety), and `prompt()` (local
  `composePrompt` preview — no network).
- **React bindings** (`src/react/index.ts`) — `DraftStoreProvider` +
  `useDraftStore` + `useDraft(selector)`.
- Re-exports **`composePrompt`**, `castFaceSpec`, `buildDistributions`,
  `ageBandForYears`, `resolveAgeBand` from `_types` so the app imports them from
  one place.

## Install

Published to **GitHub Packages**, not the public npm registry. The `.npmrc` here
maps `@sudobility:registry=https://npm.pkg.github.com`; consumers need the same
mapping plus a GitHub token with `read:packages`.

```bash
bun install
```

`react`, `zustand`, and `@tanstack/react-query` are **peer** dependencies — the
app provides them.

## Scripts

```bash
bun run typecheck    # tsc --noEmit
bun run test:unit    # vitest run (node environment)
bun run build        # vite lib build (ESM) + .d.ts + fix-esm-imports
bun run lint         # eslint src
bun run format       # prettier --write src/**/*.ts
bun run clean        # rimraf dist

# the pre-publish gate:
bun run typecheck && bun run test:unit && bun run build
```

There is no app to "run" — this is a library consumed by the CharacterBuilder
app.

## Local development across the sibling repos

When checked out next to `characterbuilder_types` and `characterbuilder_client`,
`vite.config.ts` / `vitest.config.ts` automatically alias the `@sudobility/*`
imports to the siblings' `src/index.ts` (falling back to the published packages in
`node_modules` otherwise). No manual linking step is required.

Modeled on `screenwriter_lib` (zustand stores), minus the Yjs document session.
