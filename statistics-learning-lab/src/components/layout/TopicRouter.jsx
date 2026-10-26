import { Suspense, useEffect, lazy } from 'react'
import { useParams } from 'react-router-dom'
import topics from '../../data/topics'
import { useProgressContext } from '../../context/ProgressContext'
import ComingSoon from './ComingSoon'

// Phase 1 component map — populated as topic components are created.
// Keys are topic componentPath values (e.g., 'topics/foundations/LevelsOfMeasurement').
const componentMap = {
  // Foundations
  'topics/foundations/LevelsOfMeasurement': lazy(() => import('../../components/topics/foundations/LevelsOfMeasurement')),
  'topics/foundations/PopulationAndSample': lazy(() => import('../../components/topics/foundations/PopulationAndSample')),
  'topics/foundations/VariablesAndObservations': lazy(() => import('../../components/topics/foundations/VariablesAndObservations')),
  'topics/foundations/FrequencyTables': lazy(() => import('../../components/topics/foundations/FrequencyTables')),
  'topics/foundations/DataDistributions': lazy(() => import('../../components/topics/foundations/DataDistributions')),
  'topics/foundations/SkewnessAndOutliers': lazy(() => import('../../components/topics/foundations/SkewnessAndOutliers')),
  // Descriptive Statistics
  'topics/descriptive/MeanMedianMode': lazy(() => import('../../components/topics/descriptive/MeanMedianMode')),
  'topics/descriptive/Range': lazy(() => import('../../components/topics/descriptive/Range')),
  'topics/descriptive/QuartilesAndPercentiles': lazy(() => import('../../components/topics/descriptive/QuartilesAndPercentiles')),
  'topics/descriptive/InterquartileRange': lazy(() => import('../../components/topics/descriptive/InterquartileRange')),
  'topics/descriptive/Variance': lazy(() => import('../../components/topics/descriptive/Variance')),
  'topics/descriptive/StandardDeviation': lazy(() => import('../../components/topics/descriptive/StandardDeviation')),
  'topics/descriptive/ZScore': lazy(() => import('../../components/topics/descriptive/ZScore')),
  'topics/descriptive/BoxPlot': lazy(() => import('../../components/topics/descriptive/BoxPlot')),
  'topics/descriptive/Histogram': lazy(() => import('../../components/topics/descriptive/Histogram')),
  // Probability
  'topics/probability/BasicProbability': lazy(() => import('../../components/topics/probability/BasicProbability')),
  'topics/probability/ComplementRule': lazy(() => import('../../components/topics/probability/ComplementRule')),
  'topics/probability/AdditionRule': lazy(() => import('../../components/topics/probability/AdditionRule')),
  'topics/probability/MultiplicationRule': lazy(() => import('../../components/topics/probability/MultiplicationRule')),
  'topics/probability/IndependentDependentEvents': lazy(() => import('../../components/topics/probability/IndependentDependentEvents')),
  'topics/probability/ConditionalProbability': lazy(() => import('../../components/topics/probability/ConditionalProbability')),
  'topics/probability/BinomialDistribution': lazy(() => import('../../components/topics/probability/BinomialDistribution')),
  'topics/probability/NormalDistribution': lazy(() => import('../../components/topics/probability/NormalDistribution')),
  // Sampling
  'topics/sampling/RandomSampling': lazy(() => import('../../components/topics/sampling/RandomSampling')),
  'topics/sampling/SamplingDistribution': lazy(() => import('../../components/topics/sampling/SamplingDistribution')),
  'topics/sampling/StandardError': lazy(() => import('../../components/topics/sampling/StandardError')),
  'topics/sampling/CentralLimitTheorem': lazy(() => import('../../components/topics/sampling/CentralLimitTheorem')),
  // Inferential Statistics
  'topics/inferential/PointEstimates': lazy(() => import('../../components/topics/inferential/PointEstimates')),
  'topics/inferential/ConfidenceIntervals': lazy(() => import('../../components/topics/inferential/ConfidenceIntervals')),
  'topics/inferential/HypothesisTesting': lazy(() => import('../../components/topics/inferential/HypothesisTesting')),
  'topics/inferential/NullAndAlternativeHypotheses': lazy(() => import('../../components/topics/inferential/NullAndAlternativeHypotheses')),
  'topics/inferential/OneTailedTwoTailedTests': lazy(() => import('../../components/topics/inferential/OneTailedTwoTailedTests')),
  'topics/inferential/SignificanceLevel': lazy(() => import('../../components/topics/inferential/SignificanceLevel')),
  'topics/inferential/CriticalValues': lazy(() => import('../../components/topics/inferential/CriticalValues')),
  'topics/inferential/PValues': lazy(() => import('../../components/topics/inferential/PValues')),
  'topics/inferential/TypeIAndIIErrors': lazy(() => import('../../components/topics/inferential/TypeIAndIIErrors')),
  'topics/inferential/ZTest': lazy(() => import('../../components/topics/inferential/ZTest')),
  'topics/inferential/OneSampleTTest': lazy(() => import('../../components/topics/inferential/OneSampleTTest')),
  'topics/inferential/IndependentSamplesTTest': lazy(() => import('../../components/topics/inferential/IndependentSamplesTTest')),
  'topics/inferential/PairedSamplesTTest': lazy(() => import('../../components/topics/inferential/PairedSamplesTTest')),
  'topics/inferential/ChiSquareTest': lazy(() => import('../../components/topics/inferential/ChiSquareTest')),
  'topics/inferential/Anova': lazy(() => import('../../components/topics/inferential/Anova')),
  // Relationships and Prediction
  'topics/relationships/Covariance': lazy(() => import('../../components/topics/relationships/Covariance')),
  'topics/relationships/Correlation': lazy(() => import('../../components/topics/relationships/Correlation')),
  'topics/relationships/SimpleLinearRegression': lazy(() => import('../../components/topics/relationships/SimpleLinearRegression')),
  'topics/relationships/CorrelationVersusCausation': lazy(() => import('../../components/topics/relationships/CorrelationVersusCausation')),
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-48 text-textMuted text-sm">
      <svg className="animate-spin w-5 h-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      Loading…
    </div>
  )
}

