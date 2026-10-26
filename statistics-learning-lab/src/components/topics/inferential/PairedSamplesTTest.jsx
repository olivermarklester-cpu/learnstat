import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, pairedTTest, tToPValue } from '../../../utils/stats'

// ── Interactive paired t-test calculator ─────────────────────────────────────

const DEFAULT_PAIRS = [
  { before: 80, after: 72 },
  { before: 95, after: 88 },
  { before: 110, after: 105 },
  { before: 88, after: 80 },
  { before: 102, after: 96 },
  { before: 76, after: 70 },
]

function PairedTViz() {
  const [pairs, setPairs] = useState(DEFAULT_PAIRS)
  const [tails, setTails] = useState(2)
  const [alpha, setAlpha] = useState(0.05)

  const diffs = useMemo(() => pairs.map((p) => p.after - p.before), [pairs])
  const result = useMemo(() => pairedTTest(diffs), [diffs])
  const p = result ? round(tToPValue(result.t, result.df, tails), 4) : '—'
  const t = result ? round(result.t, 4) : '—'
  const dbar = result ? round(result.dbar, 2) : '—'
  const reject = typeof p === 'number' && p <= alpha

  function updatePair(i, field, val) {
    const updated = pairs.map((pair, idx) =>
      idx === i ? { ...pair, [field]: Number(val) } : pair
    )
    setPairs(updated)
  }

  return (
    <div>
      <div className="overflow-x-auto mb-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="border border-border p-1 text-textMuted">Pair</th>
              <th className="border border-border p-1 text-textMuted">Before</th>
              <th className="border border-border p-1 text-textMuted">After</th>
              <th className="border border-border p-1 text-primary">d = After−Before</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, i) => (
              <tr key={i}>
                <td className="border border-border p-1 text-center text-textMuted">{i + 1}</td>
                <td className="border border-border p-0.5">
                  <input type="number" value={pair.before} min={0} max={200}
                    onChange={(e) => updatePair(i, 'before', e.target.value)}
                    className="w-full text-center text-xs border-0 bg-transparent outline-none" />
                </td>
                <td className="border border-border p-0.5">
                  <input type="number" value={pair.after} min={0} max={200}
                    onChange={(e) => updatePair(i, 'after', e.target.value)}
                    className="w-full text-center text-xs border-0 bg-transparent outline-none" />
                </td>
                <td className={`border border-border p-1 text-center font-medium ${diffs[i] < 0 ? 'text-red-600' : diffs[i] > 0 ? 'text-emerald-600' : 'text-textMuted'}`}>
                  {diffs[i] > 0 ? '+' : ''}{diffs[i]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mb-3">
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
          <div className="text-blue-600 font-medium">d̄ (mean diff)</div>
          <div className="text-blue-900 font-bold text-lg">{dbar}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">t (df={result?.df ?? '—'})</div>
          <div className="text-purple-900 font-bold text-lg">{t}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="text-amber-600 font-medium">p-value</div>
          <div className="text-amber-900 font-bold text-lg">{p}</div>
        </div>
      </div>

      <div className={`rounded-lg p-2 border text-center text-sm font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {reject ? 'Reject H₀ — significant change' : 'Fail to reject H₀ — no significant change'}
      </div>
      <p className="text-xs text-gray-500 mt-1">Edit before/after values directly in the table.</p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Paired-samples T-test',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Explain when and how to apply the paired-samples t-test, and distinguish it from the independent-samples t-test.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>paired-samples t-test</strong> compares measurements taken from the
        <strong> same subjects</strong> under two conditions (e.g., before and after, or
        two matched conditions). Because the observations are paired, we compute the
        <em> difference</em> for each subject and then perform a one-sample t-test on
        those differences.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Why pairing is more powerful</p>
        <p className="text-blue-800">
          Pairing removes between-subject variability. If subjects differ widely from one
          another, that variability inflates SE in an independent t-test. Pairing controls
          for this, producing a more sensitive test.
        </p>
      </div>
      <p>
        <strong>H₀: μ_d = 0</strong> — the mean difference in the population is zero (no
        change). H₁ specifies a direction or inequality.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A physiotherapist measures a patient's flexibility before and after an 8-week exercise
        programme. Because each patient serves as their own control, individual differences in
        baseline flexibility are removed — the analysis focuses purely on the <em>change</em>
        within each person.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'paired-samples-t-test',
    title: 'How the Paired T-Test is built',
    steps: [
      {
        label: 'Start with the One-Sample T-Test structure',
        symbolName: 't-structure',
        highlightColor: 'purple',
        from: 't = (x̄ − μ₀) / SE',
        to: 't = d̄ / (sd / √n)',
        note: 'A paired t-test IS a one-sample t-test — applied to the differences (d) between each pair. d̄ replaces x̄, sd replaces s, and μ₀ = 0 (testing if the average difference is zero).',
      },
      {
        label: 'Recognise the Standard Error in the denominator',
        symbolName: 'SE_d',
        highlightColor: 'orange',
        from: 't = d̄ / SE_d',
        to: 't = d̄ / (sd / √n)',
        note: 'SE_d = sd/√n is the standard error of the differences — how much the average difference varies from sample to sample.',
      },
    ],
    finalFormula: 't = d̄ / (sd / √n)',
  },
  formula: {
    main: 't = d̄ / (sd / √n)',
    variants: [
      { label: 'Paired t-test statistic', expression: 't = d̄ / (sd / √n)', latex: 't = \\frac{\\bar{d}}{s_d / \\sqrt{n}}' },
      { label: 'Difference', expression: 'd_i = x_{i,after} − x_{i,before}', latex: 'd_i = x_{i,2} - x_{i,1}' },
      { label: 'Degrees of freedom', expression: 'df = n − 1  (n = number of pairs)', latex: 'df = n - 1' },
    ],
    symbolGuide: [
      { symbol: 'd̄', meaning: 'Mean of the differences (d̄ = Σdᵢ / n)' },
      { symbol: 'sd', meaning: 'Sample standard deviation of the differences' },
      { symbol: 'n', meaning: 'Number of pairs (not total observations)' },
      { symbol: 'df', meaning: 'Degrees of freedom = n − 1' },
    ],
  },
  whenToUse: [
    'Before-and-after studies on the same subjects',
    'Matched-pairs designs where each unit in group 1 is matched with one in group 2',
    'Repeated measures on the same subject under two conditions',
  ],
  whenNotToUse: [
    'When the two groups contain completely different, unrelated people — use independent t-test',
    'When you have more than two time points — use repeated-measures ANOVA',
  ],
  assumptions: [
    'Each pair is independent of other pairs',
    'The differences dᵢ are approximately normally distributed (or n is large enough)',
    'Observations within each pair are dependent (that is the point of pairing)',
  ],
  workedExample: {
    scenario:
      '6 patients have blood pressure measured before and after a new diet. Differences (after − before): −8, −7, −5, −8, −6, −7. Test H₀: μ_d = 0 vs H₁: μ_d < 0 at α = 0.05.',
    steps: [
      { stepNumber: 1, label: 'Calculate d̄', expression: 'd̄ = (−8−7−5−8−6−7)/6 = −41/6', result: 'd̄ ≈ −6.83', explanation: 'Mean of the paired differences.' },
      { stepNumber: 2, label: 'SD of differences', expression: 'sd ≈ 1.17 (calculated from the 6 differences)', result: 'sd ≈ 1.17', explanation: 'Standard deviation of d₁, …, d₆.' },
      { stepNumber: 3, label: 't statistic', expression: 't = −6.83 / (1.17/√6) = −6.83 / 0.477', result: 't ≈ −14.3, df = 5', explanation: 'Extremely large |t|.' },
      { stepNumber: 4, label: 'Decision', expression: 't*(df=5, one-tailed, α=0.05) ≈ −2.015. t = −14.3 << −2.015', result: 'Reject H₀', explanation: 'p << 0.001.' },
    ],
    interpretation:
      'Very strong evidence (t = −14.3, df = 5, p < 0.001) that the diet significantly reduces blood pressure.',
  },
  interpretation:
    'The paired t-test is simply a one-sample t-test on the differences. Pairing dramatically increases power when subjects vary widely at baseline.',
  commonMistakes: [
    { mistake: 'Treating paired data as independent', explanation: 'Using the independent t-test on paired data ignores the correlation between measurements and is less powerful (or invalid).' },
    { mistake: 'Using total n instead of number of pairs', explanation: 'If you have 20 subjects each measured twice, n = 20 (pairs), not 40.' },
    { mistake: 'Forgetting which direction the difference is calculated', explanation: 'Define d = (after − before) consistently for all pairs. A reversed sign changes the direction of H₁.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'pst-easy-1', scenario: 'Differences: +3, +1, +5, +2, +4. d̄ = 3, sd = 1.58, n = 5.', question: 'Calculate t.', hint: 't = d̄ / (sd/√n).', solution: 'SE = 1.58/√5 = 0.707. t = 3/0.707 ≈ 4.24.' },
    ],
    moderate: [
      { id: 'pst-mod-1', scenario: 'Exam scores for 8 students before and after tutoring. Differences: +5, +3, +8, +2, −1, +6, +4, +7. d̄ = 4.25, sd = 2.92.', question: 'Test H₀: μ_d = 0 vs H₁: μ_d > 0. α = 0.05. t*(df=7, one-tailed) ≈ 1.895.', hint: 't = d̄/(sd/√8).', solution: 'SE = 2.92/√8 = 1.03. t = 4.25/1.03 ≈ 4.12. t > 1.895 → reject H₀. Tutoring significantly improved scores.' },
    ],
    challenging: [
      { id: 'pst-chal-1', scenario: 'A researcher uses an independent t-test on before/after data from the same 10 subjects. Another researcher correctly uses a paired t-test.', question: 'Explain the statistical difference between their approaches and which is correct.', hint: 'Think about what happens to variance when you ignore pairing.', solution: 'The independent t-test treats the 20 measurements as coming from 20 different people. This inflates the denominator (SE includes between-person variability) and typically gives a less powerful (higher p-value) result. The paired t-test uses only the within-person differences, removing between-person variation and correctly testing the effect of the treatment. The paired test is correct here.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'pst-kc-1', type: 'multiple-choice',
      question: 'A study measures 10 participants\' stress levels before and after meditation. Which test is appropriate?',
      options: [
        { id: 'a', text: 'Independent-samples t-test', isCorrect: false, explanation: 'Same participants measured twice → not independent groups.' },
        { id: 'b', text: 'Paired-samples t-test', isCorrect: true, explanation: 'Correct! Same subjects before and after → paired t-test on the differences.' },
        { id: 'c', text: 'One-sample t-test', isCorrect: false, explanation: 'One-sample t-test compares a sample mean to a known value, not two paired measurements.' },
        { id: 'd', text: 'Z-test', isCorrect: false, explanation: 'σ is unknown and n is small — z-test is not appropriate here.' },
      ],
      explanation: 'Same subjects measured twice = paired data → paired t-test.',
      hint: 'Are the two measurements from the same individuals?',
    },
    {
      id: 'pst-kc-2', type: 'multiple-choice',
      question: 'In a paired t-test with 15 pairs, what are the degrees of freedom?',
      options: [
        { id: 'a', text: '28', isCorrect: false, explanation: '28 = 15+15−2, which applies to independent samples.' },
        { id: 'b', text: '14', isCorrect: true, explanation: 'Correct! df = n−1 = 15−1 = 14 (n = number of pairs).' },
        { id: 'c', text: '15', isCorrect: false, explanation: 'df = n−1 = 14.' },
        { id: 'd', text: '29', isCorrect: false, explanation: '29 would be total observations (15×2)−1.' },
      ],
      explanation: 'Paired t-test: df = n−1 where n = number of pairs.',
      hint: 'How many paired differences are there?',
    },
    {
      id: 'pst-kc-3', type: 'multiple-choice',
      question: 'Why is the paired t-test more powerful than the independent t-test for repeated measures?',
      options: [
        { id: 'a', text: 'Because df = n−1 is always larger than n₁+n₂−2', isCorrect: false, explanation: 'Actually n₁+n₂−2 is typically larger. Power gain is not from df.' },
        { id: 'b', text: 'Because pairing removes between-subject variability from the error term', isCorrect: true, explanation: 'Correct! Individual differences inflate SE in independent tests. Pairing controls for baseline differences, reducing SE.' },
        { id: 'c', text: 'Because the t-distribution is narrower for paired tests', isCorrect: false, explanation: 'The same t-distribution is used — the distribution shape does not change.' },
        { id: 'd', text: 'Because the null hypothesis is always rejected in paired tests', isCorrect: false, explanation: 'The null can fail to be rejected in any test.' },
      ],
      explanation: 'Pairing removes between-person variability. The remaining SE is based only on within-person changes, which is typically much smaller.',
      hint: 'What source of variability disappears when you subtract d = after − before?',
    },
    {
      id: 'pst-kc-4', type: 'multiple-choice',
      question: 'Paired differences: d = +4, +6, +2, +5, +3. What is d̄?',
      options: [
        { id: 'a', text: '3', isCorrect: false, explanation: 'Sum = 20. d̄ = 20/5 = 4.' },
        { id: 'b', text: '4', isCorrect: true, explanation: 'Correct! d̄ = (4+6+2+5+3)/5 = 20/5 = 4.' },
        { id: 'c', text: '5', isCorrect: false, explanation: '5 is the largest value, not the mean.' },
        { id: 'd', text: '6', isCorrect: false, explanation: '6 is the maximum difference, not the mean.' },
      ],
      explanation: 'd̄ = Σdᵢ/n = (4+6+2+5+3)/5 = 20/5 = 4.',
      hint: 'Sum all differences and divide by n.',
    },
    {
      id: 'pst-kc-5', type: 'numerical',
      question: 'd̄ = 5, sd = 4, n = 16. What is the paired t statistic?',
      answer: 5,
      tolerance: 0.05,
      explanation: 'SE = sd/√n = 4/√16 = 4/4 = 1. t = d̄/SE = 5/1 = 5.',
      hint: 't = d̄ / (sd/√n).',
    },
    { id: 'pst-tf-1', type: 'true-false', question: 'In a paired t-test, dᵢ represents the difference within each pair.', isTrue: true, explanation: 'Correct. dᵢ = xᵢ_after − xᵢ_before (or vice versa). The paired t-test reduces to a one-sample t-test on these differences.' },
    { id: 'pst-tf-2', type: 'true-false', question: 'The paired t-test has more degrees of freedom than the independent samples t-test for the same number of observations.', isTrue: false, explanation: 'False. With n pairs (2n total observations), the paired t-test has df = n−1. An independent test on 2n observations gives df = 2n−2 = n pairs × 2 − 2.' },
    { id: 'pst-tf-3', type: 'true-false', question: 'A paired t-test is more powerful than an independent t-test when subjects vary greatly between one another.', isTrue: true, explanation: 'Correct. Pairing removes between-subject variability, which reduces error variance and increases the t-statistic, improving power.' },
    { id: 'pst-tf-4', type: 'true-false', question: 'The null hypothesis for a paired t-test is H₀: μd = 0, meaning the population mean difference is zero.', isTrue: true, explanation: 'Yes. H₀: μd = 0 — there is no average difference between the paired measurements. Equivalently, μ_before = μ_after.' },
    { id: 'pst-tf-5', type: 'true-false', question: 'If d̄ = 3 and sd = 0, the paired t-statistic is undefined.', isTrue: true, explanation: 'True. t = d̄ / (sd/√n). If sd = 0, the denominator is 0, so t cannot be computed (division by zero). sd = 0 with d̄ ≠ 0 means every pair shows exactly the same difference, but the t formula is still undefined.' },
    { id: 'pst-tf-6', type: 'true-false', question: 'In a paired t-test, the order of subtraction (after − before vs. before − after) affects only the sign of t, not the magnitude.', isTrue: true, explanation: 'Correct. Reversing the subtraction negates d̄ and thus t, but the p-value for a two-tailed test is the same.' },
    { id: 'pst-tf-7', type: 'true-false', question: 'The paired t-test requires both the pre-test and post-test measurements to be normally distributed.', isTrue: false, explanation: 'False. The paired t-test requires the DIFFERENCES dᵢ to be approximately normally distributed (or n to be large enough for CLT to apply), not the raw measurements.' },
    { id: 'pst-tf-8', type: 'true-false', question: 'Using an independent samples t-test on paired data typically leads to a loss of power.', isTrue: true, explanation: 'Yes. Ignoring the pairing fails to remove between-subject variability, increasing error variance and reducing t, thus reducing power.' },
    { id: 'pst-tf-9', type: 'true-false', question: 'The degrees of freedom for a paired t-test with n = 20 pairs is 20.', isTrue: false, explanation: 'False. df = n − 1 = 20 − 1 = 19. We lose one df because we estimate the mean of the differences with d̄.' },
    { id: 'pst-tf-10', type: 'true-false', question: 'A positive d̄ always means the after measurement is larger than the before measurement.', isTrue: false, explanation: 'False. It depends on how dᵢ is defined. If dᵢ = before − after, then positive d̄ means the before was larger. Always check the subtraction order.' },
    { id: 'pst-tf-11', type: 'true-false', question: 'The paired t-test is a special case of the one-sample t-test applied to the differences.', isTrue: true, explanation: 'Exactly. Once you compute the dᵢ values, you run a one-sample t-test with H₀: μd = 0 using the same formula t = d̄/(sd/√n).' },
    { id: 'pst-tf-12', type: 'true-false', question: 'The paired t-test can be applied to data from two entirely separate groups of people.', isTrue: false, explanation: 'False. Paired t-test requires matched pairs — the same subject measured twice, or two matched individuals. Separate unrelated groups → independent samples t-test.' },
    { id: 'pst-tf-13', type: 'true-false', question: 'A before/after study on 30 participants produces 30 difference scores and df = 29 for the paired t-test.', isTrue: true, explanation: 'Correct. n = 30 pairs → 30 difference scores → df = n − 1 = 29.' },
    { id: 'pst-tf-14', type: 'true-false', question: 'If d̄ = 0, the paired t-test will always yield p = 1.0.', isTrue: false, explanation: 'False. If d̄ = 0, then t = 0. The two-tailed p-value is 1.0, but a one-tailed p-value would be 0.5, so p is not always 1.0.' },
    { id: 'pst-tf-15', type: 'true-false', question: 'The standard deviation sd in the paired t-test formula is the SD of the difference scores.', isTrue: true, explanation: 'Correct. sd = SD of dᵢ values, NOT the average of the pre- and post-SDs. This is a common error.' },
    { id: 'pst-tf-16', type: 'true-false', question: 'A non-significant paired t-test proves there is no treatment effect.', isTrue: false, explanation: 'False. Non-significance means insufficient evidence — it could be a real zero effect, or the study may lack power to detect a small effect.' },
    { id: 'pst-tf-17', type: 'true-false', question: 'Crossover trials (where each participant receives both treatments) are ideal for paired t-tests.', isTrue: true, explanation: 'Yes. Each participant acts as their own control, producing perfect pairs. This design minimises confounding and is ideal for the paired t-test.' },
    { id: 'pst-tf-18', type: 'true-false', question: 'When the within-pair correlation is zero, pairing gives no reduction in standard error compared with the independent samples t-test.', isTrue: true, explanation: 'Correct. When pairs share no correlation (ρ = 0), the variance of differences equals s₁² + s₂², so the SE matches the independent test's and the two tests are essentially equivalent in power (the paired test has fewer df, so is very slightly less powerful).' },
    { id: 'pst-tf-19', type: 'true-false', question: 'Holding the true mean difference and variability fixed, increasing the number of pairs n increases the power of the paired t-test.', isTrue: true, explanation: 'Yes. Larger n shrinks SE = sd/√n (√n is in the denominator), making t larger for the same d̄ and sd, and increasing the likelihood of rejecting H₀ when a real effect exists.' },
    { id: 'pst-tf-20', type: 'true-false', question: 'If the 95% CI for μd includes 0, we reject H₀ at α = 0.05.', isTrue: false, explanation: 'False. A CI that includes 0 means we FAIL to reject H₀. Zero difference is plausible at the 95% level.' },
    { id: 'pst-mc-6', type: 'multiple-choice', question: 'Differences: [2, 4, 6, 8, 10]. What is d̄?', options: [ { id: 'a', text: '5', isCorrect: false, explanation: 'd̄ = (2+4+6+8+10)/5 = 30/5 = 6, not 5.' }, { id: 'b', text: '6', isCorrect: true, explanation: 'd̄ = (2+4+6+8+10)/5 = 30/5 = 6. Correct.' }, { id: 'c', text: '4', isCorrect: false, explanation: 'Sum = 30, n = 5, d̄ = 30/5 = 6.' }, { id: 'd', text: '8', isCorrect: false, explanation: '8 is the 4th value, not the mean. d̄ = 6.' }, ], explanation: 'Sum = 2+4+6+8+10 = 30. d̄ = 30/5 = 6.', hint: 'd̄ = Σdᵢ / n.' },
    { id: 'pst-mc-7', type: 'multiple-choice', question: 'Why is the paired t-test generally more powerful than the independent t-test for the same data?', options: [ { id: 'a', text: 'It uses a larger degrees of freedom', isCorrect: false, explanation: 'Actually df is smaller in the paired test (n−1 vs. 2n−2). Power comes from reduced error, not more df.' }, { id: 'b', text: 'It removes between-subject variability by using difference scores', isCorrect: true, explanation: 'Correct. By using dᵢ, each person serves as their own control. Between-subject differences cancel out, reducing error variance.' }, { id: 'c', text: 'It uses the pooled variance', isCorrect: false, explanation: 'The independent test uses pooled variance. The paired test uses only the variance of the differences.' }, { id: 'd', text: 'It always has a smaller standard deviation', isCorrect: false, explanation: 'sd may be larger or smaller than individual group SDs. Power increases specifically when within-pair correlation is positive.' }, ], explanation: 'Pairing controls for individual differences. High baseline variability between subjects is removed, reducing SE and increasing t.', hint: 'What source of variance is eliminated when subjects are their own controls?' },
    { id: 'pst-mc-8', type: 'multiple-choice', question: 'd̄ = 8, sd = 6, n = 9. What is t?', options: [ { id: 'a', text: 't = 4.0', isCorrect: true, explanation: 'SE = 6/√9 = 6/3 = 2. t = 8/2 = 4.0. Correct.' }, { id: 'b', text: 't = 1.33', isCorrect: false, explanation: 'SE = 6/3 = 2. t = 8/2 = 4.0. You may have divided d̄ by sd directly.' }, { id: 'c', text: 't = 12.0', isCorrect: false, explanation: 'SE = 6/√9 = 2. t = 8/2 = 4.0, not 12.' }, { id: 'd', text: 't = 2.67', isCorrect: false, explanation: 'SE = sd/√n = 2. t = d̄/SE = 8/2 = 4.0.' }, ], explanation: 'SE = sd/√n = 6/3 = 2. t = d̄/SE = 8/2 = 4.0. df = 8.', hint: 'SE = sd/√n; t = d̄/SE.' },
    { id: 'pst-mc-9', type: 'multiple-choice', question: 'A researcher measures blood pressure before and after a drug for the SAME 12 patients. Which test is most appropriate?', options: [ { id: 'a', text: 'Independent samples t-test', isCorrect: false, explanation: 'Independent t-test requires separate groups. Same patients measured twice → paired design.' }, { id: 'b', text: 'One-sample t-test', isCorrect: false, explanation: 'One-sample t-test compares one mean to a known value. Here we compare two measurements per patient.' }, { id: 'c', text: 'Paired samples t-test', isCorrect: true, explanation: 'Correct. Same patients, two measurements each — this is a paired (repeated measures) design.' }, { id: 'd', text: 'ANOVA', isCorrect: false, explanation: 'ANOVA compares three or more groups. For two repeated measurements, use the paired t-test.' }, ], explanation: 'Same 12 patients measured before and after → paired data → paired t-test with df = 11.', hint: 'The key question: are the two measurements from the same or different people?' },
    { id: 'pst-mc-10', type: 'multiple-choice', question: 'For the paired t-test, df = ?', options: [ { id: 'a', text: 'n₁ + n₂ − 2 (where n₁ and n₂ are pre- and post-test sizes)', isCorrect: false, explanation: 'That is the df for an independent t-test. For paired data with n pairs, df = n−1.' }, { id: 'b', text: 'n − 1 (where n = number of pairs)', isCorrect: true, explanation: 'Correct. The paired t-test treats the n differences as n observations of a single variable, so df = n−1.' }, { id: 'c', text: '2n − 2', isCorrect: false, explanation: '2n−2 is the independent t-test df. Paired test: df = n−1.' }, { id: 'd', text: 'n', isCorrect: false, explanation: 'df = n−1, not n. We lose one df because we estimate μd with d̄.' }, ], explanation: 'The paired t-test is a one-sample t-test on n differences. df = n−1.', hint: 'Treat the differences as a single sample of size n.' },
    { id: 'pst-mc-11', type: 'multiple-choice', question: 'Which of the following BEST identifies when a paired t-test is NOT appropriate?', options: [ { id: 'a', text: 'When participants show large individual differences', isCorrect: false, explanation: 'Large individual differences actually favour the paired test — it removes this variability.' }, { id: 'b', text: 'When the two groups consist of different, unrelated individuals', isCorrect: true, explanation: 'Correct. Unrelated groups have no natural pairing — use an independent samples t-test.' }, { id: 'c', text: 'When there are only 10 pairs', isCorrect: false, explanation: 'Small n is not a disqualifier for the paired t-test, as long as differences are approximately normal.' }, { id: 'd', text: 'When the pre-test mean is higher than the post-test mean', isCorrect: false, explanation: 'Direction of the difference does not determine which test to use.' }, ], explanation: 'The paired t-test requires natural pairing. Unrelated groups have no pairs → use independent t-test.', hint: 'What structural feature of the data makes pairing possible?' },
    { id: 'pst-mc-12', type: 'multiple-choice', question: 'The SE in a paired t-test is:', options: [ { id: 'a', text: 'sd / n', isCorrect: false, explanation: 'SE = sd/√n, not sd/n.' }, { id: 'b', text: 'sd / √n', isCorrect: true, explanation: 'Correct. SE = sd/√n where sd is the SD of the difference scores.' }, { id: 'c', text: '(s₁ + s₂) / √n', isCorrect: false, explanation: 'That is not a valid formula. Use only the SD of the differences.' }, { id: 'd', text: 'sp × √(2/n)', isCorrect: false, explanation: 'That is the SE for the independent t-test, not the paired t-test.' }, ], explanation: 'SE = sd/√n. The paired test uses only the SD of the differences, not the individual group SDs.', hint: 'The paired t-test has only one variable: the differences. SE is based on that one variable.' },
    { id: 'pst-mc-13', type: 'multiple-choice', question: 'Pre-test scores: [10, 12, 14], Post-test scores: [13, 14, 16]. What is d̄?', options: [ { id: 'a', text: '2', isCorrect: false, explanation: 'Differences: 3, 2, 2. d̄ = 7/3 ≈ 2.33.' }, { id: 'b', text: '3', isCorrect: false, explanation: 'Only the first difference is 3. d̄ = (3+2+2)/3 ≈ 2.33.' }, { id: 'c', text: '2.33', isCorrect: true, explanation: 'Differences: 13−10=3, 14−12=2, 16−14=2. d̄ = 7/3 ≈ 2.33.' }, { id: 'd', text: '1.5', isCorrect: false, explanation: 'd̄ = (3+2+2)/3 = 7/3 ≈ 2.33.' }, ], explanation: 'dᵢ = post − pre: 3, 2, 2. d̄ = (3+2+2)/3 = 7/3 ≈ 2.33.', hint: 'Compute each dᵢ first, then average them.' },
    { id: 'pst-mc-14', type: 'multiple-choice', question: 'Which statement about paired vs. independent t-tests is TRUE?', options: [ { id: 'a', text: 'The paired test always gives a smaller p-value', isCorrect: false, explanation: 'Not always. If within-pair correlation is near zero, paired and independent tests give similar results.' }, { id: 'b', text: 'The paired test has more df than the independent test for the same total N', isCorrect: false, explanation: 'False. With n pairs (total 2n), paired df = n−1 < independent df = 2n−2.' }, { id: 'c', text: 'The paired test is more powerful when within-pair correlation is positive', isCorrect: true, explanation: 'Correct. Positive correlation between pairs means individual differences cancel out, reducing error variance and boosting power.' }, { id: 'd', text: 'The independent test should be used when data are paired', isCorrect: false, explanation: 'Using independent t-test on paired data ignores the correlation, inflating error variance and reducing power.' }, ], explanation: 'Power gain from pairing depends on positive within-pair correlation. The higher the correlation, the more pairing helps.', hint: 'Power = ability to detect a real effect. What reduces error variance in the paired test?' },
    { id: 'pst-mc-15', type: 'multiple-choice', question: 'd̄ = 5, sd = 10, n = 25. What is the 95% CI for μd? (t* ≈ 2.064 for df = 24)', options: [ { id: 'a', text: '[0.87, 9.13]', isCorrect: true, explanation: 'SE = 10/5 = 2. CI = 5 ± 2.064×2 = 5 ± 4.13 = [0.87, 9.13]. Correct.' }, { id: 'b', text: '[−5, 15]', isCorrect: false, explanation: 'CI = d̄ ± t*×SE. SE = 10/√25 = 2. CI = 5 ± 4.13 = [0.87, 9.13].' }, { id: 'c', text: '[3, 7]', isCorrect: false, explanation: 'CI = 5 ± t*×SE = 5 ± 2.064×2 = 5 ± 4.13. The margin is 4.13, not 2.' }, { id: 'd', text: '[−15, 25]', isCorrect: false, explanation: 'SE = sd/√n = 2. CI = 5 ± 4.13 = [0.87, 9.13].' }, ], explanation: 'SE = sd/√n = 10/5 = 2. Margin = t*×SE = 2.064×2 ≈ 4.13. CI = [5−4.13, 5+4.13] = [0.87, 9.13].', hint: 'CI = d̄ ± t*×SE. Compute SE = sd/√n first.' },
  ],
  keyTakeaway:
    'Paired t-test: compute d_i = after − before for each pair, then t = d̄ / (sd/√n), df = n−1. Use when the same subjects are measured twice. More powerful than independent t-test when subjects vary widely at baseline.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "Before/After Photo" Method</p>
      <p className="text-sm text-violet-800">
        A paired t-test is just a <strong>one-sample t-test on the differences</strong>.
        Step 1: compute each person&apos;s change. Step 2: test if the average change = 0.
      </p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-blue-50 border border-blue-300 rounded p-2">
          <div className="font-bold text-blue-800 mb-1">Step 1</div>
          <div className="text-blue-700">d_i = After − Before</div>
          <div className="text-blue-600 mt-1">(one row per person)</div>
        </div>
        <div className="bg-indigo-50 border border-indigo-300 rounded p-2">
          <div className="font-bold text-indigo-800 mb-1">Step 2</div>
          <div className="text-indigo-700">Calculate d̄ and sd</div>
          <div className="text-indigo-600 mt-1">(mean & SD of diffs)</div>
        </div>
        <div className="bg-violet-50 border border-violet-300 rounded p-2">
          <div className="font-bold text-violet-800 mb-1">Step 3</div>
          <div className="text-violet-700">t = d̄ / (sd/√n)</div>
          <div className="text-violet-600 mt-1">df = n−1 pairs</div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
        <strong>Key question to identify paired data:</strong> &ldquo;Is each data point in Group 1 naturally matched with exactly one data point in Group 2?&rdquo; If yes → paired t-test.
      </div>
    </div>
  ),
  visualization: <PairedTViz />,
  datasetGenerator: false,
}

export default function PairedSamplesTTest({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
