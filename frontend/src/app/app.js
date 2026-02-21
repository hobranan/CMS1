const ROUTE_KEYS = [
  "/api/v1/account/password:PUT",
  "/api/v1/account/registrations/:registrationId/ticket.pdf:GET",
  "/api/v1/account/registrations/:registrationId/ticket:GET",
  "/api/v1/assignments/:assignmentId/review-draft:GET",
  "/api/v1/assignments/:assignmentId/reviews/submit:POST",
  "/api/v1/auth/login:POST",
  "/api/v1/auth/session:GET",
  "/api/v1/author/papers/:paperId/decision-notification:GET",
  "/api/v1/author/papers/:paperId/decision:GET",
  "/api/v1/conferences/:conferenceId/schedule/cancel:POST",
  "/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST",
  "/api/v1/conferences/:conferenceId/schedule/editable:GET",
  "/api/v1/conferences/:conferenceId/schedule/generate:POST",
  "/api/v1/conferences/:conferenceId/schedule/save:POST",
  "/api/v1/conferences/:conferenceId/schedule:GET",
  "/api/v1/drafts/:draftId/finalize:POST",
  "/api/v1/drafts/:draftId/save:POST",
  "/api/v1/drafts/:draftId:GET",
  "/api/v1/invitations/:invitationId/response:POST",
  "/api/v1/papers/:paperId/assign-referee:POST",
  "/api/v1/papers/:paperId/assignments:GET",
  "/api/v1/papers/:paperId/assignments:POST",
  "/api/v1/papers/:paperId/completed-reviews/:reviewId:GET",
  "/api/v1/papers/:paperId/completed-reviews:GET",
  "/api/v1/papers/:paperId/decision-context:GET",
  "/api/v1/papers/:paperId/decision:POST",
  "/api/v1/papers/:paperId/manuscript-view:GET",
  "/api/v1/papers/:paperId/review-form:GET",
  "/api/v1/payments/gateway/confirm:POST",
  "/api/v1/public/announcements/:announcementId:GET",
  "/api/v1/public/announcements:GET",
  "/api/v1/public/conferences/:conferenceId/schedule.pdf:GET",
  "/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET",
  "/api/v1/public/conferences/:conferenceId/schedule:GET",
  "/api/v1/public/registration-prices:GET",
  "/api/v1/referees/:refereeId/assigned-papers:GET",
  "/api/v1/referees/:refereeId/invitations/pending:GET",
  "/api/v1/referees/:refereeId/workload:GET",
  "/api/v1/registrations/:registrationId/payment/initiate:POST",
  "/api/v1/registrations/:registrationId/payment/status:GET",
  "/api/v1/registrations/:registrationId/ticket/issue:POST",
  "/api/v1/registrations/resend-confirmation:POST",
  "/api/v1/registrations/verify:GET",
  "/api/v1/registrations:POST",
  "/api/v1/reviews/:reviewId:GET",
  "/api/v1/submissions/:submissionId/manuscript/retry:POST",
  "/api/v1/submissions/:submissionId/manuscript:POST",
  "/api/v1/submissions/mine:GET",
  "/api/v1/submissions/upload-status:POST",
  "/api/v1/submissions:POST"
];

