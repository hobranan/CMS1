export function buildSuccessMessage(operation) {
  return operation === "update"
    ? "Update saved successfully."
    : "Create saved successfully.";
}
