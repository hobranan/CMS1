export function mapTicketError(status, code, message) {
  return { status, body: { code, message } };
}

