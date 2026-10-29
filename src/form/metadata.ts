import {
  type FaceSpec,
  CRANIAL_SHAPES,
  SKULL_HEIGHTS,
  TEMPORAL_WIDTHS,
  HEAD_SIZES,
  FACE_SHAPES,
  FACIAL_PROPORTIONS,
  DOMINANT_THIRDS,
  FOREHEAD_HEIGHTS,
  FOREHEAD_SLOPES,
  FOREHEAD_BREADTHS,
  FRONTAL_BOSSINGS,
  BROW_RIDGES,
  GLABELLAS,
  EYE_SIZES,
  EYE_SPACINGS,
  ORBITAL_DEPTHS,
  EYE_SHAPES,
  CANTHAL_TILTS,
  LID_TYPES,
  LID_CREASES,
  LID_FOLD_HEIGHTS,
  EPICANTHIC_FOLDS,
  TEAR_TROUGHS,
  SCLERAL_SHOWS,
  LASH_LENGTHS,
  LASH_DENSITIES,
  IRIS_COLORS,
  HETEROCHROMIAS,
  LIMBAL_RINGS,
  BROW_THICKNESSES,
  BROW_SHAPES,
  BROW_ARCHES,
  BROW_HEIGHTS,
  BROW_DENSITIES,
  INTER_BROW_DISTANCES,
  NOSE_SIZES,
  NOSE_LENGTHS,
  NASAL_ROOTS,
  NOSE_BRIDGES,
  NOSE_BRIDGE_HEIGHTS,
  NOSE_BRIDGE_WIDTHS,
  NOSE_WIDTHS,
  NOSE_TIPS,
  NOSE_TIP_PROJECTIONS,
  NOSE_TIP_ROTATIONS,
  NOSTRIL_SHAPES,
  ALAR_BASE_WIDTHS,
  COLUMELLAS,
  NASAL_INDICES,
  LIP_FULLNESSES,
  PHILTRUM_DEPTHS,
  CUPIDS_BOWS,
  MOUTH_CORNERS,
  LIP_PROJECTIONS,
  RESTING_MOUTHS,
  CHEEK_FULLNESSES,
  CHEEKBONE_HEIGHTS,
  CHEEKBONE_WIDTHS,
  CHEEKBONE_PROJECTIONS,
  SUBMALAR_HOLLOWS,
  NASOLABIAL_FOLDS,
  MIDFACE_PROJECTIONS,
  MIDFACE_LENGTHS,
  EAR_SIZES,
  EAR_PROTRUSIONS,
  EARLOBE_TYPES,
  EAR_SHAPES,
  DARWINS_TUBERCLES,
  JAW_WIDTHS,
  JAW_ANGLES,
  JAW_LENGTHS,
  JAW_DEFINITIONS,
  SUBMENTAL_FULLNESSES,
  JOWLS,
  CHIN_PROJECTIONS,
  CHIN_SHAPES,
  CHIN_HEIGHTS,
  CHIN_CLEFTS,
  PROFILES,
  NECK_THICKNESSES,
  ADAMS_APPLES,
  BITE_CLASSES,
  TEETH_APPEARANCES,
  TOOTH_SIZES,
  TOOTH_SHOWS,
  GUM_DISPLAYS,
  TEETH_COLORS,
  SKIN_TONES,
  SKIN_UNDERTONES,
  SKIN_TEXTURES,
  PORE_VISIBILITIES,
  SKIN_SURFACES,
  PIGMENTATION_VARIATIONS,
  WRINKLE_LEVELS,
  WRINKLE_AREAS,
  SKIN_MARKS,
  HAIR_TEXTURES,
  HAIR_COLORS,
  HAIR_DENSITIES,
  HAIR_LENGTHS,
  HAIR_STYLES,
  STRAND_THICKNESSES,
  HAIRLINES,
  BALDING_PATTERNS,
  GREYING_LEVELS,
  FACIAL_HAIR_STYLES,
  FACIAL_HAIR_DENSITIES,
  SEXES,
  AGE_BANDS,
  BUILDS,
  ASYMMETRY_LEVELS,
  ASYMMETRY_FEATURES,
  DIMPLES,
} from '@sudobility/characterbuilder_types';

