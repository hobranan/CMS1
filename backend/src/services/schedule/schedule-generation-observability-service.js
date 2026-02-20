export class ScheduleGenerationObservabilityService {
  constructor() {
    this.events = [];
  }

  record(event, payload = {}) {
    this.events.push({ event, payload });
  }
}
