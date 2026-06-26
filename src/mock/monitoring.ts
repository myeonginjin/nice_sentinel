import type { MonitoringAlert, MerchantTimeseries } from '@/types';

// 사후 모니터링 Mock 가맹점 (계약 중인 가맹점)
export const monitoringMerchants = [
  {
    id: 'MON-A',
    bizName: '서울상사',
    bizNo: '111-22-33333',
    type: 'OFFLINE' as const,
    currentGrade: 'BB',
    riskGrade: 'MEDIUM' as const,
  },
  {
    id: 'MON-B',
    bizName: '트렌디몰',
    bizNo: '222-33-44444',
    type: 'ONLINE' as const,
    currentGrade: 'B+',
    riskGrade: 'HIGH' as const,
  },
  {
    id: 'MON-C',
    bizName: '파스타나라',
    bizNo: '333-44-55555',
    type: 'OFFLINE' as const,
    currentGrade: 'BBB',
    riskGrade: 'LOW' as const,
  },
];

export const monitoringAlerts: MonitoringAlert[] = [
  {
    id: 'ALT-001',
    merchantId: 'MON-A',
    type: 'CREDIT_DROP',
    severity: 'HIGH',
    message: '서울상사 CRI BBB→BB 하락 — 3개월 연속 하락세',
    detectedAt: '2026-06-25T08:12:00Z',
    aiBrief:
      '서울상사의 CRI 등급이 3개월 연속 하락하여 BBB에서 BB로 한 단계 낮아졌습니다. NICE D&B 데이터에 따르면 이 기간 동안 단기 차입금 비율이 급증(+42%)하였고 영업이익률이 음전환되었습니다. 현재 추세가 지속될 경우 향후 2개월 내 BB- 이하 진입 가능성이 있으며, 이 경우 한도 축소 또는 담보 추가 요구 조치를 취해야 합니다. RM팀의 즉각적인 모니터링 강화를 권고합니다.',
  },
  {
    id: 'ALT-002',
    merchantId: 'MON-B',
    type: 'REFUND_SPIKE',
    severity: 'HIGH',
    message: '트렌디몰 환불률 3%→18% 급증 — 고객 민원 폭주 감지',
    detectedAt: '2026-06-24T14:33:00Z',
    aiBrief:
      '트렌디몰의 환불률이 지난 30일간 3%에서 18%로 급증했습니다. 이는 2021년 티몬·위메프 사태와 유사한 패턴으로, 선결제 후 미배송 또는 정산 지연 상황일 가능성이 높습니다. 거래 건당 평균 결제금액도 전월 대비 220% 상승(12만 원 → 39만 원)하여 비정상적인 대량 주문 유입이 의심됩니다. 즉시 정산 보류 및 가맹점 실사를 권고하며, 상황에 따라 거래 중단 조치를 검토해야 합니다.',
  },
  {
    id: 'ALT-003',
    merchantId: 'MON-C',
    type: 'PG_SWITCH',
    severity: 'MEDIUM',
    message: '파스타나라 타 PG(카카오페이먼츠)에서 전환 유입 — 전환 사유 미확인',
    detectedAt: '2026-06-23T10:05:00Z',
    aiBrief:
      '파스타나라는 기존에 카카오페이먼츠를 이용하던 가맹점으로, 직전 계약 종료 사유가 확인되지 않은 상태에서 당사로 전환 신청하였습니다. 타 PG와의 계약 종료 가맹점은 단순 수수료 조건 때문인 경우도 있지만, 분쟁·정산 문제로 인한 강제 해지일 가능성도 배제할 수 없습니다. 직전 PG에 비공개 조회를 요청하거나 영업담당을 통해 전환 경위 확인을 권고합니다. 당장의 재무 지표는 정상 범위이므로 정보 확인 후 결정을 내리면 됩니다.',
  },
  {
    id: 'ALT-004',
    merchantId: 'MON-B',
    type: 'PATTERN_SHIFT',
    severity: 'MEDIUM',
    message: '트렌디몰 심야(23시~04시) 결제 비중 68%로 이상 급증',
    detectedAt: '2026-06-22T06:00:00Z',
    aiBrief:
      '트렌디몰의 결제 시간대가 최근 1주일간 급격히 심야로 편중되었습니다(심야 23시~04시 비중 68%). 일반 쇼핑몰의 평균 심야 결제 비중이 8~12%임을 감안하면 비정상적인 수치입니다. 이는 자동화된 카드 도용 거래, 또는 불법 도박·성인 서비스 결제 중개 시 나타나는 전형적 패턴입니다. 환불률 급증(ALT-002)과 결합하면 상황이 심각합니다. 즉각적인 거래 중단 및 정산 보류를 강력히 권고합니다.',
  },
];

