import type { MapVerification } from '@/types';
import { mapVerificationMock } from '@/mock';
import { api } from '@/api/client';

export async function verifyStore(bizNo: string, address: string): Promise<MapVerification> {
  return api
    .post<MapVerification>('/v1/map-verification', { bizNo, address })
    .catch(() => mapVerificationMock[bizNo]);
}
