import { createLoginController } from "./login_controller.js";

export function createLoginRoutes(deps) {
  const loginController = createLoginController(deps);
  return {
    "/api/v1/auth/login:POST": loginController.login,
    "/api/v1/auth/session:GET": loginController.session
  };
}
