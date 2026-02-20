import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "./fixtures/login_payloads.js";

test("unknown email and wrong password share generic invalid message", () => {
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

test("lockout and store outage responses match contract", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);

  for (let i = 0; i < 5; i += 1) {
    system.call("/api/v1/auth/login:POST", {
      body: { email: validLoginPayload.email, password: "WrongPass123!" }
    });
  }
  const locked = system.call("/api/v1/auth/login:POST", {
    body: { email: validLoginPayload.email, password: validLoginPayload.password }
  });
  assert.equal(locked.status, 423);

  const outageSystem = createUc03System();
  outageSystem.addUser(validLoginPayload.email, validLoginPayload.password);
  outageSystem.deps.credentialStoreRepository.setUnavailable(true);
  const outage = outageSystem.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(outage.status, 503);
});
