export function createUc01Uc02Runners({ callApi, payloadErrors, payloadCode, formatStep }) {
function makeUniqueEmail(prefix = "uc01") {
  const token = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return `${prefix}-${token}@example.com`;
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
  }

  return lines.join("\n\n");
}

function buildUc02Payload({ recordId, operation = "create", data }) {
  return {
    formId: "profile_form",
    operation,
    recordId,
    data: {
      firstName: "Alex",
      lastName: "Doe",
      email: "alex@example.com",
      age: 30,
      ...(data ?? {})
    }
  };
}

async function runUc02Scenario(scenario) {
  const lines = [];
  let step = 1;
  const recordId = `record-uc02-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const pushResult = (label, result, pass, details = "") => {
    lines.push(formatStep(step, label, result, pass, details));
    step += 1;
  };

  const submitForm = (payload) => callApi({ method: "POST", path: "/api/v1/forms/submit", body: payload, actor: "author" });
  const getRecord = () => callApi({
    method: "GET",
    path: "/api/v1/dev/forms/record",
    query: { recordId },
    actor: "admin"
  });

  if (scenario.id === "AT-UC02-01") {
    const submit = await submitForm(buildUc02Payload({ recordId }));
    const submitPass = submit.status === 200 && submit.payload?.status === "ACCEPTED";
    pushResult("Submit valid payload", submit, submitPass, "expected 200 + ACCEPTED");

    const record = await getRecord();
    const recordPass = record.status === 200 && record.payload?.record?.email === "alex@example.com";
    pushResult("Record persisted", record, recordPass, "expected stored email alex@example.com");
  } else if (scenario.id === "AT-UC02-02") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { firstName: "" }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const submitPass = submit.status === 422 && codes.includes("REQUIRED_FIELD_MISSING");
    pushResult("Reject missing required field", submit, submitPass, "expected 422 + REQUIRED_FIELD_MISSING");

    const record = await getRecord();
    pushResult("No persistence on required-field failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-03") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "bad" }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const submitPass = submit.status === 422 && codes.includes("INVALID_FORMAT");
    pushResult("Reject invalid format", submit, submitPass, "expected 422 + INVALID_FORMAT");

    const record = await getRecord();
    pushResult("No persistence on format failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-04") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { age: 15 }
    }));
    const code = firstDefined(payloadErrors(submit).map((error) => error.code)[0], payloadCode(submit));
    const submitPass = submit.status === 422 && code === "AGE_MINIMUM";
    pushResult("Reject business-rule violation", submit, submitPass, "expected 422 + AGE_MINIMUM");

    const record = await getRecord();
    pushResult("No persistence on business-rule failure", record, record.status === 404, "expected RECORD_NOT_FOUND");
  } else if (scenario.id === "AT-UC02-05") {
    const submit = await submitForm(buildUc02Payload({
      recordId,
      data: { firstName: "", lastName: "", email: "bad", age: 15 }
    }));
    const codes = payloadErrors(submit).map((error) => error.code);
    const expectedOrder = ["REQUIRED_FIELD_MISSING", "REQUIRED_FIELD_MISSING", "INVALID_FORMAT", "AGE_MINIMUM"];
    const submitPass = submit.status === 422 && JSON.stringify(codes) === JSON.stringify(expectedOrder);
    pushResult("Return mixed errors in deterministic order", submit, submitPass, "expected strict stable ordering");
  } else if (scenario.id === "AT-UC02-06") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const badUpdate = await submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { email: "broken" }
    }));
    pushResult("Reject invalid update", badUpdate, badUpdate.status === 422, "expected 422");

    const record = await getRecord();
    const pass = allTrue([record.status === 200, record.payload?.record?.email === "alex@example.com"]);
    pushResult("Record remains unchanged (no partial write)", record, pass, "expected unchanged email");
  } else if (scenario.id === "AT-UC02-07") {
    const bad = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "bad" }
    }));
    pushResult("Initial invalid submission rejected", bad, bad.status === 422, "expected 422");

    const corrected = await submitForm(buildUc02Payload({
      recordId,
      data: { email: "alex.fixed@example.com" }
    }));
    const correctedPass = corrected.status === 200 && corrected.payload?.record?.email === "alex.fixed@example.com";
    pushResult("Corrected resubmission accepted", corrected, correctedPass, "expected persisted corrected data");
  } else if (scenario.id === "AT-UC02-08") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const armFailure = await callApi({
      method: "POST",
      path: "/api/v1/dev/forms/force-persistence-failure",
      body: {},
      actor: "admin"
    });
    pushResult("Arm next persistence failure (dev helper)", armFailure, armFailure.status === 200, "expected 200");

    const failedUpdate = await submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { age: 31 }
    }));
    const failedPass = failedUpdate.status === 500 && payloadCode(failedUpdate) === "PERSISTENCE_FAILED";
    pushResult("Persistence failure returns retry guidance", failedUpdate, failedPass, "expected 500 + PERSISTENCE_FAILED");

    const record = await getRecord();
    const unchangedPass = record.status === 200 && record.payload?.record?.age === 30;
    pushResult("Rollback/abort keeps previous state", record, unchangedPass, "expected age still 30");
  } else if (scenario.id === "AT-UC02-09") {
    const create = await submitForm(buildUc02Payload({ recordId }));
    pushResult("Create valid baseline record", create, create.status === 200, "expected 200");

    const updateA = submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { firstName: "Taylor" }
    }));
    const updateB = submitForm(buildUc02Payload({
      recordId,
      operation: "update",
      data: { firstName: "Jordan" }
    }));
    const [a, b] = await Promise.all([updateA, updateB]);
    pushResult("Conflicting update A", a, a.status === 200, "expected 200");
    pushResult("Conflicting update B", b, b.status === 200, "expected 200");

    const record = await getRecord();
    const pass = record.status === 200 && record.payload?.record?.firstName === "Jordan";
    pushResult("Final state uses last write", record, pass, "expected firstName Jordan");
  } else if (scenario.id === "AT-UC02-10") {
    lines.push("Manual acceptance scenario.");
    lines.push("1) Verify UC-02 requirements map to AT cases in UC-02.md and UC-02-AT.md.");
    lines.push("2) Verify rule ownership remains explicit in backend form definitions.");
    lines.push("3) Confirm each validation rule has a matching acceptance scenario.");
  }

  return lines.join("\n\n");
}

  return { runUc01Scenario, runUc02Scenario };
}
