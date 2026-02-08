# Quickstart: UC-01 Registration with Email Verification

## 1. Start services

```bash
npm install
npm test && npm run lint
```

## 2. Initiate registration

```bash
curl -X POST http://localhost:3000/api/v1/registrations \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new_user_01@example.com",
    "password": "ValidSecurePass123",
    "profile": {}
  }'
```

Expected:
- `202 Accepted`
- Response indicates confirmation email sent and registration is pending.

## 3. Verify email via confirmation link

```bash
curl "http://localhost:3000/api/v1/registrations/verify?token=<token-from-email>"
```

Expected:
- `302` redirect (web flow) or `200` JSON (API flow)
- Redirect target is login screen.

## 4. Validate expired token behavior

1. Use a token older than 24 hours.
2. Verify endpoint returns `410 Gone` with `TOKEN_EXPIRED`.
3. Request new confirmation:

```bash
curl -X POST http://localhost:3000/api/v1/registrations/resend-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"new_user_01@example.com"}'
```

## 5. Confirm login works after verification

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"new_user_01@example.com","password":"ValidSecurePass123"}'
```

Expected:
- Successful authentication with newly verified credentials.

## 6. Negative tests

- Invalid email format -> `422` with `INVALID_EMAIL_FORMAT`.
- Duplicate email -> `409` with `EMAIL_ALREADY_REGISTERED`.
- Weak password -> `422` with `WEAK_PASSWORD`.
- Missing required fields -> `422` with field-level errors.
