export function validateGenerationPrereqs({ acceptedPapers, rooms, parameters }) {
  if (!acceptedPapers || acceptedPapers.length === 0) {
    return { ok: false, status: 400, body: { code: "NO_ACCEPTED_PAPERS", message: "No accepted papers available." } };
  }
  if (!rooms || rooms.length === 0 || !parameters || !parameters.slotMinutes || !parameters.totalSlots) {
    return { ok: false, status: 400, body: { code: "MISSING_PARAMETERS", message: "Schedule parameters are incomplete." } };
  }
  return { ok: true };
}
