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
