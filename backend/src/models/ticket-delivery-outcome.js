export function asTicketDeliveryOutcome(payload) {
  const status = payload.status ?? "not_attempted";
  return {
    status,
    channel: payload.channel ?? "email",
    message: payload.message ?? null
  };
}

