# NICE Sentinel — AI 가맹점 심사역

> **한 줄 정의** : 그룹사 데이터(NICE D&B · NICE평가정보)와 LLM을 결합해, 가맹점 **온보딩 심사부터 사후 리스크 관리까지** 한 화면에서 처리하는 AI 심사역 시스템
> **슬로건** : *심사역에게 눈을, 가맹점 생애주기에 안전을.*
> **부제** : AI 가맹점 심사역 — Merchant Lifecycle Risk Management
> **팀** : 명인만두 (KIS정보통신, NICE그룹 지급결제2사 AI 페스티벌)

---

## 0. 이 문서 사용법

이 문서는 **두 가지 용도**로 동시에 쓰입니다.

1. **개발 핸드오프** — Claude Code에 그대로 던져서 GitHub Pages MVP를 빌드시키는 설계서 (4~14장)
2. **대회용 마스터 문서** — 문제 정의, 차별성, 기대효과, 발표 스토리, README.txt 초안까지 대회 종료 시점까지 참조하는 단일 문서 (1~3장, 15~17장)

> **MVP 원칙** : 지금은 *화면만* 완성한다. 단, 코드 구조는 "실서버 연동·크롤링·LLM 호출을 전제로 설계됐다"는 게 드러나게 한다. 데이터는 전부 프로젝트 내 하드코딩(mock)을 읽어 그럴싸하게 보이게 하고, 연동 지점은 `service` 레이어에 `TODO(prod)` 주석으로 박아둔다. **화면 퀄리티가 최우선.**

---

## 1. 프로그램 소개

### 1.1 이름

| 후보 | 의미 | 비고 |
|---|---|---|
| **NICE Sentinel** ✅ 채택 | 가맹점을 지켜보는 감시자(Sentinel). 그룹 브랜드 'NICE'를 전면에 노출 | 계열사 협업·영문 발표에 유리, 사후 모니터링 컨셉과 직결 |
| 심안(審眼) | 심사하는 눈, 혜안(慧眼)과 동음 | 한국어 발표 시 |
| 파수(把守) | 지켜본다 | 사후 모니터링 강조형 |
| MERIT | Merchant Risk Intelligence Tool | 백로님형 |

> 이하 문서는 **NICE Sentinel**로 통일. 마음에 안 들면 후보 중 교체.

### 1.2 핵심 컨셉 (이게 곧 차별화)

```
                ┌─────────────────────────────┐
                │      NICE Sentinel (AI 심사역)         │
                └─────────────────────────────┘
                            ▲
        ┌───────────────────┼───────────────────┐
        │                   │                   │
 ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
 │ NICE평가정보 │    │  NICE D&B    │    │   LLM 분석    │
 │  (bizinfo)   │    │ (나이스리포트)│    │ 웹/지도/리뷰  │
 │ 신용·재무등급 │    │  CRI 등급     │    │ 정성 판단     │
 └─────────────┘    └──────────────┘    └──────────────┘
   정형 데이터          정형 데이터          비정형 데이터
```

**KIS정보통신은 NICE그룹사다.** 경쟁 PG가 외부에서 비용 주고 사오는 기업평가·신용 데이터를, 우리는 그룹 내부 계열사(NICE평가정보·NICE D&B)에서 곧바로 끌어온다. NICE Sentinel은 이 **그룹사 데이터 통합 + LLM 정성판단**을 한 화면에 묶은 것이 본질이며, 화면 전체에서 두 계열사 연동이 시각적으로 드러나야 한다.

---

## 2. 문제 정의 (RM/온보딩 심기영 차장 인터뷰 정리)

### 2.1 온라인 가맹점 온보딩 심사 (현행)

영업담당자가 **심사 요청 문서 + 사업자등록증**을 RM에 전달하면, 심사역이 수기로:

- 기본정보 ↔ 사업자등록증 **일치 대조** (상호·대표자명·주소·업종)
- 신고 사이트 접속 → **대표자명 일치, 사이트 조잡성, 신고 업종과 실제 판매상품 일치 여부** 확인
- **NICE리포트**(nicereport.net) / **NICE bizinfo**(nicebizinfo.com)에서 재무·신용 조회
- 더 깊게: **배송정책, 리뷰**까지 보며 "정상 사이트인지, 체계가 잡혔는지" **문맥으로(감으로)** 판단

> 정형 데이터는 규격화된 평가, **사이트에서 얻는 사업형태·관리수준·리뷰는 문맥/감으로** 판단 — 여기가 사람 손이 가장 많이 가고 일관성이 깨지는 지점.

