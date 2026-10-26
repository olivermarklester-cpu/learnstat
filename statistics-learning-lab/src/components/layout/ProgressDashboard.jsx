import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgressContext } from '../../context/ProgressContext'
import topics from '../../data/topics'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  'not-started': 'Not Started',
  learning: 'Learning',
  practicing: 'Practicing',
  completed: 'Completed',
}

const STATUS_BADGE = {
  'not-started': 'bg-gray-100 text-gray-500',
  learning: 'bg-yellow-100 text-yellow-700',
  practicing: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
}

const DOT_COLORS = {
  'not-started': 'bg-gray-300',
  learning: 'bg-yellow-400',
  practicing: 'bg-orange-400',
  completed: 'bg-green-500',
}

const GROUP_ORDER = [1, 2, 3, 4, 5, 6]

const GROUP_NAMES = {
  1: 'Foundations',
  2: 'Descriptive Statistics',
  3: 'Probability',
  4: 'Sampling',
  5: 'Inferential Statistics',
  6: 'Relationships & Prediction',
}

// ─── Progress bar color based on group completion ─────────────────────────────
function groupBarColor(completed, total) {
  if (completed === 0) return 'bg-gray-200'
  if (completed === total) return 'bg-green-500'
  return 'bg-teal-500'
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, value, colorClass, bgClass, borderClass }) {
  return (
    <div className={`border rounded-xl p-4 text-center ${bgClass} ${borderClass}`}>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <div className="text-xs text-textMuted mt-1 leading-snug">{label}</div>
    </div>
  )
}

// ─── Group Section ────────────────────────────────────────────────────────────
function GroupSection({ groupOrder, groupName, groupTopics, getStatus }) {
  const [expanded, setExpanded] = useState(groupOrder <= 3) // expand first 3 groups by default
  const total = groupTopics.length
  const completedCount = groupTopics.filter((t) => getStatus(t.id) === 'completed').length
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const barColor = groupBarColor(completedCount, total)

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white shadow-sm mb-3">
      {/* Group header — clickable to expand/collapse */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold text-textDark truncate">{groupName}</span>
          <span className="text-xs text-textMuted whitespace-nowrap">
            {completedCount} of {total} completed
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-3">
          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-textMuted w-8 text-right">{pct}%</span>
          <svg
            className={`w-4 h-4 text-textMuted transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Topic list */}
      {expanded && (
        <ul className="divide-y divide-border border-t border-border">
          {groupTopics.map((topic) => {
            const status = getStatus(topic.id)
            return (
              <li key={topic.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLORS[status]}`} />
                <Link
                  to={`/${topic.slug}`}
                  className="flex-1 text-textDark hover:text-primary transition-colors truncate"
                >
                  {topic.title}
                </Link>
                {topic.phase > 1 && (
                  <span className="text-xs text-textMuted bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                    Phase {topic.phase}
                  </span>
                )}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[status]}`}
                >
                  {STATUS_LABELS[status]}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
function RecentActivity({ recentVisits, getStatus }) {
  if (!recentVisits.length) {
    return (
      <p className="text-sm text-textMuted italic px-1">
        No topics visited yet. Start learning to see your activity here.
      </p>
    )
  }

  return (
    <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white shadow-sm">
      {recentVisits.map((topicId) => {
        const topic = topics.find((t) => t.id === topicId)
        if (!topic) return null
        const status = getStatus(topicId)
        return (
          <li key={topicId} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLORS[status]}`} />
            <Link
              to={`/${topic.slug}`}
              className="flex-1 text-textDark hover:text-primary transition-colors truncate"
            >
              {topic.title}
            </Link>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[status]}`}>
              {STATUS_LABELS[status]}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProgressDashboard() {
  const { getStatus, getAllStats, resetAll } = useProgressContext()
  const [confirmReset, setConfirmReset] = useState(false)

  const stats = getAllStats()
  const { totalCompleted, totalPractice, quizAccuracy, recentVisits } = stats

  // Count topics in-progress (learning + practicing)
  const totalInProgress = Object.values(stats.statuses).filter(
    (s) => s === 'learning' || s === 'practicing'
  ).length

  // Build groups
  const groupedTopics = GROUP_ORDER.map((order) => ({
    order,
    name: GROUP_NAMES[order],
    topics: topics.filter((t) => t.groupOrder === order),
  }))

  function handleResetClick() {
    if (confirmReset) {
      resetAll()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textDark">My Learning Progress</h1>
          <p className="text-sm text-textMuted mt-1">Track your journey through all topics</p>
        </div>
        <div className="shrink-0">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-danger font-medium">Are you sure?</span>
              <button
                onClick={handleResetClick}
                className="text-xs text-white bg-danger rounded px-3 py-1.5 hover:bg-red-700 transition-colors"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-xs text-textMuted border border-border rounded px-3 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleResetClick}
              className="text-xs text-textMuted hover:text-danger transition-colors px-3 py-1.5 rounded border border-border hover:border-danger"
            >
              Reset All Progress
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SummaryCard
          label="Topics Completed"
          value={totalCompleted}
          colorClass="text-green-600"
          bgClass="bg-green-50"
          borderClass="border-green-200"
        />
        <SummaryCard
          label="Topics In Progress"
          value={totalInProgress}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
          borderClass="border-amber-200"
        />
        <SummaryCard
          label="Practice Questions Attempted"
          value={totalPractice}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
          borderClass="border-blue-200"
        />
        <SummaryCard
          label="Quiz Accuracy"
          value={quizAccuracy !== null ? `${quizAccuracy}%` : '—'}
          colorClass="text-teal-600"
          bgClass="bg-teal-50"
          borderClass="border-teal-200"
        />
      </div>

      {/* ── Per-Stage Progress ──────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-textDark mb-3">Progress by Stage</h2>
        {groupedTopics.map(({ order, name, topics: groupTopics }) => (
          <GroupSection
            key={order}
            groupOrder={order}
            groupName={name}
            groupTopics={groupTopics}
            getStatus={getStatus}
          />
        ))}
      </section>

      {/* ── Recent Activity ─────────────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-textDark mb-3">Recent Activity</h2>
        <RecentActivity recentVisits={recentVisits} getStatus={getStatus} />
      </section>

      {/* ── Session Note ────────────────────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">ℹ️</span>
        <p className="text-sm text-blue-800 leading-relaxed">
          Progress is saved during your current browser session only. Closing or refreshing the
          browser will reset your progress. Sign-in and saved progress will be added in a future
          version.
        </p>
      </div>
    </div>
  )
}
