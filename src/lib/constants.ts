import type { MeatType, BeefCut, PorkCut } from '@/types/meat';

export interface CutInfo {
  nameKo: string;
  nameEn: string;
}

export interface CutCriteria {
  good: string;
  bad: string;
}

export const BEEF_CUTS: Record<BeefCut, CutInfo> = {
  tenderloin: { nameKo: '안심', nameEn: 'Tenderloin' },
  ribeye: { nameKo: '등심', nameEn: 'Ribeye' },
  striploin: { nameKo: '채끝', nameEn: 'Striploin' },
  rib: { nameKo: '갈비', nameEn: 'Rib' },
  shank: { nameKo: '사태/양지', nameEn: 'Shank/Brisket' },
  round: { nameKo: '우둔/설도', nameEn: 'Round' },
};

export const PORK_CUTS: Record<PorkCut, CutInfo> = {
  belly: { nameKo: '삼겹살', nameEn: 'Belly' },
  shoulder: { nameKo: '목심', nameEn: 'Shoulder' },
  jowl: { nameKo: '항정살', nameEn: 'Jowl' },
  loin: { nameKo: '안심/등심', nameEn: 'Tenderloin/Loin' },
  picnic: { nameKo: '앞다리살', nameEn: 'Picnic Shoulder' },
};

export const MEAT_CUTS: Record<MeatType, Record<string, CutInfo>> = {
  beef: BEEF_CUTS,
  pork: PORK_CUTS,
};

export const BEEF_CUT_CRITERIA: Record<BeefCut, CutCriteria> = {
  tenderloin: {
    good: '선명한 붉은색, 고운 결, 과하지 않은 표면 지방. 표면이 건조하지 않고 윤기가 자연스러움.',
    bad: '색이 탁하거나 갈변, 결이 거칠고 표면이 마르거나 끈적임. 지방이 과도하게 들뜬 상태.',
  },
  ribeye: {
    good: '근내지방이 고르게 퍼지고 살코기와 지방 경계가 자연스러움. 색이 선명하고 단면이 깨끗함.',
    bad: '지방이 한쪽에 뭉치거나 지나치게 많아 살코기 비중이 낮음. 변색/수분 유출이 보임.',
  },
  striploin: {
    good: '살코기 비중이 충분하고 결 방향이 일정함. 표면이 매끈하고 눌렀을 때 탄력감이 있음.',
    bad: '결이 들뜨거나 찢긴 느낌, 지방층 분리, 표면 점액감 또는 탁한 광택.',
  },
  rib: {
    good: '고기 두께가 충분하고 지방·힘줄이 과하지 않으며 단면 색이 선명함.',
    bad: '지방/힘줄이 과도하거나 살코기 두께가 얇아 구이 품질이 떨어질 형태.',
  },
  shank: {
    good: '붉은 살코기와 결합조직 분포가 균형적이며 변색이 없음.',
    bad: '표면 건조/변색이 심하고 결합조직이 과도하게 거칠어 보임.',
  },
  round: {
    good: '지방이 과하지 않고 균일한 살코기 결. 단면이 깨끗하고 탄력 있음.',
    bad: '색이 탁하고 결이 거칠며 표면 수분 이탈이 많아 보임.',
  },
};

export const PORK_CUT_CRITERIA: Record<PorkCut, CutCriteria> = {
  belly: {
    good: [
      '한국 소비자/유통 선호 기준에서 삼겹 단면은 지방·살코기 층이 고르게 겹치고, 한쪽 비계층이 비정상적으로 두껍지 않은 형태가 유리함.',
      '지방이 너무 적어 퍽퍽해 보이거나, 반대로 과도하게 두꺼운 비계층이 지배적인 단면은 감점.',
      '살코기와 지방 비율이 균형적이고(대체로 중간 지방대), 색이 선홍~연분홍이며 표면 수분이 과다하지 않은 상태를 우선 평가.',
      '삼겹의 "좋은 지방"은 근내 마블링 과다를 뜻하지 않고, 층 분포의 균형/균일성을 뜻함.',
    ].join(' '),
    bad: [
      '비계층이 과도하게 두껍고 살코기 층이 얇은 단면(과지방) 또는 지방이 거의 없어 지나치게 마른 단면.',
      '지방·살코기 층 경계가 무너지거나 한쪽으로 치우친 단면, 수분 유출이 많은 창백·흐물한(PSE 의심) 표면.',
      '끈적임, 점액감, 탁한 색, 회색/갈변 기색은 신선도 저하 신호로 강한 감점.',
    ].join(' '),
  },
  shoulder: {
    good: '살코기와 지방 비율이 균형적이고 지방이 그물망처럼 분포. 결이 너무 굵지 않고 탄력이 있음.',
    bad: '근육 다발이 과도하게 굵거나 지방이 한쪽에 몰림. 창백/수분 과다 또는 점액감.',
  },
  jowl: {
    good: '지방과 살코기가 세밀하게 층을 이루며 색이 깨끗하고 표면이 매끈함.',
    bad: '지방이 비정상적으로 두껍거나 색이 탁함. 표면 끈적임/점액감.',
  },
  loin: {
    good: '결이 곱고 옅은 분홍색, 지방이 과하지 않은 담백한 단면. 표면이 건조하지 않음.',
    bad: '창백하거나 물이 많이 배어나오고 결이 흐트러진 단면. 이색(두 톤) 및 변색.',
  },
  picnic: {
    good: '근육량이 충분하고 탄력 있으며 살코기 결이 비교적 균일함.',
    bad: '근육 결 파손, 과도한 지방 치우침, 표면 점액감 또는 탁한 색.',
  },
};

export const CUT_CRITERIA: Record<MeatType, Record<string, CutCriteria>> = {
  beef: BEEF_CUT_CRITERIA,
  pork: PORK_CUT_CRITERIA,
};

export const COMMON_BAD_SIGNS = [
  '갈변/변색(회색, 탁한 갈색)',
  'PSE 의심(창백, 흐물, 수분 과다)',
  '점액질/끈적임(표면 미생물 증식 신호)',
  '탄력 저하(눌림 자국 회복 불량)',
] as const;

export const DISCLAIMER =
  '이 결과는 사진 기반 AI 추정입니다. 냄새·촉감·내부 상태는 사진만으로 확정할 수 없으므로 최종 구매 판단은 직접 상태 확인과 함께 결정하세요.';

export const PHOTO_LIMITATIONS = [
  '냄새(산패/이취) 확인 불가',
  '촉감/탄력의 물리적 확인 제한',
  '내부 온도/보관 이력 확인 불가',
  '미생물 오염 여부 직접 확인 불가',
  '공식 축산물 등급의 대체 불가',
] as const;
