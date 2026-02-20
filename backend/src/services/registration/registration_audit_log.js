function maskEmail(email) {
  const [name, domain] = String(email).split("@");
  if (!name || !domain) return "***";
  return `${name[0]}***@${domain}`;
}

export class RegistrationAuditLog {
  constructor() {
    this.events = [];
  }

  record(event, payload) {
    const safePayload = { ...payload };
    if (safePayload.email) {
      safePayload.email = maskEmail(safePayload.email);
    }
    delete safePayload.password;
    delete safePayload.token;
    this.events.push({ event, payload: safePayload });
  }
}
