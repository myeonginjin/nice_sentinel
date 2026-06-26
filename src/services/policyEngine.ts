import type { CollateralRecommendation, RiskGrade, MerchantType } from '@/types';
import { collateralMock } from '@/mock';
import { api } from '@/api/client';

export interface PolicyProfile {
  merchantId: string;
  type: MerchantType;
  grade: RiskGrade;
  recommendation: 'APPROVE' | 'CONDITIONAL' | 'REJECT';
}

export async function recommendCollateral(profile: PolicyProfile): Promise<CollateralRecommendation> {
  return api
    .post<CollateralRecommendation>('/v1/collateral-recommendation', profile)
    .catch(() => collateralMock[profile.merchantId]);
}
