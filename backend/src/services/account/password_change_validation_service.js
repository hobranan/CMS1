export function validatePasswordChangePayload(body) {
  const errors = [];
  const currentPassword = String(body?.current_password ?? "");
  const newPassword = String(body?.new_password ?? "");
  const confirmNewPassword = String(body?.confirm_new_password ?? "");

  if (!currentPassword) {
    errors.push({ field: "current_password", code: "REQUIRED", message: "Current password is required." });
  }
  if (!newPassword) {
    errors.push({ field: "new_password", code: "REQUIRED", message: "New password is required." });
  }
  if (!confirmNewPassword) {
    errors.push({ field: "confirm_new_password", code: "REQUIRED", message: "Confirmation is required." });
  }

  return { currentPassword, newPassword, confirmNewPassword, errors };
}
