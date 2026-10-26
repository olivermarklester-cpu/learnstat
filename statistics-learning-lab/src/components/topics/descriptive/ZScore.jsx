import { useMemo, useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { ZScoreChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { mean, stdDevSample, zScore, round } from '../../../utils/stats'

// Fixed dataset
const FIXED = [15, 18, 20, 22, 25]
const fixedMean = mean(FIXED)
const fixedSD = round(stdDevSample(FIXED), 3)
const fixedZ25 = round(zScore(25, fixedMean, fixedSD), 3)
const fixedZ10 = round(zScore(10, fixedMean, fixedSD), 3)

function ZScoreViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 25, min: 5, max: 50, distribution: 'normal' })
  const data = propData ?? ownData
  const liveMean = useMemo(() => (data.length ? round(mean(data), 2) : null), [data])
  const liveSD = useMemo(() => (data.length ? round(stdDevSample(data), 2) : null), [data])

  const [inputVal, setInputVal] = useState('')
  const numInput = parseFloat(inputVal)
  const isValid = isFinite(numInput)

  const liveZ = useMemo(() => {
    if (!isValid || !liveMean || !liveSD || liveSD === 0) return null
    return round(zScore(numInput, liveMean, liveSD), 3)
  }, [numInput, liveMean, liveSD, isValid])

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
          Mean: {liveMean ?? '…'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
          SD: {liveSD ?? '…'}
        </span>
        {liveZ !== null && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            Math.abs(liveZ) > 2 ? 'bg-red-50 text-red-700 border-red-200' : Math.abs(liveZ) > 1 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            z = {liveZ}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 shrink-0">Enter a value (x):</label>
        <input
          type="number"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`e.g. ${liveMean}`}
          className="w-32 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        {liveZ !== null && (
          <span className="text-sm text-gray-600">
            z = ({numInput} − {liveMean}) / {liveSD} = <strong>{liveZ}</strong>
          </span>
        )}
      </div>

      <ZScoreChart
        mean={liveMean ?? 0}
        sd={liveSD ?? 1}
        value={isValid ? numInput : undefined}
        height={220}
      />
      <p className="text-xs text-gray-500">
        Type any value in the input to see its z-score plotted on the number line. The orange marker shows where your value falls relative to the mean.
      </p>
    </div>
  )
}

