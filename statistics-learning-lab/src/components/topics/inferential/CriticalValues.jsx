import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, zCritical } from '../../../utils/stats'

// ── Interactive critical value calculator ─────────────────────────────────────

function CriticalValueViz() {
  const [alpha, setAlpha] = useState(0.05)
  const [tails, setTails] = useState(2)

  const zStar = round(zCritical(alpha, tails), 4)

  // SVG bell curve
  const pts = []
  for (let x = -3.5; x <= 3.5; x += 0.1) {
    const y = Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI)
    pts.push([x, y])
  }
  const toSVG = (x, y) => [(x + 3.5) * (300 / 7), 80 - y * 250]
  const linePath = pts.map((p, i) => (i === 0 ? 'M' : 'L') + toSVG(...p).join(','))
  const closedPath = [...linePath, `L${toSVG(3.5, 0).join(',')}`, `L${toSVG(-3.5, 0).join(',')}`, 'Z']

  const crit = zStar
  const leftPts = pts.filter((p) => p[0] <= -crit)
  const rightPts = pts.filter((p) => p[0] >= crit)

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
          <label className="block text-xs font-medium text-textDark mb-1">Significance level (α)</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white text-textDark">
            <option value={0.10}>α = 0.10</option>
            <option value={0.05}>α = 0.05</option>
            <option value={0.01}>α = 0.01</option>
            <option value={0.001}>α = 0.001</option>
          </select>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-center">
        <div className="text-xs text-blue-600 font-medium mb-1">Critical value z*</div>
        <div className="text-3xl font-bold text-blue-900">{tails === 2 ? '±' : ''}{zStar}</div>
        <div className="text-xs text-blue-700 mt-1">
          {tails === 2
            ? `Reject H₀ if |z| ≥ ${zStar}`
            : `Right-tailed: reject H₀ if z ≥ ${zStar}. Left-tailed: reject H₀ if z ≤ −${zStar}.`}
        </div>
      </div>

      <svg viewBox="0 0 300 90" className="w-full h-28">
        <path d={closedPath.join(' ')} fill="#dbeafe" stroke="none" />
        {tails === 2
          ? <><path d={regionPath(leftPts)} fill="#ef4444" opacity="0.5" /><path d={regionPath(rightPts)} fill="#ef4444" opacity="0.5" /></>
          : <path d={regionPath(rightPts)} fill="#ef4444" opacity="0.5" />
        }
        <path d={linePath.join(' ')} fill="none" stroke="#2563EB" strokeWidth="1.5" />
        <line x1={toSVG(crit, 0)[0]} y1="8" x2={toSVG(crit, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1.2" />
        {tails === 2 && <line x1={toSVG(-crit, 0)[0]} y1="8" x2={toSVG(-crit, 0)[0]} y2="80" stroke="#ef4444" strokeWidth="1.2" />}
        <text x="150" y="88" textAnchor="middle" fontSize="7" fill="#374151">0</text>
        <text x={toSVG(crit, 0)[0]} y="88" textAnchor="middle" fontSize="6" fill="#ef4444">+{zStar}</text>
        {tails === 2 && <text x={toSVG(-crit, 0)[0]} y="88" textAnchor="middle" fontSize="6" fill="#ef4444">−{zStar}</text>}
        <text x={toSVG(crit + 0.5, 0)[0] + 5} y="25" fontSize="6" fill="#dc2626">Reject</text>
        {tails === 2 && <text x="10" y="25" fontSize="6" fill="#dc2626">Reject</text>}
      </svg>

      <p className="text-xs text-gray-500 mt-2">
        Red region = rejection region. The critical value is the boundary. Changing α moves the boundary.
      </p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Critical Values',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Identify critical values for z and t distributions, and use them to define the rejection region for a hypothesis test.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>critical value</strong> is the threshold that separates the rejection region
        from the non-rejection region on the sampling distribution. If the test statistic
        exceeds the critical value (in absolute value for two-tailed tests), we reject H₀.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-2">Common z* critical values</p>
        <table className="w-full text-blue-800 text-xs">
          <thead><tr className="border-b border-blue-200"><th className="text-left py-1">α</th><th className="text-left py-1">Two-tailed z*</th><th className="text-left py-1">One-tailed z*</th></tr></thead>
          <tbody>
            <tr><td className="py-0.5">0.10</td><td>±1.645</td><td>1.282 (−1.282 for left tail)</td></tr>
            <tr><td className="py-0.5">0.05</td><td>±1.960</td><td>1.645 (−1.645 for left tail)</td></tr>
            <tr><td className="py-0.5">0.01</td><td>±2.576</td><td>2.326 (−2.326 for left tail)</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        For t-tests (unknown σ), critical values come from the t-distribution and depend on
        degrees of freedom (df = n−1). Larger df → t* approaches z*. Memorise the z* values
        above; use a t-table or calculator for t*.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Think of speed limit signs: the speed limit is the critical value. If your speed (test
        statistic) exceeds the limit, you get a fine (reject H₀). The limit is set before you
        drive — not after you see how fast you went.
      </p>
    </div>
  ),
  formula: {
    main: 'Reject H₀ if |test stat| ≥ critical value',
    variants: [
      { label: 'Two-tailed rejection rule (z)', expression: 'Reject H₀ if |z| ≥ z_{α/2}', latex: '\\text{Reject } H_0 \\text{ if } |z| \\geq z_{\\alpha/2}' },
      { label: 'One-tailed rejection rule (z)', expression: 'Reject H₀ if z ≥ z_α  (right) or z ≤ −z_α (left)', latex: '' },
      { label: 'T-test rejection rule', expression: 'Reject H₀ if |t| ≥ t_{α/2, df}', latex: '\\text{Reject } H_0 \\text{ if } |t| \\geq t_{\\alpha/2,\\, df}' },
    ],
    symbolGuide: [
      { symbol: 'z*', meaning: 'Critical z-value — from standard normal distribution' },
      { symbol: 't*', meaning: 'Critical t-value — from t-distribution with (n−1) degrees of freedom' },
      { symbol: 'df', meaning: 'Degrees of freedom — affects the t-distribution shape' },
      { symbol: 'Rejection region', meaning: 'Set of test statistic values that lead to rejecting H₀' },
    ],
  },
  whenToUse: [
    'In the critical-value approach to hypothesis testing (equivalent to the p-value approach)',
    'When you want to visualise the rejection region on the distribution',
  ],
  whenNotToUse: [
    'The critical-value approach gives only reject/fail-to-reject; the p-value approach gives more information about strength of evidence',
  ],
  assumptions: [
    'The test statistic follows the assumed distribution (z or t) under H₀',
    'Critical values are looked up or calculated before making a decision',
  ],
  workedExample: {
    scenario:
      'H₀: μ = 100, H₁: μ ≠ 100 (two-tailed). α = 0.05. Sample: n = 16, x̄ = 106, s = 8.',
    steps: [
      { stepNumber: 1, label: 'Identify test', expression: 'σ unknown → t-test, df = n−1 = 15', result: 'Use t-distribution', explanation: 'Because σ is unknown (estimated by s), use t* — especially important when n is small.' },
      { stepNumber: 2, label: 'Critical value', expression: 't* = t_{0.025, 15} ≈ 2.131 (from t-table)', result: 't* = ±2.131', explanation: 'Rejection region: |t| ≥ 2.131.' },
      { stepNumber: 3, label: 'Test statistic', expression: 't = (106 − 100) / (8/√16) = 6/2', result: 't = 3.0', explanation: 'SE = 2.' },
      { stepNumber: 4, label: 'Decision', expression: '|t| = 3.0 ≥ 2.131 → in rejection region', result: 'Reject H₀', explanation: 'The test statistic exceeds the critical value.' },
    ],
    interpretation:
      'Sufficient evidence to conclude the population mean differs from 100. The test statistic t = 3.0 is well into the rejection region.',
  },
  interpretation:
    'Critical values provide a boundary: test statistics beyond this boundary are "too unlikely under H₀" to be plausible if H₀ were true. The p-value approach and the critical-value approach always give the same decision.',
  commonMistakes: [
    { mistake: 'Using z* when t* is needed', explanation: 'When σ is unknown and n is small, the t-distribution must be used. Using z* gives critical values that are too small, leading to over-rejection.' },
    { mistake: 'Not accounting for degrees of freedom', explanation: 't* changes with df. For df = 5, t* ≈ 2.571; for df = 100, t* ≈ 1.984. Always specify df.' },
    { mistake: 'Forgetting absolute value in two-tailed tests', explanation: 'For a two-tailed test: reject H₀ if |test stat| ≥ z*, not just if test stat ≥ z*.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'cv-easy-1', scenario: 'Two-tailed z-test, α = 0.01.', question: 'What is z*?', hint: 'Look up the standard critical value.', solution: 'z* = ±2.576.' },
    ],
    moderate: [
      { id: 'cv-mod-1', scenario: 'z = 2.10, two-tailed α = 0.05.', question: 'What is z*? Do you reject H₀?', hint: 'z*(two-tailed, 0.05) = 1.96.', solution: 'z* = 1.96. |z| = 2.10 ≥ 1.96 → Reject H₀.' },
    ],
    challenging: [
      { id: 'cv-chal-1', scenario: 't-test, df = 24, two-tailed α = 0.05. t = 2.04.', question: 'Approximately what is t*? Do you reject H₀?', hint: 't*(24 df, two-tailed, α=0.05) ≈ 2.064.', solution: 't* ≈ 2.064. |t| = 2.04 < 2.064 → Fail to reject H₀. (Just barely!)' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cv-kc-1', type: 'multiple-choice',
      question: 'For a two-tailed test at α = 0.05 (z-test), what is the critical value?',
      options: [
        { id: 'a', text: '1.28', isCorrect: false, explanation: '1.28 is the one-tailed z* for α = 0.10.' },
        { id: 'b', text: '1.645', isCorrect: false, explanation: '1.645 is the one-tailed z* for α = 0.05.' },
        { id: 'c', text: '1.96', isCorrect: true, explanation: 'Correct! Two-tailed α = 0.05 uses z* = ±1.96.' },
        { id: 'd', text: '2.576', isCorrect: false, explanation: '2.576 is the two-tailed z* for α = 0.01.' },
      ],
      explanation: 'α = 0.05, two-tailed → α/2 = 0.025 in each tail → z* = 1.96.',
      hint: 'What z-value cuts off 2.5% in each tail?',
    },
    {
      id: 'cv-kc-2', type: 'multiple-choice',
      question: 'z = −2.30, two-tailed α = 0.05 (z* = ±1.96). What is the decision?',
      options: [
        { id: 'a', text: 'Fail to reject H₀, because z is negative', isCorrect: false, explanation: 'The sign does not determine the decision — the magnitude does (|z| vs z*).' },
        { id: 'b', text: 'Reject H₀, because |−2.30| = 2.30 > 1.96', isCorrect: true, explanation: 'Correct! |z| = 2.30 exceeds z* = 1.96 → reject H₀.' },
        { id: 'c', text: 'Fail to reject H₀, because the result is in the left tail', isCorrect: false, explanation: 'Two-tailed tests reject in both tails — the left tail is part of the rejection region.' },
        { id: 'd', text: 'Reject H₀ only for a one-tailed test', isCorrect: false, explanation: 'For a two-tailed test, |z| = 2.30 exceeds 1.96, so we reject regardless.' },
      ],
      explanation: 'For two-tailed: reject H₀ if |z| ≥ z*. |−2.30| = 2.30 > 1.96 → reject.',
      hint: 'Use the absolute value of z for a two-tailed test.',
    },
    {
      id: 'cv-kc-3', type: 'multiple-choice',
      question: 'Which z* corresponds to a two-tailed test at α = 0.01?',
      options: [
        { id: 'a', text: '1.96', isCorrect: false, explanation: '1.96 is two-tailed α = 0.05.' },
        { id: 'b', text: '2.326', isCorrect: false, explanation: '2.326 is one-tailed α = 0.01.' },
        { id: 'c', text: '2.576', isCorrect: true, explanation: 'Correct! Two-tailed α = 0.01 → each tail = 0.005 → z* = 2.576.' },
        { id: 'd', text: '3.090', isCorrect: false, explanation: '3.090 is one-tailed α = 0.001.' },
      ],
      explanation: 'Two-tailed α = 0.01 → α/2 = 0.005 per tail → z* = 2.576.',
      hint: 'Two-tailed → split α by 2. α/2 = 0.005 → z* = ?',
    },
    {
      id: 'cv-kc-4', type: 'multiple-choice',
      question: 'Why is t* larger than z* for the same α and number of tails?',
      options: [
        { id: 'a', text: 'Because t-tests are for larger samples', isCorrect: false, explanation: 'It is the opposite — t-tests are used for smaller samples with unknown σ.' },
        { id: 'b', text: 'The t-distribution has heavier tails, requiring a more extreme value to cut off the same area', isCorrect: true, explanation: 'Correct! The t-distribution is wider than the normal, so t* is further from zero for the same α.' },
        { id: 'c', text: 'The t statistic is always larger than z', isCorrect: false, explanation: 'The test statistic value depends on the data; the critical value difference is about the distribution shape.' },
        { id: 'd', text: 'Degrees of freedom make the test easier to pass', isCorrect: false, explanation: 'More df makes t* closer to z*, not easier.' },
      ],
      explanation: 't-distribution has heavier tails than normal. More area in tails → t* must be larger to cut off the same proportion.',
      hint: 'Heavier tails → need to go further out to reach the same area.',
    },
    {
      id: 'cv-kc-5', type: 'multiple-choice',
      question: 't = 2.50, df = 20, two-tailed α = 0.05. t*(df=20) ≈ 2.086. Decision?',
      options: [
        { id: 'a', text: 'Fail to reject H₀ — t = 2.50 is not extreme enough', isCorrect: false, explanation: '|t| = 2.50 > t* = 2.086 → reject H₀.' },
        { id: 'b', text: 'Reject H₀ — |t| = 2.50 > 2.086', isCorrect: true, explanation: 'Correct! The test statistic exceeds the critical value → reject H₀.' },
        { id: 'c', text: 'Need to use z* = 1.96 instead', isCorrect: false, explanation: 'With unknown σ and df = 20, we correctly use t* = 2.086.' },
        { id: 'd', text: 'Cannot determine without the p-value', isCorrect: false, explanation: 'The critical value approach and p-value approach always agree — |t| > t* ↔ p < α.' },
      ],
      explanation: 'Two-tailed: reject H₀ if |t| ≥ t*. 2.50 ≥ 2.086 → reject H₀.',
      hint: 'Compare |t| to t*.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'cv-tf-1', type: 'true-false', question: 'The critical value defines the boundary of the rejection region in a hypothesis test.', isTrue: true, explanation: 'The rejection region is all test statistic values beyond the critical value. If |z| ≥ z*, we reject H₀.' },
    { id: 'cv-tf-2', type: 'true-false', question: 'A critical z-value of 1.96 is used for a two-tailed test at α = 0.05.', isTrue: true, explanation: 'P(−1.96 < Z < 1.96) = 0.95, so the critical values ±1.96 leave α = 0.05 in the two tails combined.' },
    { id: 'cv-tf-3', type: 'true-false', question: 'The t* critical value is always smaller than the z* critical value for the same α.', isTrue: false, explanation: 't* > z* for the same α and confidence level (for finite df). t-distribution has heavier tails than normal.' },
    { id: 'cv-tf-4', type: 'true-false', question: 'The critical value for a one-tailed test at α = 0.05 is z* = 1.645.', isTrue: true, explanation: 'P(Z > 1.645) = 0.05. For a one-tailed test, all α is in one tail → z* = 1.645.' },
    { id: 'cv-tf-5', type: 'true-false', question: 'If the test statistic exceeds the critical value in absolute value, we reject H₀ in a two-tailed test.', isTrue: true, explanation: 'Two-tailed: reject when |test statistic| ≥ critical value. Both tails define the rejection region.' },
    { id: 'cv-tf-6', type: 'true-false', question: 'As degrees of freedom increase, t* approaches z*.', isTrue: true, explanation: 'As df → ∞, the t-distribution converges to the standard normal. t* → z* for large df (large n).' },
    { id: 'cv-tf-7', type: 'true-false', question: 'The critical value approach and the p-value approach always give the same decision.', isTrue: true, explanation: '|z| ≥ z* is equivalent to p ≤ α. Both approaches yield identical conclusions.' },
    { id: 'cv-tf-8', type: 'true-false', question: 'A larger significance level α leads to a larger critical value.', isTrue: false, explanation: 'Larger α → rejection region is wider → critical value DECREASES (lower z*). Larger α makes it easier to reject.' },
    { id: 'cv-tf-9', type: 'true-false', question: 'For a t-test with df = 1, t* at α = 0.05 (two-tailed) is approximately 12.706.', isTrue: true, explanation: 'With df = 1, the t-distribution is very heavy-tailed. t*(df=1, two-tailed, α=0.05) ≈ 12.706.' },
    { id: 'cv-tf-10', type: 'true-false', question: 'The rejection region is the set of test statistic values that would lead to rejecting H₀.', isTrue: true, explanation: 'Values in the rejection region (beyond the critical value) indicate results incompatible with H₀ at significance level α.' },
    { id: 'cv-tf-11', type: 'true-false', question: 'For a two-tailed z-test at α = 0.01, z* = ±2.326.', isTrue: false, explanation: 'z* = 2.326 is for a ONE-tailed test at α = 0.01. For two-tailed α = 0.01, z* = ±2.576.' },
    { id: 'cv-tf-12', type: 'true-false', question: 'Degrees of freedom for a one-sample t-test equal n.', isTrue: false, explanation: 'df = n − 1 for a one-sample t-test. One degree is lost because we estimate μ from x̄.' },
    { id: 'cv-tf-13', type: 'true-false', question: 'The critical value for a z-test does not depend on sample size.', isTrue: true, explanation: 'z* depends only on α and the number of tails — not on n. Sample size affects SE and thus the test statistic, not z*.' },
    { id: 'cv-tf-14', type: 'true-false', question: 'In a left-tailed test, H₀ is rejected when the test statistic is smaller than the (negative) critical value.', isTrue: true, explanation: 'Left-tailed: reject when z ≤ −z* (e.g., z ≤ −1.645 at α = 0.05). The rejection region is the left tail.' },
    { id: 'cv-tf-15', type: 'true-false', question: 'For large samples, z* and t* are very close, and they converge as df increases.', isTrue: true, explanation: 'The t-distribution converges to the standard normal as df → ∞. (E.g., two-tailed α = 0.05: t* = 2.042 at df = 30, 1.984 at df = 100, vs z* = 1.96.)' },
    { id: 'cv-tf-16', type: 'true-false', question: 'If z* = 1.96 and the computed z = 1.95, we reject H₀.', isTrue: false, explanation: 'z = 1.95 < z* = 1.96. The test statistic does not exceed the critical value → fail to reject H₀.' },
    { id: 'cv-tf-17', type: 'true-false', question: 'For a chi-square goodness-of-fit or independence test, the rejection region is in the upper tail.', isTrue: true, explanation: 'χ² ≥ 0 always. Large χ² values indicate large discrepancies between O and E — the rejection region is the upper tail.' },
    { id: 'cv-tf-18', type: 'true-false', question: 'Increasing α from 0.01 to 0.05 increases (makes larger) the critical value for a z-test.', isTrue: false, explanation: 'Increasing α widens the rejection region → critical value DECREASES from 2.576 to 1.96. Smaller z* → easier to reject.' },
    { id: 'cv-tf-19', type: 'true-false', question: 'If H₀ is true, a test whose critical value(s) are set at α = 0.05 has a 5% probability of producing a test statistic in the rejection region.', isTrue: true, explanation: 'That is the definition of α: P(test statistic in rejection region | H₀ true) = α = 0.05.' },
    { id: 'cv-tf-20', type: 'true-false', question: 'The F-distribution critical value (F*) is always positive.', isTrue: true, explanation: 'F is a ratio of two non-negative quantities (e.g., MS_B/MS_W in ANOVA), so F ≥ 0 and F* > 0. In ANOVA the rejection region is the right tail.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'cv-mc-6', type: 'multiple-choice', question: 'z = 2.10, two-tailed test, α = 0.05. z* = 1.96. Decision?', options: [{ id: 'a', text: 'Fail to reject — z < 2.576', isCorrect: false, explanation: '2.576 is z* for α = 0.01. At α = 0.05 two-tailed, z* = 1.96. Since 2.10 > 1.96, we reject.' }, { id: 'b', text: 'Reject — |z| = 2.10 > z* = 1.96', isCorrect: true, explanation: '|z| = 2.10 > 1.96 = z*. The test statistic falls in the rejection region → reject H₀.' }, { id: 'c', text: 'Fail to reject — z must exceed 2.576', isCorrect: false, explanation: '2.576 applies to α = 0.01, not 0.05.' }, { id: 'd', text: 'Inconclusive', isCorrect: false, explanation: 'Clear decision: |z| > z* → reject H₀.' }], explanation: 'z* = 1.96 at α=0.05 two-tailed. |z| = 2.10 > 1.96 → reject H₀.', hint: 'Compare |z| to z* = 1.96.' },
    { id: 'cv-mc-7', type: 'multiple-choice', question: 'What is the critical t-value for a one-sample t-test at α = 0.05, two-tailed, with n = 25?', options: [{ id: 'a', text: '1.960 (z*)', isCorrect: false, explanation: '1.96 is z*. With unknown σ and n=25, use t* with df=24.' }, { id: 'b', text: '≈2.064 (t* at df = 24)', isCorrect: true, explanation: 't*(df=24, two-tailed, α=0.05) ≈ 2.064. Larger than z*=1.96 due to t-distribution heavier tails.' }, { id: 'c', text: '1.645', isCorrect: false, explanation: '1.645 is z* for a one-tailed test at α=0.05.' }, { id: 'd', text: '2.576', isCorrect: false, explanation: '2.576 is z* for α = 0.01 two-tailed.' }], explanation: 'One-sample t-test, n=25: df = 24. t*(24, 0.05, two-tailed) ≈ 2.064.', hint: 'df = n − 1. Use the t-table, not z*.' },
    { id: 'cv-mc-8', type: 'multiple-choice', question: 'For a left-tailed test at α = 0.05, what is the critical z-value?', options: [{ id: 'a', text: '+1.645', isCorrect: false, explanation: '+1.645 is for a right-tailed test. For left-tailed, the critical value is negative.' }, { id: 'b', text: '−1.645', isCorrect: true, explanation: 'Left-tailed: reject when z ≤ −1.645. Critical value is −1.645.' }, { id: 'c', text: '±1.96', isCorrect: false, explanation: '±1.96 is for a two-tailed test at α = 0.05.' }, { id: 'd', text: '−1.96', isCorrect: false, explanation: '−1.96 is for a left-tailed test at α = 0.025 or half of the two-tailed α = 0.05.' }], explanation: 'Left-tailed α = 0.05: P(Z < z*) = 0.05 → z* = −1.645.', hint: 'For a left-tailed test, the rejection region is in the left tail → negative critical value.' },
    { id: 'cv-mc-9', type: 'multiple-choice', question: 't = 1.80, df = 29, two-tailed α = 0.05. t*(df=29) = 2.045. Decision?', options: [{ id: 'a', text: 'Reject H₀ — t = 1.80 is large', isCorrect: false, explanation: '|t| = 1.80 < t* = 2.045. The test statistic does not reach the critical value.' }, { id: 'b', text: 'Fail to reject H₀ — |t| = 1.80 < t* = 2.045', isCorrect: true, explanation: '1.80 < 2.045. The test statistic is in the non-rejection region → fail to reject H₀.' }, { id: 'c', text: 'Reject H₀ — df = 29 is large enough', isCorrect: false, explanation: 'Large df does not automatically reject H₀. The test statistic must exceed the critical value.' }, { id: 'd', text: 'Cannot decide without p-value', isCorrect: false, explanation: 'Critical value approach: |t| vs t*. 1.80 < 2.045 → fail to reject.' }], explanation: '|t| = 1.80 < t* = 2.045 → fail to reject H₀.', hint: 'Compare |t| to t*. If |t| < t*, fail to reject.' },
    { id: 'cv-mc-10', type: 'multiple-choice', question: 'Which critical value corresponds to a 99% confidence interval?', options: [{ id: 'a', text: '1.96', isCorrect: false, explanation: '1.96 corresponds to a 95% confidence interval (α = 0.05 two-tailed).' }, { id: 'b', text: '2.576', isCorrect: true, explanation: '99% CI corresponds to α = 0.01 two-tailed → z* = 2.576.' }, { id: 'c', text: '1.645', isCorrect: false, explanation: '1.645 is for one-tailed 95% or two-tailed 90%.' }, { id: 'd', text: '3.00', isCorrect: false, explanation: '3.00 is not a standard critical value.' }], explanation: '99% CI: α = 0.01 two-tailed → α/2 = 0.005 per tail → z* = 2.576.', hint: 'What is α for a 99% CI? Then find z* for that α two-tailed.' },
    { id: 'cv-mc-11', type: 'multiple-choice', question: 'The critical value for a chi-square test at α = 0.05 with df = 4 is approximately 9.488. χ² = 11.2. Decision?', options: [{ id: 'a', text: 'Fail to reject H₀', isCorrect: false, explanation: 'χ² = 11.2 > χ²* = 9.488 → reject H₀.' }, { id: 'b', text: 'Reject H₀ — χ² = 11.2 > χ²* = 9.488', isCorrect: true, explanation: 'χ² exceeds the critical value → the result is significant → reject H₀.' }, { id: 'c', text: 'Cannot decide without p-value', isCorrect: false, explanation: 'χ² > χ²* is equivalent to p < α → reject H₀.' }, { id: 'd', text: 'The test is invalid — χ² should not exceed 10', isCorrect: false, explanation: 'χ² can be any non-negative value with no maximum.' }], explanation: 'χ² = 11.2 > χ²* = 9.488 → reject H₀. Significant at α = 0.05.', hint: 'Compare χ² to χ²* (chi-square critical value).' },
    { id: 'cv-mc-12', type: 'multiple-choice', question: 'For a z-test, what critical value would you use for H₁: μ > μ₀ at α = 0.01?', options: [{ id: 'a', text: '1.645', isCorrect: false, explanation: '1.645 is for one-tailed α = 0.05, not 0.01.' }, { id: 'b', text: '2.326', isCorrect: true, explanation: 'Right-tailed at α = 0.01: P(Z > z*) = 0.01 → z* = 2.326.' }, { id: 'c', text: '2.576', isCorrect: false, explanation: '2.576 is for a TWO-tailed test at α = 0.01 (α/2 = 0.005 per tail).' }, { id: 'd', text: '1.96', isCorrect: false, explanation: '1.96 is for a two-tailed test at α = 0.05.' }], explanation: 'One-tailed right at α = 0.01: P(Z > z*) = 0.01 → z* ≈ 2.326.', hint: 'One-tailed α = 0.01 → P(Z > z*) = 0.01.' },
    { id: 'cv-mc-13', type: 'multiple-choice', question: 'A t-test with df = 10 gives t = −2.5. Two-tailed α = 0.05, t* = 2.228. Decision?', options: [{ id: 'a', text: 'Fail to reject — negative t-values do not count', isCorrect: false, explanation: 'Two-tailed tests use |t|. |−2.5| = 2.5 > 2.228 → reject.' }, { id: 'b', text: 'Reject H₀ — |t| = 2.5 > t* = 2.228', isCorrect: true, explanation: 'Two-tailed test: reject when |t| ≥ t*. |−2.5| = 2.5 > 2.228 → reject H₀.' }, { id: 'c', text: 'The t-value cannot be negative', isCorrect: false, explanation: 't = (x̄ − μ₀)/SE can be negative when x̄ < μ₀.' }, { id: 'd', text: 'Need more information', isCorrect: false, explanation: '|t| = 2.5 and t* = 2.228 — decision is clear.' }], explanation: '|t| = 2.5 > t* = 2.228 → reject H₀. Two-tailed tests use absolute value.', hint: 'Use absolute value of t for two-tailed test.' },
    { id: 'cv-mc-14', type: 'multiple-choice', question: 'Why do we use t* instead of z* when σ is unknown?', options: [{ id: 'a', text: 'Because the data are not normal', isCorrect: false, explanation: 'The t-distribution is used because σ is estimated by s, not because of non-normality.' }, { id: 'b', text: 'Because estimating σ with s introduces extra uncertainty, requiring heavier-tailed critical values', isCorrect: true, explanation: 'Using s instead of σ adds estimation uncertainty. The t-distribution accounts for this with heavier tails → larger t* than z*.' }, { id: 'c', text: 'Because z is always incorrect', isCorrect: false, explanation: 'z is correct when σ is known or n is very large.' }, { id: 'd', text: 'Because the sample is small', isCorrect: false, explanation: 'Small n is often when σ is unknown, but the fundamental reason is the estimation of σ, not n per se.' }], explanation: 'Estimating σ with s adds uncertainty → t-distribution has heavier tails → t* > z* to account for this.', hint: 'What source of extra uncertainty arises when you use s instead of σ?' },
    { id: 'cv-mc-15', type: 'multiple-choice', question: 'For a two-tailed test, the total α = 0.05 is split as:', options: [{ id: 'a', text: 'α = 0.05 in the right tail only', isCorrect: false, explanation: 'That is a one-tailed right test, not two-tailed.' }, { id: 'b', text: 'α/2 = 0.025 in each tail', isCorrect: true, explanation: 'Two-tailed: α split equally → 0.025 in the left tail and 0.025 in the right tail.' }, { id: 'c', text: 'α = 0.025 in total', isCorrect: false, explanation: 'The total is still α = 0.05. Each tail gets α/2 = 0.025.' }, { id: 'd', text: 'α = 0.05 in each tail (total = 0.10)', isCorrect: false, explanation: 'Total must equal α = 0.05. Each tail gets α/2 = 0.025.' }], explanation: 'Two-tailed: α/2 = 0.025 per tail. Total rejection probability = 0.025 + 0.025 = 0.05.', hint: 'Two-tailed splits α equally between both tails.' },
  ],
  keyTakeaway:
    'Critical values (z* or t*) define the rejection region. Common z* values: 1.645 (one-tailed, α=0.05), 1.96 (two-tailed, α=0.05), 2.576 (two-tailed, α=0.01). Use t* when σ is unknown — it depends on degrees of freedom.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Speedometer" image:</strong> The critical value is the speed limit. If your test statistic (speed) exceeds it, you get flagged (reject H₀).</p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs font-mono space-y-1">
        <div className="font-semibold">The 4 essential z* values:</div>
        <div>One-tailed α=0.10: 1.282 &nbsp;|&nbsp; α=0.05: <strong>1.645</strong></div>
        <div>Two-tailed α=0.05: <strong className="text-violet-700">1.96</strong> &nbsp;|&nbsp; α=0.01: <strong>2.576</strong></div>
      </div>
      <p className="text-xs text-textMuted">t* approaches z* as df → ∞. Use t* whenever σ is unknown (it matters most when n is small).</p>
    </div>
  ),
  visualization: <CriticalValueViz />,
  datasetGenerator: false,
}

export default function CriticalValues({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
