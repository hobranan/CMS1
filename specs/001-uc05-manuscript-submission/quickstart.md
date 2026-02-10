# Quickstart: UC-05 Submit paper manuscript

## 1. Baseline checks

```bash
npm install
npm test && npm run lint
```

## 2. Successful submission

```bash
curl -X POST http://localhost:3000/api/v1/submissions \
  -H "Authorization: Bearer <author-token>" \
  -F "author_names=Alice Smith; Bob Lee" \
  -F "author_affiliations=University A; Institute B" \
  -F "author_contact_info=alice@example.com; bob@example.org" \
  -F "abstract_text=Paper abstract text" \
  -F "keywords=security,review,cms" \
  -F "main_reference_source=Primary Journal 2025" \
  -F "manuscript_file=@paper.pdf"
```

Expected:
- `201 Created`
- Submission finalized and redirect/home reference returned.

## 3. Validation failures

- Missing metadata field -> `400` with field-specific error.
- Invalid metadata value (e.g., malformed contact info) -> `400`.
- Missing file -> `400`.
- Unsupported file format -> `400`.
- File larger than 7 MB -> `400`.

## 4. Multiple simultaneous errors

1. Omit required metadata and upload unsupported file in one request.
2. Submit.

Expected:
- `400`
- Error output follows configured validation policy consistently.
- No finalized submission record created.

## 5. Upload interruption handling

1. Interrupt network during upload.
2. Call interruption endpoint:

```bash
curl -X POST http://localhost:3000/api/v1/submissions/upload-status \
  -H "Content-Type: application/json" \
  -d '{"submission_id":"<id>","status":"INTERRUPTED"}'
```

Expected:
- Interruption reported.
- Submission not finalized.
- User instructed to retry upload when connectivity returns.

## 6. Storage failure handling

1. Simulate storage/database failure with otherwise valid submission.
2. Submit request.

Expected:
- `503 Service Unavailable`
- Retry-later message.
- Paper not marked as entered into review workflow.

## 7. Submission list visibility

```bash
curl -X GET http://localhost:3000/api/v1/submissions/mine \
  -H "Authorization: Bearer <author-token>"
```

Expected:
- Newly finalized submission appears with metadata and manuscript reference.
