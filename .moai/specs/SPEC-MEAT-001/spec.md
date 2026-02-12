# SPEC-MEAT-001: MeatPicker - 고기 품질 분석 웹사이트

---

**SPEC ID:** SPEC-MEAT-001
**Title:** MeatPicker - Meat Quality Analysis Website
**Created:** 2026-02-13
**Status:** Completed
**Priority:** High
**Lifecycle:** spec-first

---

## 1. Environment (환경)

### 1.1 프로젝트 개요

MeatPicker는 사용자가 고기(소고기/돼지고기) 사진을 업로드하거나 촬영하면, Vision AI API를 통해 고기의 품질을 분석하고 상세한 평가 결과를 제공하는 웹 애플리케이션입니다.

### 1.2 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| Frontend Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| AI API | Vision AI (Claude Vision / GPT-4V / Gemini Vision) | Latest |
| Deployment | Vercel | - |
| State Management | Zustand 또는 React 내장 상태 | - |
| Image Processing | Browser Canvas API / sharp (서버사이드) | - |
| Validation | Zod | 3.x |

### 1.3 대상 사용자

- 마트/정육점에서 고기를 구매하는 일반 소비자
- 한국어를 주로 사용하는 사용자
- 모바일 환경에서 주로 접속 (카메라 촬영 기능 활용)

### 1.4 분석 가능 범위

**사진으로 분석 가능한 항목 (~70-80% 정확도):**
- 색상 분석 (선홍색 vs 갈변)
- 마블링 패턴 인식
- 지방/살코기 층 구분
- 형태 및 두께 균일성
- 표면 상태 (광택, 변색, 점액질 징후)

**사진으로 분석 불가능한 항목:**
- 냄새
- 탄력/촉감
- 내부 결함 (혈반, 농양)

---

## 2. Assumptions (가정)

- A1: 사용자는 스마트폰 또는 PC의 카메라/갤러리를 통해 고기 사진을 제공할 수 있다.
- A2: Vision AI API는 고기 사진에서 색상, 마블링, 지방 분포 등 시각적 특성을 인식할 수 있다.
- A3: 사용자가 고기 종류(소고기/돼지고기)와 부위를 선택하면, 해당 부위에 맞는 맞춤 분석 기준이 적용된다.
- A4: 네트워크 연결이 가능한 환경에서 사용된다 (Vision AI API 호출 필요).
- A5: API 비용은 분석 1회당 일정 토큰을 소비하며, 비용 관리가 필요하다.
- A6: 분석 결과는 참고용이며, 전문적인 식품 안전 판단을 대체하지 않는다.

---

## 3. Requirements (요구사항)

### 3.1 기능 요구사항 (Functional Requirements)

#### FR-001: 사진 입력

**WHEN** 사용자가 메인 페이지에 접근 **THEN** 시스템은 사진 업로드 버튼과 카메라 촬영 버튼을 표시해야 한다.

**WHEN** 사용자가 사진 업로드를 선택 **THEN** 시스템은 기기의 파일 선택기를 열어 이미지 파일(JPG, PNG, WEBP)을 선택할 수 있게 해야 한다.

**WHEN** 사용자가 카메라 촬영을 선택 **THEN** 시스템은 기기의 카메라를 활성화하여 사진을 촬영할 수 있게 해야 한다.

**WHEN** 사용자가 이미지를 선택/촬영 **THEN** 시스템은 이미지 미리보기를 표시하고 분석 진행 여부를 확인해야 한다.

#### FR-002: 고기 종류 및 부위 선택

**WHEN** 사용자가 사진을 입력한 후 **THEN** 시스템은 고기 종류 선택 UI를 표시해야 한다.

시스템은 **항상** 다음 고기 종류를 지원해야 한다:
- 소고기 (Beef)
- 돼지고기 (Pork)

**WHEN** 사용자가 소고기를 선택 **THEN** 시스템은 다음 부위 목록을 표시해야 한다:
- 안심 (Tenderloin)
- 등심 (Loin/Ribeye)
- 채끝 (Striploin)
- 갈비 (Rib)
- 사태/양지 (Shank/Brisket)
- 우둔/설도 (Round)

