# Implementation Plan: Save submission draft

**Branch**: `001-uc07-save-draft` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/spec.md`

## Summary

Implement explicit manual draft save for authenticated authors, persisting only
user-initiated save actions, preserving last successful draft state across
sessions, and blocking final submission until full final-validation rules pass.
Submit action first persists unsaved edits with save semantics, then runs final
submission validation.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), draft persistence service, change-detection utility, submission eligibility validator  
**Storage**: Draft data store for editable fields with versioned last-successful-save state  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for save success, no-change behavior, save-level validation rejection, storage/network failures, submit-triggered pre-validation save, and cross-session retrieval  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Manual save responses within 400ms p95 for typical draft payloads; submit-triggered pre-validation save follows same latency budget  
**Constraints**: MVC boundaries required; no frontend frameworks; manual save only (no autosave); final submission blocked until full final validation; failed saves must not overwrite last successful draft  
**Scale/Scope**: Supports at least 10k authors with frequent iterative draft updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts keep domain/save rules in models/services and orchestration in controllers.
 - [x] Design remains vanilla-stack compliant and traceable to UC/AT artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc07-save-draft/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- save-draft.openapi.yaml
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

**Structure Decision**: Web application structure is selected to match repository
layout and constitution MVC constraints.

## Phase 0 Research Output

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/research.md` with all
clarifications resolved (manual-save-only behavior, save-level validation scope,
submit-triggered pre-validation save, and final-submission eligibility blocking).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/contracts/save-draft.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
