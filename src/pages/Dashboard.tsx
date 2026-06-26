import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Store, FileCheck2, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  riskGradeColor,
  riskGradeLabel,
  recommendationLabel,
  recommendationColor,
  alertTypeLabel,
  alertTypeIcon,
  scoreToGrade,
} from '@/lib/gradeUtils';
import { getMerchants, getAlerts, getAssessments } from '@/services';
import type { Merchant, MonitoringAlert, RiskAssessment } from '@/types';

const RISK_COLORS = { LOW: '#10b981', MEDIUM: '#f59e0b', HIGH: '#ef4444' };

export default function Dashboard() {
  const nav = useNavigate();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [assessments, setAssessments] = useState<Record<string, RiskAssessment>>({});

  useEffect(() => {
    getMerchants().then(setMerchants);
    getAlerts().then(setAlerts);
    getAssessments().then(setAssessments);
  }, []);

  const decided = merchants.filter((m) => m.status === 'DECIDED');
  const pending = merchants.filter((m) => m.status !== 'DECIDED').length;
  const highCount = alerts.filter((a) => a.severity === 'HIGH').length;

  const riskDist = (() => {
    const counts = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    decided.forEach((m) => {
      const a = assessments[m.id];
      if (a) counts[scoreToGrade(a.score)]++;
    });
    return [
      { name: '저위험', value: counts.LOW, key: 'LOW' },
      { name: '중위험', value: counts.MEDIUM, key: 'MEDIUM' },
      { name: '고위험', value: counts.HIGH, key: 'HIGH' },
    ].filter((d) => d.value > 0);
  })();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">AI 심사·모니터링 현황을 한눈에</p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">심사 대기</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{pending}건</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">평균 처리시간</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">4분</p>
                <p className="text-xs text-gray-400 mt-0.5">↓ 기존 2.5일 대비</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">모니터링 중</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">3개사</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">이상징후 알림</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{highCount}건</p>
                <p className="text-xs text-red-400 mt-0.5">즉시 확인 필요</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 리스크 분포 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>리스크 등급 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDist.map((entry) => (
                    <Cell key={entry.key} fill={RISK_COLORS[entry.key as keyof typeof RISK_COLORS]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}건`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {riskDist.map((d) => (
                <div key={d.key} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: RISK_COLORS[d.key as keyof typeof RISK_COLORS] }} />
                  <span className="text-xs text-gray-600">{d.name} {d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 실시간 알림 피드 */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              실시간 이상징후 알림
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => {
              const col = riskGradeColor(a.severity);
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => nav('/monitoring')}
                >
                  <span className="text-lg leading-none mt-0.5">{alertTypeIcon(a.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                        {alertTypeLabel(a.type)}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(a.detectedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 truncate">{a.message}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 최근 심사 테이블 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>최근 심사 처리</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['가맹점', '유형', 'AI 리스크 스코어', '권고', '처리일'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decided.map((m) => {
                const a = assessments[m.id];
                if (!a) return null;
                const gc = riskGradeColor(a.grade);
                const rc = recommendationColor(a.recommendation);
                return (
                  <tr
                    key={m.id}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                    onClick={() => nav(`/onboarding/${m.id}`)}
                  >
                    <td className="py-2.5 pr-4 font-medium text-gray-900">{m.bizName}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.type === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {m.type === 'ONLINE' ? '온라인' : '오프라인'}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${gc.bg} ${gc.text}`}>
                          {a.score}점
                        </span>
                        <span className="text-xs text-gray-500">{riskGradeLabel(a.grade)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>
                        {recommendationLabel(a.recommendation)}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500 text-xs">{new Date(m.requestedAt).toLocaleDateString('ko-KR')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
