import { useMemo, useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { HistogramChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { mean, varianceSample, variancePopulation, round } from '../../../utils/stats'

// Fixed dataset
const FIXED = [5, 7, 7, 9, 12]
const fixedMean = mean(FIXED)
const fixedVarSample = round(varianceSample(FIXED), 4)
const fixedVarPop = round(variancePopulation(FIXED), 4)

function VarianceViz({ data: propData }) {
  const [mode, setMode] = useState('sample')
  const { data: ownData } = useDataset({ n: 25, min: 1, max: 50, distribution: 'normal' })
  const data = propData ?? ownData
  const liveVar = useMemo(() => {
    if (!data.length) return null
    const v = mode === 'sample' ? varianceSample(data) : variancePopulation(data)
    return round(v, 2)
  }, [data, mode])
  const liveMean = useMemo(() => (data.length ? round(mean(data), 2) : null), [data])

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('sample')}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${mode === 'sample' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'}`}
          >
            Sample (÷ n−1)
          </button>
          <button
            onClick={() => setMode('population')}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${mode === 'population' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}
          >
            Population (÷ N)
          </button>
        </div>
        <span className="text-xs font-medium text-gray-600">
          Mean: <strong>{liveMean ?? '…'}</strong> &nbsp;|&nbsp;
          {mode === 'sample' ? 'Sample variance (s²)' : 'Population variance (σ²)'}: <strong>{liveVar ?? '…'}</strong>
        </span>
      </div>
      <HistogramChart
        data={data}
        bins={8}
        title="Live Dataset — Higher Spread = Higher Variance"
        xLabel="Value"
        yLabel="Count"
        showMean
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">
        Toggle between sample and population variance. The sample formula (÷ n−1) gives a slightly larger value — this corrects for using an estimated mean.
      </p>
    </div>
  )
}

const content = {
  title: 'Variance',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate sample and population variance and understand what variance measures about the spread of data.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Variance</strong> measures how far the values in a dataset are spread out from the mean. It tells you the average squared distance of each data point from the mean.
      </p>
      <p>
        A <strong>high variance</strong> means values are spread far from the mean. A <strong>low variance</strong> means values are tightly clustered near the mean.
      </p>
      <p>
        The key step in variance is <strong>squaring the differences</strong>. Without squaring, positive and negative differences would cancel each other out — and the sum would always be zero, which tells you nothing. Squaring solves this by making all differences positive.
      </p>
      <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm">
        <strong>Note on units:</strong> Because we square the differences, variance is in <em>squared units</em> (e.g., minutes²). This can be hard to interpret directly. That's why we often prefer the standard deviation (the square root of variance), which is back in the original units.
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine five students all aiming for a target score of 70. Their scores are 65, 68, 70, 72, 75. Variance is like measuring how far each arrow landed from the bullseye (70), squaring those distances, and averaging them.
      </p>
      <p className="text-sm text-gray-600">
        Squaring means a student who misses by 10 points contributes 100 to the variance — four times as much as a student who misses by 5 (contributing 25). Variance penalizes big misses heavily.
      </p>
    </div>
  ),
  formula: {
    main: 's² = Σ(x − x̄)² / (n − 1)',
    variants: [
      { label: 'Sample variance', expression: 's² = Σ(x − x̄)² / (n − 1)', latex: 's^{2} = \\frac{\\sum (x - \\bar{x})^{2}}{n - 1}' },
      { label: 'Population variance', expression: 'σ² = Σ(x − μ)² / N', latex: '\\sigma^{2} = \\frac{\\sum (x - \\mu)^{2}}{N}' },
    ],
    symbolGuide: [
      { symbol: 's²', meaning: 'Sample variance (read "s squared")' },
      { symbol: 'σ²', meaning: 'Population variance (read "sigma squared")' },
      { symbol: 'x', meaning: 'Each individual value in the dataset' },
      { symbol: 'x̄', meaning: 'Sample mean (the average of the sample)' },
      { symbol: 'μ', meaning: 'Population mean' },
      { symbol: 'Σ', meaning: 'Sum — add up all the squared deviations' },
      { symbol: 'n', meaning: 'Sample size (note: we divide by n−1, not n, for samples)' },
      { symbol: 'N', meaning: 'Population size' },
      { symbol: 'n−1', meaning: 'Bessel\'s correction — dividing by n−1 instead of n gives an unbiased estimate' },
    ],
  },
  whenToUse: [
    'When you need to quantify the spread of a dataset in formal statistical analysis',
    'As an intermediate step before calculating standard deviation',
    'When comparing variability across multiple datasets on the same scale',
    'In ANOVA and other advanced statistical procedures that use variance directly',
  ],
  whenNotToUse: [
    'When you want a spread measure in the original units — use standard deviation instead',
    'For ordinal data — variance requires interval or ratio level data',
    'As a standalone report to non-technical audiences — standard deviation is easier to interpret',
  ],
  assumptions: [
    'Data must be interval or ratio level (meaningful differences between values)',
    'Use sample variance (÷ n−1) when you have a sample and want to estimate population variance',
    'Use population variance (÷ N) only when you have the entire population',
    'Variance assumes no specific distribution shape for descriptive purposes',
  ],
  workedExample: {
    scenario: 'Call-center handling times (minutes): 5, 7, 7, 9, 12. Calculate the sample variance.',
    dataset: '[5, 7, 7, 9, 12]',
    steps: [
      { stepNumber: 1, label: 'Calculate the mean', expression: `(5 + 7 + 7 + 9 + 12) / 5 = 40 / 5 = ${fixedMean}`, result: `Mean x̄ = ${fixedMean}`, explanation: 'We need the mean first because variance measures deviation from it.' },
      { stepNumber: 2, label: 'Calculate each deviation from the mean', expression: `5−${fixedMean}=−3, 7−${fixedMean}=−1, 7−${fixedMean}=−1, 9−${fixedMean}=1, 12−${fixedMean}=4`, result: 'Deviations: −3, −1, −1, 1, 4', explanation: 'Deviation = each value minus the mean. Note that positive and negative deviations exist.' },
      { stepNumber: 3, label: 'Square each deviation', expression: '(−3)²=9, (−1)²=1, (−1)²=1, (1)²=1, (4)²=16', result: 'Squared deviations: 9, 1, 1, 1, 16', explanation: 'Squaring eliminates negatives and gives more weight to larger deviations.' },
      { stepNumber: 4, label: 'Sum the squared deviations', expression: '9 + 1 + 1 + 1 + 16 = 28', result: 'Sum of squares = 28', explanation: 'This sum is called the "Sum of Squares" or SS.' },
      { stepNumber: 5, label: 'Divide by n−1 (sample variance)', expression: `s² = 28 / (5 − 1) = 28 / 4 = ${fixedVarSample}`, result: `Sample variance s² = ${fixedVarSample} minutes²`, explanation: 'We use n−1 = 4 because this is a sample. Dividing by n would give ' + fixedVarPop + ' (population variance).' },
    ],
    interpretation: `The sample variance is ${fixedVarSample} minutes². This means handling times are spread, on average, by ${fixedVarSample} square-minutes from the mean — a hard unit to interpret intuitively. Take the square root to get the standard deviation (≈ 2.65 minutes), which is in the original units.`,
  },
  interpretation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>Variance is in <strong>squared units</strong>, making it hard to interpret directly. Two key uses:</p>
      <ul className="space-y-2 ml-4 text-sm">
        <li><strong>Comparing variability:</strong> If Dataset A has variance = 4 and Dataset B has variance = 25 (same units), Dataset B is more spread out — we can say that much without interpreting the exact number.</li>
        <li><strong>Calculating standard deviation:</strong> SD = √variance. The SD is in the original units and is much easier to interpret ("values typically differ from the mean by about X minutes").</li>
      </ul>
    </div>
  ),
  commonMistakes: [
    { mistake: 'Dividing by n instead of n−1 for sample data', explanation: 'When working with a sample, dividing by n slightly underestimates the true population variance. Dividing by n−1 (Bessel\'s correction) corrects this. If you have the entire population, use N.' },
    { mistake: 'Forgetting to square the deviations', explanation: 'Without squaring, the deviations sum to exactly zero (positive and negative cancel). You must square each (x − x̄) term before summing.' },
    { mistake: 'Confusing variance with standard deviation', explanation: 'Variance = (standard deviation)². Standard deviation = √variance. Variance is in squared units; SD is in original units.' },
    { mistake: 'Using the formula Σx² / n − x̄² instead of Σ(x−x̄)² / (n−1)', explanation: 'There is a computational shortcut formula (Σx²/n − x̄²) but it gives population variance. For sample variance, always use (n−1) in the denominator.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'var-easy-1',
        scenario: 'Dataset: 2, 4, 6. The mean is 4.',
        question: 'Calculate the sample variance.',
        hint: 'Deviations: 2−4=−2, 4−4=0, 6−4=2. Square them, sum, divide by n−1=2.',
        solution: 'Deviations: −2, 0, 2. Squared: 4, 0, 4. Sum = 8. Sample variance = 8/(3−1) = 8/2 = 4.',
      },
      {
        id: 'var-easy-2',
        scenario: 'A dataset has deviations from the mean: −5, 0, 3, 2.',
        question: 'What would happen to the variance if you forgot to square the deviations?',
        hint: 'Try adding the deviations without squaring.',
        solution: 'Without squaring: −5 + 0 + 3 + 2 = 0. The sum is always zero! This shows why squaring is essential — positive and negative deviations cancel. Squaring gives: 25, 0, 9, 4. Sum = 38. Sample variance = 38/3 ≈ 12.67.',
      },
    ],
    moderate: [
      {
        id: 'var-mod-1',
        scenario: 'Patient wait times: 10, 12, 8, 15, 10. Calculate sample variance step by step.',
        question: 'Show all steps: mean, deviations, squared deviations, sum, and final variance.',
        hint: 'Mean = (10+12+8+15+10)/5. Then follow the formula.',
        solution: 'Mean = 55/5 = 11. Deviations: 10−11=−1, 12−11=1, 8−11=−3, 15−11=4, 10−11=−1. Squared: 1, 1, 9, 16, 1. Sum = 28. Sample variance = 28/(5−1) = 28/4 = 7.0.',
      },
      {
        id: 'var-mod-2',
        scenario: 'A researcher calculates variance for two departments. Department A: s² = 4.5. Department B: s² = 36.',
        question: 'Interpret the difference. Which department is more consistent in its measurements?',
        hint: 'Higher variance = more spread from the mean.',
        solution: 'Department A (s² = 4.5) is more consistent — its values cluster more tightly around the mean. Department B (s² = 36) is much more variable — its values are spread far from the mean. Department A has roughly 8 times less variance, indicating substantially less variability.',
      },
    ],
    challenging: [
      {
        id: 'var-chal-1',
        scenario: 'A quality analyst calculates s² = 0.04 cm² for a machine part measurement. The acceptable range is ±0.5cm from target.',
        question: 'What is the standard deviation? Is this acceptable? Explain why we prefer SD over variance for this interpretation.',
        hint: 's = √s². Then compare to the ±0.5cm tolerance.',
        solution: 'SD = √0.04 = 0.2cm. Yes, this is acceptable — one standard deviation is only 0.2cm, well within the ±0.5cm tolerance. We prefer SD over variance here because variance is in cm² (squared units), which is not directly comparable to the ±0.5cm tolerance. SD is in the original units (cm) and can be directly compared to measurement tolerances.',
      },
      {
        id: 'var-chal-2',
        scenario: 'Two datasets: Dataset A = [5, 5, 5, 5, 5] and Dataset B = [3, 4, 5, 6, 7]. Both have mean = 5.',
        question: 'Calculate sample variance for each. What does this reveal about variance as a spread measure?',
        hint: 'All values in Dataset A equal the mean. What are their deviations?',
        solution: 'Dataset A: all deviations = 0. Sum of squares = 0. Variance = 0. Dataset B: deviations: −2,−1,0,1,2. Squared: 4,1,0,1,4. Sum = 10. Variance = 10/4 = 2.5. Variance = 0 means NO spread (all identical). Any positive variance means values differ from the mean. The further values are from the mean, the larger the variance. This shows variance perfectly captures spread — zero when there is none, increasing with spread.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'var-kc-1',
      type: 'multiple-choice',
      question: 'Why do we square the deviations when calculating variance?',
      options: [
        { id: 'a', text: 'To make the numbers larger', isCorrect: false, explanation: 'The purpose is not to make numbers larger — it is to prevent cancellation.' },
        { id: 'b', text: 'To prevent positive and negative deviations from cancelling each other out', isCorrect: true, explanation: 'Correct! Without squaring, Σ(x − x̄) = 0 always. Squaring makes all terms positive so they accumulate meaningfully.' },
        { id: 'c', text: 'To convert to different units', isCorrect: false, explanation: 'Squaring actually changes the units to squared units, which makes interpretation harder.' },
        { id: 'd', text: 'Because it is the only way to sum deviations', isCorrect: false, explanation: 'An alternative is to take absolute values |x − x̄|, which is used in mean absolute deviation (MAD). Squaring is chosen for mathematical properties.' },
      ],
      explanation: 'Σ(x − x̄) always equals zero for any dataset because positive and negative deviations perfectly cancel. Squaring eliminates negatives and gives variance a useful, non-zero value.',
      hint: 'What happens if you add up all the deviations (without squaring)?',
    },
    {
      id: 'var-kc-2',
      type: 'multiple-choice',
      question: 'When should you use n−1 instead of N in the variance formula?',
      options: [
        { id: 'a', text: 'When the dataset is large', isCorrect: false, explanation: 'Sample size does not determine this — whether you have a sample or the full population does.' },
        { id: 'b', text: 'When you have a sample and want to estimate population variance', isCorrect: true, explanation: 'Correct! Using n−1 (Bessel\'s correction) corrects for the fact that a sample mean is an estimate, producing an unbiased variance estimate.' },
        { id: 'c', text: 'Always — n−1 is always correct', isCorrect: false, explanation: 'If you have the full population, you should divide by N.' },
        { id: 'd', text: 'When the data is skewed', isCorrect: false, explanation: 'Distribution shape does not determine the n vs. n−1 choice.' },
      ],
      explanation: 'n−1 is Bessel\'s correction. It corrects for the fact that a sample mean is estimated from the data, which slightly underestimates the spread. Use N only when you have the entire population.',
      hint: 'Sample vs. population — which do you have?',
    },
    {
      id: 'var-kc-3',
      type: 'numerical',
      question: 'Deviations from the mean: 2, −3, 1. What is the sum of squared deviations?',
      answer: 14,
      tolerance: 0,
      explanation: '2² + (−3)² + 1² = 4 + 9 + 1 = 14.',
      hint: 'Square each deviation, then add them up.',
    },
    {
      id: 'var-kc-4',
      type: 'multiple-choice',
      question: 'Variance is 25. What are its units if the original data was measured in seconds?',
      options: [
        { id: 'a', text: 'Seconds', isCorrect: false, explanation: 'Variance is in squared units because we squared the deviations.' },
        { id: 'b', text: 'Seconds²', isCorrect: true, explanation: 'Correct! Because we square (x − x̄), variance is in squared units.' },
        { id: 'c', text: 'No units (dimensionless)', isCorrect: false, explanation: 'Variance inherits squared units from the original measurement.' },
        { id: 'd', text: '√seconds', isCorrect: false, explanation: 'That would be the case for the standard deviation, not variance.' },
      ],
      explanation: 'Variance = Σ(x − x̄)² / (n−1). The squaring of (x − x̄) means variance is in the square of the original units.',
      hint: 'What operation creates the "squared" in the variance formula?',
    },
    {
      id: 'var-kc-5',
      type: 'multiple-choice',
      question: 'Dataset A has variance 5, Dataset B has variance 80 (same measurement units). Which is true?',
      options: [
        { id: 'a', text: 'Dataset A has more spread', isCorrect: false, explanation: 'Higher variance = more spread. Dataset B has the larger variance.' },
        { id: 'b', text: 'Dataset B has more spread', isCorrect: true, explanation: 'Correct! Variance 80 means values in Dataset B are much further from their mean on average.' },
        { id: 'c', text: 'Both have the same spread', isCorrect: false, explanation: 'They have different variances, so they have different spreads.' },
        { id: 'd', text: 'Cannot compare variance across datasets', isCorrect: false, explanation: 'When units are the same, variance can be directly compared.' },
      ],
      explanation: 'Higher variance = more spread from the mean. Dataset B\'s variance of 80 is 16 times larger than Dataset A\'s variance of 5, indicating much greater variability.',
      hint: 'Larger variance = values more spread from the mean.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'var-tf-1', type: 'true-false', question: 'Variance measures the average squared deviation from the mean.', isTrue: true, explanation: 'Variance = Σ(xᵢ − mean)² / (n−1) for samples. Each deviation is squared to eliminate negative signs, then averaged. The result is in squared units.' },
    { id: 'var-tf-2', type: 'true-false', question: 'Variance can be negative.', isTrue: false, explanation: 'Variance = Σ(xᵢ − mean)² / (n−1). Each squared deviation is ≥ 0, so the sum is ≥ 0, and the average (variance) is ≥ 0. Variance = 0 only when all values are identical.' },
    { id: 'var-tf-3', type: 'true-false', question: 'The sample variance formula divides by (n − 1) instead of n to produce an unbiased estimate.', isTrue: true, explanation: 'Dividing by (n−1) is Bessel\'s correction. The sample mean is used to compute deviations (not the true population mean), which loses one degree of freedom. Dividing by (n−1) corrects this bias.' },
    { id: 'var-tf-4', type: 'true-false', question: 'Variance and standard deviation always have the same numerical value.', isTrue: false, explanation: 'SD = √Variance. They are equal only when Variance = 1 (since √1 = 1). For most real data, SD < Variance when Variance > 1, and SD > Variance when Variance < 1.' },
    { id: 'var-tf-5', type: 'true-false', question: 'A variance of 0 means all values in the dataset are identical.', isTrue: true, explanation: 'Variance = 0 → all squared deviations = 0 → all values equal the mean → all values are identical. Zero variance = zero spread.' },
    { id: 'var-tf-6', type: 'true-false', question: 'Variance is always expressed in the same units as the original data.', isTrue: false, explanation: 'Variance is in SQUARED units (kg², dollars², seconds²). This is a disadvantage: it makes variance hard to interpret directly. Standard deviation (√variance) is in the original units and is more interpretable.' },
    { id: 'var-tf-7', type: 'true-false', question: 'Squaring the deviations in variance ensures all contributions are positive.', isTrue: true, explanation: 'Without squaring, positive and negative deviations would cancel out (Σ(xᵢ − mean) = 0 always). Squaring eliminates signs so that large deviations in either direction contribute positively to the variance.' },
    { id: 'var-tf-8', type: 'true-false', question: 'The population variance formula divides by n, while the sample variance divides by n − 1.', isTrue: true, explanation: 'σ² = Σ(xᵢ − μ)² / N (population). s² = Σ(xᵢ − x̄)² / (n−1) (sample). The n−1 correction makes the sample variance unbiased.' },
    { id: 'var-tf-9', type: 'true-false', question: 'Adding a constant to every value in a dataset increases its variance.', isTrue: false, explanation: 'Adding a constant shifts all values equally — the deviations from the new mean are identical to the deviations from the old mean. Variance is unchanged. Only multiplying by a constant changes variance.' },
    { id: 'var-tf-10', type: 'true-false', question: 'Multiplying every value by 2 multiplies the variance by 4.', isTrue: true, explanation: 'If you multiply all values by k, the new variance = k² × old variance. With k=2: new variance = 4 × old variance. This is because variance uses squared deviations.' },
    { id: 'var-tf-11', type: 'true-false', question: 'A dataset with values far from the mean has a larger variance than one with values close to the mean.', isTrue: true, explanation: 'Variance measures average squared distance from the mean. Larger distances → larger squared deviations → larger variance. This is the fundamental interpretation.' },
    { id: 'var-tf-12', type: 'true-false', question: 'If two datasets have the same mean, they must have the same variance.', isTrue: false, explanation: 'Same mean does not imply same spread. Dataset A: [5, 5, 5] and Dataset B: [0, 5, 10] both have mean 5 but vastly different variances (0 vs 25).' },
    { id: 'var-tf-13', type: 'true-false', question: 'Variance gives extra weight to values far from the mean because deviations are squared.', isTrue: true, explanation: 'Squaring amplifies larger deviations. A deviation of 10 contributes 100 to the sum; a deviation of 2 contributes only 4. Outliers therefore have a disproportionately large effect on variance.' },
    { id: 'var-tf-14', type: 'true-false', question: 'The standard deviation is the variance divided by n.', isTrue: false, explanation: 'SD = √Variance (square root of variance). Dividing variance by n would give a different (meaningless) quantity. The square root undoes the squaring from the variance formula.' },
    { id: 'var-tf-15', type: 'true-false', question: 'For a dataset [2, 4, 6, 8, 10], the variance would be larger if the values were [1, 4, 6, 8, 11].', isTrue: true, explanation: 'Both datasets have mean 6. In the second dataset, the extreme values (1 and 11) are farther from the mean than 2 and 10, so the squared deviations are larger, resulting in larger variance.' },
    { id: 'var-tf-16', type: 'true-false', question: 'Variance is sensitive to outliers.', isTrue: true, explanation: 'Because variance squares deviations, a value far from the mean contributes a disproportionately large squared deviation. One outlier can substantially inflate the variance.' },
    { id: 'var-tf-17', type: 'true-false', question: 'Population variance uses μ (mu) in its formula, while sample variance uses x̄.', isTrue: true, explanation: 'Population variance: σ² = Σ(xᵢ − μ)² / N. Sample variance: s² = Σ(xᵢ − x̄)² / (n−1). The population mean μ and sample mean x̄ are used in their respective formulas.' },
    { id: 'var-tf-18', type: 'true-false', question: 'If variance = 25, the standard deviation = 5.', isTrue: true, explanation: 'SD = √Variance = √25 = 5. This relationship (SD = √variance, Variance = SD²) is always true.' },
    { id: 'var-tf-19', type: 'true-false', question: 'The sample variance is always smaller than the population variance of the same data.', isTrue: false, explanation: 'Using the same data, s² (divides by n−1) is always LARGER than σ² (divides by n), because n−1 < n. Sample variance with Bessel\'s correction is larger than population variance computed on the same values.' },
    { id: 'var-tf-20', type: 'true-false', question: 'Variance is a better measure for comparison across variables with different units than standard deviation.', isTrue: false, explanation: 'Variance is in squared units (cm², kg²), making cross-variable comparisons even harder. Standard deviation (in original units) is already difficult to compare across different scales. Coefficient of variation (SD/mean) is the proper tool for unit-free comparison.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'var-mc-6', type: 'multiple-choice', question: 'Dataset: 2, 4, 6. The mean is 4. What is the sample variance (s²)?', options: [{ id: 'a', text: '2', isCorrect: false, explanation: 'Deviations: −2, 0, +2. Squared: 4, 0, 4. Sum = 8. s² = 8/(3−1) = 4.' }, { id: 'b', text: '4', isCorrect: true, explanation: 'Deviations from mean 4: (2−4)=−2, (4−4)=0, (6−4)=2. Squared: 4, 0, 4. Sum=8. s²=8/2=4.' }, { id: 'c', text: '8', isCorrect: false, explanation: '8 is the sum of squared deviations, not the variance. Divide by n−1.' }, { id: 'd', text: '3', isCorrect: false, explanation: 'Mean is 4. Check deviations and squares again.' }], explanation: 'Step 1: Mean = 4. Step 2: Deviations: 2−4=−2, 4−4=0, 6−4=2. Step 3: Squared: 4, 0, 4. Step 4: Sum = 8. Step 5: s² = 8/(3−1) = 8/2 = 4.', hint: 'Variance = Σ(x − mean)² / (n−1).' },
    { id: 'var-mc-7', type: 'multiple-choice', question: 'If the variance of a dataset is 16, what is the standard deviation?', options: [{ id: 'a', text: '256', isCorrect: false, explanation: '256 = 16². SD = √Variance, not Variance².' }, { id: 'b', text: '8', isCorrect: false, explanation: '8 = 16/2. SD = √16 = 4.' }, { id: 'c', text: '4', isCorrect: true, explanation: 'SD = √Variance = √16 = 4.' }, { id: 'd', text: '2', isCorrect: false, explanation: '2 = 16/8. SD = √16 = 4.' }], explanation: 'SD = √Variance = √16 = 4. The relationship: SD² = Variance, so SD = √Variance.', hint: 'SD = √Variance.' },
    { id: 'var-mc-8', type: 'multiple-choice', question: 'Why does variance square the deviations from the mean?', options: [{ id: 'a', text: 'To make the formula harder to calculate', isCorrect: false, explanation: 'There is a mathematical reason.' }, { id: 'b', text: 'To eliminate negative signs so deviations do not cancel out', isCorrect: true, explanation: 'Σ(xᵢ − mean) = 0 always. Squaring ensures all contributions are positive.' }, { id: 'c', text: 'To ensure the result is in the same units as the data', isCorrect: false, explanation: 'Squaring actually puts the result in SQUARED units — the opposite.' }, { id: 'd', text: 'Because the formula was developed in the 1800s and has not been updated', isCorrect: false, explanation: 'Squaring has a clear mathematical purpose.' }], explanation: 'If we just summed deviations (xᵢ − mean), positive and negative would cancel → sum = 0. Squaring eliminates signs, ensuring every deviation contributes positively and large deviations receive more weight.', hint: 'What happens to the sum of raw deviations (not squared)?' },
    { id: 'var-mc-9', type: 'multiple-choice', question: 'A dataset has all values equal to 10. What is the variance?', options: [{ id: 'a', text: '10', isCorrect: false, explanation: '10 is the common value, not the variance.' }, { id: 'b', text: '100', isCorrect: false, explanation: '10² = 100. But deviations are all zero when all values equal the mean.' }, { id: 'c', text: '0', isCorrect: true, explanation: 'All values = 10 = mean. Deviations = 0. Squared = 0. Variance = 0.' }, { id: 'd', text: '1', isCorrect: false, explanation: 'With zero variability, variance = 0.' }], explanation: 'Mean = 10. Every deviation = 10 − 10 = 0. Every squared deviation = 0. Sum = 0. Variance = 0/(n−1) = 0. Zero variance = no spread = all values identical.', hint: 'What is the deviation when every value equals the mean?' },
    { id: 'var-mc-10', type: 'multiple-choice', question: 'Which unit would the variance be in if the data is measured in meters?', options: [{ id: 'a', text: 'Meters', isCorrect: false, explanation: 'Variance squares the deviations, so units are also squared.' }, { id: 'b', text: 'Meters²', isCorrect: true, explanation: 'Deviations are in meters; squared deviations are in m²; variance (average squared deviation) is in m².' }, { id: 'c', text: 'No units (dimensionless)', isCorrect: false, explanation: 'Variance has units — squared units of the original data.' }, { id: 'd', text: '1/meters', isCorrect: false, explanation: 'Squaring increases unit power, not decreases it.' }], explanation: 'Original data in meters → deviations in meters → squared deviations in meters² → variance in meters². This squared unit makes variance hard to interpret directly, motivating the use of standard deviation.', hint: 'Squaring meters → what unit?' },
    { id: 'var-mc-11', type: 'multiple-choice', question: 'Two datasets have the same mean but Dataset B has values more spread out. Which has larger variance?', options: [{ id: 'a', text: 'Dataset A (less spread)', isCorrect: false, explanation: 'Less spread → smaller deviations → smaller variance.' }, { id: 'b', text: 'Dataset B (more spread)', isCorrect: true, explanation: 'More spread from the mean → larger deviations → larger squared deviations → larger variance.' }, { id: 'c', text: 'They have equal variance', isCorrect: false, explanation: 'Same mean but different spread means different variance.' }, { id: 'd', text: 'Cannot determine without more information', isCorrect: false, explanation: 'More spread (given the same mean) always means larger variance.' }], explanation: 'Variance measures spread around the mean. Same mean but more spread = larger deviations from the mean = larger squared deviations = larger variance.', hint: 'What does "more spread out" mean in terms of deviations from the mean?' },
    { id: 'var-mc-12', type: 'multiple-choice', question: 'Dataset: 1, 3, 5. Mean = 3. What are the three squared deviations?', options: [{ id: 'a', text: '1, 0, 1', isCorrect: false, explanation: 'Deviations: −2, 0, +2. Squared: 4, 0, 4. Not 1, 0, 1.' }, { id: 'b', text: '4, 0, 4', isCorrect: true, explanation: 'Deviations: 1−3=−2, 3−3=0, 5−3=+2. Squared: 4, 0, 4.' }, { id: 'c', text: '2, 0, 2', isCorrect: false, explanation: 'Those are the deviations, not the squared deviations.' }, { id: 'd', text: '1, 9, 25', isCorrect: false, explanation: 'Those are the values squared, not the squared deviations from the mean.' }], explanation: 'Deviations from mean 3: (1−3)=−2, (3−3)=0, (5−3)=+2. Squared deviations: (−2)²=4, 0²=0, 2²=4. Sample variance = (4+0+4)/(3−1) = 8/2 = 4.', hint: 'Deviation = value − mean. Then square each deviation.' },
    { id: 'var-mc-13', type: 'multiple-choice', question: 'Every value in a dataset is multiplied by 3. The original variance was 10. What is the new variance?', options: [{ id: 'a', text: '30', isCorrect: false, explanation: 'Multiplying by k multiplies variance by k², not k.' }, { id: 'b', text: '90', isCorrect: true, explanation: 'New variance = k² × old variance = 3² × 10 = 9 × 10 = 90.' }, { id: 'c', text: '10', isCorrect: false, explanation: 'Multiplying values changes variance (unlike adding a constant).' }, { id: 'd', text: '100', isCorrect: false, explanation: 'k² × variance = 9 × 10 = 90, not 100.' }], explanation: 'When all values are multiplied by k: new variance = k² × original variance = 3² × 10 = 9 × 10 = 90. This is because variance uses squared deviations, so the k is also squared.', hint: 'Multiplying all values by k multiplies variance by k².' },
    { id: 'var-mc-14', type: 'multiple-choice', question: 'Which is the correct formula for SAMPLE variance?', options: [{ id: 'a', text: 's² = Σ(xᵢ − x̄)² / n', isCorrect: false, explanation: 'Dividing by n gives the population-style formula (biased for samples).' }, { id: 'b', text: 's² = Σ(xᵢ − x̄)² / (n−1)', isCorrect: true, explanation: 'Dividing by (n−1) is Bessel\'s correction for the sample variance.' }, { id: 'c', text: 's² = Σ|xᵢ − x̄| / (n−1)', isCorrect: false, explanation: 'Using absolute values gives mean absolute deviation, not variance.' }, { id: 'd', text: 's² = √[Σ(xᵢ − x̄)² / (n−1)]', isCorrect: false, explanation: 'Taking the square root gives the standard deviation, not variance.' }], explanation: 'Sample variance: s² = Σ(xᵢ − x̄)² / (n−1). Population variance: σ² = Σ(xᵢ − μ)² / N. The (n−1) vs N is the key difference.', hint: 'Sample variance uses (n−1) in the denominator.' },
    { id: 'var-mc-15', type: 'multiple-choice', question: 'The variance of a dataset is 36. If you add 10 to every value, the new variance is:', options: [{ id: 'a', text: '46', isCorrect: false, explanation: 'Adding a constant shifts all values equally. Deviations from the new mean are unchanged.' }, { id: 'b', text: '36', isCorrect: true, explanation: 'Adding a constant does not change the spread. New variance = old variance = 36.' }, { id: 'c', text: '360', isCorrect: false, explanation: 'Multiplying by a constant multiplies variance by k². Adding does not.' }, { id: 'd', text: '26', isCorrect: false, explanation: 'Adding a constant does not reduce variance.' }], explanation: 'Adding a constant c to all values shifts the mean by c but does not change the deviations: (xᵢ + c) − (x̄ + c) = xᵢ − x̄. Squared deviations unchanged → variance unchanged = 36.', hint: 'Does adding a constant change how far values are from the new mean?' },
  ],
  keyTakeaway:
    'Variance measures the average squared deviation from the mean. Use s² = Σ(x − x̄)² / (n−1) for samples and σ² = Σ(x − μ)² / N for populations. Because variance is in squared units, we typically report the standard deviation (√variance) for interpretation.',
  visualization: (data) => <VarianceViz data={data} />,
  datasetGenerator: true,
}

export default function Variance({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