### 2.2 오프라인 가맹점 온보딩 심사 (offPG, 물량이 더 많음)

> 2차 PG라 수수료는 높지만 불법 가맹점 우회는 안 해준다. 이미 VAN 계약된 대리점이 PG를 부가로 붙이는 케이스가 다수.

- 신용/사업자등록증 확인은 온라인과 동일
- **매장 실존성 확인** : 네이버·카카오·구글 지도 3사 조회 → 셋 다 없으면 영업담당 통해 **매장 사진 요청**
- 가정집 아닌지, **간판/업종이 신고 내용과 일치하는지**
- **카드사 금지업종** 필수 확인 (무당/점집 등 절대 불가). 핵심 기준은 *"카드사에 민원 들어갈 사업인가"* — 우리는 원천사라 고객이 카드사에 환불·항의하면 입장이 곤란
- 리스크 있는 가맹점은 **서울보증보험**으로 담보 확보 (폐업 시 카드사가 거래 거절→우리에게 채권 → 보증보험으로 회수)
- **위장 영업 적발** : "노래방"인데 불법 유흥, "피부미용실/왁싱샵"인데 불법 마사지 등
- 그룹사 분위기상 **매출 낮아도 좋으니 심사를 제대로** 하는 게 원칙

### 2.3 사후 리스크 관리 (차장님이 진짜 원하는 KPI)

> *"제대로 갖춘 곳은 토스가 유일하다."*

- 폐업 후 알게 되는 게 아니라, **망할 조짐/이상 징후를 선제 감지**
- NICE리포트 **CRI 등급**, NICE bizinfo **기업평가 등급**이 지속 업데이트됨 → 이걸 **RM팀이 시스템으로 노티** 받아 급락/이상 시 인지
- **타 PG에서 전환해 오는 가맹점 경계** — 직전 PG와 문제로 계약 종료됐을 수 있음
- **표준화 부재 문제** : 우리는 명확한 정책서 없이 영업 상황·심사역별로 담보·한도가 그때그때 다름. KG이니시스·KCP는 기준이 고정 → 영업이 그 틀을 못 벗어남. 차장님은 **정해진 규격의 결과**가 나오길 원함.

### 2.4 핵심 페인포인트 요약

| # | 페인포인트 | NICE Sentinel의 대응 |
|---|---|---|
| P1 | 수기 심사, 심사역 경험 의존, 건당 수일 | 온보딩 심사 자동 집계·스코어링 |
| P2 | 사이트/매장 정성판단의 비일관성 | LLM이 사이트·리뷰·지도·간판을 읽고 근거 제시 |
| P3 | 사후 모니터링이 사실상 사고 후 대응 | CRI·평가등급·거래패턴 상시 감지 + 알림 |
| P4 | 담보·한도 기준이 심사역마다 다름 | 규칙 기반 표준 정책 엔진 |
| P5 | 타 PG 전환 가맹점 리스크 간과 | 전환 이력 플래그 |

---

## 3. 솔루션 개요 & AI 활용

### 3.1 무엇을 만드는가

가맹점 **생애주기 전체**(온보딩 → 계약 → 사후)를 다루는 AI 심사역. 5개 화면으로 구성:

1. **대시보드** — 심사/모니터링 현황 한눈에
2. **온보딩 심사 목록**
3. **온보딩 심사 상세** ⭐ (핵심 화면)
4. **사후 리스크 모니터링** ⭐ (차장님 KPI)
5. **정책·기준** (표준화)

### 3.2 AI를 어디에·왜 썼는가 (README 2번 항목 직결)

> "AI를 안 썼다면 풀기 어려웠을 지점"을 분명히.

| AI 적용 지점 | 무엇을 하나 | 규칙기반으로 안 되는 이유 |
|---|---|---|
| **신고업종 ↔ 실제판매상품 대조** | 사이트 콘텐츠를 읽고 "실제로 무엇을 파는지" 추론, 신고 업종과 불일치 탐지 | 비정형 텍스트/이미지 의미 이해 필요. 키워드 매칭으론 위장 못 잡음 |
| **금지·위험업종 시그널 탐지** | "노래방→유흥", "왁싱→불법마사지", 상품권 현금화·도박 시그널 등 맥락 탐지 | 간판/문구만으론 정상과 구분 불가. 정황 추론 필요 |
| **사이트/리뷰 품질 정성평가** | 배송·환불정책 유무, 리뷰 신뢰도, 운영 체계 수준을 요약·판정 | 차장님이 "감으로 한다"고 한 영역 자체 |
| **설명가능 심사 리포트 생성** | 정형(신용·CRI) + 비정형 신호를 종합해 근거 있는 리스크 의견서 자동 작성 | 심사역 경험을 글로 풀어내는 작업 = 생성형 AI 핵심 강점 |
| **사후 이상징후 해석·브리프** | 등급 급락/거래 이상이 "왜 위험한지" 자연어 브리프 생성 | 수치 알림만으론 RM이 판단 못 함. 맥락 설명 필요 |

