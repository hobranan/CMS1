# Acceptance Tests - UC-17 Edit Conference Schedule

## AT-UC17-01 Load Editable Schedule
- Authorized user can load editable published schedule.

## AT-UC17-02 Save Valid Edit
- Valid edit saves successfully and increments schedule version.

## AT-UC17-03 Persist Across Session
- Saved edit remains visible across repeated loads.

## AT-UC17-04 Published Status Preserved
- Save on published schedule keeps status `published`.

## AT-UC17-05 Last-Edited Timestamp Update
- Successful save updates `lastEditedAt`; latest save shows latest timestamp.

## AT-UC17-06 Conflict Rejection
- Blocking conflict save returns 400 and keeps prior schedule unchanged.

## AT-UC17-07 Invalid Reference Rejection
- Invalid placement references return 400.

## AT-UC17-08 Policy Lock Block
- Locked schedule returns 423 with lock message.

## AT-UC17-09 DB Save Failure
- Save failure returns 500 and persists no partial edits.

## AT-UC17-10 Cancel Edit
- Cancel endpoint discards unsaved changes.

## AT-UC17-11 Concurrency Conflict
- Stale expectedVersion save returns 409.

## AT-UC17-12 Failure Payload Shape
- Stale/lock/conflict failures include stable `code` and `message`.

## AT-UC17-13 Performance
- Edit load/save path p95 remains below 400ms in local harness.
