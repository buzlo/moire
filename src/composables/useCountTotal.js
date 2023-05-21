export function useCountTotal(array) {
  return array.reduce((total, item) => item.price * item.quantity + total, 0)
}
