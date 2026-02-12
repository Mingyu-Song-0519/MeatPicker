# SPEC-MEAT-001: 구현 계획

---

**SPEC ID:** SPEC-MEAT-001
**Title:** MeatPicker - Meat Quality Analysis Website
**Created:** 2026-02-13

---

## 1. 구현 전략

### 1.1 개발 접근 방식

Next.js App Router를 활용한 풀스택 개발 방식으로, 프론트엔드와 백엔드(API Route)를 단일 프로젝트에서 관리합니다. Vision AI API 호출은 서버사이드에서만 수행하여 API 키 보안을 확보합니다.

### 1.2 기술 아키텍처

```
[사용자 브라우저]
    |
    +-- Next.js Client Components (이미지 업로드, UI)
    +-- Next.js Server Components (레이아웃, 메타데이터)
    |
    v
[Next.js API Routes]
    |
    +-- POST /api/analyze (이미지 분석 엔드포인트)
    |     |
    |     +-- 이미지 유효성 검사
    |     +-- Vision AI 프롬프트 구성
    |     +-- API 호출 및 응답 파싱
    |
    v
[Vision AI API]
```

---

## 2. 마일스톤

### Primary Goal: 핵심 분석 기능

**범위:** 사진 업로드, 고기 종류/부위 선택, AI 분석, 결과 표시

**작업 목록:**

1. Next.js 프로젝트 초기 설정
   - create-next-app으로 프로젝트 생성 (TypeScript, Tailwind CSS, App Router)
   - 프로젝트 구조 설정 (components, lib, types, constants 디렉토리)
   - Zod, Zustand 등 의존성 설치

2. 데이터 모델 및 상수 정의
   - TypeScript 타입 정의 (MeatType, BeefCut, PorkCut, AnalysisResult 등)
   - 부위별 분석 기준 상수 데이터 (meat.md 기반)
   - Zod 스키마 정의 (API 요청/응답 검증)

3. 이미지 입력 컴포넌트
   - ImageUploader 컴포넌트 (파일 업로드 + 카메라 촬영)
   - 클라이언트 사이드 이미지 리사이즈/압축 (Canvas API)
   - 이미지 미리보기 기능
   - 파일 타입 및 크기 유효성 검사

4. 고기 종류/부위 선택 컴포넌트
   - MeatTypeSelector 컴포넌트 (소고기/돼지고기 선택)
   - CutSelector 컴포넌트 (종류에 따른 부위 목록 표시)
   - 선택 상태 관리

5. Vision AI 통합 API Route
   - POST /api/analyze 엔드포인트 구현
   - Vision AI 프롬프트 템플릿 작성 (부위별 분석 기준 포함)
   - API 응답 JSON 파싱 및 유효성 검증
   - 에러 처리 (API 실패, 비이미지 감지 등)

6. 분석 결과 화면
   - ScoreCard 컴포넌트 (종합 등급 및 점수)
   - DetailAnalysis 컴포넌트 (항목별 세부 점수)
   - WarningBanner 컴포넌트 (불량 징후 경고)
   - CutComparison 컴포넌트 (좋은 고기 기준 비교)
   - 면책 조항 및 사진 분석 한계 안내

### Secondary Goal: UX 개선 및 안정성

**범위:** 로딩 상태, 에러 핸들링, 반응형 디자인 최적화

**작업 목록:**

1. 로딩 UX
   - 분석 진행 중 로딩 애니메이션
   - 단계별 진행 상태 표시 (이미지 전송 중 / 분석 중 / 결과 생성 중)

2. 에러 처리 강화
   - API 실패 시 재시도 UI
   - 네트워크 오류 안내
   - 비이미지 파일 업로드 시 안내 메시지

3. 반응형 디자인 최적화
   - 모바일 우선 레이아웃 정교화
   - 태블릿/데스크탑 레이아웃 최적화
   - 터치 인터랙션 최적화 (모바일 카메라 촬영 UX)

4. SEO 및 메타데이터
   - Next.js Metadata API 활용
   - Open Graph 태그 설정
   - 한국어 검색 최적화

### Optional Goal: 부가 기능

**범위:** 분석 이력, 공유 기능

