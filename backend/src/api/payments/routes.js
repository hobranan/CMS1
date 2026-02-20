import { createPostPaymentInitiateController } from "./post-payment-initiate-controller.js";
import { createPostGatewayConfirmController } from "./post-gateway-confirm-controller.js";
import { createGetPaymentStatusController } from "./get-payment-status-controller.js";

export function createPaymentRoutes(deps) {
  const initiateController = createPostPaymentInitiateController(deps);
  const confirmController = createPostGatewayConfirmController(deps);
  const statusController = createGetPaymentStatusController(deps);

  return {
    "/api/v1/registrations/:registrationId/payment/initiate:POST": initiateController.post,
    "/api/v1/payments/gateway/confirm:POST": confirmController.post,
    "/api/v1/registrations/:registrationId/payment/status:GET": statusController.get
  };
}

