import TopicPage from '../../layout/TopicPage'

/**
 * Levels of Measurement — Foundation topic
 * Covers Nominal, Ordinal, Interval, Ratio with comparison table
 * Scenarios: hospital department names, patient satisfaction, temperature in Celsius, salary
 */

// Comparison table for the visualization section
const comparisonTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Level</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Key Property</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Example</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Can Calculate Mean?</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Can Rank?</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Has True Zero?</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-primary">Nominal</td>
          <td className="py-3 px-4 text-textDark">Categories only — names/labels</td>
          <td className="py-3 px-4 text-textDark">Department: Emergency, Cardiology, Pediatrics</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-warning">Ordinal</td>
          <td className="py-3 px-4 text-textDark">Categories with meaningful order</td>
          <td className="py-3 px-4 text-textDark">Satisfaction: 1=Very Dissatisfied … 5=Very Satisfied</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No*</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-info">Interval</td>
          <td className="py-3 px-4 text-textDark">Equal intervals, no true zero</td>
          <td className="py-3 px-4 text-textDark">Body temperature in °C (0°C ≠ no temperature)</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
          <td className="text-center py-3 px-4 text-danger font-bold">No</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-mono font-bold text-success">Ratio</td>
          <td className="py-3 px-4 text-textDark">Equal intervals WITH true zero</td>
          <td className="py-3 px-4 text-textDark">Years of experience, Salary in $ (0 = none)</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
          <td className="text-center py-3 px-4 text-success font-bold">Yes</td>
        </tr>
      </tbody>
    </table>
    <p className="text-xs text-textMuted mt-2 italic">
      * Calculating a mean for ordinal data is debated. The mode or median is safer.
    </p>
  </div>
)

// Hospital dataset table for worked example
const hospitalTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Variable</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Example Values</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Level</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Why</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Department name</td>
          <td className="py-3 px-4 font-mono text-sm">Emergency, Cardiology, Pediatrics</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Nominal</td>
          <td className="py-3 px-4 text-textDark">Categories are just labels with no natural order</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Patient satisfaction rating</td>
          <td className="py-3 px-4 font-mono text-sm">1, 2, 3, 4, 5 (Very Dissatisfied → Very Satisfied)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-warning">Ordinal</td>
          <td className="py-3 px-4 text-textDark">Ordered categories, but gaps between ratings aren't equal</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Body temperature (°C)</td>
          <td className="py-3 px-4 font-mono text-sm">36.5, 37.0, 38.2, 39.1</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-info">Interval</td>
          <td className="py-3 px-4 text-textDark">Equal intervals (1° difference is constant), but 0°C ≠ no heat</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Years of experience</td>
          <td className="py-3 px-4 font-mono text-sm">0, 2, 5, 12, 25</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Ratio</td>
          <td className="py-3 px-4 text-textDark">True zero (0 years = no experience), equal intervals, meaningful ratios</td>
        </tr>
      </tbody>
    </table>
  </div>
)

