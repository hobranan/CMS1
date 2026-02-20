export function pricingConsistencyKey(payload) {
  return JSON.stringify(payload.categories.map((c) => [c.categoryId, c.finalAmountCad, c.missingInformation]));
}
