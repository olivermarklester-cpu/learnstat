import { useState, useMemo } from 'react'
import { useDataset } from '../../../hooks/useDataset.js'
import { frequencyTable } from '../../../utils/stats.js'
import TopicPage from '../../layout/TopicPage'
import DatasetGenerator from '../../shared/DatasetGenerator'
import { BarChart } from '../../charts'

// Worked example frequency table
const workedExampleTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Step</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Description</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Result</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">1</td>
          <td className="py-3 px-4 text-textDark">List each unique score (1, 2, 3, 4, 5)</td>
          <td className="py-3 px-4 font-mono">Scores: 1, 2, 3, 4, 5</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">2</td>
          <td className="py-3 px-4 text-textDark">Count how many times each appears</td>
          <td className="py-3 px-4 font-mono">1:0, 2:2, 3:5, 4:7, 5:6</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">3</td>
          <td className="py-3 px-4 text-textDark">Calculate relative frequency = count / 20</td>
          <td className="py-3 px-4 font-mono">0.00, 0.10, 0.25, 0.35, 0.30</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">4</td>
          <td className="py-3 px-4 text-textDark">Add cumulative frequency (running total)</td>
          <td className="py-3 px-4 font-mono">0, 2, 7, 14, 20</td>
        </tr>
      </tbody>
    </table>
  </div>
)

// Final frequency table from worked example
const finalFrequencyTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Score</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Count</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Relative Freq</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Cumulative Freq</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-textDark">1</td>
          <td className="text-center py-3 px-4">0</td>
          <td className="text-center py-3 px-4">0.00 (0%)</td>
          <td className="text-center py-3 px-4">0</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-textDark">2</td>
          <td className="text-center py-3 px-4">2</td>
          <td className="text-center py-3 px-4">0.10 (10%)</td>
          <td className="text-center py-3 px-4">2</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-textDark">3</td>
          <td className="text-center py-3 px-4">5</td>
          <td className="text-center py-3 px-4">0.25 (25%)</td>
          <td className="text-center py-3 px-4">7</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-textDark">4</td>
          <td className="text-center py-3 px-4">7</td>
          <td className="text-center py-3 px-4">0.35 (35%)</td>
          <td className="text-center py-3 px-4">14</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-textDark">5</td>
          <td className="text-center py-3 px-4">6</td>
          <td className="text-center py-3 px-4">0.30 (30%)</td>
          <td className="text-center py-3 px-4">20</td>
        </tr>
      </tbody>
    </table>
  </div>
)

// Live frequency table component
function LiveFrequencyTable({ data }) {
  const table = useMemo(() => frequencyTable(data), [data])

  if (!data || data.length === 0) {
    return <p className="text-sm text-textMuted italic">Generate data to see the frequency table.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-textDark">Value</th>
            <th className="text-center py-3 px-4 font-semibold text-textDark">Count</th>
            <th className="text-center py-3 px-4 font-semibold text-textDark">Relative Frequency</th>
            <th className="text-center py-3 px-4 font-semibold text-textDark">Cumulative Frequency</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row, i) => (
            <tr key={i} className="border-b border-border hover:bg-gray-50">
              <td className="py-3 px-4 font-mono font-bold text-textDark">{row.value}</td>
              <td className="text-center py-3 px-4">{row.count}</td>
              <td className="text-center py-3 px-4">{row.relativeFreq.toFixed(4)} ({(row.relativeFreq * 100).toFixed(1)}%)</td>
              <td className="text-center py-3 px-4">{row.cumulativeFreq}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-textMuted mt-2">
        Sum of relative frequencies: {table.reduce((sum, r) => sum + r.relativeFreq, 0).toFixed(4)} (should be 1.0000)
      </p>
    </div>
  )
}

