import http from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { createRegistrationRoutes } from "./api/registration_routes.js";
import { REGISTRATION_CONFIG } from "./models/config/registration_config.js";
import { RegistrationRepository } from "./models/registration_repository.js";
import { VerificationEmailService } from "./services/email/verification_email_service.js";
import { RegistrationAuditLog } from "./services/registration/registration_audit_log.js";
import { hashPassword } from "./services/security/password_service.js";

function parseRouteKey(routeKey) {
  const match = routeKey.match(/:(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)$/);
  if (!match) {
    throw new Error(`Invalid route key: ${routeKey}`);
  }
  return {
    method: match[1],
    pathTemplate: routeKey.slice(0, -`:${match[1]}`.length)
  };
}

function compilePath(pathTemplate) {
  const parts = pathTemplate.split("/").filter(Boolean);
  return {
    pathTemplate,
    parts,
    paramsCount: parts.filter((part) => part.startsWith(":")).length,
    match(pathname) {
      const actualParts = pathname.split("/").filter(Boolean);
      if (actualParts.length !== parts.length) {
        return null;
      }
      const params = {};
      for (let i = 0; i < parts.length; i += 1) {
        const expected = parts[i];
        const actual = actualParts[i];
        if (expected.startsWith(":")) {
          params[expected.slice(1)] = decodeURIComponent(actual);
          continue;
        }
        if (expected !== actual) {
          return null;
        }
      }
      return params;
    }
  };
}

function compileRoutes(routeMap) {
  const compiled = Object.entries(routeMap).map(([key, handler]) => {
    const parsed = parseRouteKey(key);
    const matcher = compilePath(parsed.pathTemplate);
    return {
      key,
      method: parsed.method,
      handler,
      ...matcher
    };
  });

  // Prefer the most specific match first (fewer path params).
  compiled.sort((a, b) => a.paramsCount - b.paramsCount);
  return compiled;
}

function parseUser(headers) {
  const userJson = headers["x-user-json"];
  if (typeof userJson === "string" && userJson.trim().length > 0) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  const id = headers["x-user-id"];
  const email = headers["x-user-email"];
  const role = headers["x-user-role"];
  if (id || email || role) {
    return {
      id: id ?? undefined,
      email: email ?? undefined,
      role: role ?? undefined
    };
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve(undefined);
        return;
      }
      const raw = Buffer.concat(chunks).toString("utf8");
      const contentType = String(req.headers["content-type"] ?? "");
      if (contentType.includes("application/json")) {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(undefined);
        }
        return;
      }
      resolve(raw);
    });
    req.on("error", reject);
  });
}

function sendResult(res, result) {
  const status = result?.status ?? 200;
  const responseHeaders = { ...(result?.headers ?? {}) };
  const body = result?.body;

  if (body === undefined || body === null) {
    res.writeHead(status, responseHeaders);
    res.end();
    return;
  }

  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    res.writeHead(status, responseHeaders);
    res.end(body);
    return;
  }

  if (typeof body === "string") {
    if (!responseHeaders["content-type"]) {
      responseHeaders["content-type"] = "text/plain; charset=utf-8";
    }
    res.writeHead(status, responseHeaders);
    res.end(body);
    return;
  }

  responseHeaders["content-type"] = responseHeaders["content-type"] ?? "application/json; charset=utf-8";
  res.writeHead(status, responseHeaders);
  res.end(JSON.stringify(body));
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "text/plain; charset=utf-8";
}