**WHEN** 사용자가 돼지고기를 선택 **THEN** 시스템은 다음 부위 목록을 표시해야 한다:
- 삼겹살 (Belly)
- 목심 (Shoulder)
- 항정살 (Jowl)
- 안심/등심 (Tenderloin/Loin)
- 앞다리살 (Picnic Shoulder)

#### FR-003: AI 품질 분석

**WHEN** 사용자가 사진, 고기 종류, 부위를 모두 선택하고 분석 요청 **THEN** 시스템은 Vision AI API에 이미지와 분석 기준을 전송하여 품질 분석을 수행해야 한다.

**IF** [상태] Vision AI API 호출 중 **AND WHEN** [이벤트] 분석이 진행 중 **THEN** 시스템은 로딩 인디케이터를 표시해야 한다.

**WHEN** Vision AI API가 분석 결과를 반환 **THEN** 시스템은 결과를 구조화된 형태로 파싱하여 결과 화면에 표시해야 한다.

#### FR-004: 분석 결과 표시

**WHEN** 분석이 완료 **THEN** 시스템은 다음 정보를 표시해야 한다:
- 종합 등급 (좋음 / 보통 / 나쁨)
- 종합 점수 (100점 만점)
- 항목별 세부 점수:
  - 색상 점수 및 설명
  - 마블링/지방 분포 점수 및 설명
  - 표면 상태 점수 및 설명
  - 형태/균일성 점수 및 설명
- 해당 부위의 좋은 고기 특징 vs 현재 사진 비교
- 주의 사항 (발견된 불량 징후가 있을 경우)
- 사진으로 확인 불가 항목 안내 (냄새, 탄력 등)

**WHEN** 분석 결과에 불량 징후(갈변, PSE, 점액질 등)가 감지 **THEN** 시스템은 경고 메시지를 강조 표시해야 한다.

#### FR-005: 분석 이력 (선택 기능)

**가능하면** 시스템은 최근 분석 이력을 로컬 스토리지에 저장하여 사용자가 이전 분석 결과를 다시 확인할 수 있도록 제공한다.

### 3.2 비기능 요구사항 (Non-Functional Requirements)

#### NFR-001: 성능

**WHEN** 사용자가 분석을 요청 **THEN** 시스템은 10초 이내에 분석 결과를 표시해야 한다 (네트워크 상태 양호 기준).

시스템은 **항상** 이미지를 업로드 전에 적절한 크기(최대 1MB)로 압축/리사이즈해야 한다.

#### NFR-002: 반응형 디자인

시스템은 **항상** 모바일 우선(Mobile-first) 반응형 디자인을 적용해야 한다.

시스템은 **항상** 최소 320px부터 1920px까지의 화면 너비를 지원해야 한다.

#### NFR-003: 접근성

시스템은 **항상** 한국어를 기본 언어로 제공해야 한다.

시스템은 **항상** 충분한 색상 대비(WCAG AA 기준)를 유지해야 한다.

#### NFR-004: 보안

시스템은 업로드된 이미지를 서버에 **영구 저장하지 않아야 한다** (분석 완료 후 즉시 삭제).

시스템은 API 키를 클라이언트에 **노출하지 않아야 한다** (서버사이드 API Route를 통해 호출).

**IF** 악의적인 파일(비이미지 파일)이 업로드 **THEN** 시스템은 파일 타입을 검증하고 거부해야 한다.

#### NFR-005: 비용 관리

**가능하면** 시스템은 API 호출 비용을 최적화하기 위해 이미지 크기를 최소화하고, 불필요한 반복 호출을 방지한다.

시스템은 **항상** API 응답을 동일 이미지에 대해 캐싱하여 중복 호출을 방지해야 한다.

#### NFR-006: 에러 처리

**IF** Vision AI API 호출이 실패 **THEN** 시스템은 사용자에게 친절한 오류 메시지를 표시하고 재시도 옵션을 제공해야 한다.

