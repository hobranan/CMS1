# Quickstart - UC-11 Assigned Paper Access

## Goal
Enable authenticated referees to view assigned papers, open manuscripts in view-only mode, and access pre-generated review forms with strict assignment authorization.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-11.md`, `UC-11-AT.md`

## Implementation Steps
1. Add assigned-paper list endpoint scoped to authenticated referee.
2. Implement assignment-ownership checks for paper detail, manuscript, and review-form access.
3. Enforce manuscript `view_only` access mode; do not expose download/export actions.
4. Retrieve pre-generated review form records only; do not generate forms in access flow.
5. Return explicit errors for:
   - unauthorized non-assigned access
   - manuscript unavailable
   - review form unavailable
   - assigned-list retrieval/system failures.
6. Update frontend controllers/views for no-assigned-papers message and resource-specific error feedback.
7. Ensure refresh revalidates assignment/resource state and preserves successful behavior.

## Validation Scenarios
- Assigned referee sees only own assigned papers.
- No assignments -> no-assigned-papers message.
- Non-assigned direct URL access -> authorization error, no data exposure.
- Manuscript available -> opens in view-only mode without download option.
- Manuscript missing -> manuscript-unavailable error.
- Review form available pre-generated -> opens successfully.
- Review form missing -> review-form-unavailable error.
- Assigned list retrieval failure -> system error with no list display.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for all scenarios above.
