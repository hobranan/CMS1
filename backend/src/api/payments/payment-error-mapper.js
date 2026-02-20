export function mapPaymentError(status, code, message, extras = {}) {
  return {
    status,
    body: {
      code,
      message,
      ...extras
    }
  };
}

