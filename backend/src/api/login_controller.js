import { createAuthController } from "./auth_controller.js";
import { createSessionController } from "./session_controller.js";

export function createLoginController(deps) {
  const authController = createAuthController(deps);
  const sessionController = createSessionController(deps);
  return {
    login: authController.login,
    session: sessionController.getSession
  };
}
