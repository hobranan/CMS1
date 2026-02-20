export function evaluatePaymentInitiationEligibility(store, { registrationId, userId, categoryId }) {
  const registration = store.getRegistration(registrationId);
  if (!registration || registration.attendeeId !== userId) {
    return { ok: false, status: 404, code: "REGISTRATION_NOT_FOUND", message: "Registration not found." };
  }

  const resolvedCategory = categoryId ?? registration.categoryId;
  if (!resolvedCategory) {
    return {
      ok: false,
      status: 400,
      code: "REGISTRATION_CATEGORY_REQUIRED",
      message: "Select a registration category before payment."
    };
  }

  if (registration.state === "paid_confirmed") {
    return {
      ok: false,
      status: 409,
      code: "DUPLICATE_PAYMENT_ATTEMPT",
      message: "Registration is already paid and confirmed."
    };
  }

  return { ok: true, registration, categoryId: resolvedCategory };
}

