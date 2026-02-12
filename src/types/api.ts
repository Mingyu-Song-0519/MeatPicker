// API 요청/응답 타입 정의

import type { MeatType, AnalysisResult } from './meat';

/** 분석 요청 페이로드 */
export interface AnalyzeRequest {
  /** base64 인코딩된 이미지 데이터 */
  image: string;
  /** 고기 종류 (소고기/돼지고기) */
  meatType: MeatType;
  /** 부위 식별자 */
  cut: string;
}

/** 분석 응답 페이로드 (AnalysisResult와 동일) */
export type AnalyzeResponse = AnalysisResult;

/** API 에러 응답 */
export interface ApiErrorResponse {
  /** 에러 메시지 */
  error: string;
  /** 에러 코드 */
  code?: string;
}
