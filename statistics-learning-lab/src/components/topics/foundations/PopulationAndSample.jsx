import TopicPage from '../../layout/TopicPage'

/**
 * Population and Sample — Foundation topic
 * Hospital staffing scenario: all 500 nurses (population) vs 50 randomly selected (sample)
 */

// Symbol comparison table for formula section
const symbolTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Concept</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Population Symbol</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Sample Symbol</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Size (number of observations)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">N</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">n</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Mean</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">μ (mu)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">x̄ (x-bar)</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Standard Deviation</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">σ (sigma)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">s</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Variance</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">σ²</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">s²</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Proportion</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">p (or π)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">p̂ (p-hat)</td>
        </tr>
      </tbody>
    </table>
  </div>
)

// Worked example data table
const workedExampleTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Concept</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">In This Example</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Population</td>
          <td className="py-3 px-4 text-textDark">All 500 nurses employed by the hospital system</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Sample</td>
          <td className="py-3 px-4 text-textDark">50 nurses randomly selected from the 500</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Population size (N)</td>
          <td className="py-3 px-4 font-mono font-bold">500</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Sample size (n)</td>
          <td className="py-3 px-4 font-mono font-bold">50</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Sample mean (x̄)</td>
          <td className="py-3 px-4 font-mono font-bold">7.2 / 10</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Estimated population mean (μ)</td>
          <td className="py-3 px-4 font-mono font-bold">≈ 7.2 / 10</td>
        </tr>
      </tbody>
    </table>
  </div>
)