export const timeseriesMock: MerchantTimeseries[] = [
  {
    merchantId: 'MON-A',
    credit: [
      { date: '2026-01', score: 72 },
      { date: '2026-02', score: 70 },
      { date: '2026-03', score: 67 },
      { date: '2026-04', score: 63 },
      { date: '2026-05', score: 59 },
      { date: '2026-06', score: 55 },
    ],
    refundRate: [
      { date: '2026-01', value: 1.2 },
      { date: '2026-02', value: 1.4 },
      { date: '2026-03', value: 1.6 },
      { date: '2026-04', value: 2.0 },
      { date: '2026-05', value: 2.3 },
      { date: '2026-06', value: 2.8 },
    ],
    avgTicket: [
      { date: '2026-01', value: 45000 },
      { date: '2026-02', value: 44000 },
      { date: '2026-03', value: 43500 },
      { date: '2026-04', value: 44000 },
      { date: '2026-05', value: 43000 },
      { date: '2026-06', value: 42000 },
    ],
    volume: [
      { date: '2026-01', value: 1200 },
      { date: '2026-02', value: 1150 },
      { date: '2026-03', value: 1100 },
      { date: '2026-04', value: 1050 },
      { date: '2026-05', value: 980 },
      { date: '2026-06', value: 940 },
    ],
  },
  {
    merchantId: 'MON-B',
    credit: [
      { date: '2026-01', score: 60 },
      { date: '2026-02', score: 58 },
      { date: '2026-03', score: 54 },
      { date: '2026-04', score: 49 },
      { date: '2026-05', score: 43 },
      { date: '2026-06', score: 36 },
    ],
    refundRate: [
      { date: '2026-01', value: 2.8 },
      { date: '2026-02', value: 3.1 },
      { date: '2026-03', value: 3.0 },
      { date: '2026-04', value: 5.2 },
      { date: '2026-05', value: 9.8 },
      { date: '2026-06', value: 18.3 },
    ],
    avgTicket: [
      { date: '2026-01', value: 120000 },
      { date: '2026-02', value: 125000 },
      { date: '2026-03', value: 132000 },
      { date: '2026-04', value: 198000 },
      { date: '2026-05', value: 310000 },
      { date: '2026-06', value: 390000 },
    ],
    volume: [
      { date: '2026-01', value: 430 },
      { date: '2026-02', value: 410 },
      { date: '2026-03', value: 520 },
      { date: '2026-04', value: 980 },
      { date: '2026-05', value: 2100 },
      { date: '2026-06', value: 3800 },
    ],
  },
  {
    merchantId: 'MON-C',
    credit: [
      { date: '2026-01', score: 70 },
      { date: '2026-02', score: 70 },
      { date: '2026-03', score: 71 },
      { date: '2026-04', score: 70 },
      { date: '2026-05', score: 70 },
      { date: '2026-06', score: 71 },
    ],
    refundRate: [
      { date: '2026-01', value: 0.8 },
      { date: '2026-02', value: 0.9 },
      { date: '2026-03', value: 0.7 },
      { date: '2026-04', value: 0.8 },
      { date: '2026-05', value: 0.9 },
      { date: '2026-06', value: 0.8 },
    ],
    avgTicket: [
      { date: '2026-01', value: 18000 },
      { date: '2026-02', value: 18500 },
      { date: '2026-03', value: 17800 },
      { date: '2026-04', value: 19000 },
      { date: '2026-05', value: 18200 },
      { date: '2026-06', value: 19500 },
    ],
    volume: [
      { date: '2026-01', value: 680 },
      { date: '2026-02', value: 700 },
      { date: '2026-03', value: 690 },
      { date: '2026-04', value: 720 },
      { date: '2026-05', value: 710 },
      { date: '2026-06', value: 730 },
    ],
  },
];
