# Implementation Plan: Assign paper referees

**Branch**: `001-uc08-referee-assignment` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/spec.md`

## Summary

Implement editor-driven referee assignment for submitted papers with strict rule
validation (max three referees, eligibility, workload limits) and all-or-nothing
transaction behavior across persistence and invitation steps.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), referee-eligibility service, workload-check service, assignment transaction service, invitation/notification adapter  
**Storage**: Relational data store for paper/referee links and assignment transactions  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for validation failures, concurrency edge cases, and rollback semantics  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Assignment confirmation response within 500ms p95 excluding external notification latency  
**Constraints**: MVC boundaries required; no frontend frameworks; max three referees per assignment action; no partial assignment outcomes under any failure  
**Scale/Scope**: Supports conference review setup period with concurrent editor assignment operations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts keep rule evaluation in models/services and orchestration in controllers.
 - [x] Proposed implementation remains vanilla-stack compliant and traceable to UC/AT artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc08-referee-assignment/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- referee-assignment.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/research.md` with all
clarifications resolved (no partial assignment policy, workload checks,
invitation rollback behavior, and confirmation semantics).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/contracts/referee-assignment.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
