import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { BoxPlotChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { q1, q3, median as calcMedian, percentile, sortAsc, round } from '../../../utils/stats'
import QuartileMethodNote from '../../shared/QuartileMethodNote'

// Fixed dataset
const FIXED = [55, 60, 65, 68, 70, 72, 75, 80, 85, 90]
const fixedQ1 = round(q1(FIXED), 2)
const fixedQ3 = round(q3(FIXED), 2)
const fixedMedian = round(calcMedian(FIXED), 2)

function QuartilesViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 20, min: 10, max: 100, distribution: 'uniform' })
  const data = propData ?? ownData
  const liveQ1 = useMemo(() => (data.length ? round(q1(data), 2) : null), [data])
  const liveQ2 = useMemo(() => (data.length ? round(calcMedian(data), 2) : null), [data])
  const liveQ3 = useMemo(() => (data.length ? round(q3(data), 2) : null), [data])

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap">
        {[
          { label: 'Q1 (25th %ile)', value: liveQ1, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Q2 / Median (50th %ile)', value: liveQ2, color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'Q3 (75th %ile)', value: liveQ3, color: 'bg-purple-50 text-purple-700 border-purple-200' },
        ].map(({ label, value, color }) => (
          <span key={label} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${color}`}>
            {label}: {value ?? '…'}
          </span>
        ))}
      </div>
      <BoxPlotChart
        datasets={[{ label: 'Live Dataset', data, color: '#2563EB' }]}
        title="Quartiles in a Box Plot"
        yLabel="Value"
        height={280}
      />
      <div className="mt-3">
        <QuartileMethodNote />
      </div>
    </div>
  )
}

const content = {
  title: 'Quartiles and Percentiles',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate quartiles and percentiles, and interpret what they mean about an individual value\'s position in a dataset.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Quartiles</strong> divide a sorted dataset into four equal parts. Each part contains 25% of the data.
      </p>
      <ul className="space-y-2 ml-4">
        <li><strong>Q1 (First quartile = 25th percentile):</strong> 25% of values fall below this point. The boundary between the bottom quarter and the rest.</li>
        <li><strong>Q2 (Second quartile = 50th percentile):</strong> This is the median. Half the data is below, half above.</li>
        <li><strong>Q3 (Third quartile = 75th percentile):</strong> 75% of values fall below this point. The boundary between the top quarter and the rest.</li>
      </ul>
      <p>
        <strong>Percentiles</strong> generalize this idea. The <strong>p-th percentile</strong> is the value below which p% of the data falls. For example, if you score at the 90th percentile on a test, you scored higher than 90% of test-takers.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine 100 people standing in order from shortest to tallest. Quartiles are the "checkpoint" people at positions 25, 50, and 75:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Q1</strong> = person #25. One quarter of people are shorter than them.</li>
        <li><strong>Q2</strong> = person #50 (the median). Half are shorter, half are taller.</li>
        <li><strong>Q3</strong> = person #75. Three quarters are shorter than them.</li>
      </ul>
      <p className="text-sm text-gray-600">If you are at the 90th percentile for height, 90 of the 100 people are shorter than you.</p>
    </div>
  ),
  formula: {
    main: 'Q1 = value at position 0.25 × (n − 1) in sorted array',
    variants: [
      { label: 'Q1 position (0-indexed)', expression: 'i = 0.25 × (n − 1)', latex: 'i = 0.25 \\times (n - 1)' },
      { label: 'Q3 position (0-indexed)', expression: 'i = 0.75 × (n − 1)', latex: 'i = 0.75 \\times (n - 1)' },
      { label: 'Interpolation', expression: 'value = arr[floor(i)] + frac(i) × (arr[ceil(i)] − arr[floor(i)])', latex: 'value = arr[\\lfloor i \\rfloor] + frac(i) \\times (arr[\\lceil i \\rceil] - arr[\\lfloor i \\rfloor])' },
      { label: 'pth percentile position', expression: 'i = (p / 100) × (n − 1)', latex: 'i = \\frac{p}{100} \\times (n - 1)' },
    ],
    symbolGuide: [
      { symbol: 'Q1', meaning: 'First quartile — 25th percentile' },
      { symbol: 'Q2', meaning: 'Second quartile — 50th percentile (the median)' },
      { symbol: 'Q3', meaning: 'Third quartile — 75th percentile' },
      { symbol: 'n', meaning: 'Number of values in the dataset' },
      { symbol: 'i', meaning: 'Fractional index position in the sorted array (0-based)' },
      { symbol: 'p', meaning: 'Percentile (a number from 0 to 100)' },
    ],
  },
  whenToUse: [
    'When you want to describe where a value falls relative to others in the dataset',
    'When reporting standardized test scores, medical reference ranges, or performance benchmarks',
    'Before constructing a box plot (which is built from the five-number summary: min, Q1, Q2, Q3, max)',
  ],
  whenNotToUse: [
    'When sample size is very small (n < 5) — quartile calculations become unreliable',
    'When you need a measure of spread rather than position — use IQR or standard deviation',
    'For nominal data — percentiles require ordinal, interval, or ratio data',
  ],
  assumptions: [
    'Data must be sorted in ascending order before calculating quartiles',
    'Data must be at least ordinal level (must be rankable)',
    'Different software packages use different quartile calculation methods — values may differ slightly',
    'Interpolation is needed when quartile positions fall between two data points',
  ],
  workedExample: {
    scenario: '10 employee performance scores: 55, 60, 65, 68, 70, 72, 75, 80, 85, 90. Find Q1, Q2 (median), and Q3.',
    dataset: '[55, 60, 65, 68, 70, 72, 75, 80, 85, 90]',
    steps: [
      { stepNumber: 1, label: 'Verify data is sorted', expression: '55, 60, 65, 68, 70, 72, 75, 80, 85, 90', result: 'n = 10, already sorted', explanation: 'Always confirm the data is sorted in ascending order first.' },
      { stepNumber: 2, label: 'Calculate Q1 position (0-based index)', expression: 'i = 0.25 × (10 − 1) = 0.25 × 9 = 2.25', result: 'Position 2.25 (between index 2 and index 3)', explanation: 'The Q1 position falls between the 3rd (index 2) and 4th (index 3) values.' },
      { stepNumber: 3, label: 'Interpolate to find Q1', expression: 'Q1 = 65 + 0.25 × (68 − 65) = 65 + 0.75 = 65.75', result: `Q1 = ${fixedQ1}`, explanation: 'Values at index 2 = 65 and index 3 = 68. The fractional part 0.25 of the way from 65 to 68 gives 65.75.' },
      { stepNumber: 4, label: 'Calculate Q2 (median)', expression: 'i = 0.5 × 9 = 4.5 → between index 4 (70) and index 5 (72)', result: `Q2 (Median) = ${fixedMedian}`, explanation: '(70 + 72) / 2 = 71. The median is the average of the two middle values.' },
      { stepNumber: 5, label: 'Calculate Q3 position', expression: 'i = 0.75 × 9 = 6.75 → between index 6 (75) and index 7 (80)', result: `Q3 = ${fixedQ3}`, explanation: 'Q3 = 75 + 0.75 × (80 − 75) = 75 + 3.75 = 78.75.' },
    ],
    interpretation: `Q1 = ${fixedQ1}: 25% of employees scored below 65.75. Q2 = ${fixedMedian}: half scored below 71. Q3 = ${fixedQ3}: 75% scored below 78.75. An employee scoring 80 would be in the top 25%.`,
  },
  interpretation: `Q1 tells you the bottom 25%, Q2 (the median) tells you the midpoint, and Q3 tells you the top 25%. The gap between Q1 and Q3 is the Interquartile Range (IQR), which describes how spread out the middle 50% of the data is. A large IQR means the middle half is widely spread; a small IQR means it's tightly clustered.`,
  commonMistakes: [
    { mistake: 'Not sorting before calculating quartiles', explanation: 'Quartiles are defined by position in sorted data. If you forget to sort, you will calculate the wrong positions entirely.' },
    { mistake: 'Expecting an exact data value for every quartile', explanation: 'Quartile positions often fall between two values, requiring interpolation. Q1 = 65.75 is valid even though 65.75 does not appear in the dataset.' },
    { mistake: 'Assuming all software gives the same quartile values', explanation: 'There are at least 5 different methods for calculating quartiles. R uses method 7 by default; Excel QUARTILE.INC uses a different method; SPSS uses yet another. Always specify which method you used.' },
    { mistake: 'Confusing "above Q3" with "unusual"', explanation: 'Being above Q3 just means you are in the top 25% — that is not unusual. Outlier detection requires the 1.5 × IQR rule, not just quartile position.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'qp-easy-1',
        scenario: 'Sorted dataset: 2, 4, 6, 8, 10.',
        question: 'What is Q2 (the median)?',
        hint: 'With 5 values, the middle is the 3rd value.',
        solution: 'n = 5, sorted: 2, 4, 6, 8, 10. Q2 = 3rd value = 6.',
      },
      {
        id: 'qp-easy-2',
        scenario: 'A student scored at the 85th percentile on a standardized test.',
        question: 'What does this mean?',
        hint: 'The pth percentile means p% of scores fall below this value.',
        solution: 'The student scored higher than 85% of all students who took the test. Only 15% scored higher.',
      },
    ],
    moderate: [
      {
        id: 'qp-mod-1',
        scenario: 'Sorted exam scores (n=8): 45, 52, 60, 68, 75, 81, 88, 95.',
        question: 'Calculate Q1 and Q3 using the inclusive method.',
        hint: 'Q1 position = 0.25 × (8−1) = 1.75. Q3 position = 0.75 × (8−1) = 5.25.',
        solution: 'Q1: position = 0.25 × 7 = 1.75 → between index 1 (52) and index 2 (60). Q1 = 52 + 0.75×(60−52) = 52 + 6 = 58. Q3: position = 0.75 × 7 = 5.25 → between index 5 (81) and index 6 (88). Q3 = 81 + 0.25×(88−81) = 81 + 1.75 = 82.75.',
      },
      {
        id: 'qp-mod-2',
        scenario: 'A patient\'s blood pressure is at the 92nd percentile for their age group.',
        question: 'Interpret this result. Is it a concern?',
        hint: 'Higher blood pressure percentile means higher blood pressure relative to peers.',
        solution: 'Being at the 92nd percentile means the patient\'s blood pressure is higher than 92% of people in their age group. Only 8% have higher blood pressure. This is a concern — above the 90th percentile is generally considered elevated and warrants medical attention.',
      },
    ],
    challenging: [
      {
        id: 'qp-chal-1',
        scenario: 'A hiring manager reviews 12 candidates. Scores (sorted): 58, 63, 67, 71, 74, 76, 79, 82, 85, 88, 91, 95.',
        question: 'Calculate Q1, Q2, and Q3. A candidate scoring 79 wants to know their percentile rank. Interpret.',
        hint: 'Q1 position = 0.25 × 11 = 2.75. Q2 position = 0.5 × 11 = 5.5. Q3 position = 0.75 × 11 = 8.25.',
        solution: 'Q1: position 2.75 → 67 + 0.75×(71−67) = 67 + 3 = 70. Q2: position 5.5 → (76+79)/2 = 77.5. Q3: position 8.25 → 85 + 0.25×(88−85) = 85.75. Score of 79: it is index 6 (0-based). Percentile = (6 / 11) × 100 ≈ 54.5th percentile — roughly in the middle of the candidate pool.',
      },
      {
        id: 'qp-chal-2',
        scenario: 'A dataset has Q1 = 40 and Q3 = 70. You are told the 10th percentile is 22 and the 90th percentile is 88.',
        question: 'What is the IQR? What percentage of the data falls between 22 and 88? Between Q1 and Q3?',
        hint: 'IQR = Q3 − Q1. By definition, the 10th and 90th percentile each exclude 10% of data.',
        solution: 'IQR = 70 − 40 = 30. Between 22 and 88: from the 10th to 90th percentile = 80% of the data. Between Q1 (40) and Q3 (70): from the 25th to 75th percentile = 50% of the data (this is the definition of IQR).',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'qp-kc-1',
      type: 'multiple-choice',
      question: 'Q3 of a dataset is 85. What does this mean?',
      options: [
        { id: 'a', text: '75% of values are above 85', isCorrect: false, explanation: 'Q3 means 75% fall BELOW 85, not above.' },
        { id: 'b', text: '75% of values are below 85', isCorrect: true, explanation: 'Correct! Q3 is the 75th percentile — 75% of data falls below it.' },
        { id: 'c', text: '85% of values are below Q3', isCorrect: false, explanation: 'The "75th percentile" means 75% below, not 85%.' },
        { id: 'd', text: 'The maximum value is 85', isCorrect: false, explanation: 'Q3 is not the maximum. Values can exceed Q3.' },
      ],
      explanation: 'Q3 = third quartile = 75th percentile. By definition, 75% of values fall below Q3.',
      hint: 'Q3 is the 75th percentile. What does "75th percentile" mean?',
    },
    {
      id: 'qp-kc-2',
      type: 'multiple-choice',
      question: 'Which quartile is the same as the median?',
      options: [
        { id: 'a', text: 'Q1', isCorrect: false, explanation: 'Q1 is the 25th percentile.' },
        { id: 'b', text: 'Q2', isCorrect: true, explanation: 'Correct! Q2 = second quartile = 50th percentile = median.' },
        { id: 'c', text: 'Q3', isCorrect: false, explanation: 'Q3 is the 75th percentile.' },
        { id: 'd', text: 'None of them', isCorrect: false, explanation: 'Q2 is always identical to the median.' },
      ],
      explanation: 'Q2 divides the data in half — exactly the same as the median. It is the 50th percentile.',
      hint: 'Which quartile divides the dataset exactly in half?',
    },
    {
      id: 'qp-kc-3',
      type: 'multiple-choice',
      question: 'Why might Q1 calculated in Excel differ from Q1 calculated in R?',
      options: [
        { id: 'a', text: 'One rounds to fewer decimal places', isCorrect: false, explanation: 'The difference is not about rounding — it is about the calculation method.' },
        { id: 'b', text: 'They use different quartile calculation methods', isCorrect: true, explanation: 'Correct! There are multiple valid methods for calculating quartiles. Excel QUARTILE.INC and R type 7 use different interpolation rules.' },
        { id: 'c', text: 'Excel cannot handle decimals', isCorrect: false, explanation: 'Excel handles decimals fine.' },
        { id: 'd', text: 'They should never differ', isCorrect: false, explanation: 'They frequently differ, especially for small datasets.' },
      ],
      explanation: 'There are at least 5 common quartile methods used across different software packages. Excel and R use different defaults. Always specify your method when reporting quartiles.',
      hint: 'Think about how quartile positions that fall between two values could be handled in different ways.',
    },
    {
      id: 'qp-kc-4',
      type: 'numerical',
      question: 'Sorted data: 10, 20, 30, 40, 50. What is Q2 (median)?',
      answer: 30,
      tolerance: 0,
      explanation: 'n = 5. Q2 position = 0.5 × (5−1) = 2. Index 2 in sorted array = 30.',
      hint: 'With 5 values, the middle (3rd) value is the median.',
    },
    {
      id: 'qp-kc-5',
      type: 'multiple-choice',
      question: 'A child\'s height is at the 60th percentile for their age. What does this mean?',
      options: [
        { id: 'a', text: 'They are taller than 40% of children', isCorrect: false, explanation: 'If they are at the 60th percentile, they are taller than 60%, not 40%.' },
        { id: 'b', text: 'They are taller than 60% of children their age', isCorrect: true, explanation: 'Correct! The 60th percentile means 60% of children are shorter.' },
        { id: 'c', text: 'They are 60cm tall', isCorrect: false, explanation: 'Percentile is a relative rank, not an absolute measurement.' },
        { id: 'd', text: 'They are in the top 60% of children', isCorrect: false, explanation: '"Top 60%" would mean below the 40th percentile. Being at the 60th percentile means 60% are shorter.' },
      ],
      explanation: 'The pth percentile means p% of the reference group has a lower value. 60th percentile = taller than 60% of peers.',
      hint: 'The pth percentile means p% fall BELOW this value.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'qp-tf-1', type: 'true-false', question: 'Q2 is the same as the median.', isTrue: true, explanation: 'Q2 = the second quartile = the 50th percentile = the median. All three names refer to the same value: the middle of sorted data.' },
    { id: 'qp-tf-2', type: 'true-false', question: 'Q1 divides the dataset so that 75% of values fall below it.', isTrue: false, explanation: 'Q1 is the 25th percentile: 25% of values fall below Q1 (and 75% fall above). Q3 is the 75th percentile: 75% fall below Q3.' },
    { id: 'qp-tf-3', type: 'true-false', question: 'The 90th percentile means 90% of values in the dataset fall below that value.', isTrue: true, explanation: 'The pth percentile: p% of values fall below. So the 90th percentile has 90% of observations below it.' },
    { id: 'qp-tf-4', type: 'true-false', question: 'Quartiles can only be computed for normally distributed data.', isTrue: false, explanation: 'Quartiles can be computed for any ordered dataset, regardless of distribution shape. They are order statistics based on position.' },
    { id: 'qp-tf-5', type: 'true-false', question: 'For a dataset of 20 values, Q1 falls between the 5th and 6th sorted values.', isTrue: true, explanation: 'Using the common method: Q1 position = 0.25 × n = 0.25 × 20 = 5. Q1 is the average of the 5th and 6th sorted values.' },
    { id: 'qp-tf-6', type: 'true-false', question: 'The 25th percentile and Q1 always refer to the same value.', isTrue: true, explanation: 'Q1 = 25th percentile = first quartile. These are equivalent names for the boundary between the lowest 25% and the upper 75% of sorted data.' },
    { id: 'qp-tf-7', type: 'true-false', question: 'A person at the 95th percentile for height is shorter than 95% of the reference group.', isTrue: false, explanation: '95th percentile means TALLER than 95% of the reference group. Only 5% are taller. The person is in the top 5%.' },
    { id: 'qp-tf-8', type: 'true-false', question: 'The IQR is calculated as Q3 minus Q1.', isTrue: true, explanation: 'IQR = Q3 − Q1. It measures the spread of the middle 50% of the data (the distance between the first and third quartiles).' },
    { id: 'qp-tf-9', type: 'true-false', question: 'Quartiles are affected by extreme outliers.', isTrue: false, explanation: 'Quartiles are based on RANK/POSITION (25th, 50th, 75th percentile). Adding an extreme outlier shifts only the extreme values, not the middle positions. Quartiles are robust (resistant) to outliers.' },
    { id: 'qp-tf-10', type: 'true-false', question: 'Q3 separates the top 25% from the bottom 75%.', isTrue: true, explanation: 'Q3 = 75th percentile. 75% of values fall below Q3, and the top 25% fall above Q3. Q3 is the boundary at the 75th percentile.' },
    { id: 'qp-tf-11', type: 'true-false', question: 'A percentile rank of 50 means the value is at the mean.', isTrue: false, explanation: 'The 50th percentile is the MEDIAN, not necessarily the mean. For skewed distributions, the mean and median (50th percentile) differ significantly.' },
    { id: 'qp-tf-12', type: 'true-false', question: 'The 100th percentile is the maximum value of the dataset.', isTrue: true, explanation: 'The 100th percentile is the maximum — no values in the dataset fall above it. 100% of values fall at or below the maximum.' },
    { id: 'qp-tf-13', type: 'true-false', question: 'Different software packages and textbooks can produce slightly different quartile values for the same dataset.', isTrue: true, explanation: 'There are at least 9 different methods for computing quartiles. Common disagreements arise with small datasets. This is a known issue in statistics pedagogy.' },
    { id: 'qp-tf-14', type: 'true-false', question: 'Quartiles require that data be sorted in ascending order.', isTrue: true, explanation: 'All order statistics (quartiles, percentiles, median) require sorted data because they are based on rank/position.' },
    { id: 'qp-tf-15', type: 'true-false', question: 'The 50th percentile splits the sorted data into two equal halves.', isTrue: true, explanation: 'The 50th percentile (median) is defined as the middle value of sorted data, with half the values below and half above.' },
    { id: 'qp-tf-16', type: 'true-false', question: 'A score in the 99th percentile is the highest possible score.', isTrue: false, explanation: 'The 99th percentile means 99% of scores fall below — but the top 1% still exists above it. The 100th percentile (maximum) is the highest.' },
    { id: 'qp-tf-17', type: 'true-false', question: 'Deciles divide sorted data into 10 equal groups.', isTrue: true, explanation: 'Deciles are the 10th, 20th, ..., 90th percentiles. They divide data into 10 equal-count groups, similar to how quartiles divide into 4.' },
    { id: 'qp-tf-18', type: 'true-false', question: 'Q1, Q2, and Q3 together divide a sorted dataset into four equal parts.', isTrue: true, explanation: 'The three quartile values (Q1, Q2, Q3) create four intervals, each containing approximately 25% of the data.' },
    { id: 'qp-tf-19', type: 'true-false', question: 'The range between Q1 and Q3 contains exactly 50% of the data.', isTrue: true, explanation: 'By definition: Q1 marks the 25th percentile, Q3 marks the 75th. Between them: 75% − 25% = 50% of the data. This is the IQR.' },
    { id: 'qp-tf-20', type: 'true-false', question: 'Box plots display Q1, Q2 (median), and Q3 visually.', isTrue: true, explanation: 'A box plot\'s box spans from Q1 to Q3, with the median (Q2) marked as a line inside the box. This is the IQR box.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'qp-mc-6', type: 'multiple-choice', question: 'Sorted data: 2, 5, 7, 9, 12, 14, 18. What is Q1?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'For n=7: Q1 position = 0.25×7 = 1.75, so Q1 = 2nd value = 5. Actually wait: for most methods Q1 = median of lower half {2,5,7} = 5. That is correct.' }, { id: 'b', text: '7', isCorrect: false, explanation: '7 is Q2 (median) for this dataset.' }, { id: 'c', text: '5', isCorrect: true, explanation: 'Median = 9 (4th value). Lower half: {2,5,7}. Q1 = median of lower half = 5.' }, { id: 'd', text: '2', isCorrect: false, explanation: '2 is the minimum, not Q1.' }], explanation: 'n=7. Median = 4th value = 9. Lower half (below median): {2, 5, 7}. Q1 = median of lower half = 5. Upper half: {12, 14, 18}. Q3 = 14.', hint: 'Q1 = median of the lower half of the data.' },
    { id: 'qp-mc-7', type: 'multiple-choice', question: 'A student is in the 72nd percentile for a standardized test. This means:', options: [{ id: 'a', text: 'They scored 72% on the test', isCorrect: false, explanation: 'Percentile rank ≠ percent correct.' }, { id: 'b', text: 'They scored higher than 72% of test takers', isCorrect: true, explanation: '72nd percentile: 72% of students scored lower.' }, { id: 'c', text: 'They scored lower than 72% of test takers', isCorrect: false, explanation: 'That would be the 28th percentile (100 − 72 = 28).' }, { id: 'd', text: 'They are in the top 72% of students', isCorrect: false, explanation: '"Top 72%" means 28% performed better — that is the 28th percentile, not 72nd.' }], explanation: '72nd percentile: 72% of test takers scored below this student. The student outperformed 72% of peers. Only 28% scored higher.', hint: 'pth percentile → p% scored below.' },
    { id: 'qp-mc-8', type: 'multiple-choice', question: 'Which percentile is equivalent to the median?', options: [{ id: 'a', text: '25th', isCorrect: false, explanation: '25th = Q1.' }, { id: 'b', text: '50th', isCorrect: true, explanation: 'Median = 50th percentile = Q2.' }, { id: 'c', text: '75th', isCorrect: false, explanation: '75th = Q3.' }, { id: 'd', text: '100th', isCorrect: false, explanation: '100th = maximum.' }], explanation: 'The median is the value that divides sorted data into two equal halves. Exactly 50% fall below and 50% above — making it the 50th percentile.', hint: 'The median is at the middle = 50% of data below.' },
    { id: 'qp-mc-9', type: 'multiple-choice', question: 'For dataset: 10, 20, 30, 40, 50, 60, 70, 80. What is Q3?', options: [{ id: 'a', text: '55', isCorrect: false, explanation: 'Median = (40+50)/2 = 45. Upper half: {50,60,70,80}. Q3 = (60+70)/2 = 65.' }, { id: 'b', text: '60', isCorrect: false, explanation: 'Q3 = median of {50,60,70,80} = (60+70)/2 = 65.' }, { id: 'c', text: '65', isCorrect: true, explanation: 'n=8. Median = (40+50)/2 = 45. Upper half {50,60,70,80}. Q3 = (60+70)/2 = 65.' }, { id: 'd', text: '70', isCorrect: false, explanation: 'Q3 = median of upper half = (60+70)/2 = 65.' }], explanation: 'n=8. Median between 4th (40) and 5th (50) = 45. Upper half {50,60,70,80}. Q3 = median of upper half = (60+70)/2 = 65.', hint: 'Q3 = median of the upper half.' },
    { id: 'qp-mc-10', type: 'multiple-choice', question: 'A newborn weighs at the 85th percentile for their age group. The pediatrician should:', options: [{ id: 'a', text: 'Be concerned — the baby is too heavy', isCorrect: false, explanation: '85th percentile means above average but within a healthy normal range typically.' }, { id: 'b', text: 'Note the baby is heavier than 85% of same-age babies, which is above average but typically normal', isCorrect: true, explanation: '85th percentile = above 85% of peers. Concerning thresholds are usually >95th or <5th percentile.' }, { id: 'c', text: 'Be concerned — the baby is too light', isCorrect: false, explanation: '85th percentile is ABOVE average, not below.' }, { id: 'd', text: 'Consider the baby to be at the 15th percentile', isCorrect: false, explanation: '85th percentile and 15th percentile are different values.' }], explanation: '85th percentile: the baby is heavier than 85% of same-age babies. This is above average. Clinical concern usually arises at extremes (above 95th or below 5th percentile).', hint: '85th percentile = above 85% of peers = above average weight.' },
    { id: 'qp-mc-11', type: 'multiple-choice', question: 'The first quartile (Q1) is equivalent to which percentile?', options: [{ id: 'a', text: '20th', isCorrect: false, explanation: 'Q1 = 25th percentile.' }, { id: 'b', text: '25th', isCorrect: true, explanation: 'Q1 divides the lowest 25% from the upper 75%.' }, { id: 'c', text: '30th', isCorrect: false, explanation: 'Q1 = 25th, not 30th.' }, { id: 'd', text: '33rd', isCorrect: false, explanation: '33rd would be 1/3 of the data (a tertile), not Q1.' }], explanation: 'Q1 = first quartile = 25th percentile. 25% of values fall below Q1. Q2 = 50th percentile. Q3 = 75th percentile.', hint: 'Quartiles divide data into 4 equal groups. Q1 is the first boundary at 1/4 = 25%.' },
    { id: 'qp-mc-12', type: 'multiple-choice', question: 'What does IQR = Q3 − Q1 measure?', options: [{ id: 'a', text: 'The range of the entire dataset', isCorrect: false, explanation: 'Total range = Max − Min. IQR only covers the middle 50%.' }, { id: 'b', text: 'The spread of the middle 50% of the data', isCorrect: true, explanation: 'IQR captures the spread between the 25th and 75th percentiles — the middle half.' }, { id: 'c', text: 'The average distance from the mean', isCorrect: false, explanation: 'That describes mean absolute deviation or SD.' }, { id: 'd', text: 'The distance between the minimum and Q2', isCorrect: false, explanation: 'Q2 − Min is the range of the lower half, not IQR.' }], explanation: 'IQR = Q3 − Q1 = 75th percentile − 25th percentile. It measures the width of the middle 50% box in a box plot.', hint: 'IQR = range of the middle 50% = Q3 − Q1.' },
    { id: 'qp-mc-13', type: 'multiple-choice', question: 'A dataset has Q1 = 30 and Q3 = 70. What is the IQR?', options: [{ id: 'a', text: '30', isCorrect: false, explanation: 'IQR = Q3 − Q1 = 70 − 30 = 40.' }, { id: 'b', text: '40', isCorrect: true, explanation: 'IQR = 70 − 30 = 40.' }, { id: 'c', text: '50', isCorrect: false, explanation: 'IQR = Q3 − Q1 = 70 − 30 = 40, not 50.' }, { id: 'd', text: '100', isCorrect: false, explanation: '100 would be Q3 + Q1 (sum), not the difference.' }], explanation: 'IQR = Q3 − Q1 = 70 − 30 = 40.', hint: 'IQR = Q3 − Q1.' },
    { id: 'qp-mc-14', type: 'multiple-choice', question: 'If a value falls at exactly Q3, what percentile is it at?', options: [{ id: 'a', text: '50th', isCorrect: false, explanation: '50th percentile = Q2 (median).' }, { id: 'b', text: '75th', isCorrect: true, explanation: 'Q3 = 75th percentile by definition.' }, { id: 'c', text: '25th', isCorrect: false, explanation: '25th = Q1.' }, { id: 'd', text: '100th', isCorrect: false, explanation: '100th = maximum.' }], explanation: 'Q3 = the third quartile = the 75th percentile. 75% of values fall below Q3.', hint: 'Quartile 3 = 75th percentile.' },
    { id: 'qp-mc-15', type: 'multiple-choice', question: 'Why are quartiles considered "resistant" measures of spread?', options: [{ id: 'a', text: 'Because they use squared deviations', isCorrect: false, explanation: 'Quartiles use ranks, not squared deviations.' }, { id: 'b', text: 'Because they are based on ranks/positions, not the actual values of extreme observations', isCorrect: true, explanation: 'An outlier can be replaced with any extreme value without changing Q1 or Q3, since these depend on position.' }, { id: 'c', text: 'Because they always equal the median', isCorrect: false, explanation: 'Q1 and Q3 differ from Q2 (median) in most datasets.' }, { id: 'd', text: 'Because they are not affected by sample size', isCorrect: false, explanation: 'Sample size affects quartile calculations.' }], explanation: 'Quartiles are position-based. Q1 is always the value at the 25th percentile position — changing the extreme values doesn\'t move the 25th or 75th percentile positions. This makes quartiles robust to outliers.', hint: 'Quartiles depend on position (rank) in sorted data, not on actual values.' },
  ],
  keyTakeaway:
    'Quartiles divide sorted data into four equal groups. Q1 = 25th percentile (bottom quarter boundary), Q2 = 50th percentile (median), Q3 = 75th percentile (top quarter boundary). Percentiles generalize this to any rank.',
  visualization: (data) => <QuartilesViz data={data} />,
  datasetGenerator: true,
}

export default function QuartilesAndPercentiles({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