**작업 목록:**

1. 분석 이력 (LocalStorage)
   - 분석 결과 로컬 저장
   - 이력 목록 페이지
   - 이력 상세 보기
   - 이력 삭제 기능

2. 결과 공유
   - 결과 이미지 캡처 (html2canvas)
   - SNS 공유 기능

---

## 3. 기술적 접근

### 3.1 Vision AI 프롬프트 전략

부위별 분석 기준을 시스템 프롬프트에 포함하여, 해당 부위에 특화된 분석을 수행합니다:

- 소고기 안심: 색상(짙은 진홍색), 결(곱고 부드러운), 지방(적은) 기준
- 소고기 등심: 마블링(꽃등심 패턴), 지방 분포 기준
- 돼지고기 삼겹살: 살코기/지방 층 구분 명확성 기준
- 기타 부위별 고유 기준 적용

응답은 반드시 구조화된 JSON 형태로 요구하여 파싱 안정성을 확보합니다.

### 3.2 이미지 최적화 전략

- 클라이언트 리사이즈: Canvas API로 최대 1024x1024, JPEG 품질 0.8
- 최대 파일 크기: 1MB (Base64 인코딩 후 약 1.33MB)
- 지원 포맷: JPG, PNG, WEBP (변환 후 JPEG으로 통일)

### 3.3 비용 최적화 전략

- 이미지 크기 최소화로 토큰 소비 절감
- 동일 이미지 해시 기반 캐싱 (선택)
- 분석 요청 Rate Limiting 구현

### 3.4 컴포넌트 구조

```
src/
  app/
    layout.tsx          # 루트 레이아웃
    page.tsx            # 메인 페이지
    result/page.tsx     # 결과 페이지
    history/page.tsx    # 이력 페이지 (선택)
    api/
      analyze/route.ts  # 분석 API 엔드포인트
  components/
    ImageUploader.tsx
    MeatTypeSelector.tsx
    CutSelector.tsx
    AnalyzeButton.tsx
    ScoreCard.tsx
    DetailAnalysis.tsx
    WarningBanner.tsx
    CutComparison.tsx
    LoadingIndicator.tsx
  lib/
    vision-ai.ts        # Vision AI API 클라이언트
    image-utils.ts      # 이미지 처리 유틸리티
    prompts.ts          # 프롬프트 템플릿
    constants.ts        # 부위별 분석 기준 상수
  types/
    meat.ts             # 고기 관련 타입
    analysis.ts         # 분석 결과 타입
    api.ts              # API 요청/응답 타입
  store/
    analysis-store.ts   # Zustand 상태 관리 (선택)
```

---

## 4. 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| Vision AI가 고기 품질을 정확히 분석하지 못함 | 분석 신뢰성 저하 | 상세한 프롬프트 엔지니어링, 면책 조항 표시 |
| API 비용 초과 | 서비스 중단 | Rate Limiting, 이미지 최적화, 비용 모니터링 |
| Vercel 서버리스 함수 타임아웃 (10초) | 분석 실패 | 이미지 최적화로 API 응답 시간 단축, 타임아웃 안내 |
| 사용자가 고기가 아닌 사진 업로드 | 무의미한 API 호출 | Vision AI에 고기 사진 확인 요청 포함, 안내 메시지 |
| 모바일 카메라 접근 권한 거부 | 기능 제한 | 파일 업로드 대안 제공, 권한 안내 메시지 |

---

## 5. 전문가 상담 권장

### 프론트엔드 전문가 (expert-frontend)
- 모바일 우선 반응형 UI 설계
- 이미지 업로드/카메라 촬영 UX 패턴
- 결과 화면 시각적 디자인

### 백엔드 전문가 (expert-backend)
- Vision AI API 통합 아키텍처
- 프롬프트 엔지니어링 최적화
- API Route 보안 및 에러 처리

---

## 6. 다음 단계

1. `/moai run SPEC-MEAT-001`으로 구현 시작
2. Primary Goal부터 순차적으로 구현
3. 각 마일스톤 완료 후 품질 검증
4. `/moai sync SPEC-MEAT-001`으로 문서화 및 배포 준비
