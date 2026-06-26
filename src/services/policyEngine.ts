import type { CollateralRecommendation, RiskGrade, MerchantType } from '@/types';
import { collateralMock } from '@/mock';
import { mockDelay } from './_util';

export interface PolicyProfile {
  merchantId: string;
  type: MerchantType;
  grade: RiskGrade;
  recommendation: 'APPROVE' | 'CONDITIONAL' | 'REJECT';
}

export async function recommendCollateral(profile: PolicyProfile): Promise<CollateralRecommendation> {
  // TODO(prod): 규칙 기반 정책 엔진으로 교체 (이 로직은 실서버에서도 대부분 유지 가능)
  //   RULE-ONL-LOW-01  : 온라인, LOW  → 보증보험 불필요, 한도 3000만
  //   RULE-ONL-MED-02  : 온라인, MED  → 보증보험 필요, 한도 1000만
  //   RULE-ONL-HIGH-REJ-01: 온라인, REJECT → 한도 0
  //   RULE-OFF-LOW-01  : 오프라인, LOW → 보증보험 불필요, 한도 2000만
  //   RULE-OFF-MED-02  : 오프라인, MED → 보증보험 필요, 한도 500만
  //   RULE-OFF-HIGH-REJ-01: 오프라인, REJECT → 한도 0
  //   RULE-OFF-PROHIB-01: 금지업종 → 한도 0
  return mockDelay(collateralMock[profile.merchantId]);
}
