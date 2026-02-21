const UC_ITEMS = [
  {
    id: "UC-01",
    title: "Registration",
    goal: "Author registers and gets pending verification state.",
    alt: "Alt path: invalid email/password returns validation errors.",
    endpoint: { method: "POST", path: "/api/v1/registrations", body: { email: "author@example.com", password: "Password123!", confirmPassword: "Password123!" } }
  },
  {
    id: "UC-02",
    title: "Validation Rules",
    goal: "Input validation and clear field-level feedback behavior.",
    alt: "Placeholder: run UC-01/UC-05 calls with invalid data to observe validation paths.",
    endpoint: null
  },
  {
    id: "UC-03",
    title: "Login",
    goal: "User logs in and receives an authenticated session response.",
    alt: "Alt path: unknown/wrong credentials return generic invalid response.",
    endpoint: { method: "POST", path: "/api/v1/auth/login", body: { email: "author@example.com", password: "Password123!" } }
  },
  {
    id: "UC-04",
    title: "Password Change",
    goal: "Authenticated account updates password and invalidates session.",
    alt: "Alt path: weak/reused/mismatch values return policy errors.",
    endpoint: { method: "PUT", path: "/api/v1/account/password", body: { currentPassword: "Password123!", newPassword: "NewPassword123!", confirmNewPassword: "NewPassword123!" } }
  },
  {
    id: "UC-05",
    title: "Manuscript Submission",
    goal: "Author submits metadata + file and gets finalized submission.",
    alt: "Alt path: bad metadata/file returns validation failure.",
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
        main_reference_source: "Demo bibliography",
        file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" }
      }
    }
  },
  {
    id: "UC-06",
    title: "Upload Manuscript",
    goal: "Upload/attach manuscript for an existing submission.",
    alt: "Alt path: oversize/invalid file rejects attachment.",
    endpoint: { method: "POST", path: "/api/v1/submissions/:submissionId/manuscript", params: { submissionId: "sub-1" }, body: { mode: "RESTART", file_fingerprint: "fp-1", file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" } } }
  },
  {
    id: "UC-07",
    title: "Save Draft",
    goal: "Save working draft state without finalizing.",
    alt: "Alt path: invalid draft data returns validation failed.",
    endpoint: { method: "POST", path: "/api/v1/drafts/:draftId/save", params: { draftId: "draft-1" }, body: { editable_state: { title: "Draft Title" } } }
  },
  {
    id: "UC-08",
    title: "Referee Assignment",
    goal: "Editor assigns referees to a paper.",
    alt: "Alt path: invalid selection or invitation failure blocks commit.",
    endpoint: { method: "POST", path: "/api/v1/papers/:paperId/assignments", params: { paperId: "paper-1" }, body: { referee_ids: ["ref-1"], expected_version: 1 } }
  },
  {
    id: "UC-09",
    title: "Workload Limits",
    goal: "Check/assign referee under workload rules.",
    alt: "Alt path: equal/over limit blocks assignment.",
    endpoint: { method: "POST", path: "/api/v1/papers/:paperId/assign-referee", params: { paperId: "paper-1" }, body: { referee_id: "ref-1", role: "reviewer", track_id: "AI", selection_snapshot: { at: new Date().toISOString() } } }
  },
  {
    id: "UC-10",
    title: "Invitation Response",
    goal: "Referee accepts or rejects review invitation.",
    alt: "Alt path: expired/invalid invitation stays pending.",
    endpoint: { method: "POST", path: "/api/v1/invitations/:invitationId/response", params: { invitationId: "inv-1" }, body: { decision: "ACCEPT", expected_status: "pending" } }
  },
  {
    id: "UC-11",
    title: "Assigned Paper Access",
    goal: "Referee accesses assigned paper list/content.",
    alt: "Alt path: non-assigned access returns forbidden.",
    endpoint: { method: "GET", path: "/api/v1/referees/:refereeId/assigned-papers", params: { refereeId: "ref-1" } }
  },
  {
    id: "UC-12",
    title: "Submit Review",
    goal: "Referee submits review with required fields.",
    alt: "Alt path: missing required fields returns validation errors.",
    endpoint: { method: "POST", path: "/api/v1/assignments/:assignmentId/reviews/submit", params: { assignmentId: "assign-1" }, body: { confirm_submit: true, recommendation: "ACCEPT", comments: "Looks good", fields: { originality: 4, significance: 4 } } }
  },
  {
    id: "UC-13",
    title: "Anonymized Review View",
    goal: "Editor views anonymized completed reviews.",
    alt: "Alt path: unavailable review returns not found/failure.",
    endpoint: { method: "GET", path: "/api/v1/papers/:paperId/completed-reviews", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-14",
    title: "Paper Decision",
    goal: "Editor records final accept/reject decision.",
    alt: "Alt path: ineligible state or missing reviews blocks decision.",
    endpoint: { method: "POST", path: "/api/v1/papers/:paperId/decision", params: { paperId: "paper-1" }, body: { outcome: "ACCEPT", comment: "Meets criteria", confirm: true, allowNoReviewsOverride: false } }
  },
  {
    id: "UC-15",
    title: "Decision Notification",
    goal: "Author views decision and notification content.",
    alt: "Alt path: not owner/undecided returns access/under-review status.",
    endpoint: { method: "GET", path: "/api/v1/author/papers/:paperId/decision-notification", params: { paperId: "paper-1" } }
  },
  {
    id: "UC-16",
    title: "Generate Schedule",
    goal: "Generate conference schedule draft.",
    alt: "Alt path: missing params or no accepted papers blocks generation.",
    endpoint: { method: "POST", path: "/api/v1/conferences/:conferenceId/schedule/generate", params: { conferenceId: "conf-1" }, body: { rooms: ["A", "B"], dayStart: "09:00", dayEnd: "17:00", slotMinutes: 30, seed: "demo-seed" } }
  },
  {
    id: "UC-17",
    title: "Edit Schedule",
    goal: "Load and save schedule edits.",
    alt: "Alt path: conflict/lock/stale version returns rejection.",
    endpoint: { method: "POST", path: "/api/v1/conferences/:conferenceId/schedule/save", params: { conferenceId: "conf-1" }, body: { expectedVersion: 1, edits: [{ type: "MOVE", paperId: "paper-1", room: "A", slot: 0 }] } }
  },
  {
    id: "UC-18",
    title: "Public Schedule PDF",
    goal: "Public user opens schedule and PDF output.",
    alt: "Alt path: unpublished schedule returns not found.",
    endpoint: { method: "GET", path: "/api/v1/public/conferences/:conferenceId/schedule.pdf", params: { conferenceId: "conf-1" }, query: { disposition: "inline" } }
  },
  {
    id: "UC-19",
    title: "Registration Prices",
    goal: "Public pricing display for registration categories.",
    alt: "Alt path: unpublished/retrieval failure returns unavailable.",
    endpoint: { method: "GET", path: "/api/v1/public/registration-prices" }
  },
  {
    id: "UC-20",
    title: "Online Payment",
    goal: "Initiate/confirm payment workflow.",
    alt: "Alt path: declined/timeout leaves unpaid or unresolved state.",
    endpoint: { method: "POST", path: "/api/v1/registrations/:registrationId/payment/initiate", params: { registrationId: "reg-1" }, body: { categoryId: "regular" } }
  },
  {
    id: "UC-21",
    title: "Registration Ticket",
    goal: "Issue and retrieve ticket for paid registration.",
    alt: "Alt path: pending payment blocks ticket issuance.",
    endpoint: { method: "POST", path: "/api/v1/registrations/:registrationId/ticket/issue", params: { registrationId: "reg-1" }, body: { deliveryMode: "download" } }
  },
  {
    id: "UC-22",
    title: "Public Announcements",
    goal: "List and open public announcement details.",
    alt: "Alt path: unavailable item returns safe not-found response.",
    endpoint: { method: "GET", path: "/api/v1/public/announcements" }
  }
];

const context = {
  userId: document.getElementById("user-id"),
  userEmail: document.getElementById("user-email"),
  userRole: document.getElementById("user-role"),
  sessionId: document.getElementById("session-id")
};

const ucListEl = document.getElementById("uc-list");
const filterEl = document.getElementById("uc-filter");

function safeJsonParse(text, fallback = {}) {
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
  const saved = safeJsonParse(raw, {});
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

function buildHeaders(method, hasBody) {
  const headers = {};
  if (hasBody && method !== "GET") headers["content-type"] = "application/json";
  if (context.userId.value.trim()) headers["x-user-id"] = context.userId.value.trim();
  if (context.userEmail.value.trim()) headers["x-user-email"] = context.userEmail.value.trim();
  if (context.userRole.value.trim()) headers["x-user-role"] = context.userRole.value.trim();
  if (context.sessionId.value.trim()) headers["x-session-id"] = context.sessionId.value.trim();
  return headers;
}

function interpolatePath(pathTemplate, params) {
  let path = pathTemplate;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, encodeURIComponent(String(value)));
  });
  return path;
}

