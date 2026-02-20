export function validateReviewSubmission({ assignment, fields, recommendation }) {
  if (!assignment || assignment.status !== "active") {
    return {
      ok: false,
      status: 403,
      code: "ASSIGNMENT_INACTIVE",
      message: "Assignment is not active."
    };
  }
  const errors = [];
  if (!recommendation || String(recommendation).trim() === "") {
    errors.push({ field: "recommendation", code: "REQUIRED", message: "Recommendation is required." });
  }
  if (!fields || typeof fields !== "object" || Object.keys(fields).length === 0) {
    errors.push({ field: "fields", code: "REQUIRED", message: "Review fields are required." });
  }
  for (const [key, value] of Object.entries(fields ?? {})) {
    if (String(value ?? "").trim() === "") {
      errors.push({ field: key, code: "REQUIRED", message: `${key} is required.` });
    }
  }
  if (errors.length > 0) {
    return {
      ok: false,
      status: 400,
      code: "VALIDATION_FAILED",
      message: "Review submission validation failed.",
      errors
    };
  }
  return { ok: true };
}

