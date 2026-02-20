# Acceptance Tests - UC-16 Generate Conference Schedule

## AT-UC16-01 Manual Draft Generation
- Given valid conference setup
- When admin/editor runs generate
- Then a draft schedule is created

## AT-UC16-02 Publish Reviewed Draft
- Given a valid draft without blocking conflicts
- When publish is confirmed
- Then draft is published and retrievable

## AT-UC16-03 Grid Invariants
- Generated draft has one column per room and equal slot counts per column

## AT-UC16-04 Randomized Initial Placement
- Different seeds produce different initial ordering

## AT-UC16-05 Cancel Publish
- Confirm=false keeps draft unpublished

## AT-UC16-06 No Accepted Papers Block
- Generation returns 400 and no draft

## AT-UC16-07 Missing Parameters Block
- Generation returns 400 and no draft

## AT-UC16-08 Blocking Conflict Block
- Publish returns 400 when blocking conflicts exist

## AT-UC16-09 Save Failure Rollback
- Save failure returns 500 and no draft is stored

## AT-UC16-10 Published Persistence
- Published schedule remains available across repeated retrieval

## AT-UC16-11 Unpublished Retrieval
- `GET /schedule` returns 404 when no published draft exists

## AT-UC16-12 Performance
- Generation retrieval path p95 stays below 400ms in local harness
