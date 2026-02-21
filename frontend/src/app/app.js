const PARAM_DEFAULTS = {
  submissionId: "sub-1",
  draftId: "draft-1",
  paperId: "paper-1",
  invitationId: "inv-1",
  assignmentId: "assign-1",
  reviewId: "review-1",
  conferenceId: "conf-1",
  registrationId: "reg-1",
  refereeId: "ref-1",
  announcementId: "ann-1",
  entryId: "entry-1",
  draftScheduleId: "sched-draft-1"
};

const USERS = {
  author: { id: "author-1", email: "author@example.com", role: "author" },
  editor: { id: "editor-1", email: "editor@example.com", role: "editor" },
  referee: { id: "ref-1", email: "referee@example.com", role: "referee" },
  admin: { id: "admin-1", email: "admin@example.com", role: "admin" }
};

const UC_ITEMS = [
  {
    id: "UC-01",
    title: "Registration",
    goal: "Author registers and receives pending verification response.",
    alt: "Alt path: invalid/missing fields return validation errors.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "author@example.com", password: "Password123!", confirmPassword: "Password123!" }
    }
  },
  { id: "UC-02", title: "Validation Rules", goal: "Validation behavior and error feedback are visible.", alt: "Placeholder: use invalid data in UC-01/05/07/12 to observe alternative paths.", actor: "author", endpoint: null },
  {
    id: "UC-03",
    title: "Login",
    goal: "User logs in and gets session response.",
    alt: "Alt path: wrong credentials return generic invalid response.",
    actor: "author",
    endpoint: { method: "POST", path: "/api/v1/auth/login", body: { email: "author@example.com", password: "Password123!" } }
  },
  {
    id: "UC-04",
    title: "Password Change",
    goal: "Authenticated user updates account password.",
    alt: "Alt path: policy failures reject the update.",
    actor: "author",
    endpoint: {
      method: "PUT",
      path: "/api/v1/account/password",
      body: { currentPassword: "Password123!", newPassword: "NewPassword123!", confirmNewPassword: "NewPassword123!" }
    }
  },
  {
    id: "UC-05",
    title: "Manuscript Submission",
    goal: "Author submits manuscript metadata and file.",
    alt: "Alt path: metadata/file validation blocks submission.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/submissions",
      body: {
        author_names: "A. Author",
        author_affiliations: "Example University",
        author_contact_email: "author@example.com",
        author_contact_phone: "+1 (555) 123-4567",
        abstract_text: "Sample abstract",
        keywords: "cms, review",
        main_reference_source: "Seeded references",
        file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" }
      }
    }
  },
  {
    id: "UC-06",
    title: "Upload Manuscript",
    goal: "Attach manuscript file to submission.",
    alt: "Alt path: interrupted/invalid upload returns retriable errors.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/submissions/:submissionId/manuscript",
      params: { submissionId: "sub-1" },
      body: { mode: "RESTART", file_fingerprint: "fp-1", file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" } }
    }
  },
  {
    id: "UC-07",
    title: "Save Draft",
    goal: "Save editable draft state.",
    alt: "Alt path: invalid draft fields return validation failed.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/drafts/:draftId/save",
      params: { draftId: "draft-1" },
      body: { editable_state: { title: "Draft title", abstract: "Draft abstract", contact_email: "author@example.com" } }
    }
  },
  {
    id: "UC-08",
    title: "Referee Assignment",
    goal: "Editor assigns referees to paper.",
    alt: "Alt path: invalid selections/invitation failures reject assignment.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/assignments",
      params: { paperId: "paper-1" },
      body: { referee_ids: ["ref-1"], expected_version: 1 }
    }
  },
  {
    id: "UC-09",
    title: "Workload Limits",
    goal: "Editor assigns referee under workload policy.",
    alt: "Alt path: limit reached returns workload error.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/assign-referee",
      params: { paperId: "paper-1" },
      body: { referee_id: "ref-1", role: "reviewer", track_id: "AI", selection_snapshot: { at: new Date().toISOString() } }
    }
  },
  {
    id: "UC-10",
    title: "Invitation Response",
    goal: "Referee responds to invitation.",
    alt: "Alt path: expired/invalid invitation response is rejected.",
    actor: "referee",
    endpoint: {
      method: "POST",
      path: "/api/v1/invitations/:invitationId/response",
      params: { invitationId: "inv-1" },
      body: { decision: "ACCEPT", expected_status: "pending" }
    }
  },
  {
    id: "UC-11",
    title: "Assigned Paper Access",
    goal: "Referee views assigned papers.",
    alt: "Alt path: identity mismatch returns auth error.",
    actor: "referee",
    endpoint: { method: "GET", path: "/api/v1/referees/:refereeId/assigned-papers", params: { refereeId: "ref-1" } }
  },
  {
    id: "UC-12",
    title: "Submit Review",
    goal: "Referee submits review form.",
    alt: "Alt path: missing required fields rejected.",
    actor: "referee",
    endpoint: {
      method: "POST",
      path: "/api/v1/assignments/:assignmentId/reviews/submit",
      params: { assignmentId: "assign-1" },
      body: { confirm_submit: true, recommendation: "accept", comments: "Looks solid.", fields: { originality: 4, significance: 4 } }
    }
  },
  {
    id: "UC-13",
    title: "Anonymized Review View",
    goal: "Editor lists completed anonymized reviews.",
    alt: "Alt path: no completed reviews or access denied.",
    actor: "editor",
    endpoint: { method: "GET", path: "/api/v1/papers/:paperId/completed-reviews", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-14",
    title: "Paper Decision",
    goal: "Editor posts final accept/reject decision.",
    alt: "Alt path: ineligible/closed state blocks decision.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/papers/:paperId/decision",
      params: { paperId: "paper-1" },
      body: { outcome: "accept", comment: "Decision recorded.", confirm: true, allowNoReviewsOverride: false }
    }
  },
  {
    id: "UC-15",
    title: "Decision Notification",
    goal: "Author retrieves decision notification.",
    alt: "Alt path: under-review or unauthorized cases.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/author/papers/:paperId/decision-notification", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-16",
    title: "Generate Schedule",
    goal: "Editor generates schedule draft.",
    alt: "Alt path: missing prerequisites block generation.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/conferences/:conferenceId/schedule/generate",
      params: { conferenceId: "conf-1" },
      body: { seed: 42 }
    }
  },
  {
    id: "UC-17",
    title: "Edit Schedule",
    goal: "Editor saves schedule edits.",
    alt: "Alt path: version conflict/policy lock blocks save.",
    actor: "editor",
    endpoint: {
      method: "POST",
      path: "/api/v1/conferences/:conferenceId/schedule/save",
      params: { conferenceId: "conf-1" },
      body: { expectedVersion: 1, edits: { placements: [{ paperId: "paper-1", room: "Room B", slot: "09:30" }], conflicts: [] } }
    }
  },
  {
    id: "UC-18",
    title: "Public Schedule PDF",
    goal: "Public user retrieves schedule PDF.",
    alt: "Alt path: not published returns unavailable.",
    actor: "author",
    endpoint: {
      method: "GET",
      path: "/api/v1/public/conferences/:conferenceId/schedule.pdf",
      params: { conferenceId: "conf-1" },
      query: { disposition: "inline" }
    }
  },
  {
    id: "UC-19",
    title: "Registration Prices",
    goal: "Public pricing retrieval.",
    alt: "Alt path: unpublished pricing unavailable.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/public/registration-prices" }
  },
  {
    id: "UC-20",
    title: "Online Payment",
    goal: "Initiate payment for registration.",
    alt: "Alt path: duplicate/unavailable registration blocked.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations/:registrationId/payment/initiate",
      params: { registrationId: "reg-1" },
      body: { categoryId: "regular" }
    }
  },
  {
    id: "UC-21",
    title: "Registration Ticket",
    goal: "Issue ticket for paid registration.",
    alt: "Alt path: unpaid registration cannot issue ticket.",
    actor: "author",
    endpoint: {
      method: "POST",
      path: "/api/v1/registrations/:registrationId/ticket/issue",
      params: { registrationId: "reg-2" },
      body: { deliveryMode: "download" }
    }
  },
  {
    id: "UC-22",
    title: "Public Announcements",
    goal: "Retrieve public announcements list.",
    alt: "Alt path: no data/retrieval failure states.",
    actor: "author",
    endpoint: { method: "GET", path: "/api/v1/public/announcements" }
  }
];

