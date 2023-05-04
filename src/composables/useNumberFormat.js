export function useNumberFormat(value) {
  return new Intl.NumberFormat().format(value);
}
