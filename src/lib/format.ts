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

export function formatFailureSourceLabel(sourceType: string) {
  if (sourceType === '官方公示整理') return '来源：官方公示整理'
  if (sourceType === '官方复试名单+招生计划推导') return '来源：官方名单与计划推导'
  return `来源：${sourceType}`
}

export function formatFailureSourceNote(sourceType: string) {
  if (sourceType === '官方公示整理') {
    return '这条样本来自官方公示整理，不是匿名投稿。'
  }

  if (sourceType === '官方复试名单+招生计划推导') {
    return '这条样本基于官方复试名单与招生计划结构推导，不是匿名投稿。'
  }

  return `这条样本来源：${sourceType}。`
}
