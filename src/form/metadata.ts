import {
  type FaceSpec,
  CRANIAL_SHAPES,
  FACE_SHAPES,
  FACIAL_PROPORTIONS,
  DOMINANT_THIRDS,
  FOREHEAD_HEIGHTS,
  FOREHEAD_SLOPES,
  BROW_RIDGES,
  EYE_SIZES,
  EYE_SPACINGS,
  EYE_SHAPES,
  CANTHAL_TILTS,
  LID_TYPES,
  EPICANTHIC_FOLDS,
  IRIS_COLORS,
  BROW_THICKNESSES,
  BROW_SHAPES,
  BROW_ARCHES,
  NOSE_SIZES,
  NOSE_LENGTHS,
  NOSE_BRIDGES,
  NOSE_WIDTHS,
  NOSE_TIPS,
  NOSTRIL_SHAPES,
  NASAL_INDICES,
  LIP_FULLNESSES,
  LIP_RATIOS,
  MOUTH_WIDTHS,
  PHILTRUM_LENGTHS,
  CUPIDS_BOWS,
  MOUTH_CORNERS,
  CHEEK_FULLNESSES,
  CHEEKBONE_HEIGHTS,
  CHEEKBONE_PROJECTIONS,
  EAR_SIZES,
  EAR_PROTRUSIONS,
  EARLOBE_TYPES,
  JAW_WIDTHS,
  JAW_ANGLES,
  JAW_DEFINITIONS,
  CHIN_PROJECTIONS,
  CHIN_SHAPES,
  CHIN_CLEFTS,
  PROFILES,
  BITE_CLASSES,
  TEETH_APPEARANCES,
  SKIN_TONES,
  SKIN_UNDERTONES,
  SKIN_TEXTURES,
  SKIN_MARKS,
  HAIR_TEXTURES,
  HAIR_COLORS,
  HAIR_DENSITIES,
  HAIRLINES,
  GREYING_LEVELS,
  FACIAL_HAIR_STYLES,
  SEXES,
  AGE_BANDS,
  ANCESTRIES,
  BUILDS,
  ASYMMETRY_LEVELS,
} from '@sudobility/characterbuilder_types';

export type FeatureKind = 'enum' | 'multi' | 'text' | 'number';

export interface FeatureOption {
  value: string;
  label: string;
}

