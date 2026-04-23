import { applyCors, type ApiRequest, type ApiResponse } from '../_lib/http.js'
import { isKvConfigured } from '../_lib/kv.js'

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method_not_allowed', message: '只支持 GET。' })
    return
  }

  res.status(200).json({
    ok: true,
    kvConfigured: isKvConfigured(),
    allowedOriginsConfigured: Boolean(process.env.ALLOWED_ORIGINS),
  })
}
