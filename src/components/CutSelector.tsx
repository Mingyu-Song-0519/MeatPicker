'use client';

// 부위 선택 컴포넌트 - 선택된 고기 종류에 따라 부위 목록 표시

import type { MeatType } from '@/types/meat';
import { MEAT_CUTS } from '@/lib/constants';

interface CutSelectorProps {
  /** 선택된 고기 종류 */
  meatType: MeatType;
  /** 현재 선택된 부위 */
  selectedCut: string | null;
  /** 부위 선택 핸들러 */
  onSelect: (cut: string) => void;
}

export default function CutSelector({
  meatType,
  selectedCut,
  onSelect,
}: CutSelectorProps) {
  const cuts = MEAT_CUTS[meatType];
  const cutEntries = Object.entries(cuts);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {cutEntries.map(([key, info]) => {
        const isSelected = selectedCut === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`
              flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all text-center
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <span
              className={`text-sm font-medium ${
                isSelected ? 'text-blue-700' : 'text-gray-800'
              }`}
            >
              {info.nameKo}
            </span>
            <span className="text-xs text-gray-400">{info.nameEn}</span>
          </button>
        );
      })}
    </div>
  );
}
