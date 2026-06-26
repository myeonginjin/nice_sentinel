import type { CriReport } from '@/types';
import { criMock } from '@/mock';
import { mockDelay } from './_util';

export async function fetchCriReport(bizNo: string): Promise<CriReport> {
  // TODO(prod): NICE D&B (나이스리포트) CRI API 연동
  //   GET https://api.nicereport.net/v2/cri/{bizNo}
  //   Headers: { Authorization: `Bearer ${NICE_DNB_API_KEY}`, 'X-Service-Id': NICE_DNB_SERVICE_ID }
  //   Response: { criGrade, trend: [{ date, grade, score }], updatedAt }
  return mockDelay(criMock[bizNo]);
}
