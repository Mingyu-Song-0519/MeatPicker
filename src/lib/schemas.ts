// Zod 스키마 정의 - API 요청/응답 유효성 검증

import { z } from 'zod';

/** 고기 종류 스키마 */
export const meatTypeSchema = z.enum(['beef', 'pork']);

/** 소고기 부위 스키마 */
export const beefCutSchema = z.enum([
  'tenderloin',
  'ribeye',
  'striploin',
  'rib',
  'shank',
  'round',
]);

/** 돼지고기 부위 스키마 */
export const porkCutSchema = z.enum([
  'belly',
  'shoulder',
  'jowl',
  'loin',
  'picnic',
]);

/** 분석 요청 스키마 */
export const analyzeRequestSchema = z.object({
  image: z
    .string()
    .min(1, '이미지 데이터가 필요합니다')
    .refine(
      (val) => {
        // base64 데이터 URI 또는 순수 base64 문자열 허용
        return (
          val.startsWith('data:image/') ||
          /^[A-Za-z0-9+/]+=*$/.test(val.slice(0, 100))
        );
      },
      { message: '유효한 이미지 데이터가 아닙니다' }
    ),
  meatType: meatTypeSchema,
  cut: z.string().min(1, '부위를 선택해주세요'),
});

/** 품질 등급 스키마 */
export const gradeSchema = z.enum(['good', 'normal', 'bad']);

/** 세부 점수 스키마 */
export const detailScoreSchema = z.object({
  score: z.number().min(0).max(100),
  description: z.string(),
});

/** 분석 결과 스키마 */
export const analysisResultSchema = z.object({
  overallGrade: gradeSchema,
  overallScore: z.number().min(0).max(100),
  details: z.object({
    color: detailScoreSchema,
    marbling: detailScoreSchema,
    surface: detailScoreSchema,
    shape: detailScoreSchema,
  }),
  warnings: z.array(z.string()),
  goodTraits: z.array(z.string()),
  limitations: z.array(z.string()),
  cutReference: z.object({
    goodDescription: z.string(),
    badDescription: z.string(),
  }),
  analyzedAt: z.string(),
});

/** 타입 추론 헬퍼 */
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
export type AnalysisResultOutput = z.infer<typeof analysisResultSchema>;
