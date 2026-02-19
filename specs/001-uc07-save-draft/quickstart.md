# Quickstart: UC-07 Save submission draft

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Manual save with partial data

```bash
curl -X POST http://localhost:3000/api/v1/drafts/<draft-id>/save \
  -H "Authorization: Bearer <author-token>" \
  -H "Content-Type: application/json" \
  -d '{"editable_state":{"title":"Draft Title","abstract":"Partial abstract"}}'
```

Expected:
- `200`
- `status: SAVED`
- Confirmation message and updated `last_saved_at`.

## 3. Save with no changes

Repeat previous save request without modifications.

Expected:
- `200`
- `status: NO_CHANGES`
- Persisted draft remains unchanged.

## 4. Save-level validation failure

Submit payload containing save-blocking invalid values.

Expected:
- `400`
- Field-level correction messages.
- Last successful saved draft unchanged.

## 5. Storage/network failure handling

1. Simulate storage outage or network interruption during save.
2. Invoke save endpoint.

Expected:
- `503` or connectivity failure response.
- Retry guidance shown.
- Persisted draft remains last successful version.

## 6. Cross-session retrieval

1. Save draft successfully.
2. Log out and log back in.
3. Retrieve draft:

```bash
curl -X GET http://localhost:3000/api/v1/drafts/<draft-id> \
  -H "Authorization: Bearer <author-token>"
```

Expected:
- Draft payload matches last successful save.

## 7. Submit with unsaved edits and final-validation failure

```bash
curl -X POST http://localhost:3000/api/v1/drafts/<draft-id>/finalize \
  -H "Authorization: Bearer <author-token>" \
  -H "Content-Type: application/json" \
  -d '{"editable_state":{"title":"Updated but invalid for final submit","abstract":"..."}}'
```

Expected:
- Current unsaved edits are persisted first (save-equivalent behavior).
- Final validation runs after save step.
- If final validation fails, response is `409`, submission remains unfinalized, and newly saved edits remain retrievable.
