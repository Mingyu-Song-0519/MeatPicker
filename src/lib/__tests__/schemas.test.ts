import {
  analyzeRequestSchema,
  analysisResultSchema,
  MAX_IMAGE_BASE64_LENGTH,
} from '../schemas';

describe('schemas', () => {
  it('accepts a valid analyze request', () => {
    const input = {
      image: 'data:image/jpeg;base64,aGVsbG8=',
      meatType: 'beef',
      cut: 'ribeye',
    };

    const result = analyzeRequestSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects oversize image payload', () => {
    const input = {
      image: `data:image/jpeg;base64,${'a'.repeat(MAX_IMAGE_BASE64_LENGTH + 1)}`,
      meatType: 'pork',
      cut: 'belly',
    };

    const result = analyzeRequestSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('requires expanded final fields in analysis result', () => {
    const input = {
      overallGrade: 'good',
      overallScore: 85,
      details: {
        color: { score: 90, description: 'ok' },
        marbling: { score: 80, description: 'ok' },
        surface: { score: 82, description: 'ok' },
        shape: { score: 84, description: 'ok' },
      },
      warnings: [],
      goodTraits: ['color'],
      limitations: ['smell not checkable'],
      cutReference: {
        goodDescription: 'good',
        badDescription: 'bad',
      },
      buyRecommendation: 'buy',
      confidence: 0.9,
      reasons: ['good quality'],
      qualityFlags: {
        discoloration: false,
        pseRisk: false,
        surfaceRisk: false,
        elasticityRisk: false,
      },
      analyzedAt: new Date().toISOString(),
    };

    const result = analysisResultSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
