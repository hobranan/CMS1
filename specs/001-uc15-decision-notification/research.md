# Phase 0 Research - UC-15 Decision Notification

## Decision 1: Source of truth for decision visibility
- Decision: CMS decision view is authoritative for author-visible final decision status regardless of notification delivery outcome.
- Rationale: Required by FR-007 and FR-012, and supports failure-resilient author access.
- Alternatives considered: Notification inbox as primary source (rejected: delivery dependence), dual-source with eventual sync precedence (rejected: ambiguity risk).

## Decision 2: Notification content ordering
- Decision: Notification body composition enforces a fixed section order: decision status, summary bullet points, then full review content.
- Rationale: Matches clarification and FR-005/FR-006 exactly.
- Alternatives considered: Full review before summary (rejected: contradicts clarification), unordered template blocks (rejected: inconsistent user experience).

## Decision 3: Access control boundary
- Decision: Ownership authorization is validated before decision retrieval for CMS view and notification access endpoints.
- Rationale: Satisfies FR-009 and prevents unauthorized paper data exposure.
- Alternatives considered: Retrieve then filter response fields (rejected: unnecessary exposure risk), frontend-only ownership checks (rejected: insecure).

## Decision 4: Under-review behavior
- Decision: Papers without recorded final decision return explicit under-review state with no final decision details.
- Rationale: Aligns with FR-008 and SC-004.
- Alternatives considered: Generic "no data" response (rejected: weaker clarity), provisional decision placeholder (rejected: inaccurate state signaling).

## Decision 5: Retrieval and partial-content failures
- Decision: Decision retrieval failure returns explicit system error and withholds decision details; if summary exists but full review is temporarily unavailable, response includes summary with explicit full-review-unavailable marker.
- Rationale: Covers FR-010 and edge-case requirement while preserving clear feedback.
- Alternatives considered: Return partial decision details during retrieval failure (rejected: conflicts with FR-010), suppress summary when full review missing (rejected: unnecessary information loss).
