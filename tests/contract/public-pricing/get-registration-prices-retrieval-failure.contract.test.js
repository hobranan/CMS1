import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("registration prices retrieval failure returns 500", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-2", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 100, complete: true }] });
  system.failPricingRead();
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 500);
});