export type FeatureKind = 'enum' | 'multi' | 'text' | 'number' | 'slider';

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
  step?: number;
  unit?: string;
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
  'upper-and-lower': 'Upper & lower',
  'crows-feet': "Crow's feet",
  'under-eye': 'Under-eye',
  'double-chin': 'Double chin',
  'temple-recession': 'Temple recession',
  'crown-thinning': 'Crown thinning',
  'norwood-advanced': 'Norwood (advanced)',
  'diffuse-thinning': 'Diffuse thinning',
  'visible-capillaries': 'Visible capillaries',
  'fine-lines': 'Fine lines',
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

const slider = (
  key: keyof FaceSpec,
  label: string,
  min: number,
  max: number,
  help: string
): FeatureMeta => ({
  key,
  label,
  kind: 'slider',
  min,
  max,
  step: 0.1,
  unit: 'mm',
  help,
});

/**
 * The whole comprehensive form, grouped head-to-chin. The app renders each group
 * as a section and each feature with the control its `kind` implies. Every control
 * is optional — leaving one unset lets the API CAST it (coherently, from the
 * chosen demographics) at generation time.
 */
export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: 'demographics',
    title: 'Who they are',
    blurb:
      'Steers the casting range. Demographic is a tendency, never a rule — any feature can pair with any background.',
    features: [
      e('sex', 'Sex', SEXES),
      e('ageBand', 'Age band', AGE_BANDS),
      { key: 'ageYears', label: 'Exact age', kind: 'number', min: 1, max: 120 },
      e('build', 'Build', BUILDS),
    ],
  },
  {
    id: 'structure',
    title: 'Head & face structure',
    blurb: 'The bone. This is what makes two faces read as different people.',
    features: [
      e('cranialShape', 'Head shape', CRANIAL_SHAPES),
      e('skullHeight', 'Skull height', SKULL_HEIGHTS),
      e('temporalWidth', 'Temple width', TEMPORAL_WIDTHS),
      e('headSize', 'Head size', HEAD_SIZES),
      e('faceShape', 'Face shape', FACE_SHAPES),
      e('facialProportion', 'Face proportion', FACIAL_PROPORTIONS),
      e('dominantThird', 'Dominant third', DOMINANT_THIRDS),
      e('foreheadHeight', 'Forehead height', FOREHEAD_HEIGHTS),
      e('foreheadSlope', 'Forehead slope', FOREHEAD_SLOPES),
      e('foreheadBreadth', 'Forehead breadth', FOREHEAD_BREADTHS),
      e('frontalBossing', 'Frontal bossing', FRONTAL_BOSSINGS),
      e('browRidge', 'Brow ridge', BROW_RIDGES),
      e('glabella', 'Glabella', GLABELLAS),
    ],
  },
  {
    id: 'eyes',
    title: 'Eyes',
    features: [
      e('eyeSize', 'Eye size', EYE_SIZES),
      e('eyeSpacing', 'Eye spacing', EYE_SPACINGS),
      e('orbitalDepth', 'Socket depth', ORBITAL_DEPTHS),
      e('eyeShape', 'Eye shape', EYE_SHAPES),
      e('canthalTilt', 'Canthal tilt', CANTHAL_TILTS),
      e('lidType', 'Eyelid type', LID_TYPES),
      e('lidCrease', 'Lid crease', LID_CREASES),
      e('lidFoldHeight', 'Lid fold height', LID_FOLD_HEIGHTS),
      e('epicanthicFold', 'Epicanthic fold', EPICANTHIC_FOLDS),
      e('tearTrough', 'Under-eye', TEAR_TROUGHS),
      e('scleralShow', 'Scleral show', SCLERAL_SHOWS),
      e('lashLength', 'Lash length', LASH_LENGTHS),
      e('lashDensity', 'Lash density', LASH_DENSITIES),
      e('irisColor', 'Iris color', IRIS_COLORS),
      e('heterochromia', 'Heterochromia', HETEROCHROMIAS),
      e('limbalRing', 'Limbal ring', LIMBAL_RINGS),
    ],
  },
  {
    id: 'brows',
    title: 'Eyebrows',
    features: [
      e('browThickness', 'Thickness', BROW_THICKNESSES),
      e('browShape', 'Shape', BROW_SHAPES),
      e('browArch', 'Arch', BROW_ARCHES),
      e('browHeight', 'Height', BROW_HEIGHTS),
      e('browDensity', 'Density', BROW_DENSITIES),
      e('interBrowDistance', 'Spacing', INTER_BROW_DISTANCES),
      e('browColor', 'Color', HAIR_COLORS),
    ],
  },
  {
    id: 'nose',
    title: 'Nose',
    features: [
      e('noseSize', 'Size', NOSE_SIZES),
      e('noseLength', 'Length', NOSE_LENGTHS),
      e('nasalRoot', 'Root depth', NASAL_ROOTS),
      e('noseBridge', 'Bridge contour', NOSE_BRIDGES),
      e('noseBridgeHeight', 'Bridge height', NOSE_BRIDGE_HEIGHTS),
      e('noseBridgeWidth', 'Bridge width', NOSE_BRIDGE_WIDTHS),
      e('noseWidth', 'Width', NOSE_WIDTHS),
      e('noseTip', 'Tip', NOSE_TIPS),
      e('noseTipProjection', 'Tip projection', NOSE_TIP_PROJECTIONS),
      e('noseTipRotation', 'Tip rotation', NOSE_TIP_ROTATIONS),
      e('nostrils', 'Nostrils', NOSTRIL_SHAPES),
      e('alarBaseWidth', 'Alar base', ALAR_BASE_WIDTHS),
      e('columella', 'Columella', COLUMELLAS),
      e('nasalIndex', 'Nasal index', NASAL_INDICES),
    ],
  },
  {
    id: 'mouth',
    title: 'Mouth & lips',
    features: [
      e('lipFullness', 'Lip fullness', LIP_FULLNESSES),
      slider('mouthWidthMm', 'Mouth width', 30, 75, 'Corner-to-corner width.'),
      slider(
        'upperVermilionHeightMm',
        'Upper lip red height',
        2,
        18,
        'Visible upper vermilion at the center.'
      ),
      slider(
        'lowerVermilionHeightMm',
        'Lower lip red height',
        2,
        20,
        'Visible lower vermilion at the center.'
      ),
      slider(
        'philtrumLengthMm',
        'Philtrum length',
        5,
        30,
        'Base of nose to upper lip border.'
      ),
      e('philtrumDepth', 'Philtrum depth', PHILTRUM_DEPTHS),
      e('cupidsBow', "Cupid's bow", CUPIDS_BOWS),
      e('mouthCorners', 'Mouth corners', MOUTH_CORNERS),
      e('lipProjection', 'Lip projection', LIP_PROJECTIONS),
      e('restingMouth', 'Resting mouth', RESTING_MOUTHS),
    ],
  },
  {
    id: 'cheeks',
    title: 'Cheeks & midface',
    features: [
      e('cheekFullness', 'Cheek fullness', CHEEK_FULLNESSES),
      e('cheekboneHeight', 'Cheekbone height', CHEEKBONE_HEIGHTS),
      e('cheekboneWidth', 'Cheekbone width', CHEEKBONE_WIDTHS),
      e('cheekboneProjection', 'Cheekbone projection', CHEEKBONE_PROJECTIONS),
      e('submalarHollow', 'Submalar hollow', SUBMALAR_HOLLOWS),
      e('nasolabialFold', 'Nasolabial folds', NASOLABIAL_FOLDS),
      e('midfaceProjection', 'Midface projection', MIDFACE_PROJECTIONS),
      e('midfaceLength', 'Midface length', MIDFACE_LENGTHS),
    ],
  },
  {
    id: 'ears',
    title: 'Ears',
    features: [
      e('earSize', 'Ear size', EAR_SIZES),
      e('earProtrusion', 'Ear protrusion', EAR_PROTRUSIONS),
      e('earlobe', 'Earlobe', EARLOBE_TYPES),
      e('earShape', 'Ear shape', EAR_SHAPES),
      e('darwinsTubercle', "Darwin's tubercle", DARWINS_TUBERCLES),
    ],
  },
  {
    id: 'jaw-chin',
    title: 'Jaw, chin & neck',
    features: [
      e('jawWidth', 'Jaw width', JAW_WIDTHS),
      e('jawAngle', 'Jaw angle', JAW_ANGLES),
      e('jawLength', 'Jaw length', JAW_LENGTHS),
      e('jawDefinition', 'Jaw definition', JAW_DEFINITIONS),
      e('submentalFullness', 'Under-chin', SUBMENTAL_FULLNESSES),
      e('jowls', 'Jowls', JOWLS),
      e('chinProjection', 'Chin projection', CHIN_PROJECTIONS),
      e('chinShape', 'Chin shape', CHIN_SHAPES),
      e('chinHeight', 'Chin height', CHIN_HEIGHTS),
      e('chinCleft', 'Chin cleft', CHIN_CLEFTS),
      e('profile', 'Profile', PROFILES),
      e('neckThickness', 'Neck', NECK_THICKNESSES),
      e('adamsApple', "Adam's apple", ADAMS_APPLES),
    ],
  },
  {
    id: 'teeth',
    title: 'Teeth (if smiling)',
    features: [
      e('biteClass', 'Bite', BITE_CLASSES),
      e('teeth', 'Teeth', TEETH_APPEARANCES),
      e('toothSize', 'Tooth size', TOOTH_SIZES),
      e('toothShow', 'Tooth show', TOOTH_SHOWS),
      e('gumDisplay', 'Gum display', GUM_DISPLAYS),
      e('teethColor', 'Tooth color', TEETH_COLORS),
    ],
  },
  {
    id: 'skin',
    title: 'Skin',
    features: [
      e('skinTone', 'Tone', SKIN_TONES),
      e('skinUndertone', 'Undertone', SKIN_UNDERTONES),
      e('skinTexture', 'Texture', SKIN_TEXTURES),
      e('poreVisibility', 'Pores', PORE_VISIBILITIES),
      e('skinSurface', 'Surface', SKIN_SURFACES),
      e('pigmentation', 'Pigmentation', PIGMENTATION_VARIATIONS),
      e('wrinkleLevel', 'Wrinkles', WRINKLE_LEVELS),
      multi('wrinkleAreas', 'Wrinkle areas', WRINKLE_AREAS),
      multi('skinMarks', 'Marks', SKIN_MARKS),
    ],
  },
  {
    id: 'hair',
    title: 'Hair',
    features: [
      e('hairTexture', 'Curl / texture', HAIR_TEXTURES),
      e('hairColor', 'Color', HAIR_COLORS),
      e('hairDensity', 'Density', HAIR_DENSITIES),
      e('hairLength', 'Length', HAIR_LENGTHS),
      e('hairStyle', 'Style', HAIR_STYLES),
      e('strandThickness', 'Strand', STRAND_THICKNESSES),
      e('hairline', 'Hairline', HAIRLINES),
      e('balding', 'Balding', BALDING_PATTERNS),
      e('greying', 'Greying', GREYING_LEVELS),
      e('facialHair', 'Facial hair', FACIAL_HAIR_STYLES),
      e('facialHairDensity', 'Facial-hair density', FACIAL_HAIR_DENSITIES),
      e('facialHairColor', 'Facial-hair color', HAIR_COLORS),
    ],
  },
  {
    id: 'detail',
    title: 'Individuating detail',
    blurb: 'What makes it a specific, real person rather than a type.',
    features: [
      e('asymmetry', 'Facial asymmetry', ASYMMETRY_LEVELS),
      e('asymmetryFeature', 'Asymmetry in', ASYMMETRY_FEATURES),
      e('dimples', 'Dimples', DIMPLES),
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