const BODY_PRESETS = {
  "/api/v1/registrations:POST": {
    email: "author@example.com",
    password: "Password123!",
    confirmPassword: "Password123!"
  },
  "/api/v1/registrations/resend-confirmation:POST": {
    email: "author@example.com"
  },
  "/api/v1/auth/login:POST": {
    email: "author@example.com",
    password: "Password123!"
  },
  "/api/v1/account/password:PUT": {
    currentPassword: "Password123!",
    newPassword: "NewPassword123!",
    confirmNewPassword: "NewPassword123!"
  },
  "/api/v1/submissions:POST": {
    author_names: "A. Author",
    author_affiliations: "Example University",
    author_contact_email: "author@example.com",
    author_contact_phone: "+1 (555) 123-4567",
    abstract_text: "Sample abstract",
    keywords: "cms, review",
    main_reference_source: "Demo bibliography",
    file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" }
  },
  "/api/v1/submissions/:submissionId/manuscript:POST": {
    mode: "RESTART",
    file_fingerprint: "fp-123",
    file: { fileName: "paper.pdf", sizeBytes: 102400, mimeType: "application/pdf" }
  },
  "/api/v1/submissions/:submissionId/manuscript/retry:POST": {
    mode: "RESUME",
    resume_offset_bytes: 0,
    file_fingerprint: "fp-123"
  },
  "/api/v1/drafts/:draftId/save:POST": {
    editable_state: { title: "Draft title", abstract: "Draft abstract" }
  },
  "/api/v1/drafts/:draftId/finalize:POST": {
    confirm: true,
    editable_state: { title: "Final title", abstract: "Final abstract" }
  },
  "/api/v1/papers/:paperId/assign-referee:POST": {
    referee_id: "ref-1",
    role: "reviewer",
    track_id: "AI",
    selection_snapshot: { at: new Date().toISOString() }
  },
  "/api/v1/papers/:paperId/assignments:POST": {
    referee_ids: ["ref-1"],
    expected_version: 1
  },
  "/api/v1/invitations/:invitationId/response:POST": {
    decision: "ACCEPT",
    expected_status: "pending"
  },
  "/api/v1/assignments/:assignmentId/reviews/submit:POST": {
    confirm_submit: true,
    recommendation: "ACCEPT",
    comments: "Looks good.",
    fields: { originality: 4, significance: 4 }
  },
  "/api/v1/papers/:paperId/decision:POST": {
    outcome: "ACCEPT",
    comment: "Meets criteria.",
    confirm: true,
    allowNoReviewsOverride: false
  },
  "/api/v1/conferences/:conferenceId/schedule/generate:POST": {
    rooms: ["A", "B"],
    dayStart: "09:00",
    dayEnd: "17:00",
    slotMinutes: 30,
    seed: "demo-seed"
  },
  "/api/v1/conferences/:conferenceId/schedule/save:POST": {
    expectedVersion: 1,
    edits: [{ type: "MOVE", paperId: "paper-1", room: "A", slot: 0 }]
  },
  "/api/v1/conferences/:conferenceId/schedule/cancel:POST": {
    reason: "No changes"
  },
  "/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST": {
    confirm: true
  },
  "/api/v1/registrations/:registrationId/payment/initiate:POST": {
    categoryId: "regular"
  },
  "/api/v1/payments/gateway/confirm:POST": {
    attemptId: "attempt-1",
    gatewayStatus: "SUCCESS",
    gatewayReference: "gw-ref-1",
    signature: "demo-signature"
  },
  "/api/v1/registrations/:registrationId/ticket/issue:POST": {
    deliveryMode: "download"
  },
  "/api/v1/submissions/upload-status:POST": {
    submission_id: "sub-1",
    status: "interrupted"
  }
};

const QUERY_PRESETS = {
  "/api/v1/registrations/verify:GET": { token: "paste-token-here" },
  "/api/v1/public/conferences/:conferenceId/schedule.pdf:GET": { disposition: "inline" },
  "/api/v1/referees/:refereeId/workload:GET": { role: "reviewer", track_id: "AI" }
};

const PARAM_PRESETS = {
  paperId: "paper-1",
  registrationId: "reg-1",
  submissionId: "sub-1",
  assignmentId: "assign-1",
  invitationId: "inv-1",
  refereeId: "ref-1",
  conferenceId: "conf-1",
  draftId: "draft-1",
  reviewId: "rev-1",
  announcementId: "ann-1",
  entryId: "entry-1"
};

const contextEls = {
  userId: document.getElementById("user-id"),
  userEmail: document.getElementById("user-email"),
  userRole: document.getElementById("user-role"),
  sessionId: document.getElementById("session-id")
};

const filterInput = document.getElementById("filter-input");
const endpointListEl = document.getElementById("endpoint-list");
const requestMetaEl = document.getElementById("request-meta");
const responseOutputEl = document.getElementById("response-output");

