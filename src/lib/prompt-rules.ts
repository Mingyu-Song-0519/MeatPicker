export const OUTPUT_FIELDS_CHECKLIST = [
  'overallGrade',
  'overallScore',
  'details.color',
  'details.marbling',
  'details.surface',
  'details.shape',
  'warnings',
  'goodTraits',
  'limitations',
  'cutReference.goodDescription',
  'cutReference.badDescription',
  'analyzedAt',
] as const;

export const GLOBAL_ANALYSIS_RULES = [
  'Return only valid JSON. Do not wrap in markdown code fences.',
  'All natural language text values should be in Korean.',
  'Scores must be integers between 0 and 100.',
  'Use grade mapping: >=80 good, 50-79 normal, <=49 bad.',
  'If image is not meat or image quality is too poor, include warning messages and lower score.',
  'Include photographic limitations in limitations field when uncertain.',
] as const;

export const COMMON_BAD_SIGNS_FOR_PROMPT = [
  'Discoloration or browning',
  'PSE risk pattern (pale, soft, exudative)',
  'Surface slime or sticky film',
  'Low elasticity / poor recovery after pressing',
] as const;
