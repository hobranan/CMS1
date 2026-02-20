import { createGetRegistrationPricesController } from "./get-registration-prices-controller.js";

export function createPublicPricingRoutes(deps) {
  const controller = createGetRegistrationPricesController(deps);
  return {
    "/api/v1/public/registration-prices:GET": controller.get
  };
}
