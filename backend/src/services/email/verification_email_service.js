export class VerificationEmailService {
  constructor() {
    this.outbox = [];
  }

  sendVerificationEmail({ email, token, expiresAt }) {
    this.outbox.push({
      email,
      token,
      expiresAt: expiresAt.toISOString()
    });
    return { accepted: true };
  }
}
