import type {
  AnalysisResult,
  BuyRecommendation,
  Grade,
  MeatType,
  QualityFlags,
} from '@/types/meat';
import type { AnalysisRawResultOutput } from '@/lib/schemas';
import { analysisResultSchema } from '@/lib/schemas';

interface AnalysisContext {
  meatType: MeatType;
  cut: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeGradeFromScore(score: number): Grade {
  if (score >= 80) return 'good';
  if (score >= 50) return 'normal';
  return 'bad';
}

function hasWarningMatch(warnings: string[], patterns: RegExp[]): boolean {
  const text = warnings.join(' ').toLowerCase();
  return patterns.some((pattern) => pattern.test(text));
}

function hasTextMatch(text: string, patterns: RegExp[]): boolean {
  const lowered = text.toLowerCase();
  return patterns.some((pattern) => pattern.test(lowered));
}

function buildQualityFlags(raw: AnalysisRawResultOutput): QualityFlags {
  const warnings = raw.warnings ?? [];

  const discoloration =
    raw.details.color.score < 45 ||
    hasWarningMatch(warnings, [/discolor/i, /갈변/i, /변색/i, /회색/i, /탁한/i]);

  const pseRisk =
    hasWarningMatch(warnings, [/pse/i, /pale/i, /창백/i, /exudative/i, /흐물/i]) ||
    (raw.details.color.score < 50 && raw.details.surface.score < 50);

  const surfaceRisk =
    raw.details.surface.score < 45 ||
    hasWarningMatch(warnings, [/slime/i, /biofilm/i, /끈적/i, /점액/i]);

  const elasticityRisk =
    raw.details.shape.score < 45 ||
    hasWarningMatch(warnings, [/elastic/i, /indent/i, /탄력/i, /눌렀/i]);

  return { discoloration, pseRisk, surfaceRisk, elasticityRisk };
}

function detectExcessFatRisk(
  raw: AnalysisRawResultOutput,
  context?: AnalysisContext
): boolean {
  if (!context || context.meatType !== 'pork' || context.cut !== 'belly') {
    return false;
  }

  const textBlob = [
    raw.details.marbling.description,
    raw.details.shape.description,
    ...(raw.warnings ?? []),
  ].join(' ');

  const explicitExcessFat = hasTextMatch(textBlob, [
    /지방\s*과다/i,
    /비계\s*과다/i,
    /fat\s*too\s*high/i,
    /excessive\s*fat/i,
    /fatty\s*dominant/i,
    /비계층\s*두꺼/i,
    /한쪽\s*지방\s*치우침/i,
  ]);

  const implicitPattern = raw.details.marbling.score >= 88 && raw.details.shape.score <= 62;

  return explicitExcessFat || implicitPattern;
}

function computeAdjustedScore(
  raw: AnalysisRawResultOutput,
  flags: QualityFlags,
  excessFatRisk: boolean
): number {
  const detailWeighted =
    raw.details.color.score * 0.3 +
    raw.details.marbling.score * 0.25 +
    raw.details.surface.score * 0.25 +
    raw.details.shape.score * 0.2;

  const blended = Math.round(raw.overallScore * 0.7 + detailWeighted * 0.3);

  const riskCount = Object.values(flags).filter(Boolean).length;
  const warningPenalty = Math.min(raw.warnings.length, 4) * 2;
  const riskPenalty = riskCount * 6;
  const excessFatPenalty = excessFatRisk ? 10 : 0;

  return clamp(
    Math.round(blended - warningPenalty - riskPenalty - excessFatPenalty),
    0,
    100
  );
}

function computeRecommendation(
  score: number,
  grade: Grade,
  flags: QualityFlags,
  warningCount: number,
  excessFatRisk: boolean
): BuyRecommendation {
  const riskCount = Object.values(flags).filter(Boolean).length;

  if (score < 55 || grade === 'bad' || riskCount >= 2 || excessFatRisk) {
    return 'avoid';
  }

  if (score >= 82 && grade === 'good' && riskCount === 0 && warningCount === 0) {
    return 'buy';
  }

  return 'conditional';
}

function computeConfidence(
  raw: AnalysisRawResultOutput,
  flags: QualityFlags,
  recommendation: BuyRecommendation,
  excessFatRisk: boolean
): number {
  const riskCount = Object.values(flags).filter(Boolean).length;

  let confidence = 0.82;
  confidence -= riskCount * 0.11;
  confidence -= Math.min(raw.warnings.length, 4) * 0.03;
  if (excessFatRisk) confidence -= 0.08;

  if (raw.goodTraits.length >= 2) confidence += 0.05;
  if (recommendation === 'avoid') confidence += 0.03;

  return Number(clamp(Number(confidence.toFixed(3)), 0.35, 0.95));
}

function buildReasons(
  raw: AnalysisRawResultOutput,
  flags: QualityFlags,
  recommendation: BuyRecommendation,
  excessFatRisk: boolean
): string[] {
  const reasons: string[] = [];

  for (const trait of raw.goodTraits.slice(0, 2)) {
    reasons.push(`Positive: ${trait}`);
  }

  if (flags.discoloration) reasons.push('Risk: possible discoloration or freshness drop.');
  if (flags.pseRisk) reasons.push('Risk: possible PSE-like quality pattern.');
  if (flags.surfaceRisk) reasons.push('Risk: possible surface quality issue.');
  if (flags.elasticityRisk) reasons.push('Risk: possible low elasticity pattern.');
  if (excessFatRisk) {
    reasons.push(
      'Risk: pork belly appears overly fatty compared to balanced Korean market preference.'
    );
  }

  for (const warning of raw.warnings.slice(0, 2)) {
    reasons.push(`Warning: ${warning}`);
  }

  if (reasons.length === 0) {
    reasons.push(
      recommendation === 'buy'
        ? 'No major visual risk was detected in this image.'
        : 'Visual information is limited, so purchase decision should be conservative.'
    );
  }

  return reasons;
}

function normalizeAnalyzedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

export function postProcessAnalysisResult(
  raw: AnalysisRawResultOutput,
  context?: AnalysisContext
): AnalysisResult {
  const qualityFlags = buildQualityFlags(raw);
  const excessFatRisk = detectExcessFatRisk(raw, context);
  const adjustedScore = computeAdjustedScore(raw, qualityFlags, excessFatRisk);
  const normalizedGrade = normalizeGradeFromScore(adjustedScore);

  const recommendation = computeRecommendation(
    adjustedScore,
    normalizedGrade,
    qualityFlags,
    raw.warnings.length,
    excessFatRisk
  );

  const confidence = computeConfidence(
    raw,
    qualityFlags,
    recommendation,
    excessFatRisk
  );
  const reasons = buildReasons(raw, qualityFlags, recommendation, excessFatRisk);

  const finalResult: AnalysisResult = {
    ...raw,
    overallScore: adjustedScore,
    overallGrade: normalizedGrade,
    buyRecommendation: recommendation,
    confidence,
    reasons,
    qualityFlags,
    analyzedAt: normalizeAnalyzedAt(raw.analyzedAt),
  };

  const validated = analysisResultSchema.safeParse(finalResult);
  if (!validated.success) {
    console.error('Final analysis result validation failed:', validated.error.issues);
    throw new Error('Final analysis result shape is invalid after post-processing.');
  }

  return validated.data;
}
