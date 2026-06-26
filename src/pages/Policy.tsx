import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLLATERAL_RULES = [
  { rule: 'RULE-ONL-LOW-01', type: '온라인', grade: '저위험', insurance: false, limit: '3,000만원', note: '표준 한도 내 즉시 승인' },
  { rule: 'RULE-ONL-MED-02', type: '온라인', grade: '중위험', insurance: true, limit: '1,000만원', note: '정책 보완 확인 선행, 3개월 재평가' },
  { rule: 'RULE-ONL-HIGH-REJ-01', type: '온라인', grade: '고위험', insurance: false, limit: '0', note: '반려 — 즉시 처리 불가' },
  { rule: 'RULE-OFF-LOW-01', type: '오프라인', grade: '저위험', insurance: false, limit: '2,000만원', note: '지도 3사 확인 완료 조건' },
  { rule: 'RULE-OFF-MED-02', type: '오프라인', grade: '중위험', insurance: true, limit: '500만원', note: '현장실사 또는 추가서류 선행' },
  { rule: 'RULE-OFF-HIGH-REJ-01', type: '오프라인', grade: '고위험', insurance: false, limit: '0', note: '반려 — 불법영업·위장 의심' },
  { rule: 'RULE-OFF-PROHIB-01', type: '오프라인', grade: '금지업종', insurance: false, limit: '0', note: '절대 불가 — 카드사 금지업종' },
];

const PROHIBITED = [
  { category: '점술·무속업', reason: 'BC·신한·삼성 등 전 카드사 취급 금지', severity: 'red' },
  { category: '불법 유흥업소', reason: '풍속영업 법률 위반, 민원 유발', severity: 'red' },
  { category: '불법 마사지', reason: '공중위생관리법 위반, 민원 다수', severity: 'red' },
  { category: '상품권 현금화', reason: '자금세탁 위험, 여신전문금융업법', severity: 'red' },
  { category: '도박·사행성 게임', reason: '형사처벌 대상, 금융당국 보고 의무', severity: 'red' },
  { category: '성인용품·성인 콘텐츠', reason: '카드사별 제한, 민원 다수', severity: 'amber' },
  { category: '다단계·방문판매', reason: '공정위 규정, 소비자 분쟁 다수', severity: 'amber' },
  { category: '해외 직판 (미인가)', reason: '외국환거래법 위반 가능', severity: 'amber' },
];

const CHECKLIST_ONLINE = [
  '사업자등록증 수령 및 기본정보 일치 대조 (상호·대표자명·주소·업종)',
  '대표자명 ↔ 사이트 게시 정보 일치 확인',
  'NICE평가정보(bizinfo) 신용등급·현금흐름등급·휴폐업 여부 조회',
  'NICE D&B(나이스리포트) CRI 등급 및 최근 추세 확인',
  'AI 사이트 분석: 신고 업종 vs 실제 판매상품 대조',
  'AI 금지·위험 시그널 탐지 결과 검토',
  '배송정책·환불정책 게시 여부 (전자상거래법 필수 고지)',
  '리뷰 신뢰도 AI 분석 결과 확인',
  '정책 엔진 담보·한도 권고 적용',
];

const CHECKLIST_OFFLINE = [
  '사업자등록증 수령 및 기본정보 일치 대조',
  'NICE평가정보(bizinfo) 신용등급·현금흐름등급·휴폐업 여부 조회',
  'NICE D&B(나이스리포트) CRI 등급 확인',
  '지도 3사(네이버·카카오·구글) 매장 등록 확인',
  '지도 미발견 시 영업담당 통해 매장 사진 요청',
  '간판·업종 일치 여부, 가정집 여부 판정',
  'AI 금지·위험업종 탐지 결과 검토 (무당·유흥·마사지 등)',
  '카드사 금지업종 해당 여부 최종 확인',
  '정책 엔진 담보·한도 권고 적용',
  '서울보증보험 담보 요구 시 증빙 수령',
];

export default function Policy() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정책·기준</h1>
        <p className="text-sm text-gray-500 mt-1">
          <em>"심사역마다 다른 기준을, 시스템이 표준으로."</em>
        </p>
      </div>

      {/* 담보·한도 규칙표 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>담보·한도 산정 규칙표</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['규칙 ID', '유형', '리스크 등급', '서울보증보험', '권고 한도', '비고'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COLLATERAL_RULES.map((r) => (
                <tr key={r.rule} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-700 font-bold">{r.rule}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.type === '온라인' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.grade === '저위험' ? 'bg-emerald-100 text-emerald-800' : r.grade === '중위험' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                      {r.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.insurance
                      ? <div className="flex items-center gap-1 text-amber-700"><AlertCircle className="w-4 h-4" /><span className="text-xs font-semibold">필요</span></div>
                      : <div className="flex items-center gap-1 text-gray-400"><XCircle className="w-4 h-4" /><span className="text-xs">해당없음</span></div>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{r.limit === '0' ? <span className="text-red-600">반려</span> : r.limit}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 금지업종 리스트 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>카드사 금지·제한 업종</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {PROHIBITED.map((p) => (
              <div key={p.category} className={`flex items-start gap-3 p-3 rounded-xl border ${p.severity === 'red' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                {p.severity === 'red'
                  ? <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  : <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-sm font-semibold ${p.severity === 'red' ? 'text-red-800' : 'text-amber-800'}`}>{p.category}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{p.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 체크리스트 */}
      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full font-medium">온라인</span>
              표준 심사 체크리스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CHECKLIST_ONLINE.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-medium">오프라인</span>
              표준 심사 체크리스트
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {CHECKLIST_OFFLINE.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
