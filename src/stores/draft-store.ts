import { createStore, type StoreApi } from 'zustand/vanilla';
import {
  applyFemaleFacialHairRule,
  composePrompt,
  type Character,
  type FaceSpec,
  type GenerationParams,
} from '@sudobility/characterbuilder_types';
import { FEATURE_GROUPS } from '../form/metadata';

export interface DraftMeta {
  name: string;
  role: string;
  notes: string;
}

export interface DraftState {
  /** The character being edited, or null for an unsaved draft. */
  characterId: string | null;
  meta: DraftMeta;
  spec: FaceSpec;
  params: Partial<GenerationParams>;
  past: FaceSpec[];
  future: FaceSpec[];
  dirty: boolean;

  setMeta(patch: Partial<DraftMeta>): void;
  /** Set or clear one feature (pass undefined to clear). */
  setFeature<K extends keyof FaceSpec>(
    key: K,
    value: FaceSpec[K] | undefined
  ): void;
  /** Merge a partial spec over the current one (e.g. AI-inferred traits), as one undo step. */
  mergeSpec(patch: Partial<FaceSpec>): void;
  setParams(patch: Partial<GenerationParams>): void;
  load(character: Character): void;
  reset(): void;
  undo(): void;
  redo(): void;
  /** Fill every unset single-choice feature with a random option (casting variety). */
  randomizeMissing(): void;
  /** The prompt the current spec + params compose to (local preview). */
  prompt(): string;
}

const EMPTY_META: DraftMeta = { name: '', role: '', notes: '' };
/** Default generation params for a fresh draft. Look 7 (conformity 0.7). */
const DEFAULT_PARAMS: Partial<GenerationParams> = {
  conformity: 0.7,
  artStyle: 'naturalistic',
};

const ENUM_FEATURES = FEATURE_GROUPS.flatMap((g) => g.features).filter(
  (f) => f.kind === 'enum' && f.options
);

/** Translate old lip choices to slider midpoints when opening a saved draft. */
function upgradeLegacyLipMeasurements(source: FaceSpec): FaceSpec {
  const spec = { ...source };
  if (spec.mouthWidthMm == null && spec.mouthWidth) {
    spec.mouthWidthMm = { narrow: 41, medium: 51, wide: 61 }[spec.mouthWidth];
  }
  if (spec.philtrumLengthMm == null && spec.philtrumLength) {
    spec.philtrumLengthMm = { short: 10.5, medium: 15.5, long: 21 }[
      spec.philtrumLength
    ];
  }
  if (
    (spec.upperVermilionHeightMm == null ||
      spec.lowerVermilionHeightMm == null) &&
    (spec.vermilionHeight || spec.lipRatio)
  ) {
    const total = { thin: 14, medium: 20.5, tall: 28 }[
      spec.vermilionHeight ?? 'medium'
    ];
    const share = { 'fuller-lower': 0.4, balanced: 0.49, 'fuller-upper': 0.57 }[
      spec.lipRatio ?? 'balanced'
    ];
    spec.upperVermilionHeightMm ??= Math.round(total * share * 10) / 10;
    spec.lowerVermilionHeightMm ??=
      Math.round((total - spec.upperVermilionHeightMm) * 10) / 10;
  }
  delete spec.mouthWidth;
  delete spec.philtrumLength;
  delete spec.vermilionHeight;
  delete spec.lipRatio;
  return spec;
}

export type DraftStore = StoreApi<DraftState>;

export function createDraftStore(initial?: Partial<DraftState>): DraftStore {
  return createStore<DraftState>((set, get) => ({
    characterId: null,
    meta: EMPTY_META,
    spec: {},
    params: { ...DEFAULT_PARAMS },
    past: [],
    future: [],
    dirty: false,
    ...initial,

    setMeta(patch) {
      set((s) => ({ meta: { ...s.meta, ...patch }, dirty: true }));
    },

    setFeature(key, value) {
      set((s) => {
        const next = { ...s.spec };
        if (value === undefined) delete next[key];
        else next[key] = value;
        // The measured controls supersede their legacy categorical counterparts.
        // Clear the hidden old choice even when a slider returns to Any.
        if (key === 'mouthWidthMm') delete next.mouthWidth;
        if (key === 'philtrumLengthMm') delete next.philtrumLength;
        if (
          key === 'upperVermilionHeightMm' ||
          key === 'lowerVermilionHeightMm'
        ) {
          delete next.vermilionHeight;
          delete next.lipRatio;
        }
        // Keep the female → no-facial-hair rule live (setting sex female clears
        // facial hair; a beard set on a female is forced clean-shaven).
        const spec = applyFemaleFacialHairRule(next);
        return { spec, past: [...s.past, s.spec], future: [], dirty: true };
      });
    },

    mergeSpec(patch) {
      set((s) => {
        // Drop undefined so a cleared trait in the patch never erases an existing one.
        const clean = Object.fromEntries(
          Object.entries(patch).filter(([, v]) => v !== undefined)
        );
        return {
          spec: applyFemaleFacialHairRule(
            upgradeLegacyLipMeasurements({ ...s.spec, ...clean })
          ),
          past: [...s.past, s.spec],
          future: [],
          dirty: true,
        };
      });
    },

    setParams(patch) {
      set((s) => ({ params: { ...s.params, ...patch } }));
    },

    load(character) {
      set({
        characterId: character.id,
        meta: {
          name: character.name,
          role: character.role ?? '',
          notes: character.notes ?? '',
        },
        spec: upgradeLegacyLipMeasurements(character.spec),
        past: [],
        future: [],
        dirty: false,
      });
    },

    reset() {
      set({
        characterId: null,
        meta: EMPTY_META,
        spec: {},
        params: { ...DEFAULT_PARAMS },
        past: [],
        future: [],
        dirty: false,
      });
    },

    undo() {
      set((s) => {
        if (s.past.length === 0) return s;
        const previous = s.past[s.past.length - 1]!;
        return {
          spec: previous,
          past: s.past.slice(0, -1),
          future: [s.spec, ...s.future],
          dirty: true,
        };
      });
    },

    redo() {
      set((s) => {
        if (s.future.length === 0) return s;
        const next = s.future[0]!;
        return {
          spec: next,
          past: [...s.past, s.spec],
          future: s.future.slice(1),
          dirty: true,
        };
      });
    },

    randomizeMissing() {
      set((s) => {
        const spec: FaceSpec = { ...s.spec };
        for (const f of ENUM_FEATURES) {
          if (spec[f.key] !== undefined) continue;
          const options = f.options!;
          const pick = options[Math.floor(Math.random() * options.length)]!;

          (spec as any)[f.key] = pick.value;
        }
        return { spec, past: [...s.past, s.spec], future: [], dirty: true };
      });
    },

    prompt() {
      const s = get();
      return composePrompt(s.spec, s.params);
    },
  }));
}
