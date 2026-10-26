import { useEffect, useRef, useState, useCallback } from 'react'
import SectionCard from './SectionCard'
import FormulaCard from '../shared/FormulaCard'
import StepCalculation from '../shared/StepCalculation'
import PracticeProblems from '../shared/PracticeProblems'
import KnowledgeCheck from '../shared/KnowledgeCheck'
import DatasetGenerator from '../shared/DatasetGenerator'
import FormulaAncestryTrail from '../shared/FormulaAncestryTrail'
import FormulaBuildUp from '../shared/FormulaBuildUp'
import PrerequisiteNudge from '../shared/PrerequisiteNudge'
import { useProgressContext } from '../../context/ProgressContext'

// ─── Mini Table of Contents ──────────────────────────────────────────────────

const SECTION_DEFS = [
  { id: 'learning-objective', label: 'Learning Objective' },
  { id: 'explanation', label: 'Explanation' },
  { id: 'analogy', label: 'Analogy' },
  { id: 'formula', label: 'Formula' },
  { id: 'when-to-use', label: 'When to Use' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'worked-example', label: 'Worked Example' },
  { id: 'interpretation', label: 'Interpretation' },
  { id: 'common-mistakes', label: 'Common Mistakes' },
  { id: 'practice-problems', label: 'Practice Problems' },
  { id: 'knowledge-check', label: 'Knowledge Check' },
  { id: 'key-takeaway', label: 'Key Takeaway' },
  { id: 'memory-trick', label: 'Memory Trick' },
]

