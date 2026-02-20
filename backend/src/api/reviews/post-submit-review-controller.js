import { processReviewSubmission } from "../../services/reviews/process-review-submission-service.js";
import { mapReviewValidationErrors } from "./review-validation-error-mapper.js";

export function createPostSubmitReviewController(deps) {
  return {
    post: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Referee authentication is required." } };
      }
      const assignmentId = request.params?.assignmentId;
      const confirm = request.body?.confirm_submit;
      if (confirm === false) {
        return { status: 200, body: { cancelled: true, mutated: false } };
      }

      const result = processReviewSubmission(deps, {
        assignmentId,
        refereeId: request.user.id,
        fields: request.body?.fields ?? {},
        recommendation: request.body?.recommendation ?? "",
        comments: request.body?.comments ?? ""
      });

      if (result.status === 400) {
        return mapReviewValidationErrors({
          status: 400,
          code: result.body.code,
          message: result.body.message,
          errors: result.body.errors
        });
      }
      return result;
    }
  };
}

