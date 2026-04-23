import {
  canAccessProgram,
  getDeviceRecord,
  recordViewedProgram,
  toEntitlementStatusPayload,
} from './_lib/entitlements.js'
import { applyCors, getSingleQueryValue, type ApiRequest, type ApiResponse } from './_lib/http.js'
import { findProgramBySlug } from './_lib/programs-data.js'
import { kvStore } from './_lib/store.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 GET。' })
    return
  }

  const slug = getSingleQueryValue(req.query.slug)
  const deviceId = getSingleQueryValue(req.query.deviceId)
  if (!slug || !deviceId) {
    res.status(400).json({ error: 'invalid_request', message: '缺少目标或设备标识。' })
    return
  }

  const program = findProgramBySlug(slug)
  if (!program) {
    res.status(404).json({ error: 'not_found', message: '没有找到这个目标。' })
    return
  }

  const device = await getDeviceRecord(kvStore, deviceId)
  if (!canAccessProgram(device, program.id)) {
    res.status(403).json({
      error: 'quota_exceeded',
      message: '已达到当前浏览上限，充值后可解锁更多学校和专业结果页。',
      entitlement: toEntitlementStatusPayload(device),
    })
    return
  }

  const nextDevice = recordViewedProgram(device, program.id)
  await kvStore.set(`device:${deviceId}`, nextDevice)

  res.status(200).json({
    program,
    entitlement: toEntitlementStatusPayload(nextDevice),
  })
}
