import { requireSession } from "./middleware/session_guard.js";

export function createSessionController(deps) {
  return {
    getSession: (request) => {
      const check = requireSession(request, deps.sessionService);
      if (!check.allowed) {
        return check.response;
      }
      return {
        status: 200,
        body: {
          status: "SESSION_ACTIVE"
        }
      };
    }
  };
}