const content = {
  title: 'Z-score (Standard Score)',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate a z-score and use it to determine how many standard deviations a value is from the mean.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>z-score</strong> (also called a standard score) converts a raw value into a measure of how many standard deviations it is above or below the mean.
      </p>
      <ul className="space-y-2 ml-4">
        <li><strong>z = +2</strong> means the value is 2 standard deviations <em>above</em> the mean</li>
        <li><strong>z = −1.5</strong> means the value is 1.5 standard deviations <em>below</em> the mean</li>
        <li><strong>z = 0</strong> means the value is exactly at the mean</li>
      </ul>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <strong>Direction rule (CRITICAL):</strong>
        <ul className="mt-1 space-y-0.5 ml-3">
          <li>z is <strong>negative</strong> → value is <strong>BELOW</strong> the mean</li>
          <li>z is <strong>positive</strong> → value is <strong>ABOVE</strong> the mean</li>
          <li>z = <strong>0</strong> → value <strong>equals</strong> the mean exactly</li>
        </ul>
      </div>
      <p>
        Z-scores let you compare values from <strong>different datasets</strong>. A test score of 80 might be excellent on one exam (if the mean was 60) but below average on another (if the mean was 90). Z-scores remove this ambiguity.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine two swimming races. In Race A, the winning time is 52 seconds (mean = 60s, SD = 4s). In Race B, the winning time is 105 seconds (mean = 120s, SD = 5s). Who performed better relative to their competitors?
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>Race A: z = (52 − 60) / 4 = <strong>−2.0</strong> (2 standard deviations faster than average)</li>
        <li>Race B: z = (105 − 120) / 5 = <strong>−3.0</strong> (3 standard deviations faster than average)</li>
      </ul>
      <p className="text-sm text-gray-600">Race B's winner performed relatively better — further below the mean in their race.</p>
    </div>
  ),
  formulaLineage: {
    topicId: 'z-score',
    title: 'How Z-Score is built',
    steps: [
      {
        label: 'Substitute Standard Deviation',
        symbolName: 's',
        highlightColor: 'blue',
        from: 'z = (x − x̄) / s',
        to: 'z = (x − x̄) / √[ Σ(x−x̄)²/(n−1) ]',
        note: 'The denominator s is the standard deviation — a measure of typical spread. Dividing by s scales the distance into standard deviation units.',
      },
    ],
    finalFormula: 'z = (x − x̄) / s',
  },
  formula: {
    main: 'z = (x − μ) / σ',
    variants: [
      { label: 'Population z-score', expression: 'z = (x − μ) / σ', latex: 'z = \\frac{x - \\mu}{\\sigma}' },
      { label: 'Sample z-score', expression: 'z = (x − x̄) / s', latex: 'z = \\frac{x - \\bar{x}}{s}' },
    ],
    symbolGuide: [
      { symbol: 'z', meaning: 'The z-score — how many standard deviations x is from the mean' },
      { symbol: 'x', meaning: 'The individual value you are converting to a z-score' },
      { symbol: 'μ (or x̄)', meaning: 'The mean of the dataset' },
      { symbol: 'σ (or s)', meaning: 'The standard deviation of the dataset' },
      { symbol: 'Positive z', meaning: 'Value is above the mean' },
      { symbol: 'Negative z', meaning: 'Value is below the mean' },
    ],
  },
  whenToUse: [
    'When comparing individual values across different datasets or different scales',
    'To identify how unusual a single value is relative to its distribution',
    'As an input to normal distribution probability calculations',
    'When standardizing data before analysis (e.g., before clustering or machine learning)',
  ],
  whenNotToUse: [
    'When the distribution is not roughly normal — z-scores and probability interpretations assume normality',
    'As an outlier detection method in place of the 1.5×IQR rule — they serve different purposes',
    'For nominal or ordinal data — z-scores require interval or ratio level',
  ],
  assumptions: [
    'Z-score calculation works for any numeric data — no normality required',
    'Probability interpretations (e.g., "above a z of 2 is unusual") assume a normal distribution',
    'Use sample SD (s) when computing z-scores for sample data',
    'Z-scores are unitless — they do not have the original measurement\'s units',
  ],
  workedExample: {
    scenario: 'Employee processing times (minutes): 15, 18, 20, 22, 25. Mean = 20, Sample SD ≈ 3.808.',
    dataset: '[15, 18, 20, 22, 25]',
    steps: [
      { stepNumber: 1, label: 'Confirm mean and SD', expression: `Mean = ${fixedMean}, SD = ${fixedSD}`, result: `x̄ = ${fixedMean}, s = ${fixedSD}`, explanation: 'These are calculated from the sample using mean() and stdDevSample().' },
      { stepNumber: 2, label: 'Z-score for x = 25 minutes', expression: `z = (25 − ${fixedMean}) / ${fixedSD} = ${25 - fixedMean} / ${fixedSD} = ${fixedZ25}`, result: `z = ${fixedZ25}`, explanation: `25 minutes is ${fixedZ25} standard deviations ABOVE the mean. Since z is between 1 and 2, this is somewhat above average but not extreme.` },
      { stepNumber: 3, label: 'Z-score for x = 10 minutes', expression: `z = (10 − ${fixedMean}) / ${fixedSD} = ${10 - fixedMean} / ${fixedSD} ≈ ${fixedZ10}`, result: `z = ${fixedZ10}`, explanation: `10 minutes is about ${Math.abs(fixedZ10)} standard deviations BELOW the mean. |z| > 2 means this is unusually fast — worth investigating.` },
      { stepNumber: 4, label: 'Interpret using z-score guidelines', expression: '|z| < 1: typical, 1 ≤ |z| < 2: somewhat unusual, |z| ≥ 2: unusual', result: `x=25 is typical–moderately high; x=10 is unusual`, explanation: 'These are informal guidelines, not hard rules. In context, "unusual" means worth noticing, not necessarily an error.' },
    ],
    interpretation: `Processing time of 25 min (z ≈ ${fixedZ25}) is moderately above average — not a concern. Processing time of 10 min (z ≈ ${fixedZ10}) is unusually fast — this employee is more than 2 SDs below average and merits recognition or investigation for accuracy.`,
  },
  interpretation: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Z-scores give context to raw numbers. A score of 78 on a test could mean very different things depending on the mean and SD. The z-score cuts through this ambiguity with a single relative number.
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>|z| &lt; 1:</strong> Within 1 SD of mean — typical for that dataset</li>
        <li><strong>1 ≤ |z| &lt; 2:</strong> Somewhat unusual — worth noting</li>
        <li><strong>|z| ≥ 2:</strong> Unusual (about 5% of data is beyond ±2 SD for normal distributions)</li>
        <li><strong>|z| ≥ 3:</strong> Very unusual (about 0.3% beyond ±3 SD)</li>
      </ul>
    </div>
  ),
  commonMistakes: [
    { mistake: 'Dropping the sign of the z-score', explanation: 'A z-score of −2 and +2 are very different. −2 means the value is 2 SDs BELOW average; +2 means 2 SDs ABOVE. Always keep the sign and interpret it.' },
    { mistake: 'Using population SD when you have sample data', explanation: 'The sample SD (divides by n−1) will give a slightly larger SD than the population SD, resulting in slightly smaller z-scores in absolute value. Use the correct formula for your context.' },
    { mistake: 'Thinking all z-scores beyond ±2 are "outliers"', explanation: 'The |z| > 2 threshold is an informal flag for unusualness, not a formal outlier definition. The 1.5×IQR rule is the standard outlier detection method.' },
    { mistake: 'Calculating z from unsorted data and expecting a normal distribution', explanation: 'Z-scores can be calculated for any numeric data — but probability interpretations (like "5% of values beyond ±2 SD") only apply when the data is roughly normally distributed.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'z-easy-1',
        scenario: 'Mean = 50, SD = 10. Calculate the z-score for x = 65.',
        question: 'What is the z-score? Is this value above or below the mean?',
        hint: 'z = (x − mean) / SD. Check the sign.',
        solution: 'z = (65 − 50) / 10 = 15 / 10 = 1.5. Positive → above the mean. This value is 1.5 standard deviations above average.',
      },
      {
        id: 'z-easy-2',
        scenario: 'Mean = 100, SD = 15. z-score = −2.',
        question: 'What is the raw value (x)?',
        hint: 'Rearrange z = (x − mean) / SD to solve for x.',
        solution: 'x = mean + z × SD = 100 + (−2)(15) = 100 − 30 = 70.',
      },
    ],
    moderate: [
      {
        id: 'z-mod-1',
        scenario: 'Class A exam: mean = 75, SD = 5. Student scored 85. Class B exam: mean = 60, SD = 10. Student scored 80. Both students want to claim they performed "better relative to their class."',
        question: 'Calculate both z-scores. Who actually performed better relative to their class?',
        hint: 'Higher z-score = further above the class average.',
        solution: 'Class A: z = (85 − 75) / 5 = 10/5 = 2.0. Class B: z = (80 − 60) / 10 = 20/10 = 2.0. Both students are exactly 2 standard deviations above their class mean — tied for relative performance! The raw scores (85 vs. 80) are misleading because the exams had different means and SDs.',
      },
      {
        id: 'z-mod-2',
        scenario: 'A hospital tracks patients\' blood pressure (mmHg): mean = 120, SD = 10. Patient A: 145 mmHg. Patient B: 95 mmHg.',
        question: 'Calculate z-scores for both patients. Who is more unusual, and in which direction?',
        hint: 'z = (x − mean) / SD for each patient.',
        solution: 'Patient A: z = (145 − 120) / 10 = 25/10 = +2.5 (unusually HIGH blood pressure). Patient B: z = (95 − 120) / 10 = −25/10 = −2.5 (unusually LOW blood pressure). Both are equally unusual in terms of distance from the mean (|z| = 2.5), but in opposite directions.',
      },
    ],
    challenging: [
      {
        id: 'z-chal-1',
        scenario: 'A manufacturing process produces items with mean weight = 500g and SD = 8g. Quality control accepts items where z falls between −1.5 and +1.5.',
        question: 'What is the acceptable weight range? If an item weighs 482g, is it accepted or rejected?',
        hint: 'Convert z limits to x values using x = mean + z × SD.',
        solution: 'Lower limit: x = 500 + (−1.5)(8) = 500 − 12 = 488g. Upper limit: x = 500 + (1.5)(8) = 512g. Accepted range: 488g to 512g. Item weighing 482g: z = (482 − 500) / 8 = −18/8 = −2.25. Since −2.25 < −1.5, this item is REJECTED.',
      },
      {
        id: 'z-chal-2',
        scenario: 'Exam scores are normally distributed: mean = 72, SD = 9. You need to find the score at the 84th percentile (approximately z = +1.0) and the score at the 16th percentile (approximately z = −1.0).',
        question: 'Calculate both cutoff scores. What percentage of students scored between them?',
        hint: 'x = mean + z × SD. Between z = −1 and z = +1 contains approximately what percentage?',
        solution: '84th percentile (z=+1): x = 72 + 1(9) = 81. 16th percentile (z=−1): x = 72 − 1(9) = 63. Between 63 and 81 = between z = −1 and z = +1 = approximately 68% of students (Empirical Rule).',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'z-kc-1',
      type: 'multiple-choice',
      question: 'A z-score of −2.5 means:',
      options: [
        { id: 'a', text: 'The value is 2.5 above the mean', isCorrect: false, explanation: 'Negative z means BELOW the mean.' },
        { id: 'b', text: 'The value is 2.5 standard deviations below the mean', isCorrect: true, explanation: 'Correct! Negative sign = below mean; magnitude 2.5 = 2.5 standard deviations away.' },
        { id: 'c', text: 'The value equals the mean minus 2.5', isCorrect: false, explanation: 'That would only be true if SD = 1. z = (x − mean) / SD.' },
        { id: 'd', text: 'The value is in the bottom 2.5% of the distribution', isCorrect: false, explanation: 'z = −2.5 is near the bottom (about 0.6%), but the exact percentage depends on the distribution shape.' },
      ],
      explanation: 'A negative z-score means the value is below the mean. The magnitude (2.5) tells you how many standard deviations below. So z = −2.5 means the value is 2.5 SDs below average.',
      hint: 'What does the sign of a z-score tell you?',
    },
    {
      id: 'z-kc-2',
      type: 'numerical',
      question: 'Mean = 40, SD = 5. What is the z-score for x = 50?',
      answer: 2,
      tolerance: 0.01,
      explanation: 'z = (50 − 40) / 5 = 10 / 5 = 2.0.',
      hint: 'z = (x − mean) / SD',
    },
    {
      id: 'z-kc-3',
      type: 'multiple-choice',
      question: 'What is the z-score when a value exactly equals the mean?',
      options: [
        { id: 'a', text: '1', isCorrect: false, explanation: 'z = 1 means one SD above the mean.' },
        { id: 'b', text: '0.5', isCorrect: false, explanation: 'z = 0.5 means half a SD above the mean.' },
        { id: 'c', text: '0', isCorrect: true, explanation: 'Correct! z = (mean − mean) / SD = 0 / SD = 0.' },
        { id: 'd', text: 'Undefined', isCorrect: false, explanation: 'z is well-defined — it equals 0.' },
      ],
      explanation: 'z = (x − mean) / SD. When x = mean, the numerator is 0, so z = 0.',
      hint: 'What is mean − mean?',
    },
    {
      id: 'z-kc-4',
      type: 'multiple-choice',
      question: 'Why are z-scores useful for comparing values from different datasets?',
      options: [
        { id: 'a', text: 'They convert all datasets to the same scale (0 to 100)', isCorrect: false, explanation: 'Z-scores are not bounded by 0 and 100 — they can be any real number.' },
        { id: 'b', text: 'They remove the effect of units and scale by expressing each value relative to its own mean and SD', isCorrect: true, explanation: 'Correct! A score of 80 means different things on different exams. Z-score says how many SDs from the mean — comparable across any dataset.' },
        { id: 'c', text: 'They always make the distribution normal', isCorrect: false, explanation: 'Z-scores do not change the shape of the distribution, only the scale.' },
        { id: 'd', text: 'They eliminate outliers', isCorrect: false, explanation: 'Z-scores do not remove outliers — they may highlight them.' },
      ],
      explanation: 'Z-scores standardize values to a common scale (mean=0, SD=1). This allows comparison across different distributions regardless of original units or scale.',
      hint: 'Think about comparing a score on a 100-point exam vs. a score on a 50-point quiz.',
    },
    {
      id: 'z-kc-5',
      type: 'multiple-choice',
      question: 'Mean = 70, SD = 8. What raw value corresponds to z = −1?',
      options: [
        { id: 'a', text: '62', isCorrect: true, explanation: 'Correct! x = 70 + (−1)(8) = 70 − 8 = 62.' },
        { id: 'b', text: '78', isCorrect: false, explanation: '78 = 70 + 1(8) — that is z = +1, not −1.' },
        { id: 'c', text: '71', isCorrect: false, explanation: 'Check: (71 − 70)/8 = 0.125 ≠ −1.' },
        { id: 'd', text: '61', isCorrect: false, explanation: 'Close — but check: x = mean + z × SD = 70 + (−1)(8) = 62.' },
      ],
      explanation: 'Rearranging z = (x − mean) / SD: x = mean + z × SD = 70 + (−1)(8) = 62.',
      hint: 'Rearrange the formula: x = mean + z × SD.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'zsc-tf-1', type: 'true-false', question: 'A z-score of 0 means the value equals the mean.', isTrue: true, explanation: 'Z = (x − mean) / SD = 0 only when x = mean. A z-score of 0 indicates the value is exactly average.' },
    { id: 'zsc-tf-2', type: 'true-false', question: 'A negative z-score means the value is above the mean.', isTrue: false, explanation: 'Z = (x − mean) / SD. A negative z-score means x < mean, so the value is BELOW the mean. A positive z-score means x > mean.' },
    { id: 'zsc-tf-3', type: 'true-false', question: 'Z-scores allow comparison of values from different distributions.', isTrue: true, explanation: 'By converting to a common scale (standard deviations from the mean), z-scores make it possible to compare a score on a height scale with a score on a weight scale, for example.' },
    { id: 'zsc-tf-4', type: 'true-false', question: 'Z-scores can only be computed for normally distributed data.', isTrue: false, explanation: 'Z-scores can be computed for any numerical data: Z = (x − mean) / SD. However, the probability interpretations (percentile ranks using the normal table) only apply when the data is normally distributed.' },
    { id: 'zsc-tf-5', type: 'true-false', question: 'After standardization, a dataset always has mean = 0 and SD = 1.', isTrue: true, explanation: 'Standardization (converting all values to z-scores) produces a dataset with mean = 0 and SD = 1. This is also called creating z-scores or "standard scores".' },
    { id: 'zsc-tf-6', type: 'true-false', question: 'A z-score of +2.5 is more extreme than a z-score of +1.5.', isTrue: true, explanation: 'The absolute value of the z-score indicates how far the value is from the mean. |+2.5| > |+1.5|, so z=2.5 is farther from the mean, making it more extreme.' },
    { id: 'zsc-tf-7', type: 'true-false', question: 'The z-score formula is z = (x − mean) / SD.', isTrue: true, explanation: 'This is the definition of the z-score: subtract the mean (to center the value around 0) and divide by SD (to scale by the typical spread).' },
    { id: 'zsc-tf-8', type: 'true-false', question: 'For a normal distribution, a z-score of ±3 is considered an outlier.', isTrue: true, explanation: 'By the 68-95-99.7 rule, only 0.3% of values fall beyond ±3 SD. Values with |Z| > 3 are in the extreme tails — commonly classified as potential outliers.' },
    { id: 'zsc-tf-9', type: 'true-false', question: 'Z-scores preserve the shape of the original distribution.', isTrue: true, explanation: 'Standardization (computing z-scores) is a linear transformation. Linear transformations do not change the shape of a distribution — only its location (mean) and scale (SD).' },
    { id: 'zsc-tf-10', type: 'true-false', question: 'A z-score tells you the raw value of the observation.', isTrue: false, explanation: 'A z-score tells you the STANDARDIZED value — how many SDs the observation is from the mean. To recover the raw value: x = mean + z × SD.' },
    { id: 'zsc-tf-11', type: 'true-false', question: 'A student with z = +1.5 performed better than a student with z = +0.8, regardless of which tests they took.', isTrue: true, explanation: 'Z-scores allow fair comparison across different tests. Z = +1.5 means 1.5 SDs above their group mean, which is a relatively better performance than z = +0.8 (0.8 SDs above mean).' },
    { id: 'zsc-tf-12', type: 'true-false', question: 'Computing z-scores changes the mean and standard deviation but not the relative position of values.', isTrue: true, explanation: 'Standardization sets mean = 0 and SD = 1, but preserves relative rankings and distances. A value at the 75th percentile stays at the 75th percentile after z-scoring.' },
    { id: 'zsc-tf-13', type: 'true-false', question: 'If z = 2 and mean = 50, then the original value was 2.', isTrue: false, explanation: 'You cannot determine the original value from z and mean alone — you also need SD. x = mean + z × SD. Without SD, x cannot be calculated.' },
    { id: 'zsc-tf-14', type: 'true-false', question: 'Z-scores are dimensionless (have no units).', isTrue: true, explanation: 'Z = (x − mean) / SD. The units of x, mean, and SD are all the same, so they cancel: units / units = dimensionless. This is what allows z-scores to compare variables measured in different units.' },
    { id: 'zsc-tf-15', type: 'true-false', question: 'The sum of all z-scores in a standardized dataset equals n (the number of observations).', isTrue: false, explanation: 'After standardization, mean = 0. Sum of z-scores = n × mean = n × 0 = 0. The sum of all z-scores equals 0, not n.' },
    { id: 'zsc-tf-16', type: 'true-false', question: 'A z-score can be used to find percentile ranks using the standard normal distribution table.', isTrue: true, explanation: 'For normally distributed data, a z-score maps directly to a probability (area under the normal curve), which is the percentile rank. Z-tables give P(Z ≤ z) for any z.' },
    { id: 'zsc-tf-17', type: 'true-false', question: 'In two different normal distributions, z = +1.5 always corresponds to the same percentile rank.', isTrue: true, explanation: 'Z-scores represent positions on the standard normal curve. Z = +1.5 always falls at approximately the 93rd percentile, regardless of the original distribution\'s mean or SD.' },
    { id: 'zsc-tf-18', type: 'true-false', question: 'If a student\'s exam score is 2 standard deviations below the class mean, their z-score is −2.', isTrue: true, explanation: '2 standard deviations below = z = −2. "Below" means negative z-score; "above" means positive z-score.' },
    { id: 'zsc-tf-19', type: 'true-false', question: 'Z-score standardization is only useful in normally distributed data for percentile lookups, but the formula applies to any distribution.', isTrue: true, explanation: 'The formula Z = (x−mean)/SD works for any numerical data. However, using z-tables to find probabilities/percentiles is only valid for normal distributions.' },
    { id: 'zsc-tf-20', type: 'true-false', question: 'A z-score of −2.8 represents a more extreme departure from the mean than a z-score of +2.3.', isTrue: true, explanation: '|−2.8| = 2.8 > |+2.3| = 2.3. The absolute value of the z-score measures extremity. −2.8 is farther from the mean (0) than +2.3.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'zsc-mc-6', type: 'multiple-choice', question: 'A student scores 80 on a test with mean = 70 and SD = 10. What is their z-score?', options: [{ id: 'a', text: '0.8', isCorrect: false, explanation: 'Z = (80−70)/10 = 10/10 = 1.0.' }, { id: 'b', text: '1.0', isCorrect: true, explanation: 'Z = (x − mean) / SD = (80 − 70) / 10 = 1.0.' }, { id: 'c', text: '−1.0', isCorrect: false, explanation: 'Negative z would mean below the mean. 80 > 70.' }, { id: 'd', text: '10', isCorrect: false, explanation: '10 is the raw deviation, not the z-score. Divide by SD.' }], explanation: 'Z = (x − mean) / SD = (80 − 70) / 10 = 10/10 = 1.0. The student is 1 standard deviation above the mean.', hint: 'Z = (value − mean) / SD.' },
    { id: 'zsc-mc-7', type: 'multiple-choice', question: 'A value has z = −1.5 with mean = 100 and SD = 20. What is the original value?', options: [{ id: 'a', text: '70', isCorrect: true, explanation: 'x = mean + z × SD = 100 + (−1.5)(20) = 100 − 30 = 70.' }, { id: 'b', text: '130', isCorrect: false, explanation: 'That would be z = +1.5: 100 + 1.5(20) = 130.' }, { id: 'c', text: '80', isCorrect: false, explanation: '80 = 100 − 20 = mean − 1 SD. z = −1.0, not −1.5.' }, { id: 'd', text: '85', isCorrect: false, explanation: '85 = 100 − 15, which would require z = −0.75.' }], explanation: 'Rearrange z formula: x = mean + z × SD = 100 + (−1.5)(20) = 100 − 30 = 70.', hint: 'x = mean + z × SD.' },
    { id: 'zsc-mc-8', type: 'multiple-choice', question: 'Student A scored z = +2.1 in Math. Student B scored z = +1.4 in Science. Which student performed better relative to their classmates?', options: [{ id: 'a', text: 'Student B — Science is a harder subject', isCorrect: false, explanation: 'Z-scores already account for the difficulty (mean and SD) of each test.' }, { id: 'b', text: 'Student A — z = 2.1 means they are farther above their group mean', isCorrect: true, explanation: 'Z-scores are standardized. A higher z = better performance relative to peers, regardless of subject.' }, { id: 'c', text: 'Cannot be compared — different subjects', isCorrect: false, explanation: 'Z-scores are specifically designed to enable cross-subject comparison.' }, { id: 'd', text: 'Student B — 1.4 is closer to the typical performance', isCorrect: false, explanation: 'Closer to average is not better performance — higher z means relatively better.' }], explanation: 'Z-scores convert raw scores to a common scale. A z = +2.1 means Student A is 2.1 SDs above the Math class average. A z = +1.4 means Student B is 1.4 SDs above the Science average. Student A\'s relative performance is better.', hint: 'Higher z-score = farther above the group mean = better relative performance.' },
    { id: 'zsc-mc-9', type: 'multiple-choice', question: 'For a normal distribution, approximately what percentage of values have z-scores between −1 and +1?', options: [{ id: 'a', text: '50%', isCorrect: false, explanation: '50% falls between −0 and +∞ (half the distribution).' }, { id: 'b', text: '68%', isCorrect: true, explanation: 'By the empirical rule, ±1 SD captures ~68% of a normal distribution.' }, { id: 'c', text: '95%', isCorrect: false, explanation: '95% falls between z = −2 and z = +2.' }, { id: 'd', text: '99.7%', isCorrect: false, explanation: '99.7% falls between z = −3 and z = +3.' }], explanation: 'The 68-95-99.7 rule: ±1 SD (z = ±1) captures ~68% of a normal distribution.', hint: '68-95-99.7 rule: ±1 SD = 68%.' },
    { id: 'zsc-mc-10', type: 'multiple-choice', question: 'In a standardized dataset (z-scores), what is the mean?', options: [{ id: 'a', text: '1', isCorrect: false, explanation: 'After standardization, mean = 0.' }, { id: 'b', text: '0', isCorrect: true, explanation: 'Standardization: x_new = (x − mean) / SD. The mean of z-scores is always 0.' }, { id: 'c', text: 'The original mean', isCorrect: false, explanation: 'Standardization changes the mean to 0.' }, { id: 'd', text: 'It depends on the data', isCorrect: false, explanation: 'The mean is always 0 after z-score standardization.' }], explanation: 'Z-score transformation: z = (x − x̄) / s. The resulting distribution always has mean = 0 (since we subtracted the mean) and SD = 1 (since we divided by SD).', hint: 'Standardization shifts the mean to 0.' },
    { id: 'zsc-mc-11', type: 'multiple-choice', question: 'A value has z = +3.5. What is the most likely conclusion?', options: [{ id: 'a', text: 'The value is below average', isCorrect: false, explanation: 'Positive z means above the mean.' }, { id: 'b', text: 'The value is a potential outlier', isCorrect: true, explanation: '|Z| > 3 is typically considered extreme. Z = 3.5 is in the tail beyond 99.7% of a normal distribution.' }, { id: 'c', text: 'The value is exactly at the 35th percentile', isCorrect: false, explanation: 'Z = +3.5 is far above the mean, not at the 35th percentile.' }, { id: 'd', text: 'The value is 3.5 units above the mean', isCorrect: false, explanation: 'Z = 3.5 means 3.5 SDs above the mean, not 3.5 units.' }], explanation: 'Z = +3.5 means the value is 3.5 standard deviations above the mean. Only about 0.02% of a normal distribution falls this far out. This is a potential outlier.', hint: 'What does |Z| > 3 typically indicate?' },
    { id: 'zsc-mc-12', type: 'multiple-choice', question: 'What does it mean to "standardize" a variable?', options: [{ id: 'a', text: 'Multiply every value by a constant', isCorrect: false, explanation: 'Standardization involves both subtracting the mean and dividing by SD.' }, { id: 'b', text: 'Subtract the minimum from every value', isCorrect: false, explanation: 'That is min-max normalization, not standardization.' }, { id: 'c', text: 'Transform each value to (value − mean) / SD so the result has mean=0 and SD=1', isCorrect: true, explanation: 'Standardization = z-scoring: center at 0 and scale to 1 SD.' }, { id: 'd', text: 'Convert values to percentile ranks', isCorrect: false, explanation: 'Percentile rank conversion is different from standardization.' }], explanation: 'Standardization = computing z-scores for all values. Each raw value is replaced by (x − mean) / SD, producing a new variable with mean = 0 and SD = 1.', hint: 'Standardization subtracts the mean and divides by SD.' },
    { id: 'zsc-mc-13', type: 'multiple-choice', question: 'A test has mean = 60 and SD = 12. What score has a z-score of +1.5?', options: [{ id: 'a', text: '72', isCorrect: false, explanation: '72 = 60 + 12 = mean + 1 SD. z=1.0, not 1.5.' }, { id: 'b', text: '78', isCorrect: true, explanation: 'x = mean + z×SD = 60 + 1.5×12 = 60 + 18 = 78.' }, { id: 'c', text: '75', isCorrect: false, explanation: '75 = 60 + 15. That requires z = 15/12 = 1.25, not 1.5.' }, { id: 'd', text: '81', isCorrect: false, explanation: '81 would need z = (81−60)/12 = 21/12 = 1.75.' }], explanation: 'x = mean + z × SD = 60 + 1.5 × 12 = 60 + 18 = 78.', hint: 'x = mean + z × SD.' },
    { id: 'zsc-mc-14', type: 'multiple-choice', question: 'Which of the following z-scores indicates the value farthest below the mean?', options: [{ id: 'a', text: '+0.5', isCorrect: false, explanation: 'Positive means above the mean.' }, { id: 'b', text: '−0.3', isCorrect: false, explanation: '−0.3 is below the mean, but only slightly.' }, { id: 'c', text: '−2.8', isCorrect: true, explanation: '|−2.8| = 2.8, the largest absolute negative value. Most below the mean.' }, { id: 'd', text: '+1.9', isCorrect: false, explanation: 'Positive means above the mean.' }], explanation: 'The most negative z-score corresponds to the value farthest BELOW the mean. −2.8 has the largest absolute value among the negative options: 2.8 SD below the mean.', hint: 'Most below the mean = most negative z-score = largest absolute negative value.' },
    { id: 'zsc-mc-15', type: 'multiple-choice', question: 'Why are z-scores particularly useful in comparing scores on two different standardized tests?', options: [{ id: 'a', text: 'They adjust for different numbers of questions', isCorrect: false, explanation: 'Z-scores adjust for scale and spread, not number of questions.' }, { id: 'b', text: 'They convert scores to a common scale (SDs from mean), removing units and scale differences', isCorrect: true, explanation: 'By measuring both scores in units of SD from their respective means, z-scores enable direct comparison.' }, { id: 'c', text: 'They ensure both tests have the same maximum score', isCorrect: false, explanation: 'Z-scores do not change the maximum; they standardize.' }, { id: 'd', text: 'They increase scores to make the comparison fairer', isCorrect: false, explanation: 'Z-scores transform to a common scale, not inflate scores.' }], explanation: 'Different tests have different means, SDs, and scales. Z-scores express each score as "how many standard deviations above/below average" — a common, unit-free measure that makes cross-test comparison valid.', hint: 'What makes z-scores unit-free and scale-free?' },
  ],
  keyTakeaway:
    'A z-score tells you how many standard deviations a value is from the mean. z = (x − mean) / SD. Negative = below mean; positive = above mean; z = 0 means exactly average. Z-scores enable fair comparisons across different datasets and scales.',
  visualization: (data) => <ZScoreViz data={data} />,
  datasetGenerator: true,
}

export default function ZScore({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
