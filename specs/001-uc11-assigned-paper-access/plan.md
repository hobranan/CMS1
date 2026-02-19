# Implementation Plan: Access assigned papers and review forms

**Branch**: `001-uc11-assigned-paper-access` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/spec.md`

## Summary

Implement assignment-scoped referee access to assigned papers, manuscript view-only content, and pre-generated review forms, with strict authorization checks and explicit failure feedback for list/resource retrieval issues.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), assignment authorization service, manuscript retrieval service, review-form retrieval service, assigned-paper query service  
**Storage**: Assignment database, review-form records, and manuscript file storage objects  
**Testing**: `npm test && npm run lint`, plus contract/integration tests for assigned-list retrieval, unauthorized access blocking, manuscript unavailability, review-form unavailability, and refresh consistency  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Assigned-paper list and resource authorization checks within 300ms p95 per request  
**Constraints**: MVC boundaries required; no frontend frameworks; manuscript access is view-only with no download capability; review forms must be pre-generated before referee access  
**Scale/Scope**: Frequent referee access during review periods with direct URL attempts and concurrent sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model/contracts preserve model/service ownership of authorization and retrieval rules; controllers only orchestrate.
 - [x] Design stays in vanilla stack and retains UC/AT traceability.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc11-assigned-paper-access/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- assigned-paper-access.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/research.md` with clarified decisions for view-only manuscript enforcement, pre-generated form dependency handling, authorization revalidation, and failure-safe access behavior.

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/contracts/assigned-paper-access.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
