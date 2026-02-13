# Phase 3: API Hardening

## Goal

Protect `/api/analyze` from oversized payloads, bursts, and unstable upstream failures.

## Scope

- Request size and image size limits.
- In-memory rate limiting.
- Timeout and retry behavior for model calls.
- Structured error mapping.

## Implementation Tasks

1. Add request guards:
- `content-length` hard limit.
- base64 image length hard limit.
2. Add rate limiter utility:
- IP-based window (e.g., 10 requests per minute).
- Return 429 with retry hint.
3. Add model call resiliency:
- Timeout wrapper.
- One retry for retryable failures.
4. Standardize error code mapping in route.

## Files Expected

- `src/lib/rate-limit.ts`
- `src/lib/vision-ai.ts`
- `src/app/api/analyze/route.ts`

## Verification

```bash
npm run lint
npm run build
```

Manual checks:

1. Send normal request -> 200.
2. Send oversized request -> 413/400.
3. Exceed per-IP limit -> 429.

## Exit Criteria

- API returns predictable status codes for bad input and abuse patterns.
- Upstream transient failures do not immediately fail first attempt.
