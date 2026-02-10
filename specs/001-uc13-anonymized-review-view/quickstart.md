# Quickstart - UC-13 Anonymized Review View

## Goal
Allow authorized editors to view only completed paper reviews and open full anonymized content without exposing referee identity.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-13.md`, `UC-13-AT.md`

## Implementation Steps
1. Add View Reviews action on paper details for authenticated authorized editors.
2. Implement completed-review list retrieval limited to `submitted` status only.
3. Exclude draft/incomplete reviews from editor list results.
4. Build backend anonymized review projection that strips all referee identity fields.
5. Implement review detail open flow returning full anonymized review content.
6. Add authorization guard for list and detail endpoints, returning explicit authorization errors on failure.
7. Implement no-completed-reviews empty-state response when submitted reviews do not exist.
8. Implement retrieval failure handling for list request with system-error response and no list payload.
9. Implement per-review open failure handling while preserving ability to return to and use list for other reviews.
10. Ensure refresh repeats authorized completed-review retrieval with same filtering and anonymization guarantees.

## Validation Scenarios
- Authorized editor opens View Reviews and receives only submitted reviews.
- Draft/pending reviews exist but are never included in completed list.
- Editor opens listed review and sees full content with no identity attributes.
- Paper with no completed reviews shows explicit empty-state messaging.
- Unauthorized access to list/detail is blocked with authorization feedback.
- List retrieval failure shows system error and suppresses list content.
- Single review open failure still allows access to remaining list entries.
- Refresh preserves authorization check and completed/anonymized behavior.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for authorization, anonymization, filtering, and failure handling paths.
