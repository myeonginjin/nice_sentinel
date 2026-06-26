import type { RiskGrade, Recommendation } from '@/types';

export function riskGradeColor(grade: RiskGrade) {
  return {
    LOW: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: '#10b981', bar: '#10b981' },
    MEDIUM: { bg: 'bg-amber-100', text: 'text-amber-800', dot: '#f59e0b', bar: '#f59e0b' },
    HIGH: { bg: 'bg-red-100', text: 'text-red-800', dot: '#ef4444', bar: '#ef4444' },
  }[grade];
}

export function riskGradeLabel(grade: RiskGrade) {
  return { LOW: '저위험', MEDIUM: '중위험', HIGH: '고위험' }[grade];
}

export function recommendationColor(rec: Recommendation) {
  return {
    APPROVE: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    CONDITIONAL: { bg: 'bg-amber-100', text: 'text-amber-800' },
    REJECT: { bg: 'bg-red-100', text: 'text-red-800' },
  }[rec];
}

export function recommendationLabel(rec: Recommendation) {
  return { APPROVE: '승인', CONDITIONAL: '조건부 승인', REJECT: '반려' }[rec];
}

export function scoreToGrade(score: number): RiskGrade {
  if (score >= 70) return 'LOW';
  if (score >= 40) return 'MEDIUM';
  return 'HIGH';
}

export function gaugeColor(score: number) {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

export function creditGradeLevel(grade: string): 'good' | 'medium' | 'bad' {
  if (['AAA', 'AA+', 'AA', 'AA-', 'A+', 'A', 'A-'].includes(grade)) return 'good';
  if (['BBB+', 'BBB', 'BBB-', 'BB+', 'BB'].includes(grade)) return 'medium';
  return 'bad';
}

export function formatKRW(amount: number) {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억원`;
  if (amount >= 10_000) return `${(amount / 10_000).toFixed(0)}만원`;
  return `${amount.toLocaleString()}원`;
}

export function formatLimit(limit: number) {
  if (limit === 0) return '한도 없음 (반려)';
  return formatKRW(limit);
}

export function alertTypeLabel(type: string) {
  return {
    CREDIT_DROP: '신용·CRI 하락',
    REFUND_SPIKE: '환불률 급증',
    PATTERN_SHIFT: '결제패턴 이상',
    PG_SWITCH: 'PG 전환 경계',
  }[type] ?? type;
}

export function alertTypeIcon(type: string) {
  return {
    CREDIT_DROP: '📉',
    REFUND_SPIKE: '💸',
    PATTERN_SHIFT: '⚡',
    PG_SWITCH: '🔄',
  }[type] ?? '⚠️';
}

export function reviewStatusLabel(status: string) {
  return { PENDING: '대기', IN_REVIEW: '진행 중', DECIDED: '완료' }[status] ?? status;
}

export function reviewStatusColor(status: string) {
  return {
    PENDING: 'bg-gray-100 text-gray-700',
    IN_REVIEW: 'bg-blue-100 text-blue-800',
    DECIDED: 'bg-slate-100 text-slate-700',
  }[status] ?? 'bg-gray-100 text-gray-600';
}
