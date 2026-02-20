import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("refresh and revisit returns consistent pricing payload", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i5", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 145, complete: true }] });
  const first = system.call("/api/v1/public/registration-prices:GET");
  const second = system.call("/api/v1/public/registration-prices:GET");
  assert.deepEqual(first.body, second.body);
});
