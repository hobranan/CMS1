import { createValidationController } from "./validation_controller.js";

export function createValidationRoutes(deps) {
  const controller = createValidationController(deps);
  return {
    "/api/v1/forms/submit:POST": controller.submit
  };
}
