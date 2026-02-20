export function accessError(status, code, message) {
  return { status, body: { code, message } };
}

