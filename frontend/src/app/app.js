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
    alt: "",
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

const UC_SCENARIOS = {
  "UC-01": [
    {
      id: "AT-UC01-01",
      kind: "success",
      title: "Successful Register-Verify-Login",
      example: {
        email: "new-user@example.com",
        password: "Password123!",
        confirmPassword: "Password123!"
      }
    },
    {
      id: "AT-UC01-02",
      kind: "fail",
      title: "Invalid Email",
      example: { email: "not-an-email", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-03",
      kind: "fail",
      title: "Duplicate Email",
      example: { email: "dup@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-04",
      kind: "fail",
      title: "Password Policy Failure",
      example: { email: "weak@example.com", password: "short", confirmPassword: "short" }
    },
    {
      id: "AT-UC01-05",
      kind: "fail",
      title: "Missing Required Fields",
      example: { email: "", password: "", confirmPassword: "" }
    },
    {
      id: "AT-UC01-06",
      kind: "fail",
      title: "Mixed Validation Failures",
      example: { email: "bad", password: "short", confirmPassword: "wrong" }
    },
    {
      id: "AT-UC01-07",
      kind: "fail",
      title: "Login Before Verification",
      example: { email: "pending-user@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-08",
      kind: "fail",
      title: "Verification Link Expired",
      example: { email: "expiring-user@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-09",
      kind: "fail",
      title: "Pending Registration Expired",
      example: { email: "pending-expire@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-10",
      kind: "fail",
      title: "Concurrent Same-Email Registration",
      example: { email: "concurrent@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-11",
      kind: "fail",
      title: "Resend Rate Limits",
      example: { email: "resend-limit@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-12",
      kind: "fail",
      title: "Token Single-Use Security",
      example: { email: "token-security@example.com", password: "Password123!", confirmPassword: "Password123!" }
    },
    {
      id: "AT-UC01-13",
      kind: "manual",
      title: "Accessibility Validation UX (Manual)",
      example: {
        keyboard: "Tab through fields and submit invalid form",
        screenReader: "Confirm error feedback is announced via aria-live"
      }
    }
  ]
};

const context = {
  userId: "",
  userEmail: "",
  userRole: "",
  sessionId: ""
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
    userId: context.userId.trim(),
    userEmail: context.userEmail.trim(),
    userRole: context.userRole.trim(),
    sessionId: context.sessionId.trim()
  };
  localStorage.setItem("cms1-uc-context", JSON.stringify(value));
}

function loadContext() {
  const raw = localStorage.getItem("cms1-uc-context");
  if (!raw) return;
  const saved = parseJson(raw, {});
  context.userId = String(saved.userId ?? "");
  context.userEmail = String(saved.userEmail ?? "");
  context.userRole = String(saved.userRole ?? "");
  context.sessionId = String(saved.sessionId ?? "");
}

function ensureActorContext(actor) {
  const user = USERS[actor];
  if (!user) return;
  if (!context.userId.trim()) context.userId = user.id;
  if (!context.userEmail.trim()) context.userEmail = user.email;
  if (!context.userRole.trim()) context.userRole = user.role;
}

function headersFor(hasBody) {
  const headers = {};
  if (hasBody) headers["content-type"] = "application/json";
  if (context.userId.trim()) headers["x-user-id"] = context.userId.trim();
  if (context.userEmail.trim()) headers["x-user-email"] = context.userEmail.trim();
  if (context.userRole.trim()) headers["x-user-role"] = context.userRole.trim();
  if (context.sessionId.trim()) headers["x-session-id"] = context.sessionId.trim();
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

function makeUniqueEmail(prefix = "uc01") {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return `${prefix}-${token}@example.com`;
}

async function callApi({ method, path, params = {}, query = {}, body, actor = "author" }) {
  ensureActorContext(actor);
  saveContext();
  const resolvedPath = fillPath(path, params);
  const search = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
  });
  const url = search.size > 0 ? `${resolvedPath}?${search.toString()}` : resolvedPath;
  const hasBody = method !== "GET";
  const started = performance.now();
  const response = await fetch(url, {
    method,
    headers: headersFor(hasBody),
    body: hasBody ? JSON.stringify(body ?? {}) : undefined
  });
  const elapsed = Math.round(performance.now() - started);
  const text = await response.text();
  let payload = text;
  try {
    payload = JSON.parse(text);
  } catch {
    // keep text body
  }
  return { method, url, status: response.status, payload, elapsed };
}

function payloadCode(result) {
  return result && typeof result.payload === "object" ? result.payload.code : undefined;
}

function payloadErrors(result) {
  if (!result || typeof result.payload !== "object") return [];
  const errors = result.payload.errors;
  return Array.isArray(errors) ? errors : [];
}

function toArray(value) {
  return Array.isArray(value) ? value : [value];
}

function includesExpected(actual, expected) {
  return toArray(expected).includes(actual);
}

function formatStep(index, label, result, pass, details = "") {
  const state = pass ? "PASS" : "FAIL";
  const tail = details ? ` | ${details}` : "";
  return `[${index}] ${state} ${label}\n    ${result.method} ${result.url} -> ${result.status} (${result.elapsed}ms)${tail}\n    ${typeof result.payload === "string" ? result.payload : JSON.stringify(result.payload, null, 2)}`;
}

async function runUc01Scenario(scenario) {
  const lines = [];
  let step = 1;
  const email = makeUniqueEmail("uc01");
  const strong = { email, password: "Password123!", confirmPassword: "Password123!" };

  const pushResult = (label, result, pass, details = "") => {
    lines.push(formatStep(step, label, result, pass, details));
    step += 1;
  };

  await callApi({ method: "POST", path: "/api/v1/dev/time/reset", body: {}, actor: "admin" });

  if (scenario.id === "AT-UC01-01") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register valid user", register, register.status === 202, "expected 202");

    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");

    const verify = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    pushResult("Verify email", verify, verify.status === 200, "expected 200");

    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const loginPass = login.status === 200 && login.payload?.status === "AUTHENTICATED";
    pushResult("Login after verification", login, loginPass, "expected 200 + AUTHENTICATED");
  } else if (scenario.id === "AT-UC01-02") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "not-an-email", password: "Password123!", confirmPassword: "Password123!" }
    });
    const pass = result.status === 422 && payloadErrors(result).some((error) => error.code === "INVALID_EMAIL_FORMAT");
    pushResult("Reject invalid email format", result, pass, "expected 422 + INVALID_EMAIL_FORMAT");
  } else if (scenario.id === "AT-UC01-03") {
    const first = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("First registration succeeds", first, first.status === 202, "expected 202");
    const second = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const secondCode = payloadCode(second);
    const pass = includesExpected(second.status, [409, 422]) && includesExpected(secondCode, ["EMAIL_PENDING_REGISTRATION", "EMAIL_ALREADY_REGISTERED"]);
    pushResult("Second duplicate registration rejected", second, pass, "expected 409/422 + duplicate code");
  } else if (scenario.id === "AT-UC01-04") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email, password: "short", confirmPassword: "short" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const pass = result.status === 422 && codes.some((code) => code.startsWith("PASSWORD_"));
    pushResult("Reject weak password", result, pass, "expected 422 + password policy errors");
  } else if (scenario.id === "AT-UC01-05") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "", password: "", confirmPassword: "" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const pass = result.status === 422
      && codes.includes("MISSING_EMAIL")
      && codes.includes("MISSING_PASSWORD")
      && codes.includes("MISSING_CONFIRM_PASSWORD");
    pushResult("Reject missing required fields", result, pass, "expected required-field errors");
  } else if (scenario.id === "AT-UC01-06") {
    const result = await callApi({
      method: "POST",
      path: "/api/v1/registrations",
      body: { email: "bad", password: "short", confirmPassword: "wrong" }
    });
    const codes = payloadErrors(result).map((error) => error.code);
    const expectedLeading = ["INVALID_EMAIL_FORMAT", "PASSWORD_TOO_SHORT", "PASSWORD_MISSING_UPPERCASE", "PASSWORD_MISSING_NUMBER"];
    const pass = result.status === 422 && JSON.stringify(codes.slice(0, 4)) === JSON.stringify(expectedLeading);
    pushResult("Return mixed errors in deterministic order", result, pass, "expected stable leading error order");
  } else if (scenario.id === "AT-UC01-07") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const pass = login.status === 403 && payloadCode(login) === "EMAIL_UNVERIFIED";
    pushResult("Deny login before verification", login, pass, "expected 403 + EMAIL_UNVERIFIED");
  } else if (scenario.id === "AT-UC01-08") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");
    const advance = await callApi({
      method: "POST",
      path: "/api/v1/dev/time/advance",
      body: { ms: 24 * 60 * 60 * 1000 }
    });
    pushResult("Advance time by 24h", advance, advance.status === 200, "expected 200");
    const verify = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    const pass = verify.status === 410 && payloadCode(verify) === "TOKEN_EXPIRED";
    pushResult("Reject expired verification token", verify, pass, "expected 410 + TOKEN_EXPIRED");
  } else if (scenario.id === "AT-UC01-09") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const advance = await callApi({
      method: "POST",
      path: "/api/v1/dev/time/advance",
      body: { ms: 7 * 24 * 60 * 60 * 1000 }
    });
    pushResult("Advance time by 7d", advance, advance.status === 200, "expected 200");
    const login = await callApi({
      method: "POST",
      path: "/api/v1/auth/login",
      body: { email: strong.email, password: strong.password }
    });
    const loginPass = login.status === 403 && payloadCode(login) === "REGISTRATION_ATTEMPT_EXPIRED";
    pushResult("Deny login for expired pending registration", login, loginPass, "expected 403 + REGISTRATION_ATTEMPT_EXPIRED");
    const resend = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const resendPass = resend.status === 410 && payloadCode(resend) === "REGISTRATION_ATTEMPT_EXPIRED";
    pushResult("Deny resend for expired pending registration", resend, resendPass, "expected 410 + REGISTRATION_ATTEMPT_EXPIRED");
  } else if (scenario.id === "AT-UC01-10") {
    const requestA = callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const requestB = callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    const [a, b] = await Promise.all([requestA, requestB]);
    const statuses = [a.status, b.status].sort((x, y) => x - y);
    const pass = statuses.length === 2 && statuses[0] !== statuses[1];
    pushResult("Concurrent request A", a, pass, "expect one success and one failure");
    pushResult("Concurrent request B", b, pass, "expect one success and one failure");
  } else if (scenario.id === "AT-UC01-11") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const resend1 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #1", resend1, resend1.status === 202, "expected 202");
    const resendImmediate = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const cooldownPass = resendImmediate.status === 429 && payloadCode(resendImmediate) === "RESEND_COOLDOWN_ACTIVE";
    pushResult("Resend immediately (cooldown)", resendImmediate, cooldownPass, "expected 429 + RESEND_COOLDOWN_ACTIVE");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend2 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #2", resend2, resend2.status === 202, "expected 202");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend3 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    pushResult("Resend #3", resend3, resend3.status === 202, "expected 202");
    await callApi({ method: "POST", path: "/api/v1/dev/time/advance", body: { ms: 61 * 1000 } });
    const resend4 = await callApi({
      method: "POST",
      path: "/api/v1/registrations/resend-confirmation",
      body: { email: strong.email }
    });
    const limitPass = resend4.status === 429 && payloadCode(resend4) === "RESEND_RATE_LIMITED";
    pushResult("Resend #4 exceeds 24h rolling max", resend4, limitPass, "expected 429 + RESEND_RATE_LIMITED");
  } else if (scenario.id === "AT-UC01-12") {
    const register = await callApi({ method: "POST", path: "/api/v1/registrations", body: strong });
    pushResult("Register pending account", register, register.status === 202, "expected 202");
    const tokenResp = await callApi({
      method: "GET",
      path: "/api/v1/dev/verification-token",
      query: { email: strong.email },
      actor: "admin"
    });
    pushResult("Get verification token (dev helper)", tokenResp, tokenResp.status === 200, "expected 200");
    const verifyFirst = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    pushResult("Verify token first use", verifyFirst, verifyFirst.status === 200, "expected 200");
    const verifyReplay = await callApi({
      method: "GET",
      path: "/api/v1/registrations/verify",
      query: { token: tokenResp.payload?.token }
    });
    const pass = verifyReplay.status === 410 && payloadCode(verifyReplay) === "TOKEN_ALREADY_USED";
    pushResult("Replay same token is rejected", verifyReplay, pass, "expected 410 + TOKEN_ALREADY_USED");
    lines.push("NOTE: Token hashing/log redaction checks remain code-level checks outside this API scenario runner.");
  } else if (scenario.id === "AT-UC01-13") {
    lines.push("Manual acceptance scenario.");
    lines.push("1) Open registration view and submit invalid values via keyboard only.");
    lines.push("2) Confirm each error is associated to its field and announced via aria-live.");
    lines.push("3) Confirm unverified-login reminder text is announced and resend affordance is reachable by keyboard.");
  } else {
    lines.push(`Scenario ${scenario.id} is not implemented.`);
  }

  return lines.join("\n\n");
}

