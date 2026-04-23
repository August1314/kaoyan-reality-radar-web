import { getEntitlementStatus } from '../_lib/entitlements.js'
import { applyCors, getSingleQueryValue, type ApiRequest, type ApiResponse } from '../_lib/http.js'
import { kvStore } from '../_lib/store.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 GET。' })
    return
  }

  const deviceId = getSingleQueryValue(req.query.deviceId)
  const status = await getEntitlementStatus(kvStore, deviceId)
  res.status(200).json(status)
}
