import type { SiteAnalysis } from '@/types';
import { siteAnalysisMock } from '@/mock';
import { api } from '@/api/client';

export async function analyzeSite(bizNo: string, url: string): Promise<SiteAnalysis> {
  return api
    .post<SiteAnalysis>('/v1/site-analysis', { bizNo, url })
    .catch(() => siteAnalysisMock[bizNo]);
}