async function executeScenario(item, scenario) {
  if (item.id === "UC-01") {
    const result = await runUc01Scenario(scenario);
    setOutput(item.id, `Scenario ${scenario.id}: ${scenario.title}\nExample input:\n${JSON.stringify(scenario.example, null, 2)}\n\n${result}`);
    return;
  }
  setOutput(item.id, `Scenario ${scenario.id} is not implemented for ${item.id} yet.`);
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

  const output = document.createElement("pre");
  output.className = "uc-output";
  output.textContent = "No execution yet.";

  const actions = document.createElement("div");
  actions.className = "actions";

  const scenarios = UC_SCENARIOS[item.id] ?? [];
  for (const scenario of scenarios) {
    const scenarioBtn = document.createElement("button");
    scenarioBtn.type = "button";
    scenarioBtn.textContent = `${scenario.kind === "success" ? "Success" : scenario.kind === "manual" ? "Manual" : "Alt"}: ${scenario.id}`;
    scenarioBtn.title = `${scenario.title}\n\nExample:\n${JSON.stringify(scenario.example, null, 2)}`;
    scenarioBtn.addEventListener("click", async () => {
      scenarioBtn.disabled = true;
      try {
        await executeScenario(item, scenario);
      } catch (error) {
        setOutput(item.id, `Scenario failed: ${String(error?.message ?? error)}`);
      } finally {
        scenarioBtn.disabled = false;
      }
    });
    actions.appendChild(scenarioBtn);
  }

  article.append(actions, output);
  cards.set(item.id, { output });
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

filterEl.addEventListener("input", () => render(filterEl.value));

loadContext();
render();
