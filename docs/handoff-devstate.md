# NICE Sentinel — 개발 핸드오프 (2026-06-26)

## 배포 & 레포

- **GitHub**: https://github.com/myeonginjin/nice_sentinel
- **GitHub Pages**: https://myeonginjin.github.io/nice_sentinel/
- **로컬 dev**: `npm run dev` → http://localhost:3001/nice_sentinel/

---

## 완성된 화면 (5개 전부 구현)

| 경로 | 화면 | 상태 |
|---|---|---|
| `/` | 대시보드 | ✅ KPI 4개, 도넛차트, 알림피드, 최근심사 테이블 |
| `/onboarding` | 온보딩 목록 | ✅ 필터(유형/상태/검색), AI스코어 배지 |
| `/onboarding/:id` | 온보딩 상세 | ✅ 섹션A-F, 온라인/오프라인 분기, AI리포트 토글 |
| `/monitoring` | 사후 모니터링 | ✅ 알림 타임라인, 시계열 차트, AI 브리프 |
| `/policy` | 정책·기준 | ✅ 담보규칙표, 금지업종, 체크리스트 |

---

## 기술 스택

- Vite + React 18 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui (수동 작성, Radix 미사용)
- Recharts, lucide-react, react-router-dom (HashRouter)
- GitHub Actions → GitHub Pages 자동 배포

---

## 프로젝트 구조 핵심

```
src/
├── types/index.ts          # 전체 타입 정의
├── mock/                   # 하드코딩 시나리오 데이터 (7개 가맹점 + 모니터링)
├── services/               # 외부 연동 격리 레이어 (mock 반환 + TODO(prod) 주석)
├── components/
│   ├── Layout.tsx          # 사이드바 + 헤더 (계열사 연동 배지)
│   ├── RiskGauge.tsx       # SVG 원형 게이지
│   ├── Sparkline.tsx       # SVG 스파크라인
│   └── logos/NiceLogo.tsx  # 로고 컴포넌트
└── pages/                  # 5개 화면
```

---

## 로고 파일 정리 (⚠️ 파일명이 직관적이지 않음)

| 파일 (public/) | 실제 내용 | 용도 |
|---|---|---|
| `NICE_Symbol_Blue (1).png` | NICE 그룹 심볼 (N/I/C/E 나침반) | 사이드바 로고 |
| `logo-nicednb.c820dabc (1).jpg` | **NICE평가정보** 로고 (파일명 misleading) | 헤더 오른쪽 배지, `NiceBizinfoBadge` |
| `nice-dnb.svg` | **NICE D&B** 로고 | 헤더 왼쪽 배지, `NiceDnbBadge` |

### 헤더 배지

- **왼쪽**: `nice-dnb.svg` → NICE D&B 연동
- **오른쪽**: `logo-nicednb.c820dabc (1).jpg` → NICE평가정보 연동
- 스타일: 배경색 없음, `border border-emerald-300 rounded-full`, 로고는 내부 `bg-white rounded px-1` 컨테이너

---

## Mock 데이터 시나리오

| ID | 유형 | 시나리오 | 권고 |
|---|---|---|---|
| M-001 | 온라인 | 정상 의류 쇼핑몰 | 승인 |
| M-002 | 온라인 | 신고=의류 / 실제=상품권 현금화·도박 위장 | 반려 |
| M-003 | 온라인 | 리뷰·배송정책 부실 + 신용 보통 | 조건부 |
| M-004 | 오프라인 | 정상 음식점, 지도 3사 확인 | 승인 |
| M-005 | 오프라인 | "노래방" 신고 / 불법 유흥 위장 | 반려 |
| M-006 | 오프라인 | "피부미용실" / 불법마사지 의심 | 조건부+담보 |
| M-007 | 오프라인 | 무당/점집 — 카드사 금지업종 | 반려 |

모니터링: MON-A(CRI 급락), MON-B(환불률 급증), MON-C(타 PG 전환)

---

## .gitignore 제외 항목

```
CLAUDE.md
.claude/
```

---

## 남은 작업

- [ ] GitHub Pages 배포 정상 확인 (Actions 탭에서 워크플로우 성공 여부 확인)
- [ ] `demo/` 폴더 캡처 5장 + 시연 영상 (설계서 14장 기준)
- [ ] README.txt 최종화 — 배포 URL 채우기 (설계서 15장 초안 있음)
- [ ] 발표자료 + 스토리 리허설 (설계서 16장)
