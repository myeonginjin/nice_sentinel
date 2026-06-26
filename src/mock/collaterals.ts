import type { CollateralRecommendation } from '@/types';

export const collateralMock: Record<string, CollateralRecommendation> = {
  'M-001': {
    requireSuretyInsurance: false,
    recommendedLimit: 30_000_000,
    appliedRule: 'RULE-ONL-LOW-01',
  },
  'M-002': {
    requireSuretyInsurance: false,
    recommendedLimit: 0,
    appliedRule: 'RULE-ONL-HIGH-REJ-01',
  },
  'M-003': {
    requireSuretyInsurance: true,
    recommendedLimit: 10_000_000,
    appliedRule: 'RULE-ONL-MED-02',
  },
  'M-004': {
    requireSuretyInsurance: false,
    recommendedLimit: 20_000_000,
    appliedRule: 'RULE-OFF-LOW-01',
  },
  'M-005': {
    requireSuretyInsurance: false,
    recommendedLimit: 0,
    appliedRule: 'RULE-OFF-HIGH-REJ-01',
  },
  'M-006': {
    requireSuretyInsurance: true,
    recommendedLimit: 5_000_000,
    appliedRule: 'RULE-OFF-MED-02',
  },
  'M-007': {
    requireSuretyInsurance: false,
    recommendedLimit: 0,
    appliedRule: 'RULE-OFF-PROHIB-01',
  },
};
