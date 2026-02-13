'use client';

import type { BuyRecommendation, QualityFlags } from '@/types/meat';

interface RecommendationPanelProps {
  buyRecommendation: BuyRecommendation;
  confidence: number;
  reasons: string[];
  qualityFlags: QualityFlags;
}

const RECOMMENDATION_META: Record<
  BuyRecommendation,
  { label: string; color: string; bg: string }
> = {
  buy: {
    label: '구매 추천',
    color: 'text-emerald-700',
    bg: 'bg-emerald-100',
  },
  conditional: {
    label: '조건부 추천',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
  },
  avoid: {
    label: '구매 비추천',
    color: 'text-red-700',
    bg: 'bg-red-100',
  },
};

function confidenceToPercent(value: number): number {
  return Math.round(value * 100);
}

function renderRiskChips(flags: QualityFlags): string[] {
  const chips: string[] = [];
  if (flags.discoloration) chips.push('변색 위험');
  if (flags.pseRisk) chips.push('PSE 위험');
  if (flags.surfaceRisk) chips.push('표면 이상 위험');
  if (flags.elasticityRisk) chips.push('탄력 저하 위험');
  if (chips.length === 0) chips.push('주요 시각적 위험 없음');
  return chips;
}

export default function RecommendationPanel({
  buyRecommendation,
  confidence,
  reasons,
  qualityFlags,
}: RecommendationPanelProps) {
  const meta = RECOMMENDATION_META[buyRecommendation];
  const confidencePercent = confidenceToPercent(confidence);
  const chips = renderRiskChips(qualityFlags);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-bold text-gray-900">구매 판단</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${meta.bg} ${meta.color}`}>
          {meta.label}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        신뢰도: <span className="font-semibold text-gray-900">{confidencePercent}%</span>
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((chip) => (
          <span key={chip} className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
            {chip}
          </span>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">판단 근거</h3>
        <ul className="space-y-1">
          {reasons.slice(0, 5).map((reason, idx) => (
            <li key={`${idx}-${reason}`} className="text-sm text-gray-600">
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
