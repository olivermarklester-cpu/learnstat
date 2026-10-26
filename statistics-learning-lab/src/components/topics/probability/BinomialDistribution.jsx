import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'
import { binomialPMF, combination, round } from '../../../utils/stats'

// --- Interactive Binomial PMF Visualization ---
function BinomialViz() {
  const [n, setN] = useState(10)
  const [p, setP] = useState(0.05)

  const { labels, values, mode, mean, variance, stdDev } = useMemo(() => {
    const pmfLabels = []
    const pmfValues = []
    let modeK = 0
    let maxP = 0
    const mu = n * p
    const sigma2 = n * p * (1 - p)
    const sigma = Math.sqrt(sigma2)

    for (let k = 0; k <= n; k++) {
      const prob = binomialPMF(k, n, p)
      const rounded = Math.round(prob * 100000) / 100000
      pmfLabels.push(String(k))
      pmfValues.push(rounded)
      if (rounded > maxP) {
        maxP = rounded
        modeK = k
      }
    }

    return {
      labels: pmfLabels,
      values: pmfValues,
      mode: modeK,
      mean: round(mu, 3),
      variance: round(sigma2, 4),
      stdDev: round(sigma, 3),
    }
  }, [n, p])

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            n (number of trials): <span className="text-primary font-bold">{n}</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-textMuted mt-0.5">
            <span>1</span>
            <span>30</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            p (success probability): <span className="text-primary font-bold">{p.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.01}
            max={0.99}
            step={0.01}
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-textMuted mt-0.5">
            <span>0.01</span>
            <span>0.99</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mb-3 flex-wrap">
        {[
          { label: 'Mean (np)', value: mean },
          { label: 'Std Dev', value: stdDev },
          { label: 'Most likely k', value: mode },
        ].map(({ label, value }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200"
          >
            {label}: {value}
          </span>
        ))}
      </div>
      <BarChart
        labels={labels}
        values={values}
        title={`Binomial Distribution PMF — n=${n}, p=${p.toFixed(2)}`}
        xLabel="Number of Successes (k)"
        yLabel="Probability P(X=k)"
        color="#2563EB"
        height={260}
      />
      <p className="text-xs text-gray-500 mt-2">
        Each bar shows the probability of exactly k successes in {n} trials with p={p.toFixed(2)}.
        Drag the sliders to see how n and p shape the distribution.
      </p>
    </div>
  )
}

// Pre-compute worked example values
const workedN = 10
const workedP = 0.05
const workedK = 2
const comb10_2 = combination(10, 2) // = 45
const pK2 = round(binomialPMF(2, workedN, workedP), 4)

