import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, standardError, zCritical } from '../../../utils/stats'

// ── Interactive calculator ────────────────────────────────────────────────────

function StandardErrorViz() {
  const [sigma, setSigma] = useState(15)
  const [n, setN] = useState(25)

  const se = round(standardError(sigma, n), 4)
  const ci95 = round(zCritical(0.05) * se, 3)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Population SD (σ): <span className="text-primary font-bold">{sigma}</span>
          </label>
          <input type="range" min={1} max={50} step={1} value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>1</span><span>50</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample size (n): <span className="text-primary font-bold">{n}</span>
          </label>
          <input type="range" min={1} max={200} step={1} value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>1</span><span>200</span></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-xs text-blue-600 font-medium mb-1">Standard Error</div>
          <div className="text-2xl font-bold text-blue-900">{se}</div>
          <div className="text-xs text-blue-700 mt-0.5">σ/√n = {sigma}/√{n}</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
          <div className="text-xs text-emerald-600 font-medium mb-1">±1.96 × SE (95%)</div>
          <div className="text-2xl font-bold text-emerald-900">±{ci95}</div>
          <div className="text-xs text-emerald-700 mt-0.5">margin of error (95%)</div>
        </div>
      </div>

      {/* Visual bar showing SE relative to σ */}
      <div className="mb-2">
        <p className="text-xs text-textMuted mb-1">SE as a fraction of σ: SE/σ = 1/√n = {round(1/Math.sqrt(n), 3)}</p>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${Math.min((se / sigma) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-textMuted mt-0.5">
          <span>0</span><span>σ ({sigma})</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Drag n right — the SE shrinks and the margin of error narrows. To halve the SE you must quadruple n.
      </p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Standard Error',
  topicGroup: 'Sampling',
  learningObjective:
    'Calculate the standard error of the mean and explain what it measures about the precision of a sample estimate.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>standard error (SE)</strong> is the standard deviation of the sampling
        distribution of a statistic. For the sample mean, it tells you the typical distance
        between a sample mean (x̄) and the true population mean (μ).
      </p>
      <p>
        A small SE means sample means cluster tightly around μ — your estimate is likely to
        be close to the truth. A large SE means sample means are spread out — you have
        more uncertainty.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">Standard deviation vs. standard error</p>
        <ul className="space-y-1 text-amber-800">
          <li><strong>Standard deviation (s or σ):</strong> Describes the spread of individual data values.</li>
          <li><strong>Standard error (SE = σ/√n):</strong> Describes the precision of the sample mean as an estimate of μ.</li>
        </ul>
        <p className="mt-1 text-amber-800">As n increases, SE decreases — larger samples give more precise estimates. SD does not shrink with n.</p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Think of aiming at a bullseye. Standard deviation is how spread out your arrows are
        across the whole target (the natural variability in your shooting). Standard error is
        how close the <em>centre of your cluster</em> is to the bullseye — it measures how
        precisely your average shot represents your true aim.
      </p>
      <p className="text-sm text-gray-600">
        Shooting more arrows (larger n) tightens the cluster's centre around the bullseye
        (reduces SE) even if each individual arrow still scatters by the same amount (SD unchanged).
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'standard-error',
    title: 'How Standard Error is built',
    steps: [
      {
        label: 'Substitute Standard Deviation',
        symbolName: 's',
        highlightColor: 'blue',
        from: 'SE = s / √n',
        to: 'SE = √[ Σ(x−x̄)²/(n−1) ] / √n',
        note: 's is the sample standard deviation — measuring individual-level spread. Dividing by √n shrinks it to reflect how precise the sample mean is.',
      },
    ],
    finalFormula: 'SE = s / √n',
  },
  formula: {
    main: 'SE = σ / √n',
    variants: [
      { label: 'Population SD known', expression: 'SE = σ / √n', latex: 'SE = \\frac{\\sigma}{\\sqrt{n}}' },
      { label: 'Population SD unknown (estimated)', expression: 'SE = s / √n', latex: 'SE = \\frac{s}{\\sqrt{n}}' },
      { label: 'Required n for target SE', expression: 'n = (σ / SE_target)²', latex: 'n = \\left(\\frac{\\sigma}{SE_{\\text{target}}}\\right)^{2}' },
    ],
    symbolGuide: [
      { symbol: 'SE', meaning: 'Standard error of the mean' },
      { symbol: 'σ', meaning: 'Population standard deviation (use s when σ is unknown)' },
      { symbol: 's', meaning: 'Sample standard deviation — estimate of σ' },
      { symbol: 'n', meaning: 'Sample size' },
    ],
  },
  whenToUse: [
    'Whenever you report a sample mean and want to convey its precision',
    'To construct a confidence interval for the population mean',
    'When planning a study — calculate the n needed to achieve a target SE',
    'As part of any hypothesis test that involves the sample mean',
  ],
  whenNotToUse: [
    'Do not use SE to describe the spread of raw data — use SD for that',
    'SE assumes random, independent sampling; avoid applying it to non-random samples',
  ],
  assumptions: [
    'Observations are sampled independently and randomly',
    'Population variance is finite',
    'The formula SE = σ/√n applies; when σ is unknown, replace it with s',
  ],
  workedExample: {
    scenario:
      'A nutritionist measures sodium intake (mg/day) in a random sample of n = 64 adults. The sample mean is x̄ = 2,300 mg and the sample SD is s = 400 mg.',
    steps: [
      { stepNumber: 1, label: 'Identify the values', expression: 's = 400, n = 64', result: 'Given', explanation: 'σ is unknown; we use the sample SD s = 400 as an estimate.' },
      { stepNumber: 2, label: 'Calculate SE', expression: 'SE = s/√n = 400/√64 = 400/8', result: 'SE = 50 mg/day', explanation: 'Sample means would typically be within 50 mg/day of the true population mean.' },
      { stepNumber: 3, label: '95% margin of error', expression: 'ME = 1.96 × 50 = 98', result: 'ME ≈ 98 mg/day', explanation: 'We are 95% confident the true mean is within ±98 mg/day of our sample mean of 2,300.' },
    ],
    interpretation:
      'The 95% confidence interval is [2,202, 2,398] mg/day. With n = 64, our sample mean is a reasonably precise estimate of the population mean (SE = 50 out of a mean of 2,300). (z* = 1.96 is used here as a large-sample approximation; with σ estimated by s, t* with df = 63 ≈ 2.00 would give a slightly wider interval, about ±100.)',
  },
  interpretation:
    'Standard error quantifies uncertainty in a sample estimate. Report it alongside sample means to communicate precision. A smaller SE (from a larger sample or a less variable population) means your estimate is more trustworthy.',
  commonMistakes: [
    { mistake: 'Reporting SE instead of SD to make data appear less variable', explanation: 'SE is smaller than SD, which can mislead readers about data spread. Always state clearly whether you report SD or SE.' },
    { mistake: 'Thinking SE = SD / n instead of SD / √n', explanation: 'The correct formula divides by the square root of n. Dividing by n itself would give a much smaller — and wrong — value.' },
    { mistake: 'Assuming SE tells you about individual observations', explanation: 'SE is about the precision of the sample mean, not about individual data points.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'se-easy-1', scenario: 'σ = 24, n = 16.', question: 'What is the standard error of the mean?', hint: 'SE = σ/√n.', solution: 'SE = 24/√16 = 24/4 = 6.' },
    ],
    moderate: [
      { id: 'se-mod-1', scenario: 'A sample of n = 100 gives s = 50.', question: 'Calculate SE and the 99% margin of error (use z* = 2.576).', hint: 'SE = s/√n, then ME = z* × SE.', solution: 'SE = 50/√100 = 5. ME = 2.576 × 5 = 12.88.' },
    ],
    challenging: [
      { id: 'se-chal-1', scenario: 'A researcher wants SE ≤ 2. The population SD is σ = 18.', question: 'What is the minimum sample size required?', hint: 'n = (σ/SE)². Round up.', solution: 'n = (18/2)² = 81. At least 81 observations are needed.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'se-kc-1', type: 'multiple-choice',
      question: 'What happens to the standard error when you quadruple the sample size?',
      options: [
        { id: 'a', text: 'It doubles', isCorrect: false, explanation: 'Doubling n reduces SE by √2, not doubling it.' },
        { id: 'b', text: 'It is cut in half', isCorrect: true, explanation: 'Correct! SE = σ/√n. Quadrupling n multiplies √n by 2, so SE is halved.' },
        { id: 'c', text: 'It is unchanged', isCorrect: false, explanation: 'SE changes with n — larger n gives smaller SE.' },
        { id: 'd', text: 'It is divided by 4', isCorrect: false, explanation: 'SE is divided by √4 = 2, not by 4 itself.' },
      ],
      explanation: 'SE ∝ 1/√n. Quadrupling n → √(4n) = 2√n → SE halves.',
      hint: 'How does √n change when n is multiplied by 4?',
    },
    {
      id: 'se-kc-2', type: 'numerical',
      question: 'σ = 30, n = 100. What is SE?',
      answer: 3,
      tolerance: 0.05,
      explanation: 'SE = 30/√100 = 30/10 = 3.',
      hint: 'Divide σ by the square root of n.',
    },
    {
      id: 'se-kc-3', type: 'multiple-choice',
      question: 'A sample of n = 50 gives s = 20. What is the standard error?',
      options: [
        { id: 'a', text: '0.4', isCorrect: false, explanation: '0.4 = s/n = 20/50. Divide by √n, not n.' },
        { id: 'b', text: '2.83', isCorrect: true, explanation: 'Correct! SE = 20/√50 = 20/7.07 ≈ 2.83.' },
        { id: 'c', text: '20', isCorrect: false, explanation: '20 is the sample SD, not the SE.' },
        { id: 'd', text: '400', isCorrect: false, explanation: '400 is s² — the variance, not the SE.' },
      ],
      explanation: 'SE = s/√n = 20/√50 ≈ 2.83.',
      hint: 'SE = s ÷ √n (not s ÷ n).',
    },
    {
      id: 'se-kc-4', type: 'multiple-choice',
      question: 'A researcher reports x̄ = 50, SE = 2. What does the SE tell you?',
      options: [
        { id: 'a', text: 'Individual scores are typically 2 points from the mean', isCorrect: false, explanation: 'That is what the SD tells you — SE is about the mean, not individuals.' },
        { id: 'b', text: 'The sample mean is typically within 2 points of the true population mean', isCorrect: true, explanation: 'Correct! SE is the typical distance between x̄ and μ across repeated samples.' },
        { id: 'c', text: 'The margin of error is exactly 2', isCorrect: false, explanation: 'ME = z* × SE. SE is not the same as ME.' },
        { id: 'd', text: '95% of the data is between 48 and 52', isCorrect: false, explanation: 'That would be x̄ ± 2×SD, not ± SE.' },
      ],
      explanation: 'SE = typical distance between the sample mean and the population mean. Smaller SE = more precise estimate.',
      hint: 'SE is about the precision of x̄ as an estimate of μ.',
    },
    {
      id: 'se-kc-5', type: 'numerical',
      question: 'You want SE ≤ 3. σ = 24. What minimum n is required?',
      answer: 64,
      tolerance: 0,
      explanation: 'n = (σ/SE)² = (24/3)² = 8² = 64.',
      hint: 'Rearrange SE = σ/√n → n = (σ/SE)².',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'se-tf-1', type: 'true-false', question: 'Standard error measures how much a sample mean is expected to vary from the population mean.', isTrue: true, explanation: 'SE = σ/√n quantifies the typical deviation of x̄ from μ across repeated samples.' },
    { id: 'se-tf-2', type: 'true-false', question: 'Standard error and standard deviation measure the same thing.', isTrue: false, explanation: 'SD measures spread of individual values around the mean. SE = σ/√n measures spread of sample means — a much smaller quantity.' },
    { id: 'se-tf-3', type: 'true-false', question: 'SE = σ/√n, so doubling n halves the SE.', isTrue: false, explanation: 'Doubling n multiplies SE by 1/√2 ≈ 0.707, reducing it by ~29%. To halve SE, you must quadruple n.' },
    { id: 'se-tf-4', type: 'true-false', question: 'Quadrupling the sample size halves the standard error.', isTrue: true, explanation: 'SE = σ/√n. √(4n) = 2√n, so SE(4n) = σ/(2√n) = SE(n)/2. Quadrupling n halves SE.' },
    { id: 'se-tf-5', type: 'true-false', question: 'A small standard error indicates that sample means cluster tightly around the true population mean.', isTrue: true, explanation: 'Small SE → small spread of x̄ → sample means are precise estimates of μ.' },
    { id: 'se-tf-6', type: 'true-false', question: 'Standard error increases as population variability (σ) increases.', isTrue: true, explanation: 'SE = σ/√n. More population variability (larger σ) leads to more variable sample means (larger SE).' },
    { id: 'se-tf-7', type: 'true-false', question: 'The standard error can be calculated even when σ is unknown, using the sample standard deviation s.', isTrue: true, explanation: 'When σ is unknown, SE is estimated as s/√n. This estimated SE is used in t-tests and t-based confidence intervals.' },
    { id: 'se-tf-8', type: 'true-false', question: 'A larger standard error means sample estimates are more precise.', isTrue: false, explanation: 'A larger SE means MORE variability in sample estimates — less precision, not more.' },
    { id: 'se-tf-9', type: 'true-false', question: 'SE = 0 when the sample mean equals the population mean.', isTrue: false, explanation: 'SE measures variability of x̄ across many samples — it is not about the difference between x̄ and μ for a single sample.' },
    { id: 'se-tf-10', type: 'true-false', question: 'Standard error is always smaller than or equal to the population standard deviation.', isTrue: true, explanation: 'SE = σ/√n ≤ σ for n ≥ 1. Equality holds only when n = 1 (a single observation).' },
    { id: 'se-tf-11', type: 'true-false', question: 'The standard error formula SE = σ/√n assumes sampling with replacement or from a very large population.', isTrue: true, explanation: 'For finite populations, a finite population correction (FPC) applies. SE = σ/√n is exact only for infinite populations or sampling with replacement.' },
    { id: 'se-tf-12', type: 'true-false', question: 'Reducing SE from 5 to 2.5 requires increasing the sample size by a factor of 4.', isTrue: true, explanation: 'Halving SE requires quadrupling n. SE₁/SE₂ = 5/2.5 = 2 → n₂ = n₁ × 2² = 4n₁.' },
    { id: 'se-tf-13', type: 'true-false', question: 'Standard error is used to construct confidence intervals for the population mean.', isTrue: true, explanation: 'CI = x̄ ± z × SE (or x̄ ± t × SE). SE determines the margin of error.' },
    { id: 'se-tf-14', type: 'true-false', question: 'The standard error of a proportion p̂ is √(p(1−p)/n).', isTrue: true, explanation: 'The SE of the sample proportion is √(p(1−p)/n), analogous to SE = σ/√n for means.' },
    { id: 'se-tf-15', type: 'true-false', question: 'A sample with n = 400 has twice the precision of a sample with n = 100 (using the same population).', isTrue: true, explanation: 'SE(400) = σ/20 and SE(100) = σ/10. SE(400) = SE(100)/2 — precision (1/SE) doubles.' },
    { id: 'se-tf-16', type: 'true-false', question: 'Standard error is relevant only for normally distributed populations.', isTrue: false, explanation: 'SE = σ/√n is valid for any population. For non-normal populations, the CLT ensures x̄ is approximately normal for large n.' },
    { id: 'se-tf-17', type: 'true-false', question: 'If two populations have the same σ, the one sampled with larger n will have a smaller SE.', isTrue: true, explanation: 'SE = σ/√n. Larger n → smaller SE, regardless of which population is sampled.' },
    { id: 'se-tf-18', type: 'true-false', question: 'Standard error is reported in the same units as the original data.', isTrue: true, explanation: 'SE = σ/√n. Since σ is in the same units as the data, SE inherits those units.' },
    { id: 'se-tf-19', type: 'true-false', question: 'A z-test uses SE in its formula: z = (x̄ − μ) / SE.', isTrue: true, explanation: 'The z-test statistic is z = (x̄ − μ₀) / (σ/√n) = (x̄ − μ₀) / SE.' },
    { id: 'se-tf-20', type: 'true-false', question: 'Standard error only applies to the sample mean, not to other statistics like the median or proportion.', isTrue: false, explanation: 'Every statistic has a standard error. SE of the median, proportion, regression coefficient, etc. — all can be computed or estimated.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'se-mc-6', type: 'multiple-choice', question: 'σ = 30, n = 9. What is the standard error?', options: [{ id: 'a', text: '30', isCorrect: false, explanation: '30 is σ — not the SE.' }, { id: 'b', text: '10', isCorrect: true, explanation: 'SE = σ/√n = 30/√9 = 30/3 = 10.' }, { id: 'c', text: '3.33', isCorrect: false, explanation: '3.33 = σ/n = 30/9 — divided by n instead of √n.' }, { id: 'd', text: '90', isCorrect: false, explanation: '90 = σ × √n — incorrect direction.' }], explanation: 'SE = σ/√n = 30/3 = 10.', hint: '√9 = 3. Then 30/3.' },
    { id: 'se-mc-7', type: 'multiple-choice', question: 'The standard error tells you:', options: [{ id: 'a', text: 'How spread out the individuals in the population are', isCorrect: false, explanation: 'That is the standard deviation σ, not SE.' }, { id: 'b', text: 'How much a sample mean is expected to vary from sample to sample', isCorrect: true, explanation: 'SE quantifies the typical variation in x̄ across many random samples of size n.' }, { id: 'c', text: 'The exact difference between x̄ and μ', isCorrect: false, explanation: 'SE is a measure of expected variability — not the actual difference for a specific sample.' }, { id: 'd', text: 'Whether the sample is biased', isCorrect: false, explanation: 'Bias is about systematic error, not SE.' }], explanation: 'SE measures sampling variability — how x̄ bounces around μ across repeated samples.', hint: 'What does "error" in standard error refer to?' },
    { id: 'se-mc-8', type: 'multiple-choice', question: 'Current SE = 6 with n = 25. What n is required to achieve SE = 3?', options: [{ id: 'a', text: '50', isCorrect: false, explanation: 'Doubling n reduces SE by √2 ≈ 1.41, not by half.' }, { id: 'b', text: '100', isCorrect: true, explanation: 'To halve SE, quadruple n. n = 25 × 4 = 100.' }, { id: 'c', text: '12.5', isCorrect: false, explanation: 'You cannot reduce n to achieve smaller SE.' }, { id: 'd', text: '75', isCorrect: false, explanation: 'n = 75 would not exactly halve SE. Need 4 × 25 = 100.' }], explanation: 'SE ∝ 1/√n. To halve SE, multiply n by 4: 25 × 4 = 100.', hint: 'To halve SE, you need to quadruple n.' },
    { id: 'se-mc-9', type: 'multiple-choice', question: 'What is the SE of a proportion when p = 0.4 and n = 100?', options: [{ id: 'a', text: '0.0024', isCorrect: false, explanation: '0.0024 = p(1−p)/n = 0.24/100 — forgot the square root.' }, { id: 'b', text: '0.049', isCorrect: true, explanation: 'SE = √(p(1−p)/n) = √(0.4×0.6/100) = √(0.0024) ≈ 0.049.' }, { id: 'c', text: '0.24', isCorrect: false, explanation: '0.24 = p(1−p) — missing the √ and /n.' }, { id: 'd', text: '0.4', isCorrect: false, explanation: '0.4 is p itself, not SE.' }], explanation: 'SE(p̂) = √(p(1−p)/n) = √(0.24/100) = √0.0024 ≈ 0.049.', hint: 'SE of proportion = √(p × q / n), where q = 1−p.' },
    { id: 'se-mc-10', type: 'multiple-choice', question: 'Researcher A uses n = 16, researcher B uses n = 64 (same population, same σ). How do their SEs compare?', options: [{ id: 'a', text: 'A\'s SE is twice B\'s SE', isCorrect: true, explanation: 'SE_A/SE_B = √64/√16 = 8/4 = 2. A\'s SE is double B\'s.' }, { id: 'b', text: 'B\'s SE is twice A\'s SE', isCorrect: false, explanation: 'The larger sample has the smaller SE — B\'s SE is half A\'s, not double.' }, { id: 'c', text: 'They have the same SE', isCorrect: false, explanation: 'Different n values → different SEs.' }, { id: 'd', text: 'A\'s SE is four times B\'s SE', isCorrect: false, explanation: 'The ratio is 2, not 4. 4× ratio requires 16× difference in n.' }], explanation: 'SE ∝ 1/√n. √64/√16 = 2, so SE_A = 2 × SE_B.', hint: 'Compute √64 and √16, then take the ratio.' },
    { id: 'se-mc-11', type: 'multiple-choice', question: 'Why does standard error decrease with larger samples?', options: [{ id: 'a', text: 'Because larger samples are always more representative', isCorrect: false, explanation: 'Representativeness depends on method, not just size. SE decreases for a mathematical reason.' }, { id: 'b', text: 'Because averaging more values cancels out random deviations above and below μ', isCorrect: true, explanation: 'With more observations, extreme values are offset by moderate ones — the mean fluctuates less. SE = σ/√n reflects this averaging effect.' }, { id: 'c', text: 'Because population variance decreases with larger samples', isCorrect: false, explanation: 'σ² is a fixed population parameter — it does not change with sample size.' }, { id: 'd', text: 'Because the normal distribution becomes more accurate', isCorrect: false, explanation: 'The CLT becoming more accurate is a consequence of large n, not the reason SE decreases.' }], explanation: 'More values averaged → random deviations cancel out more → x̄ is more stable. SE = σ/√n captures this mathematically.', hint: 'Think about what happens to a mean when you add more observations.' },
    { id: 'se-mc-12', type: 'multiple-choice', question: 'SE = 4. A 95% confidence interval for μ uses z* = 1.96. The margin of error is approximately:', options: [{ id: 'a', text: '4', isCorrect: false, explanation: '4 is SE — margin of error = z* × SE.' }, { id: 'b', text: '7.84', isCorrect: true, explanation: 'Margin of error = z* × SE = 1.96 × 4 = 7.84.' }, { id: 'c', text: '1.96', isCorrect: false, explanation: '1.96 is z* — you still need to multiply by SE.' }, { id: 'd', text: '2.04', isCorrect: false, explanation: '2.04 ≈ SE/z* — inverted formula.' }], explanation: 'Margin of error = z* × SE = 1.96 × 4 = 7.84.', hint: 'Multiply the critical value z* by the standard error.' },
    { id: 'se-mc-13', type: 'multiple-choice', question: 'Which statement about the relationship between SE and confidence intervals is correct?', options: [{ id: 'a', text: 'A larger SE leads to a narrower confidence interval', isCorrect: false, explanation: 'Larger SE → wider interval. The CI is x̄ ± z×SE.' }, { id: 'b', text: 'A smaller SE leads to a narrower confidence interval', isCorrect: true, explanation: 'CI width = 2 × z × SE. Smaller SE → smaller margin of error → narrower, more precise interval.' }, { id: 'c', text: 'SE has no effect on CI width', isCorrect: false, explanation: 'SE directly determines the margin of error in a CI.' }, { id: 'd', text: 'SE only affects CI width when n > 100', isCorrect: false, explanation: 'SE affects CI width for any n.' }], explanation: 'CI width = 2 × z × SE. Smaller SE → narrower CI → more precise estimation.', hint: 'The margin of error is z × SE. What happens to the interval when SE is smaller?' },
    { id: 'se-mc-14', type: 'multiple-choice', question: 'σ is unknown. Which formula estimates SE correctly?', options: [{ id: 'a', text: 'σ/√n', isCorrect: false, explanation: 'σ/√n uses the population SD. If σ is unknown, use s (sample SD) instead.' }, { id: 'b', text: 's/√n', isCorrect: true, explanation: 'When σ is unknown, estimate SE as s/√n. This leads to the t-distribution rather than the z-distribution.' }, { id: 'c', text: 'n/σ', isCorrect: false, explanation: 'n/σ is the inverted formula — incorrect.' }, { id: 'd', text: 's/n', isCorrect: false, explanation: 's/n divides by n instead of √n — incorrect.' }], explanation: 'With unknown σ, use SE ≈ s/√n. This estimated SE leads to t-tests and t-based CIs.', hint: 'Replace σ with its sample estimate s.' },
    { id: 'se-mc-15', type: 'multiple-choice', question: 'The t-distribution is used instead of the normal distribution when:', options: [{ id: 'a', text: 'The sample size is very large', isCorrect: false, explanation: 'Sample size alone does not decide it: the t-distribution approaches the normal as n grows, but the choice is driven by whether σ is known or estimated by s.' }, { id: 'b', text: 'σ is unknown and is estimated by s', isCorrect: true, explanation: 'Using s instead of σ introduces extra uncertainty — the t-distribution accounts for this with heavier tails.' }, { id: 'c', text: 'The population is skewed', isCorrect: false, explanation: 'Population skewness affects CLT requirements but is not the main reason for using t over z.' }, { id: 'd', text: 'The mean is negative', isCorrect: false, explanation: 'A negative mean has no bearing on which distribution to use.' }], explanation: 'Unknown σ → use s/√n → extra uncertainty → t-distribution accounts for this with heavier tails than normal.', hint: 'What changes when you estimate SE using s instead of σ?' },
  ],
  keyTakeaway:
    'Standard error (SE = σ/√n) measures the precision of a sample mean. It shrinks as n grows — quadrupling the sample size halves the SE. Always distinguish SE (about the mean) from SD (about individual observations).',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>SD vs SE — the "Archer" analogy:</strong></p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white border border-violet-200 rounded-lg p-2">
          <p className="font-semibold text-textDark">SD (Standard Deviation)</p>
          <p className="text-textMuted">Spread of individual <em>arrows</em> on the target — how consistent is each shot?</p>
        </div>
        <div className="bg-white border border-violet-200 rounded-lg p-2">
          <p className="font-semibold text-textDark">SE (Standard Error)</p>
          <p className="text-textMuted">How close the <em>centre of the cluster</em> is to the bullseye — how accurate is the average?</p>
        </div>
      </div>
      <div className="bg-white border border-violet-200 rounded-lg p-2 text-xs font-mono">
        <p>SE = SD / √n &nbsp;→&nbsp; more arrows (larger n) = tighter cluster centre</p>
        <p className="mt-1 text-textMuted">To halve SE: multiply n by 4 (not by 2).</p>
      </div>
    </div>
  ),
  visualization: <StandardErrorViz />,
  datasetGenerator: false,
}

export default function StandardError({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
