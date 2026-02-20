import test from "node:test";
import assert from "node:assert/strict";
import { hashSecret } from "../../backend/src/services/security/password_crypto_service.js";
import { validateNewPassword } from "../../backend/src/services/security/password_policy_validator.js";

test("password policy validator rejects weak password and history reuse", () => {
  const current = "OldSecurePass!123";
  const oldHash = hashSecret(current);
  const history = [oldHash];
  const weak = validateNewPassword({
    newPassword: "weak",
    currentPassword: current,
    currentPasswordHash: oldHash,
    recentHistoryHashes: history
  });
  assert.ok(weak.length > 0);

  const reuse = validateNewPassword({
    newPassword: current,
    currentPassword: current,
    currentPasswordHash: oldHash,
    recentHistoryHashes: history
  });
  assert.ok(reuse.some((e) => e.code === "PASSWORD_HISTORY_REUSE") || reuse.some((e) => e.code === "NEW_EQUALS_CURRENT"));
});
