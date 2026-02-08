# Feature Specification: Issue registration ticket confirmation

**Feature Branch**: `001-uc21-registration-ticket`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-21.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-21-AT.md contains the acceptance tests for the UC-21.md file, you can additionally use this in helping to determine those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-21.md has Open Issues where I want you to set it up where tickets are confirmations of attendance with a QR, all stored in a PDF that can be viewing on the"
**Use Case Sources**: `UC-21.md`, `UC-21-AT.md`

## Clarifications

### Session 2026-02-08

- Q: What should the ticket represent? -> A: The ticket is a confirmation of conference attendance after successful payment.
- Q: Should the ticket include a QR code? -> A: Yes, each issued ticket includes a QR code.
- Q: In what format should tickets be stored and viewed? -> A: Tickets are stored as PDF and are viewable from the attendee's CMS account area.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receive ticket after confirmed payment (Priority: P1)

An attendee receives a registration confirmation ticket after successful payment so they have proof of attendance eligibility.

**Why this priority**: Ticket issuance after payment confirmation is the central outcome of this use case.

**Independent Test**: Can be tested by completing successful payment and verifying ticket display, notification, and saved retrieval record.

**Acceptance Scenarios**:

1. **Given** attendee payment is confirmed and recorded, **When** post-payment processing completes, **Then** system updates registration status to Paid/Confirmed and issues a ticket confirmation.
2. **Given** ticket is issued, **When** attendee views confirmation page, **Then** system displays ticket details including reference and QR code.

---

### User Story 2 - Retrieve and use stored PDF ticket later (Priority: P2)

An attendee can access the issued ticket later from their account as a PDF for attendance proof.

**Why this priority**: Post-payment retrieval is necessary if attendees leave the page or miss delivery notifications.

**Independent Test**: Can be tested by issuing a ticket, logging out/in, and reopening ticket from account area.

**Acceptance Scenarios**:

1. **Given** a ticket was issued, **When** attendee opens account registration/ticket area, **Then** system provides the stored ticket as a PDF.
2. **Given** attendee navigates away before viewing initial confirmation, **When** attendee returns to account area, **Then** ticket is still available as PDF.

---

### User Story 3 - Handle pending, delivery, generation, and storage failures (Priority: P3)

The system prevents premature ticket issuance and provides recovery paths when ticket delivery/generation/storage fails.

**Why this priority**: Reliability and clear fallback behavior are required for payment-to-ticket trust.

**Independent Test**: Can be tested by simulating pending confirmations, notification failures, ticket generation errors, and storage errors.

**Acceptance Scenarios**:

1. **Given** payment confirmation is pending, **When** attendee checks status, **Then** system shows pending message and does not issue ticket yet.
2. **Given** notification delivery fails after ticket issuance, **When** attendee checks account area, **Then** ticket remains retrievable in CMS and attendee is informed of delivery failure.
3. **Given** ticket generation fails, **When** post-payment processing runs, **Then** system shows error and does not issue ticket.
4. **Given** ticket storage fails, **When** issuance processing runs, **Then** system warns that ticket retrieval may fail and provides guidance to retry/support.

---

### Edge Cases

- Payment confirmation arrives after temporary pending state.
- Ticket generated successfully but notification channel unavailable.
- Attendee opens ticket from account on a new session/device.
- Database save fails after ticket generation completes.
- Duplicate ticket access requests for same registration in short period.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST issue registration ticket confirmations only after payment is confirmed and recorded.
- **FR-002**: System MUST update attendee registration status to Paid/Confirmed before or during successful ticket issuance completion.
- **FR-003**: System MUST generate ticket content that serves as proof of conference attendance confirmation.
- **FR-004**: System MUST include a unique ticket reference identifier in each issued ticket.
- **FR-005**: System MUST include a QR code in each issued ticket.
- **FR-006**: System MUST store issued tickets in PDF format.
- **FR-007**: System MUST display ticket confirmation on-screen after successful issuance.
- **FR-008**: System MUST deliver ticket confirmation through configured notification channels when available.
- **FR-009**: System MUST store ticket records so attendees can retrieve tickets later from their account area.
- **FR-010**: System MUST make stored ticket PDFs viewable from attendee CMS account area.
- **FR-011**: System MUST not issue a ticket while payment confirmation remains pending.
- **FR-012**: System MUST notify attendees when ticket delivery fails while preserving in-CMS retrieval when ticket exists.
- **FR-013**: System MUST show an error and avoid issuance when ticket generation fails.
- **FR-014**: System MUST show an error status when ticket record storage fails and indicate retrieval may be unavailable until resolved.
- **FR-015**: System MUST preserve issued ticket availability when attendee leaves confirmation page before viewing.

### Assumptions

- One payment confirmation corresponds to one active registration ticket confirmation.
- QR content format and scanning workflow are defined elsewhere.
- Re-issue and duplicate-ticket policy is outside this use case unless separately defined.

### Key Entities *(include if feature involves data)*

- **Registration Ticket**: Attendance confirmation artifact issued after confirmed payment.
- **Ticket PDF Record**: Persisted PDF document representing the issued ticket.
- **Ticket QR Code**: Encoded token embedded in ticket for verification workflows.
- **Payment Confirmation State**: Payment outcome state controlling ticket issuance eligibility.
- **Ticket Delivery Outcome**: Notification delivery status independent from ticket storage status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of confirmed and recorded payments result in ticket issuance with reference ID and QR code.
- **SC-002**: 100% of issued tickets are stored as PDF and retrievable from attendee account area.
- **SC-003**: 100% of pending payment confirmations do not result in ticket issuance.
- **SC-004**: 100% of notification-delivery failures preserve ticket retrieval in CMS when ticket issuance succeeded.
- **SC-005**: 100% of ticket generation/storage failures return explicit error status and prevent false claim of successful retrievable issuance.
