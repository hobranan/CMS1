export function hydrateDraftState(apiResponse) {
  return apiResponse?.body?.editable_state ?? {};
}