> 정리: **정형 데이터는 그룹사 API가, 정성판단·종합·설명은 LLM이.** NICE Sentinel은 둘을 묶어 *심사역의 눈과 판단을 표준화*한다.

---

## 4. 차별성 (README 4번 항목 직결)

### 4.1 기존 방식

- **현행 KIS** : 수기 심사. 심사역이 사업자등록증·사이트·NICE리포트·bizinfo·지도를 **각각 따로** 조회하고 머릿속에서 종합. 사후는 폐업 후 인지. 담보·한도는 영업/심사역별 재량.
- **KG이니시스 · KCP** : 온보딩 기준은 고정·규격화돼 있으나, **사후 상시 모니터링은 약함**.
- **토스** : 사후 모니터링 체계를 갖춘 사실상 유일한 사례.

### 4.2 NICE Sentinel이 다른 점

| 비교축 | 기존 | NICE Sentinel |
|---|---|---|
| 데이터 통합 | 소스별 개별 조회 | **NICE D&B + NICE평가정보 그룹사 데이터 한 화면 통합** |
| 정성 판단 | 심사역 감·경험 | **LLM이 사이트·지도·리뷰 읽고 근거 제시** |
| 사후 관리 | 사고 후 대응 | **CRI·평가등급·거래패턴 상시 감지 + 알림** (토스급) |
| 표준화 | 심사역마다 다름 | **규칙 기반 담보·한도 정책 엔진** |
| 비용/접근성 | 외부 데이터 구매 | **그룹 내부 데이터 → 원가·속도 우위** |

> **승부수** : "토스만 가진 사후 모니터링"을 "NICE그룹만 가진 그룹사 데이터"로 더 싸고 정확하게 한다. → 계열사 협업 AI 시스템 = 임원진 선호 포인트.

---

## 5. 기대효과 (README/발표용)

- **심사 처리시간 단축** : 수일 → 수분 (소스 통합 + 자동 스코어링)
- **기준 일관성 확보** : 심사역 재량 → 규칙·AI 기반 표준 결과물
- **선제적 리스크 차단** : 위장가맹점·폐업 임박을 사전 탐지 → 제재·정산사고·채권 리스크 감소
- **그룹 시너지 가시화** : NICE평가정보·NICE D&B 데이터가 결제사업에서 실사용되는 협업 모델

---

## 6. 화면 설계 (Information Architecture)

### 6.1 전역 레이아웃

```
┌────────────────────────────────────────────────────────────┐
│ [NICE Sentinel 로고]   NICE Sentinel        🟢 NICE평가정보 연동  🟢 NICE D&B 연동 │ ← 글로벌 헤더
├──────────┬─────────────────────────────────────────────────┤
│          │                                                  │
│ 사이드바  │              메인 콘텐츠 영역                      │
│          │                                                  │
│ 📊 대시보드│                                                  │
│ 📝 온보딩  │                                                  │
│ 🛡 사후관리│                                                  │
│ 📐 정책기준│                                                  │
│          │                                                  │
└──────────┴─────────────────────────────────────────────────┘
```

> **헤더 우측의 "🟢 NICE평가정보 연동 / 🟢 NICE D&B 연동" 배지는 모든 화면에 상시 노출** — 그룹사 협업 서사를 화면 전체에 각인. (실제론 mock이지만 "연동됨" 상태로 표시)

### 6.2 화면별 상세

---

#### 화면 1. 대시보드 `/`

**목적** : 들어오자마자 "AI가 심사·모니터링을 돌리고 있다"는 인상.

- **상단 KPI 카드 4개**
  - 심사 대기 `N건`
  - 평균 처리시간 `4분` (↓ 기존 2.5일 대비, 화살표로 강조)
  - 모니터링 중 가맹점 `N개사`
  - ⚠️ 이상징후 알림 `N건` (빨강 강조)
