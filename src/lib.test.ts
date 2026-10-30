import { describe, it, expect } from 'vitest';
import { faceSpecSchema } from '@sudobility/characterbuilder_types';
import {
  FEATURE_GROUPS,
  FEATURE_BY_KEY,
  humanize,
  filledCount,
} from './form/metadata';
import { createDraftStore } from './stores/draft-store';

describe('form metadata', () => {
  it('offers a measured eye-opening slider', () => {
    const eye = FEATURE_BY_KEY.eyeOpeningRatioPercent;
    expect(eye?.kind).toBe('slider');
    expect(eye?.unit).toBe('%');
    expect(eye?.min).toBe(18);
    expect(eye?.max).toBe(55);
  });
  it('every feature key is a valid FaceSpec field', () => {
    const specKeys = new Set(Object.keys(faceSpecSchema.shape));
    for (const g of FEATURE_GROUPS) {
      for (const f of g.features) {
        expect(specKeys.has(f.key as string)).toBe(true);
      }
    }
  });

  it('covers a large share of the comprehensive spec', () => {
    expect(Object.keys(FEATURE_BY_KEY).length).toBeGreaterThanOrEqual(50);
  });

  it('humanizes with overrides', () => {
    expect(humanize('dark-brown')).toBe('Dark brown');
    expect(humanize('east-asian')).toBe('East Asian');
    expect(humanize('widows-peak')).toBe("Widow's peak");
    expect(humanize('class-ii')).toContain('Class II');
  });

  it('counts filled features', () => {
    expect(filledCount({})).toBe(0);
    expect(filledCount({ faceShape: 'oval', skinMarks: [] })).toBe(1);
    expect(filledCount({ faceShape: 'oval', eyeSize: 'large' })).toBe(2);
  });
});

describe('draft store', () => {
  it('converts saved lip categories to measurements and clears them with the slider', () => {
    const store = createDraftStore();
    store.getState().mergeSpec({
      mouthWidth: 'wide',
      vermilionHeight: 'tall',
      lipRatio: 'fuller-lower',
      philtrumLength: 'long',
    });
    expect(store.getState().spec.mouthWidthMm).toBe(61);
    expect(store.getState().spec.philtrumLengthMm).toBe(21);
    expect(store.getState().spec.upperVermilionHeightMm).toBeTypeOf('number');
    expect(store.getState().spec.mouthWidth).toBeUndefined();
    store.getState().setFeature('mouthWidthMm', undefined);
    expect(store.getState().spec.mouthWidthMm).toBeUndefined();
    expect(store.getState().spec.mouthWidth).toBeUndefined();
  });
  it('sets, undoes and redoes a feature', () => {
    const store = createDraftStore();
    store.getState().setFeature('faceShape', 'square');
    expect(store.getState().spec.faceShape).toBe('square');
    store.getState().setFeature('eyeSize', 'small');
    store.getState().undo();
    expect(store.getState().spec.eyeSize).toBeUndefined();
    expect(store.getState().spec.faceShape).toBe('square');
    store.getState().redo();
    expect(store.getState().spec.eyeSize).toBe('small');
  });

  it('clears a feature with undefined', () => {
    const store = createDraftStore();
    store.getState().setFeature('faceShape', 'oval');
    store.getState().setFeature('faceShape', undefined);
    expect('faceShape' in store.getState().spec).toBe(false);
  });

  it('composes a prompt from the draft', () => {
    const store = createDraftStore();
    store.getState().setFeature('sex', 'male');
    store.getState().setFeature('hairColor', 'red');
    const p = store.getState().prompt();
    expect(p).toContain('red hair');
    expect(p).toContain('man');
  });

  it('randomizes only missing features into a valid spec', () => {
    const store = createDraftStore();
    store.getState().setFeature('faceShape', 'heart');
    store.getState().randomizeMissing();
    const spec = store.getState().spec;
    expect(spec.faceShape).toBe('heart'); // preserved
    expect(() => faceSpecSchema.parse(spec)).not.toThrow();
    expect(filledCount(spec)).toBeGreaterThan(10);
  });

  it('loads a character and resets', () => {
    const store = createDraftStore();
    store.getState().load({
      id: 'chr_1',
      name: 'Ada',
      role: 'lead',
      notes: null,
      spec: { faceShape: 'round' },
      previewImageId: null,
      createdAt: '',
      updatedAt: '',
    });
    expect(store.getState().meta.name).toBe('Ada');
    expect(store.getState().spec.faceShape).toBe('round');
    store.getState().reset();
    expect(store.getState().characterId).toBeNull();
    expect(store.getState().spec).toEqual({});
  });
});
