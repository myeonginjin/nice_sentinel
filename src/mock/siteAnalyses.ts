import type { SiteAnalysis } from '@/types';

export const siteAnalysisMock: Record<string, SiteAnalysis> = {
  // M-001: 정상 의류 쇼핑몰
  '123-45-67890': {
    ceoNameMatch: true,
    siteQualityScore: 84,
    declaredVsActual: {
      declared: '의류·패션',
      inferred: '여성의류, 잡화 (정상 쇼핑몰)',
      match: true,
    },
    prohibitedSignals: [],
    hasShippingPolicy: true,
    hasRefundPolicy: true,
    reviewSummary: '구매 후기 312건, 평균 4.3점. 배송·품질 관련 긍정 리뷰 다수. 환불 처리 불만 1건 확인(해결 완료). 허위 리뷰 패턴 없음.',
    rationale:
      '사이트 전반에 걸쳐 의류 상품만 판매 중이며, 대표자명과 법인등록 정보가 일치합니다. 배송정책 및 반품·교환 규정이 명확히 게시되어 있고, 리뷰 분포가 자연스러워 신뢰도가 높습니다. 금지·위험 시그널은 감지되지 않았습니다.',
  },

  // M-002: 위장 온라인몰 — 신고=의류, 실제=상품권 현금화·도박
  '234-56-78901': {
    ceoNameMatch: false,
    siteQualityScore: 22,
    declaredVsActual: {
      declared: '의류·패션',
      inferred: '상품권 현금화, 도박 사이트 유입 링크 포함',
      match: false,
    },
    prohibitedSignals: [
      {
        signal: '상품권 현금화',
        severity: 'HIGH',
        evidence:
          '상품 페이지 하단에 "문화상품권 즉시현금화 문의" 문구 및 카카오 오픈채팅 링크 삽입 확인. 정가 대비 15% 할인된 가격으로 상품권 대량 구매 유도.',
      },
      {
        signal: '도박 사이트 연결',
        severity: 'HIGH',
        evidence:
          '팝업 광고 클릭 시 국내 미인가 온라인 카지노 도메인으로 리다이렉트됨(2회 확인). 사이트 소스코드에 도박 관련 iframe 삽입 흔적.',
      },
      {
        signal: '대표자명 불일치',
        severity: 'MEDIUM',
        evidence:
          '사업자등록증상 대표자 "박상현"이나, 사이트 내 사업자 정보 란에는 "James Park"으로 표기. 법인 소재지 주소도 상이.',
      },
    ],
    hasShippingPolicy: false,
    hasRefundPolicy: false,
    reviewSummary: '리뷰 3건, 모두 동일 IP에서 작성된 것으로 추정. 실구매 후기 사실상 전무. 배송·환불 정책 페이지 없음.',
    rationale:
      '신고 업종은 의류·패션이나 실제 사이트는 상품권 현금화 및 도박 연계 시그널이 명확하게 확인됩니다. 대표자명 불일치, 배송·환불정책 부재, 허위 리뷰 구조까지 복합적으로 위장 영업의 전형적 패턴을 보입니다. 이 가맹점은 PG 가맹 즉시 금융당국 신고 의무 대상 업종에 해당하며 반려를 강력히 권고합니다.',
  },

  // M-003: 배송·리뷰 부실, 신용 보통
  '345-67-89012': {
    ceoNameMatch: true,
    siteQualityScore: 51,
    declaredVsActual: {
      declared: '생활용품',
      inferred: '생활용품, 주방소품 (업종 일치)',
      match: true,
    },
    prohibitedSignals: [
      {
        signal: '배송정책 미비',
        severity: 'MEDIUM',
        evidence:
          '"배송은 주문 후 7~14일"이라는 모호한 안내만 있고, 반품 주소·비용 분담 기준이 없음. 공정위 전자상거래 고시 미준수 가능성.',
      },
    ],
    hasShippingPolicy: false,
    hasRefundPolicy: false,
    reviewSummary: '리뷰 45건, 평균 3.1점. 배송 지연 불만 38%, 환불 미처리 불만 21%. 1~2성 저평가 비율 높음.',
    rationale:
      '판매 업종 자체는 신고 내용과 일치하며 금지 시그널은 없습니다. 그러나 배송정책 및 환불정책이 전자상거래법 기준을 충족하지 못하고, 리뷰에서 운영 체계 미흡이 반복적으로 지적됩니다. 신용 등급도 BBB-로 경계 수준입니다. 정책 보완 확인 후 한도 제한 조건으로 승인할 것을 권고합니다.',
  },
};
