import { NavLink } from 'react-router-dom'
import { routeLinks } from '../lib/routes'

interface RouteAction {
  label: string
  to: string
  tone?: 'default' | 'primary'
}

interface PageRouteBarProps {
  actions: RouteAction[]
}

export function PageRouteBar({ actions }: PageRouteBarProps) {
  return (
    <nav className="route-bar" aria-label="页面导航">
      {actions.map((action) => (
        <NavLink
          key={`${action.label}-${action.to}`}
          to={action.to}
          end={action.to === routeLinks.home()}
          className={({ isActive }) =>
            [
              'route-button',
              action.tone === 'primary' ? 'route-button--primary' : '',
              isActive ? 'route-button--active' : '',
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          {action.label}
        </NavLink>
      ))}
    </nav>
  )
}
