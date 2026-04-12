import { useState } from 'react'
import type { Program } from '../lib/types'
import { formatRatio, formatRetestRate, formatMetricValue } from '../lib/format'

interface RadarChartProps {
  program: Program
}

// ─── 轴配置 ───
interface Axis {
  key: keyof Program
  label: string
  /** 0–100，null = 数据缺失 */
  value: number | null
  /** 缺失时显示的提示 */
  missingLabel?: string
}

function buildAxes(program: Program): Axis[] {
  const ratio = formatRatio(program.applicants, program.admitted)
  const retestRate = formatRetestRate(program.retestCount, program.admitted)

  return [
    {
      key: 'applicants',
      label: '竞争强度',
      value: ratio != null ? Math.min(100, (parseFloat(ratio) / 80) * 100) : null,
      missingLabel: ratio == null ? '报名人数未公开' : undefined,
    },
    {
      key: 'retestCount',
      label: '复试淘汰率',
      value:
        retestRate != null
          ? Math.min(100, ((parseFloat(retestRate) - 1) / 4) * 100)
          : null,
      missingLabel: retestRate == null ? '数据未公开' : undefined,
    },
    {
      key: 'retestLine',
      label: '复试线难度',
      value:
        program.retestLine != null
          ? Math.min(100, ((program.retestLine - 260) / 140) * 100)
          : null,
      missingLabel: program.retestLine == null ? '未公布' : undefined,
    },
    {
      key: 'lowestAdmittedScore',
      label: '最低录取分',
      value:
        program.lowestAdmittedScore != null
          ? Math.min(100, ((program.lowestAdmittedScore - 300) / 140) * 100)
          : null,
      missingLabel: program.lowestAdmittedScore == null ? '未公布' : undefined,
    },
    {
      key: 'riskTags',
      label: '风险标签',
      value: Math.min(100, (program.riskTags.length / 6) * 100),
    },
  ]
}

// ─── SVG 工具 ───
const CX = 160
const CY = 140
const R = 110
const AXIS_COUNT = 5
const LABEL_R = R + 28
const HEX = 360 / AXIS_COUNT

function axisPoint(i: number, r: number): [number, number] {
  const angle = ((i * HEX - 90) * Math.PI) / 180
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}

function labelPoint(i: number): [number, number] {
  const angle = ((i * HEX - 90) * Math.PI) / 180
  return [CX + LABEL_R * Math.cos(angle), CY + LABEL_R * Math.sin(angle)]
}



function riskLabel(value: number | null): string {
  if (value == null) return '数据缺失'
  if (value < 25) return '低'
  if (value < 50) return '偏低'
  if (value < 75) return '中高'
  return '高'
}