export interface FeatureMeta {
  /** The FaceSpec field this control edits. */
  key: keyof FaceSpec;
  label: string;
  kind: FeatureKind;
  /** Present for 'enum' and 'multi'. */
  options?: FeatureOption[];
  help?: string;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface FeatureGroup {
  id: string;
  title: string;
  /** A hint of why this group matters (echoes the face-variation reference). */
  blurb?: string;
  features: FeatureMeta[];
}

/** Labels that a naive humanize would get wrong (proper nouns, acronyms, symbols). */
const LABEL_OVERRIDES: Record<string, string> = {
  'sub-saharan-african': 'Sub-Saharan African',
  'north-african': 'North African',
  'middle-eastern': 'Middle Eastern',
  european: 'European',
  'east-asian': 'East Asian',
  'southeast-asian': 'Southeast Asian',
  'south-asian': 'South Asian',
  'central-asian': 'Central Asian',
  'indigenous-american': 'Indigenous American',
  'pacific-islander': 'Pacific Islander',
  'class-i': 'Class I (normal)',
  'class-ii': 'Class II (overbite)',
  'class-iii': 'Class III (underbite)',
  'm-shaped': 'M-shaped',
  'widows-peak': "Widow's peak",
  'salt-and-pepper': 'Salt & pepper',
  'seventies-plus': '70+',
  'deep-set': 'Deep-set',
  'wide-set': 'Wide-set',
  'close-set': 'Close-set',
  'fuller-upper': 'Fuller upper lip',
  'fuller-lower': 'Fuller lower lip',
  'acne-scarring': 'Acne scarring',
  'beauty-mark': 'Beauty mark',
  'age-spots': 'Age spots',
};

/** `dark-brown` -> `Dark brown`; overrides win. */
export function humanize(value: string): string {
  if (LABEL_OVERRIDES[value]) return LABEL_OVERRIDES[value]!;
  const spaced = value.replace(/[-_]/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const opts = (values: readonly string[]): FeatureOption[] =>
  values.map((v) => ({ value: v, label: humanize(v) }));

const e = (
  key: keyof FaceSpec,
  label: string,
  values: readonly string[],
  help?: string
): FeatureMeta => ({ key, label, kind: 'enum', options: opts(values), help });

const multi = (
  key: keyof FaceSpec,
  label: string,
  values: readonly string[]
): FeatureMeta => ({ key, label, kind: 'multi', options: opts(values) });

const text = (
  key: keyof FaceSpec,
  label: string,
  placeholder?: string
): FeatureMeta => ({ key, label, kind: 'text', placeholder });

/**
 * The whole comprehensive form, grouped head-to-chin. The app renders each group
 * as a section and each feature with the control its `kind` implies. Every control
 * is optional — leaving one unset lets the model (or randomization) decide it.
 */
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'demographics',
    title: 'Who they are',
    blurb:
      'Steers the casting range. Ancestry is a tendency, never a rule — any feature can pair with any ancestry.',
    features: [
      e('sex', 'Sex', SEXES),
      e('ageBand', 'Age band', AGE_BANDS),
      { key: 'ageYears', label: 'Exact age', kind: 'number', min: 1, max: 120 },
      e('ancestry', 'Ancestry', ANCESTRIES),
      text('ancestryNote', 'Ancestry note', 'e.g. Horn of Africa; Levantine'),
      e('build', 'Build', BUILDS),
    ],
  },
  {
    id: 'structure',
    title: 'Head & face structure',
    blurb: 'The bone. This is what makes two faces read as different people.',
    features: [
      e('cranialShape', 'Head shape', CRANIAL_SHAPES),
      e('faceShape', 'Face shape', FACE_SHAPES),
      e('facialProportion', 'Face proportion', FACIAL_PROPORTIONS),
      e('dominantThird', 'Dominant third', DOMINANT_THIRDS),
      e('foreheadHeight', 'Forehead height', FOREHEAD_HEIGHTS),
      e('foreheadSlope', 'Forehead slope', FOREHEAD_SLOPES),
      e('browRidge', 'Brow ridge', BROW_RIDGES),
    ],
  },
  {
    id: 'eyes',
    title: 'Eyes',
    features: [
      e('eyeSize', 'Eye size', EYE_SIZES),
      e('eyeSpacing', 'Eye spacing', EYE_SPACINGS),
      e('eyeShape', 'Eye shape', EYE_SHAPES),
      e('canthalTilt', 'Canthal tilt', CANTHAL_TILTS),
      e('lidType', 'Eyelid type', LID_TYPES),
      e('epicanthicFold', 'Epicanthic fold', EPICANTHIC_FOLDS),
      e('irisColor', 'Iris color', IRIS_COLORS),
    ],
  },
  {
    id: 'brows',
    title: 'Eyebrows',
    features: [
      e('browThickness', 'Thickness', BROW_THICKNESSES),
      e('browShape', 'Shape', BROW_SHAPES),
      e('browArch', 'Arch', BROW_ARCHES),
    ],
  },
  {
    id: 'nose',
    title: 'Nose',
    features: [
      e('noseSize', 'Size', NOSE_SIZES),
      e('noseLength', 'Length', NOSE_LENGTHS),
      e('noseBridge', 'Bridge', NOSE_BRIDGES),
      e('noseWidth', 'Width', NOSE_WIDTHS),
      e('noseTip', 'Tip', NOSE_TIPS),
      e('nostrils', 'Nostrils', NOSTRIL_SHAPES),
      e('nasalIndex', 'Nasal index', NASAL_INDICES),
    ],
  },
  {
    id: 'mouth',
    title: 'Mouth & lips',
    features: [
      e('lipFullness', 'Lip fullness', LIP_FULLNESSES),
      e('lipRatio', 'Lip ratio', LIP_RATIOS),
      e('mouthWidth', 'Mouth width', MOUTH_WIDTHS),
      e('philtrumLength', 'Philtrum length', PHILTRUM_LENGTHS),
      e('cupidsBow', "Cupid's bow", CUPIDS_BOWS),
      e('mouthCorners', 'Mouth corners', MOUTH_CORNERS),
    ],
  },
  {
    id: 'cheeks-ears',
    title: 'Cheeks & ears',
    features: [
      e('cheekFullness', 'Cheek fullness', CHEEK_FULLNESSES),
      e('cheekboneHeight', 'Cheekbone height', CHEEKBONE_HEIGHTS),
      e('cheekboneProjection', 'Cheekbone projection', CHEEKBONE_PROJECTIONS),
      e('earSize', 'Ear size', EAR_SIZES),
      e('earProtrusion', 'Ear protrusion', EAR_PROTRUSIONS),
      e('earlobe', 'Earlobe', EARLOBE_TYPES),
    ],
  },
  {
    id: 'jaw-chin',
    title: 'Jaw & chin',
    features: [
      e('jawWidth', 'Jaw width', JAW_WIDTHS),
      e('jawAngle', 'Jaw angle', JAW_ANGLES),
      e('jawDefinition', 'Jaw definition', JAW_DEFINITIONS),
      e('chinProjection', 'Chin projection', CHIN_PROJECTIONS),
      e('chinShape', 'Chin shape', CHIN_SHAPES),
      e('chinCleft', 'Chin cleft', CHIN_CLEFTS),
      e('profile', 'Profile', PROFILES),
    ],
  },
  {
    id: 'teeth',
    title: 'Teeth (if smiling)',
    features: [
      e('biteClass', 'Bite', BITE_CLASSES),
      e('teeth', 'Teeth', TEETH_APPEARANCES),
    ],
  },
  {
    id: 'skin',
    title: 'Skin',
    features: [
      e('skinTone', 'Tone', SKIN_TONES),
      e('skinUndertone', 'Undertone', SKIN_UNDERTONES),
      e('skinTexture', 'Texture', SKIN_TEXTURES),
      multi('skinMarks', 'Marks', SKIN_MARKS),
    ],
  },
  {
    id: 'hair',
    title: 'Hair',
    features: [
      e('hairTexture', 'Texture', HAIR_TEXTURES),
      e('hairColor', 'Color', HAIR_COLORS),
      e('hairDensity', 'Density', HAIR_DENSITIES),
      e('hairline', 'Hairline', HAIRLINES),
      e('greying', 'Greying', GREYING_LEVELS),
      text('hairStyle', 'Style note', 'e.g. neat low bun; cropped undercut'),
      e('facialHair', 'Facial hair', FACIAL_HAIR_STYLES),
    ],
  },
  {
    id: 'detail',
    title: 'Individuating detail',
    blurb: 'What makes it a specific, real person rather than a type.',
    features: [
      e('asymmetry', 'Facial asymmetry', ASYMMETRY_LEVELS),
      text(
        'distinguishingMark',
        'Distinguishing mark',
        'e.g. mole on the left jaw; scar through the right brow'
      ),
      text('extraNotes', 'Extra notes', 'anything the menus do not cover'),
    ],
  },
];

/** Flat lookup of every feature's metadata by key. */
export const FEATURE_BY_KEY: Partial<Record<keyof FaceSpec, FeatureMeta>> =
  Object.fromEntries(
    FEATURE_GROUPS.flatMap((g) => g.features).map((f) => [f.key, f])
  );

/** Count of features the user has set (for a progress indicator). */
export function filledCount(spec: FaceSpec): number {
  return Object.values(spec).filter(
    (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  ).length;
}
