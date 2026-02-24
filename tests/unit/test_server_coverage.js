import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createServerApp, startServer, __serverTestHooks } from "../../backend/src/server.js";

async function listen(server) {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return Number(server.address().port);
}

async function request(baseUrl, targetPath, { method = "GET", headers, body, redirect = "follow" } = {}) {
  const response = await fetch(`${baseUrl}${targetPath}`, {
    method,
    headers,
    body,
    redirect
  });
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }
  return { status: response.status, headers: response.headers, text, payload };
}

test("server static/dev/routes cover core server.js branches", async (t) => {
  const server = createServerApp();
  t.after(() => server.close());
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;

  const root = await request(baseUrl, "/");
  assert.equal(root.status, 200);
  assert.match(root.text, /CMS1 Frontend Views/);

  const appRedirect = await request(baseUrl, "/app", { redirect: "manual" });
  assert.equal(appRedirect.status, 302);

  const appIndex = await request(baseUrl, "/app/");
  assert.equal(appIndex.status, 200);

  const appJs = await request(baseUrl, "/app/app.js");
  assert.equal(appJs.status, 200);

  const appCss = await request(baseUrl, "/app/style.css");
  assert.equal(appCss.status, 200);

  const traversalApp = await request(baseUrl, "/app/C:/outside.txt");
  assert.equal(traversalApp.status, 403);

  const appMissing = await request(baseUrl, "/app/does-not-exist.js");
  assert.equal(appMissing.status, 404);

  const viewFile = await request(baseUrl, "/views/submission-form.html");
  assert.equal(viewFile.status, 200);

  const supportFile = await request(baseUrl, "/support/uc01_uc02_runner.js");
  assert.equal(supportFile.status, 200);

  const traversalView = await request(baseUrl, "/views/C:/outside.txt");
  assert.equal(traversalView.status, 403);

  const traversalSupport = await request(baseUrl, "/support/C:/outside.txt");
  assert.equal(traversalSupport.status, 403);

  const viewMissing = await request(baseUrl, "/views/does-not-exist.html");
  assert.equal(viewMissing.status, 404);

  const supportMissing = await request(baseUrl, "/support/does-not-exist.js");
  assert.equal(supportMissing.status, 404);

  const nonGetView = await request(baseUrl, "/views/submission-form.html", { method: "POST" });
  assert.equal(nonGetView.status, 404);
  assert.equal(nonGetView.payload?.code, "NOT_FOUND");

  const seed = await request(baseUrl, "/api/v1/dev/seed-demo", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(seed.status, 200);
  assert.equal(seed.payload?.seeded, true);

  const tokenMissingEmail = await request(baseUrl, "/api/v1/dev/verification-token");
  assert.equal(tokenMissingEmail.status, 400);

  const tokenNotFound = await request(baseUrl, "/api/v1/dev/verification-token?email=none%40example.com");
  assert.equal(tokenNotFound.status, 404);

  const register = await request(baseUrl, "/api/v1/registrations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "coverage-user@example.com", password: "Password123!", confirmPassword: "Password123!" })
  });
  assert.equal(register.status, 202);

  const tokenFound = await request(baseUrl, "/api/v1/dev/verification-token?email=coverage-user%40example.com");
  assert.equal(tokenFound.status, 200);
  assert.ok(tokenFound.payload?.token);

  const invalidJsonAdvance = await request(baseUrl, "/api/v1/dev/time/advance", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{"
  });
  assert.equal(invalidJsonAdvance.status, 400);

  const nonJsonAdvance = await request(baseUrl, "/api/v1/dev/time/advance", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "plain"
  });
  assert.equal(nonJsonAdvance.status, 400);

  const validAdvance = await request(baseUrl, "/api/v1/dev/time/advance", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ms: 1000 })
  });
  assert.equal(validAdvance.status, 200);

  const reset = await request(baseUrl, "/api/v1/dev/time/reset", { method: "POST" });
  assert.equal(reset.status, 200);

  const formRecordMissingQuery = await request(baseUrl, "/api/v1/dev/forms/record");
  assert.equal(formRecordMissingQuery.status, 400);

  const formRecordNotFound = await request(baseUrl, "/api/v1/dev/forms/record?recordId=nope");
  assert.equal(formRecordNotFound.status, 404);

  const formSubmit = await request(baseUrl, "/api/v1/forms/submit", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": "author-1",
      "x-user-email": "author@example.com",
      "x-user-role": "author",
      "x-session-id": "sess-1"
    },
    body: JSON.stringify({
      formId: "profile_form",
      operation: "create",
      recordId: "coverage-record-1",
      data: {
        firstName: "Alex",
        lastName: "Doe",
        email: "alex@example.com",
        age: 30
      }
    })
  });
  assert.equal(formSubmit.status, 200);

  const invalidUserJson = await request(baseUrl, "/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-user-json": "{" },
    body: JSON.stringify({ email: "author@example.com", password: "Password123!" })
  });
  assert.ok([200, 401, 403].includes(invalidUserJson.status));

  const formRecordFound = await request(baseUrl, "/api/v1/dev/forms/record?recordId=coverage-record-1");
  assert.equal(formRecordFound.status, 200);

  const forcePersist = await request(baseUrl, "/api/v1/dev/forms/force-persistence-failure", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}"
  });
  assert.equal(forcePersist.status, 200);

  const noBodyRoute = await request(baseUrl, "/api/v1/public/announcements");
  assert.ok([200, 204].includes(noBodyRoute.status));

  const notFound = await request(baseUrl, "/no/such/route");
  assert.equal(notFound.status, 404);
  assert.equal(notFound.payload?.code, "NOT_FOUND");

  const appRoot = path.join(process.cwd(), "frontend", "src", "app");
  const tempFiles = [
    ["coverage-temp.json", "{}"],
    ["coverage-temp.svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"></svg>"],
    ["coverage-temp.png", "PNG"],
    ["coverage-temp.jpg", "JPG"],
    ["coverage-temp.txt", "TXT"]
  ];

  try {
    for (const [name, content] of tempFiles) {
      await fs.writeFile(path.join(appRoot, name), content);
      const asset = await request(baseUrl, `/app/${name}`);
      assert.equal(asset.status, 200);
    }
  } finally {
    await Promise.all(tempFiles.map(([name]) => fs.rm(path.join(appRoot, name), { force: true })));
  }
});

