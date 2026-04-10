import { Link } from 'react-router-dom'
import { routeLinks } from '../lib/routes'
import { useCompare } from '../hooks/useCompare'

export function CompareButton() {
  const { compareIds, clear } = useCompare()
  const count = compareIds.length

  return (
    <div className="compare-bar">
      {count > 0 && (
        <>
          <span className="compare-count">
            {count} / 3 已添加对比
          </span>
          <Link to={routeLinks.compare()} className="route-button compare-btn">
            开始对比
          </Link>
          <button type="button" className="text-link" onClick={clear}>
            清空
          </button>
        </>
      )}
    </div>
  )
}

export function CompareToggle({ programId }: { programId: string }) {
  const { toggle, isCompare } = useCompare()
  const active = isCompare(programId)

  return (
    <button
      type="button"
      className={`compare-toggle ${active ? 'compare-toggle--active' : ''}`}
      onClick={() => toggle(programId)}
      aria-pressed={active}
      title={active ? '从对比中移除' : '加入对比'}
    >
      {active ? '✓ 对比中' : '+ 对比'}
    </button>
  )
}
