import { useState } from 'react'
import { useDataset } from '../../../hooks/useDataset.js'
import TopicPage from '../../layout/TopicPage'
import DatasetGenerator from '../../shared/DatasetGenerator'
import { HistogramChart } from '../../charts'

// Distribution shape reference table
const shapeReferenceTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Shape</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Visual Pattern</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Mean vs Median</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Common Examples</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Symmetric / Bell-shaped (Normal)</td>
          <td className="py-3 px-4">Single peak in center, mirror-image tails</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Mean ≈ Median ≈ Mode</td>
          <td className="py-3 px-4 text-textDark">Heights, IQ scores, measurement errors</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Uniform</td>
          <td className="py-3 px-4">Flat — all values equally frequent</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-info">Mean ≈ Median</td>
          <td className="py-3 px-4 text-textDark">Rolling a fair die, random number generator</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Positively Skewed (Right-skewed)</td>
          <td className="py-3 px-4">Peak on left, long tail stretching right</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-warning">Mean &gt; Median</td>
          <td className="py-3 px-4 text-textDark">Income, hospital length of stay, insurance claims</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Negatively Skewed (Left-skewed)</td>
          <td className="py-3 px-4">Peak on right, long tail stretching left</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-info">Mean &lt; Median</td>
          <td className="py-3 px-4 text-textDark">Age at death (in developed countries), easy test scores</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Bimodal</td>
          <td className="py-3 px-4">Two distinct peaks</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Mean and median typically fall between the peaks</td>
          <td className="py-3 px-4 text-textDark">Mixed populations (e.g., newborn and elderly patient heights combined)</td>
        </tr>
      </tbody>
    </table>
  </div>
)

