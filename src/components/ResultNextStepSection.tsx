import { Link } from 'react-router-dom'
import { routeLinks } from '../lib/routes'

export function ResultNextStepSection() {
  return (
    <section id="next-step" className="card submit-card submit-card--hero">
      <div>
        <p className="eyebrow">下一步</p>
        <h2>继续补样本，或者开始对比。</h2>
      </div>
      <div className="submit-card__actions">
        <Link to={routeLinks.compare()} className="route-button">
          去对比
        </Link>
        <Link to={routeLinks.stats()} className="route-button">
          看统计
        </Link>
        <Link to={routeLinks.unlock()} className="route-button">
          解锁失败经验
        </Link>
        <Link to={routeLinks.submit()} className="route-button route-button--primary">
          去投稿
        </Link>
      </div>
    </section>
  )
}
