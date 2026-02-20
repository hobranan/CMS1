import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("five failures trigger 15-minute lockout and expiry resets lockout", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  for (let i = 0; i < 5; i += 1) {
    system.call("/api/v1/auth/login:POST", {
      body: { email: validLoginPayload.email, password: "WrongPass123!" }
    });
  }
  const locked = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(locked.status, 423);

  system.advanceMs(15 * 60 * 1000 + 1000);
  const afterExpiry = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(afterExpiry.status, 200);
});
