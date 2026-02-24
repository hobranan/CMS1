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
    }
  };
}

test("app hooks cover expectation maxStatus and includes failure branches", async () => {
  const elements = new Map();
  elements.set("uc-list", createElement("div"));
  elements.set("uc-filter", createElement("input"));

  globalThis.document = {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, createElement("div"));
      return elements.get(id);
    },
    createElement(tag) {
      return createElement(tag);
    }
  };
  globalThis.localStorage = {
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {}
  };
  globalThis.performance = { now: () => 0 };
  globalThis.alert = () => {};
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => ({ status: "ok" })
  });

  const modulePath = pathToFileURL(path.join(process.cwd(), "frontend/src/app/app.js")).href;
  const appModule = await import(modulePath);
  const hooks = appModule.__appTestHooks;

  const maxStatusFail = hooks.checkExpectation({ status: 500, payload: {} }, { maxStatus: 499 });
  assert.equal(maxStatusFail.pass, false);
  assert.match(maxStatusFail.details, /expected <= 499/);

  const statusInFail = hooks.checkExpectation({ status: 418, payload: {} }, { statusIn: [200, 201] });
  assert.equal(statusInFail.pass, false);
  assert.match(statusInFail.details, /expected in \[200, 201\]/);

  const includesFail = hooks.checkExpectation(
    { status: 200, payload: { message: "alpha" } },
    { bodyPath: "message", includes: "beta" }
  );
  assert.equal(includesFail.pass, false);
  assert.match(includesFail.details, /did not include beta/);

  const resolved = hooks.resolveValue("$ids.paperId", { ids: { paperId: "paper-1" } });
  assert.equal(resolved, "paper-1");
  const unresolved = hooks.resolveValue("$ids.missing", { ids: {} });
  assert.equal(unresolved, "$ids.missing");

  const fallback = hooks.parseJson("{", { ok: false });
  assert.deepEqual(fallback, { ok: false });

  assert.equal(hooks.firstDefined(undefined, null, "x"), "x");
  assert.equal(hooks.firstDefined(undefined, null), undefined);
  assert.equal(hooks.allTrue([1, true, "ok"]), true);
  assert.equal(hooks.allTrue([1, 0, true]), false);
  assert.equal(hooks.formatError(new Error("boom")), "boom");
  assert.match(hooks.formatError("plain"), /plain/);
});
