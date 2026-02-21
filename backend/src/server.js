import http from "node:http";
import { URL } from "node:url";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import { createRegistrationRoutes } from "./api/registration_routes.js";
import { REGISTRATION_CONFIG } from "./models/config/registration_config.js";
import { RegistrationRepository } from "./models/registration_repository.js";
import { VerificationEmailService } from "./services/email/verification_email_service.js";
import { RegistrationAuditLog } from "./services/registration/registration_audit_log.js";

function parseRouteKey(routeKey) {
  const match = routeKey.match(/:(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)$/);
  if (!match) {
    throw new Error(`Invalid route key: ${routeKey}`);
  }
  return {
    method: match[1],
    pathTemplate: routeKey.slice(0, -`:${match[1]}`.length)
  };
}

function compilePath(pathTemplate) {
  const parts = pathTemplate.split("/").filter(Boolean);
  return {
    pathTemplate,
    parts,
    paramsCount: parts.filter((part) => part.startsWith(":")).length,
    match(pathname) {
      const actualParts = pathname.split("/").filter(Boolean);
      if (actualParts.length !== parts.length) {
        return null;
      }
      const params = {};
      for (let i = 0; i < parts.length; i += 1) {
        const expected = parts[i];
        const actual = actualParts[i];
        if (expected.startsWith(":")) {
          params[expected.slice(1)] = decodeURIComponent(actual);
          continue;
        }
        if (expected !== actual) {
          return null;
        }
      }
      return params;
    }
  };
}

function compileRoutes(routeMap) {
  const compiled = Object.entries(routeMap).map(([key, handler]) => {
    const parsed = parseRouteKey(key);
    const matcher = compilePath(parsed.pathTemplate);
    return {
      key,
      method: parsed.method,
      handler,
      ...matcher
    };
  });

  // Prefer the most specific match first (fewer path params).
  compiled.sort((a, b) => a.paramsCount - b.paramsCount);
  return compiled;
}

function parseUser(headers) {
  const userJson = headers["x-user-json"];
  if (typeof userJson === "string" && userJson.trim().length > 0) {
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  const id = headers["x-user-id"];
  const email = headers["x-user-email"];
  const role = headers["x-user-role"];
  if (id || email || role) {
    return {
      id: id ?? undefined,
      email: email ?? undefined,
      role: role ?? undefined
    };
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) {
        resolve(undefined);
        return;
      }
      const raw = Buffer.concat(chunks).toString("utf8");
      const contentType = String(req.headers["content-type"] ?? "");
      if (contentType.includes("application/json")) {
        try {
          resolve(JSON.parse(raw));
        } catch {
          resolve(undefined);
        }
        return;
      }
      resolve(raw);
    });
    req.on("error", reject);
  });
}

function sendResult(res, result) {
  const status = result?.status ?? 200;
  const responseHeaders = { ...(result?.headers ?? {}) };
  const body = result?.body;

  if (body === undefined || body === null) {
    res.writeHead(status, responseHeaders);
    res.end();
    return;
  }

  if (Buffer.isBuffer(body) || body instanceof Uint8Array) {
    res.writeHead(status, responseHeaders);
    res.end(body);
    return;
  }

  if (typeof body === "string") {
    if (!responseHeaders["content-type"]) {
      responseHeaders["content-type"] = "text/plain; charset=utf-8";
    }
    res.writeHead(status, responseHeaders);
    res.end(body);
    return;
  }

  responseHeaders["content-type"] = responseHeaders["content-type"] ?? "application/json; charset=utf-8";
  res.writeHead(status, responseHeaders);
  res.end(JSON.stringify(body));
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".svg") return "image/svg+xml";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "text/plain; charset=utf-8";
}

