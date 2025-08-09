# Statbase Task & Roadmap Document

> 마지막 갱신: 2025-08-10 (Index Builder math util 반영)
>
> 목적: 현재 구현/진행/미완료 항목을 일목요연하게 정리하여 향후 iteration 기준선 제공.

## 상태 레이블
- ✅ Done (기능 동작 & 기본 테스트/빌드 통과)
- 🟡 In Progress (부분 구현 / 추가 작업 예정)
- ⏳ Planned (아직 시작 안함)
- 💡 Optional (가치 있으나 필수 아님 / 후순위)

---
## 0. 보안 정리 (Security Hygiene) — 🟡
| Subtask | 설명 | 상태 | Acceptance Criteria |
|---------|------|------|---------------------|
| .env.local gitignore 유지 | 이미 적용 | ✅ | .gitignore에 .env.local 포함 |
| 과거 커밋에 키 유출 여부 점검 | git log / secret scan | ⏳ | 스캔 결과 키 없음 or 폐기 완료 문서화 |
| 키 재발급(필요 시) | 노출 시 즉시 회수 | ⏳ | 신규 키 사용 확인 |
| .env.example 정비 | PLACEHOLDER 값과 주석 | 🟡 | 파일 최신 변수 모두 포함 |
| ENV 목록 문서화 | README / docs/tasks.md | 🟡 | 아래 ENV 섹션 반영 |

### 권장 비밀 스캔 커맨드 (예시)
```bash
# trufflehog (설치 필요)
trufflehog git file://. --since-commit=$(git rev-list --max-parents=0 HEAD)

# git log 간단 grep (OpenAI 키 패턴)
git log -p | grep -E 'sk-[A-Za-z0-9]'

# git-secrets (설치 후 등록) 예시
git secrets --scan
```

### ENV Variables (현재/추가)
```
OPENAI_API_KEY=PLACEHOLDER          # (optional for local UI 없이 보고서 API 사용 시 필요)
ALPHAVANTAGE_API_KEY=PLACEHOLDER    # 필수 (주식)
FRED_API_KEY=PLACEHOLDER            # 선택 (일부 공개 가능)
TIMEZONE=Asia/Seoul                 # 기본값
DATA_CACHE_DIR=./data_cache         # 캐시 디렉토리 (파일 캐시 예정)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 (optional)
```
(Coingecko 무료 엔드포인트는 별도 키 불필요 / COINGECKO_BASE 필요 시 확장)

---
## 1. 1차 수직 슬라이스: 홈 대시보드 실데이터 — ✅
요약: SPY / QQQ / Bitcoin SummaryCard 실데이터 + 변동률. 캐시 + SSR.
| Subtask | 상태 | 비고 |
|---------|------|------|
| 소스 선정 & 심볼 결정 | ✅ | SPY / QQQ / bitcoin |
| 공용 fetch 래퍼 & rate limit 고려 | ✅ | 간단 래퍼 + in-memory TTL (5m) |
| 캐시 계층 getOrFetch | ✅ | src/lib/cache.ts |
| data.ts 구현 (fetchEquitySummary / fetchCryptoSummary) | ✅ | + summaries.json fallback |
| SSR 페이지 전환 | ✅ | page.tsx 서버 컴포넌트 유지, Chart client wrapper |
| Graceful fallback (N/A) | ✅ | null 반환 시 처리 |