function parseRouteKey(routeKey) {
  const idx = routeKey.lastIndexOf(":");
  return {
    path: routeKey.slice(0, idx),
    method: routeKey.slice(idx + 1)
  };
}

function getCategory(path) {
  if (path.includes("/public/")) return "Public";
  if (path.includes("/auth/") || path.includes("/account/")) return "Auth/Account";
  if (path.includes("/registrations")) return "Registration";
  if (path.includes("/submissions")) return "Submissions";
  if (path.includes("/drafts")) return "Drafts";
  if (path.includes("/assignments") || path.includes("/assign-referee") || path.includes("/referees")) return "Assignment";
  if (path.includes("/invitations")) return "Invitations";
  if (path.includes("/reviews")) return "Reviews";
  if (path.includes("/decision")) return "Decisions";
  if (path.includes("/schedule")) return "Schedule";
  if (path.includes("/payment")) return "Payments";
  if (path.includes("/ticket")) return "Tickets";
  return "General";
}

function getParams(pathTemplate) {
  return Array.from(pathTemplate.matchAll(/:([a-zA-Z0-9_]+)/g)).map((m) => m[1]);
}

function safeJsonParse(text, fallback = {}) {
  if (!text || !text.trim()) return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function saveContext() {
  const value = {
    userId: contextEls.userId.value.trim(),
    userEmail: contextEls.userEmail.value.trim(),
    userRole: contextEls.userRole.value.trim(),
    sessionId: contextEls.sessionId.value.trim()
  };
  localStorage.setItem("cms1-context", JSON.stringify(value));
}

function loadContext() {
  const raw = localStorage.getItem("cms1-context");
  if (!raw) return;
  const saved = safeJsonParse(raw, {});
  contextEls.userId.value = saved.userId ?? "";
  contextEls.userEmail.value = saved.userEmail ?? "";
  contextEls.userRole.value = saved.userRole ?? "";
  contextEls.sessionId.value = saved.sessionId ?? "";
}

function clearContext() {
  contextEls.userId.value = "";
  contextEls.userEmail.value = "";
  contextEls.userRole.value = "";
  contextEls.sessionId.value = "";
  localStorage.removeItem("cms1-context");
}

function buildHeaders(method, hasBody) {
  const headers = {};
  if (hasBody && method !== "GET") {
    headers["content-type"] = "application/json";
  }
  if (contextEls.userId.value.trim()) headers["x-user-id"] = contextEls.userId.value.trim();
  if (contextEls.userEmail.value.trim()) headers["x-user-email"] = contextEls.userEmail.value.trim();
  if (contextEls.userRole.value.trim()) headers["x-user-role"] = contextEls.userRole.value.trim();
  if (contextEls.sessionId.value.trim()) headers["x-session-id"] = contextEls.sessionId.value.trim();
  return headers;
}

async function runRoute(routeKey, form) {
  const { path: pathTemplate, method } = parseRouteKey(routeKey);
  const paramNames = getParams(pathTemplate);

  let path = pathTemplate;
  for (const param of paramNames) {
    const input = form.querySelector(`input[name="param-${param}"]`);
    const value = input?.value?.trim() || PARAM_PRESETS[param] || "";
    path = path.replace(`:${param}`, encodeURIComponent(value));
  }

  const queryObj = safeJsonParse(form.querySelector('textarea[name="query"]').value, {});
  const query = new URLSearchParams();
  Object.entries(queryObj).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    query.set(k, String(v));
  });

  const bodyRaw = form.querySelector('textarea[name="body"]').value;
  const hasBody = bodyRaw.trim().length > 0 && method !== "GET";
  const bodyObj = hasBody ? safeJsonParse(bodyRaw, {}) : undefined;

  const url = query.size > 0 ? `${path}?${query.toString()}` : path;
  const started = performance.now();
  const response = await fetch(url, {
    method,
    headers: buildHeaders(method, hasBody),
    body: hasBody ? JSON.stringify(bodyObj) : undefined
  });
  const elapsedMs = Math.round(performance.now() - started);

  const contentType = response.headers.get("content-type") || "";
  let payload;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    payload = await response.text();
  }

  requestMetaEl.className = response.ok ? "status-ok" : "status-error";
  requestMetaEl.textContent = `${method} ${url} -> ${response.status} (${elapsedMs}ms)`;
  responseOutputEl.textContent = JSON.stringify(payload, null, 2);
}

