# Implementation Plan: Edit conference schedule

**Branch**: `001-uc17-edit-schedule` | **Date**: 2026-02-10 | **Spec**: `specs/001-uc17-edit-schedule/spec.md`
**Input**: Feature specification from `/specs/001-uc17-edit-schedule/spec.md`

## Summary

Implement an authorized editor schedule-edit workflow for both draft and published schedules, with pre-save validation, conflict-safe save behavior, cancel-without-persist semantics, and reliable persistence across sessions. Published schedules remain published after valid edits, and every successful save updates and displays a last-edited timestamp.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+)  
**Primary Dependencies**: Browser APIs only (no framework libraries)  
**Storage**: Existing application database (persistent schedule/session/room records)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web browsers used by authenticated editors/administrators  
**Project Type**: Web application (`frontend/` + `backend/`)  
**Performance Goals**: Edit load, validation, and save operations complete within normal editorial workflow latency  
**Constraints**: MVC boundaries required; published schedules are editable by authorized roles; last-edited date/time must reflect latest successful save  
**Scale/Scope**: Editing and saving conference schedule updates with conflict validation and lock-policy enforcement

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
- [x] Architecture follows MVC with clear Model/View/Controller boundaries.
- [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc17-edit-schedule/
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

**Structure Decision**: Keep the existing backend/frontend MVC structure with backend validation and persistence services for edit saves, and frontend controller/view edit session management for save/cancel flows and timestamp rendering.

## Phase 0 Research Output

Resolved in `specs/001-uc17-edit-schedule/research.md` with decisions for published-edit behavior, lock-policy blocking, validation timing, conflict handling, concurrency safety, and last-edited timestamp updates.

## Phase 1 Design Output

- Data model: `specs/001-uc17-edit-schedule/data-model.md`
- Contracts: `specs/001-uc17-edit-schedule/contracts/edit-schedule.openapi.yaml`
- Quickstart: `specs/001-uc17-edit-schedule/quickstart.md`

## Post-Design Constitution Check

- [x] Use case and acceptance test references remain `UC-17.md` and `UC-17-AT.md`.
- [x] Design preserves MVC boundaries with controller-mediated model/view interactions.
- [x] No framework dependency introduced; design remains vanilla HTML/CSS/JavaScript.
- [x] UI guidance enforces `docs/standards/html-css-style-profile.md` compliance for affected views.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.
