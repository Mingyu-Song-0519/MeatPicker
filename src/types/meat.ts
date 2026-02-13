// Domain types for meat quality analysis

export type MeatType = 'beef' | 'pork';

export type BeefCut =
  | 'tenderloin'
  | 'ribeye'
  | 'striploin'
  | 'rib'
  | 'shank'
  | 'round';

export type PorkCut =
  | 'belly'
  | 'shoulder'
  | 'jowl'
  | 'loin'
  | 'picnic';

export type MeatCut = BeefCut | PorkCut;

export type Grade = 'good' | 'normal' | 'bad';

export type BuyRecommendation = 'buy' | 'conditional' | 'avoid';

export interface DetailScore {
  score: number;
  description: string;
}

export interface QualityFlags {
  discoloration: boolean;
  pseRisk: boolean;
  surfaceRisk: boolean;
  elasticityRisk: boolean;
}

export interface AnalysisResult {
  overallGrade: Grade;
  overallScore: number;
  details: {
    color: DetailScore;
    marbling: DetailScore;
    surface: DetailScore;
    shape: DetailScore;
  };
  warnings: string[];
  goodTraits: string[];
  limitations: string[];
  cutReference: {
    goodDescription: string;
    badDescription: string;
  };
  buyRecommendation: BuyRecommendation;
  confidence: number;
  reasons: string[];
  qualityFlags: QualityFlags;
  analyzedAt: string;
}
