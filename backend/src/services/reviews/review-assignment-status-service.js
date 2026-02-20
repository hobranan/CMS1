export function markAssignmentCompleted(repository, assignmentId) {
  repository.updateAssignmentStatus(assignmentId, "completed");
}

