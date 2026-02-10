# Phase 0 Research - UC-19 Registration Prices

## Decision 1: Public visibility boundary
- Decision: Published registration prices are publicly accessible to guests and authenticated users without login requirements.
- Rationale: Matches clarification and FR-001/FR-010.
- Alternatives considered: Auth-required pricing access (rejected: conflicts with public visibility requirement), role-specific price views (rejected: not specified).

## Decision 2: Currency and formatting policy
- Decision: All displayed amounts are represented directly in CAD with consistent currency labeling, supporting zero-decimal and two-decimal values.
- Rationale: Satisfies FR-004 and related edge cases.
- Alternatives considered: Locale-dependent currency conversion (rejected: out of scope), multi-currency toggle (rejected: contradicts CAD-only clarification).

## Decision 3: No-discount rule enforcement
- Decision: Displayed category prices are final authored values with no discount computation or discount metadata rendering.
- Rationale: Enforces FR-005 and SC-003.
- Alternatives considered: Hidden discount pipeline with final total only (rejected: unnecessary complexity), optional promotional discounts (rejected: contradicts clarification).

## Decision 4: Incomplete data handling
- Decision: When pricing is published but incomplete, show available categories and explicit missing-information indicators for unavailable categories/fields.
- Rationale: Meets FR-007 while preserving usable public information.
- Alternatives considered: Hide entire pricing view on any incompleteness (rejected: over-blocking), silently omit missing data without notice (rejected: unclear UX).

## Decision 5: Availability and retrieval failure states
- Decision: Unpublished pricing returns clear not-available message without pricing table; retrieval failures return explicit system error with no misleading pricing content.
- Rationale: Aligns with FR-006 and FR-008.
- Alternatives considered: Return stale cached prices on retrieval failure (rejected: potential misinformation), generic empty state for all failures (rejected: weak diagnostics).
