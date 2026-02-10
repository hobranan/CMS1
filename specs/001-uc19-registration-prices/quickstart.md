# Quickstart - UC-19 Registration Prices

## Goal
Provide public visibility of published registration prices with final CAD amounts and no discounts, including clear unavailable/incomplete/error states.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-19.md`, `UC-19-AT.md`

## Implementation Steps
1. Expose public Registration Prices endpoint/page without authentication requirement.
2. Retrieve current published pricing set and category amounts.
3. Enforce published-state gating before showing any pricing table content.
4. Render available categories with corresponding final prices.
5. Display all price amounts with explicit CAD labeling/formatting.
6. Do not apply or display discount calculations in any public pricing output.
7. If pricing unpublished, show clear not-available message and no pricing table.
8. If pricing incomplete, show available categories and indicate missing information.
9. If retrieval fails, show explicit system error and no pricing content.
10. Ensure guests and authenticated users see identical published pricing values.
11. Ensure published pricing remains consistent across refresh and return navigation.

## Validation Scenarios
- Guest user views published categories/prices successfully.
- All displayed amounts are in CAD (including 0- and 2-decimal values).
- No discount fields or computed discount totals appear.
- Unpublished pricing request returns not-available message and no table.
- Incomplete pricing data shows available categories plus missing-info indicators.
- Retrieval failure returns explicit error and no misleading pricing content.
- Guest and logged-in users see identical published prices.
- Refresh/revisit preserves same published values.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for public access, currency/no-discount enforcement, availability gating, incomplete data rendering, and failure handling.
