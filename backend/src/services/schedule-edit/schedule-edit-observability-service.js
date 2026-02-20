export class ScheduleEditObservabilityService {
  constructor() { this.events = []; }
  record(event, payload = {}) { this.events.push({ event, payload }); }
}
