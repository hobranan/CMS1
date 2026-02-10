# Data Model - UC-22 Public Announcements

## Entity: PublicAnnouncement
- Fields:
  - `announcement_id` (string, immutable)
  - `title` (string, required)
  - `summary` (string, nullable)
  - `content` (string, required)
  - `published_at` (datetime, required)
  - `is_public` (boolean, required)
  - `availability_state` (enum: `available`, `unavailable`)
- Validation rules:
  - Only `is_public = true` records are included in guest list retrieval.
  - Detail view allowed only when `availability_state = available`.

## Entity: AnnouncementListProjection
- Fields:
  - `items` (array<PublicAnnouncement>, required)
  - `ordering` (string, required, value: `published_at_desc_then_id_desc`)
  - `retrieved_at` (datetime, required)
- Validation rules:
  - Must be sorted newest-first by date with deterministic fallback for identical dates.

## Entity: AnnouncementDetailProjection
- Fields:
  - `announcement_id` (string, required)
  - `title` (string, required)
  - `content` (string, required)
  - `published_at` (datetime, required)
- Validation rules:
  - Returned only for currently available public announcements.

## Entity: AnnouncementAccessOutcome
- Fields:
  - `request_type` (enum: `list`, `detail`)
  - `announcement_id` (string, nullable)
  - `outcome` (enum: `success`, `no_data`, `retrieval_error`, `unavailable`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `AnnouncementListProjection` is derived from many `PublicAnnouncement` records.
- `AnnouncementDetailProjection` references one `PublicAnnouncement`.
- `AnnouncementAccessOutcome` records result of list/detail access events.

## State Transitions
- `list request -> success`
  - Preconditions: data source healthy, >=1 public announcements.
  - Effects: ordered list returned.
- `list request -> no_data`
  - Preconditions: no public announcements available.
  - Effects: explicit no-announcements message.
- `list/detail request -> retrieval_error`
  - Preconditions: storage/query failure.
  - Effects: explicit system error, no content payload.
- `detail request -> unavailable`
  - Preconditions: announcement removed/unpublished/unavailable after list load.
  - Effects: unavailable message and safe return path to list.
