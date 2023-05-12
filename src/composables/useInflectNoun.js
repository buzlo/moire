export function useInflectNoun(number, [nominativeSingular, genitiveSingular, genitivePlural]) {
  if (number % 100 > 4 && number % 100 < 20) return genitivePlural

  const remainder = number % 10
  return remainder === 1
    ? nominativeSingular
    : remainder > 1 && remainder < 5
    ? genitiveSingular
    : genitivePlural
}
