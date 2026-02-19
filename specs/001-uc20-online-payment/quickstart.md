# Quickstart - UC-20 Online Payment

## Goal
Enable authenticated attendees to pay registration fees online through a gateway and confirm registration only after verified and persisted payment success.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-20.md`, `UC-20-AT.md`

## Implementation Steps
1. Gate payment initiation to authenticated attendees with selected registration category.
2. Display selected category and total fee before redirecting to payment gateway.
3. Redirect attendee to configured gateway for payment processing.
4. Process gateway callbacks/returns and verify confirmation authenticity.
5. On verified success, attempt to persist payment record in database.
6. Update registration status to Paid/Confirmed only after successful payment record save.
7. Show payment confirmation and trigger receipt/notification after successful confirmation.
8. Handle gateway cancel by returning to CMS with no payment record and unpaid status.
9. Handle invalid details and provider decline with unpaid status and clear feedback.
10. Handle missing/timeout confirmation with pending/failed unresolved messaging and no confirmed status.
11. On database save failure after gateway success, show unresolved error, keep unconfirmed status, and create reconciliation item.
12. Prevent duplicate successful confirmation after registration already paid.
13. Ensure paid/confirmed status persists across refresh and re-login.

## Validation Scenarios
- Valid payment succeeds, payment recorded, status becomes Paid/Confirmed.
- Successful confirmation displays receipt/notification path.
- Cancel at gateway leaves registration unpaid with clear message.
- Invalid payment details leave registration unpaid with rejection feedback.
- Provider decline leaves registration unpaid with decline feedback.
- Timeout/missing confirmation shows unresolved state and no confirmed status.
- Gateway success + DB save failure creates reconciliation item and does not confirm registration.
- Duplicate attempt after successful payment does not create incorrect additional confirmation.
- Refresh/re-login preserves Paid/Confirmed state after successful completion.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for success, cancel/decline/invalid, timeout, save-failure reconciliation, and status persistence flows.
