import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("temporary retrieval failure then recovery", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i6", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 110, complete: true }] });
  system.failPricingRead();
  const fail = system.call("/api/v1/public/registration-prices:GET");
  const recover = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(fail.status, 500);
  assert.equal(recover.status, 200);
});
