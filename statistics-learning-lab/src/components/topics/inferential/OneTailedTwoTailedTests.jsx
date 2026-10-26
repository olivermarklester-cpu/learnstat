import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'

// ── Visual ────────────────────────────────────────────────────────────────────

function TailsViz() {
  const [tail, setTail] = useState('two')

  const leftFill = tail === 'left' || tail === 'two'
  const rightFill = tail === 'right' || tail === 'two'

  // SVG bell curve path (approximate)
  const pts = []
  for (let x = -3.5; x <= 3.5; x += 0.1) {
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
    pts.push([x, y])
  }
  const toSVG = (x, y) => [(x + 3.5) * (300 / 7), 80 - y * 250]
  const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + toSVG(...p).join(','))
  const closedPath = [...linePath, `L${toSVG(3.5, 0).join(',')}`, `L${toSVG(-3.5, 0).join(',')}`, 'Z']

  // Rejection region paths
  const critZ = tail === 'two' ? 1.96 : 1.645
  const leftPts = pts.filter((p) => p[0] <= -critZ)
  const rightPts = pts.filter((p) => p[0] >= critZ)

  const regionPath = (pts2, side) => {
    if (!pts2.length) return ''
    const basePts = [...pts2]
    const first = toSVG(basePts[0][0], 0).join(',')
    const last = toSVG(basePts[basePts.length - 1][0], 0).join(',')
    const curvePts = basePts.map((p) => 'L' + toSVG(...p).join(','))
    if (side === 'left') return `M${first} ${curvePts.join(' ')} L${last} Z`
    return `M${first} ${curvePts.join(' ')} L${last} Z`
  }

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'two', label: 'Two-tailed (≠)' },
          { key: 'left', label: 'Left-tailed (<)' },
          { key: 'right', label: 'Right-tailed (>)' },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTail(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              tail === key ? 'bg-primary text-white border-primary' : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 300 90" className="w-full h-28">
        {/* Curve fill */}
        <path d={closedPath.join(' ')} fill="#dbeafe" stroke="none" />
        {/* Rejection regions */}
        {leftFill && <path d={regionPath(leftPts, 'left')} fill="#ef4444" opacity="0.5" />}
        {rightFill && <path d={regionPath(rightPts, 'right')} fill="#ef4444" opacity="0.5" />}
        {/* Curve outline */}
        <path d={linePath.join(' ')} fill="none" stroke="#2563EB" strokeWidth="1.5" />
        {/* Zero line */}
        <line x1="150" y1="10" x2="150" y2="80" stroke="#6b7280" strokeWidth="0.5" strokeDasharray="3,2" />
        {/* Critical value lines */}
        {leftFill && <line x1={toSVG(-critZ, 0)[0]} y1="10" x2={toSVG(-critZ, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1" />}
        {rightFill && <line x1={toSVG(critZ, 0)[0]} y1="10" x2={toSVG(critZ, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1" />}
        {/* Labels */}
        <text x="150" y="88" textAnchor="middle" fontSize="7" fill="#374151">0</text>
        {leftFill && <text x={toSVG(-critZ, 0)[0]} y="88" textAnchor="middle" fontSize="6" fill="#ef4444">-{critZ}</text>}
        {rightFill && <text x={toSVG(critZ, 0)[0]} y="88" textAnchor="middle" fontSize="6" fill="#ef4444">+{critZ}</text>}
        {leftFill && <text x="15" y="30" fontSize="7" fill="#dc2626">Reject</text>}
        {rightFill && <text x="255" y="30" fontSize="7" fill="#dc2626">Reject</text>}
      </svg>

      <div className="mt-2 text-xs text-textMuted">
        {tail === 'two' && 'Two-tailed: H₁: μ ≠ μ₀. Rejection region split between both tails (α/2 each side).'}
        {tail === 'left' && 'Left-tailed: H₁: μ < μ₀. Entire α in the left tail. Reject when test stat ≤ −z*.'}
        {tail === 'right' && 'Right-tailed: H₁: μ > μ₀. Entire α in the right tail. Reject when test stat ≥ +z*.'}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'One-tailed and Two-tailed Tests',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Choose between a one-tailed and two-tailed test based on the research question, and explain how the choice affects the critical value and rejection region.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The number of "tails" in a hypothesis test refers to how many sides of the sampling
        distribution contribute to the rejection region.
      </p>
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="font-semibold text-blue-900 mb-1">Two-tailed test (H₁: ≠)</p>
          <p className="text-blue-800">Tests whether the parameter differs in <em>either</em> direction. Rejection region is split between both tails (α/2 each). Use when you have no prior expectation of direction.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="font-semibold text-emerald-900 mb-1">One-tailed test (H₁: &lt; or &gt;)</p>
          <p className="text-emerald-800">Tests whether the parameter is specifically smaller or larger. All of α is in one tail — making it easier to reject H₀ in that direction. Use only when theory strongly predicts the direction.</p>
        </div>
      </div>
      <p>
        A two-tailed test with α = 0.05 uses z* = 1.96. A one-tailed test with the same α
        uses z* = 1.645 (less extreme critical value → easier to reject H₀ in that tail).
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine testing whether a coin is biased. A two-tailed test asks "is it biased
        in either direction?" A one-tailed test would be like saying "I bet this coin favours
        heads — let me test only for too many heads." The one-tailed test is more powerful
        in that direction but blind to the other.
      </p>
    </div>
  ),
  formula: {
    main: 'z* (two-tailed, α=0.05) = 1.96   |   z* (one-tailed, α=0.05) = 1.645',
    variants: [
      { label: 'Two-tailed critical value', expression: 'z* = z_{α/2} (e.g., 1.96 for α=0.05)', latex: 'z^* = z_{\\alpha/2}' },
      { label: 'One-tailed critical value', expression: 'z* = z_α (e.g., 1.645 for α=0.05)', latex: 'z^* = z_{\\alpha}' },
      { label: 'Two-tailed p-value', expression: 'p = 2 × P(Z > |z|)', latex: 'p = 2 \\cdot P(Z > |z|)' },
      { label: 'One-tailed p-value', expression: 'p = P(Z > z)  or  P(Z < z)', latex: 'p = P(Z > z)' },
    ],
    symbolGuide: [
      { symbol: 'z*', meaning: 'Critical z-value — the boundary of the rejection region' },
      { symbol: 'α', meaning: 'Significance level — total rejection region area' },
      { symbol: 'α/2', meaning: 'Each tail area in a two-tailed test' },
      { symbol: '|z|', meaning: 'Absolute value of the test statistic' },
    ],
  },
  whenToUse: [
    'Two-tailed: when any direction of difference is scientifically relevant (most common in research)',
    'One-tailed: when theory or prior knowledge strongly specifies the direction of the effect',
  ],
  whenNotToUse: [
    'Do not use a one-tailed test simply to make a borderline result significant',
    'Do not choose the tail after seeing the data direction (p-hacking)',
  ],
  assumptions: [
    'The tail choice must be decided before data collection',
    'The direction of H₁ should be grounded in prior theory, not convenience',
  ],
  workedExample: {
    scenario:
      'A new drug is expected to lower blood pressure. The hypothesis is H₀: μ = 130 mmHg vs H₁: μ < 130 mmHg. z = −2.1, α = 0.05.',
    steps: [
      { stepNumber: 1, label: 'Identify test type', expression: 'H₁: μ < 130 → left-tailed', result: 'One-tailed (left)', explanation: 'The alternative hypothesis specifies "less than."' },
      { stepNumber: 2, label: 'Critical value (one-tailed)', expression: 'z* = −1.645 (for α = 0.05, left tail)', result: 'z* = −1.645', explanation: 'All of α = 0.05 is in the left tail.' },
      { stepNumber: 3, label: 'Decision', expression: 'z = −2.1 < −1.645 → in rejection region', result: 'Reject H₀', explanation: 'The test statistic is more extreme than the critical value.' },
      { stepNumber: 4, label: 'p-value (one-tailed)', expression: 'p = P(Z < −2.1) ≈ 0.018', result: 'p ≈ 0.018 < 0.05', explanation: 'Confirms the rejection.' },
    ],
    interpretation:
      'There is statistically significant evidence (p ≈ 0.018) that the drug reduces blood pressure below 130 mmHg.',
  },
  interpretation:
    'Choosing one vs two tails is a pre-data decision based on the research question. Two-tailed tests are generally preferred as they are more conservative and detect effects in either direction.',
  commonMistakes: [
    { mistake: 'Switching to one-tailed after seeing the data direction', explanation: 'This halves the p-value artificially and inflates the false-positive rate.' },
    { mistake: 'Using one-tailed to rescue a borderline two-tailed result', explanation: 'A common form of p-hacking. The decision must be pre-specified.' },
    { mistake: 'Forgetting to adjust the critical value', explanation: 'A two-tailed test with α = 0.05 uses z* = 1.96; a one-tailed test uses z* = 1.645. Confusing these leads to wrong conclusions.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'tails-easy-1', scenario: 'A researcher tests whether a coin is biased.', question: 'Should they use a one-tailed or two-tailed test? Why?', hint: 'Bias could mean too many heads or too many tails.', solution: 'Two-tailed. Bias could occur in either direction — we have no prior reason to test only one side.' },
    ],
    moderate: [
      { id: 'tails-mod-1', scenario: 'z = 1.80, α = 0.05, right-tailed test.', question: 'Find the critical value, p-value, and state the decision.', hint: 'One-tailed z* = 1.645. p = P(Z > 1.80).', solution: 'z* = 1.645. z = 1.80 > 1.645 → in rejection region. p ≈ P(Z > 1.80) ≈ 0.036. Reject H₀.' },
    ],
    challenging: [
      { id: 'tails-chal-1', scenario: 'z = 1.72, two-tailed α = 0.05.', question: 'What is the decision? Would the decision change if you used a one-tailed test instead?', hint: 'Two-tailed z* = 1.96; one-tailed z* = 1.645.', solution: 'Two-tailed: z = 1.72 < 1.96 → fail to reject H₀ (p ≈ 0.085). One-tailed (right): z = 1.72 > 1.645 → reject H₀ (p ≈ 0.043). This illustrates why pre-specifying the tail is critical.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'tails-kc-1', type: 'multiple-choice',
      question: 'For a two-tailed test at α = 0.05, what is the z* critical value?',
      options: [
        { id: 'a', text: '1.28', isCorrect: false, explanation: '1.28 corresponds to one-tailed α = 0.10.' },
        { id: 'b', text: '1.645', isCorrect: false, explanation: '1.645 is the one-tailed critical value for α = 0.05.' },
        { id: 'c', text: '1.96', isCorrect: true, explanation: 'Correct! Two-tailed α = 0.05 → z* = 1.96 (each tail has 2.5%).' },
        { id: 'd', text: '2.576', isCorrect: false, explanation: '2.576 is the two-tailed critical value for α = 0.01.' },
      ],
      explanation: 'Two-tailed α = 0.05: each tail = 0.025. z such that P(Z > z) = 0.025 is 1.96.',
      hint: 'Split α by 2 for a two-tailed test.',
    },
    {
      id: 'tails-kc-2', type: 'multiple-choice',
      question: 'When should you use a one-tailed test?',
      options: [
        { id: 'a', text: 'When the two-tailed test gives p = 0.07 and you want p < 0.05', isCorrect: false, explanation: 'Choosing a one-tailed test to rescue a borderline result is p-hacking.' },
        { id: 'b', text: 'When prior theory strongly specifies the direction of the effect, decided before data collection', isCorrect: true, explanation: 'Correct! One-tailed tests are valid when direction is pre-specified based on theory.' },
        { id: 'c', text: 'Always — they are more powerful', isCorrect: false, explanation: 'One-tailed tests are more powerful in one direction but completely miss effects in the other. Two-tailed is the safer default.' },
        { id: 'd', text: 'When the sample size is small', isCorrect: false, explanation: 'Sample size does not determine which tail to use.' },
      ],
      explanation: 'One-tailed tests are valid only when the direction is theoretically justified and pre-specified.',
      hint: 'Think about when you can be sure the effect will only go one way.',
    },
    {
      id: 'tails-kc-3', type: 'numerical',
      question: 'For a one-tailed test at α = 0.05, what is z*? (Use 3 decimal places)',
      answer: 1.645,
      tolerance: 0.005,
      explanation: 'One-tailed α = 0.05 → z* = 1.645 (the z that puts 5% in one tail).',
      hint: 'One-tailed: all 5% in one tail. Two-tailed: 2.5% each side → z* = 1.96.',
    },
    {
      id: 'tails-kc-4', type: 'multiple-choice',
      question: 'A test gives z = 1.80. You use a two-tailed test at α = 0.05 (z* = 1.96). Decision?',
      options: [
        { id: 'a', text: 'Reject H₀ — z = 1.80 > 1.645', isCorrect: false, explanation: '1.645 is the one-tailed threshold. For two-tailed, the threshold is 1.96.' },
        { id: 'b', text: 'Fail to reject H₀ — |z| = 1.80 < 1.96', isCorrect: true, explanation: 'Correct! |z| = 1.80 does not exceed the two-tailed z* = 1.96.' },
        { id: 'c', text: 'Reject H₀ — any z > 1 is significant', isCorrect: false, explanation: 'Significance depends on z* for the chosen α and number of tails.' },
        { id: 'd', text: 'Cannot decide without the p-value', isCorrect: false, explanation: 'The critical value approach gives the same decision — |z| < z* means fail to reject.' },
      ],
      explanation: 'Two-tailed, α = 0.05: reject if |z| ≥ 1.96. Here |z| = 1.80 < 1.96 → fail to reject.',
      hint: 'Compare |z| to z* = 1.96 for a two-tailed test.',
    },
    {
      id: 'tails-kc-5', type: 'multiple-choice',
      question: 'Why is the two-tailed test generally preferred as the default?',
      options: [
        { id: 'a', text: 'It always gives a smaller p-value', isCorrect: false, explanation: 'Two-tailed p-values are larger (doubled), not smaller, than one-tailed.' },
        { id: 'b', text: 'It detects effects in either direction and guards against directional bias', isCorrect: true, explanation: 'Correct! Two-tailed tests do not assume the direction of the effect, making them more robust.' },
        { id: 'c', text: 'It uses a larger sample size', isCorrect: false, explanation: 'The sample size is unrelated to the choice of tails.' },
        { id: 'd', text: 'It is required by most statistics software', isCorrect: false, explanation: 'Software supports both; the choice is the researcher\'s.' },
      ],
      explanation: 'Two-tailed tests detect effects in both directions and are more conservative. One-tailed tests should only be used with strong theoretical justification.',
      hint: 'What direction does a two-tailed test cover that a one-tailed test does not?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ott-tf-1', type: 'true-false', question: 'A two-tailed test is used when the alternative hypothesis uses ≠.', isTrue: true, explanation: 'H₁: μ ≠ μ₀ tests for a difference in either direction — a two-tailed test.' },
    { id: 'ott-tf-2', type: 'true-false', question: 'A one-tailed test has more power to detect an effect in the specified direction than a two-tailed test.', isTrue: true, explanation: 'A one-tailed test concentrates all α in one tail, making it more powerful for detecting effects in that direction.' },
    { id: 'ott-tf-3', type: 'true-false', question: 'For a two-tailed test at α = 0.05, the critical z* values are ±1.96.', isTrue: true, explanation: 'α = 0.05 split equally across two tails → α/2 = 0.025 per tail → z* = ±1.96.' },
    { id: 'ott-tf-4', type: 'true-false', question: 'For a one-tailed right test at α = 0.05, the critical z* value is 1.645.', isTrue: true, explanation: 'All α = 0.05 in the right tail: P(Z > 1.645) = 0.05. Critical value = 1.645.' },
    { id: 'ott-tf-5', type: 'true-false', question: 'You can switch from two-tailed to one-tailed after seeing the data if the effect is in the predicted direction.', isTrue: false, explanation: 'The choice of tails must be pre-specified. Switching post-hoc (to halve the p-value) is p-hacking.' },
    { id: 'ott-tf-6', type: 'true-false', question: 'The p-value for a two-tailed test is twice the p-value for the corresponding one-tailed test.', isTrue: true, explanation: 'Two-tailed p = 2 × one-tailed p (for the same test statistic). The two-tailed test splits probability across both tails.' },
    { id: 'ott-tf-7', type: 'true-false', question: 'A one-tailed test should be used whenever the researcher predicts a directional effect.', isTrue: false, explanation: 'A one-tailed test is appropriate only when the direction is strongly justified by prior theory or earlier research (before this data are collected) — not simply because the researcher has a hunch.' },
    { id: 'ott-tf-8', type: 'true-false', question: 'A two-tailed test at α = 0.05 has a higher critical z* threshold than a one-tailed test at the same α.', isTrue: true, explanation: 'Two-tailed: z* = 1.96. One-tailed: z* = 1.645. Higher threshold → harder to reject H₀ in any one direction.' },
    { id: 'ott-tf-9', type: 'true-false', question: 'If the two-tailed p-value is 0.06, the one-tailed p-value (in the correct direction) is 0.03.', isTrue: true, explanation: 'One-tailed p = two-tailed p / 2 = 0.06/2 = 0.03 (when the test statistic is in the hypothesised direction).' },
    { id: 'ott-tf-10', type: 'true-false', question: 'A two-tailed test can detect effects in both positive and negative directions.', isTrue: true, explanation: 'The two-tailed rejection region covers both extreme tails, so effects in either direction can lead to rejection of H₀.' },
    { id: 'ott-tf-11', type: 'true-false', question: 'One-tailed tests always produce smaller p-values than two-tailed tests.', isTrue: false, explanation: 'One-tailed tests produce smaller p-values only when the effect is in the predicted direction. If in the opposite direction, the one-tailed p > 0.5.' },
    { id: 'ott-tf-12', type: 'true-false', question: 'By convention, two-tailed tests are used as the default in most scientific research.', isTrue: true, explanation: 'Two-tailed tests are the conservative default. One-tailed tests require strong theoretical justification to be appropriate.' },
    { id: 'ott-tf-13', type: 'true-false', question: 'Using a one-tailed test when you should use two-tailed inflates the Type I error rate.', isTrue: true, explanation: 'A one-tailed test at α = 0.05 applies the full α in one direction. If the direction was not pre-specified, the effective Type I rate doubles.' },
    { id: 'ott-tf-14', type: 'true-false', question: 'For a left-tailed test at α = 0.05, H₀ is rejected when z < −1.645.', isTrue: true, explanation: 'Left-tailed: rejection region is the lower tail. z < −1.645 means the result is extreme in the left direction.' },
    { id: 'ott-tf-15', type: 'true-false', question: 'If x̄ > μ₀ and H₁: μ < μ₀ (left-tailed), the data provide strong evidence against H₀.', isTrue: false, explanation: 'The data are in the WRONG direction for H₁: μ < μ₀. Evidence against H₀ requires x̄ < μ₀ in a left-tailed test.' },
    { id: 'ott-tf-16', type: 'true-false', question: 'The critical value for a two-tailed test at α = 0.01 is z* = ±2.576.', isTrue: true, explanation: 'Two-tailed α = 0.01: α/2 = 0.005 per tail → z* = ±2.576.' },
    { id: 'ott-tf-17', type: 'true-false', question: 'A one-tailed test at α = 0.05 has the same Type I error rate as a two-tailed test at α = 0.05.', isTrue: true, explanation: 'Both control the Type I error at α = 0.05. The difference is which values of the test statistic fall in the rejection region.' },
    { id: 'ott-tf-18', type: 'true-false', question: 'The critical region for a right-tailed test is in the left tail of the distribution.', isTrue: false, explanation: 'A right-tailed test has the rejection region in the RIGHT tail — where large values of the test statistic provide evidence for H₁: μ > μ₀.' },
    { id: 'ott-tf-19', type: 'true-false', question: 'When z = −2.0 and the test is right-tailed at α = 0.05, we reject H₀.', isTrue: false, explanation: 'Right-tailed: reject when z > 1.645. z = −2.0 is in the left tail — it does not fall in the right-tail rejection region.' },
    { id: 'ott-tf-20', type: 'true-false', question: 'The choice between one-tailed and two-tailed tests affects the p-value but not the test statistic.', isTrue: true, explanation: 'The test statistic z = (x̄ − μ₀)/SE is the same regardless of tails. The p-value changes because we calculate the tail probability differently.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ott-mc-6', type: 'multiple-choice', question: 'z = 2.10. Two-tailed test at α = 0.05 (z* = 1.96). What is the conclusion?', options: [{ id: 'a', text: 'Fail to reject H₀ — z = 2.10 < z* = 2.576', isCorrect: false, explanation: 'z* = 2.576 is for α = 0.01 two-tailed. At α = 0.05 two-tailed, z* = 1.96, and 2.10 > 1.96 → reject.' }, { id: 'b', text: 'Reject H₀ — |z| = 2.10 > z* = 1.96', isCorrect: true, explanation: '|z| = 2.10 > 1.96. The test statistic falls in the two-tailed rejection region → reject H₀.' }, { id: 'c', text: 'Fail to reject H₀ — p-value is not given', isCorrect: false, explanation: 'We can use the critical value approach directly. |z| > z* → reject H₀.' }, { id: 'd', text: 'The test is inconclusive', isCorrect: false, explanation: 'The critical value method gives a clear decision: |z| = 2.10 > 1.96 → reject H₀.' }], explanation: 'Two-tailed at α=0.05: reject when |z| ≥ 1.96. |2.10| = 2.10 > 1.96 → reject H₀.', hint: 'Compare |z| to z* = 1.96 for a two-tailed test.' },
    { id: 'ott-mc-7', type: 'multiple-choice', question: 'A researcher tests if a new teaching method is "different" (better or worse). What type of test is appropriate?', options: [{ id: 'a', text: 'One-tailed right — the new method is probably better', isCorrect: false, explanation: '"Different (better or worse)" means no direction is pre-specified — use two-tailed.' }, { id: 'b', text: 'Two-tailed — testing for difference in either direction', isCorrect: true, explanation: 'Testing for "different" means H₁: μ_new ≠ μ_old — a two-tailed test.' }, { id: 'c', text: 'One-tailed left — the new method might be worse', isCorrect: false, explanation: 'No directional hypothesis is stated — two-tailed is the appropriate default.' }, { id: 'd', text: 'No test is needed', isCorrect: false, explanation: 'A hypothesis test is appropriate.' }], explanation: '"Different" (either direction) → H₁: ≠ → two-tailed test.', hint: 'The word "different" implies no specific direction.' },
    { id: 'ott-mc-8', type: 'multiple-choice', question: 'A one-tailed test gives p = 0.03. What would the two-tailed p-value be (same data, same test statistic)?', options: [{ id: 'a', text: '0.03', isCorrect: false, explanation: 'Two-tailed doubles the one-tailed p: 2 × 0.03 = 0.06.' }, { id: 'b', text: '0.06', isCorrect: true, explanation: 'Two-tailed p = 2 × one-tailed p = 2 × 0.03 = 0.06 (when the test statistic is in the hypothesised direction).' }, { id: 'c', text: '0.015', isCorrect: false, explanation: '0.015 = 0.03/2 — you divided instead of multiplied.' }, { id: 'd', text: '0.97', isCorrect: false, explanation: '0.97 = 1 − 0.03 — no basis for this.' }], explanation: 'Two-tailed p = 2 × one-tailed p when the effect is in the predicted direction.', hint: 'Two-tailed p doubles the one-tailed p.' },
    { id: 'ott-mc-9', type: 'multiple-choice', question: 'Which critical value is most appropriate for H₁: μ < μ₀ at α = 0.05?', options: [{ id: 'a', text: 'z* = +1.645', isCorrect: false, explanation: '+1.645 is the right-tailed critical value. A left-tailed test rejects when z < −1.645.' }, { id: 'b', text: 'z* = −1.645', isCorrect: true, explanation: 'Left-tailed (H₁: μ < μ₀): reject when z < −1.645. The rejection region is the left tail.' }, { id: 'c', text: 'z* = ±1.96', isCorrect: false, explanation: '±1.96 is for a two-tailed test.' }, { id: 'd', text: 'z* = ±2.576', isCorrect: false, explanation: '±2.576 is for a two-tailed test at α = 0.01.' }], explanation: 'Left-tailed test at α = 0.05: reject when z ≤ −1.645.', hint: 'For H₁: μ < μ₀, which tail contains the rejection region?' },
    { id: 'ott-mc-10', type: 'multiple-choice', question: 'A researcher pre-specifies H₁: μ > 50 but observes x̄ = 45. What is the p-value likely to be?', options: [{ id: 'a', text: 'Very small — x̄ is far from 50', isCorrect: false, explanation: 'x̄ = 45 < μ₀ = 50 is in the WRONG direction for H₁: μ > 50. The one-tailed right p-value will be very large.' }, { id: 'b', text: 'Very large (> 0.5) — data are in the opposite direction of H₁', isCorrect: true, explanation: 'The test statistic is negative (x̄ < μ₀). For H₁: μ > 50, the p-value = P(Z > z) where z < 0, which is > 0.5.' }, { id: 'c', text: 'Exactly 0.5', isCorrect: false, explanation: 'p = 0.5 only if x̄ = μ₀ exactly.' }, { id: 'd', text: 'Equal to the two-tailed p-value', isCorrect: false, explanation: 'One-tailed and two-tailed p-values are different.' }], explanation: 'For H₁: μ > 50, the right-tail p = P(Z > negative number) > 0.5. No evidence for H₁.', hint: 'Is x̄ = 45 in the direction of H₁: μ > 50?' },
    { id: 'ott-mc-11', type: 'multiple-choice', question: 'A student says: "I got p = 0.06 two-tailed, so I\'ll use one-tailed to get p = 0.03 and achieve significance." What is wrong?', options: [{ id: 'a', text: 'The math is wrong — p does not halve when switching from two to one tailed', isCorrect: false, explanation: 'The math is correct (p does halve). The problem is the post-hoc switching.' }, { id: 'b', text: 'Choosing the tail based on the data is p-hacking and inflates Type I error', isCorrect: true, explanation: 'Switching tail direction after seeing data effectively doubles the Type I error rate — this is a textbook example of p-hacking.' }, { id: 'c', text: 'α = 0.03 is not a valid significance level', isCorrect: false, explanation: 'α = 0.03 could be valid if pre-specified. The problem is the post-hoc adjustment.' }, { id: 'd', text: 'Nothing is wrong — one-tailed tests are always valid', isCorrect: false, explanation: 'One-tailed tests must be pre-specified based on theory — not chosen post-hoc to achieve significance.' }], explanation: 'Post-hoc tail switching doubles the effective Type I error rate — a classic form of p-hacking.', hint: 'When must the choice of one vs two tails be made?' },
    { id: 'ott-mc-12', type: 'multiple-choice', question: 'At α = 0.01, what is the critical value for a RIGHT-tailed z-test?', options: [{ id: 'a', text: '1.96', isCorrect: false, explanation: '1.96 is z* for a two-tailed test at α = 0.05.' }, { id: 'b', text: '2.326', isCorrect: true, explanation: 'Right-tailed at α = 0.01: P(Z > z*) = 0.01 → z* ≈ 2.326.' }, { id: 'c', text: '2.576', isCorrect: false, explanation: '2.576 is z* for a TWO-tailed test at α = 0.01 (0.005 per tail).' }, { id: 'd', text: '1.645', isCorrect: false, explanation: '1.645 is z* for a one-tailed test at α = 0.05, not 0.01.' }], explanation: 'One-tailed right at α = 0.01: P(Z > 2.326) = 0.01. Critical value = 2.326.', hint: 'P(Z > z*) = 0.01 for a one-tailed right test at α = 0.01.' },
    { id: 'ott-mc-13', type: 'multiple-choice', question: 'For H₁: μ ≠ 100, z = −2.5, two-tailed α = 0.05 (z* = ±1.96). Decision?', options: [{ id: 'a', text: 'Fail to reject H₀ — z is negative', isCorrect: false, explanation: 'A two-tailed test rejects for |z| ≥ 1.96 in EITHER direction. |−2.5| = 2.5 > 1.96.' }, { id: 'b', text: 'Reject H₀ — |z| = 2.5 > 1.96', isCorrect: true, explanation: 'Two-tailed test: reject when |z| ≥ z*. |−2.5| = 2.5 > 1.96 → reject H₀.' }, { id: 'c', text: 'Cannot conclude — z is in the left tail', isCorrect: false, explanation: 'The two-tailed test rejects in both tails. The left tail is part of the rejection region.' }, { id: 'd', text: 'Need to check a z-table', isCorrect: false, explanation: 'We know z* = 1.96. |−2.5| = 2.5 > 1.96 → reject immediately.' }], explanation: 'Two-tailed: |z| = 2.5 > 1.96 → reject H₀. Both tails matter.', hint: 'Two-tailed tests use absolute value: reject if |z| ≥ z*.' },
    { id: 'ott-mc-14', type: 'multiple-choice', question: 'Which statement correctly describes the advantage of a one-tailed test over a two-tailed test?', options: [{ id: 'a', text: 'It is always more accurate', isCorrect: false, explanation: 'Accuracy is not the relevant dimension — power is.' }, { id: 'b', text: 'It has greater power to detect an effect in the pre-specified direction', isCorrect: true, explanation: 'Concentrating α in one tail lowers z* (1.645 vs 1.96), making it easier to achieve rejection when the effect is in the right direction.' }, { id: 'c', text: 'It has a lower Type I error rate', isCorrect: false, explanation: 'Both tests have Type I error rate α. The one-tailed advantage is power in the specified direction, not a smaller α.' }, { id: 'd', text: 'It produces a lower p-value', isCorrect: false, explanation: 'One-tailed produces a lower p-value only when the effect is in the predicted direction — not universally.' }], explanation: 'One-tailed advantage: more power for detecting directional effects. Disadvantage: misses effects in the other direction.', hint: 'Where does the extra power come from in a one-tailed test?' },
    { id: 'ott-mc-15', type: 'multiple-choice', question: 'A two-tailed test at α = 0.05 fails to reject H₀. If the same test is performed one-tailed (in the direction of the observed effect), would it reject?', options: [{ id: 'a', text: 'Always yes — one-tailed has lower z*', isCorrect: false, explanation: 'Not always. The two-tailed p must be between 0.05 and 0.10 for the one-tailed to achieve significance.' }, { id: 'b', text: 'Only if the two-tailed p-value is between 0.05 and 0.10', isCorrect: true, explanation: 'One-tailed p = two-tailed p / 2. If two-tailed p ∈ (0.05, 0.10), then one-tailed p ∈ (0.025, 0.05) — significant at α = 0.05.' }, { id: 'c', text: 'Never — both tests use the same data', isCorrect: false, explanation: 'Same data, different α allocation. One-tailed can achieve significance when two-tailed cannot.' }, { id: 'd', text: 'Only if n is increased', isCorrect: false, explanation: 'Changing n would require new data. The question assumes the same data.' }], explanation: 'If two-tailed p ∈ (0.05, 0.10): one-tailed p = half = (0.025, 0.05) — significant. But this is only valid if the direction was pre-specified.', hint: 'One-tailed p = two-tailed p / 2. When does this shift cross the α = 0.05 threshold?' },
  ],
  keyTakeaway:
    'Two-tailed tests (H₁: ≠) split α across both tails (z* = 1.96 at α = 0.05). One-tailed tests (H₁: < or >) put all α in one tail (z* = 1.645 at α = 0.05). Always choose before collecting data. Two-tailed is the conservative default.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "z* cheat card" — the 4 numbers to memorise:</strong></p>
      <div className="overflow-x-auto">
        <table className="text-xs w-full border-collapse">
          <thead><tr className="bg-violet-100"><th className="border border-violet-200 p-1">α</th><th className="border border-violet-200 p-1">Two-tailed z*</th><th className="border border-violet-200 p-1">One-tailed z*</th></tr></thead>
          <tbody>
            <tr><td className="border border-violet-200 p-1 text-center">0.10</td><td className="border border-violet-200 p-1 text-center font-mono">1.645</td><td className="border border-violet-200 p-1 text-center font-mono">1.282</td></tr>
            <tr><td className="border border-violet-200 p-1 text-center">0.05</td><td className="border border-violet-200 p-1 text-center font-bold font-mono text-violet-700">1.96</td><td className="border border-violet-200 p-1 text-center font-mono">1.645</td></tr>
            <tr><td className="border border-violet-200 p-1 text-center">0.01</td><td className="border border-violet-200 p-1 text-center font-mono">2.576</td><td className="border border-violet-200 p-1 text-center font-mono">2.326</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-textMuted">Shortcut: Two-tailed uses α/2 per tail. One-tailed uses full α in one tail → lower z* → easier to reject in that direction.</p>
    </div>
  ),
  visualization: <TailsViz />,
  datasetGenerator: false,
}

export default function OneTailedTwoTailedTests({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
