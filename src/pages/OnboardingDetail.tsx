import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, MapPin, Globe, Building2, Sparkles, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskGauge } from '@/components/RiskGauge';
import { NiceBizinfoBadge, NiceDnbBadge } from '@/components/logos/NiceLogo';
import {
  riskGradeColor, riskGradeLabel, recommendationLabel, recommendationColor, gaugeColor, creditGradeLevel, formatLimit,
} from '@/lib/gradeUtils';
import {
  getMerchant, fetchCreditReport, fetchCriReport, analyzeSite, verifyStore, recommendCollateral, assess,
} from '@/services';
import type { Merchant, CreditReport, CriReport, SiteAnalysis, MapVerification, CollateralRecommendation, RiskAssessment } from '@/types';

export default function OnboardingDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [merchant, setMerchant] = useState<Merchant>();
  const [credit, setCredit] = useState<CreditReport>();
  const [cri, setCri] = useState<CriReport>();
  const [site, setSite] = useState<SiteAnalysis>();
  const [map, setMap] = useState<MapVerification>();
  const [collateral, setCollateral] = useState<CollateralRecommendation>();
  const [assessment, setAssessment] = useState<RiskAssessment>();
  const [reportOpen, setReportOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getMerchant(id).then(async (m) => {
      if (!m) return;
      setMerchant(m);

      const [assessmentResult] = await Promise.all([
        assess(m),
        fetchCreditReport(m.bizNo).then(setCredit),
        fetchCriReport(m.bizNo).then(setCri),
        m.type === 'ONLINE'
          ? analyzeSite(m.bizNo, m.siteUrl ?? '').then(setSite)
          : verifyStore(m.bizNo, m.address).then(setMap),
      ]);

      setAssessment(assessmentResult);
      recommendCollateral({
        merchantId: m.id,
        type: m.type,
        grade: assessmentResult.grade,
        recommendation: assessmentResult.recommendation,
      }).then(setCollateral);

      setLoading(false);
    });
  }, [id]);

  if (loading || !merchant) {
    return <div className="p-8 text-gray-400 text-sm">데이터 로딩 중...</div>;
  }

  const gc = assessment ? riskGradeColor(assessment.grade) : null;
  const rc = assessment ? recommendationColor(assessment.recommendation) : null;

  return (
    <div className="p-6 space-y-5 max-w-5xl">
      {/* 뒤로 */}
      <button onClick={() => nav('/onboarding')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> 목록으로
      </button>

      {/* 헤더 영역 */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{merchant.bizName}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${merchant.type === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                  {merchant.type === 'ONLINE' ? '온라인' : '오프라인'}
                </span>
                {gc && assessment && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${gc.bg} ${gc.text}`}>
                    {riskGradeLabel(assessment.grade)}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1.5">
                사업자번호: <span className="font-mono">{merchant.bizNo}</span>
                &nbsp;·&nbsp;대표자: {merchant.ceoName}
                &nbsp;·&nbsp;영업담당: {merchant.salesRep}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">{merchant.address}</p>

              {/* 권고 배지 */}
              {rc && assessment && (
                <div className={`inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-xl font-bold text-sm ${rc.bg} ${rc.text}`}>
                  {assessment.recommendation === 'APPROVE' && <CheckCircle2 className="w-4 h-4" />}
                  {assessment.recommendation === 'REJECT' && <XCircle className="w-4 h-4" />}
                  {assessment.recommendation === 'CONDITIONAL' && <AlertCircle className="w-4 h-4" />}
                  권고: {recommendationLabel(assessment.recommendation)}
                </div>
              )}
            </div>

            {/* 게이지 */}
            {assessment && (
              <div className="flex flex-col items-center gap-1">
                <RiskGauge score={assessment.score} size={110} />
                <span className="text-xs text-gray-500">종합 리스크 스코어</span>
              </div>
            )}
          </div>

          {/* AI 리포트 버튼 */}
          <button
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#0f2044] text-white text-sm rounded-lg hover:bg-[#1a3260] transition-colors"
            onClick={() => setReportOpen((v) => !v)}
          >
            <Sparkles className="w-4 h-4" />
            AI 심사 리포트 {reportOpen ? '접기' : '생성·보기'}
            <ChevronDown className={`w-4 h-4 transition-transform ${reportOpen ? 'rotate-180' : ''}`} />
          </button>
        </CardContent>
      </Card>

      {/* 섹션 A: 기본정보 대조 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">A</span>
            기본정보 ↔ 사업자등록증 대조
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '상호', value: merchant.bizName, match: true },
              { label: '대표자명', value: merchant.ceoName, match: site ? site.ceoNameMatch : true },
              { label: '주소', value: merchant.address, match: true },
              { label: '신고 업종', value: merchant.declaredCategory, match: site ? site.declaredVsActual.match : true },
            ].map(({ label, value, match }) => (
              <div key={label} className={`flex items-center justify-between p-3 rounded-lg border ${match ? 'border-gray-100 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
                </div>
                {match
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        {/* 섹션 B: 신용 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">B</span>
              기업 신용·재무
              <span className="ml-auto"><NiceBizinfoBadge /></span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {credit ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="신용등급" value={credit.creditGrade} highlight={creditGradeLevel(credit.creditGrade)} />
                  <Stat label="현금흐름등급" value={credit.cashFlowGrade} highlight={creditGradeLevel(credit.cashFlowGrade)} />
                  <Stat label="연매출" value={`${credit.revenue.toLocaleString()}백만원`} />
                  <Stat label="자본금" value={`${credit.capital.toLocaleString()}백만원`} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-600">정상 영업 중 (휴·폐업 아님)</span>
                </div>
              </>
            ) : <div className="text-xs text-gray-400">조회 중...</div>}
          </CardContent>
        </Card>

        {/* 섹션 C: CRI */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">C</span>
              기업 리스크(CRI)
              <span className="ml-auto"><NiceDnbBadge /></span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cri ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-bold" style={{ color: gaugeColor(cri.trend[cri.trend.length - 1]?.score ?? 50) }}>
                    {cri.criGrade}
                  </span>
                  <span className="text-xs text-gray-400">CRI 등급</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={cri.trend}>
                    <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip formatter={(v) => [`${v}점`, 'CRI 스코어']} />
                    <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : <div className="text-xs text-gray-400">조회 중...</div>}
          </CardContent>
        </Card>
      </div>

      {/* 섹션 D: 온라인 사이트 분석 */}
      {merchant.type === 'ONLINE' && site && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">D</span>
              <Globe className="w-4 h-4" /> 웹사이트 AI 분석
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 업종 대조 */}
            <div className={`p-3 rounded-lg border ${site.declaredVsActual.match ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
              <p className="text-xs font-medium text-gray-600 mb-1.5">신고 업종 vs AI 추론 실제 판매상품</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs bg-white border px-2 py-1 rounded">신고: {site.declaredVsActual.declared}</span>
                <span className="text-gray-400">→</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${site.declaredVsActual.match ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  실제: {site.declaredVsActual.inferred}
                </span>
                {!site.declaredVsActual.match && <span className="text-xs font-bold text-red-600">⚠ 불일치</span>}
              </div>
            </div>

            {/* 금지 시그널 */}
            {site.prohibitedSignals.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">금지·위험 시그널</p>
                <div className="space-y-2">
                  {site.prohibitedSignals.map((s, i) => {
                    const sc = riskGradeColor(s.severity);
                    return (
                      <div key={i} className={`p-3 rounded-lg border ${sc.bg} border-current/20`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>{riskGradeLabel(s.severity)}</span>
                          <span className="text-sm font-semibold text-gray-800">{s.signal}</span>
                        </div>
                        <p className="text-xs text-gray-600">{s.evidence}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 정책·리뷰 */}
            <div className="grid grid-cols-3 gap-3">
              <PolicyBadge label="배송정책" ok={site.hasShippingPolicy} />
              <PolicyBadge label="환불정책" ok={site.hasRefundPolicy} />
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">사이트 품질</p>
                <p className="text-lg font-bold text-gray-800">{site.siteQualityScore}<span className="text-xs font-normal text-gray-400">/100</span></p>
              </div>
            </div>

            {/* 리뷰 요약 */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-1">리뷰 AI 요약</p>
              <p className="text-xs text-gray-700 leading-relaxed">{site.reviewSummary}</p>
            </div>

            {/* AI 근거 */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> AI 분석 근거</p>
              <p className="text-xs text-blue-800 leading-relaxed">{site.rationale}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 섹션 D': 오프라인 매장 검증 */}
      {merchant.type === 'OFFLINE' && map && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">D</span>
              <MapPin className="w-4 h-4" /> 매장 실존성 검증
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 지도 3사 */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">지도 3사 조회</p>
              <div className="flex gap-3">
                {[
                  { name: '네이버', ok: map.naver, color: 'bg-green-500' },
                  { name: '카카오', ok: map.kakao, color: 'bg-yellow-400' },
                  { name: '구글', ok: map.google, color: 'bg-blue-500' },
                ].map(({ name, ok }) => (
                  <div key={name} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 간판·가정집 */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${map.signageMatch ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                {map.signageMatch ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span className="text-xs text-gray-700">간판·업종 일치</span>
              </div>
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${!map.isResidence ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                {!map.isResidence ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                <span className="text-xs text-gray-700">가정집 아님</span>
              </div>
            </div>

            {/* 사진 요청 상태 */}
            {map.photoRequested && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700 font-medium">매장 사진 요청됨 — 영업담당 통해 확인 진행 중</span>
              </div>
            )}

            {/* 금지업종 리스크 */}
            <div className={`p-3 rounded-lg border ${map.prohibitedBusinessRisk.detected ? `border-${riskGradeColor(map.prohibitedBusinessRisk.severity).text.replace('text-','')}/30 ${riskGradeColor(map.prohibitedBusinessRisk.severity).bg}` : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-1">
                {map.prohibitedBusinessRisk.detected
                  ? <XCircle className="w-4 h-4 text-red-500" />
                  : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                <span className="text-xs font-semibold text-gray-700">카드사 금지업종·민원 리스크</span>
                {map.prohibitedBusinessRisk.detected && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${riskGradeColor(map.prohibitedBusinessRisk.severity).bg} ${riskGradeColor(map.prohibitedBusinessRisk.severity).text}`}>
                    {riskGradeLabel(map.prohibitedBusinessRisk.severity)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{map.prohibitedBusinessRisk.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 섹션 E: 담보·한도 */}
      {collateral && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">E</span>
              <Building2 className="w-4 h-4" /> 담보·한도 권고 — 정책 엔진
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 mb-1">서울보증보험</p>
                {collateral.requireSuretyInsurance
                  ? <div className="flex items-center justify-center gap-1 text-amber-700 font-bold"><AlertCircle className="w-4 h-4" /> 필요</div>
                  : <div className="flex items-center justify-center gap-1 text-emerald-700 font-bold"><CheckCircle2 className="w-4 h-4" /> 불필요</div>}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 mb-1">권고 한도</p>
                <p className="font-bold text-gray-800">{formatLimit(collateral.recommendedLimit)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 mb-1">적용 규칙</p>
                <p className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">{collateral.appliedRule}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 섹션 F: AI 종합 의견 */}
      {assessment && reportOpen && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
              <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center font-bold">F</span>
              <Sparkles className="w-4 h-4" /> AI 종합 심사 의견
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 스코어 팩터 */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">스코어 산출 근거</p>
              <div className="space-y-1.5">
                {assessment.factors.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-12 text-right ${f.impact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {f.impact > 0 ? '+' : ''}{f.impact}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.impact > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(Math.abs(f.impact) * 2, 100)}%`, marginLeft: f.impact < 0 ? 'auto' : 0 }}
                      />
                    </div>
                    <span className="text-xs text-gray-700 w-48 truncate">{f.name}</span>
                    <span className="text-xs text-gray-400 flex-1">{f.note}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* 자연어 리포트 */}
            <div className="p-4 bg-white rounded-xl border border-blue-100">
              <p className="text-sm text-gray-800 leading-7 whitespace-pre-wrap">{assessment.aiReport}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: 'good' | 'medium' | 'bad' }) {
  const color = highlight === 'good' ? 'text-emerald-700' : highlight === 'bad' ? 'text-red-700' : 'text-gray-800';
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function PolicyBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${ok ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
      {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-xs font-semibold ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{ok ? '완비' : '미비'}</p>
      </div>
    </div>
  );
}
