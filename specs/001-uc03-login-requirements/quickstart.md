# Quickstart: UC-03 Authenticate registered users

## 1. Start baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Successful login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"registered_user@example.com","password":"ValidSecurePass123"}'
```

Expected:
- `200 OK`
- Authenticated response with dashboard/home redirect.

## 3. Missing-field rejection

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"","password":""}'
```

Expected:
- `400 Bad Request`
- Required-field feedback and no authentication.

## 4. Invalid-credential rejection

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"registered_user@example.com","password":"WrongPass123"}'
```

Expected:
- `401 Unauthorized`
- Retry-oriented invalid credential message.

## 5. Trigger lockout

1. Submit 5 consecutive wrong-password attempts for same registered email.
2. Attempt login again during lockout window.

Expected:
- `423 Locked`
- Lockout message with retry timing.
- Login denied until 15-minute window expires.

## 6. Credential-store outage behavior

1. Simulate credential-store/database unavailability.
2. Submit valid-looking login request.

Expected:
- `503 Service Unavailable`
- System-problem message and retry-later guidance.

## 7. Session continuity on protected page

```bash
curl -X GET http://localhost:3000/api/v1/auth/session
```

Expected:
- `200 OK` when session is active.
- Protected dashboard can load/refresh without redirect to login.
