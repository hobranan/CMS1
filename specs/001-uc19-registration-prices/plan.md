# Implementation Plan: View registration prices

**Branch**: `001-uc19-registration-prices` | **Date**: 2026-02-10 | **Spec**: `specs/001-uc19-registration-prices/spec.md`
**Input**: Feature specification from `/specs/001-uc19-registration-prices/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement a public pricing view that exposes published registration categories and final amounts without authentication, consistently in CAD and without discount logic. The workflow handles unpublished, incomplete, and retrieval-failure states with explicit feedback while preserving stable published pricing display across refresh and return visits.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+)  
**Primary Dependencies**: Browser APIs only (no framework libraries)  
**Storage**: Existing application database (persistent published pricing categories and availability state)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Public web browsers (guest and authenticated users)  
**Project Type**: Web application (`frontend/` + `backend/`)  
**Performance Goals**: Public pricing retrieval/render p95 <= 300ms
**Constraints**: MVC boundaries required; prices are public; display currency is CAD only; no discount calculations  
**Scale/Scope**: Public registration pricing page and related availability/error handling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
- [x] Architecture follows MVC with clear Model/View/Controller boundaries.
- [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc19-registration-prices/
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

**Structure Decision**: Use existing backend/frontend MVC structure with backend pricing services enforcing published-only visibility and CAD/no-discount policy, and frontend controllers/views handling public rendering plus unavailable/incomplete/error states.

## Phase 0 Research Output

Resolved in `specs/001-uc19-registration-prices/research.md` with decisions for public access boundary, CAD formatting rules, no-discount enforcement, partial-data presentation, and failure handling.

## Phase 1 Design Output

- Data model: `specs/001-uc19-registration-prices/data-model.md`
- Contracts: `specs/001-uc19-registration-prices/contracts/registration-prices.openapi.yaml`
- Quickstart: `specs/001-uc19-registration-prices/quickstart.md`

## Post-Design Constitution Check

- [x] Use case and acceptance test references remain `UC-19.md` and `UC-19-AT.md`.
- [x] Design preserves MVC boundaries with controller-mediated model/view interactions.
- [x] No framework dependency introduced; design remains vanilla HTML/CSS/JavaScript.
- [x] UI guidance enforces `docs/standards/html-css-style-profile.md` compliance for affected views.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.

