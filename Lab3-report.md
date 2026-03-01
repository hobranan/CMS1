# Laboratory 3 Report

## Project Context and Approach

This project was developed iteratively from the Spec-kit artifacts and UC/AT definitions.  
Implementation and testing proceeded use-case by use-case (UC-01 through UC-22), with frontend and backend updates performed alongside test generation and debugging.

The frontend app was updated to provide UC-based scenario execution (success and alternative/fail cases), and backend endpoints/services were expanded and validated through unit, integration, and system-style tests.

Coverage work focused on:

- `backend/src`
- `frontend/src/app`

Additional targeted branch tests and small testability refactors were applied where needed to reach full branch coverage.

## Procedures Followed to Execute Tests

### 1) Install dependencies

From project root:

```bash
npm install
```

### 2) Run all tests

```bash
npm test
```

This executes:

- `tests/**/*.js`
- `frontend/tests/**/*.js`

### 3) Run coverage (Istanbul-compatible via c8) from scratch

PowerShell in this environment may block `npx.ps1`, so coverage was run with direct Node invocation:

```bash
cmd /c if exist coverage rmdir /s /q coverage
cmd /c node node_modules\c8\bin\c8.js --all --include "backend/src/**/*.js" --include "frontend/src/app/**/*.js" --reporter=text --reporter=json-summary --reporter=lcov --reporter=html -- cmd /c npm test
```

Coverage artifacts are generated in:

- `coverage/coverage-summary.json`
- `coverage/lcov.info`
- `coverage/lcov-report/index.html`

## Procedure to Run the App

From project root:

```bash
npm install
npm start
```

Default server URL:

- `http://localhost:3000`

Main frontend app view:

- `http://localhost:3000/app/`

Optional custom port in PowerShell:

```powershell
$env:PORT=3100
npm start
```

## Status Report on Tests (After Debugging)

Latest full test run result:

- Tests: `393`
- Passed: `393`
- Failed: `0`

All automated tests currently pass.

## Coverage Report

Final total coverage (`coverage/coverage-summary.json`):

- Statements: `100%` (`9981/9981`)
- Branches: `100%` (`2786/2786`)
- Functions: `100%` (`663/663`)
- Lines: `100%` (`9981/9981`)

Notably, `backend/src/server.js` was specifically closed to full coverage and is now:

- Statements: `100%`
- Branches: `100%`
- Functions: `100%`
- Lines: `100%`

