# Phase Execution Guide

This folder stores the implementation contract for each phase.

Execution rules:

1. Implement phases in numeric order.
2. Validate each phase before moving to the next one.
3. Keep scope bounded to the phase document.
4. If a phase requires refactor in previous code, keep behavior stable and re-run previous checks.
5. Record command-based verification in terminal output.

Primary verification commands:

```bash
npm run lint
npm run build
npm run test
```

Phase documents:

- `phase-1-domain-model.md`
- `phase-2-post-processing.md`
- `phase-3-api-hardening.md`
- `phase-4-prompt-criteria.md`
- `phase-5-ui-integration.md`
- `phase-6-tests-quality-gates.md`
- `phase-7-observability-optimization.md`
