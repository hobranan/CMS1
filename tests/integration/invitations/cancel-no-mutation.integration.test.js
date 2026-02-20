import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";
import { cancelInvitationDecision } from "../../../frontend/src/controllers/invitations/invitation-response-controller.js";

test("cancel before confirm performs no mutation", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref9@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });

  const cancel = cancelInvitationDecision();
  assert.equal(cancel.cancelled, true);
  assert.equal(cancel.mutated, false);
  assert.equal(system.deps.reviewInvitationRepository.get(invitation.invitationId).status, "pending");
});

