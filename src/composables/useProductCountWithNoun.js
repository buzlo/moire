import { useInflectNoun } from './useInflectNoun'

export function useProductCountWithNoun(count) {
  return { count, noun: useInflectNoun(count, ['товар', 'товара', 'товаров']) }
}
