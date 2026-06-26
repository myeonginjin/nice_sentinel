import { useEffect, useState } from 'react';
import { AlertTriangle, TrendingDown, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkline } from '@/components/Sparkline';
import { riskGradeColor, riskGradeLabel, alertTypeLabel, alertTypeIcon } from '@/lib/gradeUtils';
import { getAlerts, getTimeseries } from '@/services';
import { monitoringMerchants } from '@/mock';
import type { MonitoringAlert, MerchantTimeseries } from '@/types';

const ALERT_ICONS: Record<string, React.ReactNode> = {
  CREDIT_DROP: <TrendingDown className="w-4 h-4" />,
  REFUND_SPIKE: <AlertTriangle className="w-4 h-4" />,
  PATTERN_SHIFT: <RefreshCw className="w-4 h-4" />,
  PG_SWITCH: <ArrowRightLeft className="w-4 h-4" />,
};

export default function Monitoring() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [selected, setSelected] = useState<string>('MON-B');
  const [ts, setTs] = useState<MerchantTimeseries>();

  useEffect(() => { getAlerts().then(setAlerts); }, []);
  useEffect(() => { getTimeseries(selected).then((t) => t && setTs(t)); }, [selected]);

  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const selectedMerchant = monitoringMerchants.find((m) => m.id === selected);
  const selectedAlerts = alerts.filter((a) => a.merchantId === selected);

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">사후 리스크 모니터링</h1>
        <p className="text-sm text-gray-500 mt-1">계약 가맹점의 이상징후를 상시 감지합니다</p>
      </div>

      {/* 상단 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500">모니터링 가맹점</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{monitoringMerchants.length}개사</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500">이상징후 알림</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{alerts.length}건</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500">긴급 조치 필요</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{highCount}건</p>
            <p className="text-xs text-red-400 mt-0.5">HIGH 등급 알림</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* 왼쪽: 가맹점 목록 + 알림 피드 */}
        <div className="col-span-2 space-y-4">
          {/* 모니터링 가맹점 목록 */}
          <Card>
            <CardHeader className="pb-2"><CardTitle>가맹점 목록</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-3">
              {monitoringMerchants.map((m) => {
                const gc = riskGradeColor(m.riskGrade);
                const mAlerts = alerts.filter((a) => a.merchantId === m.id);
                const mTs = m.id === selected ? ts : undefined;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selected === m.id ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-gray-800">{m.bizName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${gc.bg} ${gc.text}`}>
                          {riskGradeLabel(m.riskGrade)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">CRI {m.currentGrade}</span>
                        {mAlerts.length > 0 && (
                          <span className="text-xs text-red-600 font-medium">알림 {mAlerts.length}건</span>
                        )}
                      </div>
                    </div>
                    {mTs && (
                      <Sparkline
                        data={mTs.credit.map((c) => c.score)}
                        width={60}
                        height={24}
                        color={m.riskGrade === 'HIGH' ? '#ef4444' : m.riskGrade === 'MEDIUM' ? '#f59e0b' : '#10b981'}
                      />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* 알림 타임라인 */}
          <Card>
            <CardHeader className="pb-2"><CardTitle>이상징후 타임라인</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-3">
              {alerts.map((a) => {
                const gc = riskGradeColor(a.severity);
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelected(a.merchantId)}
                    className="w-full flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                  >
                    <span className={`mt-0.5 p-1.5 rounded-lg ${gc.bg} ${gc.text}`}>
                      {ALERT_ICONS[a.type]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-gray-700">{alertTypeLabel(a.type)}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${gc.bg} ${gc.text}`}>
                          {riskGradeLabel(a.severity)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{a.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(a.detectedAt).toLocaleString('ko-KR')}</p>
                    </div>
                    <span className="text-lg">{alertTypeIcon(a.type)}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 선택 가맹점 상세 */}
        <div className="col-span-3 space-y-4">
          {selectedMerchant && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {selectedMerchant.bizName}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${riskGradeColor(selectedMerchant.riskGrade).bg} ${riskGradeColor(selectedMerchant.riskGrade).text}`}>
                      {riskGradeLabel(selectedMerchant.riskGrade)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-500 mb-3">CRI 등급: <strong>{selectedMerchant.currentGrade}</strong> · {selectedMerchant.type === 'ONLINE' ? '온라인' : '오프라인'}</div>
                  {ts && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">신용·CRI 추세</p>
                        <ResponsiveContainer width="100%" height={100}>
                          <LineChart data={ts.credit}>
                            <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Tooltip formatter={(v) => [`${v}점`, 'CRI 스코어']} />
                            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">환불률 추세</p>
                          <ResponsiveContainer width="100%" height={80}>
                            <AreaChart data={ts.refundRate}>
                              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                              <YAxis tick={{ fontSize: 9 }} unit="%" />
                              <Tooltip formatter={(v) => [`${v}%`, '환불률']} />
                              <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fef2f2" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">거래량</p>
                          <ResponsiveContainer width="100%" height={80}>
                            <AreaChart data={ts.volume}>
                              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                              <YAxis tick={{ fontSize: 9 }} />
                              <Tooltip formatter={(v) => [`${v}건`, '거래량']} />
                              <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI 리스크 브리프 */}
              {selectedAlerts.map((a) => a.aiBrief && (
                <Card key={a.id} className="border-indigo-200 bg-indigo-50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{alertTypeIcon(a.type)}</span>
                      <span className="text-sm font-semibold text-indigo-900">{alertTypeLabel(a.type)} — AI 리스크 브리프</span>
                    </div>
                    <p className="text-xs text-indigo-800 leading-relaxed">{a.aiBrief}</p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
