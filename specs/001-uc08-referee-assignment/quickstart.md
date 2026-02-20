# Quickstart: UC-08 Assign paper referees

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Successful assignment

```bash
curl -X POST http://localhost:3000/api/v1/papers/<paper-id>/assignments \
  -H "Authorization: Bearer <editor-token>" \
  -H "Content-Type: application/json" \
  -d '{"referee_ids":["r1","r2","r3"]}'
```

Expected:
- `200`
- Assignment finalized and invitations sent.

## 3. Validation failures

- Zero referees selected -> `400`.
- More than three selected -> `400`.
- Ineligible referee included -> `400`.
- Workload-exceeded referee included -> `400`.
- Duplicate referee IDs -> `400`.

Expected:
- Assignment unchanged.
- Field-level actionable feedback returned.

## 4. Concurrency conflict

1. Select referees in UI.
2. Cause workload/eligibility to change before confirm (or concurrent assignment).
3. Confirm assignment.

Expected:
- `409`
- Clear conflict message.
- No partial assignment.

## 5. Persistence and notification failures

1. Simulate DB failure at assignment save time.
2. Submit otherwise valid assignment.

Expected:
- `503`
- No assignments finalized.

3. Simulate notification failure after assignment prep.
4. Submit valid assignment.

Expected:
- `503`
- Rollback applied; no partial assignment remains.

## 6. Verify assignment visibility

```bash
curl -X GET http://localhost:3000/api/v1/papers/<paper-id>/assignments \
  -H "Authorization: Bearer <editor-token>"
```

Expected:
- Returns consistently assigned referees only for successful finalized transactions.

## 7. Execute UC-08 automated tests

```bash
node --test tests/contract/assignment/*.test.js tests/integration/assignment/*.test.js
```

Expected:
- All UC-08 contract and integration tests pass.

## 8. Style profile verification (HTML/CSS subset)

- Verified `frontend/src/views/referee-assignment.html` against `docs/standards/html-css-style-profile.md`.
- Confirmed semantic section structure, lower-case tags, explicit button type, and no inline style/script usage.

## 9. Verification notes

- SC-004 rollback evidence:
  - `tests/contract/assignment/post-assignments-invitation-failure.contract.test.js`
  - `tests/integration/assignment/atomic-rollback.integration.test.js`
- SC-005 one-attempt completion metric telemetry captured in `assignment_observability_service` event records.
- Performance evidence:
  - `tests/integration/assignment/assignment-confirmation-performance.integration.test.js` verifies p95 < 500ms.
