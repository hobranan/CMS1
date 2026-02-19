# Quickstart - UC-16 Generate Schedule

## Goal
Allow authenticated administrators/editors to manually generate a conference schedule draft from accepted papers using room-column sequential slots with randomized initial session placement.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-16.md`, `UC-16-AT.md`

## Implementation Steps
1. Add manual Generate Schedule action available only to authenticated administrators/editors.
2. Validate prerequisites before generation:
   - accepted papers exist
   - required conference parameters are complete.
3. Build initial schedule grid with one column per configured room.
4. Generate sequential time slots for each room column using configured interval.
5. Enforce equal slot count across all room columns for initial draft template.
6. Randomize accepted-session ordering and place sessions into available room/slot assignments.
7. Apply scheduling rules (session duration, room availability, conflict checks) during placement.
8. Persist generated schedule as draft and display draft with conflict highlights.
9. Block publication while blocking conflicts remain unresolved.
10. Support explicit publish confirmation; if canceled, keep schedule in draft state.
11. On save failure during generation, return system error and do not store schedule.
12. Ensure published schedules persist for retrieval across refresh and new sessions.

## Validation Scenarios
- Valid manual generation creates reviewable draft with room/time assignments.
- No accepted papers blocks generation with explicit feedback.
- Incomplete parameters block generation with missing-configuration guidance.
- Initial draft contains one room column per room and equal slot counts across columns.
- Adjacent slots are sequential with configured interval separation.
- Initial placement order is randomized per generation run.
- Detected conflicts are highlighted and block finalization until resolved.
- Publish canceled after valid draft keeps status as draft.
- Save failure returns error and leaves no stored draft.
- Published schedule remains retrievable and unchanged across sessions.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for generation prerequisites, slot-grid structure, random placement, conflict blocking, draft/publish transitions, and failure handling.
