# Implementation Plan: Enforce referee workload limits

**Branch**: `001-uc09-workload-limits` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/spec.md`
**Implementation Baseline**: `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-spec.md`

## Summary

Implement assignment-time workload enforcement using configurable maximum limits,
ensuring assignments are accepted only when current workload is below the active
limit and rejected safely on overload, retrieval failure, or storage failure.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), workload retrieval service, configuration service for limits, assignment persistence service  
**Storage**: Assignment database with referee workload counters and configurable workload-limit source  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for below-limit acceptance, at/over-limit rejection, config-change application, retrieval failure, and storage failure  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Workload validation decision within 300ms p95 per assignment attempt  
**Constraints**: MVC boundaries required; no frontend frameworks; configurable workload limit must apply at validation time; no invalid assignment persisted under any failure mode  
**Scale/Scope**: Supports high assignment throughput during referee allocation periods

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts keep workload and policy logic in models/services with controllers orchestrating requests.
 - [x] Proposed implementation stays within vanilla stack and preserves UC/AT traceability.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc09-workload-limits/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- workload-limits.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/research.md` with all
clarifications resolved (configurable limit retrieval, threshold semantics,
failure-safe rejection, and immediate policy-change application).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/contracts/workload-limits.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.

