import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

function createElement(tagName = "div") {
  const listeners = new Map();
  return {
    tagName: String(tagName).toUpperCase(),
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    type: "",
    title: "",
    disabled: false,
    children: [],
    append(...nodes) {
      this.children.push(...nodes);
    },
    appendChild(node) {
      this.children.push(node);
      return node;
    },
    addEventListener(type, handler) {
      listeners.set(type, handler);
    },
    async trigger(type) {
      if (listeners.has(type)) {
        await listeners.get(type)({ preventDefault() {} });
      }
    }
  };
}

function collect(node, predicate, out = []) {
  if (!node) return out;
  if (predicate(node)) out.push(node);
  for (const child of node.children ?? []) {
    collect(child, predicate, out);
  }
  return out;
}

test("app walks all UC scenario buttons and executes planned/plain-text branches", async () => {
  const elements = new Map();
  const ucList = createElement("div");
  const ucFilter = createElement("input");
  elements.set("uc-list", ucList);
  elements.set("uc-filter", ucFilter);

  globalThis.document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElement("div"));
      return elements.get(id);
    },
    createElement(tag) {
      return createElement(tag);
    }
  };

  const storage = new Map([
    [
      "cms1-uc-context",
      JSON.stringify({ userId: "saved-id", userEmail: "saved@example.com", userRole: "author", sessionId: "saved-session" })
    ]
  ]);
  globalThis.localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    }
  };

  globalThis.performance = { now: () => 100 };
  globalThis.alert = () => {};

  const makeFetch = (mode) => async (url) => {
    const target = String(url);
    let status = mode === "failure" ? 422 : 200;
    let text = JSON.stringify({ status: "OK", code: "GENERIC", errors: [], record: {}, ids: { paperId: "paper-1" }, users: {} });

    if (target.includes("/api/v1/dev/seed-demo")) {
      text = JSON.stringify({
        seeded: true,
        ids: {
          submissionId: "sub-1",
          draftId: "draft-1",
          paperId: "paper-1",
          invitationId: "inv-1",
          assignmentId: "assign-1",
          reviewId: "review-1",
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
        }
      });
    }

    if (target.includes("/api/v1/dev/verification-token")) {
      text = JSON.stringify({ token: "tok-1", email: "user@example.com", expiresAt: new Date(0).toISOString() });
    }

    if (target.includes("/api/v1/dev/forms/record")) {
      status = mode === "failure" ? 404 : 200;
      text = JSON.stringify({ code: "RECORD_NOT_FOUND" });
    }

    if (target.includes("/plain-text")) {
      text = "PLAIN_TEXT";
    }

    return {
      status,
      async text() {
        return text;
      }
    };
  };
  globalThis.fetch = makeFetch("success");

  const modulePath = pathToFileURL(path.join(process.cwd(), "frontend/src/app/app.js")).href;
  const appModule = await import(modulePath);
  const hooks = appModule.__appTestHooks;

  const buttons = collect(ucList, (node) => node.tagName === "BUTTON");
  assert.ok(buttons.length > 20, "expected all UC scenario buttons to render");

  for (const button of buttons) {
    await button.trigger("click");
  }

  globalThis.fetch = makeFetch("failure");
  for (const button of buttons) {
    await button.trigger("click");
  }

  const outputs = collect(ucList, (node) => node.tagName === "PRE");
  assert.ok(outputs.some((node) => String(node.textContent).includes("Scenario")));

  const planned = await hooks.runPlannedScenario({
    planned: {
      steps: [
        {
          label: "plain text parse fallback",
          request: { method: "GET", path: "/plain-text", actor: "author" },
          expect: { status: 200 }
        }
      ]
    }
  });

  assert.match(planned, /plain text parse fallback/);
});
