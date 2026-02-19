# Implementation Plan: Register new user account

**Branch**: `001-uc01-requirements` | **Date**: 2026-02-10 | **Spec**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/spec.md`  
**Input**: Feature specification from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/spec.md`

## Summary

Deliver UC-01 registration with strict validation, duplicate-email prevention,
email verification required before account activation, and explicit handling for
pre-verification login attempts. Keep pending registrations valid for 7 days
from submission while verification links remain valid for 24 hours and are
resendable.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES2020+) for frontend controllers/views and backend JavaScript runtime  
**Primary Dependencies**: Browser APIs only on frontend (no framework libs), backend email service adapter, cryptographic hashing/token utilities  
**Storage**: Persistent relational-style user store (existing CMS database) with tables for users, pending registrations, and verification tokens  
**Testing**: `npm test && npm run lint`, plus contract/integration tests for registration, verification, resend, pending-expiry, and pre-verification login behavior  
**Target Platform**: Web application (modern desktop/mobile browsers + CMS backend server)  
**Project Type**: Web (separate `frontend/` and `backend/`)  
**Performance Goals**: Registration and verify endpoints respond within 500ms p95 excluding email delivery latency  
**Constraints**: MVC separation required; no frontend framework libraries; verification links expire exactly 24h after issuance; pending registrations expire 7 days after submission; no account creation on validation failure; login before verification must return reminder plus resend option  
**Scale/Scope**: Initial scope for single CMS deployment, supporting at least 10k registered accounts and concurrent public registrations

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Pre-Research Gate Status**: PASS
 - [x] Use cases and acceptance tests live in `UC-XX.md` and `UC-XX-AT.md`.
 - [x] Architecture follows MVC with clear Model/View/Controller boundaries.
 - [x] UI implementation uses only vanilla HTML, CSS, and JavaScript.

**Post-Design Gate Status**: PASS
 - [x] Data model and contracts preserve MVC boundaries (controllers call APIs, models store rules/data, views remain passive).
 - [x] Proposed implementation remains framework-free in frontend and keeps use case artifacts authoritative.
- [x] Frontend work includes compliance checks against `docs/standards/html-css-style-profile.md`.

## Project Structure

### Documentation (this feature)

```text
specs/001-uc01-requirements/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- registration.openapi.yaml
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

Research completed in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/research.md` with all
clarifications resolved, including one-week pending-registration expiry and
pre-verification login handling with resend option.

## Phase 1 Design Output

Generated:
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/data-model.md`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/contracts/registration.openapi.yaml`
- `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/quickstart.md`

## Complexity Tracking

No constitution violations or exceptions required.
