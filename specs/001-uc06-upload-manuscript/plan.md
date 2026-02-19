# Implementation Plan: Upload manuscript file

**Branch**: `001-uc06-upload-manuscript` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/spec.md`

## Summary

Implement manuscript upload for authenticated authors with extension-only type
validation, strict 7 MB size enforcement, reliable attachment association, and
resumable retry for interrupted uploads within 30 minutes. Attachment state is
true only after both upload and submission association succeed.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), upload transfer handler, storage adapter, submission-association service, resumable-progress tracker  
**Storage**: File storage for uploaded objects, relational store for submission-file association and progress checkpoints  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for extension validation, size checks, interrupted resume policy, association failure, and persistent attachment visibility  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Validation response within 300ms p95 pre-upload; upload resume availability within 30-minute policy window  
**Constraints**: MVC boundaries required; no frontend frameworks; file type validation by extension only; max size 7 MB; same-file retry resumes within 30 minutes then restarts afterward; no false attached state on any failure  
**Scale/Scope**: Supports high submission-window concurrency with frequent manuscript uploads

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts keep rules in model/service layers and orchestration in controllers.
 - [x] Proposed implementation remains vanilla-stack compliant and traceable to UC/AT artifacts.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc06-upload-manuscript/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- upload-manuscript.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/research.md` with all
clarifications resolved (extension validation method, resumable policy window,
and attachment consistency guarantees).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/contracts/upload-manuscript.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
