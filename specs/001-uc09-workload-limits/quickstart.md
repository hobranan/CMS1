# Quickstart: UC-09 Enforce referee workload limits

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Successful assignment below limit

```bash
curl -X POST http://localhost:3000/api/v1/papers/<paper-id>/assign-referee \
  -H "Authorization: Bearer <editor-token>" \
  -H "Content-Type: application/json" \
  -d '{"referee_id":"r123"}'
```

Expected:
- `200`
- Assignment stored.

## 3. Rejection at/equal-or-above configured limit

Attempt same endpoint with referee whose current workload is equal to or above active limit.

Expected:
- `400`
- Workload-limit message.
- No assignment stored.

## 4. Retrieval failure path

1. Simulate workload lookup/config retrieval failure.
2. Attempt assignment.

Expected:
- `503`
- System error feedback.
- No assignment stored.

## 5. Storage failure path

1. Simulate storage failure after successful workload validation.
2. Attempt assignment.

Expected:
- `503`
- System error feedback.
- No assignment stored.

## 6. Config change application

1. Update active workload limit configuration.
2. Perform new assignment attempt.

Expected:
- New configured limit is used immediately in validation decision.

## 7. Workload visibility check

```bash
curl -X GET http://localhost:3000/api/v1/referees/<referee-id>/workload \
  -H "Authorization: Bearer <editor-token>"
```

Expected:
- Returned workload reflects accepted assignments only.

## 8. Refresh-required conflict check

1. Capture workload/limit snapshot during referee selection.
2. Change workload or limit before confirmation.
3. Confirm assignment with stale snapshot.

Expected:
- `409`
- Refresh-required message returned.
- No assignment stored.

## 9. Execute UC-09 automated tests

```bash
node --test tests/contract/workload/*.test.js tests/integration/workload/*.test.js
```

Expected:
- All UC-09 workload contract and integration tests pass.

## 10. Style profile verification (HTML/CSS subset)

- Verified `frontend/src/views/workload-assignment-panel.html` against `docs/standards/html-css-style-profile.md`.
- Confirmed semantic section structure, lower-case tags, explicit button type, and no inline style/script usage.

## 11. Verification notes

- SC-004 evidence:
  - `tests/integration/workload/workload-increment.integration.test.js`
- SC-005 evidence:
  - `tests/integration/workload/config-change-applies-next-check.integration.test.js`
  - `tests/integration/workload/rule-precedence-resolution.integration.test.js`
- Performance evidence:
  - `tests/integration/workload/workload-decision-performance.integration.test.js` verifies p95 < 300ms.
