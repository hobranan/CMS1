import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("unpublished registration prices returns 404", () => {
  const system = createUc19System();
  system.clearPublishedPricing();
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 404);
});
