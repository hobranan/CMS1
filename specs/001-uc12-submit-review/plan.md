# Implementation Plan: Submit completed review

**Branch**: `001-uc12-submit-review` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/spec.md`

## Summary

Implement referee review submission for active assignments with strict field validation, immutable submitted records, newer-version chaining, informational-only deadlines, and safe handling of cancel/database/notification failures.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), review validation service, review persistence service, assignment status service, editor notification service  
**Storage**: Review database with draft/submitted states and version-link metadata, assignment status records  
**Testing**: `npm test && npm run lint`, plus contract/integration tests for valid submit, invalid-field block, inactive-assignment block, immutable submitted records, newer-version linking, and failure paths  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Submission validation and persistence decision within 300ms p95 per submit attempt  
**Constraints**: MVC boundaries required; no frontend frameworks; displayed deadlines are informational only; submitted reviews are immutable; newer review submissions attach to latest submitted version  
**Scale/Scope**: Frequent review submissions during review windows, including sequential version updates for same assignment

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model/contracts keep validation, immutability, and version linkage in model/service layers, with controllers orchestrating requests.
 - [x] Design remains in vanilla stack and preserves UC/AT traceability.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc12-submit-review/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- submit-review.openapi.yaml
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

**Structure Decision**: Web application structure is selected to align with repository layout and constitution MVC constraints.

## Phase 0 Research Output

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/research.md` with clarified decisions for deadline non-enforcement, immutable submissions, newer-version chaining, and failure-handling consistency.

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/contracts/submit-review.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
