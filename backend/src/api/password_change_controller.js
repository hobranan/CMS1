import { changePassword } from "../services/account/password_change_service.js";

export function createPasswordChangeController(deps) {
  return {
    changePassword: (request) => changePassword(deps, request)
  };
}
