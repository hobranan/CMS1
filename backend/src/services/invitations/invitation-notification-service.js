export class InvitationNotificationService {
  constructor() {
    this.failNext = false;
    this.sent = [];
  }

  failNextSend() {
    this.failNext = true;
  }

  notifyEditor(responsePayload) {
    if (this.failNext) {
      this.failNext = false;
      const err = new Error("INVITATION_NOTIFICATION_FAILED");
      err.code = "INVITATION_NOTIFICATION_FAILED";
      throw err;
    }
    this.sent.push(responsePayload);
  }
}

