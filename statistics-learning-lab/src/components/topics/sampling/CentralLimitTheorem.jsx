import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, mean, stdDevSample } from '../../../utils/stats'

// ── Simulation ────────────────────────────────────────────────────────────────

// Produce a skewed population: exponential-ish values scaled to [0,100]
function skewedPop(N = 500) {
  const pop = []
  for (let i = 0; i < N; i++) {
    pop.push(Math.min(100, -Math.log(1 - Math.random()) * 20))
  }
  return pop
}

const POPULATION = skewedPop(1000)
const POP_MEAN = mean(POPULATION)
const POP_SD = stdDevSample(POPULATION)

function CLTViz() {
  const [n, setN] = useState(5)
  const [numSamples, setNumSamples] = useState(200)
  const [sampleMeans, setSampleMeans] = useState([])
  const [drawn, setDrawn] = useState(false)

  function drawSamples() {
    const means = []
    for (let i = 0; i < numSamples; i++) {
      let s = 0
      for (let j = 0; j < n; j++) {
        s += POPULATION[Math.floor(Math.random() * POPULATION.length)]
      }
      means.push(s / n)
    }
    setSampleMeans(means)
    setDrawn(true)
  }

  const stats = useMemo(() => {
    if (!sampleMeans.length) return null
    const m = mean(sampleMeans)
    const s = stdDevSample(sampleMeans)
    const theoreticalSE = round(POP_SD / Math.sqrt(n), 3)
    return { m: round(m, 2), s: round(s, 2), theoreticalSE }
  }, [sampleMeans, n])

  // Histogram
  const histogram = useMemo(() => {
    if (!sampleMeans.length) return []
    const bins = 12
    const min = Math.min(...sampleMeans)
    const max = Math.max(...sampleMeans)
    if (min === max) return []
    const width = (max - min) / bins
    const counts = Array(bins).fill(0)
    sampleMeans.forEach((v) => {
      const b = Math.min(Math.floor((v - min) / width), bins - 1)
      counts[b]++
    })
    return counts.map((c, i) => ({
      label: round(min + (i + 0.5) * width, 1),
      count: c,
    }))
  }, [sampleMeans])

  const maxCount = histogram.length ? Math.max(...histogram.map((b) => b.count)) : 1

  // Skewness of sample means
  const skewLabel = useMemo(() => {
    if (!sampleMeans.length) return ''
    const m = mean(sampleMeans)
    const s = stdDevSample(sampleMeans)
    const sk =
      sampleMeans.reduce((acc, v) => acc + Math.pow((v - m) / s, 3), 0) /
      sampleMeans.length
    if (Math.abs(sk) < 0.3) return 'approximately symmetric ✓'
    if (sk > 0) return `right-skewed (skewness ≈ ${round(sk, 2)})`
    return `left-skewed (skewness ≈ ${round(sk, 2)})`
  }, [sampleMeans])

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800 mb-3">
        The underlying population is <strong>right-skewed</strong> (exponential-like). Watch the sampling
        distribution of x̄ become normal as n grows.
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample size (n): <span className="text-primary font-bold">{n}</span>
          </label>
          <input type="range" min={1} max={60} step={1} value={n}
            onChange={(e) => { setN(Number(e.target.value)); setDrawn(false) }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>1</span><span>60</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Number of samples: <span className="text-primary font-bold">{numSamples}</span>
          </label>
          <input type="range" min={50} max={500} step={50} value={numSamples}
            onChange={(e) => { setNumSamples(Number(e.target.value)); setDrawn(false) }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>50</span><span>500</span></div>
        </div>
      </div>

      <button onClick={drawSamples}
        className="mb-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
        Simulate
      </button>

      {drawn && stats && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="text-blue-600 font-medium">Mean of x̄s</div>
              <div className="text-blue-900 font-bold text-lg">{stats.m}</div>
              <div className="text-blue-600">Population μ ≈ {round(POP_MEAN, 1)}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="text-emerald-600 font-medium">SD of x̄s</div>
              <div className="text-emerald-900 font-bold text-lg">{stats.s}</div>
              <div className="text-emerald-600">Theoretical SE: {stats.theoreticalSE}</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <div className="text-purple-600 font-medium">Shape</div>
              <div className="text-purple-900 font-bold text-sm leading-tight mt-1">{skewLabel}</div>
            </div>
          </div>

          <div className="mb-1">
            <p className="text-xs font-medium text-textMuted mb-1">Distribution of {numSamples} sample means (n = {n})</p>
            <div className="flex items-end gap-0.5 h-24">
              {histogram.map((bin) => (
                <div key={bin.label} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-primary rounded-t opacity-80 transition-all"
                    style={{ height: `${(bin.count / maxCount) * 80}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-textMuted mt-0.5">
              <span>{histogram[0]?.label ?? ''}</span>
              <span>x̄</span>
              <span>{histogram[histogram.length - 1]?.label ?? ''}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Start with n = 1 (raw skewed data), then increase to 5, 10, 30 — observe the bell shape emerging.
          </p>
        </>
      )}
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Central Limit Theorem',
  topicGroup: 'Sampling',
  learningObjective:
    'State the Central Limit Theorem and explain why it justifies using normal-distribution-based methods even when the population is not normally distributed.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>Central Limit Theorem (CLT)</strong> is one of the most important results
        in statistics:
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="font-semibold text-blue-900 mb-1">The Central Limit Theorem</p>
        <p className="text-blue-800 text-sm">
          For a random sample of size n drawn from <em>any</em> population with mean μ and
          finite standard deviation σ, the sampling distribution of the sample mean x̄
          approaches a normal distribution as n increases, regardless of the shape of the
          original population.
        </p>
      </div>
      <p>
        As a rule of thumb, the normal approximation is often adequate around{' '}
        <strong>n ≥ 30</strong> for moderately skewed populations. Highly skewed or
        heavy-tailed populations can require a much larger n.
      </p>
      <p>
        The CLT is why we can use z-scores and t-scores to make inferences about population
        means even when we do not know the shape of the population — as long as n is large enough.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine a jar of coins — mostly pennies, a few quarters. Individual draws are wildly
        unequal (skewed). But if you draw 30 coins, count the total, and repeat this hundreds
        of times, the distribution of those totals will be bell-shaped — even though individual
        coins are not. That is the CLT at work.
      </p>
      <p className="text-sm text-gray-600">
        Real-world measurement errors, biological traits, and economic variables often aggregate
        many independent sources of variation — which is exactly what the CLT describes.
      </p>
    </div>
  ),
  formula: {
    main: 'x̄ ~ N(μ, σ²/n) approximately, for large n',
    variants: [
      { label: 'Sampling distribution of x̄', expression: 'x̄ ~ N(μ, σ²/n)', latex: '\\bar{x} \\sim N\\!\\left(\\mu,\\ \\frac{\\sigma^{2}}{n}\\right)' },
      { label: 'Standard error', expression: 'σ_x̄ = σ / √n', latex: '\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}' },
      { label: 'Standardised form', expression: 'Z = (x̄ − μ) / (σ/√n) ~ N(0,1)', latex: 'Z = \\frac{\\bar{x} - \\mu}{\\sigma/\\sqrt{n}} \\sim N(0,1)' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean' },
      { symbol: 'μ', meaning: 'Population mean' },
      { symbol: 'σ', meaning: 'Population standard deviation' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: '~', meaning: 'Distributed as' },
      { symbol: 'N(μ, σ²/n)', meaning: 'Normal distribution with mean μ and variance σ²/n' },
    ],
  },
  whenToUse: [
    'When justifying the use of z-tests or t-tests on non-normal population data',
    'When n ≥ 30 (a common rule of thumb) and no extreme outliers are present',
    'In quality control, financial modelling, and any field where averages are analysed',
  ],
  whenNotToUse: [
    'Very small samples (n < 10) from heavily skewed or heavy-tailed distributions',
    'When individual observations — not means — need to be normally distributed',
    'For proportions from very rare events (use exact tests instead)',
  ],
  assumptions: [
    'Observations are sampled randomly and independently',
    'The population has finite mean μ and finite variance σ²',
    'n is sufficiently large (≥ 30 as a rule of thumb; more for very skewed populations)',
  ],
  workedExample: {
    scenario:
      'Monthly household electricity bills are right-skewed with μ = $120 and σ = $40. A utility company selects n = 64 households.',
    steps: [
      { stepNumber: 1, label: 'State what the CLT guarantees', expression: 'x̄ ~ N(120, 40²/64)', result: 'x̄ is approximately normal', explanation: 'n = 64 ≥ 30, so the CLT applies even though the population is skewed.' },
      { stepNumber: 2, label: 'Calculate the standard error', expression: 'SE = 40/√64 = 40/8', result: 'SE = 5', explanation: 'Sample means are typically within $5 of $120.' },
      { stepNumber: 3, label: 'Find the probability x̄ > 125', expression: 'z = (125 − 120)/5 = 1.0', result: 'P(z > 1) ≈ 0.159 (≈ 16%)', explanation: 'Using standard normal tables: P(Z > 1) ≈ 15.9%.' },
    ],
    interpretation:
      'Even though individual bills are skewed, the sampling distribution of the average bill across 64 households is approximately normal. There is about a 16% chance the sample mean exceeds $125.',
  },
  interpretation:
    'The CLT is the reason normal-distribution-based inference works so broadly. Any time you work with sample means (or totals) from large enough random samples, you can use the normal distribution as an approximation — regardless of the population shape.',
  commonMistakes: [
    { mistake: 'Applying the CLT to individual values', explanation: 'The CLT applies to sample means (or other statistics), not to individual observations.' },
    { mistake: 'Treating n = 30 as a magic rule', explanation: 'n ≥ 30 is a rule of thumb. Heavily skewed or fat-tailed populations may require larger n for the approximation to be good.' },
    { mistake: 'Forgetting that the population still needs a finite variance', explanation: 'The CLT does not apply to distributions with infinite variance (e.g., Cauchy distribution).' },
  ],
  practiceProblems: {
    easy: [
      { id: 'clt-easy-1', scenario: 'A population has μ = 50 and σ = 10. Samples of n = 100 are drawn.', question: 'What distribution does x̄ follow? What are its mean and SE?', hint: 'Apply the CLT.', solution: 'x̄ ~ N(50, 1²). Mean = 50, SE = 10/√100 = 1.' },
    ],
    moderate: [
      { id: 'clt-mod-1', scenario: 'A right-skewed income distribution has μ = $45,000, σ = $12,000. Random sample n = 36.', question: 'Find P(x̄ > $47,000). Round z to 2 decimal places.', hint: 'z = (47000 - 45000) / (12000/√36).', solution: 'SE = 12000/6 = 2000. z = 2000/2000 = 1.0. P(z > 1) ≈ 0.159 — about 16%.' },
    ],
    challenging: [
      { id: 'clt-chal-1', scenario: 'Delivery times are exponentially distributed with μ = 5 days, σ = 5 days.', question: 'What is the probability that the mean delivery time across 100 packages exceeds 5.5 days?', hint: 'SE = σ/√n, then z = (5.5 - 5)/SE.', solution: 'SE = 5/√100 = 0.5. z = 0.5/0.5 = 1.0. P(z > 1) ≈ 0.159 — about 16%.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'clt-kc-1', type: 'multiple-choice',
      question: 'What does the Central Limit Theorem state?',
      options: [
        { id: 'a', text: 'Individual data values always follow a normal distribution', isCorrect: false, explanation: 'The CLT concerns sample means (statistics), not individual values.' },
        { id: 'b', text: 'The sampling distribution of x̄ approaches normal for large n, regardless of population shape', isCorrect: true, explanation: 'Correct! This is the essence of the CLT.' },
        { id: 'c', text: 'All populations are normally distributed', isCorrect: false, explanation: 'Populations can be any shape — the CLT is about sample means, not populations.' },
        { id: 'd', text: 'Larger samples are always unbiased', isCorrect: false, explanation: 'Unbiasedness is a property of estimators, not what the CLT states.' },
      ],
      explanation: 'The CLT: sampling distribution of x̄ → N(μ, σ²/n) as n → ∞.',
      hint: 'The CLT is about what happens to the sample mean, not individual values.',
    },
    {
      id: 'clt-kc-2', type: 'multiple-choice',
      question: 'Why is the Central Limit Theorem so important in practice?',
      options: [
        { id: 'a', text: 'It guarantees all data is symmetric', isCorrect: false, explanation: 'The CLT does not change the shape of the raw data distribution.' },
        { id: 'b', text: 'It lets us use normal-distribution methods on sample means even when data is non-normal', isCorrect: true, explanation: 'Correct! This is its practical importance — it justifies z-tests and confidence intervals broadly.' },
        { id: 'c', text: 'It proves that larger samples always give correct answers', isCorrect: false, explanation: 'The CLT describes the shape of the sampling distribution, not whether answers are "correct".' },
        { id: 'd', text: 'It removes the need for random sampling', isCorrect: false, explanation: 'Random sampling is a prerequisite of the CLT, not something it replaces.' },
      ],
      explanation: 'The CLT is the mathematical justification for using z-scores and the normal distribution in hypothesis tests and confidence intervals.',
      hint: 'What problem does it solve for non-normal populations?',
    },
    {
      id: 'clt-kc-3', type: 'multiple-choice',
      question: 'A population is heavily right-skewed. You take samples of n = 5. What is the shape of the sampling distribution of x̄?',
      options: [
        { id: 'a', text: 'Perfectly normal', isCorrect: false, explanation: 'n = 5 is too small for the CLT to fully apply to a heavily skewed population.' },
        { id: 'b', text: 'Approximately normal', isCorrect: false, explanation: 'With n = 5 and heavy skew, the approximation is not reliable yet.' },
        { id: 'c', text: 'Still somewhat skewed', isCorrect: true, explanation: 'Correct! With very small samples from heavily skewed populations, the CLT has not fully kicked in.' },
        { id: 'd', text: 'Uniform', isCorrect: false, explanation: 'The CLT produces normal shapes, not uniform ones.' },
      ],
      explanation: 'The CLT works for large n (≥ 30 as a rule of thumb, more for heavily skewed data). Small samples from skewed populations still produce skewed sampling distributions.',
      hint: 'n = 5 is small. Does the CLT kick in immediately?',
    },
    {
      id: 'clt-kc-4', type: 'multiple-choice',
      question: 'Population μ = 100, σ = 20, n = 400. What is the approximate distribution of x̄?',
      options: [
        { id: 'a', text: 'N(100, 20)', isCorrect: false, explanation: '20 is the population standard deviation σ, not the spread of x̄. The sampling distribution of x̄ has SD σ/√n = 1.' },
        { id: 'b', text: 'N(100, 1)', isCorrect: true, explanation: 'Correct! SE = 20/√400 = 1, so Var(x̄) = 1² = 1. x̄ ~ N(100, 1).' },
        { id: 'c', text: 'N(0, 1)', isCorrect: false, explanation: 'N(0,1) is the standard normal. x̄ is centred at μ = 100.' },
        { id: 'd', text: 'N(100, 400)', isCorrect: false, explanation: 'A variance of 400 = σ² describes the population, not x̄. The variance of x̄ is σ²/n = 400/400 = 1.' },
      ],
      explanation: 'SE = σ/√n = 20/20 = 1. By CLT: x̄ ~ N(μ, SE²) = N(100, 1).',
      hint: 'Calculate SE = σ/√n, then state N(μ, SE²).',
    },
    {
      id: 'clt-kc-5', type: 'multiple-choice',
      question: 'The CLT allows us to use z-tests on sample means because:',
      options: [
        { id: 'a', text: 'The original data becomes normally distributed', isCorrect: false, explanation: 'The CLT does not transform the original data — individual observations stay the same shape.' },
        { id: 'b', text: 'The sampling distribution of x̄ is approximately normal for large n', isCorrect: true, explanation: 'Correct! We standardise x̄ using z = (x̄−μ)/(σ/√n) because x̄ ~ N(μ, σ²/n).' },
        { id: 'c', text: 'The sample is always representative', isCorrect: false, explanation: 'Representativeness depends on sampling method, not the CLT.' },
        { id: 'd', text: 'All test statistics follow the normal distribution', isCorrect: false, explanation: 'Not all test statistics are normal — the CLT applies specifically to sample means.' },
      ],
      explanation: 'CLT → x̄ is approximately normal → z = (x̄−μ)/(σ/√n) follows N(0,1) → z-tests and CIs are valid.',
      hint: 'The CLT is the justification for treating x̄ as normally distributed.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'clt-tf-1', type: 'true-false', question: 'The Central Limit Theorem states that the sampling distribution of x̄ approaches normal as n increases, regardless of population shape.', isTrue: true, explanation: 'This is the core statement of the CLT — for large enough n, x̄ ~ N(μ, σ²/n) regardless of the population distribution.' },
    { id: 'clt-tf-2', type: 'true-false', question: 'The CLT applies only when the population itself is normally distributed.', isTrue: false, explanation: 'The CLT applies to ANY population with finite mean and variance — the power of the theorem is that it does NOT require a normal population.' },
    { id: 'clt-tf-3', type: 'true-false', question: 'The CLT justifies using z-tests and t-tests even when the population is not normal, if n is large enough.', isTrue: true, explanation: 'For large n, x̄ is approximately normal by the CLT — z and t statistics are then valid regardless of population shape.' },
    { id: 'clt-tf-4', type: 'true-false', question: 'A common rule of thumb is that the CLT applies when n ≥ 30.', isTrue: true, explanation: 'n ≥ 30 is the widely used guideline for the CLT approximation to be reliable for moderately skewed populations.' },
    { id: 'clt-tf-5', type: 'true-false', question: 'The CLT says that individual data values become normally distributed as n increases.', isTrue: false, explanation: 'The CLT applies to SAMPLE MEANS (x̄), not individual values. Individual data retain the population distribution regardless of n.' },
    { id: 'clt-tf-6', type: 'true-false', question: 'The CLT describes the sampling distribution of x̄ as a normal distribution centred at the population mean μ.', isTrue: true, explanation: 'The normal approximation has mean μ. (E(x̄) = μ holds for any sample size, since the sample mean is an unbiased estimator of μ.)' },
    { id: 'clt-tf-7', type: 'true-false', question: 'For a very skewed population, you need a smaller n for the CLT to kick in compared to a symmetric population.', isTrue: false, explanation: 'More skewness requires a LARGER n. The CLT converges more slowly for heavily skewed distributions.' },
    { id: 'clt-tf-8', type: 'true-false', question: 'The standard deviation of the sampling distribution of x̄ decreases as n increases, according to the CLT.', isTrue: true, explanation: 'CLT: x̄ ~ N(μ, σ²/n). The standard deviation of x̄ = σ/√n, which decreases as n increases.' },
    { id: 'clt-tf-9', type: 'true-false', question: 'If the population is uniform (flat), the sampling distribution of x̄ will still be approximately normal for large n.', isTrue: true, explanation: 'The uniform distribution is non-normal but has finite mean and variance — the CLT applies and x̄ approaches normality.' },
    { id: 'clt-tf-10', type: 'true-false', question: 'The CLT makes it possible to compute probabilities about x̄ without knowing the exact population distribution.', isTrue: true, explanation: 'By knowing only μ, σ, and n, and using the CLT (x̄ ~ N(μ, σ²/n)), you can compute z-based probabilities for x̄.' },
    { id: 'clt-tf-11', type: 'true-false', question: 'The CLT applies to both the sample mean and the sample proportion.', isTrue: true, explanation: 'The CLT applies to proportions too: p̂ ~ N(p, p(1−p)/n) for large n when np ≥ 10 and n(1−p) ≥ 10.' },
    { id: 'clt-tf-12', type: 'true-false', question: 'When n = 1, the sampling distribution of x̄ equals the population distribution.', isTrue: true, explanation: 'With n=1, x̄ = x (the single observation), so the sampling distribution is identical to the population distribution.' },
    { id: 'clt-tf-13', type: 'true-false', question: 'The CLT requires that individual observations in the sample are independent.', isTrue: true, explanation: 'Independence of observations is a key condition for the CLT. Without it, the variance formula σ²/n does not apply.' },
    { id: 'clt-tf-14', type: 'true-false', question: 'A bimodal population with n = 50 would have a sampling distribution of x̄ that is approximately normal.', isTrue: true, explanation: 'Despite the bimodal population shape, n=50 is typically large enough for the CLT to produce an approximately normal sampling distribution for x̄.' },
    { id: 'clt-tf-15', type: 'true-false', question: 'For a non-normal population, the CLT is only an approximation — it becomes exact only when n → ∞.', isTrue: true, explanation: 'The CLT is an asymptotic result. For non-normal populations the sampling distribution of x̄ becomes exactly normal only in the limit as n approaches infinity (if the population is itself normal, x̄ is exactly normal for every n).' },
    { id: 'clt-tf-16', type: 'true-false', question: 'According to the CLT, for large n the shape of the population distribution does not determine the shape of the sampling distribution of x̄ (it is approximately normal).', isTrue: true, explanation: 'For large n, x̄ is approximately normal regardless of population shape. This is the practical power of the CLT. (How large n must be does depend on the shape.)' },
    { id: 'clt-tf-17', type: 'true-false', question: 'The CLT requires that the population have a finite variance.', isTrue: true, explanation: 'The standard CLT requires finite σ². Some distributions (e.g., Cauchy) have infinite variance and the standard CLT does not apply to them.' },
    { id: 'clt-tf-18', type: 'true-false', question: 'If two researchers both use large random samples of the same size from the same population, their sample means will both follow approximately the same normal distribution.', isTrue: true, explanation: 'Both x̄₁ and x̄₂ ~ N(μ, σ²/n) by CLT — they follow the same theoretical sampling distribution (same population, same n).' },
    { id: 'clt-tf-19', type: 'true-false', question: 'Even a very small sample (n = 3) from a normal population produces a normally distributed x̄.', isTrue: true, explanation: 'When the population IS normal, x̄ is exactly normal for ANY n — no approximation needed. The CLT is needed for the non-normal case.' },
    { id: 'clt-tf-20', type: 'true-false', question: 'Without the CLT, we could not justify normal-based confidence intervals and tests for means from non-normal populations.', isTrue: true, explanation: 'The CLT is the theoretical justification for applying normal-based confidence intervals and hypothesis tests for means to data from non-normal distributions (other methods, such as bootstrapping, exist but rely on different justifications).' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'clt-mc-6', type: 'multiple-choice', question: 'A population has μ = 40, σ = 10. With n = 100, x̄ is approximately distributed as:', options: [{ id: 'a', text: 'N(40, 100)', isCorrect: false, explanation: 'Var(x̄) = σ²/n = 100/100 = 1, not 100.' }, { id: 'b', text: 'N(40, 1)', isCorrect: true, explanation: 'By CLT: x̄ ~ N(μ, σ²/n) = N(40, 100/100) = N(40, 1). SD of x̄ = 1.' }, { id: 'c', text: 'N(4, 1)', isCorrect: false, explanation: '4 = μ/√n — the mean is μ = 40, not divided by √n.' }, { id: 'd', text: 'N(40, 10)', isCorrect: false, explanation: 'σ = 10 is the population SD (variance 100), not the spread of x̄. The sampling distribution has variance 1 (SD 1).' }], explanation: 'CLT: x̄ ~ N(40, σ²/n) = N(40, 1). SE = σ/√n = 10/10 = 1.', hint: 'Var(x̄) = σ²/n, so SD(x̄) = σ/√n.' },
    { id: 'clt-mc-7', type: 'multiple-choice', question: 'Which population shape would require the LARGEST n for the CLT to be applicable?', options: [{ id: 'a', text: 'Uniform (flat) distribution', isCorrect: false, explanation: 'Uniform distributions are symmetric — the CLT converges relatively quickly.' }, { id: 'b', text: 'Exponential distribution (heavily right-skewed)', isCorrect: true, explanation: 'Heavy skewness and long tails slow CLT convergence. Exponential distributions typically need n > 30-50 for good normal approximation.' }, { id: 'c', text: 'Normal distribution', isCorrect: false, explanation: 'Normal populations produce normal x̄ for any n — CLT is satisfied immediately.' }, { id: 'd', text: 'Symmetric bimodal distribution', isCorrect: false, explanation: 'Symmetry helps the CLT converge faster despite the bimodal shape.' }], explanation: 'Heavy skewness (as in exponential distributions) requires the most averaging before x̄ approaches normality.', hint: 'Which distribution has the longest tail and most asymmetry?' },
    { id: 'clt-mc-8', type: 'multiple-choice', question: 'The CLT is important for statistics primarily because it:', options: [{ id: 'a', text: 'Makes all populations normal', isCorrect: false, explanation: 'The CLT does not change populations — it describes what happens to sample means.' }, { id: 'b', text: 'Allows us to use normal-distribution methods for sample means from any population', isCorrect: true, explanation: 'The CLT justifies applying z-tests, t-tests, and normal-based CIs to real-world data, regardless of population shape.' }, { id: 'c', text: 'Eliminates sampling error', isCorrect: false, explanation: 'The CLT describes the distribution of sampling error — it does not eliminate it.' }, { id: 'd', text: 'Ensures samples are representative', isCorrect: false, explanation: 'Representativeness comes from random sampling methods, not the CLT.' }], explanation: 'The CLT bridges arbitrary populations and normal-distribution inference — the foundation of most parametric statistics.', hint: 'Why does knowing x̄ is approximately normal make statistics useful?' },
    { id: 'clt-mc-9', type: 'multiple-choice', question: 'σ = 15, μ = 200, n = 225. P(x̄ > 201) ≈ ?', options: [{ id: 'a', text: '0.5', isCorrect: false, explanation: '0.5 would be P(x̄ > μ). x̄ = 201 > 200, so the probability is less than 0.5.' }, { id: 'b', text: '≈ 0.16', isCorrect: true, explanation: 'SE = 15/√225 = 1. z = (201−200)/1 = 1. P(Z > 1) ≈ 0.159 ≈ 16%.' }, { id: 'c', text: '0.84', isCorrect: false, explanation: '0.84 ≈ P(Z < 1) = P(x̄ < 201). We want P(x̄ > 201), which is 1 − 0.84 = 0.16.' }, { id: 'd', text: '0.02', isCorrect: false, explanation: '0.02 ≈ P(Z > 2), which would need x̄ = 202, not 201.' }], explanation: 'SE = 15/15 = 1. z = (201−200)/1 = 1. P(Z > 1) ≈ 0.159.', hint: 'Compute SE = σ/√n, then z = (x̄−μ)/SE, then use the normal table.' },
    { id: 'clt-mc-10', type: 'multiple-choice', question: 'As n increases toward infinity, the sampling distribution of x̄:', options: [{ id: 'a', text: 'Becomes identical to the population distribution', isCorrect: false, explanation: 'As n→∞, SE→0, so the sampling distribution collapses to a point at μ — not the population shape.' }, { id: 'b', text: 'Collapses to a spike at μ (zero variance)', isCorrect: true, explanation: 'SE = σ/√n → 0 as n → ∞. The sampling distribution degenerates to a point mass at μ.' }, { id: 'c', text: 'Becomes the standard normal N(0,1)', isCorrect: false, explanation: 'It becomes a point mass at μ, not N(0,1). N(0,1) describes the z-standardised version, not x̄ itself.' }, { id: 'd', text: 'Remains unchanged', isCorrect: false, explanation: 'SE = σ/√n decreases with n — the distribution narrows.' }], explanation: 'As n→∞, SE=σ/√n→0. The sampling distribution collapses to a degenerate distribution at μ — the sample mean becomes the population mean with certainty.', hint: 'What happens to SE = σ/√n as n becomes infinitely large?' },
    { id: 'clt-mc-11', type: 'multiple-choice', question: 'A population is uniform on [0, 10] (μ=5, σ≈2.89). With n=36, SE ≈ ?', options: [{ id: 'a', text: '2.89', isCorrect: false, explanation: '2.89 is σ — the population standard deviation.' }, { id: 'b', text: '0.48', isCorrect: true, explanation: 'SE = σ/√n = 2.89/√36 = 2.89/6 ≈ 0.48.' }, { id: 'c', text: '5', isCorrect: false, explanation: '5 is μ — the mean.' }, { id: 'd', text: '1.44', isCorrect: false, explanation: '1.44 ≈ σ/√4 — divided by wrong √n.' }], explanation: 'SE = 2.89/6 ≈ 0.48. n=36 is ≥ 30 so CLT applies well even for this uniform population.', hint: 'SE = σ/√n. √36 = 6.' },
    { id: 'clt-mc-12', type: 'multiple-choice', question: 'The CLT says x̄ ~ N(μ, σ²/n). What is the implication for hypothesis testing?', options: [{ id: 'a', text: 'You do not need a sample — just the population parameters', isCorrect: false, explanation: 'You still need sample data; the CLT tells you the distribution of x̄ from those data.' }, { id: 'b', text: 'You can compute z = (x̄−μ₀)/(σ/√n) and use normal tables to find p-values', isCorrect: true, explanation: 'Because x̄ is approximately normal, z = (x̄−μ₀)/SE follows N(0,1) — enabling z-test p-value calculations.' }, { id: 'c', text: 'You must use non-parametric tests', isCorrect: false, explanation: 'The CLT is the main justification for using parametric (normal-based) tests, not non-parametric ones.' }, { id: 'd', text: 'Hypothesis testing is invalid for non-normal populations', isCorrect: false, explanation: 'The CLT makes hypothesis testing valid for ANY population (with finite σ²) when n is large.' }], explanation: 'CLT → x̄ ~ N(μ, σ²/n) → z = (x̄−μ₀)/SE ~ N(0,1) → use standard normal tables for p-values.', hint: 'If x̄ is approximately normal, what test statistic naturally follows?' },
    { id: 'clt-mc-13', type: 'multiple-choice', question: 'For a Bernoulli (0/1) population with p = 0.5, how large must n be for the CLT to apply?', options: [{ id: 'a', text: 'n ≥ 2', isCorrect: false, explanation: 'n=2 is far too small for x̄ to be approximately normal.' }, { id: 'b', text: 'n ≥ 30', isCorrect: true, explanation: 'The standard CLT guideline (n ≥ 30) applies. For p=0.5 (symmetric), convergence is faster and a smaller n (about 20, from np ≥ 10 and n(1−p) ≥ 10) may suffice.' }, { id: 'c', text: 'CLT does not apply to binary data', isCorrect: false, explanation: 'The CLT applies to binary data — the sample proportion is a mean of 0/1 values.' }, { id: 'd', text: 'n ≥ 1000', isCorrect: false, explanation: 'n=1000 is overly conservative for p=0.5. n ≥ 30 is the standard threshold.' }], explanation: 'Binary data (Bernoulli) satisfies CLT conditions for n ≥ 30. For p=0.5 (symmetric), convergence is even faster.', hint: 'The general rule is n ≥ 30, though it can be less for symmetric distributions.' },
    { id: 'clt-mc-14', type: 'multiple-choice', question: 'A factory produces bolts with μ = 10mm, σ = 0.5mm. n = 25 bolts are sampled. P(x̄ < 9.9) ≈ ?', options: [{ id: 'a', text: '0.5', isCorrect: false, explanation: '0.5 = P(x̄ < μ). Here x̄ = 9.9 < μ = 10, so probability is less than 0.5 — but we need the exact z.' }, { id: 'b', text: '≈ 0.16', isCorrect: true, explanation: 'SE = 0.5/5 = 0.1. z = (9.9−10)/0.1 = −1. P(Z < −1) ≈ 0.159 ≈ 16%.' }, { id: 'c', text: '≈ 0.84', isCorrect: false, explanation: '0.84 = P(Z < +1) = P(x̄ < 10.1). We want x̄ < 9.9 (z = −1).' }, { id: 'd', text: '≈ 0.02', isCorrect: false, explanation: '0.02 ≈ P(Z < −2). Here z = −1, not −2.' }], explanation: 'SE = 0.5/√25 = 0.1. z = (9.9−10)/0.1 = −1. P(Z < −1) ≈ 0.159.', hint: 'Compute SE = σ/√n, then standardise to get z.' },
    { id: 'clt-mc-15', type: 'multiple-choice', question: 'Which of the following is NOT needed to apply the Central Limit Theorem?', options: [{ id: 'a', text: 'A sufficiently large sample size (n ≥ 30 as a guideline)', isCorrect: false, explanation: 'Sufficient n is a key condition for CLT.' }, { id: 'b', text: 'The population must be normally distributed', isCorrect: true, explanation: 'The CLT does NOT require a normal population — this is precisely its power. Any population with finite mean and variance qualifies.' }, { id: 'c', text: 'The population must have a finite mean', isCorrect: false, explanation: 'Finite mean is required for CLT. Distributions with undefined means (like Cauchy) are exceptions.' }, { id: 'd', text: 'The population must have a finite variance', isCorrect: false, explanation: 'Finite variance is required. Without it, the CLT in its standard form does not hold.' }], explanation: 'The CLT requires only: large enough n, finite μ and σ², and independent observations. Population normality is NOT required — that is the whole point.', hint: 'The CLT\'s power is that it works for non-normal populations. What condition is therefore NOT needed?' },
  ],
  keyTakeaway:
    'The CLT states that sampling distributions of means are approximately normal for large n (usually ≥ 30), regardless of the population shape. This justifies z-tests, t-tests, and confidence intervals across diverse real-world data.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Averaging Magic" trick:</strong></p>
      <p>No matter how weird the population shape (skewed, lumpy, bimodal), <em>averaging</em> many values smooths things out. Think of mixing hundreds of different-flavoured jellybeans — when you average many handfuls, the average flavour approaches the middle, forming a bell shape.</p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs space-y-1">
        <div className="font-mono">Population: any shape 🌀</div>
        <div className="font-mono">Sample means (large n): bell curve 🔔</div>
        <div className="font-mono">Rule of thumb: n ≥ 30</div>
      </div>
      <p className="text-xs text-textMuted">The CLT does NOT change individual data values — only the distribution of their averages.</p>
    </div>
  ),
  visualization: <CLTViz />,
  datasetGenerator: false,
}

export default function CentralLimitTheorem({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
