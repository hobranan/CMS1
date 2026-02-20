# Implementation Plan: Pay registration fee online

**Branch**: `001-uc20-online-payment` | **Date**: 2026-02-10 | **Spec**: `specs/001-uc20-online-payment/spec.md`
**Input**: Feature specification from `/specs/001-uc20-online-payment/spec.md`

## Summary

Implement an authenticated attendee payment workflow that initiates gateway checkout for a selected registration category, records confirmed payments, updates registration to Paid/Confirmed only after successful persistence, and handles cancellation/decline/timeout/save-failure states without false confirmations. The design prioritizes payment-state integrity, reconciliation on unresolved save failures, and persistence of confirmed status across sessions.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+)  
**Primary Dependencies**: Browser APIs only (no framework libraries)  
**Storage**: Existing application database (persistent payment records, registration status, reconciliation items)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web browsers for authenticated attendees and backend payment-gateway callback handling  
**Project Type**: Web application (`frontend/` + `backend/`)  
**Performance Goals**: Payment initiation p95 <= 500ms; confirmation/callback processing p95 <= 800ms
**Constraints**: MVC boundaries required; registration can become Paid/Confirmed only after successful payment recording; unresolved states must never auto-confirm  
**Scale/Scope**: Online registration fee payment lifecycle and registration-state synchronization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
- [x] Architecture follows MVC with clear Model/View/Controller boundaries.
- [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc20-online-payment/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- models/
|   |-- services/
|   `-- api/
`-- tests/

frontend/
|-- src/
|   |-- controllers/
|   |-- models/
|   |-- views/
|   `-- assets/
`-- tests/

tests/
|-- contract/
|-- integration/
`-- unit/
```

**Structure Decision**: Use existing backend/frontend MVC structure with backend payment orchestration and callback reconciliation logic, and frontend controller/view flows for initiation, confirmation feedback, and unresolved/failed states.

## Phase 0 Research Output

Resolved in `specs/001-uc20-online-payment/research.md` with decisions for initiation eligibility, gateway callback trust boundary, unresolved timeout handling, reconciliation strategy, and duplicate-attempt protection.

## Phase 1 Design Output

- Data model: `specs/001-uc20-online-payment/data-model.md`
- Contracts: `specs/001-uc20-online-payment/contracts/online-payment.openapi.yaml`
- Quickstart: `specs/001-uc20-online-payment/quickstart.md`

## Post-Design Constitution Check

- [x] Use case and acceptance test references remain `UC-20.md` and `UC-20-AT.md`.
- [x] Design preserves MVC boundaries with controller-mediated model/view interactions.
- [x] No framework dependency introduced; design remains vanilla HTML/CSS/JavaScript.
- [x] UI guidance enforces `docs/standards/html-css-style-profile.md` compliance for affected views.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.
