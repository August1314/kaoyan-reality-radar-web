export interface ApiRequest {
  method?: string
  query: Record<string, string | string[] | undefined>
  body?: unknown
  headers: Record<string, string | string[] | undefined>
}

export interface ApiResponse {
  status(code: number): ApiResponse
  setHeader(name: string, value: string): void
  json(body: unknown): void
  end(): void
}

const DEFAULT_ALLOWED_ORIGINS = [
  'https://kaoyan-reality-radar-web.vercel.app',
  'https://august1314.github.io',
]

export function getAllowedOrigins(raw = process.env.ALLOWED_ORIGINS): string[] {
  if (!raw) return DEFAULT_ALLOWED_ORIGINS
  return raw.split(',').map((item) => item.trim()).filter(Boolean)
}

export function getSingleQueryValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export function isOriginAllowed(origin: string | undefined, allowedOrigins = getAllowedOrigins()): boolean {
  if (!origin) return true
  return allowedOrigins.includes(origin)
}

export function applyCors(req: ApiRequest, res: ApiResponse): boolean {
  const origin = getSingleQueryValue(req.headers.origin)

  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }

  if (!isOriginAllowed(origin)) {
    res.status(403).json({ error: 'origin_not_allowed', message: '当前访问来源暂未接入站点接口。' })
    return true
  }

  return false
}
