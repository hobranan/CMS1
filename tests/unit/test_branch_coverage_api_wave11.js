import test from "node:test";
import assert from "node:assert/strict";

import { PaymentWorkflowStore } from "../../backend/src/models/payment-workflow-store.js";
import { createGetPaymentStatusController } from "../../backend/src/api/payments/get-payment-status-controller.js";
import { createPostGenerateScheduleController } from "../../backend/src/api/schedule/post-generate-schedule-controller.js";
import { createGetEditableScheduleController } from "../../backend/src/api/schedule-edit/get-editable-schedule-controller.js";
import { createPostSaveScheduleController } from "../../backend/src/api/schedule-edit/post-save-schedule-controller.js";
import { ScheduleDraftRepository } from "../../backend/src/models/schedule-draft.js";

function seedScheduleRepository() {
  const repo = new ScheduleDraftRepository();
  repo.seedConference({
    conferenceId: "c-fallback",
    acceptedPapers: [{ paperId: "p1" }],
    rooms: [{ roomId: "r1", roomName: "Room A" }],
    parameters: { slotMinutes: 30, totalSlots: 2, startMinute: 540 }
  });
  const created = repo.createDraft({
    conferenceId: "c-fallback",
    grid: { columns: [] },
    placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }],
    conflicts: []
  });
  repo.publishDraft({ conferenceId: "c-fallback", draftId: created.draftId });
  return repo;
}

test("wave11 covers API fallback branches", () => {
  const paymentStore = new PaymentWorkflowStore();
  paymentStore.seedRegistration({
    registrationId: "reg-fallback",
    attendeeId: "u1",
    state: "pending",
    amount: 50,
    currency: "CAD"
  });

  const paymentStatusController = createGetPaymentStatusController({ paymentWorkflowStore: paymentStore });
  const paymentStatus = paymentStatusController.get({
    user: { id: "u1" },
    params: { registrationId: "reg-fallback" }
  });
  assert.equal(paymentStatus.status, 200);
  assert.equal(paymentStatus.body.message, null);

  paymentStore.updateRegistration("reg-fallback", { message: "paid already", paymentId: "p-1" });
  const paymentStatusWithMessage = paymentStatusController.get({
    user: { id: "u1" },
    params: { registrationId: "reg-fallback" }
  });
  assert.equal(paymentStatusWithMessage.status, 200);
  assert.equal(paymentStatusWithMessage.body.message, "paid already");

  const scheduleRepo = seedScheduleRepository();

  const generateController = createPostGenerateScheduleController({
    scheduleDraftRepository: scheduleRepo,
    scheduleGenerationObservabilityService: { record() {} }
  });
  const generated = generateController.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" },
    body: { seed: "seed-2" }
  });
  assert.equal(generated.status, 200);

  const generateWithRoomServiceController = createPostGenerateScheduleController({
    scheduleDraftRepository: scheduleRepo,
    roomAvailabilityService: (rooms) => rooms,
    scheduleGenerationObservabilityService: { record() {} }
  });
  const generatedWithRoomService = generateWithRoomServiceController.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" },
    body: { seed: "seed-3" }
  });
  assert.equal(generatedWithRoomService.status, 200);

  const versionsNoEntry = new Map();
  const editableController = createGetEditableScheduleController({
    scheduleDraftRepository: scheduleRepo,
    scheduleEditVersions: versionsNoEntry
  });
  const editable = editableController.get({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" }
  });
  assert.equal(editable.status, 200);
  assert.equal(editable.body.version, 1);

  versionsNoEntry.set("c-fallback", null);
  const editableWithNullVersion = editableController.get({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" }
  });
  assert.equal(editableWithNullVersion.status, 200);
  assert.equal(editableWithNullVersion.body.version, 1);

  const saveController = createPostSaveScheduleController({
    scheduleDraftRepository: scheduleRepo,
    scheduleEditVersions: versionsNoEntry,
    scheduleEditObservabilityService: { record() {} }
  });
  const saved = saveController.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" },
    body: {
      expectedVersion: 1,
      edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] }
    }
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.version, 2);

  versionsNoEntry.set("c-fallback", null);
  const savedWithNullVersion = saveController.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c-fallback" },
    body: {
      expectedVersion: 1,
      edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] }
    }
  });
  assert.equal(savedWithNullVersion.status, 200);
  assert.equal(savedWithNullVersion.body.version, 2);
});