function MiniTOC({ activeId }) {
  return (
    <nav aria-label="Page sections" className="xl:block hidden fixed top-20 right-6 w-44 z-10">
      <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-2">On this page</p>
      <ul className="space-y-1">
        {SECTION_DEFS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-xs py-0.5 transition-colors ${
                activeId === id
                  ? 'text-primary font-semibold'
                  : 'text-textMuted hover:text-primary'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ─── TopicPage ────────────────────────────────────────────────────────────────

/**
 * TopicPage
 * Props:
 *   content  — full topic content object (see plan for shape)
 *   topicId  — string id of the topic
 */
export default function TopicPage({ content, topicId = '' }) {
  const { getStatus, setStatus } = useProgressContext()
  const [activeSectionId, setActiveSectionId] = useState(null)

  // ── Progress: set 'learning' on mount if not-started ──────────────────────
  useEffect(() => {
    if (!topicId) return
    const current = getStatus(topicId)
    if (current === 'not-started') {
      setStatus(topicId, 'learning')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  // ── IntersectionObserver for TOC highlighting + practice progress ─────────
  const practiceRef = useRef(null)

  useEffect(() => {
    const sectionEls = SECTION_DEFS.map(({ id }) => document.getElementById(id)).filter(Boolean)

    const tocObserver = new IntersectionObserver(
      (entries) => {
        // pick the first intersecting entry
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActiveSectionId(visible.target.id)
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    )
    sectionEls.forEach((el) => tocObserver.observe(el))

    return () => tocObserver.disconnect()
  }, [])

  useEffect(() => {
    if (!topicId || !practiceRef.current) return
    const practiceObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const current = getStatus(topicId)
          if (current === 'learning') setStatus(topicId, 'practicing')
        }
      },
      { threshold: 0.1 }
    )
    practiceObserver.observe(practiceRef.current)
    return () => practiceObserver.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId])

  if (!content) return null

  const {
    title,
    topicGroup,
    learningObjective,
    explanation,
    analogy,
    formula,
    formulaLineage,
    whenToUse,
    whenNotToUse,
    assumptions,
    workedExample,
    interpretation,
    commonMistakes,
    practiceProblems,
    knowledgeCheck,
    keyTakeaway,
    memoryTrick,
    visualization,
    datasetGenerator,
  } = content

  const [liveDataset, setLiveDataset] = useState(null)
  const handleDataChange = useCallback((data) => setLiveDataset(data), [])

  return (
    <div className="relative">
      <MiniTOC activeId={activeSectionId} />

      <div className="max-w-4xl mx-auto px-4 py-8 xl:pr-52">
        {/* ── Page Title ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          {topicGroup && (
            <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-1">
              {topicGroup}
            </p>
          )}
          <h1 className="text-3xl font-bold text-textDark">{title}</h1>
        </div>

        {/* Prerequisite nudge — shown when unvisited ancestors exist */}
        <PrerequisiteNudge topicId={topicId} />

        {/* 1. Learning Objective */}
        <SectionCard title="Learning Objective" icon="🎯" id="learning-objective" collapsibleOnMobile>
          <p className="text-textDark leading-relaxed">{learningObjective}</p>
        </SectionCard>

        {/* 2. Plain-Language Explanation */}
        <SectionCard title="Plain-Language Explanation" icon="📖" id="explanation" collapsibleOnMobile>
          {typeof explanation === 'string' ? (
            <p className="text-textDark leading-relaxed">{explanation}</p>
          ) : (
            explanation
          )}
        </SectionCard>

        {/* Optional Dataset Generator + Visualization (between Explanation and Analogy) */}
        {datasetGenerator && (
          <div className="mb-4">
            <DatasetGenerator topicId={topicId} showStats onDataChange={handleDataChange} />
          </div>
        )}
        {datasetGenerator && visualization && (
          <div className="mb-4">
            {typeof visualization === 'function' ? visualization(liveDataset) : visualization}
          </div>
        )}

        {/* 3. Simple Analogy */}
        <div id="analogy" className="scroll-mt-4">
          <div className="bg-amber-50 rounded-xl border border-border shadow-sm p-6 mb-4 border-l-4 border-l-amber-400">
            <h2 className="text-amber-700 font-semibold text-base flex items-center gap-2 mb-3">
              <span aria-hidden="true">💡</span> Simple Analogy
            </h2>
            {typeof analogy === 'string' ? (
              <p className="text-textDark leading-relaxed">{analogy}</p>
            ) : (
              analogy
            )}
          </div>
        </div>

        {/* 4. Formula */}
        {formula && (
          <SectionCard title="Formula" icon="∑" id="formula" collapsibleOnMobile>
            {formulaLineage && (
              <>
                <FormulaAncestryTrail topicId={formulaLineage.topicId} />
                <FormulaBuildUp
                  steps={formulaLineage.steps}
                  finalFormula={formulaLineage.finalFormula}
                  title={formulaLineage.title}
                />
              </>
            )}
            <FormulaCard formula={formula} />
          </SectionCard>
        )}

        {/* 5. When to Use / When Not to Use */}
        <div id="when-to-use" className="scroll-mt-4 mb-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* When to Use */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6 border-l-4 border-l-success">
              <h2 className="text-success font-semibold text-base flex items-center gap-2 mb-3">
                <span aria-hidden="true">✅</span> When to Use
              </h2>
              <ul className="space-y-1">
                {(whenToUse || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-textDark leading-relaxed">
                    <span className="text-success mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* When Not to Use */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6 border-l-4 border-l-danger">
              <h2 className="text-danger font-semibold text-base flex items-center gap-2 mb-3">
                <span aria-hidden="true">❌</span> When NOT to Use
              </h2>
              <ul className="space-y-1">
                {(whenNotToUse || []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-textDark leading-relaxed">
                    <span className="text-danger mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Assumptions */}
        <SectionCard title="Assumptions &amp; Requirements" icon="✓" id="assumptions" collapsibleOnMobile>
          <ul className="space-y-2">
            {(assumptions || []).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-textDark leading-relaxed">
                <span className="text-success font-bold shrink-0 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* 7. Worked Example */}
        <SectionCard title="Worked Example" icon="🔢" id="worked-example" collapsibleOnMobile>
          {workedExample && (
            <>
              {workedExample.scenario && (
                <div className="bg-gray-50 border border-border rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-textDark mb-1">Scenario</p>
                  <p className="text-sm text-textDark leading-relaxed">{workedExample.scenario}</p>
                  {workedExample.dataset && (
                    <p className="font-mono text-sm mt-2 text-primary">{workedExample.dataset}</p>
                  )}
                </div>
              )}
              {workedExample.steps && workedExample.steps.length > 0 && (
                <StepCalculation
                  steps={workedExample.steps}
                  interpretation={workedExample.interpretation}
                  defaultOpen
                />
              )}
            </>
          )}
        </SectionCard>

        {/* 8. Interpretation */}
        <div id="interpretation" className="scroll-mt-4">
          <div className="bg-blue-50 rounded-xl border border-border shadow-sm p-6 mb-4 border-l-4 border-l-blue-400">
            <h2 className="text-blue-700 font-semibold text-base flex items-center gap-2 mb-3">
              <span aria-hidden="true">💬</span> How to Interpret Results
            </h2>
            {typeof interpretation === 'string' ? (
              <p className="text-textDark leading-relaxed">{interpretation}</p>
            ) : (
              interpretation
            )}
          </div>
        </div>

        {/* 9. Common Mistakes */}
        <SectionCard title="Common Mistakes" icon="⚠️" id="common-mistakes" collapsibleOnMobile>
          <div className="space-y-3">
            {(commonMistakes || []).map((item, i) => (
              <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">{item.mistake}</p>
                <p className="text-sm text-textDark leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 10. Practice Problems */}
        <div ref={practiceRef}>
          <SectionCard title="Practice Problems" icon="✏️" id="practice-problems" collapsibleOnMobile>
            {practiceProblems && <PracticeProblems problems={practiceProblems} topicId={topicId} />}
          </SectionCard>
        </div>

        {/* 11. Knowledge Check */}
        <SectionCard title="Knowledge Check" icon="🧠" id="knowledge-check" collapsibleOnMobile>
          {knowledgeCheck && (
            <KnowledgeCheck questions={knowledgeCheck} topicId={topicId} />
          )}
        </SectionCard>

        {/* 12. Key Takeaway */}
        <div id="key-takeaway" className="scroll-mt-4 mb-4">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold text-base flex items-center gap-2 mb-3 text-white">
              <span aria-hidden="true">⭐</span> Key Takeaway
            </h2>
            {typeof keyTakeaway === 'string' ? (
              <p className="leading-relaxed text-blue-50">{keyTakeaway}</p>
            ) : (
              keyTakeaway
            )}
          </div>
        </div>

        {/* 13. Memory Trick */}
        {memoryTrick && (
          <div id="memory-trick" className="scroll-mt-4 mb-4">
            <div className="bg-violet-50 rounded-xl border border-violet-200 shadow-sm p-6 border-l-4 border-l-violet-400">
              <h2 className="text-violet-700 font-semibold text-base flex items-center gap-2 mb-3">
                <span aria-hidden="true">🧠</span> Memory Trick
              </h2>
              {typeof memoryTrick === 'string' ? (
                <p className="text-textDark leading-relaxed">{memoryTrick}</p>
              ) : (
                memoryTrick
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