test("server dev endpoints handle unavailable deps and unhandled route exceptions", async (t) => {
  const erroringRepo = {
    addRegistrationAttempt() {
      throw new Error("forced failure");
    },
    usersByEmail: new Map(),
    pendingByEmail: new Map(),
    tokensByHash: new Map()
  };

  const server = createServerApp({
    repository: erroringRepo,
    atomicPersistence: {},
    formSubmissionRepository: null
  });
  t.after(() => server.close());
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}`;

  const unavailableForce = await request(baseUrl, "/api/v1/dev/forms/force-persistence-failure", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}"
  });
  assert.equal(unavailableForce.status, 503);

  const unavailableRecord = await request(baseUrl, "/api/v1/dev/forms/record?recordId=x");
  assert.equal(unavailableRecord.status, 404);

  const unhandled = await request(baseUrl, "/api/v1/registrations", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "x@example.com", password: "Password123!", confirmPassword: "Password123!" })
  });
  assert.equal(unhandled.status, 500);
  assert.equal(unhandled.payload?.code, "UNHANDLED_SERVER_ERROR");
});

test("startServer starts and can be cleanly closed", async () => {
  const server = startServer({ port: 0 });
  await new Promise((resolve) => setTimeout(resolve, 10));
  await new Promise((resolve) => server.close(resolve));
  assert.ok(server.listening === false);
});

test("startServer honors CMS1_EXIT_AFTER_START callback path", async () => {
  const originalEnv = process.env.CMS1_EXIT_AFTER_START;
  const originalExit = process.exit;
  let exitCalled = false;
  process.env.CMS1_EXIT_AFTER_START = "1";
  process.exit = ((code) => {
    exitCalled = code === 0;
    return undefined;
  });

  try {
    startServer({ port: 0 });
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(exitCalled, true);
  } finally {
    process.exit = originalExit;
    if (originalEnv === undefined) delete process.env.CMS1_EXIT_AFTER_START;
    else process.env.CMS1_EXIT_AFTER_START = originalEnv;
  }
});

test("server helper hooks cover parseRouteKey/compilePath utility branches", () => {
  const parsed = __serverTestHooks.parseRouteKey("/x/:id:GET");
  assert.equal(parsed.method, "GET");
  assert.equal(parsed.pathTemplate, "/x/:id");

  assert.throws(() => __serverTestHooks.parseRouteKey("/x/:id"), /Invalid route key/);

  const matcher = __serverTestHooks.compilePath("/a/:id/b");
  assert.deepEqual(matcher.match("/a/abc/b"), { id: "abc" });
  assert.deepEqual(matcher.match("/a/a%20b/b"), { id: "a b" });
  assert.equal(matcher.match("/a/abc/c"), null);
  assert.equal(matcher.match("/a/abc"), null);

  const compiled = __serverTestHooks.compileRoutes({
    "/a/:id:GET": () => ({ status: 200 }),
    "/a/static:GET": () => ({ status: 200 })
  });
  assert.equal(compiled[0].pathTemplate, "/a/static");
  assert.equal(compiled[1].pathTemplate, "/a/:id");

  const fromJson = __serverTestHooks.parseUser({ "x-user-json": "{\"id\":\"u1\"}" });
  assert.equal(fromJson?.id, "u1");
  assert.equal(__serverTestHooks.parseUser({ "x-user-json": "{" }), null);
  const fromHeaders = __serverTestHooks.parseUser({ "x-user-id": "u2", "x-user-email": "u2@example.com", "x-user-role": "author" });
  assert.equal(fromHeaders?.id, "u2");
  assert.equal(__serverTestHooks.parseUser({}), null);

  assert.match(__serverTestHooks.contentTypeFor("x.html"), /text\/html/);
  assert.match(__serverTestHooks.contentTypeFor("x.js"), /text\/javascript/);
  assert.match(__serverTestHooks.contentTypeFor("x.css"), /text\/css/);
  assert.match(__serverTestHooks.contentTypeFor("x.json"), /application\/json/);
  assert.match(__serverTestHooks.contentTypeFor("x.svg"), /image\/svg\+xml/);
  assert.match(__serverTestHooks.contentTypeFor("x.png"), /image\/png/);
  assert.match(__serverTestHooks.contentTypeFor("x.jpg"), /image\/jpeg/);
  assert.match(__serverTestHooks.contentTypeFor("x.jpeg"), /image\/jpeg/);
  assert.match(__serverTestHooks.contentTypeFor("x.unknown"), /text\/plain/);
});

test("server module entrypoint branch runs when executed directly", async () => {
  const out = spawnSync(process.execPath, ["backend/src/server.js"], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, PORT: "0", CMS1_EXIT_AFTER_START: "1" },
    timeout: 2000
  });
  const output = `${out.stdout ?? ""}${out.stderr ?? ""}`;
  assert.match(output, /CMS1 API listening on http:\/\/localhost:/);
});
