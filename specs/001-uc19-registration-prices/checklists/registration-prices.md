# Registration Prices Requirements Quality Checklist: UC-19

**Purpose**: Validate completeness, clarity, consistency, and measurability of public registration-pricing requirements.
**Created**: 2026-02-10
**Feature**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/spec.md`

## Requirement Completeness

- [ ] CHK001 Are public-access requirements complete to ensure pricing is visible without authentication? [Completeness, Spec FR-001]
- [ ] CHK002 Are retrieval/display requirements complete for current published categories and final amounts? [Completeness, Spec FR-002, Spec FR-003]
- [ ] CHK003 Are currency requirements complete and explicit for CAD-only display across all categories? [Completeness, Spec FR-004]
- [ ] CHK004 Is no-discount behavior fully specified to prevent discount calculation/display in this use case? [Completeness, Spec FR-005]
- [ ] CHK005 Are unavailable/incomplete/failure state requirements complete for public pricing page behavior? [Completeness, Spec FR-006, Spec FR-007, Spec FR-008]

## Requirement Clarity

- [ ] CHK006 Is "published registration prices" clearly defined for effective-date/version selection when multiple sets exist? [Clarity, Ambiguity, Spec FR-002]
- [ ] CHK007 Is CAD presentation clarified for decimal formatting, rounding, and label placement conventions? [Clarity, Ambiguity, Spec FR-004, Spec Edge Cases]
- [ ] CHK008 Is "no discounts" clarified for hidden promotional fields and derived totals so ambiguity is eliminated? [Clarity, Ambiguity, Spec FR-005]
- [ ] CHK009 Is incomplete-data messaging clearly defined for missing categories vs missing category fields? [Clarity, Ambiguity, Spec FR-007]
- [ ] CHK010 Is retrieval-failure feedback requirement defined with minimum user-visible content expectations? [Clarity, Ambiguity, Spec FR-008]

## Requirement Consistency

- [ ] CHK011 Do public-visibility requirements remain consistent between guest and authenticated users seeing identical pricing? [Consistency, Spec FR-001, Spec FR-010]
- [ ] CHK012 Do CAD-only requirements remain consistent with assumption that conversion is out of scope? [Consistency, Spec FR-004, Spec Assumptions]
- [ ] CHK013 Do not-available and failure-handling requirements consistently prevent misleading pricing-table content? [Consistency, Spec FR-006, Spec FR-008]
- [ ] CHK014 Do consistency-across-refresh requirements align with authoritative published-pricing source assumptions? [Consistency, Spec FR-009, Spec Assumptions]

## Acceptance Criteria Quality

- [ ] CHK015 Are all success criteria traceable to functional requirements with no orphan outcomes? [Traceability, Spec SC-001, Spec SC-002, Spec SC-003, Spec SC-004, Spec SC-005]
- [ ] CHK016 Is CAD display measurability sufficient to verify both currency label and amount rendering for all categories? [Measurability, Spec SC-002]
- [ ] CHK017 Is no-discount measurability sufficient to verify final prices are shown without discount transforms? [Measurability, Spec SC-003]
- [ ] CHK018 Are failure outcomes measurable for explicit errors without stale or misleading totals? [Measurability, Spec SC-005]

## Scenario Coverage

- [ ] CHK019 Are primary public published-pricing and CAD-display flows covered with explicit requirement mapping? [Coverage, Spec User Story 1]
- [ ] CHK020 Are unpublished, incomplete-data, and retrieval-failure alternate paths covered with explicit outcomes? [Coverage, Spec User Story 2]
- [ ] CHK021 Are refresh/revisit consistency and guest-vs-logged-in parity scenarios covered with clear expectations? [Coverage, Spec User Story 3]
- [ ] CHK022 Are direct-url access and temporary-failure-then-success scenarios covered for recovery behavior? [Coverage, Spec Edge Cases]
- [ ] CHK023 Are partial-category-field scenarios covered (amount present but label/condition missing)? [Coverage, Spec Edge Cases]

## Edge Case Coverage

- [ ] CHK024 Is behavior defined when only subset of expected categories is published? [Edge Case, Spec Edge Cases]
- [ ] CHK025 Is behavior defined when a category has amount but missing label/condition text? [Edge Case, Spec Edge Cases]
- [ ] CHK026 Is behavior defined for mixed zero-decimal and two-decimal CAD values? [Edge Case, Spec Edge Cases]

## Non-Functional Requirements

- [ ] CHK027 Are performance expectations quantified for public pricing retrieval under typical and peak traffic? [Non-Functional, Gap]
- [ ] CHK028 Are reliability requirements defined for consistent published-price rendering across refresh/navigation? [Non-Functional, Spec FR-009]
- [ ] CHK029 Are security requirements defined to ensure only published pricing is exposed publicly? [Non-Functional, Spec FR-001, Spec FR-006]

## Dependencies & Assumptions

- [ ] CHK030 Are assumptions about category taxonomy, published-source authority, and no-conversion scope validated and bounded? [Assumption, Spec Assumptions]
- [ ] CHK031 Are dependencies for pricing publication state, category data quality, and retrieval service boundaries documented? [Dependency, Gap]

## Ambiguities & Conflicts

- [ ] CHK032 Is any conflict resolved between incomplete-data visibility and no-misleading-totals failure expectations? [Conflict, Spec FR-007, Spec SC-005]
- [ ] CHK033 Does the specification define FR-to-acceptance-test mapping to reduce interpretation drift during implementation/review? [Traceability, Gap]

## Notes

- Mark completed items with `[x]`.
- Record findings inline per item when gaps, ambiguities, or conflicts are discovered.
- Keep checks focused on requirements quality, not implementation behavior.

## Auto-Answer Log (UC01/UC02 defaults)

- Auto-answered similar checklist quality questions using the previously confirmed UC-01 and UC-02 decision set.
- Defaults include: deterministic validation behavior, explicit measurability, no-partial-update guarantees, recovery/resubmission clarity, accessibility/privacy coverage, traceability mapping, and explicit scope assumptions.
- Where checklist items offered equivalent alternatives, the same prior choices were reused (for example: all-errors mode, unauthorized handling excluded when outside scope, and last-write-wins for concurrent update conflicts).

