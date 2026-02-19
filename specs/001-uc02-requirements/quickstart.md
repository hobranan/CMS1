# Quickstart: UC-02 Validate user-provided information

## 1. Start and verify baseline

```bash
npm install
npm test && npm run lint
```

## 2. Submit valid payload

```bash
curl -X POST http://localhost:3000/api/v1/forms/profile/submissions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Jane Doe",
    "contactEmail": "jane@example.com",
    "affiliation": "CMS Org"
  }'
```

Expected:
- `200 OK`
- Response confirms success.
- Data is stored/updated.

## 3. Submit missing required field

```bash
curl -X POST http://localhost:3000/api/v1/forms/profile/submissions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "",
    "contactEmail": "jane@example.com"
  }'
```

Expected:
- `422 Unprocessable Entity`
- Field-specific required error.
- No persisted update.

## 4. Submit invalid format and constraint violations

```bash
curl -X POST http://localhost:3000/api/v1/forms/profile/submissions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Jane",
    "contactEmail": "bademail",
    "bio": "x"
  }'
```

Expected:
- `422 Unprocessable Entity`
- `errors[]` includes format and constraint details.
- No partial updates stored.

## 5. Atomicity verification

1. Record current stored value for a valid field (Field A).
2. Submit payload where Field A is valid but Field B is invalid.
3. Re-fetch stored form data.

Expected:
- Submission rejected.
- Field A remains unchanged (rollback/no partial write).
