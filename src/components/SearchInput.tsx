import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { programs } from '../data/programs'
import { routeLinks } from '../lib/routes'
import { buildProgramSlug } from '../lib/search'
import { useSearchHistory } from '../hooks/useSearchHistory'
import type { Program } from '../lib/types'

/**
 * 高亮匹配文字
 * "中山" + "中山大学" → ["**中山**大学"]
 */
function HighlightedMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>
  const q = query.trim()
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'none', color: '#6d28d9', fontWeight: 700 }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

/** 单条建议行 */
function SuggestionItem({
  program,
  isActive,
  onMouseEnter,
  onClick,
}: {
  program: Program
  isActive: boolean
  onMouseEnter: () => void
  onClick: () => void
}) {
  return (
    <li
      role="option"
      aria-selected={isActive}
      className={`search-suggestion-item ${isActive ? 'search-suggestion-item--active' : ''}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="search-suggestion-school">
        <HighlightedMatch text={program.school} query={program.school} />
      </span>
      <span className="search-suggestion-major">
        <HighlightedMatch text={program.major} query={program.major} />
      </span>
    </li>
  )
}

interface SearchInputProps {
  /** 用于外部样式覆盖，如 hero 里的 padding */
  className?: string
}

export function SearchInput({ className }: SearchInputProps) {
  const navigate = useNavigate()
  const { addHistory } = useSearchHistory()

  // 显示"重新搜索"模式（从结果页来）时 school+major 有初值
  const [rawQuery, setRawQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Program[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // 防抖定时器 ref
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 输入变化 → 防抖搜索
  const handleInput = useCallback((value: string) => {
    setRawQuery(value)
    setActiveIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!value.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(() => {
      const q = value.trim().toLowerCase()
      const matched = programs
        .filter(
          (p) =>
            p.school.toLowerCase().includes(q) ||
            p.major.toLowerCase().includes(q) ||
            p.school.toLowerCase().startsWith(q) ||
            p.major.toLowerCase().startsWith(q),
        )
        .sort((a, b) => {
          // 优先：学校名以查询词开头 > 专业名以查询词开头 > 包含
          const aSchool = a.school.toLowerCase().startsWith(q) ? 0 : 1
          const bSchool = b.school.toLowerCase().startsWith(q) ? 0 : 1
          if (aSchool !== bSchool) return aSchool - bSchool
          const aMajor = a.major.toLowerCase().startsWith(q) ? 0 : 1
          const bMajor = b.major.toLowerCase().startsWith(q) ? 0 : 1
          return aMajor - bMajor
        })
        .slice(0, 6)

      setSuggestions(matched)
      setIsOpen(matched.length > 0)
    }, 200)
  }, [])

  // 选中建议 → 跳转结果页
  const selectSuggestion = useCallback(
    (program: Program) => {
      setRawQuery('')
      setSuggestions([])
      setIsOpen(false)
      setActiveIndex(-1)
      // 保存搜索历史
      addHistory({
        id: program.id,
        label: `${program.school} · ${program.major}`,
        slug: buildProgramSlug(program),
      })
      navigate(routeLinks.result(buildProgramSlug(program)))
    },
    [navigate, addHistory],
  )

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex])
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    },
    [isOpen, suggestions, activeIndex, selectSuggestion],
  )

  // 点击外部 → 关闭
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 注册搜索框引用到全局快捷键系统
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (inputRef.current) {
      window.dispatchEvent(new CustomEvent('registerSearchInput', { detail: inputRef.current }))
    }
  }, [])

  return (
    <div ref={containerRef} className={`search-input-container ${className ?? ''}`}>
      <div className="search-input-wrapper">
        {/* 搜索图标 */}
        <svg
          className="search-input-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={rawQuery}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true)
          }}
          placeholder="输入学校或专业，例如：中山大学 计算机（按 / 快捷聚焦）"
          aria-label="输入学校或专业，搜索考研目标难度"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen}
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          className="search-input-field"
        />

        {/* 清除按钮 */}
        {rawQuery && (
          <button
            type="button"
            className="search-input-clear"
            onClick={() => {
              setRawQuery('')
              setSuggestions([])
              setIsOpen(false)
              setActiveIndex(-1)
            }}
            aria-label="清除搜索"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* 建议下拉 */}
      {isOpen && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="search-suggestions"
        >
          {suggestions.map((program, i) => (
            <SuggestionItem
              key={program.id}
              program={program}
              isActive={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => selectSuggestion(program)}
            />
          ))}
          <li className="search-suggestion-tip">
            共 {suggestions.length} 条，按 ↑↓ 选，Enter 确认
          </li>
        </ul>
      )}

      {/* 无匹配提示 */}
      {isOpen && suggestions.length === 0 && rawQuery.trim().length >= 2 && (
        <div className="search-suggestions search-suggestions--empty">
          <span>暂无匹配的学校或专业</span>
          <span className="search-empty-tip">试试：中山大学 · 浙江大学 · 计算机技术</span>
        </div>
      )}
    </div>
  )
}
