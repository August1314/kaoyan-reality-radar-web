export function formatRatio(numerator: number | null, denominator: number | null) {
  if (numerator == null || denominator == null || denominator === 0) return null
  return (numerator / denominator).toFixed(1)
}

export function formatRetestRate(retestCount: number | null, admitted: number | null) {
  if (retestCount == null || admitted == null || admitted === 0) return null
  return (retestCount / admitted).toFixed(1)
}

export function formatMetricValue(value: number | null) {
  if (value == null) return '待补充'
  return `${value}`
}
