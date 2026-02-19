# Phase 0 Research - UC-11 Assigned Paper Access

## Decision 1: View-only manuscript enforcement
- Decision: Manuscript access is rendered in view-only mode and download/export endpoints are not exposed from this flow.
- Rationale: Satisfies clarified requirement and FR-005/FR-006 with least ambiguity.
- Alternatives considered: Allow download with watermark (rejected: conflicts with "view-only" clarification).

## Decision 2: Pre-generated review form dependency
- Decision: Referee access requires an existing review form record; the access flow never generates forms on demand.
- Rationale: Aligns with FR-009/FR-010 and avoids hidden side effects in access endpoints.
- Alternatives considered: Lazy form generation at first access (rejected: conflicts with clarification).

## Decision 3: Authorization revalidation
- Decision: Assignment ownership is validated on each list/detail/resource request, including direct URL access.
- Rationale: Covers extension 3a and prevents stale client-state bypasses.
- Alternatives considered: Session-cached authorization only (rejected: stale authorization risk).

## Decision 4: Failure handling semantics
- Decision: Retrieval failures return explicit, resource-specific errors (list/manuscript/form) without exposing non-assigned data.
- Rationale: Meets FR-011/FR-012/FR-013 and SC-005.
- Alternatives considered: Generic single error for all failures (rejected: poor recovery guidance).

## Decision 5: Refresh consistency
- Decision: Page refresh re-fetches assigned-paper list and resources using current authorization and availability state.
- Rationale: Satisfies FR-014 and prevents stale-link behavior.
- Alternatives considered: Client-only cached list reuse (rejected: inconsistent with current assignment state).

## Decision 6: Missing storage/form records
- Decision: Missing manuscript object or missing pre-generated form are handled as unavailable-resource errors, not authorization errors, when assignment ownership is valid.
- Rationale: Distinguishes security failures from availability failures for accurate user feedback.
- Alternatives considered: Treat all missing resources as unauthorized (rejected: misleading error semantics).
