export class SubmissionObservabilityService {
  constructor() {
    this.events = [];
  }

  record(event, payload) {
    this.events.push({ event, payload, at: new Date().toISOString() });
  }
}
