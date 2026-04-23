import { describe, expect, it } from 'vitest'
import { formatRatioDisplay, programToCSVRow, generateCompareCSV, generateResultCSV, generateStatsCSV } from './csv-export'
import type { FailureExperience, Program } from './types'

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

function makeFailure(overrides: Partial<FailureExperience> = {}): FailureExperience {
  return {
    id: 'failure-1',
    programId: 'test-1',
    school: '测试大学',
    major: '计算机科学',
    year: 2025,
    attempt: '一战',
    scoreRange: '350-359',
    enteredRetest: true,
    finalResult: '进入复试但未录取',
    failureStage: '复试中',
    failureTags: ['复试状态差', '联系导师晚'],
    reminder: '复试准备不能只看初试分',
    review: '复试问答明显短板',
    retryChoice: '二战',
    advice: '提前补项目复盘',
    sourceType: '匿名投稿',
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

describe('generateResultCSV', () => {
  it('generates program summary when no visible failures are provided', () => {
    const csv = generateResultCSV(makeProgram())

    expect(csv).toContain('"院校","专业","年份","竞争比例","复录比","复试线","最低录取分","风险标签","风险摘要"')
    expect(csv).toContain('"测试大学","计算机科学","2025","100:10","15:10","320","350","报录比高压 / 复试刷人明显","测试摘要"')
    expect(csv).not.toContain('失败经验 ID')
  })

  it('includes only caller-provided visible failures', () => {
    const csv = generateResultCSV(makeProgram(), [
      makeFailure({ id: 'failure-1', reminder: '第一条' }),
      makeFailure({ id: 'failure-2', reminder: '第二条' }),
    ])

    expect(csv).toContain('"失败经验 ID","失败阶段","最终结果","分数段","失败标签","提醒","复盘","建议"')
    expect(csv).toContain('"failure-1"')
    expect(csv).toContain('"failure-2"')
    expect(csv).not.toContain('"failure-3"')
  })
})

describe('generateStatsCSV', () => {
  it('generates CSV with KPI section', () => {
    const csv = generateStatsCSV({
      totalPrograms: 158,
      uniqueSchools: 50,
      uniqueMajors: 30,
      avgScore: 365,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [],
      tagTop: [],
    })
    expect(csv).toContain('"收录专业","158"')
    expect(csv).toContain('"覆盖院校","50"')
    expect(csv).toContain('"涵盖专业","30"')
    expect(csv).toContain('"平均录取分","365"')
  })

  it('omits avgScore when null', () => {
    const csv = generateStatsCSV({
      totalPrograms: 100,
      uniqueSchools: 20,
      uniqueMajors: 10,
      avgScore: null,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [],
      tagTop: [],
    })
    expect(csv).not.toContain('平均录取分')
  })

  it('includes school distribution section', () => {
    const csv = generateStatsCSV({
      totalPrograms: 10,
      uniqueSchools: 5,
      uniqueMajors: 3,
      avgScore: null,
      schoolTop: [{ label: '清华大学', count: 5 }, { label: '北京大学', count: 3 }],
      majorTop: [],
      scoreBuckets: [],
      tagTop: [],
    })
    expect(csv).toContain('学校分布 Top 10')
    expect(csv).toContain('清华大学')
    expect(csv).toContain('北京大学')
  })

  it('includes score bucket section only when some buckets have counts', () => {
    const withData = generateStatsCSV({
      totalPrograms: 10,
      uniqueSchools: 5,
      uniqueMajors: 3,
      avgScore: null,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [
        { label: '< 300', count: 2 },
        { label: '300-340', count: 5 },
      ],
      tagTop: [],
    })
    expect(withData).toContain('录取分数分布')

    const empty = generateStatsCSV({
      totalPrograms: 10,
      uniqueSchools: 5,
      uniqueMajors: 3,
      avgScore: null,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [
        { label: '< 300', count: 0 },
        { label: '300-340', count: 0 },
      ],
      tagTop: [],
    })
    expect(empty).not.toContain('录取分数分布')
  })

  it('includes tag distribution section', () => {
    const csv = generateStatsCSV({
      totalPrograms: 10,
      uniqueSchools: 5,
      uniqueMajors: 3,
      avgScore: null,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [],
      tagTop: [{ label: '报录比高压', count: 20 }, { label: '复试刷人', count: 15 }],
    })
    expect(csv).toContain('高频风险标签 Top 8')
    expect(csv).toContain('报录比高压')
    expect(csv).toContain('报录比高压","20"')
  })

  it('handles all sections empty gracefully', () => {
    const csv = generateStatsCSV({
      totalPrograms: 0,
      uniqueSchools: 0,
      uniqueMajors: 0,
      avgScore: null,
      schoolTop: [],
      majorTop: [],
      scoreBuckets: [],
      tagTop: [],
    })
    // 只含 KPI header + 3 rows
    expect(csv).toContain('"指标","数值"')
    const lines = csv.split('\n').filter(l => l.length > 0)
    expect(lines.length).toBe(4)
  })
})
