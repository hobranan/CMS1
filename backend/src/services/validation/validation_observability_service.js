export class ValidationObservabilityService {
  constructor() {
    this.events = [];
  }

  record(entry) {
    this.events.push({ timestamp: new Date().toISOString(), ...entry });
  }
}
