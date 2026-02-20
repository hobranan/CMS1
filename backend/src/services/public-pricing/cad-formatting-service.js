export function formatCad(value) {
  if (Number.isInteger(value)) {
    return `CAD ${value}.00`;
  }
  return `CAD ${Number(value).toFixed(2)}`;
}
