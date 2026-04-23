import { useState, type FormEvent } from 'react'
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
    title: '解锁失败经验库',
    description: '免费查看 2 条考研失败经验，填写择校问卷后解锁更多样本，付费后解锁完整失败经验库和导出能力。',
    keywords: '考研,失败经验,解锁,择校问卷,考研付费报告',
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
        setMessage('解锁失败，请稍后重试。')
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

      <section className="card unlock-hero">
        <p className="eyebrow">失败经验库</p>
        <h1>先免费试用，再决定是否解锁完整样本。</h1>
        <p className="hero-copy">
          免费用户可看 2 条失败经验；填写择校问卷后可看更多样本；付费后解锁完整失败经验库、完整 CSV 和分享卡片能力。
        </p>
      </section>

      <section className="unlock-grid">
        <article className="card unlock-plan">
          <span>当前状态</span>
          <strong>{getEntitlementLabel(level)}</strong>
          <p>{loading ? '正在校准服务端状态...' : '你的解锁状态会绑定到当前浏览器设备。更换设备后，需要使用新的人工发放解锁码。'}</p>
        </article>

        <article className="card unlock-plan">
          <span>免费体验</span>
          <strong>2 条失败经验</strong>
          <p>先判断这个目标是否值得继续研究，不要求登录，不阻断基础搜索。</p>
        </article>

        <article className="card unlock-plan unlock-plan--highlight">
          <span>问卷解锁</span>
          <strong>最多 8 条</strong>
          <p>填写择校需求问卷后，人工发放唯一问卷解锁码。每个解锁码只能绑定一个浏览器设备。</p>
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
          <span>完整解锁</span>
          <strong>{monetizationConfig.priceLabel}</strong>
          <p>人工确认后发放唯一完整解锁码，适合已经进入择校对比阶段的考生。</p>
          <a
            href={monetizationConfig.paidRequestUrl}
            className="route-button"
            target="_blank"
            rel="noreferrer"
          >
            申请付费解锁
          </a>
        </article>
      </section>

      <section className="card unlock-form-card">
        <div className="section-head left-align">
          <h2>输入解锁码</h2>
          <p>问卷解锁码或人工发放的完整解锁码。每个码只能绑定一个设备。</p>
        </div>
        <form className="unlock-form" onSubmit={handleSubmit}>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="输入解锁码"
            aria-label="解锁码"
          />
          <button type="submit" className="route-button route-button--primary" disabled={submitting}>
            {submitting ? '解锁中...' : '解锁'}
          </button>
        </form>
        {message ? <p className="unlock-message">{message}</p> : null}
      </section>
    </main>
  )
}
