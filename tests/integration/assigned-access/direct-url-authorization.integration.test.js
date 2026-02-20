import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("direct URL access to non-assigned resource is blocked", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref9@example.com");
  system.deps.assignedPaperRepository.seedManuscript({
    paperId: "paper-7",
    contentUrl: "https://example.com/m7"
  });

  const response = system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-7" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 403);
});

