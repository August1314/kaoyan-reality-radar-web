// Lightweight failures metadata for HomePage - avoids loading full failures data (237KB)
// This file should stay small - only metadata, not full records

export const failuresCount = 206

// First 3 failure summaries for display on HomePage (minimal data)
export const failureSummaries = [
  { id: 'batch-001-failure-1', programId: 'batch-001-program-1', reminder: '过了复试线不等于稳录，复试名单和结果公示之间仍有明显淘汰。', failureStage: '复试中' as const, finalResult: '进入复试但未录取' as const },
  { id: 'batch-001-failure-4', programId: 'batch-001-program-2', reminder: '高分进复试也不等于稳录，404 分仍可能在复试阶段被刷。', failureStage: '复试中' as const, finalResult: '进入复试但未录取' as const },
  { id: 'batch-001-failure-5', programId: 'batch-001-program-2', reminder: '刚过复试线只能说明拿到入场券，371 分进复试同样可能最终不录取。', failureStage: '复试中' as const, finalResult: '进入复试但未录取' as const }
]
