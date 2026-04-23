import { kvGet, kvSet } from './kv.ts'
import type { EntitlementStore } from './entitlements.ts'

export const kvStore: EntitlementStore = {
  get: kvGet,
  set: kvSet,
}
