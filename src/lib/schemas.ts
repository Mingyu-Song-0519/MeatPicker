import { z } from 'zod';

export const MAX_IMAGE_BASE64_LENGTH = 2_000_000;

export const meatTypeSchema = z.enum(['beef', 'pork']);

export const beefCutSchema = z.enum([
  'tenderloin',
  'ribeye',
  'striploin',
  'rib',
  'shank',
  'round',
]);

export const porkCutSchema = z.enum([
  'belly',
  'shoulder',
  'jowl',
  'loin',
  'picnic',
]);

export const analyzeRequestSchema = z.object({
  image: z
    .string()
    .min(1, 'Image data is required')
    .max(MAX_IMAGE_BASE64_LENGTH, 'Image payload is too large')
    .refine(
      (val) =>
        val.startsWith('data:image/') || /^[A-Za-z0-9+/]+=*$/.test(val.slice(0, 100)),
      { message: 'Invalid image payload format' }
    ),
  meatType: meatTypeSchema,
  cut: z.string().min(1, 'Cut is required'),
});

export const gradeSchema = z.enum(['good', 'normal', 'bad']);

export const buyRecommendationSchema = z.enum(['buy', 'conditional', 'avoid']);

export const detailScoreSchema = z.object({
  score: z.number().int().min(0).max(100),
  description: z.string(),
});

export const cutReferenceSchema = z.object({
  goodDescription: z.string(),
  badDescription: z.string(),
});

export const qualityFlagsSchema = z.object({
  discoloration: z.boolean(),
  pseRisk: z.boolean(),
  surfaceRisk: z.boolean(),
  elasticityRisk: z.boolean(),
});

export const analysisRawResultSchema = z.object({
  overallGrade: gradeSchema,
  overallScore: z.number().int().min(0).max(100),
  details: z.object({
    color: detailScoreSchema,
    marbling: detailScoreSchema,
    surface: detailScoreSchema,
    shape: detailScoreSchema,
  }),
  warnings: z.array(z.string()),
  goodTraits: z.array(z.string()),
  limitations: z.array(z.string()),
  cutReference: cutReferenceSchema,
  analyzedAt: z.string(),
});

export const analysisResultSchema = analysisRawResultSchema.extend({
  buyRecommendation: buyRecommendationSchema,
  confidence: z.number().min(0).max(1),
  reasons: z.array(z.string()),
  qualityFlags: qualityFlagsSchema,
});

export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
export type AnalysisRawResultOutput = z.infer<typeof analysisRawResultSchema>;
export type AnalysisResultOutput = z.infer<typeof analysisResultSchema>;
