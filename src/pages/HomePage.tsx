import { useMemo } from 'react'
import { PageRouteBar } from '../components/PageRouteBar'
import { HomeFooterCTASection } from '../components/HomeFooterCTASection'
import { HomeFeatureSection } from '../components/HomeFeatureSection'
import { HomeHeroSection } from '../components/HomeHeroSection'
import { HomeQuickEntrySection } from '../components/HomeQuickEntrySection'
import { failuresCount, failureSummaries } from '../data/failures-metadata'
import { programIndex } from '../data/programIndex'
import { buildProgramSlug } from '../lib/programSlug'
import { routeLinks } from '../lib/routes'
import type { FeaturePanel, ProgramIndexEntry, PromoBandItem, TrustMetric } from '../lib/types'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

function pickDistinctSchoolExamples(limit: number): ProgramIndexEntry[] {
  const seenSchools = new Set<string>()

  return programIndex.filter((item) => {
    if (seenSchools.has(item.school)) return false
    seenSchools.add(item.school)
    return true
  }).slice(0, limit)
}

export function HomePage() {
  const examples = useMemo(() => pickDistinctSchoolExamples(3), [])
  const featuredExample = examples[0]
  const promoItems = useMemo<PromoBandItem[]>(
    () => [
      { label: '公开目标', value: `${programIndex.length} 条` },
      { label: '失败经验', value: `${failuresCount} 条` },
      { label: '资料边界', value: '公开资料 + 匿名投稿' },
    ],
    [],
  )
  const trustMetrics = useMemo<TrustMetric[]>(
    () => [
      { value: `${programIndex.length}`, label: '已收录目标' },
      { value: `${new Set(programIndex.map((item) => item.school)).size}`, label: '覆盖院校' },
      { value: `${new Set(programIndex.map((item) => item.major)).size}`, label: '覆盖专业' },
      { value: `${failuresCount}`, label: '失败经验' },
    ],
    [],
  )
  const featurePanels = useMemo<Record<'judgement' | 'failures' | 'compare', FeaturePanel>>(
    () => ({
      judgement: {
        eyebrow: '风险判断',
        title: '先看公开难度，不先听上岸故事。',
        summary: '报录比、复试线、最低录取分和风险标签先摆在前面，判断这件事先做定量。',
        theme: 'dark',
        actionLabel: '看统计',
        actionTo: routeLinks.stats(),
        secondaryLabel: '打开一个目标',
        secondaryTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
      },
      failures: {
        eyebrow: '失败经验',
        title: '别人怎么失手，比成功复盘更值钱。',
        summary: '这个站点最有价值的部分，不是“考上了”，而是“为什么在那一步掉下来了”。',
        theme: 'light',
        actionLabel: '看样本',
        actionTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
        secondaryLabel: '去投稿',
        secondaryTo: routeLinks.submit(),
      },
      compare: {
        eyebrow: '横向对比',
        title: '把相近目标摆在一排，少靠感觉选学校。',
        summary: '对比保留，但只当成深一步工具。先查单个目标，确认候选，再一起横向看。',
        theme: 'tint',
        actionLabel: '去对比',
        actionTo: routeLinks.compare(),
        secondaryLabel: '看结果页',
        secondaryTo: featuredExample ? routeLinks.result(buildProgramSlug(featuredExample)) : routeLinks.home(),
      },
    }),
    [featuredExample],
  )
  const featuredSchools = useMemo(() => pickDistinctSchoolExamples(8), [])
  const failureSamples = useMemo(() => failureSummaries, [])

  useScrollRestoration()

  return (
    <main id="main-content" className="page home-page apple-home-page">
      <PageRouteBar
        actions={[
          { label: '限时内测', to: routeLinks.unlock() },
          { label: '匿名投稿', to: routeLinks.submit(), tone: 'primary' },
        ]}
      />

      <section className="promo-band" aria-label="站点信息带">
        {promoItems.map((item) => (
          <article key={item.label} className="promo-band__item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <HomeHeroSection examples={examples} trustMetrics={trustMetrics} />
      <HomeFeatureSection
        featurePanels={featurePanels}
        trustMetrics={trustMetrics}
        failureSamples={failureSamples}
        examples={examples}
      />
      <HomeQuickEntrySection examples={examples} featuredSchools={featuredSchools} />
      <HomeFooterCTASection />
    </main>
  )
}
