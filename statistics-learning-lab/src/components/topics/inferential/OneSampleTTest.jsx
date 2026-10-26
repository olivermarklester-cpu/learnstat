import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, tTestStatistic, tToPValue, standardError } from '../../../utils/stats'

// ── Interactive one-sample t-test calculator ──────────────────────────────────

function OneSampleTViz() {
  const [xbar, setXbar] = useState(22)
  const [mu0, setMu0] = useState(20)
  const [s, setS] = useState(6)
  const [n, setN] = useState(25)
  const [tails, setTails] = useState(2)
  const [alpha, setAlpha] = useState(0.05)

  const df = n - 1
  const se = round(standardError(s, n), 4)
  const t = round(tTestStatistic(xbar, mu0, s, n), 4)
  const p = round(tToPValue(t, df, tails), 4)
  const reject = p <= alpha

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Sample mean (x̄)', min: 10, max: 40, step: 0.5, value: xbar, set: setXbar },
          { label: 'Hypothesised mean (μ₀)', min: 10, max: 40, step: 0.5, value: mu0, set: setMu0 },
          { label: 'Sample SD (s)', min: 1, max: 20, step: 0.5, value: s, set: setS },
          { label: 'Sample size (n)', min: 3, max: 100, step: 1, value: n, set: setN },
        ].map(({ label, min, max, step, value, set }) => (
          <div key={label}>
            <label className="block text-xs font-medium text-textDark mb-1">
              {label}: <span className="text-primary font-bold">{value}</span>
            </label>
            <input type="range" min={min} max={max} step={step} value={value}
              onChange={(e) => set(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">Tails</label>
          <select value={tails} onChange={(e) => setTails(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white">
            <option value={2}>Two-tailed</option>
            <option value={1}>One-tailed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">α</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white">
            <option value={0.10}>0.10</option>
            <option value={0.05}>0.05</option>
            <option value={0.01}>0.01</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-blue-600 font-medium">SE = s/√n</div>
          <div className="text-blue-900 font-bold text-lg">{se}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">t (df={df})</div>
          <div className="text-purple-900 font-bold text-lg">{t}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="text-amber-600 font-medium">p-value</div>
          <div className="text-amber-900 font-bold text-lg">{p}</div>
        </div>
      </div>

      <div className={`rounded-lg p-3 border text-center text-sm font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {reject ? `Reject H₀ — p (${p}) ≤ α (${alpha})` : `Fail to reject H₀ — p (${p}) > α (${alpha})`}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'One-sample T-test',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Perform a one-sample t-test when the population SD is unknown, and interpret the result.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>one-sample t-test</strong> tests whether a population mean equals a specific
        value when the <strong>population standard deviation σ is unknown</strong>. It uses the
        sample standard deviation s as an estimate, which introduces additional uncertainty —
        accounted for by the t-distribution (wider tails than the normal).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">t-distribution vs. normal distribution</p>
        <ul className="space-y-1 text-blue-800">
          <li>The t-distribution has heavier tails than the normal — reflecting greater uncertainty from estimating σ.</li>
          <li>As df = n−1 increases, the t-distribution approaches the normal.</li>
          <li>For df ≥ 30, the difference is minimal.</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A bakery makes loaves that should weigh 400 g. The baker does not know the population
        variability — it is estimated from a sample of 10 loaves. Because σ is unknown and n
        is small, the t-test accounts for extra uncertainty from that estimation.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'one-sample-t-test',
    title: 'How the One-Sample T-Test is built',
    steps: [
      {
        label: 'Recognise Standard Error in the denominator',
        symbolName: 'SE',
        highlightColor: 'orange',
        from: 't = (x̄ − μ₀) / SE',
        to: 't = (x̄ − μ₀) / (s / √n)',
        note: 'SE = s/√n is the estimated standard error. We use s (sample SD) because the population σ is unknown — that is what makes this a t-test instead of a z-test.',
      },
    ],
    finalFormula: 't = (x̄ − μ₀) / (s / √n)',
  },
  formula: {
    main: 't = (x̄ − μ₀) / (s/√n)',
    variants: [
      { label: 't-test statistic', expression: 't = (x̄ − μ₀) / (s/√n)', latex: 't = \\frac{\\bar{x} - \\mu_0}{s / \\sqrt{n}}' },
      { label: 'Degrees of freedom', expression: 'df = n − 1', latex: 'df = n - 1' },
      { label: 'CI for μ (unknown σ)', expression: 'CI = x̄ ± t* × (s/√n)', latex: 'CI = \\bar{x} \\pm t^{*} \\cdot \\frac{s}{\\sqrt{n}}' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean' },
      { symbol: 'μ₀', meaning: 'Hypothesised population mean' },
      { symbol: 's', meaning: 'Sample standard deviation (estimate of σ)' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: 'df', meaning: 'Degrees of freedom = n − 1' },
      { symbol: 't*', meaning: 'Critical t-value from t-table with df degrees of freedom' },
    ],
  },
  whenToUse: [
    'Testing a hypothesis about μ when σ is unknown (the most common real-world scenario)',
    'Any sample size, but especially important for small samples (n < 30)',
  ],
  whenNotToUse: [
    'When data is highly non-normal and n is very small — consider non-parametric alternatives (e.g., Wilcoxon signed-rank)',
    'For comparing two groups — use independent or paired t-tests instead',
  ],
  assumptions: [
    'Random, independent sample',
    'The population is approximately normally distributed (or n is large enough by CLT)',
    'σ is unknown — use sample SD s',
  ],
  workedExample: {
    scenario:
      'A nutritionist believes daily sodium intake is higher than the recommended 2,300 mg. A random sample of n = 16 people gives x̄ = 2,500 mg, s = 400 mg. Test H₀: μ = 2,300 vs H₁: μ > 2,300 at α = 0.05.',
    steps: [
      { stepNumber: 1, label: 'SE', expression: 'SE = 400/√16 = 100 mg', result: 'SE = 100', explanation: 'Estimated standard error.' },
      { stepNumber: 2, label: 't statistic', expression: 't = (2500 − 2300)/100 = 200/100', result: 't = 2.0, df = 15', explanation: '2 standard errors above the hypothesised mean.' },
      { stepNumber: 3, label: 'Critical value', expression: 't*(0.05, 15, one-tailed) ≈ 1.753', result: 't* = 1.753', explanation: 'From t-table with df = 15, right tail.' },
      { stepNumber: 4, label: 'Decision', expression: 't = 2.0 > 1.753 → reject H₀', result: 'Significant at α = 0.05', explanation: 'p ≈ 0.032 < 0.05.' },
    ],
    interpretation:
      'Significant evidence (t = 2.0, df = 15, p ≈ 0.032) that mean daily sodium intake exceeds 2,300 mg.',
  },
  interpretation:
    'The t-test statistic measures how many standard errors x̄ is from μ₀, accounting for the fact that s is an estimate of σ. The p-value is compared to α for the decision.',
  commonMistakes: [
    { mistake: 'Using z* instead of t*', explanation: 'When σ is unknown and n is small, t* is more conservative than z*. Using z* underestimates the critical value.' },
    { mistake: 'Forgetting df = n−1', explanation: 'The degrees of freedom determine the correct t* value — always use n−1.' },
    { mistake: 'Not checking the normality assumption', explanation: 'For very small samples (n < 10) from skewed populations, the t-test may be unreliable. Check histograms or use non-parametric tests.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'ost-easy-1', scenario: 'x̄ = 85, μ₀ = 80, s = 10, n = 25.', question: 'Calculate t and df.', hint: 't = (x̄−μ₀)/(s/√n), df = n−1.', solution: 'SE = 2. t = 5/2 = 2.5. df = 24.' },
    ],
    moderate: [
      { id: 'ost-mod-1', scenario: 'H₀: μ = 10, H₁: μ ≠ 10. x̄ = 11.5, s = 3, n = 9. α = 0.05.', question: 'Perform the t-test. t*(df=8, two-tailed, α=0.05) ≈ 2.306.', hint: 't = (11.5−10)/(3/3) = 1.5.', solution: 'SE = 1. t = 1.5. |t| = 1.5 < 2.306 → fail to reject H₀.' },
    ],
    challenging: [
      { id: 'ost-chal-1', scenario: 'A company claims average delivery is ≤ 5 days. Sample: n = 20, x̄ = 5.8 days, s = 1.5 days. α = 0.01.', question: 'Test H₀: μ ≤ 5 vs H₁: μ > 5. t*(df=19, right-tailed, α=0.01) ≈ 2.539.', hint: 't = (5.8−5)/(1.5/√20).', solution: 'SE = 1.5/4.472 ≈ 0.335. t = 0.8/0.335 ≈ 2.39. t = 2.39 < 2.539 → fail to reject H₀ at α=0.01. (Would reject at α=0.05 where t*≈1.729.)' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ost-kc-1', type: 'multiple-choice',
      question: 'When should you use a t-test instead of a z-test?',
      options: [
        { id: 'a', text: 'When σ is known', isCorrect: false, explanation: 'Known σ → z-test.' },
        { id: 'b', text: 'When σ is unknown and n is small', isCorrect: true, explanation: 'Correct! Unknown σ with small n → use t-test with df = n−1.' },
        { id: 'c', text: 'When n > 200', isCorrect: false, explanation: 'For large n, t and z are nearly identical — z is acceptable but t remains valid.' },
        { id: 'd', text: 'When data is categorical', isCorrect: false, explanation: 'Categorical data → chi-square or proportion tests, not t-test.' },
      ],
      explanation: 't-test: σ unknown. z-test: σ known.',
      hint: 'The key question is: do you know the population standard deviation?',
    },
    {
      id: 'ost-kc-2', type: 'numerical',
      question: 'x̄ = 45, μ₀ = 40, s = 10, n = 25. What is t?',
      answer: 2.5,
      tolerance: 0.05,
      explanation: 'SE = 10/√25 = 2. t = (45−40)/2 = 2.5.',
      hint: 't = (x̄ − μ₀) / (s/√n).',
    },
    {
      id: 'ost-kc-3', type: 'multiple-choice',
      question: 'A one-sample t-test gives t = 2.0, df = 19, two-tailed, α = 0.05. t*(df=19, α=0.05) ≈ 2.093. What is the decision?',
      options: [
        { id: 'a', text: 'Reject H₀ — t exceeds 2', isCorrect: false, explanation: 't = 2.0 must be compared to t* = 2.093, not just "2". t = 2.0 < 2.093.' },
        { id: 'b', text: 'Fail to reject H₀ — t does not exceed t*', isCorrect: true, explanation: 'Correct! |t| = 2.0 < t* = 2.093 → fail to reject H₀ at α = 0.05.' },
        { id: 'c', text: 'Reject H₀ — the p-value must be 0.05', isCorrect: false, explanation: 'p ≈ 0.06 (slightly above α). We fail to reject.' },
        { id: 'd', text: 'Cannot decide without the p-value', isCorrect: false, explanation: 'The critical value approach gives the same decision as the p-value approach.' },
      ],
      explanation: '|t| = 2.0 < t*(19, 0.05, two-tailed) = 2.093 → fail to reject H₀. p ≈ 0.06.',
      hint: 'Compare |t| to t*. Which is larger?',
    },
    {
      id: 'ost-kc-4', type: 'multiple-choice',
      question: 'Why does the t-distribution have heavier tails than the normal distribution?',
      options: [
        { id: 'a', text: 'Because sample means are always skewed', isCorrect: false, explanation: 'Sample means are approximately normal by the CLT — skewness is not the reason.' },
        { id: 'b', text: 'Because using s instead of σ introduces additional uncertainty', isCorrect: true, explanation: 'Correct! Estimating σ from the sample adds extra variability, leading to heavier tails.' },
        { id: 'c', text: 'Because the t-distribution applies only to large samples', isCorrect: false, explanation: 'The t-distribution is specifically designed for small samples.' },
        { id: 'd', text: 'Because df is always less than n', isCorrect: false, explanation: 'While df = n−1, the reason for heavier tails is the uncertainty from estimating σ.' },
      ],
      explanation: 'When you estimate σ with s, you introduce extra randomness. The t-distribution accounts for this with heavier tails (wider, more conservative critical values).',
      hint: 'What extra source of uncertainty does a t-test have that a z-test does not?',
    },
    {
      id: 'ost-kc-5', type: 'numerical',
      question: 'x̄ = 20, μ₀ = 18, s = 4, n = 16. What are the degrees of freedom?',
      answer: 15,
      tolerance: 0,
      explanation: 'df = n − 1 = 16 − 1 = 15.',
      hint: 'df = n − 1 for a one-sample t-test.',
    },
    { id: 'ost-tf-1', type: 'true-false', question: 'The one-sample t-test is used when the population standard deviation σ is unknown.', isTrue: true, explanation: 'Correct. When σ is unknown, we estimate it with s and use the t-distribution rather than the normal distribution.' },
    { id: 'ost-tf-2', type: 'true-false', question: 'Degrees of freedom for a one-sample t-test equals n.', isTrue: false, explanation: 'False. df = n − 1. We lose one degree of freedom because we estimate μ with x̄ to compute s.' },
    { id: 'ost-tf-3', type: 'true-false', question: 'The t-distribution has heavier tails than the standard normal distribution.', isTrue: true, explanation: 'True. The t-distribution accounts for additional uncertainty from estimating σ. Heavier tails mean wider critical values.' },
    { id: 'ost-tf-4', type: 'true-false', question: 'As degrees of freedom increase, the t-distribution becomes more similar to the standard normal.', isTrue: true, explanation: 'Yes. As df → ∞, the t-distribution converges to N(0,1). For df > 30, the distributions are very similar.' },
    { id: 'ost-tf-5', type: 'true-false', question: 'A one-sample t-test can be validly used with n = 5 if the population is normally distributed.', isTrue: true, explanation: 'Yes. The t-test is exact for normally distributed populations at any n. The normality assumption is about the population, not just for large n.' },
    { id: 'ost-tf-6', type: 'true-false', question: 'Using s (sample SD) in place of σ always underestimates the true variability.', isTrue: false, explanation: 'False. s is an unbiased estimator of σ — it neither consistently overestimates nor underestimates σ on average.' },
    { id: 'ost-tf-7', type: 'true-false', question: 'For a one-sample t-test, the test statistic t = (x̄ − μ₀)/(s/√n) follows a t-distribution under H₀.', isTrue: true, explanation: 'Correct. Under H₀ and the normality assumption, t follows a t-distribution with df = n−1.' },
    { id: 'ost-tf-8', type: 'true-false', question: 'If n = 25 and the critical t-value at α = 0.05 (two-tailed) is 2.064, the standard normal critical value 1.96 would lead to a more conservative test.', isTrue: false, explanation: 'False. 2.064 > 1.96, so the t critical value requires MORE extreme data to reject. The t-test is more conservative than the z-test here.' },
    { id: 'ost-tf-9', type: 'true-false', question: 'The one-sample t-test tests whether a sample mean differs from a known or hypothesised population mean.', isTrue: true, explanation: 'Correct. H₀: μ = μ₀ vs. H₁: μ ≠ μ₀ (or directional). The sample mean is compared to the claimed population mean.' },
    { id: 'ost-tf-10', type: 'true-false', question: 'The p-value from a one-sample t-test is found using the chi-square distribution.', isTrue: false, explanation: 'False. The p-value comes from the t-distribution with df = n−1. The chi-square distribution is used in different tests.' },
    { id: 'ost-tf-11', type: 'true-false', question: 'A larger sample standard deviation s will produce a larger t-statistic for the same difference (x̄ − μ₀).', isTrue: false, explanation: 'False. SE = s/√n. A larger s increases SE, which decreases |t| = |x̄ − μ₀|/SE.' },
    { id: 'ost-tf-12', type: 'true-false', question: 'The one-sample t-test is robust to moderate departures from normality when n is large.', isTrue: true, explanation: 'Yes. By the CLT, x̄ is approximately normal for large n, so the t-test remains valid even if the raw data are non-normal.' },
    { id: 'ost-tf-13', type: 'true-false', question: 'For a two-tailed t-test, the rejection region is split equally between both tails.', isTrue: true, explanation: 'Correct. α/2 is placed in each tail. For α = 0.05, each tail contains 2.5% of the probability.' },
    { id: 'ost-tf-14', type: 'true-false', question: 'If t = 0.8 and df = 20 (two-tailed, α = 0.05), you should reject H₀.', isTrue: false, explanation: 'False. The critical value at df = 20, two-tailed α = 0.05 is ±2.086. Since 0.8 < 2.086, we fail to reject H₀.' },
    { id: 'ost-tf-15', type: 'true-false', question: 'The formula t = (x̄ − μ₀) / (s/√n) is identical to the z formula except σ is replaced by s.', isTrue: true, explanation: 'Exactly. The structure is the same; the only difference is using s (estimated) instead of σ (known), which requires the t-distribution.' },
    { id: 'ost-tf-16', type: 'true-false', question: 'A one-sample t-test compares two independent group means.', isTrue: false, explanation: 'False. A one-sample t-test compares a single sample mean to a hypothesised value μ₀. Comparing two group means requires a two-sample t-test.' },
    { id: 'ost-tf-17', type: 'true-false', question: 'A statistically significant t-test result proves that the practical effect is large.', isTrue: false, explanation: 'False. Statistical significance depends on n, SE, and effect size. With large n, even trivially small differences can be statistically significant.' },
    { id: 'ost-tf-18', type: 'true-false', question: 'The standard error of the mean in a t-test is s/√n.', isTrue: true, explanation: 'Yes. SE = s/√n. This is the estimated standard deviation of the sampling distribution of x̄.' },
    { id: 'ost-tf-19', type: 'true-false', question: 'Failing to reject H₀ in a t-test confirms that the population mean equals μ₀.', isTrue: false, explanation: 'False. Failing to reject means insufficient evidence — the population mean could be μ₀ or some close alternative. It is not proof of equality.' },
    { id: 'ost-tf-20', type: 'true-false', question: 'If all data values are identical, the t-statistic is undefined.', isTrue: true, explanation: 'Yes. If all values are equal, s = 0, making SE = 0 and t = (x̄ − μ₀)/0, which is undefined (division by zero).' },
    { id: 'ost-mc-6', type: 'multiple-choice', question: 'x̄ = 25, μ₀ = 22, s = 6, n = 9. What is t?', options: [ { id: 'a', text: 't = 1.5', isCorrect: true, explanation: 'SE = 6/√9 = 6/3 = 2. t = (25−22)/2 = 3/2 = 1.5. Correct.' }, { id: 'b', text: 't = 0.5', isCorrect: false, explanation: 'SE = 6/3 = 2. t = 3/2 = 1.5, not 0.5.' }, { id: 'c', text: 't = 3.0', isCorrect: false, explanation: 't = (x̄ − μ₀) / SE = 3/2 = 1.5. You may have forgotten to compute SE.' }, { id: 'd', text: 't = 4.5', isCorrect: false, explanation: 'SE = s/√n = 6/3 = 2. t = 3/2 = 1.5.' }, ], explanation: 'SE = s/√n = 6/3 = 2. t = (25 − 22)/2 = 1.5. df = 8.', hint: 'Compute SE = s/√n first, then t = (x̄ − μ₀)/SE.' },
    { id: 'ost-mc-7', type: 'multiple-choice', question: 'Which situation calls for a one-sample t-test rather than a z-test?', options: [ { id: 'a', text: 'σ is known and n = 50', isCorrect: false, explanation: 'Known σ → use z-test, especially with large n.' }, { id: 'b', text: 'σ is unknown and n = 15', isCorrect: true, explanation: 'Correct. Unknown σ with small n → use one-sample t-test with df = n−1 = 14.' }, { id: 'c', text: 'σ is known and n = 10', isCorrect: false, explanation: 'If σ is known, use the z-test regardless of n (if population is normal).' }, { id: 'd', text: 'Two groups are being compared', isCorrect: false, explanation: 'Two-group comparison → independent samples t-test, not a one-sample test.' }, ], explanation: 'One-sample t-test: one group, σ unknown. Use t (not z) because we estimate σ with s.', hint: 'The t-test is chosen when σ must be estimated from the data.' },
    { id: 'ost-mc-8', type: 'multiple-choice', question: 'For n = 10, what are the degrees of freedom in a one-sample t-test?', options: [ { id: 'a', text: '10', isCorrect: false, explanation: 'df = n − 1 = 10 − 1 = 9.' }, { id: 'b', text: '9', isCorrect: true, explanation: 'df = n − 1 = 9. We lose one df because we estimate μ with x̄.' }, { id: 'c', text: '8', isCorrect: false, explanation: 'df = n − 1. For n = 10, df = 9, not 8.' }, { id: 'd', text: '5', isCorrect: false, explanation: 'df = n − 1 = 9. There is no division by 2 here.' }, ], explanation: 'df = n − 1 always for a one-sample t-test.', hint: 'df = n minus how many parameters were estimated (1 for the mean).' },
    { id: 'ost-mc-9', type: 'multiple-choice', question: 'A t-test gives t = 2.5, df = 15. The two-tailed t* at α = 0.05 is 2.131. What is the conclusion?', options: [ { id: 'a', text: 'Fail to reject H₀ — t must exceed 3 to be significant', isCorrect: false, explanation: 'The threshold is t* = 2.131, not 3. Compare t to t*.' }, { id: 'b', text: 'Reject H₀ — |t| = 2.5 > 2.131', isCorrect: true, explanation: 'Correct. Since |2.5| > 2.131, we reject H₀ at α = 0.05.' }, { id: 'c', text: 'Fail to reject H₀ — t < 2.576', isCorrect: false, explanation: '2.576 is the z* for α = 0.01. The t* for df = 15, α = 0.05 is 2.131.' }, { id: 'd', text: 'Cannot determine without knowing x̄', isCorrect: false, explanation: 'The t-statistic already encodes the comparison of x̄ to μ₀. We only need t and t*.' }, ], explanation: 'Compare |t| to t*. |2.5| > 2.131 → reject H₀.', hint: 'Compare the computed t to the critical t*.' },
    { id: 'ost-mc-10', type: 'multiple-choice', question: 'Which statement about the t-distribution is FALSE?', options: [ { id: 'a', text: 'It is symmetric around 0', isCorrect: false, explanation: 'The t-distribution IS symmetric around 0. This statement is true.' }, { id: 'b', text: 'It has heavier tails than the normal', isCorrect: false, explanation: 'Yes, the t has heavier tails — this is true.' }, { id: 'c', text: 'Its variance is always 1', isCorrect: true, explanation: 'FALSE. Variance of t = df/(df−2) for df > 2, which is greater than 1.' }, { id: 'd', text: 'It approaches N(0,1) as df → ∞', isCorrect: false, explanation: 'This is true — as df grows, t converges to the standard normal.' }, ], explanation: 'The variance of the t-distribution is df/(df−2) > 1 for finite df. Only as df → ∞ does the variance approach 1.', hint: 'Which property of the t-distribution is commonly confused with the standard normal?' },
    { id: 'ost-mc-11', type: 'multiple-choice', question: 'What happens to the critical t-value (two-tailed, α = 0.05) as n increases from 5 to 500?', options: [ { id: 'a', text: 'It increases toward ∞', isCorrect: false, explanation: 'The critical value decreases as df grows — the distribution gets tighter.' }, { id: 'b', text: 'It stays constant at 1.96', isCorrect: false, explanation: '1.96 is the normal critical value. The t critical value approaches 1.96 but is only exactly 1.96 as df → ∞.' }, { id: 'c', text: 'It decreases toward 1.96', isCorrect: true, explanation: 'As n → ∞, df → ∞ and the t-distribution approaches N(0,1), so t* → 1.96.' }, { id: 'd', text: 'It jumps to exactly 1.96 at n = 30', isCorrect: false, explanation: 'It approaches 1.96 continuously — there is no jump at n = 30.' }, ], explanation: 'As df increases, t* (two-tailed, α = 0.05) decreases from ~12.7 (df=1) toward 1.96 (df=∞).', hint: 'What does the t-distribution converge to as df → ∞?' },
    { id: 'ost-mc-12', type: 'multiple-choice', question: 'A study tests if mean resting heart rate differs from 72 bpm. x̄ = 75, s = 10, n = 25. Which is the correct H₀?', options: [ { id: 'a', text: 'H₀: x̄ = 72', isCorrect: false, explanation: 'H₀ is always stated in terms of the population parameter μ, not the sample statistic x̄.' }, { id: 'b', text: 'H₀: μ = 75', isCorrect: false, explanation: '75 is the observed sample mean, not the hypothesised value. H₀ states the null claim: μ = 72.' }, { id: 'c', text: 'H₀: μ = 72', isCorrect: true, explanation: 'Correct. H₀ states the null claim: the true population mean equals 72 bpm.' }, { id: 'd', text: 'H₀: μ > 72', isCorrect: false, explanation: 'H₀ is the equality claim (μ = 72). The alternative H₁ contains the inequality.' }, ], explanation: 'H₀ always uses the hypothesised population parameter with an equality: H₀: μ = μ₀.', hint: 'H₀ uses the hypothesised value, stated as an equality about the population parameter.' },
    { id: 'ost-mc-13', type: 'multiple-choice', question: 'Effect size d for a one-sample t-test is calculated as:', options: [ { id: 'a', text: 'd = (x̄ − μ₀) / n', isCorrect: false, explanation: 'Effect size is not divided by n. That would confound effect size with sample size.' }, { id: 'b', text: 'd = t / √n', isCorrect: false, explanation: 'This is a formula sometimes used to convert t to d but is not the primary definition.' }, { id: 'c', text: 'd = (x̄ − μ₀) / s', isCorrect: true, explanation: "Cohen's d = (x̄ − μ₀) / s. It measures the effect in standard deviation units, independent of sample size." }, { id: 'd', text: 'd = s / x̄', isCorrect: false, explanation: 'That formula resembles a coefficient of variation, not effect size.' }, ], explanation: "Cohen's d = (x̄ − μ₀)/s. It standardises the observed difference by the sample SD, giving a scale-free measure of effect size.", hint: "Cohen's d divides the raw difference by the standard deviation." },
    { id: 'ost-mc-14', type: 'multiple-choice', question: 'n = 36, x̄ = 50, s = 12, μ₀ = 54. What is t?', options: [ { id: 'a', text: 't = −2.0', isCorrect: true, explanation: 'SE = 12/√36 = 2. t = (50−54)/2 = −4/2 = −2.0. Correct.' }, { id: 'b', text: 't = −0.33', isCorrect: false, explanation: 'SE = 12/6 = 2, not 12. t = −4/2 = −2.0.' }, { id: 'c', text: 't = 2.0', isCorrect: false, explanation: 'x̄ < μ₀ gives a negative t. t = (50−54)/2 = −2.0.' }, { id: 'd', text: 't = −3.0', isCorrect: false, explanation: 'SE = 12/6 = 2. t = (50−54)/2 = −4/2 = −2.0, not −3.0.' }, ], explanation: 'SE = s/√n = 12/6 = 2. t = (50−54)/2 = −2.0. df = 35.', hint: 'SE = s/√n; t = (x̄ − μ₀)/SE.' },
    { id: 'ost-mc-15', type: 'multiple-choice', question: 'A t-test is run with n = 4 and the data appear right-skewed. Why might this be problematic?', options: [ { id: 'a', text: 'The formula t = (x̄ − μ₀)/(s/√n) is not defined for n < 10', isCorrect: false, explanation: 'The formula is defined for any n ≥ 2. The issue is about validity, not computability.' }, { id: 'b', text: 'With small n, the CLT does not apply, so skewness violates the normality assumption', isCorrect: true, explanation: 'Correct. The t-test assumes population normality. With n = 4 and skewed data, this assumption is in doubt and the test may be unreliable.' }, { id: 'c', text: 'The degrees of freedom would be negative', isCorrect: false, explanation: 'df = n − 1 = 3 — still positive.' }, { id: 'd', text: 'A t-test requires n ≥ 30', isCorrect: false, explanation: 'The t-test can be valid for any n if the population is normal. The issue is the skewness, not meeting n = 30.' }, ], explanation: 'For very small n, the t-test relies on population normality. Skewed data with n = 4 violates this assumption. Alternatives like a sign test may be better.', hint: 'The CLT only helps with large n. What happens when n is small and data are not normal?' },
  ],
  keyTakeaway:
    't = (x̄ − μ₀)/(s/√n) with df = n−1. Use t-test when σ is unknown (the typical case). Compare |t| to t* or p to α. For large n, t and z give nearly identical results.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "Fat Tails = More Cautious" Rule</p>
      <p className="text-sm text-violet-800">
        The t-distribution has <strong>fatter tails</strong> than the normal because we are
        using <em>s</em> (estimated σ) instead of the true σ. Think of it this way:
      </p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-blue-100 border border-blue-300 rounded p-2">
          <div className="text-lg font-bold text-blue-800">df = 5</div>
          <div className="text-blue-700">Very fat tails</div>
          <div className="text-blue-600 text-xs">t* ≈ 2.57</div>
        </div>
        <div className="bg-indigo-100 border border-indigo-300 rounded p-2">
          <div className="text-lg font-bold text-indigo-800">df = 30</div>
          <div className="text-indigo-700">Moderate tails</div>
          <div className="text-indigo-600 text-xs">t* ≈ 2.04</div>
        </div>
        <div className="bg-violet-100 border border-violet-300 rounded p-2">
          <div className="text-lg font-bold text-violet-800">df = ∞</div>
          <div className="text-violet-700">Normal distribution</div>
          <div className="text-violet-600 text-xs">z* = 1.96</div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
        <strong>Mantra:</strong> "t has fatter tails because s is just a guess. The bigger the df, the thinner the tails, until t ≈ z."
      </div>
    </div>
  ),
  visualization: <OneSampleTViz />,
  datasetGenerator: false,
}

export default function OneSampleTTest({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
