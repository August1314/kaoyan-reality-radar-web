import type { EntitlementStore } from './entitlements.js'
import { kvGet, kvSet } from './kv.js'

export const kvStore: EntitlementStore = {
  get: kvGet,
  set: kvSet,
}
