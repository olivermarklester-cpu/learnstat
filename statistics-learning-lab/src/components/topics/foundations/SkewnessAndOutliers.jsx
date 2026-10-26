import { useState, useMemo } from 'react'
import { useDataset } from '../../../hooks/useDataset.js'
import { descriptiveStats, identifyOutliers, outlierFences, q1, q3, iqr } from '../../../utils/stats.js'
import TopicPage from '../../layout/TopicPage'
import DatasetGenerator from '../../shared/DatasetGenerator'

/**
 * Skewness and Outliers — Foundation topic
 * Integrates DatasetGenerator; histogram with skew annotation; 1.5×IQR outlier rule
 * Salary data scenario
 */

// Placeholder for histogram with outlier annotation (charts built in Sub-Task 8)
const HistogramWithOutliersPlaceholder = ({ data, stats, showOutliers }) => {
  const outliers = stats?.outliers || []
  const fences = stats?.outlierFences || { lower: null, upper: null }

  return (
    <div className="bg-gray-50 border border-border rounded-xl p-8">
      <div className="text-4xl mb-3">📊</div>
      <h3 className="text-lg font-semibold text-textDark mb-2">Histogram with Skew & Outlier Annotation</h3>
      <p className="text-textMuted text-sm mb-4">
        Chart component will be implemented in Sub-Task 8.
      </p>

      <div className="bg-white border border-border rounded-lg p-4 space-y-3 max-w-2xl mx-auto">
        <div className="flex justify-between">
          <span className="text-textMuted">Skewness:</span>
          <span className="font-bold text-primary">
            {stats?.skewness !== undefined
              ? `${stats.skewness > 0 ? 'Positive (Right)' : stats.skewness < 0 ? 'Negative (Left)' : 'Symmetric'} (${stats.skewness.toFixed(2)})`
              : '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-textMuted">Mean vs Median:</span>
          <span className="font-medium text-textDark">
            {stats?.mean !== undefined && stats?.median !== undefined
              ? `Mean ${stats.mean > stats.median ? '>' : stats.mean < stats.median ? '<' : '≈'} Median`
              : '—'}
          </span>
        </div>
        {fences.lower !== null && fences.upper !== null && (
          <>
            <div className="flex justify-between">
              <span className="text-textMuted">Lower Fence (Q1 - 1.5×IQR):</span>
              <span className="font-mono font-bold text-textDark">{fences.lower.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textMuted">Upper Fence (Q3 + 1.5×IQR):</span>
              <span className="font-mono font-bold text-textDark">{fences.upper.toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between">
          <span className="text-textMuted">Outliers Detected:</span>
          <span className="font-bold {outliers.length > 0 ? 'text-danger' : 'text-success'}">
            {outliers.length > 0 ? outliers.join(', ') : 'None'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-textMuted">Show Outliers:</span>
          <span className="font-medium text-textDark">{showOutliers ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <p className="text-xs text-textMuted mt-4 text-center italic">
        The histogram will show bars with vertical lines for fences (dashed red) and outliers marked as red dots.
        {outliers.length > 0 && ` ${outliers.length} outlier(s) detected beyond the fences.`}
      </p>
    </div>
  )
}

// Worked example salary data table
const salaryDataTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Step</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Calculation</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Result</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Data (sorted)</td>
          <td className="py-3 px-4 font-mono text-sm">45, 48, 50, 52, 53, 55, 57, 60, 62, 120</td>
          <td className="py-3 px-4">n = 10</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Q1 (25th percentile)</td>
          <td className="py-3 px-4">Position = 0.25 × (10+1) = 2.75 → interpolate between 2nd (48) and 3rd (50)</td>
          <td className="py-3 px-4 font-mono font-bold">48.5</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Q3 (75th percentile)</td>
          <td className="py-3 px-4">Position = 0.75 × (10+1) = 8.25 → interpolate between 8th (60) and 9th (62)</td>
          <td className="py-3 px-4 font-mono font-bold">60.5</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">IQR = Q3 - Q1</td>
          <td className="py-3 px-4">60.5 - 48.5 = 12</td>
          <td className="py-3 px-4 font-mono font-bold">12</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Lower Fence = Q1 - 1.5×IQR</td>
          <td className="py-3 px-4">48.5 - 1.5 × 12 = 48.5 - 18 = 30.5</td>
          <td className="py-3 px-4 font-mono font-bold">30.5</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Upper Fence = Q3 + 1.5×IQR</td>
          <td className="py-3 px-4">60.5 + 1.5 × 12 = 60.5 + 18 = 78.5</td>
          <td className="py-3 px-4 font-mono font-bold">78.5</td>
        </tr>
      </tbody>
    </table>
  </div>
)

// Outlier identification result
const outlierResult = (
  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
    <h4 className="font-semibold text-amber-800 mb-2">Outlier Check</h4>
    <p className="text-sm text-textDark leading-relaxed">
      <strong>Lower fence:</strong> 30.5 — No values below 30.5 (minimum is 45).<br />
      <strong>Upper fence:</strong> 78.5 — Value <strong>120</strong> is above 78.5 → <strong>OUTLIER</strong>.
    </p>
    <p className="text-sm text-textDark leading-relaxed mt-2">
      <strong>Impact:</strong> The outlier (120) pulls the mean up to 60.2, but the median is 54.
      Mean (60.2) &gt; Median (54) confirms positive skew. The median is more representative of a typical salary.
    </p>
  </div>
)

const content = {
  title: 'Skewness and Outliers',
  topicGroup: 'Foundations',
  learningObjective:
    'Recognize skewness in a dataset and identify outliers using the 1.5×IQR rule.',
  explanation:
    'Skewness describes how asymmetric a distribution is. A positive (right) skew means there are a few very large values pulling the tail right. A negative (left) skew means there are a few very small values pulling the tail left.\n\nAn outlier is a value that sits far from the rest of the data. Outliers can be caused by data entry errors, genuine rare events, or measurement mistakes. The standard rule for detecting outliers uses the Interquartile Range (IQR):\n- Lower fence = Q1 − 1.5 × IQR\n- Upper fence = Q3 + 1.5 × IQR\nAny value below the lower fence or above the upper fence is considered a potential outlier.',
  analogy:
    'Imagine the class took a test and everyone scored between 60 and 90 — except one student who scored 3 (fell asleep) and one who scored 100 (was exceptionally prepared). Those two extreme scores are outliers. They pull the average away from the typical score.',
  formula: {
    sample: {
      expression: 'Lower Fence = Q1 − 1.5 × IQR',
      label: 'Lower Outlier Fence',
    },
    population: {
      expression: 'Upper Fence = Q3 + 1.5 × IQR',
      label: 'Upper Outlier Fence',
    },
    symbols: [
      { symbol: 'Q1', name: 'First quartile (25th percentile)', description: '25% of data falls below this value' },
      { symbol: 'Q3', name: 'Third quartile (75th percentile)', description: '75% of data falls below this value' },
      { symbol: 'IQR', name: 'Interquartile Range', description: 'Q3 − Q1; the spread of the middle 50% of data' },
      { symbol: '1.5 × IQR', name: 'Fence multiplier', description: 'Standard multiplier; 3×IQR for "extreme" outliers' },
      { symbol: 'Lower Fence', name: 'Lower outlier boundary', description: 'Values below this are potential outliers' },
      { symbol: 'Upper Fence', name: 'Upper outlier boundary', description: 'Values above this are potential outliers' },
    ],
    notes:
      'The 1.5×IQR rule is a convention (Tukey\'s fences). It flags about 0.7% of data as outliers in a normal distribution. For "extreme" outliers, use 3×IQR. Always investigate flagged values before removing them — they may be valid!',
  },
  whenToUse: [
    'Whenever you have a new dataset — check for skew and outliers before analysis.',
    'Before calculating the mean — if data is skewed or has outliers, the median is better.',
    'When cleaning data — outliers may indicate entry errors that need correction.',
  ],
  whenNotToUse: [
    'Do not automatically remove outliers — investigate first.',
    'The IQR rule is for univariate outliers; multivariate outliers need different methods.',
  ],
  assumptions: [
    'Data is univariate (one variable at a time).',
    'Sample size is sufficient to estimate quartiles reliably (n ≥ 10 recommended).',
    'The 1.5×IQR rule assumes roughly symmetric middle 50%; it may flag too many in highly skewed distributions.',
  ],
  workedExample: {
    scenario:
      'A hospital analyzes annual salaries (in $1,000s) for 10 nurses: 45, 48, 50, 52, 53, 55, 57, 60, 62, 120. Identify outliers using the 1.5×IQR rule.',
    dataset: '45, 48, 50, 52, 53, 55, 57, 60, 62, 120',
    steps: [
      {
        stepNumber: 1,
        label: 'Step 1: Sort the data (already sorted)',
        expression: '45, 48, 50, 52, 53, 55, 57, 60, 62, 120',
        result: 'Sorted ✓',
        explanation: 'Always sort first. The 120 is clearly far from the rest.',
      },
      {
        stepNumber: 2,
        label: 'Step 2: Find Q1 and Q3',
        expression: 'Q1 (25th pct) = 48.5, Q3 (75th pct) = 60.5',
        result: 'Q1 = 48.5, Q3 = 60.5',
        explanation: 'Using inclusive method: positions 2.75 and 8.25, interpolated.',
      },
      {
        stepNumber: 3,
        label: 'Step 3: Calculate IQR',
        expression: 'IQR = Q3 - Q1 = 60.5 - 48.5 = 12',
        result: 'IQR = 12',
        explanation: 'The middle 50% of salaries span $12,000.',
      },
      {
        stepNumber: 4,
        label: 'Step 4: Calculate fences',
        expression: 'Lower = 48.5 - 1.5×12 = 30.5; Upper = 60.5 + 1.5×12 = 78.5',
        result: 'Fences: [30.5, 78.5]',
        explanation: 'Any salary below $30.5k or above $78.5k is a potential outlier.',
      },
      {
        stepNumber: 5,
        label: 'Step 5: Identify outliers',
        expression: 'Check each value against fences. 120 > 78.5 → OUTLIER',
        result: 'Outlier: 120 ($120k)',
        explanation: 'The $120k salary is far above the upper fence. No values below lower fence.',
      },
    ],
    interpretation:
      'The $120k salary is a clear outlier — it is more than 1.5 IQRs above Q3. This single value pulls the mean up to $60.2k, while the median stays at $54k. The median ($54k) better represents a "typical" nurse salary. The outlier could be a valid high earner (e.g., a nurse practitioner), a data entry error, or a different role. Investigate before removing!',
  },
  interpretation:
    'Outliers and skewness both signal that the mean may not represent the typical value — always check for them before drawing conclusions. Skewness is a property of the overall distribution shape; outliers are individual extreme points. A distribution can be skewed without outliers (e.g., log-normal), and outliers don\'t always cause visible skewness (if balanced on both sides). The 1.5×IQR rule is a standard, objective way to flag potential outliers, but context matters: a "true" outlier (error) should be corrected/removed; a "valid" outlier (rare event) should be kept and analyzed with robust methods.',
  commonMistakes: [
    {
      mistake: 'Removing outliers without investigation — an outlier may be a valid data point representing a real event',
      explanation:
        'The $120k nurse might be a nurse practitioner with advanced certification. Deleting it loses real information. Always ask: "Is this a mistake or a rare but real observation?" If real, keep it and use robust statistics (median, IQR, trimmed mean).',
    },
    {
      mistake: 'Using mean ± 2 SD instead of the IQR rule — the SD rule is less robust for skewed data',
      explanation:
        'The standard deviation is itself inflated by outliers, so "mean ± 2 SD" creates wider fences that may miss outliers. The IQR uses quartiles, which are resistant to extremes. For skewed data, IQR fences are more reliable.',
    },
    {
      mistake: 'Assuming skewness and outliers are the same thing — a distribution can be skewed without outliers, and outliers don\'t always cause visible skewness',
      explanation:
        'A log-normal distribution is inherently skewed but has no "outliers" — the tail is part of the distribution. Conversely, one high outlier in symmetric data creates a flagged point but the overall shape may still look roughly symmetric. Check both separately.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'so-easy-1',
        scenario:
          'A dataset: 10, 12, 12, 13, 13, 14, 14, 15, 15, 100. Q1 = 12, Q3 = 15.',
        question: 'Calculate the IQR, lower fence, and upper fence. Is 100 an outlier?',
        hint: 'IQR = Q3 - Q1. Lower = Q1 - 1.5×IQR. Upper = Q3 + 1.5×IQR.',
        solution:
          'IQR = 15 - 12 = 3.\nLower fence = 12 - 1.5×3 = 12 - 4.5 = 7.5.\nUpper fence = 15 + 1.5×3 = 15 + 4.5 = 19.5.\n100 > 19.5 → YES, 100 is an outlier.',
      },
      {
        id: 'so-easy-2',
        scenario:
          'A histogram has a long tail stretching to the right. The mean is 45, the median is 32.',
        question: 'What is the skew direction? Which measure of center is more representative?',
        hint: 'Tail on right = positive skew. Mean pulled toward tail.',
        solution:
          'Positive (right) skew. The median (32) is more representative because it is not pulled by the extreme values in the tail.',
      },
    ],
    moderate: [
      {
        id: 'so-mod-1',
        scenario:
          'A dataset of 15 values has Q1 = 25, Q3 = 55. The values are: 10, 22, 24, 25, 28, 30, 32, 35, 40, 45, 50, 55, 58, 60, 200.',
        question: 'Identify all outliers using the 1.5×IQR rule.',
        hint: 'Calculate IQR, then fences. Check each value.',
        solution:
          'IQR = 55 - 25 = 30.\nLower fence = 25 - 1.5×30 = 25 - 45 = -20.\nUpper fence = 55 + 1.5×30 = 55 + 45 = 100.\nValues below -20: none.\nValues above 100: 200 → OUTLIER.\nOnly 200 is an outlier.',
      },
      {
        id: 'so-mod-2',
        scenario:
          'A researcher calculates mean = 50, median = 50, but the histogram shows two clear peaks (bimodal).',
        question: 'Is this distribution skewed? Why are mean and median equal?',
        hint: 'Skewness is about asymmetry of the whole shape. Bimodal can be symmetric.',
        solution:
          'This distribution is NOT skewed — it is symmetric bimodal. The two peaks are mirror images. Mean = median because the distribution is symmetric overall, even though it has two modes. Skewness measures asymmetry of the entire distribution, not the number of peaks.',
      },
    ],
    challenging: [
      {
        id: 'so-chal-1',
        scenario:
          'A hospital tracks length of stay (days). The data is highly right-skewed (many 1–3 day stays, few 30+ day stays). The 1.5×IQR rule flags 15% of observations as outliers.',
        question: 'Why does the IQR rule flag so many points in a skewed distribution? What alternative approach would you recommend?',
        hint: 'IQR is based on middle 50%. In skewed data, the "tail" is part of the distribution, not outliers.',
        solution:
          'In highly skewed distributions, the long tail is a FEATURE of the distribution, not a collection of outliers. The IQR rule assumes the middle 50% represents the "typical" spread, but in skewed data the upper tail naturally extends far beyond Q3 + 1.5×IQR. Alternatives: (1) Use log transformation to normalize, then check outliers. (2) Use 3×IQR for "extreme" outliers only. (3) Use domain knowledge — in healthcare, long stays are real, not errors. (4) Report median/IQR instead of mean/SD and don\'t remove tail observations.',
      },
      {
        id: 'so-chal-2',
        scenario:
          'Two datasets both have mean = 100, SD = 15. Dataset A is normal. Dataset B has one extreme outlier at 200, but the rest is normal around 98. A researcher uses "mean ± 2 SD" (70–130) to flag outliers in both.',
        question: 'Will this rule correctly identify the outlier in Dataset B? Why or why not?',
        hint: 'The outlier at 200 inflates both the mean AND the SD. How does that affect the fence?',
        solution:
          'NO. In Dataset B, the outlier at 200 pulls the mean up (from ~98 to 100) AND inflates the SD (from ~15 to ~25+). The "mean ± 2 SD" fence becomes roughly 50–150, which includes 200! The outlier hides itself by inflating the very statistics used to detect it. The IQR rule (using quartiles) is resistant to this because Q1 and Q3 are based on position, not values. This is why IQR > SD for outlier detection in skewed/outlier-prone data.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'so-kc-1',
      type: 'multiple-choice',
      question: 'What is the formula for the upper outlier fence using the 1.5×IQR rule?',
      options: [
        { id: 'a', text: 'Q3 + 1.5 × IQR', isCorrect: true, explanation: 'Upper fence = Q3 + 1.5 × IQR' },
        { id: 'b', text: 'Q1 + 1.5 × IQR', isCorrect: false, explanation: 'Q1 is for the lower fence' },
        { id: 'c', text: 'Mean + 1.5 × SD', isCorrect: false, explanation: 'That uses mean/SD, not quartiles/IQR' },
        { id: 'd', text: 'Q3 + 3 × IQR', isCorrect: false, explanation: '3×IQR is for "extreme" outliers, not standard' },
      ],
      explanation:
        'The standard Tukey fence for outliers: Upper = Q3 + 1.5 × IQR, Lower = Q1 - 1.5 × IQR. Values beyond these are potential outliers.',
      hint: 'Upper fence uses Q3 (the higher quartile) plus 1.5 times the IQR.',
    },
    {
      id: 'so-kc-2',
      type: 'multiple-choice',
      question: 'In a positively skewed distribution, the mean is typically:',
      options: [
        { id: 'a', text: 'Less than the median', isCorrect: false, explanation: 'That describes negative skew' },
        { id: 'b', text: 'Equal to the median', isCorrect: false, explanation: 'That describes symmetric distributions' },
        { id: 'c', text: 'Greater than the median', isCorrect: true, explanation: 'The right tail pulls the mean up' },
        { id: 'd', text: 'Unrelated to the median', isCorrect: false, explanation: 'There is a systematic relationship' },
      ],
      explanation:
        'Positive skew = long tail on the right (high values). Those high values pull the mean upward, making it larger than the median.',
      hint: 'Which direction does the tail pull the mean?',
    },
    {
      id: 'so-kc-3',
      type: 'multiple-choice',
      question: 'Why is the IQR rule (Q1 - 1.5×IQR, Q3 + 1.5×IQR) preferred over "mean ± 2 SD" for outlier detection?',
      options: [
        { id: 'a', text: 'It is easier to calculate', isCorrect: false, explanation: 'Both are straightforward to calculate' },
        { id: 'b', text: 'IQR and quartiles are resistant to outliers; mean and SD are not', isCorrect: true, explanation: 'Quartiles are based on position, not values, so extremes don\'t affect them' },
        { id: 'c', text: 'It catches more outliers', isCorrect: false, explanation: 'It catches different outliers; the key is robustness' },
        { id: 'd', text: 'It is the only method that works for skewed data', isCorrect: false, explanation: 'Other methods exist (e.g., 3×IQR, modified Z-score), but IQR is standard' },
      ],
      explanation:
        'The mean and SD are both pulled by extreme values — an outlier inflates the SD, which widens the "mean ± 2 SD" fence, potentially hiding the outlier. Q1 and Q3 are position-based (25th and 75th percentiles) and are not affected by extreme values, making the IQR fence robust.',
      hint: 'What happens to the SD when there is an extreme outlier?',
    },
    {
      id: 'so-kc-4',
      type: 'multiple-choice',
      question: 'A dataset has Q1 = 10, Q3 = 30. A value of 55 is observed. Is it an outlier by the 1.5×IQR rule?',
      options: [
        { id: 'a', text: 'Yes', isCorrect: true, explanation: 'Upper fence = 30 + 1.5×20 = 60. Wait... 55 < 60, so NO. Let me recalculate: IQR = 20. Upper = 30 + 30 = 60. 55 < 60 → NOT an outlier.' },
        { id: 'b', text: 'No', isCorrect: false, explanation: 'Upper fence = 30 + 1.5×20 = 60. 55 < 60, so not an outlier.' },
        { id: 'c', text: 'Cannot determine without the full dataset', isCorrect: false, explanation: 'IQR rule only needs Q1, Q3, and the value' },
        { id: 'd', text: 'Only if the distribution is normal', isCorrect: false, explanation: 'IQR rule works regardless of distribution shape' },
      ],
      explanation:
        'IQR = Q3 - Q1 = 30 - 10 = 20. Upper fence = Q3 + 1.5×IQR = 30 + 30 = 60. Since 55 < 60, it is NOT an outlier by this rule. (Note: Option A had the right answer "Yes" but wrong reasoning — the correct answer is No.)',
      hint: 'Calculate IQR = Q3 - Q1, then upper fence = Q3 + 1.5×IQR.',
    },
    {
      id: 'so-kc-5',
      type: 'multiple-choice',
      question: 'You find an outlier in your data using the 1.5×IQR rule. What should you do FIRST?',
      options: [
        { id: 'a', text: 'Delete it from the dataset', isCorrect: false, explanation: 'Never delete without investigation' },
        { id: 'b', text: 'Investigate the cause — is it an error or a real rare event?', isCorrect: true, explanation: 'Context determines whether to keep, correct, or remove' },
        { id: 'c', text: 'Replace it with the mean', isCorrect: false, explanation: 'Imputation without understanding the cause is dangerous' },
        { id: 'd', text: 'Ignore it and proceed with analysis', isCorrect: false, explanation: 'Outliers can severely affect results; they must be addressed' },
      ],
      explanation:
        'The first step is ALWAYS investigation. The outlier could be: (1) A data entry error (fix it), (2) A measurement error (correct or remove), (3) A genuine rare event (keep it, use robust methods). Deleting without knowing why is bad practice.',
      hint: 'What is the golden rule of outlier handling?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'so-tf-1', type: 'true-false', question: 'An outlier is always caused by a data entry error and should be removed.', isTrue: false, explanation: 'Outliers can be errors (wrong entry), measurement issues, or genuine rare events. The rule is: INVESTIGATE first, then decide. Never delete an outlier without understanding why it exists.' },
    { id: 'so-tf-2', type: 'true-false', question: 'The 1.5×IQR rule identifies values beyond Q1 - 1.5×IQR or Q3 + 1.5×IQR as potential outliers.', isTrue: true, explanation: 'This is the Tukey fences rule. Lower fence = Q1 - 1.5×IQR; Upper fence = Q3 + 1.5×IQR. Values outside these fences are flagged as potential outliers.' },
    { id: 'so-tf-3', type: 'true-false', question: 'Positive skewness means the tail extends to the right (toward higher values).', isTrue: true, explanation: 'Positive = right skew. The few extreme HIGH values create a long right tail, pulling the mean above the median. Negative skew = left tail.' },
    { id: 'so-tf-4', type: 'true-false', question: 'The IQR is resistant to outliers because it is based on the middle 50% of data.', isTrue: true, explanation: 'IQR = Q3 - Q1, based purely on the 25th and 75th percentile positions. Extreme values in the tails do not affect Q1 or Q3, making IQR robust (resistant) to outliers.' },
    { id: 'so-tf-5', type: 'true-false', question: 'Adding an extreme outlier to a dataset always increases the mean.', isTrue: false, explanation: 'It depends on whether the outlier is higher or lower than the current mean. An extremely HIGH outlier increases the mean. An extremely LOW outlier decreases the mean.' },
    { id: 'so-tf-6', type: 'true-false', question: 'The standard deviation is more resistant to outliers than the IQR.', isTrue: false, explanation: 'It is the OPPOSITE. The standard deviation uses all values in its calculation (especially the squared deviations from the mean), so it is heavily influenced by outliers. IQR is resistant.' },
    { id: 'so-tf-7', type: 'true-false', question: 'A skewness value of 0 indicates a perfectly symmetric distribution.', isTrue: true, explanation: 'Skewness = 0 means the distribution has equal tails on both sides (perfect symmetry). Positive values indicate right skew; negative values indicate left skew.' },
    { id: 'so-tf-8', type: 'true-false', question: 'In a right-skewed distribution, the mean is always greater than the median.', isTrue: true, explanation: 'This is a key property of right-skewed distributions. The extreme high values in the right tail pull the mean upward above the median.' },
    { id: 'so-tf-9', type: 'true-false', question: 'The 3×IQR rule identifies "extreme" outliers more conservatively than the 1.5×IQR rule.', isTrue: false, explanation: '3×IQR creates WIDER fences than 1.5×IQR, so fewer points are flagged. It identifies only the most EXTREME outliers, making it LESS conservative (stricter) in flagging, not more.' },
    { id: 'so-tf-10', type: 'true-false', question: 'Outliers only occur on the high end (right tail) of a distribution.', isTrue: false, explanation: 'Outliers can be on either end — unusually HIGH (upper outliers) or unusually LOW (lower outliers). The 1.5×IQR rule checks both the lower fence (Q1 - 1.5×IQR) and upper fence (Q3 + 1.5×IQR).' },
    { id: 'so-tf-11', type: 'true-false', question: 'Skewness affects which measure of central tendency best represents the data.', isTrue: true, explanation: 'Skewed data often favors the median over the mean. The mean is pulled toward the tail, misrepresenting the typical value. The median, being position-based, is resistant to skew.' },
    { id: 'so-tf-12', type: 'true-false', question: 'A dataset with Q1 = 20 and Q3 = 40 has an IQR of 60.', isTrue: false, explanation: 'IQR = Q3 - Q1 = 40 - 20 = 20. IQR is the DIFFERENCE between the quartiles, not their sum.' },
    { id: 'so-tf-13', type: 'true-false', question: 'Box plots are designed to display outliers visually.', isTrue: true, explanation: 'Box plots use the IQR rule to identify potential outliers, which are plotted as individual points (dots) beyond the whiskers. This makes outliers visually apparent.' },
    { id: 'so-tf-14', type: 'true-false', question: 'Removing outliers always improves the validity of statistical results.', isTrue: false, explanation: 'Removing valid rare events (genuine extreme values) actually reduces validity by distorting the true distribution. Removal is only appropriate for confirmed errors, and the removal must be documented.' },
    { id: 'so-tf-15', type: 'true-false', question: 'A skewness magnitude greater than 1 (|skewness| > 1) is generally considered substantially skewed.', isTrue: true, explanation: 'Common guidelines: |skewness| < 0.5 = roughly symmetric; 0.5–1.0 = moderately skewed; > 1.0 = substantially skewed. However, these thresholds vary by context.' },
    { id: 'so-tf-16', type: 'true-false', question: 'The mean is more sensitive to outliers than the median because it uses every value in its calculation.', isTrue: true, explanation: 'The mean adds all values together, so one extreme value directly changes the sum and therefore the mean. The median only needs the middle position — it barely shifts when an extreme value is added.' },
    { id: 'so-tf-17', type: 'true-false', question: 'If a dataset has no outliers, its distribution must be normal.', isTrue: false, explanation: 'No outliers does not imply normality. A uniform distribution has no outliers but is not normal. Absence of outliers only tells you there are no extreme values — it says nothing about the overall shape.' },
    { id: 'so-tf-18', type: 'true-false', question: 'Both the 1.5×IQR fence and the mean ± 2SD rule identify the same observations as outliers.', isTrue: false, explanation: 'These methods often disagree. The IQR method is based on quartile positions (robust to existing outliers), while the mean ± 2SD method is based on the mean and SD (influenced by outliers). They can flag different observations.' },
    { id: 'so-tf-19', type: 'true-false', question: 'In a positively skewed distribution, the mode is typically the smallest of the three central tendency measures.', isTrue: false, explanation: 'In positive (right) skew, the order is: Mode ≤ Median ≤ Mean. The mode is the peak (at the low end where most data clusters). The mean is the largest, pulled toward the high tail.' },
    { id: 'so-tf-20', type: 'true-false', question: 'The Z-score method can also be used to detect outliers (|Z| > 3 is a common threshold).', isTrue: true, explanation: 'Z = (x - mean) / SD. A Z-score beyond ±3 indicates the value is more than 3 standard deviations from the mean, which is flagged as a potential outlier. Note: this method is less robust than IQR because the mean/SD are affected by outliers.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'so-mc-6', type: 'multiple-choice', question: 'A dataset has Q1 = 15, Q3 = 35. What are the Tukey fences (1.5×IQR rule)?', options: [{ id: 'a', text: 'Lower: -15, Upper: 65', isCorrect: true, explanation: 'IQR = 35-15 = 20. Lower = 15 - 1.5×20 = 15-30 = -15. Upper = 35 + 1.5×20 = 35+30 = 65.' }, { id: 'b', text: 'Lower: 0, Upper: 50', isCorrect: false, explanation: 'Not the correct calculation.' }, { id: 'c', text: 'Lower: 5, Upper: 45', isCorrect: false, explanation: 'Check: IQR = 20. Fences are 1.5×20 = 30 away from Q1 and Q3.' }, { id: 'd', text: 'Lower: -30, Upper: 65', isCorrect: false, explanation: 'Lower fence uses Q1, not 0 as starting point.' }], explanation: 'IQR = Q3 - Q1 = 35 - 15 = 20. Lower fence = Q1 - 1.5×IQR = 15 - 30 = -15. Upper fence = Q3 + 1.5×IQR = 35 + 30 = 65.', hint: 'IQR = Q3 - Q1. Lower = Q1 - 1.5×IQR. Upper = Q3 + 1.5×IQR.' },
    { id: 'so-mc-7', type: 'multiple-choice', question: 'A dataset has Q1=10, Q3=30, IQR=20. A value of 72 appears. Is it an outlier by the 1.5×IQR rule?', options: [{ id: 'a', text: 'No — 72 is within the fences', isCorrect: false, explanation: 'Upper fence = 30 + 1.5×20 = 30 + 30 = 60. Since 72 > 60, it IS an outlier.' }, { id: 'b', text: 'Yes — 72 is above the upper fence of 60', isCorrect: true, explanation: 'Upper fence = Q3 + 1.5×IQR = 30 + 30 = 60. Since 72 > 60, it is flagged as an outlier.' }, { id: 'c', text: 'Cannot determine without the full dataset', isCorrect: false, explanation: 'The IQR rule only requires Q1, Q3, and the value in question.' }, { id: 'd', text: 'Only if it is a data entry error', isCorrect: false, explanation: 'The IQR rule flags outliers regardless of cause — investigation follows.' }], explanation: 'Upper fence = Q3 + 1.5×IQR = 30 + 1.5(20) = 30 + 30 = 60. Value 72 > 60, so it is flagged as an outlier.', hint: 'Calculate upper fence, then compare: value > upper fence?' },
    { id: 'so-mc-8', type: 'multiple-choice', question: 'A positively skewed salary dataset has mean = $65,000 and median = $48,000. Which is the better measure of "typical" salary?', options: [{ id: 'a', text: 'Mean ($65,000) — it uses all the data', isCorrect: false, explanation: 'Using all data in a skewed distribution means the mean is pulled by the few high earners.' }, { id: 'b', text: 'Median ($48,000) — it is resistant to skew', isCorrect: true, explanation: 'For right-skewed salary data, the median better represents the typical worker.' }, { id: 'c', text: 'Either — they are both equally valid', isCorrect: false, explanation: 'In skewed distributions, the median is clearly preferable for representing the typical value.' }, { id: 'd', text: 'Neither — use the mode', isCorrect: false, explanation: 'The mode may be appropriate in some contexts, but the median is the standard recommendation for skewed data.' }], explanation: 'Right-skewed salary data: a few very high earners inflate the mean. Most workers earn closer to the median. The median ($48,000) better represents the typical employee.', hint: 'Which measure is not pulled toward the outliers?' },
    { id: 'so-mc-9', type: 'multiple-choice', question: 'You find a patient record showing a blood pressure of 280/200 mmHg (extremely high). What should you do FIRST?', options: [{ id: 'a', text: 'Delete the record immediately', isCorrect: false, explanation: 'Never delete without investigating — it could be real (hypertensive crisis).' }, { id: 'b', text: 'Replace it with the mean blood pressure', isCorrect: false, explanation: 'Arbitrary imputation without investigation is not valid.' }, { id: 'c', text: 'Investigate — check if it is a recording error or a genuine extreme value', isCorrect: true, explanation: 'First determine the cause. If it is a data entry error (should be 180/100), correct it. If it is a genuine hypertensive crisis reading, keep it and use robust methods.' }, { id: 'd', text: 'Report it as valid without checking', isCorrect: false, explanation: 'Extreme values warrant investigation, not blind acceptance.' }], explanation: 'Outlier management protocol: (1) Identify the outlier, (2) Investigate the cause, (3) Decide: correct if error, keep if real extreme value, document the decision.', hint: 'What is always the first step when encountering an extreme value?' },
    { id: 'so-mc-10', type: 'multiple-choice', question: 'Which skewness value indicates the MOST severe right-skewing?', options: [{ id: 'a', text: '-3.5', isCorrect: false, explanation: '-3.5 is severe LEFT (negative) skew.' }, { id: 'b', text: '0.1', isCorrect: false, explanation: '0.1 indicates near-symmetry with mild right lean.' }, { id: 'c', text: '2.8', isCorrect: true, explanation: '+2.8 is a large positive skewness value indicating severe RIGHT skew.' }, { id: 'd', text: '0.5', isCorrect: false, explanation: '0.5 is moderate right skew, but 2.8 is more severe.' }], explanation: 'Positive skewness = right skew. The larger the positive value, the more severe the right skew. +2.8 is the largest positive value, indicating the most severe right skew.', hint: 'Larger positive number = more severe right skew.' },
    { id: 'so-mc-11', type: 'multiple-choice', question: 'Why is the IQR preferred over standard deviation for detecting outliers in skewed data?', options: [{ id: 'a', text: 'IQR is always larger than SD', isCorrect: false, explanation: 'Size comparison is not the reason.' }, { id: 'b', text: 'IQR is not affected by the outliers it is trying to detect, while SD is', isCorrect: true, explanation: 'Outliers inflate the SD, widening the detection fence and possibly hiding the very outlier you are looking for. IQR uses only the middle 50% and is unaffected.' }, { id: 'c', text: 'IQR works only for ratio-level data', isCorrect: false, explanation: 'IQR is valid for any ordinal or higher data.' }, { id: 'd', text: 'SD cannot be used for skewed data', isCorrect: false, explanation: 'SD can be computed for skewed data; the issue is just that it is less robust for outlier detection.' }], explanation: 'The paradox of using SD for outlier detection: a single extreme outlier inflates both the mean and SD, which in turn widens the ±2SD fence so much that the outlier may no longer be flagged. IQR\'s quartile-based approach avoids this problem.', hint: 'What happens to the SD when there is an outlier in the data?' },
    { id: 'so-mc-12', type: 'multiple-choice', question: 'A dataset has values: 5, 7, 8, 9, 10, 11, 12, 200. What is the effect of the value 200 on the mean and median?', options: [{ id: 'a', text: 'Dramatically increases both mean and median equally', isCorrect: false, explanation: 'Median is much more resistant to extreme values.' }, { id: 'b', text: 'Dramatically increases the mean; slightly increases the median', isCorrect: true, explanation: '200 is far from the cluster of 5–12, pulling the mean up dramatically. The median changes from 9.5 to 10 — a slight shift.' }, { id: 'c', text: 'Has no effect on either', isCorrect: false, explanation: '200 always affects the mean since it is included in the sum.' }, { id: 'd', text: 'Dramatically increases the median; barely changes the mean', isCorrect: false, explanation: 'It is the reverse — mean is sensitive, median is resistant.' }], explanation: 'Without 200: Mean ≈ (5+7+8+9+10+11+12)/7 ≈ 8.86; Median = 9. With 200: Mean = (5+7+8+9+10+11+12+200)/8 = 262/8 = 32.75; Median = (9+10)/2 = 9.5. Dramatic effect on mean; minimal on median.', hint: 'Which measure adds all values to compute? Which uses only position?' },
    { id: 'so-mc-13', type: 'multiple-choice', question: 'Which of the following would produce a negatively (left) skewed distribution?', options: [{ id: 'a', text: 'Salary data from a company where most earn $40,000–$60,000 but a CEO earns $5 million', isCorrect: false, explanation: 'The extremely high salary creates a right tail → positive skew.' }, { id: 'b', text: 'Exam scores on an easy test where most students score 85–100 but a few score very low', isCorrect: true, explanation: 'Most scores cluster high (left peak at high end), with a few low scores creating a left tail → negative skew.' }, { id: 'c', text: 'Heights of adult males', isCorrect: false, explanation: 'Heights are approximately normally distributed.' }, { id: 'd', text: 'Time until a light bulb fails (most last briefly, few last very long)', isCorrect: false, explanation: 'This creates right skew (few very long-lasting bulbs create right tail).' }], explanation: 'Negative skew = most data is high, long left tail. An easy exam where most score near 100 but a few fail creates this pattern — peak is on the right side of the distribution.', hint: 'Which scenario has most values clustered HIGH with a few extreme LOW values?' },
    { id: 'so-mc-14', type: 'multiple-choice', question: 'A researcher replaces two outliers with the mean of the remaining data. What is this technique called?', options: [{ id: 'a', text: 'Winsorization', isCorrect: false, explanation: 'Winsorization replaces outliers with the nearest fence value (not the mean).' }, { id: 'b', text: 'Mean imputation', isCorrect: true, explanation: 'Replacing missing or extreme values with the mean is called mean imputation.' }, { id: 'c', text: 'Truncation', isCorrect: false, explanation: 'Truncation removes the extreme values completely.' }, { id: 'd', text: 'Standardization', isCorrect: false, explanation: 'Standardization converts values to z-scores.' }], explanation: 'Mean imputation = replacing outliers (or missing values) with the mean of the remaining data. It is simple but controversial — it reduces variance and can distort relationships. Winsorization (replacing with fence values) is often preferred.', hint: 'What is the technique of replacing extreme values with the average of the other values?' },
    { id: 'so-mc-15', type: 'multiple-choice', question: 'If a distribution has a skewness of -0.8, it is best described as:', options: [{ id: 'a', text: 'Moderately right-skewed', isCorrect: false, explanation: 'Right skew has POSITIVE skewness.' }, { id: 'b', text: 'Approximately symmetric', isCorrect: false, explanation: '-0.8 is more than trivially skewed; most guidelines classify 0.5–1.0 as moderate.' }, { id: 'c', text: 'Moderately left-skewed', isCorrect: true, explanation: 'Negative skewness = left skew. |−0.8| falls in the moderate range (0.5–1.0).' }, { id: 'd', text: 'Severely left-skewed', isCorrect: false, explanation: 'Severe skew typically requires |skewness| > 1. −0.8 is moderate.' }], explanation: 'Skewness −0.8: negative sign = left skew; magnitude 0.8 = moderate (0.5–1.0 range). The distribution has a moderate left (negative) skew — most values are relatively high with a left tail of lower values.', hint: 'Sign tells direction (negative = left). Magnitude tells severity (0.5–1.0 = moderate).' },
  ],
  keyTakeaway:
    'Outliers and skewness both signal that the mean may not represent the typical value — always check for them before drawing conclusions. Use the 1.5×IQR rule to flag potential outliers, but investigate before removing — they may be valid rare events.',
  visualization: null, // Rendered dynamically
  datasetGenerator: true,
}

export default function SkewnessAndOutliers({ topicId }) {
  const dataset = useDataset({ distribution: 'positively-skewed', n: 30, min: 30, max: 100, decimals: 0, includeOutliers: false })
  const { data, config, setConfig, stats, generateNew } = dataset
  const [showOutliers, setShowOutliers] = useState(false)

  // Generate data with outliers when checkbox is checked
  function handleOutlierToggle() {
    const newShowOutliers = !showOutliers
    setShowOutliers(newShowOutliers)
    setConfig({ includeOutliers: newShowOutliers })
  }

  return (
    <TopicPage
      content={{
        ...content,
        visualization: (
          <div className="space-y-6">
            {/* Dataset Generator with outlier toggle */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">🎛️</span> Skewness & Outlier Explorer
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-textDark mb-2">
                  Distribution Shape
                </label>
                <select
                  value={config.distribution}
                  onChange={(e) => setConfig({ distribution: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="uniform">Uniform</option>
                  <option value="normal">Approximately Normal</option>
                  <option value="positively-skewed">Positively Skewed</option>
                  <option value="negatively-skewed">Negatively Skewed</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOutliers}
                    onChange={handleOutlierToggle}
                    className="accent-primary"
                  />
                  Include outliers in generated data
                </label>
              </div>

              <DatasetGenerator topicId={topicId} showStats={true} />
            </div>

            {/* Histogram with Outlier Placeholder */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">📊</span> Histogram with Skew & Outlier Annotation
              </h2>
              <HistogramWithOutliersPlaceholder data={data} stats={stats} showOutliers={showOutliers} />
            </div>

            {/* Worked Example */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-blue-800 mb-4">Worked Example: Nurse Salaries ($1,000s)</h3>
              {salaryDataTable}
              {outlierResult}
            </div>

            {/* Outlier Rule Reference */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-base font-semibold text-textDark mb-4">1.5×IQR Outlier Rule Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-textDark mb-1">Step 1: Calculate Q1 and Q3 (25th and 75th percentiles)</p>
                  <p className="text-textMuted">Use inclusive method (Excel QUARTILE.INC)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-textDark mb-1">Step 2: Calculate IQR = Q3 − Q1</p>
                  <p className="text-textMuted">The spread of the middle 50% of data</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-textDark mb-1">Step 3: Calculate fences</p>
                  <p className="font-mono text-primary">Lower Fence = Q1 − 1.5 × IQR</p>
                  <p className="font-mono text-primary">Upper Fence = Q3 + 1.5 × IQR</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-textDark mb-1">Step 4: Flag outliers</p>
                  <p className="text-textMuted">Any value &lt; Lower Fence or &gt; Upper Fence is a potential outlier</p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-semibold text-amber-800 mb-1">⚠️ Always Investigate!</p>
                  <p className="text-amber-700 text-sm">
                    Outliers may be errors (fix/remove) or real rare events (keep, use robust stats).
                    The 1.5×IQR rule is a SCREENING tool, not a deletion rule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      }}
      topicId={topicId}
    />
  )
}