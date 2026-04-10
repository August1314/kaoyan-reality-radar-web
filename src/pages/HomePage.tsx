import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { PageRouteBar } from '../components/PageRouteBar'
import { ProgramBrowseGrid } from '../components/ProgramBrowseGrid'
import { SearchHistory } from '../components/SearchHistory'
import { SearchInput } from '../components/SearchInput'
import { programs } from '../data/programs'
import { routeLinks } from '../lib/routes'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

export function HomePage() {
  const examples = useMemo(() => programs.slice(0, 3), [])
  
  // 恢复滚动位置
  useScrollRestoration()

  return (
    <main className="page home-page">
      <PageRouteBar
        actions={[
          { label: '首页', to: routeLinks.home() },
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />
      <section className="hero-section card">
        <h1>考研现实雷达</h1>
        <p className="hero-copy">查难度，也看别人怎么失败。</p>

        {/* 智能搜索框：替代旧的 school + major 双输入 */}
        <SearchInput className="hero-search" />

        {/* 搜索历史 */}
        <SearchHistory />

        <p className="search-hint">
          试试：<button type="button" onClick={() => {/* 由 SearchInput 内部处理 */}}>中山大学</button>
          {' · '}
          <button type="button">浙江大学</button>
          {' · '}
          <button type="button">计算机</button>
        </p>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>直接看真实案例</h2>
          <p>先看几个已经整理好的目标，快速判断这类学校和专业到底难在哪。</p>
        </div>
        <div className="example-grid">
          {examples.map((item) => (
            <Link
              key={item.id}
              to={routeLinks.result(`${item.year}-${item.school}-${item.major}`)}
              className="example-card"
            >
              <strong>{item.school}</strong>
              <span>{item.major}</span>
              <small>{item.summary}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-head">
          <h2>按学校浏览已收录目标</h2>
          <p>先看学校，再展开看学校下已经整理好的具体方向。</p>
        </div>
        <ProgramBrowseGrid />
      </section>

      <section className="card submit-card">
        <div>
          <h2>我也想匿名补充失败经验</h2>
        </div>
        <Link to={routeLinks.submit()} className="text-link">
          去看投稿说明
        </Link>
      </section>
    </main>
  )
}
