export class PaperDecisionNotificationService {
  constructor() {
    this.failNext = false;
  }

  notifyAuthors(_decision, _paper) {
    if (this.failNext) {
      this.failNext = false;
      const err = new Error("DECISION_NOTIFICATION_FAILURE");
      err.code = "DECISION_NOTIFICATION_FAILURE";
      throw err;
    }
    return { status: "sent" };
  }

  failNextNotification() {
    this.failNext = true;
  }
}