---
## 2. 일일 스냅샷 스크립트 — ✅ (1차)
| 요구 | 상태 | 비고 |
|------|------|------|
| daily_update.ts EOD 시리즈 JSON | ✅ | public/data/* 생성 |
| 중복 실행 방지 (날짜 skip) | ⏳ | 현재 덮어씀 → 날짜 존재 체크 필요 |
| 실행 시간 KST 00:05 (cron 예시) | ⏳ | 문서화 필요 (crontab 예시) |
| 구조: summaries.json + series | ✅ | summaries 구조 개선 (generatedAt + items) |

추가 TODO: 날짜별 개별 파일(YYYY-MM-DD.json) 누적 vs 단일 배열 전략 결정.

---
## 3. 보고서 API 최소 개선 — ✅ (기초)
| 항목 | 상태 | 비고 |
|------|------|------|
| 최근 n일 변동률 요약 삽입 | ✅ | DATA_CONTEXT (SPY/QQQ/BTC 5d) |
| 선택 심볼 파라미터화 | ⏳ | 현재 고정 3개 |
| OpenAI responses API 전환 | ⏳ | chat.completions → responses.stream 예정 |

---
## 4. 에러 / 환경 검증 — 🟡
| 항목 | 상태 | 비고 |
|------|------|------|
| zod 기반 env 검증 | ✅ | src/lib/env.ts |
| 로거 확장 (level,timestamp) | ⏳ | logger.ts stub 확장 필요 |
| 공용 error boundary / 에러 telemetry | ⏳ | 최소 서버 로깅만 존재 |

---
## 5. 테스트 (최소) — 🟡
| 테스트 | 상태 | 비고 |
|--------|------|------|
| 캐시 히트/미스 | ✅ | cache.test.ts |
| 변동률 계산 | ⏳ | formatSignedPercent / series 기반 변화율 테스트 필요 |
| summaries fallback | ✅ | data_fallback.test.ts |
| snapshot 중복 실행 guard | ⏳ | 동일 날짜 실행 시 skip 로그 테스트 |
| report API env 누락 400 | ⏳ | OpenAI 모킹 후 추가 |
| report API 스트리밍 시작 | ⏳ | chunk 수 검증 |

---
## 6. 2차 확장 (차트 시계열) — ✅ (기본) / 🟡 (확장)
| 항목 | 상태 | 비고 |
|------|------|------|
| Alpha Vantage DAILY compact 파싱 | ✅ | 최근 100일 -> JSON |
| CoinGecko market_chart 30d | ✅ | bitcoin.json 생성 |
| FRED DGS10 추가 | ✅ | fred/DGS10.json |
| 추가 FRED (CPIAUCSL 등) | ⏳ | fetchFredSeries 재사용 |
| ChartView 다중 라인 (SPY/BTC) | ✅ | 홈 포함 |

---
## 7. Index Builder MVP — 🟡 (부분 완료)
| 항목 | 설명 | 상태 | 비고 |
|------|------|------|------|
| 입력 폼 (심볼+가중치) | zod 검증 | ⏳ | UI 기본만 존재 (검증 미도입) |
| 시리즈 합성 (가중합) | 누락일 forward-fill | ✅ | combineWeightedSeries 구현 + 테스트 |
| 수익률 계산 util | composite pctChange | ✅ | computeReturn 테스트 완료 |
| Chart 출력 | 기존 ChartView 재사용 | ⏳ | 계산 결과 렌더 미연결 |
| Persist 임시 없음 | 로컬 상태 or URL param | ⏳ | 옵션 결정 필요 |

---
## 8. 리포트 고도화 — ⏳
| 항목 | 설명 |
|------|------|
| 요약 통계 (평균/변동성/최고/최저) | DATA_CONTEXT 확장 |
| 최근 추세 문장 템플릿 | 간단 rule 기반 문장 추가 |
| 토큰 길이 제어 | 압축(CSV/버킷) |
| 사용자 지정 심볼 선택 | API 파라미터 확장 |

---
## 9. 관측 / 운영 — ⏳
| 항목 | 설명 |
|------|------|
| OpenAI usage 로깅 | model, promptTokens, completionTokens 추출 |
| daily usage metrics JSON | public or private metrics 폴더 |
| 오류/레이트리밋 지표 | count & 최근 timestamp |

---
## 10. 배포 준비 — ⏳
| 항목 | 설명 |
|------|------|
| Vercel 배포 | PROJECT_ID & ENV 설정 문서 |
| 또는 Dockerfile 작성 | multi-stage (node:20-alpine) |
| PROD env 문서 | secrets 관리 전략 |
| README Quick Start (Real Data) 업데이트 | 실데이터/스크립트 사용법 |
| Cron 구성 예시 | GitHub Actions / Vercel Cron / 외부 crontab |

---
## 11. 디자인 시스템 / 스타일 가이드 — ✅ (초판)
| 항목 | 설명 | 상태 | 비고 |
|------|------|------|------|
| 토큰 정의 | brand / series / semantic palette | ✅ | theme.ts 작성 |
| 타이포 스케일 | H1–H6, subtitle, body | ✅ | 가독성 튜닝 |
| Elevation / Radius | Shadows 0–24, radius 규칙 | ✅ | 카드 16px / pill 999 |
| Style Guide 페이지 | /style-guide route | ✅ | 색/타이포/컴포넌트 샘플 |
| Usage 규칙 문서화 | README + style guide | ✅ | 색상 사용 수칙 |
| 다크 모드 스펙 | Palette 확장 초안 | ⏳ | 후속 iteration |

## 우선순위 제안 (다음 Iteration)
1. 보안 마무리: 키 스캔 + .env.example 갱신
2. 테스트 확장: 변동률 + report API 기본 케이스
3. 중복 실행 방지 (daily_update 날짜 guard)
4. 로깅/usage 메트릭 기초 (logger.ts 확장 + OpenAI wrapper)
5. 선택 심볼 기반 report API 파라미터
6. 추가 FRED (CPI, FEDFUNDS) + 요약 통계 생성
7. Index Builder MVP

> Frontend UX Tier 1 항목(섹션 12 참조)은 1~7과 병렬 진행하여 사용자 체감 가치 조기 확보 권장.

## 12. Frontend UX 개선 (분석 반영) — ⏳
### 개요
최근 평가 결과 기반으로 UI/UX 개선을 Tier 1~3으로 구조화. Tier 1은 신뢰/가독성 핵심, Tier 2는 상호작용/확장, Tier 3는 차별화 기능.

### Tier 1 (즉시 / High ROI)
| Task | Detail | Acceptance Criteria | 상태 |
|------|--------|---------------------|------|
| Skeleton States | SummaryCard / Chart shimmer | 로딩 시 카드 skeleton + 차트 placeholder 렌더 | ⏳ |
| KPI/Chart Error Fallback | fetch 실패시 메시지 + 재시도 | 강제 오류 테스트에서 fallback 표시 | ⏳ |
| Chart Color Mapping | Recharts Line → theme.palette.series.* | SPY/QQQ/BTC 지정 색상 적용 | ⏳ |
| Metadata & SEO Base | metadata export (title/desc/og) | head 태그에 메타 노출 | ⏳ |
| Accessibility Baseline | focus-visible 스타일 + SummaryCard aria-label | 탭 순회 시 시각적 포커스 명확 | ⏳ |
| Timestamp Formatting | formatKST util 추출 | util 테스트 PASS | ⏳ |
| Input Sanitization | sanitizeTicker util | invalid 입력 차단 테스트 PASS | ⏳ |

### Tier 2 (경험 품질)
| Task | Detail | Acceptance Criteria | 상태 |
|------|--------|---------------------|------|
| Period Toggle | 7D/30D/90D/YTD 전환 | 토글 별 데이터 길이 상이 | ⏳ |
| Normalize Base100 | 값 rebasing 옵션 | 첫 값=100 변환 정확성 테스트 | ⏳ |
| Index Builder Validation | zod schema + weight 합 체크 | 잘못된 가중치 에러 메시지 | ⏳ |
| Index Result Chart | Builder → 합성 라인 렌더 | 2자산 입력 후 차트 생성 | ⏳ |
| i18n Scaffold | ko/en 메시지 스위치 | 언어 토글 시 텍스트 교체 | ⏳ |
| Recharts Dynamic Import | dynamic import + fallback | 번들 초기 감소 수치 기록 | ⏳ |
| Dark Mode Toggle | palette.mode 전환 & persist | UI 토글 적용 테스트 | ⏳ |
| Focus Management | Drawer/dialog trap | 키보드 순환 테스트 PASS | ⏳ |

### Tier 3 (차별화/심화)
| Task | Detail | Acceptance Criteria | 상태 |
|------|--------|---------------------|------|
| Macro Snapshot Section | 금리/물가 KPI 추가 | 홈 추가 섹션 렌더 | ⏳ |
| Export (CSV/PNG) | 차트/시리즈 export | 다운로드 파일 생성 | ⏳ |
| Web Vitals Logging | LCP/FID/CLS 기록 | metrics 파일 항목 존재 | ⏳ |
| UX Event Logging | search/indexCreate 로그 | JSONL 레코드 생성 | ⏳ |
| PWA Manifest & SW | manifest + offline | Lighthouse PWA 항목 향상 | ⏳ |
| Table Toggle (Chart A11y) | “표 보기” 토글 | 행 수 == 포인트 수 | ⏳ |
| Dual View (Normalized/Raw) | 토글 스위치 | 두 모드 전환 정상 | ⏳ |
| Report CTA Funnel | 홈 CTA → /reports | 클릭 이벤트 로그 | ⏳ |
| Ticker Autocomplete | 사전 심볼 제안 | 2자 입력 후 제안 표시 | ⏳ |

### 공통 유틸/테스트
| Task | Detail | Acceptance Criteria | 상태 |
|------|--------|---------------------|------|
| formatKST util | ISO → KST 포맷 | jest test PASS | ⏳ |
| sanitizeTicker util | /^[A-Z0-9._-]{1,10}$/ | invalid 케이스 실패 | ⏳ |
| usePeriodData hook | 기간/normalize 처리 | 4 기간 길이 검증 | ⏳ |
| Index integration test | UI → 계산 결과 일치 | 첫 값=100 테스트 PASS | ⏳ |

### DoD (Frontend UX)
1. 주요 변경 README 또는 style-guide 반영
2. 새 util 최소 1 테스트
3. 접근성 변경 수동 키보드 검증 (로그/주석)
4. 번들 감소 작업 전/후 사이즈 기록

### Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| 기간 토글 + stale 데이터 혼선 | 잘못된 분석 | hook 내 날짜 교차 검증 테스트 |
| Dark mode 대비 미흡 | 가독성 저하 | contrast 검사 스크립트 후속 | 
| Index Builder 복잡화 | 유지보수 증가 | zod schema + reducer 패턴 |


---
## 상세 실행 계획 (Execution Sets)

### Set A: 안정화 & 관측 기초 (Security / Tests / Metrics)
| Task | Detail | Acceptance Criteria |
|------|--------|---------------------|
| Secret Scan | trufflehog + git secrets + grep 패턴 수행 후 결과 요약 | tasks.md Change Log에 "No secrets" 또는 회수 내역 기록 |
| .env.example 최종 검증 | 실제 사용 변수 모두 포함 여부 확인 | 누락 변수 0개 |
| Snapshot Guard Test | daily_update 두 번 실행 → 2번째 run skip assert | test added & PASS |
| Report API Symbol Test | body.symbols 전달 시 DATA_CONTEXT 포함 심볼만 등장 | jest test PASS |
| Report API Env Missing | OPENAI_API_KEY 제거 시 400 응답 | jest mock + test PASS |
| OpenAI Usage Persist | usage 로그 JSON append (metrics/openai-usage-YYYY-MM-DD.json) | 파일 생성 & 하나 이상 레코드 |
| Script Perf Log | daily_update 실행 시간 & fetch 건수 기록 (metrics/daily-update-YYYY-MM-DD.json) | 파일 생성 & 필드(latencyMs, equityCount...) 존재 |

### Set B: 데이터 확장 & 리포트 고도화
| Task | Detail | Acceptance Criteria |
|------|--------|---------------------|
| FRED 추가 시리즈 | CPIAUCSL, FEDFUNDS fetch & 캐시 | public/data/fred/*.json 생성 |
| 빈도 정규화 | 월/일 혼합 시 최근 값 forward-fill | 함수 tests (월 데이터 forward-fill) PASS |
| 요약 통계 유틸 | mean, stdev, min, max, pctChange | math/statistics.test.ts PASS |
| summaries.json 확장 | macroStats 키 추가 | 구조: { generatedAt, items, macroStats } |
| Report 통계 컨텍스트 | STAT_SUMMARY 블록 삽입 | DATA_CONTEXT 포함 & 토큰 <2KB (raw) |
| 추세 문장 템플릿 | 최근 5일 pctChange & 변동성 문장 | 문장 형식 테스트 (regex) PASS |

### Set C: Index Builder MVP
| Task | Detail | Acceptance Criteria |
|------|--------|---------------------|
| Form UI | 심볼 + weight 동적 추가/삭제 | 입력/삭제 동작 & weight 합 표시 |
| Zod 검증 | weight 숫자, 최소 1개 심볼 | invalid case 에러 메시지 렌더 |
| 시리즈 정렬/정규화 | 날짜 교집합 + forward-fill (max gap 3일) | util test PASS |
| 가중합 계산 | Σ weight * price | 계산 테스트 (샘플 데이터) PASS |
| Chart 출력 | 결과 ChartView 표시 | 렌더 테스트 기본 통과 |

### Set D: 배포 & 문서
| Task | Detail | Acceptance Criteria |
|------|--------|---------------------|
| Dockerfile | multi-stage build, prod image < 300MB 목표 | docker build 성공 & 컨테이너 start OK |
| Vercel 문서 | 환경변수/빌드 지침 docs/deploy.md | 파일 존재 & 변수 표 |
| README Quick Start Real Data | 실제 데이터 흐름 설명 | README 섹션 추가 |
| Metrics README | metrics 폴더 구조 & 사용법 | docs/metrics.md 생성 |
| Changelog Update | A→D 완료 후 항목 추가 | tasks.md Change Log 반영 |

### 토큰/컨텍스트 가드라인
| Context Block | Limit (raw chars) | Note |
|---------------|-------------------|------|
| DATA_CONTEXT | < 2000 | 심볼 확장 시 oldest 제거 |
| STAT_SUMMARY | < 800 | 컬럼 제한(mean,stdev,pctChange) |

### 추가 규칙
1. 새 provider 추가 시: fetch + transform + cache + test 순서 준수.
2. 모든 새 JSON 구조 변경 시: README & tasks.md 동시에 갱신.
3. metrics 파일 포맷: JSON Lines(append) 우선 (대용량 안정성) → 나중에 rollup.
4. 실패 로그는 logger.logError 사용 + 최소 fields {stage, error}.


---
## Acceptance Snippets (예시)
- 변동률 계산 함수: pctChange(prev=100, curr=105) => 5.00%
- DATA_CONTEXT 크기:  < 2 KB (gzip 전)
- daily_update 중복 실행: 동일 날짜 시 "skipped (already exists)" 로그

---
## Open Questions
- 시리즈 저장 전략: append vs overwrite (현재 overwrite)
- FRED API rate / throttle 필요 여부
- 다국어 대응 (ko/en) 전략: 프롬프트 레이어 or i18n framework?

---
## Change Log
- 2025-08-10: 초기 문서 작성. (실데이터, summaries fallback, 차트, 데이터 컨텍스트 통합 완료 상태 기준)
- 2025-08-10: Index Builder 가중합/수익률 유틸 및 테스트 추가, 7번 단계 부분 진행 표시.
- 2025-08-10: 디자인 시스템 1차 (theme 확장 + /style-guide + README 섹션) 완료.
- 2025-08-10: Frontend UX 개선 섹션(12) 추가 및 Tier 구조 정의.

