# Phase 0 Research - UC-13 Anonymized Review View

## Decision 1: Completed review eligibility
- Decision: A review is considered eligible for editor view only when review status is `submitted` for the selected paper.
- Rationale: Matches FR-004, FR-005, and the completed-review assumption.
- Alternatives considered: Include `draft` with warning (rejected: violates completed-only rule), include broader terminal states (rejected: unspecified by UC-13).

## Decision 2: Anonymization boundary
- Decision: Backend returns an anonymized projection for editor endpoints and omits all identity-bearing fields from both list and detail payloads.
- Rationale: Enforces FR-008 and FR-009 consistently across UI states and blocks accidental frontend leakage.
- Alternatives considered: Frontend-only masking (rejected: higher exposure risk), role-based toggle showing identity (rejected: conflicts with clarified requirement).

## Decision 3: Authorization enforcement
- Decision: Authorization checks execute before list or detail data retrieval, and unauthorized access returns explicit authorization error responses.
- Rationale: Aligns with FR-001, FR-002, and FR-010 while preventing data exposure side effects.
- Alternatives considered: Retrieve then filter by authorization (rejected: unnecessary risk), silent redirect on unauthorized (rejected: weak operational feedback).

## Decision 4: Failure handling behavior
- Decision: List retrieval failure returns system error with no list data; per-review open failure preserves list access and allows return-to-list workflow.
- Rationale: Directly satisfies FR-011, FR-012, and FR-013.
- Alternatives considered: Hard-stop page error for any item open failure (rejected: violates continued access requirement), partial stale data fallback for list retrieval failure (rejected: ambiguity and consistency risk).

## Decision 5: Refresh semantics
- Decision: Refresh triggers the same authorized completed-review list retrieval flow, preserving empty-state and error-state semantics.
- Rationale: Supports FR-014 and keeps behavior deterministic.
- Alternatives considered: Client-side cached replay only (rejected: can diverge from current backend state).