const content = {
  title: 'Data Distributions',
  topicGroup: 'Foundations',
  learningObjective:
    'Identify common shapes of data distributions and explain what each shape tells you about the data.',
  explanation:
    'A distribution describes the pattern of how values in a dataset are spread out. When you create a histogram of your data, the shape that emerges is the distribution. Some distributions are symmetric and bell-shaped. Others lean to one side (skewed) or are flat (uniform). The shape of your distribution affects which statistical methods work best.\n\n**Key shapes:**\n- **Symmetric (bell-shaped / normal):** Values cluster in the middle, with equal tails on each side. Mean ≈ Median ≈ Mode.\n- **Uniform:** All values appear with roughly equal frequency. No peak.\n- **Positively skewed (right-skewed):** Most values are small, with a long tail stretching to the right. Mean > Median.\n- **Negatively skewed (left-skewed):** Most values are large, with a long tail stretching to the left. Mean < Median.\n- **Bimodal:** Two distinct peaks — suggests two subgroups in the data.',
  analogy:
    'Think of the bell curve like a hill in the middle of a flat field — most of the action happens at the peak. A positively skewed distribution is like a ramp — most values are at the low end, with a few unusually large values pulling the tail out to the right. A uniform distribution is like a flat parking lot — every value is equally common.',
  formula: null,
  whenToUse: [
    'Always — before choosing any statistical method, look at your data\'s distribution shape.',
    'When deciding between parametric (normal-assuming) and non-parametric tests.',
    'When deciding whether the mean or median better represents the "typical" value.',
  ],
  whenNotToUse: [
    'Not applicable — this is a descriptive step used in every analysis.',
  ],
  assumptions: [
    'The sample is representative of the population.',
    'The histogram bin width is chosen appropriately (not too wide, not too narrow).',
  ],
  workedExample: {
    scenario:
      'A hospital tracks daily emergency department admissions for 30 days. The histogram shows a peak around 25–30 admissions with a long tail stretching toward 50+ admissions on busy days.',
    dataset: null,
    steps: [
      {
        stepNumber: 1,
        label: 'Observe the histogram shape',
        expression: 'Peak on left (low values), long tail to the right (high values)',
        result: 'Positively skewed (right-skewed)',
        explanation: 'Most days have moderate admissions, but a few unusually busy days stretch the tail right.',
      },
      {
        stepNumber: 2,
        label: 'Compare mean and median',
        expression: 'Mean = 32.4, Median = 28',
        result: 'Mean (32.4) > Median (28)',
        explanation: 'The few high-admission days pull the mean up, but the median stays near the peak.',
      },
      {
        stepNumber: 3,
        label: 'Interpret the skew',
        expression: 'Right skew → mean pulled toward tail',
        result: 'Median better represents "typical" day',
        explanation: 'For skewed data, the median is more robust. A "typical" day has ~28 admissions, not 32.',
      },
    ],
    interpretation:
      'The distribution is positively skewed. The mean (32.4) is higher than the median (28) because the few very busy days pull the average up. If you plan staffing based on the mean, you might overstaff on typical days. The median (28) better represents a typical day. This shape is common for count data like admissions, wait times, and costs.',
  },
  interpretation:
    'Always look at the shape of your distribution before choosing a statistical method — the shape tells you a lot about your data. Symmetric distributions support the mean as a measure of center and parametric tests. Skewed distributions favor the median and non-parametric tests. Bimodal distributions suggest you may have two different groups mixed together — consider separating them. Uniform distributions are rare in nature and may indicate a measurement issue or a constrained range.',
  commonMistakes: [
    {
      mistake: 'Assuming all data is normally distributed — many real datasets are skewed',
      explanation:
        'The normal distribution is a mathematical ideal, not a universal truth. Income, wait times, lengths of stay, and insurance claims are typically right-skewed. Always check the histogram first.',
    },
    {
      mistake: 'Confusing "positive skew" direction — positive skew means tail on the right (high values), not leaning left',
      explanation:
        '"Positive" refers to the direction of the tail on the number line (toward positive infinity). The bulk of the data is on the left. Think: "positive = pulled toward positive numbers."',
    },
    {
      mistake: 'Using the mean to describe the center of a highly skewed distribution — the median is more appropriate',
      explanation:
        'In a right-skewed distribution, the mean is pulled toward the tail and exceeds the median. The mean no longer represents the "typical" observation. Report the median (and IQR) for skewed data.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'dd-easy-1',
        scenario:
          'A histogram of test scores shows a single peak in the middle with roughly symmetric tails on both sides. Mean = 78, Median = 77.5.',
        question: 'What is the shape of this distribution? Which measure of center is most appropriate?',
        hint: 'Symmetric bell shape → normal-like. Mean ≈ Median.',
        solution:
          'Shape: Symmetric (approximately normal). Mean ≈ Median, so both are reasonable, but the mean is typically used for symmetric distributions.',
      },
      {
        id: 'dd-easy-2',
        scenario:
          'A histogram of household incomes shows a sharp peak at $30k–$50k and a long, gradual tail stretching to $200k+. Mean = $72k, Median = $48k.',
        question: 'What is the skew direction? Why is the mean higher than the median?',
        hint: 'Tail on the right = positive skew. High values pull the mean.',
        solution:
          'Positively skewed (right-skewed). The few very high incomes pull the mean upward, while the median stays near the peak where most data lies.',
      },
    ],
    moderate: [
      {
        id: 'dd-mod-1',
        scenario:
          'A researcher creates histograms for three variables: (A) Heights of adult women, (B) Number of children per family, (C) Scores on a very easy test where most students got 90–100.',
        question: 'Predict the shape of each histogram (symmetric, right-skewed, left-skewed, uniform, bimodal).',
        hint: 'Heights → symmetric. Counts → right-skewed. Easy test → left-skewed (ceiling effect).',
        solution:
          '(A) Heights → Symmetric / bell-shaped (normal).\n(B) Number of children → Positively skewed (right-skewed) — most have 0–3, few have many.\n(C) Easy test scores → Negatively skewed (left-skewed) — peak at high scores, tail toward low scores.',
      },
      {
        id: 'dd-mod-2',
        scenario:
          'A hospital combines height data from the maternity ward (newborns) and the geriatric ward (elderly patients). The histogram shows two peaks: one around 50 cm, one around 165 cm.',
        question: 'What is this shape called? What does it suggest about the data?',
        hint: 'Two peaks = bimodal. What does that imply about the population?',
        solution:
          'Bimodal distribution. Two distinct peaks suggest two different subgroups are mixed together (newborns and elderly). Analyzing them as one group is misleading — they should be separated.',
      },
    ],
    challenging: [
      {
        id: 'dd-chal-1',
        scenario:
          'A dataset of 500 processing times for insurance claims has mean = 14.2 days, median = 10 days, mode = 8 days. The histogram shows a peak at 8 days and a long tail to the right.',
        question: 'A manager says "The average processing time is 14 days, so we should tell customers to expect 2 weeks." Is this good communication? What would you recommend?',
        hint: 'Mean > Median > Mode = positive skew. Mean is not "typical."',
        solution:
          'This is positively skewed data (mean > median > mode). The mean (14.2) is pulled up by a few very long claims. Most claims are processed around 8–10 days. Telling customers "2 weeks" based on the mean overstates the typical wait. Better: "Most claims are processed in 8–10 days (median 10), but complex cases can take longer." Report median and IQR for skewed data.',
      },
      {
        id: 'dd-chal-2',
        scenario:
          'A uniform distribution of 100 random numbers between 1 and 100 has mean = 50.5, median = 50.5. A colleague says "Since mean = median, this must be normally distributed."',
        question: 'Is the colleague correct? How can you distinguish uniform from normal when mean ≈ median?',
        hint: 'Mean = median in BOTH symmetric normal AND uniform. Look at the SHAPE (histogram).',
        solution:
          'No, the colleague is incorrect. Mean = median occurs in ANY symmetric distribution — both normal AND uniform (and others). You distinguish them by the SHAPE: normal has a peak in the middle; uniform is flat. Always look at the histogram, not just summary statistics.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'dd-kc-1',
      type: 'multiple-choice',
      question: 'In a positively skewed (right-skewed) distribution, how do the mean and median compare?',
      options: [
        { id: 'a', text: 'Mean < Median', isCorrect: false, explanation: 'That describes negative (left) skew' },
        { id: 'b', text: 'Mean = Median', isCorrect: false, explanation: 'That describes symmetric distributions' },
        { id: 'c', text: 'Mean > Median', isCorrect: true, explanation: 'The long right tail pulls the mean upward' },
        { id: 'd', text: 'Cannot be determined', isCorrect: false, explanation: 'The relationship is a defining property of skew direction' },
      ],
      explanation:
        'In a right-skewed distribution, the few extremely high values pull the mean toward the tail, making it larger than the median. The median is resistant to extreme values.',
      hint: 'Which measure is pulled toward the tail?',
    },
    {
      id: 'dd-kc-2',
      type: 'multiple-choice',
      question: 'A histogram shows two distinct peaks. What is this shape called, and what does it usually suggest?',
      options: [
        { id: 'a', text: 'Bimodal — two subgroups mixed together', isCorrect: true, explanation: 'Two peaks often indicate two different populations in one dataset' },
        { id: 'b', text: 'Bimodal — measurement error', isCorrect: false, explanation: 'Bimodality usually reflects real subgroups, not error' },
        { id: 'c', text: 'Normal — just a wide peak', isCorrect: false, explanation: 'Normal has ONE peak, not two' },
        { id: 'd', text: 'Uniform — flat with noise', isCorrect: false, explanation: 'Uniform is flat, not peaked' },
      ],
      explanation:
        'Bimodal = two modes (peaks). This often means you have two distinct groups combined (e.g., newborn + elderly patient heights, lunch + dinner arrival times). Consider analyzing the groups separately.',
      hint: 'Two peaks = two modes. What creates two clusters in one dataset?',
    },
    {
      id: 'dd-kc-3',
      type: 'multiple-choice',
      question: 'Which distribution shape has NO peak (all values roughly equally frequent)?',
      options: [
        { id: 'a', text: 'Normal', isCorrect: false, explanation: 'Normal has a single peak in the center' },
        { id: 'b', text: 'Uniform', isCorrect: true, explanation: 'Uniform is flat — all values equally likely' },
        { id: 'c', text: 'Positively skewed', isCorrect: false, explanation: 'Skewed distributions have a peak on one side' },
        { id: 'd', text: 'Bimodal', isCorrect: false, explanation: 'Bimodal has TWO peaks' },
      ],
      explanation:
        'A uniform distribution has no mode (or every value is a mode) — all values occur with roughly equal frequency. It looks like a flat rectangle on a histogram.',
      hint: 'Think of rolling a fair die — every face is equally likely.',
    },
    {
      id: 'dd-kc-4',
      type: 'multiple-choice',
      question: 'You have a right-skewed distribution of hospital lengths of stay. Which measure of center should you report to represent a "typical" stay?',
      options: [
        { id: 'a', text: 'Mean', isCorrect: false, explanation: 'Mean is pulled toward the long tail (long stays)' },
        { id: 'b', text: 'Median', isCorrect: true, explanation: 'Median is resistant to skew and represents the typical value' },
        { id: 'c', text: 'Mode', isCorrect: false, explanation: 'Mode is the peak but less stable than median' },
        { id: 'd', text: 'Midrange', isCorrect: false, explanation: 'Midrange is highly sensitive to outliers' },
      ],
      explanation:
        'For skewed data, the median is the preferred measure of center because it is not influenced by extreme values in the tail. The mean overstates the "typical" value in right-skewed data.',
      hint: 'Which measure is robust to outliers and skew?',
    },
    {
      id: 'dd-kc-5',
      type: 'multiple-choice',
      question: 'A negatively skewed (left-skewed) distribution has:',
      options: [
        { id: 'a', text: 'Mean > Median', isCorrect: false, explanation: 'That is positive (right) skew' },
        { id: 'b', text: 'Mean < Median', isCorrect: true, explanation: 'The long left tail pulls the mean down below the median' },
        { id: 'c', text: 'Mean = Median', isCorrect: false, explanation: 'That is symmetric' },
        { id: 'd', text: 'No tail', isCorrect: false, explanation: 'Skewed distributions have one long tail by definition' },
      ],
      explanation:
        'In a left-skewed distribution, the tail stretches toward low values (negative direction). The few very low values pull the mean down, making it smaller than the median.',
      hint: 'Negative skew = tail on the left (low values). Which measure gets pulled toward the tail?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'dd-tf-1', type: 'true-false', question: 'A normal distribution is perfectly symmetric around its mean.', isTrue: true, explanation: 'The normal (bell-shaped) distribution is defined by its symmetry. The left and right halves are mirror images around the mean, which equals the median and mode.' },
    { id: 'dd-tf-2', type: 'true-false', question: 'In a positively skewed distribution, the tail extends toward the left.', isTrue: false, explanation: 'Positive (right) skew means the tail extends toward the RIGHT (higher values). The few extremely high values create the long right tail, pulling the mean above the median.' },
    { id: 'dd-tf-3', type: 'true-false', question: 'A uniform distribution has all values occurring with approximately equal frequency.', isTrue: true, explanation: 'In a uniform distribution, every value (or interval) is equally likely. The histogram looks like a flat rectangle. Example: rolling a fair die — each face has probability 1/6.' },
    { id: 'dd-tf-4', type: 'true-false', question: 'In a negatively skewed distribution, the mean is greater than the median.', isTrue: false, explanation: 'In a negatively (left) skewed distribution, the long tail is on the LEFT (low values), pulling the mean DOWN. Therefore mean < median in left skew. Mean > median is positive (right) skew.' },
    { id: 'dd-tf-5', type: 'true-false', question: 'A bimodal distribution has two distinct peaks in its histogram.', isTrue: true, explanation: 'Bimodal means two modes — two values (or ranges) that occur most frequently, creating two peaks in the histogram. This often indicates two subpopulations mixed together.' },
    { id: 'dd-tf-6', type: 'true-false', question: 'For a perfectly symmetric, single-peaked (unimodal) distribution, mean = median = mode.', isTrue: true, explanation: 'When a distribution is perfectly symmetric with a single peak (like the normal distribution), all three measures of center coincide at the point of symmetry. (A symmetric bimodal or uniform distribution has mean = median but no single mode at the center.)' },
    { id: 'dd-tf-7', type: 'true-false', question: 'The shape of a distribution can be identified from a histogram.', isTrue: true, explanation: 'A histogram displays the frequency distribution of data. Its shape reveals whether data is symmetric, skewed, uniform, bimodal, or has other patterns.' },
    { id: 'dd-tf-8', type: 'true-false', question: 'All real-world datasets follow a normal distribution.', isTrue: false, explanation: 'Many real-world datasets are skewed, bimodal, uniform, or have other non-normal shapes. Income, waiting times, and many biological measurements deviate significantly from normality.' },
    { id: 'dd-tf-9', type: 'true-false', question: 'Income data (salaries) is typically right-skewed (positively skewed).', isTrue: true, explanation: 'Most people earn moderate incomes, but a few earn extremely high amounts. This creates a long right tail, making income data positively (right) skewed.' },
    { id: 'dd-tf-10', type: 'true-false', question: 'A distribution with a long left tail is called positively skewed.', isTrue: false, explanation: 'A long LEFT tail indicates NEGATIVE (left) skew. The terms refer to the direction of the tail: right tail = positive skew, left tail = negative skew.' },
    { id: 'dd-tf-11', type: 'true-false', question: 'A bimodal distribution always indicates a mixture of two distinct subgroups.', isTrue: false, explanation: 'While two subgroups is a common cause of bimodality, it is not the only one. Bimodality can also arise from natural processes, measurement artifacts, or other phenomena.' },
    { id: 'dd-tf-12', type: 'true-false', question: 'The kurtosis of a distribution describes its tail heaviness (relative to the normal distribution).', isTrue: true, explanation: 'Kurtosis measures the weight of the tails relative to the normal distribution. High kurtosis (leptokurtic) = heavier tails (often described as a sharper peak). Low kurtosis (platykurtic) = lighter tails (often described as a flatter peak).' },
    { id: 'dd-tf-13', type: 'true-false', question: 'In a right-skewed distribution, the majority of data points fall on the right side of the mean.', isTrue: false, explanation: 'In right-skewed data, the BULK of the data is on the LEFT (lower values), with a few extreme high values pulling the tail and mean to the right. The mean > median because the mean is pulled right.' },
    { id: 'dd-tf-14', type: 'true-false', question: 'Exam scores often follow a negatively skewed distribution when the test is easy.', isTrue: true, explanation: 'When a test is easy, most students score high (clustering toward the top), with few low scores creating a long left tail. This creates negative (left) skew.' },
    { id: 'dd-tf-15', type: 'true-false', question: 'A distribution can be both symmetric and bimodal.', isTrue: true, explanation: 'Yes — a distribution can be symmetric about its center while still having two peaks. For example, equal-sized normal distributions centered equidistantly on either side of the mean.' },
    { id: 'dd-tf-16', type: 'true-false', question: 'Skewness only affects the mean, not the median or mode.', isTrue: false, explanation: 'Skewness primarily affects the MEAN (pulls it toward the tail), while the median is more resistant. The mode is the peak, which stays near most observations. All three can differ in skewed distributions.' },
    { id: 'dd-tf-17', type: 'true-false', question: 'The normal distribution is the only distribution relevant to statistical testing.', isTrue: false, explanation: 'Many distributions are used in statistics: t-distribution, chi-square, F-distribution, binomial, Poisson, uniform, etc. The normal distribution is important but far from the only one.' },
    { id: 'dd-tf-18', type: 'true-false', question: 'When data is severely right-skewed, a log transformation can make it more symmetric.', isTrue: true, explanation: 'Log transformation compresses large values while expanding small ones, reducing right skew. It is commonly used for income, biological measurements, and other right-skewed data.' },
    { id: 'dd-tf-19', type: 'true-false', question: 'A histogram and a frequency table display the same underlying information.', isTrue: true, explanation: 'A histogram is a visual representation of a grouped frequency table. Both show how data is distributed across value ranges.' },
    { id: 'dd-tf-20', type: 'true-false', question: 'The shape of the distribution is irrelevant when choosing statistical tests.', isTrue: false, explanation: 'Distribution shape is critically important for test selection. Parametric tests (t-test, ANOVA) assume approximately normal distributions. Severely skewed data may require non-parametric alternatives.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'dd-mc-6', type: 'multiple-choice', question: 'For a dataset of salaries with a few extremely high earners, which describes the distribution?', options: [{ id: 'a', text: 'Symmetric', isCorrect: false, explanation: 'Extreme high values create asymmetry.' }, { id: 'b', text: 'Negatively (left) skewed', isCorrect: false, explanation: 'Left skew = extreme LOW values. High earners create right skew.' }, { id: 'c', text: 'Positively (right) skewed', isCorrect: true, explanation: 'A few very high salaries create a long right tail — positive (right) skew.' }, { id: 'd', text: 'Uniform', isCorrect: false, explanation: 'Uniform means all values equally likely. Salaries cluster at moderate levels.' }], explanation: 'Most people earn moderate salaries; a few earn very high amounts. The few high values stretch the distribution to the right, creating positive (right) skew. The mean will be higher than the median.', hint: 'Which direction is the tail? Toward high values or low values?' },
    { id: 'dd-mc-7', type: 'multiple-choice', question: 'A class of 30 students takes a very difficult exam. Most score below 50%, with a few scoring in the 80–100% range. The distribution is likely:', options: [{ id: 'a', text: 'Symmetric (normal)', isCorrect: false, explanation: 'Normal would have most scores near the average, with equal tails.' }, { id: 'b', text: 'Positively (right) skewed', isCorrect: true, explanation: 'Most scores cluster at the low end (peak on left), with a few high scores creating a long right tail.' }, { id: 'c', text: 'Negatively (left) skewed', isCorrect: false, explanation: 'Left skew would mean most scores are high, with a few very low scores.' }, { id: 'd', text: 'Uniform', isCorrect: false, explanation: 'Uniform would mean all score ranges are equally likely.' }], explanation: 'On a difficult exam, most students score low — the bulk of scores cluster on the left. The few students who score high create a long right tail → positive (right) skew.', hint: 'Where do most scores cluster? Which direction is the tail?' },
    { id: 'dd-mc-8', type: 'multiple-choice', question: 'A histogram shows two peaks — one around age 25 and another around age 55. This is most likely because:', options: [{ id: 'a', text: 'The data was collected with measurement errors', isCorrect: false, explanation: 'Measurement errors would create random scatter, not two distinct peaks.' }, { id: 'b', text: 'The sample is too small', isCorrect: false, explanation: 'Two clear peaks persist even with large samples if two subgroups exist.' }, { id: 'c', text: 'Two distinct subgroups (e.g., young and senior employees) were mixed together', isCorrect: true, explanation: 'Bimodal distributions often reflect two subpopulations — here, two distinct age clusters in the workforce.' }, { id: 'd', text: 'The data is ratio-level', isCorrect: false, explanation: 'The level of measurement does not cause bimodality.' }], explanation: 'Two peaks (bimodal) in an age histogram suggest two distinct groups were combined — young workers and senior workers. The solution is often to analyze the groups separately.', hint: 'What real-world structure could produce two distinct clusters in one dataset?' },
    { id: 'dd-mc-9', type: 'multiple-choice', question: 'Which distribution shape would you expect for a fair six-sided die rolled 10,000 times?', options: [{ id: 'a', text: 'Normal (bell-shaped)', isCorrect: false, explanation: 'Die rolls are equally likely — not concentrated in the middle.' }, { id: 'b', text: 'Positively skewed', isCorrect: false, explanation: 'Skew requires unequal probability at extremes.' }, { id: 'c', text: 'Uniform', isCorrect: true, explanation: 'Each face has equal probability (1/6). With many rolls, frequencies approach equal for all values 1–6.' }, { id: 'd', text: 'Bimodal', isCorrect: false, explanation: 'Bimodal requires two modes (peaks). A fair die has no preferred values.' }], explanation: 'With a fair die, each face (1–6) has equal probability 1/6. With many rolls, all six faces appear roughly equally often, producing a flat (uniform) distribution.', hint: 'Equal probability for all outcomes → what shape?' },
    { id: 'dd-mc-10', type: 'multiple-choice', question: 'If a distribution is left-skewed, which statement is TRUE?', options: [{ id: 'a', text: 'Mean > Median', isCorrect: false, explanation: 'Mean > Median is positive (right) skew.' }, { id: 'b', text: 'Mean < Median', isCorrect: true, explanation: 'Left skew: the tail pulls the mean toward LOW values, making mean < median.' }, { id: 'c', text: 'Mean = Median', isCorrect: false, explanation: 'That describes symmetric distributions.' }, { id: 'd', text: 'Mean > Mode', isCorrect: false, explanation: 'In left skew the mean is pulled down toward the tail, so it typically lies below the mode (not above it).' }], explanation: 'In left (negative) skew: the tail stretches toward LOW values. Those low extreme values pull the mean downward. The typical order is: Mean < Median ≤ Mode.', hint: 'In left skew, the mean is pulled toward which direction?' },
    { id: 'dd-mc-11', type: 'multiple-choice', question: 'You observe that in a dataset, mean = 75, median = 78, mode = 82. The distribution is most likely:', options: [{ id: 'a', text: 'Right-skewed (positively skewed)', isCorrect: false, explanation: 'Right skew: Mean > Median. Here Mean (75) < Median (78).' }, { id: 'b', text: 'Left-skewed (negatively skewed)', isCorrect: true, explanation: 'Mean (75) < Median (78) < Mode (82) indicates left (negative) skew.' }, { id: 'c', text: 'Symmetric', isCorrect: false, explanation: 'Symmetric: Mean ≈ Median ≈ Mode. These values differ too much.' }, { id: 'd', text: 'Uniform', isCorrect: false, explanation: 'Uniform distributions have roughly equal frequencies, not three different central tendencies.' }], explanation: 'Key pattern: Mean < Median < Mode = left (negative) skew. The few extreme low values pull the mean down below the median. Mean > Median > Mode = right skew.', hint: 'The order Mean < Median < Mode indicates which direction of skew?' },
    { id: 'dd-mc-12', type: 'multiple-choice', question: 'Why is it important to identify the shape of a distribution before choosing a statistical test?', options: [{ id: 'a', text: 'Shape determines sample size requirements only', isCorrect: false, explanation: 'Shape affects much more than just sample size.' }, { id: 'b', text: 'Parametric tests assume approximately normal distributions; violating this can invalidate results', isCorrect: true, explanation: 't-tests, ANOVA, and other parametric tests assume normality. Severely non-normal data may require non-parametric alternatives.' }, { id: 'c', text: 'All statistical tests require normally distributed data', isCorrect: false, explanation: 'Non-parametric tests (Mann-Whitney, Kruskal-Wallis) make no normality assumption.' }, { id: 'd', text: 'Distribution shape is only relevant for visualization, not analysis', isCorrect: false, explanation: 'Shape has direct implications for which statistical tests are valid.' }], explanation: 'Parametric tests (t-tests, ANOVA) are built on the assumption of approximately normal distributions. When data is severely skewed, these tests can produce misleading p-values. Checking the shape guides test selection.', hint: 'What assumption do parametric tests make about the data?' },
    { id: 'dd-mc-13', type: 'multiple-choice', question: 'Which of the following is NOT a characteristic of a normal distribution?', options: [{ id: 'a', text: 'Bell-shaped curve', isCorrect: false, explanation: 'The bell shape is the defining characteristic of normal distributions.' }, { id: 'b', text: 'Mean = Median = Mode', isCorrect: false, explanation: 'Perfect symmetry means all three coincide in a normal distribution.' }, { id: 'c', text: 'Asymmetric tails of different lengths', isCorrect: true, explanation: 'Normal distributions have symmetric tails of equal length. Asymmetric tails indicate skew.' }, { id: 'd', text: 'Approximately 68% of data within 1 SD of the mean', isCorrect: false, explanation: 'The 68-95-99.7 rule is a key property of normal distributions.' }], explanation: 'Normal distributions are perfectly symmetric — both tails are mirror images. Asymmetric tails (one longer than the other) are the defining feature of skewed distributions, not normal ones.', hint: 'Which property does NOT belong to a symmetric distribution?' },
    { id: 'dd-mc-14', type: 'multiple-choice', question: 'A researcher analyzing patient wait times (which are right-skewed) wants to report a "typical" wait time. Which measure should they use?', options: [{ id: 'a', text: 'Mean', isCorrect: false, explanation: 'The mean is pulled toward the few very long waits, overstating the typical experience.' }, { id: 'b', text: 'Median', isCorrect: true, explanation: 'The median is resistant to the long right tail and better represents the "typical" patient experience.' }, { id: 'c', text: 'Maximum', isCorrect: false, explanation: 'The maximum only tells you the worst case, not the typical case.' }, { id: 'd', text: 'Mode', isCorrect: false, explanation: 'Mode is the most common value, but less stable than the median for skewed data.' }], explanation: 'For right-skewed data (like wait times), a few very long waits inflate the mean. The median is not affected by extreme values and better represents what a typical patient experiences.', hint: 'Which measure is resistant to outliers and skew?' },
    { id: 'dd-mc-15', type: 'multiple-choice', question: 'What does "platykurtic" mean in describing a distribution?', options: [{ id: 'a', text: 'Heavy tails and a sharp, tall peak', isCorrect: false, explanation: 'That describes leptokurtic (high kurtosis).' }, { id: 'b', text: 'Flat shape with thin tails and few outliers', isCorrect: true, explanation: 'Platykurtic distributions have negative excess kurtosis — flatter than normal, with thinner tails.' }, { id: 'c', text: 'Two distinct peaks', isCorrect: false, explanation: 'Two peaks = bimodal.' }, { id: 'd', text: 'Identical to a normal distribution', isCorrect: false, explanation: 'Normal distribution has zero excess kurtosis (mesokurtic).' }], explanation: 'Kurtosis describes tail weight and peak height relative to the normal distribution. Platykurtic = flat peak, thin tails, fewer extreme values. Leptokurtic = sharp peak, heavy tails, more extreme values.', hint: 'Platy (flat) + kurtic (peak/tail) → flat distribution.' },
  ],
  keyTakeaway:
    'Always look at the shape of your distribution before choosing a statistical method — the shape tells you a lot about your data. Symmetric → mean/parametric tests. Skewed → median/non-parametric. Bimodal → check for subgroups.',
  visualization: null, // Rendered dynamically
  datasetGenerator: true,
}

export default function DataDistributions({ topicId }) {
  const dataset = useDataset({ distribution: 'normal', n: 50, min: 50, max: 15, decimals: 1 })
  const { data, config, setConfig } = dataset

  const distributionOptions = [
    { value: 'uniform', label: 'Uniform' },
    { value: 'normal', label: 'Approximately Normal' },
    { value: 'positively-skewed', label: 'Positively Skewed' },
    { value: 'negatively-skewed', label: 'Negatively Skewed' },
    { value: 'binomial', label: 'Binomial' },
  ]

  return (
    <TopicPage
      content={{
        ...content,
        visualization: (
          <div className="space-y-6">
            {/* Dataset Generator with distribution selector */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">🎛️</span> Distribution Explorer
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-textDark mb-2">
                  Select Distribution Shape
                </label>
                <select
                  value={config.distribution}
                  onChange={(e) => setConfig({ distribution: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {distributionOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <DatasetGenerator topicId={topicId} showStats={true} />
            </div>

            {/* Histogram — live distribution */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">📈</span> Histogram Visualization
              </h2>
              <HistogramChart
                data={data}
                bins={10}
                title="Data Distribution"
                showMean={true}
                showMedian={true}
              />
            </div>

            {/* Distribution Shape Reference */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <h2 className="text-lg font-semibold text-textDark mb-4 flex items-center gap-2">
                <span aria-hidden="true">📚</span> Distribution Shape Reference
              </h2>
              {shapeReferenceTable}
            </div>
          </div>
        ),
      }}
      topicId={topicId}
    />
  )
}