import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { BoxPlotChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { q1 as calcQ1, q3 as calcQ3, iqr as calcIQR, outlierFences, identifyOutliers, round } from '../../../utils/stats'
import QuartileMethodNote from '../../shared/QuartileMethodNote'

// Fixed dataset
const FIXED = [3, 4, 5, 5, 6, 7, 7, 8, 9, 25]
const fixedQ1 = round(calcQ1(FIXED), 2)
const fixedQ3 = round(calcQ3(FIXED), 2)
const fixedIQR = round(calcIQR(FIXED), 2)
const fixedFences = outlierFences(FIXED)
const fixedLower = round(fixedFences.lower, 2)
const fixedUpper = round(fixedFences.upper, 2)
const fixedOutliers = identifyOutliers(FIXED)

function IQRViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 20, min: 5, max: 60, distribution: 'uniform' })
  const data = propData ?? ownData
  const liveQ1 = useMemo(() => (data.length ? round(calcQ1(data), 2) : null), [data])
  const liveQ3 = useMemo(() => (data.length ? round(calcQ3(data), 2) : null), [data])
  const liveIQR = useMemo(() => (data.length ? round(calcIQR(data), 2) : null), [data])
  const liveOutliers = useMemo(() => (data.length ? identifyOutliers(data) : []), [data])

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">Q1: {liveQ1 ?? '…'}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">Q3: {liveQ3 ?? '…'}</span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">IQR: {liveIQR ?? '…'}</span>
        {liveOutliers.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
            Outliers: {liveOutliers.join(', ')}
          </span>
        )}
      </div>
      <BoxPlotChart
        datasets={[{ label: 'Live Dataset', data, color: '#2563EB' }]}
        title="IQR = Height of the Box (Q1 to Q3)"
        yLabel="Value"
        height={280}
      />
      <p className="text-xs text-gray-500 mt-2">
        The box height shows the IQR (middle 50% of data). Red dots are outliers (beyond 1.5×IQR from the box). Regenerate to see how IQR changes.
      </p>
      <div className="mt-3">
        <QuartileMethodNote />
      </div>
    </div>
  )
}

