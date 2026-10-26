import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { HistogramChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { mean, median, mode, round } from '../../../utils/stats'


// Fixed dataset for worked example
const FIXED = [5, 7, 7, 9, 12]
const fixedMean = mean(FIXED)
const fixedMedian = median(FIXED)
const fixedMode = mode(FIXED)

function MeanMedianModeViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 30, min: 1, max: 50, distribution: 'normal' })
  const data = propData ?? ownData
  const liveMean = useMemo(() => (data.length ? round(mean(data), 2) : null), [data])
  const liveMedian = useMemo(() => (data.length ? round(median(data), 2) : null), [data])

  return (
    <div>
      <div className="flex gap-4 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
          <span className="w-3 h-0.5 bg-red-500 inline-block rounded" style={{ borderTop: '2px dashed #ef4444', display: 'inline-block', height: '0px', width: '16px' }} />
          Mean: {liveMean ?? '…'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-4 h-0.5 bg-emerald-500 inline-block rounded" />
          Median: {liveMedian ?? '…'}
        </span>
      </div>
      <HistogramChart
        data={data}
        bins={10}
        title="Live Dataset — Frequency Distribution"
        xLabel="Value"
        yLabel="Count"
        showMean
        showMedian
        height={260}
      />
      <p className="text-xs text-gray-500 mt-2">
        Dataset updates each time you click "New Dataset" above. Watch the mean (red) and median (green) markers shift as the distribution changes.
      </p>
    </div>
  )
}