function NotFound({ slug }) {
  return (
    <div className="max-w-xl mx-auto mt-16 px-6">
      <div className="bg-white border border-border rounded-xl p-8 text-center shadow-sm">
        <div className="text-4xl font-bold text-primary mb-3">404</div>
        <h1 className="text-xl font-semibold text-textDark mb-2">Topic not found</h1>
        <p className="text-textMuted text-sm">
          No topic with the slug <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">{slug}</code> exists in this lab.
        </p>
      </div>
    </div>
  )
}

export default function TopicRouter() {
  const { topicSlug } = useParams()
  const { getStatus, setStatus, recordVisit } = useProgressContext()

  const topic = topics.find((t) => t.slug === topicSlug)

  // Record visit and mark as 'learning' on first visit (if still 'not-started')
  useEffect(() => {
    if (!topic) return
    recordVisit(topic.id)
    if (getStatus(topic.id) === 'not-started') {
      setStatus(topic.id, 'learning')
    }
  }, [topic?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!topic) {
    return <NotFound slug={topicSlug} />
  }

  // Phase 2 / 3 topics always show ComingSoon
  if (topic.phase > 1) {
    return <ComingSoon topic={topic} />
  }

  // Phase 1 — look up in component map
  const path = topic.componentPath
  const LazyComponent = componentMap[path]

  if (!LazyComponent) {
    // Component not yet built — show ComingSoon as a dev placeholder
    return <ComingSoon topic={topic} comingSoonOverride />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent topicId={topic.id} />
    </Suspense>
  )
}
