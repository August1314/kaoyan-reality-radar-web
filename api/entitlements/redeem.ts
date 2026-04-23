import { applyCors, type ApiRequest, type ApiResponse } from '../_lib/http.ts'
import { redeemCode } from '../_lib/entitlements.ts'
import { kvStore } from '../_lib/store.ts'

interface RedeemBody {
  code?: string
  deviceId?: string
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 POST。' })
    return
  }

  const body = (req.body ?? {}) as RedeemBody
  const result = await redeemCode(kvStore, body.code ?? '', body.deviceId ?? '')

  if (!result.ok) {
    res.status(result.status).json({ error: result.error, message: result.message })
    return
  }

  res.status(200).json({ level: result.level })
}
