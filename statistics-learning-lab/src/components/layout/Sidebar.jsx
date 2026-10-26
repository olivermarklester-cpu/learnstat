import { useState, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import topics from '../../data/topics'
import { useProgressContext } from '../../context/ProgressContext'

const GROUP_NAMES = {
  1: 'Foundations',
  2: 'Descriptive Statistics',
  3: 'Probability',
  4: 'Sampling',
  5: 'Inferential Statistics',
  6: 'Relationships & Prediction',
}

// Returns the phase badge for a group: min phase of its topics if ALL are Phase 2+, else null.
function getGroupPhaseBadge(groupTopics) {
  if (!groupTopics || groupTopics.length === 0) return null
  if (groupTopics.every((t) => t.phase > 1)) {
    return Math.min(...groupTopics.map((t) => t.phase))
  }
  return null
}

// Progress dot color by status
function ProgressDot({ status }) {
  const colors = {
    'not-started': 'bg-gray-300',
    learning: 'bg-yellow-400',
    practicing: 'bg-orange-400',
    completed: 'bg-green-500',
  }
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full flex-shrink-0 mr-2 ${colors[status] || colors['not-started']}`}
      aria-label={`Status: ${status}`}
    />
  )
}

// Group header component
function GroupHeader({ groupOrder, groupTopics, isOpen, onToggle }) {
  const name = GROUP_NAMES[groupOrder]
  const phase = getGroupPhaseBadge(groupTopics)

  return (
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${name} section`}
      className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50 group"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          {name}
        </span>
        {phase !== null && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
              phase === 2
                ? 'bg-blue-100 text-blue-600'
                : 'bg-purple-100 text-purple-600'
            }`}
          >
            Phase {phase}
          </span>
        )}
      </div>
      <svg
        className={`w-3.5 h-3.5 text-textMuted transition-transform duration-150 ${isOpen ? '' : '-rotate-90'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { getStatus } = useProgressContext()
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState({ 1: true, 2: true, 3: true, 4: true, 5: true, 6: true })

  // Current active slug from URL hash
  const activeSlug = location.pathname.replace('/', '')

  // Filter topics by search
  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return topics
    return topics.filter((t) => t.title.toLowerCase().includes(q))
  }, [search])

  // Group filtered topics
  const grouped = useMemo(() => {
    const map = {}
    for (const t of filteredTopics) {
      if (!map[t.groupOrder]) map[t.groupOrder] = []
      map[t.groupOrder].push(t)
    }
    return map
  }, [filteredTopics])

  const toggleGroup = (order) =>
    setOpenGroups((prev) => ({ ...prev, [order]: !prev[order] }))

  // When searching, auto-expand all groups that have matches
  const effectiveOpenGroups = search.trim()
    ? Object.fromEntries(Object.keys(grouped).map((k) => [k, true]))
    : openGroups

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-primary select-none" aria-hidden="true">σ</span>
          <span className="text-sm font-bold text-primary leading-tight">
            Statistics<br />Learning Lab
          </span>
        </div>
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textMuted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            aria-label="Search topics"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       placeholder-textMuted text-textDark"
          />
        </div>
      </div>

      {/* Topic groups */}
      <nav className="flex-1 overflow-y-auto py-2" aria-label="Topics">
        {[1, 2, 3, 4, 5, 6].map((order) => {
          const groupTopics = grouped[order]
          if (!groupTopics || groupTopics.length === 0) return null
          const isGroupOpen = effectiveOpenGroups[order]

          return (
            <div key={order} className="mb-1">
              <GroupHeader
                groupOrder={order}
                groupTopics={groupTopics}
                isOpen={isGroupOpen}
                onToggle={() => toggleGroup(order)}
              />
              {isGroupOpen && (
                <ul className="pb-1">
                  {groupTopics.map((topic) => {
                    const status = getStatus(topic.id)
                    const isActive = topic.slug === activeSlug
                    const isPhase1 = topic.phase === 1

                    if (!isPhase1) {
                      return (
                        <li key={topic.id}>
                          <div
                            className="flex items-center py-1.5 px-4 cursor-not-allowed opacity-60"
                            title="Coming in a future phase"
                          >
                            <ProgressDot status={status} />
                            <span className="text-sm text-textMuted flex-1 truncate">
                              {topic.title}
                            </span>
                            <span className="text-xs font-medium text-textMuted bg-gray-100 px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
                              Soon
                            </span>
                          </div>
                        </li>
                      )
                    }

                    return (
                      <li key={topic.id}>
                        <Link
                          to={`/${topic.slug}`}
                          onClick={onClose}
                          className={`flex items-center py-1.5 px-4 rounded-lg mx-1 text-sm transition-colors duration-100 ${
                            isActive
                              ? 'bg-blue-50 text-primary font-medium'
                              : 'text-textDark hover:bg-blue-50 hover:text-primary'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <ProgressDot status={status} />
                          <span className="truncate">{topic.title}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
        {search.trim() && Object.keys(grouped).length === 0 && (
          <p className="px-4 py-3 text-sm text-textMuted">No topics match &ldquo;{search}&rdquo;</p>
        )}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-border px-4 py-3">
        <Link
          to="/progress"
          onClick={onClose}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors ${
            activeSlug === 'progress'
              ? 'bg-blue-50 text-primary font-medium'
              : 'text-textMuted hover:text-primary hover:bg-blue-50'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          My Progress
        </Link>
        <Link
          to="/formula-map"
          onClick={onClose}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-colors mt-0.5 ${
            activeSlug === 'formula-map'
              ? 'bg-blue-50 text-primary font-medium'
              : 'text-textMuted hover:text-primary hover:bg-blue-50'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Formula Map
        </Link>
        <p className="text-xs text-textMuted mt-2 px-2">Phase 1 · Statistics Learning Lab</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 bg-white border-r border-border overflow-hidden"
        style={{ width: '260px' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            className="relative z-50 flex flex-col bg-white border-r border-border shadow-xl overflow-hidden"
            style={{ width: '260px' }}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
