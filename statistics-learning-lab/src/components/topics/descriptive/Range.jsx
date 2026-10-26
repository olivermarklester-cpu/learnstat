import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { HistogramChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { range as calcRange, mean, median, round } from '../../../utils/stats'

// Fixed dataset
const FIXED = [12, 15, 18, 14, 22, 19, 13]
const fixedRange = calcRange(FIXED)

function RangeViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 25, min: 1, max: 100, distribution: 'uniform' })
  const data = propData ?? ownData
  const liveRange = useMemo(() => (data.length ? round(calcRange(data), 2) : null), [data])
  const liveMin = useMemo(() => (data.length ? Math.min(...data) : null), [data])
  const liveMax = useMemo(() => (data.length ? Math.max(...data) : null), [data])

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
          Min: {liveMin ?? '…'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">
          Max: {liveMax ?? '…'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
          Range: {liveRange ?? '…'}
        </span>
      </div>
      <HistogramChart
        data={data}
        bins={8}
        title="Live Dataset — See How Range Spans the Full Data"
        xLabel="Value"
        yLabel="Count"
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">
        The range is the distance from the leftmost to rightmost bar. Notice how one extreme value can dramatically extend the range.
      </p>
    </div>
  )
}

const content = {
  title: 'Range',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate the range of a dataset and understand its limitations as a measure of spread.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>range</strong> is the simplest measure of spread (also called variability or dispersion). It tells you the distance from the smallest value to the largest value in a dataset.
      </p>
      <p>
        A <strong>large range</strong> means the data is widely spread out — there is a big gap between the smallest and largest values. A <strong>small range</strong> means values are close together.
      </p>
      <p>
        The range is quick to calculate and easy to explain, but it only uses two values — the minimum and maximum — and ignores all the values in between.
      </p>
    </div>
  ),
  analogy:
    'The range is like looking only at the first and last person in a height lineup. You know how tall the tallest person is and how short the shortest person is — but you know nothing about the distribution of everyone in between. Two lineups could have the same tallest and shortest person, but one could have everyone clustered in the middle while the other is spread all over.',
  formula: {
    main: 'Range = Maximum − Minimum',
    variants: [
      { label: 'Range', expression: 'Range = Max − Min', latex: 'Range = Max - Min' },
    ],
    symbolGuide: [
      { symbol: 'Max', meaning: 'The largest value in the dataset' },
      { symbol: 'Min', meaning: 'The smallest value in the dataset' },
      { symbol: 'Range', meaning: 'A single number: the total spread from smallest to largest' },
    ],
  },
  whenToUse: [
    'For a quick, initial description of how spread out data is',
    'When you need a simple number to communicate variability to a non-technical audience',
    'As a first check before choosing a more detailed spread measure',
  ],
  whenNotToUse: [
    'When outliers exist — one extreme value can make the range large even if most values are tightly clustered',
    'When you need a detailed picture of spread — use IQR or standard deviation instead',
    'As the sole measure of variability in any formal analysis',
  ],
  assumptions: [
    'Data must be at least ordinal level (values must be sortable)',
    'Best applied to interval or ratio data where Max − Min is numerically meaningful',
    'The range will be the same for any two datasets that share the same minimum and maximum, regardless of how the other values are distributed',
  ],
  workedExample: {
    scenario: 'Daily patient admissions over a week: 12, 15, 18, 14, 22, 19, 13. Calculate the range.',
    dataset: '[12, 15, 18, 14, 22, 19, 13]',
    steps: [
      { stepNumber: 1, label: 'Identify the minimum', expression: 'Min = 12', result: 'Minimum = 12 patients', explanation: 'Scan the dataset for the smallest value: 12.' },
      { stepNumber: 2, label: 'Identify the maximum', expression: 'Max = 22', result: 'Maximum = 22 patients', explanation: 'Scan the dataset for the largest value: 22.' },
      { stepNumber: 3, label: 'Calculate the range', expression: `Range = 22 − 12 = ${fixedRange}`, result: `Range = ${fixedRange} patients/day`, explanation: 'Subtract: Max − Min = 22 − 12 = 10.' },
    ],
    interpretation: `The range of ${fixedRange} means patient admissions varied by up to 10 patients per day across the week. On the busiest day, 22 patients were admitted; on the quietest day, only 12 — a difference of 10.`,
  },
  interpretation: `A range of ${fixedRange} tells you the total span of the data. But it does not tell you where most values cluster. Two hospitals could both have a range of 10, but one could have admissions evenly spread between 12 and 22, while the other could have most days at 13 admissions with one unusual day at 22.`,
  commonMistakes: [
    {
      mistake: 'Confusing the range with "a set of values"',
      explanation: 'The range is a single number (Max − Min), not a list of values. If someone asks "what is the range?", the answer is one number like 10, not "12 to 22".',
    },
    {
      mistake: 'Using range as the only measure of spread',
      explanation: 'Two datasets can have identical ranges but very different distributions. Dataset A: [1, 5, 5, 5, 9] and Dataset B: [1, 2, 5, 8, 9] both have a range of 8, but Dataset A is tightly clustered around 5 while Dataset B is much more spread.',
    },
    {
      mistake: 'Forgetting that one outlier makes the range misleading',
      explanation: 'If 9 values are between 10 and 15, but one value is 90, the range is 80 — which implies massive spread when most of the data is actually tight. This is why we often prefer the IQR for spread measurement.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'range-easy-1',
        scenario: 'Test scores: 55, 70, 82, 68, 91, 77.',
        question: 'Calculate the range.',
        hint: 'Find the largest and smallest values, then subtract.',
        solution: 'Min = 55, Max = 91. Range = 91 − 55 = 36.',
      },
      {
        id: 'range-easy-2',
        scenario: 'Temperatures (°F): 72, 68, 75, 71, 69.',
        question: 'What is the range?',
        hint: 'You do not need to sort — just find the min and max.',
        solution: 'Min = 68, Max = 75. Range = 75 − 68 = 7°F.',
      },
    ],
    moderate: [
      {
        id: 'range-mod-1',
        scenario: 'Call-center response times (minutes): 2, 3, 4, 3, 5, 4, 2, 45.',
        question: 'Calculate the range. Does this value accurately represent the typical spread of response times? Why or why not?',
        hint: 'Calculate the range, then consider whether the max value is unusual.',
        solution: 'Min = 2, Max = 45. Range = 45 − 2 = 43 minutes. This does NOT accurately represent typical spread. Seven of the eight calls were between 2 and 5 minutes — a span of just 3 minutes. The one extreme call (45 min) inflates the range to 43, giving a misleading impression of how spread out response times usually are.',
      },
      {
        id: 'range-mod-2',
        scenario: 'Two classes took the same exam. Class A: min=50, max=95. Class B: min=60, max=90.',
        question: 'Which class has more spread based on range alone? What additional information would you need to fully compare the spread?',
        hint: 'Calculate both ranges, then think about what range cannot tell you.',
        solution: 'Class A range = 95−50 = 45. Class B range = 90−60 = 30. Class A has more spread by range. However, range only uses two values. Class A might have most students clustered near 80 with just one low scorer at 50 and one high scorer at 95. To fully compare spread, you would want the IQR (middle 50%) or standard deviation (average distance from the mean).',
      },
    ],
    challenging: [
      {
        id: 'range-chal-1',
        scenario: 'A quality control team samples 10 products for a measurement (in mm): 99.8, 100.1, 100.0, 100.2, 99.9, 100.1, 100.0, 100.3, 99.7, 99.9.',
        question: 'Calculate the range. Knowing the acceptable production tolerance is ±0.5mm from 100mm, what does the range tell you about product quality?',
        hint: 'Range = 100.3 − 99.7. Compare this to the acceptable band (99.5 to 100.5).',
        solution: 'Min = 99.7, Max = 100.3. Range = 100.3 − 99.7 = 0.6mm. The acceptable band is 99.5 to 100.5 (a width of 1.0mm). The range of 0.6mm fits within this band — all products measured are within tolerance. The range here is a useful quick check: if range > 1.0mm, at least one product must be out of spec.',
      },
      {
        id: 'range-chal-2',
        scenario: 'Salaries at a small company: $38k, $42k, $45k, $47k, $50k, $52k, $55k, $180k (CEO).',
        question: 'Calculate the range. Explain why the range is a poor summary of salary spread here, and suggest a better measure.',
        hint: 'The CEO salary is a strong outlier. What would the range be without the CEO?',
        solution: 'Range = 180k − 38k = $142,000. Without the CEO, range = 55k − 38k = $17,000. The CEO\'s salary is a massive outlier that inflates the range from $17k to $142k — over 8 times larger. The range gives the impression that salaries are extremely spread, when 7 of 8 employees are within a narrow $17k band. A better measure is the IQR (which only uses the middle 50%) or standard deviation.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'range-kc-1',
      type: 'multiple-choice',
      question: 'Dataset: 5, 8, 12, 3, 19, 7. What is the range?',
      options: [
        { id: 'a', text: '14', isCorrect: false, explanation: 'Check: what are the actual minimum and maximum values?' },
        { id: 'b', text: '16', isCorrect: true, explanation: 'Correct! Min = 3, Max = 19. Range = 19 − 3 = 16.' },
        { id: 'c', text: '19', isCorrect: false, explanation: '19 is the maximum value, not the range. Range = Max − Min.' },
        { id: 'd', text: '9', isCorrect: false, explanation: 'Check: what is the minimum and maximum of this dataset?' },
      ],
      explanation: 'Min = 3, Max = 19. Range = 19 − 3 = 16.',
      hint: 'Find the largest and smallest values, then subtract.',
    },
    {
      id: 'range-kc-2',
      type: 'multiple-choice',
      question: 'Two datasets both have a range of 20. Which statement is DEFINITELY true?',
      options: [
        { id: 'a', text: 'They have the same standard deviation', isCorrect: false, explanation: 'Range and standard deviation are independent. Same range can have very different SDs.' },
        { id: 'b', text: 'They have the same mean', isCorrect: false, explanation: 'Range says nothing about where the center is.' },
        { id: 'c', text: 'The difference between their largest and smallest values is the same', isCorrect: true, explanation: 'Correct! Range = Max − Min = 20 for both. That is the only thing guaranteed to be equal.' },
        { id: 'd', text: 'Their distributions have the same shape', isCorrect: false, explanation: 'Many different shapes can produce the same range.' },
      ],
      explanation: 'The only thing guaranteed when two datasets share the same range is that Max − Min is equal. The distributions, means, and standard deviations can all differ.',
      hint: 'What does the range literally tell you — and only tell you?',
    },
    {
      id: 'range-kc-3',
      type: 'numerical',
      question: 'Dataset: 23, 17, 31, 29, 14, 26. What is the range?',
      answer: 17,
      tolerance: 0,
      explanation: 'Min = 14, Max = 31. Range = 31 − 14 = 17.',
      hint: 'Identify the minimum and maximum, then subtract.',
    },
    {
      id: 'range-kc-4',
      type: 'multiple-choice',
      question: 'Why is the range considered a "weak" measure of spread compared to the IQR?',
      options: [
        { id: 'a', text: 'The range is harder to calculate', isCorrect: false, explanation: 'The range is actually the easiest spread measure to calculate.' },
        { id: 'b', text: 'The range can only be used for large datasets', isCorrect: false, explanation: 'Range works for any dataset size.' },
        { id: 'c', text: 'The range only uses two values (min and max) and is heavily influenced by outliers', isCorrect: true, explanation: 'Correct! The range ignores all data points except the extreme two, making it very sensitive to outliers.' },
        { id: 'd', text: 'The range cannot be calculated for skewed data', isCorrect: false, explanation: 'Range can be calculated for any numerical data regardless of skew.' },
      ],
      explanation: 'The IQR uses the middle 50% of data, so it is much more resistant to extreme values. The range can change dramatically with just one outlier.',
      hint: 'How many data points does the range actually use?',
    },
    {
      id: 'range-kc-5',
      type: 'multiple-choice',
      question: 'You add one extremely large value to a dataset. Which measure will change the MOST?',
      options: [
        { id: 'a', text: 'Median', isCorrect: false, explanation: 'The median shifts only slightly because it depends on position, not value magnitude.' },
        { id: 'b', text: 'Mode', isCorrect: false, explanation: 'Mode depends on frequency — one new value rarely changes which value appears most.' },
        { id: 'c', text: 'Range', isCorrect: true, explanation: 'Correct! If the new value is larger than the current maximum, the range immediately jumps by the full difference.' },
        { id: 'd', text: 'IQR', isCorrect: false, explanation: 'The IQR only uses Q1 and Q3 (middle 50%), so extreme values rarely affect it.' },
      ],
      explanation: 'Range = Max − Min. Adding a new maximum value directly changes the range. The IQR, median, and mode are all much more resistant.',
      hint: 'Which measure directly depends on the maximum value?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'rng-tf-1', type: 'true-false', question: 'The range is computed as Maximum − Minimum.', isTrue: true, explanation: 'Range = Max − Min. It is the simplest measure of spread: the total width of the dataset from smallest to largest value.' },
    { id: 'rng-tf-2', type: 'true-false', question: 'Adding a constant to every value in a dataset changes the range.', isTrue: false, explanation: 'Adding a constant shifts all values by the same amount, so the gap between max and min stays the same. Range = (Max + c) − (Min + c) = Max − Min. The range is unchanged.' },
    { id: 'rng-tf-3', type: 'true-false', question: 'The range uses only two values from the entire dataset.', isTrue: true, explanation: 'Range = Max − Min. Only the largest and smallest values are used. All the values in between are completely ignored, which is the range\'s main weakness.' },
    { id: 'rng-tf-4', type: 'true-false', question: 'A range of zero means all values in the dataset are identical.', isTrue: true, explanation: 'If Range = 0, then Max = Min, meaning every value is the same. No variation exists in the data.' },
    { id: 'rng-tf-5', type: 'true-false', question: 'The range is resistant to outliers.', isTrue: false, explanation: 'The range is extremely sensitive to outliers. Since it uses only the maximum and minimum, a single extreme value directly inflates the range, making it a poor measure of typical spread.' },
    { id: 'rng-tf-6', type: 'true-false', question: 'Two datasets can have the same range but very different distributions.', isTrue: true, explanation: 'Range only captures the extremes. Datasets like [0, 50, 100] and [0, 1, 2, 98, 99, 100] can have the same range (100) but completely different internal distributions.' },
    { id: 'rng-tf-7', type: 'true-false', question: 'Multiplying every value by 2 doubles the range.', isTrue: true, explanation: 'New Max = 2×Max, New Min = 2×Min. New Range = 2×Max − 2×Min = 2(Max − Min) = 2 × Range. Multiplying all values by a constant k multiplies the range by k.' },
    { id: 'rng-tf-8', type: 'true-false', question: 'The range can never be negative.', isTrue: true, explanation: 'Range = Max − Min. Since Max ≥ Min by definition, Range ≥ 0 always. Range = 0 when all values are equal; Range > 0 when there is any variation.' },
    { id: 'rng-tf-9', type: 'true-false', question: 'The range is a better measure of spread than the standard deviation.', isTrue: false, explanation: 'The standard deviation uses all values (not just extremes), is not affected as dramatically by a single outlier, and is foundational for many statistical tests. Range is simpler but inferior as a general-purpose spread measure.' },
    { id: 'rng-tf-10', type: 'true-false', question: 'The range accounts for the spread of the middle 50% of data.', isTrue: false, explanation: 'The range uses only the maximum and minimum — it says nothing about the middle 50%. The IQR (Q3 − Q1) specifically measures the spread of the middle 50% and is much more informative about typical spread.' },
    { id: 'rng-tf-11', type: 'true-false', question: 'For a dataset [4, 8, 15, 16, 23], the range is 19.', isTrue: true, explanation: 'Range = Max − Min = 23 − 4 = 19.' },
    { id: 'rng-tf-12', type: 'true-false', question: 'The range is the most appropriate measure of spread for data with extreme outliers.', isTrue: false, explanation: 'One extreme outlier can massively inflate the range, making it misleading. For data with outliers, IQR (which measures middle 50%) or a robust alternative should be used.' },
    { id: 'rng-tf-13', type: 'true-false', question: 'Two datasets with the same mean and same range must have the same standard deviation.', isTrue: false, explanation: 'Same mean and range do NOT guarantee same SD. The SD depends on how all values are distributed around the mean, not just the extremes.' },
    { id: 'rng-tf-14', type: 'true-false', question: 'The range is always greater than or equal to the IQR.', isTrue: true, explanation: 'Range = Max − Min uses the absolute extremes; IQR = Q3 − Q1 uses the 25th and 75th percentiles. Since Q1 ≥ Min and Q3 ≤ Max, Range ≥ IQR always.' },
    { id: 'rng-tf-15', type: 'true-false', question: 'The range provides no information about how values are clustered within the dataset.', isTrue: true, explanation: 'Range only tells you the total width of the data. It reveals nothing about clustering, central tendency, or the distribution of values between the extremes.' },
    { id: 'rng-tf-16', type: 'true-false', question: 'A small range always means low variability in a dataset.', isTrue: false, explanation: 'A small range means the data is confined to a narrow band, which does suggest limited variability in terms of extremes. However, within that narrow band, values could be uniformly spread or tightly clustered — range doesn\'t tell you which.' },
    { id: 'rng-tf-17', type: 'true-false', question: 'The range is useful for identifying the minimum and maximum values of a variable.', isTrue: true, explanation: 'While range\'s main purpose is measuring spread, computing it requires finding the min and max, which is useful for identifying the bounds of the data.' },
    { id: 'rng-tf-18', type: 'true-false', question: 'The range of a dataset is the same whether you measure it on a sample or the population.', isTrue: false, explanation: 'A sample will rarely contain the true population maximum and minimum. The sample range is almost always smaller than (or equal to) the population range.' },
    { id: 'rng-tf-19', type: 'true-false', question: 'In quality control, the range is used in R-charts to monitor process variability.', isTrue: true, explanation: 'R-charts (range charts) track the sample range across time periods. They are a simple, fast way to monitor whether process variability is stable.' },
    { id: 'rng-tf-20', type: 'true-false', question: 'The range of the dataset [−5, −3, −1, 2, 4] is −9.', isTrue: false, explanation: 'Range = Max − Min = 4 − (−5) = 4 + 5 = 9. Range is always non-negative.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'rng-mc-6', type: 'multiple-choice', question: 'Dataset A: 10, 20, 30, 40, 50. Dataset B: 10, 10, 30, 50, 50. Which statement is true?', options: [{ id: 'a', text: 'Dataset A has a larger range', isCorrect: false, explanation: 'Both have Range = 50 − 10 = 40.' }, { id: 'b', text: 'Dataset B has a larger range', isCorrect: false, explanation: 'Both have Range = 50 − 10 = 40.' }, { id: 'c', text: 'Both have the same range but different distributions', isCorrect: true, explanation: 'Range is equal (40 for both), but A is evenly spaced while B clusters at the extremes.' }, { id: 'd', text: 'Range cannot be compared across datasets', isCorrect: false, explanation: 'Range can be compared; the limitation is what it tells you about the distribution.' }], explanation: 'Both datasets have Min=10, Max=50, so Range=40 for both. But the internal distribution is different — A is uniform spacing; B is concentrated at extremes. This illustrates the range\'s limitation.', hint: 'What are the Min and Max for each dataset?' },
    { id: 'rng-mc-7', type: 'multiple-choice', question: 'A factory monitors the daily output. Dataset: [95, 97, 98, 99, 100, 102, 103]. A new day records only 50 units. How does the range change?', options: [{ id: 'a', text: 'Stays the same (range = 8)', isCorrect: false, explanation: 'Adding 50 creates a new minimum far below 95.' }, { id: 'b', text: 'Increases dramatically (new range = 53)', isCorrect: true, explanation: 'Original range: 103 − 95 = 8. New range: 103 − 50 = 53. One outlier massively inflates the range.' }, { id: 'c', text: 'Decreases slightly', isCorrect: false, explanation: 'Adding a value below the current minimum always increases the range.' }, { id: 'd', text: 'Increases by 8', isCorrect: false, explanation: 'The new minimum is 50, so the new range is 103 − 50 = 53.' }], explanation: 'Original range = 103 − 95 = 8. New range = 103 − 50 = 53. Adding one extreme low value (50) increases the range from 8 to 53. This demonstrates how sensitive the range is to outliers.', hint: 'The new minimum is 50. New range = new max − new min.' },
    { id: 'rng-mc-8', type: 'multiple-choice', question: 'Which measure of spread BEST accounts for the distribution of all values, not just the extremes?', options: [{ id: 'a', text: 'Range', isCorrect: false, explanation: 'Range uses only min and max.' }, { id: 'b', text: 'Standard deviation', isCorrect: true, explanation: 'SD incorporates every value in its calculation through squared deviations from the mean.' }, { id: 'c', text: 'Maximum', isCorrect: false, explanation: 'Maximum is a single value, not a spread measure.' }, { id: 'd', text: 'Minimum', isCorrect: false, explanation: 'Minimum is a single value, not a spread measure.' }], explanation: 'Standard deviation = √[Σ(xᵢ − x̄)² / (n−1)]. Every value contributes to the calculation. Range only uses two values (min, max) and ignores everything else.', hint: 'Which measure\'s formula includes every observation?' },
    { id: 'rng-mc-9', type: 'multiple-choice', question: 'What is the range of: −3, −1, 0, 2, 5?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'Range = Max − Min = 5 − (−3) = 8.' }, { id: 'b', text: '8', isCorrect: true, explanation: 'Max = 5, Min = −3. Range = 5 − (−3) = 5 + 3 = 8.' }, { id: 'c', text: '2', isCorrect: false, explanation: 'That is the max of the positive values, not the range.' }, { id: 'd', text: '3', isCorrect: false, explanation: 'Remember: Min = −3, a negative number.' }], explanation: 'Range = Max − Min = 5 − (−3) = 5 + 3 = 8. Careful with negative minimums — subtracting a negative = adding.', hint: 'Range = Max − Min. Watch out for the negative minimum.' },
    { id: 'rng-mc-10', type: 'multiple-choice', question: 'In what situation is the range MOST useful as a quick measure of spread?', options: [{ id: 'a', text: 'When the data contains several extreme outliers', isCorrect: false, explanation: 'Outliers inflate the range, making it misleading.' }, { id: 'b', text: 'When data is heavily right-skewed', isCorrect: false, explanation: 'Skewed data often has one very extreme value that distorts the range.' }, { id: 'c', text: 'As a quick initial check before more detailed analysis', isCorrect: true, explanation: 'Range is fast to compute and immediately shows the full span of data. It is best as a first-pass summary.' }, { id: 'd', text: 'For making inferences about the population spread', isCorrect: false, explanation: 'Range is a poor estimator of population spread.' }], explanation: 'Range\'s biggest strength is speed and simplicity. It is calculated instantly and gives you the total span of the data. It is most valuable as a first, quick look before applying more rigorous measures.', hint: 'When does the simplicity of range justify its use despite its limitations?' },
    { id: 'rng-mc-11', type: 'multiple-choice', question: 'The temperatures (°C) in a week were: 12, 14, 15, 16, 13, 11, 17. What is the range?', options: [{ id: 'a', text: '4', isCorrect: false, explanation: 'Check: Max = 17, Min = 11. Range = 17 − 11 = 6.' }, { id: 'b', text: '5', isCorrect: false, explanation: 'Max = 17, Min = 11. Range = 6, not 5.' }, { id: 'c', text: '6', isCorrect: true, explanation: 'Max = 17, Min = 11. Range = 17 − 11 = 6.' }, { id: 'd', text: '7', isCorrect: false, explanation: 'That would require Max − Min = 7, but 17 − 11 = 6.' }], explanation: 'Sorted: 11, 12, 13, 14, 15, 16, 17. Min = 11, Max = 17. Range = 17 − 11 = 6.', hint: 'Find the max and min first.' },
    { id: 'rng-mc-12', type: 'multiple-choice', question: 'A dataset has values: 3, 7, 7, 7, 9. If you add 100 to the dataset, the range becomes:', options: [{ id: 'a', text: '6', isCorrect: false, explanation: 'Original range = 9 − 3 = 6. But 100 becomes the new max.' }, { id: 'b', text: '97', isCorrect: true, explanation: 'New range = 100 − 3 = 97. The new maximum (100) replaces 9.' }, { id: 'c', text: '100', isCorrect: false, explanation: 'Range = 100 − 3 = 97, not 100.' }, { id: 'd', text: '94', isCorrect: false, explanation: 'Range = 100 − 3 = 97, not 100 − 6 = 94.' }], explanation: 'Original: Min=3, Max=9, Range=6. After adding 100: Min=3, Max=100, Range=97. One extreme value changed the range from 6 to 97 — demonstrating how sensitive range is to outliers.', hint: 'What are the new Min and Max after adding 100?' },
    { id: 'rng-mc-13', type: 'multiple-choice', question: 'Why does range fail to distinguish between these two datasets? A: [1, 50, 100] and B: [1, 2, 98, 99, 100].', options: [{ id: 'a', text: 'Range cannot handle more than 3 values', isCorrect: false, explanation: 'Range works for any n ≥ 2.' }, { id: 'b', text: 'Both have the same range (99), but different internal distributions', isCorrect: true, explanation: 'Both span from 1 to 100 (Range=99), but A has one middle value (50) while B has values clustered at the extremes.' }, { id: 'c', text: 'Range is only valid when n > 5', isCorrect: false, explanation: 'n does not affect whether range is computable.' }, { id: 'd', text: 'The datasets are too different to compare', isCorrect: false, explanation: 'Range can compare them; it just fails to distinguish their internal structures.' }], explanation: 'Both datasets: Min=1, Max=100, Range=99. But A is spread throughout the range (1, 50, 100) while B has values at the extremes with nothing in between. Range sees them as identical.', hint: 'Are the min and max the same for both datasets?' },
    { id: 'rng-mc-14', type: 'multiple-choice', question: 'If the range of a dataset is 0, what can you conclude?', options: [{ id: 'a', text: 'The mean is also 0', isCorrect: false, explanation: 'Range = 0 means all values are equal, but they could all be equal to any number (like 5, -10, etc.).' }, { id: 'b', text: 'All values in the dataset are identical', isCorrect: true, explanation: 'Range = Max − Min = 0 → Max = Min → all values are the same number.' }, { id: 'c', text: 'The dataset has no variation because n is small', isCorrect: false, explanation: 'n does not determine the range.' }, { id: 'd', text: 'The median equals the maximum', isCorrect: false, explanation: 'If all values are equal, median does equal max/min, but the primary conclusion is about identical values.' }], explanation: 'Range = 0 means Max = Min. If the biggest and smallest values are equal, every value must be equal. There is zero variability in the data.', hint: 'If Max = Min, what does that tell you about all the values in between?' },
    { id: 'rng-mc-15', type: 'multiple-choice', question: 'Which of the following is a key weakness of the range as a measure of spread?', options: [{ id: 'a', text: 'It requires calculating the mean first', isCorrect: false, explanation: 'Range does not use the mean. Just Max − Min.' }, { id: 'b', text: 'It cannot be computed for odd-sized datasets', isCorrect: false, explanation: 'Range has no restriction on n.' }, { id: 'c', text: 'A single outlier can completely change the range', isCorrect: true, explanation: 'One extreme value becomes the new max or min, fundamentally changing the range.' }, { id: 'd', text: 'It always underestimates the true spread', isCorrect: false, explanation: 'Range is the MAXIMUM possible spread in the data — if anything, it may overestimate typical spread.' }], explanation: 'Range\'s critical weakness: it is entirely determined by two values (min and max). One extreme outlier makes the range jump dramatically, misrepresenting the typical spread of the data.', hint: 'Range = Max − Min. What happens when one extreme value is added or changed?' },
  ],
  keyTakeaway:
    'The range is the quickest measure of spread (Max − Min), but it is sensitive to outliers and ignores everything in between. Always pair it with the IQR or standard deviation for a complete picture.',
  visualization: (data) => <RangeViz data={data} />,
  datasetGenerator: true,
}

export default function Range({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
