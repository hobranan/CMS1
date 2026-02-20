import { asAnonymizedReviewView } from "../../models/anonymized-review-view.js";

export function projectAnonymizedList(records) {
  return records.map((record) => asAnonymizedReviewView(record));
}

export function projectAnonymizedDetail(record) {
  return asAnonymizedReviewView(record);
}
