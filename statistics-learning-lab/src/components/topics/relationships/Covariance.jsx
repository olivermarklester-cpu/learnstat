import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, covariance, mean } from '../../../utils/stats'

// ── Interactive covariance visualiser ────────────────────────────────────────

const DEFAULT_X = [2, 4, 5, 7, 9]
const DEFAULT_Y = [3, 6, 5, 8, 10]

function CovarianceViz() {
  const [xRaw, setXRaw] = useState(DEFAULT_X.join(', '))
  const [yRaw, setYRaw] = useState(DEFAULT_Y.join(', '))

  const x = useMemo(() => xRaw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)), [xRaw])
  const y = useMemo(() => yRaw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)), [yRaw])

  const valid = x.length === y.length && x.length >= 2
  const cov = valid ? round(covariance(x, y), 4) : '—'
  const mx = valid ? round(mean(x), 2) : '—'
  const my = valid ? round(mean(y), 2) : '—'

  // SVG scatter plot
  const pts = valid ? x.map((xi, i) => [xi, y[i]]) : []
  const xMin = valid ? Math.min(...x) - 1 : 0
  const xMax = valid ? Math.max(...x) + 1 : 10
  const yMin = valid ? Math.min(...y) - 1 : 0
  const yMax = valid ? Math.max(...y) + 1 : 12
  const toSVG = (xi, yi) => [
    ((xi - xMin) / (xMax - xMin)) * 240 + 20,
    90 - ((yi - yMin) / (yMax - yMin)) * 80,
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">x values (comma-separated)</label>
          <input type="text" value={xRaw} onChange={(e) => setXRaw(e.target.value)}
            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">y values (comma-separated)</label>
          <input type="text" value={yRaw} onChange={(e) => setYRaw(e.target.value)}
            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white outline-none" />
        </div>
      </div>

      {valid && (
        <svg viewBox="0 0 280 100" className="w-full h-28 mb-2">
          {/* axes */}
          <line x1="20" y1="10" x2="20" y2="90" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="20" y1="90" x2="260" y2="90" stroke="#e5e7eb" strokeWidth="1" />
          {/* mean lines */}
          {(() => {
            const [mxSVG] = toSVG(Number(mx), Number(my))
            const [, mySVG] = toSVG(Number(mx), Number(my))
            return <>
              <line x1={mxSVG} y1="10" x2={mxSVG} y2="90" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" />
              <line x1="20" y1={mySVG} x2="260" y2={mySVG} stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" />
            </>
          })()}
          {/* points */}
          {pts.map(([xi, yi], i) => {
            const [sx, sy] = toSVG(xi, yi)
            const color = (xi - Number(mx)) * (yi - Number(my)) >= 0 ? '#3b82f6' : '#ef4444'
            return <circle key={i} cx={sx} cy={sy} r="3" fill={color} opacity="0.8" />
          })}
          <text x="140" y="98" textAnchor="middle" fontSize="6" fill="#9ca3af">x</text>
          <text x="8" y="50" textAnchor="middle" fontSize="6" fill="#9ca3af">y</text>
          <text x="140" y="8" textAnchor="middle" fontSize="6" fill="#7c3aed">dashed = x̄ / ȳ</text>
        </svg>
      )}

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-blue-600 font-medium">x̄</div>
          <div className="text-blue-900 font-bold text-base">{mx}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">ȳ</div>
          <div className="text-purple-900 font-bold text-base">{my}</div>
        </div>
        <div className={`border rounded-lg p-2 ${typeof cov === 'number' ? (cov > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-gray-50 border-border'}`}>
          <div className="font-medium text-xs text-textMuted">Cov(x,y)</div>
          <div className={`font-bold text-base ${typeof cov === 'number' ? (cov > 0 ? 'text-green-800' : 'text-red-800') : 'text-textDark'}`}>{cov}</div>
        </div>
      </div>
      {!valid && <p className="text-xs text-red-500 mt-1">x and y must have the same number of values (≥ 2).</p>}
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Covariance',
  topicGroup: 'Relationships and Prediction',
  learningObjective:
    'Define covariance, compute it from data, and interpret its sign and magnitude.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Covariance</strong> measures how two variables move together. A positive
        covariance means that when x is above its mean, y tends to also be above its mean.
        A negative covariance means they move in opposite directions.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Interpreting the sign and magnitude</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>Cov &gt; 0:</strong> x and y tend to increase together (positive relationship)</li>
          <li><strong>Cov &lt; 0:</strong> when x increases, y tends to decrease (negative relationship)</li>
          <li><strong>Cov ≈ 0:</strong> no linear relationship</li>
          <li><strong>Magnitude:</strong> depends on the units of x and y — hard to interpret on its own</li>
        </ul>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">Limitation of covariance</p>
        <p className="text-amber-800">
          Covariance is scale-dependent. Cov = 50 when x is in grams vs Cov = 0.05 when x is
          in kilograms — same data, different numbers. That is why we use correlation instead
          for comparing relationships across different units.
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Think of two students studying together. Covariance measures whether they both
        tend to score high on the same exams — or whether when one scores high, the other
        scores low. But the raw number depends on whether scores are 0–100 or 0–4 GPA,
        making comparisons across contexts tricky.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'covariance',
    title: 'How Covariance is built',
    steps: [
      {
        label: 'Substitute the Mean for each variable',
        symbolName: 'x̄, ȳ',
        highlightColor: 'blue',
        from: 'Cov(x,y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / (n−1)',
        to: 'Cov = Σ[(xᵢ − mean_x)(yᵢ − mean_y)] / (n−1)',
        note: 'x̄ and ȳ are the sample means of each variable. The numerator multiplies the deviations together — positive when both go the same direction from their means.',
      },
    ],
    finalFormula: 'Cov(x,y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / (n−1)',
  },
  formula: {
    main: 'Cov(x,y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / (n−1)',
    variants: [
      { label: 'Sample covariance', expression: 'Cov(x,y) = Σ(xᵢ − x̄)(yᵢ − ȳ) / (n−1)', latex: 'Cov(x,y) = \\frac{\\sum (x_i - \\bar{x})(y_i - \\bar{y})}{n-1}' },
      { label: 'Population covariance', expression: 'σ_xy = Σ(xᵢ − μx)(yᵢ − μy) / N', latex: '\\sigma_{xy} = \\frac{\\sum (x_i - \\mu_x)(y_i - \\mu_y)}{N}' },
    ],
    symbolGuide: [
      { symbol: 'xᵢ, yᵢ', meaning: 'Individual data points' },
      { symbol: 'x̄, ȳ', meaning: 'Sample means of x and y' },
      { symbol: 'n', meaning: 'Sample size (use n−1 for sample covariance)' },
      { symbol: '(xᵢ−x̄)(yᵢ−ȳ)', meaning: 'Product of deviations — positive when both above mean, negative when mixed' },
    ],
  },
  whenToUse: [
    'Describing the direction of a linear relationship between two continuous variables',
    'As an intermediate step in computing correlation or regression coefficients',
  ],
  whenNotToUse: [
    'Comparing the strength of relationships across different pairs of variables — use correlation (standardised)',
    'Describing non-linear relationships',
  ],
  assumptions: [
    'Both variables are continuous (interval or ratio level)',
    'The relationship being described is linear',
  ],
  workedExample: {
    scenario: 'x = [2, 4, 6], y = [1, 5, 9]. Calculate the sample covariance.',
    steps: [
      { stepNumber: 1, label: 'Means', expression: 'x̄ = (2+4+6)/3 = 4. ȳ = (1+5+9)/3 = 5.', result: 'x̄=4, ȳ=5', explanation: 'Compute both sample means.' },
      { stepNumber: 2, label: 'Deviations', expression: '(x−x̄): −2, 0, +2. (y−ȳ): −4, 0, +4.', result: 'Deviation pairs: (−2,−4), (0,0), (2,4)', explanation: 'Subtract the mean from each value.' },
      { stepNumber: 3, label: 'Products of deviations', expression: '(−2)(−4) + (0)(0) + (2)(4) = 8 + 0 + 8 = 16', result: 'Sum of products = 16', explanation: 'Multiply the deviation pairs and sum.' },
      { stepNumber: 4, label: 'Divide by n−1', expression: 'Cov = 16 / (3−1) = 16/2', result: 'Cov(x,y) = 8', explanation: 'Sample covariance uses n−1.' },
    ],
    interpretation: 'Cov = 8 > 0: x and y move together in a positive direction. The magnitude (8) depends on the scale of x and y.',
  },
  interpretation:
    'The sign of covariance tells you the direction of the linear relationship. The magnitude is scale-dependent and difficult to interpret without standardisation — that is why Pearson r (correlation) is usually preferred for interpretation.',
  commonMistakes: [
    { mistake: 'Interpreting the magnitude of covariance as "strength"', explanation: 'Cov = 100 does not mean a stronger relationship than Cov = 2 unless the scales are identical. Use correlation for standardised strength.' },
    { mistake: 'Confusing covariance with correlation', explanation: 'Correlation = Cov(x,y) / (sx × sy). Correlation is bounded [−1, 1]; covariance is not.' },
    { mistake: 'Using population formula (dividing by N) when you have a sample', explanation: 'For sample data, divide by n−1 to get an unbiased estimate of the population covariance.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'cov-easy-1', scenario: 'x = [1, 3, 5], y = [2, 4, 6]. x̄=3, ȳ=4.', question: 'Calculate sample Cov(x,y).', hint: 'Compute (xᵢ−x̄)(yᵢ−ȳ) for each pair, sum, divide by n−1.', solution: 'Products: (−2)(−2)+(0)(0)+(2)(2) = 4+0+4=8. Cov = 8/(3−1) = 4.' },
    ],
    moderate: [
      { id: 'cov-mod-1', scenario: 'x = [10, 20, 30, 40], y = [40, 30, 20, 10]. x̄=25, ȳ=25.', question: 'Calculate Cov(x,y) and interpret the sign.', hint: 'What happens when x goes up as y goes down?', solution: 'Products: (−15)(15)+(−5)(5)+(5)(−5)+(15)(−15) = −225−25−25−225 = −500. Cov = −500/3 ≈ −166.67. Negative — x and y move in opposite directions.' },
    ],
    challenging: [
      { id: 'cov-chal-1', scenario: 'Cov(x,y) = 50, sx = 10, sy = 5.', question: 'What is the Pearson correlation coefficient r?', hint: 'r = Cov(x,y) / (sx × sy).', solution: 'r = 50 / (10 × 5) = 50/50 = 1.0. Perfect positive linear relationship.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cov-kc-1', type: 'multiple-choice',
      question: 'Cov(x,y) = −12. What does the negative sign indicate?',
      options: [
        { id: 'a', text: 'The variables are weakly related', isCorrect: false, explanation: 'Sign indicates direction; magnitude indicates strength (in the same units).' },
        { id: 'b', text: 'When x tends to be above its mean, y tends to be below its mean', isCorrect: true, explanation: 'Correct! Negative covariance means the variables move in opposite directions.' },
        { id: 'c', text: 'There is no relationship', isCorrect: false, explanation: 'Cov = 0 means no linear relationship. Cov < 0 means negative relationship.' },
        { id: 'd', text: 'The formula was applied incorrectly', isCorrect: false, explanation: 'Negative covariance is a valid result — it indicates a negative linear relationship.' },
      ],
      explanation: 'Negative covariance: when xᵢ > x̄, yᵢ tends to be < ȳ — opposite directions.',
      hint: 'What does (xᵢ−x̄)(yᵢ−ȳ) negative tell you about each variable\'s direction?',
    },
    {
      id: 'cov-kc-2', type: 'multiple-choice',
      question: 'Why is covariance difficult to interpret on its own?',
      options: [
        { id: 'a', text: 'It can only be positive', isCorrect: false, explanation: 'Covariance can be positive, negative, or zero.' },
        { id: 'b', text: 'Its magnitude depends on the units of measurement', isCorrect: true, explanation: 'Correct! Cov = 100 vs Cov = 0.01 for the same data depending on units. Correlation standardises this.' },
        { id: 'c', text: 'It only works for large samples', isCorrect: false, explanation: 'Covariance can be computed for any sample of size ≥ 2.' },
        { id: 'd', text: 'It measures non-linear relationships', isCorrect: false, explanation: 'Covariance measures linear co-movement; it does not capture non-linear patterns.' },
      ],
      explanation: 'Covariance is scale-dependent. Correlation fixes this by dividing by sx and sy.',
      hint: 'What happens if you change the unit (e.g., grams to kilograms)?',
    },
    {
      id: 'cov-kc-3', type: 'numerical',
      question: 'x = [1, 2, 3], y = [3, 2, 1]. x̄=2, ȳ=2. Products of deviations: (−1)(1), (0)(0), (1)(−1). What is Cov(x,y)?',
      answer: -1,
      tolerance: 0.01,
      explanation: 'Sum of products = −1 + 0 + (−1) = −2. Cov = −2/(3−1) = −1.',
      hint: 'Sum the products of deviations, then divide by n−1.',
    },
    {
      id: 'cov-kc-4', type: 'multiple-choice',
      question: 'Which formula gives sample covariance?',
      options: [
        { id: 'a', text: 'Σ(xᵢ−x̄)(yᵢ−ȳ) / N', isCorrect: false, explanation: 'Dividing by N gives the population covariance, not the sample covariance.' },
        { id: 'b', text: 'Σ(xᵢ−x̄)(yᵢ−ȳ) / (n−1)', isCorrect: true, explanation: 'Correct! Divide by n−1 for the sample covariance (unbiased estimator).' },
        { id: 'c', text: 'Σ(xᵢ × yᵢ) / n', isCorrect: false, explanation: 'This computes the mean of the products, not the covariance.' },
        { id: 'd', text: '(x̄ × ȳ) / n', isCorrect: false, explanation: 'This is not a covariance formula.' },
      ],
      explanation: 'Sample covariance = Σ(xᵢ−x̄)(yᵢ−ȳ) / (n−1). Population uses N.',
      hint: 'What is the denominator for an unbiased sample statistic?',
    },
    {
      id: 'cov-kc-5', type: 'multiple-choice',
      question: 'Cov(x,x) equals which statistic?',
      options: [
        { id: 'a', text: 'The mean of x', isCorrect: false, explanation: 'Cov(x,x) = Σ(xᵢ−x̄)² / (n−1) — that is the variance, not the mean.' },
        { id: 'b', text: 'The sample variance of x', isCorrect: true, explanation: 'Correct! Cov(x,x) = Σ(xᵢ−x̄)² / (n−1) = s²ₓ.' },
        { id: 'c', text: 'The standard deviation of x', isCorrect: false, explanation: 'Cov(x,x) = s²ₓ (variance), not sₓ (standard deviation).' },
        { id: 'd', text: 'Zero', isCorrect: false, explanation: 'Cov(x,x) = variance(x), which is zero only if x is constant.' },
      ],
      explanation: 'Cov(x,x) = Σ(xᵢ−x̄)² / (n−1) = s²ₓ. Covariance of a variable with itself is its own variance.',
      hint: 'What happens when you replace y with x in the covariance formula?',
    },
  ],
  keyTakeaway:
    'Cov(x,y) = Σ(xᵢ−x̄)(yᵢ−ȳ)/(n−1). Positive = variables move together; negative = opposite. Magnitude is scale-dependent — use correlation for standardised comparisons.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "Dance Partners" Mental Model</p>
      <p className="text-sm text-violet-800">
        Imagine x and y are dance partners. Covariance measures whether they move <strong>in
        sync</strong> or <strong>against each other</strong>:
      </p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-green-100 border border-green-300 rounded p-2">
          <div className="text-2xl mb-1">↑↑</div>
          <div className="font-bold text-green-800">Cov &gt; 0</div>
          <div className="text-green-700">Both go up together</div>
        </div>
        <div className="bg-gray-100 border border-gray-300 rounded p-2">
          <div className="text-2xl mb-1">→</div>
          <div className="font-bold text-gray-700">Cov ≈ 0</div>
          <div className="text-gray-600">No pattern</div>
        </div>
        <div className="bg-red-100 border border-red-300 rounded p-2">
          <div className="text-2xl mb-1">↑↓</div>
          <div className="font-bold text-red-800">Cov &lt; 0</div>
          <div className="text-red-700">One up, other down</div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
        <strong>Key limitation:</strong> The dance speed (units) affects the number. To compare across datasets, standardise → use correlation r = Cov(x,y)/(sx·sy).
      </div>
    </div>
  ),
  visualization: <CovarianceViz />,
  datasetGenerator: false,
}

export default function Covariance({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
