export function SubmitPage() {
  return (
    <main className="page narrow-page">
      <section className="card detail-body">
        <p className="eyebrow">投稿页</p>
        <h1>匿名补充失败经验</h1>
        <p>
          第一版不自建后端，投稿先通过站外表单完成。这里先放说明骨架，下一步接入飞书表单链接。
        </p>
        <div className="info-block">
          <h2>默认原则</h2>
          <ul>
            <li>默认匿名，不展示可识别个人身份信息。</li>
            <li>优先收集结构化字段，再补充详细复盘。</li>
            <li>所有内容先人工审核，再进入站点展示数据。</li>
          </ul>
        </div>
        <a href="https://example.com" className="text-link" target="_blank" rel="noreferrer">
          预留：打开投稿表单
        </a>
      </section>
    </main>
  )
}
