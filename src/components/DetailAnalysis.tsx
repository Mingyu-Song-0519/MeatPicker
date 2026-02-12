'use client';

// 세부 분석 항목 컴포넌트 - 색상, 마블링, 표면, 형태

import type { DetailScore } from '@/types/meat';

interface DetailAnalysisProps {
  details: {
    color: DetailScore;
    marbling: DetailScore;
    surface: DetailScore;
    shape: DetailScore;
  };
}

/** 세부 항목 라벨 */
const DETAIL_LABELS: Record<string, string> = {
  color: '색상',
  marbling: '마블링/지방',
  surface: '표면 상태',
  shape: '형태/균일성',
};

/** 점수 범위별 바 색상 */
function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

/** 점수 범위별 텍스트 색상 */
function getScoreTextColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export default function DetailAnalysis({ details }: DetailAnalysisProps) {
  const entries = Object.entries(details) as [string, DetailScore][];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">세부 분석</h2>
      <div className="space-y-4">
        {entries.map(([key, detail]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {DETAIL_LABELS[key] ?? key}
              </span>
              <span
                className={`text-sm font-bold font-[var(--font-geist-mono)] ${getScoreTextColor(detail.score)}`}
              >
                {detail.score}
              </span>
            </div>
            {/* 점수 바 */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(detail.score)}`}
                style={{ width: `${detail.score}%` }}
              />
            </div>
            {/* 설명 */}
            <p className="text-xs text-gray-500 leading-relaxed">
              {detail.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
