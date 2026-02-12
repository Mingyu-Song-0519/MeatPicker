'use client';

// 경고 배너 컴포넌트 - 분석에서 발견된 경고 사항 표시

interface WarningBannerProps {
  warnings: string[];
}

export default function WarningBanner({ warnings }: WarningBannerProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-red-700 mb-1">
            주의 사항
          </h3>
          <ul className="space-y-1">
            {warnings.map((warning, idx) => (
              <li key={idx} className="text-sm text-red-600">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
