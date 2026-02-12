// 이미지 처리 유틸리티 - 리사이즈, 유효성 검증

/** 허용되는 이미지 MIME 타입 */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

/** 최대 파일 크기 (10MB) */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** 리사이즈 최대 크기 */
const MAX_DIMENSION = 1024;

/** JPEG 압축 품질 */
const JPEG_QUALITY = 0.8;

/**
 * 이미지 파일 유효성 검증
 * @param file - 검증할 파일
 * @returns 유효성 결과와 에러 메시지
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file) {
    return { valid: false, error: '파일이 선택되지 않았습니다.' };
  }

  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return {
      valid: false,
      error: 'JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 업로드 가능합니다.`,
    };
  }

  return { valid: true };
}

/**
 * 이미지를 최대 1024x1024로 리사이즈하고 base64로 변환
 * @param file - 리사이즈할 이미지 파일
 * @returns base64 인코딩된 JPEG 데이터 URI
 */
export function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // 비율을 유지하면서 최대 크기 제한
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 컨텍스트를 생성할 수 없습니다.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(dataUrl);
      } catch (err) {
        reject(
          new Error(
            `이미지 리사이즈 중 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}`
          )
        );
      }
    };

    img.onerror = () => {
      reject(new Error('이미지를 로드할 수 없습니다.'));
    };

    reader.readAsDataURL(file);
  });
}