- **리스크 등급 분포** : 도넛 차트 (LOW/MED/HIGH)
- **실시간 알림 피드** (우측 패널) : 사후 모니터링에서 올라온 이벤트
  - "○○상사 CRI BBB→BB 하락"
  - "△△몰 환불률 3%→18% 급증"
  - "□□샵 타 PG에서 전환 — 직전 계약 종료사유 확인 필요"
- **최근 심사 처리 테이블** : 가맹점 / 유형 / 스코어 / 권고 / 처리일

---

#### 화면 2. 온보딩 심사 목록 `/onboarding`

- **필터 바** : 유형(온라인/오프라인), 리스크 등급, 상태(대기/진행/완료)
- **테이블 컬럼** : 가맹점명 · 사업자번호 · 유형 배지 · **AI 리스크 스코어**(0~100, 색 배지) · **권고**(승인/조건부/반려 배지) · 요청일 · 영업담당
- 행 클릭 → 화면 3

---

#### 화면 3. 온보딩 심사 상세 `/onboarding/:id` ⭐ 핵심

> 이 화면 하나가 데모의 80%. 가장 공들일 것.

**(헤더 영역)**
- 가맹점명 · 사업자번호 · 유형 배지
- **종합 AI 리스크 스코어** : 큰 원형 게이지(0~100) + 등급 컬러
- **권고 등급** : 승인 / 조건부 승인 / 반려 (배지)
- `[AI 심사 리포트 생성]` 버튼 → 섹션 F 펼침/생성 애니메이션

**(섹션 A) 기본정보 ↔ 사업자등록증 대조**
- 필드별 자동 매칭 표 : 상호 ✓ / 대표자명 ✓ / 주소 ✓ / 업종 ✗(불일치 시 빨강)

**(섹션 B) 기업 신용·재무 — `NICE평가정보(bizinfo)` 로고/출처 표기**
- 신용등급, 현금흐름등급, 매출·자본 요약, 휴폐업 여부(✓정상)

**(섹션 C) 기업 리스크(CRI) — `NICE D&B(나이스리포트)` 로고/출처 표기**
- CRI 등급 + 최근 추세 미니 라인차트

**(섹션 D-온라인) 웹사이트 AI 분석** *(type=ONLINE일 때)*
- 대표자명 일치 여부
- 사이트 품질 점수
- **신고업종 vs AI 추론 실제 판매상품** (불일치 하이라이트)
- **금지/위험 시그널** : 항목별 심각도 배지 + 근거 텍스트
- 배송정책/환불정책 유무, 리뷰 신뢰도 요약
- `AI 분석 근거` 자연어 박스

