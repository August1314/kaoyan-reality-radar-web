import { Link } from 'react-router-dom'
import type { FailureExperience } from '../lib/types'

interface FailureCardProps {
  failure: FailureExperience
}

export function FailureCard({ failure }: FailureCardProps) {
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
      <p>{failure.reminder}</p>
      <Link to={`/failure/${failure.id}`} className="text-link">
        查看详情
      </Link>
    </article>
  )
}
