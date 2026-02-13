# Phase 6: Tests and Quality Gates

## Goal

Add automated checks for schema, post-processing rules, and route behavior to prevent regressions.

## Scope

- Add test runner and scripts.
- Add unit tests for core deterministic logic.
- Add route-level tests for guards and status mapping.

## Implementation Tasks

1. Add test tooling (`vitest`) and scripts.
2. Add unit tests:
- Schema validation pass/fail cases.
- Post-processing rule cases.
3. Add API tests for:
- Bad payload rejection.
- Rate limit rejection.
4. Add `npm run test` to standard verification flow.

## Files Expected

- `package.json`
- `vitest.config.ts`
- `src/lib/__tests__/*.test.ts`
- Optional: `src/app/api/analyze/__tests__/*.test.ts`

## Verification

```bash
npm run test
npm run lint
npm run build
```

## Exit Criteria

- Tests pass in local environment.
- Core rule behavior is locked with deterministic assertions.
