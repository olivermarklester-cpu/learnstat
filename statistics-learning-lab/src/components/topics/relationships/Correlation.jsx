import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, pearsonR, correlationTStat, tToPValue } from '../../../utils/stats'

// ── Interactive correlation visualiser ────────────────────────────────────────

const DEFAULT_X = [1, 2, 3, 4, 5, 6, 7]
const DEFAULT_Y = [2.1, 3.8, 3.2, 5.5, 5.1, 6.8, 7.2]

function CorrelationViz() {
  const [xRaw, setXRaw] = useState(DEFAULT_X.join(', '))
  const [yRaw, setYRaw] = useState(DEFAULT_Y.join(', '))
  const [alpha, setAlpha] = useState(0.05)

  const x = useMemo(() => xRaw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)), [xRaw])
  const y = useMemo(() => yRaw.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n)), [yRaw])

  const valid = x.length === y.length && x.length >= 3
  const r = valid ? round(pearsonR(x, y), 4) : '—'
  const n = x.length
  const t = valid && typeof r === 'number' ? round(correlationTStat(r, n), 4) : '—'
  const p = valid && typeof t === 'number' ? round(tToPValue(t, n - 2, 2), 4) : '—'
  const reject = typeof p === 'number' && p <= alpha

  const absR = typeof r === 'number' ? Math.abs(r) : 0
  const strength = absR >= 0.8 ? 'Strong' : absR >= 0.5 ? 'Moderate' : absR >= 0.3 ? 'Weak' : 'Negligible'
  const direction = typeof r === 'number' ? (r > 0 ? 'Positive' : r < 0 ? 'Negative' : 'None') : '—'

  // SVG scatter
  const pts = valid ? x.map((xi, i) => [xi, y[i]]) : []
  const xMin = valid ? Math.min(...x) - 0.5 : 0
  const xMax = valid ? Math.max(...x) + 0.5 : 8
  const yMin = valid ? Math.min(...y) - 0.5 : 0
  const yMax = valid ? Math.max(...y) + 0.5 : 9
  const toSVG = (xi, yi) => [
    ((xi - xMin) / (xMax - xMin)) * 220 + 20,
    90 - ((yi - yMin) / (yMax - yMin)) * 75,
  ]

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">x values</label>
          <input type="text" value={xRaw} onChange={(e) => setXRaw(e.target.value)}
            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">y values</label>
          <input type="text" value={yRaw} onChange={(e) => setYRaw(e.target.value)}
            className="w-full text-xs border border-border rounded px-2 py-1.5 bg-white outline-none" />
        </div>
      </div>

      {valid && (
        <svg viewBox="0 0 260 100" className="w-full h-28 mb-2">
          <line x1="20" y1="15" x2="20" y2="90" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="20" y1="90" x2="240" y2="90" stroke="#e5e7eb" strokeWidth="1" />
          {pts.map(([xi, yi], i) => {
            const [sx, sy] = toSVG(xi, yi)
            return <circle key={i} cx={sx} cy={sy} r="3" fill="#2563EB" opacity="0.7" />
          })}
          <text x="130" y="99" textAnchor="middle" fontSize="6" fill="#9ca3af">x</text>
          <text x="7" y="52" textAnchor="middle" fontSize="6" fill="#9ca3af">y</text>
        </svg>
      )}

      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">α (for significance test)</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-xs border border-border rounded px-2 py-1 bg-white">
            <option value={0.10}>0.10</option>
            <option value={0.05}>0.05</option>
            <option value={0.01}>0.01</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2 text-center text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-blue-600 font-medium">r</div>
          <div className="text-blue-900 font-bold text-lg">{r}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">r² (variance explained)</div>
          <div className="text-purple-900 font-bold text-lg">{typeof r === 'number' ? round(r * r, 4) : '—'}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="text-amber-600 font-medium">t (df={n - 2})</div>
          <div className="text-amber-900 font-bold text-lg">{t}</div>
        </div>
        <div className="bg-gray-50 border border-border rounded-lg p-2">
          <div className="text-textMuted font-medium">p-value</div>
          <div className="text-textDark font-bold text-lg">{p}</div>
        </div>
      </div>

      <div className={`rounded-lg p-2 border text-center text-xs font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {valid
          ? `${strength} ${direction} correlation (r=${r}). ${reject ? `Significant at α=${alpha} (p=${p}).` : `Not significant at α=${alpha}.`}`
          : 'Enter matching x and y values (≥ 3 each).'}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Correlation',
  topicGroup: 'Relationships and Prediction',
  learningObjective:
    'Compute and interpret the Pearson correlation coefficient r, and test whether it is significantly different from zero.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>Pearson correlation coefficient r</strong> measures the strength and
        direction of the <em>linear</em> relationship between two continuous variables.
        It standardises covariance so the result always lies between −1 and +1, regardless
        of the units of measurement.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Interpreting r</p>
        <div className="grid grid-cols-2 gap-1 text-blue-800 text-xs font-mono">
          <span>r = +1</span><span>Perfect positive linear</span>
          <span>r = 0.7–0.9</span><span>Strong positive</span>
          <span>r = 0.4–0.6</span><span>Moderate positive</span>
          <span>r = 0.1–0.3</span><span>Weak positive</span>
          <span>r ≈ 0</span><span>No linear relationship</span>
          <span>r = −0.1–−0.3</span><span>Weak negative</span>
          <span>r = −1</span><span>Perfect negative linear</span>
        </div>
      </div>
      <p>
        <strong>r²</strong> (the coefficient of determination) tells you what proportion of
        the variance in y is explained by x. For example, r = 0.8 → r² = 0.64 → 64% of the
        variance in y is explained by x.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Correlation is like covariance that has been put on a treadmill — it works out all
        the excess units until it fits neatly in the range [−1, +1]. The sign still tells you
        direction; now the number tells you genuine strength, regardless of whether you
        measured in centimetres or miles.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'correlation',
    title: 'How Correlation is built from Covariance',
    steps: [
      {
        label: 'Start with Covariance',
        symbolName: 'Cov(x,y)',
        highlightColor: 'blue',
        from: 'r = Cov(x,y) / (sx × sy)',
        to: 'r = [Σ(xᵢ−x̄)(yᵢ−ȳ)/(n−1)] / (sx × sy)',
        note: 'Covariance measures joint spread but is scale-dependent. Dividing by the standard deviations of both variables removes the units.',
      },
      {
        label: 'Substitute Standard Deviations',
        symbolName: 'sx, sy',
        highlightColor: 'orange',
        from: 'r = Cov(x,y) / (sx × sy)',
        to: 'r = Σ(xᵢ−x̄)(yᵢ−ȳ) / √[Σ(xᵢ−x̄)² × Σ(yᵢ−ȳ)²]',
        note: 'sx = √[Σ(xᵢ−x̄)²/(n−1)] and sy similarly. Expanding gives the equivalent fully-explicit form. The result r always lies between −1 and +1.',
      },
    ],
    finalFormula: 'r = Cov(x,y) / (sx × sy)',
  },
  formula: {
    main: 'r = Cov(x,y) / (sx × sy)',
    variants: [
      { label: 'Pearson r', expression: 'r = Cov(x,y) / (sx × sy)', latex: 'r = \\frac{Cov(x,y)}{s_x s_y}' },
      { label: 'Equivalent form', expression: 'r = Σ[(xᵢ−x̄)(yᵢ−ȳ)] / √[Σ(xᵢ−x̄)² × Σ(yᵢ−ȳ)²]', latex: 'r = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2 \\cdot \\sum(y_i-\\bar{y})^2}}' },
      { label: 'Significance test', expression: 't = r√(n−2) / √(1−r²),  df = n−2', latex: 't = \\frac{r\\sqrt{n-2}}{\\sqrt{1-r^2}}' },
    ],
    symbolGuide: [
      { symbol: 'r', meaning: 'Pearson correlation coefficient (−1 ≤ r ≤ 1)' },
      { symbol: 'Cov(x,y)', meaning: 'Sample covariance of x and y' },
      { symbol: 'sx, sy', meaning: 'Sample standard deviations of x and y' },
      { symbol: 'r²', meaning: 'Coefficient of determination — proportion of variance in y explained by x' },
    ],
  },
  whenToUse: [
    'Both variables are continuous (interval or ratio)',
    'You want a standardised measure of linear association that can be compared across datasets',
    'Testing H₀: ρ = 0 (no linear relationship in the population)',
  ],
  whenNotToUse: [
    'Data has a non-linear relationship — Pearson r can be near 0 even for strong curves',
    'One or both variables are ordinal — use Spearman\'s rank correlation',
    'Presence of extreme outliers — they can distort r dramatically',
  ],
  assumptions: [
    'Both variables are continuous',
    'The relationship is approximately linear',
    'No extreme outliers (they distort r)',
    'For significance testing: both variables are approximately normally distributed',
  ],
  workedExample: {
    scenario: 'Study hours (x): [2, 4, 6, 8]. Exam scores (y): [50, 60, 70, 80]. Compute r.',
    steps: [
      { stepNumber: 1, label: 'Means', expression: 'x̄ = 5, ȳ = 65', result: 'x̄=5, ȳ=65', explanation: 'Average each variable.' },
      { stepNumber: 2, label: 'Covariance', expression: 'Cov = [(−3)(−15)+(−1)(−5)+(1)(5)+(3)(15)] / 3 = (45+5+5+45)/3 = 100/3 ≈ 33.33', result: 'Cov ≈ 33.33', explanation: 'Products of deviations summed and divided by n−1 = 3.' },
      { stepNumber: 3, label: 'Standard deviations', expression: 'sx = √(20/3) ≈ 2.582. sy = √(500/3) ≈ 12.91', result: 'sx≈2.582, sy≈12.91', explanation: 'Sample SDs.' },
      { stepNumber: 4, label: 'r', expression: 'r = 33.33 / (2.582 × 12.91) = 33.33 / 33.33', result: 'r = 1.0', explanation: 'Perfect positive linear relationship — every extra 2 study hours gains exactly 10 points.' },
    ],
    interpretation: 'r = 1.0: a perfect positive linear relationship. In real data r is never exactly 1; this example has a perfectly linear pattern by design.',
  },
  interpretation:
    'r tells you direction (sign) and strength (magnitude). Always plot the data — r only measures linear association. Always pair r with r² to show practical importance.',
  commonMistakes: [
    { mistake: 'Confusing correlation with causation', explanation: 'r = 0.9 only means x and y are strongly linearly related. It does not mean x causes y. See the Correlation vs Causation topic.' },
    { mistake: 'Assuming r = 0 means no relationship', explanation: 'r measures only linear association. A perfect parabolic (U-shape) relationship gives r ≈ 0.' },
    { mistake: 'Not visualising the data before relying on r', explanation: 'Anscombe\'s quartet shows four datasets with identical r ≈ 0.82 but completely different scatter plots. Always plot first.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'cor-easy-1', scenario: 'Cov(x,y) = 6, sx = 3, sy = 4.', question: 'What is r?', hint: 'r = Cov / (sx × sy).', solution: 'r = 6 / (3 × 4) = 6/12 = 0.5. Moderate positive correlation.' },
    ],
    moderate: [
      { id: 'cor-mod-1', scenario: 'r = 0.7, n = 25.', question: 'What percentage of variance in y is explained by x? Is r significant at α=0.05? (t*(df=23, two-tailed, α=0.05) ≈ 2.069)', hint: 'r² = 0.49. t = r√(n−2)/√(1−r²).', solution: 'r² = 0.49 → 49% explained. t = 0.7√23/√(1−0.49) = 0.7×4.796/√0.51 = 3.357/0.714 ≈ 4.70. |t|>2.069 → significant.' },
    ],
    challenging: [
      { id: 'cor-chal-1', scenario: 'A dataset with r = 0.95 between ice cream sales and drowning rates.', question: 'Is this evidence that ice cream causes drowning? What might explain this correlation?', hint: 'Think about confounding variables.', solution: 'No — correlation ≠ causation. Both variables share a common cause (hot weather / summer): hot weather increases ice cream sales AND increases swimming, which increases drowning risk. The correlation is spurious — driven by the lurking variable (temperature), not a direct causal link.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cor-kc-1', type: 'multiple-choice',
      question: 'r = −0.85. What does this indicate?',
      options: [
        { id: 'a', text: 'A weak negative relationship', isCorrect: false, explanation: '|r| = 0.85 is a strong relationship. Weak would be |r| < 0.3.' },
        { id: 'b', text: 'A strong negative linear relationship', isCorrect: true, explanation: 'Correct! |r| = 0.85 is strong. Negative sign means they move in opposite directions.' },
        { id: 'c', text: 'No relationship', isCorrect: false, explanation: 'r ≈ 0 means no linear relationship. r = −0.85 is a strong relationship.' },
        { id: 'd', text: 'A strong positive relationship', isCorrect: false, explanation: 'The negative sign indicates opposite directions.' },
      ],
      explanation: 'r = −0.85: strong (|r| = 0.85) and negative (opposite directions).',
      hint: 'Consider both the sign and the magnitude separately.',
    },
    {
      id: 'cor-kc-2', type: 'numerical',
      question: 'r = 0.6. What is r² (coefficient of determination)? Enter as a decimal.',
      answer: 0.36,
      tolerance: 0.001,
      explanation: 'r² = 0.6² = 0.36. 36% of the variance in y is explained by x.',
      hint: 'r² = r × r.',
    },
    {
      id: 'cor-kc-3', type: 'multiple-choice',
      question: 'r = 0 between study hours and exam scores. What can you conclude?',
      options: [
        { id: 'a', text: 'Studying has no effect on exam scores', isCorrect: false, explanation: 'r = 0 only means no linear relationship. A non-linear relationship could still exist.' },
        { id: 'b', text: 'There is no linear relationship between the two variables', isCorrect: true, explanation: 'Correct! r = 0 only means no linear association. Non-linear patterns can still exist.' },
        { id: 'c', text: 'The sample size is too small to detect a relationship', isCorrect: false, explanation: 'r = 0 is about the pattern in the data, not the sample size.' },
        { id: 'd', text: 'Study hours causes exam scores to stay the same', isCorrect: false, explanation: 'r tells you about correlation, not causation.' },
      ],
      explanation: 'r = 0 indicates no linear relationship. Non-linear relationships are not captured by Pearson r.',
      hint: 'What does "linear" in Pearson r mean?',
    },
    {
      id: 'cor-kc-4', type: 'multiple-choice',
      question: 'Which condition makes Pearson r misleading?',
      options: [
        { id: 'a', text: 'Large sample sizes', isCorrect: false, explanation: 'Large n improves reliability of r, not misleadingness.' },
        { id: 'b', text: 'A strong non-linear (e.g. U-shaped) relationship', isCorrect: true, explanation: 'Correct! r measures only linear association. A U-shape gives r ≈ 0 even if the relationship is very strong.' },
        { id: 'c', text: 'Both variables having similar standard deviations', isCorrect: false, explanation: 'Similar SDs do not distort r.' },
        { id: 'd', text: 'Using sample data instead of population data', isCorrect: false, explanation: 'Sample r is a valid estimate of population ρ.' },
      ],
      explanation: 'Pearson r only measures linear association. Non-linear patterns produce misleadingly low r values.',
      hint: 'What type of relationship does Pearson r capture?',
    },
    {
      id: 'cor-kc-5', type: 'multiple-choice',
      question: 'Cov(x,y) = 20, sx = 5, sy = 4. What is r?',
      options: [
        { id: 'a', text: 'r = 1.0', isCorrect: true, explanation: 'r = 20/(5×4) = 20/20 = 1.0. Perfect positive correlation.' },
        { id: 'b', text: 'r = 0.5', isCorrect: false, explanation: 'r = Cov/(sx×sy) = 20/20 = 1.0, not 0.5.' },
        { id: 'c', text: 'r = 4.0', isCorrect: false, explanation: 'r cannot exceed 1. You may have forgotten to divide by both SDs.' },
        { id: 'd', text: 'r = 0.25', isCorrect: false, explanation: 'r = 20/(5×4) = 1.0, not 0.25.' },
      ],
      explanation: 'r = Cov(x,y) / (sx × sy) = 20 / (5 × 4) = 20/20 = 1.0.',
      hint: 'r = Cov(x,y) / (sx × sy).',
    },
  ],
  keyTakeaway:
    'r = Cov(x,y)/(sx×sy). Always in [−1, +1]. Sign = direction, magnitude = strength. r² = proportion of variance explained. Only measures linear association — always visualise data first.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The r Ruler — Direction + Strength in One Number</p>
      <div className="relative h-8 my-2">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-gradient-to-r from-red-400 to-gray-200"></div>
          <div className="flex-1 bg-gradient-to-r from-gray-200 to-blue-400"></div>
        </div>
        {[[-1,'−1'],[-0.5,'−0.5'],[0,'0'],[0.5,'0.5'],[1,'1']].map(([pos, label]) => (
          <div key={label} className="absolute top-0 h-full flex flex-col items-center justify-end"
            style={{ left: `${((pos + 1) / 2) * 100}%`, transform: 'translateX(-50%)' }}>
            <span className="text-xs font-bold text-white drop-shadow">{label}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs text-center mt-1">
        <div className="bg-red-50 border border-red-200 rounded p-1.5 text-red-700"><strong>−1 to −0.7</strong><br/>Strong negative</div>
        <div className="bg-gray-50 border border-gray-200 rounded p-1.5 text-gray-600"><strong>−0.3 to +0.3</strong><br/>Negligible / none</div>
        <div className="bg-blue-50 border border-blue-200 rounded p-1.5 text-blue-700"><strong>+0.7 to +1</strong><br/>Strong positive</div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-xs text-violet-800">
        <strong>Quick test:</strong> r = Cov/(sx·sy). If |r| is large → strong linear pattern. Multiply r × r to get r² (% of variance explained).
      </div>
    </div>
  ),
  visualization: <CorrelationViz />,
  datasetGenerator: false,
}

export default function Correlation({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
