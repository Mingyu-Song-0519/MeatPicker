# MeatPicker Manual QA Checklist

This checklist is for pre-release manual validation on desktop and mobile devices.

## 1. Environment Setup

- [ ] `npm install` completed successfully.
- [ ] `npm run dev` starts without runtime errors.
- [ ] `.env.local` includes valid `ANTHROPIC_API_KEY`.
- [ ] Test on at least:
- [ ] Desktop Chrome (latest)
- [ ] Mobile Chrome (Android) or Safari (iOS)

## 2. Core User Flow

- [ ] User can upload image from file picker.
- [ ] User can open camera capture flow on mobile.
- [ ] Image preview renders after upload/capture.
- [ ] User can remove selected image.
- [ ] User can select meat type (`beef`, `pork`).
- [ ] User can select a cut for selected meat type.
- [ ] Analyze button stays disabled until all required inputs are set.
- [ ] Analyze button enters loading state during request.
- [ ] Analysis result screen renders without crash.

## 3. Result Quality UX

- [ ] Result shows overall score and grade.
- [ ] Result shows recommendation (`buy`, `conditional`, `avoid`) badge.
- [ ] Result shows confidence percentage.
- [ ] Result shows reasons list.
- [ ] Result shows risk indicators from quality flags.
- [ ] Result shows warnings section when warnings exist.
- [ ] Result shows detailed subscores (color/marbling/surface/shape).
- [ ] Result shows cut comparison block.
- [ ] "Analyze again" resets state correctly.

## 4. Validation and Error Cases

- [ ] Missing image -> blocked by client guidance.
- [ ] Missing meat type -> blocked by client guidance.
- [ ] Missing cut -> blocked by client guidance.
- [ ] Invalid JSON request returns `400 INVALID_JSON`.
- [ ] Invalid payload returns `400 VALIDATION_ERROR`.
- [ ] Oversized payload returns `413 PAYLOAD_TOO_LARGE` or `413 IMAGE_TOO_LARGE`.
- [ ] Excess requests return `429 RATE_LIMIT`.
- [ ] Upstream timeout returns `504 TIMEOUT`.

## 5. Visual and Responsiveness

- [ ] Layout is readable on small mobile screens.
- [ ] Buttons remain tappable without overlap.
- [ ] Preview image keeps aspect ratio (no major distortion).
- [ ] Result cards are scrollable and readable in mobile viewport.

## 6. Stability / Regression

- [ ] Repeated analyze/reset cycles do not break UI state.
- [ ] Switching meat type resets cut and previous result.
- [ ] No console error spam in successful path.
- [ ] No sensitive payloads (full base64 image, API key) appear in logs.

## 7. Exit Gate

Release candidate is acceptable only if:

- [ ] All critical flow items in sections 2 and 3 pass.
- [ ] All API error handling checks in section 4 pass.
- [ ] No blocking UI bug found on target mobile and desktop.
