export class TicketObservabilityService {
  constructor() {
    this.metrics = new Map();
  }

  record(eventName) {
    const current = this.metrics.get(eventName) ?? 0;
    this.metrics.set(eventName, current + 1);
  }
}

