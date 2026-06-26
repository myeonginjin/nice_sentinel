import type { MapVerification } from '@/types';
import { mapVerificationMock } from '@/mock';
import { mockDelay } from './_util';

export async function verifyStore(bizNo: string, _address: string): Promise<MapVerification> {
  // TODO(prod): 네이버·카카오·구글 지도 API 동시 조회
  //   Naver Place API: GET https://openapi.naver.com/v1/search/local.json?query={name}&display=5
  //     Headers: { X-Naver-Client-Id, X-Naver-Client-Secret }
  //   Kakao Local API: GET https://dapi.kakao.com/v2/local/search/keyword.json?query={name}&x={lon}&y={lat}
  //     Headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` }
  //   Google Places API: GET https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={name}&inputtype=textquery&key={GOOGLE_API_KEY}
  //   Step 2 — LLM으로 간판 이미지 분석 (업종 일치, 가정집 여부, 금지업종 시그널)
  return mockDelay(mapVerificationMock[bizNo]);
}
