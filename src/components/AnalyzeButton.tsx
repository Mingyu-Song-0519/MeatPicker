'use client';

// 분석 시작 버튼 컴포넌트

interface AnalyzeButtonProps {
  /** 이미지가 선택되었는지 */
  hasImage: boolean;
  /** 고기 종류가 선택되었는지 */
  hasMeatType: boolean;
  /** 부위가 선택되었는지 */
  hasCut: boolean;
  /** 분석 진행 중 여부 */
  isLoading: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}

export default function AnalyzeButton({
  hasImage,
  hasMeatType,
  hasCut,
  isLoading,
  onClick,
}: AnalyzeButtonProps) {
  const isReady = hasImage && hasMeatType && hasCut;

  // 안내 메시지 결정
  const getGuideMessage = (): string | null => {
    if (!hasImage) return '먼저 고기 사진을 업로드해주세요';
    if (!hasMeatType) return '고기 종류를 선택해주세요';
    if (!hasCut) return '부위를 선택해주세요';
    return null;
  };

  const guideMessage = getGuideMessage();

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={!isReady || isLoading}
        className={`
          w-full py-4 rounded-xl text-lg font-semibold transition-all
          ${
            isReady && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            AI가 분석 중입니다...
          </span>
        ) : (
          '고기 품질 분석하기'
        )}
      </button>
      {guideMessage && !isLoading && (
        <p className="text-center text-sm text-gray-400 mt-2">
          {guideMessage}
        </p>
      )}
    </div>
  );
}
