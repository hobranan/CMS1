# Data Model - UC-15 Decision Notification

## Entity: PaperDecisionView
- Fields:
  - `paper_id` (string, required)
  - `author_id` (string, required)
  - `decision_status` (enum: `accepted`, `rejected`, `under_review`)
  - `decision_comment` (string, nullable)
  - `decision_recorded_at` (datetime, nullable)
  - `retrieval_state` (enum: `success`, `error`)
- Validation rules:
  - Final decision details are exposed only when `decision_status` is `accepted` or `rejected`.
  - When retrieval fails, decision details are withheld.

## Entity: AuthorOwnershipAccess
- Fields:
  - `paper_id` (string, required)
  - `requesting_author_id` (string, required)
  - `is_owner` (boolean, required)
  - `checked_at` (datetime, required)
- Validation rules:
  - Access to decision view/notification requires `is_owner = true`.

## Entity: DecisionNotification
- Fields:
  - `notification_id` (string, immutable)
  - `paper_id` (string, required)
  - `author_id` (string, required)
  - `decision_status` (enum: `accepted`, `rejected`)
  - `summary_bullets` (array<string>, required)
  - `full_review_content` (object, nullable)
  - `full_review_available` (boolean, required)
  - `delivery_status` (enum: `pending`, `sent`, `failed`)
  - `generated_at` (datetime, required)
- Validation rules:
  - Summary bullets must appear before full review in rendered notification body.
  - Notification generation occurs only after final decision recording.

## Entity: NotificationBodySection
- Fields:
  - `notification_id` (string, required)
  - `section_type` (enum: `decision_header`, `summary_bullets`, `full_review`)
  - `display_order` (integer, required)
- Validation rules:
  - Required ordering: `decision_header` < `summary_bullets` < `full_review`.

## Entity: DecisionNotificationOutcome
- Fields:
  - `paper_id` (string, required)
  - `notification_id` (string, nullable)
  - `outcome` (enum: `generated`, `delivery_failed`, `under_review`, `unauthorized`, `retrieval_error`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `AuthorOwnershipAccess` governs visibility for `PaperDecisionView` and `DecisionNotification`.
- `PaperDecisionView` 1-to-many `DecisionNotification` events over time.
- `DecisionNotification` 1-to-many `NotificationBodySection` ordered sections.
- `DecisionNotificationOutcome` references paper/notification operation outcomes.

## State Transitions
- `under_review -> accepted|rejected`
  - Trigger: final decision recorded in editorial flow.
  - Effects: CMS view exposes final decision; notification generation initiated.
- `notification pending -> sent`
  - Effects: notification delivered, CMS visibility unchanged.
- `notification pending -> failed`
  - Effects: delivery failure recorded, CMS decision visibility remains available.
- `decision view request -> unauthorized`
  - Effects: block content and return authorization feedback.
- `decision view request -> retrieval_error`
  - Effects: return system error and withhold decision details.
