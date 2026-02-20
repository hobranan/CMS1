export function registrationPricesErrorMessage(response) {
  if (response.status === 404) return "Registration prices are not published.";
  if (response.status === 500) return "Registration prices are temporarily unavailable.";
  return "";
}
