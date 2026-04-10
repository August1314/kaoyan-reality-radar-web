import { Link } from 'react-router-dom'
import { useSearchHistory } from '../hooks/useSearchHistory'
import { routeLinks } from '../lib/routes'

export function SearchHistory() {
  const { history, clearHistory, removeHistory } = useSearchHistory()

  if (history.length === 0) return null

  return (
    <section className="search-history card">
      <div className="section-head">
        <h2>最近搜索</h2>
        <button
          type="button"
          className="search-history-clear"
          onClick={clearHistory}
          aria-label="清除搜索历史"
        >
          清除全部
        </button>
      </div>
      <ul className="search-history-list">
        {history.map((item) => (
          <li key={item.id} className="search-history-item">
            <Link to={routeLinks.result(item.slug)} className="search-history-link">
              <span className="search-history-label">{item.label}</span>
            </Link>
            <button
              type="button"
              className="search-history-remove"
              onClick={() => removeHistory(item.id)}
              aria-label={`删除 ${item.label}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
