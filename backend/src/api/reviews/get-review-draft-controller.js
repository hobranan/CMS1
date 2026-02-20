export function createGetReviewDraftController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Referee authentication is required." } };
      }
      const assignmentId = request.params?.assignmentId;
      const assignment = deps.reviewSubmissionRepository.getAssignment(assignmentId);
      if (!assignment || assignment.refereeId !== request.user.id) {
        return { status: 403, body: { code: "ASSIGNMENT_INACTIVE", message: "Assignment is not active." } };
      }
      const draft = deps.reviewSubmissionRepository.getDraft(assignmentId) ?? {
        assignmentId,
        requiredFields: {},
        recommendation: "",
        comments: "",
        deadlineEnforced: false
      };
      return {
        status: 200,
        body: {
          assignmentId,
          requiredFields: draft.requiredFields,
          deadlineIndicator: assignment.deadlineIndicator,
          deadlineEnforced: false
        }
      };
    }
  };
}

