# Phase 1: Domain Model and Schema Expansion

## Goal

Extend the analysis contract so the API can return purchase guidance and confidence as first-class fields.

## Scope

- Extend TypeScript domain model.
- Extend Zod result schema.
- Keep backward compatibility for raw LLM output handling.

## Implementation Tasks

1. Add new fields to final analysis result type:
- `buyRecommendation: 'buy' | 'conditional' | 'avoid'`
- `confidence: number` (0 to 1)
- `reasons: string[]`
- `qualityFlags` object with boolean risk flags
2. Add matching Zod schemas for the new fields.
3. Split schemas into:
- Raw AI response schema (minimum required fields from model).
- Final response schema (strict output returned by API).
4. Ensure route and frontend compile with the expanded final type.

## Files Expected

- `src/types/meat.ts`
- `src/lib/schemas.ts`

## Verification

```bash
npm run lint
npm run build
```

## Exit Criteria

- Build succeeds.
- Final result type includes all new fields.
- Raw schema can still validate current LLM output format.
