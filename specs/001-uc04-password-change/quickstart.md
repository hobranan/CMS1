# Quickstart: UC-04 Change account password

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Successful password change

```bash
curl -X PUT http://localhost:3000/api/v1/account/password \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password":"OldSecurePass!123",
    "new_password":"NewSecurePass!456",
    "confirm_new_password":"NewSecurePass!456"
  }'
```

Expected:
- `200 OK`
- Success confirmation response with `reauthenticate: true`.

## 3. Required-field and mismatch failures

- Missing current password -> `400` with required-field error.
- Missing new password -> `400` with required-field error.
- Confirmation mismatch -> `400` with mismatch error.

## 4. Policy and history violations

- Weak new password -> `400` with policy violation details.
- New password equals current password -> `400`.
- New password matches one of last 5 passwords -> `400`.

## 5. Credential-store failure handling

1. Simulate credential-store write outage.
2. Submit otherwise valid change request.

Expected:
- `503 Service Unavailable`
- Existing password remains unchanged.
- User can retry later.

## 6. Re-authentication requirement

1. After successful password change, call session check:

```bash
curl -X GET http://localhost:3000/api/v1/auth/session \
  -H "Authorization: Bearer <session-token>"
```

2. Attempt login with old password (must fail).
3. Attempt login with new password (must succeed).

Expected:
- Previous session invalidated after password change.
- User must sign in again with new password.
