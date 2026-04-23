import { Navigate } from 'react-router-dom'
import { routeLinks } from '../lib/routes'

export function LegacyPayRedirectPage() {
  return <Navigate to={routeLinks.unlock()} replace />
}
