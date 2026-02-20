import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("direct URL unpublished pricing returns not available", () => {
  const system = createUc19System();
  system.clearPublishedPricing();
  const response = system.call("/api/v1/public/registration-prices:GET");
  assert.equal(response.status, 404);
});
