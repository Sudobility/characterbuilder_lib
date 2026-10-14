# @sudobility/characterbuilder_lib

Frontend business logic for CharacterBuilder — the glue between
`characterbuilder_client` and the app.

- **`FEATURE_GROUPS`** (form/) — the comprehensive editor's structure: features
  grouped head-to-chin, each with a label, a control `kind` (`enum`/`multi`/
  `text`/`number`) and humanized options derived from the `_types` option arrays.
  `FEATURE_BY_KEY`, `humanize`, `filledCount` helpers.
- **`createDraftStore`** (stores/) — a zustand vanilla store for the working
  FaceSpec: `setFeature`/`setParams`/`setMeta`, `undo`/`redo`, `load(character)`,
  `reset`, `randomizeMissing` (fill unset features for casting variety), and
  `prompt()` (local `composePrompt` preview — no network).
- **React** (react/) — `DraftStoreProvider` + `useDraftStore` + `useDraft(selector)`.
- Re-exports **`composePrompt`** so the app imports it from one place.

```bash
bun run typecheck && bun run test:unit && bun run build
```

Modeled on `screenwriter_lib` (zustand stores), minus the Yjs document session.
