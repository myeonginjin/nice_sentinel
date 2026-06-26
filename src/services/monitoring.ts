import type { MonitoringAlert, MerchantTimeseries } from '@/types';
import { monitoringAlerts, timeseriesMock } from '@/mock';
import { mockDelay } from './_util';

export async function getAlerts(): Promise<MonitoringAlert[]> {
  // TODO(prod): 배치/스트림 모니터링 파이프라인 연동
  //   배치 스케줄 (매일 06:00 KST):
  //     1. NICE D&B CRI 등급 전 가맹점 일괄 조회 → 전일 대비 등급 하락 시 CREDIT_DROP 알림 생성
  //     2. NICE평가정보 신용등급 변동 감지
  //   실시간 스트림 (Kafka / AWS SQS):
  //     1. 정산 시스템 → 환불 건수 집계 → 환불률 임계치(5%) 초과 시 REFUND_SPIKE 알림
  //     2. 결제 패턴 이상 감지 (시간대별 분포, 객단가 급변) → PATTERN_SHIFT 알림
  //   신규 계약 시:
  //     이전 PG 이용 이력 조회 (업계 공유 DB or 가맹점 자진 신고) → PG_SWITCH 플래그
  return mockDelay(monitoringAlerts);
}

export async function getTimeseries(merchantId: string): Promise<MerchantTimeseries | undefined> {
  // TODO(prod): 데이터웨어하우스 조회 (BigQuery / Redshift)
  //   SELECT date_trunc('month', paid_at) as month,
  //          AVG(credit_score) as credit,
  //          SUM(refund_amount)/SUM(paid_amount) as refund_rate,
  //          AVG(paid_amount) as avg_ticket,
  //          COUNT(*) as volume
  //   FROM transactions t JOIN credit_scores c USING (merchant_id)
  //   WHERE t.merchant_id = {merchantId}
  //   GROUP BY 1 ORDER BY 1
  const found = timeseriesMock.find((t) => t.merchantId === merchantId);
  return mockDelay(found);
}

export async function getMerchantAlerts(merchantId: string): Promise<MonitoringAlert[]> {
  // TODO(prod): 위 getAlerts()와 동일한 파이프라인에서 merchantId 필터로 조회
  const filtered = monitoringAlerts.filter((a) => a.merchantId === merchantId);
  return mockDelay(filtered);
}
