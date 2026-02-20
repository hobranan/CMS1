export function createGetAssignmentDetailsController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." }
        };
      }
      const paperId = request.params?.paperId;
      const assignment = deps.paperRefereeAssignmentRepository.getAssignment(paperId);
      return {
        status: 200,
        body: {
          paper_id: paperId,
          referees: assignment.refereeIds.map((refereeId) => ({ referee_id: refereeId }))
        }
      };
    }
  };
}

