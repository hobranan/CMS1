# Data Model - UC-14 Paper Decision

## Entity: PaperDecisionEligibility
- Fields:
  - `paper_id` (string, required)
  - `editor_id` (string, required)
  - `is_authenticated` (boolean, required)
  - `is_authorized` (boolean, required)
  - `has_completed_reviews` (boolean, required)
  - `already_decided` (boolean, required)
  - `decision_period_open` (boolean, required)
  - `override_without_reviews` (boolean, required)
  - `checked_at` (datetime, required)
- Validation rules:
  - Decision is allowed only when authenticated, authorized, not already decided, decision period open, and completed-review requirement satisfied unless override is enabled.

## Entity: DecisionRecord
- Fields:
  - `decision_id` (string, immutable)
  - `paper_id` (string, required)
  - `editor_id` (string, required)
  - `decision_value` (enum: `accepted`, `rejected`)
  - `decision_comment` (string, nullable)
  - `confirmed_at` (datetime, required)
- Validation rules:
  - `decision_value` must be one of Accept/Reject outcomes.
  - Record is created only after explicit confirmation.

## Entity: PaperStatusSnapshot
- Fields:
  - `paper_id` (string, immutable)
  - `status` (enum: `under_review`, `accepted`, `rejected`)
  - `updated_at` (datetime, required)
- Validation rules:
  - Status transitions to `accepted` or `rejected` only through valid confirmed decision flow.

## Entity: DecisionProcessingOutcome
- Fields:
  - `paper_id` (string, required)
  - `decision_id` (string, nullable)
  - `outcome` (enum: `success`, `ineligible`, `cancelled`, `save_failed`, `notification_failed`, `conflict`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Entity: NotificationDispatchResult
- Fields:
  - `decision_id` (string, required)
  - `recipient_group` (string, required)
  - `dispatch_status` (enum: `sent`, `failed`)
  - `failure_reason` (string, nullable)
  - `attempted_at` (datetime, required)

## Relationships
- `PaperDecisionEligibility` governs creation of `DecisionRecord`.
- `DecisionRecord` 1-to-1 transition effect on `PaperStatusSnapshot`.
- `DecisionRecord` 1-to-many `NotificationDispatchResult` (per author recipient group or channel).
- `DecisionProcessingOutcome` references decision flow result for paper-level action.

## State Transitions
- `under_review -> accepted|rejected`
  - Preconditions: explicit confirmation and eligibility true at confirm time.
  - Effects: atomic persist of `DecisionRecord` + `PaperStatusSnapshot` update.
- `under_review -> under_review` (cancelled/ineligible/save_failed)
  - Effects: no decision persisted, paper status unchanged.
- `accepted|rejected -> accepted|rejected` (concurrent late attempt)
  - Effects: conflict/ineligible outcome, no overwrite.
- `success with notification failure`
  - Effects: decision/status remain committed, notification-failure outcome returned.
