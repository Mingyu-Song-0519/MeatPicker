import type { MeatType } from '@/types/meat';
import type { CutCriteria, CutInfo } from '@/lib/constants';
import {
  GLOBAL_ANALYSIS_RULES,
  COMMON_BAD_SIGNS_FOR_PROMPT,
  OUTPUT_FIELDS_CHECKLIST,
} from '@/lib/prompt-rules';

interface PromptParts {
  systemPrompt: string;
  userPrompt: string;
}

function asBulletList(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function getCutSpecificGuidance(meatType: MeatType, cut: string): string[] {
  if (meatType === 'pork' && cut === 'belly') {
    return [
      '삼겹살에서는 "마블링 고득점"을 지방 과다로 오해하지 말고, 지방-살코기 층의 균형/균일성으로 평가하세요.',
      '비계층이 과도하게 두껍거나 살코기층이 얇으면 marbling/shape 점수를 함께 감점하세요.',
      '지방 과다가 의심되면 warnings에 명시적으로 "지방 과다"를 포함하세요.',
      '살코기와 지방이 균형적이고 층이 고른 경우에만 높은 점수를 부여하세요.',
    ];
  }

  return [];
}

export function buildAnalysisPrompt(
  meatType: MeatType,
  cut: string,
  cutInfo: CutInfo,
  cutCriteria: CutCriteria
): PromptParts {
  const meatTypeName = meatType === 'beef' ? '소고기' : '돼지고기';

  const systemPrompt = [
    'You are a strict meat quality visual evaluator.',
    '',
    'Rules:',
    asBulletList(GLOBAL_ANALYSIS_RULES),
    '',
    'Required output fields:',
    asBulletList(OUTPUT_FIELDS_CHECKLIST),
    '',
    'Output JSON schema shape:',
    '{',
    '  "overallGrade": "good" | "normal" | "bad",',
    '  "overallScore": 0-100 integer,',
    '  "details": {',
    '    "color": { "score": 0-100, "description": "..." },',
    '    "marbling": { "score": 0-100, "description": "..." },',
    '    "surface": { "score": 0-100, "description": "..." },',
    '    "shape": { "score": 0-100, "description": "..." }',
    '  },',
    '  "warnings": ["..."],',
    '  "goodTraits": ["..."],',
    '  "limitations": ["..."],',
    '  "cutReference": {',
    '    "goodDescription": "...",',
    '    "badDescription": "..."',
    '  },',
    '  "analyzedAt": "ISO-8601"',
    '}',
  ].join('\n');

  const userPrompt = [
    `Analyze the uploaded meat photo.`,
    '',
    'Target:',
    `- meatType: ${meatTypeName}`,
    `- cutKey: ${cut}`,
    `- cutName: ${cutInfo.nameKo} (${cutInfo.nameEn})`,
    '',
    'Cut quality reference (good):',
    cutCriteria.good,
    '',
    'Cut quality reference (bad):',
    cutCriteria.bad,
    '',
    'Common bad signs to check:',
    asBulletList(COMMON_BAD_SIGNS_FOR_PROMPT),
    ...(getCutSpecificGuidance(meatType, cut).length > 0
      ? [
          '',
          'Cut-specific scoring guidance:',
          asBulletList(getCutSpecificGuidance(meatType, cut)),
        ]
      : []),
    '',
    'Return only JSON that matches the schema exactly.',
  ].join('\n');

  return { systemPrompt, userPrompt };
}
