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
