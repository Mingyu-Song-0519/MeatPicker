// POST /api/analyze - 고기 품질 분석 API 라우트

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRequestSchema } from '@/lib/schemas';
import { analyzeImage } from '@/lib/vision-ai';

/** Vercel 서버리스 함수 최대 실행 시간 (초) */
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // 요청 바디 파싱
    const body = await request.json();

    // Zod 스키마로 요청 검증
    const validation = analyzeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: '잘못된 요청입니다.',
          code: 'VALIDATION_ERROR',
          details: validation.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { image, meatType, cut } = validation.data;

    // API 키 확인
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error: 'API 키가 설정되지 않았습니다.',
          code: 'CONFIG_ERROR',
        },
        { status: 500 }
      );
    }

    // Vision AI 분석 실행
    const result = await analyzeImage(image, meatType, cut);

    return NextResponse.json(result);
  } catch (error) {
    console.error('분석 API 오류:', error);

    // Anthropic API 에러 처리
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API 인증에 실패했습니다.', code: 'AUTH_ERROR' },
          { status: 401 }
        );
      }

      if (
        error.message.includes('rate limit') ||
        error.message.includes('429')
      ) {
        return NextResponse.json(
          {
            error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
            code: 'RATE_LIMIT',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: error.message || '분석 중 오류가 발생했습니다.',
          code: 'ANALYSIS_ERROR',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: '알 수 없는 오류가 발생했습니다.',
        code: 'UNKNOWN_ERROR',
      },
      { status: 500 }
    );
  }
}
