# Phase 0 Research - UC-18 Public Schedule PDF

## Decision 1: Public access boundary
- Decision: Published final schedule endpoints are publicly accessible without authentication; unpublished schedules are never exposed as final public content.
- Rationale: Meets FR-001, FR-003, and FR-011.
- Alternatives considered: Require authentication for all schedule access (rejected: contradicts clarification), expose draft/pre-release versions publicly (rejected: violates final-only requirement).

## Decision 2: Canonical representation format
- Decision: PDF is the canonical format for both public schedule viewing and export.
- Rationale: Required by clarification and FR-006/FR-007.
- Alternatives considered: HTML primary with optional PDF export (rejected: does not meet explicit format direction), multiple export formats (rejected: out of scope).

## Decision 3: Session detail behavior with partial data
- Decision: Session detail responses include all available non-restricted fields and explicit unavailable markers for optional missing fields.
- Rationale: Aligns with FR-004 and FR-005, including incomplete-metadata edge cases.
- Alternatives considered: Hide entry entirely when optional fields missing (rejected: information loss), show blank without marker (rejected: ambiguous UX).

## Decision 4: Policy-restricted fields handling
- Decision: Apply field-level restriction rules at response shaping time so restricted fields are omitted while allowed fields remain visible.
- Rationale: Enforces FR-008 and SC-005 safely.
- Alternatives considered: Frontend-only hide logic (rejected: exposure risk), all-or-nothing detail block when any restriction applies (rejected: conflicts with non-restricted visibility requirement).

## Decision 5: Failure handling and availability stability
- Decision: Retrieval failures return explicit system error with no schedule content, while successful published schedule remains consistently retrievable across refresh/return visits.
- Rationale: Meets FR-009 and FR-010.
- Alternatives considered: Serve stale cached partial data on retrieval errors (rejected: possible inconsistency), silent retry without user feedback (rejected: weak transparency).
