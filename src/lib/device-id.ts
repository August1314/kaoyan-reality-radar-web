const DEVICE_STORAGE_KEY = 'kaoyan-radar-device-id'

function createFallbackDeviceId(): string {
  const random = Math.random().toString(36).slice(2)
  return `device-${Date.now().toString(36)}-${random}`
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return createFallbackDeviceId()

  const stored = window.localStorage.getItem(DEVICE_STORAGE_KEY)
  if (stored) return stored

  const deviceId = window.crypto?.randomUUID?.() ?? createFallbackDeviceId()
  window.localStorage.setItem(DEVICE_STORAGE_KEY, deviceId)
  return deviceId
}
