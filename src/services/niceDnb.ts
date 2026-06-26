import type { CriReport } from '@/types';
import { criMock } from '@/mock';
import { api } from '@/api/client';

export async function fetchCriReport(bizNo: string): Promise<CriReport> {
  return api
    .get<CriReport>(`/v1/cri-report/${bizNo}`)
    .catch(() => criMock[bizNo]);
}
