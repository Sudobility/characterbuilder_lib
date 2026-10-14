import {
  createContext,
  createElement,
  useContext,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';
import {
  createDraftStore,
  type DraftState,
  type DraftStore,
} from '../stores/draft-store';

const DraftContext = createContext<DraftStore | null>(null);

/** Provide one draft store to the editor subtree. Creates one if not given. */
export function DraftStoreProvider(props: {
  store?: DraftStore;
  children?: ReactNode;
}) {
  const store = props.store ?? createDraftStore();
  return createElement(DraftContext.Provider, { value: store }, props.children);
}

export function useDraftStore(): DraftStore {
  const s = useContext(DraftContext);
  if (!s)
    throw new Error('useDraftStore: wrap the tree in <DraftStoreProvider>');
  return s;
}

/** Subscribe to a slice of the draft state. */
export function useDraft<T>(selector: (state: DraftState) => T): T {
  return useStore(useDraftStore(), selector);
}
