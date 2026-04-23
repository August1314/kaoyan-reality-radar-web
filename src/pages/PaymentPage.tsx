import { PageRouteBar } from '../components/PageRouteBar'
import { routeLinks } from '../lib/routes'
import { useSEO } from '../hooks/useSEO'
import { SITE_URL } from '../lib/site-url'
import { monetizationConfig } from '../lib/monetization'
import wechatPayQr from '../assets/payments/wechat-pay-qr.jpg'

export function PaymentPage() {
  useSEO({
    title: '付费解锁',
    description: '扫码支付 9.9 元后提交付款凭证，人工确认后发放唯一完整解锁码。',
    keywords: '考研,付费解锁,微信支付,收款码,解锁码',
    canonicalUrl: `${SITE_URL}/pay`,
  })

  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '返回解锁页', to: routeLinks.unlock() },
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="card unlock-hero">
        <p className="eyebrow">付款页</p>
        <h1>先付款，再领取唯一完整解锁码。</h1>
        <p className="hero-copy">
          当前采用人工发码模式。你先扫码支付 {monetizationConfig.priceLabel}，再提交付款凭证，人工确认后会发放仅限一个浏览器设备使用的完整解锁码。
        </p>
      </section>

      <section className="payment-layout">
        <article className="card payment-qr-card">
          <div className="payment-qr-card__head">
            <span>当前可用方式</span>
            <strong>微信支付</strong>
          </div>
          <div className="payment-qr-frame">
            <img src={wechatPayQr} alt="微信支付收款码" className="payment-qr-image" />
          </div>
          <p className="payment-qr-card__tip">建议直接用微信扫一扫完成付款。支付宝入口后续补。</p>
        </article>

        <article className="card payment-guide-card">
          <div className="section-head left-align">
            <h2>付款步骤</h2>
            <p>先付款，再提交凭证。当前不做自动到账校验，先走低成本人工确认。</p>
          </div>
          <ol className="payment-step-list">
            <li>用微信扫描左侧收款码，支付 {monetizationConfig.priceLabel}。</li>
            <li>保留付款成功截图，避免人工核对时信息不足。</li>
            <li>点击下方按钮打开凭证表单，填写付款时间、截图和你的联系方式。</li>
            <li>人工确认后，你会收到一枚唯一完整解锁码，回到站内输入即可解锁完整内容。</li>
          </ol>

          <div className="payment-action-row">
            <a
              href={monetizationConfig.paidRequestUrl}
              className="route-button route-button--primary"
              target="_blank"
              rel="noreferrer"
            >
              提交付款凭证
            </a>
            <a href={wechatPayQr} className="route-button" target="_blank" rel="noreferrer">
              单独打开收款码
            </a>
          </div>

          <div className="info-block payment-notes">
            <h3>当前边界</h3>
            <ul>
              <li>完整解锁价为 {monetizationConfig.priceLabel}。</li>
              <li>每枚完整解锁码默认只绑定一个浏览器设备。</li>
              <li>如果换设备或清理浏览器数据，需要重新联系人工处理。</li>
              <li>如果你只想先多看样本，不必付款，也可以先走问卷解锁。</li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  )
}

