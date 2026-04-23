import { describe, expect, it } from 'vitest'
import { formatRatioDisplay, programToCSVRow, generateCompareCSV } from './csv-export'
import type { Program } from './types'

function makeProgram(overrides: Partial<Program> = {}): Program {
  return {
    id: 'test-1',
    school: '测试大学',
    major: '计算机科学',
    year: 2025,
    applicants: 100,
    admitted: 10,
    retestCount: 15,
    retestLine: 320,
    lowestAdmittedScore: 350,
    riskTags: ['报录比高压', '复试刷人明显'],
    summary: '测试摘要',
    sourceNote: '测试来源',
    ...overrides,
  }
}

describe('formatRatioDisplay', () => {
  it('formats applicants:admitted when both present', () => {
    expect(formatRatioDisplay(makeProgram())).toBe('100:10')
  })

  it('returns — when applicants is null', () => {
    expect(formatRatioDisplay(makeProgram({ applicants: null }))).toBe('—')
  })

  it('returns — when admitted is null', () => {
    expect(formatRatioDisplay(makeProgram({ admitted: null }))).toBe('—')
  })

  it('returns — when admitted is 0 (falsy)', () => {
    expect(formatRatioDisplay(makeProgram({ admitted: 0 }))).toBe('—')
  })
})

describe('programToCSVRow', () => {
  it('converts full program to row', () => {
    const row = programToCSVRow(makeProgram())
    expect(row).toEqual([
      '测试大学',
      '计算机科学',
      '2025',
      '100:10',
      '350',
      '15:10',
      '320',
      '报录比高压 / 复试刷人明显',
    ])
  })

  it('handles all null numeric fields', () => {
    const row = programToCSVRow(makeProgram({
      applicants: null,
      admitted: null,
      retestCount: null,
      retestLine: null,
      lowestAdmittedScore: null,
    }))
    expect(row).toEqual([
      '测试大学',
      '计算机科学',
      '2025',
      '—',
      '—',
      '—',
      '—',
      '报录比高压 / 复试刷人明显',
    ])
  })

  it('handles empty risk tags', () => {
    const row = programToCSVRow(makeProgram({ riskTags: [] }))
    expect(row[7]).toBe('')
  })
})

describe('generateCompareCSV', () => {
  it('generates CSV with BOM-ready header and single program', () => {
    const csv = generateCompareCSV([makeProgram()])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toBe('"院校","专业","年份","竞争比例","最低录取分","复录比","复试线","风险标签"')
    expect(lines[1]).toBe('"测试大学","计算机科学","2025","100:10","350","15:10","320","报录比高压 / 复试刷人明显"')
  })

  it('generates CSV with multiple programs', () => {
    const csv = generateCompareCSV([
      makeProgram({ id: 'a', school: '清华大学' }),
      makeProgram({ id: 'b', school: '北京大学', applicants: 200, admitted: 20 }),
    ])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(3) // header + 2 rows
    expect(lines[1]).toContain('清华大学')
    expect(lines[2]).toContain('北京大学')
    expect(lines[2]).toContain('200:20')
  })

  it('generates only header for empty array', () => {
    const csv = generateCompareCSV([])
    const lines = csv.split('\n')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toBe('"院校","专业","年份","竞争比例","最低录取分","复录比","复试线","风险标签"')
  })

  it('properly quotes all fields', () => {
    const csv = generateCompareCSV([makeProgram({ school: '含"引号"大学' })])
    expect(csv).toContain('"含""引号""大学"')
  })
})
