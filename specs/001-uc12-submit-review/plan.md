# Implementation Plan: Submit completed review

**Branch**: `001-uc12-submit-review` | **Date**: 2026-02-19 | **Spec**: `specs/001-uc12-submit-review/spec.md`
**Input**: Feature specification from `/specs/001-uc12-submit-review/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement referee review submission that validates active-assignment eligibility and required fields, stores immutable submitted reviews, supports newer linked review versions, preserves submission state through notification failures, and keeps deadline indicators informational only with no submission blocking logic.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+)  
**Primary Dependencies**: Browser APIs only (no framework libraries)  
**Storage**: Existing application database (review drafts, submitted immutable reviews, version-link relations, assignment status)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web browsers for referees/editors and backend review submission APIs  
**Project Type**: Web application (`frontend/` + `backend/`)  
**Performance Goals**: Submission and validation feedback within normal form-submission UX expectations  
**Constraints**: MVC boundaries required; submitted reviews are immutable; newer changes require a new linked submission; deadline display must not affect submission eligibility; db-save failures must not mark submitted  
**Scale/Scope**: Review submit lifecycle, immutability enforcement, and version-chain behavior for referee assignments

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
- [x] Architecture follows MVC with clear Model/View/Controller boundaries.
- [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc12-submit-review/
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

**Structure Decision**: Use existing backend/frontend MVC structure with backend submission orchestration, immutability/version services, and frontend controller/view feedback for submit outcomes and read-only states.

## Phase 0 Research Output

Resolved in `specs/001-uc12-submit-review/research.md` with decisions for assignment eligibility checks, informational deadline handling, immutable submission policy, newer-version linking, and notification/db failure behavior.

## Phase 1 Design Output

- Data model: `specs/001-uc12-submit-review/data-model.md`
- Contracts: `specs/001-uc12-submit-review/contracts/submit-review.openapi.yaml`
- Quickstart: `specs/001-uc12-submit-review/quickstart.md`

## Post-Design Constitution Check

- [x] Use case references remain aligned to `UC-12.md` and `UC-12-AT.md`.
- [x] Design preserves MVC boundaries with controller-mediated model/view updates.
- [x] No framework dependency introduced; design remains vanilla HTML/CSS/JavaScript.
- [x] UI guidance enforces `docs/standards/html-css-style-profile.md` compliance for review-related screens.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.

