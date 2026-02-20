export function validateScheduleGenerationRequest(body) {
  return {
    conferenceId: body?.conferenceId ?? null,
    seed: Number.isFinite(body?.seed) ? body.seed : null,
    requestedBy: body?.requestedBy ?? null
  };
}
