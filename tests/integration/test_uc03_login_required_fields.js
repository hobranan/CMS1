import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";

test("missing email or password is rejected without authentication", () => {
  const system = createUc03System();
  const missingEmail = system.call("/api/v1/auth/login:POST", { body: { email: "", password: "p" } });
  const missingPassword = system.call("/api/v1/auth/login:POST", { body: { email: "a@b.com", password: "" } });
  assert.equal(missingEmail.status, 400);
  assert.equal(missingPassword.status, 400);
});
