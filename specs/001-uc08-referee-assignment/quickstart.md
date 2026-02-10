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
