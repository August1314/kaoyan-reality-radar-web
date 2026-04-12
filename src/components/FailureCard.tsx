import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatFailureSourceLabel } from '../lib/format'
import { routeLinks } from '../lib/routes'
import type { FailureExperience } from '../lib/types'

interface FailureCardProps {
  failure: FailureExperience
}

/** 截断显示，最多显示 maxChars 个字符 */
function truncate(text: string, maxChars = 80) {
  return text.length > maxChars ? text.slice(0, maxChars) + '…' : text
}

export function FailureCard({ failure }: FailureCardProps) {
  const [expanded, setExpanded] = useState(false)

  const reminderLong = failure.reminder.length > 80

  return (
    <article className="failure-card">
      <div className="failure-card__top">
        <strong>
          {failure.attempt} · {failure.scoreRange}
        </strong>
        <span>
          {failure.failureStage} / {failure.finalResult}
        </span>
      </div>
      <ul className="tag-list muted-tags">
        {failure.failureTags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <div className="failure-card__body">
        <p className="failure-card__headline">{failure.reminder}</p>
        <p className={!expanded && reminderLong ? 'line-clamp-2' : ''}>
          {truncate(failure.review, 120)}
        </p>

        {expanded && (
          <div className="failure-extended">
            <p className="failure-extended__label">建议</p>
            <p>{truncate(failure.advice)}</p>
          </div>
        )}
      </div>

      {reminderLong && (
        <button
          className="failure-expand-btn"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? '收起' : '展开'}
        </button>
      )}

      <p className="failure-source">
        {formatFailureSourceLabel(failure.sourceType)}
      </p>
      <Link to={routeLinks.failure(failure.id)} className="text-link">
        查看详情
      </Link>
    </article>
  )
}
