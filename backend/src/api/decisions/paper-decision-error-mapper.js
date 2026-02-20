export function mapPaperDecisionError(status, code, message) {
  return { status, body: { code, message } };
}
