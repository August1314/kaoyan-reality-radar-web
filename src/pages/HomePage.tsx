import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { programs } from '../data/programs'
import { buildProgramSlug, searchProgram } from '../lib/search'

export function HomePage() {
  const navigate = useNavigate()
  const [school, setSchool] = useState('')
  const [major, setMajor] = useState('')
  const [showEmptyHint, setShowEmptyHint] = useState(false)

  const examples = useMemo(() => programs.slice(0, 3), [])

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = searchProgram({ school, major })
    if (!result.program) {
      setShowEmptyHint(true)
      return
    }

    navigate(`/result/${encodeURIComponent(buildProgramSlug(result.program))}`)
  }

  const handleExampleClick = (exampleSchool: string, exampleMajor: string) => {
    setSchool(exampleSchool)
    setMajor(exampleMajor)
    const result = searchProgram({ school: exampleSchool, major: exampleMajor })

    if (result.program) {
      navigate(`/result/${encodeURIComponent(buildProgramSlug(result.program))}`)
    }
  }

  return (
    <main className="page home-page">
      <section className="hero-section card">
        <p className="eyebrow">超小 MVP</p>
        <h1>考研现实雷达</h1>
        <p className="hero-copy">查难度，也看别人怎么失败。</p>
        <form className="search-panel" onSubmit={handleSearch}>
          <label>
            学校
            <input
              value={school}
              onChange={(event) => setSchool(event.target.value)}
              placeholder="例如：中山大学"
            />
          </label>
          <label>
            专业
            <input
              value={major}
              onChange={(event) => setMajor(event.target.value)}
              placeholder="例如：计算机科学与技术"
            />
          </label>
          <button type="submit">开始判断</button>
        </form>
        {showEmptyHint ? (
          <p className="hint danger">暂时没匹配到结果。第一版只覆盖少量高需求目标，可先点下面示例入口。</p>
        ) : null}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>示例入口</h2>
          <p>先用示例感受首页到结果页的最小闭环。</p>
        </div>
        <div className="example-grid">
          {examples.map((item) => (
            <button
              key={item.id}
              type="button"
              className="example-card"
              onClick={() => handleExampleClick(item.school, item.major)}
            >
              <strong>{item.school}</strong>
              <span>{item.major}</span>
              <small>{item.summary}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="card info-grid">
        <div>
          <h2>这版只做什么</h2>
          <ul>
            <li>搜索目标院校 / 专业</li>
            <li>查看难度雷达与一句话判断</li>
            <li>查看失败经验卡片</li>
          </ul>
        </div>
        <div>
          <h2>这版明确不做什么</h2>
          <ul>
            <li>导师点评</li>
            <li>上岸概率预测</li>
            <li>论坛式灌水社区</li>
          </ul>
        </div>
      </section>

      <section className="card submit-card">
        <div>
          <h2>我也想匿名补充失败经验</h2>
          <p>第一版先走站外投稿，降低实现成本。</p>
        </div>
        <Link to="/submit" className="text-link">
          去看投稿说明
        </Link>
      </section>
    </main>
  )
}
