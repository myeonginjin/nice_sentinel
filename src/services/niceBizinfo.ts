import type { CreditReport } from '@/types';
import { creditMock } from '@/mock';
import { mockDelay } from './_util';

export async function fetchCreditReport(bizNo: string): Promise<CreditReport> {
  // TODO(prod): NICE평가정보 bizinfo API 연동
  //   POST https://api.nicebizinfo.com/v1/company/credit
  //   Headers: { Authorization: `Bearer ${NICE_BIZINFO_API_KEY}` }
  //   Body: { bizNo }
  //   Response: CreditReport (grade, cashFlow, revenue, capital, status)
  return mockDelay(creditMock[bizNo]);
}
