import test from "node:test";
import assert from "node:assert/strict";
import { renderLoginState } from "../../../frontend/src/views/login_view.js";

test("login required-field message is explicit", () => {
  const msg = renderLoginState({ status: 400, body: {} });
  assert.equal(msg, "Email and password are required.");
});
