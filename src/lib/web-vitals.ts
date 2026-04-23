/**
 * Web Vitals reporting — production only, non-blocking.
 *
 * Reports LCP, CLS, INP, TTFB to the /api/vitals endpoint
 * using navigator.sendBeacon so it never blocks navigation.
 */

import { onLCP, onCLS, onINP, onTTFB, type Metric } from 'web-vitals'

type VitalName = 'LCP' | 'CLS' | 'INP' | 'TTFB'

function reportToAPI(metric: Metric) {
  if (typeof navigator === 'undefined' || !navigator.sendBeacon) return

  const payload = JSON.stringify({
    name: metric.name as VitalName,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: location.pathname,
    timestamp: Date.now(),
  })

  navigator.sendBeacon('/api/vitals', payload)
}

export function initWebVitals() {
  // Only run in production
  if (import.meta.env.DEV) return

  onLCP(reportToAPI)
  onCLS(reportToAPI)
  onINP(reportToAPI)
  onTTFB(reportToAPI)
}