const content = {
  title: 'Frequency Tables',
  topicGroup: 'Foundations',
  learningObjective:
    'Build and interpret a frequency table from a dataset, including relative and cumulative frequencies.',
  explanation:
    'A frequency table organizes data by listing each unique value (or group of values) and counting how many times it appears. It also shows the relative frequency (the proportion or percentage) and cumulative frequency (running total). Frequency tables are one of the first steps in understanding any dataset.',
  analogy:
    'Imagine you have a jar of 100 marbles in 5 colors. Instead of listing every single marble, you make a tally: Red: 25, Blue: 30, Green: 15, Yellow: 20, Purple: 10. That tally is a frequency table. The relative frequency tells you "30% are blue." The cumulative frequency tells you "55 marbles are red or blue."',
  formula: {
    sample: {
      expression: 'Relative Frequency = Count / n',
      label: 'Relative Frequency',
    },
    population: {
      expression: 'Cumulative Frequency = Σ Counts up to current value',
      label: 'Cumulative Frequency',
    },
    symbols: [
      { symbol: 'f', name: 'Frequency (Count)', description: 'Number of times a value appears' },
      { symbol: 'n', name: 'Total observations', description: 'Sum of all frequencies' },
      { symbol: 'rf', name: 'Relative frequency', description: 'f / n (proportion of total)' },
      { symbol: 'cf', name: 'Cumulative frequency', description: 'Running total of frequencies' },
    ],
    notes:
      'Relative frequencies always sum to 1.0 (or 100%). Cumulative frequency for the last row equals n. For continuous data, values are grouped into bins/intervals first.',
  },
  whenToUse: [
    'With any categorical or discrete data where you want to see how values are distributed.',
    'As the first step in exploratory data analysis — before calculating summary statistics.',
    'To check data quality — unexpected frequencies may reveal entry errors.',
  ],
  whenNotToUse: [
    'For continuous data without binning — you must group values into intervals first.',
    'When you only need a single summary number (use mean/median instead).',
  ],
  assumptions: [
    'Data is categorical, ordinal, or discrete numeric.',
    'Categories are mutually exclusive and exhaustive.',
    'For relative frequency: n > 0 (non-empty dataset).',
  ],
  workedExample: {
    scenario:
      'A clinic surveys 20 patients on satisfaction (1–5). Raw scores: 3, 4, 5, 4, 3, 5, 2, 4, 4, 3, 5, 5, 4, 3, 2, 4, 5, 3, 4, 5. Build the frequency table step by step.',
    dataset: '3, 4, 5, 4, 3, 5, 2, 4, 4, 3, 5, 5, 4, 3, 2, 4, 5, 3, 4, 5',
    steps: [
      {
        stepNumber: 1,
        label: 'Step 1: List each unique value in order',
        expression: 'Sort unique values: 1, 2, 3, 4, 5',
        result: 'Values: 1, 2, 3, 4, 5',
        explanation: 'Even though no one chose "1", we include it to show the full scale.',
      },
      {
        stepNumber: 2,
        label: 'Step 2: Count occurrences (frequency)',
        expression: 'Count each: 1→0, 2→2, 3→5, 4→7, 5→6',
        result: 'Counts: 0, 2, 5, 7, 6',
        explanation: 'Sum of counts = 20 = n. Always verify this!',
      },
      {
        stepNumber: 3,
        label: 'Step 3: Calculate relative frequency',
        expression: 'rf = count / 20: 0/20=0.00, 2/20=0.10, 5/20=0.25, 7/20=0.35, 6/20=0.30',
        result: 'Relative: 0.00, 0.10, 0.25, 0.35, 0.30',
        explanation: 'Relative frequencies sum to 1.00 (100%). Multiply by 100 for percentages.',
      },
      {
        stepNumber: 4,
        label: 'Step 4: Calculate cumulative frequency',
        expression: 'Running totals: 0, 0+2=2, 2+5=7, 7+7=14, 14+6=20',
        result: 'Cumulative: 0, 2, 7, 14, 20',
        explanation: 'Final cumulative frequency = n = 20. Shows "how many at or below this value."',
      },
    ],
    interpretation:
      'The table shows that 35% of patients rated satisfaction as 4, and 30% rated 5. Together, 65% gave a rating of 4 or 5. The cumulative frequency tells us that 14 patients (70%) rated 4 or below. No one gave a rating of 1.',
  },
  interpretation:
    'A frequency table turns raw data into a summary that shows how values are distributed across categories. The count tells you "how many." The relative frequency tells you "what proportion" — this is essential for comparing groups of different sizes. The cumulative frequency tells you "how many up to this point" — useful for percentiles and understanding the distribution shape. Always check that relative frequencies sum to 1.0.',
  commonMistakes: [
    {
      mistake: 'Forgetting that relative frequencies must sum to 1.0 (or 100%)',
      explanation:
        'If your relative frequencies sum to 0.95 or 1.05, you have a counting error. Always verify: Σ(f/n) = (Σf)/n = n/n = 1. This is a quick sanity check.',
    },
    {
      mistake: 'Not sorting values before building the table — order matters for reading the distribution',
      explanation:
        'For ordinal and numeric data, always sort values (e.g., 1, 2, 3, 4, 5) before counting. An unsorted table hides patterns. For nominal data, sort by frequency (most common first) or alphabetically.',
    },
    {
      mistake: 'Confusing frequency (count) with relative frequency (proportion)',
      explanation:
        'Frequency is an absolute number (e.g., "7 people chose 4"). Relative frequency is a proportion (e.g., "35% chose 4"). You cannot compare frequencies across datasets of different sizes, but you CAN compare relative frequencies.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'ft-easy-1',
        scenario:
          'A die is rolled 30 times. The outcomes: 1 appears 4 times, 2 appears 6 times, 3 appears 5 times, 4 appears 7 times, 5 appears 4 times, 6 appears 4 times.',
        question: 'Build the frequency table with count, relative frequency, and cumulative frequency.',
        hint: 'Relative frequency = count / 30. Cumulative = running total.',
        solution:
          'Value | Count | Rel Freq | Cum Freq\n1 | 4 | 0.133 (13.3%) | 4\n2 | 6 | 0.200 (20.0%) | 10\n3 | 5 | 0.167 (16.7%) | 15\n4 | 7 | 0.233 (23.3%) | 22\n5 | 4 | 0.133 (13.3%) | 26\n6 | 4 | 0.133 (13.3%) | 30\n\nCheck: Relative frequencies sum to 1.0. Final cumulative = 30.',
      },
      {
        id: 'ft-easy-2',
        scenario:
          'A hospital records patient admission type for 50 admissions: Emergency: 22, Scheduled: 18, Transfer: 10.',
        question: 'What is the relative frequency of Emergency admissions? What is the cumulative frequency after Scheduled?',
        hint: 'Relative = count / 50. Cumulative = Emergency + Scheduled.',
        solution:
          'Emergency relative frequency = 22/50 = 0.44 (44%).\nCumulative after Scheduled = 22 + 18 = 40 admissions (Emergency + Scheduled).',
      },
    ],
    moderate: [
      {
        id: 'ft-mod-1',
        scenario:
          'A frequency table for test scores (0–100) shows relative frequencies: 0–59: 0.15, 60–69: 0.20, 70–79: 0.30, 80–89: 0.25, 90–100: 0.10. The class has 40 students.',
        question: 'How many students scored in the 70–79 range? How many scored 80 or above?',
        hint: 'Count = relative frequency × n. Cumulative for 80+ = sum of top two relative frequencies × n.',
        solution:
          '70–79 range: 0.30 × 40 = 12 students.\n80 or above: (0.25 + 0.10) × 40 = 0.35 × 40 = 14 students.',
      },
      {
        id: 'ft-mod-2',
        scenario:
          'A researcher creates a frequency table but the relative frequencies sum to 1.12 instead of 1.00.',
        question: 'What is definitely wrong? List two possible causes.',
        hint: 'Sum of relative frequencies MUST equal 1. What could cause the sum to exceed 1?',
        solution:
          'The sum of relative frequencies must equal 1.00 (100%). A sum of 1.12 indicates an error. Possible causes: (1) Double-counting some observations, (2) Including a category twice, (3) Incorrect total n (denominator too small), (4) Data entry error in counts.',
      },
    ],
    challenging: [
      {
        id: 'ft-chal-1',
        scenario:
          'Two hospitals track patient satisfaction (1–5). Hospital A (n=200): 40% rate 5. Hospital B (n=50): 60% rate 5. A manager says "Hospital B has higher satisfaction because 60% > 40%."',
        question: 'Is this comparison valid using relative frequencies? What additional information would you want?',
        hint: 'Relative frequencies allow comparison across different sample sizes. But are the populations comparable?',
        solution:
          'Yes, relative frequencies ARE comparable across different sample sizes — that\'s their purpose. 60% > 40% is a valid comparison of the proportions. However, you should also check: (1) Are the patient populations similar (case mix)? (2) Is the sampling method the same? (3) What are the margins of error? Hospital B\'s smaller n means wider confidence intervals. The comparison of the two proportions is arithmetically valid (and a 20-point gap is large even given Hospital B\'s smaller n), but you should confirm the context before concluding Hospital B is truly better.',
      },
      {
        id: 'ft-chal-2',
        scenario:
          'A dataset has 1,000 observations of a continuous variable (salary). The analyst creates a frequency table with 500 unique values — each salary appears 1–3 times.',
        question: 'Why is this frequency table not useful? What should the analyst do instead?',
        hint: 'What is the purpose of a frequency table? What happens when there are too many unique values?',
        solution:
          'A frequency table with 500 rows for 1,000 observations defeats the purpose of summarization — it\'s nearly as long as the raw data. For continuous data, the analyst should BIN the data into intervals (e.g., $0–20k, $20–40k, etc.) to create a grouped frequency table. This reduces rows to a manageable number (typically 5–20 bins) and reveals the distribution shape.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ft-kc-1',
      type: 'multiple-choice',
      question: 'In a frequency table, the relative frequency for a value is calculated as:',
      options: [
        { id: 'a', text: 'Count × Total n', isCorrect: false, explanation: 'This would give a number larger than the count' },
        { id: 'b', text: 'Count / Total n', isCorrect: true, explanation: 'Relative frequency = frequency divided by total observations' },
        { id: 'c', text: 'Total n / Count', isCorrect: false, explanation: 'This is the inverse — would be > 1 for most values' },
        { id: 'd', text: 'Count − Total n', isCorrect: false, explanation: 'This would be negative for most values' },
      ],
      explanation:
        'Relative frequency is the proportion of observations that take a specific value. It equals the count for that value divided by the total number of observations (n).',
      hint: 'Relative frequency is a proportion — part divided by whole.',
    },
    {
      id: 'ft-kc-2',
      type: 'multiple-choice',
      question: 'What must the sum of all relative frequencies in a frequency table equal?',
      options: [
        { id: 'a', text: 'n (the sample size)', isCorrect: false, explanation: 'The sum of COUNTS equals n. Relative frequencies are proportions.' },
        { id: 'b', text: '1.0 (or 100%)', isCorrect: true, explanation: 'Relative frequencies are proportions that partition the whole' },
        { id: 'c', text: 'The number of unique values', isCorrect: false, explanation: 'This is the number of rows in the table, not the sum of relative frequencies' },
        { id: 'd', text: 'It depends on the data', isCorrect: false, explanation: 'It always equals 1.0 for any valid frequency table' },
      ],
      explanation:
        'Relative frequencies are proportions of the total. Since every observation falls into exactly one category, the proportions must sum to the whole = 1.0 (or 100%). This is a key validity check.',
      hint: 'Think: if you add up all the proportions of a whole, what do you get?',
    },
    {
      id: 'ft-kc-3',
      type: 'multiple-choice',
      question: 'The cumulative frequency for the last row in a frequency table always equals:',
      options: [
        { id: 'a', text: '1.0', isCorrect: false, explanation: '1.0 is the sum of relative frequencies, not cumulative frequency' },
        { id: 'b', text: 'The count for the last category', isCorrect: false, explanation: 'Cumulative frequency is a running total, not just the last count' },
        { id: 'c', text: 'n (the total number of observations)', isCorrect: true, explanation: 'Cumulative frequency adds up all counts; the final total is n' },
        { id: 'd', text: 'The number of unique values', isCorrect: false, explanation: 'That is the number of rows, not the cumulative count' },
      ],
      explanation:
        'Cumulative frequency is a running total of counts. By the last row, you have counted every observation, so the final cumulative frequency equals n.',
      hint: 'Cumulative = running total. What is the total of all counts?',
    },
    {
      id: 'ft-kc-4',
      type: 'multiple-choice',
      question: 'You have satisfaction ratings (1–5) from 100 customers. The frequency table shows: 1: 5, 2: 10, 3: 25, 4: 35, 5: 25. What percentage of customers rated 4 or 5?',
      options: [
        { id: 'a', text: '35%', isCorrect: false, explanation: 'That is only the percentage for rating 4' },
        { id: 'b', text: '60%', isCorrect: true, explanation: '35% + 25% = 60% rated 4 or 5' },
        { id: 'c', text: '25%', isCorrect: false, explanation: 'That is only the percentage for rating 5' },
        { id: 'd', text: '70%', isCorrect: false, explanation: 'Check the addition: ratings of 3 or below total 5+10+25 = 40 (40%), so 4 or 5 is 100% − 40% = 60%, not 70%' },
      ],
      explanation:
        'Rating 4: 35/100 = 35%. Rating 5: 25/100 = 25%. Combined: 35% + 25% = 60%. Alternatively, cumulative frequency for rating 3 is 40, so 100 - 40 = 60 rated 4 or 5.',
      hint: 'Add the relative frequencies for 4 and 5, or subtract cumulative for 3 from 100.',
    },
    {
      id: 'ft-kc-5',
      type: 'multiple-choice',
      question: 'When building a frequency table for a CONTINUOUS variable like height, what must you do first?',
      options: [
        { id: 'a', text: 'Calculate the mean and standard deviation', isCorrect: false, explanation: 'Summary statistics come after exploring the distribution' },
        { id: 'b', text: 'Group the data into intervals (bins)', isCorrect: true, explanation: 'Continuous data has too many unique values; binning creates a usable table' },
        { id: 'c', text: 'Sort the data ascending', isCorrect: false, explanation: 'Sorting helps but doesn\'t solve the "too many unique values" problem' },
        { id: 'd', text: 'Convert to categorical by rounding', isCorrect: false, explanation: 'Rounding is a form of binning, but "group into intervals" is the standard term' },
      ],
      explanation:
        'Continuous variables can take infinitely many values. A frequency table of raw values would have too many rows (one per unique value). The standard approach is to group values into intervals (bins/classes) — e.g., 150–160 cm, 160–170 cm — then count how many fall in each bin.',
      hint: 'Continuous data has many unique values. How do you reduce the number of rows in the table?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ft-tf-1', type: 'true-false', question: 'A frequency table lists each unique value (or category) and how often it appears.', isTrue: true, explanation: 'This is the basic definition of a frequency table: it enumerates every category or value and records its count (frequency).' },
    { id: 'ft-tf-2', type: 'true-false', question: 'The sum of all relative frequencies in a valid frequency table equals 2.0.', isTrue: false, explanation: 'Relative frequencies are proportions that partition the whole dataset. They must sum to exactly 1.0 (or 100%), not 2.0. This is a key validity check.' },
    { id: 'ft-tf-3', type: 'true-false', question: 'Cumulative frequency is calculated by adding the frequency of the current category to all previous categories.', isTrue: true, explanation: 'Cumulative frequency is a running total. For each row, you add the current count to the sum of all counts above it in the table.' },
    { id: 'ft-tf-4', type: 'true-false', question: 'For continuous data, a frequency table must group values into intervals (bins).', isTrue: true, explanation: 'Continuous data has too many unique values for a useful value-by-value table. Grouping into class intervals (bins) produces a manageable grouped frequency table.' },
    { id: 'ft-tf-5', type: 'true-false', question: 'The relative frequency of a category is always a value between 0 and 1 (inclusive).', isTrue: true, explanation: 'Relative frequency = count / n. Since 0 ≤ count ≤ n, the result is always between 0 and 1. A relative frequency of 0 means the category does not appear; 1 means all observations are in that category.' },
    { id: 'ft-tf-6', type: 'true-false', question: 'The last cumulative frequency in a frequency table equals the total sample size n.', isTrue: true, explanation: 'By the last row, you have accumulated all observations. The final cumulative frequency = total count = n.' },
    { id: 'ft-tf-7', type: 'true-false', question: 'A frequency table is only useful for categorical (nominal) data.', isTrue: false, explanation: 'Frequency tables can be built for any type of data. For discrete and continuous data, you use value frequencies or grouped intervals. They are widely used for ordinal, discrete quantitative, and grouped continuous data.' },
    { id: 'ft-tf-8', type: 'true-false', question: 'To find the percentage of observations in a category, multiply the relative frequency by 100.', isTrue: true, explanation: 'Relative frequency × 100 = percentage. For example, relative frequency = 0.35 → 35% of observations belong to that category.' },
    { id: 'ft-tf-9', type: 'true-false', question: 'In a frequency table, the frequency column shows proportions of the total.', isTrue: false, explanation: 'The FREQUENCY column shows raw counts. The RELATIVE FREQUENCY column shows proportions. These are different columns with different meanings.' },
    { id: 'ft-tf-10', type: 'true-false', question: 'A frequency table can reveal the mode of a dataset — it is the category with the highest frequency.', isTrue: true, explanation: 'The mode is the value that appears most often. In a frequency table, you can identify it as the row with the highest count.' },
    { id: 'ft-tf-11', type: 'true-false', question: 'Wider class intervals in a grouped frequency table always provide more detail about the distribution.', isTrue: false, explanation: 'Wider intervals group more values together, providing LESS detail. Narrower intervals provide more detail. The optimal bin width balances detail with readability.' },
    { id: 'ft-tf-12', type: 'true-false', question: 'A frequency table with too many narrow bins can obscure the overall shape of the distribution.', isTrue: true, explanation: 'Too many narrow bins can make a grouped frequency table look erratic (like noise) instead of revealing the underlying distribution shape. Bin width selection is an art and science.' },
    { id: 'ft-tf-13', type: 'true-false', question: 'Frequency tables are never used for nominal data.', isTrue: false, explanation: 'Frequency tables are excellent for nominal data! Counting how many observations fall in each category (e.g., blood type A: 45, B: 30, AB: 10, O: 75) is one of the most common uses.' },
    { id: 'ft-tf-14', type: 'true-false', question: 'The sum of all frequencies (counts) in a frequency table equals n, the total number of observations.', isTrue: true, explanation: 'Every observation falls into exactly one category. When you sum all the counts, you recover the total sample size n.' },
    { id: 'ft-tf-15', type: 'true-false', question: 'A relative frequency of 0.25 means 25 observations were in that category.', isTrue: false, explanation: 'A relative frequency of 0.25 means 25% of observations were in that category. The actual count depends on n. For example, if n=200, then 0.25 × 200 = 50 observations.' },
    { id: 'ft-tf-16', type: 'true-false', question: 'A bar chart is a common way to visualize data from a frequency table.', isTrue: true, explanation: 'Bar charts display the frequency or relative frequency for each category as the height of a bar, making frequency tables visual.' },
    { id: 'ft-tf-17', type: 'true-false', question: 'In a grouped frequency table, class intervals should overlap to avoid gaps.', isTrue: false, explanation: 'Class intervals must be mutually exclusive (no overlap) and collectively exhaustive (no gaps). Overlapping intervals would allow a value to be counted in two categories.' },
    { id: 'ft-tf-18', type: 'true-false', question: 'The cumulative relative frequency for the last category always equals 1.0.', isTrue: true, explanation: 'Cumulative relative frequency adds up proportions. By the last category, you have accounted for 100% of observations, so the final cumulative relative frequency = 1.0.' },
    { id: 'ft-tf-19', type: 'true-false', question: 'A frequency table can help identify skewness in a distribution.', isTrue: true, explanation: 'By examining where frequencies pile up (high or low values), you can detect skew. A long tail of decreasing frequencies on the right suggests positive skew.' },
    { id: 'ft-tf-20', type: 'true-false', question: 'The frequency for a category can exceed the sample size n.', isTrue: false, explanation: 'A frequency is a count of observations in that category. Since no single category can have more observations than the total, frequency ≤ n always. The maximum frequency for any category is n (all observations in that one category).' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ft-mc-6', type: 'multiple-choice', question: 'A frequency table shows: Very Satisfied: 15, Satisfied: 30, Neutral: 25, Dissatisfied: 20, Very Dissatisfied: 10. What is the total sample size n?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: '5 is the number of categories, not the total observations.' }, { id: 'b', text: '100', isCorrect: true, explanation: '15 + 30 + 25 + 20 + 10 = 100 total observations.' }, { id: 'c', text: '30', isCorrect: false, explanation: '30 is the frequency for "Satisfied," not the total.' }, { id: 'd', text: '50', isCorrect: false, explanation: 'Not the correct sum.' }], explanation: 'Sum all frequencies: 15 + 30 + 25 + 20 + 10 = 100. This is n, the total number of observations. You can verify: relative frequencies sum to 1.0 (15/100 + 30/100 + 25/100 + 20/100 + 10/100 = 1.0).', hint: 'Add all counts.' },
    { id: 'ft-mc-7', type: 'multiple-choice', question: 'Using the table above (n=100), what is the relative frequency for "Satisfied" (frequency = 30)?', options: [{ id: 'a', text: '30', isCorrect: false, explanation: '30 is the raw count (frequency), not the relative frequency.' }, { id: 'b', text: '0.30', isCorrect: true, explanation: '30 / 100 = 0.30. That is 30% of respondents.' }, { id: 'c', text: '3.0', isCorrect: false, explanation: 'Greater than 1 — impossible for a relative frequency.' }, { id: 'd', text: '0.03', isCorrect: false, explanation: 'That would be 30 / 1000, not 30 / 100.' }], explanation: 'Relative frequency = frequency / n = 30 / 100 = 0.30. Expressed as a percentage: 30%.', hint: 'Relative frequency = count / total.' },
    { id: 'ft-mc-8', type: 'multiple-choice', question: 'What is the cumulative frequency after "Neutral" (categories: Very Satisfied=15, Satisfied=30, Neutral=25)?', options: [{ id: 'a', text: '25', isCorrect: false, explanation: '25 is only the frequency for Neutral, not the cumulative total.' }, { id: 'b', text: '45', isCorrect: false, explanation: '45 = 15 + 30 (Very Satisfied + Satisfied), which leaves out Neutral.' }, { id: 'c', text: '70', isCorrect: true, explanation: '15 + 30 + 25 = 70. Cumulative counts all categories up to and including Neutral.' }, { id: 'd', text: '55', isCorrect: false, explanation: '55 = 30 + 25 (Satisfied + Neutral), which leaves out Very Satisfied. The correct total is 15 + 30 + 25 = 70.' }], explanation: 'Cumulative frequency = running total. After Neutral: 15 (Very Satisfied) + 30 (Satisfied) + 25 (Neutral) = 70.', hint: 'Add all counts from the first category up to and including the current one.' },
    { id: 'ft-mc-9', type: 'multiple-choice', question: 'A dataset of exam scores (0–100) is put into a frequency table with class intervals of width 10 (0–9, 10–19, …, 90–100). What type of frequency table is this?', options: [{ id: 'a', text: 'An ungrouped frequency table', isCorrect: false, explanation: 'Ungrouped tables list each individual value. This uses intervals (groups).' }, { id: 'b', text: 'A grouped (class interval) frequency table', isCorrect: true, explanation: 'Grouping continuous/many-valued data into class intervals creates a grouped frequency table.' }, { id: 'c', text: 'A relative frequency table', isCorrect: false, explanation: 'A relative frequency table shows proportions. This question is about the type, not the content.' }, { id: 'd', text: 'A cumulative frequency table', isCorrect: false, explanation: 'A cumulative frequency table shows running totals. Again, this is about the structure.' }], explanation: 'When values are grouped into class intervals (bins) — common for continuous data with many unique values — the result is a grouped frequency table. This is in contrast to an ungrouped table that lists each exact value.', hint: 'What type of table uses ranges (intervals) rather than individual values?' },
    { id: 'ft-mc-10', type: 'multiple-choice', question: 'Which of the following BEST describes the purpose of a frequency table?', options: [{ id: 'a', text: 'To test whether two variables are correlated', isCorrect: false, explanation: 'Correlation analysis serves that purpose.' }, { id: 'b', text: 'To summarize how data values are distributed across categories', isCorrect: true, explanation: 'Frequency tables organize counts (and proportions) by category, revealing the distribution of one variable.' }, { id: 'c', text: 'To calculate the mean and standard deviation', isCorrect: false, explanation: 'While you can estimate mean from a frequency table, that is not its primary purpose.' }, { id: 'd', text: 'To display relationships between two variables', isCorrect: false, explanation: 'Two-variable relationships use contingency (cross-tabulation) tables, not simple frequency tables.' }], explanation: 'A frequency table\'s primary purpose is to organize and display how often each value or category occurs in a dataset, revealing the variable\'s distribution.', hint: 'What question does a frequency table answer: "How often does each value appear?"' },
    { id: 'ft-mc-11', type: 'multiple-choice', question: 'In a frequency table for exam scores: 0–49: 5, 50–69: 20, 70–89: 45, 90–100: 30. What percentage scored 70 or above?', options: [{ id: 'a', text: '45%', isCorrect: false, explanation: 'That is only the 70–89 group.' }, { id: 'b', text: '30%', isCorrect: false, explanation: 'That is only the 90–100 group.' }, { id: 'c', text: '75%', isCorrect: true, explanation: 'Total n = 5+20+45+30 = 100. Scored 70+: 45+30 = 75. Relative frequency: 75/100 = 75%.' }, { id: 'd', text: '50%', isCorrect: false, explanation: 'Add the counts for 70–89 and 90–100: 45 + 30 = 75 out of 100.' }], explanation: 'n = 5+20+45+30 = 100. Students scoring 70+: 45 (70–89) + 30 (90–100) = 75. Relative frequency: 75/100 = 0.75 = 75%.', hint: 'Add the frequencies for 70–89 and 90–100, then divide by n.' },
    { id: 'ft-mc-12', type: 'multiple-choice', question: 'What is the purpose of a cumulative frequency column in a frequency table?', options: [{ id: 'a', text: 'To show the proportion for each category', isCorrect: false, explanation: 'Proportions are shown by the relative frequency column.' }, { id: 'b', text: 'To show how many observations fall at or below each category', isCorrect: true, explanation: 'Cumulative frequency shows a running total — how many observations have been counted so far up to that point.' }, { id: 'c', text: 'To calculate the mean', isCorrect: false, explanation: 'The mean can be estimated from a frequency table but cumulative frequency is not needed for that.' }, { id: 'd', text: 'To sort the data in descending order', isCorrect: false, explanation: 'Cumulative frequency assumes ascending order, but it does not sort the data itself.' }], explanation: 'Cumulative frequency answers: "How many observations scored at or below X?" It is the running total of counts as you move through the categories. Useful for finding percentiles and quartiles.', hint: '"At or below" = cumulative.' },
    { id: 'ft-mc-13', type: 'multiple-choice', question: 'A frequency table shows 5 categories. If the relative frequencies are 0.10, 0.25, 0.30, RF₄, and 0.15, what is RF₄?', options: [{ id: 'a', text: '0.10', isCorrect: false, explanation: 'All relative frequencies must sum to 1.0. Check: 0.10+0.25+0.30+0.10+0.15 = 0.90 ≠ 1.0.' }, { id: 'b', text: '0.20', isCorrect: true, explanation: '0.10+0.25+0.30+RF₄+0.15 = 1.0 → RF₄ = 1.0 - 0.80 = 0.20.' }, { id: 'c', text: '0.30', isCorrect: false, explanation: '0.10+0.25+0.30+0.30+0.15 = 1.10 > 1.0. Impossible.' }, { id: 'd', text: '0.25', isCorrect: false, explanation: '0.10+0.25+0.30+0.25+0.15 = 1.05 > 1.0. Impossible.' }], explanation: 'Sum of all relative frequencies = 1.0. Known values: 0.10+0.25+0.30+0.15 = 0.80. So RF₄ = 1.0 - 0.80 = 0.20.', hint: 'All relative frequencies must sum to 1. Solve: 1.0 - (sum of known values) = missing value.' },
    { id: 'ft-mc-14', type: 'multiple-choice', question: 'A frequency table is most similar to which visualization?', options: [{ id: 'a', text: 'Scatter plot', isCorrect: false, explanation: 'Scatter plots show relationships between two quantitative variables.' }, { id: 'b', text: 'Box plot', isCorrect: false, explanation: 'Box plots show the five-number summary of one quantitative variable.' }, { id: 'c', text: 'Bar chart', isCorrect: true, explanation: 'A bar chart visualizes the same information as a frequency table — category on one axis, count or proportion on the other.' }, { id: 'd', text: 'Line chart', isCorrect: false, explanation: 'Line charts show trends over time or continuous variables.' }], explanation: 'A bar chart is the visual equivalent of a frequency table: each bar corresponds to a category, and its height represents the frequency or relative frequency. The two convey the same information in different formats.', hint: 'Which chart shows bars whose heights equal category counts?' },
    { id: 'ft-mc-15', type: 'multiple-choice', question: 'For which type of data is a grouped frequency table (using class intervals) most appropriate?', options: [{ id: 'a', text: 'Nominal data with 3 categories', isCorrect: false, explanation: 'A simple (ungrouped) table works fine for nominal data with few categories.' }, { id: 'b', text: 'Continuous quantitative data with many unique values', isCorrect: true, explanation: 'Continuous data often has hundreds of unique values. Grouping into intervals makes the distribution interpretable.' }, { id: 'c', text: 'Binary data (Yes/No)', isCorrect: false, explanation: 'Binary data has only 2 categories — an ungrouped table is fine.' }, { id: 'd', text: 'Small datasets with fewer than 5 observations', isCorrect: false, explanation: 'Grouping is usually unnecessary for very small datasets.' }], explanation: 'Continuous variables can take infinitely many values — listing every unique value would produce a meaningless table. Grouping into intervals (bins) reduces the table to a manageable, informative summary of the distribution shape.', hint: 'Which type of data has too many unique values to list individually?' },
  ],
  keyTakeaway:
    'A frequency table turns raw data into a summary that shows how values are distributed across categories. Count = how many; Relative frequency = what proportion; Cumulative frequency = how many up to this point. Always verify relative frequencies sum to 1.0.',
  visualization: null, // Will be rendered dynamically
  datasetGenerator: true,
}

