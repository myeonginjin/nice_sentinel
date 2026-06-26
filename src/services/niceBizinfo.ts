import type { CreditReport } from '@/types';
import { creditMock } from '@/mock';
import { api } from '@/api/client';

export async function fetchCreditReport(bizNo: string): Promise<CreditReport> {
  return api
    .post<CreditReport>('/v1/credit-report', { bizNo })
    .catch(() => creditMock[bizNo]);
}
