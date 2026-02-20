import { login } from "../services/auth/login_service.js";

export function createAuthController(deps) {
  return {
    login: (request) => login(deps, request)
  };
}
