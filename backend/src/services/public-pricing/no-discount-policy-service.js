import { formatCad } from "./cad-formatting-service.js";

export function applyNoDiscountPolicy(pricingSet) {
  return {
    conferenceId: pricingSet.conferenceId,
    currency: "CAD",
    discountApplied: false,
    categories: pricingSet.categories.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      finalAmountCad: c.finalAmountCad,
      finalAmountLabel: formatCad(c.finalAmountCad),
      complete: c.complete
    }))
  };
}