function createEndpointCard(routeKey) {
  const { path, method } = parseRouteKey(routeKey);
  const category = getCategory(path);
  const params = getParams(path);
  const bodyPreset = BODY_PRESETS[routeKey] ?? {};
  const queryPreset = QUERY_PRESETS[routeKey] ?? {};

  const details = document.createElement("details");
  details.className = "endpoint";

  const summary = document.createElement("summary");
  summary.innerHTML = `<span class="method">${method}</span><span class="path">${path}</span> <span class="category">[${category}]</span>`;
  details.appendChild(summary);

  const form = document.createElement("form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      saveContext();
      await runRoute(routeKey, form);
    } catch (error) {
      requestMetaEl.className = "status-error";
      requestMetaEl.textContent = `${method} ${path} -> request failed`;
      responseOutputEl.textContent = JSON.stringify({ error: String(error?.message ?? error) }, null, 2);
    } finally {
      button.disabled = false;
    }
  });

  for (const param of params) {
    const label = document.createElement("label");
    label.textContent = `Path param: ${param}`;
    const input = document.createElement("input");
    input.name = `param-${param}`;
    input.type = "text";
    input.value = PARAM_PRESETS[param] ?? "";
    label.appendChild(input);
    form.appendChild(label);
  }

  const queryLabel = document.createElement("label");
  queryLabel.textContent = "Query JSON";
  const queryArea = document.createElement("textarea");
  queryArea.name = "query";
  queryArea.value = JSON.stringify(queryPreset, null, 2);
  queryLabel.appendChild(queryArea);
  form.appendChild(queryLabel);

  const bodyLabel = document.createElement("label");
  bodyLabel.textContent = "Body JSON";
  const bodyArea = document.createElement("textarea");
  bodyArea.name = "body";
  bodyArea.value = method === "GET" ? "" : JSON.stringify(bodyPreset, null, 2);
  bodyLabel.appendChild(bodyArea);
  form.appendChild(bodyLabel);

  const actions = document.createElement("div");
  actions.className = "actions";
  const runButton = document.createElement("button");
  runButton.type = "submit";
  runButton.textContent = "Send Request";
  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "secondary";
  resetButton.textContent = "Reset Preset";
  resetButton.addEventListener("click", () => {
    for (const param of params) {
      const input = form.querySelector(`input[name="param-${param}"]`);
      if (input) input.value = PARAM_PRESETS[param] ?? "";
    }
    queryArea.value = JSON.stringify(queryPreset, null, 2);
    bodyArea.value = method === "GET" ? "" : JSON.stringify(bodyPreset, null, 2);
  });
  actions.appendChild(runButton);
  actions.appendChild(resetButton);
  form.appendChild(actions);

  details.appendChild(form);
  return details;
}

function renderEndpointList(filterText = "") {
  const query = filterText.trim().toLowerCase();
  endpointListEl.innerHTML = "";

  const keys = [...ROUTE_KEYS].sort((a, b) => {
    const aa = parseRouteKey(a).path;
    const bb = parseRouteKey(b).path;
    return aa.localeCompare(bb);
  });

  for (const routeKey of keys) {
    const { path, method } = parseRouteKey(routeKey);
    const category = getCategory(path);
    const haystack = `${method} ${path} ${category}`.toLowerCase();
    if (query && !haystack.includes(query)) continue;
    endpointListEl.appendChild(createEndpointCard(routeKey));
  }
}

document.getElementById("save-context").addEventListener("click", saveContext);
document.getElementById("clear-context").addEventListener("click", clearContext);
filterInput.addEventListener("input", () => renderEndpointList(filterInput.value));

loadContext();
renderEndpointList();
