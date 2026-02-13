# Phase 4: Prompt and Criteria Structure

## Goal

Improve model output consistency by giving stricter structured guidance with clearer criteria.

## Scope

- Refine prompt contract for strict JSON.
- Improve criteria composition in prompt.
- Keep current meat cut knowledge base intact.

## Implementation Tasks

1. Update prompt builder to include:
- Strict field checklist.
- Output constraints and forbidden non-JSON output.
- More explicit risk detection expectations.
2. Add reusable prompt rule blocks to avoid drift.
3. Keep cut-level criteria injection and common bad-sign references.

## Files Expected

- `src/lib/prompts.ts`
- Optional new helper: `src/lib/prompt-rules.ts`

## Verification

```bash
npm run lint
npm run build
```

Manual checks:

1. Run one analysis and inspect parsed JSON success.
2. Confirm new fields are requested and returned.

## Exit Criteria

- JSON parse failures are reduced.
- Response payload follows required field set reliably.
