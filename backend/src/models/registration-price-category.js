export function asRegistrationPriceCategory(item) {
  return {
    categoryId: item.categoryId,
    categoryName: item.categoryName,
    finalAmountCad: item.finalAmountCad,
    complete: item.complete !== false
  };
}
