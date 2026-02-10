# Data Model - UC-10 Invitation Response

## Entity: ReviewInvitation
- Fields:
  - `invitation_id` (string, immutable)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `issued_at` (datetime, required)
  - `expires_at` (datetime, derived: `issued_at + 14 days`)
  - `status` (enum: `pending`, `accepted`, `rejected`, `expired`, `withdrawn`)
  - `responded_at` (datetime, nullable)
  - `responded_by` (string, nullable)
- Validation rules:
  - Only authenticated referee matching `referee_id` may respond.
  - Response allowed only when `status = pending` and `now < expires_at`.

## Entity: InvitationResponse
- Fields:
  - `response_id` (string, immutable)
  - `invitation_id` (string, required)
  - `decision` (enum: `accept`, `reject`)
  - `created_at` (datetime, required)
- Validation rules:
  - Exactly one effective response per invitation.
  - Decision must map to terminal invitation status (`accepted`/`rejected`).

## Entity: ReviewAssignmentActivation
- Fields:
  - `assignment_id` (string, immutable)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `active` (boolean)
  - `activated_at` (datetime, nullable)
- Validation rules:
  - `active = true` only for accepted invitation outcomes.
  - Rejected outcomes must keep assignment inactive.

## Entity: NotificationOutcome
- Fields:
  - `notification_id` (string)
  - `invitation_id` (string, required)
  - `channel` (enum: `email`, `in-app`)
  - `status` (enum: `sent`, `failed`)
  - `error_code` (string, nullable)
- Validation rules:
  - Notification failure must not mutate committed invitation response.

## Relationships
- `ReviewInvitation` 1-to-0..1 `InvitationResponse`
- `ReviewInvitation` 1-to-0..1 `ReviewAssignmentActivation`
- `ReviewInvitation` 1-to-many `NotificationOutcome`

## State Transitions
- `pending -> accepted`
  - Preconditions: actionable validation passes.
  - Effects: response recorded, assignment activated, notification attempted.
- `pending -> rejected`
  - Preconditions: actionable validation passes.
  - Effects: response recorded, assignment remains inactive, notification attempted.
- `pending -> expired`
  - Trigger: `now >= expires_at` at validation/read time.
  - Effects: response blocked; no new response record.
- `pending` remains `pending`
  - Trigger: user cancels before confirmation OR db write failure.
  - Effects: no mutation persisted.
