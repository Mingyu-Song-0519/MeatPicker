// 고기 부위 상수 및 품질 기준 데이터

import type { MeatType, BeefCut, PorkCut } from '@/types/meat';

/** 부위 정보 */
export interface CutInfo {
  /** 한국어 이름 */
  nameKo: string;
  /** 영어 이름 */
  nameEn: string;
}

/** 부위별 품질 기준 */
export interface CutCriteria {
  /** 좋은 고기의 특징 */
  good: string;
  /** 나쁜 고기의 특징 */
  bad: string;
}

/** 소고기 부위 목록 */
export const BEEF_CUTS: Record<BeefCut, CutInfo> = {
  tenderloin: { nameKo: '안심', nameEn: 'Tenderloin' },
  ribeye: { nameKo: '등심', nameEn: 'Ribeye' },
  striploin: { nameKo: '채끝', nameEn: 'Striploin' },
  rib: { nameKo: '갈비', nameEn: 'Rib' },
  shank: { nameKo: '사태/양지', nameEn: 'Shank/Brisket' },
  round: { nameKo: '우둔/설도', nameEn: 'Round' },
};

/** 돼지고기 부위 목록 */
export const PORK_CUTS: Record<PorkCut, CutInfo> = {
  belly: { nameKo: '삼겹살', nameEn: 'Belly' },
  shoulder: { nameKo: '목심', nameEn: 'Shoulder' },
  jowl: { nameKo: '항정살', nameEn: 'Jowl' },
  loin: { nameKo: '안심/등심', nameEn: 'Tenderloin/Loin' },
  picnic: { nameKo: '앞다리살', nameEn: 'Picnic Shoulder' },
};

/** 고기 종류별 부위 맵 */
export const MEAT_CUTS: Record<MeatType, Record<string, CutInfo>> = {
  beef: BEEF_CUTS,
  pork: PORK_CUTS,
};

/** 소고기 부위별 품질 기준 (meat.md 기반) */
export const BEEF_CUT_CRITERIA: Record<BeefCut, CutCriteria> = {
  tenderloin: {
    good: '짙은 진홍색을 띠며, 고깃결이 매우 곱고 부드러움. 지방이 적고 담백하며 육질이 연함.',
    bad: '지나치게 옅은 색이나 갈변한 색. 눌렀을 때 탄력이 없고 흐물거림. 표면 지방이 과도하게 두꺼움.',
  },
  ribeye: {
    good: '마블링이 꽃처럼 고르고 넓게 퍼져 있음. 살치살이 포함되어 마블링이 화려함. 새우살이 선명하고 조화로움.',
    bad: '떡지방(뭉친 지방)이 너무 크거나 색이 누런 것. 근간 지방 속에 질긴 힘줄이 굵게 박혀 있음. 검게 변하거나 핏물이 과도하게 고인 것.',
  },
  striploin: {
    good: '등심보다 지방은 적지만 살코기가 많음. 고깃결이 일정하고 정직하게 씹히는 식감이 보임.',
    bad: '고깃결이 거칠고 근섬유가 갈라진 것. 두께가 일정하지 않고 흐트러진 모양. 지방층이 너무 두껍거나 분리된 것.',
  },
  rib: {
    good: '고기가 두꺼운 앞부분이 상품. 마블링이 적당하고 뼈와 살이 단단히 붙어 있음.',
    bad: '지방과 질긴 힘줄이 과도하게 많은 것. 뼈 무게만 많이 나가고 살코기가 얇은 뒷부분.',
  },
  shank: {
    good: '붉은 살코기와 지방 외에 근막이 적당히 포함. 국물 요리 시 깊은 맛을 내는 근막이 있음.',
    bad: '표면이 말라 있거나 변색된 것. 겹친 부위에서 시큼한 냄새가 나는 것.',
  },
  round: {
    good: '고깃결이 균일하고 근막이 없음. 지방이 거의 없는 순수 살코기 위주.',
    bad: '근육 결이 굵고 거칠어 질겨 보이는 것. 고기 표면에 무지개색 광택이 심하거나 탁한 것.',
  },
};

/** 돼지고기 부위별 품질 기준 (meat.md 기반) */
export const PORK_CUT_CRITERIA: Record<PorkCut, CutCriteria> = {
  belly: {
    good: '살코기와 지방이 뚜렷하게 층을 이룸. 오돌뼈(늑연골)가 있는 머리 쪽이 부드럽고 고소함.',
    bad: '끝부분인 미추리는 지방층이 얇고 모양이 불규칙하며 구웠을 때 퍽퍽함. 지방 층이 너무 두꺼워 살코기가 거의 없는 것.',
  },
  shoulder: {
    good: '살코기와 지방의 비율이 균형 잡힘. 지방이 그물망처럼 고르게 퍼짐. 고깃결이 가늘고 고움.',
    bad: '근육 덩어리가 비대하게 발달하여 질긴 것. 내부에 피멍(혈반)이나 고름(농양) 흔적이 있음. 지나치게 창백하고 물기가 많은 것.',
  },
  jowl: {
    good: '천 겹의 마블링처럼 지방/살코기가 세밀하게 분포됨. 뽀얀 분홍빛과 단단한 지방.',
    bad: '누런색을 띠거나 붉은 반점이 있는 것. 흐물거리고 표면에 끈적한 액체가 묻어나는 것.',
  },
  loin: {
    good: '돼지고기 중 가장 결이 고움. 옅은 분홍색이며 지방이 적고 담백해 보임.',
    bad: '표면이 말라 비틀어졌거나 육즙이 과도하게 흘러나온 것. 두 가지 색이 섞여 있거나(Two-tone), 창백한 것.',
  },
  picnic: {
    good: '근육량이 많아 탄력이 있고 쫄깃해 보임. 살코기 함량이 풍부하여 진한 육색을 띰.',
    bad: '근육 사이가 벌어지거나 결합이 느슨한 것. 피하지방만 두껍고 살코기 내부 지방이 없는 것.',
  },
};

/** 고기 종류별 부위 품질 기준 맵 */
export const CUT_CRITERIA: Record<MeatType, Record<string, CutCriteria>> = {
  beef: BEEF_CUT_CRITERIA,
  pork: PORK_CUT_CRITERIA,
};

/** 공통 불량 징후 (소고기/돼지고기 모두 해당) */
export const COMMON_BAD_SIGNS = [
  '갈변 및 이상 변색 (탁한 갈색, 회색)',
  'PSE (Pale, Soft, Exudative) - 창백하고 흐물거리며 수분이 과다한 상태',
  '점액질/끈적거림 - 부패 박테리아 증식 징후',
  '탄력 저하 - 눌렀을 때 복원되지 않는 상태',
] as const;

/** 분석 정확도 면책 문구 */
export const DISCLAIMER =
  '본 분석은 AI 이미지 분석 기반으로, 실제 육질 상태와 70~80% 수준의 정확도를 가집니다. ' +
  '냄새, 촉감, 내부 상태 등 사진으로 확인할 수 없는 요소는 반영되지 않습니다. ' +
  '최종 구매 판단은 직접 확인 후 결정해 주세요.';

/** 사진으로 확인 불가능한 항목 */
export const PHOTO_LIMITATIONS = [
  '냄새 (시큼한 냄새, 불쾌한 냄새 등)',
  '촉감 및 탄력 (눌렀을 때 복원력)',
  '내부 온도 및 보관 상태',
  '정확한 등급 판정 (공식 등급은 전문 검사관만 가능)',
  '미생물 오염 여부',
] as const;
