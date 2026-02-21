import test from "node:test";
import assert from "node:assert/strict";

import { AnnouncementStore } from "../../backend/src/models/announcement-store.js";
import { validateAssignmentSet } from "../../backend/src/models/assignment-set.js";
import { asCompletedReviewRecord } from "../../backend/src/models/completed-review-record.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { CredentialRepository } from "../../backend/src/models/credential_repository.js";
import { computeEditableStateHash } from "../../backend/src/models/draft-field-state.js";
import { FileAttachmentRecordRepository } from "../../backend/src/models/file-attachment-record.js";
import { FormSubmissionRepository } from "../../backend/src/models/form_submission_repository.js";
import { validateManuscriptFile } from "../../backend/src/models/manuscript-file.js";
import { asPublicAnnouncement } from "../../backend/src/models/public-announcement.js";
import { asPublicScheduleAvailability } from "../../backend/src/models/public-schedule-availability.js";
import { asPublishedPricingSet } from "../../backend/src/models/published-pricing-set.js";
import { ReviewSubmissionRepository } from "../../backend/src/models/review-draft.js";
import { ScheduleDraftRepository } from "../../backend/src/models/schedule-draft.js";
import { canEditSchedule } from "../../backend/src/models/schedule-edit-access.js";
import { TicketStore } from "../../backend/src/models/ticket-store.js";

test("wave12 covers remaining backend/src/models branch stragglers", () => {
  const announcementStore = new AnnouncementStore();
  announcementStore.seedAnnouncements([{ announcementId: "a1", title: "T", content: "C" }]);
  announcementStore.markUnavailable("missing-id");
  announcementStore.markUnavailable("a1");

  const assignmentResult = validateAssignmentSet("not-an-array");
  assert.equal(assignmentResult.valid, false);

  const completed = asCompletedReviewRecord(
    { reviewId: "r1", assignmentId: "as1", status: "submitted", submittedAt: "now", recommendation: "accept", comments: "ok", fields: {} },
    undefined
  );
  assert.equal(completed.paperId, null);

  const regRepo = new RegistrationRepository();
  regRepo.createActiveUser({ email: "user@example.com", passwordHash: "h1", now: new Date("2026-01-01T00:00:00.000Z") });
  const credentialRepo = new CredentialRepository(regRepo);
  assert.equal(credentialRepo.updatePasswordHash("missing@example.com", "h2", new Date("2026-01-01T00:00:00.000Z")), null);

  const hash = computeEditableStateHash(["a", "b"]);
  assert.equal(typeof hash, "string");

  const fileRecords = new FileAttachmentRecordRepository();
  assert.equal(fileRecords.get("missing-sub").attached, false);
  fileRecords.setUnattached("sub-1");
  assert.equal(fileRecords.get("sub-1").attached, false);

  const formRepo = new FormSubmissionRepository();
  assert.equal(formRepo.getRecord("missing-record"), null);
  formRepo.saveRecord("rec-1", { ok: true }, "2026-01-01T00:00:00.000Z");
  assert.equal(formRepo.getRecord("rec-1")?.recordId, "rec-1");

  const manuscriptCheck = validateManuscriptFile({ contentType: "application/pdf" });
  assert.equal(manuscriptCheck.errors.length, 0);

  const announcement = asPublicAnnouncement({ announcementId: "a2", title: "Title", content: "Body" });
  assert.equal(announcement.content, "Body");
  const announcementDefaultContent = asPublicAnnouncement({ announcementId: "a3", title: "Title 2" });
  assert.equal(announcementDefaultContent.content, "");

  assert.equal(asPublicScheduleAvailability({ scheduleId: "s1" }).published, true);

  const pricing = asPublishedPricingSet({ conferenceId: "c1", status: "published", categories: [{ code: "student", amountCad: 10 }] });
  assert.equal(pricing.categories.length, 1);
  const pricingDefaultCategories = asPublishedPricingSet({ conferenceId: "c2", status: "published" });
  assert.equal(pricingDefaultCategories.categories.length, 0);

  regRepo.saveVerificationToken({
    pendingRegistrationId: "pending-a",
    tokenHash: "tok-a",
    issuedAt: new Date("2026-01-01T00:00:00.000Z"),
    expiresAt: new Date("2026-01-02T00:00:00.000Z")
  });
  regRepo.saveVerificationToken({
    pendingRegistrationId: "pending-b",
    tokenHash: "tok-b",
    issuedAt: new Date("2026-01-01T00:00:00.000Z"),
    expiresAt: new Date("2026-01-02T00:00:00.000Z")
  });
  regRepo.invalidateActiveTokens("pending-a", new Date("2026-01-01T12:00:00.000Z"));
  assert.equal(regRepo.getTokenByHash("tok-a")?.invalidatedAt !== null, true);
  assert.equal(regRepo.getTokenByHash("tok-b")?.invalidatedAt, null);

  const reviewRepo = new ReviewSubmissionRepository();
  assert.equal(reviewRepo.getDraft("missing-assignment"), null);
  reviewRepo.seedDraft({ assignmentId: "as-1" });
  assert.equal(reviewRepo.getDraft("as-1")?.assignmentId, "as-1");

  const scheduleRepo = new ScheduleDraftRepository();
  assert.equal(scheduleRepo.getConference("missing-conf"), null);
  scheduleRepo.seedConference({ conferenceId: "conf-1" });
  assert.equal(scheduleRepo.getConference("conf-1")?.conferenceId, "conf-1");

  const editAccess = canEditSchedule({ userRole: "editor", isLocked: true });
  assert.equal(editAccess.code, "SCHEDULE_LOCKED");
  assert.equal(canEditSchedule({ userRole: "editor", isLocked: false }).ok, true);

  const ticketStore = new TicketStore();
  assert.equal(ticketStore.getPdfByRegistrationId("missing-reg"), null);
  ticketStore.savePdf({ ticketId: "t1", registrationId: "reg-1", pdfContent: "pdf-data" });
  assert.equal(ticketStore.getPdfByRegistrationId("reg-1")?.registrationId, "reg-1");
});
