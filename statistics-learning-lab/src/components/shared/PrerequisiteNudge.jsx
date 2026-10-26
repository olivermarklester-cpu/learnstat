import { Link } from 'react-router-dom'
import { getAncestors } from '../../data/formulaLineage'
import { useProgressContext } from '../../context/ProgressContext'

/**
 * PrerequisiteNudge
 *
 * Shown at the top of a topic page when the learner has not yet visited
 * one or more prerequisite topics. Lists only unvisited ancestors as
 * clickable links. Dismissed automatically once all prereqs are visited.
 *
 * Renders nothing when:
 *  - the topic has no ancestors in the formula lineage
 *  - all ancestors have been visited (status !== 'not-started')
 *
 * @param {string} topicId - the id of the current topic
 */
export default function PrerequisiteNudge({ topicId }) {
  const { getStatus } = useProgressContext()
  const ancestors = getAncestors(topicId)

  if (!ancestors.length) return null

  // Only show ancestors the learner hasn't started yet
  const unvisited = ancestors.filter((a) => getStatus(a.id) === 'not-started')

  if (!unvisited.length) return null

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="text-amber-500 text-lg shrink-0 mt-0.5" aria-hidden="true">⚠</span>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Recommended prerequisites not yet covered
          </p>
          <p className="text-xs text-amber-800 leading-relaxed mb-2.5">
            This topic builds on{' '}
            {unvisited.length === 1 ? 'a concept' : 'concepts'} you haven&apos;t visited yet.
            Covering {unvisited.length === 1 ? 'it' : 'them'} first will make this topic much easier to follow.
          </p>

          {/* Unvisited prerequisite links */}
          <div className="flex flex-wrap gap-2">
            {unvisited.map((ancestor) => (
              <Link
                key={ancestor.id}
                to={`/${ancestor.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-amber-300 text-amber-800 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <span aria-hidden="true">→</span>
                {ancestor.title}
                <span className="font-mono text-amber-500 font-normal">{ancestor.formula}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
