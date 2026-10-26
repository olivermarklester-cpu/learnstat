import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, mean, stdDevSample } from '../../../utils/stats'

// ── Simulation ────────────────────────────────────────────────────────────────

function SamplingDistributionViz() {
  const [sampleSize, setSampleSize] = useState(10)
  const [numSamples, setNumSamples] = useState(100)
  const [sampleMeans, setSampleMeans] = useState([])
  const [drawn, setDrawn] = useState(false)

  // Population: Uniform(0, 100), so μ = 50 and σ = 100/√12 ≈ 28.87
  function drawSamples(n, k) {
    const means = []
    for (let i = 0; i < k; i++) {
      let s = 0
      for (let j = 0; j < n; j++) {
        s += Math.random() * 100
      }
      means.push(s / n)
    }
    return means
  }

  function handleDraw() {
    const means = drawSamples(sampleSize, numSamples)
    setSampleMeans(means)
    setDrawn(true)
  }

  const stats = useMemo(() => {
    if (!sampleMeans.length) return null
    const m = mean(sampleMeans)
    const s = stdDevSample(sampleMeans)
    const theoreticalSE = round(100 / Math.sqrt(12) / Math.sqrt(sampleSize), 3)
    return { m: round(m, 2), s: round(s, 2), theoreticalSE }
  }, [sampleMeans, sampleSize])

  // Bin the sample means for bar display
  const histogram = useMemo(() => {
    if (!sampleMeans.length) return []
    const bins = 10
    const min = Math.min(...sampleMeans)
    const max = Math.max(...sampleMeans)
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

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample size (n): <span className="text-primary font-bold">{sampleSize}</span>
          </label>
          <input type="range" min={2} max={50} step={1} value={sampleSize}
            onChange={(e) => { setSampleSize(Number(e.target.value)); setDrawn(false) }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>2</span><span>50</span></div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Number of samples: <span className="text-primary font-bold">{numSamples}</span>
          </label>
          <input type="range" min={20} max={500} step={10} value={numSamples}
            onChange={(e) => { setNumSamples(Number(e.target.value)); setDrawn(false) }}
            className="w-full accent-primary" />
          <div className="flex justify-between text-xs text-textMuted mt-0.5"><span>20</span><span>500</span></div>
        </div>
      </div>

      <button onClick={handleDraw}
        className="mb-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
        Draw samples & plot means
      </button>

      {drawn && stats && (
        <>
          <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="text-blue-600 font-medium">Mean of means</div>
              <div className="text-blue-900 font-bold text-lg">{stats.m}</div>
              <div className="text-blue-600">≈ population μ (≈50)</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="text-emerald-600 font-medium">SD of means</div>
              <div className="text-emerald-900 font-bold text-lg">{stats.s}</div>
              <div className="text-emerald-600">≈ standard error</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
              <div className="text-purple-600 font-medium">Theoretical SE</div>
              <div className="text-purple-900 font-bold text-lg">{stats.theoreticalSE}</div>
              <div className="text-purple-600">σ/√n</div>
            </div>
          </div>

          {/* Simple bar histogram */}
          <div className="mb-1">
            <p className="text-xs font-medium text-textMuted mb-1">Distribution of {numSamples} sample means</p>
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
              <span className="text-center">Sample mean (x̄)</span>
              <span>{histogram[histogram.length - 1]?.label ?? ''}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Increase n — notice the spread narrows (SE shrinks). Increase the number of samples — the bell shape becomes clearer.
          </p>
        </>
      )}
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Sampling Distribution',
  topicGroup: 'Sampling',
  learningObjective:
    'Describe what a sampling distribution is and explain how sample size affects its shape and spread.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        When you take a random sample and calculate a statistic (say, the mean), you get one
        value. If you repeated the process hundreds of times — each time drawing a fresh sample
        of the same size — you would get hundreds of slightly different means. The distribution
        of all those possible sample statistics is called the <strong>sampling distribution</strong>.
      </p>
      <p>
        The sampling distribution is a theoretical concept (we rarely actually draw thousands of
        samples), but it is the backbone of all statistical inference. It tells us:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>What values a sample statistic is likely to take</li>
        <li>How much variability to expect due to random chance alone</li>
        <li>Whether an observed result is surprising or typical</li>
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Key properties of the sampling distribution of x̄</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>Centre:</strong> E(x̄) = μ — the mean of sample means equals the population mean.</li>
          <li><strong>Spread:</strong> σ_x̄ = σ/√n — the standard deviation of sample means is the standard error.</li>
          <li><strong>Shape:</strong> Approximately normal for large n (Central Limit Theorem).</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine you scoop a cup of sand from the beach and weigh it. You get one weight.
        If you scooped 1,000 cups and recorded each weight, the histogram of all those
        weights would be the sampling distribution of the cup's weight. On average, your
        cup would weigh the "true" average scoop weight — but each individual scoop varies
        a little due to chance.
      </p>
      <p className="text-sm text-gray-600">
        A bigger cup (larger n) averages out more sand grains, so the results are less variable
        — the sampling distribution is narrower.
      </p>
    </div>
  ),
  formula: {
    main: 'σ_x̄ = σ / √n',
    variants: [
      { label: 'Standard error of the mean', expression: 'σ_x̄ = σ / √n', latex: '\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}}' },
      { label: 'Mean of sampling distribution', expression: 'E(x̄) = μ', latex: 'E(\\bar{x}) = \\mu' },
    ],
    symbolGuide: [
      { symbol: 'σ_x̄', meaning: 'Standard error of the mean — spread of the sampling distribution' },
      { symbol: 'σ', meaning: 'Population standard deviation' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: 'μ', meaning: 'Population mean' },
      { symbol: 'x̄', meaning: 'Sample mean — one draw from the sampling distribution' },
    ],
  },
  whenToUse: [
    'When reasoning about how accurate a sample estimate is likely to be',
    'As the theoretical basis for confidence intervals and hypothesis tests',
    'When deciding what sample size is needed to achieve a target precision',
  ],
  whenNotToUse: [
    'The sampling distribution is a theoretical framework — you do not "use" it directly for a single data analysis; you use its properties (standard error, shape) to build intervals and tests',
  ],
  assumptions: [
    'Samples are drawn randomly and independently',
    'Sample size n is small relative to population N (or sampling is with replacement)',
    'The population has a finite variance σ²',
  ],
  workedExample: {
    scenario:
      'Exam scores in a population have μ = 70 and σ = 12. A random sample of n = 36 students is taken.',
    steps: [
      { stepNumber: 1, label: 'State the mean of the sampling distribution', expression: 'E(x̄) = μ = 70', result: '70', explanation: 'The average of all possible sample means equals the population mean.' },
      { stepNumber: 2, label: 'Calculate the standard error', expression: 'SE = σ/√n = 12/√36 = 12/6', result: 'SE = 2', explanation: 'With n = 36, the standard error is 2 — sample means will typically be within 2 points of 70.' },
      { stepNumber: 3, label: 'Apply the 68-95-99.7 rule', expression: 'x̄ ∈ [70 ± 2×2] = [66, 74] with 95% probability', result: 'About 95% of sample means fall between 66 and 74', explanation: 'Since the sampling distribution is approximately normal, we use the empirical rule (±2 SE is a rounding of the more precise ±1.96 SE).' },
    ],
    interpretation:
      'With n = 36, a sample mean outside [66, 74] would be unusual — it happens less than 5% of the time by chance alone. Larger samples produce narrower sampling distributions.',
  },
  interpretation:
    'The sampling distribution connects a single sample to the population. Its spread (standard error) tells you how much sample-to-sample variability to expect. Smaller SE means more precise estimates.',
  commonMistakes: [
    { mistake: 'Confusing the sampling distribution with the data distribution', explanation: 'The data distribution describes individual observations; the sampling distribution describes statistics (like x̄) computed from many samples.' },
    { mistake: 'Thinking you need to draw many samples to use these ideas', explanation: 'The sampling distribution is a theoretical construct. You use its properties to make inferences from a single sample.' },
    { mistake: 'Forgetting that SE shrinks with √n, not proportionally to n', explanation: 'Doubling n halves the variance but only reduces SE by a factor of √2 ≈ 1.41.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'sd-easy-1', scenario: 'A population has σ = 20. A sample of n = 25 is drawn.', question: 'What is the standard error of the mean?', hint: 'SE = σ/√n', solution: 'SE = 20/√25 = 20/5 = 4.' },
    ],
    moderate: [
      { id: 'sd-mod-1', scenario: 'Heights have μ = 170, σ = 10. Samples of n = 100 are taken.', question: 'Between what two values do 95% of sample means fall?', hint: 'Calculate SE, then apply ±1.96 SE.', solution: 'SE = 10/√100 = 1. 95% range: 170 ± 1.96×1 = [168.04, 171.96].' },
    ],
    challenging: [
      { id: 'sd-chal-1', scenario: 'You want sample means to be within ±3 points of the population mean with 95% confidence. σ = 15.', question: 'What minimum sample size is needed?', hint: 'ME = 1.96 × σ/√n ≤ 3. Solve for n.', solution: '1.96 × 15/√n ≤ 3 → √n ≥ 1.96×15/3 = 9.8 → n ≥ 96.04. Round up: n = 97.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'sd-kc-1', type: 'multiple-choice',
      question: 'What does the standard error of the mean measure?',
      options: [
        { id: 'a', text: 'The spread of individual data values', isCorrect: false, explanation: 'That is the standard deviation of the data — not the standard error.' },
        { id: 'b', text: 'The spread of sample means across many samples', isCorrect: true, explanation: 'Correct! The standard error (σ/√n) is the standard deviation of the sampling distribution.' },
        { id: 'c', text: 'The bias in the sample mean', isCorrect: false, explanation: 'Bias is a systematic error; standard error measures random variability.' },
        { id: 'd', text: 'The range of the population', isCorrect: false, explanation: 'The range describes individual data — not sampling variability.' },
      ],
      explanation: 'SE = σ/√n is the standard deviation of the distribution of all possible sample means.',
      hint: 'Standard error = standard deviation of the sampling distribution.',
    },
    {
      id: 'sd-kc-2', type: 'numerical',
      question: 'A population has σ = 30. A sample of n = 9 is drawn. What is the standard error?',
      answer: 10,
      tolerance: 0.1,
      explanation: 'SE = σ/√n = 30/√9 = 30/3 = 10.',
      hint: 'SE = σ divided by the square root of n.',
    },
    {
      id: 'sd-kc-3', type: 'multiple-choice',
      question: 'A population has μ = 80 and σ = 12. If you take many samples of n = 36, where will the mean of those sample means be centred?',
      options: [
        { id: 'a', text: '80 / 36 = 2.22', isCorrect: false, explanation: 'E(x̄) = μ, not μ/n.' },
        { id: 'b', text: '80', isCorrect: true, explanation: 'Correct! E(x̄) = μ. The sampling distribution is always centred at the population mean.' },
        { id: 'c', text: '12 / 6 = 2', isCorrect: false, explanation: 'That is the standard error, not the mean of the sampling distribution.' },
        { id: 'd', text: 'It depends on the sample', isCorrect: false, explanation: 'The expected value (long-run average) of x̄ is always μ, regardless of individual samples.' },
      ],
      explanation: 'E(x̄) = μ — the sampling distribution is always centred at the true population mean.',
      hint: 'The mean of all possible sample means equals what?',
    },
    {
      id: 'sd-kc-4', type: 'multiple-choice',
      question: 'You quadruple the sample size from n = 25 to n = 100. What happens to the standard error?',
      options: [
        { id: 'a', text: 'It doubles', isCorrect: false, explanation: 'SE shrinks as n grows, it does not grow.' },
        { id: 'b', text: 'It stays the same', isCorrect: false, explanation: 'SE = σ/√n — it changes with n.' },
        { id: 'c', text: 'It is cut in half', isCorrect: true, explanation: 'Correct! √100 = 10, √25 = 5. SE is halved (σ/10 vs σ/5).' },
        { id: 'd', text: 'It is divided by 4', isCorrect: false, explanation: 'Quadrupling n halves SE. Doubling n reduces SE by only √2 ≈ 1.41.' },
      ],
      explanation: 'SE = σ/√n. Going from n=25 to n=100 quadruples n, which halves SE.',
      hint: 'SE ∝ 1/√n. √100 vs √25.',
    },
    {
      id: 'sd-kc-5', type: 'multiple-choice',
      question: 'Why is the sampling distribution NOT the same as the distribution of individual data values?',
      options: [
        { id: 'a', text: 'The sampling distribution is always uniform', isCorrect: false, explanation: 'Not true — it approaches normal, not uniform.' },
        { id: 'b', text: 'It describes statistics (means) calculated from samples, not individual observations', isCorrect: true, explanation: 'Correct! The sampling distribution shows how a statistic varies across many samples.' },
        { id: 'c', text: 'It uses a different dataset', isCorrect: false, explanation: 'No different dataset — it is a theoretical distribution of a statistic computed from the same population.' },
        { id: 'd', text: 'It only applies to normal populations', isCorrect: false, explanation: 'By the CLT, the sampling distribution is approximately normal for large n regardless of population shape.' },
      ],
      explanation: 'Data distribution = spread of individuals. Sampling distribution = spread of a statistic (e.g., x̄) across repeated samples.',
      hint: 'What does each observation in the sampling distribution represent?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'sd-tf-1', type: 'true-false', question: 'The sampling distribution of x̄ is centred at the population mean μ.', isTrue: true, explanation: 'The expected value of x̄ is μ — the sampling distribution is centred on the true population mean.' },
    { id: 'sd-tf-2', type: 'true-false', question: 'The standard deviation of the sampling distribution of x̄ equals σ (the population standard deviation).', isTrue: false, explanation: 'The standard deviation of x̄ is σ/√n — the standard error — not σ itself. Larger n shrinks the spread.' },
    { id: 'sd-tf-3', type: 'true-false', question: 'Increasing the sample size n makes the sampling distribution of x̄ narrower.', isTrue: true, explanation: 'SE = σ/√n. As n increases, SE decreases and the sampling distribution clusters more tightly around μ.' },
    { id: 'sd-tf-4', type: 'true-false', question: 'The sampling distribution describes the distribution of individual data values in a sample.', isTrue: false, explanation: 'The sampling distribution describes a statistic (e.g., x̄) across many repeated samples — not individual data values.' },
    { id: 'sd-tf-5', type: 'true-false', question: 'If the population is normal, the sampling distribution of x̄ is also normal for any sample size.', isTrue: true, explanation: 'If X ~ N(μ, σ²), then x̄ ~ N(μ, σ²/n) exactly, for any n ≥ 1.' },
    { id: 'sd-tf-6', type: 'true-false', question: 'The sampling distribution of x̄ always has the same shape as the population distribution.', isTrue: false, explanation: 'For large n, the CLT makes the sampling distribution approximately normal regardless of the population shape.' },
    { id: 'sd-tf-7', type: 'true-false', question: 'A sampling distribution is constructed by taking many samples from the same population.', isTrue: true, explanation: 'Theoretically, the sampling distribution is built by taking all possible samples of size n and computing x̄ for each.' },
    { id: 'sd-tf-8', type: 'true-false', question: 'The standard error of the mean increases as the sample size increases.', isTrue: false, explanation: 'SE = σ/√n decreases as n increases. A larger sample gives a more precise estimate of μ.' },
    { id: 'sd-tf-9', type: 'true-false', question: 'The sample mean x̄ is an unbiased estimator of μ because the mean of its sampling distribution, E(x̄), equals μ.', isTrue: true, explanation: 'An estimator is unbiased when its expected value equals the parameter. E(x̄) = μ, so x̄ is an unbiased estimator of μ.' },
    { id: 'sd-tf-10', type: 'true-false', question: 'Two sampling distributions from the same population but different sample sizes will have the same spread.', isTrue: false, explanation: 'Larger n → smaller SE = σ/√n. The two sampling distributions will have different spreads.' },
    { id: 'sd-tf-11', type: 'true-false', question: 'The sampling distribution is a theoretical concept — you rarely construct it in practice by actually taking thousands of samples.', isTrue: true, explanation: 'In practice, statistical theory (CLT and properties of estimators) gives us the shape and spread without needing to draw thousands of samples.' },
    { id: 'sd-tf-12', type: 'true-false', question: 'The spread of the sampling distribution is determined solely by the population variance σ².', isTrue: false, explanation: 'Spread = σ/√n — both σ (population variability) AND n (sample size) determine the spread.' },
    { id: 'sd-tf-13', type: 'true-false', question: 'If you double the sample size, the standard error is halved.', isTrue: false, explanation: 'SE = σ/√n. Doubling n multiplies SE by 1/√2 ≈ 0.707, reducing it by about 29% — not halving it. To halve SE, you must quadruple n.' },
    { id: 'sd-tf-14', type: 'true-false', question: 'The sampling distribution of the sample proportion p̂ is also approximately normal for large n.', isTrue: true, explanation: 'When np ≥ 10 and n(1−p) ≥ 10, p̂ ~ N(p, p(1−p)/n) approximately.' },
    { id: 'sd-tf-15', type: 'true-false', question: 'Confidence intervals are constructed using the sampling distribution as a theoretical foundation.', isTrue: true, explanation: 'Confidence intervals rely on knowing the shape and spread of the sampling distribution to determine how wide the interval should be.' },
    { id: 'sd-tf-16', type: 'true-false', question: 'The sampling distribution of x̄ becomes more normal as σ increases.', isTrue: false, explanation: 'Shape normalises with larger n (CLT), not larger σ. σ affects spread, not shape.' },
    { id: 'sd-tf-17', type: 'true-false', question: 'If n = N (you sample the entire population without replacement), the standard error of x̄ is 0.', isTrue: true, explanation: 'A full census has no sampling variability — every sample gives the same x̄ = μ, so SE = 0.' },
    { id: 'sd-tf-18', type: 'true-false', question: 'The concept of sampling distribution is only relevant for the sample mean, not other statistics.', isTrue: false, explanation: 'Any statistic has a sampling distribution — sample median, proportion, variance, standard deviation, correlation, etc.' },
    { id: 'sd-tf-19', type: 'true-false', question: 'A highly skewed population requires a larger n for the sampling distribution of x̄ to become approximately normal.', isTrue: true, explanation: 'More skew means longer tails — the CLT needs more averaging (larger n) to smooth these out.' },
    { id: 'sd-tf-20', type: 'true-false', question: 'The sampling distribution of x̄ has smaller variance than the population distribution variance.', isTrue: true, explanation: 'Var(x̄) = σ²/n < σ² for n > 1. Averaging reduces variability — sample means are less spread out than individual observations.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'sd-mc-6', type: 'multiple-choice', question: 'Population has μ = 50 and σ = 12. n = 36. What is the mean of the sampling distribution of x̄?', options: [{ id: 'a', text: '50/36', isCorrect: false, explanation: 'The mean of the sampling distribution equals μ — it is not divided by n.' }, { id: 'b', text: '50', isCorrect: true, explanation: 'E(x̄) = μ = 50. The sampling distribution is centred at the population mean.' }, { id: 'c', text: '12', isCorrect: false, explanation: '12 is σ — the population SD, not the mean.' }, { id: 'd', text: '2', isCorrect: false, explanation: '2 = σ/√n = 12/6 — that is the standard error, not the mean.' }], explanation: 'E(x̄) = μ = 50. The sampling distribution is always centred at μ.', hint: 'What is the expected value of the sample mean?' },
    { id: 'sd-mc-7', type: 'multiple-choice', question: 'σ = 20, n = 100. What is the standard error of x̄?', options: [{ id: 'a', text: '20', isCorrect: false, explanation: '20 is σ — the population standard deviation, not the SE.' }, { id: 'b', text: '2', isCorrect: true, explanation: 'SE = σ/√n = 20/√100 = 20/10 = 2.' }, { id: 'c', text: '200', isCorrect: false, explanation: '200 = σ × √n — incorrect direction.' }, { id: 'd', text: '0.2', isCorrect: false, explanation: '0.2 = σ/n = 20/100 — you divided by n instead of √n.' }], explanation: 'SE = σ/√n = 20/10 = 2.', hint: 'SE = σ divided by the square root of n.' },
    { id: 'sd-mc-8', type: 'multiple-choice', question: 'Which of the following would most reduce the standard error of x̄?', options: [{ id: 'a', text: 'Increasing the population mean', isCorrect: false, explanation: 'The population mean has no effect on SE.' }, { id: 'b', text: 'Quadrupling the sample size n', isCorrect: true, explanation: 'SE = σ/√n. Quadrupling n multiplies √n by 2, halving SE. This is the most direct reduction.' }, { id: 'c', text: 'Using a more precise measuring instrument', isCorrect: false, explanation: 'Measurement precision reduces measurement error — SE is about sampling variability, not measurement.' }, { id: 'd', text: 'Increasing the population variance', isCorrect: false, explanation: 'Increasing σ increases SE — the opposite of reducing it.' }], explanation: 'Quadrupling n halves SE (because √(4n) = 2√n). This is the direct lever for reducing sampling variability.', hint: 'SE = σ/√n. Which change directly shrinks SE?' },
    { id: 'sd-mc-9', type: 'multiple-choice', question: 'The difference between the data distribution and the sampling distribution of x̄ is:', options: [{ id: 'a', text: 'The data distribution is always normal; the sampling distribution is not', isCorrect: false, explanation: 'Neither must be normal — though the sampling distribution approaches normal by the CLT for large n.' }, { id: 'b', text: 'The data distribution shows individual values; the sampling distribution shows statistics from samples', isCorrect: true, explanation: 'Data distribution: where individuals fall. Sampling distribution: where sample statistics (x̄) fall across many samples.' }, { id: 'c', text: 'They are the same when n is large', isCorrect: false, explanation: 'Even for large n the population distribution keeps its own shape and spread σ, whereas the sampling distribution of x̄ is approximately normal with the smaller spread σ/√n.' }, { id: 'd', text: 'The sampling distribution always has a smaller mean', isCorrect: false, explanation: 'Both have the same mean μ. It is the spread that differs (SE = σ/√n vs σ).' }], explanation: 'Key distinction: data distribution → individual values, spread = σ; sampling distribution → x̄ values, spread = σ/√n.', hint: 'What does each observation in the sampling distribution represent?' },
    { id: 'sd-mc-10', type: 'multiple-choice', question: 'σ = 16, n = 64. What is SE?', options: [{ id: 'a', text: '16', isCorrect: false, explanation: '16 is σ — not the SE.' }, { id: 'b', text: '2', isCorrect: true, explanation: 'SE = 16/√64 = 16/8 = 2.' }, { id: 'c', text: '4', isCorrect: false, explanation: '4 = 16/√16 — that uses the wrong n. With n = 64, √64 = 8 and SE = 16/8 = 2.' }, { id: 'd', text: '0.25', isCorrect: false, explanation: '0.25 = σ/n = 16/64 — divided by n instead of √n.' }], explanation: 'SE = σ/√n = 16/8 = 2.', hint: 'Compute √64 first, then divide σ by it.' },
    { id: 'sd-mc-11', type: 'multiple-choice', question: 'If SE = 5 when n = 4, what is σ?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: '5 = σ/√4 = σ/2 → σ = 10, not 5.' }, { id: 'b', text: '10', isCorrect: true, explanation: 'SE = σ/√n → 5 = σ/2 → σ = 10.' }, { id: 'c', text: '20', isCorrect: false, explanation: '20 = SE × n = 5×4 — but σ = SE × √n = 5×2 = 10.' }, { id: 'd', text: '2.5', isCorrect: false, explanation: '2.5 = SE/√n — inverted formula.' }], explanation: 'σ = SE × √n = 5 × 2 = 10.', hint: 'Rearrange SE = σ/√n to solve for σ.' },
    { id: 'sd-mc-12', type: 'multiple-choice', question: 'A population is heavily right-skewed. For which sample size would the sampling distribution of x̄ be MOST approximately normal?', options: [{ id: 'a', text: 'n = 5', isCorrect: false, explanation: 'n=5 is too small for the CLT to overcome a heavy skew.' }, { id: 'b', text: 'n = 100', isCorrect: true, explanation: 'Large n allows the CLT to smooth out skewness. n=100 gives a much more normal-shaped sampling distribution.' }, { id: 'c', text: 'n = 2', isCorrect: false, explanation: 'n=2 is far too small.' }, { id: 'd', text: 'n = 15', isCorrect: false, explanation: 'n=15 is larger than 5 or 2 but still insufficient for heavily skewed populations. n=100 is better.' }], explanation: 'The CLT works better with larger n, especially for skewed populations. n=100 is the best choice here.', hint: 'Larger n → better CLT approximation.' },
    { id: 'sd-mc-13', type: 'multiple-choice', question: 'The sampling distribution of x̄ is unbiased. What does this mean?', options: [{ id: 'a', text: 'x̄ always equals μ', isCorrect: false, explanation: 'Individual x̄ values vary around μ — they are not always exactly equal to it.' }, { id: 'b', text: 'The expected value of x̄ equals μ over many repeated samples', isCorrect: true, explanation: 'Unbiasedness means E(x̄) = μ — on average, x̄ hits the target μ. Individual samples vary but centre on μ.' }, { id: 'c', text: 'x̄ has no variance', isCorrect: false, explanation: 'Unbiasedness is about the expected value (centre), not variance (spread).' }, { id: 'd', text: 'The sampling distribution is symmetric', isCorrect: false, explanation: 'Unbiasedness is about expected value equalling the parameter — symmetry is a separate property.' }], explanation: 'Unbiased: E(x̄) = μ. Sample means vary, but they average out to the true population mean.', hint: 'Unbiasedness is about where the distribution is centred, not about individual values.' },
    { id: 'sd-mc-14', type: 'multiple-choice', question: 'You increase n from 25 to 100. By what factor does SE change?', options: [{ id: 'a', text: 'SE doubles', isCorrect: false, explanation: 'Increasing n reduces SE. Doubling would mean SE increases.' }, { id: 'b', text: 'SE is halved', isCorrect: true, explanation: 'SE = σ/√n. √100/√25 = 10/5 = 2 → SE is divided by 2 (halved).' }, { id: 'c', text: 'SE is quartered', isCorrect: false, explanation: 'SE is quartered when n increases 16-fold, not 4-fold.' }, { id: 'd', text: 'SE is unchanged', isCorrect: false, explanation: 'SE always decreases when n increases.' }], explanation: 'n × 4 → √n × 2 → SE ÷ 2. Quadrupling n halves SE.', hint: 'SE = σ/√n. Compute the ratio of the two SEs.' },
    { id: 'sd-mc-15', type: 'multiple-choice', question: 'Which statement about the sampling distribution is FALSE?', options: [{ id: 'a', text: 'It is centred at μ', isCorrect: false, explanation: 'True — x̄ is an unbiased estimator, so E(x̄) = μ.' }, { id: 'b', text: 'It describes all possible values of x̄ across repeated samples', isCorrect: false, explanation: 'True — this is exactly what the sampling distribution represents.' }, { id: 'c', text: 'It has less spread than the population distribution for n > 1', isCorrect: false, explanation: 'True — SE = σ/√n < σ for n > 1.' }, { id: 'd', text: 'It always has exactly the same shape as the population', isCorrect: true, explanation: 'FALSE. For large n, the CLT makes the sampling distribution approximately normal regardless of population shape.' }], explanation: 'The sampling distribution shape converges to normal (CLT) — it does NOT mirror the population shape for large n.', hint: 'Which statement contradicts the Central Limit Theorem?' },
  ],
  keyTakeaway:
    'The sampling distribution of x̄ is centred at μ and has spread σ/√n. Larger samples produce smaller standard errors and more precise estimates. This distribution is the foundation of confidence intervals and hypothesis tests.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Bowling Lane" image:</strong></p>
      <p>Imagine rolling many bowling balls (samples) down a lane (the population). Each ball lands at a slightly different spot (x̄). The <em>average landing spot</em> is always the bullseye (μ). The <em>spread of landing spots</em> is the standard error = σ/√n.</p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs font-mono space-y-1">
        <div>Centre of sampling dist. = <strong>μ</strong> (always)</div>
        <div>Spread of sampling dist. = <strong>σ/√n</strong> (SE)</div>
        <div>Bigger ball (larger n) = tighter cluster = smaller SE</div>
      </div>
      <p className="text-xs text-textMuted">Key distinction: data distribution spreads with σ; sampling distribution spreads with σ/√n — much narrower.</p>
    </div>
  ),
  visualization: <SamplingDistributionViz />,
  datasetGenerator: false,
}

export default function SamplingDistribution({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
