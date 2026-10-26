import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import BellCurveChart from '../../charts/BellCurveChart'
import { round, normalCDF } from '../../../utils/stats'

// --- Interactive Normal Distribution Visualization ---
function NormalViz() {
  const [mu, setMu] = useState(170)
  const [sigma, setSigma] = useState(10)
  const [shade, setShade] = useState('none')

  const { shadeFrom, shadeTo, shadeLabel, shadePct } = useMemo(() => {
    if (shade === 'pm1') {
      const pct = round((normalCDF(mu + sigma, mu, sigma) - normalCDF(mu - sigma, mu, sigma)) * 100, 1)
      return { shadeFrom: -1, shadeTo: 1, shadeLabel: '±1 SD', shadePct: pct }
    }
    if (shade === 'pm2') {
      const pct = round((normalCDF(mu + 2 * sigma, mu, sigma) - normalCDF(mu - 2 * sigma, mu, sigma)) * 100, 1)
      return { shadeFrom: -2, shadeTo: 2, shadeLabel: '±2 SD', shadePct: pct }
    }
    if (shade === 'pm3') {
      const pct = round((normalCDF(mu + 3 * sigma, mu, sigma) - normalCDF(mu - 3 * sigma, mu, sigma)) * 100, 1)
      return { shadeFrom: -3, shadeTo: 3, shadeLabel: '±3 SD', shadePct: pct }
    }
    return { shadeFrom: null, shadeTo: null, shadeLabel: null, shadePct: null }
  }, [shade, mu, sigma])

  const stats = useMemo(() => {
    const sd1Low = round(mu - sigma, 1)
    const sd1High = round(mu + sigma, 1)
    const sd2Low = round(mu - 2 * sigma, 1)
    const sd2High = round(mu + 2 * sigma, 1)
    const sd3Low = round(mu - 3 * sigma, 1)
    const sd3High = round(mu + 3 * sigma, 1)
    return { sd1Low, sd1High, sd2Low, sd2High, sd3Low, sd3High }
  }, [mu, sigma])

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Mean (μ): <span className="text-primary font-bold">{mu}</span>
          </label>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={mu}
            onChange={(e) => setMu(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-textMuted mt-0.5">
            <span>0</span>
            <span>200</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Std Dev (σ): <span className="text-primary font-bold">{sigma}</span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-textMuted mt-0.5">
            <span>1</span>
            <span>40</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'none', label: 'No shading' },
          { key: 'pm1', label: '±1 SD ≈ 68%' },
          { key: 'pm2', label: '±2 SD ≈ 95%' },
          { key: 'pm3', label: '±3 SD ≈ 99.7%' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setShade(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              shade === key
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <BellCurveChart
        mean={mu}
        sd={sigma}
        shadeFrom={shadeFrom}
        shadeTo={shadeTo}
        title={`Normal Distribution — μ=${mu}, σ=${sigma}`}
        showSDMarkers
        height={260}
        xLabel="Value"
      />

      {shadePct !== null && (
        <div className="mt-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <strong>{shadeLabel}</strong>:{' '}
          {shade === 'pm1'
            ? `${stats.sd1Low} to ${stats.sd1High}`
            : shade === 'pm2'
            ? `${stats.sd2Low} to ${stats.sd2High}`
            : `${stats.sd3Low} to ${stats.sd3High}`}.{' '}
          Approximately <strong>{shadePct}%</strong> of values fall in the shaded region.
        </div>
      )}

      {shadePct === null && (
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {[
            { label: '±1 SD', range: `${stats.sd1Low} – ${stats.sd1High}`, pct: '≈68%', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { label: '±2 SD', range: `${stats.sd2Low} – ${stats.sd2High}`, pct: '≈95%', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            { label: '±3 SD', range: `${stats.sd3Low} – ${stats.sd3High}`, pct: '≈99.7%', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          ].map(({ label, range, pct, color }) => (
            <div key={label} className={`border rounded-lg p-2 text-xs ${color}`}>
              <div className="font-semibold">{label}</div>
              <div className="font-bold text-base">{pct}</div>
              <div className="text-xs">{range}</div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Dashed lines mark SD positions. Drag sliders to change μ and σ — notice the curve shifts
        (mean) and narrows/widens (SD).
      </p>
    </div>
  )
}

const content = {
  title: 'Normal Distribution',
  topicGroup: 'Probability',
  learningObjective:
    'Describe the properties of the normal distribution and apply the 68-95-99.7 rule.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>normal distribution</strong> is a symmetric, bell-shaped probability
        distribution that describes many natural phenomena. It is defined by two parameters:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>
          <strong>Mean (μ):</strong> The centre of the distribution. Mean = median = mode.
        </li>
        <li>
          <strong>Standard deviation (σ):</strong> Controls the spread. Larger σ = wider, flatter
          curve; smaller σ = narrower, taller curve.
        </li>
      </ul>
      <p>
        Key property: the normal distribution is perfectly symmetric around the mean. The total
        area under the curve equals 1 (all probabilities sum to 100%).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="font-medium text-blue-900 mb-1">The 68-95-99.7 Empirical Rule</p>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>≈ <strong>68%</strong> of values fall within 1 SD of the mean (μ ± σ)</li>
          <li>≈ <strong>95%</strong> of values fall within 2 SDs of the mean (μ ± 2σ)</li>
          <li>≈ <strong>99.7%</strong> of values fall within 3 SDs of the mean (μ ± 3σ)</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Adult height is approximately normally distributed with μ = 170 cm and σ = 10 cm. This
        means:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>About 68% of adults are between 160 cm and 180 cm (within 1 SD)</li>
        <li>About 95% are between 150 cm and 190 cm (within 2 SDs)</li>
        <li>Nearly all adults (99.7%) are between 140 cm and 200 cm (within 3 SDs)</li>
      </ul>
      <p className="text-sm text-gray-600">
        Other real-world approximations: exam scores, IQ scores, measurement errors, blood
        pressure, and many biological measurements tend to follow normal-ish distributions.
      </p>
    </div>
  ),
  formula: {
    main: 'f(x) = (1/σ√2π) × e^(−(x−μ)²/2σ²)',
    variants: [
      { label: 'PDF (full formula)', expression: 'f(x) = (1/σ√2π) × e^(−(x−μ)²/2σ²)', latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^{2}}{2\\sigma^{2}}}' },
      { label: 'Standard normal', expression: 'Z ~ N(0,1): f(z) = (1/√2π) × e^(−z²/2)', latex: 'f(z) = \\frac{1}{\\sqrt{2\\pi}} e^{-\\frac{z^{2}}{2}}' },
      { label: 'Z-score conversion', expression: 'z = (x − μ) / σ', latex: 'z = \\frac{x - \\mu}{\\sigma}' },
      { label: 'Empirical rule ±1σ', expression: 'P(μ − σ < X < μ + σ) ≈ 0.68', latex: 'P(\\mu - \\sigma < X < \\mu + \\sigma) \\approx 0.68' },
      { label: 'Empirical rule ±2σ', expression: 'P(μ − 2σ < X < μ + 2σ) ≈ 0.95', latex: 'P(\\mu - 2\\sigma < X < \\mu + 2\\sigma) \\approx 0.95' },
      { label: 'Empirical rule ±3σ', expression: 'P(μ − 3σ < X < μ + 3σ) ≈ 0.997', latex: 'P(\\mu - 3\\sigma < X < \\mu + 3\\sigma) \\approx 0.997' },
    ],
    symbolGuide: [
      { symbol: 'f(x)', meaning: 'Probability density at value x — height of the curve, not probability directly' },
      { symbol: 'μ', meaning: 'Population mean — the centre of the distribution (read "mu")' },
      { symbol: 'σ', meaning: 'Population standard deviation — controls the spread (read "sigma")' },
      { symbol: 'σ²', meaning: 'Population variance' },
      { symbol: 'e', meaning: "Euler's number ≈ 2.718 — the base of the natural logarithm" },
      { symbol: 'π', meaning: "Pi ≈ 3.14159" },
      { symbol: 'z', meaning: 'Standard score — number of standard deviations from the mean' },
      { symbol: 'N(μ, σ²)', meaning: 'Notation for a normal distribution with mean μ and variance σ²' },
    ],
  },
  whenToUse: [
    'When a continuous variable is approximately symmetric and bell-shaped',
    'When applying the 68-95-99.7 rule for quick probability estimates',
    'When converting to z-scores to use standard normal tables',
    'In many statistical tests that assume normally distributed data (t-tests, ANOVA)',
    'As an approximation for binomial distributions with large n',
  ],
  whenNotToUse: [
    'When data is heavily skewed — use skewed distributions instead',
    'For strictly discrete data — use discrete distributions like binomial or Poisson',
    'When you have outliers that indicate the distribution is not bell-shaped',
    'When sample size is very small and the underlying distribution is unknown',
  ],
  assumptions: [
    'The variable is continuous (or close to continuous with many possible values)',
    'The distribution is approximately symmetric and bell-shaped',
    'Mean, median, and mode are equal (exactly true for the theoretical normal)',
    'Defined for all real numbers (−∞ to +∞)',
  ],
  workedExample: {
    scenario: 'Heights of adults are normally distributed with μ = 170 cm, σ = 10 cm.',
    steps: [
      {
        stepNumber: 1,
        label: 'Apply the empirical rule — ±1 SD',
        expression: 'μ ± σ = 170 ± 10 = [160, 180]',
        result: '≈ 68% of adults are between 160 cm and 180 cm',
        explanation:
          'The 68% region spans one standard deviation on each side of the mean.',
      },
      {
        stepNumber: 2,
        label: 'Apply the empirical rule — ±2 SD',
        expression: 'μ ± 2σ = 170 ± 20 = [150, 190]',
        result: '≈ 95% of adults are between 150 cm and 190 cm',
        explanation:
          'Extending to two standard deviations captures 95% of all observations.',
      },
      {
        stepNumber: 3,
        label: 'Apply the empirical rule — ±3 SD',
        expression: 'μ ± 3σ = 170 ± 30 = [140, 200]',
        result: '≈ 99.7% of adults are between 140 cm and 200 cm',
        explanation:
          'Only 0.3% of adults would fall outside this range — heights below 140 cm or above 200 cm are extremely rare.',
      },
      {
        stepNumber: 4,
        label: 'Z-score for an extreme value',
        expression: 'z = (195 − 170) / 10 = 25 / 10',
        result: 'z = 2.5',
        explanation:
          '195 cm is 2.5 standard deviations above the mean. This is above the ±2 SD band, placing this adult in roughly the top 0.6% of heights.',
      },
      {
        stepNumber: 5,
        label: 'One-sided tail probability',
        expression: 'P(X > 190) = P(z > 2) ≈ 0.025 (2.5% in the upper tail beyond +2 SD)',
        result: 'About 2.5% of adults are taller than 190 cm',
        explanation:
          'Since 95% fall within ±2 SD, 5% fall outside. By symmetry, 2.5% fall above +2 SD and 2.5% below −2 SD.',
      },
    ],
    interpretation:
      'The empirical rule provides quick probability estimates without needing a table. A person 195 cm tall is at z = 2.5 — in roughly the top 0.6% of the height distribution. Use z-scores to position any value on the standard normal curve.',
  },
  interpretation:
    'The normal distribution is the foundation of many statistical methods. The empirical rule gives a quick mental model: 68% within 1 SD, 95% within 2 SDs, 99.7% within 3 SDs. Use z-scores to compare across distributions with different means and standard deviations.',
  commonMistakes: [
    {
      mistake: 'Confusing the area under the curve with the height of the curve',
      explanation:
        'The height f(x) is the probability density — not a probability itself. Probabilities correspond to areas (ranges), not points. P(X = exactly 170) = 0 for a continuous distribution.',
    },
    {
      mistake: 'Applying the empirical rule to non-normal distributions',
      explanation:
        'The 68-95-99.7 rule only applies to normal distributions. Skewed or heavy-tailed distributions have very different percentages within those ranges.',
    },
    {
      mistake: 'Forgetting that the empirical rule gives approximate percentages',
      explanation:
        'The exact values are 68.27%, 95.45%, and 99.73%. These are commonly rounded to 68%, 95%, and 99.7% for quick estimates.',
    },
    {
      mistake: 'Assuming all continuous data is normally distributed',
      explanation:
        'Many real datasets are skewed, multimodal, or otherwise non-normal. Always check with a histogram or normality test before applying normal distribution methods.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'nd-easy-1',
        scenario: 'Test scores are normally distributed with μ = 75 and σ = 8.',
        question: 'What percentage of students scored between 67 and 83?',
        hint: '67 = μ − σ and 83 = μ + σ. This is the ±1 SD range.',
        solution: '67 = 75 − 8 = μ − σ and 83 = 75 + 8 = μ + σ. By the empirical rule, approximately 68% of scores fall within ±1 SD.',
      },
      {
        id: 'nd-easy-2',
        scenario: 'IQ scores are normally distributed with μ = 100 and σ = 15.',
        question: 'Between what two values do about 95% of IQ scores fall?',
        hint: 'Apply the ±2 SD rule: μ ± 2σ.',
        solution: 'μ ± 2σ = 100 ± 30 = [70, 130]. About 95% of IQ scores fall between 70 and 130.',
      },
    ],
    moderate: [
      {
        id: 'nd-mod-1',
        scenario:
          'A factory produces bolts with diameter normally distributed: μ = 10 mm, σ = 0.2 mm. Bolts outside [9.6, 10.4] are rejected.',
        question: 'What percentage of bolts are rejected?',
        hint: '9.6 = μ − 2σ and 10.4 = μ + 2σ. Use the empirical rule to find what is accepted, then complement.',
        solution:
          'μ ± 2σ = 10 ± 0.4 = [9.6, 10.4]. About 95% are accepted. Rejected ≈ 5%.',
      },
    ],
    challenging: [
      {
        id: 'nd-chal-1',
        scenario:
          'Processing times in a call centre are approximately normal with μ = 8 minutes, σ = 1.5 minutes.',
        question:
          'What proportion of calls take more than 11 minutes? Express as a z-score first.',
        hint: 'Calculate z for x = 11. Then use the empirical rule or symmetry.',
        solution:
          'z = (11 − 8) / 1.5 = 2. P(X > 11) = P(z > 2). By empirical rule: 95% within ±2 SD, so 5% outside. By symmetry, 2.5% are above +2 SD. About 2.5% of calls take more than 11 minutes.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'nd-kc-1',
      type: 'multiple-choice',
      question:
        'For a normal distribution, approximately what percentage of values fall within 2 standard deviations of the mean?',
      options: [
        { id: 'a', text: '50%', isCorrect: false, explanation: '50% falls below the mean (and 50% above) — not within ±2 SD.' },
        { id: 'b', text: '68%', isCorrect: false, explanation: '68% falls within ±1 SD of the mean, not ±2 SD.' },
        { id: 'c', text: '95%', isCorrect: true, explanation: 'Correct! The empirical rule: approximately 95% of values fall within ±2 SDs of the mean.' },
        { id: 'd', text: '99.7%', isCorrect: false, explanation: '99.7% falls within ±3 SDs of the mean.' },
      ],
      explanation: 'Empirical rule: ±1 SD ≈ 68%, ±2 SD ≈ 95%, ±3 SD ≈ 99.7%.',
      hint: 'Remember the three numbers: 68, 95, 99.7.',
    },
    {
      id: 'nd-kc-2',
      type: 'multiple-choice',
      question:
        'A normal distribution has μ = 50 and σ = 5. What percentage of values are above 60?',
      options: [
        { id: 'a', text: '5%', isCorrect: false, explanation: '5% is outside ±2 SD total — 2.5% in each tail.' },
        { id: 'b', text: '2.5%', isCorrect: true, explanation: 'Correct! 60 = μ + 2σ. 95% falls within ±2 SD, so 5% falls outside. By symmetry, 2.5% is above +2 SD.' },
        { id: 'c', text: '16%', isCorrect: false, explanation: '16% would be the upper tail beyond +1 SD.' },
        { id: 'd', text: '32%', isCorrect: false, explanation: '32% is outside ±1 SD total (100% − 68%).' },
      ],
      explanation: '60 = 50 + 2×5 = μ + 2σ. 5% falls outside ±2 SD. By symmetry, 2.5% is above 60.',
      hint: 'What is the z-score for 60? Then apply the empirical rule.',
    },
    {
      id: 'nd-kc-3',
      type: 'numerical',
      question:
        'Heights are N(170, 10). What is the z-score for a height of 185 cm?',
      answer: 1.5,
      tolerance: 0.05,
      explanation: 'z = (x − μ) / σ = (185 − 170) / 10 = 15/10 = 1.5.',
      hint: 'z = (value − mean) / standard deviation.',
    },
    {
      id: 'nd-kc-4',
      type: 'multiple-choice',
      question:
        'For a perfectly normal distribution, which is true?',
      options: [
        { id: 'a', text: 'Mean > Median', isCorrect: false, explanation: 'The normal distribution is symmetric — mean, median, and mode are all equal.' },
        { id: 'b', text: 'Mean < Mode', isCorrect: false, explanation: 'In a normal distribution, mean = median = mode.' },
        { id: 'c', text: 'Mean = Median = Mode', isCorrect: true, explanation: 'Correct! Perfect symmetry means all three measures of centre coincide.' },
        { id: 'd', text: 'Mode > Mean', isCorrect: false, explanation: 'Not true for a symmetric distribution.' },
      ],
      explanation: 'A normal distribution is perfectly symmetric. Mean, median, and mode all equal μ.',
      hint: 'Think about symmetry — where is the centre of a bell curve?',
    },
    {
      id: 'nd-kc-5',
      type: 'multiple-choice',
      question:
        'Which of the following is MOST likely to follow a normal distribution?',
      options: [
        { id: 'a', text: 'Number of traffic accidents per month (rare events)', isCorrect: false, explanation: 'Rare count events typically follow a Poisson distribution.' },
        { id: 'b', text: 'Monthly income across a whole population (right-skewed)', isCorrect: false, explanation: 'Income is typically right-skewed — a few very high earners create a long right tail.' },
        { id: 'c', text: 'Average height of adults in a large population', isCorrect: true, explanation: 'Correct! Height is continuous, symmetric around the mean, and follows a bell-shaped pattern in large populations.' },
        { id: 'd', text: 'Binary outcomes (yes/no survey responses)', isCorrect: false, explanation: 'Binary outcomes follow a binomial distribution, not a normal one.' },
      ],
      explanation: 'Height is a continuous variable that results from many independent factors — it approximates a normal distribution well in large populations.',
      hint: 'Which variable is continuous and likely to be symmetric around a central value?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'norm-tf-1', type: 'true-false', question: 'The normal distribution is symmetric about its mean.', isTrue: true, explanation: 'The bell curve is perfectly symmetric. The mean, median, and mode all coincide at the centre.' },
    { id: 'norm-tf-2', type: 'true-false', question: 'In a normal distribution, about 95% of values fall within ±1 standard deviation of the mean.', isTrue: false, explanation: '68% fall within ±1σ. It is ±2σ that captures approximately 95% of values.' },
    { id: 'norm-tf-3', type: 'true-false', question: 'The total area under a normal distribution curve equals 1.', isTrue: true, explanation: 'All probability distributions integrate to 1. The entire area under the normal curve represents 100% of outcomes.' },
    { id: 'norm-tf-4', type: 'true-false', question: 'A normal distribution can have a negative mean.', isTrue: true, explanation: 'The mean μ can be any real number — negative, zero, or positive. For example, temperature changes can have negative means.' },
    { id: 'norm-tf-5', type: 'true-false', question: 'The standard normal distribution has mean 0 and standard deviation 1.', isTrue: true, explanation: 'The standard normal N(0,1) is the canonical form. All normal distributions can be converted to it via z-standardisation.' },
    { id: 'norm-tf-6', type: 'true-false', question: 'The normal distribution curve touches the x-axis at exactly two points.', isTrue: false, explanation: 'The normal distribution curve is asymptotic — it approaches but never touches the x-axis. It extends infinitely in both directions.' },
    { id: 'norm-tf-7', type: 'true-false', question: 'The empirical rule states that 99.7% of data in a normal distribution fall within ±3σ.', isTrue: true, explanation: 'The 68-95-99.7 rule: ±1σ = 68%, ±2σ = 95%, ±3σ = 99.7%.' },
    { id: 'norm-tf-8', type: 'true-false', question: 'A larger standard deviation makes the normal curve taller and narrower.', isTrue: false, explanation: 'A larger σ makes the curve shorter and wider (more spread out). A smaller σ makes it taller and narrower.' },
    { id: 'norm-tf-9', type: 'true-false', question: 'P(X = x) > 0 for any specific value x in a continuous normal distribution.', isTrue: false, explanation: 'For a continuous distribution, the probability of any exact value is zero. Only intervals have non-zero probability.' },
    { id: 'norm-tf-10', type: 'true-false', question: 'A z-score converts a raw value to the number of standard deviations from the mean.', isTrue: true, explanation: 'z = (x − μ)/σ. The z-score measures how many standard deviations x is above or below the mean.' },
    { id: 'norm-tf-11', type: 'true-false', question: 'The mean and median are equal in a normal distribution.', isTrue: true, explanation: 'Perfect symmetry means the distribution centre (mean) coincides with the 50th percentile (median).' },
    { id: 'norm-tf-12', type: 'true-false', question: 'Two normal distributions with the same mean but different standard deviations have the same shape.', isTrue: false, explanation: 'They have the same centre but different spreads — the one with larger σ is flatter and wider.' },
    { id: 'norm-tf-13', type: 'true-false', question: 'P(X < μ) = 0.5 for any normal distribution.', isTrue: true, explanation: 'Due to symmetry, exactly half of the area lies below the mean. P(X < μ) = 0.5 always.' },
    { id: 'norm-tf-14', type: 'true-false', question: 'The normal distribution is characterised entirely by its mean and standard deviation.', isTrue: true, explanation: 'N(μ, σ) — just these two parameters completely define a normal distribution.' },
    { id: 'norm-tf-15', type: 'true-false', question: 'Skewed data can follow a normal distribution.', isTrue: false, explanation: 'Normal distributions are perfectly symmetric (skewness = 0). Skewed data, by definition, violates normality.' },
    { id: 'norm-tf-16', type: 'true-false', question: 'In a standard normal distribution, a z-score of 2 corresponds to approximately the 97.5th percentile.', isTrue: false, explanation: 'P(Z < 2) ≈ 0.9772 — this is the 97.7th percentile, not the 97.5th. The 97.5th percentile corresponds to z ≈ 1.96. z = 2 and z = 1.96 are close but distinct values.' },
    { id: 'norm-tf-17', type: 'true-false', question: 'The normal distribution has heavier tails than the t-distribution.', isTrue: false, explanation: 'The t-distribution has heavier tails than the normal distribution. This is why t-tests use critical values larger than z-values.' },
    { id: 'norm-tf-18', type: 'true-false', question: 'Adding two independent normal random variables produces another normal random variable.', isTrue: true, explanation: 'The sum (or difference) of independent normal variables is also normally distributed.' },
    { id: 'norm-tf-19', type: 'true-false', question: 'If X ~ N(50, 10), then P(X > 50) = 0.5.', isTrue: true, explanation: 'The mean is 50. By symmetry, P(X > μ) = 0.5 for any normal distribution.' },
    { id: 'norm-tf-20', type: 'true-false', question: 'A z-score can only be positive.', isTrue: false, explanation: 'A z-score is negative when x < μ, zero when x = μ, and positive when x > μ. All signs are valid.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'norm-mc-6', type: 'multiple-choice', question: 'In N(100, 15), approximately what percentage of values fall between 70 and 130?', options: [{ id: 'a', text: '68%', isCorrect: false, explanation: '68% is within ±1σ. 70 to 130 is μ ± 2σ (100−30 to 100+30).' }, { id: 'b', text: '95%', isCorrect: true, explanation: '70 = 100−2×15 and 130 = 100+2×15. This is ±2σ → ~95%.' }, { id: 'c', text: '99.7%', isCorrect: false, explanation: '99.7% is within ±3σ. ±3σ = 55 to 145.' }, { id: 'd', text: '50%', isCorrect: false, explanation: '50% is only below or only above the mean.' }], explanation: 'μ ± 2σ: 100 ± 30 = [70, 130]. The empirical rule gives 95%.', hint: 'How many standard deviations is 70 (or 130) from the mean of 100?' },
    { id: 'norm-mc-7', type: 'multiple-choice', question: 'X ~ N(50, 10). What is the z-score for x = 35?', options: [{ id: 'a', text: '−1.5', isCorrect: true, explanation: 'z = (35 − 50) / 10 = −15/10 = −1.5.' }, { id: 'b', text: '1.5', isCorrect: false, explanation: 'z = −1.5 because 35 is below the mean.' }, { id: 'c', text: '−0.15', isCorrect: false, explanation: 'z = (x−μ)/σ = −15/10 = −1.5, not −0.15.' }, { id: 'd', text: '3.5', isCorrect: false, explanation: '3.5 = x/σ — incorrect formula missing the mean.' }], explanation: 'z = (35 − 50) / 10 = −1.5. The value is 1.5 standard deviations below the mean.', hint: 'z = (x − μ) / σ.' },
    { id: 'norm-mc-8', type: 'multiple-choice', question: 'In a standard normal distribution, P(Z < 0) = ?', options: [{ id: 'a', text: '0', isCorrect: false, explanation: 'P(Z < 0) is not 0 — exactly half the distribution is below 0.' }, { id: 'b', text: '0.5', isCorrect: true, explanation: 'The standard normal is centred at 0. By symmetry, P(Z < 0) = 0.5.' }, { id: 'c', text: '1', isCorrect: false, explanation: 'P = 1 would mean Z is always less than 0, which is false.' }, { id: 'd', text: '0.68', isCorrect: false, explanation: '0.68 is P(−1 < Z < 1) — the central 68% — not P(Z < 0).' }], explanation: 'Z ~ N(0,1). By symmetry about zero, P(Z < 0) = 0.5.', hint: 'The mean of the standard normal is 0. What fraction is below the mean?' },
    { id: 'norm-mc-9', type: 'multiple-choice', question: 'Which of the following is NOT a property of the normal distribution?', options: [{ id: 'a', text: 'It is symmetric about the mean', isCorrect: false, explanation: 'Symmetry is a defining property.' }, { id: 'b', text: 'The curve touches the x-axis at the tails', isCorrect: true, explanation: 'The normal curve is asymptotic — it approaches but never touches the x-axis.' }, { id: 'c', text: 'Mean = Median = Mode', isCorrect: false, explanation: 'Perfect symmetry makes these three measures equal.' }, { id: 'd', text: 'Total area = 1', isCorrect: false, explanation: 'All probability distributions integrate to 1.' }], explanation: 'The normal curve is asymptotic, extending infinitely without touching the x-axis.', hint: 'Which property sounds correct but is actually a misconception about tails?' },
    { id: 'norm-mc-10', type: 'multiple-choice', question: 'IQ scores follow N(100, 15). What fraction of people have IQ above 130?', options: [{ id: 'a', text: '5%', isCorrect: false, explanation: '5% is outside ±2σ in total (2.5% each tail). IQ=130 = μ+2σ → 2.5% above.' }, { id: 'b', text: '2.5%', isCorrect: true, explanation: 'IQ=130 is μ+2σ. By empirical rule, 5% falls outside ±2σ. Symmetry → 2.5% above 130.' }, { id: 'c', text: '16%', isCorrect: false, explanation: '16% is above μ+1σ (i.e., IQ > 115), not IQ > 130.' }, { id: 'd', text: '32%', isCorrect: false, explanation: '32% is outside ±1σ in total. IQ > 130 is one specific tail beyond ±2σ.' }], explanation: 'IQ 130 = μ+2σ. By the 95% rule, 5% is beyond ±2σ. Half of 5% = 2.5% above 130.', hint: 'How many standard deviations is 130 from 100? What % falls in that tail?' },
    { id: 'norm-mc-11', type: 'multiple-choice', question: 'Why do we standardise to a z-score?', options: [{ id: 'a', text: 'To make all values positive', isCorrect: false, explanation: 'Z-scores can be negative.' }, { id: 'b', text: 'To use a single standard normal table for any normal distribution', isCorrect: true, explanation: 'Standardising converts any N(μ,σ) to N(0,1), allowing one universal probability table to be applied.' }, { id: 'c', text: 'To change the shape of the distribution', isCorrect: false, explanation: 'Standardisation preserves the normal shape — it only shifts and rescales.' }, { id: 'd', text: 'To eliminate outliers', isCorrect: false, explanation: 'Standardisation does not remove any data points.' }], explanation: 'A z-score converts any normal distribution to the standard normal N(0,1), where one table covers all cases.', hint: 'What is the main practical benefit of converting to a z-score?' },
    { id: 'norm-mc-12', type: 'multiple-choice', question: 'X ~ N(μ, σ). P(μ − σ < X < μ + σ) ≈ ?', options: [{ id: 'a', text: '50%', isCorrect: false, explanation: '50% is only within ±0 to the median.' }, { id: 'b', text: '68%', isCorrect: true, explanation: 'The empirical rule: approximately 68% of data falls within one standard deviation of the mean.' }, { id: 'c', text: '95%', isCorrect: false, explanation: '95% is within ±2σ.' }, { id: 'd', text: '99.7%', isCorrect: false, explanation: '99.7% is within ±3σ.' }], explanation: '±1σ captures 68% by the 68-95-99.7 empirical rule.', hint: 'This is the ±1 standard deviation range in the empirical rule.' },
    { id: 'norm-mc-13', type: 'multiple-choice', question: 'If z = 1.96 in a standard normal distribution, what is the approximate area to the LEFT of z?', options: [{ id: 'a', text: '0.025', isCorrect: false, explanation: '0.025 is the area to the RIGHT of z=1.96 (the upper tail).' }, { id: 'b', text: '0.975', isCorrect: true, explanation: 'P(Z < 1.96) ≈ 0.975. The left tail area for z=1.96 is 97.5%.' }, { id: 'c', text: '0.95', isCorrect: false, explanation: '0.95 is the two-tailed area between ±1.96, not the one-sided left area.' }, { id: 'd', text: '1.96', isCorrect: false, explanation: '1.96 is the z-score itself, not a probability.' }], explanation: 'P(Z < 1.96) ≈ 0.975. This is why z=1.96 is the critical value for a 95% two-tailed interval.', hint: 'The 95% two-tailed interval uses z=±1.96. What is the area to the left of +1.96?' },
    { id: 'norm-mc-14', type: 'multiple-choice', question: 'Which change to N(μ, σ) makes the distribution narrower?', options: [{ id: 'a', text: 'Increasing μ', isCorrect: false, explanation: 'Changing μ shifts the distribution left or right — it does not change the width.' }, { id: 'b', text: 'Decreasing σ', isCorrect: true, explanation: 'σ controls spread. Smaller σ → narrower, taller curve. Larger σ → wider, flatter curve.' }, { id: 'c', text: 'Increasing σ', isCorrect: false, explanation: 'Increasing σ makes the distribution wider and flatter.' }, { id: 'd', text: 'Decreasing μ', isCorrect: false, explanation: 'Decreasing μ shifts the centre left — it does not change width.' }], explanation: 'Spread is controlled by σ. Decreasing σ compresses the distribution, making it narrower and taller.', hint: 'Which parameter controls the width (spread) of a normal distribution?' },
    { id: 'norm-mc-15', type: 'multiple-choice', question: 'Exam scores follow N(70, 8). What score corresponds to the 84th percentile?', options: [{ id: 'a', text: '62', isCorrect: false, explanation: '62 = 70−8 = μ−σ. This corresponds to the 16th percentile, not 84th.' }, { id: 'b', text: '78', isCorrect: true, explanation: '84th percentile ≈ μ+1σ = 70+8 = 78 (since P(Z<1) ≈ 0.841 ≈ 84%).' }, { id: 'c', text: '86', isCorrect: false, explanation: '86 = μ+2σ = 70+16. That is approximately the 97.5th percentile.' }, { id: 'd', text: '70', isCorrect: false, explanation: '70 is the mean, which is the 50th percentile.' }], explanation: 'P(Z < 1) ≈ 0.841 ≈ 84th percentile. One σ above the mean: 70 + 8 = 78.', hint: 'What z-score corresponds to the 84th percentile? Then convert back using x = μ + zσ.' },
  ],
  keyTakeaway:
    'The normal distribution is symmetric and bell-shaped. Apply the 68-95-99.7 empirical rule for quick probability estimates: 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ. Convert any value to a z-score with z = (x − μ)/σ.',
  visualization: <NormalViz />,
  datasetGenerator: false,
}

export default function NormalDistribution({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
