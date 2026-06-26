import type { Merchant } from '@/types';
import { merchants } from '@/mock';
import { mockDelay } from './_util';

export async function getMerchants(): Promise<Merchant[]> {
  // TODO(prod): 내부 심사 DB 조회
  //   GET /api/v1/merchants?status={status}&type={type}&page={page}&size={size}
  return mockDelay(merchants);
}

export async function getMerchant(id: string): Promise<Merchant | undefined> {
  // TODO(prod): GET /api/v1/merchants/{id}
  const found = merchants.find((m) => m.id === id);
  return mockDelay(found);
}
