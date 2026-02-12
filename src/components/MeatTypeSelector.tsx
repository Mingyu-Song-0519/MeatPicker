'use client';

// 고기 종류 선택 컴포넌트 (소고기 / 돼지고기)

import type { MeatType } from '@/types/meat';

interface MeatTypeSelectorProps {
  /** 현재 선택된 고기 종류 */
  selected: MeatType | null;
  /** 선택 변경 핸들러 */
  onSelect: (type: MeatType) => void;
}

const MEAT_TYPE_OPTIONS: { value: MeatType; label: string; emoji: string }[] = [
  { value: 'beef', label: '소고기', emoji: '🐂' },
  { value: 'pork', label: '돼지고기', emoji: '🐖' },
];

export default function MeatTypeSelector({
  selected,
  onSelect,
}: MeatTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MEAT_TYPE_OPTIONS.map(({ value, label, emoji }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={`
              flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <span className="text-3xl">{emoji}</span>
            <span
              className={`text-base font-medium ${
                isSelected ? 'text-blue-700' : 'text-gray-700'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
