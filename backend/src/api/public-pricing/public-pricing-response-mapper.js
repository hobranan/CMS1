export function mapPublicPricingResponse(payload) {
  return {
    conferenceId: payload.conferenceId,
    currency: "CAD",
    discountApplied: false,
    categories: payload.categories.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      finalAmountCad: c.finalAmountCad,
      finalAmountLabel: c.finalAmountLabel,
      missingInformation: c.missingInformation
    }))
  };
}
