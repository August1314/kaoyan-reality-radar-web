import type { Program } from './types'

/** 格式化竞争比例显示 */
export function formatRatioDisplay(p: Program): string {
  const ratio = p.applicants && p.admitted ? `${p.applicants}:${p.admitted}` : '—'
  return ratio
}

/** 将 Program 数据转换为 CSV 行数组（不含 header） */
export function programToCSVRow(p: Program): string[] {
  return [
    p.school,
    p.major,
    String(p.year),
    formatRatioDisplay(p),
    p.lowestAdmittedScore !== null ? String(p.lowestAdmittedScore) : '—',
    p.retestCount && p.admitted ? `${p.retestCount}:${p.admitted}` : '—',
    p.retestLine !== null ? String(p.retestLine) : '—',
    p.riskTags.join(' / '),
  ]
}

/** 将 Program 数组生成为 UTF-8 BOM CSV 字符串 */
export function generateCompareCSV(programs: Program[]): string {
  const headers = ['院校', '专业', '年份', '竞争比例', '最低录取分', '复录比', '复试线', '风险标签']
  const rows = programs.map(programToCSVRow)

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n')
}

/** 触发浏览器下载 CSV 文件（仅在浏览器环境可用） */
export function downloadCompareCSV(programs: Program[]): void {
  const csvContent = generateCompareCSV(programs)
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `考研对比_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/** 将单个 Program 生成为结果页专用 CSV 字符串 */
export function generateResultCSV(program: Program): string {
  const headers = ['院校', '专业', '年份', '竞争比例', '复录比', '复试线', '最低录取分', '风险标签', '风险摘要']
  const row = [
    program.school,
    program.major,
    String(program.year),
    formatRatioDisplay(program),
    program.retestCount && program.admitted ? `${program.retestCount}:${program.admitted}` : '—',
    program.retestLine !== null ? String(program.retestLine) : '—',
    program.lowestAdmittedScore !== null ? String(program.lowestAdmittedScore) : '—',
    program.riskTags.join(' / '),
    program.summary,
  ]
  return [headers, row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')].join('\n')
}

/** 触发浏览器下载结果页 CSV 文件 */
export function downloadResultCSV(program: Program): void {
  const csvContent = generateResultCSV(program)
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const slug = program.school.replace(/\s+/g, '')
  link.download = `考研目标_${slug}_${program.year}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ─── 统计数据导出 ─────────────────────────────────────────────────

interface StatsData {
  totalPrograms: number
  uniqueSchools: number
  uniqueMajors: number
  avgScore: number | null
  schoolTop: { label: string; count: number }[]
  majorTop: { label: string; count: number }[]
  scoreBuckets: { label: string; count: number }[]
  tagTop: { label: string; count: number }[]
}

/** 将统计数据生成为 UTF-8 BOM CSV 字符串 */
export function generateStatsCSV(stats: StatsData): string {
  const lines: string[] = []

  // KPI 区块
  lines.push('"指标","数值"')
  lines.push(`"收录专业","${stats.totalPrograms}"`)
  lines.push(`"覆盖院校","${stats.uniqueSchools}"`)
  lines.push(`"涵盖专业","${stats.uniqueMajors}"`)
  if (stats.avgScore !== null) lines.push(`"平均录取分","${stats.avgScore}"`)
  lines.push('')

  // 学校分布
  if (stats.schoolTop.length > 0) {
    lines.push('"学校分布 Top 10"')
    lines.push('"院校","收录专业数"')
    stats.schoolTop.forEach(b => lines.push(`"${b.label}","${b.count}"`))
    lines.push('')
  }

  // 专业方向分布
  if (stats.majorTop.length > 0) {
    lines.push('"专业方向分布 Top 10"')
    lines.push('"专业","收录数量"')
    stats.majorTop.forEach(b => lines.push(`"${b.label}","${b.count}"`))
    lines.push('')
  }

  // 录取分数分布
  if (stats.scoreBuckets.some(b => b.count > 0)) {
    lines.push('"录取分数分布"')
    lines.push('"分数区间","专业数量"')
    stats.scoreBuckets.forEach(b => lines.push(`"${b.label}","${b.count}"`))
    lines.push('')
  }

  // 高频风险标签
  if (stats.tagTop.length > 0) {
    lines.push('"高频风险标签 Top 8"')
    lines.push('"标签","出现次数"')
    stats.tagTop.forEach(b => lines.push(`"${b.label}","${b.count}"`))
    lines.push('')
  }

  return lines.join('\n')
}

/** 触发浏览器下载统计数据 CSV 文件 */
export function downloadStatsCSV(stats: StatsData): void {
  const csvContent = generateStatsCSV(stats)
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `考研雷达数据统计_${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