**(섹션 D'-오프라인) 매장 실존성 검증** *(type=OFFLINE일 때)*
- **지도 3사 조회** : 네이버 ✓ / 카카오 ✓ / 구글 ✗ (각 핀 아이콘)
- 간판/업종 일치, 가정집 여부 판정
- 미발견 시 `매장 사진 요청됨` 상태 배지
- **카드사 금지업종 / 민원 리스크** : 무당·불법유흥·불법마사지 등 LLM 탐지 결과 + 근거

**(섹션 E) 담보·한도 권고 — 정책 엔진**
- 서울보증보험 담보 권고 여부, 권고 한도, **적용 규칙명**(예: `RULE-OFF-MED-02`) 표기 → 표준화 강조

**(섹션 F) AI 종합 의견**
- LLM 생성 설명가능 리포트 : 스코어 근거 / 권고 / 주의사항 (자연어 단락)

---

#### 화면 4. 사후 리스크 모니터링 `/monitoring` ⭐ 차장님 KPI

- **상단 요약** : 모니터링 가맹점 `N` · 이상징후 `N건` · 이번주 등급하락 `N건`
- **이상징후 타임라인/피드** (유형별 아이콘·심각도 색)
  - `CREDIT_DROP` 신용/CRI 급락
  - `REFUND_SPIKE` 환불률 급증 (티몬류)
  - `PATTERN_SHIFT` 결제 시간대·객단가 급변
  - `PG_SWITCH` 타 PG 전환 경계
- **모니터링 가맹점 목록** : 리스크 추세 스파크라인 + 현재 등급
- 가맹점 클릭 → **모니터링 상세** :
  - 신용/CRI 등급 시계열 라인차트
  - 거래지표 차트(환불률·객단가·거래량)
  - 알림 이력 타임라인
  - `AI 리스크 브리프` (왜 위험한지 자연어)

---

#### 화면 5. 정책·기준 `/policy` — 표준화

> 차장님의 "규격화된 결과" 니즈를 시각화.

- **담보·한도 산정 규칙표** : 리스크 등급 → 담보율 / 한도 / 보증보험 요부
- **카드사 금지업종 리스트**
- **표준 심사 체크리스트** (온라인/오프라인) — 시스템이 강제하는 절차
- 카피 : *"심사역마다 다른 기준을, 시스템이 표준으로."*

---

## 7. 데이터 모델 (TypeScript)

> `src/types/index.ts` — 실데이터 형태를 모사. 확장성의 근거.

```ts
export type MerchantType = 'ONLINE' | 'OFFLINE';
export type RiskGrade = 'LOW' | 'MEDIUM' | 'HIGH';
export type Recommendation = 'APPROVE' | 'CONDITIONAL' | 'REJECT';
export type ReviewStatus = 'PENDING' | 'IN_REVIEW' | 'DECIDED';

export interface Merchant {
  id: string;
  bizName: string;            // 상호
  bizNo: string;              // 사업자등록번호
  ceoName: string;            // 대표자명
  address: string;
  declaredCategory: string;   // 신고 업종
  type: MerchantType;
  siteUrl?: string;           // 온라인 한정
  salesRep: string;           // 영업담당
  requestedAt: string;        // ISO
  status: ReviewStatus;
}

// NICE평가정보 (bizinfo)
export interface CreditReport {
  source: 'NICE_BIZINFO';
  creditGrade: string;        // 예: 'BBB+'
  cashFlowGrade: string;
  revenue: number;            // 매출(백만원)
  capital: number;
  isClosed: boolean;          // 휴폐업
  updatedAt: string;
}

// NICE D&B (나이스리포트)
export interface CriReport {
  source: 'NICE_DNB';
  criGrade: string;           // 예: 'BB'
  trend: { date: string; grade: string; score: number }[];
  updatedAt: string;
}

// LLM — 온라인 사이트 분석
export interface SiteAnalysis {
  ceoNameMatch: boolean;
  siteQualityScore: number;   // 0~100
  declaredVsActual: { declared: string; inferred: string; match: boolean };
  prohibitedSignals: { signal: string; severity: RiskGrade; evidence: string }[];
  hasShippingPolicy: boolean;
  hasRefundPolicy: boolean;
  reviewSummary: string;
  rationale: string;          // AI 근거(자연어)
}

// 오프라인 매장 검증
export interface MapVerification {
  naver: boolean; kakao: boolean; google: boolean;
  signageMatch: boolean;
  isResidence: boolean;
  photoRequested: boolean;
  prohibitedBusinessRisk: { detected: boolean; reason: string; severity: RiskGrade };
}

// 정책 엔진 — 담보/한도
export interface CollateralRecommendation {
  requireSuretyInsurance: boolean; // 서울보증보험
  recommendedLimit: number;        // 한도(원)
  appliedRule: string;             // 예: 'RULE-OFF-MED-02'
}

// 종합 평가
export interface RiskAssessment {
  score: number;              // 0~100
  grade: RiskGrade;
  recommendation: Recommendation;
  factors: { name: string; impact: number; note: string }[];
  aiReport: string;           // LLM 종합 리포트(자연어)
}

// 사후 모니터링
export type AlertType = 'CREDIT_DROP' | 'REFUND_SPIKE' | 'PATTERN_SHIFT' | 'PG_SWITCH';
export interface MonitoringAlert {
  id: string;
  merchantId: string;
  type: AlertType;
  severity: RiskGrade;
  message: string;
  detectedAt: string;
  aiBrief?: string;           // LLM 브리프
}

export interface MerchantTimeseries {
  merchantId: string;
  credit: { date: string; score: number }[];
  refundRate: { date: string; value: number }[];
  avgTicket: { date: string; value: number }[];
  volume: { date: string; value: number }[];
}
```

---

## 8. 서비스 레이어 (확장성의 핵심)

> 모든 외부 의존을 `src/services/`로 격리. MVP는 mock을 반환하되, **실연동 지점을 `TODO(prod)` 주석으로 명시**. 이게 "확장성 고려해 짰다"는 증거가 됨.

```ts
// src/services/niceBizinfo.ts
import { CreditReport } from '@/types';
import { creditMock } from '@/mock';
import { mockDelay } from './_util';

export async function fetchCreditReport(bizNo: string): Promise<CreditReport> {
  // TODO(prod): NICE평가정보 bizinfo API 연동
  //   GET https://api.nicebizinfo.com/company/{bizNo}/credit
  return mockDelay(creditMock[bizNo]);
}
```

```ts
// src/services/niceDnb.ts  → fetchCriReport(bizNo)   // TODO(prod): NICE D&B CRI API
// src/services/siteAnalyzer.ts → analyzeSite(url)    // TODO(prod): 크롤러 + LLM 호출
// src/services/mapVerifier.ts → verifyStore(addr)    // TODO(prod): 네이버/카카오/구글 지도 API
// src/services/policyEngine.ts → recommendCollateral(profile)  // 규칙 기반(실로직 가능)
// src/services/riskScorer.ts → assess(merchant, signals)        // TODO(prod): LLM 종합 스코어링
// src/services/monitoring.ts → getAlerts(), getTimeseries(id)   // TODO(prod): 배치/스트림 연동
```

```ts
// src/services/_util.ts
export const mockDelay = <T>(data: T, ms = 600) =>
  new Promise<T>((res) => setTimeout(() => res(structuredClone(data)), ms));
```

> **포인트** : 화면은 전부 이 service 함수만 호출한다. 나중에 함수 내부만 실 API로 교체하면 화면 수정 없이 운영 전환 가능 — 발표 때 이 한 줄을 강조.

---

## 9. AI 스코어링(목업) 처리 방식

- `riskScorer.assess()`는 mock이지만 **결정론적으로 그럴싸하게**:
  - 신용/CRI 등급 → 점수 환산
  - 업종 불일치·금지 시그널·지도 미발견 → 감점
  - factors 배열로 가점/감점 근거를 화면에 그대로 노출 (설명가능성 연출)
- `aiReport`(자연어 종합의견)는 **mock 데이터에 가맹점별로 미리 작성된 문장**을 넣어 자연스럽게 읽히도록. (실연동 시 LLM 응답으로 교체)

---

## 10. 샘플 데이터 시나리오 (데모 시나리오와 직결)

> 인터뷰 내용을 그대로 재현하는 6~8개 케이스를 mock으로 준비.

| ID | 유형 | 시나리오 | 권고 |
|---|---|---|---|
| M-001 | 온라인 | 정상 의류 쇼핑몰, 신용 양호 | 승인 |
| M-002 | 온라인 | 신고=의류 / 실제=상품권 현금화·도박 시그널 (위장) | 반려 |
| M-003 | 온라인 | 정상이나 리뷰·배송정책 부실 + 신용 보통 | 조건부 |
| M-004 | 오프라인 | 정상 음식점, 지도 3사 확인 | 승인 |
| M-005 | 오프라인 | "노래방" 신고 / 불법 유흥 시그널, 지도 미발견→사진요청 | 반려 |
| M-006 | 오프라인 | "피부미용실" / 왁싱·불법마사지 의심 | 조건부+담보 |
| M-007 | 오프라인 | 무당/점집 — 카드사 금지업종 | 반려 |

**사후 모니터링 mock**
- A사 : CRI BBB→BB 급락 (CREDIT_DROP)
- B몰 : 환불률 3%→18% 급증 (REFUND_SPIKE, 티몬류)
- C샵 : 타 PG 전환 유입 (PG_SWITCH)

---

## 11. 기술 스택 & 프로젝트 구조

### 11.1 스택 (선정 이유: 화면 퀄리티 + 빠른 Pages 배포)

| 영역 | 선택 | 이유 |
|---|---|---|
| 빌드/번들 | **Vite** | 초고속, Pages 배포 간단 |
| 프레임워크 | **React 18 + TypeScript** | 컴포넌트화, 타입으로 확장성 표현 |
| 스타일 | **Tailwind CSS** | 빠르게 깔끔한 UI |
| 컴포넌트 | **shadcn/ui** | 카드·테이블·배지·탭·다이얼로그 즉시 고급스러움 |
| 차트 | **Recharts** | 등급 추세·분포·거래지표 |
| 아이콘 | **lucide-react** | 일관된 아이콘 |
| 라우팅 | **react-router-dom (HashRouter)** | GitHub Pages 새로고침 404 회피 |
| 배포 | **GitHub Actions → Pages** | 푸시 시 자동 배포 |

### 11.2 디렉토리 구조

```
nice-sentinel/
├─ src/
│  ├─ components/        # 헤더, 사이드바, 공통 카드/배지/게이지
│  ├─ pages/
│  │  ├─ Dashboard.tsx
│  │  ├─ OnboardingList.tsx
│  │  ├─ OnboardingDetail.tsx
│  │  ├─ Monitoring.tsx
│  │  └─ Policy.tsx
│  ├─ services/         # 외부 연동 격리 (8장)
│  ├─ mock/             # 하드코딩 데이터 (10장 시나리오)
│  ├─ types/index.ts    # 7장
│  ├─ lib/              # 등급→색/점수 유틸
│  ├─ App.tsx           # HashRouter + 레이아웃
│  └─ main.tsx
├─ public/              # NICE 계열사 로고 등 정적 자산
├─ .github/workflows/deploy.yml
├─ vite.config.ts
└─ package.json
```

### 11.3 디자인 톤

- **신뢰·금융 톤** : 네이비/딥블루 + 화이트 베이스, 포인트는 NICE 브랜드 블루 계열. 리스크는 그린(안전)–앰버(주의)–레드(위험) 3색.
- 카드 기반 레이아웃, 충분한 여백, 굵지 않은 그림자. 데이터 밀도는 높되 깔끔하게.
- 숫자/등급은 큰 타이포로 강조. 헤더의 **계열사 연동 배지**는 항상 보이게.

---

## 12. 배포 (GitHub Pages)

`vite.config.ts`
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/nice-sentinel/', // ← 레포명에 맞게 수정
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```

`.github/workflows/deploy.yml`
```yaml
name: deploy
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages }
    steps:
      - uses: actions/deploy-pages@v4
