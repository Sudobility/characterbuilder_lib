/**
 * @sudobility/characterbuilder_lib
 * Frontend business logic: the FaceSpec draft store, the form metadata that drives
 * the comprehensive editor, and the prompt composer re-export.
 */
export {
  composePrompt,
  castFaceSpec,
  buildDistributions,
  ageBandForYears,
  resolveAgeBand,
  type CastOptions,
  type CastResult,
} from '@sudobility/characterbuilder_types';
export * from './form/metadata';
export * from './stores/draft-store';
export * from './react';
