# UC-06 Validation Report

## Test Procedure

1. `node --test tests/contract/upload/*.test.js tests/integration/upload/*.test.js`
2. `node --test tests/**/*.js frontend/tests/**/*.js`
3. `node --test --experimental-test-coverage tests/**/*.js frontend/tests/**/*.js`
4. `node ./scripts/lint.mjs`

## Status

- UC-06 contract tests: PASS
- UC-06 integration tests: PASS
- Full-suite regression: PASS
- Lint checks: PASS

## Coverage Snapshot (global)

- Line coverage: 96.59%
- Branch coverage: 82.84%
- Function coverage: 97.12%

## Notes

- Allowed extensions are enforced by extension only: `.pdf`, `.doc`, `.docx`, `.tex` (case-insensitive).
- Retry mode logic returns `RESUME` within 30 minutes and `RESTART` after expiry.
- Storage/association failures preserve unattached state.
