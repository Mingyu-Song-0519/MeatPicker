'use client';

// 이미지 업로드/촬영 컴포넌트

import { useRef, useState, useCallback } from 'react';
import { validateImageFile, resizeImage } from '@/lib/image-utils';

interface ImageUploaderProps {
  /** 이미지가 선택/제거되었을 때 호출 (base64 data URI 또는 null) */
  onImageChange: (image: string | null) => void;
  /** 현재 선택된 이미지 (미리보기용) */
  currentImage: string | null;
}

export default function ImageUploader({
  onImageChange,
  currentImage,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);

      // 유효성 검증
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error ?? '유효하지 않은 파일입니다.');
        return;
      }

      setIsProcessing(true);
      try {
        const resized = await resizeImage(file);
        onImageChange(resized);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : '이미지 처리 중 오류가 발생했습니다.'
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [onImageChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
      // input 값 초기화 (같은 파일 재선택 가능하도록)
      e.target.value = '';
    },
    [handleFileSelect]
  );

  const handleRemove = useCallback(() => {
    onImageChange(null);
    setError(null);
  }, [onImageChange]);

  return (
    <div className="w-full">
      {/* 이미지 미리보기 */}
      {currentImage ? (
        <div className="relative mb-4">
          <img
            src={currentImage}
            alt="선택한 고기 이미지"
            className="w-full max-h-80 object-contain rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
            aria-label="이미지 제거"
          >
            X
          </button>
        </div>
      ) : (
        /* 업로드 영역 */
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* 파일 업로드 버튼 */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {isProcessing ? '처리 중...' : '사진 선택'}
            </span>
          </button>

          {/* 카메라 촬영 버튼 */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-1 flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {isProcessing ? '처리 중...' : '카메라 촬영'}
            </span>
          </button>
        </div>
      )}

      {/* 숨김 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
        aria-label="이미지 파일 선택"
      />

      {/* 숨김 카메라 입력 */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        aria-label="카메라로 촬영"
      />

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
