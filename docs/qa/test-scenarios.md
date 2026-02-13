# MeatPicker QA Test Scenarios

Use this scenario matrix for structured manual verification.

## Legend

- Priority: `P0` critical, `P1` important, `P2` nice-to-have
- Status: `PASS` / `FAIL` / `BLOCKED`

## Scenario Matrix

| ID | Priority | Scenario | Input | Expected Result |
|---|---|---|---|---|
| QA-001 | P0 | Basic successful analysis (beef) | Valid beef image + `beef` + valid cut | API returns 200 and result page shows score/grade/recommendation/confidence |
| QA-002 | P0 | Basic successful analysis (pork) | Valid pork image + `pork` + valid cut | API returns 200 and result page shows complete analysis sections |
| QA-003 | P0 | Missing image guard | No image, select type/cut | Analyze button disabled; guidance shown |
| QA-004 | P0 | Missing meat type guard | Image + no meat type | Analyze button disabled; guidance shown |
| QA-005 | P0 | Missing cut guard | Image + meat type + no cut | Analyze button disabled; guidance shown |
| QA-006 | P0 | Reset flow | Complete one analysis, click reset | All inputs and result state cleared |
| QA-007 | P1 | Meat type switch reset | Select type+cut then switch meat type | Cut resets and previous result removed |
| QA-008 | P0 | Request validation error | Send malformed payload to `/api/analyze` | HTTP 400 with `VALIDATION_ERROR` |
| QA-009 | P0 | Payload too large | Send oversized request body | HTTP 413 with size-related code |
| QA-010 | P0 | Rate limiting | Burst > 10 requests/min per IP | HTTP 429 with `Retry-After` header |
| QA-011 | P1 | Timeout handling | Simulate upstream delay/timeout | HTTP 504 with `TIMEOUT` code |
| QA-012 | P1 | UI responsiveness mobile | Run full flow on mobile width | No clipping/overlap; controls usable |
| QA-013 | P1 | Warning rendering | Input likely poor-quality image | Warning banner and risk chips shown |
| QA-014 | P2 | Long session stability | Repeat analyze/reset 20+ times | No crash, no unrecoverable UI state |

## Suggested Test Assets

- 3 beef photos: high quality / medium / clearly poor.
- 3 pork photos: high quality / medium / clearly poor.
- 1 non-meat photo to test degraded confidence and warnings.
- 1 very large image (>10MB source) for preprocessing behavior.

## Bug Report Template

```
Title:
Environment:
Scenario ID:
Steps to Reproduce:
Expected:
Actual:
Screenshot/Log:
Severity:
```