**IF** 업로드된 이미지가 고기 사진이 아닌 것으로 판단 **THEN** 시스템은 "고기 사진을 업로드해주세요"라는 안내 메시지를 표시해야 한다.

---

## 4. Specifications (상세 사양)

### 4.1 시스템 아키텍처

```
[Client Browser]
    |
    v
[Next.js App Router]
    |
    +-- /app/page.tsx              (메인: 사진 업로드 + 종류/부위 선택)
    +-- /app/result/page.tsx       (결과 표시)
    +-- /app/history/page.tsx      (분석 이력 - 선택)
    +-- /app/api/analyze/route.ts  (API Route: Vision AI 호출)
    |
    v
[Vision AI API] (Claude Vision / GPT-4V / Gemini Vision)
```

### 4.2 페이지 구조

| 경로 | 용도 | 주요 컴포넌트 |
|------|------|---------------|
| `/` | 메인 페이지 | ImageUploader, MeatTypeSelector, CutSelector, AnalyzeButton |
| `/result` | 분석 결과 | ScoreCard, DetailAnalysis, WarningBanner, CutComparison |
| `/history` | 분석 이력 (선택) | HistoryList, HistoryDetail |

### 4.3 API Route 설계

**POST /api/analyze**

Request Body:
```json
{
  "image": "base64 encoded image string",
  "meatType": "beef" | "pork",
  "cut": "tenderloin" | "ribeye" | "striploin" | "rib" | "shank" | "round" | "belly" | "shoulder" | "jowl" | "loin" | "picnic"
}
```

Response Body:
```json
{
  "overallGrade": "good" | "normal" | "bad",
  "overallScore": 85,
  "details": {
    "color": { "score": 90, "description": "밝은 선홍색으로 신선도가 양호합니다." },
    "marbling": { "score": 80, "description": "마블링이 고르게 분포되어 있습니다." },
    "surface": { "score": 85, "description": "표면 광택이 좋고 이상 징후가 없습니다." },
    "shape": { "score": 82, "description": "형태가 균일하고 두께가 일정합니다." }
  },
  "warnings": ["경미한 갈변이 가장자리에서 관찰됩니다."],
  "goodTraits": ["해당 부위 기준 색상이 양호합니다."],
  "limitations": ["냄새와 탄력은 사진으로 확인할 수 없습니다."],
  "cutReference": {
    "goodDescription": "안심은 짙은 진홍색을 띠며...",
    "badDescription": "지나치게 옅은 색이나 갈변한 색..."
  }
}
```

### 4.4 Vision AI 프롬프트 설계

분석 요청 시 다음 정보를 Vision AI에 전달:
1. 고기 종류 및 부위 정보
2. 해당 부위의 좋은 고기/나쁜 고기 기준 (meat.md 기반)
3. 공통 불량 징후 체크리스트
4. 구조화된 JSON 응답 형식 요구
5. 사진으로 확인 가능한 항목만 평가하도록 제한

### 4.5 이미지 처리 파이프라인

1. 클라이언트에서 이미지 선택/촬영
2. Canvas API로 리사이즈 (최대 1024x1024, 최대 1MB)
3. Base64 인코딩
4. API Route로 전송
5. 서버에서 Vision AI API 호출
6. 응답 파싱 후 클라이언트에 반환

### 4.6 데이터 모델

```typescript
// 고기 종류
type MeatType = 'beef' | 'pork';

// 소고기 부위
type BeefCut = 'tenderloin' | 'ribeye' | 'striploin' | 'rib' | 'shank' | 'round';

// 돼지고기 부위
type PorkCut = 'belly' | 'shoulder' | 'jowl' | 'loin' | 'picnic';

// 분석 등급
type Grade = 'good' | 'normal' | 'bad';

// 세부 분석 항목
interface DetailScore {
  score: number;       // 0-100
  description: string; // 한국어 설명
}

// 분석 결과
interface AnalysisResult {
  overallGrade: Grade;
  overallScore: number;
  details: {
    color: DetailScore;
    marbling: DetailScore;
    surface: DetailScore;
    shape: DetailScore;
  };
  warnings: string[];
  goodTraits: string[];
  limitations: string[];
  cutReference: {
    goodDescription: string;
    badDescription: string;
  };
  analyzedAt: string; // ISO 8601
}
```

