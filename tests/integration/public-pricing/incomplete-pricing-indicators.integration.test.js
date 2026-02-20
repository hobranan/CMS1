import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("incomplete pricing categories include missing-information markers", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i4", categories: [
    { categoryId: "regular", categoryName: "Regular", finalAmountCad: 140, complete: true },
    { categoryId: "student", categoryName: "Student", finalAmountCad: 80, complete: false }
  ] });
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 200);
  assert.equal(response.body.categories[1].missingInformation, true);
});
