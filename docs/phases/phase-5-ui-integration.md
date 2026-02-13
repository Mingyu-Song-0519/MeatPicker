# Phase 5: UI Integration

## Goal

Expose recommendation and confidence clearly so users can make purchase decisions faster.

## Scope

- Render recommendation badge and confidence.
- Render machine-derived reasons.
- Render risk flags in readable language.

## Implementation Tasks

1. Extend score/result section to show:
- `buyRecommendation` badge.
- `confidence` percentage.
2. Add reason list component or section.
3. Add quality/risk indicator chips from `qualityFlags`.
4. Keep existing detail analysis and comparison sections.

## Files Expected

- `src/components/ScoreCard.tsx`
- `src/components/DetailAnalysis.tsx` (if needed)
- `src/app/page.tsx`
- Optional new component: `src/components/RecommendationPanel.tsx`

## Verification

```bash
npm run lint
npm run build
```

Manual checks:

1. Positive sample shows `buy`.
2. Mixed sample shows `conditional`.
3. Risk-heavy sample shows `avoid`.

## Exit Criteria

- Users can see recommendation and confidence without inspecting raw detail blocks.