const content = {
  title: 'Binomial Distribution',
  topicGroup: 'Probability',
  learningObjective:
    'Use the binomial distribution to find the probability of exactly k successes in n independent trials.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>binomial distribution</strong> models situations where you repeat the same
        experiment (a "trial") a fixed number of times and count how many times a specific outcome
        (a "success") occurs. Four conditions must hold:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>
          <strong>Fixed n:</strong> The number of trials is determined in advance.
        </li>
        <li>
          <strong>Two outcomes:</strong> Each trial produces exactly one of two results —
          success or failure.
        </li>
        <li>
          <strong>Constant p:</strong> The probability of success is the same on every trial.
        </li>
        <li>
          <strong>Independence:</strong> The outcome of one trial does not affect any other trial.
        </li>
      </ul>
      <p>
        If these four conditions hold, the random variable X = "number of successes" follows a{' '}
        <em>Binomial(n, p)</em> distribution.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine checking whether each of 10 medication orders has been entered correctly. Each
        check is a trial. Success = entry error caught. p = 0.05 (5% of checks catch an error).
      </p>
      <p className="text-sm">
        You want to know: "How likely is it that exactly 2 of my 10 checks find an error?" The
        binomial distribution answers this.
      </p>
      <p className="text-sm text-gray-600">
        Key insight: C(10,2) = 45 counts the number of different ways to choose <em>which</em> 2
        of the 10 checks find an error — order does not matter.
      </p>
    </div>
  ),
  formula: {
    main: 'P(X = k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ',
    variants: [
      {
        label: 'Binomial PMF',
        expression: 'P(X = k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ',
        latex: 'P(X = k) = \\frac{n!}{k!(n-k)!} p^{k}(1-p)^{n-k}',
      },
      { label: 'Binomial coefficient', expression: 'C(n,k) = n! / (k! × (n−k)!)', latex: 'C(n,k) = \\frac{n!}{k! \\times (n-k)!}' },
      { label: 'Mean', expression: 'μ = n × p', latex: '\\mu = n \\times p' },
      { label: 'Standard deviation', expression: 'σ = √(n × p × (1−p))', latex: '\\sigma = \\sqrt{n \\times p \\times (1-p)}' },
    ],
    symbolGuide: [
      { symbol: 'X', meaning: 'The random variable — number of successes in n trials' },
      { symbol: 'n', meaning: 'Number of trials (fixed in advance)' },
      { symbol: 'k', meaning: 'Number of successes we are calculating the probability for (0 ≤ k ≤ n)' },
      { symbol: 'p', meaning: 'Probability of success on a single trial (constant)' },
      { symbol: '1−p', meaning: 'Probability of failure on a single trial (also written q)' },
      {
        symbol: 'C(n,k)',
        meaning:
          'Binomial coefficient: number of ways to choose k items from n. C(10,2) = 45 means there are 45 ways to choose which 2 of the 10 trials are successes.',
      },
      { symbol: 'pᵏ', meaning: 'Probability of getting k successes in a specific order' },
      { symbol: '(1−p)ⁿ⁻ᵏ', meaning: 'Probability of getting (n−k) failures' },
    ],
  },
  whenToUse: [
    'Exactly two outcomes per trial (success / failure)',
    'Fixed number of trials n',
    'Same probability of success p on every trial',
    'Trials are independent',
    'Examples: defect counting, pass/fail testing, disease/no disease, heads/tails',
  ],
  whenNotToUse: [
    'When trials are not independent (sampling without replacement from a small population — use hypergeometric)',
    'When p changes from trial to trial',
    'When outcomes are not binary (more than two categories)',
    'When n is not fixed in advance',
  ],
  assumptions: [
    'Binary outcomes — exactly two possible results per trial',
    'Fixed n — known in advance',
    'Constant p — the same probability of success each trial',
    'Independence — trials do not affect each other',
  ],
  workedExample: {
    scenario: `A nurse makes ${workedN} medication checks. Each check has a ${workedP * 100}% chance of catching an error (p=${workedP}). What is P(catching exactly 2 errors)?`,
    steps: [
      {
        stepNumber: 1,
        label: 'Identify parameters',
        expression: `n = ${workedN} (trials), k = ${workedK} (target successes), p = ${workedP}`,
        result: `We want P(X = ${workedK})`,
        explanation: `Each medication check is a trial. Catching an error is the "success." n = ${workedN}, p = ${workedP}, k = ${workedK}.`,
      },
      {
        stepNumber: 2,
        label: 'Calculate the binomial coefficient C(10, 2)',
        expression: 'C(10,2) = 10! / (2! × 8!) = (10 × 9) / (2 × 1)',
        result: `C(10,2) = ${comb10_2}`,
        explanation: `C(10,2) = 45 means there are 45 different ways to choose WHICH 2 of the 10 checks catch an error — for example, checks 1 and 3, or checks 2 and 7, etc.`,
      },
      {
        stepNumber: 3,
        label: 'Calculate pᵏ — probability of exactly k successes in a specific order',
        expression: `${workedP}² = ${workedP * workedP}`,
        result: `p² = 0.0025`,
        explanation: `The probability that any specific 2 checks both catch errors = 0.05 × 0.05 = 0.0025.`,
      },
      {
        stepNumber: 4,
        label: 'Calculate (1−p)ⁿ⁻ᵏ — probability of the remaining failures',
        expression: `(1 − ${workedP})^(${workedN} − ${workedK}) = 0.95⁸`,
        result: `0.95⁸ ≈ 0.6634`,
        explanation: `The probability that the other 8 checks do NOT catch errors = 0.95⁸ ≈ 0.6634.`,
      },
      {
        stepNumber: 5,
        label: 'Combine all three parts',
        expression: `P(X = 2) = ${comb10_2} × 0.0025 × 0.6634`,
        result: `P(X = 2) ≈ ${pK2}`,
        explanation: `Multiply the three components: how many ways (45) × probability of success order (0.0025) × probability of failure order (0.6634).`,
      },
    ],
    interpretation: `There is approximately a ${Math.round(pK2 * 100 * 10) / 10}% chance that exactly 2 of the 10 medication checks will catch an error. The distribution peaks at k = 0 (most likely, since errors are rare at 5%), with rapidly decreasing probabilities for higher k values.`,
  },
  interpretation:
    'The binomial distribution gives a complete picture of all possible outcomes (0, 1, 2, ..., n successes) and their likelihoods. The mean n×p tells you the expected number of successes on average. Use the interactive chart above to see how changing n and p reshapes the distribution.',
  commonMistakes: [
    {
      mistake: 'Forgetting the binomial coefficient C(n,k)',
      explanation:
        'You must account for all the different orderings of k successes in n trials. C(n,k) counts these arrangements. Omitting it gives only the probability of one specific sequence, not all sequences with exactly k successes.',
    },
    {
      mistake: 'Using the formula when trials are not independent',
      explanation:
        'If drawing items without replacement from a small group, each draw changes the pool — use the hypergeometric distribution instead.',
    },
    {
      mistake: 'Confusing P(X = k) with P(X ≤ k)',
      explanation:
        'P(X = k) is the PMF — exactly k successes. P(X ≤ k) is the CDF — k or fewer. "At most 2 errors" needs the CDF (sum P(X=0) + P(X=1) + P(X=2)); "exactly 2 errors" uses the PMF.',
    },
    {
      mistake: 'Using the wrong value of "success"',
      explanation:
        'Success is whatever outcome you are counting — it can be a negative event like an error or defect. Define success carefully and make sure p matches that definition.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'bd-easy-1',
        scenario: 'A fair coin is flipped 5 times.',
        question: 'What is P(exactly 3 heads)?',
        hint: 'n=5, k=3, p=0.5. Calculate C(5,3) × 0.5³ × 0.5².',
        solution:
          'C(5,3) = 10. P(X=3) = 10 × 0.5³ × 0.5² = 10 × 0.125 × 0.25 = 10 × 0.03125 = 0.3125.',
      },
      {
        id: 'bd-easy-2',
        scenario: 'A quality check has p(defect) = 0.10. 8 items are checked.',
        question: 'What is P(no defects at all)?',
        hint: 'n=8, k=0, p=0.10. C(8,0) = 1.',
        solution: 'P(X=0) = 1 × 0.10⁰ × 0.90⁸ = 0.90⁸ ≈ 0.4305.',
      },
    ],
    moderate: [
      {
        id: 'bd-mod-1',
        scenario:
          'A survey shows 30% of customers prefer product A. 6 customers are sampled randomly.',
        question: 'What is P(exactly 2 prefer product A)? What is P(at most 1 prefers product A)?',
        hint: 'For "at most 1": calculate P(X=0) + P(X=1).',
        solution:
          'P(X=2): C(6,2)=15, 15 × 0.3² × 0.7⁴ = 15 × 0.09 × 0.2401 = 0.3241. P(X=0) = 0.7⁶ ≈ 0.1176. P(X=1) = C(6,1) × 0.3 × 0.7⁵ = 6 × 0.3 × 0.1681 ≈ 0.3025. P(X ≤ 1) ≈ 0.1176 + 0.3025 = 0.4201.',
      },
    ],
    challenging: [
      {
        id: 'bd-chal-1',
        scenario:
          'A medical procedure has a 15% complication rate. 20 procedures are performed in one day.',
        question:
          'What is the expected number of complications? What is P(more than 5 complications)?',
        hint: 'Expected = n×p. For P(X > 5): use P(X > 5) = 1 − P(X ≤ 5).',
        solution:
          'Expected = 20 × 0.15 = 3. P(X > 5) = 1 − P(X ≤ 5). Computing P(X ≤ 5) by summing P(X=0) through P(X=5) ≈ 0.932, so P(X > 5) ≈ 1 − 0.932 = 0.068.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'bd-kc-1',
      type: 'multiple-choice',
      question:
        'Which of these scenarios satisfies all four conditions for a binomial distribution?',
      options: [
        {
          id: 'a',
          text: 'Rolling a die until you get a 6 (no fixed n)',
          isCorrect: false,
          explanation: 'No fixed n — the number of rolls is not determined in advance.',
        },
        {
          id: 'b',
          text: 'Drawing 5 cards from a deck without replacement (p changes)',
          isCorrect: false,
          explanation: 'Without replacement, p changes after each draw — not constant.',
        },
        {
          id: 'c',
          text: 'Flipping a fair coin 20 times and counting heads',
          isCorrect: true,
          explanation: 'Correct! Fixed n=20, two outcomes, constant p=0.5, independent flips.',
        },
        {
          id: 'd',
          text: 'Rating satisfaction on a 5-point scale for 30 customers',
          isCorrect: false,
          explanation: '5-point ratings are not binary (not two outcomes).',
        },
      ],
      explanation: 'Coin flips satisfy all four binomial conditions: n fixed, binary, constant p, independent.',
      hint: 'Check all four conditions: fixed n, binary, constant p, independence.',
    },
    {
      id: 'bd-kc-2',
      type: 'multiple-choice',
      question: "What does C(n,k) represent in the binomial formula?",
      options: [
        { id: 'a', text: 'The probability of k successes in a row', isCorrect: false, explanation: 'pᵏ gives the probability of k successes in a specific sequence.' },
        { id: 'b', text: 'The number of ways to arrange k successes among n trials', isCorrect: true, explanation: 'Correct! C(n,k) counts all the different orderings — which k of the n trials are the successful ones.' },
        { id: 'c', text: 'The expected number of successes', isCorrect: false, explanation: 'Expected number of successes = n × p, not C(n,k).' },
        { id: 'd', text: 'n divided by k', isCorrect: false, explanation: 'C(n,k) = n! / (k! × (n−k)!) — it is not a simple division.' },
      ],
      explanation: 'C(n,k) = n!/(k!(n−k)!) counts the combinations — the number of ways to select k positions out of n for successes.',
      hint: 'Think about choosing which specific trials will be the successful ones.',
    },
    {
      id: 'bd-kc-3',
      type: 'numerical',
      question:
        'n=4, p=0.5, k=2. What is P(X=2)? (C(4,2) = 6. Round to 4 decimal places.)',
      answer: 0.375,
      tolerance: 0.001,
      explanation: 'P(X=2) = C(4,2) × 0.5² × 0.5² = 6 × 0.25 × 0.25 = 6 × 0.0625 = 0.375.',
      hint: 'C(4,2) = 6. Multiply by p² × (1−p)².',
    },
    {
      id: 'bd-kc-4',
      type: 'multiple-choice',
      question:
        'For a Binomial(n=20, p=0.4) distribution, what is the expected number of successes?',
      options: [
        { id: 'a', text: '4', isCorrect: false, explanation: '4 would be n × p = 10 × 0.4 or n × p = 20 × 0.2.' },
        { id: 'b', text: '8', isCorrect: true, explanation: 'Correct! μ = n × p = 20 × 0.4 = 8.' },
        { id: 'c', text: '0.4', isCorrect: false, explanation: '0.4 is p, the per-trial probability.' },
        { id: 'd', text: '20', isCorrect: false, explanation: '20 is n, the number of trials.' },
      ],
      explanation: 'Mean of binomial: μ = n × p = 20 × 0.4 = 8.',
      hint: 'Use the formula μ = n × p.',
    },
    {
      id: 'bd-kc-5',
      type: 'multiple-choice',
      question:
        'A machine has P(defect) = 0.02 per item. 100 items are produced. What is the most correct interpretation of P(X = 0)?',
      options: [
        { id: 'a', text: 'The machine will never produce a defect', isCorrect: false, explanation: 'P(X=0) > 0 — it just represents a probability, not certainty.' },
        { id: 'b', text: 'The probability that none of the 100 items are defective', isCorrect: true, explanation: 'Correct! P(X=0) = (0.98)¹⁰⁰ ≈ 0.133 — about 13% chance of no defects in 100 items.' },
        { id: 'c', text: 'There is a 0% chance of any defects', isCorrect: false, explanation: 'P(X=0) ≈ 0.133, which is not 0.' },
        { id: 'd', text: 'The average number of defects is 0', isCorrect: false, explanation: 'The average (expected value) is n × p = 100 × 0.02 = 2 defects, not 0.' },
      ],
      explanation: 'P(X=0) = C(100,0) × 0.02⁰ × 0.98¹⁰⁰ = 0.98¹⁰⁰ ≈ 0.133. About 13% chance no defects occur.',
      hint: 'P(X=0) means exactly zero successes (defects) in all n trials.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'binom-tf-1', type: 'true-false', question: 'The binomial distribution requires a fixed number of trials.', isTrue: true, explanation: 'One of the four conditions for a binomial experiment is a fixed n — the number of trials must be determined in advance.' },
    { id: 'binom-tf-2', type: 'true-false', question: 'In a binomial experiment, each trial can have more than two outcomes.', isTrue: false, explanation: 'Each trial must be binary — exactly two outcomes (success or failure). Multiple outcomes violate the binomial conditions.' },
    { id: 'binom-tf-3', type: 'true-false', question: 'The probability of success p must remain constant across all trials for a binomial distribution.', isTrue: true, explanation: 'Constant p is one of the four binomial conditions. Changing p between trials violates the model.' },
    { id: 'binom-tf-4', type: 'true-false', question: 'Trials in a binomial experiment must be independent.', isTrue: true, explanation: 'Independence is required. The result of one trial must not affect the probability of success in any other trial.' },
    { id: 'binom-tf-5', type: 'true-false', question: 'The expected value of a binomial distribution is n × p.', isTrue: true, explanation: 'E(X) = n × p for a Binomial(n, p) distribution. It is the average number of successes over n trials.' },
    { id: 'binom-tf-6', type: 'true-false', question: 'The variance of a binomial distribution is n × p × (1−p).', isTrue: true, explanation: 'Var(X) = npq where q = 1−p. The standard deviation is √(npq).' },
    { id: 'binom-tf-7', type: 'true-false', question: 'If p = 0.5, the binomial distribution is always symmetric.', isTrue: true, explanation: 'When p = 0.5, successes and failures are equally likely — the distribution is perfectly symmetric around n/2.' },
    { id: 'binom-tf-8', type: 'true-false', question: 'Drawing cards without replacement from a small deck satisfies the binomial conditions.', isTrue: false, explanation: 'Without replacement, p changes with each draw (dependent trials), violating the constant-p and independence conditions.' },
    { id: 'binom-tf-9', type: 'true-false', question: 'P(X = k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ.', isTrue: true, explanation: 'This is the binomial probability formula. C(n,k) counts arrangements; pᵏ(1−p)ⁿ⁻ᵏ is the probability of each arrangement.' },
    { id: 'binom-tf-10', type: 'true-false', question: 'The binomial distribution can approximate the normal distribution when n is large and p is not close to 0 or 1.', isTrue: true, explanation: 'By the Central Limit Theorem, binomial distributions with large n and moderate p approximate a normal distribution.' },
    { id: 'binom-tf-11', type: 'true-false', question: 'C(n, 0) = 0 for any n.', isTrue: false, explanation: 'C(n, 0) = 1 for any n. There is exactly one way to choose zero items — choose nothing.' },
    { id: 'binom-tf-12', type: 'true-false', question: 'For a binomial distribution, P(X > n) > 0.', isTrue: false, explanation: 'X can only range from 0 to n. P(X > n) = 0 because you cannot have more successes than trials.' },
    { id: 'binom-tf-13', type: 'true-false', question: 'If p is close to 1, the binomial distribution is right-skewed.', isTrue: false, explanation: 'When p is close to 1, most trials succeed and few fail — the distribution is LEFT-skewed (tail towards low values).' },
    { id: 'binom-tf-14', type: 'true-false', question: 'P(X ≥ 1) = 1 − P(X = 0) for a binomial random variable.', isTrue: true, explanation: 'P(X ≥ 1) is the complement of P(X = 0). Using the complement rule: P(X ≥ 1) = 1 − (1−p)ⁿ.' },
    { id: 'binom-tf-15', type: 'true-false', question: 'The binomial coefficient C(n,k) represents the probability of getting exactly k successes.', isTrue: false, explanation: 'C(n,k) counts the number of ways to arrange k successes in n trials — it is a count, not a probability.' },
    { id: 'binom-tf-16', type: 'true-false', question: 'If n = 1, the binomial distribution becomes a Bernoulli distribution.', isTrue: true, explanation: 'A single binary trial (n=1) is a Bernoulli trial. Binomial(1, p) = Bernoulli(p).' },
    { id: 'binom-tf-17', type: 'true-false', question: 'C(n, k) = C(n, n−k).', isTrue: true, explanation: 'Choosing k items to succeed is the same as choosing n−k items to fail. The symmetry of combinations gives C(n,k) = C(n,n−k).' },
    { id: 'binom-tf-18', type: 'true-false', question: 'The sum of all binomial probabilities P(X=0) + P(X=1) + … + P(X=n) = 1.', isTrue: true, explanation: 'All possible outcomes are covered. The sum of a complete probability distribution must equal 1.' },
    { id: 'binom-tf-19', type: 'true-false', question: 'A binomial distribution with p = 0.1 and n = 100 is approximately normal.', isTrue: true, explanation: 'np = 10 ≥ 10 and n(1−p) = 90 ≥ 10, so the normal approximation applies.' },
    { id: 'binom-tf-20', type: 'true-false', question: 'Increasing n while keeping p constant increases the variance of a binomial distribution.', isTrue: true, explanation: 'Var(X) = np(1−p). Increasing n increases variance linearly (assuming p is held constant).' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'binom-mc-6', type: 'multiple-choice', question: 'A fair coin is flipped 5 times. P(exactly 3 heads) = ?', options: [{ id: 'a', text: '10/32', isCorrect: true, explanation: 'C(5,3)×(0.5)³×(0.5)² = 10×(1/32) = 10/32 = 0.3125.' }, { id: 'b', text: '3/5', isCorrect: false, explanation: '3/5 is just the fraction of heads — not the binomial probability.' }, { id: 'c', text: '1/8', isCorrect: false, explanation: '1/8 = (0.5)³ — this ignores the C(5,3) arrangements.' }, { id: 'd', text: '1/32', isCorrect: false, explanation: '1/32 = (0.5)⁵ is P(all five heads), not exactly 3.' }], explanation: 'C(5,3) = 10. P = 10 × (0.5)⁵ = 10/32 ≈ 0.3125.', hint: 'Use P = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ with n=5, k=3, p=0.5.' },
    { id: 'binom-mc-7', type: 'multiple-choice', question: 'n = 10, p = 0.2. What is E(X)?', options: [{ id: 'a', text: '0.2', isCorrect: false, explanation: '0.2 is p — not the expected value.' }, { id: 'b', text: '2', isCorrect: true, explanation: 'E(X) = n × p = 10 × 0.2 = 2.' }, { id: 'c', text: '8', isCorrect: false, explanation: '8 = n × (1−p) — that is the expected number of failures.' }, { id: 'd', text: '1.6', isCorrect: false, explanation: '1.6 = n × p × (1−p) = Var(X) — that is the variance, not the mean.' }], explanation: 'E(X) = np = 10 × 0.2 = 2.', hint: 'Expected value = n × p.' },
    { id: 'binom-mc-8', type: 'multiple-choice', question: 'Which scenario does NOT satisfy the binomial conditions?', options: [{ id: 'a', text: 'Flipping a fair coin 20 times, counting heads', isCorrect: false, explanation: 'Fixed n=20, binary outcome (H/T), constant p=0.5, independent — all conditions met.' }, { id: 'b', text: 'Drawing 5 cards from a deck without replacement, counting aces', isCorrect: true, explanation: 'Without replacement: p changes with each draw and trials are dependent — binomial conditions violated.' }, { id: 'c', text: 'Testing 50 randomly selected bolts for defects (p = 0.05)', isCorrect: false, explanation: 'If each bolt is tested independently with constant defect rate, this satisfies binomial conditions.' }, { id: 'd', text: 'Surveying 100 voters who may vote Yes or No', isCorrect: false, explanation: 'Binary outcomes, fixed n, approximately independent large sample — binomial applies.' }], explanation: 'Without replacement creates dependent trials with changing p — violating two binomial conditions.', hint: 'Which scenario has changing probabilities between trials?' },
    { id: 'binom-mc-9', type: 'multiple-choice', question: 'n = 8, p = 0.3. What is Var(X)?', options: [{ id: 'a', text: '2.4', isCorrect: false, explanation: '2.4 = np = 8×0.3 — that is the mean, not the variance.' }, { id: 'b', text: '1.68', isCorrect: true, explanation: 'Var(X) = np(1−p) = 8×0.3×0.7 = 1.68.' }, { id: 'c', text: '0.21', isCorrect: false, explanation: '0.21 = p×(1−p) without the n factor.' }, { id: 'd', text: '5.6', isCorrect: false, explanation: '5.6 = n×(1−p) — incorrect formula.' }], explanation: 'Var(X) = np(1−p) = 8 × 0.3 × 0.7 = 1.68.', hint: 'Variance formula: n × p × (1−p).' },
    { id: 'binom-mc-10', type: 'multiple-choice', question: 'What does the binomial coefficient C(n,k) represent?', options: [{ id: 'a', text: 'The probability of exactly k successes', isCorrect: false, explanation: 'C(n,k) is a count, not a probability. Probability also requires pᵏ(1−p)ⁿ⁻ᵏ.' }, { id: 'b', text: 'The number of ways to arrange k successes in n trials', isCorrect: true, explanation: 'C(n,k) = n!/(k!(n−k)!) counts arrangements — how many sequences of n trials contain exactly k successes.' }, { id: 'c', text: 'The expected number of successes', isCorrect: false, explanation: 'Expected value = np, which is different from C(n,k).' }, { id: 'd', text: 'The variance of the distribution', isCorrect: false, explanation: 'Variance = np(1−p), not C(n,k).' }], explanation: 'C(n,k) counts arrangements. Multiply by pᵏ(1−p)ⁿ⁻ᵏ to get the probability of exactly k successes.', hint: 'The "combination" formula counts orderings, not probabilities.' },
    { id: 'binom-mc-11', type: 'multiple-choice', question: 'A basketball player makes 70% of free throws. In 10 attempts, P(exactly 7 made) = ?', options: [{ id: 'a', text: 'C(10,7) × 0.7⁷ × 0.3³', isCorrect: true, explanation: 'This is precisely the binomial formula: C(10,7) = 120, 0.7⁷ ≈ 0.0824, 0.3³ = 0.027. Result ≈ 0.267.' }, { id: 'b', text: '0.7 × 7', isCorrect: false, explanation: 'Multiplying probability by count gives an expected value calculation, not a probability.' }, { id: 'c', text: '0.7⁷', isCorrect: false, explanation: '0.7⁷ is P(7 successes in a specific order) — missing C(10,7) arrangements and (0.3)³ failures.' }, { id: 'd', text: 'C(10,7) × 0.3⁷ × 0.7³', isCorrect: false, explanation: 'p and (1−p) are swapped — success probability is 0.7, not 0.3.' }], explanation: 'P(X=7) = C(10,7) × 0.7⁷ × 0.3³ ≈ 0.267.', hint: 'Success p = 0.7, failure q = 0.3, k = 7, n = 10.' },
    { id: 'binom-mc-12', type: 'multiple-choice', question: 'In a Binomial(n, p) distribution, if you increase p while keeping n fixed, what happens to E(X)?', options: [{ id: 'a', text: 'It decreases', isCorrect: false, explanation: 'E(X) = np. Increasing p increases the product.' }, { id: 'b', text: 'It increases', isCorrect: true, explanation: 'E(X) = np. More likely successes per trial → higher expected count of successes.' }, { id: 'c', text: 'It stays the same', isCorrect: false, explanation: 'E(X) = np directly depends on p.' }, { id: 'd', text: 'It becomes undefined', isCorrect: false, explanation: 'E(X) is always defined for valid p ∈ (0,1).' }], explanation: 'E(X) = np. Increasing p proportionally increases the expected number of successes.', hint: 'E(X) = n × p — what happens if p increases?' },
    { id: 'binom-mc-13', type: 'multiple-choice', question: 'Which condition allows the normal approximation to the binomial?', options: [{ id: 'a', text: 'n > 5', isCorrect: false, explanation: 'n > 5 alone is insufficient. Both np and n(1−p) must be ≥ 10.' }, { id: 'b', text: 'np ≥ 10 and n(1−p) ≥ 10', isCorrect: true, explanation: 'The standard rule: both np ≥ 10 and nq ≥ 10 ensure enough expected successes and failures for the normal approximation.' }, { id: 'c', text: 'p = 0.5', isCorrect: false, explanation: 'p = 0.5 helps symmetry but the approximation works for other p values too when n is large enough.' }, { id: 'd', text: 'n × p × (1−p) > 30', isCorrect: false, explanation: 'The standard threshold is np ≥ 10 and n(1−p) ≥ 10, not a product condition on the variance.' }], explanation: 'Normal approximation to binomial: requires np ≥ 10 AND n(1−p) ≥ 10.', hint: 'Both expected successes and expected failures must be at least 10.' },
    { id: 'binom-mc-14', type: 'multiple-choice', question: 'P(X = 0) for Binomial(n, p) equals:', options: [{ id: 'a', text: '1 − pⁿ', isCorrect: false, explanation: '1 − pⁿ = P(X ≥ 1) — the complement of P(X=0).' }, { id: 'b', text: '(1−p)ⁿ', isCorrect: true, explanation: 'P(X=0) = C(n,0) × p⁰ × (1−p)ⁿ = 1 × 1 × (1−p)ⁿ = (1−p)ⁿ.' }, { id: 'c', text: 'pⁿ', isCorrect: false, explanation: 'pⁿ = P(X=n), the probability of ALL successes.' }, { id: 'd', text: 'np(1−p)', isCorrect: false, explanation: 'np(1−p) is the variance, not P(X=0).' }], explanation: 'P(X=0) = C(n,0) × p⁰ × (1−p)ⁿ = (1−p)ⁿ. All n trials must be failures.', hint: 'Every trial must fail. What is the probability of n consecutive failures?' },
    { id: 'binom-mc-15', type: 'multiple-choice', question: 'A binomial distribution with n=50, p=0.02 has very small p. Which alternative distribution better approximates it?', options: [{ id: 'a', text: 'Normal distribution', isCorrect: false, explanation: 'Normal approximation requires np ≥ 10. Here np = 1 — too small.' }, { id: 'b', text: 'Poisson distribution', isCorrect: true, explanation: 'When n is large and p is very small (np = λ is moderate), the Poisson distribution approximates the binomial well.' }, { id: 'c', text: 'Uniform distribution', isCorrect: false, explanation: 'A uniform distribution has no connection to rare-event binomial outcomes.' }, { id: 'd', text: 'Exponential distribution', isCorrect: false, explanation: 'The exponential distribution models waiting times, not counts of rare events in n trials.' }], explanation: 'Poisson approximation: use when n is large, p is small, and np = λ is moderate (typically λ < 10).', hint: 'What distribution models rare events (small p, large n)?' },
  ],
  keyTakeaway:
    'P(X=k) = C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ. Use when you have a fixed number of independent binary trials with constant success probability. C(n,k) counts the arrangements; pᵏ × (1−p)ⁿ⁻ᵏ gives the probability of each arrangement.',
  visualization: <BinomialViz />,
  datasetGenerator: false,
}

export default function BinomialDistribution({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
