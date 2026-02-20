import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("public registration prices returns published CAD categories", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-1", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 150, complete: true }] });
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 200);
  assert.equal(response.body.currency, "CAD");
  assert.equal(response.body.categories.length, 1);
});
