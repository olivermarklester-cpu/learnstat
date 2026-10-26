import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, zToPValue } from '../../../utils/stats'

// ── Interactive p-value calculator ───────────────────────────────────────────

function PValueViz() {
  const [z, setZ] = useState(1.5)
  const [tails, setTails] = useState(2)

  const pValue = round(zToPValue(z, tails), 4)
  const significant05 = pValue <= 0.05
  const significant01 = pValue <= 0.01

  // SVG
  const pts = []
  for (let x = -3.5; x <= 3.5; x += 0.08) {
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
    pts.push([x, y])
  }
  const toSVG = (x, y) => [(x + 3.5) * (300 / 7), 80 - y * 250]
  const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + toSVG(...p).join(','))
  const closedPath = [...linePath, `L${toSVG(3.5, 0).join(',')}`, `L${toSVG(-3.5, 0).join(',')}`, 'Z']

  const absZ = Math.abs(z)
  const rightPts = pts.filter((p) => p[0] >= absZ)
  const leftPts = pts.filter((p) => p[0] <= -absZ)

  const regionPath = (pts2) => {
    if (!pts2.length) return ''
    const first = toSVG(pts2[0][0], 0).join(',')
    const last = toSVG(pts2[pts2.length - 1][0], 0).join(',')
    const curve = pts2.map((p) => 'L' + toSVG(...p).join(','))
    return `M${first} ${curve.join(' ')} L${last} Z`
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            z statistic: <span className="text-primary font-bold">{z}</span>
          </label>
          <input type="range" min={-4} max={4} step={0.1} value={z}
            onChange={(e) => setZ(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>−4</span><span>+4</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">Test tails</label>
          <select value={tails} onChange={(e) => setTails(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white text-textDark">
            <option value={2}>Two-tailed</option>
            <option value={1}>One-tailed</option>
          </select>
        </div>
      </div>

      {/* p-value result */}
      <div className={`rounded-lg p-3 mb-3 text-center border ${significant05 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-border'}`}>
        <div className="text-xs font-medium mb-1 text-textMuted">p-value</div>
        <div className={`text-3xl font-bold ${significant05 ? 'text-red-700' : 'text-textDark'}`}>{pValue}</div>
        <div className="flex justify-center gap-2 mt-1 text-xs">
          <span className={`px-2 py-0.5 rounded-full ${significant05 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-textMuted'}`}>
            {significant05 ? 'Significant at α = 0.05' : 'Not significant at α = 0.05'}
          </span>
          <span className={`px-2 py-0.5 rounded-full ${significant01 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-textMuted'}`}>
            {significant01 ? 'Significant at α = 0.01' : 'Not at α = 0.01'}
          </span>
        </div>
      </div>

      <svg viewBox="0 0 300 90" className="w-full h-28">
        <path d={closedPath.join(' ')} fill="#dbeafe" stroke="none" />
        <path d={regionPath(rightPts)} fill="#ef4444" opacity="0.5" />
        {tails === 2 && <path d={regionPath(leftPts)} fill="#ef4444" opacity="0.5" />}
        <path d={linePath.join(' ')} fill="none" stroke="#2563EB" strokeWidth="1.5" />
        <line x1={toSVG(absZ, 0)[0]} y1="8" x2={toSVG(absZ, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1.5" />
        {tails === 2 && <line x1={toSVG(-absZ, 0)[0]} y1="8" x2={toSVG(-absZ, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1.5" />}
        <text x="150" y="88" textAnchor="middle" fontSize="7" fill="#374151">0</text>
        <text x={toSVG(absZ, 0)[0]} y="88" textAnchor="middle" fontSize="7" fill="#dc2626">|z|={absZ.toFixed(1)}</text>
        <text x={Math.min(toSVG(absZ, 0)[0] + 10, 285)} y="25" fontSize="6" fill="#dc2626">p-area</text>
      </svg>

      <p className="text-xs text-gray-500 mt-1">
        Red area = p-value (shaded tail area). Move z toward 0 → larger p-value. Move z away from 0 → smaller p-value.
      </p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'P-values',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Define and correctly interpret a p-value, and use it to make a decision in a hypothesis test.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>p-value</strong> is the probability of observing a test statistic as
        extreme as (or more extreme than) the one obtained, <em>assuming H₀ is true</em>.
      </p>
      <p>
        Small p-values mean the observed data would be unusual if H₀ were true — providing
        evidence against H₀. Large p-values mean the data are consistent with H₀.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Interpreting p-values</p>
        <ul className="space-y-1 text-blue-800 font-mono text-xs">
          <li>p ≤ 0.01  — very strong evidence against H₀</li>
          <li>p ≤ 0.05  — strong evidence against H₀ (standard threshold)</li>
          <li>p ≤ 0.10  — weak / marginal evidence</li>
          <li>p &gt; 0.10  — little to no evidence against H₀</li>
        </ul>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">What a p-value is NOT</p>
        <ul className="space-y-1 text-amber-800 text-xs">
          <li>❌ Probability that H₀ is true</li>
          <li>❌ Probability that the result happened by chance</li>
          <li>❌ A measure of the size or importance of the effect</li>
          <li>✓ P(data this extreme | H₀ true)</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Suppose you flip a coin 10 times and get 9 heads. The p-value answers: "If this coin
        were fair, how often would we see 9 or more heads in 10 flips?" The answer is about
        1% — a very unusual outcome under the "fair coin" null hypothesis.
      </p>
      <p className="text-sm text-gray-600">
        A small p-value does not prove the coin is biased — it says the result is hard to
        explain by chance alone if the null is true.
      </p>
    </div>
  ),
  formula: {
    main: 'p = P(test stat as extreme as or more extreme than observed | H₀ true)',
    variants: [
      { label: 'Two-tailed p-value (z-test)', expression: 'p = 2 × P(Z > |z|) = 2 × (1 − Φ(|z|))', latex: 'p = 2 \\times P(Z > |z|)' },
      { label: 'Right-tailed', expression: 'p = P(Z > z)', latex: 'p = P(Z > z)' },
      { label: 'Left-tailed', expression: 'p = P(Z < z)', latex: 'p = P(Z < z)' },
    ],
    symbolGuide: [
      { symbol: 'p', meaning: 'p-value — probability of observing the data (or more extreme) under H₀' },
      { symbol: 'Φ', meaning: 'Cumulative distribution function of the standard normal (read "Phi")' },
      { symbol: '|z|', meaning: 'Absolute value of the z test statistic' },
    ],
  },
  whenToUse: [
    'As the primary measure of evidence against H₀ in a hypothesis test',
    'To decide whether to reject H₀ (compare p to α)',
  ],
  whenNotToUse: [
    'Do not use p-values alone — always report effect sizes and confidence intervals',
    'p-values are for data generated under the assumed model — do not apply them to arbitrary data dredging',
  ],
  assumptions: [
    'The null hypothesis specifies the distribution of the test statistic',
    'The test statistic follows the assumed distribution under H₀',
    'p-values are interpreted relative to a pre-specified α',
  ],
  workedExample: {
    scenario:
      'H₀: μ = 50, H₁: μ ≠ 50 (two-tailed). Sample gives z = 2.4.',
    steps: [
      { stepNumber: 1, label: 'Identify the tail area', expression: 'P(Z > 2.4) = 1 − Φ(2.4) ≈ 1 − 0.9918 = 0.0082', result: 'Upper tail ≈ 0.0082', explanation: 'This is the probability of z > 2.4 in the standard normal.' },
      { stepNumber: 2, label: 'Two-tailed p-value', expression: 'p = 2 × 0.0082', result: 'p ≈ 0.016', explanation: 'Two-tailed test: double the one-tail area.' },
      { stepNumber: 3, label: 'Compare to α = 0.05', expression: '0.016 < 0.05', result: 'Reject H₀', explanation: 'The p-value falls below the significance threshold.' },
    ],
    interpretation:
      'p ≈ 0.016: if H₀ were true, we would see a result this extreme only about 1.6% of the time. That is unlikely enough to reject H₀ at α = 0.05.',
  },
  interpretation:
    'The p-value quantifies the strength of evidence against H₀. It does not measure effect size or the probability that H₀ is true. Report the exact p-value (not just "p < 0.05") to give readers full information.',
  commonMistakes: [
    { mistake: 'p-value = probability H₀ is true', explanation: 'p-value = P(data | H₀ true), not P(H₀ | data). The latter requires Bayesian methods.' },
    { mistake: 'p > 0.05 means no effect', explanation: 'It means insufficient evidence for the effect given the sample — not that the effect is zero. The sample may simply be too small (underpowered).' },
    { mistake: '"p = 0.049 is significant but p = 0.051 is not" — treating the threshold as a cliff edge', explanation: 'Both values represent very similar evidence. The cutoff is a convention, not a scientific truth.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'pv-easy-1', scenario: 'z = 1.96, two-tailed test.', question: 'Approximate the p-value.', hint: 'p = 2 × P(Z > 1.96). P(Z > 1.96) ≈ 0.025.', solution: 'p = 2 × 0.025 = 0.05.' },
    ],
    moderate: [
      { id: 'pv-mod-1', scenario: 'z = −2.58, one-tailed (left) test.', question: 'Calculate the p-value and state whether you reject H₀ at α = 0.01.', hint: 'p = P(Z < −2.58). |z| = 2.58.', solution: 'P(Z < −2.58) ≈ 0.005. p = 0.005 < 0.01 → Reject H₀.' },
    ],
    challenging: [
      { id: 'pv-chal-1', scenario: 'Two studies test the same H₀: Study A (n=50): p = 0.04. Study B (n=5,000): p = 0.04.', question: 'Do both studies provide equally strong evidence? What else should you examine?', hint: 'Think about effect size.', solution: 'Both have p = 0.04, so both reject H₀ at α = 0.05. But Study B\'s huge sample means even a trivial effect is detectable. Effect size must be reported — a statistically significant result in Study B may be practically irrelevant.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'pv-kc-1', type: 'multiple-choice',
      question: 'A p-value of 0.003 means:',
      options: [
        { id: 'a', text: 'There is a 0.3% probability that H₀ is true', isCorrect: false, explanation: 'p-value ≠ probability of H₀ being true.' },
        { id: 'b', text: 'There is a 0.3% probability of seeing data this extreme if H₀ is true', isCorrect: true, explanation: 'Correct! p = P(result this extreme | H₀ true).' },
        { id: 'c', text: 'The effect size is 0.003', isCorrect: false, explanation: 'p-values are probabilities — not effect sizes.' },
        { id: 'd', text: 'There is 99.7% confidence in rejecting H₀', isCorrect: false, explanation: 'Confidence level is separate from p-values.' },
      ],
      explanation: 'p-value = P(data as extreme as observed | H₀ true). Small p → unusual result under H₀.',
      hint: 'Complete the phrase: "If H₀ were true, the probability of seeing a result this extreme is..."',
    },
    {
      id: 'pv-kc-2', type: 'multiple-choice',
      question: 'p = 0.12, α = 0.05. What is the correct conclusion?',
      options: [
        { id: 'a', text: 'Reject H₀ — p is small', isCorrect: false, explanation: 'p = 0.12 > α = 0.05. We do not reject H₀.' },
        { id: 'b', text: 'Fail to reject H₀ — insufficient evidence', isCorrect: true, explanation: 'Correct! p (0.12) > α (0.05) → insufficient evidence to reject H₀.' },
        { id: 'c', text: 'H₀ is definitely true', isCorrect: false, explanation: '"Fail to reject" is not proof of H₀.' },
        { id: 'd', text: 'Use a different significance level', isCorrect: false, explanation: 'α should not be changed after seeing the data.' },
      ],
      explanation: 'p > α → fail to reject H₀. This does not prove H₀; it means evidence is insufficient.',
      hint: 'Compare p to α. Which is larger?',
    },
    {
      id: 'pv-kc-3', type: 'multiple-choice',
      question: 'Which of the following is a correct interpretation of a p-value?',
      options: [
        { id: 'a', text: 'The probability the alternative hypothesis is true', isCorrect: false, explanation: 'p-values say nothing directly about P(H₁ true).' },
        { id: 'b', text: 'The probability of observing the data (or more extreme) assuming H₀ is true', isCorrect: true, explanation: 'Correct! p = P(data this extreme | H₀ true).' },
        { id: 'c', text: 'The size of the treatment effect', isCorrect: false, explanation: 'Effect size (e.g., Cohen\'s d) is separate from p-values.' },
        { id: 'd', text: 'The probability the result occurred by chance', isCorrect: false, explanation: 'This common misstatement conflates conditional probability with unconditional probability.' },
      ],
      explanation: 'The p-value is a conditional probability: P(data | H₀ true). It is not about H₁, effect size, or chance alone.',
      hint: 'Which definition includes the phrase "assuming H₀ is true"?',
    },
    {
      id: 'pv-kc-4', type: 'multiple-choice',
      question: 'A researcher gets p = 0.049 in one study and p = 0.051 in a replication. Which is true?',
      options: [
        { id: 'a', text: 'The first study found a real effect; the second did not', isCorrect: false, explanation: 'Both p-values represent nearly identical evidence. The threshold is a convention, not a scientific cliff.' },
        { id: 'b', text: 'Both represent very similar evidence against H₀', isCorrect: true, explanation: 'Correct! A 0.002 difference in p-values is negligible. The α = 0.05 cutoff is arbitrary.' },
        { id: 'c', text: 'p = 0.051 means H₀ is true', isCorrect: false, explanation: 'Fail to reject H₀ does not prove H₀ is true.' },
        { id: 'd', text: 'The second study must have had a smaller sample', isCorrect: false, explanation: 'We cannot infer sample size from the p-value alone.' },
      ],
      explanation: 'p = 0.049 vs 0.051 represents essentially the same evidence. Avoid "cliff-edge" thinking around α thresholds.',
      hint: 'How different are 0.049 and 0.051, really?',
    },
    {
      id: 'pv-kc-5', type: 'numerical',
      question: 'A two-tailed z-test gives z = 1.96. P(Z > 1.96) ≈ 0.025. What is the p-value?',
      answer: 0.05,
      tolerance: 0.001,
      explanation: 'Two-tailed p-value = 2 × P(Z > |z|) = 2 × 0.025 = 0.05.',
      hint: 'For a two-tailed test, double the one-tail probability.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'pv-tf-1', type: 'true-false', question: 'The p-value is the probability that the null hypothesis H₀ is true.', isTrue: false, explanation: 'The p-value is P(data this extreme | H₀ true) — not P(H₀ true | data). H₀ is either true or false; it is not a random variable.' },
    { id: 'pv-tf-2', type: 'true-false', question: 'A p-value of 0.03 means: if H₀ is true, there is a 3% probability of observing results this extreme or more.', isTrue: true, explanation: 'This is the correct interpretation: p = P(|test statistic| ≥ observed | H₀ true) = 0.03.' },
    { id: 'pv-tf-3', type: 'true-false', question: 'A smaller p-value always means a larger effect size.', isTrue: false, explanation: 'p-value depends on both effect size AND sample size. With a large enough n, even tiny effects produce very small p-values.' },
    { id: 'pv-tf-4', type: 'true-false', question: 'If p > α, we fail to reject H₀.', isTrue: true, explanation: 'Decision rule: reject H₀ when p ≤ α. When p > α, the result is not significant — we fail to reject H₀.' },
    { id: 'pv-tf-5', type: 'true-false', question: 'A p-value of 0.05 means there is a 5% chance the experimental results occurred by chance.', isTrue: false, explanation: 'This is a common misinterpretation. p = P(data this extreme or more | H₀ true) is computed assuming H₀ is true; it is not the probability that the results occurred by chance, nor the probability that H₀ is true.' },
    { id: 'pv-tf-6', type: 'true-false', question: 'A two-tailed p-value is always twice the one-tailed p-value (when the test statistic is in the hypothesised direction).', isTrue: true, explanation: 'Two-tailed p = 2 × P(Z > |z|). This holds when the test statistic is in the direction specified by a one-tailed hypothesis.' },
    { id: 'pv-tf-7', type: 'true-false', question: 'p = 0.001 provides stronger evidence against H₀ than p = 0.04.', isTrue: true, explanation: 'Smaller p means the data are even more inconsistent with H₀. p = 0.001 is much stronger evidence than p = 0.04.' },
    { id: 'pv-tf-8', type: 'true-false', question: 'A p-value near 1 means H₀ is very likely true.', isTrue: false, explanation: 'p near 1 means the data are very consistent with H₀ — but that does not mean H₀ is "very likely true." It could be underpowered.' },
    { id: 'pv-tf-9', type: 'true-false', question: 'Once the p-value is computed, the significance level α can be adjusted to achieve significance.', isTrue: false, explanation: 'α must be set before data collection. Adjusting it after seeing p is p-hacking and invalidates the test.' },
    { id: 'pv-tf-10', type: 'true-false', question: 'The p-value can be used to measure the magnitude of an effect.', isTrue: false, explanation: 'p-values are not effect size measures. Cohen\'s d, r², odds ratio, etc. are effect size measures. Small p ≠ large effect.' },
    { id: 'pv-tf-11', type: 'true-false', question: 'The p-value depends on both the observed data and the null hypothesis.', isTrue: true, explanation: 'p = P(data ≥ observed | H₀). Both what was observed AND what H₀ specifies determine the p-value.' },
    { id: 'pv-tf-12', type: 'true-false', question: 'Reporting p < 0.05 without an effect size is sufficient for a complete result.', isTrue: false, explanation: 'p-values address statistical significance but not practical importance. Effect sizes (Cohen\'s d, r², etc.) quantify the magnitude of the effect.' },
    { id: 'pv-tf-13', type: 'true-false', question: 'If p = 0.049 and α = 0.05, the result is statistically significant.', isTrue: true, explanation: 'p = 0.049 < α = 0.05 → reject H₀ → statistically significant.' },
    { id: 'pv-tf-14', type: 'true-false', question: 'A larger sample size tends to produce smaller p-values for the same effect size.', isTrue: true, explanation: 'SE = σ/√n decreases with larger n → test statistic = effect/SE increases → p-value decreases. Large samples detect small effects.' },
    { id: 'pv-tf-15', type: 'true-false', question: 'The p-value measures the probability that a replication study would also find a significant result.', isTrue: false, explanation: 'p does not measure replication probability. The probability of replication depends on power, not the p-value of a single study.' },
    { id: 'pv-tf-16', type: 'true-false', question: 'For a z-test with z = 1.96 (two-tailed), the p-value is approximately 0.05.', isTrue: true, explanation: 'P(|Z| > 1.96) = 2 × P(Z > 1.96) = 2 × 0.025 = 0.05. z = 1.96 is the boundary for two-tailed α = 0.05.' },
    { id: 'pv-tf-17', type: 'true-false', question: 'The p-value is always between 0 and 1 inclusive.', isTrue: true, explanation: 'p is a probability, so 0 ≤ p ≤ 1. p near 0 means the data would be extremely unusual under H₀; p = 1 means the data are as consistent with H₀ as possible.' },
    { id: 'pv-tf-18', type: 'true-false', question: 'A p-value of 0.10 is statistically significant at α = 0.10 but not at α = 0.05.', isTrue: true, explanation: 'p = 0.10 ≤ α = 0.10 → significant at 10%. But p = 0.10 > α = 0.05 → NOT significant at 5%.' },
    { id: 'pv-tf-19', type: 'true-false', question: 'p-hacking increases the likelihood of finding a statistically significant result even when no effect exists.', isTrue: true, explanation: 'P-hacking (selective reporting, changing α, transforming data post-hoc, etc.) inflates the Type I error rate beyond α.' },
    { id: 'pv-tf-20', type: 'true-false', question: 'A statistically non-significant result (p > α) proves the null hypothesis is correct.', isTrue: false, explanation: 'Failing to reject H₀ only means insufficient evidence. H₀ may still be false; the test may be underpowered.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'pv-mc-6', type: 'multiple-choice', question: 'A study finds z = 2.50 (two-tailed). P(Z > 2.50) ≈ 0.006. What is the p-value?', options: [{ id: 'a', text: '0.006', isCorrect: false, explanation: '0.006 is the one-tailed area. Two-tailed p = 2 × 0.006 = 0.012.' }, { id: 'b', text: '0.012', isCorrect: true, explanation: 'Two-tailed p = 2 × P(Z > |z|) = 2 × 0.006 = 0.012.' }, { id: 'c', text: '0.994', isCorrect: false, explanation: '0.994 = 1 − 0.006 — no basis for this.' }, { id: 'd', text: '0.05', isCorrect: false, explanation: '0.05 is not computed from z = 2.50.' }], explanation: 'Two-tailed p = 2 × P(Z > 2.50) = 2 × 0.006 = 0.012.', hint: 'Two-tailed p doubles the one-tail area.' },
    { id: 'pv-mc-7', type: 'multiple-choice', question: 'Which interpretation of "p = 0.03" is CORRECT?', options: [{ id: 'a', text: 'There is a 3% probability that H₀ is true', isCorrect: false, explanation: 'p does not give P(H₀ true). H₀ is either true or false.' }, { id: 'b', text: 'If H₀ is true, there is a 3% chance of getting results this extreme or more', isCorrect: true, explanation: 'p = P(|test stat| ≥ observed | H₀ true) = 0.03. This is the correct frequentist interpretation.' }, { id: 'c', text: 'There is a 97% probability that H₁ is true', isCorrect: false, explanation: '1 − p does not give P(H₁ true). These are probability of data under H₀, not probability of hypotheses.' }, { id: 'd', text: 'The effect size is 3%', isCorrect: false, explanation: 'p is not an effect size.' }], explanation: 'p = P(data this extreme or more | H₀ true). The correct interpretation for p = 0.03.', hint: 'What does the p-value condition on?' },
    { id: 'pv-mc-8', type: 'multiple-choice', question: 'p = 0.001 vs p = 0.04, both at α = 0.05. Which represents stronger evidence against H₀?', options: [{ id: 'a', text: 'p = 0.04 — closer to the threshold', isCorrect: false, explanation: 'Smaller p = more extreme data under H₀ = stronger evidence against H₀.' }, { id: 'b', text: 'p = 0.001 — more extreme result under H₀', isCorrect: true, explanation: 'p = 0.001 means data this extreme occur only 0.1% of the time under H₀ — far more extreme than p = 0.04.' }, { id: 'c', text: 'Equal — both reject H₀ at α = 0.05', isCorrect: false, explanation: 'Both reject H₀, but they do not represent equal evidence. p = 0.001 is much stronger.' }, { id: 'd', text: 'Cannot compare — they need the same test', isCorrect: false, explanation: 'p-values from the same test type are directly comparable. p = 0.001 is stronger evidence.' }], explanation: 'Smaller p → data more inconsistent with H₀. p = 0.001 is much stronger evidence against H₀ than p = 0.04.', hint: 'Smaller p = more extreme under H₀ = stronger evidence against H₀.' },
    { id: 'pv-mc-9', type: 'multiple-choice', question: 'A very large sample (n = 10,000) gives p = 0.001 for a 0.001-unit difference in means. What is the most appropriate response?', options: [{ id: 'a', text: 'The result is very important — p < 0.05', isCorrect: false, explanation: 'Statistical significance ≠ practical significance. A 0.001-unit difference may be meaningless.' }, { id: 'b', text: 'Report the effect size — a 0.001-unit difference may be practically trivial despite being significant', isCorrect: true, explanation: 'Large n inflates significance. Always pair p with effect size measures to judge practical importance.' }, { id: 'c', text: 'The test was wrong', isCorrect: false, explanation: 'The test is valid. The issue is interpretation, not procedure.' }, { id: 'd', text: 'Increase α to adjust for the large sample', isCorrect: false, explanation: 'Adjusting α for n is not standard practice. Report effect size instead.' }], explanation: 'With n = 10,000, even tiny effects are significant. p says nothing about practical importance — always report effect size.', hint: 'How does n inflate statistical significance?' },
    { id: 'pv-mc-10', type: 'multiple-choice', question: 'You run a hypothesis test and get p = 0.20. Which statement is correct?', options: [{ id: 'a', text: 'Fail to reject H₀ at α = 0.05 — not enough evidence', isCorrect: true, explanation: 'p = 0.20 > α = 0.05 → fail to reject H₀. No sufficient evidence against H₀.' }, { id: 'b', text: 'H₀ is true', isCorrect: false, explanation: 'Failing to reject H₀ does not prove it true.' }, { id: 'c', text: 'Reject H₀ — p = 0.20 is close to 0.05', isCorrect: false, explanation: 'p = 0.20 > 0.05. "Close" is not a valid criterion — the threshold is exact.' }, { id: 'd', text: 'H₁ has a 20% chance of being true', isCorrect: false, explanation: 'p does not give probabilities of hypotheses.' }], explanation: 'p = 0.20 > α = 0.05 → fail to reject H₀. Insufficient evidence against H₀.', hint: 'Compare p to α. p = 0.20 > 0.05.' },
    { id: 'pv-mc-11', type: 'multiple-choice', question: 'For a one-sample z-test, z = −3.0. P(Z < −3.0) ≈ 0.0013. What is the two-tailed p-value?', options: [{ id: 'a', text: '0.0013', isCorrect: false, explanation: '0.0013 is the one-tailed area. Two-tailed doubles it.' }, { id: 'b', text: '0.0026', isCorrect: true, explanation: 'Two-tailed p = 2 × 0.0013 = 0.0026.' }, { id: 'c', text: '0.9987', isCorrect: false, explanation: '0.9987 = 1 − 0.0013 — incorrect formula.' }, { id: 'd', text: '0.013', isCorrect: false, explanation: '0.013 ≠ 2 × 0.0013 — arithmetic error.' }], explanation: 'Two-tailed p = 2 × P(Z < −3.0) = 2 × 0.0013 = 0.0026.', hint: 'Two-tailed p = 2 × one-tail area.' },
    { id: 'pv-mc-12', type: 'multiple-choice', question: 'A researcher reports "marginally significant" with p = 0.08 at α = 0.05. What does this actually mean?', options: [{ id: 'a', text: 'The result is significant under a lenient interpretation', isCorrect: false, explanation: 'α = 0.05 is the pre-specified threshold. p = 0.08 > 0.05 → not significant by the stated criterion.' }, { id: 'b', text: 'The result is not statistically significant at α = 0.05; reporting "marginally" is misleading', isCorrect: true, explanation: 'p = 0.08 > α = 0.05 → fail to reject H₀. "Marginally significant" is a vague and misleading term not recognised in statistics.' }, { id: 'c', text: 'The sample size was too large', isCorrect: false, explanation: 'Sample size is irrelevant to this decision.' }, { id: 'd', text: 'The effect is marginally large', isCorrect: false, explanation: '"Marginally significant" is about p-value proximity to α, not effect size.' }], explanation: 'p = 0.08 is NOT significant at α = 0.05. "Marginally significant" obscures a clear non-significant result.', hint: 'Is p = 0.08 below or above α = 0.05?' },
    { id: 'pv-mc-13', type: 'multiple-choice', question: 'What is the effect of increasing sample size on the p-value (for a fixed true effect size)?', options: [{ id: 'a', text: 'p increases', isCorrect: false, explanation: 'Larger n → larger test statistic → smaller p-value.' }, { id: 'b', text: 'p decreases', isCorrect: true, explanation: 'SE = σ/√n decreases with n → test statistic increases → p-value decreases. Same effect becomes more significant with more data.' }, { id: 'c', text: 'p is unaffected by n', isCorrect: false, explanation: 'p directly depends on the test statistic, which depends on SE = σ/√n.' }, { id: 'd', text: 'p approaches 0.5', isCorrect: false, explanation: '0.5 has no special relationship to n. p → 0 as n → ∞ for a fixed non-zero effect.' }], explanation: 'Larger n → smaller SE → larger test statistic → smaller p. Same effect becomes more significant as n grows.', hint: 'How does n affect the test statistic?' },
    { id: 'pv-mc-14', type: 'multiple-choice', question: 'Which of the following is NOT a correct use of the p-value?', options: [{ id: 'a', text: 'Comparing to α to make a reject/fail-to-reject decision', isCorrect: false, explanation: 'This is the primary valid use of a p-value.' }, { id: 'b', text: 'Estimating the probability that H₀ is true', isCorrect: true, explanation: 'p-values do not estimate P(H₀ true). This is the most common misuse.' }, { id: 'c', text: 'Assessing whether the data are consistent with H₀', isCorrect: false, explanation: 'Small p = data inconsistent with H₀. This is a valid use.' }, { id: 'd', text: 'Quantifying statistical significance', isCorrect: false, explanation: 'p directly measures statistical significance — a valid use.' }], explanation: 'p-values CANNOT be used to estimate P(H₀ true). That requires Bayesian methods, not frequentist p-values.', hint: 'Which use requires knowing P(H₀ true) — which p-values cannot provide?' },
    { id: 'pv-mc-15', type: 'multiple-choice', question: 'A study is replicated 100 times using identical methods. If p < 0.05 originally, approximately how many replications would be expected to also give p < 0.05?', options: [{ id: 'a', text: '5 — only 5% will be significant', isCorrect: false, explanation: '5% Type I error rate applies when H₀ is true. If the effect is real, most replications will be significant.' }, { id: 'b', text: 'Depends on the power (1−β) of the study', isCorrect: true, explanation: 'Replication success ≈ power. High-powered studies (e.g., 80% power) replicate ~80% of the time. Power depends on effect size and n.' }, { id: 'c', text: '95 — 95% confidence that the result is real', isCorrect: false, explanation: 'The 95% confidence level does not directly predict replication rate.' }, { id: 'd', text: 'Exactly 50 — half the time by chance', isCorrect: false, explanation: '50% would apply only if power = 50%. Replication rate = power of the study.' }], explanation: 'Replication rate ≈ power = 1 − β. A well-powered study (80% power) replicates ~80% of the time.', hint: 'What statistical concept describes the probability of correctly detecting a true effect?' },
  ],
  keyTakeaway:
    'The p-value is P(result this extreme | H₀ true). Compare it to α: reject H₀ if p ≤ α. p-values do not measure the probability of H₀ being true or the size of the effect. Always pair with effect sizes and confidence intervals.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "Presumed Innocent" Rule</p>
      <p className="text-sm text-violet-800">
        Think of H₀ as a defendant who is <strong>presumed innocent</strong>. The p-value is the
        probability of seeing evidence this damning <em>if the defendant truly is innocent</em>.
        A tiny p-value means: "This evidence would be nearly impossible if they were innocent — convict!"
        A large p-value means: "Nothing unusual here — acquit (fail to reject)."
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-100 border border-red-300 rounded p-2">
          <div className="font-bold text-red-800 mb-1">p ≤ α (e.g. 0.05)</div>
          <div className="text-red-700">Evidence is too extreme to be plausible if H₀ were true → <strong>Reject H₀</strong></div>
        </div>
        <div className="bg-green-100 border border-green-300 rounded p-2">
          <div className="font-bold text-green-800 mb-1">p &gt; α (e.g. 0.05)</div>
          <div className="text-green-700">Evidence is plausible under H₀ → <strong>Fail to reject H₀</strong></div>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-800">
        <strong>Quick mantra:</strong> &nbsp;"p is small → reject the null. p is tall (large) → stand the null."
      </div>
    </div>
  ),
  visualization: <PValueViz />,
  datasetGenerator: false,
}

export default function PValues({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
