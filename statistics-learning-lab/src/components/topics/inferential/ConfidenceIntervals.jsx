import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, standardError, zCritical, confidenceInterval } from '../../../utils/stats'

// ── Interactive CI builder ────────────────────────────────────────────────────

function CIViz() {
  const [xbar, setXbar] = useState(50)
  const [sigma, setSigma] = useState(10)
  const [n, setN] = useState(30)
  const [level, setLevel] = useState(0.95)

  const alpha = 1 - level
  const zStar = round(zCritical(alpha, 2), 3)
  const se = round(standardError(sigma, n), 4)
  const me = round(zStar * se, 3)
  const { lower, upper } = confidenceInterval(xbar, me)
  const lowerR = round(lower, 2)
  const upperR = round(upper, 2)

  // Bar position for display (clamped to 0–100 range representation)
  const rangeSpan = Math.max(me * 4, 10)
  const barLeft = ((xbar - me - (xbar - rangeSpan / 2)) / rangeSpan) * 100
  const barWidth = (me * 2 / rangeSpan) * 100

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample mean (x̄): <span className="text-primary font-bold">{xbar}</span>
          </label>
          <input type="range" min={0} max={100} step={1} value={xbar}
            onChange={(e) => setXbar(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>0</span><span>100</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Population σ: <span className="text-primary font-bold">{sigma}</span>
          </label>
          <input type="range" min={1} max={40} step={1} value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>1</span><span>40</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample size (n): <span className="text-primary font-bold">{n}</span>
          </label>
          <input type="range" min={5} max={200} step={1} value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>5</span><span>200</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Confidence level
          </label>
          <select value={level} onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white text-textDark">
            <option value={0.90}>90%</option>
            <option value={0.95}>95%</option>
            <option value={0.99}>99%</option>
          </select>
        </div>
      </div>

      {/* CI result */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 text-sm">
        <div className="font-semibold text-blue-900 mb-1">
          {(level * 100).toFixed(0)}% Confidence Interval
        </div>
        <div className="text-blue-800">
          <span className="font-bold text-lg">[{lowerR}, {upperR}]</span>
        </div>
        <div className="text-blue-700 text-xs mt-1 space-x-4">
          <span>z* = {zStar}</span>
          <span>SE = {se}</span>
          <span>ME = ±{me}</span>
        </div>
      </div>

      {/* Visual interval */}
      <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden border border-border mb-1">
        <div
          className="absolute h-full bg-blue-200 rounded-full"
          style={{
            left: `${Math.max(0, Math.min(100 - barWidth, barLeft))}%`,
            width: `${Math.min(barWidth, 100)}%`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded"
          style={{ left: `50%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-textMuted">
        <span>{lowerR}</span>
        <span className="text-primary font-medium">x̄ = {xbar}</span>
        <span>{upperR}</span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Increase n → narrower interval (more precision). Raise the confidence level → wider interval (more certainty). Both cannot improve simultaneously without a larger sample.
      </p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Confidence Intervals',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Construct a confidence interval for a population mean and correctly interpret what the confidence level means.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>confidence interval (CI)</strong> is a range of plausible values for an unknown
        population parameter, constructed from sample data. Instead of a single point estimate,
        it gives an interval that is likely to contain the true parameter.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Structure of a confidence interval</p>
        <p className="text-blue-800">CI = point estimate ± margin of error</p>
        <p className="text-blue-800 mt-1">Margin of error = critical value × standard error</p>
      </div>
      <p>
        The <strong>confidence level</strong> (e.g., 95%) describes the procedure, not the
        interval: if we repeated the sampling process many times and built a CI each time,
        95% of those intervals would contain the true parameter. It does <em>not</em> mean
        there is a 95% probability that the true value is in this specific interval.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">Trade-offs</p>
        <ul className="space-y-1 text-amber-800">
          <li><strong>Higher confidence →</strong> wider interval (less informative)</li>
          <li><strong>Larger n →</strong> smaller SE → narrower interval (more precise)</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Casting a fishing net is like constructing a confidence interval. A 95% CI is a net
        you cast 100 times — on 95 of those casts, the net captures the true fish (the
        parameter). A bigger net (higher confidence level) catches it more often but tells
        you less precisely where the fish is. A finer-mesh, smaller net (large n, 95% CI)
        gives a more precise location.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'confidence-intervals',
    title: 'How the Confidence Interval is built',
    steps: [
      {
        label: 'Recognise Standard Error in the margin of error',
        symbolName: 'SE',
        highlightColor: 'orange',
        from: 'CI = x̄ ± t* × SE',
        to: 'CI = x̄ ± t* × (s / √n)',
        note: 'SE = s/√n is the standard error of the mean. Multiplying by t* (the critical value) creates the margin of error — defining how wide the interval is.',
      },
    ],
    finalFormula: 'CI = x̄ ± t* × (s / √n)',
  },
  formula: {
    main: 'CI = x̄ ± z* × (σ/√n)',
    variants: [
      { label: 'CI for μ (σ known)', expression: 'CI = x̄ ± z* × (σ/√n)', latex: 'CI = \\bar{x} \\pm z^{*} \\cdot \\frac{\\sigma}{\\sqrt{n}}' },
      { label: 'CI for μ (σ unknown, use t)', expression: 'CI = x̄ ± t* × (s/√n)', latex: 'CI = \\bar{x} \\pm t^{*} \\cdot \\frac{s}{\\sqrt{n}}' },
      { label: 'Common z* values', expression: '90%: z*=1.645 | 95%: z*=1.96 | 99%: z*=2.576', latex: '' },
      { label: 'Margin of error', expression: 'ME = z* × SE', latex: 'ME = z^{*} \\times SE' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean (point estimate)' },
      { symbol: 'z*', meaning: 'Critical z-value for the chosen confidence level' },
      { symbol: 't*', meaning: 'Critical t-value (used when σ is unknown)' },
      { symbol: 'σ', meaning: 'Population standard deviation' },
      { symbol: 's', meaning: 'Sample standard deviation (estimate of σ)' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: 'ME', meaning: 'Margin of error — half the interval width' },
    ],
  },
  whenToUse: [
    'When reporting an estimate alongside its precision',
    'To express uncertainty around a sample mean, proportion, or other parameter estimate',
    'When the goal is estimation rather than a yes/no hypothesis decision',
  ],
  whenNotToUse: [
    'Do not confuse CIs with prediction intervals (which predict individual future values — wider than CIs)',
    'Do not use a z-based CI when σ is unknown and n is small — use a t-interval instead',
  ],
  assumptions: [
    'Random, independent sampling',
    'Sampling distribution of x̄ is approximately normal (CLT or normal population)',
    'When using z*: σ is known or n is large; when using t*: σ is unknown',
  ],
  workedExample: {
    scenario:
      'A factory measures the fill weight of cereal boxes. A random sample of n = 64 boxes gives x̄ = 500.5 g. The population SD is σ = 4 g. Construct a 95% CI for the true mean fill weight.',
    steps: [
      { stepNumber: 1, label: 'Find SE', expression: 'SE = σ/√n = 4/√64 = 4/8', result: 'SE = 0.5 g', explanation: 'Standard error of the mean.' },
      { stepNumber: 2, label: 'Find z* for 95% CI', expression: 'z* = 1.96', result: 'z* = 1.96', explanation: 'For a 95% CI (two-tailed), z* = 1.96.' },
      { stepNumber: 3, label: 'Calculate ME', expression: 'ME = 1.96 × 0.5', result: 'ME = 0.98 g', explanation: 'The margin of error is ±0.98 g.' },
      { stepNumber: 4, label: 'Build the interval', expression: '500.5 ± 0.98 = [499.52, 501.48]', result: '[499.52 g, 501.48 g]', explanation: '95% CI for μ.' },
    ],
    interpretation:
      'We are 95% confident the true mean fill weight is between 499.52 g and 501.48 g. The interval is narrow (less than 2 g wide) because n = 64 and σ is small relative to the mean.',
  },
  interpretation:
    'A confidence interval answers: "What range of parameter values is consistent with our data?" Narrower intervals signal more precision. Always state the confidence level when reporting a CI.',
  commonMistakes: [
    { mistake: 'Saying "there is a 95% probability the parameter is in this interval"', explanation: 'The parameter is fixed — it is either in the interval or it is not. The 95% refers to the process: 95% of intervals constructed this way contain the true parameter.' },
    { mistake: 'Thinking a wider CI is better', explanation: 'A wider CI captures the parameter more often but is less informative. Precision matters — aim for narrow CIs via larger samples.' },
    { mistake: 'Using z* when σ is unknown and n is small', explanation: 'When σ is estimated by s and n < 30, use t* from the t-distribution for a more accurate CI.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'ci-easy-1', scenario: 'x̄ = 75, σ = 10, n = 100.', question: 'Construct a 95% CI for μ.', hint: 'SE = σ/√n, ME = 1.96 × SE.', solution: 'SE = 1. ME = 1.96. CI = [73.04, 76.96].' },
    ],
    moderate: [
      { id: 'ci-mod-1', scenario: 'x̄ = 200, σ = 25, n = 25.', question: 'Construct 90% and 99% CIs. Compare their widths.', hint: 'z*(90%) = 1.645, z*(99%) = 2.576.', solution: 'SE = 5. 90% CI: 200 ± 8.225 = [191.78, 208.23]. 99% CI: 200 ± 12.88 = [187.12, 212.88]. The 99% CI is wider.' },
    ],
    challenging: [
      { id: 'ci-chal-1', scenario: 'You want a 95% CI with ME ≤ 2. σ = 15.', question: 'What minimum sample size is required?', hint: 'ME = 1.96 × σ/√n ≤ 2. Solve for n.', solution: '1.96 × 15/√n ≤ 2 → √n ≥ 14.7 → n ≥ 216.09 → n = 217.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ci-kc-1', type: 'multiple-choice',
      question: 'What does a 95% confidence interval mean?',
      options: [
        { id: 'a', text: 'There is a 95% probability the true parameter is in this specific interval', isCorrect: false, explanation: 'The parameter is fixed. The 95% refers to the method, not this specific interval.' },
        { id: 'b', text: '95% of the data values fall inside the interval', isCorrect: false, explanation: 'That describes a percentile range, not a confidence interval.' },
        { id: 'c', text: '95% of intervals constructed this way from repeated samples would contain the true parameter', isCorrect: true, explanation: 'Correct! The confidence level describes the long-run success rate of the procedure.' },
        { id: 'd', text: 'The sample mean is within 5% of the true mean', isCorrect: false, explanation: '5% here refers to the error rate of the procedure, not a 5% numerical distance.' },
      ],
      explanation: 'Confidence level is a property of the estimation procedure, not of one specific interval.',
      hint: 'Think about repeating the sampling process many times.',
    },
    {
      id: 'ci-kc-2', type: 'multiple-choice',
      question: 'Which change makes a confidence interval narrower?',
      options: [
        { id: 'a', text: 'Increasing the confidence level from 95% to 99%', isCorrect: false, explanation: 'Higher confidence requires a wider interval to be more sure of capturing the parameter.' },
        { id: 'b', text: 'Decreasing the sample size', isCorrect: false, explanation: 'Smaller n → larger SE → wider interval.' },
        { id: 'c', text: 'Increasing the sample size', isCorrect: true, explanation: 'Correct! Larger n → smaller SE → smaller ME → narrower CI.' },
        { id: 'd', text: 'Increasing the population SD', isCorrect: false, explanation: 'Larger σ → larger SE → wider interval.' },
      ],
      explanation: 'Only larger n consistently narrows a CI without reducing the confidence level.',
      hint: 'What reduces the standard error?',
    },
    {
      id: 'ci-kc-3', type: 'numerical',
      question: 'x̄ = 50, σ = 8, n = 16. What is the 95% CI lower bound? (z* = 1.96)',
      answer: 46.08,
      tolerance: 0.05,
      explanation: 'SE = 8/√16 = 2. ME = 1.96 × 2 = 3.92. Lower bound = 50 − 3.92 = 46.08.',
      hint: 'Lower bound = x̄ − z* × (σ/√n).',
    },
    {
      id: 'ci-kc-4', type: 'multiple-choice',
      question: 'A 95% CI is [42, 58]. Which statement is correct?',
      options: [
        { id: 'a', text: 'The population mean is definitely between 42 and 58', isCorrect: false, explanation: 'We cannot say definitively — 5% of such intervals will not contain the true mean.' },
        { id: 'b', text: 'We are 95% confident the population mean is between 42 and 58', isCorrect: true, explanation: 'Correct! This is proper interpretation — 95% confidence in the method producing an interval that contains μ.' },
        { id: 'c', text: '95% of data values lie between 42 and 58', isCorrect: false, explanation: 'A CI is about where the parameter is, not where data values are.' },
        { id: 'd', text: 'The sample mean is 95% accurate', isCorrect: false, explanation: '"95% accurate" is not a statistical concept.' },
      ],
      explanation: '"95% confident" means: this method produces intervals containing μ 95% of the time.',
      hint: 'The CI is about the population mean, not individual data.',
    },
    {
      id: 'ci-kc-5', type: 'multiple-choice',
      question: 'You build a CI using z* = 1.96 but σ is unknown and n = 15. What is wrong?',
      options: [
        { id: 'a', text: 'You should use z* = 2.576', isCorrect: false, explanation: '2.576 is for α = 0.01, still z — not the fix when σ is unknown with small n.' },
        { id: 'b', text: 'You should use t* with df = 14 instead of z*', isCorrect: true, explanation: 'Correct! With unknown σ and small n, use t* from the t-distribution with df = n−1 = 14.' },
        { id: 'c', text: 'Nothing is wrong — z* = 1.96 is always correct for 95% CIs', isCorrect: false, explanation: '1.96 is only valid when σ is known or n is large (CLT approximation). Small n with unknown σ requires t*.' },
        { id: 'd', text: 'You need more data before building any CI', isCorrect: false, explanation: 'You can build a CI with n = 15 — just use t* instead of z*.' },
      ],
      explanation: 'When σ is unknown and n is small (< 30), use t* not z* for the CI.',
      hint: 'σ is unknown + small n → which distribution?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ci-tf-1', type: 'true-false', question: 'A 95% confidence interval means there is a 95% probability that the population parameter lies within the interval.', isTrue: false, explanation: 'The parameter is fixed — it either is or is not in the interval. The 95% refers to the procedure: 95% of all intervals constructed this way will capture μ.' },
    { id: 'ci-tf-2', type: 'true-false', question: 'A wider confidence interval reflects greater uncertainty about the population parameter.', isTrue: true, explanation: 'A wider CI means the margin of error is large — indicating less precision in our estimate.' },
    { id: 'ci-tf-3', type: 'true-false', question: 'Increasing the confidence level from 95% to 99% produces a narrower interval (everything else equal).', isTrue: false, explanation: 'Higher confidence requires a larger z*, which widens the interval. 99% CI is wider than 95% CI.' },
    { id: 'ci-tf-4', type: 'true-false', question: 'The margin of error is z* × SE.', isTrue: true, explanation: 'Margin of error = z* × σ/√n. The CI is x̄ ± margin of error.' },
    { id: 'ci-tf-5', type: 'true-false', question: 'A confidence interval always contains the sample mean x̄ at its centre.', isTrue: true, explanation: 'For the z- and t-based intervals for a mean, the CI is [x̄ − ME, x̄ + ME], so x̄ is always the midpoint.' },
    { id: 'ci-tf-6', type: 'true-false', question: 'To halve the margin of error, you must quadruple the sample size.', isTrue: true, explanation: 'ME = z* × σ/√n. To halve ME: need √n to double → n must be 4 times larger.' },
    { id: 'ci-tf-7', type: 'true-false', question: 'If the 95% CI for μ is (40, 60), then μ = 50.', isTrue: false, explanation: 'The midpoint of the CI is the best estimate (x̄ = 50), but μ could be any value in the interval — or even outside it.' },
    { id: 'ci-tf-8', type: 'true-false', question: 'When σ is unknown and n is small, we should use t* instead of z*.', isTrue: true, explanation: 'Unknown σ with small n: use the t-distribution with df = n−1 for the critical value.' },
    { id: 'ci-tf-9', type: 'true-false', question: 'A 99% CI is more likely to contain the true parameter than a 95% CI.', isTrue: true, explanation: 'Higher confidence level → more intervals capture μ. 99% of 99% CIs contain μ, vs 95% of 95% CIs.' },
    { id: 'ci-tf-10', type: 'true-false', question: 'The confidence level is chosen after computing the interval to make it look better.', isTrue: false, explanation: 'The confidence level must be chosen before data collection. Choosing it after seeing results is p-hacking.' },
    { id: 'ci-tf-11', type: 'true-false', question: 'A CI for a proportion p uses SE = √(p̂(1−p̂)/n).', isTrue: true, explanation: 'The estimated SE for a proportion is √(p̂q̂/n). The CI is p̂ ± z* × √(p̂q̂/n).' },
    { id: 'ci-tf-12', type: 'true-false', question: '"The confidence level" is the probability that a specific computed interval contains μ.', isTrue: false, explanation: 'Once computed, the interval either contains μ or it does not (probability 0 or 1). The level refers to the long-run success rate of the procedure.' },
    { id: 'ci-tf-13', type: 'true-false', question: 'The z* critical value for a 95% two-sided CI is 1.96.', isTrue: true, explanation: 'P(−1.96 < Z < 1.96) = 0.95. So z* = 1.96 is the standard critical value for 95% two-sided CIs.' },
    { id: 'ci-tf-14', type: 'true-false', question: 'A CI tells us something about the spread of data values in the population.', isTrue: false, explanation: 'A CI is about the uncertainty in a parameter estimate, not about the spread of individual data values (that is described by σ or the IQR).' },
    { id: 'ci-tf-15', type: 'true-false', question: 'If two independent 95% CIs overlap, the difference between the two means must be non-significant at α = 0.05.', isTrue: false, explanation: 'Overlapping 95% CIs can still correspond to a significant difference (the overlap rule is conservative). Non-overlap does imply significance at α = 0.05, but overlap does not imply non-significance.' },
    { id: 'ci-tf-16', type: 'true-false', question: 'A large sample produces a narrower CI than a small sample (all else equal).', isTrue: true, explanation: 'ME = z* × σ/√n. Larger n → smaller SE → smaller ME → narrower CI.' },
    { id: 'ci-tf-17', type: 'true-false', question: 'Confidence intervals can be constructed for population proportions, means, and differences between means.', isTrue: true, explanation: 'CIs exist for any estimable parameter: means, proportions, differences, correlations, regression coefficients, etc.' },
    { id: 'ci-tf-18', type: 'true-false', question: 'If the 95% CI for the mean difference is (0.5, 4.5), we conclude there is no statistically significant difference at α = 0.05.', isTrue: false, explanation: 'The CI does not include 0 — both endpoints are positive — so we reject H₀: μ₁ = μ₂ at α = 0.05.' },
    { id: 'ci-tf-19', type: 'true-false', question: 'The t-distribution has heavier tails than the standard normal, so t* > z* for the same confidence level.', isTrue: true, explanation: 'Heavier tails mean we need to go further out to capture the same area → t* > z* for any finite df.' },
    { id: 'ci-tf-20', type: 'true-false', question: 'As df → ∞, the t-distribution approaches the standard normal distribution.', isTrue: true, explanation: 'With very large df (large n), the extra uncertainty of estimating σ becomes negligible and t → N(0,1).' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ci-mc-6', type: 'multiple-choice', question: 'x̄ = 50, σ = 10, n = 25. What is the 95% CI for μ? (z* = 1.96)', options: [{ id: 'a', text: '(48.04, 51.96)', isCorrect: false, explanation: '(48.04, 51.96) = 50 ± 1.96 uses SE = 1 instead of SE = σ/√n = 10/5 = 2 (the margin of error must be 1.96 × 2 = 3.92).' }, { id: 'b', text: '(46.08, 53.92)', isCorrect: true, explanation: 'SE = 10/√25 = 2. ME = 1.96×2 = 3.92. CI = 50 ± 3.92 = (46.08, 53.92). ✓' }, { id: 'c', text: '(40, 60)', isCorrect: false, explanation: '(40, 60) = x̄ ± σ — a spread of individual data values, not a CI for μ.' }, { id: 'd', text: '(49, 51)', isCorrect: false, explanation: '(49,51) would require ME = 1, but ME = 1.96×2 = 3.92.' }], explanation: 'SE = 10/√25 = 2. ME = 1.96×2 = 3.92. CI = (46.08, 53.92).', hint: 'CI = x̄ ± z* × SE.' },
    { id: 'ci-mc-7', type: 'multiple-choice', question: 'What happens to a CI if you increase the confidence level from 90% to 99%?', options: [{ id: 'a', text: 'It narrows — higher confidence means more precision', isCorrect: false, explanation: 'Higher confidence → larger z* → wider interval, not narrower.' }, { id: 'b', text: 'It widens — higher confidence requires a larger critical value', isCorrect: true, explanation: 'z*(99%) = 2.576 > z*(90%) = 1.645. Larger z* multiplies SE → wider CI.' }, { id: 'c', text: 'Width stays the same', isCorrect: false, explanation: 'Width = 2 × z* × SE. Changing z* changes the width.' }, { id: 'd', text: 'It shifts right', isCorrect: false, explanation: 'The CI shifts only if x̄ changes, not if the confidence level changes.' }], explanation: 'Higher confidence → larger z* → wider interval. You pay for more certainty with less precision.', hint: 'What happens to z* as confidence level increases?' },
    { id: 'ci-mc-8', type: 'multiple-choice', question: 'A researcher reports a 95% CI of (35, 55). A colleague claims "there is a 95% chance μ is between 35 and 55." Is this correct?', options: [{ id: 'a', text: 'Yes — that is the definition of a 95% CI', isCorrect: false, explanation: 'This is a common misconception. μ is fixed — the probability interpretation applies to the procedure, not the specific interval.' }, { id: 'b', text: 'No — the correct interpretation is about the long-run procedure, not this specific interval', isCorrect: true, explanation: 'A specific CI either contains μ or it does not. "95%" means 95% of all such intervals (over many samples) would contain μ.' }, { id: 'c', text: 'Only if the population is normal', isCorrect: false, explanation: 'The misconception is about interpretation, not the normality assumption.' }, { id: 'd', text: 'Yes, but only for large samples', isCorrect: false, explanation: 'The frequentist interpretation of CI is always about the procedure — never about probability of a specific interval.' }], explanation: 'The frequentist CI: 95% of all 95% CIs constructed this way will contain μ. This specific interval is either right or wrong.', hint: 'Is μ a random variable or a fixed value?' },
    { id: 'ci-mc-9', type: 'multiple-choice', question: 'n = 16, x̄ = 80, s = 8. 95% t-CI uses t*(df=15) ≈ 2.131. What is the CI?', options: [{ id: 'a', text: '(75.74, 84.26)', isCorrect: true, explanation: 'SE = 8/4 = 2. ME = 2.131×2 = 4.262. CI = (80−4.26, 80+4.26) = (75.74, 84.26).' }, { id: 'b', text: '(76.08, 83.92)', isCorrect: false, explanation: '(76.08, 83.92) = 80 ± 1.96×2 uses z* = 1.96. With unknown σ and n = 16, use t* = 2.131, which gives a wider interval.' }, { id: 'c', text: '(64, 96)', isCorrect: false, explanation: '(64,96) = x̄ ± 2s — that is not a CI for μ.' }, { id: 'd', text: '(72, 88)', isCorrect: false, explanation: '(72,88) = x̄ ± s — not a CI formula.' }], explanation: 'SE = 8/√16 = 2. ME = 2.131 × 2 ≈ 4.26. CI = (75.74, 84.26).', hint: 'With unknown σ and small n, use t* with df = n−1.' },
    { id: 'ci-mc-10', type: 'multiple-choice', question: 'Why does a 99% CI give less precision than a 95% CI?', options: [{ id: 'a', text: 'Because 99% CIs use smaller samples', isCorrect: false, explanation: 'Sample size is not determined by confidence level — they are independent choices.' }, { id: 'b', text: 'Because to be more confident, you cast a wider net, sacrificing precision', isCorrect: true, explanation: 'Higher confidence → wider interval → less precision. There is an inherent trade-off between confidence and precision.' }, { id: 'c', text: 'Because 99% CIs use a larger SE', isCorrect: false, explanation: 'SE is the same — only the critical value z* increases.' }, { id: 'd', text: 'Because lower confidence levels are always better', isCorrect: false, explanation: 'No level is inherently "better" — it depends on the context and acceptable error.' }], explanation: 'Higher confidence → larger z* → wider CI. To be 99% sure, you must allow a wider range of plausible values.', hint: 'Think of confidence vs. precision as a trade-off.' },
    { id: 'ci-mc-11', type: 'multiple-choice', question: 'A 95% CI for a proportion gives (0.42, 0.58). What is p̂?', options: [{ id: 'a', text: '0.42', isCorrect: false, explanation: '0.42 is the lower bound.' }, { id: 'b', text: '0.50', isCorrect: true, explanation: 'p̂ = midpoint = (0.42 + 0.58)/2 = 0.50.' }, { id: 'c', text: '0.58', isCorrect: false, explanation: '0.58 is the upper bound.' }, { id: 'd', text: '0.16', isCorrect: false, explanation: '0.16 = 0.58−0.42 is the width, not the midpoint.' }], explanation: 'The CI is centred on p̂. p̂ = (0.42 + 0.58)/2 = 0.50.', hint: 'p̂ is the midpoint of the CI.' },
    { id: 'ci-mc-12', type: 'multiple-choice', question: 'Current n gives ME = 4. To achieve ME ≤ 2, what must n become?', options: [{ id: 'a', text: '2n', isCorrect: false, explanation: 'Doubling n reduces ME by 1/√2, not by half.' }, { id: 'b', text: '4n', isCorrect: true, explanation: 'ME ∝ 1/√n. To halve ME, quadruple n: (1/√(4n)) = (1/2) × (1/√n).' }, { id: 'c', text: 'n/2', isCorrect: false, explanation: 'Halving n would increase ME.' }, { id: 'd', text: '3n', isCorrect: false, explanation: 'Tripling n reduces ME by 1/√3 ≈ 0.577 — not quite halving it.' }], explanation: 'ME halves when n quadruples. To go from ME=4 to ME=2 (halving), use n → 4n.', hint: 'ME ∝ 1/√n. To halve ME, what must √n do?' },
    { id: 'ci-mc-13', type: 'multiple-choice', question: 'The 95% CI for the mean exam score is (72, 88). Can we conclude the population mean is exactly 80?', options: [{ id: 'a', text: 'Yes — 80 is the midpoint so it must be μ', isCorrect: false, explanation: '80 is our best estimate (x̄ = 80) but μ could be any value in (72, 88).' }, { id: 'b', text: 'No — the CI shows μ is plausibly anywhere from 72 to 88', isCorrect: true, explanation: 'Any value in the interval is a plausible value for μ at this confidence level. We cannot pin down μ to a single value.' }, { id: 'c', text: 'Yes — with 95% confidence μ = 80', isCorrect: false, explanation: '95% confidence does not mean μ = 80; it describes the long-run success rate of the procedure that produced (72, 88).' }, { id: 'd', text: 'Only if the data are normally distributed', isCorrect: false, explanation: 'The question is about the interpretation of a CI, not the normality assumption.' }], explanation: 'The CI provides a range of plausible values for μ — any value from 72 to 88 is consistent with the data.', hint: 'Does a CI point estimate or provide a range?' },
    { id: 'ci-mc-14', type: 'multiple-choice', question: 'A 95% CI for the difference in means is (−2, 10). What do you conclude?', options: [{ id: 'a', text: 'The difference is significant at α = 0.05 since the CI does not include 0', isCorrect: false, explanation: 'The CI (−2, 10) DOES include 0 — so we cannot conclude a significant difference.' }, { id: 'b', text: 'We cannot conclude a significant difference — 0 is within the CI', isCorrect: true, explanation: 'If 0 is in the CI, the data are consistent with no difference. We fail to reject H₀.' }, { id: 'c', text: 'The difference is 4 (midpoint)', isCorrect: false, explanation: 'The midpoint (x̄₁−x̄₂) = 4 is the point estimate, but the CI shows this is not statistically distinguishable from 0.' }, { id: 'd', text: 'The CI is invalid because it contains negative values', isCorrect: false, explanation: 'A difference can be negative — a CI containing negative values is perfectly valid.' }], explanation: 'The CI includes 0 → zero difference is plausible → fail to reject H₀: μ₁ = μ₂ at α = 0.05.', hint: 'For a difference CI, does it include 0?' },
    { id: 'ci-mc-15', type: 'multiple-choice', question: 'Which of the following will produce the NARROWEST confidence interval?', options: [{ id: 'a', text: '95% CI with n = 25 and σ = 10', isCorrect: false, explanation: 'ME = 1.96×10/5 = 3.92. Compare with other options.' }, { id: 'b', text: '90% CI with n = 100 and σ = 10', isCorrect: true, explanation: 'ME = 1.645×10/10 = 1.645. This is the smallest margin of error among the options.' }, { id: 'c', text: '99% CI with n = 25 and σ = 10', isCorrect: false, explanation: 'ME = 2.576×10/5 = 5.15. Widest option.' }, { id: 'd', text: '95% CI with n = 25 and σ = 20', isCorrect: false, explanation: 'ME = 1.96×20/5 = 7.84. Very wide due to large σ.' }], explanation: 'Smallest ME is option B: 1.645×1 = 1.645. Lower confidence + larger n + same σ.', hint: 'Compute ME = z* × σ/√n for each option.' },
  ],
  keyTakeaway:
    'A confidence interval = point estimate ± margin of error (= z* × SE). The confidence level (e.g., 95%) describes the procedure: 95% of such intervals capture the true parameter. Narrower intervals come from larger samples or lower confidence levels.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Fishing Net" picture:</strong></p>
      <p className="text-sm">A 95% CI is a net you cast 100 times — on 95 of those casts the net traps the true fish (μ). The net is not wider because you cast it more often — only because you make it bigger (higher confidence level) or have less data (smaller n).</p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs font-mono space-y-1">
        <div>CI = x̄ ± z* × (σ/√n)</div>
        <div>Narrower CI: ↑n &nbsp;(more precise) OR ↓confidence (less sure)</div>
        <div>Common confusion: "95% chance μ is in THIS interval" ✗</div>
        <div>Correct: "The METHOD produces intervals containing μ 95% of the time" ✓</div>
      </div>
    </div>
  ),
  visualization: <CIViz />,
  datasetGenerator: false,
}

export default function ConfidenceIntervals({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
