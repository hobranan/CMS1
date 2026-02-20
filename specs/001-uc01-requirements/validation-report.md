# UC-01 Validation Report

## Test Procedure

PowerShell execution policy blocked `npm.ps1`, so validation used equivalent direct commands:

1. `node --test tests/**/*.js frontend/tests/**/*.js`
2. `node ./scripts/lint.mjs`
3. `node --test --experimental-test-coverage tests/**/*.js frontend/tests/**/*.js`

## Pass Status

- Contract tests: PASS
- Integration tests: PASS
- Unit tests: PASS
- Accessibility smoke test: PASS
- Lint check: PASS

## Coverage Summary

- Line coverage: 94.13%
- Branch coverage: 75.64%
- Function coverage: 97.06%

## Open Gap

100% branch coverage target is not yet met in this iteration. Remaining uncovered branches are primarily defensive/error paths in registration/auth services and repository utility branches.

## Success Criteria Evidence

- SC-004 measurement method:
  - Observed first-submit to verification-complete durations from UC-01 happy-path test flow.
  - Current execution evidence remains within the target window for the captured runs.
- SC-005 evidence:
  - Unverified-login denial and resend-option behavior validated by `tests/integration/test_uc01_registration_expiry_and_unverified_login.js`.
  - Expired pending-registration denial behavior validated in the same integration suite.
