# Quickstart: UC-06 Upload manuscript file

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
node --test --experimental-test-coverage tests/**/*.js frontend/tests/**/*.js
```

If PowerShell blocks `npm.ps1`, run:

```bash
node --test tests/**/*.js frontend/tests/**/*.js
node ./scripts/lint.mjs
```

## 2. Successful upload and attachment

```bash
curl -X POST http://localhost:3000/api/v1/submissions/<submission-id>/manuscript \
  -H "Authorization: Bearer <author-token>" \
  -F "file=@paper.final.v2.pdf"
```

Expected:
- `201 Created`
- File is attached to current submission draft.

## 3. Cancel selection behavior

1. Open file picker and cancel.
2. Confirm no upload request is sent.

Expected:
- Existing attachment state remains unchanged.

## 4. Validation failures

- Unsupported extension (e.g., `.txt`) -> `400` with allowed formats.
- File over 7 MB -> `400` with size-limit message.
- Missing file in request -> `400`.

## 5. Interrupted upload and retry within 30 minutes

1. Start upload and interrupt network.
2. Retry same file via retry endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/submissions/<submission-id>/manuscript/retry \
  -H "Content-Type: application/json" \
  -d '{"file_fingerprint":"<same-file-fingerprint>"}'
```

Expected:
- Retry response indicates `mode: RESUME`.
- Upload continues from last confirmed uploaded portion.

## 6. Retry after 30 minutes

1. Repeat retry request after resume window expires.

Expected:
- Retry response indicates `mode: RESTART`.
- Upload restarts from beginning.

## 7. Association/storage failure handling

1. Simulate storage failure or database association failure.
2. Submit upload request.

Expected:
- System reports error (`503` or `409` as applicable).
- File is not marked attached.

## 8. Attachment visibility persistence

1. Complete successful attachment.
2. Refresh page or navigate away/back to draft.

Expected:
- Attached file remains visible in submission draft.

## 9. HTML/CSS style-profile compliance

- Upload UI remains plain HTML + vanilla controller logic.
- Validation messaging remains deterministic and aligned with `docs/standards/html-css-style-profile.md`.

## 10. UC-06 execution summary and SC-004 evidence

- Contract tests:
  - `tests/contract/upload/post-manuscript-success.contract.test.js`
  - `tests/contract/upload/post-manuscript-unsupported-extension.contract.test.js`
  - `tests/contract/upload/post-manuscript-oversize.contract.test.js`
  - `tests/contract/upload/post-manuscript-retry-mode.contract.test.js`
- Integration tests:
  - `tests/integration/upload/successful-upload.integration.test.js`
  - `tests/integration/upload/attachment-visibility.integration.test.js`
  - `tests/integration/upload/cancel-selection.integration.test.js`
  - `tests/integration/upload/retry-resume-window.integration.test.js`
  - `tests/integration/upload/retry-restart-expired.integration.test.js`
  - `tests/integration/upload/failure-non-attachment.integration.test.js`
  - `tests/integration/upload/upload-validation-performance.integration.test.js`

SC-004 method:
- Use upload observability events in `backend/src/services/uploads/upload-observability-service.js`:
  - `upload_interrupted`
  - `upload_retry_mode_selected` with `mode=RESUME`
  - `upload_success`
- Measure interrupted uploads that later reach success via resume within 30 minutes.
