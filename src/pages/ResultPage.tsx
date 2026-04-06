import { Link, useParams } from 'react-router-dom'
import { FailureCard } from '../components/FailureCard'
import { PageRouteBar } from '../components/PageRouteBar'
import { RadarCard } from '../components/RadarCard'
import { ResultContextCard } from '../components/ResultContextCard'
import { RiskTagList } from '../components/RiskTagList'
import { routeLinks } from '../lib/routes'
import { findProgramBySlug, searchProgram } from '../lib/search'

export function ResultPage() {
  const { slug = '' } = useParams()
  const program = findProgramBySlug(slug)

  if (!program) {
    return (
      <main className="page narrow-page">
        <PageRouteBar
          actions={[
            { label: '返回首页', to: routeLinks.home() },
            { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
          ]}
        />
        <section className="card empty-state">
          <h1>暂时还没有找到这个目标</h1>
          <p>可以先返回首页看看已收录的真实案例，或者换一个更接近的学校和专业试试。</p>
          <div className="empty-state-actions">
            <Link to={routeLinks.home()} className="route-button route-button--primary">
              返回首页继续搜索
            </Link>
            <Link to={routeLinks.home()} className="route-button">
              浏览已收录目标
            </Link>
            <Link to={routeLinks.submit()} className="route-button">
              去匿名投稿
            </Link>
          </div>
          <p className="empty-state-note">如果你只是关键词没打准，先回首页从真实案例入口挑一个相近目标再搜一次。</p>
        </section>
      </main>
    )
  }

  const result = searchProgram({ school: program.school, major: program.major })

  return (
    <main className="page result-page">
      <PageRouteBar
        actions={[
          { label: '返回首页', to: routeLinks.home() },
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />
      <section className="card page-head">
        <p className="eyebrow">目标判断</p>
        <h1>
          {program.school} · {program.major}
        </h1>
        <p className="hero-copy">先看难度，再看失败路径，避免只看上岸叙事。</p>
        <p className="meta-line">本页基于 {program.year} 年官方公开材料整理。</p>
      </section>

      <ResultContextCard program={program} />

      <section className="result-layout">
        <RadarCard program={program} />
        <section className="card reminder-card">
          <h2>现实提醒</h2>
          <p>数字只能说明一部分。真正影响决策的，往往是别人在哪一步掉坑。</p>
          <RiskTagList tags={program.riskTags} />
          <p className="source-note">来源备注：{program.sourceNote}</p>
        </section>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>失败经验</h2>
          <p>这些都是真实样本，先看共性问题，再点进去看完整复盘。</p>
        </div>
        <div className="failure-list">
          {result.failures.map((item) => (
            <FailureCard key={item.id} failure={item} />
          ))}
        </div>
      </section>

      <section className="card submit-card">
        <div>
          <h2>你也经历过类似失败？</h2>
          <p>匿名补充一条真实经历，会让后来的人少踩一次坑。</p>
        </div>
        <Link to={routeLinks.submit()} className="text-link">
          去投稿
        </Link>
      </section>
    </main>
  )
}
