import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("assignment returns 503 when workload retrieval fails", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.failNextRead();

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-304" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r5" }
  });

  assert.equal(result.status, 503);
  assert.equal(result.body.code, "WORKLOAD_RETRIEVAL_FAILURE");
});

