# Implementation Plan: Change account password

**Branch**: `001-uc04-password-change` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/spec.md`

## Summary

Implement authenticated password-change flow with strict policy enforcement
(12+ chars, composition rules, no spaces, not current password, no reuse of last
5), atomic credential update guarantees, and immediate session invalidation with
mandatory re-authentication after successful change.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), credential-store adapter, password hashing/comparison utilities, session management middleware  
**Storage**: Existing credential store with password-history records (last 5) and session store capable of invalidation  
**Testing**: `npm test && npm run lint`, plus integration/contract tests for validation failures, history-reuse checks, update atomicity, and post-change re-authentication  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Password-change endpoint responds within 500ms p95 excluding credential-store outage windows  
**Constraints**: MVC boundaries required; no frontend frameworks; password policy fixed by clarified rules; no partial credential update; current session invalidated immediately on success  
**Scale/Scope**: Supports at least 10k registered accounts with occasional password-change operations and concurrent active sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts preserve MVC boundaries (controllers orchestrate, models/services enforce rules).
 - [x] Proposed implementation remains framework-free and keeps UC/AT artifacts authoritative.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc04-password-change/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- password-change.openapi.yaml
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

**Structure Decision**: Web application structure is selected to match
repository layout and constitution MVC constraints.

## Phase 0 Research Output

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/research.md` with all
clarifications resolved (password policy, history checks, confirmation rules,
atomicity behavior, and session invalidation/re-authentication).

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/contracts/password-change.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
