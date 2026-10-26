import { useMemo, useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import { HistogramChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { mean, median as calcMedian, round } from '../../../utils/stats'

// Fixed dataset for worked example
const FIXED = [12,14,15,15,16,17,17,18,18,18,19,19,20,20,20,21,21,22,22,23,23,24,25,26,26,27,28,30,32,40]
const fixedN = FIXED.length
const fixedMin = Math.min(...FIXED)
const fixedMax = Math.max(...FIXED)
const FIXED_BINS = 7
const fixedBinWidth = round((fixedMax - fixedMin) / FIXED_BINS, 2)

function BinSliderViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 50, min: 1, max: 100, distribution: 'normal' })
  const data = propData ?? ownData
  const [bins, setBins] = useState(10)
  const liveMean = useMemo(() => (data.length ? round(mean(data), 2) : null), [data])
  const liveMedian = useMemo(() => (data.length ? round(calcMedian(data), 2) : null), [data])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 shrink-0">Bins: <strong>{bins}</strong></label>
          <input
            type="range"
            min={3}
            max={20}
            value={bins}
            onChange={(e) => setBins(Number(e.target.value))}
            className="w-40 accent-blue-600"
          />
          <span className="text-xs text-gray-500">3 – 20</span>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200">
            Mean: {liveMean ?? '…'}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
            Median: {liveMedian ?? '…'}
          </span>
        </div>
      </div>

      <HistogramChart
        data={data}
        bins={bins}
        title={`Live Dataset — ${bins} Bins`}
        xLabel="Value"
        yLabel="Count"
        showMean
        showMedian
        height={260}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
        <strong>What to notice:</strong> Slide the bin count left (fewer bins) to see the overall shape. Slide right (more bins) to see more detail — but too many bins creates noise. Try to find the bin count that best reveals the shape of this distribution.
      </div>
    </div>
  )
}

