import test from "node:test";
import assert from "node:assert/strict";
import { renderRegistrationState } from "../../../frontend/src/views/registration_view.js";

test("registration view returns actionable failure text", () => {
  const message = renderRegistrationState({ status: 422, body: {} });
  assert.equal(message, "Please fix the highlighted fields.");
});
