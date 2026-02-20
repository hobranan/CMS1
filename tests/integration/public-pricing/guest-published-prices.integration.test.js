import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("guest can view published prices", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i1", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 120, complete: true }] });
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 200);
});