// Fixed-dataset histogram for the worked example section
function WorkedHistogramViz() {
  return (
    <div className="space-y-3">
      <HistogramChart
        data={FIXED}
        bins={FIXED_BINS}
        title={`Fixed Dataset — 30 Daily Admissions, ${FIXED_BINS} Bins`}
        xLabel="Daily Admissions"
        yLabel="Frequency"
        showMean
        showMedian
        height={220}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 py-2 px-3 text-left">Bin</th>
              <th className="border border-gray-200 py-2 px-3 text-center">Range</th>
              <th className="border border-gray-200 py-2 px-3 text-center">Count</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: FIXED_BINS }, (_, i) => {
              const lo = round(fixedMin + i * fixedBinWidth, 1)
              const hi = round(fixedMin + (i + 1) * fixedBinWidth, 1)
              const count = FIXED.filter((v) => {
                if (i === FIXED_BINS - 1) return v >= lo && v <= hi
                return v >= lo && v < hi
              }).length
              return (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="border border-gray-200 py-1.5 px-3">Bin {i + 1}</td>
                  <td className="border border-gray-200 py-1.5 px-3 text-center font-mono">{lo} – {hi}</td>
                  <td className="border border-gray-200 py-1.5 px-3 text-center font-semibold">{count}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const content = {
  title: 'Histogram',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Create and interpret a histogram, and choose an appropriate number of bins.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>histogram</strong> groups continuous data into intervals called <strong>bins</strong> (or classes) and shows how many values fall in each interval using bars. The height of each bar represents the count (or frequency) of values in that bin.
      </p>
      <p>
        Unlike a bar chart (which displays categories), a histogram's bars <strong>touch each other</strong> — because the data is continuous, there are no gaps between intervals. A gap in a histogram means no values fell in that range.
      </p>
      <p>
        Histograms reveal the <strong>shape</strong> of a distribution: is it symmetric? Skewed left or right? Bell-shaped? Bimodal (two humps)? Uniform?
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <strong>Bin width</strong> = (Max − Min) / number of bins. All bins have equal width. Choosing bins:
        <ul className="mt-1 space-y-0.5 ml-3">
          <li><strong>Too few bins:</strong> Shape is hidden — everything looks flat</li>
          <li><strong>Too many bins:</strong> Too noisy — jagged, hard to see the pattern</li>
          <li><strong>Sturges' formula:</strong> k ≈ 1 + 3.322 × log₁₀(n) gives a reasonable starting point</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine sorting 30 test papers into labeled folders: "60–69", "70–79", "80–89", "90–99". Each folder is a bin. The pile height of each folder is the bar height in a histogram. You can quickly see which score range had the most students.
      </p>
      <p className="text-sm text-gray-600">
        If you use too many folders (like one for each score: 60, 61, 62...), you just see individual stacks with no overall pattern. If you use just two folders (below 80, 80 and above), you lose all detail. The right number of bins reveals the shape.
      </p>
    </div>
  ),
  formula: {
    main: 'Bin width = (Max − Min) / k',
    variants: [
      { label: 'Bin width', expression: 'Bin width = (Max − Min) / k', latex: 'Bin\\;width = \\frac{Max - Min}{k}' },
      { label: 'Sturges\' formula for k', expression: 'k ≈ 1 + 3.322 × log₁₀(n)', latex: 'k \\approx 1 + 3.322 \\times log_{10}(n)' },
      { label: 'Frequency (bar height)', expression: 'Count of values in [bin start, bin end)' },
    ],
    symbolGuide: [
      { symbol: 'k', meaning: 'Number of bins' },
      { symbol: 'n', meaning: 'Number of data points' },
      { symbol: 'Max', meaning: 'Largest value in the dataset' },
      { symbol: 'Min', meaning: 'Smallest value in the dataset' },
      { symbol: 'Bin width', meaning: 'The range of values captured in each bin' },
      { symbol: 'log₁₀', meaning: 'Base-10 logarithm (Sturges\' formula)' },
    ],
  },
  whenToUse: [
    'To visualize the distribution shape of a continuous variable',
    'To identify skewness, modality (unimodal, bimodal), gaps, or extreme values',
    'When exploring a new dataset for the first time',
    'Before choosing a statistical test — distribution shape affects which tests are appropriate',
  ],
  whenNotToUse: [
    'For categorical (nominal) data — use a bar chart instead',
    'For very small datasets (n < 20) — box plots or dot plots are more informative',
    'When you need to show exact values — histograms lose individual data points into bins',
  ],
  assumptions: [
    'Data must be continuous or at least approximately continuous (interval or ratio level)',
    'Bin width is constant across all bins',
    'The first bin starts at or below the minimum value; the last bin ends at or above the maximum',
    'The rightmost boundary of each bin is typically excluded (except the last bin includes its upper edge)',
  ],
  workedExample: {
    scenario: `Daily patient admissions over 30 days: [${FIXED.join(', ')}]. Use ${FIXED_BINS} bins.`,
    dataset: `[${FIXED.join(', ')}] — n = ${fixedN}`,
    steps: [
      { stepNumber: 1, label: 'Find min and max', expression: `Min = ${fixedMin}, Max = ${fixedMax}`, result: `Range = ${fixedMax - fixedMin}`, explanation: `The data spans from ${fixedMin} to ${fixedMax} admissions.` },
      { stepNumber: 2, label: 'Calculate Sturges\' formula for k', expression: `k ≈ 1 + 3.322 × log₁₀(${fixedN}) = 1 + 3.322 × ${round(Math.log10(fixedN), 3)} ≈ ${round(1 + 3.322 * Math.log10(fixedN), 1)}`, result: `Sturges suggests ≈ ${Math.round(1 + 3.322 * Math.log10(fixedN))} bins`, explanation: `We choose ${FIXED_BINS} bins for a clean display.` },
      { stepNumber: 3, label: 'Calculate bin width', expression: `Bin width = (${fixedMax} − ${fixedMin}) / ${FIXED_BINS} = ${fixedMax - fixedMin} / ${FIXED_BINS} = ${fixedBinWidth}`, result: `Bin width ≈ ${fixedBinWidth}`, explanation: 'Each bin covers about 4 admissions.' },
      { stepNumber: 4, label: 'Define bin boundaries and count', expression: `Bin 1: [${fixedMin}, ${round(fixedMin + fixedBinWidth, 1)}), Bin 2: [${round(fixedMin + fixedBinWidth, 1)}, ${round(fixedMin + 2 * fixedBinWidth, 1)}), …`, result: 'See frequency table in visualization', explanation: 'Count how many values fall in each bin range.' },
      { stepNumber: 5, label: 'Interpret the shape', expression: 'Most values cluster between 14–24 admissions, with one day at 40 pulling right', result: 'Right-skewed distribution', explanation: 'The tall bars are in the middle-lower range, with a long tail to the right (the day with 40 admissions). The mean will be pulled right of the median.' },
    ],
    interpretation: `The histogram shows most days had 14–24 admissions. The isolated bar on the far right (40 admissions) is likely an unusual day — perhaps an emergency event. The distribution is right-skewed due to this outlier.`,
  },
  interpretation: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>When reading a histogram, look for:</p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Shape:</strong> Bell curve (normal), right-skewed (long tail right), left-skewed (long tail left), uniform (flat), bimodal (two peaks)</li>
        <li><strong>Center:</strong> Where is the tallest bar? This approximates the mode; mean and median are nearby for symmetric distributions</li>
        <li><strong>Spread:</strong> How wide is the histogram? Narrow = low variability; wide = high variability</li>
        <li><strong>Gaps:</strong> Bars with zero count may indicate data collection issues or discrete data</li>
        <li><strong>Outliers:</strong> Isolated bars far from the main group — these warrant investigation</li>
      </ul>
    </div>
  ),
  commonMistakes: [
    { mistake: 'Leaving gaps between histogram bars', explanation: 'Histogram bars touch because the data is continuous — the bins are contiguous intervals. Gaps imply categorical data (a bar chart). Only leave gaps if a bin genuinely has zero values.' },
    { mistake: 'Using too few or too many bins without checking the shape', explanation: 'Use Sturges\' formula as a starting point (k ≈ 1 + 3.322 × log₁₀(n)), then visually adjust. Always check that the chosen bin count reveals the underlying shape without excessive noise.' },
    { mistake: 'Confusing a histogram with a bar chart', explanation: 'Bar charts show frequencies of categories (nominal/ordinal data) with gaps between bars. Histograms show frequency of continuous value ranges with no gaps.' },
    { mistake: 'Assuming the tallest bar is the mean', explanation: 'The tallest bar shows the modal class (most common range), not the mean. For skewed distributions, the mean and the modal class can be quite different.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'hist-easy-1',
        scenario: 'Dataset: 5, 8, 9, 11, 13, 14, 16, 18, 20. Min = 5, Max = 20. Use 3 bins.',
        question: 'Calculate the bin width and define the three bin boundaries.',
        hint: 'Bin width = (Max − Min) / k = (20 − 5) / 3.',
        solution: 'Bin width = 15/3 = 5. Bin 1: [5, 10), Bin 2: [10, 15), Bin 3: [15, 20]. Count: Bin 1: 5, 8, 9 → 3 values. Bin 2: 11, 13, 14 → 3 values. Bin 3: 16, 18, 20 → 3 values. Uniform distribution with 3 values per bin.',
      },
      {
        id: 'hist-easy-2',
        scenario: 'A histogram shows bars with heights: 2, 5, 8, 7, 4, 1.',
        question: 'How many data values are in the dataset? Which bin has the most values?',
        hint: 'Total n = sum of all bar heights.',
        solution: 'Total n = 2+5+8+7+4+1 = 27 values. The 3rd bin has the most values (8 — the tallest bar) — this is the modal class.',
      },
    ],
    moderate: [
      {
        id: 'hist-mod-1',
        scenario: 'You have n = 100 data points and want to use Sturges\' formula to determine the number of bins.',
        question: 'How many bins does Sturges\' formula suggest? What would be the bin width if min = 10 and max = 90?',
        hint: 'k = 1 + 3.322 × log₁₀(100). log₁₀(100) = 2.',
        solution: 'k = 1 + 3.322 × log₁₀(100) = 1 + 3.322 × 2 = 1 + 6.644 ≈ 7.6, rounded to 8 bins. Bin width = (90 − 10) / 8 = 80/8 = 10.',
      },
      {
        id: 'hist-mod-2',
        scenario: 'A histogram of reaction times (ms) shows: most bars between 150–400ms, one tall bar at 200–250ms, and a small isolated bar at 900–950ms.',
        question: 'Describe the distribution shape. What does the isolated bar suggest?',
        hint: 'Look for skew, modality, and unusual isolated bars.',
        solution: 'The distribution is right-skewed (unimodal peak at 200–250ms, with a long right tail). The isolated bar at 900–950ms represents a few unusually slow responses — potential outliers. These could be lapses in attention, distraction, or measurement errors, and should be investigated before including in analysis.',
      },
    ],
    challenging: [
      {
        id: 'hist-chal-1',
        scenario: 'Two histograms show exam scores for Class A and Class B. Both have n=30 and scores ranging from 40–100. Class A: roughly bell-shaped, peak at 70–80. Class B: bimodal, with peaks at 50–60 and 85–95.',
        question: 'Interpret both distributions. What might explain Class B\'s bimodal shape? What does it suggest about teaching strategies?',
        hint: 'Bimodal distributions often indicate two distinct subgroups.',
        solution: 'Class A has a roughly normal distribution centered around 70–80 — a typical spread of performance. Class B\'s bimodal distribution suggests two distinct groups of students: one group performing poorly (50–60) and another performing well (85–95) with few students in the middle. This often indicates the teaching approach worked for some students but not others, or that the class contains students with very different prior knowledge. A teaching strategy should address both groups — perhaps additional support for the lower group and enrichment for the upper group.',
      },
      {
        id: 'hist-chal-2',
        scenario: 'A histogram with 20 bins shows a jagged, noisy pattern for n=25 data points. A colleague suggests using 5 bins instead.',
        question: 'Is the colleague correct? Calculate Sturges\' k for n=25. What bin count would you use?',
        hint: 'Sturges: k = 1 + 3.322 × log₁₀(25). Is 20 bins too many for n=25?',
        solution: 'Sturges: k = 1 + 3.322 × log₁₀(25) = 1 + 3.322 × 1.398 = 1 + 4.64 ≈ 5.6, rounded to 6 bins. The colleague is essentially correct — 20 bins for only 25 data points creates bins with 0–2 values each, resulting in a noisy, jagged histogram that obscures the distribution shape. 5–6 bins would better reveal the underlying pattern. General rule: bins should have at least 5 values each on average (n/k ≥ 5), so 25/5 = 5 per bin is acceptable.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'hist-kc-1',
      type: 'multiple-choice',
      question: 'What is the key visual difference between a histogram and a bar chart?',
      options: [
        { id: 'a', text: 'Histograms can only show 10 bars', isCorrect: false, explanation: 'No such limitation exists.' },
        { id: 'b', text: 'Histogram bars touch (no gaps); bar chart bars have gaps', isCorrect: true, explanation: 'Correct! Histograms show continuous data — bars touch. Bar charts show categorical data — bars have gaps.' },
        { id: 'c', text: 'Histograms use y-axis labels; bar charts don\'t', isCorrect: false, explanation: 'Both can have y-axis labels.' },
        { id: 'd', text: 'Histograms are always taller', isCorrect: false, explanation: 'Height depends on the data, not the chart type.' },
      ],
      explanation: 'Histograms display continuous data — the intervals are contiguous, so bars touch. Bar charts display categories — each category is separate, so bars have gaps.',
      hint: 'Think about what touching bars vs. separate bars communicate about the data type.',
    },
    {
      id: 'hist-kc-2',
      type: 'multiple-choice',
      question: 'A histogram is right-skewed. Where is the tail?',
      options: [
        { id: 'a', text: 'On the left side', isCorrect: false, explanation: 'Left-skewed = long tail on the left.' },
        { id: 'b', text: 'On the right side', isCorrect: true, explanation: 'Correct! Right-skewed = long tail stretching to the right (toward higher values).' },
        { id: 'c', text: 'On both sides equally', isCorrect: false, explanation: 'That would be symmetric.' },
        { id: 'd', text: 'There is no tail in a histogram', isCorrect: false, explanation: 'Skewed distributions have longer tails on one side.' },
      ],
      explanation: 'Right-skewed (positively skewed) means the distribution has a long tail pulling to the right. The bulk of data is on the left, with a few high values dragging the mean rightward.',
      hint: 'Which direction does "right-skewed" point?',
    },
    {
      id: 'hist-kc-3',
      type: 'multiple-choice',
      question: 'You have n = 200 data points. Sturges\' formula gives k ≈ 8.6. What is a reasonable bin count?',
      options: [
        { id: 'a', text: '2', isCorrect: false, explanation: 'Too few — the shape would be completely hidden.' },
        { id: 'b', text: '9', isCorrect: true, explanation: 'Correct! Rounding 8.6 to 9 is a sensible starting point. You might try 8–10 and pick the clearest view.' },
        { id: 'c', text: '200', isCorrect: false, explanation: 'That would give a separate bar for each value — defeats the purpose of a histogram.' },
        { id: 'd', text: 'Exactly 8.6', isCorrect: false, explanation: 'Bin count must be a whole number — you round Sturges\' formula.' },
      ],
      explanation: 'Sturges\' formula gives a starting estimate. Round to the nearest whole number (8 or 9) and adjust based on visual clarity.',
      hint: 'Sturges gives 8.6 — round to the nearest whole number.',
    },
    {
      id: 'hist-kc-4',
      type: 'multiple-choice',
      question: 'Dataset: min = 20, max = 70, using 5 bins. What is the bin width?',
      options: [
        { id: 'a', text: '5', isCorrect: false, explanation: 'Bin width = (70−20)/5 = 50/5 = 10.' },
        { id: 'b', text: '10', isCorrect: true, explanation: 'Correct! Bin width = (Max − Min) / k = (70 − 20) / 5 = 10.' },
        { id: 'c', text: '14', isCorrect: false, explanation: 'Check: (70−20)/5 = 50/5 = 10.' },
        { id: 'd', text: '50', isCorrect: false, explanation: '50 is the total range (Max − Min), not the bin width.' },
      ],
      explanation: 'Bin width = (Max − Min) / k = (70 − 20) / 5 = 50 / 5 = 10.',
      hint: 'Bin width = (Max − Min) / number of bins.',
    },
    {
      id: 'hist-kc-5',
      type: 'multiple-choice',
      question: 'A histogram shows two roughly equal tall peaks with a valley between them. This pattern is called:',
      options: [
        { id: 'a', text: 'Right-skewed', isCorrect: false, explanation: 'Right-skewed has one peak with a long right tail.' },
        { id: 'b', text: 'Uniform', isCorrect: false, explanation: 'Uniform has roughly equal bars across all bins with no peaks.' },
        { id: 'c', text: 'Bimodal', isCorrect: true, explanation: 'Correct! Two distinct peaks (modes) makes this a bimodal distribution.' },
        { id: 'd', text: 'Normal', isCorrect: false, explanation: 'Normal (bell curve) has one peak in the center.' },
      ],
      explanation: 'Bimodal means two modes — two distinct peaks in the distribution. This often indicates two subgroups within the data.',
      hint: '"Bi" means two. Two peaks = two modes.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'hist-tf-1', type: 'true-false', question: 'A histogram is used to display the distribution of a continuous quantitative variable.', isTrue: true, explanation: 'Histograms are designed for continuous (or discrete quantitative) data. They group values into bins and show how many observations fall in each bin.' },
    { id: 'hist-tf-2', type: 'true-false', question: 'The bars in a histogram are separated by gaps (spaces between them).', isTrue: false, explanation: 'In a histogram, bars TOUCH each other because the data is continuous — each bin ends exactly where the next begins. Gaps indicate there are no values in that range. Bar charts (for categorical data) have gaps.' },
    { id: 'hist-tf-3', type: 'true-false', question: 'Wider bins in a histogram always reveal more detail about the distribution.', isTrue: false, explanation: 'Wider bins group more values together, providing LESS detail. Narrower bins provide more detail but may look noisy. The goal is to balance detail with clarity.' },
    { id: 'hist-tf-4', type: 'true-false', question: 'A histogram can reveal whether data is normally distributed.', isTrue: true, explanation: 'The shape of a histogram reveals distribution characteristics: bell-shaped ≈ normal; skewed = asymmetric; multiple peaks = multimodal; flat = uniform.' },
    { id: 'hist-tf-5', type: 'true-false', question: 'In a histogram, each bar\'s height represents the frequency (count) of observations in that bin.', isTrue: true, explanation: 'Each bar height shows how many observations fall within that bin\'s range. For relative frequency histograms, height is proportion instead of count.' },
    { id: 'hist-tf-6', type: 'true-false', question: 'A histogram and a bar chart are the same type of graph.', isTrue: false, explanation: 'A histogram is for continuous quantitative data (bars touch, no inherent order change). A bar chart is for categorical data (bars have gaps, order can be changed). They look similar but serve different purposes.' },
    { id: 'hist-tf-7', type: 'true-false', question: 'The x-axis of a histogram displays the frequency of observations.', isTrue: false, explanation: 'The X-AXIS displays the variable values (or bin ranges). The Y-AXIS displays the frequency or relative frequency. This is a common source of confusion.' },
    { id: 'hist-tf-8', type: 'true-false', question: 'Using too many bins in a histogram can make the distribution shape difficult to see.', isTrue: true, explanation: 'Too many narrow bins = each bin has very few observations, making the histogram look jagged and erratic. The overall shape pattern is lost in the noise.' },
    { id: 'hist-tf-9', type: 'true-false', question: 'Using too few bins can hide important features of the distribution.', isTrue: true, explanation: 'Too few bins can hide skewness, outliers, or bimodality by grouping too many values together. Both extremes (too few or too many bins) are problematic.' },
    { id: 'hist-tf-10', type: 'true-false', question: 'Sturges\' formula k = 1 + 3.322 × log₁₀(n) provides a starting point for choosing the number of bins.', isTrue: true, explanation: 'Sturges\' formula is a simple rule of thumb for bin count. It works best for approximately normal distributions. Other formulas (Freedman-Diaconis, Scott) work better for skewed data.' },
    { id: 'hist-tf-11', type: 'true-false', question: 'A bimodal histogram has two peaks, suggesting two distinct subgroups in the data.', isTrue: true, explanation: 'Two peaks in a histogram indicate two clusters of frequent values. This often reflects two subpopulations mixed together (e.g., two different age groups).' },
    { id: 'hist-tf-12', type: 'true-false', question: 'A right-skewed histogram has most values concentrated on the right side with a long left tail.', isTrue: false, explanation: 'Right-skewed (positive skew) has most values concentrated on the LEFT (low values) with a long RIGHT tail of high values. The bulk is on the left, tail is on the right.' },
    { id: 'hist-tf-13', type: 'true-false', question: 'The area of each bar in a histogram is proportional to the frequency of data in that bin.', isTrue: true, explanation: 'For equal-width bins, bar area = height × width, and since widths are equal, area ∝ frequency. For unequal-width bins, the height should be frequency/bin width (frequency density) so area = frequency.' },
    { id: 'hist-tf-14', type: 'true-false', question: 'A frequency polygon is an alternative to a histogram that uses lines instead of bars.', isTrue: true, explanation: 'A frequency polygon connects the midpoints of each bin\'s top with line segments. It conveys the same information as a histogram but is useful for overlaying multiple distributions.' },
    { id: 'hist-tf-15', type: 'true-false', question: 'Histograms can display categorical (nominal) data.', isTrue: false, explanation: 'Histograms are for quantitative (numeric) data with natural ordering. Categorical data should be displayed with bar charts. Bar charts have gaps; histograms do not.' },
    { id: 'hist-tf-16', type: 'true-false', question: 'If a histogram is perfectly symmetric and bell-shaped, the data is likely normally distributed.', isTrue: true, explanation: 'A symmetric, bell-shaped histogram is consistent with a normal distribution. However, visual assessment alone is not sufficient proof — formal normality tests (Shapiro-Wilk) provide more rigorous confirmation.' },
    { id: 'hist-tf-17', type: 'true-false', question: 'Changing bin width can change the apparent shape of a distribution in a histogram.', isTrue: true, explanation: 'The same dataset can look normal, skewed, or bimodal depending on bin width choice. This is why bin selection matters — and why you should try multiple bin widths when exploring data.' },
    { id: 'hist-tf-18', type: 'true-false', question: 'Histograms require that all bins have equal width.', isTrue: false, explanation: 'Histograms can technically have unequal bin widths. When they do, the Y-axis should show frequency density (frequency / bin width) rather than frequency, so that area represents frequency.' },
    { id: 'hist-tf-19', type: 'true-false', question: 'A relative frequency histogram has bars whose heights sum to 1.0.', isTrue: true, explanation: 'In a relative frequency histogram, each bar height = relative frequency = count / total n. Since all relative frequencies must sum to 1.0, the bar heights sum to 1.0.' },
    { id: 'hist-tf-20', type: 'true-false', question: 'A density plot (KDE plot) is a smoothed version of a histogram.', isTrue: true, explanation: 'Kernel density estimation (KDE) creates a smooth curve that estimates the probability density function. It conveys the same distribution shape as a histogram but without the artifacts of bin width choice.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'hist-mc-6', type: 'multiple-choice', question: 'A dataset has n = 100. Using Sturges\' formula (k ≈ 1 + 3.322 × log₁₀(n)), approximately how many bins should be used?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'k = 1 + 3.322 × log₁₀(100) = 1 + 3.322 × 2 = 7.64 ≈ 8.' }, { id: 'b', text: '7', isCorrect: false, explanation: 'k ≈ 7.64, rounded = 8.' }, { id: 'c', text: '8', isCorrect: true, explanation: 'k = 1 + 3.322 × log₁₀(100) = 1 + 3.322 × 2 = 7.64 ≈ 8.' }, { id: 'd', text: '10', isCorrect: false, explanation: '10 is an approximation rule of thumb; Sturges gives ~8 for n=100.' }], explanation: 'Sturges: k = 1 + 3.322 × log₁₀(100). log₁₀(100) = 2. k = 1 + 6.644 = 7.644 ≈ 8 bins.', hint: 'k = 1 + 3.322 × log₁₀(n). log₁₀(100) = 2.' },
    { id: 'hist-mc-7', type: 'multiple-choice', question: 'A histogram for exam scores (0–100) has bins: 0–20, 20–40, 40–60, 60–80, 80–100. This is a bin width of:', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'Each bin spans 20 points, not 5.' }, { id: 'b', text: '10', isCorrect: false, explanation: '10 would give bins like 0–10, 10–20. These bins span 20.' }, { id: 'c', text: '20', isCorrect: true, explanation: 'Each bin spans 20 score points (0–20, 20–40, etc.).' }, { id: 'd', text: '100', isCorrect: false, explanation: '100 would be one bin covering the entire range.' }], explanation: 'Bin width = upper boundary − lower boundary = 20 − 0 = 20 (or equivalently 40−20 = 20, etc.). Each bin spans a range of 20 units.', hint: 'Bin width = upper limit − lower limit of one bin.' },
    { id: 'hist-mc-8', type: 'multiple-choice', question: 'Which histogram shape indicates that data is uniformly distributed?', options: [{ id: 'a', text: 'Bell-shaped', isCorrect: false, explanation: 'Bell-shaped = normal (concentrated in the middle).' }, { id: 'b', text: 'Skewed to the right', isCorrect: false, explanation: 'Skewed = asymmetric.' }, { id: 'c', text: 'Flat (equal bar heights)', isCorrect: true, explanation: 'Uniform = all bins have approximately equal frequency. The histogram looks flat.' }, { id: 'd', text: 'Two equal peaks', isCorrect: false, explanation: 'Two peaks = bimodal.' }], explanation: 'A uniform distribution means all values are equally likely. A histogram would show bars of roughly equal height across all bins — a flat, rectangular appearance.', hint: 'Equal probability for all values → what does the histogram look like?' },
    { id: 'hist-mc-9', type: 'multiple-choice', question: 'A histogram for patient wait times shows a peak at 5–10 minutes with a long tail extending to 90+ minutes. The distribution is:', options: [{ id: 'a', text: 'Symmetric', isCorrect: false, explanation: 'Symmetric distributions have equal tails on both sides.' }, { id: 'b', text: 'Right-skewed (positively skewed)', isCorrect: true, explanation: 'Peak at low values (5–10 min) + long tail to the right (90+ min) = right skew.' }, { id: 'c', text: 'Left-skewed (negatively skewed)', isCorrect: false, explanation: 'Left skew = peak at high values + long left tail.' }, { id: 'd', text: 'Bimodal', isCorrect: false, explanation: 'Bimodal has two peaks.' }], explanation: 'Most patients wait 5–10 minutes (peak at the left), but a few wait very long (90+ minutes), creating a long right tail. This is positive (right) skew.', hint: 'Peak on the left + long right tail = which skew?' },
    { id: 'hist-mc-10', type: 'multiple-choice', question: 'What is the main difference between a histogram and a bar chart?', options: [{ id: 'a', text: 'Histograms are for categorical data; bar charts are for quantitative data', isCorrect: false, explanation: 'It is the reverse: histograms are for quantitative data.' }, { id: 'b', text: 'Histograms have touching bars (continuous data); bar charts have gaps (categorical data)', isCorrect: true, explanation: 'Continuous data has no gaps between values, so histogram bars touch. Categorical data has distinct groups, so bar charts have gaps.' }, { id: 'c', text: 'Histograms always show percentages; bar charts show counts', isCorrect: false, explanation: 'Both can show counts or percentages.' }, { id: 'd', text: 'There is no meaningful difference', isCorrect: false, explanation: 'They serve different purposes for different data types.' }], explanation: 'Histograms (continuous/quantitative): bars touch — no gaps because data is continuous. Bar charts (categorical): bars have gaps — categories are distinct groups with no natural continuity between them.', hint: 'Which type of data has natural "gaps" between categories vs. a continuous scale?' },
    { id: 'hist-mc-11', type: 'multiple-choice', question: 'A histogram shows most values in the high range (80–100) with a long left tail extending to 0–20. This is:', options: [{ id: 'a', text: 'Right-skewed', isCorrect: false, explanation: 'Right skew has peak on the left, tail on the right.' }, { id: 'b', text: 'Left-skewed (negatively skewed)', isCorrect: true, explanation: 'Peak on the right (high values), long tail on the left = left (negative) skew.' }, { id: 'c', text: 'Normal', isCorrect: false, explanation: 'Normal is symmetric.' }, { id: 'd', text: 'Uniform', isCorrect: false, explanation: 'Uniform has equal bar heights.' }], explanation: 'Peak at high values (80–100) + long tail toward low values = LEFT (negative) skew. Most data is at the high end; a few extreme low values create the left tail.', hint: 'Peak on the RIGHT + tail on the LEFT = which skew?' },
    { id: 'hist-mc-12', type: 'multiple-choice', question: 'What does each bar\'s HEIGHT represent in a frequency histogram?', options: [{ id: 'a', text: 'The bin width', isCorrect: false, explanation: 'Bin width is the x-axis span, not the bar height.' }, { id: 'b', text: 'The number of observations in that bin', isCorrect: true, explanation: 'Bar height = frequency (count) of observations falling in that bin\'s range.' }, { id: 'c', text: 'The mean of the bin', isCorrect: false, explanation: 'Histograms show frequency, not the mean of each bin.' }, { id: 'd', text: 'The cumulative frequency', isCorrect: false, explanation: 'Cumulative frequency is shown in an ogive (cumulative histogram), not a standard histogram.' }], explanation: 'In a frequency histogram, bar height = count of observations in that bin. For relative frequency histogram, bar height = proportion. For density histogram, bar height = probability density.', hint: 'Frequency histogram: height = ?' },
    { id: 'hist-mc-13', type: 'multiple-choice', question: 'If a histogram has bins 0–10, 10–20, 20–30 with frequencies 5, 15, 8, what is n?', options: [{ id: 'a', text: '15', isCorrect: false, explanation: '15 is the frequency for just one bin.' }, { id: 'b', text: '28', isCorrect: true, explanation: 'n = sum of all frequencies = 5 + 15 + 8 = 28.' }, { id: 'c', text: '30', isCorrect: false, explanation: '30 is the maximum bin boundary, not n.' }, { id: 'd', text: '3', isCorrect: false, explanation: '3 is the number of bins.' }], explanation: 'Total observations n = sum of all bin frequencies = 5 + 15 + 8 = 28.', hint: 'n = sum of all bar heights (frequencies).' },
    { id: 'hist-mc-14', type: 'multiple-choice', question: 'Which would be BETTER suited to be displayed as a histogram?', options: [{ id: 'a', text: 'Favorite sport (soccer, tennis, swimming)', isCorrect: false, explanation: 'Categorical data → bar chart.' }, { id: 'b', text: 'Blood pressure readings (mmHg)', isCorrect: true, explanation: 'Continuous quantitative data → histogram.' }, { id: 'c', text: 'Movie genres (action, comedy, drama)', isCorrect: false, explanation: 'Categorical data → bar chart.' }, { id: 'd', text: 'Yes/No survey responses', isCorrect: false, explanation: 'Binary categorical data → bar chart.' }], explanation: 'Histograms are for continuous quantitative variables like blood pressure. Categorical variables (sport, genre, yes/no) use bar charts.', hint: 'Which option is a continuous numeric measurement?' },
    { id: 'hist-mc-15', type: 'multiple-choice', question: 'A histogram with bin width 5 has a bar for the range 25–30 with frequency 12. What is the relative frequency for this bin if n = 100?', options: [{ id: 'a', text: '12', isCorrect: false, explanation: '12 is the raw frequency. Relative frequency = frequency / n.' }, { id: 'b', text: '0.12', isCorrect: true, explanation: 'Relative frequency = 12 / 100 = 0.12 = 12%.' }, { id: 'c', text: '1.2', isCorrect: false, explanation: '1.2 > 1. Relative frequencies cannot exceed 1.' }, { id: 'd', text: '2.4', isCorrect: false, explanation: 'That is frequency / bin width (2.4 = 12/5), which is frequency density, not relative frequency.' }], explanation: 'Relative frequency = count / n = 12 / 100 = 0.12. This means 12% of observations fall in the 25–30 bin.', hint: 'Relative frequency = frequency / n.' },
  ],
  keyTakeaway:
    'A histogram groups continuous data into equal-width bins and displays the frequency in each bin. Bars touch (no gaps). Use Sturges\' formula (k ≈ 1 + 3.322 × log₁₀(n)) as a starting point for bin count, then adjust for clarity. Histograms reveal distribution shape: normal, skewed, bimodal, or uniform.',
  visualization: (data) => (
    <div className="space-y-4">
      <BinSliderViz data={data} />
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Fixed Example — 30 Days of Patient Admissions</p>
        <WorkedHistogramViz />
      </div>
    </div>
  ),
  datasetGenerator: true,
}

export default function Histogram({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
