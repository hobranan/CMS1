# Acceptance Tests - UC-18 Public Schedule PDF

## AT-UC18-01 Public Published Access
- Unauthenticated user can load published schedule.

## AT-UC18-02 Unpublished Block
- Unpublished schedule returns 404.

## AT-UC18-03 Entry Detail
- Existing entry detail is returned.

## AT-UC18-04 Entry Not Found
- Missing entry returns 404.

## AT-UC18-05 PDF Inline
- Inline PDF request returns PDF with inline disposition.

## AT-UC18-06 PDF Attachment
- Attachment PDF request returns attachment disposition.

## AT-UC18-07 Schedule Retrieval Failure
- Retrieval failure returns 500 safe error.

## AT-UC18-08 PDF Retrieval Failure
- PDF retrieval failure returns 500 safe error.

## AT-UC18-09 Restricted Field Policy
- Restricted fields are hidden; allowed fields remain visible.

## AT-UC18-10 Detail Failure Isolation
- List can succeed while a detail request fails safely.

## AT-UC18-11 Direct Link Stability
- Repeated direct-link refresh remains stable.

## AT-UC18-12 PDF High-Volume Stability
- Repeated PDF requests remain stable.
