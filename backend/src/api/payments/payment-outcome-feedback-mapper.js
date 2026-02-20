export function mapGatewayOutcome(gatewayStatus) {
  if (gatewayStatus === "invalid") return "invalid_details";
  if (gatewayStatus === "declined") return "declined";
  if (gatewayStatus === "timeout") return "pending_unresolved";
  if (gatewayStatus === "success") return "confirmed";
  return "canceled";
}

