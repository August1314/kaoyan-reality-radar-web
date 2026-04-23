function getKvEnv() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  return url && token ? { url: url.replace(/\/+$/, ''), token } : null
}

function kvUrl(baseUrl: string, command: string, key: string, value?: string): string {
  const parts = [baseUrl, command, encodeURIComponent(key)]
  if (value !== undefined) parts.push(encodeURIComponent(value))
  return parts.join('/')
}

export async function kvGet<T>(key: string): Promise<T | null> {
  const env = getKvEnv()
  if (!env) return null

  const response = await fetch(kvUrl(env.url, 'get', key), {
    headers: { Authorization: `Bearer ${env.token}` },
  })

  if (!response.ok) {
    throw new Error(`KV get failed: ${response.status}`)
  }

  const body = await response.json() as { result?: string | null }
  if (!body.result) return null
  return JSON.parse(body.result) as T
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  const env = getKvEnv()
  if (!env) {
    throw new Error('缺少 KV_REST_API_URL 或 KV_REST_API_TOKEN')
  }

  const response = await fetch(kvUrl(env.url, 'set', key, JSON.stringify(value)), {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.token}` },
  })

  if (!response.ok) {
    throw new Error(`KV set failed: ${response.status}`)
  }
}
