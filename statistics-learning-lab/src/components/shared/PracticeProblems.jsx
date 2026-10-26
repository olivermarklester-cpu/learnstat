import { useState } from 'react'
import StepCalculation from './StepCalculation'

/**
 * PracticeProblems
 * Props:
 *   problems: {
 *     easy:        [{ id, scenario, question, hint, formula, solution, steps[], interpretation }]
 *     moderate:    [...]
 *     challenging: [...]
 *   }
 *   topicId: string  (optional, unused here but available for future logging)
 */

const DIFFICULTIES = [
  { key: 'easy', label: 'Easy', color: 'success' },
  { key: 'moderate', label: 'Moderate', color: 'warning' },
  { key: 'challenging', label: 'Challenging', color: 'danger' },
]

const TAB_ACTIVE = {
  success: 'bg-success text-white border-success',
  warning: 'bg-warning text-white border-warning',
  danger: 'bg-danger text-white border-danger',
}

const TAB_INACTIVE = {
  success: 'bg-white text-success border-success hover:bg-green-50',
  warning: 'bg-white text-warning border-warning hover:bg-amber-50',
  danger: 'bg-white text-danger border-danger hover:bg-red-50',
}

export default function PracticeProblems({ problems = {} }) {
  const [difficulty, setDifficulty] = useState('easy')
  // Track current problem index per difficulty
  const [indices, setIndices] = useState({ easy: 0, moderate: 0, challenging: 0 })
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const pool = problems[difficulty] || []
  const idx = indices[difficulty] ?? 0
  const problem = pool[idx] || null

  function resetState() {
    setShowHint(false)
    setShowSolution(false)
  }

  function switchDifficulty(key) {
    setDifficulty(key)
    resetState()
  }

  function nextProblem() {
    const next = (idx + 1) % pool.length
    setIndices((prev) => ({ ...prev, [difficulty]: next }))
    resetState()
  }

  return (
    <div>
      {/* Difficulty tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DIFFICULTIES.map(({ key, label, color }) => {
          const isActive = difficulty === key
          const hasProblems = (problems[key] || []).length > 0
          if (!hasProblems) return null
          return (
            <button
              key={key}
              onClick={() => switchDifficulty(key)}
              className={`border rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive ? TAB_ACTIVE[color] : TAB_INACTIVE[color]
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* No problems message */}
      {!problem && (
        <p className="text-sm text-textMuted italic">No practice problems available for this difficulty.</p>
      )}

      {/* Problem card */}
      {problem && (
        <div>
          {/* Problem counter */}
          <p className="text-xs text-textMuted mb-3 font-medium">
            Problem {idx + 1} of {pool.length}
          </p>

          {/* Scenario */}
          {problem.scenario && (
            <div className="bg-gray-50 border border-border rounded-lg p-4 mb-3">
              <p className="text-sm font-semibold text-textDark mb-1">Scenario</p>
              <p className="text-sm text-textDark leading-relaxed">{problem.scenario}</p>
            </div>
          )}

          {/* Question */}
          {problem.question && (
            <p className="text-sm font-semibold text-textDark mb-4 leading-relaxed">{problem.question}</p>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {problem.hint && (
              <button
                onClick={() => setShowHint((s) => !s)}
                className="border border-border text-textDark bg-white rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
            {(problem.steps || problem.solution) && (
              <button
                onClick={() => setShowSolution((s) => !s)}
                className="border border-border text-textDark bg-white rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            )}
            {pool.length > 1 && (
              <button
                onClick={nextProblem}
                className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Try Another Problem
              </button>
            )}
          </div>

          {/* Hint box */}
          {showHint && problem.hint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3 text-sm text-textDark leading-relaxed">
              <span className="font-semibold text-yellow-700">Hint: </span>
              {problem.hint}
            </div>
          )}

          {/* Solution area */}
          {showSolution && (
            <div className="border border-border rounded-xl p-4 bg-gray-50 space-y-3">
              {problem.formula && (
                <div>
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-1">Formula Used</p>
                  <p className="font-mono text-sm bg-white border border-border rounded-lg px-4 py-2">{problem.formula}</p>
                </div>
              )}
              {problem.steps && problem.steps.length > 0 && (
                <StepCalculation
                  steps={problem.steps}
                  interpretation={problem.interpretation}
                  defaultOpen
                />
              )}
              {!problem.steps && problem.solution && (
                <div>
                  <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-1">Solution</p>
                  <p className="text-sm text-textDark leading-relaxed">{problem.solution}</p>
                </div>
              )}
              {problem.interpretation && !problem.steps && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-textDark leading-relaxed">
                  <span className="font-semibold text-blue-700">Interpretation: </span>
                  {problem.interpretation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
