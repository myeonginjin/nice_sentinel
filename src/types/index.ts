export type MerchantType = 'ONLINE' | 'OFFLINE';
export type RiskGrade = 'LOW' | 'MEDIUM' | 'HIGH';
export type Recommendation = 'APPROVE' | 'CONDITIONAL' | 'REJECT';
export type ReviewStatus = 'PENDING' | 'IN_REVIEW' | 'DECIDED';

export interface Merchant {
  id: string;
  bizName: string;            // 상호
  bizNo: string;              // 사업자등록번호
  ceoName: string;            // 대표자명
  address: string;
  declaredCategory: string;   // 신고 업종
  type: MerchantType;
  siteUrl?: string;           // 온라인 한정
  salesRep: string;           // 영업담당
  requestedAt: string;        // ISO
  status: ReviewStatus;
}

// NICE평가정보 (bizinfo)
export interface CreditReport {
  source: 'NICE_BIZINFO';
  creditGrade: string;        // 예: 'BBB+'
  cashFlowGrade: string;
  revenue: number;            // 매출(백만원)
  capital: number;
  isClosed: boolean;          // 휴폐업
  updatedAt: string;
}

// NICE D&B (나이스리포트)
export interface CriReport {
  source: 'NICE_DNB';
  criGrade: string;           // 예: 'BB'
  trend: { date: string; grade: string; score: number }[];
  updatedAt: string;
}

// LLM — 온라인 사이트 분석
export interface SiteAnalysis {
  ceoNameMatch: boolean;
  siteQualityScore: number;   // 0~100
  declaredVsActual: { declared: string; inferred: string; match: boolean };
  prohibitedSignals: { signal: string; severity: RiskGrade; evidence: string }[];
  hasShippingPolicy: boolean;
  hasRefundPolicy: boolean;
  reviewSummary: string;
  rationale: string;          // AI 근거(자연어)
}

// 오프라인 매장 검증
export interface MapVerification {
  naver: boolean; kakao: boolean; google: boolean;
  signageMatch: boolean;
  isResidence: boolean;
  photoRequested: boolean;
  prohibitedBusinessRisk: { detected: boolean; reason: string; severity: RiskGrade };
}

// 정책 엔진 — 담보/한도
export interface CollateralRecommendation {
  requireSuretyInsurance: boolean; // 서울보증보험
  recommendedLimit: number;        // 한도(원)
  appliedRule: string;             // 예: 'RULE-OFF-MED-02'
}

// 종합 평가
export interface RiskAssessment {
  score: number;              // 0~100
  grade: RiskGrade;
  recommendation: Recommendation;
  factors: { name: string; impact: number; note: string }[];
  aiReport: string;           // LLM 종합 리포트(자연어)
}

// 사후 모니터링
export type AlertType = 'CREDIT_DROP' | 'REFUND_SPIKE' | 'PATTERN_SHIFT' | 'PG_SWITCH';
export interface MonitoringAlert {
  id: string;
  merchantId: string;
  type: AlertType;
  severity: RiskGrade;
  message: string;
  detectedAt: string;
  aiBrief?: string;           // LLM 브리프
}

export interface MerchantTimeseries {
  merchantId: string;
  credit: { date: string; score: number }[];
  refundRate: { date: string; value: number }[];
  avgTicket: { date: string; value: number }[];
  volume: { date: string; value: number }[];
}