const content = {
  title: 'Population and Sample',
  topicGroup: 'Foundations',
  learningObjective:
    'Distinguish between a population and a sample, and understand why samples are used in research.',
  explanation:
    'A population is every single person or thing you want to study. A sample is a smaller group selected from the population. Because it is usually impossible (or too costly) to collect data from every member of a population, researchers use samples and then draw conclusions about the whole population.',
  analogy:
    'Imagine you want to know how a pot of soup tastes. You don\'t drink the whole pot — you take a spoonful (the sample) and use it to judge the entire pot (the population). As long as the spoon is a fair sample of the soup (well-stirred), your judgment is reliable.',
  formula: {
    comparison: true,
    pairs: [
      {
        left:  { label: 'Sample Mean',                latex: '\\bar{x} = \\frac{\\sum x}{n}',                       note: 'x̄ (x-bar) — estimated from your data' },
        right: { label: 'Population Mean',            latex: '\\mu = \\frac{\\sum x}{N}',                           note: 'μ (mu) — the true average (usually unknown)' },
      },
      {
        left:  { label: 'Sample Standard Deviation',  latex: 's = \\sqrt{\\frac{\\sum (x - \\bar{x})^{2}}{n - 1}}', note: 's — uses n−1 (Bessel\'s correction)' },
        right: { label: 'Population Std Deviation',   latex: '\\sigma = \\sqrt{\\frac{\\sum (x - \\mu)^{2}}{N}}',   note: 'σ (sigma) — uses N (all members known)' },
      },
    ],
    symbols: [
      { symbol: 'N', name: 'Population size', description: 'Total number of units in the population' },
      { symbol: 'n', name: 'Sample size', description: 'Number of units in the sample' },
      { symbol: 'μ (mu)', name: 'Population mean', description: 'True average of the entire population' },
      { symbol: 'x̄ (x-bar)', name: 'Sample mean', description: 'Average of the observed sample data' },
      { symbol: 'σ (sigma)', name: 'Population standard deviation', description: 'True spread of the population' },
      { symbol: 's', name: 'Sample standard deviation', description: 'Estimated spread from the sample' },
      { symbol: 'p', name: 'Population proportion', description: 'True proportion in the population' },
      { symbol: 'p̂ (p-hat)', name: 'Sample proportion', description: 'Observed proportion in the sample' },
    ],
    notes:
      'N and the Greek letters (μ, σ) refer to the population — the "truth" we want to know. Lowercase Latin letters and bars (n, x̄, s) refer to the sample — what we actually observe. The sample statistics are our best estimates of the population parameters.',
  },
  whenToUse: [
    'Any time you are deciding what group you want to draw conclusions about (the population) and what data you actually have (the sample).',
    'Before designing a study — define your population first, then determine how to sample from it.',
    'When interpreting results — always clarify whether a number is a sample statistic or a population parameter.',
  ],
  whenNotToUse: [
    'Not applicable — this is a framing concept used in every analysis.',
    'If you have data from every member of the population (a census), you do not need sampling inference, but the distinction still matters for notation.',
  ],
  assumptions: [
    'A sample should ideally be randomly selected to represent the population fairly.',
    'The sample should be independent — selecting one unit does not affect the probability of selecting another.',
    'The population is well-defined — you must know exactly who/what counts as a member.',
  ],
  workedExample: {
    scenario:
      'A hospital system employs 500 nurses. Leadership wants to understand average job satisfaction but surveying all 500 is too time-consuming. They randomly select 50 nurses and ask each to rate satisfaction on a 1–10 scale.',
    dataset: null,
    steps: [
      {
        stepNumber: 1,
        label: 'Define the population',
        expression: 'All 500 nurses in the hospital system',
        result: 'N = 500',
        explanation: 'The population is defined by the research question: "How satisfied are nurses in THIS hospital system?"',
      },
      {
        stepNumber: 2,
        label: 'Select a sample',
        expression: 'Randomly choose 50 nurses from the 500',
        result: 'n = 50',
        explanation: 'Random selection gives each nurse an equal chance, reducing bias.',
      },
      {
        stepNumber: 3,
        label: 'Collect data from the sample',
        expression: '50 satisfaction scores collected, e.g., [7, 8, 6, 9, 7, 8, 5, 7, 8, 6, ...]',
        result: 'x̄ = 7.2',
        explanation: 'The sample mean is calculated from the 50 observed values.',
      },
      {
        stepNumber: 4,
        label: 'Estimate the population parameter',
        expression: 'μ ≈ x̄ = 7.2',
        result: 'μ ≈ 7.2',
        explanation: 'We use the sample mean (7.2) as our best estimate of the true population mean (μ). We cannot know μ exactly without a census.',
      },
    ],
    interpretation:
      'The sample of 50 nurses gives us a practical way to estimate the satisfaction of all 500 nurses. Because the sample was randomly selected, we can be reasonably confident that 7.2 is close to the true average. The accuracy of this estimate depends on sample size and sampling method — topics covered in later modules.',
  },
  interpretation:
    'The population is the "target" — the group you want to learn about. The sample is the "data you have." Statistics uses sample data (x̄, s, p̂) to make inferences about population parameters (μ, σ, p). The quality of your inference depends entirely on how well the sample represents the population. Random sampling is the gold standard because it prevents systematic bias.',
  commonMistakes: [
    {
      mistake: 'Confusing population with the whole world — the population is defined by the research question, not by geography',
      explanation:
        'If you study "nurses at City General Hospital," the population is those nurses — not all nurses in the city, state, or country. The population is whatever group your research question is about.',
    },
    {
      mistake: 'Using capital N formulas (population) when you have sample data — this underestimates variability',
      explanation:
        'The sample variance formula divides by (n - 1) instead of n. This correction (Bessel\'s correction) makes the sample variance an unbiased estimator of the population variance. Using N when you have a sample makes your variance estimate too small.',
    },
    {
      mistake: 'Assuming a bigger sample is always better — a well-chosen small sample beats a biased large sample',
      explanation:
        'A sample of 1,000 volunteers who love their jobs tells you nothing about the nurses who hate their jobs. A random sample of 50 is far more valuable than a biased sample of 500. Representativeness matters more than size.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'ps-easy-1',
        scenario:
          'A pharmaceutical company wants to test a new drug on adults with high blood pressure. They recruit 200 participants from a local clinic.',
        question: 'What is the population? What is the sample?',
        hint: 'The population is the group the company wants to draw conclusions about. The sample is who they actually measure.',
        solution:
          'Population: All adults with high blood pressure (the target group for the drug). Sample: The 200 participants recruited from the clinic.',
      },
      {
        id: 'ps-easy-2',
        scenario:
          'A university surveys 300 of its 15,000 students about campus dining satisfaction.',
        question: 'Identify N and n. What symbols represent the sample mean and population mean?',
        hint: 'N = population size, n = sample size. Greek letters = population parameters, Latin letters/bars = sample statistics.',
        solution:
          'N = 15,000 (all students). n = 300 (surveyed students). Sample mean = x̄. Population mean = μ.',
      },
    ],
    moderate: [
      {
        id: 'ps-mod-1',
        scenario:
          'A researcher wants to estimate the average height of adult oak trees in a 500-acre forest. She measures 50 trees near the parking lot because they are easy to access.',
        question: 'Is this a good sample? Why or why not? What bias might this introduce?',
        hint: 'Think about whether trees near the parking lot are representative of all trees in the forest.',
        solution:
          'This is a convenience sample, not a random sample. Trees near the parking lot may get more sunlight, water, or foot traffic, making them systematically different from trees deep in the forest. This introduces selection bias — the sample mean will not be a good estimate of the population mean.',
      },
      {
        id: 'ps-mod-2',
        scenario:
          'A hospital surveys 100 patients about wait times. The survey is only given to patients who complete their visit (patients who leave without being seen are not surveyed).',
        question: 'What is the population of interest? What is the actual sampled population? What problem does this create?',
        hint: 'Who is missing from the sample? How might their wait times differ?',
        solution:
          'Population of interest: All patients who seek care. Actual sampled population: Only patients who stayed. This is a selection (survivorship-type) bias — patients with the longest waits (who left) are excluded, so the sample likely underestimates the true average wait time.',
      },
    ],
    challenging: [
      {
        id: 'ps-chal-1',
        scenario:
          'A political poll uses random digit dialing to call 1,000 landline numbers and asks about voting preference. In 2024, 70% of adults use only cell phones.',
        question: 'What type of bias does this introduce? How does it affect the estimate of the population proportion supporting each candidate?',
        hint: 'Who is excluded from the sampling frame? Do landline-only households differ politically from cell-phone-only households?',
        solution:
          'This is coverage bias (a type of selection bias). The sampling frame (landlines) does not cover the full population (all adults). If cell-phone-only adults have different voting preferences, the poll will systematically misestimate the true population proportions. The sample statistic p̂ will be a biased estimator of the population parameter p.',
      },
      {
        id: 'ps-chal-2',
        scenario:
          'A quality control engineer tests 10 light bulbs from a production run of 10,000. All 10 pass. The engineer concludes the defect rate is 0%.',
        question: 'Is this conclusion justified? What is the difference between the sample proportion and the population proportion?',
        hint: 'With n=10, what is the margin of error? Can a sample of 10 rule out a 1% defect rate?',
        solution:
          'No, the conclusion is not justified. The sample proportion p̂ = 0/10 = 0%, but the population proportion p could still be > 0%. With n=10, a 1% defect rate would produce 0 defects in a sample of 10 about 90% of the time. The sample is too small to estimate a rare event rate precisely. This illustrates that p̂ ≠ p — the sample statistic is an estimate with uncertainty.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ps-kc-1',
      type: 'multiple-choice',
      question: 'A researcher studies the average commute time of employees at a specific company. The company has 2,000 employees. The researcher surveys 200 randomly selected employees. What is the population?',
      options: [
        { id: 'a', text: 'All 2,000 employees at the company', isCorrect: true, explanation: 'The population is the full group the research question is about' },
        { id: 'b', text: 'The 200 surveyed employees', isCorrect: false, explanation: 'The 200 employees are the sample, not the population' },
        { id: 'c', text: 'All workers in the city', isCorrect: false, explanation: 'The population is defined by the research question, not geography' },
        { id: 'd', text: 'All commuters in the country', isCorrect: false, explanation: 'The population is specific to this company\'s employees' },
      ],
      explanation:
        'The population is defined by the research question: "employees at this company." There are 2,000 such employees. The 200 surveyed are the sample.',
      hint: 'The population is the group you want to draw conclusions about.',
    },
    {
      id: 'ps-kc-2',
      type: 'multiple-choice',
      question: 'Which symbol represents the sample standard deviation?',
      options: [
        { id: 'a', text: 'σ (sigma)', isCorrect: false, explanation: 'σ is the population standard deviation' },
        { id: 'b', text: 's', isCorrect: true, explanation: 's (lowercase) is the sample standard deviation' },
        { id: 'c', text: 'S', isCorrect: false, explanation: 'Uppercase S is not the standard notation' },
        { id: 'd', text: 'σ̂ (sigma-hat)', isCorrect: false, explanation: 'Sigma-hat is sometimes used but s is the standard symbol' },
      ],
      explanation:
        'By convention, Greek letters (σ, μ) denote population parameters, while Latin letters (s, x̄) denote sample statistics.',
      hint: 'Population parameters use Greek letters; sample statistics use Latin letters.',
    },
    {
      id: 'ps-kc-3',
      type: 'multiple-choice',
      question: 'Why does the sample variance formula divide by (n - 1) instead of n?',
      options: [
        { id: 'a', text: 'To make the calculation easier', isCorrect: false, explanation: 'It actually makes it slightly more complex' },
        { id: 'b', text: 'To make the sample variance an unbiased estimator of the population variance', isCorrect: true, explanation: 'This is Bessel\'s correction — it corrects the downward bias' },
        { id: 'c', text: 'Because the sample is smaller than the population', isCorrect: false, explanation: 'The reason is statistical, not just about size' },
        { id: 'd', text: 'It is a historical convention with no mathematical basis', isCorrect: false, explanation: 'There is a rigorous mathematical reason (degrees of freedom)' },
      ],
      explanation:
        'Dividing by n underestimates the population variance because the sample mean x̄ is itself estimated from the data, using up one "degree of freedom." Dividing by (n - 1) corrects this bias.',
      hint: 'Think about degrees of freedom — the sample mean is calculated from the same data.',
    },
    {
      id: 'ps-kc-4',
      type: 'multiple-choice',
      question: 'A study reports: "The average height of the 50 students in our sample was 170 cm." Which notation is correct for this value?',
      options: [
        { id: 'a', text: 'μ = 170 cm', isCorrect: false, explanation: 'μ is the population mean, not the sample mean' },
        { id: 'b', text: 'x̄ = 170 cm', isCorrect: true, explanation: 'x̄ (x-bar) is the sample mean' },
        { id: 'c', text: 'σ = 170 cm', isCorrect: false, explanation: 'σ is standard deviation, not mean' },
        { id: 'd', text: 'p̂ = 170 cm', isCorrect: false, explanation: 'p̂ is a sample proportion, not a mean' },
      ],
      explanation:
        'The value 170 cm comes from a sample of 50 students, so it is a sample statistic. The symbol for sample mean is x̄ (x-bar).',
      hint: 'Is 170 cm a population parameter or a sample statistic?',
    },
    {
      id: 'ps-kc-5',
      type: 'multiple-choice',
      question: 'Which of the following is the BIGGEST threat to generalizing from a sample to a population?',
      options: [
        { id: 'a', text: 'Small sample size', isCorrect: false, explanation: 'Small samples increase uncertainty but don\'t necessarily cause bias' },
        { id: 'b', text: 'Non-random sampling (selection bias)', isCorrect: true, explanation: 'Selection bias systematically distorts the estimate — it cannot be fixed by increasing sample size' },
        { id: 'c', text: 'Using the wrong formula for variance', isCorrect: false, explanation: 'This affects precision, not validity of the inference' },
        { id: 'd', text: 'Rounding errors in calculation', isCorrect: false, explanation: 'Rounding errors are negligible compared to sampling bias' },
      ],
      explanation:
        'Selection bias means the sample is systematically different from the population. Collecting more data does not fix this, and adjustments after the fact are limited — the inference can be fundamentally flawed. Random sampling is the primary defense.',
      hint: 'Which problem cannot be solved by just collecting more data?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ps-tf-1', type: 'true-false', question: 'A population always refers to a group of people.', isTrue: false, explanation: 'A population is any complete group of interest — it can be people, animals, transactions, measurements, products, or any other units the researcher wants to draw conclusions about.' },
    { id: 'ps-tf-2', type: 'true-false', question: 'A sample statistic (e.g., x̄) is used to estimate a population parameter (e.g., μ).', isTrue: true, explanation: 'This is the core purpose of inferential statistics. We calculate statistics from samples to estimate the unknown parameters of the larger population.' },
    { id: 'ps-tf-3', type: 'true-false', question: 'Greek letters like μ and σ represent sample statistics.', isTrue: false, explanation: 'By convention, Greek letters (μ, σ, ρ) represent population parameters. Latin letters (x̄, s, r) represent sample statistics.' },
    { id: 'ps-tf-4', type: 'true-false', question: 'A census collects data from every member of the population.', isTrue: true, explanation: 'A census (also called a complete enumeration) surveys every single member of the population. Unlike a sample, it leaves no one out.' },
    { id: 'ps-tf-5', type: 'true-false', question: 'A larger sample always produces a more accurate estimate of the population parameter.', isTrue: false, explanation: 'Larger samples reduce random sampling error, but they cannot fix systematic bias (e.g., non-random sampling). A large biased sample is worse than a small random one.' },
    { id: 'ps-tf-6', type: 'true-false', question: 'The sample variance formula uses (n - 1) in the denominator to correct for bias.', isTrue: true, explanation: 'Dividing by (n - 1) instead of n is called Bessel\'s correction. It makes the sample variance an unbiased estimator of the population variance by accounting for degrees of freedom lost when estimating the mean.' },
    { id: 'ps-tf-7', type: 'true-false', question: 'Inferential statistics allow us to make conclusions about a sample based on a population.', isTrue: false, explanation: 'It is the reverse: inferential statistics use data from a SAMPLE to make conclusions (inferences) about the broader POPULATION.' },
    { id: 'ps-tf-8', type: 'true-false', question: 'If you survey every nurse at a hospital (total: 80 nurses), your results are population parameters, not sample statistics.', isTrue: true, explanation: 'If you have data on every member of the defined group (all 80 nurses), you have the full population. The resulting values are parameters (μ, σ), not estimates.' },
    { id: 'ps-tf-9', type: 'true-false', question: 'Sampling error is always due to mistakes made during data collection.', isTrue: false, explanation: 'Sampling error is the natural, expected difference between a sample statistic and the population parameter simply due to chance (random variation). It is not caused by mistakes — it occurs even with perfect methodology.' },
    { id: 'ps-tf-10', type: 'true-false', question: 'A random sample is one where every member of the population has an equal chance of being selected.', isTrue: true, explanation: 'This describes simple random sampling (SRS). Equal probability of selection is the defining property that makes random samples unbiased representatives of the population.' },
    { id: 'ps-tf-11', type: 'true-false', question: 'Population parameters are typically unknown and must be estimated from sample statistics.', isTrue: true, explanation: 'If we could measure every member of the population, we would know the parameter exactly. In practice, populations are usually too large, so we estimate parameters using sample statistics.' },
    { id: 'ps-tf-12', type: 'true-false', question: 'A convenience sample (e.g., surveying only people walking by your office) is a valid way to represent a large population.', isTrue: false, explanation: 'Convenience samples introduce selection bias — the sample is systematically different from the population. Results cannot be reliably generalized.' },
    { id: 'ps-tf-13', type: 'true-false', question: 'The symbol N represents the population size, while n represents the sample size.', isTrue: true, explanation: 'By convention: N (uppercase) = population size; n (lowercase) = sample size. These are among the most fundamental symbols in statistics.' },
    { id: 'ps-tf-14', type: 'true-false', question: 'Descriptive statistics summarize a sample; inferential statistics generalize to the population.', isTrue: true, explanation: 'Descriptive statistics (mean, SD, range) describe what you observed. Inferential statistics (hypothesis tests, confidence intervals) extend those findings to the broader population.' },
    { id: 'ps-tf-15', type: 'true-false', question: 'A sample proportion p̂ estimates the population proportion π (or p).', isTrue: true, explanation: 'When counting proportions (e.g., % who voted yes), p̂ (p-hat) is the sample proportion and π or p is the population proportion parameter.' },
    { id: 'ps-tf-16', type: 'true-false', question: 'Increasing the sample size from 10 to 1,000 eliminates sampling error completely.', isTrue: false, explanation: 'No sample size, no matter how large, eliminates sampling error entirely. Only a census (measuring all N) eliminates sampling error. Larger n reduces but never eliminates it.' },
    { id: 'ps-tf-17', type: 'true-false', question: 'The sample mean x̄ is an unbiased estimator of the population mean μ.', isTrue: true, explanation: 'Unbiased means that on average across many samples, x̄ equals μ. The expected value of x̄ is μ. This is one of the key properties of the sample mean.' },
    { id: 'ps-tf-18', type: 'true-false', question: 'Nonresponse bias occurs when people who respond to a survey differ systematically from those who do not.', isTrue: true, explanation: 'When non-respondents have different characteristics from respondents, the sample becomes unrepresentative. This is a common form of sampling bias in surveys.' },
    { id: 'ps-tf-19', type: 'true-false', question: 'A representative sample perfectly mirrors the population in every characteristic.', isTrue: false, explanation: 'No sample perfectly mirrors the population — there is always some sampling error. A representative sample is one that closely reflects the population proportions, but not a perfect copy.' },
    { id: 'ps-tf-20', type: 'true-false', question: 'Stratified sampling divides the population into subgroups and randomly samples from each subgroup.', isTrue: true, explanation: 'In stratified sampling, the population is divided into strata (subgroups like age groups or departments), and a random sample is taken from each stratum. This ensures all subgroups are represented.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ps-mc-6', type: 'multiple-choice', question: 'A school has 500 students. A researcher randomly selects 50 students and measures their reading levels. The 500 students represent the:', options: [{ id: 'a', text: 'Sample', isCorrect: false, explanation: 'The 50 selected students are the sample.' }, { id: 'b', text: 'Population', isCorrect: true, explanation: 'All 500 students at the school are the population — the complete group of interest.' }, { id: 'c', text: 'Parameter', isCorrect: false, explanation: 'A parameter is a numerical summary of the population, not the population itself.' }, { id: 'd', text: 'Statistic', isCorrect: false, explanation: 'A statistic is a numerical summary of the sample.' }], explanation: 'The population is the full group of interest. Here, the researcher is interested in reading levels of all 500 students — that is the population. The 50 selected students are the sample.', hint: 'The population is the complete group the research question is about.' },
    { id: 'ps-mc-7', type: 'multiple-choice', question: 'Which of the following best describes a "parameter"?', options: [{ id: 'a', text: 'A numerical summary computed from sample data', isCorrect: false, explanation: 'That describes a statistic.' }, { id: 'b', text: 'A numerical summary describing the entire population', isCorrect: true, explanation: 'A parameter characterizes the population — it is typically unknown and estimated from samples.' }, { id: 'c', text: 'The sample size n', isCorrect: false, explanation: 'n is a count, not a parameter in the inferential sense.' }, { id: 'd', text: 'The range of possible values in the dataset', isCorrect: false, explanation: 'That describes the range statistic.' }], explanation: 'A parameter is a fixed (but usually unknown) numerical characteristic of a population, like μ (mean) or σ (standard deviation). We use sample statistics to estimate parameters.', hint: 'Population → parameter. Sample → statistic.' },
    { id: 'ps-mc-8', type: 'multiple-choice', question: 'A medical researcher wants to study the average blood pressure of adults in a city of 2 million. She collects data from 500 randomly selected adults. What is the main reason for using a sample rather than the full population?', options: [{ id: 'a', text: 'Samples are always more accurate than a census', isCorrect: false, explanation: 'A census on the full population would give the exact parameter, with no sampling error.' }, { id: 'b', text: 'It would be impractical and too expensive to measure all 2 million adults', isCorrect: true, explanation: 'Practicality and cost are the primary reasons we use samples instead of censuses for large populations.' }, { id: 'c', text: 'Random samples eliminate all error', isCorrect: false, explanation: 'Random samples reduce bias but do not eliminate sampling error.' }, { id: 'd', text: 'Populations are never well-defined', isCorrect: false, explanation: 'Populations can be very well-defined; the issue is feasibility of measurement.' }], explanation: 'Collecting data from every member of a large population is usually infeasible due to cost, time, and logistics. Sampling is the practical solution to estimate population parameters.', hint: 'Why can\'t we always measure the entire population?' },
    { id: 'ps-mc-9', type: 'multiple-choice', question: 'The difference between a sample statistic and the true population parameter is called:', options: [{ id: 'a', text: 'Type I error', isCorrect: false, explanation: 'Type I error is rejecting a true null hypothesis in hypothesis testing.' }, { id: 'b', text: 'Sampling error', isCorrect: true, explanation: 'Sampling error is the natural difference between x̄ and μ due to the random nature of sampling.' }, { id: 'c', text: 'Measurement bias', isCorrect: false, explanation: 'Measurement bias is a systematic error in how values are recorded.' }, { id: 'd', text: 'Standard deviation', isCorrect: false, explanation: 'Standard deviation measures variability within the dataset, not the error in estimation.' }], explanation: 'Sampling error is the inherent difference between what you observe in your sample and the true population value. It is not a mistake — it is the natural consequence of measuring a subset rather than the whole.', hint: 'What is the gap between what your sample tells you and the population truth?' },
    { id: 'ps-mc-10', type: 'multiple-choice', question: 'A hospital surveys all patients discharged in a single week (n=150) to assess care quality. The hospital has discharged 8,000 patients this year. The 150 patients are:', options: [{ id: 'a', text: 'The population', isCorrect: false, explanation: 'The population is all 8,000 patients discharged this year.' }, { id: 'b', text: 'A census', isCorrect: false, explanation: 'A census would survey all 8,000 patients.' }, { id: 'c', text: 'A sample', isCorrect: true, explanation: '150 out of 8,000 is a sample — a subset of the population.' }, { id: 'd', text: 'A parameter', isCorrect: false, explanation: 'A parameter is a number describing the population, not a group of people.' }], explanation: 'The hospital wants to draw conclusions about the quality of care for all 8,000 patients this year. The 150 patients from one week are a sample (a subset) of that population.', hint: 'Are 150 patients the entire group of interest, or just a subset?' },
    { id: 'ps-mc-11', type: 'multiple-choice', question: 'In a population of 1,000 employees, the mean salary is $55,000 (μ = $55,000). A random sample of 50 employees has a mean salary of $53,200 (x̄ = $53,200). The difference of $1,800 is best explained by:', options: [{ id: 'a', text: 'Calculation error', isCorrect: false, explanation: 'Differences between sample and population values are expected, not necessarily errors.' }, { id: 'b', text: 'Sampling error', isCorrect: true, explanation: 'Natural random variation in which employees were selected explains this difference.' }, { id: 'c', text: 'Selection bias', isCorrect: false, explanation: 'Selection bias is systematic; this random difference is typical sampling error.' }, { id: 'd', text: 'Measurement error', isCorrect: false, explanation: 'Measurement error would be recording salaries incorrectly.' }], explanation: 'Even with perfect random sampling, sample statistics differ from population parameters due to random variation — which employees happen to be selected. This is sampling error, and it shrinks as n increases.', hint: 'When a sample gives a slightly different answer than the population, what is the natural explanation?' },
    { id: 'ps-mc-12', type: 'multiple-choice', question: 'Which of the following is a population parameter (not a sample statistic)?', options: [{ id: 'a', text: 'x̄ = 5.2', isCorrect: false, explanation: 'x̄ (x-bar) is the sample mean.' }, { id: 'b', text: 's = 1.8', isCorrect: false, explanation: 's (lowercase) is the sample standard deviation.' }, { id: 'c', text: 'σ = 2.4', isCorrect: true, explanation: 'σ (sigma, Greek letter) is the population standard deviation — a population parameter.' }, { id: 'd', text: 'p̂ = 0.42', isCorrect: false, explanation: 'p̂ (p-hat) is the sample proportion.' }], explanation: 'Greek letters represent population parameters: μ (mean), σ (SD), ρ (correlation). Latin/hat notation represents sample statistics: x̄, s, r, p̂.', hint: 'Which symbol uses a Greek letter?' },
    { id: 'ps-mc-13', type: 'multiple-choice', question: 'A researcher wants to ensure that both men and women are proportionally represented in a sample. Which sampling method should they use?', options: [{ id: 'a', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS could accidentally over- or under-sample one gender.' }, { id: 'b', text: 'Convenience sampling', isCorrect: false, explanation: 'Convenience sampling is likely to produce biased results.' }, { id: 'c', text: 'Stratified random sampling', isCorrect: true, explanation: 'Stratified sampling divides the population into strata (here, by gender) and samples proportionally from each, guaranteeing representation.' }, { id: 'd', text: 'Systematic sampling', isCorrect: false, explanation: 'Systematic sampling (every kth person) does not guarantee gender proportions.' }], explanation: 'Stratified random sampling is the method of choice when you need to ensure that specific subgroups (strata) are properly represented in the sample. It divides the population into groups and samples from each.', hint: 'Which method explicitly accounts for subgroup membership?' },
    { id: 'ps-mc-14', type: 'multiple-choice', question: 'Which of the following would result in selection bias?', options: [{ id: 'a', text: 'Randomly selecting 100 patients from a list of all hospital patients', isCorrect: false, explanation: 'Random selection from the full population avoids selection bias.' }, { id: 'b', text: 'Surveying only patients who voluntarily respond to a satisfaction survey', isCorrect: true, explanation: 'Voluntary response samples are biased toward people with strong opinions (usually very satisfied or very dissatisfied).' }, { id: 'c', text: 'Using stratified sampling by age group', isCorrect: false, explanation: 'Stratified sampling is designed to reduce bias, not cause it.' }, { id: 'd', text: 'Increasing the sample size from 50 to 500', isCorrect: false, explanation: 'Increasing sample size reduces sampling error but does not cause bias.' }], explanation: 'Voluntary response bias: people who bother to respond are systematically different from those who do not. This makes the sample unrepresentative of the population — a classic selection bias.', hint: 'Which option allows participants to self-select, creating a non-random sample?' },
    { id: 'ps-mc-15', type: 'multiple-choice', question: 'The goal of inferential statistics is to:', options: [{ id: 'a', text: 'Describe the characteristics of the sample', isCorrect: false, explanation: 'Describing the sample is descriptive statistics.' }, { id: 'b', text: 'Use sample data to draw conclusions about the population', isCorrect: true, explanation: 'Inferential statistics uses probability theory to generalize from a sample to the broader population.' }, { id: 'c', text: 'Collect data from the entire population', isCorrect: false, explanation: 'That describes a census, not inference.' }, { id: 'd', text: 'Eliminate sampling error', isCorrect: false, explanation: 'Inferential statistics quantifies and accounts for sampling error — it does not eliminate it.' }], explanation: 'Inferential statistics bridges the gap from sample to population. Using probability theory, we infer things about the population (through hypothesis tests, confidence intervals, etc.) based on what we observe in the sample.', hint: 'Inference = drawing conclusions beyond your data.' },
  ],
  keyTakeaway:
    'A sample lets you estimate population characteristics without collecting data from everyone. The population is what you want to know about; the sample is what you have. Random sampling is the key to trustworthy estimates.',
  visualization: workedExampleTable,
  datasetGenerator: false,
}

export default function PopulationAndSample({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}