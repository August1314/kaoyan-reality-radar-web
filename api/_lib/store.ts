import { kvGet, kvSet } from './kv'
import type { EntitlementStore } from './entitlements'

export const kvStore: EntitlementStore = {
  get: kvGet,
  set: kvSet,
}
