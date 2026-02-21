# Implementation Plan: Respond to review invitation

**Branch**: `001-uc10-invitation-response` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement referee invitation response handling so authenticated referees can accept or reject pending invitations, enforce a 14-day expiry window, block invalid states, and preserve consistency across database and notification failures.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), invitation query service, invitation response persistence service, assignment activation service, notification service  
**Storage**: Invitation/assignment database storing invitation status, response timestamp, expiry metadata, and assignment activation state  
**Testing**: `npm test && npm run lint`, plus contract/integration tests for accept, reject, expiry, invalid-state blocking, cancellation, db-failure, notification-failure  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Response validation and status decision within 300ms p95 per response attempt  
**Constraints**: MVC boundaries required; no frontend frameworks; invitation expires exactly 14 calendar days after issue time; no status mutation on validation/db failures  
**Scale/Scope**: Frequent invitation responses during review periods with concurrent multi-session referee activity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts place invitation and assignment state rules in backend models/services, with controllers orchestrating only.
 - [x] Design remains within vanilla stack and preserves UC/AT traceability.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc10-invitation-response/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- invitation-response.openapi.yaml
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

**Structure Decision**: Web application structure is selected to match repository layout and constitution MVC constraints.

## Phase 0 Research Output

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/research.md` with clarifications resolved for expiry boundary handling, actionable-state revalidation timing, cancellation semantics, and db/notification failure consistency.

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/contracts/invitation-response.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.