async function tryServeFrontend(req, res, pathname) {
  if (req.method !== "GET") {
    return false;
  }

  const root = process.cwd();
  const viewsRoot = path.resolve(root, "frontend", "src", "views");
  const appRoot = path.resolve(root, "frontend", "src", "app");
  const appSimpleRoot = path.resolve(root, "frontend", "src", "appsimple");

  if (pathname === "/") {
    const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>CMS1 Frontend Views</title></head>
<body>
  <h1>CMS1 Frontend Views</h1>
  <p>Apps:</p>
  <ul>
    <li><a href="/app/">/app (UC map)</a></li>
    <li><a href="/appsimple/">/appsimple (API tester)</a></li>
  </ul>
  <p>Open a view directly:</p>
  <ul>
    <li><a href="/views/submission-form.html">Submission Form</a></li>
    <li><a href="/views/review-submit.html">Review Submit</a></li>
    <li><a href="/views/public-schedule/public-schedule.html">Public Schedule</a></li>
    <li><a href="/views/public-pricing/registration-prices.html">Registration Prices</a></li>
    <li><a href="/views/public-announcements/announcements-list.html">Public Announcements</a></li>
    <li><a href="/views/payments/online-payment.html">Online Payment</a></li>
  </ul>
  <p>API base: <code>/api/v1/*</code></p>
</body>
</html>`;
    sendResult(res, {
      status: 200,
      body: html,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
    return true;
  }

  if (pathname === "/app") {
    sendResult(res, {
      status: 302,
      headers: { location: "/app/" }
    });
    return true;
  }

  if (pathname === "/appsimple") {
    sendResult(res, {
      status: 302,
      headers: { location: "/appsimple/" }
    });
    return true;
  }

  if (pathname === "/app/" || pathname.startsWith("/app/")) {
    const relPath = pathname === "/app/" ? "index.html" : pathname.slice("/app/".length);
    const filePath = path.resolve(appRoot, relPath);
    if (!filePath.startsWith(appRoot)) {
      sendResult(res, { status: 403, body: "Forbidden" });
      return true;
    }

    try {
      const content = await fs.readFile(filePath);
      sendResult(res, {
        status: 200,
        body: content,
        headers: { "content-type": contentTypeFor(filePath) }
      });
      return true;
    } catch {
      sendResult(res, { status: 404, body: "App asset not found." });
      return true;
    }
  }

  if (pathname === "/appsimple/" || pathname.startsWith("/appsimple/")) {
    const relPath = pathname === "/appsimple/" ? "index.html" : pathname.slice("/appsimple/".length);
    const filePath = path.resolve(appSimpleRoot, relPath);
    if (!filePath.startsWith(appSimpleRoot)) {
      sendResult(res, { status: 403, body: "Forbidden" });
      return true;
    }

    try {
      const content = await fs.readFile(filePath);
      sendResult(res, {
        status: 200,
        body: content,
        headers: { "content-type": contentTypeFor(filePath) }
      });
      return true;
    } catch {
      sendResult(res, { status: 404, body: "App asset not found." });
      return true;
    }
  }

  if (!pathname.startsWith("/views/")) {
    return false;
  }

  const relPath = pathname.slice("/views/".length);
  const filePath = path.resolve(viewsRoot, relPath);
  if (!filePath.startsWith(viewsRoot)) {
    sendResult(res, { status: 403, body: "Forbidden" });
    return true;
  }

  try {
    const content = await fs.readFile(filePath);
    sendResult(res, {
      status: 200,
      body: content,
      headers: { "content-type": contentTypeFor(filePath) }
    });
    return true;
  } catch {
    sendResult(res, { status: 404, body: "View not found." });
    return true;
  }
}

function createDefaultDeps() {
  return {
    repository: new RegistrationRepository(),
    verificationEmailService: new VerificationEmailService(),
    auditLog: new RegistrationAuditLog(),
    config: REGISTRATION_CONFIG,
    nowProvider: () => new Date()
  };
}

export function createServerApp(customDeps = {}) {
  const deps = {
    ...createDefaultDeps(),
    ...customDeps
  };
  const routeMap = createRegistrationRoutes(deps);
  const routes = compileRoutes(routeMap);

  return http.createServer(async (req, res) => {
    try {
      const method = String(req.method ?? "GET").toUpperCase();
      const url = new URL(req.url ?? "/", "http://localhost");
      const pathname = url.pathname;

      const servedFrontend = await tryServeFrontend(req, res, pathname);
      if (servedFrontend) {
        return;
      }

      let matchedRoute = null;
      let params = null;
      for (const route of routes) {
        if (route.method !== method) {
          continue;
        }
        const maybeParams = route.match(pathname);
        if (maybeParams) {
          matchedRoute = route;
          params = maybeParams;
          break;
        }
      }

      if (!matchedRoute) {
        sendResult(res, {
          status: 404,
          body: {
            code: "NOT_FOUND",
            message: "No route matches this request."
          }
        });
        return;
      }

      const body = await readBody(req);
      const request = {
        params,
        query: Object.fromEntries(url.searchParams.entries()),
        body,
        file: body && typeof body === "object" ? body.file : undefined,
        headers: req.headers,
        user: parseUser(req.headers),
        sessionId: req.headers["x-session-id"]
      };

      const result = matchedRoute.handler(request);
      sendResult(res, result);
    } catch (error) {
      sendResult(res, {
        status: 500,
        body: {
          code: "UNHANDLED_SERVER_ERROR",
          message: "Unexpected server error.",
          details: String(error?.message ?? error)
        }
      });
    }
  });
}

export function startServer({ port = Number(process.env.PORT ?? 3000) } = {}) {
  const server = createServerApp();
  server.listen(port, () => {
    const address = server.address();
    const resolvedPort = typeof address === "object" && address ? address.port : port;
    process.stdout.write(`CMS1 API listening on http://localhost:${resolvedPort}\n`);
  });
  return server;
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
const thisFilePath = fileURLToPath(import.meta.url);

if (entryPath && thisFilePath === entryPath) {
  startServer();
}