async function tryServeFrontend(req, res, pathname) {
  if (req.method !== "GET") {
    return false;
  }

  const root = process.cwd();
  const viewsRoot = path.resolve(root, "frontend", "src", "views");
  const appRoot = path.resolve(root, "frontend", "src", "app");

  if (pathname === "/") {
    const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>CMS1 Frontend Views</title></head>
<body>
  <h1>CMS1 Frontend Views</h1>
  <p>Apps:</p>
  <ul>
    <li><a href="/app/">/app (UC map)</a></li>
  </ul>
  <p>Open a view directly:</p>
  <ul>
    <li><a href="/views/submission-form.html">Submission Form</a></li>
    <li><a href="/views/review-submit.html">Review Submit</a></li>
    <li><a href="/views/public-schedule/public-schedule.html">Public Schedule</a></li>
    <li><a href="/views/public-pricing/registration-prices.html">Registration Prices</a></li>
    <li><a href="/views/public-announcements/announcements-list.html">Public Announcements</a></li>
    <li><a href="/views/payments/online-payment.html">Online Payment</a></li>
  </ul>
  <p>API base: <code>/api/v1/*</code></p>
</body>
</html>`;
    sendResult(res, {
      status: 200,
      body: html,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
    return true;
  }

  if (pathname === "/app") {
    sendResult(res, {
      status: 302,
      headers: { location: "/app/" }
    });
    return true;
  }

  if (pathname === "/app/" || pathname.startsWith("/app/")) {
    const relPath = pathname === "/app/" ? "index.html" : pathname.slice("/app/".length);
    const filePath = path.resolve(appRoot, relPath);
    if (!filePath.startsWith(appRoot)) {
      sendResult(res, { status: 403, body: "Forbidden" });
      return true;
    }

    try {
      const content = await fs.readFile(filePath);
      sendResult(res, {
        status: 200,
        body: content,
        headers: { "content-type": contentTypeFor(filePath) }
      });
      return true;
    } catch {
      sendResult(res, { status: 404, body: "App asset not found." });
      return true;
    }
  }

  if (!pathname.startsWith("/views/")) {
    return false;
  }

  const relPath = pathname.slice("/views/".length);
  const filePath = path.resolve(viewsRoot, relPath);
  if (!filePath.startsWith(viewsRoot)) {
    sendResult(res, { status: 403, body: "Forbidden" });
    return true;
  }

  try {
    const content = await fs.readFile(filePath);
    sendResult(res, {
      status: 200,
      body: content,
      headers: { "content-type": contentTypeFor(filePath) }
    });
    return true;
  } catch {
    sendResult(res, { status: 404, body: "View not found." });
    return true;
  }
}

function createDefaultDeps() {
  return {
    repository: new RegistrationRepository(),
    verificationEmailService: new VerificationEmailService(),
    auditLog: new RegistrationAuditLog(),
    config: REGISTRATION_CONFIG,
    nowProvider: () => new Date()
  };
}

function seedDemoData(deps) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();

  // Registration/auth users for login/password flows.
  const passwordHash = hashPassword("Password123!");
  deps.repository.usersByEmail.clear();
  deps.repository.pendingByEmail.clear();
  deps.repository.tokensByHash.clear();
  deps.repository.usersByEmail.set("author@example.com", {
    id: "author-1",
    email: "author@example.com",
    passwordHash,
    status: "ACTIVE",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });
  deps.repository.usersByEmail.set("editor@example.com", {
    id: "editor-1",
    email: "editor@example.com",
    passwordHash,
    status: "ACTIVE",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });
  deps.repository.usersByEmail.set("referee@example.com", {
    id: "ref-1",
    email: "referee@example.com",
    passwordHash,
    status: "ACTIVE",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  // Submission + draft flows.
  deps.paperSubmissionRepository.submissions.clear();
  deps.paperSubmissionRepository.submissions.set("sub-1", {
    id: "sub-1",
    authorEmail: "author@example.com",
    metadata: {
      author_names: "A. Author",
      author_affiliations: "Example University",
      author_contact_email: "author@example.com",
      abstract_text: "Seeded abstract",
      keywords: "cms,review",
      main_reference_source: "Seeded references"
    },
    manuscriptFile: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" },
    status: "FINALIZED",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  deps.submissionDraftRepository.drafts.clear();
  deps.submissionDraftRepository.drafts.set("draft-1", {
    id: "draft-1",
    authorEmail: "author@example.com",
    status: "DRAFT",
    editableState: {
      title: "Seeded Draft Title",
      abstract: "Seeded draft abstract",
      contact_email: "author@example.com"
    },
    stateHash: "seed",
    version: 1,
    lastSavedAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  // Assignment/workload + referee access.
  deps.paperRefereeAssignmentRepository.papers.clear();
  deps.paperRefereeAssignmentRepository.assignments.clear();
  deps.paperRefereeAssignmentRepository.referees.clear();
  deps.paperRefereeAssignmentRepository.seedPaper({ paperId: "paper-1", status: "SUBMITTED", version: 1 });
  deps.paperRefereeAssignmentRepository.seedReferee({ refereeId: "ref-1", eligible: true, currentLoad: 0, maxLoad: 3 });

  deps.assignedPaperRepository.assignedByReferee.clear();
  deps.assignedPaperRepository.manuscriptsByPaper.clear();
  deps.assignedPaperRepository.reviewFormsByPaper.clear();
  deps.assignedPaperRepository.seedAssignment({ refereeId: "ref-1", paperId: "paper-1", title: "Seeded Paper 1" });
  deps.assignedPaperRepository.seedManuscript({ paperId: "paper-1", contentUrl: "/files/paper-1.pdf" });
  deps.assignedPaperRepository.seedReviewForm({ paperId: "paper-1", reviewFormId: "form-1", preGenerated: true });

  deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);
  deps.workloadLimitRuleRepository.setRoleRule("reviewer", 3, 1);
  deps.workloadLimitRuleRepository.setTrackRule("AI", 3, 1);
  deps.refereeWorkloadRetrievalService.seed("ref-1", 0);

  // Invitations/reviews.
  deps.reviewInvitationRepository.invitations.clear();
  deps.reviewInvitationRepository.invitations.set("inv-1", {
    invitationId: "inv-1",
    paperId: "paper-1",
    refereeId: "ref-1",
    issuedAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    status: "pending",
    responseRecordedAt: null
  });
  deps.invitationResponseRepository.responsesByInvitation.clear();
  deps.reviewAssignmentActivationRepository.activeAssignments.clear();

  deps.reviewSubmissionRepository.assignments.clear();
  deps.reviewSubmissionRepository.drafts.clear();
  deps.reviewSubmissionRepository.submittedByAssignment.clear();
  deps.reviewSubmissionRepository.submittedById.clear();
  deps.reviewSubmissionRepository.versionLinks = [];
  deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "assign-1",
    refereeId: "ref-1",
    editorId: "editor-1",
    paperId: "paper-1",
    status: "active",
    deadlineIndicator: "Due in 5 days"
  });
  deps.reviewSubmissionRepository.seedDraft({
    assignmentId: "assign-1",
    requiredFields: { originality: true, significance: true }
  });
  const seededSubmitted = deps.reviewSubmissionRepository.createSubmittedReview({
    assignmentId: "assign-1",
    refereeId: "ref-1",
    fields: { originality: 4, significance: 4 },
    recommendation: "accept",
    comments: "Seeded submitted review",
    now
  });
  deps.reviewSubmissionRepository.updateAssignmentStatus("assign-1", "active");

  // Decision + author visibility.
  deps.paperDecisionRepository.papers.clear();
  deps.paperDecisionRepository.decisionsByPaper.clear();
  deps.paperDecisionRepository.seedPaper({
    paperId: "paper-1",
    title: "Seeded Paper 1",
    editorId: "editor-1",
    completedReviewCount: 1,
    decisionPeriodOpen: true,
    status: "under_review",
    authors: ["author-1"],
    reviewHighlights: ["Strong methodology", "Good novelty"],
    fullReviewContent: "Full seeded review content.",
    notificationAvailable: true,
    notificationDeliveryStatus: "sent"
  });

  // Schedule (draft + published for edit/public UCs).
  deps.scheduleDraftRepository.conferences.clear();
  deps.scheduleDraftRepository.drafts.clear();
  deps.scheduleDraftRepository.publishedByConference.clear();
  deps.scheduleDraftRepository.seedConference({
    conferenceId: "conf-1",
    acceptedPapers: [{ paperId: "paper-1", title: "Seeded Paper 1" }],
    rooms: [
      { roomId: "room-a", roomName: "Room A", available: true },
      { roomId: "room-b", roomName: "Room B", available: true }
    ],
    parameters: { slotMinutes: 30, totalSlots: 4, startMinute: 540 },
    editorIds: ["editor-1"],
    editLocked: false,
    lockReason: null
  });
  const seededSchedule = {
    draftId: "sched-draft-1",
    conferenceId: "conf-1",
    status: "published",
    grid: { rooms: ["Room A", "Room B"], slots: ["09:00", "09:30"] },
    placements: [{ paperId: "paper-1", room: "Room A", slot: 0 }],
    conflicts: [],
    entries: [
      {
        entryId: "entry-1",
        day: "Day 1",
        time: "09:00",
        room: "Room A",
        title: "Seeded Session",
        presenter: "Author A"
      }
    ],
    createdAt: now.toISOString()
  };
  deps.scheduleDraftRepository.drafts.set("sched-draft-1", seededSchedule);
  deps.scheduleDraftRepository.publishedByConference.set("conf-1", seededSchedule);
  deps.scheduleEditVersions.set("conf-1", 1);
  deps.scheduleDraftRepository.seedPublishedPricing({
    conferenceId: "conf-1",
    categories: [
      { categoryId: "regular", categoryName: "Regular", finalAmountCad: 300, complete: true },
      { categoryId: "student", categoryName: "Student", finalAmountCad: 150, complete: true }
    ]
  });

  // Payments + tickets.
  deps.paymentWorkflowStore.registrations.clear();
  deps.paymentWorkflowStore.attempts.clear();
  deps.paymentWorkflowStore.paymentRecords.clear();
  deps.paymentWorkflowStore.reconciliationItems.clear();
  deps.paymentWorkflowStore.seedRegistration({
    registrationId: "reg-1",
    attendeeId: "author-1",
    categoryId: "regular",
    amount: 300,
    currency: "CAD",
    state: "unpaid"
  });
  deps.paymentWorkflowStore.seedRegistration({
    registrationId: "reg-2",
    attendeeId: "author-1",
    categoryId: "regular",
    amount: 300,
    currency: "CAD",
    state: "paid_confirmed"
  });
  deps.paymentWorkflowStore.updateRegistration("reg-2", { paymentId: "pay-seeded-1" });

  deps.ticketStore.ticketByRegistrationId.clear();
  deps.ticketStore.pdfByRegistrationId.clear();

  // Public announcements.
  deps.announcementStore.items.clear();
  deps.announcementStore.seedAnnouncements([
    {
      announcementId: "ann-1",
      title: "Welcome",
      summary: "Conference updates",
      content: "Seeded public announcement content",
      publishedAt: now.toISOString(),
      isPublic: true,
      isAvailable: true
    }
  ]);

  return {
    seeded: true,
    ids: {
      submissionId: "sub-1",
      draftId: "draft-1",
      paperId: "paper-1",
      invitationId: "inv-1",
      assignmentId: "assign-1",
      reviewId: seededSubmitted.reviewId,
      conferenceId: "conf-1",
      scheduleDraftId: "sched-draft-1",
      entryId: "entry-1",
      registrationId: "reg-1",
      paidRegistrationId: "reg-2",
      refereeId: "ref-1",
      announcementId: "ann-1"
    },
    users: {
      author: { id: "author-1", email: "author@example.com", role: "author" },
      editor: { id: "editor-1", email: "editor@example.com", role: "editor" },
      referee: { id: "ref-1", email: "referee@example.com", role: "referee" }
    },
    defaultPassword: "Password123!"
  };
}

export function createServerApp(customDeps = {}) {
  let clockOffsetMs = 0;
  const deps = {
    ...createDefaultDeps(),
    ...customDeps
  };
  if (!customDeps.nowProvider) {
    deps.nowProvider = () => new Date(Date.now() + clockOffsetMs);
  }
  const routeMap = createRegistrationRoutes(deps);
  const routes = compileRoutes(routeMap);

  return http.createServer(async (req, res) => {
    try {
      const method = String(req.method ?? "GET").toUpperCase();
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = url.pathname;

      const servedFrontend = await tryServeFrontend(req, res, pathname);
      if (servedFrontend) {
        return;
      }

      if (method === "POST" && pathname === "/api/v1/dev/seed-demo") {
        const seeded = seedDemoData(deps);
        sendResult(res, { status: 200, body: seeded });
        return;
      }

      if (method === "GET" && pathname === "/api/v1/dev/verification-token") {
        const email = String(url.searchParams.get("email") ?? "").trim().toLowerCase();
        if (!email) {
          sendResult(res, {
            status: 400,
            body: { code: "EMAIL_REQUIRED", message: "email query parameter is required." }
          });
          return;
        }
        const outbox = deps.verificationEmailService?.outbox ?? [];
        const latest = [...outbox].reverse().find((entry) => String(entry.email ?? "").toLowerCase() === email);
        if (!latest) {
          sendResult(res, {
            status: 404,
            body: { code: "TOKEN_NOT_FOUND", message: "No verification token found for email." }
          });
          return;
        }
        sendResult(res, {
          status: 200,
          body: { email, token: latest.token, expiresAt: latest.expiresAt }
        });
        return;
      }

      if (method === "POST" && pathname === "/api/v1/dev/time/reset") {
        clockOffsetMs = 0;
        sendResult(res, {
          status: 200,
          body: { status: "OK", offsetMs: clockOffsetMs, now: deps.nowProvider().toISOString() }
        });
        return;
      }

      if (method === "POST" && pathname === "/api/v1/dev/time/advance") {
        const body = await readBody(req);
        const deltaMs = Number(body?.ms);
        if (!Number.isFinite(deltaMs)) {
          sendResult(res, {
            status: 400,
            body: { code: "INVALID_MS", message: "Body field 'ms' must be a finite number." }
          });
          return;
        }
        clockOffsetMs += deltaMs;
        sendResult(res, {
          status: 200,
          body: { status: "OK", offsetMs: clockOffsetMs, now: deps.nowProvider().toISOString() }
        });
        return;
      }

      if (method === "POST" && pathname === "/api/v1/dev/forms/force-persistence-failure") {
        if (deps.atomicPersistence?.forceNextFailure) {
          deps.atomicPersistence.forceNextFailure();
          sendResult(res, { status: 200, body: { status: "OK", armed: true } });
          return;
        }
        sendResult(res, {
          status: 503,
          body: { code: "FORM_PERSISTENCE_UNAVAILABLE", message: "Atomic persistence service is unavailable." }
        });
        return;
      }

      if (method === "GET" && pathname === "/api/v1/dev/forms/record") {
        const recordId = String(url.searchParams.get("recordId") ?? "").trim();
        if (!recordId) {
          sendResult(res, {
            status: 400,
            body: { code: "RECORD_ID_REQUIRED", message: "recordId query parameter is required." }
          });
          return;
        }
        const record = deps.formSubmissionRepository?.getRecord ? deps.formSubmissionRepository.getRecord(recordId) : null;
        if (!record) {
          sendResult(res, {
            status: 404,
            body: { code: "RECORD_NOT_FOUND", message: "No form record found for recordId." }
          });
          return;
        }
        sendResult(res, { status: 200, body: { status: "OK", record } });
        return;
      }

      let matchedRoute = null;
      let params = null;
      for (const route of routes) {
        if (route.method !== method) {
          continue;
        }
        const maybeParams = route.match(pathname);
        if (maybeParams) {
          matchedRoute = route;
          params = maybeParams;
          break;
        }
      }

      if (!matchedRoute) {
        sendResult(res, {
          status: 404,
          body: {
            code: "NOT_FOUND",
            message: "No route matches this request."
          }
        });
        return;
      }

      const body = await readBody(req);
      const request = {
        params,
        query: Object.fromEntries(url.searchParams.entries()),
        body,
        file: body && typeof body === "object" ? body.file : undefined,
        headers: req.headers,
        user: parseUser(req.headers),
        sessionId: req.headers["x-session-id"]
      };

      const result = matchedRoute.handler(request);
      sendResult(res, result);
    } catch (error) {
      sendResult(res, {
        status: 500,
        body: {
          code: "UNHANDLED_SERVER_ERROR",
          message: "Unexpected server error.",
          details: String(error?.message ?? error)
        }
      });
    }
  });
}

export function startServer({ port = Number(process.env.PORT ?? 3000) } = {}) {
  const server = createServerApp();
  server.listen(port, () => {
    const address = server.address();
    const resolvedPort = typeof address === "object" && address ? address.port : port;
    process.stdout.write(`CMS1 API listening on http://localhost:${resolvedPort}\n`);
  });
  return server;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const thisFilePath = fileURLToPath(import.meta.url);

if (entryPath && thisFilePath === entryPath) {
  startServer();
}