function createArea(labelText, value) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const area = document.createElement("textarea");
  area.value = JSON.stringify(value ?? {}, null, 2);
  label.appendChild(area);
  return { label, area };
}

function createUcCard(item) {
  const card = document.createElement("article");
  card.className = "uc-card";

  const endpointText = item.endpoint
    ? `${item.endpoint.method} ${item.endpoint.path}`
    : "Placeholder only (no direct endpoint mapped)";

  card.innerHTML = `
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
  output.textContent = "No call yet.";

  let paramsArea = null;
  let queryArea = null;
  let bodyArea = null;

  if (item.endpoint) {
    const paramsSection = createArea("Path params JSON", item.endpoint.params ?? {});
    const querySection = createArea("Query JSON", item.endpoint.query ?? {});
    const bodySection = createArea("Body JSON", item.endpoint.body ?? {});
    paramsArea = paramsSection.area;
    queryArea = querySection.area;
    bodyArea = bodySection.area;

    grid.append(paramsSection.label, querySection.label, bodySection.label);
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  const runButton = document.createElement("button");
  runButton.type = "button";
  runButton.textContent = item.endpoint ? "Run Primary Action" : "Placeholder";
  runButton.disabled = !item.endpoint;
  actions.appendChild(runButton);

  runButton.addEventListener("click", async () => {
    if (!item.endpoint) return;
    saveContext();
    const params = safeJsonParse(paramsArea.value, {});
    const query = safeJsonParse(queryArea.value, {});
    const body = safeJsonParse(bodyArea.value, {});
    const path = interpolatePath(item.endpoint.path, params);
    const queryStr = new URLSearchParams(Object.entries(query).filter(([, v]) => v !== "" && v !== null && v !== undefined).map(([k, v]) => [k, String(v)])).toString();
    const url = queryStr ? `${path}?${queryStr}` : path;
    const hasBody = item.endpoint.method !== "GET";

    runButton.disabled = true;
    try {
      const started = performance.now();
      const response = await fetch(url, {
        method: item.endpoint.method,
        headers: buildHeaders(item.endpoint.method, hasBody),
        body: hasBody ? JSON.stringify(body) : undefined
      });
      const elapsed = Math.round(performance.now() - started);
      const text = await response.text();
      let payload = text;
      try {
        payload = JSON.parse(text);
      } catch {
        // keep raw text
      }
      output.textContent = `${item.endpoint.method} ${url}\nStatus: ${response.status} (${elapsed}ms)\n\n${typeof payload === "string" ? payload : JSON.stringify(payload, null, 2)}`;
    } catch (error) {
      output.textContent = `Request failed: ${String(error?.message ?? error)}`;
    } finally {
      runButton.disabled = false;
    }
  });

  card.appendChild(grid);
  card.appendChild(actions);
  card.appendChild(output);
  return card;
}

function render(filter = "") {
  const query = filter.trim().toLowerCase();
  ucListEl.innerHTML = "";
  for (const item of UC_ITEMS) {
    const endpoint = item.endpoint ? `${item.endpoint.method} ${item.endpoint.path}` : "placeholder";
    const haystack = `${item.id} ${item.title} ${item.goal} ${endpoint}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;
    ucListEl.appendChild(createUcCard(item));
  }
}

document.getElementById("save-context").addEventListener("click", saveContext);
document.getElementById("clear-context").addEventListener("click", clearContext);
filterEl.addEventListener("input", () => render(filterEl.value));

loadContext();
render();
