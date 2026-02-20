import { finalizeRefereeAssignment } from "../../services/assignments/finalize-referee-assignment-service.js";

export function createConfirmAssignmentController(deps) {
  return {
    confirm: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." }
        };
      }

      const paperId = request.params?.paperId;
      const refereeIds = request.body?.referee_ids ?? [];
      const expectedVersion = request.body?.expected_version;
      return finalizeRefereeAssignment(deps, { paperId, refereeIds, expectedVersion });
    }
  };
}

