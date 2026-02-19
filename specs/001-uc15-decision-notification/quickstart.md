# Quickstart - UC-15 Decision Notification

## Goal
Allow owning authors to see final paper decisions in CMS and receive structured decision notifications with summary bullets first, then full review content.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-15.md`, `UC-15-AT.md`

## Implementation Steps
1. Implement authored paper decision view endpoint guarded by ownership authorization.
2. Display final decision status (Accepted/Rejected) and decision comment when recorded.
3. Display under-review state when final decision is not yet available.
4. Trigger decision notification generation after final decision recording.
5. Compose notification content in strict order:
   - decision status header
   - summary bullet points
   - full review content section below summary.
6. Ensure CMS decision view remains authoritative and available even when notification delivery fails.
7. On unauthorized ownership access attempt, block decision details and return authorization feedback.
8. On retrieval failure, return system error and withhold decision details.
9. Support refresh/new-session persistence for decision visibility.
10. Handle temporary full-review-content unavailability by retaining summary section with explicit full-review-unavailable feedback.

## Validation Scenarios
- Owning author opens decided paper and sees Accepted/Rejected status with comment.
- Decision notification generated with summary bullets before full review section.
- Notification delivery failure still leaves final decision visible in CMS.
- Under-review paper shows no final decision and under-review message.
- Unauthorized author access blocked with authorization feedback.
- Retrieval failure returns system error and no decision details.
- Refresh/new session preserves visibility for recorded decisions.
- Summary available but full review unavailable -> summary remains visible with clear marker.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for ordering, authorization, under-review, persistence, and failure-handling paths.
