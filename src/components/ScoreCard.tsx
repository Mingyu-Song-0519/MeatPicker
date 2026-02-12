'use client';

// 종합 점수 카드 컴포넌트

import type { Grade } from '@/types/meat';

interface ScoreCardProps {
  overallGrade: Grade;
  overallScore: number;
  goodTraits: string[];
}

/** 등급별 스타일 설정 */
const GRADE_STYLES: Record<
  Grade,
  { label: string; bgColor: string; textColor: string; barColor: string }
> = {
  good: {
    label: '좋음',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    barColor: 'bg-emerald-500',
  },
  normal: {
    label: '보통',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    barColor: 'bg-amber-500',
  },
  bad: {
    label: '나쁨',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    barColor: 'bg-red-500',
  },
};

export default function ScoreCard({
  overallGrade,
  overallScore,
  goodTraits,
}: ScoreCardProps) {
  const style = GRADE_STYLES[overallGrade];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">종합 평가</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${style.bgColor} ${style.textColor}`}
        >
          {style.label}
        </span>
      </div>

      {/* 점수 표시 */}
      <div className="flex items-end gap-2 mb-3">
        <span className="text-4xl font-bold text-gray-900 font-[var(--font-geist-mono)]">
          {overallScore}
        </span>
        <span className="text-sm text-gray-400 mb-1">/ 100</span>
      </div>

      {/* 점수 바 */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-500 ${style.barColor}`}
          style={{ width: `${overallScore}%` }}
        />
      </div>

      {/* 좋은 특성 */}
      {goodTraits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 mb-2">
            긍정적 특성
          </h3>
          <div className="flex flex-wrap gap-2">
            {goodTraits.map((trait, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
