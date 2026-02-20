# Quickstart - UC-21 Registration Ticket

## Goal
Issue attendee ticket confirmations with reference ID and QR code after confirmed payment, store tickets as PDFs, and support reliable account-area retrieval.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-21.md`, `UC-21-AT.md`

## Implementation Steps
1. Gate ticket issuance by confirmed and recorded payment state.
2. Update registration status to Paid/Confirmed during successful post-payment completion.
3. Generate ticket content as proof of attendance confirmation.
4. Embed unique ticket reference identifier and QR code in each ticket.
5. Render and store ticket artifact as PDF.
6. Persist ticket records for later retrieval from attendee account area.
7. Display on-screen ticket confirmation after successful issuance.
8. Attempt configured notification delivery after issuance when channels are available.
9. If payment remains pending, show pending state and do not issue ticket.
10. If delivery fails after successful issuance, show delivery-failure notice while keeping ticket retrievable in CMS.
11. If ticket generation fails, return error and avoid issuance.
12. If ticket storage fails, return error status indicating retrieval risk and provide follow-up guidance.
13. Ensure ticket remains available if attendee leaves confirmation page and returns later.
14. Return same stored PDF on repeated short-interval retrieval requests.

## Validation Scenarios
- Confirmed payment triggers ticket issuance with reference + QR.
- Issued ticket displays on confirmation page and is stored as PDF.
- Account-area retrieval works across logout/login and new sessions/devices.
- Pending payment state never produces ticket issuance.
- Delivery failure after issuance preserves CMS retrieval.
- Generation failure blocks issuance with explicit error.
- Storage failure shows error status and retrieval-unavailable warning.
- Repeated retrieval requests return same stored ticket artifact.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for issuance gating, PDF storage/retrieval, delivery failure fallback, and generation/storage failure behavior.
- Verify ticket pages against `docs/standards/html-css-style-profile.md`:
  - Labels are explicit and user-actionable.
  - Pending/failure guidance is direct and non-ambiguous.
  - Semantic HTML is used for headings and landmark sections.

## Implementation Notes (2026-02-20)
- Added ticket issue, metadata, and PDF retrieval API routes.
- Added strict payment-confirmed issuance gating using UC-20 payment state.
- Added ticket reference + QR generation and PDF storage/retrieval flow.
- Added fallback behavior for delivery failure, generation failure, and storage unavailability.
- Final verification command executed: `npm test && npm run lint`.
