import {
  canAccessCompare,
  canShareCompare,
  getDeviceRecord,
} from './_lib/entitlements.js'
import { applyCors, type ApiRequest, type ApiResponse } from './_lib/http.js'
import { findProgramsByIds } from './_lib/programs-data.js'
import { kvStore } from './_lib/store.js'

interface CompareBody {
  ids?: string[]
  deviceId?: string
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 POST。' })
    return
  }

  const body = (req.body ?? {}) as CompareBody
  const ids = Array.isArray(body.ids) ? Array.from(new Set(body.ids.filter(Boolean))).slice(0, 3) : []
  const deviceId = body.deviceId ?? ''
  if (!deviceId) {
    res.status(400).json({ error: 'invalid_request', message: '缺少设备标识。' })
    return
  }

  const device = await getDeviceRecord(kvStore, deviceId)
  if (!canAccessCompare(device.level)) {
    res.status(403).json({ error: 'compare_locked', message: '填写问卷后即可开启目标对比，完整权益包含导出和分享。' })
    return
  }

  const allowedIds = ids.filter((id) => device.viewedProgramIds.includes(id))
  const programs = findProgramsByIds(allowedIds)

  res.status(200).json({
    programs,
    level: device.level,
    canExport: canShareCompare(device.level),
    canShare: canShareCompare(device.level),
  })
}
