import { retrievePublicPricing } from "../../services/public-pricing/public-pricing-retrieval-service.js";
import { applyNoDiscountPolicy } from "../../services/public-pricing/no-discount-policy-service.js";
import { applyIncompletePricingProjection } from "../../services/public-pricing/incomplete-pricing-projection-service.js";
import { mapPublicPricingResponse } from "./public-pricing-response-mapper.js";

export function createGetRegistrationPricesController(deps) {
  return {
    get: () => {
      const found = retrievePublicPricing(deps.scheduleDraftRepository);
      if (found.status !== 200) {
        deps.publicPricingObservabilityService?.record("public_pricing_failed", { code: found.body.code });
        return found;
      }
      const normalized = applyNoDiscountPolicy(found.pricing);
      const projected = applyIncompletePricingProjection(normalized);
      deps.publicPricingObservabilityService?.record("public_pricing_loaded", { count: projected.categories.length });
      return { status: 200, body: mapPublicPricingResponse(projected) };
    }
  };
}
