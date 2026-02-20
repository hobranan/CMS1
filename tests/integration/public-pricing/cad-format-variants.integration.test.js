import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("CAD formatting supports integer and decimal values", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i3", categories: [
    { categoryId: "int", categoryName: "Integer", finalAmountCad: 100, complete: true },
    { categoryId: "dec", categoryName: "Decimal", finalAmountCad: 99.5, complete: true }
  ] });
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.body.categories[0].finalAmountLabel, "CAD 100.00");
  assert.equal(response.body.categories[1].finalAmountLabel, "CAD 99.50");
});
