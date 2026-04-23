import { getDeviceLevel } from './_lib/entitlements'
import {
  findFailureById,
  findFailuresByProgramId,
  findVisibleFailureById,
  findVisibleFailuresByProgramId,
} from './_lib/failures-data'
import { applyCors, getSingleQueryValue, type ApiRequest, type ApiResponse } from './_lib/http'
import { kvStore } from './_lib/store'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 GET。' })
    return
  }

  const deviceId = getSingleQueryValue(req.query.deviceId)
  const level = await getDeviceLevel(kvStore, deviceId)
  const id = getSingleQueryValue(req.query.id)

  if (id) {
    const failure = findVisibleFailureById(id, level)
    if (failure) {
      res.status(200).json({ failure, level })
      return
    }

    if (!findFailureById(id)) {
      res.status(404).json({ error: 'failure_not_found', message: '这条失败经验不存在。', level })
      return
    }

    res.status(403).json({ error: 'locked_failure', message: '这条失败经验需要先解锁。', level })
    return
  }

  const programId = getSingleQueryValue(req.query.programId)
  if (!programId) {
    res.status(400).json({ error: 'missing_program_id', message: '缺少 programId。' })
    return
  }

  const excludeId = getSingleQueryValue(req.query.excludeId)
  const allFailures = findFailuresByProgramId(programId)
  const visibleFailures = findVisibleFailuresByProgramId(programId, level)
    .filter((item) => item.id !== excludeId)

  res.status(200).json({
    failures: visibleFailures,
    totalCount: allFailures.length,
    level,
  })
}
