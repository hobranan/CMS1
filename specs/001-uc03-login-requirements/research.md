# Phase 0 Research: UC-03 Authenticate registered users

## Decision 1: Username is the registered email address

- Decision: Treat login identifier as normalized registered email.
- Rationale: Directly resolves clarification and aligns registration/login identity model.
- Alternatives considered:
  - Separate username field: rejected because not present in UC clarifications.
  - Accept both username and email: rejected to avoid ambiguous lookup rules.

## Decision 2: Credential verification order

- Decision: Validate required fields first, then lockout status, then credential-store retrieval and password comparison.
- Rationale: Minimizes unnecessary store calls and enforces lockout deterministically.
- Alternatives considered:
  - Always query store first: rejected due to avoidable load and ambiguous lockout handling.

## Decision 3: Lockout enforcement policy

- Decision: Track consecutive failed attempts per account; on 5th failure lock account for 15 minutes; deny attempts during lockout.
- Rationale: Matches FR-015 to FR-017 and clarification constraints.
- Alternatives considered:
  - Progressive backoff: rejected because spec defines fixed lockout.
  - IP-based lockout only: rejected because requirement is per account.

## Decision 4: Failed-attempt counter reset behavior

- Decision: Reset counter after successful login or after lockout expiry.
- Rationale: Matches FR-018 and avoids permanent penalty accumulation.
- Alternatives considered:
  - Manual admin reset only: rejected because it conflicts with required automatic reset.

## Decision 5: Error-feedback strategy

- Decision: Use clear retry-oriented messages with stable response codes for missing fields, invalid credentials, lockout, and temporary system failure.
- Rationale: Aligns with FR-004, FR-010, FR-011, FR-012, FR-017 and acceptance scenarios.
- Alternatives considered:
  - Single generic failure message for all cases: rejected because it reduces recoverability.

## Decision 6: Credential-store outage handling

- Decision: Fail closed (no authentication), return system-problem response, keep user on login flow, permit retry later.
- Rationale: Prevents unsafe auth bypass and matches FR-012.
- Alternatives considered:
  - Cached offline auth fallback: rejected because not specified and may weaken security guarantees.

## Decision 7: Session continuity for protected pages

- Decision: Establish authenticated session on successful login and allow protected-page refresh during active session.
- Rationale: Matches FR-008, FR-014 and acceptance scenario 2.
- Alternatives considered:
  - Re-authenticate on every protected page load: rejected as inconsistent with session requirement.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