// ─── 主组件 ───
export function RadarChart({ program }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)
  const axes = buildAxes(program)
  const gridColor = 'var(--color-border-strong)'
  const accentColor = 'var(--color-accent)'
  const primaryColor = 'var(--color-primary)'
  const mutedColor = 'var(--color-text-muted)'
  const surfaceColor = 'var(--color-bg-strong)'

  // 雷达区域多边形（数据多边形）
  const dataPoints = axes.map((a, i) => {
    const r = a.value == null ? 0 : (a.value / 100) * R
    return axisPoint(i, r)
  })
  const dataPoly = dataPoints.map(([x, y]) => `${x},${y}`).join(' ')

  // 网格层（3层：33%、66%、100%）
  const gridLevels = [33, 66, 100]

  return (
    <div className="radar-chart-wrapper">
      <svg
        viewBox="0 0 320 260"
        className="radar-chart"
        aria-label={`${program.school} ${program.major} 难度雷达图`}
      >
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: accentColor, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: primaryColor, stopOpacity: 0.14 }} />
          </linearGradient>
          <filter id="radarGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 网格多边形 */}
        {gridLevels.map((level) => {
          const pts = axes.map((_, i) => axisPoint(i, (level / 100) * R))
          return (
            <polygon
              key={level}
              points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={gridColor}
              strokeWidth="1"
            />
          )
        })}

        {/* 轴线 */}
        {axes.map((_, i) => {
          const [ex, ey] = axisPoint(i, R)
          return <line key={i} x1={CX} y1={CY} x2={ex} y2={ey} stroke={gridColor} strokeWidth="1" />
        })}

        {/* 数据区域 */}
        <polygon
          points={dataPoly}
          fill="url(#radarFill)"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#radarGlow)"
        />

        {/* 数据点 + 交互热区 */}
        {axes.map((axis, i) => {
          const [px, py] = axisPoint(i, axis.value == null ? 0 : (axis.value / 100) * R)
          return (
            <g key={axis.key}>
              {/* 热区（更大的透明 hitbox） */}
              <circle
                cx={px}
                cy={py}
                r={14}
                fill="transparent"
                style={{ cursor: axis.value != null ? 'pointer' : 'default' }}
                onMouseEnter={(e) => {
                  if (axis.value == null) return
                  const rect = (e.target as SVGCircleElement)
                    .ownerSVGElement!.getBoundingClientRect()
                  const svgEl = (e.target as SVGCircleElement).ownerSVGElement!
                  const vb = svgEl.viewBox.baseVal
                  const scaleX = rect.width / vb.width
                  const scaleY = rect.height / vb.height
                  setTooltip({
                    x: px * scaleX + rect.left,
                    y: py * scaleY + rect.top - 8,
                    text: getTooltipText(axis),
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* 数据点 */}
              <circle
                cx={px}
                cy={py}
                r={axis.value == null ? 4 : 5}
                fill={axis.value == null ? mutedColor : accentColor}
                stroke={surfaceColor}
                strokeWidth="2"
              />
            </g>
          )
        })}

        {/* 轴标签 */}
        {axes.map((axis, i) => {
          const [lx, ly] = labelPoint(i)
          const textAnchor =
            lx < CX - 10 ? 'end' : lx > CX + 10 ? 'start' : 'middle'
          return (
            <text
              key={axis.key}
              x={lx}
              y={ly}
              textAnchor={textAnchor}
            dominantBaseline="auto"
              fontSize="12"
              fill={mutedColor}
              fontWeight="600"
            >
              {axis.label}
            </text>
          )
        })}

        {/* 中心标注 */}
        <text
          x={CX}
          y={CY + 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill={mutedColor}
          pointerEvents="none"
        >
          难度
        </text>
      </svg>

      {/* 工具提示（绝对定位，覆盖在 SVG 上方） */}
      {tooltip && (
        <div
          className="radar-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* 风险等级图例 */}
      <div className="radar-legend">
        {axes.map((axis) => (
          <div key={axis.key} className="radar-legend-item">
            <span
              className="radar-legend-dot"
              style={{
                background: axis.value == null ? mutedColor : accentColor,
              }}
            />
            <span className="radar-legend-label">{axis.label}</span>
            <span className="radar-legend-level">
              {axis.value == null
                ? axis.missingLabel ?? '—'
                : riskLabel(axis.value)}
            </span>
          </div>
        ))}
      </div>

      {/* 原始数据值 */}
      <div className="radar-raw-values">
        <span>报录比：{formatRatio(program.applicants, program.admitted) ?? '未公开'}</span>
        <span>复录比：{retestRateLabel(program)}</span>
        <span>复试线：{formatMetricValue(program.retestLine)}</span>
        <span>最低录取：{formatMetricValue(program.lowestAdmittedScore)}</span>
      </div>
    </div>
  )
}

function retestRateLabel(program: Program): string {
  const v = formatRetestRate(program.retestCount, program.admitted)
  if (v == null) return '未公开'
  return `${v} : 1`
}

function getTooltipText(axis: Axis): string {
  const level = riskLabel(axis.value)
  const raw =
    axis.value == null
      ? axis.missingLabel ?? '数据缺失'
      : axis.label === '竞争强度'
      ? `报录比约 ${((axis.value / 100) * 80).toFixed(0)} : 1`
      : axis.label === '复试淘汰率'
      ? `复录比约 ${(((axis.value / 100) * 4 + 1)).toFixed(1)} : 1`
      : axis.label === '复试线难度'
      ? `复试线约 ${Math.round((axis.value / 100) * 140 + 260)} 分`
      : axis.label === '最低录取分'
      ? `最低录取约 ${Math.round((axis.value / 100) * 140 + 300)} 分`
      : axis.label === '风险标签'
      ? `${axis.value == null ? 0 : Math.round((axis.value / 100) * 6)} 个风险标签`
      : ''
  return `${axis.label}：${level}（${raw}）`
}
