export function applyIncompletePricingProjection(payload) {
  return {
    ...payload,
    categories: payload.categories.map((c) => ({
      ...c,
      missingInformation: c.complete !== true
    }))
  };
}
