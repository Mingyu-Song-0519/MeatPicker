'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { MeatType, AnalysisResult } from '@/types/meat';
import type { ApiErrorResponse } from '@/types/api';
import { MEAT_CUTS, DISCLAIMER } from '@/lib/constants';
import ImageUploader from '@/components/ImageUploader';
import MeatTypeSelector from '@/components/MeatTypeSelector';
import CutSelector from '@/components/CutSelector';
import AnalyzeButton from '@/components/AnalyzeButton';
import ScoreCard from '@/components/ScoreCard';
import DetailAnalysis from '@/components/DetailAnalysis';
import WarningBanner from '@/components/WarningBanner';
import CutComparison from '@/components/CutComparison';
import RecommendationPanel from '@/components/RecommendationPanel';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [meatType, setMeatType] = useState<MeatType | null>(null);
  const [cut, setCut] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMeatTypeSelect = useCallback((type: MeatType) => {
    setMeatType(type);
    setCut(null);
    setResult(null);
    setError(null);
  }, []);

  const handleCutSelect = useCallback((selectedCut: string) => {
    setCut(selectedCut);
    setResult(null);
    setError(null);
  }, []);

  const handleImageChange = useCallback((newImage: string | null) => {
    setImage(newImage);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!image || !meatType || !cut) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, meatType, cut }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [image, meatType, cut]);

  const handleReset = useCallback(() => {
    setImage(null);
    setMeatType(null);
    setCut(null);
    setResult(null);
    setError(null);
  }, []);

  const selectedCutName =
    meatType && cut ? MEAT_CUTS[meatType][cut]?.nameKo ?? cut : '';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">MeatPicker</h1>
          <p className="text-xs text-gray-500">AI 고기 품질 분석</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {result ? (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {meatType === 'beef' ? '소고기' : '돼지고기'} - {selectedCutName} 분석 결과
              </p>
            </div>

            {image && (
              <div className="relative w-full h-48 rounded-lg border border-gray-200 overflow-hidden">
                <Image
                  src={image}
                  alt="분석한 고기 이미지"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            )}

            <WarningBanner warnings={result.warnings} />

            <RecommendationPanel
              buyRecommendation={result.buyRecommendation}
              confidence={result.confidence}
              reasons={result.reasons}
              qualityFlags={result.qualityFlags}
            />

            <ScoreCard
              overallGrade={result.overallGrade}
              overallScore={result.overallScore}
              goodTraits={result.goodTraits}
            />

            <DetailAnalysis details={result.details} />

            <CutComparison
              cutReference={result.cutReference}
              cutName={selectedCutName}
            />

            {result.limitations.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">사진으로 확인이 어려운 항목</h3>
                <ul className="space-y-1">
                  {result.limitations.map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-500 flex gap-1">
                      <span className="text-gray-400">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-700 leading-relaxed">{DISCLAIMER}</p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              다시 분석하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-3">1. 고기 사진</h2>
              <ImageUploader onImageChange={handleImageChange} currentImage={image} />
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-3">2. 고기 종류</h2>
              <MeatTypeSelector selected={meatType} onSelect={handleMeatTypeSelect} />
            </section>

            {meatType && (
              <section>
                <h2 className="text-base font-semibold text-gray-800 mb-3">3. 부위 선택</h2>
                <CutSelector meatType={meatType} selectedCut={cut} onSelect={handleCutSelect} />
              </section>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <AnalyzeButton
              hasImage={!!image}
              hasMeatType={!!meatType}
              hasCut={!!cut}
              isLoading={isLoading}
              onClick={handleAnalyze}
            />
          </div>
        )}
      </main>
    </div>
  );
}
