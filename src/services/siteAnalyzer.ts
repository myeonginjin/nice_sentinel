import type { SiteAnalysis } from '@/types';
import { siteAnalysisMock } from '@/mock';
import { mockDelay } from './_util';

export async function analyzeSite(bizNo: string, _url: string): Promise<SiteAnalysis> {
  // TODO(prod): 웹 크롤러 + LLM 분석 파이프라인 연동
  //   Step 1 — 크롤러: GET {url} → HTML/텍스트/이미지 추출
  //     crawler-service: POST https://internal-crawler/scrape { url, depth: 2 }
  //   Step 2 — LLM 호출 (Claude claude-sonnet-4-6):
  //     Prompt: 업종 신고 내용({declaredCategory})와 실제 사이트 콘텐츠를 비교하고
  //             금지·위험 시그널, 사이트 품질, 리뷰 신뢰도를 JSON으로 반환
  //     Model: claude-sonnet-4-6 (or gpt-4o for fallback)
  //   Step 3 — 결과를 SiteAnalysis 타입으로 파싱 후 반환
  return mockDelay(siteAnalysisMock[bizNo]);
}
