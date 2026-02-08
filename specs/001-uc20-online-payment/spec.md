# Feature Specification: Pay registration fee online

**Feature Branch**: `001-uc20-online-payment`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-20.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-20-AT.md contains the acceptance tests for the UC-20.md file, you can additionally use this in helping to determine those requirements. Also, I need a new branch made for this use case."
**Use Case Sources**: `UC-20.md`, `UC-20-AT.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Complete online registration payment (Priority: P1)

An authenticated attendee pays their registration fee online so their conference registration is confirmed.

**Why this priority**: Payment confirmation is the core business outcome and gate for attendance eligibility.

**Independent Test**: Can be tested by paying with valid details through the payment gateway and verifying confirmed registration status plus receipt/confirmation.

**Acceptance Scenarios**:

1. **Given** an authenticated attendee with selected registration category and online payment enabled, **When** they complete valid payment at the gateway, **Then** payment is recorded and registration status updates to Paid/Confirmed.
2. **Given** a successful payment is recorded, **When** confirmation flow completes, **Then** attendee sees payment confirmation and receipt/notification is sent.

---

### User Story 2 - Handle user/payment declines and cancellations (Priority: P2)

An attendee receives clear outcomes when they cancel payment, enter invalid details, or the provider declines payment.

**Why this priority**: Failed payment paths must preserve correct unpaid status and provide actionable feedback.

**Independent Test**: Can be tested by canceling at gateway, submitting invalid details, and simulating provider decline.

**Acceptance Scenarios**:

1. **Given** attendee starts payment, **When** they cancel at gateway, **Then** no payment is recorded and registration remains unpaid.
2. **Given** attendee submits invalid payment details at gateway, **When** transaction is attempted, **Then** gateway rejects payment and registration remains unpaid.
3. **Given** valid details are submitted but provider declines, **When** response returns to CMS, **Then** attendee is informed of decline and registration remains unpaid.

---

### User Story 3 - Handle unresolved and system-failure states safely (Priority: P3)

The system handles payment confirmation timeouts and database save failures without incorrectly confirming registration.

**Why this priority**: Payment-state integrity is critical for reconciliation and user trust.

**Independent Test**: Can be tested by simulating missing gateway confirmation and database failure during payment recording.

**Acceptance Scenarios**:

1. **Given** gateway processing occurs but CMS confirmation is not received, **When** timeout/error state is reached, **Then** system shows pending/failed message and registration remains unpaid until resolved.
2. **Given** payment succeeds at gateway but database save fails, **When** CMS attempts recording, **Then** system shows error, does not confirm registration, and flags payment for reconciliation.
3. **Given** registration reaches Paid/Confirmed successfully, **When** attendee refreshes or logs in later, **Then** confirmed status remains visible and unchanged.

---

### Edge Cases

- Attendee attempts payment without selecting a registration category.
- Payment succeeds externally but callback confirmation is delayed.
- Duplicate payment attempt initiated after a successful payment.
- Gateway is temporarily unavailable before redirect completes.
- Receipt notification fails while payment and registration updates succeed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow online payment initiation only for authenticated attendees with a selected registration category.
- **FR-002**: System MUST display selected registration category and total fee before payment initiation.
- **FR-003**: System MUST redirect attendee to the configured payment gateway for online payment processing.
- **FR-004**: System MUST process successful gateway confirmations by recording payment in the database.
- **FR-005**: System MUST update attendee registration status to Paid/Confirmed only after successful payment recording.
- **FR-006**: System MUST display payment confirmation to attendee after successful recording and status update.
- **FR-007**: System MUST send receipt/confirmation notification after successful payment confirmation.
- **FR-008**: System MUST handle gateway cancellation by returning attendee to CMS without recording payment.
- **FR-009**: System MUST keep registration unpaid when gateway rejects invalid payment details.
- **FR-010**: System MUST keep registration unpaid when payment provider declines transaction.
- **FR-011**: System MUST handle missing/timeout payment confirmation by placing payment state in pending/failed messaging flow and preventing confirmed registration status until resolved.
- **FR-012**: System MUST show unresolved-payment error and require reconciliation when payment cannot be recorded due to database failure.
- **FR-013**: System MUST preserve paid/confirmed registration status across refresh and new sessions after successful completion.

### Assumptions

- Payment method options and refund handling are outside this use case.
- Duplicate/partial payment policy is outside this use case except preventing incorrect auto-confirmation.
- Notification delivery is secondary to payment/registration state integrity.

### Key Entities *(include if feature involves data)*

- **Registration Payment Attempt**: One attendee-initiated online transaction attempt with outcome status.
- **Payment Record**: Persisted proof of successful gateway-confirmed transaction.
- **Registration Status**: Enrollment state (unpaid, pending/unresolved, paid/confirmed).
- **Gateway Confirmation Event**: External payment success/failure/decline/cancel signal used for finalization.
- **Reconciliation Item**: Payment case requiring manual/system follow-up when recording fails after gateway success.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful gateway-confirmed payments are recorded and transition registration to Paid/Confirmed.
- **SC-002**: 100% of canceled, invalid-detail, or declined payment attempts leave registration unpaid.
- **SC-003**: 100% of confirmation timeouts are surfaced as pending/failed outcomes and do not produce false Paid/Confirmed status.
- **SC-004**: 100% of database save failures after gateway success are flagged for reconciliation and do not mark registration confirmed.
- **SC-005**: 100% of successfully confirmed registrations remain Paid/Confirmed across refresh and re-login.
