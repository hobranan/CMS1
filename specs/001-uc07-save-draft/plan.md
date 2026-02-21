# Implementation Plan: Save submission draft

**Branch**: `001-uc07-save-draft` | **Date**: 2026-02-19 | **Spec**: `specs/001-uc07-save-draft/spec.md`
**Input**: Feature specification from `/specs/001-uc07-save-draft/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement manual draft-save behavior for authenticated authors that persists editable field state only on explicit save actions, enforces save-level validation and no-change detection, preserves last successful draft on failure, and runs submit-triggered prevalidation save before final submission validation without autosave.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+)  
**Primary Dependencies**: Browser APIs only (no framework libraries)  
**Storage**: Existing application database (draft state, save attempt outcomes, validation metadata)  
**Testing**: `npm test && npm run lint`  
**Target Platform**: Web browsers for authors and backend draft persistence endpoints  
**Project Type**: Web application (`frontend/` + `backend/`)  
**Performance Goals**: Manual save and retrieval feedback within normal form-workflow expectations  
**Constraints**: MVC boundaries required; no autosave; failed save attempts must not overwrite last successful draft; submit must perform save-equivalent persistence before final validation  
**Scale/Scope**: Draft save/retrieve/finalize-prevalidation behavior for non-finalized submissions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
- [x] Architecture follows MVC with clear Model/View/Controller boundaries.
- [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc07-save-draft/
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

**Structure Decision**: Use existing backend/frontend MVC layout with backend draft orchestration and frontend controller/view save UX; maintain strict controller-mediated model/view interaction.

## Phase 0 Research Output

Resolved in `specs/001-uc07-save-draft/research.md` with decisions for manual-save-only policy, save-level validation boundaries, no-change detection, failure-state handling, and submit-triggered prevalidation save sequence.

## Phase 1 Design Output

- Data model: `specs/001-uc07-save-draft/data-model.md`
- Contracts: `specs/001-uc07-save-draft/contracts/save-draft.openapi.yaml`
- Quickstart: `specs/001-uc07-save-draft/quickstart.md`

## Post-Design Constitution Check

- [x] Use case references remain aligned to `UC-07.md` and `UC-07-AT.md`.
- [x] Design preserves MVC boundaries with controllers mediating model and view updates.
- [x] No framework dependency introduced; design remains vanilla HTML/CSS/JavaScript.
- [x] UI guidance enforces `docs/standards/html-css-style-profile.md` compliance for affected views.

## Complexity Tracking

No constitution violations identified; complexity tracking not required.