const context = {
  userId: document.getElementById("user-id"),
  userEmail: document.getElementById("user-email"),
  userRole: document.getElementById("user-role"),
  sessionId: document.getElementById("session-id")
};

const listEl = document.getElementById("uc-list");
const filterEl = document.getElementById("uc-filter");
const cards = new Map();

function parseJson(text, fallback = {}) {
  try {
    return text.trim() ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
}

function saveContext() {
  const value = {
    userId: context.userId.value.trim(),
    userEmail: context.userEmail.value.trim(),
    userRole: context.userRole.value.trim(),
    sessionId: context.sessionId.value.trim()
  };
  localStorage.setItem("cms1-uc-context", JSON.stringify(value));
}

function loadContext() {
  const raw = localStorage.getItem("cms1-uc-context");
  if (!raw) return;
  const saved = parseJson(raw, {});
  context.userId.value = saved.userId ?? "";
  context.userEmail.value = saved.userEmail ?? "";
  context.userRole.value = saved.userRole ?? "";
  context.sessionId.value = saved.sessionId ?? "";
}

function clearContext() {
  context.userId.value = "";
  context.userEmail.value = "";
  context.userRole.value = "";
  context.sessionId.value = "";
  localStorage.removeItem("cms1-uc-context");
}

function ensureActorContext(actor) {
  const user = USERS[actor];
  if (!user) return;
  if (!context.userId.value.trim()) context.userId.value = user.id;
  if (!context.userEmail.value.trim()) context.userEmail.value = user.email;
  if (!context.userRole.value.trim()) context.userRole.value = user.role;
}

function headersFor(hasBody) {
  const headers = {};
  if (hasBody) headers["content-type"] = "application/json";
  if (context.userId.value.trim()) headers["x-user-id"] = context.userId.value.trim();
  if (context.userEmail.value.trim()) headers["x-user-email"] = context.userEmail.value.trim();
  if (context.userRole.value.trim()) headers["x-user-role"] = context.userRole.value.trim();
  if (context.sessionId.value.trim()) headers["x-session-id"] = context.sessionId.value.trim();
  return headers;
}

function fillPath(path, params) {
  let out = path;
  Object.entries(params).forEach(([k, v]) => {
    out = out.replace(`:${k}`, encodeURIComponent(String(v)));
  });
  return out;
}

function setOutput(id, text) {
  const card = cards.get(id);
  if (!card) return;
  card.output.textContent = text;
}

function updateParamsFromSeed(ids = {}) {
  if (ids.submissionId) PARAM_DEFAULTS.submissionId = ids.submissionId;
  if (ids.draftId) PARAM_DEFAULTS.draftId = ids.draftId;
  if (ids.paperId) PARAM_DEFAULTS.paperId = ids.paperId;
  if (ids.invitationId) PARAM_DEFAULTS.invitationId = ids.invitationId;
  if (ids.assignmentId) PARAM_DEFAULTS.assignmentId = ids.assignmentId;
  if (ids.reviewId) PARAM_DEFAULTS.reviewId = ids.reviewId;
  if (ids.conferenceId) PARAM_DEFAULTS.conferenceId = ids.conferenceId;
  if (ids.registrationId) PARAM_DEFAULTS.registrationId = ids.registrationId;
  if (ids.paidRegistrationId) PARAM_DEFAULTS.paidRegistrationId = ids.paidRegistrationId;
  if (ids.refereeId) PARAM_DEFAULTS.refereeId = ids.refereeId;
  if (ids.announcementId) PARAM_DEFAULTS.announcementId = ids.announcementId;
  if (ids.entryId) PARAM_DEFAULTS.entryId = ids.entryId;
  if (ids.scheduleDraftId) PARAM_DEFAULTS.draftScheduleId = ids.scheduleDraftId;
}

async function seedDemoData() {
  const response = await fetch("/api/v1/dev/seed-demo", { method: "POST" });
  const payload = await response.json();
  updateParamsFromSeed(payload.ids ?? {});
  if (payload.users?.author) {
    context.userId.value = payload.users.author.id;
    context.userEmail.value = payload.users.author.email;
    context.userRole.value = payload.users.author.role;
  }
  saveContext();
  render(filterEl.value);
  return payload;
}

async function executeUc(item) {
  if (!item.endpoint) {
    setOutput(item.id, "Placeholder only. Use alternate-path notes for manual checks.");
    return { uc: item.id, status: "placeholder" };
  }
  const card = cards.get(item.id);
  ensureActorContext(item.actor);
  saveContext();

  const params = parseJson(card.paramsArea.value, {});
  const query = parseJson(card.queryArea.value, {});
  const body = parseJson(card.bodyArea.value, {});
  const path = fillPath(item.endpoint.path, params);
  const search = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  });
  const url = search.size > 0 ? `${path}?${search.toString()}` : path;
  const hasBody = item.endpoint.method !== "GET";
  const started = performance.now();
  const response = await fetch(url, {
    method: item.endpoint.method,
    headers: headersFor(hasBody),
    body: hasBody ? JSON.stringify(body) : undefined
  });
  const elapsed = Math.round(performance.now() - started);
  const text = await response.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {
    // keep text
  }
  setOutput(
    item.id,
    `${item.endpoint.method} ${url}\nActor: ${item.actor}\nStatus: ${response.status} (${elapsed}ms)\n\n${typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)}`
  );
  return { uc: item.id, status: response.status };
}

