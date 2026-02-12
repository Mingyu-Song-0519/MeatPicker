// Vision AI 분석 모듈 - Anthropic Claude API를 통한 고기 품질 분석

import Anthropic from '@anthropic-ai/sdk';
import type { AnalysisResult } from '@/types/meat';
import { analysisResultSchema } from '@/lib/schemas';
import { buildAnalysisPrompt } from '@/lib/prompts';
import { MEAT_CUTS, CUT_CRITERIA } from '@/lib/constants';
import type { MeatType } from '@/types/meat';

/** Anthropic 클라이언트 (서버 사이드 전용) */
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * base64 데이터 URI에서 미디어 타입과 순수 base64 데이터를 분리
 */
function parseBase64Image(imageData: string): {
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  data: string;
} {
  // data:image/jpeg;base64,/9j/... 형식 처리
  const match = imageData.match(
    /^data:(image\/(jpeg|png|webp|gif));base64,(.+)$/
  );
  if (match) {
    return {
      mediaType: match[1] as
        | 'image/jpeg'
        | 'image/png'
        | 'image/webp'
        | 'image/gif',
      data: match[3],
    };
  }

  // 순수 base64 데이터인 경우 JPEG로 가정
  return {
    mediaType: 'image/jpeg',
    data: imageData,
  };
}

/**
 * 고기 이미지를 Vision AI로 분석
 * @param imageBase64 - base64 인코딩된 이미지 (data URI 또는 순수 base64)
 * @param meatType - 고기 종류
 * @param cut - 부위 식별자
 * @returns 분석 결과
 */
export async function analyzeImage(
  imageBase64: string,
  meatType: MeatType,
  cut: string
): Promise<AnalysisResult> {
  // 부위 정보 및 기준 조회
  const cutInfo = MEAT_CUTS[meatType][cut];
  const cutCriteria = CUT_CRITERIA[meatType][cut];

  if (!cutInfo || !cutCriteria) {
    throw new Error(`유효하지 않은 부위입니다: ${meatType} - ${cut}`);
  }

  // 프롬프트 생성
  const { systemPrompt, userPrompt } = buildAnalysisPrompt(
    meatType,
    cut,
    cutInfo,
    cutCriteria
  );

  // 이미지 데이터 파싱
  const { mediaType, data } = parseBase64Image(imageBase64);

  // Claude API 호출
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: data,
            },
          },
          {
            type: 'text',
            text: userPrompt,
          },
        ],
      },
    ],
  });

  // 응답에서 텍스트 추출
  const textContent = response.content.find((block) => block.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('AI 응답에서 텍스트를 찾을 수 없습니다.');
  }

  // JSON 파싱 (응답이 ```json 블록으로 감싸져 있을 수 있음)
  let jsonStr = textContent.text.trim();
  const jsonBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    jsonStr = jsonBlockMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error('AI 응답을 JSON으로 파싱할 수 없습니다.');
  }

  // Zod 스키마로 유효성 검증
  const validated = analysisResultSchema.safeParse(parsed);
  if (!validated.success) {
    console.error('AI 응답 검증 실패:', validated.error.issues);
    throw new Error('AI 응답이 예상 형식과 일치하지 않습니다.');
  }

  return validated.data;
}
