# Data Model: View public announcements

## Entity: PublicAnnouncement
- Description: Conference announcement record eligible for guest visibility.
- Fields:
  - `announcement_id` (string, required, unique): Stable identifier.
  - `title` (string, required): Announcement headline.
  - `content` (string, required): Full announcement body text.
  - `published_at` (datetime, required): Public publish timestamp used for ordering.
  - `is_public` (boolean, required): Visibility flag for guest access.
  - `availability_state` (enum, required): `available | unavailable`.
  - `created_at` (datetime, required): Audit creation timestamp.
  - `updated_at` (datetime, required): Audit last-update timestamp.

## Derived View Model: AnnouncementListItem
- Description: Lightweight list projection for announcements page.
- Fields:
  - `announcement_id`
  - `title`
  - `published_at`
  - `summary` (optional short preview)

## Relationships
- `PublicAnnouncement` -> `AnnouncementListItem` is one-to-one projection for list rendering.

## Validation Rules
- Only records with `is_public=true` and `availability_state=available` are list/detail eligible.
- List ordering: `published_at DESC`, then `announcement_id DESC`.
- Detail request for missing/non-public/non-available record returns unavailable outcome.

## State Transitions
- `available -> unavailable`: Announcement removed/withdrawn after list load; detail reads must fail gracefully.

## Query Expectations
- List endpoint returns zero or more `AnnouncementListItem`.
- Detail endpoint returns one `PublicAnnouncement` or unavailable/system-error result.
