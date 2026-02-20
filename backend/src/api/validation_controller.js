import { requireAuthenticatedUser } from "./middleware/form_auth_guard.js";
import { validateAndPersistSubmission } from "../services/validation/validation_service.js";
import { handleValidationError } from "./validation_error_handler.js";

export function createValidationController(deps) {
  return {
    submit: (request) => {
      const auth = requireAuthenticatedUser(request);
      if (!auth.allowed) {
        return auth.response;
      }
      try {
        return validateAndPersistSubmission(deps, request);
      } catch (error) {
        return handleValidationError(error);
      }
    }
  };
}
