import { Link } from 'react-router-dom'
import { routeLinks } from '../lib/routes'

export function HomeFooterCTASection() {
  return (
    <section className="card card--subtle home-footer-panel">
      <div className="home-footer-panel__copy">
        <p className="eyebrow">继续补样本</p>
        <h2>匿名补一条失败经验。</h2>
        <p className="feature-panel__summary">公开站点，专注现实判断和风险提示。</p>
      </div>
      <div className="submit-card__actions">
        <Link to={routeLinks.unlock()} className="route-button">
          领取完整权益码
        </Link>
        <Link to={routeLinks.submit()} className="route-button route-button--primary">
          去投稿
        </Link>
        <Link to={routeLinks.stats()} className="route-button">
          看统计
        </Link>
      </div>
      <div className="home-footer-panel__meta">
        <span>公开资料整理</span>
        <span>匿名经验人工审核</span>
        <span>自助择校判断</span>
      </div>
    </section>
  )
}