```

> 라우팅은 **HashRouter** 사용(새로고침 404 방지). 레포 Settings → Pages → Source를 **GitHub Actions**로 설정.

---

## 13. Claude Code 작업 지시 (이 순서대로 빌드)

> 아래를 그대로 Claude Code에 전달. 화면 우선, mock 우선.

1. Vite + React + TS 프로젝트 생성, Tailwind + shadcn/ui + Recharts + lucide-react + react-router-dom 설치
2. `src/types/index.ts` 작성 (7장 그대로)
3. `src/mock/` 작성 — 10장 시나리오 7개 가맹점 + 사후 모니터링 mock, 가맹점별 `aiReport`/`rationale` 자연어 포함
4. `src/services/` 작성 — 8장대로 mock 반환 + `TODO(prod)` 주석
5. 전역 레이아웃(App.tsx, HashRouter) — 헤더(로고+**계열사 연동 배지 2개**) + 사이드바
6. 화면 1 대시보드 → 2 목록 → **3 상세(최우선·최고 퀄리티)** → 4 모니터링 → 5 정책
7. `lib`에 등급→색/점수 유틸, 원형 게이지·스파크라인 컴포넌트
8. `vite.config.ts` base 설정 + `deploy.yml` 추가
9. `demo/` 폴더용 캡처 가능하도록 시드 데이터로 화면 채우기

**불변 요구사항**
- 모든 외부 의존은 `services`를 통해서만. 화면은 service만 호출.
- 헤더 계열사 연동 배지 상시 노출.
- 상세 화면은 온라인/오프라인 분기 모두 구현.
- 빈 화면 없이 mock으로 가득 채워 "그럴싸하게".

---

## 14. demo 폴더 가이드 (평가용)

> README 3번 항목 + `demo/`의 자료가 각각 무엇을 보여주는지 설명해야 함.

`demo/`에 캡처/영상으로 담을 것:

| 파일 | 보여주는 것 |
|---|---|
| `01_dashboard.png` | 현황 KPI + 실시간 이상징후 피드 (계열사 연동 배지 보임) |
| `02_onboarding_online_reject.png` | 위장 온라인몰(M-002): 신고≠실제, 금지 시그널, 반려 권고 |
| `03_onboarding_offline_collateral.png` | 오프라인(M-006): 지도 검증 + 보증보험 담보 권고 |
| `04_monitoring_credit_drop.png` | CRI 급락 가맹점의 시계열·AI 브리프 |
| `05_policy.png` | 담보·한도 표준 규칙표 |
| `demo_walkthrough.mp4` | 온보딩→권고→사후알림까지 1분 시연 |

> 한계도 솔직히: "실서버/크롤러/LLM은 미연동(mock), 화면·스코어링 로직·데이터 규격은 동작" 식으로 명시.

---

## 15. README.txt 초안 (그대로 복사·수정)

```
[NICE Sentinel — AI 가맹점 심사역]

