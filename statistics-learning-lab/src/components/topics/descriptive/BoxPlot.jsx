import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { BoxPlotChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { q1, q3, median as calcMedian, iqr as calcIQR, outlierFences, identifyOutliers, round } from '../../../utils/stats'
import QuartileMethodNote from '../../shared/QuartileMethodNote'

// Fixed datasets for worked example
const HOSP_A = [5, 8, 10, 12, 14, 15, 18, 20, 22, 35]
const HOSP_B = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

const aQ1 = round(q1(HOSP_A), 1)
const aMedian = round(calcMedian(HOSP_A), 1)
const aQ3 = round(q3(HOSP_A), 1)
const aIQR = round(calcIQR(HOSP_A), 1)
const aFences = outlierFences(HOSP_A)
const aOutliers = identifyOutliers(HOSP_A)

const bQ1 = round(q1(HOSP_B), 2)
const bMedian = round(calcMedian(HOSP_B), 1)
const bQ3 = round(q3(HOSP_B), 2)
const bIQR = round(calcIQR(HOSP_B), 2)
const bFences = outlierFences(HOSP_B)
const bOutliers = identifyOutliers(HOSP_B)

function BoxPlotViz({ data: propData }) {
  const { data: ownDataA } = useDataset({ n: 20, min: 5, max: 50, distribution: 'uniform' })
  const { data: dataB } = useDataset({ n: 20, min: 10, max: 40, distribution: 'normal' })
  const dataA = propData ?? ownDataA

  const statsA = useMemo(() => dataA.length ? {
    q1: round(q1(dataA), 1), median: round(calcMedian(dataA), 1),
    q3: round(q3(dataA), 1), iqr: round(calcIQR(dataA), 1),
    outliers: identifyOutliers(dataA),
  } : null, [dataA])

  const statsB = useMemo(() => dataB.length ? {
    q1: round(q1(dataB), 1), median: round(calcMedian(dataB), 1),
    q3: round(q3(dataB), 1), iqr: round(calcIQR(dataB), 1),
    outliers: identifyOutliers(dataB),
  } : null, [dataB])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Dataset A', stats: statsA, color: 'blue' }, { label: 'Dataset B', stats: statsB, color: 'teal' }].map(({ label, stats, color }) => (
          <div key={label} className={`bg-${color === 'blue' ? 'blue' : 'teal'}-50 border border-${color === 'blue' ? 'blue' : 'teal'}-200 rounded-lg p-3 text-xs`}>
            <p className={`font-semibold text-${color === 'blue' ? 'blue' : 'teal'}-700 mb-1`}>{label}</p>
            {stats ? (
              <div className="space-y-0.5 text-gray-600">
                <div>Q1: <strong>{stats.q1}</strong> | Median: <strong>{stats.median}</strong> | Q3: <strong>{stats.q3}</strong></div>
                <div>IQR: <strong>{stats.iqr}</strong> | Outliers: <strong>{stats.outliers.length > 0 ? stats.outliers.join(', ') : 'none'}</strong></div>
              </div>
            ) : <span className="text-gray-400">Loading…</span>}
          </div>
        ))}
      </div>
      <BoxPlotChart
        datasets={[
          { label: 'Dataset A (Uniform)', data: dataA, color: '#2563EB' },
          { label: 'Dataset B (Normal)', data: dataB, color: '#0D9488' },
        ]}
        title="Side-by-Side Box Plots — Compare Two Distributions"
        yLabel="Value"
        height={300}
      />
      <div className="mt-2">
        <QuartileMethodNote />
      </div>
    </div>
  )
}

