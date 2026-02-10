# Phase 0 Research - UC-21 Registration Ticket

## Decision 1: Issuance eligibility boundary
- Decision: Ticket issuance occurs only after payment confirmation is both received and successfully recorded.
- Rationale: Enforces FR-001 and FR-011, preventing premature tickets from pending states.
- Alternatives considered: Issue ticket on gateway success before local record save (rejected: integrity risk), issue provisional ticket during pending state (rejected: contradicts requirement).

## Decision 2: Ticket artifact composition
- Decision: Each issued ticket includes unique reference identifier and embedded QR code, and final stored artifact is PDF.
- Rationale: Satisfies FR-004, FR-005, and FR-006.
- Alternatives considered: Non-PDF canonical storage (rejected: conflicts with clarification), QR optional by channel (rejected: requirement says each issued ticket includes QR).

## Decision 3: Retrieval-first reliability model
- Decision: CMS account-area retrieval of stored ticket PDF is primary durable access path; notification delivery is secondary and non-blocking once issuance/storage succeed.
- Rationale: Aligns with FR-009, FR-010, FR-012, and FR-015.
- Alternatives considered: Notification-only delivery (rejected: retrieval gap), block issuance success on notification failure (rejected: unnecessary coupling).

## Decision 4: Generation and storage failure handling
- Decision: Generation failure aborts issuance with explicit error; storage failure returns error status indicating retrieval unavailability risk and requires follow-up.
- Rationale: Meets FR-013 and FR-014 with clear trust boundaries.
- Alternatives considered: Report success despite storage failure (rejected: false claim risk), auto-retry silently without surfacing failure (rejected: unclear state for attendee/support).

## Decision 5: Duplicate/repeat access behavior
- Decision: Multiple retrieval requests for same issued ticket return the same stored PDF/ticket record without creating new ticket identifiers.
- Rationale: Supports one-ticket-per-confirmed-payment assumption and duplicate-access edge case.
- Alternatives considered: Re-generate ticket on every access (rejected: unstable references), create new ticket per session/device (rejected: duplicate policy conflict).