---

## 5. Constraints (제약 사항)

- C1: Vision AI API 비용이 발생하므로, 이미지 크기 최적화 및 캐싱 전략 필수
- C2: 분석 결과는 참고용이며 식품 안전 보장 불가 - 면책 조항 표시 필요
- C3: 사진으로 확인 불가능한 항목(냄새, 탄력 등)은 항상 안내해야 함
- C4: 한국어 UI/UX 우선, 추후 다국어 확장 가능성 고려
- C5: Vercel 무료 플랜의 서버리스 함수 실행 시간 제한 (10초) 고려

---

## 6. Traceability (추적성)

| 요구사항 | 관련 파일 | 관련 컴포넌트 |
|----------|-----------|---------------|
| FR-001 | `app/page.tsx` | ImageUploader |
| FR-002 | `app/page.tsx` | MeatTypeSelector, CutSelector |
| FR-003 | `app/api/analyze/route.ts` | Vision AI Integration |
| FR-004 | `app/result/page.tsx` | ScoreCard, DetailAnalysis |
| FR-005 | `app/history/page.tsx` | HistoryList |
| NFR-004 | `app/api/analyze/route.ts` | 서버사이드 API 키 관리 |

---

## 7. 면책 조항

본 서비스는 AI 기반 시각 분석을 통해 고기 품질에 대한 참고 정보를 제공합니다. 분석 결과는 전문적인 식품 안전 검사를 대체할 수 없으며, 최종 구매 판단은 사용자의 책임입니다. 냄새, 탄력, 내부 결함 등 사진으로 확인할 수 없는 요소가 있으므로, 분석 결과의 정확도는 약 70-80% 수준입니다.

---

## 8. Implementation Notes (구현 노트)

### 구현 완료 항목
- Primary Goal (핵심 분석 기능): 모든 항목 구현 완료
  - Next.js 프로젝트 초기 설정 (Next.js 16.1.6, TypeScript, Tailwind CSS 4)
  - 데이터 모델 및 상수 정의 (meat.ts, api.ts, constants.ts, schemas.ts)
  - 이미지 입력 컴포넌트 (ImageUploader - 파일 업로드 + 카메라 촬영 + 리사이즈)
  - 고기 종류/부위 선택 (MeatTypeSelector, CutSelector)
  - Vision AI 통합 API Route (POST /api/analyze, Claude Vision API 사용)
  - 분석 결과 화면 (ScoreCard, DetailAnalysis, WarningBanner, CutComparison)
  - 면책 조항 및 분석 한계 안내

### 구현 방식 변경사항
- 단일 페이지 플로우 채택: 별도의 /result 라우트 대신 메인 페이지에서 결과를 표시하는 SPA 방식으로 구현 (더 나은 UX)
- Zustand 미사용: React 내장 useState로 충분하여 외부 상태 관리 라이브러리 불필요
- Vision AI: Claude Vision API(@anthropic-ai/sdk) 확정 사용

### 기술 스택 변경
| 계획 | 실제 | 사유 |
|------|------|------|
| Next.js 15.x | Next.js 16.1.6 | 최신 안정 버전 사용 |
| Zod 3.x | Zod 4.3.6 | 최신 안정 버전 사용 |
| React (암묵적 18.x) | React 19.2.3 | Next.js 16 호환 |

### 미구현 항목 (선택/부가 기능)
- 분석 이력 페이지 (/history) - Optional Goal
- LoadingIndicator 별도 컴포넌트 - 인라인 로딩 상태로 대체
- Zustand 상태 관리 스토어 - React 내장 상태로 충분

### 구현 일자
2026-02-13
