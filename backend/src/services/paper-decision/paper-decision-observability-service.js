export class PaperDecisionObservabilityService {
  constructor() {
    this.events = [];
  }

  record(event, payload = {}) {
    this.events.push({ event, payload, recordedAt: new Date().toISOString() });
  }
}
