'use client';

// 부위 기준 비교 컴포넌트 - 좋은 고기 vs 나쁜 고기 기준 표시

interface CutComparisonProps {
  cutReference: {
    goodDescription: string;
    badDescription: string;
  };
  cutName: string;
}

export default function CutComparison({
  cutReference,
  cutName,
}: CutComparisonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        {cutName} 품질 기준
      </h2>
      <div className="space-y-4">
        {/* 좋은 고기 기준 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">
              좋은 고기 특징
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-4">
            {cutReference.goodDescription}
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* 나쁜 고기 기준 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-sm font-semibold text-red-700">
              피해야 할 특징
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed pl-4">
            {cutReference.badDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
