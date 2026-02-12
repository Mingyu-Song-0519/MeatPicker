// 고기 품질 분석을 위한 핵심 타입 정의

/** 고기 종류 */
export type MeatType = 'beef' | 'pork';

/** 소고기 부위 */
export type BeefCut =
  | 'tenderloin'
  | 'ribeye'
  | 'striploin'
  | 'rib'
  | 'shank'
  | 'round';

/** 돼지고기 부위 */
export type PorkCut =
  | 'belly'
  | 'shoulder'
  | 'jowl'
  | 'loin'
  | 'picnic';

/** 모든 부위를 포함하는 유니온 타입 */
export type MeatCut = BeefCut | PorkCut;

/** 품질 등급 */
export type Grade = 'good' | 'normal' | 'bad';

/** 세부 항목 점수 */
export interface DetailScore {
  /** 0~100 범위의 점수 */
  score: number;
  /** 해당 항목에 대한 설명 */
  description: string;
}

/** AI 분석 결과 */
export interface AnalysisResult {
  /** 전체 품질 등급 */
  overallGrade: Grade;
  /** 전체 점수 (0~100) */
  overallScore: number;
  /** 세부 분석 항목 */
  details: {
    /** 색상 분석 */
    color: DetailScore;
    /** 마블링/지방 분석 */
    marbling: DetailScore;
    /** 표면 상태 분석 */
    surface: DetailScore;
    /** 형태/균일성 분석 */
    shape: DetailScore;
  };
  /** 경고 사항 목록 */
  warnings: string[];
  /** 좋은 특성 목록 */
  goodTraits: string[];
  /** 사진으로 확인 불가능한 항목 안내 */
  limitations: string[];
  /** 해당 부위의 기준 정보 */
  cutReference: {
    /** 좋은 고기 기준 설명 */
    goodDescription: string;
    /** 나쁜 고기 기준 설명 */
    badDescription: string;
  };
  /** 분석 시각 (ISO 문자열) */
  analyzedAt: string;
}
