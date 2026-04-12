import { NavLink } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { appNavItems, routeLinks } from '../lib/routes'

interface RouteAction {
  label: string
  to: string
  tone?: 'default' | 'primary'
}

interface PageRouteBarProps {
  actions?: RouteAction[]
}

export function PageRouteBar({ actions = [] }: PageRouteBarProps) {
  return (
    <header className="app-shell">
      <nav className="app-shell__bar" aria-label="全站导航">
        <NavLink to={routeLinks.home()} end className="app-shell__brand">
          <span className="app-shell__brand-mark" aria-hidden="true" />
          <span>考研现实雷达</span>
        </NavLink>

        <div className="app-shell__primary">
          {appNavItems.map((item) => (
            <NavLink
              key={`${item.label}-${item.to}`}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                ['app-shell__nav-link', isActive ? 'app-shell__nav-link--active' : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="app-shell__secondary">
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
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
