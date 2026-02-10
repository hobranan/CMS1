# Data Model: UC-03 Authenticate registered users

## Entity: UserAccount

- Purpose: Represents a registered user identity used for login.
- Fields:
  - `id` (UUID, primary key)
  - `email` (string, normalized lowercase, unique)
  - `password_hash` (string, required)
  - `status` (enum: `ACTIVE`, `LOCKED`, `DISABLED`)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Login identifier must match `email`.
  - `password_hash` must be verified with secure hash comparison.
- Relationships:
  - One-to-one with mutable `LockoutState`.
  - One-to-many with `LoginAttempt`.

## Entity: LockoutState

- Purpose: Tracks consecutive login failures and temporary lockout window.
- Fields:
  - `user_account_id` (UUID, primary/foreign key)
  - `failed_attempt_count` (integer, required, default 0)
  - `lockout_started_at` (datetime, nullable)
  - `lockout_expires_at` (datetime, nullable)
- Validation rules:
  - `failed_attempt_count` increments only on credential failures.
  - Lockout is active when `now < lockout_expires_at`.
  - On 5th consecutive failure set `lockout_expires_at = now + 15 minutes`.
  - Reset count on successful login or after lockout expiry.
- Relationships:
  - Belongs to `UserAccount`.

## Entity: LoginAttempt

- Purpose: Auditable record of each login submission and outcome.
- Fields:
  - `id` (UUID, primary key)
  - `submitted_email` (string, required)
  - `submitted_at` (datetime, required)
  - `outcome` (enum: `SUCCESS`, `MISSING_FIELDS`, `UNKNOWN_EMAIL`, `WRONG_PASSWORD`, `LOCKED_OUT`, `SYSTEM_FAILURE`)
  - `user_account_id` (UUID, nullable)
  - `message_code` (string, required)
- Validation rules:
  - `user_account_id` required for outcomes tied to known accounts.
  - `message_code` maps to user-visible, retry-oriented messaging.
- Relationships:
  - Optional link to `UserAccount`.

## Entity: AuthenticatedSession

- Purpose: Represents active authenticated state allowing protected-page access.
- Fields:
  - `id` (UUID, primary key)
  - `user_account_id` (UUID, required)
  - `issued_at` (datetime, required)
  - `expires_at` (datetime, required)
  - `last_seen_at` (datetime, required)
- Validation rules:
  - Session created only after successful credential verification.
  - Protected resources require non-expired session.
- Relationships:
  - Belongs to `UserAccount`.

## State Transitions

1. Submission with missing fields:
   - `LoginAttempt.outcome = MISSING_FIELDS`
   - No credential retrieval; no session creation.
2. Unknown email:
   - `LoginAttempt.outcome = UNKNOWN_EMAIL`
   - Authentication denied; remain on login page.
3. Wrong password:
   - Increment `LockoutState.failed_attempt_count`
   - If count reaches 5, set lockout for 15 minutes and outcome may become `LOCKED_OUT`.
4. Attempt during active lockout:
   - `LoginAttempt.outcome = LOCKED_OUT`
   - Authentication denied with retry-after messaging.
5. Credential-store unavailable:
   - `LoginAttempt.outcome = SYSTEM_FAILURE`
   - Authentication denied with retry-later messaging.
6. Successful authentication:
   - `LoginAttempt.outcome = SUCCESS`
   - Reset failed-attempt counter.
   - Create `AuthenticatedSession`.
   - Redirect to dashboard/home.