export default function FrequencyTables({ topicId }) {
  const dataset = useDataset({ distribution: 'binomial', n: 20, trials: 5, p: 0.6, decimals: 0 })
  const { data, generateNew } = dataset
  const [showWorkedExample, setShowWorkedExample] = useState(true)

  // Derive bar chart labels/values from the live frequency table
  const freqTable = useMemo(() => frequencyTable(data), [data])
  const freqLabels = useMemo(() => freqTable.map((r) => String(r.value)), [freqTable])
  const freqValues = useMemo(() => freqTable.map((r) => r.count), [freqTable])

  return (
    <TopicPage
      content={{
        ...content,
        visualization: (
          <div className="space-y-6">
            {/* Dataset Generator */}
            <DatasetGenerator
              topicId={topicId}
              showStats={true}
              onDataChange={() => {}}
            />

            {/* Live Frequency Table */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">📋</span> Live Frequency Table
              </h2>
              <LiveFrequencyTable data={data} />
            </div>

            {/* Bar Chart — live frequency distribution */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">📊</span> Distribution Visualization
              </h2>
              <BarChart
                labels={freqLabels}
                values={freqValues}
                title="Frequency Distribution"
                xLabel="Value"
                yLabel="Count"
              />
            </div>

            {/* Worked Example Table (shown initially) */}
            {showWorkedExample && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-base font-semibold text-blue-800 mb-4">Worked Example: Step-by-Step Frequency Table</h3>
                {workedExampleTable}
                <h4 className="text-sm font-semibold text-blue-800 mt-4 mb-2">Final Frequency Table</h4>
                {finalFrequencyTable}
              </div>
            )}
          </div>
        ),
      }}
      topicId={topicId}
    />
  )
}