const content = {
  title: 'Box Plot',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Read and construct a box plot, and use it to compare distributions visually.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>box plot</strong> (also called a box-and-whisker plot) is a visual summary of a dataset using five key statistics: the <strong>minimum</strong>, <strong>Q1</strong>, <strong>median</strong>, <strong>Q3</strong>, and <strong>maximum</strong>.
      </p>
      <p>
        Reading a box plot from bottom to top (or left to right):
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Lower whisker:</strong> Extends to the smallest non-outlier value (minimum if no outliers below)</li>
        <li><strong>Bottom of box (Q1):</strong> 25th percentile — lower edge of the "middle 50%" box</li>
        <li><strong>Line inside box (Median / Q2):</strong> The middle value of the dataset</li>
        <li><strong>Top of box (Q3):</strong> 75th percentile — upper edge of the box</li>
        <li><strong>Upper whisker:</strong> Extends to the largest non-outlier value (or Q3 + 1.5×IQR, whichever is smaller)</li>
        <li><strong>Individual dots beyond whiskers:</strong> Outliers — values beyond the 1.5×IQR fences</li>
      </ul>
      <p>
        The <strong>box height = IQR</strong> — a wide box means more spread in the middle 50%. A box plot is especially useful for comparing two or more distributions side by side.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Think of a box plot like a city skyline summary. The whiskers show the total height range of buildings. The box shows the heights of the middle half of buildings. The line in the box shows the height of the median building. Individual dots are unusually tall or short skyscrapers (outliers). You can immediately compare two cities by placing their skyline summaries side by side.
      </p>
    </div>
  ),
  formula: {
    main: 'Whisker ends = Q1 − 1.5×IQR (lower) and Q3 + 1.5×IQR (upper)',
    variants: [
      { label: 'IQR (box height)', expression: 'IQR = Q3 − Q1', latex: 'IQR = Q_{3} - Q_{1}' },
      { label: 'Lower whisker fence', expression: 'Lower fence = Q1 − 1.5 × IQR', latex: 'Lower = Q_{1} - 1.5 \\times IQR' },
      { label: 'Upper whisker fence', expression: 'Upper fence = Q3 + 1.5 × IQR', latex: 'Upper = Q_{3} + 1.5 \\times IQR' },
      { label: 'Lower whisker end', expression: 'min(data values ≥ lower fence)' },
      { label: 'Upper whisker end', expression: 'max(data values ≤ upper fence)' },
    ],
    symbolGuide: [
      { symbol: 'Box', meaning: 'The IQR — spans from Q1 to Q3, contains middle 50% of data' },
      { symbol: 'Median line', meaning: 'The line inside the box — Q2 (50th percentile)' },
      { symbol: 'Whisker', meaning: 'Extends to the furthest non-outlier value' },
      { symbol: 'Outlier dot', meaning: 'Any value beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR' },
      { symbol: 'IQR', meaning: 'Interquartile range = Q3 − Q1 = height of the box' },
    ],
  },
  whenToUse: [
    'To show the distribution, center, spread, and outliers of a dataset in one compact chart',
    'For comparing two or more groups side by side (e.g., Hospital A vs. Hospital B)',
    'When data may be skewed or contain outliers — box plots handle these gracefully',
    'For medium-to-large datasets where showing individual points would be too noisy',
  ],
  whenNotToUse: [
    'For very small datasets (n < 8) — box plots can be misleading with few data points',
    'When you need to show the exact distribution shape — a histogram is better for that',
    'For nominal or ordinal data — box plots require numeric values that can be sorted',
  ],
  assumptions: [
    'Data must be numeric and sortable (at least ordinal, practically interval/ratio)',
    'The 1.5×IQR outlier rule is applied: values outside Q1−1.5×IQR or Q3+1.5×IQR are drawn as individual points',
    'Different quartile calculation methods may yield slightly different box endpoints',
  ],
  workedExample: {
    scenario: `Waiting times at Hospital A: [5, 8, 10, 12, 14, 15, 18, 20, 22, 35] vs. Hospital B: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]. Compare using box plots.`,
    dataset: 'Hospital A: [5,8,10,12,14,15,18,20,22,35] | Hospital B: [8,9,10,11,12,13,14,15,16,17]',
    steps: [
      { stepNumber: 1, label: 'Hospital A — five-number summary', expression: `Min=5, Q1=${aQ1}, Median=${aMedian}, Q3=${aQ3}, Max=35`, result: `IQR = ${aIQR}`, explanation: `The data spans from 5 to 35 minutes. Q1 to Q3 spans ${aIQR} minutes.` },
      { stepNumber: 2, label: 'Hospital A — outlier fences', expression: `Lower = ${aQ1} − 1.5×${aIQR} = ${round(aFences.lower, 2)}, Upper = ${aQ3} + 1.5×${aIQR} = ${round(aFences.upper, 2)}`, result: `Outliers: ${aOutliers.length > 0 ? aOutliers.join(', ') : 'none'}`, explanation: aOutliers.length > 0 ? `Value(s) ${aOutliers.join(', ')} exceed(s) the upper fence of ${round(aFences.upper, 2)}.` : 'No outliers detected.' },
      { stepNumber: 3, label: 'Hospital B — five-number summary', expression: `Min=8, Q1=${bQ1}, Median=${bMedian}, Q3=${bQ3}, Max=17`, result: `IQR = ${bIQR}`, explanation: `Hospital B spans only 8 to 17 minutes. Q1 to Q3 spans ${bIQR} minutes — much narrower than Hospital A.` },
      { stepNumber: 4, label: 'Hospital B — outlier fences', expression: `Lower = ${bQ1} − 1.5×${bIQR} = ${round(bFences.lower, 2)}, Upper = ${bQ3} + 1.5×${bIQR} = ${round(bFences.upper, 2)}`, result: `Outliers: ${bOutliers.length > 0 ? bOutliers.join(', ') : 'none'}`, explanation: 'Hospital B\'s data is tightly packed — no outliers.' },
      { stepNumber: 5, label: 'Compare the two distributions', expression: `Hospital A: IQR=${aIQR}, Median=${aMedian}${aOutliers.length > 0 ? `, outlier at ${aOutliers.join(',')}` : ''}. Hospital B: IQR=${bIQR}, Median=${bMedian}.`, result: 'Hospital A: wider spread, higher median, outlier. Hospital B: consistent, lower median.', explanation: 'Hospital B is more consistent AND faster — both median and spread are smaller.' },
    ],
    interpretation: `Hospital A has a median of ${aMedian} minutes (vs. Hospital B's ${bMedian}) — patients wait longer on average. Hospital A also has an IQR of ${aIQR} minutes (vs. ${bIQR}) — much more variable. Hospital A has an outlier${aOutliers.length > 0 ? ` at ${aOutliers.join(', ')} minutes` : ''}, suggesting occasional very long waits. Hospital B is both faster and more consistent.`,
  },
  interpretation: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>When reading a box plot:</p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Where is the median line?</strong> High in the box = skewed left; low in box = skewed right; centered = roughly symmetric</li>
        <li><strong>How wide is the box?</strong> Wide IQR = more variability in the middle half</li>
        <li><strong>How long are the whiskers?</strong> Long whiskers = values stretched toward the extremes</li>
        <li><strong>Are there outlier dots?</strong> Individual dots need investigation</li>
      </ul>
    </div>
  ),
  commonMistakes: [
    { mistake: 'Thinking the whiskers always reach the minimum and maximum', explanation: 'Whiskers extend to the smallest/largest values WITHIN the 1.5×IQR fences, not necessarily to the actual min/max. Values beyond the fences are plotted as individual outlier dots.' },
    { mistake: 'Confusing the median line with the mean', explanation: 'The line inside the box is always the MEDIAN, not the mean. The mean is not shown in a standard box plot.' },
    { mistake: 'Interpreting box height as "most data is in this range"', explanation: 'The box contains exactly the middle 50% of data — no more, no less. A tall box means the middle 50% is widely spread, not that it contains more data.' },
    { mistake: 'Forgetting that whisker length depends on outliers', explanation: 'A dataset with no outliers will have whiskers reaching min and max. A dataset with outliers will have shorter whiskers, and the outliers will appear as separate dots.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'bp-easy-1',
        scenario: 'A box plot shows: lower whisker at 10, Q1 = 20, median = 30, Q3 = 45, upper whisker at 60. No outliers.',
        question: 'What is the IQR? What percentage of data falls within the box?',
        hint: 'IQR = Q3 − Q1. The box always contains the middle 50%.',
        solution: 'IQR = Q3 − Q1 = 45 − 20 = 25. The box contains exactly 50% of the data (from the 25th to 75th percentile).',
      },
      {
        id: 'bp-easy-2',
        scenario: 'Two box plots: Group A has a median of 50 and IQR of 10. Group B has a median of 50 and IQR of 30.',
        question: 'Which group is more variable? Which group\'s data is more tightly clustered?',
        hint: 'IQR = spread of middle 50%.',
        solution: 'Group B (IQR = 30) is more variable — its middle 50% spans 30 units. Group A (IQR = 10) is more tightly clustered. Both have the same median (50), so the difference is purely about spread, not center.',
      },
    ],
    moderate: [
      {
        id: 'bp-mod-1',
        scenario: 'Dataset: 2, 5, 7, 8, 10, 11, 12, 15, 18, 40.',
        question: 'Calculate Q1, Q3, IQR, and determine if 40 is an outlier. Describe what a box plot would look like.',
        hint: 'n=10. Q1 position = 0.25×9=2.25. Q3 position = 0.75×9=6.75.',
        solution: 'Q1: position 2.25 → 7 + 0.25×(8−7) = 7.25. Q3: position 6.75 → 12 + 0.75×(15−12) = 14.25. IQR = 14.25 − 7.25 = 7. Upper fence = 14.25 + 1.5×7 = 24.75. Value 40 > 24.75 → outlier. Box plot: lower whisker at 2, box from 7.25 to 14.25, median at 10.5 (average of 10 and 11), upper whisker at 18 (last non-outlier), outlier dot at 40.',
      },
      {
        id: 'bp-mod-2',
        scenario: 'A box plot of exam scores shows: Q1 = 60, Median = 72, Q3 = 84. The median is in the exact center of the box.',
        question: 'What does the centered median line suggest about the distribution\'s shape?',
        hint: 'What does a centered median mean relative to Q1 and Q3?',
        solution: 'A centered median (Q2 − Q1 = Q3 − Q2, i.e., 72 − 60 = 84 − 72 = 12) means the middle 50% of scores is roughly symmetric. The middle 50% is evenly distributed around the median. This suggests the data may be approximately symmetric in the interquartile region (though the full distribution could still be skewed based on whisker lengths).',
      },
    ],
    challenging: [
      {
        id: 'bp-chal-1',
        scenario: 'Box plot A: Q1=30, Median=35, Q3=55, whiskers at 20 and 65, no outliers. Box plot B: Q1=30, Median=50, Q3=55, whiskers at 10 and 70, outlier at 95.',
        question: 'Compare the two distributions. Comment on center, spread, symmetry, and outliers.',
        hint: 'Compare median, IQR, whisker lengths, and outlier presence.',
        solution: 'Center: Plot A (median 35) is lower than Plot B (median 50) — Plot B\'s typical value is higher. Spread: Plot A IQR = 25, Plot B IQR = 25 — same middle-50% spread. Symmetry: Plot A — median (35) is near Q1 (30), suggesting right-skew (stretched toward Q3). Plot B — median (50) is midway, suggesting more symmetry in the box; but outlier at 95 pulls the distribution right. Outliers: Plot B has one high outlier at 95 that warrants investigation.',
      },
      {
        id: 'bp-chal-2',
        scenario: 'Three departments\' project completion times (days): Dept A median=10 days, IQR=3; Dept B median=15 days, IQR=2; Dept C median=10 days, IQR=8. You must choose a department for a time-sensitive project that must complete in under 14 days.',
        question: 'Which department would you choose and why? Use the five-number summary concepts.',
        hint: 'Low median is good, low IQR means more predictable. How many SDs above median would 14 days be?',
        solution: 'Dept A: median=10, IQR=3. Q3 is approximately 10 + 1.5 = 11.5 (rough estimate if symmetric). 14 days is well above Q3 — very likely to finish in time. Dept B: median=15, which is already over 14 — half the projects take longer than 14 days. Risky. Dept C: median=10, but IQR=8 — Q3 ≈ 14, meaning 25% of projects take longer than ~14 days. More unpredictable. Best choice: Dept A — fastest median AND most consistent (smallest IQR), making on-time completion highly likely.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'bp-kc-1',
      type: 'multiple-choice',
      question: 'What does the line inside the box of a box plot represent?',
      options: [
        { id: 'a', text: 'The mean', isCorrect: false, explanation: 'Standard box plots show the median, not the mean.' },
        { id: 'b', text: 'The median (Q2)', isCorrect: true, explanation: 'Correct! The line inside the box is always the median — the 50th percentile.' },
        { id: 'c', text: 'The mode', isCorrect: false, explanation: 'Mode is not shown in a box plot.' },
        { id: 'd', text: 'The mean of Q1 and Q3', isCorrect: false, explanation: 'The midpoint of Q1 and Q3 is the midhinge, not a standard box plot element.' },
      ],
      explanation: 'The line inside the box is the median (Q2 = 50th percentile). The box itself spans Q1 to Q3.',
      hint: 'What does the box in a box plot represent? What is the middle of that?',
    },
    {
      id: 'bp-kc-2',
      type: 'multiple-choice',
      question: 'Q1 = 20, Q3 = 50, IQR = 30. Where does the upper whisker end (assuming no outliers beyond the fence)?',
      options: [
        { id: 'a', text: 'At the maximum value in the dataset', isCorrect: false, explanation: 'The whisker ends at the largest value within the fence, not necessarily the maximum.' },
        { id: 'b', text: 'At Q3 + 1.5 × IQR = 95', isCorrect: false, explanation: '95 is the upper fence. The whisker ends at the largest DATA value ≤ 95.' },
        { id: 'c', text: 'At the largest data value that is ≤ Q3 + 1.5 × IQR = 95', isCorrect: true, explanation: 'Correct! The fence is at 95. The whisker extends to the largest actual data point at or below 95.' },
        { id: 'd', text: 'At Q3 = 50', isCorrect: false, explanation: 'Q3 is the top of the box. The whisker extends beyond the box.' },
      ],
      explanation: 'Upper fence = Q3 + 1.5×IQR = 50 + 45 = 95. The upper whisker extends to the largest data value that is ≤ 95. Values above 95 are plotted as outlier dots.',
      hint: 'Whiskers extend to actual data values, not to the fence itself.',
    },
    {
      id: 'bp-kc-3',
      type: 'multiple-choice',
      question: 'A box plot\'s median line is very close to Q3 (top of box). What does this suggest?',
      options: [
        { id: 'a', text: 'The data is right-skewed (stretched toward higher values)', isCorrect: false, explanation: 'If median is near Q3, most of the box\'s data is packed at the top — suggesting left skew.' },
        { id: 'b', text: 'The data is left-skewed (median closer to Q3 than Q1)', isCorrect: true, explanation: 'Correct! Median near Q3 means data is concentrated at higher values with a long left tail.' },
        { id: 'c', text: 'The data is symmetric', isCorrect: false, explanation: 'Symmetric data would have the median in the center of the box.' },
        { id: 'd', text: 'There must be outliers', isCorrect: false, explanation: 'Skew in the box is independent of whether there are outliers.' },
      ],
      explanation: 'When the median is close to Q3 (top of box), most data is packed near the higher values, with a longer stretch down to Q1. This is left-skewed (negatively skewed).',
      hint: 'Where is the median relative to Q1 and Q3? What does that say about where data is concentrated?',
    },
    {
      id: 'bp-kc-4',
      type: 'multiple-choice',
      question: 'Comparing two box plots: Plot A has a taller box than Plot B. What does this mean?',
      options: [
        { id: 'a', text: 'Plot A has more data points', isCorrect: false, explanation: 'Box height (IQR) tells you about spread, not sample size.' },
        { id: 'b', text: 'Plot A has a larger IQR — more spread in the middle 50%', isCorrect: true, explanation: 'Correct! Taller box = larger IQR = the middle 50% of data is more spread out.' },
        { id: 'c', text: 'Plot A has a larger range', isCorrect: false, explanation: 'Range is shown by whisker and outlier extent, not box height.' },
        { id: 'd', text: 'Plot A has a higher mean', isCorrect: false, explanation: 'Box height indicates spread, not center.' },
      ],
      explanation: 'Box height = IQR = Q3 − Q1. A taller box means the middle 50% of the data is spread over a larger range. It says nothing about sample size or the mean.',
      hint: 'What does the height of the box equal?',
    },
    {
      id: 'bp-kc-5',
      type: 'multiple-choice',
      question: 'An individual dot appears above the upper whisker in a box plot. What is this?',
      options: [
        { id: 'a', text: 'A data entry error', isCorrect: false, explanation: 'It might be an error, but it is specifically a statistical outlier. Investigation is needed to determine if it is an error.' },
        { id: 'b', text: 'A potential outlier — a value exceeding Q3 + 1.5 × IQR', isCorrect: true, explanation: 'Correct! Values beyond the 1.5×IQR fences are plotted individually as potential outliers.' },
        { id: 'c', text: 'The maximum value of the dataset', isCorrect: false, explanation: 'When outliers exist, the maximum IS beyond the fence — but calling it just "the maximum" misses the point that it is flagged as unusual.' },
        { id: 'd', text: 'The Q4 (fourth quartile)', isCorrect: false, explanation: 'There is no "Q4" — quartiles go Q1, Q2, Q3.' },
      ],
      explanation: 'Any individual dot beyond the whiskers represents a value that exceeds the 1.5×IQR fence. These are potential outliers that warrant investigation.',
      hint: 'What is the rule for where the whisker ends?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'bp-tf-1', type: 'true-false', question: 'A box plot displays the five-number summary: min, Q1, median, Q3, and max.', isTrue: true, explanation: 'A box plot encodes five statistics: minimum (left whisker end), Q1 (left edge of box), median (line inside box), Q3 (right edge of box), and maximum (right whisker end), plus any outliers as dots.' },
    { id: 'bp-tf-2', type: 'true-false', question: 'The line inside the box of a box plot represents the mean.', isTrue: false, explanation: 'The line inside the box represents the MEDIAN (Q2), not the mean. The mean is not typically marked on a standard box plot.' },
    { id: 'bp-tf-3', type: 'true-false', question: 'A longer box in a box plot indicates greater variability in the middle 50% of data.', isTrue: true, explanation: 'The length of the box = IQR = Q3 − Q1. Longer box = larger IQR = more spread in the central half of the data.' },
    { id: 'bp-tf-4', type: 'true-false', question: 'A box plot can only be used for normally distributed data.', isTrue: false, explanation: 'Box plots are non-parametric visualizations based on quartiles. They work for any distribution shape and are especially useful for non-normal, skewed, or unknown distributions.' },
    { id: 'bp-tf-5', type: 'true-false', question: 'Dots beyond the whiskers in a box plot are automatically confirmed outliers.', isTrue: false, explanation: 'Dots beyond whiskers are POTENTIAL outliers flagged by the 1.5×IQR rule. They require investigation to confirm whether they are errors, real extreme values, or artifacts.' },
    { id: 'bp-tf-6', type: 'true-false', question: 'Box plots are particularly useful for comparing distributions across multiple groups.', isTrue: true, explanation: 'Side-by-side box plots allow visual comparison of center (median line), spread (box width = IQR), and symmetry across groups. This is one of the most powerful uses of box plots.' },
    { id: 'bp-tf-7', type: 'true-false', question: 'If the median line is closer to Q1, the distribution is likely right-skewed.', isTrue: true, explanation: 'In a right-skewed distribution, most data clusters at the low end. This pushes the median toward Q1 (lower quartile). The top half of the box (Q2 to Q3) will be longer than the bottom half.' },
    { id: 'bp-tf-8', type: 'true-false', question: 'A symmetric distribution will have the median line exactly in the center of the box.', isTrue: true, explanation: 'For symmetric data: distance from Q1 to median ≈ distance from median to Q3. The median line appears in the middle of the IQR box.' },
    { id: 'bp-tf-9', type: 'true-false', question: 'Box plots can be drawn horizontally or vertically.', isTrue: true, explanation: 'Box plots can be oriented horizontally (left-right) or vertically (up-down). Both convey identical information — the orientation is a design choice.' },
    { id: 'bp-tf-10', type: 'true-false', question: 'The whiskers of a standard box plot always extend exactly to the minimum and maximum values.', isTrue: false, explanation: 'In a standard (Tukey) box plot, whiskers extend to the most extreme values WITHIN 1.5×IQR of the box. Values beyond are plotted as individual dots. Only if there are no outliers do whiskers reach the true min and max.' },
    { id: 'bp-tf-11', type: 'true-false', question: 'A box plot shows more detail about the distribution shape than a histogram.', isTrue: false, explanation: 'A histogram shows the full shape of the distribution (every bar). A box plot summarizes only 5 numbers and conceals the distribution within each quartile. Histograms reveal more detail about shape.' },
    { id: 'bp-tf-12', type: 'true-false', question: 'If two box plots have the same median but different IQRs, their spreads differ.', isTrue: true, explanation: 'Same median = same center value. Different IQRs = different spread of the central 50%. The distributions may cluster tightly or loosely around the same median.' },
    { id: 'bp-tf-13', type: 'true-false', question: 'Box plots use the arithmetic mean as the central value.', isTrue: false, explanation: 'Box plots are based entirely on order statistics (quartiles). The central value displayed is the MEDIAN (Q2), not the mean. This makes box plots robust to outliers.' },
    { id: 'bp-tf-14', type: 'true-false', question: 'A box plot with a very long upper whisker suggests the data is right-skewed.', isTrue: true, explanation: 'A longer upper whisker means the data stretches further in the high-value direction relative to the lower side. This asymmetry indicates right skew.' },
    { id: 'bp-tf-15', type: 'true-false', question: 'Modified box plots show outliers as individual dots beyond the whiskers.', isTrue: true, explanation: 'In a modified (Tukey) box plot, values beyond the 1.5×IQR fences are plotted as individual dots (sometimes called fliers or outlier markers), while whiskers end at the last non-outlier value.' },
    { id: 'bp-tf-16', type: 'true-false', question: 'Box plots and histograms always show identical information.', isTrue: false, explanation: 'Box plots summarize 5 statistics; histograms show frequency for every bin. A histogram has more detail about shape but is less efficient for multi-group comparison.' },
    { id: 'bp-tf-17', type: 'true-false', question: 'In a left-skewed distribution, the lower whisker is typically longer than the upper whisker.', isTrue: true, explanation: 'Left skew = long left tail. The lower whisker extends further down, and the box is asymmetric with more space on the lower half.' },
    { id: 'bp-tf-18', type: 'true-false', question: 'The area of the box in a box plot is proportional to the frequency of data in that range.', isTrue: false, explanation: 'The box always represents exactly the middle 50% of the data — its WIDTH (IQR) measures spread, not the count. The area has no inherent meaning like it does in a histogram.' },
    { id: 'bp-tf-19', type: 'true-false', question: 'Box plots are effective for datasets with n = 3 or fewer observations.', isTrue: false, explanation: 'With very small n (< 5–10), quartile estimates are unreliable and a box plot conveys little. For tiny samples, individual point plots are more informative.' },
    { id: 'bp-tf-20', type: 'true-false', question: 'A violin plot is an extension of the box plot that also shows the full distribution shape.', isTrue: true, explanation: 'Violin plots add a mirrored kernel density estimate to each side of the box, showing the full distribution shape alongside the five-number summary.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'bp-mc-6', type: 'multiple-choice', question: 'In a box plot, the left edge of the box represents:', options: [{ id: 'a', text: 'The minimum value', isCorrect: false, explanation: 'The minimum is the end of the lower whisker (if no outliers).' }, { id: 'b', text: 'Q1 (25th percentile)', isCorrect: true, explanation: 'The left edge of the box is Q1, the right edge is Q3.' }, { id: 'c', text: 'The median', isCorrect: false, explanation: 'The median is the line inside the box.' }, { id: 'd', text: 'The mean', isCorrect: false, explanation: 'Standard box plots do not show the mean.' }], explanation: 'The box spans from Q1 (left/lower edge) to Q3 (right/upper edge). The median is the line inside. Whiskers extend beyond Q1 and Q3.', hint: 'The box spans from first quartile to third quartile.' },
    { id: 'bp-mc-7', type: 'multiple-choice', question: 'Box Plot A has median near the center of the box. Box Plot B has median near the top of the box. What can you infer?', options: [{ id: 'a', text: 'Plot A is left-skewed; Plot B is right-skewed', isCorrect: false, explanation: 'Median near top means most data is high (left-skewed if upper box is compressed).' }, { id: 'b', text: 'Plot A is symmetric; Plot B is left-skewed (median near Q3)', isCorrect: true, explanation: 'Median near center = symmetric. Median near Q3 (top) = data clusters at the high end = left skew.' }, { id: 'c', text: 'Plot A has more outliers than Plot B', isCorrect: false, explanation: 'Median position does not determine the number of outliers.' }, { id: 'd', text: 'Plot B has a larger IQR', isCorrect: false, explanation: 'IQR is the total box length, not the median position.' }], explanation: 'In a symmetric distribution, median bisects the box. Median near Q3 (top) means the lower half of the box (Q1 to median) is larger — most data is near the high end, indicating left skew.', hint: 'Median near top of box = data clusters high = what type of skew?' },
    { id: 'bp-mc-8', type: 'multiple-choice', question: 'Which feature of a box plot directly shows the IQR?', options: [{ id: 'a', text: 'The length of the whiskers', isCorrect: false, explanation: 'Whisker length shows spread of extremes, not IQR.' }, { id: 'b', text: 'The position of the dots (outliers)', isCorrect: false, explanation: 'Outlier dots show individual extreme values.' }, { id: 'c', text: 'The length (width) of the box itself', isCorrect: true, explanation: 'Box = from Q1 to Q3. Length = Q3 − Q1 = IQR.' }, { id: 'd', text: 'The position of the median line', isCorrect: false, explanation: 'Median position shows center, not IQR.' }], explanation: 'The box spans from Q1 to Q3. The length of the box = Q3 − Q1 = IQR. Longer box = larger IQR = more spread in the middle 50%.', hint: 'Box spans Q1 to Q3. Length = ?' },
    { id: 'bp-mc-9', type: 'multiple-choice', question: 'Dataset: Q1=20, Q3=40. A value of 75 appears. The IQR=20. Is 75 an outlier (by 1.5×IQR)?', options: [{ id: 'a', text: 'No — 75 is within the upper fence', isCorrect: false, explanation: 'Upper fence = 40 + 1.5×20 = 40+30 = 70. 75 > 70 → outlier.' }, { id: 'b', text: 'Yes — 75 exceeds the upper fence of 70', isCorrect: true, explanation: 'Upper fence = Q3 + 1.5×IQR = 40 + 30 = 70. 75 > 70 → flagged as outlier.' }, { id: 'c', text: 'Cannot tell without the full dataset', isCorrect: false, explanation: 'IQR rule only needs Q1, Q3, and the value.' }, { id: 'd', text: 'Only if it is an error', isCorrect: false, explanation: 'The rule flags it regardless; investigation determines the cause.' }], explanation: 'Upper fence = Q3 + 1.5×IQR = 40 + 1.5×20 = 40 + 30 = 70. Since 75 > 70, it is flagged as a potential outlier.', hint: 'Upper fence = Q3 + 1.5×IQR. Compare: is 75 > upper fence?' },
    { id: 'bp-mc-10', type: 'multiple-choice', question: 'You compare box plots for two groups: Group A has a box from 10 to 30 (median=18); Group B has a box from 20 to 50 (median=30). What can you conclude?', options: [{ id: 'a', text: 'Group A has a larger median', isCorrect: false, explanation: 'Median A=18 < Median B=30. Group B has a larger median.' }, { id: 'b', text: 'Group B has a higher median and wider IQR', isCorrect: true, explanation: 'B: median=30 > A: median=18. B IQR=30 > A IQR=20. Group B is both higher and more variable.' }, { id: 'c', text: 'Group A has more outliers', isCorrect: false, explanation: 'Outliers depend on the whiskers and fences, not box position.' }, { id: 'd', text: 'Both groups have the same distribution', isCorrect: false, explanation: 'Different medians and IQRs indicate different distributions.' }], explanation: 'Group B: median=30 > Group A: median=18 (Group B is shifted higher). Group B: IQR=50−20=30 > Group A: IQR=30−10=20 (Group B is more spread). Different center AND spread.', hint: 'Compare box centers (median) and box lengths (IQR).' },
    { id: 'bp-mc-11', type: 'multiple-choice', question: 'What is the main advantage of using a box plot over a histogram?', options: [{ id: 'a', text: 'Box plots show more detail about distribution shape', isCorrect: false, explanation: 'Histograms show more shape detail.' }, { id: 'b', text: 'Box plots are better for comparing multiple groups simultaneously', isCorrect: true, explanation: 'Multiple box plots side by side enable clear group comparison. Multiple histograms are harder to read.' }, { id: 'c', text: 'Box plots always show the mean', isCorrect: false, explanation: 'Standard box plots show the median, not mean.' }, { id: 'd', text: 'Box plots work for categorical data', isCorrect: false, explanation: 'Box plots require numeric (quantitative) data.' }], explanation: 'Box plots are compact summaries that are easy to display side by side. Comparing 5 groups with 5 box plots is much cleaner than 5 overlapping histograms.', hint: 'When would you want to compare multiple groups quickly?' },
    { id: 'bp-mc-12', type: 'multiple-choice', question: 'In a box plot, if the upper whisker is much longer than the lower whisker, the distribution is probably:', options: [{ id: 'a', text: 'Left-skewed', isCorrect: false, explanation: 'Left skew = longer lower whisker.' }, { id: 'b', text: 'Right-skewed', isCorrect: true, explanation: 'Longer upper whisker = data extends further in the high direction = right skew.' }, { id: 'c', text: 'Symmetric', isCorrect: false, explanation: 'Symmetric distributions have equal upper and lower whiskers.' }, { id: 'd', text: 'Bimodal', isCorrect: false, explanation: 'Box plots cannot directly reveal bimodality.' }], explanation: 'Upper whisker represents spread in the high tail; lower whisker in the low tail. Upper whisker > lower whisker → right (positive) skew.', hint: 'Which direction does the longer whisker stretch?' },
    { id: 'bp-mc-13', type: 'multiple-choice', question: 'What is the five-number summary?', options: [{ id: 'a', text: 'Mean, SD, Variance, Skewness, Kurtosis', isCorrect: false, explanation: 'Those are moment-based statistics, not the five-number summary.' }, { id: 'b', text: 'Min, Q1, Median, Q3, Max', isCorrect: true, explanation: 'The five-number summary is the complete basis for a box plot.' }, { id: 'c', text: 'Min, Mean, Median, Mode, Max', isCorrect: false, explanation: 'The standard five-number summary uses quartiles, not mean or mode.' }, { id: 'd', text: 'Q1, Q2, Q3, IQR, Range', isCorrect: false, explanation: 'IQR and Range are derived from the five-number summary, not part of it.' }], explanation: 'Five-number summary: Min, Q1, Median (Q2), Q3, Max. These five statistics together describe the distribution\'s center, spread, and range. They are the basis for box plots.', hint: 'Five numbers that fully describe a box plot.' },
    { id: 'bp-mc-14', type: 'multiple-choice', question: 'A box plot shows no outlier dots. This means:', options: [{ id: 'a', text: 'The data is perfectly normal', isCorrect: false, explanation: 'No outliers by the 1.5×IQR rule does not imply normality.' }, { id: 'b', text: 'All values fall within the 1.5×IQR fences', isCorrect: true, explanation: 'No dots = no values beyond the whiskers = no values outside the 1.5×IQR fences.' }, { id: 'c', text: 'The dataset has only one value', isCorrect: false, explanation: 'One value would create a degenerate box, not necessarily no outliers.' }, { id: 'd', text: 'The mean equals the median', isCorrect: false, explanation: 'Outlier count has no direct relationship to mean-median equality.' }], explanation: 'In a modified box plot, dots appear for values beyond Q1−1.5×IQR or Q3+1.5×IQR. No dots means all values are within these fences.', hint: 'When would no outlier dots appear?' },
    { id: 'bp-mc-15', type: 'multiple-choice', question: 'You have test scores for 5 classes and want to compare their performance quickly. The BEST visualization is:', options: [{ id: 'a', text: 'A single histogram combining all classes', isCorrect: false, explanation: 'Combining all classes loses group identity.' }, { id: 'b', text: 'Side-by-side box plots for each class', isCorrect: true, explanation: 'Side-by-side box plots allow quick visual comparison of median, IQR, and outliers for all 5 groups.' }, { id: 'c', text: 'Five separate pie charts', isCorrect: false, explanation: 'Pie charts show proportions, not distributions.' }, { id: 'd', text: 'A scatter plot', isCorrect: false, explanation: 'Scatter plots show relationships between two variables, not distributions.' }], explanation: 'Side-by-side box plots are the standard tool for comparing distributions across multiple groups. They clearly show differences in center (median), spread (IQR), and outliers for each group.', hint: 'Which visualization is specifically designed for multi-group comparison?' },
  ],
  keyTakeaway:
    'A box plot displays five-number summary: min, Q1, median, Q3, max. The box shows the IQR (middle 50%), the line inside is the median, and dots beyond the whiskers are outliers. Box plots excel at comparing two or more distributions side by side.',
  visualization: (data) => <BoxPlotViz data={data} />,
  datasetGenerator: true,
}

export default function BoxPlot({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
