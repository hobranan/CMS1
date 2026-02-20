import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("guest and authenticated users see same published pricing", () => {
  const system = createUc19System();
  const user = system.addUser("priceuser@example.com", "author");
  system.seedPublishedPricing({ conferenceId: "c19-i2", categories: [{ categoryId: "regular", categoryName: "Regular", finalAmountCad: 130, complete: true }] });
  const guest = system.call("/api/v1/public/registration-prices:GET");
  const auth = system.call("/api/v1/public/registration-prices:GET", { user: { id: user.id, email: user.email, role: user.role } });
  assert.deepEqual(guest.body.categories, auth.body.categories);
});
