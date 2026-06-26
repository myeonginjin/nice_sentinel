import type { RiskAssessment, Merchant } from '@/types';
import { assessmentMock } from '@/mock';
import { api } from '@/api/client';

export async function assess(merchant: Merchant): Promise<RiskAssessment> {
  return api
    .post<RiskAssessment>('/v1/risk-assessments', { merchantId: merchant.id })
    .catch(() => assessmentMock[merchant.id] as RiskAssessment);
}

export async function getAssessment(merchantId: string): Promise<RiskAssessment | undefined> {
  return api
    .get<RiskAssessment>(`/v1/risk-assessments/${merchantId}`)
    .catch(() => assessmentMock[merchantId]);
}

export async function getAssessments(): Promise<Record<string, RiskAssessment>> {
  return api
    .get<Record<string, RiskAssessment>>('/v1/risk-assessments')
    .catch(() => assessmentMock);
}
