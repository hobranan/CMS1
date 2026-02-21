# Implementation Plan: Submit paper manuscript

**Branch**: `001-uc05-manuscript-submission` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement manuscript submission for authenticated authors with required metadata,
file constraints (PDF/Word/LaTeX, max 7 MB), clear validation feedback, and
failure-safe behavior for upload interruptions and storage errors. Finalization
occurs only when metadata and manuscript reference are stored together.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), file upload handler, metadata validation service, storage adapter for submission and file reference persistence  
**Storage**: Existing submission database plus manuscript file storage with durable reference linking  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for metadata validation, file constraint enforcement, interruption handling, and non-finalization guarantees  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Submission validation response within 500ms p95 (excluding file transfer time) and deterministic finalization state after request completion  
**Constraints**: MVC boundaries required; no frontend frameworks; file size hard limit 7 MB; allowed formats limited to PDF/Word/LaTeX; interrupted uploads and storage failures must not finalize submissions  
**Scale/Scope**: Supports at least 10k authors with concurrent submission-window activity

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts keep rule enforcement in model/service layer and orchestration in controllers.
 - [x] Proposed approach remains vanilla-stack compliant and keeps UC/AT artifacts authoritative.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc05-manuscript-submission/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- manuscript-submission.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/research.md` with all
clarifications resolved (required metadata set, interruption handling,
validation policy, and finalization atomicity).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/contracts/manuscript-submission.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.

