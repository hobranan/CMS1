# Data Model - UC-21 Registration Ticket

## Entity: PaymentConfirmationState
- Fields:
  - `registration_id` (string, required)
  - `payment_state` (enum: `pending`, `confirmed_recorded`, `failed`)
  - `updated_at` (datetime, required)
- Validation rules:
  - Ticket issuance permitted only when `payment_state = confirmed_recorded`.

## Entity: RegistrationTicket
- Fields:
  - `ticket_id` (string, immutable)
  - `registration_id` (string, required)
  - `attendee_id` (string, required)
  - `ticket_reference` (string, unique, required)
  - `qr_payload` (string, required)
  - `issued_at` (datetime, required)
  - `issuance_status` (enum: `issued`, `generation_failed`, `storage_failed`)
- Validation rules:
  - Exactly one active ticket per confirmed registration in this use case scope.
  - `ticket_reference` and `qr_payload` required for issued tickets.

## Entity: TicketPdfRecord
- Fields:
  - `pdf_record_id` (string, immutable)
  - `ticket_id` (string, required)
  - `storage_uri` (string, required)
  - `format` (enum: `pdf`)
  - `stored_at` (datetime, required)
  - `retrieval_available` (boolean, required)
- Validation rules:
  - Format must be PDF.
  - Retrieval availability true only after successful storage.

## Entity: TicketDeliveryOutcome
- Fields:
  - `ticket_id` (string, required)
  - `channel` (string, required)
  - `delivery_status` (enum: `sent`, `failed`, `not_attempted`)
  - `attempted_at` (datetime, nullable)
  - `failure_reason` (string, nullable)
- Validation rules:
  - Delivery failure must not invalidate existing successful ticket issuance/storage.

## Entity: TicketRetrievalAccess
- Fields:
  - `ticket_id` (string, required)
  - `attendee_id` (string, required)
  - `request_source` (enum: `confirmation_view`, `account_area`)
  - `outcome` (enum: `success`, `pending_no_ticket`, `not_found`, `storage_unavailable`)
  - `occurred_at` (datetime, required)

## Relationships
- `PaymentConfirmationState` gates `RegistrationTicket` issuance.
- `RegistrationTicket` 1-to-1 `TicketPdfRecord` for stored artifact.
- `RegistrationTicket` 1-to-many `TicketDeliveryOutcome` by channel attempts.
- `TicketRetrievalAccess` references existing `RegistrationTicket` and attendee ownership.

## State Transitions
- `pending -> confirmed_recorded`
  - Trigger: payment recorded successfully.
  - Effects: ticket issuance flow becomes eligible.
- `eligible -> issued`
  - Preconditions: ticket generation success and PDF storage success.
  - Effects: confirmation display + account retrieval enabled.
- `eligible -> generation_failed`
  - Effects: explicit error, no issued ticket record.
- `eligible -> storage_failed`
  - Effects: explicit error status, retrieval may be unavailable until resolved.
- `issued + delivery_failed`
  - Effects: ticket remains retrievable in CMS account area; attendee informed of delivery failure.
