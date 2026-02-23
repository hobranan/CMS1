# CMS1 Implementation Spec

## Purpose
This document defines the concrete implementation baseline for CMS1 so coding
stays aligned with Speckit artifacts (`spec.md`, `plan.md`, `tasks.md`,
`analyze-report.md`) and the constitution.

## Inputs
- Use cases: `UC-01.md` ... `UC-22.md`
- Acceptance tests: `UC-01-AT.md` ... `UC-22-AT.md`
- Feature specs/plans/tasks: `specs/001-uc*/`
- Constitution: `.specify/memory/constitution.md`
- HTML/CSS style authority: `docs/standards/html-css-style-profile.md`

## Implementation Baseline
### Runtime Entry Points
- Backend entry: `backend/src/server.js`
- NPM scripts:
  - `npm start` -> runs backend + static frontend serving
  - `npm run dev` -> same with file watch
- Frontend runtime pages:
  - `/app/` -> UC dashboard (high-level interactive flow surface)

### Architecture Boundaries
- Backend
  - `backend/src/models` -> data/state + domain rules
  - `backend/src/services` -> business logic
  - `backend/src/api` -> controllers/routes/adapters
- Frontend
  - `frontend/src/models` -> UI state models
  - `frontend/src/views` -> HTML/CSS/vanilla view templates
  - `frontend/src/controllers` -> interaction orchestration
  - `frontend/src/app` -> implementation dashboard surface

## Execution Strategy
### Primary Product Build Target
Build a realistic user-facing CMS web UI that implements UC flows across
author/editor/referee/public roles, while keeping strict MVC and vanilla stack.

### Transitional Surfaces
- `/app/`: one-page UC coverage dashboard (keep for flow validation)

These are support tools, not the final user-facing CMS UI.

## UC Coverage Matrix (Primary Endpoint per UC)
- UC-01 -> `POST /api/v1/registrations`
- UC-02 -> validation behavior across multiple endpoints (cross-cutting)
- UC-03 -> `POST /api/v1/auth/login`
- UC-04 -> `PUT /api/v1/account/password`
- UC-05 -> `POST /api/v1/submissions`
- UC-06 -> `POST /api/v1/submissions/:submissionId/manuscript`
- UC-07 -> `POST /api/v1/drafts/:draftId/save`
- UC-08 -> `POST /api/v1/papers/:paperId/assignments`
- UC-09 -> `POST /api/v1/papers/:paperId/assign-referee`
- UC-10 -> `POST /api/v1/invitations/:invitationId/response`
- UC-11 -> `GET /api/v1/referees/:refereeId/assigned-papers`
- UC-12 -> `POST /api/v1/assignments/:assignmentId/reviews/submit`
- UC-13 -> `GET /api/v1/papers/:paperId/completed-reviews`
- UC-14 -> `POST /api/v1/papers/:paperId/decision`
- UC-15 -> `GET /api/v1/author/papers/:paperId/decision-notification`
- UC-16 -> `POST /api/v1/conferences/:conferenceId/schedule/generate`
- UC-17 -> `POST /api/v1/conferences/:conferenceId/schedule/save`
- UC-18 -> `GET /api/v1/public/conferences/:conferenceId/schedule.pdf`
- UC-19 -> `GET /api/v1/public/registration-prices`
- UC-20 -> `POST /api/v1/registrations/:registrationId/payment/initiate`
- UC-21 -> `POST /api/v1/registrations/:registrationId/ticket/issue`
- UC-22 -> `GET /api/v1/public/announcements`

## Dev Seeding Support
- Endpoint: `POST /api/v1/dev/seed-demo`
- Purpose: deterministic demo IDs + state for UC flow validation
- Note: for development/testing only, not production behavior

## Definition Of Done (Implementation Slice)
For each UC slice:
1. Runtime path exists in UI and backend.
2. Primary scenario passes.
3. Alternative scenario is handled with explicit response messaging.
4. Corresponding `UC-XX.md` and `UC-XX-AT.md` are updated when behavior changes.
5. Related `specs/001-ucXX-.../tasks.md` checkboxes reflect completed work.
6. Tests pass and coverage remains on target.

## Change Control
Any implementation-shaping change must update:
1. `docs/implementation/implementation-spec.md` (this file)
2. `docs/implementation/implementation-log.md` (entry with date and rationale)
