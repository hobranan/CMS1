# Registration Replan Requirements Quality Checklist: Register new user account

**Purpose**: Validate revised UC-01 requirements quality after clarifying one-week registration-attempt expiry and pre-verification login handling.
**Created**: 2026-02-10
**Feature**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/spec.md`

## Requirement Completeness

- [ ] CHK001 Are required registration fields beyond email/password explicitly enumerated or intentionally bounded? [Completeness, Spec §FR-003]
- [ ] CHK002 Are both expiry windows fully specified as distinct rules (24h token, 7-day registration attempt)? [Completeness, Spec §FR-010, Spec §FR-014]
- [ ] CHK003 Is the one-week registration-attempt expiry requirement explained with trigger point and resulting user action? [Completeness, Spec §Session 2026-02-10, Spec §FR-014]
- [ ] CHK004 Are pre-verification login outcomes fully specified, including denial reason, reminder content, and resend option? [Completeness, Spec §FR-015, Spec §Acceptance Scenario 9]

## Requirement Clarity

- [ ] CHK005 Is "password security standards" defined by explicit policy reference or normative rule text? [Clarity, Spec §FR-006, Spec §Assumptions]
- [ ] CHK006 Is "actionable error message" constrained by minimum required content for user correction? [Clarity, Spec §FR-012]
- [ ] CHK007 Is account-creation timing unambiguous between validation success and verification completion? [Clarity, Spec §FR-007, Spec §FR-009, Spec §FR-011]
- [ ] CHK008 Is "older than 24 hours" tied to a deterministic timestamp source and timezone rule? [Clarity, Spec §FR-010]

## Requirement Consistency

- [ ] CHK009 Do acceptance scenarios and FR set align on resend behavior for both expired tokens and unverified-login flow? [Consistency, Spec §Acceptance Scenarios 8-9, Spec §FR-015, Spec §Assumptions]
- [ ] CHK010 Do FR-014 and edge-case wording align on whether expiry is exactly 7 days or after 7 days? [Consistency, Spec §FR-014, Spec §Edge Cases]
- [ ] CHK011 Do failure-path statements remain consistent with pending-registration persistence semantics before activation? [Consistency, Spec §FR-007, Spec §FR-009, Spec §FR-014]

## Acceptance Criteria Quality

- [ ] CHK012 Are SC-001 through SC-004 measurable with explicit evidence source definitions? [Acceptance Criteria, Spec §SC-001, Spec §SC-002, Spec §SC-003, Spec §SC-004]
- [ ] CHK013 Is the "under 2 minutes" success criterion scoped to clear conditions and measurement methodology? [Measurability, Spec §SC-004]
- [ ] CHK014 Are success criteria aligned to the newly added pre-verification login behavior so coverage is complete? [Coverage, Gap]

## Scenario Coverage

- [ ] CHK015 Are alternate flows for invalid email, duplicate email, weak password, and missing fields mapped cleanly to FR IDs without overlap gaps? [Coverage, Spec §Acceptance Scenarios 3-7, Spec §FR-004, Spec §FR-005, Spec §FR-006, Spec §FR-012]
- [ ] CHK016 Are recovery requirements for expired-token resend bounded with retry/rate-limit expectations? [Coverage, Spec §Acceptance Scenario 8, Gap]
- [ ] CHK017 Is login-before-verification behavior clarified as a requirement quality item with explicit reminder and resend guidance? [Completeness, Spec §Session 2026-02-10, Spec §FR-015]
- [ ] CHK018 Are requirements for login attempts after 7-day registration-attempt expiry explicitly defined? [Coverage, Gap]

## Edge Case Coverage

- [ ] CHK019 Are combined-error precedence rules defined when multiple validation failures coexist? [Edge Case, Spec §Acceptance Scenario 7, Spec §FR-012]
- [ ] CHK020 Are replayed, tampered, or already-used confirmation-link requirements documented? [Edge Case, Gap]
- [ ] CHK021 Are concurrent same-email registration requirements defined to avoid ambiguous duplicate handling? [Edge Case, Gap]

## Non-Functional Requirements

- [ ] CHK022 Are token security requirements (entropy, storage, single-use) explicitly stated? [Non-Functional, Gap]
- [ ] CHK023 Are privacy requirements for logging/masking email and credential-related errors documented? [Non-Functional, Gap]
- [ ] CHK024 Are accessibility requirements for presenting validation and unverified-login reminders specified? [Non-Functional, Gap]

## Dependencies & Assumptions

- [ ] CHK025 Are external email-delivery dependency expectations documented for timeout/failure and resend reliability? [Dependency, Spec §FR-008, Spec §FR-015, Gap]
- [ ] CHK026 Is the default password-policy assumption governed with ownership and update trigger? [Assumption, Spec §Assumptions]
- [ ] CHK027 Are assumptions about uniqueness checks and pending-registration lifecycle traceable to an authoritative requirement owner? [Assumption, Spec §Assumptions, Spec §FR-005, Spec §FR-014]

## Ambiguities & Conflicts

- [ ] CHK028 Is "secure password" free of ambiguous interpretation after considering policy-default fallback? [Ambiguity, Spec §FR-006, Spec §Assumptions]
- [ ] CHK029 Is a stable requirement-to-acceptance-test mapping scheme defined for FR-001 through FR-015? [Traceability, Gap]
