export function mapConflictHighlight(draft) {
  const blocking = draft.conflicts.filter((c) => c.severity === "blocking");
  return {
    blockingCount: blocking.length,
    conflicts: draft.conflicts
  };
}