1) 문제·대상 업무
PG사 RM/심사역이 가맹점 온보딩 심사와 계약 후 리스크 관리를 수행할 때의 문제를 푼다.
현재 KIS정보통신은 사업자등록증·신고 사이트·NICE리포트·NICE bizinfo·지도를 심사역이
각각 따로 조회해 머릿속에서 종합하는 수기 방식이며, 건당 처리에 수일이 걸리고 기준이
심사역마다 다르다. 사후 관리는 사실상 폐업·사고 발생 후 대응에 가깝다. 특히 2차 PG로서
위장가맹점(불법 유흥·도박·불법 마사지·금지업종 등)을 걸러내고, 계약 후에도 폐업 조짐이나
이상 거래를 선제 감지해야 하는 RM/온보딩 심사역이 대상이다.

2) AI 활용
신고 업종과 실제 판매상품의 불일치, 금지·위험업종 시그널(예: "노래방"으로 신고했으나
불법 유흥, "왁싱샵"으로 위장한 불법 마사지)은 비정형 콘텐츠의 맥락 이해가 필요해 규칙
기반으로 잡기 어렵다. 이 영역과, 정형 데이터(신용등급·CRI·재무)와 비정형 신호(사이트·
리뷰·지도·간판)를 종합한 설명가능 심사 리포트 생성, 사후 등급 급락·거래 이상의 자연어
브리프 생성에 LLM을 사용했다. 즉 심사역이 "감으로" 하던 정성판단과 종합·설명을 AI가
표준화한다.

