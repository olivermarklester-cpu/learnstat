import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, independentTTest, tToPValue, pooledSD } from '../../../utils/stats'

// ── Interactive independent t-test calculator ─────────────────────────────────

function IndependentTViz() {
  const [xbar1, setXbar1] = useState(78)
  const [s1, setS1] = useState(10)
  const [n1, setN1] = useState(20)
  const [xbar2, setXbar2] = useState(72)
  const [s2, setS2] = useState(12)
  const [n2, setN2] = useState(20)
  const [tails, setTails] = useState(2)
  const [alpha, setAlpha] = useState(0.05)

  const result = independentTTest(xbar1, s1, n1, xbar2, s2, n2)
  const t = result ? round(result.t, 4) : '—'
  const df = result ? result.df : '—'
  const p = result ? round(tToPValue(result.t, result.df, tails), 4) : '—'
  const sp = result ? round(pooledSD(s1, n1, s2, n2), 4) : '—'
  const reject = typeof p === 'number' && p <= alpha

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-2 text-xs font-medium text-textMuted">
        <div>Group 1</div>
        <div>Group 2</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'x̄₁', min: 50, max: 100, step: 0.5, value: xbar1, set: setXbar1 },
          { label: 'x̄₂', min: 50, max: 100, step: 0.5, value: xbar2, set: setXbar2 },
          { label: 's₁', min: 1, max: 25, step: 0.5, value: s1, set: setS1 },
          { label: 's₂', min: 1, max: 25, step: 0.5, value: s2, set: setS2 },
          { label: 'n₁', min: 3, max: 100, step: 1, value: n1, set: setN1 },
          { label: 'n₂', min: 3, max: 100, step: 1, value: n2, set: setN2 },
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
          <div className="text-blue-600 font-medium">Pooled sp</div>
          <div className="text-blue-900 font-bold text-lg">{sp}</div>
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

      <div className={`rounded-lg p-2 border text-center text-sm font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {reject ? `Reject H₀ — groups differ significantly` : `Fail to reject H₀ — no significant difference`}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Independent-samples T-test',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Compare the means of two independent groups using the independent-samples t-test.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>independent-samples t-test</strong> tests whether the means of two separate,
        unrelated groups are equal. For example: do males and females have different average
        exam scores? Does a treatment group differ from a control group?
      </p>
      <p>
        <strong>H₀: μ₁ = μ₂</strong> (the two population means are equal, or equivalently,
        μ₁ − μ₂ = 0).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Equal variance version (pooled t-test)</p>
        <p className="text-blue-800">
          Assumes both groups have the same population variance σ². The pooled SD (s_p)
          combines both sample SDs into one estimate.
          df = n₁ + n₂ − 2.
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A pharmacist gives Drug A to 30 patients and Drug B to a different 30 patients, then
        measures blood pressure reduction. The independent-samples t-test asks: "Is the mean
        reduction in Group A significantly different from Group B?" The groups are independent
        — completely different people.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'independent-samples-t-test',
    title: 'How the Independent T-Test is built',
    steps: [
      {
        label: 'Pool the two Standard Deviations',
        symbolName: 'sp',
        highlightColor: 'green',
        from: 'sp = pooled SD of s₁ and s₂',
        to: 'sp = √[ ((n₁−1)s₁² + (n₂−1)s₂²) / (n₁+n₂−2) ]',
        note: 'sp² is a weighted average of the two sample variances (weights n−1) — larger groups contribute more. sp is its square root and estimates the common population SD.',
      },
      {
        label: 'Build the combined Standard Error',
        symbolName: 'SE',
        highlightColor: 'orange',
        from: 't = (x̄₁ − x̄₂) / SE',
        to: 't = (x̄₁ − x̄₂) / (sp × √(1/n₁ + 1/n₂))',
        note: 'The denominator combines both group sizes into a single standard error for the difference between means.',
      },
    ],
    finalFormula: 't = (x̄₁ − x̄₂) / (sp × √(1/n₁ + 1/n₂))',
  },
  formula: {
    main: 't = (x̄₁ − x̄₂) / (sp × √(1/n₁ + 1/n₂))',
    variants: [
      { label: 'Test statistic (pooled)', expression: 't = (x̄₁ − x̄₂) / (sp × √(1/n₁ + 1/n₂))', latex: 't = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{\\frac{1}{n_1}+\\frac{1}{n_2}}}' },
      { label: 'Pooled SD', expression: 'sp = √[((n₁−1)s₁² + (n₂−1)s₂²) / (n₁+n₂−2)]', latex: 's_p = \\sqrt{\\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1+n_2-2}}' },
      { label: 'Degrees of freedom', expression: 'df = n₁ + n₂ − 2', latex: 'df = n_1 + n_2 - 2' },
    ],
    symbolGuide: [
      { symbol: 'x̄₁, x̄₂', meaning: 'Sample means of group 1 and group 2' },
      { symbol: 's₁, s₂', meaning: 'Sample standard deviations' },
      { symbol: 'n₁, n₂', meaning: 'Sample sizes' },
      { symbol: 'sp', meaning: 'Pooled standard deviation — square root of the df-weighted average of s₁² and s₂²' },
      { symbol: 'df', meaning: 'Degrees of freedom = n₁ + n₂ − 2' },
    ],
  },
  whenToUse: [
    'Comparing means from two independent (unrelated) groups',
    'Randomised controlled trials, A/B tests, observational group comparisons',
  ],
  whenNotToUse: [
    'When the same participants appear in both groups — use paired t-test instead',
    'When groups have very different variances and unequal n — use Welch\'s t-test',
    'For more than two groups — use ANOVA',
  ],
  assumptions: [
    'Observations within each group are independent',
    'The two groups are independent of each other',
    'Both populations are approximately normally distributed (relaxed for large n)',
    'Equal variances in both populations (for the pooled version)',
  ],
  workedExample: {
    scenario:
      'Group A (taught with Method X): n₁ = 15, x̄₁ = 82, s₁ = 10. Group B (standard): n₂ = 15, x̄₂ = 75, s₂ = 9. Test H₀: μ₁ = μ₂ at α = 0.05 (two-tailed).',
    steps: [
      { stepNumber: 1, label: 'Pooled SD', expression: 'sp = √[((14×100)+(14×81))/28] = √[2534/28]', result: 'sp ≈ 9.51', explanation: 'Weighted combination of both sample SDs.' },
      { stepNumber: 2, label: 'SE of difference', expression: 'SE = 9.51 × √(1/15 + 1/15) = 9.51 × 0.365', result: 'SE ≈ 3.47', explanation: 'Standard error of the difference in means.' },
      { stepNumber: 3, label: 't statistic', expression: 't = (82 − 75)/3.47 = 7/3.47', result: 't ≈ 2.02, df = 28', explanation: '2.02 standard errors above zero.' },
      { stepNumber: 4, label: 'Decision', expression: 't* (df=28, two-tailed, α=0.05) ≈ 2.048. |t| = 2.02 < 2.048', result: 'Fail to reject H₀ (barely)', explanation: 'p ≈ 0.054 — just above α = 0.05.' },
    ],
    interpretation:
      'There is a borderline non-significant difference (t = 2.02, df = 28, p ≈ 0.054). Method X appears better but the evidence is not quite sufficient at α = 0.05 with these sample sizes.',
  },
  interpretation:
    'The independent-samples t-test compares means across two unrelated groups. Always check that the groups are truly independent. Report the mean difference and confidence interval alongside the p-value.',
  commonMistakes: [
    { mistake: 'Using independent-samples t when data is paired', explanation: 'If the same subjects are measured twice (before/after), the paired t-test is more appropriate and more powerful.' },
    { mistake: 'Assuming equal variances without checking', explanation: 'If s₁ and s₂ differ greatly, use Welch\'s t-test which does not assume equal variances.' },
    { mistake: 'Forgetting df = n₁ + n₂ − 2', explanation: 'Each sample contributes one degree of freedom less — total df = n₁+n₂−2.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'itt-easy-1', scenario: 'Group A: n=10, x̄=50, s=5. Group B: n=10, x̄=45, s=5.', question: 'Calculate sp and the t statistic.', hint: 'sp = s since both are equal. t = (50−45)/(sp×√(2/n)).', solution: 'sp = 5. SE = 5×√(2/10) = 5×0.447 = 2.24. t = 5/2.24 ≈ 2.24.' },
    ],
    moderate: [
      { id: 'itt-mod-1', scenario: 'Males: n=25, x̄=72, s=8. Females: n=25, x̄=68, s=9. Two-tailed α=0.05.', question: 'Find sp and t. t*(df=48, α=0.05) ≈ 2.011. Decision?', hint: 'sp = √[((24×64)+(24×81))/48].', solution: 'sp = √[3480/48] = √72.5 ≈ 8.51. SE = 8.51×√(0.08) = 2.41. t = 4/2.41 ≈ 1.66. |t|=1.66 < 2.011 → fail to reject H₀.' },
    ],
    challenging: [
      { id: 'itt-chal-1', scenario: 'A study claims a new drug reduces reaction time by 10 ms. Control: n=30, x̄=200ms, s=25ms. Treatment: n=30, x̄=189ms, s=28ms.', question: 'Test whether there is a significant difference. α=0.05, two-tailed.', hint: 'df=58. t*(58, 0.05) ≈ 2.002.', solution: 'sp=√[((29×625)+(29×784))/58]=√[40861/58]≈√704.5≈26.5. SE=26.5×√(2/30)=26.5×0.258≈6.85. t=(200-189)/6.85=11/6.85≈1.61. |t|<2.002 → fail to reject H₀. The observed 11ms difference is not statistically significant at this sample size.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'itt-kc-1', type: 'multiple-choice',
      question: 'When should you use an independent-samples t-test?',
      options: [
        { id: 'a', text: 'Comparing the same people\'s scores before and after a treatment', isCorrect: false, explanation: 'Before/after on the same people → paired t-test.' },
        { id: 'b', text: 'Comparing the mean exam scores of two different classes', isCorrect: true, explanation: 'Correct! Two separate, unrelated groups → independent-samples t-test.' },
        { id: 'c', text: 'Testing if a single sample mean equals a specific value', isCorrect: false, explanation: 'Single sample vs known value → one-sample t-test.' },
        { id: 'd', text: 'Comparing means across three or more groups', isCorrect: false, explanation: 'Three or more groups → ANOVA.' },
      ],
      explanation: 'Independent-samples t-test: two unrelated groups compared on a continuous outcome.',
      hint: 'Are the two groups completely separate people/units?',
    },
    {
      id: 'itt-kc-2', type: 'multiple-choice',
      question: 'What are the degrees of freedom for an independent-samples t-test with n₁ = 12, n₂ = 15?',
      options: [
        { id: 'a', text: '27', isCorrect: false, explanation: 'df = n₁ + n₂ − 2 = 12 + 15 − 2 = 25.' },
        { id: 'b', text: '25', isCorrect: true, explanation: 'Correct! df = n₁ + n₂ − 2 = 25.' },
        { id: 'c', text: '26', isCorrect: false, explanation: 'Off by one — df loses 2 (one per group).' },
        { id: 'd', text: '11', isCorrect: false, explanation: 'That would be df for a single group (n₁ − 1).' },
      ],
      explanation: 'df = n₁ + n₂ − 2 = 12 + 15 − 2 = 25.',
      hint: 'Each group loses one degree of freedom.',
    },
    {
      id: 'itt-kc-3', type: 'multiple-choice',
      question: 'Why is the pooled SD (sp) used instead of just s₁ or s₂?',
      options: [
        { id: 'a', text: 'It always equals the larger of s₁ and s₂', isCorrect: false, explanation: 'sp is a weighted average — it lies between s₁ and s₂.' },
        { id: 'b', text: 'It combines both sample SDs into one estimate, weighting by group size', isCorrect: true, explanation: 'Correct! sp uses all data from both groups to get a more precise estimate of the common σ.' },
        { id: 'c', text: 'It makes the test statistic larger', isCorrect: false, explanation: 'Pooling improves precision, not necessarily the size of the t statistic.' },
        { id: 'd', text: 'It removes the need for normality assumptions', isCorrect: false, explanation: 'Normality is still assumed; pooling addresses the common variance assumption.' },
      ],
      explanation: 'sp is a weighted average of s₁ and s₂ (weighted by df = n−1 for each group). It assumes σ₁ = σ₂ and pools all information for a better estimate.',
      hint: 'What does "pooled" mean — combining or choosing?',
    },
    {
      id: 'itt-kc-4', type: 'multiple-choice',
      question: 'Group A: n=10, x̄=60, s=8. Group B: n=10, x̄=60, s=8. What will t equal?',
      options: [
        { id: 'a', text: 't = 1', isCorrect: false, explanation: 'The means are identical — numerator (x̄₁ − x̄₂) = 0.' },
        { id: 'b', text: 't = 0', isCorrect: true, explanation: 'Correct! When x̄₁ = x̄₂, the numerator is 0 and t = 0.' },
        { id: 'c', text: 't = 8', isCorrect: false, explanation: 't is not equal to the SD.' },
        { id: 'd', text: 'Cannot be calculated', isCorrect: false, explanation: 'All values are provided — t is simply 0.' },
      ],
      explanation: 't = (x̄₁ − x̄₂) / SE. When x̄₁ = x̄₂, the numerator is 0 so t = 0.',
      hint: 'What is x̄₁ − x̄₂?',
    },
    {
      id: 'itt-kc-5', type: 'numerical',
      question: 'n₁ = 20, n₂ = 20. What is df for the pooled independent t-test?',
      answer: 38,
      tolerance: 0,
      explanation: 'df = n₁ + n₂ − 2 = 20 + 20 − 2 = 38.',
      hint: 'df = n₁ + n₂ − 2.',
    },
    { id: 'itt-tf-1', type: 'true-false', question: 'The independent samples t-test is appropriate when the two groups share the same participants.', isTrue: false, explanation: 'False. Shared participants means paired data — use a paired t-test. The independent t-test requires completely separate groups.' },
    { id: 'itt-tf-2', type: 'true-false', question: 'The pooled variance sp² assumes that both groups have equal population variances.', isTrue: true, explanation: 'Correct. The pooled formula sp² = [(n₁−1)s₁² + (n₂−1)s₂²] / (n₁+n₂−2) is only valid when σ₁² = σ₂².' },
    { id: 'itt-tf-3', type: 'true-false', question: 'For an independent samples t-test with n₁ = 12 and n₂ = 15, df = 25.', isTrue: true, explanation: 'df = n₁ + n₂ − 2 = 12 + 15 − 2 = 25. Correct.' },
    { id: 'itt-tf-4', type: 'true-false', question: 'A t-statistic of 0 in an independent samples test means both groups have identical standard deviations.', isTrue: false, explanation: 'False. t = 0 means x̄₁ = x̄₂ (equal means). The standard deviations are irrelevant to the sign of t.' },
    { id: 'itt-tf-5', type: 'true-false', question: "Welch's t-test is preferred when group variances are unequal.", isTrue: true, explanation: "Correct. Welch's t-test does not assume equal variances and uses adjusted degrees of freedom. It is more robust than the pooled t-test." },
    { id: 'itt-tf-6', type: 'true-false', question: 'The standard error for the independent samples t-test is sp × √(1/n₁ + 1/n₂).', isTrue: true, explanation: 'Yes. SE = sp × √(1/n₁ + 1/n₂) where sp is the pooled SD. This is the estimated SD of (x̄₁ − x̄₂).' },
    { id: 'itt-tf-7', type: 'true-false', question: 'If Group 1 has a larger mean than Group 2, the t-statistic will always be positive.', isTrue: false, explanation: 'False. Whether t is positive depends on how you label the groups. If you calculate t = (x̄₂ − x̄₁)/SE, t would be negative.' },
    { id: 'itt-tf-8', type: 'true-false', question: 'An independent samples t-test can test whether two population means are equal.', isTrue: true, explanation: 'Yes. H₀: μ₁ = μ₂ (or μ₁ − μ₂ = 0). The test assesses whether the observed difference x̄₁ − x̄₂ is consistent with chance.' },
    { id: 'itt-tf-9', type: 'true-false', question: 'Larger within-group variability makes it easier to detect a difference between means.', isTrue: false, explanation: 'False. Larger within-group variability increases SE, making it harder to detect a real difference (lower power).' },
    { id: 'itt-tf-10', type: 'true-false', question: 'The independent samples t-test requires both groups to have the same sample size.', isTrue: false, explanation: 'False. The formula handles unequal n₁ and n₂. Equal sample sizes are preferred but not required.' },
    { id: 'itt-tf-11', type: 'true-false', question: 'A statistically significant independent samples t-test proves that one treatment causes the other group to differ.', isTrue: false, explanation: 'False. Significance shows a difference this large would be unlikely if H₀ were true, but not causation. Causation requires experimental design (random assignment).' },
    { id: 'itt-tf-12', type: 'true-false', question: 'The pooled variance sp² is a weighted average of the two sample variances.', isTrue: true, explanation: 'Correct. sp² = [(n₁−1)s₁² + (n₂−1)s₂²] / (n₁+n₂−2) — each variance is weighted by its df (n−1).' },
    { id: 'itt-tf-13', type: 'true-false', question: 'Using a paired t-test when data are actually independent will always give the correct result.', isTrue: false, explanation: 'False. Using the wrong test model can distort df and SE, leading to incorrect p-values and potentially wrong conclusions.' },
    { id: 'itt-tf-14', type: 'true-false', question: 'If p = 0.06 and α = 0.05, we fail to reject H₀ in an independent samples t-test.', isTrue: true, explanation: 'Yes. Since p = 0.06 > α = 0.05, we do not have sufficient evidence at the 5% level to reject H₀.' },
    { id: 'itt-tf-15', type: 'true-false', question: 'The independent samples t-test becomes a z-test when n₁ and n₂ are very large.', isTrue: true, explanation: 'As n → ∞, df → ∞ and the t-distribution converges to N(0,1), so t and z give equivalent results for very large samples.' },
    { id: 'itt-tf-16', type: 'true-false', question: 'Equal sample sizes (n₁ = n₂) maximise the power of the independent samples t-test for a fixed total N.', isTrue: true, explanation: 'Yes. For a fixed total N = n₁ + n₂, power is maximised when n₁ = n₂ (assuming equal variances) because the SE is minimised at balance.' },
    { id: 'itt-tf-17', type: 'true-false', question: 'The independent samples t-test can be used to compare three group means simultaneously.', isTrue: false, explanation: 'False. For three or more groups, use ANOVA. Running multiple t-tests inflates the Type I error rate.' },
    { id: 'itt-tf-18', type: 'true-false', question: 'The null hypothesis for an independent samples t-test is H₀: μ₁ − μ₂ = 0.', isTrue: true, explanation: 'Correct. H₀ states no difference between the two population means. Equivalently, H₀: μ₁ = μ₂.' },
    { id: 'itt-tf-19', type: 'true-false', question: 'A larger raw mean difference (x̄₁ − x̄₂) always produces a larger t-statistic.', isTrue: false, explanation: 'Not always — t also depends on SE. If SE is very large, even a big mean difference can yield a small t.' },
    { id: 'itt-tf-20', type: 'true-false', question: 'The independent samples t-test assumes the observations within each group are independent.', isTrue: true, explanation: 'Yes. Independence within and between groups is a core assumption. Violations (e.g., clustered data) invalidate standard SEs.' },
    { id: 'itt-mc-6', type: 'multiple-choice', question: 'x̄₁ = 80, x̄₂ = 74, sp = 5, n₁ = n₂ = 25. What is t?', options: [ { id: 'a', text: 't = 4.24', isCorrect: true, explanation: 'SE = sp×√(1/25+1/25) = 5×√(0.08) = 5×0.283 = 1.414. t = (80−74)/1.414 = 6/1.414 ≈ 4.24.' }, { id: 'b', text: 't = 1.2', isCorrect: false, explanation: 'SE = 5√(2/25) = 5×0.283 = 1.414. t = 6/1.414 ≈ 4.24.' }, { id: 'c', text: 't = 6.0', isCorrect: false, explanation: 't = (x̄₁−x̄₂)/SE = 6/1.414 ≈ 4.24, not 6.' }, { id: 'd', text: 't = 2.12', isCorrect: false, explanation: 'SE = 5√(2/25) ≈ 1.414. t = 6/1.414 ≈ 4.24.' }, ], explanation: 'SE = sp×√(1/n₁+1/n₂) = 5×√(2/25) ≈ 1.414. t = 6/1.414 ≈ 4.24.', hint: 'Compute SE = sp×√(1/n₁+1/n₂), then t = (x̄₁−x̄₂)/SE.' },
    { id: 'itt-mc-7', type: 'multiple-choice', question: 'Which scenario VIOLATES the independence assumption of the independent samples t-test?', options: [ { id: 'a', text: 'Randomly assigning 20 people to Treatment A and 20 different people to Treatment B', isCorrect: false, explanation: 'Random assignment to separate groups — independence is satisfied.' }, { id: 'b', text: 'Measuring the same 20 people before and after treatment', isCorrect: true, explanation: 'Correct. Measuring the same people twice creates paired (dependent) data — use a paired t-test instead.' }, { id: 'c', text: 'Using different classrooms for Group 1 and Group 2', isCorrect: false, explanation: 'Different classrooms for different groups is consistent with independent samples.' }, { id: 'd', text: 'Having unequal sample sizes in each group', isCorrect: false, explanation: 'Unequal sample sizes are fine — they do not violate independence.' }, ], explanation: 'Measuring the same individuals twice creates paired data, violating the independence assumption of the independent samples t-test.', hint: 'Which design has the same participants in both conditions?' },
    { id: 'itt-mc-8', type: 'multiple-choice', question: 'n₁ = 18, n₂ = 14. What is df for the pooled independent t-test?', options: [ { id: 'a', text: '30', isCorrect: true, explanation: 'df = n₁ + n₂ − 2 = 18 + 14 − 2 = 30.' }, { id: 'b', text: '31', isCorrect: false, explanation: 'df = 18 + 14 − 2 = 30, not 31.' }, { id: 'c', text: '32', isCorrect: false, explanation: 'df = n₁ + n₂ − 2 = 30, not 32. Subtract 2, not 0.' }, { id: 'd', text: '14', isCorrect: false, explanation: 'df = n₁ + n₂ − 2 = 30. The smaller n is not the df here.' }, ], explanation: 'df = n₁ + n₂ − 2 = 18 + 14 − 2 = 30.', hint: 'df = total sample size minus 2.' },
    { id: 'itt-mc-9', type: 'multiple-choice', question: 'When should you prefer the paired t-test over the independent samples t-test?', options: [ { id: 'a', text: 'When the two groups have unequal variances', isCorrect: false, explanation: 'Unequal variances → Welch\'s t, not paired t-test.' }, { id: 'b', text: 'When participants in Group 1 are naturally matched to participants in Group 2', isCorrect: true, explanation: 'Correct. Matching (e.g., twins, before/after) creates paired data. The paired t-test uses these pairs to reduce error variance.' }, { id: 'c', text: 'When n₁ ≠ n₂', isCorrect: false, explanation: 'Unequal n is fine for independent t-tests. A paired test requires equal n (one pair per person).' }, { id: 'd', text: 'When the sample size is very large', isCorrect: false, explanation: 'Sample size does not determine which test to use — the design does.' }, ], explanation: 'Use paired t-test when measurements are matched or repeated within the same participant. It reduces unexplained variance by controlling for individual differences.', hint: 'The choice depends on the study design, not statistical properties of the data.' },
    { id: 'itt-mc-10', type: 'multiple-choice', question: 'The pooled standard deviation sp is:',  options: [ { id: 'a', text: 'The average of s₁ and s₂', isCorrect: false, explanation: 'Simple averaging ignores sample sizes. sp² is a weighted average of s₁² and s₂² using df as weights.' }, { id: 'b', text: 'The square root of [(n₁−1)s₁² + (n₂−1)s₂²] / (n₁+n₂−2)', isCorrect: true, explanation: 'Correct. sp = √{[(n₁−1)s₁² + (n₂−1)s₂²] / (n₁+n₂−2)}. It is the df-weighted pooled variance, then square-rooted.' }, { id: 'c', text: '(s₁ + s₂) / 2', isCorrect: false, explanation: 'This simple average ignores the different sample sizes.' }, { id: 'd', text: 's₁ × s₂', isCorrect: false, explanation: 'Multiplying SDs has no statistical meaning here.' }, ], explanation: 'sp² = [(n₁−1)s₁² + (n₂−1)s₂²] / (n₁+n₂−2). It weights each variance by its df (n−1), then pools them.', hint: 'Pool the variances first (weighted average), then take the square root.' },
    { id: 'itt-mc-11', type: 'multiple-choice', question: 'What does it mean if the 95% CI for μ₁ − μ₂ does NOT include 0?', options: [ { id: 'a', text: 'The test is statistically significant at α = 0.05', isCorrect: true, explanation: 'Correct. A CI for the difference that excludes 0 is equivalent to rejecting H₀: μ₁ − μ₂ = 0 at α = 0.05.' }, { id: 'b', text: 'The two groups must have equal variances', isCorrect: false, explanation: 'The CI excluding 0 tells us about the difference in means, not about equality of variances.' }, { id: 'c', text: 'The p-value is greater than 0.05', isCorrect: false, explanation: 'If the CI excludes 0, then p < 0.05 — the result IS significant.' }, { id: 'd', text: 'The result is practically important', isCorrect: false, explanation: 'Statistical significance ≠ practical importance. The CI tells us the difference is non-zero, not that it matters in practice.' }, ], explanation: 'CI for μ₁−μ₂ excluding 0 ⟺ reject H₀: μ₁=μ₂ at α = 1 − confidence level. This is the duality of CI and hypothesis testing.', hint: 'What does it mean for the difference confidence interval to not overlap zero?' },
    { id: 'itt-mc-12', type: 'multiple-choice', question: 'Which assumption is shared by BOTH the independent and one-sample t-tests?', options: [ { id: 'a', text: 'Both groups have equal population variances', isCorrect: false, explanation: 'The equal variance assumption is specific to the pooled independent t-test, not the one-sample t-test.' }, { id: 'b', text: 'Random sampling and approximate normality of x̄', isCorrect: true, explanation: 'Correct. Both tests assume random sampling and that x̄ is approximately normally distributed (via population normality or CLT).' }, { id: 'c', text: 'The two samples are paired', isCorrect: false, explanation: 'Pairing is the design assumption of the paired t-test, not the one-sample or independent t-test.' }, { id: 'd', text: 'n must be at least 30', isCorrect: false, explanation: 'n ≥ 30 is a rule of thumb for the CLT. Both t-tests can be valid for smaller n if populations are normal.' }, ], explanation: 'Random sampling and normality of x̄ (or x̄₁−x̄₂) are shared assumptions. Equal variance is only for the pooled independent t-test.', hint: 'Think about what both tests need regardless of whether you have one sample or two.' },
    { id: 'itt-mc-13', type: 'multiple-choice', question: 's₁ = 10, s₂ = 10, n₁ = 16, n₂ = 16. What is sp?', options: [ { id: 'a', text: '5', isCorrect: false, explanation: 'sp = √{[(15×100)+(15×100)]/30} = √100 = 10, not 5.' }, { id: 'b', text: '10', isCorrect: true, explanation: 'When s₁ = s₂ = s, sp = s. sp² = [(n₁−1)s₁²+(n₂−1)s₂²]/(n₁+n₂−2) = [(15+15)×100]/30 = 100. sp = 10.' }, { id: 'c', text: '20', isCorrect: false, explanation: 'sp ≠ s₁ + s₂. When both SDs are equal, sp equals that common SD.' }, { id: 'd', text: '14.14', isCorrect: false, explanation: 'sp = √100 = 10. The √2 factor does not appear here.' }, ], explanation: 'When s₁ = s₂, sp = s₁ = s₂. The pooled SD equals the common SD.', hint: 'What happens to sp when both sample SDs are equal?' },
    { id: 'itt-mc-14', type: 'multiple-choice', question: 'A researcher finds t = 1.8, df = 40, α = 0.05 (two-tailed), t* = 2.021. The correct action is:', options: [ { id: 'a', text: 'Reject H₀ — the effect is practically significant', isCorrect: false, explanation: 'We cannot reject H₀ since |1.8| < 2.021. Also, statistical and practical significance are different concepts.' }, { id: 'b', text: 'Fail to reject H₀ — insufficient evidence of a mean difference', isCorrect: true, explanation: 'Correct. |t| = 1.8 < t* = 2.021 → fail to reject H₀ at α = 0.05.' }, { id: 'c', text: 'Reject H₀ — t > 1.645', isCorrect: false, explanation: '1.645 is the one-tailed z* for α = 0.05. For a two-tailed test with df = 40, use t* = 2.021.' }, { id: 'd', text: 'Conduct another test to confirm', isCorrect: false, explanation: 'You compare t to the critical value — no additional test is needed for the decision.' }, ], explanation: '|t| = 1.8 < t* = 2.021 → fail to reject H₀. The data are consistent with no population mean difference.', hint: 'Compare |t| to t* for two-tailed tests.' },
    { id: 'itt-mc-15', type: 'multiple-choice', question: 'Which of the following BEST explains why the independent samples t-test uses df = n₁ + n₂ − 2?', options: [ { id: 'a', text: 'One df is lost for each sample mean estimated', isCorrect: true, explanation: 'Correct. We estimate μ₁ with x̄₁ (lose 1 df) and μ₂ with x̄₂ (lose 1 df), for a total of df = n₁ + n₂ − 2.' }, { id: 'b', text: 'Two df are lost for the two test statistics', isCorrect: false, explanation: 'df are lost for the estimated group means (one per group), not for test statistics — two means → 2 df lost.' }, { id: 'c', text: 'df is always one less than total N', isCorrect: false, explanation: 'For a one-sample t-test, df = n−1. For two-sample, df = n₁+n₂−2 = N−2.' }, { id: 'd', text: 'The pooled variance requires n₁ and n₂ to be identical', isCorrect: false, explanation: 'The pooled formula works for any n₁ and n₂. df = n₁+n₂−2 regardless.' }, ], explanation: 'Each estimated mean costs one df. Two groups, two estimated means → df = n₁+n₂−2.', hint: 'How many parameters are estimated to compute the pooled SE?' },
  ],
  keyTakeaway:
    't = (x̄₁ − x̄₂) / (sp × √(1/n₁ + 1/n₂)) with df = n₁+n₂−2. Use for two independent groups. The pooled version assumes equal variances (use Welch\'s t otherwise). Not for paired data.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The Three T-test Selector</p>
      <p className="text-sm text-violet-800">Ask three questions to pick the right t-test:</p>
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-2">
          <span className="font-bold text-blue-800 text-sm mt-0.5">1</span>
          <div>
            <span className="font-semibold text-blue-800">How many groups?</span>
            <span className="text-blue-700"> One group → one-sample t. Two groups → continue.</span>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 rounded p-2">
          <span className="font-bold text-indigo-800 text-sm mt-0.5">2</span>
          <div>
            <span className="font-semibold text-indigo-800">Same or different people?</span>
            <span className="text-indigo-700"> Same → paired t. Different → independent t.</span>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded p-2">
          <span className="font-bold text-violet-800 text-sm mt-0.5">3</span>
          <div>
            <span className="font-semibold text-violet-800">Equal variances?</span>
            <span className="text-violet-700"> Yes → pooled (df = n₁+n₂−2). Unequal → Welch&apos;s t.</span>
          </div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
        <strong>Formula anchor:</strong> t = (x̄₁ − x̄₂) / SE. Numerator = difference in means. Denominator = pooled uncertainty about that difference.
      </div>
    </div>
  ),
  visualization: <IndependentTViz />,
  datasetGenerator: false,
}

export default function IndependentSamplesTTest({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
