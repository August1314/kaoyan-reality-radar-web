import {
  canAccessStats,
  getDeviceRecord,
} from './_lib/entitlements.js'
import { applyCors, getSingleQueryValue, type ApiRequest, type ApiResponse } from './_lib/http.js'
import { buildStatsSummary } from './_lib/programs-data.js'
import { kvStore } from './_lib/store.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 GET。' })
    return
  }

  const deviceId = getSingleQueryValue(req.query.deviceId)
  if (!deviceId) {
    res.status(400).json({ error: 'invalid_request', message: '缺少设备标识。' })
    return
  }

  const device = await getDeviceRecord(kvStore, deviceId)
  if (!canAccessStats(device.level)) {
    res.status(403).json({ error: 'stats_locked', message: '完整权益包含全站统计和 CSV 导出。' })
    return
  }

  res.status(200).json({
    level: device.level,
    stats: buildStatsSummary(),
  })
}
