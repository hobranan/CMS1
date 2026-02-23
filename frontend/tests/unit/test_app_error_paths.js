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

test("app scenario button catch path surfaces error output", async () => {
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
  globalThis.fetch = async () => {
    throw new Error("forced network failure");
  };

  const modulePath = pathToFileURL(path.join(process.cwd(), "frontend/src/app/app.js")).href;
  await import(modulePath);

  const uc03Card = (ucList.children ?? []).find((card) => String(card.innerHTML).includes("UC-03 - Login"));
  assert.ok(uc03Card, "expected rendered UC-03 card");

  const uc03ScenarioButton = walk(uc03Card, (node) => node.tagName === "BUTTON" && String(node.textContent).includes("AT-UC03-01"));
  assert.ok(uc03ScenarioButton, "expected UC-03 scenario button");

  await uc03ScenarioButton.trigger("click");

  const output = walk(uc03Card, (node) => node.tagName === "PRE");
  assert.ok(output, "expected output panel");
  assert.match(output.textContent, /Scenario failed: forced network failure/);
  assert.equal(uc03ScenarioButton.disabled, false);
});
