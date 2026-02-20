# Registration Replan Requirements Quality Checklist: Register new user account

**Purpose**: Validate revised UC-01 requirements quality after clarifying one-week registration-attempt expiry and pre-verification login handling.
**Created**: 2026-02-10
**Feature**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/spec.md`

## Requirement Completeness

- [x] CHK001 Are required registration fields beyond email/password explicitly enumerated or intentionally bounded? [Completeness, Spec §FR-003]
- [x] CHK002 Are both expiry windows fully specified as distinct rules (24h token, 7-day registration attempt)? [Completeness, Spec §FR-010, Spec §FR-014]
- [x] CHK003 Is the one-week registration-attempt expiry requirement explained with trigger point and resulting user action? [Completeness, Spec §Session 2026-02-10, Spec §FR-014]
- [x] CHK004 Are pre-verification login outcomes fully specified, including denial reason, reminder content, and resend option? [Completeness, Spec §FR-015, Spec §Acceptance Scenario 9]

## Requirement Clarity

- [x] CHK005 Is "password security standards" defined by explicit policy reference or normative rule text? [Clarity, Spec §FR-006, Spec §Assumptions]
- [x] CHK006 Is "actionable error message" constrained by minimum required content for user correction? [Clarity, Spec §FR-012]
- [x] CHK007 Is account-creation timing unambiguous between validation success and verification completion? [Clarity, Spec §FR-007, Spec §FR-009, Spec §FR-011]
- [x] CHK008 Is "older than 24 hours" tied to a deterministic timestamp source and timezone rule? [Clarity, Spec §FR-010]

## Requirement Consistency

- [x] CHK009 Do acceptance scenarios and FR set align on resend behavior for both expired tokens and unverified-login flow? [Consistency, Spec §Acceptance Scenarios 8-9, Spec §FR-015, Spec §Assumptions]
- [x] CHK010 Do FR-014 and edge-case wording align on whether expiry is exactly 7 days or after 7 days? [Consistency, Spec §FR-014, Spec §Edge Cases]
- [x] CHK011 Do failure-path statements remain consistent with pending-registration persistence semantics before activation? [Consistency, Spec §FR-007, Spec §FR-009, Spec §FR-014]

## Acceptance Criteria Quality

- [x] CHK012 Are SC-001 through SC-004 measurable with explicit evidence source definitions? [Acceptance Criteria, Spec §SC-001, Spec §SC-002, Spec §SC-003, Spec §SC-004]
- [x] CHK013 Is the "under 2 minutes" success criterion scoped to clear conditions and measurement methodology? [Measurability, Spec §SC-004]
- [x] CHK014 Are success criteria aligned to the newly added pre-verification login behavior so coverage is complete? [Coverage, Gap]

## Scenario Coverage

- [x] CHK015 Are alternate flows for invalid email, duplicate email, weak password, and missing fields mapped cleanly to FR IDs without overlap gaps? [Coverage, Spec §Acceptance Scenarios 3-7, Spec §FR-004, Spec §FR-005, Spec §FR-006, Spec §FR-012]
- [x] CHK016 Are recovery requirements for expired-token resend bounded with retry/rate-limit expectations? [Coverage, Spec §Acceptance Scenario 8, Gap]
- [x] CHK017 Is login-before-verification behavior clarified as a requirement quality item with explicit reminder and resend guidance? [Completeness, Spec §Session 2026-02-10, Spec §FR-015]
- [x] CHK018 Are requirements for login attempts after 7-day registration-attempt expiry explicitly defined? [Coverage, Gap]

## Edge Case Coverage

- [x] CHK019 Are combined-error precedence rules defined when multiple validation failures coexist? [Edge Case, Spec §Acceptance Scenario 7, Spec §FR-012]
- [x] CHK020 Are replayed, tampered, or already-used confirmation-link requirements documented? [Edge Case, Gap]
- [x] CHK021 Are concurrent same-email registration requirements defined to avoid ambiguous duplicate handling? [Edge Case, Gap]

## Non-Functional Requirements

- [x] CHK022 Are token security requirements (entropy, storage, single-use) explicitly stated? [Non-Functional, Gap]
- [x] CHK023 Are privacy requirements for logging/masking email and credential-related errors documented? [Non-Functional, Gap]
- [x] CHK024 Are accessibility requirements for presenting validation and unverified-login reminders specified? [Non-Functional, Gap]

## Dependencies & Assumptions

- [x] CHK025 Are external email-delivery dependency expectations documented for timeout/failure and resend reliability? [Dependency, Spec §FR-008, Spec §FR-015, Gap]
- [x] CHK026 Is the default password-policy assumption governed with ownership and update trigger? [Assumption, Spec §Assumptions]
- [x] CHK027 Are assumptions about uniqueness checks and pending-registration lifecycle traceable to an authoritative requirement owner? [Assumption, Spec §Assumptions, Spec §FR-005, Spec §FR-014]

## Ambiguities & Conflicts

- [x] CHK028 Is "secure password" free of ambiguous interpretation after considering policy-default fallback? [Ambiguity, Spec §FR-006, Spec §Assumptions]
- [x] CHK029 Is a stable requirement-to-acceptance-test mapping scheme defined for FR-001 through FR-015? [Traceability, Gap]

## Decision Log

- CHK001: Add `confirm password` as required registration field.
- CHK002: Confirmed dual expiry windows: token `24h`, pending registration attempt `7d`.
- CHK003: 7-day timer starts at pending-registration creation; expired records require brand-new registration.
- CHK004: Pre-verification login denied with unverified reason + resend option (if within pending window).
- CHK005: Password rule: min 12 chars, upper/lower/number/symbol, no leading/trailing spaces, reject common/breached passwords when available.
- CHK006: Actionable errors must identify field + correction guidance without sensitive internals.
- CHK007: Create pending registration on submit; create/activate account only after successful verification.
- CHK008: Expiry calculation uses server UTC: expired when `now_utc >= issued_at_utc + 24h`.
- CHK009: Resend allowed for expired-token and unverified-login flows only within 7-day pending window.
- CHK010: 7-day expiry boundary standardized as `>= 7 days`.
- CHK011: Validation failures do not create/update pending record; verification failures never activate account.
- CHK012: SC evidence sources include contract/integration results, outcome-code logs, optional telemetry for timing.
- CHK013: “Under 2 minutes” measured from first submit to successful verification completion for successful users.
- CHK014: Add explicit SC for unverified login denial + reminder + resend option when eligible.
- CHK015: Add strict scenario-to-FR mapping table for scenarios 3-7.
- CHK016: Resend limits: max 3 per 24h rolling window, min 60s cooldown.
- CHK017: Require reminder reason + resend CTA + post-expiry guidance.
- CHK018: After 7-day expiry, login response should be “not registered/active” and direct user to new registration.
- CHK019: Return all field-level errors in stable order, with no side-effects.
- CHK020: Invalid/tampered/used token rejected; no activation; audit-log failures.
- CHK021: Enforce atomic uniqueness to prevent duplicate pending records for same email.
- CHK022: Tokens must be CSPRNG, stored hashed, and enforced single-use.
- CHK023: No raw passwords/tokens in logs; mask emails; keep error responses non-sensitive.
- CHK024: Accessibility minimums: aria-live announcements, field-error association, keyboard-only support.
- CHK025: Email dependency behavior includes timeout handling, retry guidance, and resend reliability logging.
- CHK026: Security owner governs policy changes; changes require spec + UC + AT updates in same change set.
- CHK027: Backend/domain owner is authoritative for uniqueness and pending lifecycle rules.
- CHK028: “Secure password” explicitly bound to CHK005 rule text.
- CHK029: Maintain FR-to-AT bidirectional mapping and authoritative crosswalk table in spec.
