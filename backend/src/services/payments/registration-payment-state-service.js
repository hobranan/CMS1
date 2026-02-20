import { canTransitionRegistrationState } from "../../models/registration-status.js";

export function applyRegistrationPaymentState(store, registrationId, nextState, patch = {}) {
  const registration = store.getRegistration(registrationId);
  if (!registration) {
    const err = new Error("REGISTRATION_NOT_FOUND");
    err.code = "REGISTRATION_NOT_FOUND";
    throw err;
  }
  if (!canTransitionRegistrationState(registration.state, nextState)) {
    const err = new Error("INVALID_REGISTRATION_STATE_TRANSITION");
    err.code = "INVALID_REGISTRATION_STATE_TRANSITION";
    throw err;
  }
  return store.updateRegistration(registrationId, { ...patch, state: nextState });
}

