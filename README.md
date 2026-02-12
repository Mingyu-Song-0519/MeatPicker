# MeatPicker - AI 고기 품질 분석 웹사이트

AI Vision 기술을 활용하여 소고기와 돼지고기의 품질을 분석하는 웹 애플리케이션입니다. 사용자가 고기 사진을 촬영하거나 업로드하면, AI가 색상, 마블링, 표면 상태, 형태 균일성 등을 종합적으로 분석하여 품질 등급과 상세 점수를 제공합니다.

---

## 주요 기능

- **사진 입력**: 갤러리에서 업로드 또는 카메라로 직접 촬영
- **고기 종류 선택**: 소고기(6개 부위) 또는 돼지고기(5개 부위) 선택
- **AI 품질 분석**: Vision AI가 색상, 마블링, 표면 상태, 형태/균일성을 분석
- **분석 결과 제공**: 종합 등급(좋음/보통/나쁨), 종합 점수(0-100), 부위별 상세 점수, 경고 사항
- **모바일 최적화**: 모바일 우선 반응형 디자인
- **보안**: 서버 사이드 API 키 관리
- **이미지 최적화**: 업로드 전 이미지 리사이즈/압축 (최대 1MB)

### 지원 부위

| 소고기 | 돼지고기 |
|--------|----------|
| 안심 | 삼겹살 |
| 등심 | 목살 |
| 채끝 | 항정살 |
| 갈비 | 등심 |
| 사태 | 앞다리 |
| 우둔 | |

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) |
| 언어 | TypeScript 5.x |
| UI 라이브러리 | React 19.2.3 |
| 스타일링 | Tailwind CSS 4.x |
| AI | @anthropic-ai/sdk (Claude Vision API) |
| 유효성 검증 | Zod 4.3.6 |
| 배포 | Vercel |

---

## 시작하기

### 사전 요구사항

- Node.js 20 이상
- npm 또는 yarn
- Anthropic API 키 ([console.anthropic.com](https://console.anthropic.com)에서 발급)

### 설치

```bash
git clone https://github.com/your-username/MeatPicker.git
cd MeatPicker
npm install
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다.

```
ANTHROPIC_API_KEY=your_api_key_here
```

`ANTHROPIC_API_KEY`는 서버 사이드에서만 사용되며 클라이언트에 노출되지 않습니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 빌드 및 배포

```bash
npm run build
npm run start
```

---

## 프로젝트 구조

```
src/
  app/
    layout.tsx            - 루트 레이아웃 (한국어, Geist 폰트)
    page.tsx              - 메인 페이지 (업로드 -> 선택 -> 분석 -> 결과)
    globals.css           - 전역 스타일
    api/
      analyze/route.ts    - POST /api/analyze 엔드포인트
  components/
    ImageUploader.tsx     - 이미지 업로드 및 카메라 촬영
    MeatTypeSelector.tsx  - 소고기/돼지고기 선택
    CutSelector.tsx       - 부위 선택
    AnalyzeButton.tsx     - 분석 실행 버튼
    ScoreCard.tsx         - 종합 등급 및 점수 표시
    DetailAnalysis.tsx    - 상세 점수 분석
    WarningBanner.tsx     - 경고 배너
    CutComparison.tsx     - 좋은/나쁜 고기 비교 참고
  lib/
    vision-ai.ts          - Claude Vision API 클라이언트
    image-utils.ts        - 이미지 리사이즈/압축 유틸리티
    prompts.ts            - AI 프롬프트 템플릿
    constants.ts          - 부위 데이터 및 분석 기준
    schemas.ts            - Zod 유효성 검증 스키마
  types/
    meat.ts               - 핵심 타입 정의
    api.ts                - API 요청/응답 타입
```

---

## API

### POST /api/analyze

고기 이미지를 분석하여 품질 결과를 반환합니다.

**요청 본문**

```json
{
  "image": "base64 인코딩된 이미지",
  "meatType": "beef" | "pork",
  "cut": "부위명"
}
```

**응답**

```json
{
  "overallGrade": "good" | "normal" | "bad",
  "overallScore": 85,
  "details": {
    "color": { "score": 90, "description": "..." },
    "marbling": { "score": 80, "description": "..." },
    "surface": { "score": 85, "description": "..." },
    "shape": { "score": 88, "description": "..." }
  },
  "warnings": ["경고 메시지"],
  "goodTraits": ["긍정적 특성"],
  "limitations": ["분석 한계 사항"],
  "cutReference": { "good": "...", "bad": "..." }
}
```

---

## 면책 조항

이 서비스의 AI 분석 결과는 참고 용도로만 제공됩니다. 실제 고기 품질은 사진만으로 완벽하게 판단할 수 없으며, 조명, 카메라 품질, 촬영 각도 등 외부 요인에 의해 분석 결과가 달라질 수 있습니다. 최종 구매 결정은 전문가의 의견이나 직접적인 확인을 통해 내려주시기 바랍니다.

---

## 라이선스

MIT License
