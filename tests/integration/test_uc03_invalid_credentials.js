import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("unknown and wrong credentials both return generic invalid message", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const unknown = system.call("/api/v1/auth/login:POST", {
    body: { email: "missing@example.com", password: "WrongPass123!" }
  });
  const wrong = system.call("/api/v1/auth/login:POST", {
    body: { email: validLoginPayload.email, password: "WrongPass123!" }
  });
  assert.equal(unknown.status, 401);
  assert.equal(wrong.status, 401);
  assert.equal(unknown.body.message, "Invalid email or password.");
  assert.equal(wrong.body.message, "Invalid email or password.");
});
