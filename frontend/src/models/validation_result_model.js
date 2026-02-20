export function toValidationModel(response) {
  return {
    ok: response.status === 200,
    errors: response.body?.errors ?? [],
    status: response.status
  };
}
