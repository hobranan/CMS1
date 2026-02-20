export function loadRegistrationPrices(apiClient) {
  return apiClient("/api/v1/public/registration-prices:GET", {});
}
