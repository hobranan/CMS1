# Phase 0 Research: UC-04 Change account password

## Decision 1: Enforce clarified password policy as normative requirements

- Decision: New password must be at least 12 chars, include uppercase,
  lowercase, number, special character, have no spaces, differ from current
  password, and not match last 5 passwords.
- Rationale: Directly satisfies clarified FR-006 expectations.
- Alternatives considered:
  - Weaker 8-char policy: rejected as below clarified standard.
  - Optional composition checks: rejected because policy is mandatory.

## Decision 2: Require current-password verification before update

- Decision: Validate required fields and current password prior to any write
  attempt.
- Rationale: Prevents unauthorized credential changes and aligns with FR-004.
- Alternatives considered:
  - Blind update with active session only: rejected due to weaker security.

## Decision 3: Password history check strategy

- Decision: Store salted hashes for last 5 passwords and compare candidate
  password against historical hashes with secure verify function.
- Rationale: Meets reuse-prevention requirement without storing plaintext.
- Alternatives considered:
  - Store plaintext history: rejected as insecure.
  - Store only current password: rejected because it cannot enforce last-5 rule.

## Decision 4: Atomic update and failure behavior

- Decision: Execute password update and history rotation in one transaction;
  rollback everything on failure.
- Rationale: Satisfies FR-014 and FR-015 no-partial-update requirements.
- Alternatives considered:
  - Separate writes without transaction: rejected due to partial-update risk.

## Decision 5: Validation error reporting

- Decision: Return field-specific error codes/messages for missing fields,
  incorrect current password, weak new password, and confirmation mismatch.
- Rationale: Aligns with FR-008 to FR-010 and acceptance scenarios.
- Alternatives considered:
  - Generic single failure message: rejected because user correction becomes harder.

## Decision 6: Session invalidation and re-authentication

- Decision: Invalidate active authenticated session immediately after successful
  password change and require a fresh login with new password.
- Rationale: Matches clarification and FR-016/FR-017.
- Alternatives considered:
  - Keep current session alive: rejected because clarified requirement forbids it.
  - Invalidate all sessions globally: optional enhancement; not required by scope.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
