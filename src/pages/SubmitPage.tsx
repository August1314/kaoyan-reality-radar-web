import { PageRouteBar } from '../components/PageRouteBar'
import { routeLinks } from '../lib/routes'

export function SubmitPage() {
  return (
    <main id="main-content" className="page narrow-page">
      <PageRouteBar
        actions={[
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />
      <section className="card detail-body">
        <p className="eyebrow">投稿页</p>
        <h1>匿名补充失败经验</h1>
        <p>
          如果你也经历过考研失利，欢迎匿名补充一条真实样本。提交内容会先人工审核，再整理进站点结果页。
        </p>
        <div className="info-block">
          <h2>默认原则</h2>
          <ul>
            <li>默认匿名，不展示可识别个人身份信息。</li>
            <li>优先收集结构化字段，再补充详细复盘。</li>
            <li>所有内容先人工审核，再进入站点展示数据。</li>
          </ul>
        </div>
        <a
          href="https://dcnq3h3ty7w5.feishu.cn/share/base/form/shrcnmJtPBlKTL2Ooj84m7JbMOf"
          className="text-link"
          target="_blank"
          rel="noreferrer"
        >
          立即匿名投稿
        </a>
      </section>
    </main>
  )
}
