// AI 프롬프트 빌더 - Vision AI 분석 요청용 프롬프트 생성

import type { MeatType } from '@/types/meat';
import type { CutCriteria, CutInfo } from '@/lib/constants';

interface PromptParts {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * 고기 품질 분석을 위한 프롬프트 생성
 * @param meatType - 고기 종류
 * @param cut - 부위 식별자
 * @param cutInfo - 부위 이름 정보
 * @param cutCriteria - 부위별 품질 기준
 * @returns 시스템 프롬프트와 사용자 프롬프트
 */
export function buildAnalysisPrompt(
  meatType: MeatType,
  cut: string,
  cutInfo: CutInfo,
  cutCriteria: CutCriteria
): PromptParts {
  const meatTypeName = meatType === 'beef' ? '소고기' : '돼지고기';

  const systemPrompt = `당신은 전문 육류 품질 평가사입니다. 사용자가 제공한 고기 사진을 분석하여 품질을 평가합니다.

## 역할
- 사진에서 보이는 고기의 색상, 마블링/지방 분포, 표면 상태, 형태/균일성을 분석합니다.
- 반드시 아래 JSON 형식으로만 응답합니다. JSON 외의 텍스트는 포함하지 마세요.

## 중요 규칙
1. 사진이 고기가 아닌 경우, overallGrade를 "bad"로 설정하고 warnings에 "제공된 이미지가 고기 사진이 아닌 것으로 판단됩니다."를 포함하세요.
2. 모든 텍스트는 한국어로 작성하세요.
3. 점수는 0~100 사이의 정수입니다.
4. 등급 기준: 80점 이상 = "good", 50~79점 = "normal", 49점 이하 = "bad"
5. 사진으로만 판단하므로, 냄새/촉감/온도 등은 limitations에 포함하세요.

## 응답 JSON 형식
{
  "overallGrade": "good" | "normal" | "bad",
  "overallScore": 0-100,
  "details": {
    "color": { "score": 0-100, "description": "색상 분석 결과 설명" },
    "marbling": { "score": 0-100, "description": "마블링/지방 분포 분석 결과 설명" },
    "surface": { "score": 0-100, "description": "표면 상태 분석 결과 설명" },
    "shape": { "score": 0-100, "description": "형태/균일성 분석 결과 설명" }
  },
  "warnings": ["경고 사항 배열"],
  "goodTraits": ["긍정적 특성 배열"],
  "limitations": ["사진으로 확인 불가능한 항목 배열"],
  "cutReference": {
    "goodDescription": "이 부위의 좋은 고기 기준",
    "badDescription": "이 부위의 나쁜 고기 기준"
  },
  "analyzedAt": "ISO 8601 형식 시각"
}`;

  const userPrompt = `이 사진의 고기를 분석해주세요.

## 분석 대상
- 고기 종류: ${meatTypeName}
- 부위: ${cutInfo.nameKo} (${cutInfo.nameEn})

## 이 부위의 품질 기준

### 좋은 고기 특징
${cutCriteria.good}

### 나쁜 고기 / 피해야 할 특징
${cutCriteria.bad}

## 공통 불량 징후 (참고)
- 갈변 및 이상 변색 (탁한 갈색, 회색)
- PSE (Pale, Soft, Exudative) - 창백, 흐물, 수분 과다
- 점액질/끈적거림 - 부패 박테리아 징후
- 탄력 저하 - 눌렀을 때 복원 안됨

위 기준을 참고하여 사진 속 ${meatTypeName} ${cutInfo.nameKo}의 품질을 JSON 형식으로 평가해주세요.
cutReference의 goodDescription과 badDescription에는 위에 제공한 품질 기준을 요약하여 포함하세요.`;

  return { systemPrompt, userPrompt };
}
