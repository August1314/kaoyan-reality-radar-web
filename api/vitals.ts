import { applyCors, type ApiRequest, type ApiResponse } from './_lib/http.js'

interface VitalReport {
  name: string
  value: number
  rating: string
  delta: number
  id: string
  navigationType?: string
  url: string
  timestamp: number
}

// In-memory ring buffer — per cold-start instance, max 200 entries
const buffer: VitalReport[] = []
const MAX = 200

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (applyCors(req, res)) return

  if (req.method === 'OPTIONS') {
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const body = req.body as Partial<VitalReport> | undefined

  if (!body?.name || typeof body.value !== 'number') {
    res.status(400).json({ error: 'invalid_payload' })
    return
  }

  buffer.push({
    name: body.name,
    value: body.value,
    rating: body.rating ?? 'needs-improvement',
    delta: body.delta ?? body.value,
    id: body.id ?? '',
    navigationType: body.navigationType,
    url: body.url ?? '',
    timestamp: body.timestamp ?? Date.now(),
  })

  if (buffer.length > MAX) buffer.shift()

  // 202 Accepted — fire-and-forget for sendBeacon
  res.status(202).json({ ok: true })
}
