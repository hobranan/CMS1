export class WorkloadLimitRuleRepository {
  constructor() {
    this.defaultRule = {
      id: "conference-default",
      version: 1,
      limit: 3
    };
    this.roleRules = new Map();
    this.trackRules = new Map();
  }

  setConferenceDefault(limit, version = 1) {
    this.defaultRule = {
      id: "conference-default",
      version,
      limit
    };
  }

  setRoleRule(role, limit, version = 1) {
    this.roleRules.set(role, {
      id: `role-${role}`,
      version,
      limit
    });
  }

  setTrackRule(trackId, limit, version = 1) {
    this.trackRules.set(trackId, {
      id: `track-${trackId}`,
      version,
      limit
    });
  }

  resolveRule({ trackId, role }) {
    if (trackId && this.trackRules.has(trackId)) {
      return { ...this.trackRules.get(trackId), source: "track-specific" };
    }
    if (role && this.roleRules.has(role)) {
      return { ...this.roleRules.get(role), source: "role-specific" };
    }
    return { ...this.defaultRule, source: "conference-default" };
  }
}