const content = {
  title: 'Levels of Measurement',
  topicGroup: 'Foundations',
  learningObjective:
    'Understand the four levels of measurement and identify which level each type of data belongs to, so you know which statistical methods are appropriate.',
  explanation:
    'Not all data is the same type. Before you run any analysis, you need to know what kind of data you have — this is called the "level of measurement." There are four levels: Nominal, Ordinal, Interval, and Ratio. The level tells you what you can and cannot do mathematically with the data.',
  analogy:
    'Think of the four levels like a ladder. At the bottom (Nominal), you can only name things — like labeling boxes "Red" and "Blue." Climb up to Ordinal and you can rank things — like finishing 1st, 2nd, 3rd in a race, though the gaps between places aren\'t equal. On the Interval rung you can measure gaps — like temperature in Celsius, where 20° to 30° is the same gap as 30° to 40°, but there\'s no true zero. At the top (Ratio) you have everything: names, order, equal gaps, AND a true zero — like salary, where $0 means earning nothing.',
  formula: null,
  whenToUse: [
    'Every time you collect or receive data — identifying the level of measurement is the first step before choosing any statistical method.',
    'When deciding which summary statistics are valid (mode, median, mean).',
    'When selecting a statistical test — parametric tests require interval/ratio data.',
  ],
  whenNotToUse: [
    'Not applicable — this is a classification step, not a statistical test.',
    'You do not "use" a level of measurement; you identify it.',
  ],
  assumptions: [
    'None — applies to all data types.',
    'The classification depends on the nature of the variable, not the sample size.',
  ],
  workedExample: {
    scenario:
      'A hospital collects data on four variables for a staffing study. Identify the level of measurement for each.',
    dataset: null,
    steps: [
      {
        stepNumber: 1,
        label: 'Department name — "Emergency", "Cardiology", "Pediatrics"',
        expression: 'Categories are labels only. No order, no numeric value.',
        result: 'Nominal',
        explanation: 'Department names are categories with no inherent ranking. You cannot say Cardiology > Emergency.',
      },
      {
        stepNumber: 2,
        label: 'Patient satisfaction — 1=Very Dissatisfied to 5=Very Satisfied',
        expression: 'Categories have a clear order: 1 < 2 < 3 < 4 < 5.',
        result: 'Ordinal',
        explanation: 'The numbers represent rank, but the difference between 1 and 2 may not equal the difference between 4 and 5.',
      },
      {
        stepNumber: 3,
        label: 'Body temperature in Celsius — e.g., 36.5, 37.0, 38.2',
        expression: '37.0 − 36.5 = 0.5 and 38.2 − 37.7 = 0.5 — equal intervals.',
        result: 'Interval',
        explanation: 'Gaps are consistent, but 0°C does not mean "no temperature" — it is an arbitrary reference point (freezing water).',
      },
      {
        stepNumber: 4,
        label: 'Years of experience — 0, 2, 5, 12, 25',
        expression: '12 years ÷ 6 years = 2 → 12 years is twice as much experience as 6 years.',
        result: 'Ratio',
        explanation: 'Zero means "no experience." Ratios are meaningful: 20 years is twice 10 years.',
      },
    ],
    interpretation:
      'Each variable falls into a different level. This determines what analyses are valid: for Department (Nominal) you can only count frequencies; for Satisfaction (Ordinal) you can use median/mode; for Temperature (Interval) you can calculate means and differences; for Experience (Ratio) you can do all of the above plus ratios.',
  },
  interpretation:
    'Knowing the level means knowing your options: you can calculate a mean for ratio data, but calculating a mean for ordinal data (like "average satisfaction level") is debated — you can only safely say which rating is most common (mode). For nominal data, only the mode makes sense. Interval data allows means and standard deviations but not ratios (you cannot say 40°C is "twice as hot" as 20°C). Ratio data supports all operations.',
  commonMistakes: [
    {
      mistake: 'Treating ordinal data as interval (calculating mean satisfaction score and interpreting the gaps as equal)',
      explanation:
        'Ordinal data has order but not equal intervals. A mean of 3.5 on a 1–5 satisfaction scale does not necessarily mean the "average satisfaction" is exactly halfway between "Neutral" and "Satisfied" — that interpretation assumes the gaps between ratings are equal. Use median or mode instead.',
    },
    {
      mistake: 'Confusing interval and ratio — the key difference is whether zero means "none" (ratio) or is just a reference point (interval)',
      explanation:
        'Temperature in Celsius: 0°C is freezing, not "no heat." Temperature in Kelvin: 0K is absolute zero (no thermal energy) — that is ratio. Salary: $0 means no income — ratio. Always check: does zero mean "none of this thing"?',
    },
    {
      mistake: 'Assuming any number is ratio data — employee ID numbers are nominal even though they are numbers',
      explanation:
        'Numbers used as labels (ID numbers, zip codes, phone numbers) are nominal. You cannot add, subtract, or average them meaningfully. The level of measurement is about what the numbers represent, not their format.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'lom-easy-1',
        scenario:
          'A researcher records the blood type of each patient in a clinic: A, B, AB, or O.',
        question: 'What level of measurement is blood type?',
        hint: 'Can you order blood types from "lowest" to "highest"?',
        solution:
          'Blood type is nominal. The categories (A, B, AB, O) are labels with no natural order. You cannot say type A is "greater than" type B.',
      },
      {
        id: 'lom-easy-2',
        scenario:
          'A hospital tracks the primary language spoken by each patient: English, Spanish, Mandarin, Other.',
        question: 'What level of measurement is primary language?',
        hint: 'Is there any meaningful ranking among languages?',
        solution:
          'Primary language is nominal. Languages are categories without any inherent order.',
      },
    ],
    moderate: [
      {
        id: 'lom-mod-1',
        scenario:
          'A hospital rates its departments as "Below Standard", "Meets Standard", or "Exceeds Standard". A manager wants to calculate the mean rating across departments.',
        question: 'Is calculating a mean appropriate here? Why or why not?',
        hint: 'Are the gaps between "Below", "Meets", and "Exceeds" guaranteed to be equal?',
        solution:
          'No, calculating a mean is not appropriate. This is ordinal data — the categories have order, but the distance between "Below" and "Meets" is not necessarily the same as between "Meets" and "Exceeds." The median or mode is more appropriate.',
      },
      {
        id: 'lom-mod-2',
        scenario:
          'A study records the calendar year of each patient\'s birth (e.g., 1980, 1995, 2002).',
        question: 'Is this interval or ratio data? Explain.',
        hint: 'Does year 0 mean "no time"?',
        solution:
          'This is interval data. Years have equal intervals (the gap between 1990 and 2000 is the same as 2000 and 2010), but year 0 is an arbitrary reference point, not "no time." You cannot say someone born in 2000 is "twice as born" as someone born in 1000.',
      },
    ],
    challenging: [
      {
        id: 'lom-chal-1',
        scenario:
          'A survey records body temperature in Fahrenheit. A researcher claims this is ratio data because it has numbers and equal intervals.',
        question: 'Is the researcher correct? Explain why or why not.',
        hint: 'What does 0°F represent? Does it mean "no temperature"?',
        solution:
          'No, the researcher is incorrect. Fahrenheit has no true zero — 0°F does not mean "no temperature" (it is the freezing point of a brine solution). You cannot say 60°F is "twice as warm" as 30°F. Fahrenheit is interval data. Only Kelvin (or Rankine) for temperature is ratio.',
      },
      {
        id: 'lom-chal-2',
        scenario:
          'A dataset includes: (1) Employee ID numbers (1001, 1002, 1003...), (2) Number of dependents (0, 1, 2, 3...), (3) Performance tier (Tier 1, Tier 2, Tier 3), (4) Distance from home to work in miles.',
        question: 'Classify each variable as Nominal, Ordinal, Interval, or Ratio.',
        hint: 'Ask for each: Is there order? Are gaps equal? Is there a true zero?',
        solution:
          '(1) Employee ID → Nominal (numbers used as labels). (2) Number of dependents → Ratio (true zero = no dependents; 4 dependents is twice 2). (3) Performance tier → Ordinal (ordered categories, unequal gaps). (4) Distance in miles → Ratio (true zero = no distance; 20 miles is twice 10 miles).',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'lom-kc-1',
      type: 'multiple-choice',
      question: 'A hospital records whether each patient is "Insured" or "Uninsured." This is:',
      options: [
        { id: 'a', text: 'Nominal', isCorrect: true, explanation: 'Labels with no natural order = Nominal' },
        { id: 'b', text: 'Ordinal', isCorrect: false, explanation: 'Ordinal requires a meaningful ranking; Insured/Uninsured has no ranking' },
        { id: 'c', text: 'Interval', isCorrect: false, explanation: 'Interval requires numeric measurement with equal gaps' },
        { id: 'd', text: 'Ratio', isCorrect: false, explanation: 'Ratio requires a true zero point' },
      ],
      explanation:
        'Insured/Uninsured are two categories with no inherent order. This is the definition of nominal data.',
      hint: 'Can you rank "Insured" above "Uninsured" in a meaningful way?',
    },
    {
      id: 'lom-kc-2',
      type: 'multiple-choice',
      question: 'Which level of measurement allows meaningful subtraction (e.g., the difference between two values means something)?',
      options: [
        { id: 'a', text: 'Nominal', isCorrect: false, explanation: 'Nominal categories cannot be subtracted' },
        { id: 'b', text: 'Ordinal', isCorrect: false, explanation: 'Ordinal ranks have unequal gaps, so differences are not reliable' },
        { id: 'c', text: 'Interval and above', isCorrect: true, explanation: 'Interval and ratio both have equal gaps, so differences are meaningful' },
        { id: 'd', text: 'Ratio only', isCorrect: false, explanation: 'Interval also supports meaningful differences' },
      ],
      explanation:
        'Both interval and ratio data have equal intervals between values, so the difference (subtraction) between two values is meaningful. Nominal and ordinal do not.',
      hint: 'Think about temperature in Celsius — is the difference between 20°C and 30°C meaningful?',
    },
    {
      id: 'lom-kc-3',
      type: 'multiple-choice',
      question: 'A nurse records patient pain on a scale of 0–10 (0 = no pain, 10 = worst imaginable pain). What level of measurement is this?',
      options: [
        { id: 'a', text: 'Nominal', isCorrect: false, explanation: 'The numbers have order and meaning beyond labels' },
        { id: 'b', text: 'Ordinal', isCorrect: true, explanation: 'Pain scales are ordered categories; the gap between 2 and 3 may not equal the gap between 8 and 9' },
        { id: 'c', text: 'Interval', isCorrect: false, explanation: 'We cannot assume equal intervals between pain scale points' },
        { id: 'd', text: 'Ratio', isCorrect: false, explanation: 'While 0 means "no pain," the intervals are not guaranteed equal' },
      ],
      explanation:
        'Pain scales are classic ordinal data. The numbers represent ordered categories, but the psychological distance between scale points is not necessarily equal.',
      hint: 'Is the difference between pain level 2 and 3 the same as between 8 and 9?',
    },
    {
      id: 'lom-kc-4',
      type: 'multiple-choice',
      question: 'Which of the following variables is RATIO level?',
      options: [
        { id: 'a', text: 'Temperature in Celsius', isCorrect: false, explanation: 'Celsius has no true zero (0°C ≠ no heat)' },
        { id: 'b', text: 'Year of birth', isCorrect: false, explanation: 'Year 0 is arbitrary, not "no time"' },
        { id: 'c', text: 'Salary in dollars', isCorrect: true, explanation: '$0 means no income; $60k is twice $30k' },
        { id: 'd', text: 'Education level (High School, Bachelor\'s, Master\'s, PhD)', isCorrect: false, explanation: 'This is ordinal — ordered categories with unequal gaps' },
      ],
      explanation:
        'Salary in dollars has a true zero ($0 = no income) and meaningful ratios ($60,000 is twice $30,000). This makes it ratio data.',
      hint: 'Which variable has a true zero where "zero means none" and ratios make sense?',
    },
    {
      id: 'lom-kc-5',
      type: 'multiple-choice',
      question: 'You have ordinal data (e.g., satisfaction ratings 1–5). Which measure of center is MOST appropriate?',
      options: [
        { id: 'a', text: 'Mean', isCorrect: false, explanation: 'Mean assumes equal intervals, which ordinal data does not guarantee' },
        { id: 'b', text: 'Median', isCorrect: true, explanation: 'Median only requires order, making it appropriate for ordinal data' },
        { id: 'c', text: 'Standard deviation', isCorrect: false, explanation: 'SD requires interval/ratio data' },
        { id: 'd', text: 'Variance', isCorrect: false, explanation: 'Variance requires interval/ratio data' },
      ],
      explanation:
        'The median is the most appropriate measure of center for ordinal data because it only requires that values can be ordered. The mean assumes equal intervals.',
      hint: 'Which measure only needs to know the middle position after sorting?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'lom-tf-1', type: 'true-false', question: 'Nominal data can be ranked from lowest to highest.', isTrue: false, explanation: 'Nominal data consists of categories (names/labels) with no natural order. Ranking is only possible with ordinal, interval, or ratio data.' },
    { id: 'lom-tf-2', type: 'true-false', question: 'The mean is a valid summary statistic for ordinal data.', isTrue: false, explanation: 'The mean requires equal intervals between values. Ordinal data only guarantees order, not equal gaps, so the mean is not appropriate. Use the median instead.' },
    { id: 'lom-tf-3', type: 'true-false', question: 'Temperature measured in Kelvin is ratio-level data.', isTrue: true, explanation: 'Kelvin has a true zero (absolute zero = 0 K means no molecular motion), so ratios are meaningful (200 K is twice as hot as 100 K). This makes it ratio-level.' },
    { id: 'lom-tf-4', type: 'true-false', question: 'Temperature measured in Celsius is ratio-level data.', isTrue: false, explanation: '0°C does not mean "no heat" — it is just the freezing point of water. Without a true zero, ratios are meaningless (30°C is NOT twice as hot as 15°C). Celsius is interval-level.' },
    { id: 'lom-tf-5', type: 'true-false', question: 'Ordinal data supports both ranking and arithmetic operations like addition.', isTrue: false, explanation: 'Ordinal data only supports ranking (ordering). The gaps between ranks are not guaranteed to be equal, so arithmetic operations like addition or subtraction are not meaningful.' },
    { id: 'lom-tf-6', type: 'true-false', question: 'Blood type (A, B, AB, O) is an example of nominal data.', isTrue: true, explanation: 'Blood types are categories with no natural order or ranking. A is not greater than B. This is classic nominal data.' },
    { id: 'lom-tf-7', type: 'true-false', question: 'Ratio data always has a meaningful zero point that indicates absence.', isTrue: true, explanation: 'The defining feature of ratio data is a true zero. For example, $0 means no money, 0 kg means no weight, 0 patients means no patients.' },
    { id: 'lom-tf-8', type: 'true-false', question: 'You can compute a meaningful mode for nominal data.', isTrue: true, explanation: 'Mode (the most frequent category) is perfectly valid for nominal data. For example, the most common blood type or the most common department in a hospital.' },
    { id: 'lom-tf-9', type: 'true-false', question: 'Likert scale ratings (Strongly Disagree to Strongly Agree) are ratio-level data.', isTrue: false, explanation: 'Likert scales are ordinal. While they have order, the distance between "Disagree" and "Neutral" is not guaranteed to equal the distance between "Neutral" and "Agree".' },
    { id: 'lom-tf-10', type: 'true-false', question: 'Interval data lacks a true zero, meaning zero does not indicate the absence of the measured quantity.', isTrue: true, explanation: 'This is the key distinction between interval and ratio. For interval data (like Celsius or calendar years), zero is an arbitrary reference point, not a true absence.' },
    { id: 'lom-tf-11', type: 'true-false', question: 'The number of defects on a manufactured part is ratio-level data.', isTrue: true, explanation: 'A count of defects has a true zero (0 defects = no defects), and ratios are meaningful (4 defects is twice as many as 2 defects). This is ratio data.' },
    { id: 'lom-tf-12', type: 'true-false', question: 'You can meaningfully say "20°C is twice as warm as 10°C."', isTrue: false, explanation: 'Celsius is interval-level; it lacks a true zero. Ratios are not meaningful. In Kelvin, 293 K vs 283 K — 20°C is NOT twice as warm as 10°C. Only ratio-level data supports such comparisons.' },
    { id: 'lom-tf-13', type: 'true-false', question: 'A variable with only two categories and no natural order (e.g., Yes/No) is nominal.', isTrue: true, explanation: 'A binary (dichotomous) variable whose two categories have no natural order is nominal. Note that if there is an inherent order (e.g., Pass/Fail implies one is better), it can be treated as ordinal.' },
    { id: 'lom-tf-14', type: 'true-false', question: 'The median is an appropriate measure of center for interval-level data.', isTrue: true, explanation: 'The median requires only that values can be ordered, which interval data satisfies. The median is valid for ordinal, interval, and ratio data.' },
    { id: 'lom-tf-15', type: 'true-false', question: 'Interval data supports addition and subtraction but NOT multiplication and division of the raw values.', isTrue: true, explanation: 'Because interval data lacks a true zero, ratios (multiplication/division) are not meaningful. You can say 30°C - 20°C = 10°C (meaningful difference), but not that 30°C is 1.5× hotter than 20°C.' },
    { id: 'lom-tf-16', type: 'true-false', question: 'Nominal data is a type of categorical data.', isTrue: true, explanation: '"Categorical" is the broader term (it also includes ordinal data); nominal is the type of categorical data sorted into named categories (labels) with no numerical meaning or order.' },
    { id: 'lom-tf-17', type: 'true-false', question: 'The IQ score scale is an example of ratio-level measurement.', isTrue: false, explanation: 'IQ scores are interval-level. An IQ of 0 does not mean "zero intelligence" — it is not a true zero. Ratios are not meaningful (IQ 140 ≠ twice as intelligent as IQ 70).' },
    { id: 'lom-tf-18', type: 'true-false', question: 'For ratio data, the coefficient of variation (CV = SD/mean) is a meaningful statistic.', isTrue: true, explanation: 'CV expresses variability as a proportion of the mean. Because ratio data has a meaningful zero and ratio comparisons are valid, CV is an appropriate and interpretable statistic.' },
    { id: 'lom-tf-19', type: 'true-false', question: 'Ordinal data tells you the order of values but not the exact difference between them.', isTrue: true, explanation: 'This is the defining property of ordinal data. You know 1st place beat 2nd place, but not by how much. The gaps between ranks are unquantified.' },
    { id: 'lom-tf-20', type: 'true-false', question: 'All ratio-level variables can also be treated as interval-level variables.', isTrue: true, explanation: 'Levels of measurement are hierarchical. Ratio data satisfies all properties of interval data (plus it has a true zero). So any analysis valid for interval data is also valid for ratio data.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'lom-mc-6', type: 'multiple-choice', question: 'A researcher codes marital status as: 1=Single, 2=Married, 3=Divorced. The numbers are:', options: [{ id: 'a', text: 'Ratio — they have a true zero', isCorrect: false, explanation: '1, 2, 3 here are just labels; there is no true zero for marital status.' }, { id: 'b', text: 'Interval — equal spacing', isCorrect: false, explanation: 'The spacing between categories is not equal or meaningful.' }, { id: 'c', text: 'Nominal — the numbers are arbitrary codes', isCorrect: true, explanation: 'The numbers are just labels for categories. You could reorder them without changing meaning.' }, { id: 'd', text: 'Ordinal — they can be ranked', isCorrect: false, explanation: 'Married is not inherently "more" than Single in a ranking sense.' }], explanation: 'Assigning numbers to nominal categories does not make the data numeric. The codes are arbitrary — swapping 1 and 3 would not change the data\'s meaning.', hint: 'Ask: would re-ordering the numbers change the meaning?' },
    { id: 'lom-mc-7', type: 'multiple-choice', question: 'Which pair represents BOTH interval-level variables?', options: [{ id: 'a', text: 'Salary and weight', isCorrect: false, explanation: 'Both salary and weight are ratio-level (true zero exists).' }, { id: 'b', text: 'Temperature in Celsius and year (e.g., 1990, 2000)', isCorrect: true, explanation: 'Neither 0°C nor year 0 is a true absence — both are arbitrary reference points, making them interval.' }, { id: 'c', text: 'Height and blood pressure', isCorrect: false, explanation: 'Both height and blood pressure are ratio-level.' }, { id: 'd', text: 'Pain scale (0–10) and exam grade (A, B, C)', isCorrect: false, explanation: 'Pain scale is ordinal; exam grades are ordinal.' }], explanation: 'Interval data has equal gaps but no true zero. Celsius and calendar years both fit: 0°C ≠ no heat, year 0 ≠ no time.', hint: 'Which variables have meaningful differences but no true zero?' },
    { id: 'lom-mc-8', type: 'multiple-choice', question: 'A survey asks: "How satisfied are you? (1=Very Dissatisfied … 5=Very Satisfied)." A manager averages the ratings and reports "3.8." This is:', options: [{ id: 'a', text: 'Perfectly valid — rating scales are ratio data', isCorrect: false, explanation: 'Rating scales are ordinal, not ratio.' }, { id: 'b', text: 'Statistically questionable — the mean assumes equal intervals which ordinal data lacks', isCorrect: true, explanation: 'Averaging ordinal data is not strictly justified (it is debated) but is very common in practice.' }, { id: 'c', text: 'Invalid because the mode should be used', isCorrect: false, explanation: 'While mode is technically appropriate for ordinal, the main issue is the mean assumption.' }, { id: 'd', text: 'Valid only if n > 30', isCorrect: false, explanation: 'Sample size does not change the level of measurement.' }], explanation: 'Ordinal data lacks equal intervals. Averaging (3 + 5) / 2 = 4 assumes the gap between 3 and 4 equals the gap between 4 and 5, which may not be true. In practice, researchers often average Likert scales while acknowledging this limitation.', hint: 'What does computing a mean assume about the gaps between values?' },
    { id: 'lom-mc-9', type: 'multiple-choice', question: 'Which level of measurement is HIGHEST (most informative)?', options: [{ id: 'a', text: 'Nominal', isCorrect: false, explanation: 'Nominal is the lowest level — only category names.' }, { id: 'b', text: 'Ordinal', isCorrect: false, explanation: 'Ordinal adds ranking but still lacks equal intervals.' }, { id: 'c', text: 'Interval', isCorrect: false, explanation: 'Interval adds equal gaps but lacks a true zero.' }, { id: 'd', text: 'Ratio', isCorrect: true, explanation: 'Ratio has all properties: categories, order, equal intervals, and a true zero.' }], explanation: 'The levels are hierarchical: Nominal → Ordinal → Interval → Ratio. Each higher level has all properties of the level below it, plus one more.', hint: 'Which level has ALL four properties: categories, rank, equal gaps, true zero?' },
    { id: 'lom-mc-10', type: 'multiple-choice', question: 'A hospital records the number of patients admitted each day. This is:', options: [{ id: 'a', text: 'Nominal', isCorrect: false, explanation: 'Patient counts are numeric measurements, not category labels.' }, { id: 'b', text: 'Ordinal', isCorrect: false, explanation: 'While patient counts can be ordered, the key is that differences are equal and there is a true zero.' }, { id: 'c', text: 'Interval', isCorrect: false, explanation: 'Patient counts have a true zero (0 patients = no admissions), so they are ratio, not interval.' }, { id: 'd', text: 'Ratio', isCorrect: true, explanation: '0 admissions means no admissions (true zero). 40 admissions is twice 20 admissions — ratios are meaningful.' }], explanation: 'Count data (number of patients, defects, events) is almost always ratio-level. Zero is meaningful, and ratios make sense.', hint: 'Does zero admissions mean "no admissions"? Are ratios meaningful?' },
    { id: 'lom-mc-11', type: 'multiple-choice', question: 'Which statistic CANNOT be legitimately computed for nominal data?', options: [{ id: 'a', text: 'Mode', isCorrect: false, explanation: 'Mode (most frequent category) is valid for nominal data.' }, { id: 'b', text: 'Frequency count', isCorrect: false, explanation: 'Counting how often each category appears is perfectly valid.' }, { id: 'c', text: 'Median', isCorrect: true, explanation: 'Median requires ordering. Nominal categories have no order, so finding the "middle" category is meaningless.' }, { id: 'd', text: 'Relative frequency', isCorrect: false, explanation: 'Relative frequency (proportion per category) is valid for nominal data.' }], explanation: 'Median requires that values can be sorted — you need to find the middle position. Nominal categories have no meaningful order, so sorting them is arbitrary and the median is undefined.', hint: 'Which statistic requires you to sort the data?' },
    { id: 'lom-mc-12', type: 'multiple-choice', question: 'A study measures BMI (Body Mass Index), which is weight(kg) / height(m)². What level of measurement is BMI?', options: [{ id: 'a', text: 'Nominal', isCorrect: false, explanation: 'BMI is a continuous numeric measure, not a category.' }, { id: 'b', text: 'Ordinal', isCorrect: false, explanation: 'BMI values have equal-interval numeric meaning, beyond mere ordering.' }, { id: 'c', text: 'Interval', isCorrect: false, explanation: 'BMI of 0 would mean zero weight (impossible, but the zero is meaningful).' }, { id: 'd', text: 'Ratio', isCorrect: true, explanation: 'BMI is a continuous ratio with a meaningful zero. A BMI of 30 is 1.5× a BMI of 20.' }], explanation: 'BMI is computed from ratio-level measurements (kg and m), and the result has all ratio properties: equal intervals, meaningful zero, meaningful ratios.', hint: 'Is the zero meaningful? Are ratios (e.g., "twice the BMI") interpretable?' },
    { id: 'lom-mc-13', type: 'multiple-choice', question: 'Which transformation is valid for nominal data but NOT meaningful for interval data?', options: [{ id: 'a', text: 'Multiplying all values by 2', isCorrect: false, explanation: 'Multiplying is arithmetic — applicable only to numeric data with interval/ratio properties.' }, { id: 'b', text: 'Relabeling categories (e.g., renaming "Red" → "Crimson")', isCorrect: true, explanation: 'Nominal data can be relabeled freely without losing information, since the labels are just names.' }, { id: 'c', text: 'Adding 10 to all values', isCorrect: false, explanation: 'Addition makes sense for numeric data, not nominal categories.' }, { id: 'd', text: 'Computing z-scores', isCorrect: false, explanation: 'Z-scores require at minimum interval-level data.' }], explanation: 'Nominal data is purely categorical. Any permutation of the labels is valid (they are arbitrary). Interval data is numeric and ordered — you cannot arbitrarily relabel 10°C as 20°C.', hint: 'What can you do with categories that you cannot do with ordered numeric data?' },
    { id: 'lom-mc-14', type: 'multiple-choice', question: 'Hospital patient IDs (e.g., P0001, P0002) are assigned sequentially. What level of measurement are these IDs?', options: [{ id: 'a', text: 'Ratio — they have meaningful numeric order', isCorrect: false, explanation: 'P0002 is not "more patient" than P0001; the number is arbitrary.' }, { id: 'b', text: 'Ordinal — they are ordered', isCorrect: false, explanation: 'The sequential order has no real-world meaning; it is just an assignment.' }, { id: 'c', text: 'Nominal — they are unique identifiers (labels)', isCorrect: true, explanation: 'Patient IDs are names/labels even though they look like numbers. No arithmetic is meaningful.' }, { id: 'd', text: 'Interval — equal spacing between IDs', isCorrect: false, explanation: 'Equal numeric spacing of IDs does not make them interval-level measurements.' }], explanation: 'Identifiers (ID numbers, zip codes, phone numbers) are nominal even when they look numeric. The key question: does the number represent a measurement or just a label?', hint: 'Does it make sense to compute the "average patient ID"?' },
    { id: 'lom-mc-15', type: 'multiple-choice', question: 'A chi-square test of independence is most appropriate for which level of measurement?', options: [{ id: 'a', text: 'Ratio', isCorrect: false, explanation: 'Ratio data is better analyzed with means, t-tests, ANOVA, or regression.' }, { id: 'b', text: 'Interval', isCorrect: false, explanation: 'Interval data also fits t-tests and correlation.' }, { id: 'c', text: 'Nominal (categorical)', isCorrect: true, explanation: 'Chi-square tests compare observed vs. expected frequencies across categories — perfect for nominal (and ordinal) data.' }, { id: 'd', text: 'Ordinal only', isCorrect: false, explanation: 'Chi-square works for both nominal and ordinal categorical data.' }], explanation: 'Chi-square tests work with counts/frequencies across categories. They are the standard test for nominal (and sometimes ordinal) categorical data to assess relationships between variables.', hint: 'Which test is designed for frequency counts in categories?' },
  ],
  keyTakeaway:
    'The level of measurement determines which statistics are valid — always identify it before analyzing your data.',
  visualization: comparisonTable,
  datasetGenerator: false,
}

export default function LevelsOfMeasurement({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}