export function buildOnlinePaymentViewModel({ categoryLabel, amount, currency }) {
  return {
    categoryLabel: categoryLabel ?? "Not selected",
    totalLabel: `${currency ?? "CAD"} ${Number(amount ?? 0).toFixed(2)}`
  };
}

