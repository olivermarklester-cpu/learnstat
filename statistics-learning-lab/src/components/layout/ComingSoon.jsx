import { useState } from 'react'
import { Link } from 'react-router-dom'
import topics from '../../data/topics'

// Preview content for all Phase 2 + 3 topics
const COMING_SOON_CONTENT = {
  'random-sampling': {
    preview: 'Learn how to select data from a population fairly and without bias.',
    prerequisites: ['population-and-sample'],
  },
  'sampling-distribution': {
    preview: 'Discover how sample statistics vary from sample to sample.',
    prerequisites: ['mean-median-mode', 'standard-deviation'],
  },
  'standard-error': {
    preview: 'Understand the typical distance between a sample mean and the true population mean.',
    prerequisites: ['sampling-distribution'],
  },
  'central-limit-theorem': {
    preview: 'One of the most important theorems in statistics: why sample means follow a normal distribution.',
    prerequisites: ['sampling-distribution', 'normal-distribution'],
  },
  'point-estimates': {
    preview: 'Use a single sample value to estimate an unknown population parameter.',
    prerequisites: ['mean-median-mode'],
  },
  'confidence-intervals': {
    preview: 'Build an interval that is likely to contain the true population mean.',
    prerequisites: ['point-estimates', 'standard-error', 'critical-values'],
  },
  'hypothesis-testing': {
    preview: 'Learn the framework for making decisions using data and probability.',
    prerequisites: ['null-and-alternative-hypotheses', 'p-values'],
  },
  'null-and-alternative-hypotheses': {
    preview: 'Set up the two competing claims that a hypothesis test evaluates.',
    prerequisites: ['hypothesis-testing'],
  },
  'one-tailed-and-two-tailed-tests': {
    preview: 'Choose the right tail direction for your hypothesis test.',
    prerequisites: ['null-and-alternative-hypotheses'],
  },
  'significance-level': {
    preview: 'Set your tolerance for making a wrong decision before collecting data.',
    prerequisites: ['hypothesis-testing'],
  },
  'critical-values': {
    preview: 'Find the cutoff that separates the rejection region from the acceptance region.',
    prerequisites: ['z-score', 'significance-level'],
  },
  'p-values': {
    preview: 'Understand the probability of seeing results as extreme as yours if the null hypothesis were true.',
    prerequisites: ['hypothesis-testing', 'critical-values'],
  },
  'type-i-and-ii-errors': {
    preview: 'Learn the two types of mistakes in hypothesis testing and how to manage them.',
    prerequisites: ['hypothesis-testing', 'significance-level'],
  },
  'z-test': {
    preview: 'Test a hypothesis about a population mean when the population standard deviation is known.',
    prerequisites: ['hypothesis-testing', 'z-score', 'critical-values'],
  },
  'one-sample-t-test': {
    preview: 'Test a hypothesis about a population mean using a sample when the population SD is unknown.',
    prerequisites: ['z-test'],
  },
  'independent-samples-t-test': {
    preview: 'Compare the means of two separate groups.',
    prerequisites: ['one-sample-t-test'],
  },
  'paired-samples-t-test': {
    preview: 'Compare measurements taken from the same subjects before and after a change.',
    prerequisites: ['one-sample-t-test'],
  },
  'chi-square-test': {
    preview: 'Test relationships between categorical variables.',
    prerequisites: ['basic-probability', 'hypothesis-testing'],
  },
  'anova': {
    preview: 'Compare the means of three or more groups at once.',
    prerequisites: ['independent-samples-t-test'],
  },
  'covariance': {
    preview: 'Measure how two variables move together.',
    prerequisites: ['variance'],
  },
  'correlation': {
    preview: 'Measure the strength and direction of a linear relationship between two variables.',
    prerequisites: ['covariance'],
  },
  'simple-linear-regression': {
    preview: 'Build a formula that predicts one variable from another.',
    prerequisites: ['correlation'],
  },
  'correlation-versus-causation': {
    preview: 'Learn why a correlation does not prove that one variable causes another.',
    prerequisites: ['correlation'],
  },
}

const INTEREST_KEY = 'stats-lab-interests'

function getInterests() {
  try {
    return JSON.parse(sessionStorage.getItem(INTEREST_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveInterest(topicId) {
  try {
    const interests = getInterests()
    interests[topicId] = true
    sessionStorage.setItem(INTEREST_KEY, JSON.stringify(interests))
  } catch {
    // ignore
  }
}

export default function ComingSoon({ topic, comingSoonOverride = false }) {
  const [interested, setInterested] = useState(() => getInterests()[topic.id] === true)
  const content = COMING_SOON_CONTENT[topic.id]
  const isPhase1Override = comingSoonOverride && topic.phase === 1

  const phaseBadgeClass = topic.phase === 2
    ? 'bg-blue-100 text-blue-700'
    : topic.phase === 3
      ? 'bg-purple-100 text-purple-700'
      : 'bg-gray-100 text-gray-600'

  const phaseBadgeLabel = isPhase1Override
    ? 'Under Construction'
    : topic.phase === 2
      ? 'Coming in Phase 2'
      : `Coming in Phase ${topic.phase}`

  const handleInterest = () => {
    saveInterest(topic.id)
    setInterested(true)
  }

  // Resolve prerequisite topic objects
  const prereqTopics = content?.prerequisites
    ?.map((slug) => topics.find((t) => t.slug === slug))
    .filter(Boolean) ?? []

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Group badge */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
          {topic.group}
        </span>
      </div>

      {/* Title + phase badge */}
      <div className="flex flex-wrap items-start gap-3 mb-6">
        <h1 className="text-2xl font-bold text-textDark">{topic.title}</h1>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full self-center ${phaseBadgeClass}`}>
          {phaseBadgeLabel}
        </span>
      </div>

      {/* Main card */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm mb-6">
        {content ? (
          <>
            {/* What you will learn */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-textDark uppercase tracking-wider mb-3">
                What you will learn
              </h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-textDark">
                  <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                  {content.preview}
                </li>
              </ul>
            </div>

            {/* Prerequisites */}
            {prereqTopics.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-textDark uppercase tracking-wider mb-3">
                  Prerequisites
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {prereqTopics.map((t) => (
                    <li key={t.id}>
                      {t.phase === 1 ? (
                        <Link
                          to={`/${t.slug}`}
                          className="text-xs font-medium text-primary bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors"
                        >
                          {t.title}
                        </Link>
                      ) : (
                        <span className="text-xs font-medium text-textMuted bg-gray-100 px-2.5 py-1 rounded-full">
                          {t.title}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-textMuted">
            Preview content will be available soon.
          </p>
        )}

        {/* Interest button */}
        {!isPhase1Override && (
          <div className="pt-4 border-t border-border">
            <button
              onClick={handleInterest}
              disabled={interested}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                interested
                  ? 'bg-green-50 text-green-700 cursor-default'
                  : 'bg-primary text-white hover:bg-blue-700 active:scale-95'
              }`}
            >
              {interested ? '✓ Interested' : 'Mark as Interested'}
            </button>
          </div>
        )}
      </div>

      {/* Note */}
      {!isPhase1Override && (
        <p className="text-sm text-textMuted">
          Check back soon — {topic.phase === 2 ? 'Phase 2' : `Phase ${topic.phase}`} content is in development.
        </p>
      )}
      {isPhase1Override && (
        <p className="text-sm text-textMuted">
          This topic is part of Phase 1 and will be fully built shortly.
        </p>
      )}
    </div>
  )
}
