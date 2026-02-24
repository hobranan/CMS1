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

function walk(node, predicate) {
  if (!node) return null;
  if (predicate(node)) return node;
  for (const child of node.children ?? []) {
    const found = walk(child, predicate);
    if (found) return found;
  }
  return null;
}

test("app targeted branches: UC02 pass checks and fallback rendering paths", async () => {
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
  globalThis.localStorage = {
    getItem() {
      return null;
    },
    setItem() {},
    removeItem() {}
  };
  globalThis.performance = { now: () => 0 };
  globalThis.alert = () => {};

  const records = new Map();
  globalThis.fetch = async (url, options = {}) => {
    const target = String(url);
    const method = String(options.method ?? "GET").toUpperCase();
    const body = options.body ? JSON.parse(options.body) : null;

    if (target.includes("/api/v1/forms/submit") && method === "POST") {
      const recordId = body.recordId;
      const op = body.operation;
      const data = body.data ?? {};
      if (op === "create") {
        records.set(recordId, { age: 30, firstName: "Alex" });
        return { status: 200, text: async () => JSON.stringify({ status: "ACCEPTED" }) };
      }
      if (op === "update" && data.age === 31) {
        return { status: 500, text: async () => JSON.stringify({ code: "PERSISTENCE_FAILED" }) };
      }
      if (op === "update" && typeof data.firstName === "string") {
        records.set(recordId, { age: 30, firstName: "Jordan" });
        return { status: 200, text: async () => JSON.stringify({ status: "ACCEPTED" }) };
      }
      return { status: 200, text: async () => JSON.stringify({ status: "ACCEPTED" }) };
    }

    if (target.includes("/api/v1/dev/forms/record") && method === "GET") {
      const rid = new URL(target, "http://localhost").searchParams.get("recordId");
      const record = records.get(rid);
      if (!record) {
        return { status: 404, text: async () => JSON.stringify({ code: "RECORD_NOT_FOUND" }) };
      }
      return { status: 200, text: async () => JSON.stringify({ status: "OK", record }) };
    }

    if (target.includes("/api/v1/dev/forms/force-persistence-failure") && method === "POST") {
      return { status: 200, text: async () => JSON.stringify({ status: "OK" }) };
    }

    return { status: 200, text: async () => JSON.stringify({ status: "OK" }) };
  };

  const modulePath = pathToFileURL(path.join(process.cwd(), "frontend/src/app/app.js")).href + `?t=${Date.now()}`;
  const appModule = await import(modulePath);
  const hooks = appModule.__appTestHooks;

  const out08 = await hooks.runUc02Scenario({ id: "AT-UC02-08" });
  assert.match(out08, /Persistence failure returns retry guidance/);
  assert.match(out08, /Rollback\/abort keeps previous state/);

  const out09 = await hooks.runUc02Scenario({ id: "AT-UC02-09" });
  assert.match(out09, /Final state uses last write/);

  const tempItem = { id: "UC-X", title: "No endpoint", goal: "fallback card" };
  hooks.UC_ITEMS.push(tempItem);
  hooks.render("");
  const fallbackCard = (ucList.children ?? []).find((node) => String(node.innerHTML).includes("UC-X - No endpoint"));
  assert.ok(fallbackCard);
  assert.match(fallbackCard.innerHTML, /Placeholder/);

  const output = walk(fallbackCard, (node) => node.tagName === "PRE");
  assert.ok(output);
  await hooks.executeScenario(tempItem, { id: "AT-X", title: "Fallback scenario" });
  assert.match(output.textContent, /Example input:\n\{\}/);

  hooks.UC_ITEMS.pop();

  globalThis.fetch = async () => {
    throw new Error("forced click failure");
  };
  const uc03 = hooks.UC_ITEMS.find((item) => item.id === "UC-03");
  const uc03Card = hooks.makeCard(uc03);
  const uc03Btn = walk(uc03Card, (node) => node.tagName === "BUTTON");
  const uc03Output = walk(uc03Card, (node) => node.tagName === "PRE");
  assert.ok(uc03Btn);
  await uc03Btn.trigger("click");
  assert.match(uc03Output.textContent, /Scenario failed:/);
});
