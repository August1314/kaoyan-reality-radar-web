import { Link } from 'react-router-dom'
import { monetizationConfig } from '../lib/monetization'
import { routeLinks } from '../lib/routes'

export function LegalFooter() {
  return (
    <footer className="legal-footer" aria-label="合规与联系信息">
      <div>
        <strong>考研现实雷达站</strong>
        <span>非官方信息参考工具，择校决策请以院校官方信息为准。</span>
      </div>
      <nav aria-label="合规链接">
        <Link to={routeLinks.privacy()}>隐私政策</Link>
        <Link to={routeLinks.terms()}>用户协议</Link>
        <Link to={routeLinks.disclaimer()}>免责声明</Link>
        <Link to={routeLinks.contact()}>联系反馈</Link>
        <a href={`mailto:${monetizationConfig.contactEmail}`}>{monetizationConfig.contactEmail}</a>
      </nav>
    </footer>
  )
}