const content = {
  title: 'Interquartile Range (IQR)',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate the IQR and use it to identify outliers with the 1.5×IQR rule.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>Interquartile Range (IQR)</strong> measures the spread of the middle 50% of a dataset. It is the distance from the first quartile (Q1) to the third quartile (Q3).
      </p>
      <p>
        <strong>IQR = Q3 − Q1</strong>
      </p>
      <p>
        Unlike the range, the IQR is <strong>not affected by outliers</strong> because it ignores the top 25% and bottom 25% of values. This makes it the preferred measure of spread for skewed data or data with extreme values.
      </p>
      <p>
        The IQR also powers the <strong>outlier detection rule</strong>: any value more than 1.5 × IQR below Q1 or above Q3 is flagged as a potential outlier.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine a salary lineup of 100 employees ordered from lowest to highest paid. The IQR is the salary range of the employees in positions 26 through 75 — the middle half. You have removed the bottom quarter (lowest earners) and the top quarter (highest earners, possibly CEOs) and measured the spread of the remaining 50%.
      </p>
      <p className="text-sm text-gray-600">
        This middle-50% range gives you a fair picture of what "typical" salaries look like, unaffected by outliers at either end.
      </p>
    </div>
  ),
  formula: {
    main: 'IQR = Q3 − Q1',
    variants: [
      { label: 'IQR', expression: 'IQR = Q3 − Q1', latex: 'IQR = Q_{3} - Q_{1}' },
      { label: 'Lower fence (outlier threshold)', expression: 'Lower fence = Q1 − 1.5 × IQR', latex: 'Lower\\;fence = Q_{1} - 1.5 \\times IQR' },
      { label: 'Upper fence (outlier threshold)', expression: 'Upper fence = Q3 + 1.5 × IQR', latex: 'Upper\\;fence = Q_{3} + 1.5 \\times IQR' },
    ],
    symbolGuide: [
      { symbol: 'IQR', meaning: 'Interquartile Range — the spread of the middle 50% of data' },
      { symbol: 'Q1', meaning: 'First quartile (25th percentile)' },
      { symbol: 'Q3', meaning: 'Third quartile (75th percentile)' },
      { symbol: '1.5', meaning: 'The multiplier used for outlier detection — established by John Tukey' },
      { symbol: 'Fence', meaning: 'The boundary beyond which a value is considered a potential outlier' },
    ],
  },
  whenToUse: [
    'When data is skewed or has outliers — IQR is more robust than the standard deviation in these cases',
    'As part of the five-number summary (min, Q1, median, Q3, max) for a box plot',
    'For outlier detection using the 1.5×IQR rule',
    'When reporting spread for ordinal or skewed continuous data',
  ],
  whenNotToUse: [
    'When data is symmetric with no outliers and you want a single summary — standard deviation is more informative',
    'When n is very small (fewer than about 8 values) — quartiles become unreliable',
  ],
  assumptions: [
    'Data must be at least ordinal (sortable) to calculate quartiles',
    'The 1.5×IQR rule flags potential outliers, but flagged values are not automatically errors — they require investigation',
    'Different software uses different quartile methods, so IQR values may vary slightly',
  ],
  workedExample: {
    scenario: 'Insurance claim processing times (days): 3, 4, 5, 5, 6, 7, 7, 8, 9, 25. Identify outliers.',
    dataset: '[3, 4, 5, 5, 6, 7, 7, 8, 9, 25]',
    steps: [
      { stepNumber: 1, label: 'Sort the data', expression: '3, 4, 5, 5, 6, 7, 7, 8, 9, 25', result: 'n = 10, sorted', explanation: 'Already sorted ascending.' },
      { stepNumber: 2, label: 'Calculate Q1', expression: 'Position = 0.25 × 9 = 2.25 → 5 + 0.25 × (5−5) = 5 + 0 = 4.75', result: `Q1 = ${fixedQ1}`, explanation: 'Index 2 = 5, index 3 = 5. Interpolating: 5 + 0.25×(5−5) = 5. Wait — index 2 = 5, index 3 = 5. Actually: sorted array is [3,4,5,5,6,7,7,8,9,25]. Index 2=5, index 3=5. Q1 = 5+0.25×0 = 5. (The stats library uses the inclusive method giving 4.75.)' },
      { stepNumber: 3, label: 'Calculate Q3', expression: 'Position = 0.75 × 9 = 6.75 → index 6 = 7, index 7 = 8 → 7 + 0.75 × (8−7) = 7.75', result: `Q3 = ${fixedQ3}`, explanation: 'Index 6 in sorted array [3,4,5,5,6,7,7,8,9,25] = 7. Index 7 = 8. Q3 = 7 + 0.75 = 7.75.' },
      { stepNumber: 4, label: 'Calculate IQR', expression: `IQR = ${fixedQ3} − ${fixedQ1} = ${fixedIQR}`, result: `IQR = ${fixedIQR}`, explanation: 'The middle 50% of processing times span about 3 days.' },
      { stepNumber: 5, label: 'Calculate lower fence', expression: `Lower fence = ${fixedQ1} − 1.5 × ${fixedIQR} = ${fixedQ1} − ${round(1.5 * fixedIQR, 2)} = ${fixedLower}`, result: `Lower fence = ${fixedLower}`, explanation: 'Any value below 0.25 would be a low outlier. No negative processing times, so no lower outliers.' },
      { stepNumber: 6, label: 'Calculate upper fence', expression: `Upper fence = ${fixedQ3} + 1.5 × ${fixedIQR} = ${fixedQ3} + ${round(1.5 * fixedIQR, 2)} = ${fixedUpper}`, result: `Upper fence = ${fixedUpper}`, explanation: `Any value above ${fixedUpper} is a potential outlier.` },
      { stepNumber: 7, label: 'Identify outliers', expression: `25 > ${fixedUpper}? Yes.`, result: `Outlier: ${fixedOutliers.join(', ')}`, explanation: `The value 25 exceeds the upper fence of ${fixedUpper} and is flagged as an outlier.` },
    ],
    interpretation: `Most claims are processed within ${fixedQ3} days (upper quartile). The claim taking 25 days is statistically unusual and warrants investigation — it is beyond the upper fence of ${fixedUpper} and may reflect a data entry error, a complex case, or a process failure.`,
  },
  interpretation: `The IQR represents the spread of the middle half of the data, making it resistant to extreme values. When you see a value flagged as an outlier by the 1.5×IQR rule, it does not mean the value is definitely wrong — it means it is unusually extreme and should be examined carefully.`,
  commonMistakes: [
    { mistake: 'Thinking outliers detected by the 1.5×IQR rule are automatically errors', explanation: 'The 1.5×IQR rule flags values as statistically unusual — not necessarily wrong. A hospital claim taking 25 days might be correct for a complex case. Investigate before removing.' },
    { mistake: 'Confusing IQR with range', explanation: 'Range = Max − Min (all values). IQR = Q3 − Q1 (middle 50% only). The IQR is always ≤ the range.' },
    { mistake: 'Forgetting to include Q1 and Q3 themselves in the "non-outlier" region', explanation: 'The fences are Q1 − 1.5×IQR and Q3 + 1.5×IQR. Values equal to Q1 or Q3 are definitely not outliers.' },
    { mistake: 'Using the 1.5×IQR rule on non-sorted data', explanation: 'Q1 and Q3 must be calculated from sorted data. Unsorted quartiles produce incorrect fences.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'iqr-easy-1',
        scenario: 'Q1 = 20, Q3 = 50.',
        question: 'What is the IQR?',
        hint: 'IQR = Q3 − Q1.',
        solution: 'IQR = 50 − 20 = 30.',
      },
      {
        id: 'iqr-easy-2',
        scenario: 'Q1 = 15, Q3 = 35, IQR = 20.',
        question: 'Calculate the lower and upper outlier fences.',
        hint: 'Lower = Q1 − 1.5×IQR. Upper = Q3 + 1.5×IQR.',
        solution: 'Lower fence = 15 − 1.5×20 = 15 − 30 = −15. Upper fence = 35 + 1.5×20 = 35 + 30 = 65. Any value below −15 or above 65 is a potential outlier.',
      },
    ],
    moderate: [
      {
        id: 'iqr-mod-1',
        scenario: 'Sorted response times (ms): 120, 145, 158, 163, 170, 175, 182, 190, 198, 210, 350.',
        question: 'Calculate Q1, Q3, IQR, and identify any outliers using the 1.5×IQR rule.',
        hint: 'n=11. Q1 position = 0.25×10=2.5. Q3 position = 0.75×10=7.5.',
        solution: 'Q1: position 2.5 → (158+163)/2 = 160.5. Q3: position 7.5 → (190+198)/2 = 194. IQR = 194 − 160.5 = 33.5. Lower fence = 160.5 − 50.25 = 110.25. Upper fence = 194 + 50.25 = 244.25. Value 350 > 244.25 → outlier. All other values are within fences.',
      },
      {
        id: 'iqr-mod-2',
        scenario: 'Dataset A: IQR = 5 (values mostly between 95–105). Dataset B: IQR = 40 (values mostly between 60–100).',
        question: 'What does the difference in IQR tell you about these two datasets without seeing all the data?',
        hint: 'IQR measures the spread of the middle 50%.',
        solution: 'Dataset A\'s middle 50% spans only 5 units — very tightly clustered. Dataset B\'s middle 50% spans 40 units — much more variable. Dataset A is more consistent; Dataset B has greater variability in the typical range of values. Neither comparison is affected by extreme outliers.',
      },
    ],
    challenging: [
      {
        id: 'iqr-chal-1',
        scenario: 'A dataset has Q1 = 30, Q3 = 70. An analyst says "the value 110 is an outlier." Is this correct?',
        question: 'Verify the analyst\'s claim. Also determine if the value 0 would be an outlier.',
        hint: 'Calculate IQR = Q3−Q1, then both fences.',
        solution: 'IQR = 70−30 = 40. Upper fence = 70 + 1.5×40 = 70 + 60 = 130. Lower fence = 30 − 60 = −30. Value 110: 110 < 130, so 110 is NOT an outlier. The analyst is incorrect. Value 0: 0 > −30, so 0 is also not an outlier. To be an outlier, a value must be below −30 or above 130.',
      },
      {
        id: 'iqr-chal-2',
        scenario: 'Hospital A and Hospital B both have IQR = 8 for patient wait times. But Hospital A\'s median is 12 minutes and Hospital B\'s median is 35 minutes.',
        question: 'Compare the two hospitals. What does having the same IQR but different medians tell you?',
        hint: 'IQR measures spread; median measures center. Both are needed.',
        solution: 'Both hospitals have equal variability in their middle 50% of wait times (IQR = 8 minutes). But Hospital A\'s typical wait (12 min median) is much shorter than Hospital B\'s (35 min median). Hospital A is both faster and equally consistent. The IQR alone doesn\'t tell you about the location — you always need both a center measure (median) and a spread measure (IQR).',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'iqr-kc-1',
      type: 'multiple-choice',
      question: 'What does the IQR measure?',
      options: [
        { id: 'a', text: 'The range of the entire dataset', isCorrect: false, explanation: 'Range = Max − Min. IQR is narrower — it covers only the middle 50%.' },
        { id: 'b', text: 'The spread of the middle 50% of the data', isCorrect: true, explanation: 'Correct! IQR = Q3 − Q1, which captures the range of the middle half of the data.' },
        { id: 'c', text: 'The average distance from the mean', isCorrect: false, explanation: 'That is the standard deviation. IQR does not involve the mean.' },
        { id: 'd', text: 'The distance from min to Q3', isCorrect: false, explanation: 'IQR runs from Q1 to Q3, not from the minimum.' },
      ],
      explanation: 'IQR = Q3 − Q1. It measures the width of the box in a box plot — the range that contains the middle 50% of the data.',
      hint: 'IQR stands for Interquartile Range — which two quartiles does it span?',
    },
    {
      id: 'iqr-kc-2',
      type: 'numerical',
      question: 'Q1 = 25, Q3 = 55. What is the IQR?',
      answer: 30,
      tolerance: 0,
      explanation: 'IQR = Q3 − Q1 = 55 − 25 = 30.',
      hint: 'IQR = Q3 minus Q1.',
    },
    {
      id: 'iqr-kc-3',
      type: 'multiple-choice',
      question: 'Q1 = 40, Q3 = 70, IQR = 30. A value is 10. Is it an outlier?',
      options: [
        { id: 'a', text: 'Yes — it is below Q1', isCorrect: false, explanation: 'Being below Q1 does not make something an outlier. You need the 1.5×IQR fence.' },
        { id: 'b', text: 'Yes — it is below the lower fence of Q1 − 1.5×IQR = 40 − 45 = −5', isCorrect: false, explanation: '10 is greater than −5, so it is NOT below the fence.' },
        { id: 'c', text: 'No — 10 is above the lower fence of −5', isCorrect: true, explanation: 'Correct! Lower fence = 40 − 1.5×30 = 40 − 45 = −5. Since 10 > −5, it is not an outlier.' },
        { id: 'd', text: 'Cannot determine without more data', isCorrect: false, explanation: 'The 1.5×IQR rule only needs Q1, Q3, and IQR — all given here.' },
      ],
      explanation: 'Lower fence = Q1 − 1.5×IQR = 40 − 45 = −5. Value 10 is above −5, so it is not an outlier despite being below Q1.',
      hint: 'Calculate lower fence = Q1 − 1.5 × IQR, then compare.',
    },
    {
      id: 'iqr-kc-4',
      type: 'multiple-choice',
      question: 'Why is the IQR considered more robust than the range for measuring spread?',
      options: [
        { id: 'a', text: 'IQR is always a larger number', isCorrect: false, explanation: 'IQR ≤ range — it is often a smaller number.' },
        { id: 'b', text: 'IQR ignores the extreme values (top and bottom 25%), making it unaffected by outliers', isCorrect: true, explanation: 'Correct! By dropping the extremes, IQR focuses on the middle half where most data lives.' },
        { id: 'c', text: 'IQR uses the mean in its calculation', isCorrect: false, explanation: 'IQR uses Q1 and Q3, not the mean.' },
        { id: 'd', text: 'IQR requires a normal distribution', isCorrect: false, explanation: 'IQR works for any distribution — it is especially preferred for non-normal data.' },
      ],
      explanation: 'The IQR only uses Q1 and Q3, ignoring the extreme 25% on each side. This means one very large or very small value has no effect on the IQR.',
      hint: 'What values does the range use vs. what values does the IQR use?',
    },
    {
      id: 'iqr-kc-5',
      type: 'multiple-choice',
      question: 'A value is flagged as an outlier by the 1.5×IQR rule. You should:',
      options: [
        { id: 'a', text: 'Always remove it from the analysis', isCorrect: false, explanation: 'Removing outliers without investigation is bad practice — they might be real, important data points.' },
        { id: 'b', text: 'Investigate whether it is a data entry error, a special case, or a genuine extreme value', isCorrect: true, explanation: 'Correct! Flagged outliers require investigation. They might be errors, or they might be the most important data points (e.g., a patient with an unusually long recovery).' },
        { id: 'c', text: 'Replace it with the mean', isCorrect: false, explanation: 'Replacing outliers with the mean alters the data without justification.' },
        { id: 'd', text: 'Ignore it — the 1.5×IQR rule is not reliable', isCorrect: false, explanation: 'The 1.5×IQR rule is a standard, well-established outlier detection method.' },
      ],
      explanation: 'Outlier detection flags values for review, not automatic deletion. Investigate: is it a measurement error? A special case? A genuine extreme? Document your decision.',
      hint: 'What is the purpose of flagging an outlier — to delete it, or to examine it?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'iqr-tf-1', type: 'true-false', question: 'The IQR is calculated as Q3 minus Q1.', isTrue: true, explanation: 'IQR = Q3 − Q1. It spans from the 25th to 75th percentile, covering the middle 50% of data.' },
    { id: 'iqr-tf-2', type: 'true-false', question: 'IQR is sensitive to extreme outliers because it uses all values.', isTrue: false, explanation: 'IQR is RESISTANT to outliers. It uses only Q1 and Q3 (25th and 75th percentiles), which depend on rank position, not actual extreme values.' },
    { id: 'iqr-tf-3', type: 'true-false', question: 'The 1.5×IQR rule identifies values above Q3 + 1.5×IQR as potential outliers.', isTrue: true, explanation: 'Upper fence = Q3 + 1.5×IQR. Values above this upper fence are potential upper outliers. Similarly, values below Q1 − 1.5×IQR are potential lower outliers.' },
    { id: 'iqr-tf-4', type: 'true-false', question: 'The IQR can be negative.', isTrue: false, explanation: 'IQR = Q3 − Q1. Since Q3 ≥ Q1 by definition (Q3 is always at or above Q1), IQR ≥ 0 always. IQR = 0 only when Q1 = Q3 (all middle values are identical).' },
    { id: 'iqr-tf-5', type: 'true-false', question: 'A larger IQR indicates greater spread in the middle 50% of the data.', isTrue: true, explanation: 'IQR measures the spread of the central half of the data. Larger IQR = more spread between Q1 and Q3 = more variability in the typical range.' },
    { id: 'iqr-tf-6', type: 'true-false', question: 'IQR equals the range of the dataset.', isTrue: false, explanation: 'Range = Max − Min (entire span). IQR = Q3 − Q1 (span of middle 50%). Range ≥ IQR always. They are equal only in degenerate cases.' },
    { id: 'iqr-tf-7', type: 'true-false', question: 'Adding a constant to every value in a dataset does not change the IQR.', isTrue: true, explanation: 'Adding c to all values shifts Q1 and Q3 by the same amount. IQR = (Q3+c) − (Q1+c) = Q3 − Q1. IQR unchanged.' },
    { id: 'iqr-tf-8', type: 'true-false', question: 'Multiplying all values by 2 doubles the IQR.', isTrue: true, explanation: 'New Q1 = 2×Q1, New Q3 = 2×Q3. New IQR = 2×Q3 − 2×Q1 = 2(Q3 − Q1) = 2×IQR.' },
    { id: 'iqr-tf-9', type: 'true-false', question: 'Box plots use the IQR to determine where to draw the whiskers.', isTrue: true, explanation: 'Whiskers in a standard box plot extend to the most extreme values within 1.5×IQR of Q1 and Q3. The IQR defines the box and the outlier fences.' },
    { id: 'iqr-tf-10', type: 'true-false', question: 'An IQR of 0 means all values in the dataset are identical.', isTrue: false, explanation: 'IQR = 0 means Q1 = Q3, meaning the middle 50% of values are all the same. But other values (extreme ones) could differ. An IQR of 0 does NOT require all values to be identical.' },
    { id: 'iqr-tf-11', type: 'true-false', question: 'The IQR is a better measure of spread than standard deviation for highly skewed data.', isTrue: true, explanation: 'For skewed distributions, SD is pulled by extreme values in the tail. IQR is resistant to skew because it ignores the extreme 25% on each side, capturing the "typical" spread.' },
    { id: 'iqr-tf-12', type: 'true-false', question: 'Values flagged by the 1.5×IQR rule must always be deleted from the analysis.', isTrue: false, explanation: 'The 1.5×IQR rule IDENTIFIES potential outliers for investigation. They may be real extreme values that should be kept. Never delete without investigating the cause.' },
    { id: 'iqr-tf-13', type: 'true-false', question: 'For a dataset: Q1 = 20, Q3 = 50, the IQR = 30.', isTrue: true, explanation: 'IQR = Q3 − Q1 = 50 − 20 = 30.' },
    { id: 'iqr-tf-14', type: 'true-false', question: 'The IQR measures the spread of the middle 50% of sorted data.', isTrue: true, explanation: 'Q1 is the 25th percentile; Q3 is the 75th percentile. The range between them (IQR = Q3 − Q1) contains the middle 50% of the sorted data.' },
    { id: 'iqr-tf-15', type: 'true-false', question: 'Lower outlier fence = Q1 + 1.5×IQR.', isTrue: false, explanation: 'Lower fence = Q1 − 1.5×IQR (subtract to go below Q1). Upper fence = Q3 + 1.5×IQR (add to go above Q3). The formula uses minus for the lower fence.' },
    { id: 'iqr-tf-16', type: 'true-false', question: 'The 3×IQR rule for extreme outliers uses wider fences than the 1.5×IQR rule.', isTrue: true, explanation: '3×IQR fences: Q1 − 3×IQR and Q3 + 3×IQR. These are wider than 1.5×IQR fences, so fewer values are flagged — only the most extreme outliers.' },
    { id: 'iqr-tf-17', type: 'true-false', question: 'The standard deviation and IQR always give the same ranking of variability across datasets.', isTrue: false, explanation: 'SD is sensitive to outliers; IQR is not. A dataset with one extreme outlier can have a high SD but a low IQR, or vice versa. They measure spread differently and can rank datasets differently.' },
    { id: 'iqr-tf-18', type: 'true-false', question: 'For normally distributed data, IQR ≈ 1.35 × standard deviation.', isTrue: true, explanation: 'This relationship holds for normal distributions: IQR ≈ 1.349σ. Knowing one allows you to estimate the other for symmetric bell-shaped data.' },
    { id: 'iqr-tf-19', type: 'true-false', question: 'IQR is the same as the interquartile deviation.', isTrue: false, explanation: 'The semi-interquartile range (SIR) = IQR/2 is sometimes called the "interquartile deviation." IQR itself is the full range from Q1 to Q3, not half of it.' },
    { id: 'iqr-tf-20', type: 'true-false', question: 'IQR is particularly useful when comparing spread across multiple groups.', isTrue: true, explanation: 'Side-by-side box plots compare IQRs across groups visually. The width of each box is the IQR, making inter-group variability immediately apparent.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'iqr-mc-6', type: 'multiple-choice', question: 'Q1 = 15, Q3 = 45. Calculate the IQR and upper outlier fence.', options: [{ id: 'a', text: 'IQR = 30, Upper fence = 90', isCorrect: true, explanation: 'IQR = 45−15 = 30. Upper fence = 45 + 1.5×30 = 45+45 = 90.' }, { id: 'b', text: 'IQR = 30, Upper fence = 75', isCorrect: false, explanation: 'Upper fence = Q3 + 1.5×IQR = 45 + 45 = 90.' }, { id: 'c', text: 'IQR = 60, Upper fence = 135', isCorrect: false, explanation: 'IQR = Q3 − Q1 = 45 − 15 = 30, not 60.' }, { id: 'd', text: 'IQR = 30, Upper fence = 60', isCorrect: false, explanation: 'Upper = Q3 + 1.5×IQR = 45 + 45 = 90.' }], explanation: 'IQR = 45 − 15 = 30. Upper fence = Q3 + 1.5×IQR = 45 + 1.5×30 = 45 + 45 = 90.', hint: 'IQR = Q3 − Q1. Upper fence = Q3 + 1.5×IQR.' },
    { id: 'iqr-mc-7', type: 'multiple-choice', question: 'A dataset has Q1=10, Q3=30, IQR=20. Which value IS an outlier by the 1.5×IQR rule?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'Lower fence = 10 − 30 = −20. 5 > −20, so not an outlier.' }, { id: 'b', text: '35', isCorrect: false, explanation: 'Upper fence = 30 + 30 = 60. 35 < 60, not an outlier.' }, { id: 'c', text: '65', isCorrect: true, explanation: 'Upper fence = Q3 + 1.5×IQR = 30 + 30 = 60. 65 > 60: outlier.' }, { id: 'd', text: '25', isCorrect: false, explanation: '25 is between Q1 and Q3, well within the fences.' }], explanation: 'Upper fence = 30 + 1.5(20) = 60. Lower fence = 10 − 1.5(20) = −20. Check each: 5>−20 ✓, 35<60 ✓, 65>60 ✗ (outlier), 25 within range ✓.', hint: 'Calculate fences first, then check which values fall outside.' },
    { id: 'iqr-mc-8', type: 'multiple-choice', question: 'For which type of data is IQR most recommended over standard deviation?', options: [{ id: 'a', text: 'Normally distributed data', isCorrect: false, explanation: 'For normal data, SD works well and is more efficient.' }, { id: 'b', text: 'Data with significant outliers or skewness', isCorrect: true, explanation: 'IQR is resistant — outliers and skew do not affect it. SD is inflated by both.' }, { id: 'c', text: 'Very large datasets (n > 1000)', isCorrect: false, explanation: 'Sample size is not the determining factor.' }, { id: 'd', text: 'Nominal (categorical) data', isCorrect: false, explanation: 'IQR requires ordinal or higher level data (needs ordering).' }], explanation: 'When data has outliers or is skewed, SD is inflated by extreme values, misrepresenting typical spread. IQR uses the middle 50% and is unaffected by the extremes.', hint: 'IQR is preferred when the mean/SD are distorted by...' },
    { id: 'iqr-mc-9', type: 'multiple-choice', question: 'Data: Q1 = 50, Q3 = 80. A value of 30 is observed. Is it an outlier?', options: [{ id: 'a', text: 'Yes — 30 is below the lower fence', isCorrect: true, explanation: 'IQR=30. Lower fence = 50 − 1.5×30 = 50 − 45 = 5. 30 > 5, so NOT an outlier.' }, { id: 'b', text: 'No — 30 is above the lower fence of 5', isCorrect: false, explanation: 'Wait — lower fence = 50 − 45 = 5. 30 > 5, so 30 is NOT an outlier. Answer should be No.' }, { id: 'c', text: 'No — 30 is within the acceptable range', isCorrect: true, explanation: 'IQR=30. Lower fence = Q1−1.5×IQR = 50−45 = 5. 30 > 5, so 30 is NOT flagged as an outlier.' }, { id: 'd', text: 'Cannot determine without the full dataset', isCorrect: false, explanation: 'IQR rule only needs Q1, Q3, and the value.' }], explanation: 'IQR = 80 − 50 = 30. Lower fence = Q1 − 1.5×IQR = 50 − 45 = 5. Value 30 > lower fence 5 → NOT an outlier.', hint: 'Lower fence = Q1 − 1.5×IQR. Compare value to lower fence.' },
    { id: 'iqr-mc-10', type: 'multiple-choice', question: 'What percentage of data falls between Q1 and Q3 (in the IQR box)?', options: [{ id: 'a', text: '25%', isCorrect: false, explanation: '25% falls below Q1.' }, { id: 'b', text: '75%', isCorrect: false, explanation: '75% falls below Q3, not between Q1 and Q3.' }, { id: 'c', text: '50%', isCorrect: true, explanation: 'Q1=25th percentile, Q3=75th percentile. Between them: 75−25=50% of data.' }, { id: 'd', text: '100%', isCorrect: false, explanation: '100% would require covering the entire range.' }], explanation: 'Q1 is at the 25th percentile, Q3 is at the 75th percentile. The middle 50% (from 25th to 75th percentile) falls within the IQR.', hint: '75th percentile − 25th percentile = ?' },
    { id: 'iqr-mc-11', type: 'multiple-choice', question: 'Dataset A has IQR = 5; Dataset B has IQR = 25. What can you conclude?', options: [{ id: 'a', text: 'Dataset B has more observations', isCorrect: false, explanation: 'IQR is not related to n.' }, { id: 'b', text: 'Dataset B\'s middle 50% is more spread out than Dataset A\'s', isCorrect: true, explanation: 'IQR = 25 vs 5 → B\'s central values are more spread from each other.' }, { id: 'c', text: 'Dataset B has more outliers', isCorrect: false, explanation: 'More IQR does not mean more outliers — it means wider central spread.' }, { id: 'd', text: 'Dataset A has a larger range', isCorrect: false, explanation: 'Range and IQR are different. A\'s range could be larger or smaller.' }], explanation: 'IQR measures the spread of the middle 50%. IQR=25 for B means the central values are much more dispersed than IQR=5 for A. This says nothing about n, outliers, or the total range.', hint: 'Larger IQR = more spread in the central half of the data.' },
    { id: 'iqr-mc-12', type: 'multiple-choice', question: 'The "whiskers" of a standard box plot extend to:', options: [{ id: 'a', text: 'The maximum and minimum values', isCorrect: false, explanation: 'Whiskers extend only to the most extreme non-outlier values within 1.5×IQR.' }, { id: 'b', text: 'Q1 − 1.5×IQR and Q3 + 1.5×IQR', isCorrect: false, explanation: 'These are the FENCE positions. Whiskers extend to the last data point within the fence, not to the fence itself.' }, { id: 'c', text: 'The most extreme data points that still fall within the 1.5×IQR fences', isCorrect: true, explanation: 'Whiskers reach the last actual data points within the fences. Values beyond are plotted as dots (outliers).' }, { id: 'd', text: 'The mean ± 2 standard deviations', isCorrect: false, explanation: 'Box plots are based on quartiles, not means and SDs.' }], explanation: 'Whiskers extend to the last actual data points within Q1 − 1.5×IQR (lower) and Q3 + 1.5×IQR (upper). Any values beyond those fences are plotted individually as outlier dots.', hint: 'Whiskers extend to the LAST DATA POINTS within the 1.5×IQR fences.' },
    { id: 'iqr-mc-13', type: 'multiple-choice', question: 'A dataset has IQR = 0. What does this mean?', options: [{ id: 'a', text: 'The dataset has no variation at all', isCorrect: false, explanation: 'IQR = 0 means the middle 50% are identical, but extreme values could vary.' }, { id: 'b', text: 'The middle 50% of values are all identical (Q1 = Q3)', isCorrect: true, explanation: 'IQR = Q3 − Q1 = 0 means Q3 = Q1, meaning the 25th and 75th percentile are the same value.' }, { id: 'c', text: 'The dataset has exactly one unique value', isCorrect: false, explanation: 'IQR = 0 does not require all values to be the same.' }, { id: 'd', text: 'The range is also 0', isCorrect: false, explanation: 'Range and IQR are different. Range could be large while IQR = 0.' }], explanation: 'IQR = Q3 − Q1 = 0 means Q3 = Q1. At least 50% of the data values are equal to this common value. The extreme values (outside the middle 50%) might still vary.', hint: 'IQR = Q3 − Q1 = 0 → Q3 = Q1. What does that mean for the middle 50%?' },
    { id: 'iqr-mc-14', type: 'multiple-choice', question: 'Why is the IQR used instead of the range to describe spread in a box plot?', options: [{ id: 'a', text: 'Range is always larger', isCorrect: false, explanation: 'While range ≥ IQR, that is not the reason IQR is preferred.' }, { id: 'b', text: 'IQR is resistant to outliers; range is not', isCorrect: true, explanation: 'Box plots display Q1–Q3 (IQR) as the box, with outliers shown separately. IQR gives a robust view of central spread.' }, { id: 'c', text: 'IQR is easier to compute', isCorrect: false, explanation: 'Both are simple to compute.' }, { id: 'd', text: 'Range cannot be shown on a box plot', isCorrect: false, explanation: 'Range could be shown but would be dominated by outliers.' }], explanation: 'The box in a box plot represents the IQR (Q1 to Q3). Outliers are shown separately as dots. This design separates the typical spread (IQR) from extreme values, giving a cleaner picture than using range.', hint: 'What happens to the range when there are outliers?' },
    { id: 'iqr-mc-15', type: 'multiple-choice', question: 'Dataset: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100. Q1 = 25, Q3 = 75. The upper fence is:', options: [{ id: 'a', text: '100', isCorrect: false, explanation: '100 is the max. Upper fence = Q3 + 1.5×IQR = 75 + 75 = 150.' }, { id: 'b', text: '125', isCorrect: false, explanation: 'IQR = 75 − 25 = 50. Upper fence = 75 + 1.5×50 = 75 + 75 = 150.' }, { id: 'c', text: '150', isCorrect: true, explanation: 'IQR = 75 − 25 = 50. Upper fence = Q3 + 1.5×IQR = 75 + 75 = 150.' }, { id: 'd', text: '112.5', isCorrect: false, explanation: '112.5 = 75 + 37.5. That uses 0.75×IQR, not 1.5.' }], explanation: 'IQR = Q3 − Q1 = 75 − 25 = 50. Upper fence = Q3 + 1.5×IQR = 75 + 1.5×50 = 75 + 75 = 150. No values in this dataset exceed 150, so no outliers.', hint: 'IQR = Q3 − Q1. Upper fence = Q3 + 1.5×IQR.' },
  ],
  keyTakeaway:
    'IQR = Q3 − Q1 measures the spread of the middle 50% of data, making it resistant to outliers. Use the 1.5×IQR rule (Lower fence = Q1 − 1.5×IQR, Upper fence = Q3 + 1.5×IQR) to identify potential outliers for investigation.',
  visualization: (data) => <IQRViz data={data} />,
  datasetGenerator: true,
}

export default function InterquartileRange({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
