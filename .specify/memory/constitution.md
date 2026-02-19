<!--
  Sync Impact Report
  - Version change: 1.0.0 -> 1.1.0
  - Modified principles: Added VI. HTML/CSS Style Authority
  - Added sections: None
  - Removed sections: None
  - Templates requiring updates:
    - .specify/templates/plan-template.md (constitution check should include style profile compliance)
    - .specify/templates/spec-template.md (requirements should reference style profile where UI is in scope)
    - .specify/templates/tasks-template.md (tasks should include style profile conformance checks for UI work)
  - Follow-up TODOs:
    - TODO(RATIFICATION_DATE): Original ratification date not found in repo history.
-->
# CMS1 Constitution

## Core Principles

### I. Use Case File Convention
All use cases MUST be documented in `UC-XX.md` files at the repository root. `XX`
MUST be a two-digit, zero-padded identifier (e.g., `UC-01.md`, `UC-12.md`) and
MUST be unique and sequential for the project.

### II. Acceptance Test File Convention
Each use case MUST have acceptance tests documented in a matching
`UC-XX-AT.md` file at the repository root. The `XX` MUST match the
corresponding use case identifier, and tests MUST trace to the scenarios in the
paired use case.

### III. MVC Architecture (NON-NEGOTIABLE)
The application MUST follow MVC architecture. Models encapsulate data and
domain rules, Views are vanilla HTML/CSS, and Controllers are vanilla JavaScript
that mediate user input and coordinate updates between Models and Views.
Cross-layer coupling (e.g., Views mutating Models directly) is prohibited.

### IV. Vanilla Web Stack Only
Implementation MUST use only vanilla HTML, CSS, and JavaScript. UI frameworks,
SPA routers, component libraries, and state management libraries are not
permitted unless the constitution is amended.

### V. Enforced Layer Boundaries
Source layout MUST preserve explicit Model, View, and Controller boundaries
(e.g., `src/models`, `src/views`, `src/controllers`). Controllers may import
Models and update Views; Models must not depend on Views.

### VI. HTML/CSS Style Authority
All HTML/CSS implementation MUST comply with
`docs/standards/html-css-style-profile.md`. This profile is the enforceable
project style authority and is derived from
`HTML CSS Style Guide original.md` for reference context only. If any guidance
conflicts, the profile document takes precedence for this repository.

## Documentation & Test Artifacts

- Use case and acceptance test files are the authoritative source for user
  journeys and system behavior.
- Any change to user-facing behavior MUST update the corresponding `UC-XX.md`
  and `UC-XX-AT.md` files in the same change set.

## Development Workflow

- Plans and specs MUST reference relevant `UC-XX.md` and `UC-XX-AT.md` files and
  keep them in sync with implementation decisions.
- Frontend-oriented plans, specs, tasks, and code reviews MUST include
  compliance checks against `docs/standards/html-css-style-profile.md`.
- Code reviews MUST include a constitution compliance check (file conventions,
  MVC boundaries, vanilla stack usage, and style-profile compliance).

## Governance

- This constitution supersedes all other project practices and templates.
- Amendments require documenting the change, rationale, and migration impact,
  plus a version bump following semantic versioning.
- Versioning policy: MAJOR for breaking governance changes, MINOR for new or
  expanded principles/sections, PATCH for clarifications or typo fixes.
- Compliance review is mandatory for plans, specs, tasks, and code reviews; any
  exception requires a formal amendment.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): original date not found | **Last Amended**: 2026-02-19
