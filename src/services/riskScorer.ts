import type { RiskAssessment, Merchant } from '@/types';
import { assessmentMock } from '@/mock';
import { mockDelay } from './_util';

export async function assess(_merchant: Merchant): Promise<RiskAssessment> {
  // TODO(prod): LLM 종합 스코어링 파이프라인 연동
  //   Step 1 — 정형 신호 집계: CreditReport + CriReport → 기준 점수 산출
  //   Step 2 — 비정형 신호 통합: SiteAnalysis 또는 MapVerification → 감점/가점
  //   Step 3 — LLM 호출 (Claude claude-sonnet-4-6):
  //     Prompt: 위 정형+비정형 데이터를 종합해 리스크 스코어, 등급, 권고를 JSON으로 반환하고
  //             심사 근거를 한국어 3~5문장으로 생성
  //   Step 4 — factors 배열 생성 (설명가능성), aiReport 자연어 생성
  return mockDelay(assessmentMock[_merchant.id]);
}