function makeArea(labelText, value) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const area = document.createElement("textarea");
  area.value = JSON.stringify(value ?? {}, null, 2);
  label.appendChild(area);
  return { label, area };
}

function defaultParamsFor(path, seeded = {}) {
  const names = [...path.matchAll(/:([a-zA-Z0-9_]+)/g)].map((m) => m[1]);
  const params = { ...seeded };
  for (const name of names) {
    if (params[name] !== undefined) continue;
    if (name === "registrationId") params[name] = PARAM_DEFAULTS.registrationId;
    else if (name === "draftId" && path.includes("/schedule/drafts/")) params[name] = PARAM_DEFAULTS.draftScheduleId;
    else params[name] = PARAM_DEFAULTS[name] ?? `${name}-1`;
  }
  return params;
}

function makeCard(item) {
  const article = document.createElement("article");
  article.className = "uc-card";

  const endpointText = item.endpoint ? `${item.endpoint.method} ${item.endpoint.path}` : "Placeholder";
  article.innerHTML = `
    <div class="uc-head">
      <div class="uc-id">${item.id} - ${item.title}</div>
      <div class="uc-endpoint">${endpointText}</div>
    </div>
    <p class="uc-goal">${item.goal}</p>
    <p class="uc-flow">${item.alt}</p>
  `;

  const grid = document.createElement("div");
  grid.className = "uc-grid";
  const output = document.createElement("pre");
  output.className = "uc-output";
  output.textContent = "No execution yet.";

  let paramsArea = null;
  let queryArea = null;
  let bodyArea = null;

  if (item.endpoint) {
    const paramDefaults = defaultParamsFor(item.endpoint.path, item.endpoint.params ?? {});
    const paramSection = makeArea("Path params JSON", paramDefaults);
    const querySection = makeArea("Query JSON", item.endpoint.query ?? {});
    const bodySection = makeArea("Body JSON", item.endpoint.body ?? {});
    paramsArea = paramSection.area;
    queryArea = querySection.area;
    bodyArea = bodySection.area;
    grid.append(paramSection.label, querySection.label, bodySection.label);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  const runBtn = document.createElement("button");
  runBtn.type = "button";
  runBtn.textContent = item.endpoint ? "Run Primary Action" : "Placeholder";
  runBtn.disabled = !item.endpoint;
  runBtn.addEventListener("click", async () => {
    runBtn.disabled = true;
    try {
      await executeUc(item);
    } catch (error) {
      setOutput(item.id, `Request failed: ${String(error?.message ?? error)}`);
    } finally {
      runBtn.disabled = false;
    }
  });
  actions.appendChild(runBtn);

  article.append(grid, actions, output);
  cards.set(item.id, { paramsArea, queryArea, bodyArea, output });
  return article;
}

function render(filter = "") {
  const query = filter.trim().toLowerCase();
  listEl.innerHTML = "";
  cards.clear();
  for (const item of UC_ITEMS) {
    const endpointText = item.endpoint ? `${item.endpoint.method} ${item.endpoint.path}` : "placeholder";
    const haystack = `${item.id} ${item.title} ${item.goal} ${endpointText}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;
    listEl.appendChild(makeCard(item));
  }
}

async function runAllUcs() {
  const runBtn = document.getElementById("run-all");
  const seedBtn = document.getElementById("seed-demo");
  runBtn.disabled = true;
  seedBtn.disabled = true;
  try {
    const seeded = await seedDemoData();
    const summary = [`Seeded demo data with IDs:`, JSON.stringify(seeded.ids ?? {}, null, 2), "", "Run results:"];
    for (const item of UC_ITEMS) {
      const result = await executeUc(item);
      summary.push(`${result.uc}: ${result.status}`);
    }
    setOutput("UC-22", `${cards.get("UC-22").output.textContent}\n\n--- RUN ALL SUMMARY ---\n${summary.join("\n")}`);
  } catch (error) {
    alert(`Run-all failed: ${String(error?.message ?? error)}`);
  } finally {
    runBtn.disabled = false;
    seedBtn.disabled = false;
  }
}

document.getElementById("save-context").addEventListener("click", saveContext);
document.getElementById("clear-context").addEventListener("click", clearContext);
document.getElementById("seed-demo").addEventListener("click", async () => {
  try {
    const payload = await seedDemoData();
    alert(`Seed complete.\n\n${JSON.stringify(payload.ids ?? {}, null, 2)}`);
  } catch (error) {
    alert(`Seed failed: ${String(error?.message ?? error)}`);
  }
});
document.getElementById("run-all").addEventListener("click", runAllUcs);
filterEl.addEventListener("input", () => render(filterEl.value));

loadContext();
render();
