# Quickstart: UC-01 Registration with Email Verification

## 1. Start services

```bash
npm install
npm test && npm run lint
node --test --experimental-test-coverage tests/**/*.js frontend/tests/**/*.js
```

If PowerShell blocks `npm.ps1`, run the equivalent direct commands:

```bash
node --test tests/**/*.js frontend/tests/**/*.js
node ./scripts/lint.mjs
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
- Response indicates verification is pending and includes `registration_expires_at` (7 days from submission).

## 3. Attempt login before verification

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"new_user_01@example.com","password":"ValidSecurePass123"}'
```

Expected:
- `403 Forbidden`
- Code `EMAIL_UNVERIFIED`
- Message reminds user to verify email
- Response includes resend option.

## 4. Verify email via confirmation link

```bash
curl "http://localhost:3000/api/v1/registrations/verify?token=<token-from-email>"
```

Expected:
- `302` redirect (web flow) or `200` JSON (API flow)
- Redirect target is login screen.

## 5. Validate expired-token and resend behavior

1. Use a token older than 24 hours.
2. Verify endpoint returns `410 Gone` with `TOKEN_EXPIRED`.
3. Request new confirmation:

```bash
curl -X POST http://localhost:3000/api/v1/registrations/resend-confirmation \
  -H "Content-Type: application/json" \
  -d '{"email":"new_user_01@example.com"}'
```

## 6. Validate registration-attempt expiry behavior

1. Use a pending registration older than 7 days.
2. Resend endpoint returns `410 Gone` with `REGISTRATION_ATTEMPT_EXPIRED`.
3. User must restart registration flow.

## 7. Confirm login works after verification

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"new_user_01@example.com","password":"ValidSecurePass123"}'
```

Expected:
- Successful authentication with newly verified credentials.

## 8. Negative tests

- Invalid email format -> `422` with `INVALID_EMAIL_FORMAT`.
- Duplicate email -> `409` with `EMAIL_ALREADY_REGISTERED`.
- Weak password -> `422` with `WEAK_PASSWORD`.
- Missing required fields -> `422` with field-level errors.

## 9. HTML/CSS style-profile validation

Checked against `docs/standards/html-css-style-profile.md`:
- Registration and verification copy uses concise, direct wording.
- Error and reminder text is actionable, specific, and non-ambiguous.
- Login reminder and validation views keep semantic structure and field/error associations.
