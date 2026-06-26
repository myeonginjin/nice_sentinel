import type { Merchant } from '@/types';
import { merchants as localMerchants } from '@/mock';
import { api } from '@/api/client';

export async function getMerchants(): Promise<Merchant[]> {
  return api.get<Merchant[]>('/v1/merchants').catch(() => localMerchants);
}

export async function getMerchant(id: string): Promise<Merchant | undefined> {
  return api
    .get<Merchant>(`/v1/merchants/${id}`)
    .catch(() => localMerchants.find((m) => m.id === id));
}
