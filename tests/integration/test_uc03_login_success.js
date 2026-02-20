import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("valid credentials authenticate and return dashboard redirect", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const result = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(result.status, 200);
  assert.equal(result.body.redirect, "/dashboard");
});
