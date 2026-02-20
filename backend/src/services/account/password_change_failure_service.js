import { systemFailure } from "../../api/password_change_error_mapper.js";

export function mapPasswordChangeFailure() {
  return systemFailure();
}
