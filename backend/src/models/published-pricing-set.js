import { asRegistrationPriceCategory } from "./registration-price-category.js";

export function asPublishedPricingSet(set) {
  return {
    conferenceId: set.conferenceId,
    status: set.status,
    currency: "CAD",
    categories: (set.categories ?? []).map(asRegistrationPriceCategory)
  };
}
