import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Shield, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NiceSentinelLogo } from '@/components/logos/NiceLogo';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: '대시보드' },
  { to: '/onboarding', icon: ClipboardList, label: '온보딩 심사' },
  { to: '/monitoring', icon: Shield, label: '사후 모니터링' },
  { to: '/policy', icon: BookOpen, label: '정책·기준' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0f2044] flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <NiceSentinelLogo />
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <div className="text-xs text-blue-300">KIS정보통신 RM팀</div>
          <div className="text-xs text-blue-400 mt-0.5">심사역 · 시스템</div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-500">AI 가맹점 심사역 시스템</div>
          <div className="flex items-center gap-3">
            {/* NICE D&B 연동 배지 (왼쪽) */}
            <div className="flex items-center gap-1.5 border border-emerald-300 rounded-full pl-2 pr-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className="bg-white rounded px-1 py-0.5 flex items-center">
                <img
                  src={`${import.meta.env.BASE_URL}nice-dnb.svg`}
                  alt="NICE D&B"
                  className="h-3.5 w-auto object-contain"
                />
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">연동</span>
            </div>
            {/* NICE평가정보 연동 배지 (오른쪽) */}
            <div className="flex items-center gap-1.5 border border-emerald-300 rounded-full pl-2 pr-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span className="bg-white rounded px-1 py-0.5 flex items-center">
                <img
                  src={`${import.meta.env.BASE_URL}logo-nicednb.c820dabc (1).jpg`}
                  alt="NICE평가정보"
                  className="h-3.5 w-auto object-contain"
                />
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">연동</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
