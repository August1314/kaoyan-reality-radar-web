import type { Program } from './types'
import { formatRatio } from './format'

// ─── 分享卡片尺寸 ───
const W = 750
const CARD_H = 1050

// ─── 颜色系统（与站点视觉风格对齐：可信数据感） ───
const C = {
  bg: '#faf8f5',
  surface: '#ffffff',
  primary: '#1e2535',       // 深石墨（主色）
  accent: '#e05c3a',        // 低饱和强调色
  muted: '#7a8494',         // 次要文字
  border: '#e8e4de',
  tag: '#f0ece6',           // 标签背景
  tagText: '#6b6060',
}

// ─── 工具函数 ───
function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string,
  stroke?: string,
  strokeWidth = 1,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = strokeWidth
    ctx.stroke()
  }
}

// ─── 单个专业的卡片区块 ───
function drawProgramBlock(
  ctx: CanvasRenderingContext2D,
  program: Program,
  x: number,
  y: number,
  w: number,
  index: number,
) {
  // 卡片背景
  drawRect(ctx, x, y, w, 180, 8, C.surface, C.border, 1)

  // 顶部色条
  ctx.fillStyle = index === 0 ? C.accent : C.primary
  ctx.beginPath()
  ctx.roundRect(x, y, w, 4, [8, 8, 0, 0])
  ctx.fill()

  // 院校名
  ctx.font = `bold 22px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.primary
  ctx.fillText(program.school, x + 14, y + 34)

  // 专业名
  ctx.font = `14px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.muted
  ctx.fillText(`${program.major} · ${program.year}年`, x + 14, y + 54)

  // 分隔线
  ctx.fillStyle = C.border
  ctx.fillRect(x + 14, y + 64, w - 28, 1)

  // 指标行
  const metrics = [
    {
      label: '竞争比例',
      value: (() => {
        const r = formatRatio(program.applicants, program.admitted)
        return r ? `${r} : 1` : '未公开'
      })(),
    },
    {
      label: '最低录取分',
      value: program.lowestAdmittedScore != null ? `${program.lowestAdmittedScore}` : '未公开',
    },
    {
      label: '复录比',
      value:
        program.retestCount && program.admitted
          ? `${program.retestCount}:${program.admitted}`
          : '未公开',
    },
    {
      label: '复试线',
      value: program.retestLine != null ? `${program.retestLine}` : '未公开',
    },
  ]

  const metricY = y + 88
  const colW = (w - 28) / 2
  metrics.forEach((m, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const mx = x + 14 + col * colW
    const my = metricY + row * 40
    ctx.font = `12px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
    ctx.fillStyle = C.muted
    ctx.fillText(m.label, mx, my)
    ctx.font = `bold 16px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
    ctx.fillStyle = C.primary
    ctx.fillText(m.value, mx, my + 18)
  })

  // 风险标签（最多显示2个）
  if (program.riskTags.length > 0) {
    const tagsToShow = program.riskTags.slice(0, 2)
    let tagX = x + 14
    const tagY = y + 152
    tagsToShow.forEach((tag) => {
      const tagW = ctx.measureText(tag).width + 14
      drawRect(ctx, tagX, tagY, tagW, 22, 4, C.tag)
      ctx.font = `11px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
      ctx.fillStyle = C.tagText
      ctx.fillText(tag, tagX + 7, tagY + 15)
      tagX += tagW + 6
    })
  }
}

// ─── 主函数：生成并下载分享卡片 PNG ───
export function downloadShareCard(programs: Program[]): void {
  if (programs.length === 0) return

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')!

  // 背景
  ctx.fillStyle = C.bg
  ctx.fillRect(0, 0, W, CARD_H)

  // 顶部强调条
  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, W, 4)

  // 标题区
  const titleY = 52
  ctx.font = `bold 36px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.primary
  ctx.fillText('考研对比', 36, titleY)

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  ctx.font = `14px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.muted
  ctx.fillText(today, 36, titleY + 28)

  // 底部装饰线
  ctx.fillStyle = C.border
  ctx.fillRect(36, titleY + 44, W - 72, 1)

  // 专业卡片区
  const programCount = programs.length
  const cardW = Math.min(220, (W - 72) / programCount - 8)
  const cardX0 = (W - (cardW * programCount + (programCount - 1) * 8)) / 2
  const cardY = titleY + 64

  programs.forEach((p, i) => {
    const cx = cardX0 + i * (cardW + 8)
    drawProgramBlock(ctx, p, cx, cardY, cardW, i)
  })

  // 分割说明
  const noteY = cardY + 200
  ctx.font = `13px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.muted
  const note = programs.length === 2
    ? `${programs[0].school} vs ${programs[1].school}`
    : `${programs[0].school} · ${programs[1].school} · 等 ${programs.length} 所`
  ctx.fillText(note, 36, noteY)

  // 底部品牌区
  const brandY = CARD_H - 52

  // 分割线
  ctx.fillStyle = C.border
  ctx.fillRect(36, brandY - 16, W - 72, 1)

  // 品牌文字
  ctx.font = `12px "PingFang SC", "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = C.muted
  ctx.fillText('数据来源：考研现实雷达站', 36, brandY)
  ctx.fillText('kaoyan-reality-radar-web.vercel.app', 36, brandY + 18)

  // Logo 点缀（用 accent 色方块代替图标）
  ctx.fillStyle = C.accent
  ctx.fillRect(W - 80, brandY - 4, 6, 6)

  // ─── 导出 PNG ───
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  const slug = programs.map(p => p.school).join('_').replace(/\s+/g, '').slice(0, 20)
  link.download = `考研对比_${slug}_${new Date().toISOString().split('T')[0]}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
