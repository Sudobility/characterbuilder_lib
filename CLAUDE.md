# CLAUDE.md — characterbuilder_lib

Frontend business logic. Layer 4 of five. zustand (peer) stores + the form
metadata + the prompt composer re-export. No network calls of its own — it
drives `characterbuilder_client`'s hooks from the app.

## Shape
- `src/form/metadata.ts` — `FEATURE_GROUPS` (the whole comprehensive form) built
  from the `_types` option arrays; `humanize()` with `LABEL_OVERRIDES` for proper
  nouns/acronyms; `FEATURE_BY_KEY`, `filledCount`.
- `src/stores/draft-store.ts` — `createDraftStore()` zustand vanilla store:
  spec + params + meta, undo/redo history, `randomizeMissing`, `prompt()`.
- `src/react/index.ts` — `DraftStoreProvider`, `useDraftStore`, `useDraft(selector)`.
- `src/index.ts` — re-exports the above + `composePrompt` from `_types`.

## Rules
- The form is data-driven: to add a feature, add it in `_types`, then add one line
  to the right group in `metadata.ts`. The app renders it generically.
- Keep prompt composition in `_types` (`composePrompt`); lib only re-exports it.
- Tests run in the `node` vitest environment (vanilla store + metadata; no DOM).

## Local linking (important)
The `@sudobility/characterbuilder_*` deps use bun's **`link:`** protocol (global
local links), because bun cannot resolve a multi-level relative `file:` graph.
On a fresh checkout: run `bun link` inside `characterbuilder_types`,
`characterbuilder_client`, and `characterbuilder_lib`, then in each consumer run
`bun link @sudobility/characterbuilder_types` (and `_client` for lib/app). Swap to
published version ranges before release.
