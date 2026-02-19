# Data Model - UC-20 Online Payment

## Entity: RegistrationPaymentAttempt
- Fields:
  - `attempt_id` (string, immutable)
  - `attendee_id` (string, required)
  - `registration_id` (string, required)
  - `category_id` (string, required)
  - `amount` (number, required)
  - `currency` (string, required)
  - `status` (enum: `initiated`, `canceled`, `invalid_details`, `declined`, `pending_confirmation`, `confirmed`, `failed`)
  - `gateway_reference` (string, nullable)
  - `created_at` (datetime, required)
- Validation rules:
  - Attempt creation requires authenticated attendee and selected category.
  - Only one terminal `confirmed` attempt should map to a paid registration.

## Entity: GatewayConfirmationEvent
- Fields:
  - `event_id` (string, immutable)
  - `attempt_id` (string, required)
  - `gateway_status` (enum: `success`, `declined`, `canceled`, `invalid`, `timeout`)
  - `received_at` (datetime, required)
  - `payload_signature_valid` (boolean, required)
- Validation rules:
  - Success path requires valid signature/verification.
  - Unverified events cannot confirm registration.

## Entity: PaymentRecord
- Fields:
  - `payment_id` (string, immutable)
  - `attempt_id` (string, required)
  - `registration_id` (string, required)
  - `gateway_reference` (string, required)
  - `amount` (number, required)
  - `currency` (string, required)
  - `recorded_at` (datetime, required)
- Validation rules:
  - Created only for verified successful gateway confirmations.

## Entity: RegistrationStatus
- Fields:
  - `registration_id` (string, immutable)
  - `state` (enum: `unpaid`, `pending`, `paid_confirmed`)
  - `updated_at` (datetime, required)
- Validation rules:
  - Transition to `paid_confirmed` only after successful `PaymentRecord` persistence.
  - Canceled/declined/invalid attempts retain `unpaid`.

## Entity: ReconciliationItem
- Fields:
  - `reconciliation_id` (string, immutable)
  - `attempt_id` (string, required)
  - `reason` (enum: `gateway_success_persist_failed`, `confirmation_timeout`, `duplicate_attempt_after_success`)
  - `status` (enum: `open`, `resolved`)
  - `created_at` (datetime, required)
- Validation rules:
  - Must be created when gateway success cannot be recorded.
  - Open reconciliation blocks auto-confirmation.

## Relationships
- `RegistrationPaymentAttempt` 1-to-many `GatewayConfirmationEvent`.
- `RegistrationPaymentAttempt` 0-or-1 `PaymentRecord`.
- `RegistrationStatus` linked to registration and updated by payment outcome workflow.
- `ReconciliationItem` references problematic `RegistrationPaymentAttempt`.

## State Transitions
- `unpaid -> pending`
  - Trigger: initiation with unresolved/missing confirmation timeout path.
- `unpaid|pending -> paid_confirmed`
  - Preconditions: verified gateway success + payment record persisted.
- `unpaid -> unpaid`
  - Trigger: cancel/invalid-details/decline outcomes.
- `pending -> pending`
  - Trigger: unresolved confirmation, reconciliation in progress.
- `gateway success + db save failure`
  - Effects: registration not confirmed, reconciliation item created, error feedback returned.
