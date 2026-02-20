export function buildPaymentFailureMessage(outcome) {
  if (outcome === "declined") return "Payment was declined. Please use another payment method.";
  if (outcome === "invalid_details") return "Payment details were invalid. Review and try again.";
  return "Payment was canceled. Registration remains unpaid.";
}

