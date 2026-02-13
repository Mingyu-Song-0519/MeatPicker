# Phase 2: Deterministic Post-Processing Engine

## Goal

Convert raw LLM output into stable, deterministic final results with consistent scoring and recommendation logic.

## Scope

- Add server-side rule engine.
- Normalize score-grade consistency.
- Compute recommendation, confidence, reasons, and risk flags.

## Implementation Tasks

1. Add `src/lib/post-process.ts` with pure functions.
2. Define deterministic rules:
- Grade from score: `>=80 good`, `50-79 normal`, `<50 bad`.
- Critical risk downgrade on severe warning combinations.
- Recommendation mapping:
  - `buy`: strong quality and low risk
  - `conditional`: medium quality or moderate uncertainty
  - `avoid`: low quality or high risk
3. Build `qualityFlags` from detail scores and warning text.
4. Compute `confidence` from risk presence and warning severity.
5. Generate user-facing `reasons` from strengths and risks.
6. Run final Zod validation after post-processing.

## Files Expected

- `src/lib/post-process.ts`
- `src/lib/vision-ai.ts`

## Verification

```bash
npm run lint
npm run build
```

## Exit Criteria

- Final API output is deterministic for same input.
- Grade, recommendation, and risk flags are always populated.
