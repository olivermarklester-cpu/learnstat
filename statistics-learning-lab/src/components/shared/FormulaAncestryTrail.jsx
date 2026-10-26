import { Link } from 'react-router-dom'
import { getAncestors, LINEAGE } from '../../data/formulaLineage'

/**
 * FormulaAncestryTrail
 *
 * Displays a breadcrumb-style row showing the chain of formula topics that
 * the current topic builds on. Past topics are clickable links; the current
 * topic is a solid terminal pill.
 *
 * Renders nothing if the topic has no ancestors (e.g. Mean).
 *
 * @param {string} topicId - the id of the current topic
 */
export default function FormulaAncestryTrail({ topicId }) {
  const ancestors = getAncestors(topicId)
  const currentNode = LINEAGE.find((n) => n.id === topicId)

  if (!ancestors.length || !currentNode) return null

  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-2">
        Built from
      </p>
      <div className="flex items-center flex-wrap gap-1.5">
        {ancestors.map((ancestor, i) => (
          <span key={ancestor.id} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="text-gray-400 text-xs select-none">→</span>
            )}
            <Link
              to={`/${ancestor.slug}`}
              className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              {ancestor.title}
            </Link>
          </span>
        ))}
        {/* Separator before current */}
        <span className="text-gray-400 text-xs select-none">→</span>
        {/* Current topic — non-link terminal */}
        <span className="inline-flex items-center text-xs font-semibold bg-blue-600 text-white px-2.5 py-1 rounded-full">
          {currentNode.title}
        </span>
      </div>
    </div>
  )
}
