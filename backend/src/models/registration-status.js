const VALID_REGISTRATION_STATES = new Set(["unpaid", "pending", "paid_confirmed"]);

export function asRegistrationStatus(payload) {
  const state = payload.state ?? "unpaid";
  if (!VALID_REGISTRATION_STATES.has(state)) {
    throw new Error("INVALID_REGISTRATION_STATE");
  }
  return {
    registrationId: String(payload.registrationId),
    state,
    paymentId: payload.paymentId ?? null,
    updatedAt: payload.updatedAt ?? new Date().toISOString(),
    message: payload.message ?? null
  };
}

export function canTransitionRegistrationState(fromState, toState) {
  if (fromState === toState) return true;
  if (fromState === "unpaid" && (toState === "pending" || toState === "paid_confirmed")) return true;
  if (fromState === "pending" && (toState === "pending" || toState === "paid_confirmed")) return true;
  return false;
}

