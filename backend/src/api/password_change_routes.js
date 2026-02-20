import { createPasswordChangeController } from "./password_change_controller.js";

export function createPasswordChangeRoutes(deps) {
  const controller = createPasswordChangeController(deps);
  return {
    "/api/v1/account/password:PUT": controller.changePassword
  };
}
