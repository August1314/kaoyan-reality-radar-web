import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { useEntitlement } from '../hooks/useEntitlement'
import { getEntitlementLabel, monetizationConfig } from '../lib/monetization'
import { routeLinks } from '../lib/routes'
import { useSEO } from '../hooks/useSEO'
import { SITE_URL } from '../lib/site-url'
import { EntitlementApiError } from '../lib/entitlement-api'

export function UnlockPage() {
  const { level, applyUnlockCode, loading } = useEntitlement()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useSEO({
    title: '限时内测免费领取完整权益',
    description: '提交择校问卷后，人工发送唯一完整权益码，解锁完整失败经验库、统计、导出和分享能力。',
    keywords: '考研,失败经验,择校问卷,完整权益码,限时内测',
    canonicalUrl: `${SITE_URL}/unlock`,
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    try {
      const nextLevel = await applyUnlockCode(code)
      setCode('')
      setMessage(`已切换到「${getEntitlementLabel(nextLevel)}」。回到结果页即可查看对应内容。`)
    } catch (error) {
      if (error instanceof EntitlementApiError) {
        setMessage(error.message)
      } else {
        setMessage('兑换失败，请稍后重试。')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '返回首页', to: routeLinks.home() },
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card unlock-hero unlock-campaign-hero">
        <div className="unlock-campaign-hero__badge">{monetizationConfig.campaignLabel}</div>
        <p className="eyebrow">考研现实雷达站内测福利</p>
        <h1>限时内测免费领取完整权益。</h1>
        <p className="hero-copy">
          基础体验可先查看 2 个目标；提交择校问卷后，我们会根据你填写的邮箱或手机号人工发送唯一完整权益码。
        </p>
        <div className="unlock-campaign-hero__actions">
          <a
            href={monetizationConfig.surveyFormUrl}
            className="route-button route-button--primary"
            target="_blank"
            rel="noreferrer"
          >
            立即填写问卷
          </a>
          <a href={`mailto:${monetizationConfig.contactEmail}`} className="route-button">
            联系人工处理
          </a>
        </div>
      </section>

      <section className="unlock-step-strip" aria-label="领取完整权益码步骤">
        <article>
          <span>1</span>
          <strong>填写择校问卷</strong>
          <p>留下你的目标、邮箱或手机号，帮助我们补充真实需求。</p>
        </article>
        <article>
          <span>2</span>
          <strong>人工发送权益码</strong>
          <p>内测期人工核对问卷后发送唯一完整权益码。</p>
        </article>
        <article>
          <span>3</span>
          <strong>回站内兑换</strong>
          <p>输入权益码后，可查看完整样本、统计、导出和分享能力。</p>
        </article>
      </section>

      <section className="unlock-grid">
        <article className="card unlock-plan">
          <span>当前状态</span>
          <strong>{getEntitlementLabel(level)}</strong>
          <p>{loading ? '正在同步当前权益...' : `权益状态会绑定到当前浏览器设备。更换设备时，可联系 ${monetizationConfig.contactEmail} 协助处理。`}</p>
        </article>

        <article className="card unlock-plan">
          <span>基础体验</span>
          <strong>2 个目标</strong>
          <p>无需登录即可先查看基础目标结果和少量失败经验，判断是否继续研究。</p>
        </article>

        <article className="card unlock-plan unlock-plan--highlight">
          <span>限时内测</span>
          <strong>完整权益码</strong>
          <p>提交择校需求问卷后，人工发送唯一完整权益码。每个码默认绑定一个浏览器设备。</p>
          <a
            href={monetizationConfig.surveyFormUrl}
            className="route-button route-button--primary"
            target="_blank"
            rel="noreferrer"
          >
            填写择校问卷
          </a>
        </article>

        <article className="card unlock-plan">
          <span>完整权益</span>
          <strong>不限目标</strong>
          <p>完整权益包含不限目标浏览、全站统计、CSV 导出、对比导出和分享卡片能力。</p>
          <Link to={routeLinks.privacy()} className="route-button">
            查看隐私政策
          </Link>
        </article>
      </section>

      <section className="card unlock-form-card">
        <div className="section-head left-align">
          <h2>输入解锁码</h2>
          <p>请输入人工发送的完整权益码。每个码默认绑定一个浏览器设备。</p>
        </div>
        <form className="unlock-form" onSubmit={handleSubmit}>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="输入完整权益码"
            aria-label="完整权益码"
          />
          <button type="submit" className="route-button route-button--primary" disabled={submitting}>
            {submitting ? '兑换中...' : '兑换完整权益'}
          </button>
        </form>
        {message ? <p className="unlock-message">{message}</p> : null}
      </section>

      <section className="card unlock-compliance-card">
        <p className="eyebrow">信息与合规说明</p>
        <h2>提交问卷前请确认这些边界。</h2>
        <ul>
          <li>本站是非官方考研信息参考工具，不提供升学保证或个性化咨询承诺。</li>
          <li>问卷中的邮箱和手机号仅用于人工发送完整权益码、处理反馈和改进产品。</li>
          <li>如需查询、更正、删除个人信息或撤回投稿，可联系 {monetizationConfig.contactEmail}。</li>
        </ul>
        <div className="unlock-inline-card__actions">
          <Link to={routeLinks.terms()} className="route-button">
            用户协议
          </Link>
          <Link to={routeLinks.disclaimer()} className="route-button">
            免责声明
          </Link>
          <Link to={routeLinks.contact()} className="route-button">
            联系反馈
          </Link>
        </div>
      </section>
    </main>
  )
}
