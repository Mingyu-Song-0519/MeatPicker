# Phase 7: Observability and Optimization

## Goal

Improve operability and reduce cost/latency through structured logs and lightweight optimization.

## Scope

- Add structured event logging.
- Capture analysis duration and error classes.
- Tune image/prompt defaults for efficiency.

## Implementation Tasks

1. Add observability utility with consistent event schema.
2. Emit timing and outcome events in route and model call layers.
3. Add minimal optimization:
- Keep preprocessed image constraints explicit.
- Keep prompt concise while preserving required fields.
4. Ensure logs do not leak sensitive payloads.

## Files Expected

- `src/lib/observability.ts`
- `src/app/api/analyze/route.ts`
- `src/lib/vision-ai.ts`
- Optional small update: `src/lib/image-utils.ts`

## Verification

```bash
npm run lint
npm run build
```

Manual checks:

1. Successful request emits duration and success event.
2. Failed request emits categorized error event.

## Exit Criteria

- Operational logs are consistent and useful for debugging.
- No sensitive content is logged.
