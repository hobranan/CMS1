export class ReviewNotificationService {
  constructor() {
    this.failNext = false;
    this.sent = [];
  }

  failNextSend() {
    this.failNext = true;
  }

  notifyEditor(submittedReview) {
    if (this.failNext) {
      this.failNext = false;
      const err = new Error("REVIEW_NOTIFICATION_FAILED");
      err.code = "REVIEW_NOTIFICATION_FAILED";
      throw err;
    }
    this.sent.push(submittedReview.reviewId);
  }
}

