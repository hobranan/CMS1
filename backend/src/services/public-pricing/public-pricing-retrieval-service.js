export function retrievePublicPricing(repository) {
  try {
    const pricing = repository.getPublishedPricing();
    if (!pricing) {
      return { status: 404, body: { code: "PRICING_NOT_PUBLISHED", message: "Registration prices are not available yet." } };
    }
    if (repository.failNextPublicPricingRead) {
      repository.failNextPublicPricingRead = false;
      throw new Error("PRICING_RETRIEVAL_FAILURE");
    }
    return { status: 200, pricing };
  } catch {
    return { status: 500, body: { code: "PRICING_RETRIEVAL_FAILURE", message: "Registration prices could not be loaded." } };
  }
}
