# Phase 0 Research: UC-01 Register New User Account

## Decision 1: Registration completion requires email verification

- Decision: Account remains unverified until token confirmation is completed.
- Rationale: Directly satisfies FR-008, FR-009, FR-010 and prevents activation
  of unverified addresses.
- Alternatives considered:
  - Immediate account creation without verification: rejected because it
    violates clarified requirement.
  - Optional verification: rejected because requirement is mandatory.

## Decision 2: Use time-bound signed verification tokens with 24-hour TTL

- Decision: Issue random, single-use token linked to pending registration, store
  token hash and expiration timestamp, invalidate on first successful use.
- Rationale: Supports secure verification flow and exact 24-hour expiry checks.
- Alternatives considered:
  - JWT-only self-contained token with no persistence: rejected because single
    use and revocation are harder to enforce.
  - Numeric OTP via email: rejected because use case expects confirmation link.

## Decision 3: Keep account in `PENDING_VERIFICATION` state before activation

- Decision: Persist pending registration data separately and create active user
  account only after successful token validation.
- Rationale: Ensures no active account exists before verification while still
  preserving submitted data for completion.
- Alternatives considered:
  - Create full user immediately with `inactive` flag: possible, but rejected to
    minimize exposure of unverified records in the primary user table.

## Decision 4: Password validation baseline and hashing

- Decision: Enforce minimum 8 chars, at least one letter and one number, symbols
  allowed (spec assumption), then store only salted password hash.
- Rationale: Matches spec assumptions and preserves credential security.
- Alternatives considered:
  - Lower complexity requirements: rejected as weaker than documented baseline.
  - Storing encrypted plaintext: rejected as insecure compared with one-way hash.

## Decision 5: Error reporting strategy for invalid submissions

- Decision: Return field-level validation errors with stable error codes and
  user-readable messages; allow either all-errors or first-blocking behavior, but
  ensure clear actionable feedback.
- Rationale: Aligns with FR-012 and AT-UC01-06 expectation.
- Alternatives considered:
  - Single generic error message only: rejected because it is not actionable.

## Decision 6: Duplicate email handling across pending and active records

- Decision: Treat email as unavailable if found in either active users or
  unexpired pending registrations.
- Rationale: Prevents race conditions and repeated pending entries for same email.
- Alternatives considered:
  - Check active users only: rejected because it allows duplicate pending flows.

## Decision 7: Expired token recovery

- Decision: Provide resend-confirmation endpoint to issue new token if current
  token is expired or missing; old tokens are invalidated.
- Rationale: Supports expired-link scenario in acceptance criteria.
- Alternatives considered:
  - Require full re-registration on expiration: rejected as avoidable friction.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
