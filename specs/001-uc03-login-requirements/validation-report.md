# UC-03 Validation Report

## Test Procedure

1. `node --test tests/**/*.js frontend/tests/**/*.js`
2. `node ./scripts/lint.mjs`
3. `node --test --experimental-test-coverage tests/**/*.js frontend/tests/**/*.js`

## Status

- Contract tests: PASS
- Integration tests: PASS
- Unit tests: PASS
- Accessibility smoke tests: PASS
- Lint checks: PASS

## UC-03 Scenario Coverage

- Successful login and redirect: covered in `tests/integration/test_uc03_login_success.js`
- Session continuity: covered in `tests/integration/test_uc03_session_continuity.js`
- Missing required fields: covered in `tests/integration/test_uc03_login_required_fields.js`
- Unknown/wrong credentials generic response: covered in `tests/integration/test_uc03_invalid_credentials.js`
- Lockout threshold/window/reset: covered in `tests/integration/test_uc03_lockout_policy.js`
- Credential-store outage handling: covered in `tests/integration/test_uc03_credential_store_outage.js`
- Login latency check (<400ms): covered in `tests/integration/test_uc03_login_performance.integration.js`

## SC-005 Evidence (Recovery Within Two Attempts)

The login observability stream records `login_invalid_credentials` and `login_success` events per email. In local UC-03 tests, failed-attempt sequences followed by corrected credentials complete successfully within two subsequent attempts when account is not in active lockout.

## Coverage Snapshot

- Line coverage: 95.70%
- Branch coverage: 84.03%
- Function coverage: 98.11%

## Remaining Gap

Global 100% branch coverage has not yet been achieved. Uncovered branches are mostly defensive/error paths in earlier UC modules and non-primary UI message branches.
