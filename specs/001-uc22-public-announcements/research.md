# Phase 0 Research: View public announcements

## Decision 1: Public announcements require no authentication
- Decision: Serve announcements page and announcement details to guests without login; filter data by `is_public=true`.
- Rationale: Directly satisfies UC-22 actor model and acceptance tests for guest visibility.
- Alternatives considered: Require login for all views (rejected: violates public-access requirement).

## Decision 2: Ordering policy for list view
- Decision: Default to reverse chronological ordering by publish date/time; if timestamps tie, break ties by stable announcement ID descending.
- Rationale: Matches acceptance assumptions and ensures deterministic rendering.
- Alternatives considered: Alphabetical ordering (rejected: does not reflect recency intent).

## Decision 3: Unavailable announcement handling
- Decision: If selected announcement is missing or no longer public, show an unavailable error and route user back to list view.
- Rationale: Aligns with UC-22 extension 4a recovery behavior.
- Alternatives considered: Keep user on broken detail page (rejected: poor recovery path).

## Decision 4: Retrieval failure behavior
- Decision: On list retrieval failure, show explicit system error and suppress partial list rendering.
- Rationale: Prevents misleading partial content and matches acceptance expectations.
- Alternatives considered: Show stale cached data without warning (rejected: inconsistent trust model).

## Decision 5: Data scope for details
- Decision: Expose only announcement fields intended for public display (title, body, publish time, optional category label if marked public metadata).
- Rationale: Reduces accidental disclosure and keeps guest experience clear.
- Alternatives considered: Return all record fields (rejected: may expose internal metadata).
