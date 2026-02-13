# MeatPicker

고기 사진(소고기/돼지고기)을 업로드하면 AI가 품질을 분석하고 구매 추천을 제공하는 웹 앱입니다.

## 주요 기능

- 사진 업로드/모바일 카메라 촬영
- 고기 종류/부위 선택 후 AI 분석
- 종합 점수/등급 + 세부 점수(색, 마블링, 표면, 형태)
- 구매 추천(`buy`/`conditional`/`avoid`), 신뢰도, 판단 근거 제공
- 경고 징후(변색, PSE 의심, 표면 이상, 탄력 저하) 안내

## 기술 스택

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Gemini API (Google Generative Language)
- OpenNext + Cloudflare Workers
- Zod
- Vitest

## 사전 준비

- Node.js 20+
- Gemini API Key

## 설치 및 실행

```bash
git clone https://github.com/Mingyu-Song-0519/MeatPicker.git
cd MeatPicker
npm install
```

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정하세요.

```env
GEMINI_API_KEY=your_real_api_key
GEMINI_MODEL=gemini-2.5-flash
# 선택값 (기본 3072)
GEMINI_MAX_OUTPUT_TOKENS=3072
```

개발 서버 실행:

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## Cloudflare Workers 배포

프로젝트는 OpenNext 어댑터를 사용해 Cloudflare Workers로 배포합니다.

### 1) 로컬 프리뷰 (Workers 런타임)

```bash
npm run preview
```

### 2) CLI로 배포

```bash
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
npm run deploy
```

선택값:

```bash
npx wrangler secret put GEMINI_MODEL
npx wrangler secret put GEMINI_MAX_OUTPUT_TOKENS
```

### 3) Git 연동(Cloudflare Dashboard)로 배포

- 프로젝트 유형: **Workers**
- 저장소 연결 후 빌드 커맨드: `npm run upload`
- `wrangler.jsonc`를 기준으로 Worker 엔트리(`.open-next/worker.js`)와 assets(`.open-next/assets`)가 자동 업로드됩니다.

## 품질 검증 명령

```bash
npm run test
npm run lint
npm run build
```

## API

### `POST /api/analyze`

요청 예시:

```json
{
  "image": "data:image/jpeg;base64,...",
  "meatType": "beef",
  "cut": "ribeye"
}
```

응답 예시:

```json
{
  "overallGrade": "normal",
  "overallScore": 68,
  "details": {
    "color": { "score": 78, "description": "..." },
    "marbling": { "score": 62, "description": "..." },
    "surface": { "score": 70, "description": "..." },
    "shape": { "score": 65, "description": "..." }
  },
  "warnings": ["..."],
  "goodTraits": ["..."],
  "limitations": ["..."],
  "cutReference": {
    "goodDescription": "...",
    "badDescription": "..."
  },
  "buyRecommendation": "conditional",
  "confidence": 0.73,
  "reasons": ["..."],
  "qualityFlags": {
    "discoloration": false,
    "pseRisk": false,
    "surfaceRisk": false,
    "elasticityRisk": true
  },
  "analyzedAt": "2026-02-13T11:45:00.000Z"
}
```

## 프로젝트 구조

```text
src/
  app/
    api/analyze/route.ts
    page.tsx
  components/
    ImageUploader.tsx
    MeatTypeSelector.tsx
    CutSelector.tsx
    AnalyzeButton.tsx
    RecommendationPanel.tsx
    ScoreCard.tsx
    DetailAnalysis.tsx
    WarningBanner.tsx
    CutComparison.tsx
  lib/
    vision-ai.ts
    prompts.ts
    prompt-rules.ts
    constants.ts
    schemas.ts
    post-process.ts
    rate-limit.ts
    image-utils.ts
    observability.ts
    __tests__/
  types/
    meat.ts
    api.ts
```

## 주의

- 본 결과는 사진 기반 AI 추정이며 최종 구매 판단을 대체하지 않습니다.
- 냄새/촉감/내부 상태/보관 이력은 사진만으로 확정할 수 없습니다.

## 라이선스

MIT
