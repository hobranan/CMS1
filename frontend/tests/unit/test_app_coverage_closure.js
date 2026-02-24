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

test("app helper branches close remaining coverage gaps", async () => {
  const elements = new Map();
  elements.set("uc-list", createElement("div"));
  elements.set("uc-filter", createElement("input"));

  const storage = new Map([["cms1-uc-context", JSON.stringify({})]]);
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
  let now = 10;
  globalThis.performance = { now: () => (now += 5) };
  globalThis.alert = () => {};

  globalThis.fetch = async () => ({
    status: 200,
    text: async () => "not-json"
  });

  const modulePath = pathToFileURL(path.join(process.cwd(), "frontend/src/app/app.js")).href + `?t=${Date.now()}`;
  const appModule = await import(modulePath);
  const hooks = appModule.__appTestHooks;

  assert.deepEqual(hooks.parseJson("   ", { empty: true }), { empty: true });
  hooks.loadContext();
  hooks.ensureActorContext("unknown-actor");
  assert.equal(hooks.valueAtPath({ a: 1 }, undefined), undefined);
  assert.equal(hooks.valueAtPath("x", "a.b"), undefined);
  assert.equal(hooks.payloadCode?.({ payload: "x" }), undefined);
  assert.deepEqual(hooks.payloadErrors?.({ payload: "x" }) ?? [], []);
  assert.equal(hooks.includesExpected("A", "A"), true);
  assert.equal(typeof hooks.makeUniqueEmail("x"), "string");
  assert.deepEqual(hooks.toArray("v"), ["v"]);
  assert.deepEqual(hooks.toArray(["v"]), ["v"]);
  assert.equal(hooks.normalizeScenarioTitle(undefined, "AT-U"), "AT-U");

  const seededNoObject = await hooks.runPlannedScenario({
    planned: {
      seedDemo: true,
      steps: [{}]
    }
  });
  assert.match(seededNoObject, /Seed demo data/);
  assert.match(seededNoObject, /Scenario step/);

  const plannedDefaults = await hooks.runPlannedScenario({
    planned: {}
  });
  assert.equal(plannedDefaults, "");

  const postWithImplicitBody = await hooks.runPlannedScenario({
    planned: {
      steps: [
        {
          request: { method: "POST", path: "/api/test-no-body" },
          expect: { status: 200 }
        }
      ]
    }
  });
  assert.match(postWithImplicitBody, /POST \/api\/test-no-body/);

  const bodyStatusCheck = hooks.checkExpectation(
    { status: 200, payload: "plain-text" },
    { bodyStatus: "OK" }
  );
  assert.equal(bodyStatusCheck.pass, false);

  assert.deepEqual(hooks.clonePlan(null), null);
  assert.equal(hooks.normalizeScenarioTitle("", "AT-X"), "AT-X");
  assert.equal(hooks.normalizeScenarioTitle(" -- Success", "AT-X"), "Success");
  assert.equal(hooks.classifyScenarioKind("AT-X", "Performance test"), "manual");
  assert.equal(hooks.classifyScenarioKind("AT-X-01", "anything"), "success");
  assert.equal(hooks.classifyScenarioKind("AT-X-02", "edge"), "fail");

  const custom = hooks.buildUcScenarioListFromSources("UC-X", {
    scenarios: {
      "UC-X": [
        {
          id: "AT-X-01",
          title: "Successful path",
          kind: "success",
          example: {},
          planned: { steps: [], notes: "" }
        },
        {
          id: "AT-X-99",
          title: "Extra explicit",
          kind: "fail",
          example: {},
          planned: { steps: [] }
        }
      ]
    },
    autoplay: {},
    atCatalog: {
      "UC-X": [
        { id: "AT-X-01", title: "Existing stays" },
        { id: "AT-X-02", title: " - Auto mapped" },
        { id: "AT-X-03", title: "Performance traceability check" }
      ]
    }
  });
  assert.equal(custom.length, 4);
  const mapped = custom.find((entry) => entry.id === "AT-X-02");
  assert.ok(mapped);
  assert.equal(mapped.kind, "fail");
  assert.match(mapped.planned.notes, /Template playback mapped/);

  const manualMapped = custom.find((entry) => entry.id === "AT-X-03");
  assert.ok(manualMapped);
  assert.equal(manualMapped.kind, "manual");

  const noAt = hooks.buildUcScenarioListFromSources("UC-Y", {
    scenarios: { "UC-Y": [{ id: "AT-Y-01", title: "One", kind: "success", example: {} }] },
    autoplay: {},
    atCatalog: {}
  });
  assert.equal(noAt.length, 1);

  const fallbackTemplates = hooks.buildUcScenarioListFromSources("UC-Z", {
    scenarios: {
      "UC-Z": [
        { id: "AT-Z-01", title: "Only success", kind: "success", example: {}, planned: { steps: [], notes: "base-note" } }
      ]
    },
    autoplay: {},
    atCatalog: {
      "UC-Z": [{ id: "AT-Z-02", title: "Mapped alt path" }]
    }
  });
  const mappedWithNote = fallbackTemplates.find((entry) => entry.id === "AT-Z-02");
  assert.ok(mappedWithNote);
  assert.match(mappedWithNote.planned.notes, /base-note/);

  const successFallback = hooks.buildUcScenarioListFromSources("UC-W", {
    scenarios: {
      "UC-W": [
        { id: "AT-W-10", title: "Only fail template", kind: "fail", example: {}, planned: { steps: [] } }
      ]
    },
    autoplay: {},
    atCatalog: {
      "UC-W": [{ id: "AT-W-11", title: "Successful mapped path" }]
    }
  });
  const mappedSuccess = successFallback.find((entry) => entry.id === "AT-W-11");
  assert.ok(mappedSuccess);
  assert.equal(mappedSuccess.kind, "success");
});
