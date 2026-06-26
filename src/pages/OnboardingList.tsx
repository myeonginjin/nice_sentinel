import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  riskGradeColor,
  riskGradeLabel,
  recommendationLabel,
  recommendationColor,
  reviewStatusLabel,
  reviewStatusColor,
} from '@/lib/gradeUtils';
import { getMerchants, getAssessments } from '@/services';
import type { Merchant, MerchantType, ReviewStatus, RiskAssessment } from '@/types';

export default function OnboardingList() {
  const nav = useNavigate();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [assessments, setAssessments] = useState<Record<string, RiskAssessment>>({});
  const [typeFilter, setTypeFilter] = useState<MerchantType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    getMerchants().then(setMerchants);
    getAssessments().then(setAssessments);
  }, []);

  const filtered = merchants.filter((m) => {
    if (typeFilter !== 'ALL' && m.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (query && !m.bizName.includes(query) && !m.bizNo.includes(query)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">온보딩 심사 목록</h1>
        <p className="text-sm text-gray-500 mt-1">가맹점 심사 요청 현황</p>
      </div>

      {/* 필터 바 */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-52 focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="상호명·사업자번호"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <FilterBtn label="전체" active={typeFilter === 'ALL'} onClick={() => setTypeFilter('ALL')} />
            <FilterBtn label="온라인" active={typeFilter === 'ONLINE'} onClick={() => setTypeFilter('ONLINE')} />
            <FilterBtn label="오프라인" active={typeFilter === 'OFFLINE'} onClick={() => setTypeFilter('OFFLINE')} />
            <div className="h-4 w-px bg-gray-200" />
            <FilterBtn label="전체 상태" active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')} />
            <FilterBtn label="대기" active={statusFilter === 'PENDING'} onClick={() => setStatusFilter('PENDING')} />
            <FilterBtn label="진행 중" active={statusFilter === 'IN_REVIEW'} onClick={() => setStatusFilter('IN_REVIEW')} />
            <FilterBtn label="완료" active={statusFilter === 'DECIDED'} onClick={() => setStatusFilter('DECIDED')} />
          </div>
        </CardContent>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['가맹점명', '사업자번호', '유형', 'AI 리스크 스코어', '권고', '상태', '요청일', '영업담당'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const a = assessments[m.id];
                const gc = a ? riskGradeColor(a.grade) : null;
                const rc = a ? recommendationColor(a.recommendation) : null;
                return (
                  <tr
                    key={m.id}
                    className="border-b border-gray-50 hover:bg-blue-50/40 cursor-pointer transition-colors"
                    onClick={() => nav(`/onboarding/${m.id}`)}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">{m.bizName}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{m.bizNo}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.type === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {m.type === 'ONLINE' ? '온라인' : '오프라인'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {a && gc ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-bold ${gc.bg} ${gc.text}`}>
                            {a.score}점
                          </span>
                          <span className="text-xs text-gray-400">{riskGradeLabel(a.grade)}</span>
                        </div>
                      ) : <span className="text-xs text-gray-300">심사 중</span>}
                    </td>
                    <td className="px-4 py-3">
                      {a && rc ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>
                          {recommendationLabel(a.recommendation)}
                        </span>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${reviewStatusColor(m.status)}`}>
                        {reviewStatusLabel(m.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(m.requestedAt).toLocaleDateString('ko-KR')}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{m.salesRep}</td>
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

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
    >
      {label}
    </button>
  );
}
