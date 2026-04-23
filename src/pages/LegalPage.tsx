import { Link, useLocation } from 'react-router-dom'
import { PageRouteBar } from '../components/PageRouteBar'
import { useSEO } from '../hooks/useSEO'
import { monetizationConfig } from '../lib/monetization'
import { routeLinks } from '../lib/routes'
import { SITE_URL } from '../lib/site-url'

interface LegalSection {
  title: string
  body: string[]
}

interface LegalPageConfig {
  title: string
  description: string
  eyebrow: string
  sections: LegalSection[]
}

const contactLink = `mailto:${monetizationConfig.contactEmail}`

const legalPages: Record<string, LegalPageConfig> = {
  '/privacy': {
    title: '隐私政策',
    eyebrow: '隐私与个人信息',
    description: '说明考研现实雷达站如何收集、使用、保存和处理个人信息。',
    sections: [
      {
        title: '我们会处理的信息',
        body: [
          '为提供基础体验、完整权益码兑换和内容审核，我们会处理匿名设备 ID、已查看目标记录、兑换码状态、问卷中填写的邮箱和手机号、投稿内容，以及你主动提供的联系信息。',
          '问卷由飞书表单承接；完整权益码校验使用 Vercel Functions 与 Upstash KV。相关服务可能涉及境外或第三方基础设施处理。',
        ],
      },
      {
        title: '使用目的',
        body: [
          '这些信息仅用于发送限时内测完整权益码、校验设备权益、处理投稿审核、改进产品体验、排查异常访问和响应你的反馈请求。',
          '我们不会把你的问卷联系方式公开展示；匿名投稿展示前会先人工审核，并尽量移除可识别个人身份的信息。',
        ],
      },
      {
        title: '你的权利',
        body: [
          `如需查询、更正、删除个人信息，撤回投稿，或处理设备更换后的权益码问题，请通过 ${monetizationConfig.contactEmail} 联系。`,
          '为确认请求来源，我们可能需要你提供与问卷或投稿相匹配的必要信息。',
        ],
      },
    ],
  },
  '/terms': {
    title: '用户协议',
    eyebrow: '使用规则',
    description: '说明考研现实雷达站的使用边界、权益码规则和用户责任。',
    sections: [
      {
        title: '服务定位',
        body: [
          '本站是非官方考研信息参考工具，基于公开资料、匿名经验和人工整理提供风险提示、结果页、统计和对比能力。',
          '本站不提供培训服务、个性化咨询、升学承诺或录取结果保证。',
        ],
      },
      {
        title: '限时内测权益码',
        body: [
          '内测期内，提交择校问卷后，我们会根据问卷中填写的邮箱或手机号人工发送唯一完整权益码。',
          '完整权益码默认绑定一个浏览器设备。更换设备、清理浏览器数据或遇到兑换异常时，可通过公开邮箱联系处理。',
        ],
      },
      {
        title: '用户责任',
        body: [
          '你提交的问卷、投稿和反馈应尽量真实、克制，不得包含违法信息、恶意攻击、可识别他人的隐私信息或未经授权的内部材料。',
          '如内容存在明显风险，本站可以不展示、调整措辞或移除相关内容。',
        ],
      },
    ],
  },
  '/disclaimer': {
    title: '免责声明',
    eyebrow: '信息边界',
    description: '说明考研现实雷达站数据来源、使用边界和风险提示。',
    sections: [
      {
        title: '信息来源与准确性',
        body: [
          '本站数据来自公开资料、匿名样本和人工整理，可能存在滞后、不完整、录入误差或样本偏差。',
          '院校政策、招生计划、复试规则和分数线可能随年份变化，最终应以目标院校和主管部门公开信息为准。',
        ],
      },
      {
        title: '决策边界',
        body: [
          '本站提供的是择校风险参考，不构成报考建议、录取预测或个性化咨询。',
          '你应结合自身基础、院校官方信息、导师或专业人士意见独立做出判断。',
        ],
      },
      {
        title: '第三方链接',
        body: [
          '本站可能跳转到飞书表单等第三方服务。第三方服务的可用性、数据处理规则和安全措施由对应平台负责。',
          '如果你发现页面内容存在错误、侵权或隐私风险，请及时联系处理。',
        ],
      },
    ],
  },
  '/contact': {
    title: '联系反馈',
    eyebrow: '人工处理入口',
    description: '联系考研现实雷达站，处理权益码、投稿、隐私和反馈问题。',
    sections: [
      {
        title: '联系邮箱',
        body: [
          `统一联系邮箱：${monetizationConfig.contactEmail}`,
          '你可以通过该邮箱咨询限时内测完整权益码、反馈页面错误、申请撤回投稿、请求查询或删除个人信息。',
        ],
      },
      {
        title: '处理说明',
        body: [
          '涉及权益码和问卷的请求，请尽量使用问卷中填写过的邮箱联系，便于人工核对。',
          '涉及内容错误或隐私风险的请求，请附上页面链接、目标名称和需要处理的具体内容。',
        ],
      },
    ],
  },
}

export function LegalPage() {
  const { pathname } = useLocation()
  const config = legalPages[pathname] ?? legalPages['/contact']

  useSEO({
    title: config.title,
    description: config.description,
    keywords: '考研现实雷达站,隐私政策,用户协议,免责声明,联系反馈',
    canonicalUrl: `${SITE_URL}${pathname}`,
  })

  return (
    <main id="main-content" className="page narrow-page legal-page">
      <PageRouteBar
        actions={[
          { label: '返回首页', to: routeLinks.home() },
          { label: '限时内测', to: routeLinks.unlock(), tone: 'primary' },
        ]}
      />
      <section className="card legal-hero">
        <p className="eyebrow">{config.eyebrow}</p>
        <h1>{config.title}</h1>
        <p className="hero-copy">{config.description}</p>
      </section>

      <section className="card legal-content">
        {config.sections.map((section) => (
          <article key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
        ))}
        <div className="legal-contact-card">
          <span>需要人工处理？</span>
          <a href={contactLink}>{monetizationConfig.contactEmail}</a>
          <Link to={routeLinks.unlock()} className="route-button route-button--primary">
            返回限时内测入口
          </Link>
        </div>
      </section>
    </main>
  )
}
