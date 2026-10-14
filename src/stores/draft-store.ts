import { createStore, type StoreApi } from 'zustand/vanilla';
import {
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

const ENUM_FEATURES = FEATURE_GROUPS.flatMap((g) => g.features).filter(
  (f) => f.kind === 'enum' && f.options
);

export type DraftStore = StoreApi<DraftState>;

export function createDraftStore(initial?: Partial<DraftState>): DraftStore {
  return createStore<DraftState>((set, get) => ({
    characterId: null,
    meta: EMPTY_META,
    spec: {},
    params: {},
    past: [],
    future: [],
    dirty: false,
    ...initial,

    setMeta(patch) {
      set((s) => ({ meta: { ...s.meta, ...patch }, dirty: true }));
    },

    setFeature(key, value) {
      set((s) => {
        const spec = { ...s.spec };
        if (value === undefined) delete spec[key];
        else spec[key] = value;
        return { spec, past: [...s.past, s.spec], future: [], dirty: true };
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
        spec: character.spec,
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
        params: {},
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
