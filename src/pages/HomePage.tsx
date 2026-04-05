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
          <p className="hint danger">暂时没匹配到结果。你也可以先看看下面这些真实案例，快速感受不同目标的难度差异。</p>
        ) : null}
      </section>

      <section className="card">
        <div className="section-head">
          <h2>直接看真实案例</h2>
          <p>先看几个已经整理好的目标，快速判断这类学校和专业到底难在哪。</p>
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

      <section className="card submit-card">
        <div>
          <h2>我也想匿名补充失败经验</h2>
        </div>
        <Link to="/submit" className="text-link">
          去看投稿说明
        </Link>
      </section>
    </main>
  )
}