3) 완성된 결과물과 작동 근거
온보딩 심사(온라인·오프라인 상세 포함), 사후 리스크 모니터링, 표준 정책·기준을 포함한
웹 대시보드를 구현해 GitHub Pages에 배포했다. 끝까지 실제로 동작하는 것: 화면 전체 플로우,
가맹점별 리스크 스코어링·권고 산출 로직, 정책 엔진(담보·한도 규칙), 차트·시계열 시각화.
외부 연동(NICE 계열사 API·웹 크롤러·LLM 호출)은 service 레이어로 격리해 실연동 전제로
설계했고, 현재는 하드코딩 데이터로 동작한다. demo 폴더 자료는 위 14장 표 참조.

4) 기존 방식 대비 차별성
기존: 심사역이 소스를 개별 조회·수기 종합, 사후는 사고 후 대응, 담보·한도는 재량.
KG이니시스·KCP는 온보딩 기준이 고정이나 사후 모니터링이 약하고, 사후 체계를 갖춘 곳은
사실상 토스가 유일하다. NICE Sentinel은 ① NICE그룹 계열사 데이터(NICE평가정보·NICE D&B)를 한
화면에 통합하고 ② LLM으로 정성판단을 표준화하며 ③ 토스급 사후 상시 모니터링을 ④ 규칙
기반 표준 정책으로 일관화한다. 외부 구매 없이 그룹 내부 데이터를 쓰므로 원가·속도에서도
우위가 있다.
```

> ⚠️ 배포 URL, demo 캡처 파일명은 실제 산출물에 맞춰 채울 것.

---

## 16. 발표 스토리라인 (3분)

1. **(15초) 후킹** : "2차 PG에서 위장가맹점 하나가 사고나면, 원천사인 우리가 카드사 채권을 떠안습니다."
2. **(30초) 문제** : 수기 심사·심사역 재량·사후 사고 후 대응 (인터뷰 인용)
3. **(60초) 데모** : 위장 온라인몰 반려 → 오프라인 담보 권고 → 사후 CRI 급락 알림
4. **(30초) 차별화** : 토스만 가진 사후 모니터링을, NICE그룹 데이터로 더 싸고 정확하게
5. **(30초) 확장성/그룹시너지** : service 레이어 한 줄 교체로 운영 전환, 계열사 협업 모델
6. **(15초) 클로징** : "심사역에게 눈을, 가맹점 생애주기에 안전을."

---

## 17. 체크리스트

- [ ] 프로그램명 확정 (기본: NICE Sentinel)
- [ ] Claude Code로 MVP 빌드 (13장 순서)
- [ ] GitHub Pages 배포 + URL 확보
- [ ] demo 폴더 캡처/영상 (14장)
- [ ] README.txt 최종화 (15장)
- [ ] 발표자료 + 스토리 리허설 (16장)
