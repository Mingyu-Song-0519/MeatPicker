import { postProcessAnalysisResult } from '../post-process';
import type { AnalysisRawResultOutput } from '../schemas';

function makeRaw(overrides?: Partial<AnalysisRawResultOutput>): AnalysisRawResultOutput {
  const base: AnalysisRawResultOutput = {
    overallGrade: 'normal',
    overallScore: 75,
    details: {
      color: { score: 78, description: 'ok' },
      marbling: { score: 74, description: 'ok' },
      surface: { score: 76, description: 'ok' },
      shape: { score: 72, description: 'ok' },
    },
    warnings: [],
    goodTraits: ['균일한 색상', '양호한 결'],
    limitations: ['냄새 미확인'],
    cutReference: {
      goodDescription: 'good',
      badDescription: 'bad',
    },
    analyzedAt: new Date().toISOString(),
  };

  return { ...base, ...overrides };
}

describe('postProcessAnalysisResult', () => {
  it('returns buy recommendation on strong low-risk result', () => {
    const raw = makeRaw({
      overallScore: 92,
      details: {
        color: { score: 92, description: 'ok' },
        marbling: { score: 90, description: 'ok' },
        surface: { score: 91, description: 'ok' },
        shape: { score: 89, description: 'ok' },
      },
      warnings: [],
    });

    const result = postProcessAnalysisResult(raw);
    expect(result.buyRecommendation).toBe('buy');
    expect(result.overallGrade).toBe('good');
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it('returns avoid recommendation when multiple risks exist', () => {
    const raw = makeRaw({
      overallScore: 60,
      details: {
        color: { score: 40, description: 'bad' },
        marbling: { score: 58, description: 'mid' },
        surface: { score: 38, description: 'bad' },
        shape: { score: 42, description: 'bad' },
      },
      warnings: ['갈변 징후', '끈적임 확인', '탄력 저하'],
    });

    const result = postProcessAnalysisResult(raw);
    expect(result.buyRecommendation).toBe('avoid');
    expect(result.qualityFlags.discoloration).toBe(true);
    expect(result.qualityFlags.surfaceRisk).toBe(true);
  });

  it('normalizes grade from adjusted score, not raw grade', () => {
    const raw = makeRaw({
      overallGrade: 'good',
      overallScore: 40,
      details: {
        color: { score: 40, description: 'bad' },
        marbling: { score: 42, description: 'bad' },
        surface: { score: 39, description: 'bad' },
        shape: { score: 41, description: 'bad' },
      },
      warnings: ['변색'],
    });

    const result = postProcessAnalysisResult(raw);
    expect(result.overallGrade).toBe('bad');
  });

  it('downgrades pork belly with explicit excess-fat signals', () => {
    const raw = makeRaw({
      overallScore: 86,
      details: {
        color: { score: 82, description: 'ok' },
        marbling: { score: 93, description: '비계층 과다, 지방 과다 소견' },
        surface: { score: 84, description: 'ok' },
        shape: { score: 60, description: '한쪽 지방 치우침' },
      },
      warnings: ['지방 과다'],
    });

    const result = postProcessAnalysisResult(raw, { meatType: 'pork', cut: 'belly' });
    expect(result.buyRecommendation).toBe('avoid');
    expect(result.reasons.join(' ')).toContain('overly fatty');
    expect(result.overallScore).toBeLessThan(86);
  });
});