const content = {
  title: 'Mean, Median, and Mode',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate and interpret the mean, median, and mode of a dataset, and know when to use each measure of center.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The mean, median, and mode are three ways to describe the "center" of a dataset — the typical or average value. They each answer the question <em>"What is a typical value?"</em> in a slightly different way:
      </p>
      <ul className="space-y-2 ml-4">
        <li><strong>Mean:</strong> Add up all values and divide by how many there are. The mathematical average. It uses every value in the calculation.</li>
        <li><strong>Median:</strong> Sort the values and find the one in the middle. If there are an even number of values, take the average of the two middle values. Not affected by extreme values.</li>
        <li><strong>Mode:</strong> The value that appears most often. Can be used with non-numeric data. A dataset can have no mode, one mode (unimodal), or multiple modes (bimodal, multimodal).</li>
      </ul>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>Imagine five friends earn these weekly salaries: <strong>$400, $420, $430, $440, $5,000</strong> (one friend is a CEO).</p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Mean</strong> = ($400+$420+$430+$440+$5,000) / 5 = <strong>$1,338</strong> — but no one actually earns near $1,338! The CEO's salary pulled the mean up.</li>
        <li><strong>Median</strong> = <strong>$430</strong> — the middle value when sorted. This better represents the typical friend.</li>
        <li><strong>Mode</strong> = none (all different).</li>
      </ul>
      <p className="text-sm text-gray-600 mt-1">This shows why the mean can be misleading when there are extreme values (outliers).</p>
    </div>
  ),
  formula: {
    main: 'x̄ = Σx / n',
    variants: [
      { label: 'Sample mean', expression: 'x̄ = Σx / n', latex: '\\bar{x} = \\frac{\\sum x}{n}' },
      { label: 'Population mean', expression: 'μ = Σx / N', latex: '\\mu = \\frac{\\sum x}{N}' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean (read "x-bar")' },
      { symbol: 'μ', meaning: 'Population mean (read "mu")' },
      { symbol: 'Σ', meaning: 'Sum of all values (capital sigma — "add them all up")' },
      { symbol: 'x', meaning: 'Each individual value in the dataset' },
      { symbol: 'n', meaning: 'Number of observations in the sample' },
      { symbol: 'N', meaning: 'Number of observations in the population' },
    ],
  },
  whenToUse: [
    'Mean: when data is roughly symmetric with no extreme outliers (interval or ratio level)',
    'Median: when data is skewed or has outliers — always safe for ordinal data',
    'Mode: when you want the most common category; required for nominal data; useful for discrete data',
  ],
  whenNotToUse: [
    'Mean: when data is heavily skewed or has outliers (use median instead)',
    'Median: when you need to use the result in further calculations that require the mean',
    'Mode: when all values are unique — there is no mode',
  ],
  assumptions: [
    'Mean assumes interval or ratio level data (equal gaps between values)',
    'Median can be used with ordinal, interval, or ratio data',
    'Mode can be used with any level of measurement, including nominal (categories)',
    'Mean is most useful when the distribution is roughly symmetric (bell-shaped)',
  ],
  workedExample: {
    scenario: 'Patient waiting times (minutes): 5, 7, 7, 9, 12. Calculate the mean, median, and mode.',
    dataset: '[5, 7, 7, 9, 12]',
    steps: [
      { stepNumber: 1, label: 'Calculate the Mean — add all values', expression: '5 + 7 + 7 + 9 + 12 = 40', result: 'Sum = 40', explanation: 'Include every value, even duplicates like the two 7s.' },
      { stepNumber: 2, label: 'Mean — divide by count', expression: `40 / 5 = ${fixedMean}`, result: `Mean = ${fixedMean} minutes`, explanation: 'There are n = 5 observations, so we divide by 5.' },
      { stepNumber: 3, label: 'Calculate the Median — sort the data', expression: '5, 7, 7, 9, 12 (already sorted)', result: 'Sorted: 5, 7, 7, 9, 12', explanation: 'Always sort before finding the median.' },
      { stepNumber: 4, label: 'Median — find the middle position', expression: 'n = 5 (odd) → position = (5+1)/2 = 3rd value', result: `Median = ${fixedMedian} minutes`, explanation: 'The 3rd value in the sorted list is 7. For even n, average the two middle values.' },
      { stepNumber: 5, label: 'Calculate the Mode — count frequencies', expression: '5→1, 7→2, 9→1, 12→1', result: `Mode = ${fixedMode[0]} minutes`, explanation: '7 appears twice — more than any other value — so it is the mode.' },
    ],
    interpretation: `The mean (${fixedMean} min) is slightly higher than the median (${fixedMedian} min) because 12 is pulling the mean up. The mode (${fixedMode[0]} min) confirms that 7 minutes was the most common experience. All three measures are close, indicating a roughly symmetric small dataset.`,
  },
  interpretation: `The mean (${fixedMean} min) is slightly higher than the median (${fixedMedian} min) because the value 12 is pulling the mean up. The mode (${fixedMode[0]} min) confirms that 7 minutes was the most common waiting time. For this small dataset, all three give similar answers — in datasets with strong skew or outliers, the mean and median will diverge more dramatically.`,
  commonMistakes: [
    { mistake: 'Not sorting data before finding the median', explanation: 'If you skip sorting, you will pick the wrong middle value. Always sort first — even if the values look close together.' },
    { mistake: 'Forgetting repeated values when calculating the mean', explanation: 'Every value must be included, even duplicates. The dataset [5, 7, 7, 9, 12] has five values, not four — the two 7s are each counted separately.' },
    { mistake: 'Assuming the mean always equals the median', explanation: 'They only match in a perfectly symmetric distribution. In skewed data (like income), they diverge — sometimes by a large amount.' },
    { mistake: 'Reporting "no mode" when a value appears twice', explanation: 'If any value appears more often than all the others, it IS the mode. You only say "no mode" when every value appears exactly once.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'mmm-easy-1',
        scenario: 'Dataset: 3, 5, 5, 7, 10.',
        question: 'Find the mean, median, and mode.',
        hint: 'Sort first. Then add for mean, find the middle for median, and count for mode.',
        solution: 'Mean: (3+5+5+7+10)/5 = 30/5 = 6. Median: sorted 3,5,5,7,10 → middle = 5. Mode: 5 (appears twice, more than any other value).',
      },
      {
        id: 'mmm-easy-2',
        scenario: 'Dataset: 10, 20, 30, 40, 50.',
        question: 'Find the mean and median.',
        hint: 'For the median with 5 values, the middle is the 3rd value.',
        solution: 'Mean: (10+20+30+40+50)/5 = 150/5 = 30. Median: 3rd value = 30. Mean = Median, which makes sense for this perfectly symmetric dataset.',
      },
    ],
    moderate: [
      {
        id: 'mmm-mod-1',
        scenario: 'A hospital records 7 patient waiting times: 12, 8, 9, 15, 8, 11, 10 minutes. Then a new patient arrives and waits 45 minutes.',
        question: 'How does this outlier (45 min) affect the mean vs. the median?',
        hint: 'Calculate each statistic with and without the outlier, then compare.',
        solution: 'Without outlier (n=7): mean = (12+8+9+15+8+11+10)/7 ≈ 10.43, median = sorted [8,8,9,10,11,12,15] → 4th value = 10. With outlier (n=8): mean = (73+45)/8 = 118/8 = 14.75, median = average of 4th and 5th sorted values = (10+11)/2 = 10.5. Mean increased by 4.32 minutes; median increased by only 0.5 minutes — showing the median is far more resistant to outliers.',
      },
      {
        id: 'mmm-mod-2',
        scenario: 'Exam scores: 72, 85, 91, 68, 74, 91, 88, 77.',
        question: 'Find the mean, median, and mode.',
        hint: 'Sort: 68, 72, 74, 77, 85, 88, 91, 91. For even n, average the two middle values.',
        solution: 'Mean: (72+85+91+68+74+91+88+77)/8 = 646/8 = 80.75. Median: sorted [68,72,74,77,85,88,91,91] → average of 4th and 5th = (77+85)/2 = 81. Mode: 91 (appears twice).',
      },
    ],
    challenging: [
      {
        id: 'mmm-chal-1',
        scenario: 'Five employees earn: $42,000, $45,000, $48,000, $51,000, and $54,000. The company hires a manager at $150,000.',
        question: 'Which measure of center best represents a typical employee\'s salary, and why?',
        hint: 'Calculate the mean and median both with and without the manager.',
        solution: 'With manager (n=6): mean = (42k+45k+48k+51k+54k+150k)/6 = 390k/6 = $65,000. Median = average of 3rd and 4th = (48k+51k)/2 = $49,500. The median ($49,500) is more representative — 5 of the 6 employees earn less than the mean of $65,000. The manager\'s salary is an outlier that inflates the mean.',
      },
      {
        id: 'mmm-chal-2',
        scenario: 'A survey of 9 customers gave satisfaction ratings (1–5): 4, 5, 3, 5, 4, 5, 2, 4, 5.',
        question: 'Find all three measures. Is the mean an appropriate summary here?',
        hint: 'Consider the level of measurement — satisfaction ratings are ordinal.',
        solution: 'Sorted: 2,3,4,4,4,5,5,5,5. Mean = (4+5+3+5+4+5+2+4+5)/9 = 37/9 ≈ 4.11. Median = 5th value = 4. Mode = 5 (appears 4 times). The mean is debatable here — satisfaction is ordinal data, and the gaps between 1, 2, 3, 4, 5 may not be equal. The mode (5) and median (4) are safer summaries.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'mmm-kc-1',
      type: 'multiple-choice',
      question: 'Which measure of center is MOST affected by outliers?',
      options: [
        { id: 'a', text: 'Mode', isCorrect: false, explanation: 'Mode only counts frequency — the size of a value does not change how often it appears.' },
        { id: 'b', text: 'Median', isCorrect: false, explanation: 'The median is based on position in sorted data, not the actual value, so extreme values barely shift it.' },
        { id: 'c', text: 'Mean', isCorrect: true, explanation: 'Correct! The mean includes every value in the sum, so one extreme value can shift it significantly.' },
        { id: 'd', text: 'All equally', isCorrect: false, explanation: 'They respond to outliers very differently — the mean is most sensitive.' },
      ],
      explanation: 'The mean sums all values and divides. A single extreme value (outlier) changes the sum and therefore the mean. The median only shifts slightly because it depends on position, not magnitude.',
      hint: 'Which measure includes every value in its arithmetic calculation?',
    },
    {
      id: 'mmm-kc-2',
      type: 'multiple-choice',
      question: 'A dataset has values: 2, 2, 2, 2, 100. What is the median?',
      options: [
        { id: 'a', text: '2', isCorrect: true, explanation: 'Correct! Sorted: 2,2,2,2,100. With n=5, the middle (3rd) value is 2.' },
        { id: 'b', text: '21.6', isCorrect: false, explanation: 'That is the mean: (2+2+2+2+100)/5 = 108/5 = 21.6. The median is different.' },
        { id: 'c', text: '100', isCorrect: false, explanation: '100 is the maximum value, not the middle value.' },
        { id: 'd', text: '4', isCorrect: false, explanation: 'The median is the 3rd value in sorted order, which is 2.' },
      ],
      explanation: 'Sorted: 2, 2, 2, 2, 100. With 5 values, the middle is the 3rd value = 2. The extreme value of 100 does not affect the median.',
      hint: 'Sort first, then find the middle position.',
    },
    {
      id: 'mmm-kc-3',
      type: 'numerical',
      question: 'Find the mean of: 10, 14, 18, 22, 26.',
      answer: 18,
      tolerance: 0.1,
      explanation: 'Sum = 10+14+18+22+26 = 90. Count = 5. Mean = 90/5 = 18.',
      hint: 'Add all five values, then divide by 5.',
    },
    {
      id: 'mmm-kc-4',
      type: 'multiple-choice',
      question: 'Data: 4, 6, 6, 8, 10, 10, 12. How many modes are there?',
      options: [
        { id: 'a', text: 'None', isCorrect: false, explanation: 'There are values that appear more than once.' },
        { id: 'b', text: 'One', isCorrect: false, explanation: 'Check the frequencies — more than one value repeats.' },
        { id: 'c', text: 'Two', isCorrect: true, explanation: 'Correct! 6 appears twice and 10 appears twice — this is a bimodal dataset.' },
        { id: 'd', text: 'Three', isCorrect: false, explanation: 'Only 6 and 10 appear twice; 4, 8, and 12 each appear once.' },
      ],
      explanation: '6 appears 2 times, 10 appears 2 times, all others appear 1 time. Two values tie for most frequent = bimodal.',
      hint: 'Count how many times each value appears. Any value that ties for most frequent is a mode.',
    },
    {
      id: 'mmm-kc-5',
      type: 'multiple-choice',
      question: 'When should you prefer the median over the mean?',
      options: [
        { id: 'a', text: 'When data is symmetric', isCorrect: false, explanation: 'When data is symmetric, mean and median are similar — either works.' },
        { id: 'b', text: 'When data has outliers or is skewed', isCorrect: true, explanation: 'Correct! The median is resistant to outliers and skew, making it the better center measure in those cases.' },
        { id: 'c', text: 'When n is large', isCorrect: false, explanation: 'Sample size does not determine whether you should use mean or median — the distribution shape does.' },
        { id: 'd', text: 'When data is nominal', isCorrect: false, explanation: 'Nominal data has no ordering, so neither mean nor median applies — use the mode.' },
      ],
      explanation: 'The median is based on rank/position, not value size, so extreme values do not pull it. Use median when the data is skewed or contains outliers.',
      hint: 'Think about income data — a few very high earners would inflate the mean. Which measure stays closer to "typical"?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'mmm-tf-1', type: 'true-false', question: 'The mean is always equal to the median.', isTrue: false, explanation: 'Mean = median only when the distribution is perfectly symmetric. In skewed distributions or those with outliers, they differ — the mean is pulled toward the tail while the median stays near the center of the data.' },
    { id: 'mmm-tf-2', type: 'true-false', question: 'The mode is the only measure of central tendency appropriate for nominal (categorical) data.', isTrue: true, explanation: 'Nominal data has no meaningful order or arithmetic, so you cannot compute a median (needs ordering) or mean (needs arithmetic). Mode — the most frequent category — is the only valid measure of center.' },
    { id: 'mmm-tf-3', type: 'true-false', question: 'A dataset can have more than one mode.', isTrue: true, explanation: 'If two values occur equally often (both appearing most frequently), the dataset is bimodal. If three or more values tie, it is multimodal. A dataset with all unique values has no mode.' },
    { id: 'mmm-tf-4', type: 'true-false', question: 'Adding a constant to every value in a dataset does not change the mean.', isTrue: false, explanation: 'Adding a constant c to every value shifts the mean by c: new mean = old mean + c. For example, adding 5 to every value in [2,4,6] changes the mean from 4 to 9.' },
    { id: 'mmm-tf-5', type: 'true-false', question: 'The median of an even-numbered dataset is the average of the two middle values.', isTrue: true, explanation: 'For n even, sort the data and average the n/2-th and (n/2 + 1)-th values. For example, median of [3, 5, 7, 9] = (5+7)/2 = 6.' },
    { id: 'mmm-tf-6', type: 'true-false', question: 'Multiplying every value in a dataset by 2 doubles the mean.', isTrue: true, explanation: 'If x̄ is the original mean and every value is multiplied by 2, the new mean is 2x̄. Linear transformations (multiplication/addition) directly scale the mean.' },
    { id: 'mmm-tf-7', type: 'true-false', question: 'In a right-skewed distribution, the median is greater than the mean.', isTrue: false, explanation: 'In a right-skewed distribution, the few extreme HIGH values pull the mean ABOVE the median. Mean > Median in right skew.' },
    { id: 'mmm-tf-8', type: 'true-false', question: 'The mean is the most appropriate measure of central tendency for data with extreme outliers.', isTrue: false, explanation: 'Outliers pull the mean toward them, distorting it as a representation of typical values. The median is more appropriate because it is resistant to extreme values.' },
    { id: 'mmm-tf-9', type: 'true-false', question: 'The median is sensitive to every value in the dataset, not just the position.', isTrue: false, explanation: 'The median depends ONLY on rank/position — the value of the middle observation. You can change every value above the median without changing the median itself (as long as their order doesn\'t change).' },
    { id: 'mmm-tf-10', type: 'true-false', question: 'A dataset with values [5, 5, 5, 5] has a mean, median, and mode that are all equal.', isTrue: true, explanation: 'All values are the same: Mean = 5, Median = 5 (middle of identical values), Mode = 5 (only value). All three agree.' },
    { id: 'mmm-tf-11', type: 'true-false', question: 'The sum of deviations from the mean always equals zero.', isTrue: true, explanation: 'This is a fundamental property of the mean. Σ(xᵢ − x̄) = 0 always. This is why the mean is the "balance point" of the distribution.' },
    { id: 'mmm-tf-12', type: 'true-false', question: 'For the dataset [1, 2, 3, 4, 100], the median is 3.', isTrue: true, explanation: 'Sorted: 1, 2, 3, 4, 100. n=5, middle is the 3rd value = 3. The extreme value (100) does not affect the median.' },
    { id: 'mmm-tf-13', type: 'true-false', question: 'The mean is affected by outliers but the median is not.', isTrue: false, explanation: 'The median CAN be slightly affected by outliers if they change the middle position — but it is highly RESISTANT compared to the mean. The median is not completely immune, just much more robust.' },
    { id: 'mmm-tf-14', type: 'true-false', question: 'A dataset with no repeated values has no mode.', isTrue: true, explanation: 'Mode is defined as the value that appears most frequently. If every value is unique (appears exactly once), there is no mode — or some say every value is a mode.' },
    { id: 'mmm-tf-15', type: 'true-false', question: 'The mean is always a value that appears in the dataset.', isTrue: false, explanation: 'The mean is an arithmetic average and can be any real number, not just a value in the dataset. For example, mean of [2, 3] = 2.5, which is not in the dataset.' },
    { id: 'mmm-tf-16', type: 'true-false', question: 'For normally distributed data, mean = median = mode.', isTrue: true, explanation: 'A perfect normal distribution is symmetric with one peak. All three measures of central tendency coincide at the center of symmetry.' },
    { id: 'mmm-tf-17', type: 'true-false', question: 'The weighted mean is always equal to the simple mean.', isTrue: false, explanation: 'The weighted mean assigns different importance to values. It equals the simple mean only if all weights are equal. If weights differ, the weighted mean can be very different from the simple mean.' },
    { id: 'mmm-tf-18', type: 'true-false', question: 'A dataset can have two modes but only one mean and one median.', isTrue: true, explanation: 'Every dataset has exactly one arithmetic mean and one median (though for even n, median requires averaging). But datasets can be bimodal (two modes), multimodal, or have no mode.' },
    { id: 'mmm-tf-19', type: 'true-false', question: 'The median requires sorting the data from smallest to largest.', isTrue: true, explanation: 'Finding the median requires knowing which value is in the "middle position." This requires sorting (ordering) the data first.' },
    { id: 'mmm-tf-20', type: 'true-false', question: 'If you report the mean of highly skewed income data, you are likely overstating the typical income.', isTrue: true, explanation: 'In right-skewed income data, a few very high earners inflate the mean above what most people earn. The median better represents the "typical" income.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'mmm-mc-6', type: 'multiple-choice', question: 'Dataset: 3, 3, 7, 8, 9. What is the mode?', options: [{ id: 'a', text: '3', isCorrect: true, explanation: '3 appears twice; all others appear once. Mode = 3.' }, { id: 'b', text: '7', isCorrect: false, explanation: '7 appears once.' }, { id: 'c', text: '6', isCorrect: false, explanation: '6 is not in the dataset.' }, { id: 'd', text: 'No mode', isCorrect: false, explanation: 'There is a mode — 3 appears most frequently.' }], explanation: '3 appears twice; 7, 8, and 9 each appear once. The most frequent value is 3, so mode = 3.', hint: 'Mode = most frequent value.' },
    { id: 'mmm-mc-7', type: 'multiple-choice', question: 'What is the median of: 2, 5, 8, 11, 14, 17?', options: [{ id: 'a', text: '9.5', isCorrect: true, explanation: 'n=6 (even). Middle values are 3rd (8) and 4th (11). Median = (8+11)/2 = 9.5.' }, { id: 'b', text: '8', isCorrect: false, explanation: 'For even n, average the two middle values.' }, { id: 'c', text: '11', isCorrect: false, explanation: 'That is the 4th value, not the median.' }, { id: 'd', text: '9', isCorrect: false, explanation: '9.5, not 9.' }], explanation: 'n=6. Middle positions: 3rd (8) and 4th (11). Median = (8+11)/2 = 19/2 = 9.5.', hint: 'Even n: average the two middle values.' },
    { id: 'mmm-mc-8', type: 'multiple-choice', question: 'Which measure of central tendency should be used for the variable "favorite color"?', options: [{ id: 'a', text: 'Mean', isCorrect: false, explanation: 'You cannot average colors.' }, { id: 'b', text: 'Median', isCorrect: false, explanation: 'Colors have no natural order for finding the middle.' }, { id: 'c', text: 'Mode', isCorrect: true, explanation: 'Mode = most common category. For nominal data like colors, only the mode is valid.' }, { id: 'd', text: 'All three are equally valid', isCorrect: false, explanation: 'Only mode applies to nominal categorical data.' }], explanation: 'Favorite color is nominal (categories with no order or arithmetic). Only the mode — the most common color — is meaningful.', hint: 'Which measure works for categories with no numbers?' },
    { id: 'mmm-mc-9', type: 'multiple-choice', question: 'Data: 10, 20, 20, 30, 200. The mean is 56. Why does this poorly represent the "typical" value?', options: [{ id: 'a', text: 'The mode (20) appears twice, which distorts the mean', isCorrect: false, explanation: 'Frequency of the mode does not distort the mean.' }, { id: 'b', text: 'The extreme value (200) inflates the mean far above most values', isCorrect: true, explanation: '200 is far from the other values (10, 20, 20, 30), pulling the mean up to 56 — above 80% of the actual data.' }, { id: 'c', text: 'The mean formula is incorrect for this dataset', isCorrect: false, explanation: 'The formula is applied correctly.' }, { id: 'd', text: 'n=5 is too small to compute a valid mean', isCorrect: false, explanation: 'The mean is valid mathematically; the issue is interpretive.' }], explanation: 'Mean = (10+20+20+30+200)/5 = 280/5 = 56. Four of the five values (10, 20, 20, 30) are below 56. The outlier 200 drags the mean above most of the data. Median = 20 is much more representative.', hint: 'Which value in the dataset is pulling the mean far away from the others?' },
    { id: 'mmm-mc-10', type: 'multiple-choice', question: 'For a symmetric distribution with no outliers, which statement is TRUE?', options: [{ id: 'a', text: 'Mean > Median', isCorrect: false, explanation: 'In symmetric distributions, mean and median are equal.' }, { id: 'b', text: 'Mean < Median', isCorrect: false, explanation: 'In symmetric distributions, mean and median are equal.' }, { id: 'c', text: 'Mean ≈ Median', isCorrect: true, explanation: 'For symmetric distributions, the mean equals (or approximates) the median.' }, { id: 'd', text: 'Mode cannot be determined', isCorrect: false, explanation: 'The mode can often be determined for symmetric distributions.' }], explanation: 'In a symmetric distribution, values are equally distributed on both sides. The mean (sum/n) and median (middle position) both fall at the center of symmetry.', hint: 'Symmetric → equal tails → where do mean and median fall?' },
    { id: 'mmm-mc-11', type: 'multiple-choice', question: 'Compute the mean of: 4, 8, 6, 10, 2.', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'Check your sum: 4+8+6+10+2 = 30, not 25.' }, { id: 'b', text: '6', isCorrect: true, explanation: 'Sum = 4+8+6+10+2 = 30. Mean = 30/5 = 6.' }, { id: 'c', text: '8', isCorrect: false, explanation: '8 is the maximum, not the mean.' }, { id: 'd', text: '7', isCorrect: false, explanation: 'Sum = 30, n = 5, mean = 6 not 7.' }], explanation: 'Mean = Σx / n = (4+8+6+10+2) / 5 = 30 / 5 = 6.', hint: 'Add all values, then divide by n.' },
    { id: 'mmm-mc-12', type: 'multiple-choice', question: 'If a new employee earning $300,000/year joins a team where others earn between $40,000–$80,000, the _____ will change the most.', options: [{ id: 'a', text: 'Median', isCorrect: false, explanation: 'Median shifts slightly based on position.' }, { id: 'b', text: 'Mode', isCorrect: false, explanation: 'Mode is the most common salary — this new value is unique.' }, { id: 'c', text: 'Mean', isCorrect: true, explanation: 'The mean sums all values. One $300k salary among $40k–$80k earners dramatically inflates the mean.' }, { id: 'd', text: 'All equally', isCorrect: false, explanation: 'Mean is far more sensitive to extreme values.' }], explanation: 'The mean includes every value in its sum, so a $300,000 salary will dramatically inflate it. The median only shifts slightly because it depends on position, not value size.', hint: 'Which measure uses every value in its calculation?' },
    { id: 'mmm-mc-13', type: 'multiple-choice', question: 'Dataset: 5, 5, 5, 5, 5. What are the mean, median, and mode?', options: [{ id: 'a', text: 'Mean = 5, Median = 25, Mode = 5', isCorrect: false, explanation: 'Median is not the sum of values.' }, { id: 'b', text: 'Mean = 5, Median = 5, Mode = 5', isCorrect: true, explanation: 'All values are 5. Mean = 25/5 = 5. Median = middle value = 5. Mode = most frequent = 5.' }, { id: 'c', text: 'Mean = 1, Median = 5, Mode = 25', isCorrect: false, explanation: 'Incorrect calculations.' }, { id: 'd', text: 'Only the mode can be determined', isCorrect: false, explanation: 'All three can be computed.' }], explanation: 'With all identical values, mean = sum/n = 25/5 = 5; median = middle position = 5; mode = most frequent = 5. All three agree.', hint: 'If every value is identical, all three measures equal that value.' },
    { id: 'mmm-mc-14', type: 'multiple-choice', question: 'In a left-skewed distribution, the typical order of central tendency measures is:', options: [{ id: 'a', text: 'Mode > Median > Mean', isCorrect: true, explanation: 'Left skew: extreme low values pull the mean down. Mode is at the peak (high values), median is in the middle, mean is pulled lowest by the left tail.' }, { id: 'b', text: 'Mean > Median > Mode', isCorrect: false, explanation: 'That is positive (right) skew.' }, { id: 'c', text: 'Median > Mean > Mode', isCorrect: false, explanation: 'Not the standard relationship for left skew.' }, { id: 'd', text: 'Mean = Median = Mode', isCorrect: false, explanation: 'That is a symmetric distribution.' }], explanation: 'For left (negative) skew: the long left tail pulls the mean downward. Order from highest to lowest: Mode ≥ Median ≥ Mean.', hint: 'In left skew, which measure is pulled toward the low values?' },
    { id: 'mmm-mc-15', type: 'multiple-choice', question: 'A student scored in the 90th percentile. This means:', options: [{ id: 'a', text: 'They scored 90% on the exam', isCorrect: false, explanation: 'Percentile rank and percent correct are different things.' }, { id: 'b', text: 'They scored higher than 90% of all students', isCorrect: true, explanation: 'The pth percentile means p% of scores fall BELOW that student\'s score.' }, { id: 'c', text: 'They scored lower than 90% of all students', isCorrect: false, explanation: 'That would be the 10th percentile.' }, { id: 'd', text: 'Their score is in the top 90%', isCorrect: false, explanation: 'Top 90% means only 10% scored higher — that is the 10th percentile, not 90th.' }], explanation: '90th percentile = 90% of students scored below this student. Only 10% scored equal or higher. This is a top-tier score.', hint: 'The pth percentile means p% fall BELOW.' },
  ],
  keyTakeaway:
    'Use the mean for symmetric data with no outliers; use the median for skewed data or when outliers exist; use the mode for categorical data or to find the most common value.',
  visualization: (data) => <MeanMedianModeViz data={data} />,
  datasetGenerator: true,
}

export default function MeanMedianMode({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
