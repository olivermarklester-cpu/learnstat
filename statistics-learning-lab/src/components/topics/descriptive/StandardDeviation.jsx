import { useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { BellCurveChart } from '../../charts'
import { useDataset } from '../../../hooks/useDataset'
import { mean, stdDevSample, stdDevPopulation, varianceSample, round } from '../../../utils/stats'

// Fixed dataset (same as Variance topic)
const FIXED = [5, 7, 7, 9, 12]
const fixedMean = mean(FIXED)
const fixedVar = round(varianceSample(FIXED), 4)
const fixedSD = round(stdDevSample(FIXED), 3)
const fixedSD1Low = round(fixedMean - fixedSD, 3)
const fixedSD1High = round(fixedMean + fixedSD, 3)
const fixedSD2Low = round(fixedMean - 2 * fixedSD, 3)
const fixedSD2High = round(fixedMean + 2 * fixedSD, 3)

// SVG Number Line visualization showing ±1 SD and ±2 SD bands
function SDNumberLine({ mean: m, sd, height = 140 }) {
  if (!m && m !== 0) return null
  if (!sd || sd <= 0) return null

  const svgWidth = 580
  const svgH = 120
  const padL = 40
  const padR = 40
  const plotW = svgWidth - padL - padR
  const lineY = 55

  const displayMin = m - 3 * sd
  const displayMax = m + 3 * sd
  const span = displayMax - displayMin

  const getX = (v) => padL + ((v - displayMin) / span) * plotW
  const r = (v, d = 1) => round(v, d)

  const bandData = [
    { z: 2, color: '#BFDBFE', opacity: 0.6, label: '±2σ (95%)', from: m - 2 * sd, to: m + 2 * sd },
    { z: 1, color: '#3B82F6', opacity: 0.3, label: '±1σ (68%)', from: m - sd, to: m + sd },
  ]

  const ticks = [-2, -1, 0, 1, 2].map((z) => ({ z, x: getX(m + z * sd), val: m + z * sd }))

  return (
    <div style={{ height }}>
      <svg viewBox={`0 0 ${svgWidth} ${svgH}`} className="w-full overflow-visible" aria-label="Standard deviation bands">
        {/* Bands */}
        {bandData.map(({ z, color, opacity, from, to }) => (
          <rect
            key={z}
            x={getX(from)}
            y={lineY - 22}
            width={getX(to) - getX(from)}
            height={44}
            fill={color}
            fillOpacity={opacity}
            rx={4}
          />
        ))}

        {/* Axis line */}
        <line x1={padL} y1={lineY} x2={padL + plotW} y2={lineY} stroke="#94A3B8" strokeWidth={2} />

        {/* Ticks + labels */}
        {ticks.map(({ z, x, val }) => (
          <g key={z}>
            <line x1={x} y1={lineY - 10} x2={x} y2={lineY + 10}
              stroke={z === 0 ? '#2563EB' : '#64748B'}
              strokeWidth={z === 0 ? 2.5 : 1.5}
            />
            <text x={x} y={lineY + 22} textAnchor="middle" style={{ fontSize: '10px', fill: z === 0 ? '#1D4ED8' : '#64748B' }}>
              {z === 0 ? 'x̄' : `${z > 0 ? '+' : ''}${z}s`}
            </text>
            <text x={x} y={lineY + 33} textAnchor="middle" style={{ fontSize: '9px', fill: '#94A3B8' }}>
              {r(val, 1)}
            </text>
          </g>
        ))}

        {/* Band labels */}
        <text x={getX(m)} y={lineY - 28} textAnchor="middle" style={{ fontSize: '10px', fill: '#2563EB', fontWeight: 600 }}>
          68% within ±1s | 95% within ±2s
        </text>
      </svg>
    </div>
  )
}

function SDViz({ data: propData }) {
  const { data: ownData } = useDataset({ n: 30, min: 1, max: 50, distribution: 'normal' })
  const data = propData ?? ownData
  const liveMean = useMemo(() => (data.length ? round(mean(data), 2) : null), [data])
  const liveSD = useMemo(() => (data.length ? round(stdDevSample(data), 2) : null), [data])

  return (
    <div>
      <div className="flex gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
          Mean (x̄): {liveMean ?? '…'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
          Sample SD (s): {liveSD ?? '…'}
        </span>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">±1s and ±2s bands around the mean</p>
        {liveMean !== null && liveSD !== null && (
          <SDNumberLine mean={liveMean} sd={liveSD} height={120} />
        )}
      </div>
      <BellCurveChart
        mean={liveMean}
        sd={liveSD}
        title="Normal Distribution with SD Bands"
        height={200}
      />
    </div>
  )
}

const content = {
  title: 'Standard Deviation',
  topicGroup: 'Descriptive Statistics',
  learningObjective:
    'Calculate sample standard deviation and interpret it as the typical distance of values from the mean.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Standard deviation (SD)</strong> is the square root of the variance. It measures the typical distance of values from the mean — in the <strong>original units</strong> of the data.
      </p>
      <p>
        A <strong>small standard deviation</strong> means values are tightly clustered around the mean. A <strong>large standard deviation</strong> means values are spread out.
      </p>
      <p>
        Standard deviation is the most widely used measure of spread in statistics. It is preferred over variance because it is in the same units as the original data, making it directly interpretable. If waiting times are in minutes, the standard deviation is also in minutes.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <strong>Empirical Rule (for roughly normal distributions):</strong>
        <ul className="mt-1 space-y-1 ml-3">
          <li>About <strong>68%</strong> of values fall within ±1 SD of the mean</li>
          <li>About <strong>95%</strong> of values fall within ±2 SD of the mean</li>
          <li>About <strong>99.7%</strong> of values fall within ±3 SD of the mean</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine you always arrive at work within about 5 minutes of your usual time. Your "typical deviation" is 5 minutes — that's your standard deviation. Now compare to a colleague who sometimes arrives 30 minutes early and other times 30 minutes late. Their standard deviation is 30 minutes — much larger, meaning their arrival time is far less predictable.
      </p>
      <p className="text-sm text-gray-600">
        Standard deviation gives you a single number that captures "how predictable/consistent is this data?"
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'standard-deviation',
    title: 'How Standard Deviation is built',
    steps: [
      {
        label: 'Start with Variance',
        symbolName: 's²',
        highlightColor: 'blue',
        from: 's = √s²',
        to: 's = √[ Σ(x − x̄)² / (n−1) ]',
        note: 'Variance (s²) measures spread in squared units. Taking the square root converts it back to the original units.',
      },
    ],
    finalFormula: 's = √[ Σ(x − x̄)² / (n−1) ]',
  },
  formula: {
    main: 's = √[ Σ(x − x̄)² / (n − 1) ]',
    variants: [
      { label: 'Sample SD', expression: 's = √[ Σ(x − x̄)² / (n − 1) ]', latex: 's = \\sqrt{\\frac{\\sum (x - \\bar{x})^{2}}{n - 1}}' },
      { label: 'Population SD', expression: 'σ = √[ Σ(x − μ)² / N ]', latex: '\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^{2}}{N}}' },
      { label: 'Relationship to variance', expression: 's = √s²   or   σ = √σ²', latex: 's = \\sqrt{s^{2}} \\quad \\sigma = \\sqrt{\\sigma^{2}}' },
    ],
    symbolGuide: [
      { symbol: 's', meaning: 'Sample standard deviation (read "s")' },
      { symbol: 'σ', meaning: 'Population standard deviation (read "sigma")' },
      { symbol: 'x', meaning: 'Each individual value' },
      { symbol: 'x̄', meaning: 'Sample mean' },
      { symbol: 'μ', meaning: 'Population mean' },
      { symbol: 'n', meaning: 'Sample size (divide by n−1 for samples)' },
      { symbol: 'N', meaning: 'Population size' },
      { symbol: '√', meaning: 'Square root — this converts variance back to original units' },
    ],
  },
  whenToUse: [
    'When you want to express spread in the original units of measurement',
    'For roughly symmetric, continuous data — especially when the mean is reported',
    'When using the Empirical Rule to describe what percentage of data falls within certain ranges',
    'As input for z-scores, confidence intervals, and hypothesis testing',
  ],
  whenNotToUse: [
    'When data is highly skewed or has outliers — use IQR instead (SD is affected by extreme values)',
    'For ordinal or nominal data — SD requires interval or ratio level',
    'When you specifically need the variance as input to a statistical procedure',
  ],
  assumptions: [
    'Data should be interval or ratio level',
    'Standard deviation is most meaningful when the distribution is roughly symmetric',
    'For skewed distributions, report IQR alongside (or instead of) SD',
    'Use sample SD (n−1) when working with a sample; use population SD (N) for the full population',
  ],
  workedExample: {
    scenario: 'Same dataset: call-center handling times (minutes): 5, 7, 7, 9, 12. We already calculated s² = 7.0 in the Variance topic.',
    dataset: '[5, 7, 7, 9, 12]',
    steps: [
      { stepNumber: 1, label: 'Start with the sample variance', expression: `s² = ${fixedVar} (calculated in the Variance topic)`, result: `s² = ${fixedVar} minutes²`, explanation: 'We calculated this in the Variance topic: Sum of squared deviations = 28, divided by n−1 = 4.' },
      { stepNumber: 2, label: 'Take the square root', expression: `s = √${fixedVar} ≈ ${fixedSD}`, result: `s ≈ ${fixedSD} minutes`, explanation: 'The square root brings the units back from minutes² to minutes — now directly interpretable.' },
      { stepNumber: 3, label: 'Identify the ±1 SD band', expression: `${fixedMean} ± ${fixedSD} = [${fixedSD1Low}, ${fixedSD1High}]`, result: `68% of values expected in [${fixedSD1Low}, ${fixedSD1High}]`, explanation: 'Most values should be within one SD of the mean. Check: 5, 7, 7, 9 all fall within this range; 12 is just outside.' },
      { stepNumber: 4, label: 'Identify the ±2 SD band', expression: `${fixedMean} ± ${round(2 * fixedSD, 3)} = [${fixedSD2Low}, ${fixedSD2High}]`, result: `95% of values expected in [${fixedSD2Low}, ${fixedSD2High}]`, explanation: `All 5 values fall within ±2 SD. The value 12 is ${round((12 - fixedMean) / fixedSD, 2)} standard deviations above the mean.` },
    ],
    interpretation: `The standard deviation of ${fixedSD} minutes means that call handling times typically differ from the mean of ${fixedMean} minutes by about ${fixedSD} minutes. Times range from roughly ${fixedSD1Low} to ${fixedSD1High} minutes (±1 SD). The value of 12 minutes is just over 1 standard deviation above the mean — somewhat high but not extreme.`,
  },
  interpretation: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        The standard deviation gives you a direct sense of <strong>typical variability</strong>. If mean = 8 minutes and SD = 2.6 minutes, then a value of 13 minutes is <strong>nearly 2 standard deviations above average</strong> — noticeable. A value of 8.5 is less than 0.2 standard deviations above average — essentially typical.
      </p>
      <p>
        When comparing two datasets on the same scale, <strong>larger SD = more variability</strong>. Two hospitals with the same mean wait time but different SDs have different consistency levels.
      </p>
    </div>
  ),
  commonMistakes: [
    { mistake: 'Forgetting to take the square root — reporting variance instead of SD', explanation: 'Variance and SD are different things. Always take the square root at the end if you want the standard deviation. Variance is in squared units; SD is in original units.' },
    { mistake: 'Using population SD (divides by N) when you have sample data', explanation: 'Always check: is this the full population or just a sample? Sample data → divide by n−1. Population data → divide by N.' },
    { mistake: 'Thinking SD and range measure the same thing', explanation: 'Range = Max − Min (only 2 values). SD uses every value in the dataset. Two datasets can have the same range but very different SDs.' },
    { mistake: 'Applying the Empirical Rule (68-95-99.7) to non-normal data', explanation: 'The Empirical Rule is specifically for bell-shaped (normal) distributions. For skewed data, the percentages within ±1, ±2, ±3 SDs will be different.' },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'sd-easy-1',
        scenario: 'You calculated sample variance s² = 16.',
        question: 'What is the sample standard deviation?',
        hint: 's = √s²',
        solution: 's = √16 = 4.',
      },
      {
        id: 'sd-easy-2',
        scenario: 'A dataset has mean = 50 and standard deviation = 10.',
        question: 'What is the ±1 SD range? What percentage of values would you expect in this range if the distribution is roughly normal?',
        hint: 'Range = mean ± 1 SD. Use the Empirical Rule.',
        solution: '±1 SD range: 50 − 10 = 40 to 50 + 10 = 60. For a normal distribution, approximately 68% of values fall within this range.',
      },
    ],
    moderate: [
      {
        id: 'sd-mod-1',
        scenario: 'Dataset: 4, 8, 6, 10, 12. Calculate the sample standard deviation step by step.',
        question: 'Show: mean, deviations, squared deviations, sum, variance, and SD.',
        hint: 'Mean = 40/5 = 8. Then follow the variance formula, then take the square root.',
        solution: 'Mean = (4+8+6+10+12)/5 = 40/5 = 8. Deviations: −4, 0, −2, 2, 4. Squared: 16, 0, 4, 4, 16. Sum = 40. Variance = 40/4 = 10. SD = √10 ≈ 3.162.',
      },
      {
        id: 'sd-mod-2',
        scenario: 'Hospital A: mean wait = 15 min, SD = 2 min. Hospital B: mean wait = 15 min, SD = 12 min.',
        question: 'Both hospitals have the same mean wait time. What does the difference in SD tell you? Which hospital would you prefer to visit?',
        hint: 'SD measures consistency/predictability, not just average.',
        solution: 'Hospital A (SD = 2) is highly consistent — nearly all patients wait close to 15 minutes. Hospital B (SD = 12) is highly variable — some patients may wait only 3 minutes but others could wait 27+ minutes. For ±2 SD: Hospital A ranges from 11–19 min; Hospital B from −9 to 39 min (meaning some waits could be very long). Hospital A is preferable if you value predictable wait times.',
      },
    ],
    challenging: [
      {
        id: 'sd-chal-1',
        scenario: 'A machine produces bolts with mean length = 50mm and SD = 0.3mm. Quality control rejects bolts below 49.1mm or above 50.9mm.',
        question: 'How many standard deviations from the mean are the rejection limits? What percentage of bolts would you expect to be rejected (assuming normal distribution)?',
        hint: 'How many SDs is 49.1 from 50? Use the Empirical Rule.',
        solution: 'Lower limit: z = (49.1 − 50) / 0.3 = −0.9 / 0.3 = −3 SD. Upper limit: z = (50.9 − 50) / 0.3 = 0.9 / 0.3 = +3 SD. The limits are exactly ±3 SD from the mean. By the Empirical Rule, 99.7% of a normal distribution falls within ±3 SD, so approximately 0.3% of bolts (3 in 1000) would be rejected.',
      },
      {
        id: 'sd-chal-2',
        scenario: 'Two investment portfolios over 12 months: Portfolio A returns (% monthly): mean = 2%, SD = 0.5%. Portfolio B: mean = 2%, SD = 4%.',
        question: 'Using ±2 SD (95% range), calculate the typical monthly return range for each. Interpret which is riskier.',
        hint: '95% range ≈ mean ± 2×SD.',
        solution: 'Portfolio A: 2 ± 2(0.5) = 2 ± 1 → monthly returns typically between 1% and 3%. Portfolio B: 2 ± 2(4) = 2 ± 8 → monthly returns typically between −6% and +10%. Both have the same average return, but Portfolio B could lose 6% in a month while Portfolio A rarely deviates far from 2%. Portfolio B is significantly riskier (SD 8× larger). In finance, SD is the fundamental measure of risk.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'sd-kc-1',
      type: 'multiple-choice',
      question: 'What is the relationship between variance (s²) and standard deviation (s)?',
      options: [
        { id: 'a', text: 's = s² / n', isCorrect: false, explanation: 'That is not the relationship.' },
        { id: 'b', text: 's = √s²', isCorrect: true, explanation: 'Correct! Standard deviation is the square root of variance.' },
        { id: 'c', text: 's = s² × 2', isCorrect: false, explanation: 'No — you take the square root, not multiply by 2.' },
        { id: 'd', text: 's = s² − 1', isCorrect: false, explanation: 'That is not a statistical relationship.' },
      ],
      explanation: 'Variance = SD². Standard deviation = √variance. Taking the square root of variance brings the units back to the original scale.',
      hint: 'How do variance and SD relate? One is the _____ of the other.',
    },
    {
      id: 'sd-kc-2',
      type: 'numerical',
      question: 'Sample variance s² = 49. What is the sample standard deviation s?',
      answer: 7,
      tolerance: 0,
      explanation: 's = √49 = 7.',
      hint: 's = √s²',
    },
    {
      id: 'sd-kc-3',
      type: 'multiple-choice',
      question: 'For a roughly normal distribution with mean = 100 and SD = 15, approximately what percentage of values fall between 70 and 130?',
      options: [
        { id: 'a', text: '68%', isCorrect: false, explanation: '68% is within ±1 SD = 85 to 115.' },
        { id: 'b', text: '95%', isCorrect: true, explanation: 'Correct! 70 = 100−2(15) and 130 = 100+2(15), so this is ±2 SD = approximately 95%.' },
        { id: 'c', text: '99.7%', isCorrect: false, explanation: '99.7% is within ±3 SD = 55 to 145.' },
        { id: 'd', text: '50%', isCorrect: false, explanation: '50% is within the middle half (IQR range), not ±2 SD.' },
      ],
      explanation: '70 = 100 − 2(15) and 130 = 100 + 2(15). This is ±2 SD, which contains approximately 95% of a normal distribution.',
      hint: 'How many standard deviations is 70 from the mean of 100?',
    },
    {
      id: 'sd-kc-4',
      type: 'multiple-choice',
      question: 'Two datasets have the same mean but different standard deviations. What does a larger SD indicate?',
      options: [
        { id: 'a', text: 'A larger maximum value', isCorrect: false, explanation: 'SD tells you about spread, not the specific maximum value.' },
        { id: 'b', text: 'Values are more spread out from the mean', isCorrect: true, explanation: 'Correct! Larger SD means values typically deviate further from the mean.' },
        { id: 'c', text: 'More data points', isCorrect: false, explanation: 'SD does not depend on sample size in this way.' },
        { id: 'd', text: 'A higher mean', isCorrect: false, explanation: 'We said both datasets have the same mean.' },
      ],
      explanation: 'Standard deviation measures typical distance from the mean. Larger SD = values are, on average, further from the mean = more variability.',
      hint: 'What does SD measure — center or spread?',
    },
    {
      id: 'sd-kc-5',
      type: 'multiple-choice',
      question: 'Why do we use standard deviation rather than variance to report results to a general audience?',
      options: [
        { id: 'a', text: 'Standard deviation is always a smaller number', isCorrect: false, explanation: 'SD = √variance, which is smaller than variance only when variance > 1.' },
        { id: 'b', text: 'Standard deviation is in the original units of measurement', isCorrect: true, explanation: 'Correct! If data is in minutes, SD is also in minutes — directly interpretable. Variance would be in minutes².' },
        { id: 'c', text: 'Standard deviation is easier to calculate', isCorrect: false, explanation: 'SD requires calculating variance first, then taking a square root — more steps, not fewer.' },
        { id: 'd', text: 'Standard deviation ignores outliers', isCorrect: false, explanation: 'Like variance, SD is affected by outliers. The IQR is more robust.' },
      ],
      explanation: 'Variance is in squared units (minutes², dollars², etc.). Standard deviation is in the original units (minutes, dollars), making it directly comparable to the data and easy to explain: "values typically differ from the mean by about X minutes."',
      hint: 'What are the units of SD compared to variance?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'sd-tf-1', type: 'true-false', question: 'Standard deviation is the square root of variance.', isTrue: true, explanation: 'SD = √Variance. This converts the variance from squared units back to the original units of measurement, making it easier to interpret.' },
    { id: 'sd-tf-2', type: 'true-false', question: 'A larger standard deviation indicates that data points are, on average, closer to the mean.', isTrue: false, explanation: 'A LARGER SD means values are MORE spread out (farther from the mean). A smaller SD means values cluster closely around the mean.' },
    { id: 'sd-tf-3', type: 'true-false', question: 'Standard deviation is always expressed in the same units as the original data.', isTrue: true, explanation: 'SD = √Variance. Taking the square root undoes the squaring of units, returning SD to the original measurement units (cm, kg, dollars, etc.).' },
    { id: 'sd-tf-4', type: 'true-false', question: 'For a normal distribution, approximately 95% of values fall within 2 standard deviations of the mean.', isTrue: true, explanation: 'The empirical rule (68-95-99.7): ~68% within ±1 SD, ~95% within ±2 SD, ~99.7% within ±3 SD. This is a fundamental property of the normal distribution.' },
    { id: 'sd-tf-5', type: 'true-false', question: 'Standard deviation can be negative.', isTrue: false, explanation: 'SD = √Variance ≥ 0 always. Since variance is always ≥ 0, its square root is also ≥ 0. SD = 0 when all values are identical.' },
    { id: 'sd-tf-6', type: 'true-false', question: 'Adding 10 to every value in a dataset increases the standard deviation by 10.', isTrue: false, explanation: 'Adding a constant shifts the distribution but does not change its spread. SD remains unchanged when a constant is added to every value.' },
    { id: 'sd-tf-7', type: 'true-false', question: 'For a normal distribution, approximately 68% of values fall within 1 standard deviation of the mean.', isTrue: true, explanation: 'The 68-95-99.7 rule: ~68% of data falls within μ ± 1σ (or x̄ ± 1s for samples). This is why 1 SD from the mean is such an important benchmark.' },
    { id: 'sd-tf-8', type: 'true-false', question: 'Multiplying every value by 3 multiplies the standard deviation by 9.', isTrue: false, explanation: 'Multiplying values by k multiplies the SD by |k|, not k². New SD = |k| × old SD = 3 × old SD. (Variance would be multiplied by k²=9, but SD is the square root of variance.)' },
    { id: 'sd-tf-9', type: 'true-false', question: 'The population standard deviation formula (σ) divides by N, while the sample formula (s) divides by (n−1).', isTrue: true, explanation: 'σ = √[Σ(xᵢ − μ)² / N]. s = √[Σ(xᵢ − x̄)² / (n−1)]. This is Bessel\'s correction for the sample formula.' },
    { id: 'sd-tf-10', type: 'true-false', question: 'Standard deviation is more commonly reported than variance because it is in the original units.', isTrue: true, explanation: 'Variance is in squared units (e.g., kg²), which is hard to interpret. SD is in the original units (kg), making it much more intuitive and directly comparable to the data.' },
    { id: 'sd-tf-11', type: 'true-false', question: 'A dataset of [5, 5, 5, 5] has a standard deviation of 5.', isTrue: false, explanation: 'All values are identical, so there is no variability. Every deviation from the mean (5) is 0. SD = √0 = 0.' },
    { id: 'sd-tf-12', type: 'true-false', question: 'Standard deviation is resistant to outliers.', isTrue: false, explanation: 'SD is NOT resistant to outliers. One extreme value inflates the deviations and their squares, dramatically increasing the SD. For outlier-resistant spread, use IQR.' },
    { id: 'sd-tf-13', type: 'true-false', question: 'The coefficient of variation (CV = SD/mean × 100%) allows comparing variability across datasets with different units.', isTrue: true, explanation: 'CV expresses variability as a percentage of the mean. Since it is dimensionless (units cancel), you can compare the relative variability of datasets measured in different units (e.g., kg vs. cm).' },
    { id: 'sd-tf-14', type: 'true-false', question: 'If SD = 0, then variance = 0.', isTrue: true, explanation: 'Variance = SD². If SD = 0, then Variance = 0² = 0. This means all values are identical.' },
    { id: 'sd-tf-15', type: 'true-false', question: 'Two datasets can have the same mean and same standard deviation but different shapes.', isTrue: true, explanation: 'Same mean and SD do not determine distribution shape. A normal distribution and a uniform distribution can have the same mean and SD. Anscombe\'s Quartet demonstrates this dramatically.' },
    { id: 'sd-tf-16', type: 'true-false', question: 'For a normal distribution, a value more than 3 standard deviations from the mean is extremely rare (less than 0.3% of values).', isTrue: true, explanation: 'The 68-95-99.7 rule: 99.7% of values fall within ±3 SD. Only 0.3% fall outside this range — these are rare extreme values.' },
    { id: 'sd-tf-17', type: 'true-false', question: 'Standard deviation is only appropriate for normally distributed data.', isTrue: false, explanation: 'SD can be computed for any quantitative dataset, regardless of distribution shape. However, the empirical rule (68-95-99.7) only applies to normal distributions. For skewed data, SD may be less interpretable.' },
    { id: 'sd-tf-18', type: 'true-false', question: 'The sample standard deviation (s) is always slightly larger than the population standard deviation (σ) computed on the same values.', isTrue: true, explanation: 's divides by (n−1) while σ divides by n. Since n−1 < n, s > σ for the same data. Bessel\'s correction makes s a bit larger to correct for bias.' },
    { id: 'sd-tf-19', type: 'true-false', question: 'Standard deviation cannot be used to compare groups with very different means.', isTrue: false, explanation: 'You CAN compare SDs across groups with different means. However, for a more meaningful comparison accounting for the scale of the mean, the coefficient of variation (CV = SD/mean) is preferred.' },
    { id: 'sd-tf-20', type: 'true-false', question: 'The standard deviation of a dataset is related to the IQR by the rule: IQR ≈ 1.35 × SD for normal distributions.', isTrue: true, explanation: 'For a normal distribution, IQR ≈ 1.35σ. This relationship allows you to estimate one from the other and is used in robust statistics.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'sd-mc-6', type: 'multiple-choice', question: 'A dataset has SD = 8 and mean = 50. For a normal distribution, what range contains approximately 68% of values?', options: [{ id: 'a', text: '34 to 66', isCorrect: false, explanation: 'That is 50 ± 16 = ±2 SD, not ±1 SD.' }, { id: 'b', text: '42 to 58', isCorrect: true, explanation: '50 ± 8 = 42 to 58. This is ±1 SD from the mean.' }, { id: 'c', text: '26 to 74', isCorrect: false, explanation: 'That is 50 ± 24 = ±3 SD.' }, { id: 'd', text: '50 ± 4', isCorrect: false, explanation: '±4 is half of 1 SD. ±1 SD = ±8.' }], explanation: '68% of data falls within ±1 SD = mean ± SD = 50 ± 8 = [42, 58].', hint: '68% → ±1 SD. 95% → ±2 SD. 99.7% → ±3 SD.' },
    { id: 'sd-mc-7', type: 'multiple-choice', question: 'If the sample variance is 49, the sample standard deviation is:', options: [{ id: 'a', text: '49', isCorrect: false, explanation: 'SD = √Variance = √49 = 7.' }, { id: 'b', text: '7', isCorrect: true, explanation: 'SD = √49 = 7.' }, { id: 'c', text: '2,401', isCorrect: false, explanation: '2401 = 49². SD = √49 = 7.' }, { id: 'd', text: '24.5', isCorrect: false, explanation: '24.5 = 49/2. SD = √49 = 7.' }], explanation: 'SD = √Variance = √49 = 7.', hint: 'SD = √Variance.' },
    { id: 'sd-mc-8', type: 'multiple-choice', question: 'Dataset A has SD = 2; Dataset B has SD = 20. What can you conclude?', options: [{ id: 'a', text: 'Dataset B has a higher mean', isCorrect: false, explanation: 'SD says nothing about the mean.' }, { id: 'b', text: 'Dataset B\'s values are more spread around its mean', isCorrect: true, explanation: 'SD = 20 means values in B deviate from B\'s mean by about 20 units on average; SD = 2 in A means much tighter clustering.' }, { id: 'c', text: 'Dataset A has more data points', isCorrect: false, explanation: 'SD does not indicate sample size.' }, { id: 'd', text: 'Dataset B is right-skewed', isCorrect: false, explanation: 'SD does not tell you the shape of the distribution.' }], explanation: 'Standard deviation measures spread. Higher SD = values are more spread from the mean. Dataset B (SD=20) has much greater variability than Dataset A (SD=2).', hint: 'What does a larger SD tell you about how values are distributed?' },
    { id: 'sd-mc-9', type: 'multiple-choice', question: 'For a normal distribution with mean = 100 and SD = 15, approximately what percentage of values fall between 70 and 130?', options: [{ id: 'a', text: '68%', isCorrect: false, explanation: '68% is within ±1 SD (85 to 115).' }, { id: 'b', text: '95%', isCorrect: true, explanation: '70 = 100 − 2×15 = μ − 2σ. 130 = 100 + 2×15 = μ + 2σ. ±2 SD ≈ 95%.' }, { id: 'c', text: '99.7%', isCorrect: false, explanation: '99.7% is within ±3 SD (55 to 145).' }, { id: 'd', text: '50%', isCorrect: false, explanation: '50% is within ±0.67 SD.' }], explanation: '70 = 100 − 2(15) and 130 = 100 + 2(15). This is ±2 standard deviations. The empirical rule says ~95% of values fall within ±2 SD.', hint: 'How many SDs away from 100 are 70 and 130?' },
    { id: 'sd-mc-10', type: 'multiple-choice', question: 'A manufacturing process produces bolts with mean diameter 10 mm and SD 0.1 mm. Another produces bolts with mean 10 mm and SD 0.5 mm. Which process is more consistent?', options: [{ id: 'a', text: 'Process with SD = 0.5 mm', isCorrect: false, explanation: 'Larger SD means more variability.' }, { id: 'b', text: 'Process with SD = 0.1 mm', isCorrect: true, explanation: 'Smaller SD = less variation = more consistent output.' }, { id: 'c', text: 'Both are equally consistent', isCorrect: false, explanation: 'Different SDs indicate different levels of consistency.' }, { id: 'd', text: 'Consistency cannot be determined from SD alone', isCorrect: false, explanation: 'SD directly measures variability in the output.' }], explanation: 'Consistency = low variability = small SD. A bolt process with SD = 0.1 mm produces much more uniform bolt sizes (tighter clustering around 10 mm) than one with SD = 0.5 mm.', hint: 'Lower SD = less spread = more consistent.' },
    { id: 'sd-mc-11', type: 'multiple-choice', question: 'All values in a dataset are multiplied by 4. If the original SD was 5, the new SD is:', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'Multiplying values by k multiplies SD by |k|.' }, { id: 'b', text: '20', isCorrect: true, explanation: 'New SD = |k| × old SD = 4 × 5 = 20.' }, { id: 'c', text: '80', isCorrect: false, explanation: '80 = 4² × 5 = 16 × 5. That is the variance multiplication rule, not SD.' }, { id: 'd', text: '1.25', isCorrect: false, explanation: '1.25 = 5/4. Multiplying increases SD, not decreases.' }], explanation: 'When all values are multiplied by k, new SD = |k| × old SD = 4 × 5 = 20. (Variance would be multiplied by k²=16: 16 × 25 = 400 → SD = √400 = 20 ✓).', hint: 'Multiplying values by k multiplies SD by |k|.' },
    { id: 'sd-mc-12', type: 'multiple-choice', question: 'Which of the following is the empirical rule (68-95-99.7 rule) applicable to?', options: [{ id: 'a', text: 'Any dataset, regardless of distribution', isCorrect: false, explanation: 'The empirical rule specifically applies to normal distributions.' }, { id: 'b', text: 'Only normal (bell-shaped) distributions', isCorrect: true, explanation: 'The 68-95-99.7 rule describes specific percentage intervals for normal distributions only.' }, { id: 'c', text: 'Only datasets with n > 100', isCorrect: false, explanation: 'The empirical rule is about distribution shape, not sample size.' }, { id: 'd', text: 'Any symmetric distribution', isCorrect: false, explanation: 'Symmetric but non-normal distributions (e.g., uniform) do not follow the 68-95-99.7 rule.' }], explanation: 'The empirical rule (68-95-99.7) is derived from the mathematics of the normal distribution. It only applies when data is approximately normally distributed. For non-normal data, use Chebyshev\'s inequality instead.', hint: 'Which distribution has the bell curve that the 68-95-99.7 rule describes?' },
    { id: 'sd-mc-13', type: 'multiple-choice', question: 'In a dataset with mean = 20 and SD = 4, a value of 28 is approximately how many standard deviations above the mean?', options: [{ id: 'a', text: '1 SD above', isCorrect: false, explanation: '1 SD above = 20 + 4 = 24. 28 > 24.' }, { id: 'b', text: '2 SDs above', isCorrect: true, explanation: '(28 − 20) / 4 = 8/4 = 2. This is the z-score = 2 SD above the mean.' }, { id: 'c', text: '3 SDs above', isCorrect: false, explanation: '3 SDs above = 20 + 12 = 32. 28 < 32.' }, { id: 'd', text: '4 SDs above', isCorrect: false, explanation: '4 SDs above = 20 + 16 = 36. 28 < 36.' }], explanation: 'Z = (x − mean) / SD = (28 − 20) / 4 = 8/4 = 2. So 28 is 2 standard deviations above the mean.', hint: 'Z = (value − mean) / SD.' },
    { id: 'sd-mc-14', type: 'multiple-choice', question: 'Why is it typically better to report standard deviation than variance when summarizing data?', options: [{ id: 'a', text: 'Standard deviation is always smaller than variance', isCorrect: false, explanation: 'SD < variance only when variance > 1.' }, { id: 'b', text: 'Standard deviation is in the original units of measurement', isCorrect: true, explanation: 'SD = √Variance returns the result to original units, making it directly interpretable.' }, { id: 'c', text: 'Variance cannot be computed for small samples', isCorrect: false, explanation: 'Variance can be computed for n ≥ 2.' }, { id: 'd', text: 'Standard deviation is unaffected by outliers', isCorrect: false, explanation: 'Both SD and variance are sensitive to outliers.' }], explanation: 'Variance is in squared units (cm², kg²), which is hard to interpret. "Typical blood pressure varies by 225 mmHg²" is meaningless. "Typical blood pressure varies by 15 mmHg" (SD) is immediately interpretable.', hint: 'What makes SD easier to understand than variance?' },
    { id: 'sd-mc-15', type: 'multiple-choice', question: 'Compute the sample SD for: 2, 4, 6. (Mean = 4)', options: [{ id: 'a', text: '2', isCorrect: true, explanation: 'Deviations: −2, 0, 2. Squared: 4, 0, 4. Sum=8. Variance=8/2=4. SD=√4=2.' }, { id: 'b', text: '4', isCorrect: false, explanation: '4 is the variance, not the SD.' }, { id: 'c', text: '√8', isCorrect: false, explanation: '√8 is √(sum of squared deviations), not the SD. Divide by n−1 first.' }, { id: 'd', text: '1.33', isCorrect: false, explanation: 'Check: variance = 8/2 = 4, SD = √4 = 2.' }], explanation: 'Deviations: (2−4)=−2, (4−4)=0, (6−4)=2. Squared: 4, 0, 4. Sum=8. Sample variance = 8/(3−1) = 4. SD = √4 = 2.', hint: 'SD = √[Σ(x−mean)² / (n−1)].' },
  ],
  keyTakeaway:
    'Standard deviation = √variance. It measures typical distance from the mean in the original units. For normal distributions, ~68% of values fall within ±1 SD, ~95% within ±2 SD, and ~99.7% within ±3 SD of the mean.',
  visualization: (data) => <SDViz data={data} />,
  datasetGenerator: true,
}

export default function StandardDeviation({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
