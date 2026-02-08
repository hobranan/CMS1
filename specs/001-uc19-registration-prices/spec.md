# Feature Specification: View registration prices

**Feature Branch**: `001-uc19-registration-prices`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-19.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-19-AT.md contains the acceptance tests for the UC-19.md file, you can additionally use this in helping to determine those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-19.md has Open Issues where I want you to set it up where prices are public, and currency is Canadian, and there are no discounts."
**Use Case Sources**: `UC-19.md`, `UC-19-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Are registration prices public or restricted? -> A: Registration prices are publicly visible.
- Q: What currency should be used for registration prices? -> A: All prices are shown in Canadian dollars (CAD).
- Q: Are discounts supported? -> A: No discounts are applied; listed category prices are final.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicly view published registration prices (Priority: P1)

A guest or registered user views published conference registration categories and prices to decide whether to attend.

**Why this priority**: Public price visibility is the core value and first decision point for prospective attendees.

**Independent Test**: Can be tested by accessing Registration Prices as an unauthenticated visitor and verifying categories and amounts are displayed.

**Acceptance Scenarios**:

1. **Given** pricing is published, **When** any user opens Registration Prices, **Then** system displays available categories with corresponding final prices.
2. **Given** pricing is published, **When** prices are displayed, **Then** all amounts are shown in CAD.

---

### User Story 2 - Handle unavailable or incomplete pricing data (Priority: P2)

Users receive clear guidance when pricing is unavailable, incomplete, or temporarily inaccessible.

**Why this priority**: Clear fallback states prevent confusion and support user trust.

**Independent Test**: Can be tested by simulating unpublished prices, missing categories, and retrieval failures.

**Acceptance Scenarios**:

1. **Given** prices are not published, **When** user opens Registration Prices, **Then** system indicates pricing is not available yet and shows no pricing table.
2. **Given** one or more categories are missing, **When** user opens Registration Prices, **Then** system shows available categories and indicates some information is unavailable.
3. **Given** pricing retrieval fails, **When** user opens Registration Prices, **Then** system shows a system error and no pricing content.

---

### User Story 3 - Maintain consistent public pricing display (Priority: P3)

The published pricing view remains stable and consistent across refresh and navigation.

**Why this priority**: Consistent pricing presentation reduces ambiguity before registration.

**Independent Test**: Can be tested by viewing published prices, refreshing/navigating away, and verifying same values reappear.

**Acceptance Scenarios**:

1. **Given** published prices are visible, **When** user refreshes or revisits Registration Prices, **Then** the same category pricing remains visible and unchanged.
2. **Given** pricing is public, **When** guest and logged-in users view prices, **Then** both see the same published category prices.

---

### Edge Cases

- Pricing published with only a subset of expected categories.
- One category has amount but missing label/condition text.
- Retrieval succeeds after a temporary prior failure.
- User directly opens pricing URL without prior authentication.
- Price amounts include zero-decimal and two-decimal values in CAD display.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST make published registration prices publicly accessible without requiring login.
- **FR-002**: System MUST retrieve current published registration pricing categories and amounts.
- **FR-003**: System MUST display registration categories with corresponding final prices.
- **FR-004**: System MUST display all registration prices in Canadian dollars (CAD).
- **FR-005**: System MUST not apply or display discount calculations in this use case.
- **FR-006**: System MUST display a not-available message when registration prices are not yet published.
- **FR-007**: System MUST show available categories when pricing data is incomplete and indicate missing information.
- **FR-008**: System MUST display a system error message when pricing retrieval fails.
- **FR-009**: System MUST provide consistent pricing visibility across refresh and return navigation.
- **FR-010**: System MUST present the same published pricing to guests and authenticated users.

### Assumptions

- Pricing categories may include student, regular, or timing-based categories as configured.
- Published pricing is the authoritative source for displayed amounts.
- Currency conversion is out of scope; prices are authored and shown directly in CAD.

### Key Entities *(include if feature involves data)*

- **Registration Price Category**: Named fee tier with eligibility/condition label and final amount.
- **Published Pricing Set**: Publicly visible collection of current registration categories and prices.
- **Pricing Availability State**: Published/unpublished status controlling whether prices are shown.
- **Public Pricing View**: User-facing page rendering categories and CAD amounts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of published pricing requests return publicly visible category prices without authentication.
- **SC-002**: 100% of displayed price amounts are labeled and shown in CAD.
- **SC-003**: 100% of pricing displays use final category prices with no discounts applied.
- **SC-004**: 100% of unpublished pricing requests return clear not-available messaging and no pricing table.
- **SC-005**: 100% of retrieval failures return explicit system-error feedback without stale or partial misleading totals.
