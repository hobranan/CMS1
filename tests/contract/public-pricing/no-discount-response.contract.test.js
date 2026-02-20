import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("response enforces no-discount and CAD fields", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-3", categories: [{ categoryId: "student", categoryName: "Student", finalAmountCad: 99.5, complete: true }] });
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 200);
  assert.equal(response.body.discountApplied, false);
  assert.equal(response.body.currency, "CAD");
  assert.equal(response.body.categories[0].discount, undefined);
});
