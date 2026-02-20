import { invalidCredentials } from "../../api/login_error_mapper.js";

export function genericInvalidCredentialFailure() {
  return invalidCredentials();
}
