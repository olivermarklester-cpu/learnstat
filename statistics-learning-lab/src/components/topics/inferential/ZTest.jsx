import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, zTestStatistic, zToPValue, zCritical, standardError, confidenceInterval } from '../../../utils/stats'

// ── Interactive z-test calculator ─────────────────────────────────────────────

function ZTestViz() {
  const [xbar, setXbar] = useState(102)
  const [mu0, setMu0] = useState(100)
  const [sigma, setSigma] = useState(15)
  const [n, setN] = useState(36)
  const [tails, setTails] = useState(2)
  const [alpha, setAlpha] = useState(0.05)

  const z = round(zTestStatistic(xbar, mu0, sigma, n), 4)
  const p = round(zToPValue(z, tails), 4)
  const zStar = round(zCritical(alpha, tails), 4)
  const se = round(standardError(sigma, n), 4)
  const { lower, upper } = confidenceInterval(xbar, round(zCritical(0.05, 2) * se, 4))
  const reject = p <= alpha

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {[
          { label: 'Sample mean (x̄)', min: 80, max: 120, step: 0.5, value: xbar, set: setXbar },
          { label: 'Hypothesised mean (μ₀)', min: 80, max: 120, step: 0.5, value: mu0, set: setMu0 },
          { label: 'Population σ', min: 1, max: 40, step: 1, value: sigma, set: setSigma },
          { label: 'Sample size (n)', min: 5, max: 200, step: 1, value: n, set: setN },
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
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white text-textDark">
            <option value={2}>Two-tailed (≠)</option>
            <option value={1}>One-tailed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">α</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white text-textDark">
            <option value={0.10}>0.10</option>
            <option value={0.05}>0.05</option>
            <option value={0.01}>0.01</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-center text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-blue-600 font-medium">SE</div>
          <div className="text-blue-900 font-bold text-lg">{se}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">z statistic</div>
          <div className="text-purple-900 font-bold text-lg">{z}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="text-amber-600 font-medium">p-value</div>
          <div className="text-amber-900 font-bold text-lg">{p}</div>
        </div>
        <div className={`border rounded-lg p-2 ${reject ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`font-medium text-xs ${reject ? 'text-red-600' : 'text-green-600'}`}>Decision</div>
          <div className={`font-bold text-sm mt-0.5 ${reject ? 'text-red-800' : 'text-green-800'}`}>
            {reject ? 'Reject H₀' : 'Fail to reject H₀'}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-border rounded-lg p-2 text-xs text-textMuted">
        z* = {zStar} &nbsp;|&nbsp; 95% CI for μ: [{round(lower, 2)}, {round(upper, 2)}]
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Z-test',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Perform a one-sample z-test and interpret the result in context.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>one-sample z-test</strong> tests a hypothesis about a population mean
        when the <strong>population standard deviation σ is known</strong>. It uses the
        standard normal distribution and is appropriate for large samples or when σ is
        genuinely known (e.g., from historical data).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">When to use a z-test</p>
        <ul className="space-y-1 text-blue-800">
          <li>σ is known (unusual in practice)</li>
          <li>OR n is large (≥ 30) — by the CLT, the sample mean is approximately normal, and s ≈ σ</li>
        </ul>
        <p className="mt-1 text-blue-700 text-xs">In most real-world situations with unknown σ, use the t-test instead.</p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A postal service knows from years of data that letter weights have σ = 15 g. They want
        to test whether a new batch of letters has a different mean weight. Because σ is known,
        a z-test is appropriate.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'z-test',
    title: 'How the Z-Test Statistic is built',
    steps: [
      {
        label: 'Recognise the Standard Error in the denominator',
        symbolName: 'SE',
        highlightColor: 'orange',
        from: 'z = (x̄ − μ₀) / SE',
        to: 'z = (x̄ − μ₀) / (σ / √n)',
        note: 'SE = σ/√n is the standard error of the mean — how much sample means vary. Dividing the gap by SE gives how many standard errors away the sample mean is.',
      },
    ],
    finalFormula: 'z = (x̄ − μ₀) / (σ / √n)',
  },
  formula: {
    main: 'z = (x̄ − μ₀) / (σ/√n)',
    variants: [
      { label: 'z-test statistic', expression: 'z = (x̄ − μ₀) / (σ/√n)', latex: 'z = \\frac{\\bar{x} - \\mu_0}{\\sigma / \\sqrt{n}}' },
      { label: 'Decision (p-value)', expression: 'Reject H₀ if p ≤ α', latex: '' },
      { label: 'Decision (critical value)', expression: 'Reject H₀ if |z| ≥ z*', latex: '' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean' },
      { symbol: 'μ₀', meaning: 'Hypothesised population mean (from H₀)' },
      { symbol: 'σ', meaning: 'Known population standard deviation' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: 'z', meaning: 'Test statistic — how many standard errors x̄ is from μ₀' },
    ],
  },
  whenToUse: [
    'Testing a hypothesis about μ when σ is known',
    'Large samples (n ≥ 30) even when σ is estimated — z-test is approximately valid',
    'Quality control where historical σ is well established',
  ],
  whenNotToUse: [
    'σ is unknown and n is small (< 30) — use a t-test',
    'Data is heavily skewed and n is small',
    'Testing a proportion or variance — use different tests',
  ],
  assumptions: [
    'Population SD σ is known',
    'Random, independent sample',
    'Population is normal OR n is large enough for CLT',
  ],
  workedExample: {
    scenario:
      'A machine fills cans with σ = 3 ml (known from calibration). H₀: μ = 330 ml vs H₁: μ ≠ 330 ml. A sample of n = 25 cans gives x̄ = 328.5 ml. Test at α = 0.05.',
    steps: [
      { stepNumber: 1, label: 'Calculate SE', expression: 'SE = σ/√n = 3/√25 = 3/5', result: 'SE = 0.6 ml', explanation: 'Standard error of the mean.' },
      { stepNumber: 2, label: 'Calculate z', expression: 'z = (328.5 − 330) / 0.6 = −1.5 / 0.6', result: 'z = −2.5', explanation: 'The sample mean is 2.5 standard errors below μ₀.' },
      { stepNumber: 3, label: 'Find p-value', expression: 'p = 2 × P(Z < −2.5) = 2 × 0.0062', result: 'p ≈ 0.012', explanation: 'Two-tailed p-value.' },
      { stepNumber: 4, label: 'Decision', expression: '0.012 < 0.05 → reject H₀', result: 'Significant evidence of underfill', explanation: 'Reject H₀ at α = 0.05.' },
    ],
    interpretation:
      'There is significant evidence (z = −2.5, p ≈ 0.012) that the machine is not filling cans to 330 ml. The machine should be inspected.',
  },
  interpretation:
    'The z-test statistic measures how many standard errors the sample mean is from the hypothesised mean. Large |z| → small p-value → stronger evidence against H₀.',
  commonMistakes: [
    { mistake: 'Using z-test when σ is unknown and n < 30', explanation: 'Without a known σ, use the t-test. The z-test underestimates the critical value in small samples.' },
    { mistake: 'Forgetting to divide SE by √n', explanation: 'The denominator is σ/√n, not σ alone.' },
    { mistake: 'Using x̄ − μ₀ without checking the direction of H₁', explanation: 'Always check if the test is left-, right-, or two-tailed before computing the p-value.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'zt-easy-1', scenario: 'x̄ = 105, μ₀ = 100, σ = 20, n = 100. Two-tailed.', question: 'Calculate z.', hint: 'z = (x̄ − μ₀)/(σ/√n).', solution: 'SE = 20/10 = 2. z = (105−100)/2 = 2.5.' },
    ],
    moderate: [
      { id: 'zt-mod-1', scenario: 'x̄ = 48, μ₀ = 50, σ = 10, n = 64. H₁: μ < 50. α = 0.05.', question: 'Perform the z-test and state your conclusion.', hint: 'z = (48−50)/(10/8). One-tailed left. z* = −1.645.', solution: 'SE = 1.25. z = −1.6. z* = −1.645. z = −1.6 > −1.645 → fail to reject H₀ at α=0.05. (Barely!)' },
    ],
    challenging: [
      { id: 'zt-chal-1', scenario: 'x̄ = 510, μ₀ = 500, σ = 50, n = ?, z = 3.0.', question: 'What was the sample size n?', hint: 'z = (x̄ − μ₀)/(σ/√n). Solve for n.', solution: '3.0 = 10/(50/√n) = 10√n/50. 3×50 = 10√n. √n = 15. n = 225.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'zt-kc-1', type: 'multiple-choice',
      question: 'A z-test is most appropriate when:',
      options: [
        { id: 'a', text: 'The population SD is unknown and n = 15', isCorrect: false, explanation: 'Use a t-test when σ is unknown and n is small.' },
        { id: 'b', text: 'The population SD is known', isCorrect: true, explanation: 'Correct! The z-test requires known σ.' },
        { id: 'c', text: 'Data is categorical', isCorrect: false, explanation: 'Categorical data requires chi-square or proportion tests.' },
        { id: 'd', text: 'The sample size is less than 5', isCorrect: false, explanation: 'Very small samples require non-parametric tests regardless of σ.' },
      ],
      explanation: 'z-test: σ known (or large n). t-test: σ unknown.',
      hint: 'What is the key condition for using z vs t?',
    },
    {
      id: 'zt-kc-2', type: 'numerical',
      question: 'x̄ = 52, μ₀ = 50, σ = 8, n = 16. What is z?',
      answer: 1,
      tolerance: 0.05,
      explanation: 'SE = 8/√16 = 2. z = (52−50)/2 = 1.',
      hint: 'z = (x̄ − μ₀) / (σ/√n).',
    },
    {
      id: 'zt-kc-3', type: 'multiple-choice',
      question: 'x̄ = 105, μ₀ = 100, σ = 20, n = 100. Two-tailed, α = 0.05. What is the decision?',
      options: [
        { id: 'a', text: 'Fail to reject H₀ — z is below 1.96', isCorrect: false, explanation: 'z = (105−100)/(20/10) = 5/2 = 2.5. |z| = 2.5 > 1.96 → reject H₀.' },
        { id: 'b', text: 'Reject H₀ — |z| exceeds the critical value', isCorrect: true, explanation: 'Correct! SE = 2. z = 2.5. |2.5| > z* = 1.96 → reject H₀.' },
        { id: 'c', text: 'Not enough information', isCorrect: false, explanation: 'All needed values (x̄, μ₀, σ, n, α) are given.' },
        { id: 'd', text: 'Reject H₀ only if we use a one-tailed test', isCorrect: false, explanation: 'z = 2.5 exceeds 1.96 (two-tailed z*), so we reject with a two-tailed test.' },
      ],
      explanation: 'SE = 20/√100 = 2. z = 5/2 = 2.5. |z| = 2.5 > 1.96 → reject H₀ at α = 0.05 (two-tailed).',
      hint: 'Calculate SE first, then z, then compare |z| to 1.96.',
    },
    {
      id: 'zt-kc-4', type: 'multiple-choice',
      question: 'Why does increasing n (sample size) make it easier to reject H₀, even with the same x̄?',
      options: [
        { id: 'a', text: 'Because α decreases automatically', isCorrect: false, explanation: 'α is set by the researcher, not by n.' },
        { id: 'b', text: 'Because SE = σ/√n decreases, making z larger', isCorrect: true, explanation: 'Correct! Larger n → smaller SE → larger z for the same difference → more likely to reject H₀.' },
        { id: 'c', text: 'Because z* decreases with sample size', isCorrect: false, explanation: 'z* for a z-test does not change with n (unlike t*).' },
        { id: 'd', text: 'Because σ is estimated more accurately', isCorrect: false, explanation: 'In a z-test σ is known — not estimated.' },
      ],
      explanation: 'Larger n → smaller SE → larger |z| → smaller p-value. A larger sample gives more power to detect a given difference.',
      hint: 'SE = σ/√n. What happens to SE as n grows?',
    },
    {
      id: 'zt-kc-5', type: 'numerical',
      question: 'x̄ = 95, μ₀ = 100, σ = 15, n = 9. One-tailed left (H₁: μ < 100). What is z? (Enter as a negative number)',
      answer: -1,
      tolerance: 0.05,
      explanation: 'SE = 15/√9 = 5. z = (95−100)/5 = −5/5 = −1.',
      hint: 'z = (x̄ − μ₀)/(σ/√n). Direction matters — x̄ < μ₀ gives a negative z.',
    },
    { id: 'zt-tf-1', type: 'true-false', question: 'The z-test requires the population standard deviation σ to be known.', isTrue: true, explanation: 'Correct. The z-test formula z = (x̄ − μ₀)/(σ/√n) uses σ (population SD). When σ is unknown, you use a t-test with s instead.' },
    { id: 'zt-tf-2', type: 'true-false', question: 'A z-score of 0 always means the sample mean equals the hypothesised population mean.', isTrue: true, explanation: 'z = (x̄ − μ₀)/(σ/√n). If z = 0 then x̄ − μ₀ = 0, meaning x̄ = μ₀.' },
    { id: 'zt-tf-3', type: 'true-false', question: 'For a two-tailed z-test at α = 0.05, the critical values are ±1.645.', isTrue: false, explanation: 'False. ±1.645 is the critical value for a ONE-tailed test at α = 0.05. For two-tailed α = 0.05, use ±1.96.' },
    { id: 'zt-tf-4', type: 'true-false', question: 'Doubling the sample size will double the z-test statistic (holding all else equal).', isTrue: false, explanation: 'False. SE = σ/√n, so doubling n multiplies SE by 1/√2 and z by √2, not 2. To double z, you need to quadruple n.' },
    { id: 'zt-tf-5', type: 'true-false', question: 'A negative z-statistic always leads to rejecting H₀.', isTrue: false, explanation: 'False. A negative z simply means x̄ < μ₀. Whether you reject depends on |z| vs. z* and the direction of H₁.' },
    { id: 'zt-tf-6', type: 'true-false', question: 'The z-test can be used for any sample size as long as the population is normally distributed.', isTrue: true, explanation: 'If the population is normal, x̄ is exactly normal regardless of n. With σ known, the z-test is valid for any n.' },
    { id: 'zt-tf-7', type: 'true-false', question: 'A z-statistic of 1.96 corresponds to a two-tailed p-value of exactly 0.05.', isTrue: true, explanation: 'The two-tailed critical value for α = 0.05 is ±1.96. So |z| = 1.96 gives p = 0.05 exactly.' },
    { id: 'zt-tf-8', type: 'true-false', question: 'Using α = 0.01 instead of α = 0.05 increases the probability of a Type I error.', isTrue: false, explanation: 'False. A smaller α (0.01 < 0.05) makes the test more stringent and DECREASES the Type I error rate.' },
    { id: 'zt-tf-9', type: 'true-false', question: 'The standard error decreases as the population standard deviation σ increases.', isTrue: false, explanation: 'False. SE = σ/√n. As σ increases, SE increases. A more variable population produces a larger SE.' },
    { id: 'zt-tf-10', type: 'true-false', question: 'In a one-tailed left z-test, you reject H₀ when z < −z*.', isTrue: true, explanation: 'Correct. For H₁: μ < μ₀ (left-tailed), the rejection region is z < −z* (e.g., z < −1.645 for α = 0.05).' },
    { id: 'zt-tf-11', type: 'true-false', question: 'The z-test and t-test give identical results when n = 30 exactly.', isTrue: false, explanation: 'False. They give similar (not identical) results. The t-distribution approaches normal as n → ∞, but they are not equal at any finite n.' },
    { id: 'zt-tf-12', type: 'true-false', question: 'A p-value of 0.03 is statistically significant at α = 0.05.', isTrue: true, explanation: 'Since 0.03 < 0.05 = α, we reject H₀. The result is statistically significant at the 5% level.' },
    { id: 'zt-tf-13', type: 'true-false', question: 'The z-test statistic can theoretically range from −∞ to +∞.', isTrue: true, explanation: 'z = (x̄ − μ₀)/(σ/√n). Since x̄ can be any value, z is unbounded in both directions.' },
    { id: 'zt-tf-14', type: 'true-false', question: 'If you fail to reject H₀, you have proven that H₀ is true.', isTrue: false, explanation: 'False. Failing to reject H₀ only means there is insufficient evidence against it — it does NOT prove H₀ is true.' },
    { id: 'zt-tf-15', type: 'true-false', question: 'Increasing the significance level α from 0.05 to 0.10 makes it harder to reject H₀.', isTrue: false, explanation: 'False. A larger α widens the rejection region, making it EASIER to reject H₀ (but also increases Type I error risk).' },
    { id: 'zt-tf-16', type: 'true-false', question: 'The sampling distribution of x̄ is used as the basis for the z-test.', isTrue: true, explanation: 'Yes. The z-test is built on the fact that x̄ ~ N(μ, σ²/n), so z = (x̄ − μ₀)/SE follows a standard normal distribution under H₀.' },
    { id: 'zt-tf-17', type: 'true-false', question: 'A z-test can be used to test hypotheses about a population proportion.', isTrue: true, explanation: 'Yes. The proportion test z = (p̂ − p₀)/√(p₀(1−p₀)/n) is also a z-test, applied to proportions.' },
    { id: 'zt-tf-18', type: 'true-false', question: 'For a one-tailed right test, a z-statistic of 1.50 is significant at α = 0.05.', isTrue: false, explanation: 'False. The critical value is z* = 1.645. Since 1.50 < 1.645, we fail to reject H₀.' },
    { id: 'zt-tf-19', type: 'true-false', question: 'The z-test formula z = (x̄ − μ₀)/(σ/√n) measures how many standard errors x̄ is from μ₀.', isTrue: true, explanation: 'Exactly. SE = σ/√n, and z counts how many SEs separate the observed x̄ from the hypothesised μ₀.' },
    { id: 'zt-tf-20', type: 'true-false', question: 'A very large positive z-value provides evidence against H₀ in a two-tailed test.', isTrue: true, explanation: 'Yes. In a two-tailed test, both extreme positive and extreme negative z values fall in the rejection region.' },
    { id: 'zt-mc-6', type: 'multiple-choice', question: 'x̄ = 52, μ₀ = 50, σ = 10, n = 25. Which z is correct?', options: [ { id: 'a', text: 'z = 0.5', isCorrect: false, explanation: 'SE = 10/√25 = 2. z = (52−50)/2 = 1.0, not 0.5.' }, { id: 'b', text: 'z = 1.0', isCorrect: true, explanation: 'SE = 10/5 = 2. z = 2/2 = 1.0. Correct.' }, { id: 'c', text: 'z = 2.0', isCorrect: false, explanation: 'z = (52−50)/2 = 1.0. You may have used SE = 1 instead of 2.' }, { id: 'd', text: 'z = 5.0', isCorrect: false, explanation: 'SE = σ/√n = 10/5 = 2, not 10/50.' }, ], explanation: 'SE = σ/√n = 10/√25 = 2. z = (x̄ − μ₀)/SE = 2/2 = 1.0.', hint: 'Compute SE first, then z.' },
    { id: 'zt-mc-7', type: 'multiple-choice', question: 'For a two-tailed test at α = 0.01, what is the critical z-value?', options: [ { id: 'a', text: '±1.645', isCorrect: false, explanation: '±1.645 is the critical value for a one-tailed test at α = 0.05.' }, { id: 'b', text: '±1.96', isCorrect: false, explanation: '±1.96 is for two-tailed α = 0.05, not α = 0.01.' }, { id: 'c', text: '±2.326', isCorrect: false, explanation: '±2.326 is for one-tailed α = 0.01.' }, { id: 'd', text: '±2.576', isCorrect: true, explanation: 'Correct! For two-tailed α = 0.01, each tail has 0.005, giving z* ≈ ±2.576.' }, ], explanation: 'Two-tailed α = 0.01 splits to 0.005 in each tail. z* = invNorm(0.995) ≈ 2.576.', hint: 'Divide α by 2 for two-tailed tests.' },
    { id: 'zt-mc-8', type: 'multiple-choice', question: 'Which change will NOT affect the z-test statistic?', options: [ { id: 'a', text: 'Changing the sample mean x̄', isCorrect: false, explanation: 'x̄ is in the numerator — it directly affects z.' }, { id: 'b', text: 'Changing the significance level α', isCorrect: true, explanation: 'Correct! α affects the critical value and decision rule but does NOT change the computed z-statistic.' }, { id: 'c', text: 'Changing the sample size n', isCorrect: false, explanation: 'n is in SE = σ/√n — it affects z.' }, { id: 'd', text: 'Changing σ', isCorrect: false, explanation: 'σ determines SE and therefore z.' }, ], explanation: 'α is used after the test statistic is computed (to set the threshold). It has no effect on z itself.', hint: 'Which element only appears in the decision step, not in the calculation step?' },
    { id: 'zt-mc-9', type: 'multiple-choice', question: 'A researcher uses σ = 20 but the true σ = 10. What happens to z?', options: [ { id: 'a', text: 'z is doubled', isCorrect: false, explanation: 'Using a larger σ inflates SE, which shrinks z — it is not doubled.' }, { id: 'b', text: 'z is halved', isCorrect: true, explanation: 'SE = σ/√n. Using σ = 20 instead of 10 doubles SE, cutting z in half.' }, { id: 'c', text: 'z is unchanged', isCorrect: false, explanation: 'σ directly enters SE = σ/√n, so wrong σ changes z.' }, { id: 'd', text: 'z is squared', isCorrect: false, explanation: 'z changes linearly with σ, not quadratically.' }, ], explanation: 'SE ∝ σ. Using twice the true σ doubles SE, cutting z = (x̄−μ₀)/SE in half.', hint: 'SE = σ/√n. If σ doubles, SE doubles. What happens to z?' },
    { id: 'zt-mc-10', type: 'multiple-choice', question: 'z = 2.10, two-tailed test, α = 0.05. What is the correct conclusion?', options: [ { id: 'a', text: 'Fail to reject H₀ — z < 2.576', isCorrect: false, explanation: '2.576 is the threshold for α = 0.01. The threshold for α = 0.05 is 1.96.' }, { id: 'b', text: 'Reject H₀ — |z| > 1.96', isCorrect: true, explanation: 'Correct! |2.10| = 2.10 > 1.96 = z*, so we reject H₀ at α = 0.05.' }, { id: 'c', text: 'Reject H₀ — z is positive', isCorrect: false, explanation: 'The sign of z does not determine rejection in a two-tailed test — only |z| vs. z* matters.' }, { id: 'd', text: 'Fail to reject H₀ — p > 0.05', isCorrect: false, explanation: 'If |z| = 2.10 > 1.96, then p < 0.05, so we reject H₀.' }, ], explanation: 'z* = 1.96 for two-tailed α = 0.05. Since |2.10| > 1.96, reject H₀.', hint: 'Compare |z| to z*.' },
    { id: 'zt-mc-11', type: 'multiple-choice', question: 'Which of the following best describes the p-value in a z-test?', options: [ { id: 'a', text: 'The probability that H₀ is true', isCorrect: false, explanation: 'The p-value is NOT the probability that H₀ is true — a common misconception.' }, { id: 'b', text: 'The probability of observing a z this extreme or more extreme, given H₀ is true', isCorrect: true, explanation: 'Correct definition. p = P(|Z| ≥ |z_observed| | H₀ true) for two-tailed tests.' }, { id: 'c', text: 'The probability of making a Type II error', isCorrect: false, explanation: 'Type II error probability is β, not the p-value.' }, { id: 'd', text: 'One minus the confidence level', isCorrect: false, explanation: 'α = 1 − confidence level, and α is the threshold, not the p-value itself.' }, ], explanation: 'The p-value is the probability of seeing data at least as extreme as observed, assuming H₀ is true.', hint: 'The p-value is computed under the assumption that H₀ is true.' },
    { id: 'zt-mc-12', type: 'multiple-choice', question: 'σ = 15, n = 100. What is the standard error?', options: [ { id: 'a', text: '15', isCorrect: false, explanation: 'SE = σ/√n = 15/10 = 1.5, not 15.' }, { id: 'b', text: '1.5', isCorrect: true, explanation: 'SE = 15/√100 = 15/10 = 1.5. Correct.' }, { id: 'c', text: '0.15', isCorrect: false, explanation: 'SE = 15/√100 = 1.5. Dividing by 100 instead of √100 gives this error.' }, { id: 'd', text: '150', isCorrect: false, explanation: 'SE = σ/√n — you divide σ by √n, not multiply.' }, ], explanation: 'SE = σ/√n = 15/√100 = 15/10 = 1.5.', hint: 'SE = σ divided by the square root of n.' },
    { id: 'zt-mc-13', type: 'multiple-choice', question: 'A z-test yields z = −2.5 for a one-tailed left test (H₁: μ < μ₀) with α = 0.05. What do you conclude?', options: [ { id: 'a', text: 'Fail to reject H₀ — z must be positive to reject', isCorrect: false, explanation: 'For a left-tailed test, negative z values lead to rejection. Sign matters here.' }, { id: 'b', text: 'Reject H₀ — z = −2.5 < −1.645', isCorrect: true, explanation: 'Left-tailed critical value: −1.645. Since −2.5 < −1.645, we reject H₀.' }, { id: 'c', text: 'Fail to reject H₀ — |z| = 2.5 < 1.96', isCorrect: false, explanation: '1.96 is for two-tailed tests. For one-tailed α = 0.05, the threshold is 1.645.' }, { id: 'd', text: 'Reject H₀ only if α = 0.01', isCorrect: false, explanation: 'At α = 0.05, z* = −1.645. Since −2.5 < −1.645, we reject at α = 0.05 already.' }, ], explanation: 'One-tailed left: reject when z < −z*. z* = 1.645 for α = 0.05. −2.5 < −1.645 → reject H₀.', hint: 'Left-tailed rejection region: z < −z*.' },
    { id: 'zt-mc-14', type: 'multiple-choice', question: 'Which assumption is NOT required for a z-test on x̄?', options: [ { id: 'a', text: 'The population standard deviation σ is known', isCorrect: false, explanation: 'σ must be known to use a z-test — this IS a required assumption.' }, { id: 'b', text: 'The sample is randomly selected', isCorrect: false, explanation: 'Random sampling is required for valid inference.' }, { id: 'c', text: 'The sample data must follow a normal distribution', isCorrect: true, explanation: 'By the CLT, x̄ is approximately normal for large n even if the raw data are not. This is NOT a strict requirement.' }, { id: 'd', text: 'The sample mean x̄ is used as an estimate', isCorrect: false, explanation: 'Using x̄ as an estimate is fundamental to the z-test setup.' }, ], explanation: 'The z-test requires normality of x̄, not of the raw data. The CLT ensures x̄ is approximately normal for large n.', hint: 'What does the CLT guarantee about x̄ for large n?' },
    { id: 'zt-mc-15', type: 'multiple-choice', question: 'You run a z-test and get p = 0.048 at α = 0.05. Your colleague reruns it with α = 0.01. What changes?', options: [ { id: 'a', text: 'The z-statistic changes', isCorrect: false, explanation: 'The z-statistic depends only on the data and H₀ — not on α.' }, { id: 'b', text: 'The p-value changes', isCorrect: false, explanation: 'The p-value is a property of the data — it does not change when α changes.' }, { id: 'c', text: 'The conclusion changes — now fail to reject H₀', isCorrect: true, explanation: 'p = 0.048. At α = 0.05, 0.048 < 0.05 → reject. At α = 0.01, 0.048 > 0.01 → fail to reject. The decision changes.' }, { id: 'd', text: 'Nothing changes — p-value determines the outcome regardless of α', isCorrect: false, explanation: 'The decision depends on comparing p to α. Different α can reverse the conclusion.' }, ], explanation: 'p = 0.048 < 0.05 → reject at α=0.05. But 0.048 > 0.01 → fail to reject at α=0.01. Only the decision changes, not z or p.', hint: 'Compare the same p-value to two different α levels.' },
  ],
  keyTakeaway:
    'The z-test uses z = (x̄ − μ₀)/(σ/√n). Use it when σ is known or n ≥ 30. Compare |z| to z* or p-value to α. In most practical situations with unknown σ and small n, use a t-test instead.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The Z vs T Decision Tree — "Do You Know Sigma?"</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
          <div className="font-bold text-blue-900 mb-1">✅ Use Z when…</div>
          <ul className="space-y-1 text-blue-800 text-xs">
            <li>σ is <strong>known</strong> (given in the problem)</li>
            <li>OR n ≥ 30 (CLT kicks in)</li>
            <li>Critical values: 1.645 (one-tail) / 1.96 (two-tail)</li>
          </ul>
        </div>
        <div className="bg-purple-50 border border-purple-300 rounded-lg p-3">
          <div className="font-bold text-purple-900 mb-1">🔄 Use T when…</div>
          <ul className="space-y-1 text-purple-800 text-xs">
            <li>σ is <strong>unknown</strong></li>
            <li>AND n &lt; 30</li>
            <li>Critical values come from t-table with df = n−1</li>
          </ul>
        </div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-xs text-violet-800">
        <strong>Formula skeleton:</strong> z = <strong>(x̄ − μ₀)</strong> / <strong>(σ/√n)</strong>.
        Numerator = how far off; denominator = how much wobble per sample.
        Big |z| → reject.
      </div>
    </div>
  ),
  visualization: <ZTestViz />,
  datasetGenerator: false,
}

export default function ZTest({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
