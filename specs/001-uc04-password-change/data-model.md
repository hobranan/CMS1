# Data Model: UC-04 Change account password

## Entity: UserAccount

- Purpose: Represents authenticated account identity and active credential.
- Fields:
  - `id` (UUID, primary key)
  - `email` (string, unique)
  - `password_hash` (string, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Password changes allowed only for authenticated account owner.
- Relationships:
  - One-to-many with `PasswordHistory`.
  - One-to-many with `AuthenticatedSession`.

## Entity: PasswordChangeRequest (application model)

- Purpose: Captures submitted current/new/confirmation values and validation outcomes.
- Fields:
  - `current_password` (string, required)
  - `new_password` (string, required)
  - `confirm_new_password` (string, optional/required when confirmation enabled)
  - `requested_at` (datetime, required)
  - `validation_errors` (array of `{ code, field, message }`)
- Validation rules:
  - All displayed fields required before processing.
  - Current password must match stored credential.
  - Confirmation must match new password when required.

## Entity: PasswordSecurityStandard

- Purpose: Defines policy used to validate candidate new passwords.
- Fields:
  - `min_length` (integer, fixed 12)
  - `require_uppercase` (boolean, true)
  - `require_lowercase` (boolean, true)
  - `require_number` (boolean, true)
  - `require_special` (boolean, true)
  - `allow_spaces` (boolean, false)
  - `disallow_current_match` (boolean, true)
  - `history_window` (integer, fixed 5)
- Validation rules:
  - Candidate password must satisfy every enabled rule.

## Entity: PasswordHistory

- Purpose: Stores previous password hashes for reuse prevention.
- Fields:
  - `id` (UUID, primary key)
  - `user_account_id` (UUID, foreign key)
  - `password_hash` (string, required)
  - `recorded_at` (datetime, required)
- Validation rules:
  - Keep latest 5 entries per user for FR-006 reuse checks.
- Relationships:
  - Belongs to `UserAccount`.

## Entity: AuthenticatedSession

- Purpose: Represents active signed-in state invalidated after successful password change.
- Fields:
  - `id` (UUID, primary key)
  - `user_account_id` (UUID, foreign key)
  - `issued_at` (datetime, required)
  - `expires_at` (datetime, required)
  - `invalidated_at` (datetime, nullable)
- Validation rules:
  - On successful password change, active session used for request must be invalidated immediately.
- Relationships:
  - Belongs to `UserAccount`.

## State Transitions

1. Valid request submitted:
   - Current password verified.
   - New password validated against security standard and history.
2. Validation/verification failure:
   - Request rejected with specific errors.
   - `UserAccount.password_hash` unchanged.
   - No history update persisted.
3. Credential-store write failure:
   - Transaction rollback.
   - Password remains previous value.
4. Successful password change:
   - `UserAccount.password_hash` updated.
   - Prior hash appended to `PasswordHistory` and history window trimmed to 5.
   - Active session invalidated.
   - User must re-authenticate with new password.
