# Quickstart: UC-06 Upload manuscript file

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
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
