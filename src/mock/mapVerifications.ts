import type { MapVerification } from '@/types';

export const mapVerificationMock: Record<string, MapVerification> = {
  // M-004: 정상 음식점
  '456-78-90123': {
    naver: true,
    kakao: true,
    google: true,
    signageMatch: true,
    isResidence: false,
    photoRequested: false,
    prohibitedBusinessRisk: {
      detected: false,
      reason: '음식점업으로 등록된 정상 분식점. 카드사 민원 유발 업종에 해당하지 않음.',
      severity: 'LOW',
    },
  },
  // M-005: 노래방→불법 유흥, 지도 미발견
  '567-89-01234': {
    naver: false,
    kakao: false,
    google: false,
    signageMatch: false,
    isResidence: false,
    photoRequested: true,
    prohibitedBusinessRisk: {
      detected: true,
      reason:
        '지도 3사에 해당 업소 등록 이력 없음. 영업담당 통해 매장 사진 요청 중. 카카오맵 리뷰 크롤링 결과 인근 유사 상호에서 "1차 노래방 2차 술집 세트" 후기 다수 확인. 불법 유흥 알선 시그널 HIGH.',
      severity: 'HIGH',
    },
  },
  // M-006: 피부미용실→불법마사지 의심
  '678-90-12345': {
    naver: true,
    kakao: true,
    google: false,
    signageMatch: true,
    isResidence: false,
    photoRequested: false,
    prohibitedBusinessRisk: {
      detected: true,
      reason:
        '간판·사이트상 피부미용실로 표기되어 있으나, 네이버 리뷰에서 "전신 마사지", "남성 전용 코스" 관련 후기 다수. 신고 업종(피부미용)과 실제 서비스 간 불일치 가능성. 카드사 민원 유발 위험 MEDIUM 이상.',
      severity: 'MEDIUM',
    },
  },
  // M-007: 점술업 → 카드사 금지업종
  '789-01-23456': {
    naver: true,
    kakao: false,
    google: false,
    signageMatch: true,
    isResidence: false,
    photoRequested: false,
    prohibitedBusinessRisk: {
      detected: true,
      reason:
        '점술·무속업은 BC카드·신한카드·삼성카드 등 주요 카드사 금지업종으로 분류됩니다. PG사가 해당 업종에 결제를 중개할 경우 카드사와의 계약 위반 사유가 되며, 민원·차지백 리스크가 극도로 높습니다. KIS정보통신 내부 운영 정책상 절대 불가 업종.',
      severity: 'HIGH',
    },
  },
};
