export type RiskTag = '报录比高压' | '复试刷人明显' | '分数线抬升' | '调剂机会少' | '信息不透明'

export type FailureStage = '初试前' | '初试后' | '复试前' | '复试中' | '调剂阶段'

export type FinalResult =
  | '未过初试'
  | '进入复试但未录取'
  | '调剂失败'
  | '放弃复试'
  | '二战中'

export interface Program {
  id: string
  school: string
  major: string
  year: number
  applicants: number
  admitted: number
  retestCount: number
  retestLine: number
  lowestAdmittedScore: number
  riskTags: RiskTag[]
  summary: string
  sourceNote: string
}

export interface FailureExperience {
  id: string
  programId: string
  school: string
  major: string
  year: number
  attempt: '一战' | '二战'
  scoreRange: string
  enteredRetest: boolean
  finalResult: FinalResult
  failureStage: FailureStage
  failureTags: string[]
  reminder: string
  review: string
  retryChoice: string
  advice: string
  sourceType: string
}
