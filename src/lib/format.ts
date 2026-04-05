export function formatRatio(numerator: number, denominator: number) {
  if (denominator === 0) return '0'
  return (numerator / denominator).toFixed(1)
}

export function formatRetestRate(retestCount: number, admitted: number) {
  if (admitted === 0) return '0'
  return (retestCount / admitted).toFixed(1)
}
