import { useState, useCallback } from 'react'
import TopicPage from '../../layout/TopicPage'

// ── Interactive simulator ─────────────────────────────────────────────────────

const POPULATION = Array.from({ length: 40 }, (_, i) => i + 1)

// Fisher–Yates shuffle (unbiased, unlike sort(() => Math.random() - 0.5))
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function RandomSamplingViz() {
  const [method, setMethod] = useState('simple')
  const [sampleSize, setSampleSize] = useState(10)
  const [sample, setSample] = useState([])
  const [drawn, setDrawn] = useState(false)

  const drawSample = useCallback(() => {
    const pop = [...POPULATION]
    let result = []

    if (method === 'simple') {
      // Simple random sampling without replacement
      const shuffled = shuffle(pop)
      result = shuffled.slice(0, sampleSize)
    } else if (method === 'systematic') {
      // Systematic: pick random start, then every k-th
      const k = Math.floor(pop.length / sampleSize)
      const start = Math.floor(Math.random() * k)
      for (let i = 0; i < sampleSize; i++) {
        const idx = start + i * k
        if (idx < pop.length) result.push(pop[idx])
      }
    } else {
      // Stratified: split into 4 strata of 10, sample proportionally
      const strataSize = Math.floor(sampleSize / 4)
      for (let s = 0; s < 4; s++) {
        const stratum = shuffle(pop.slice(s * 10, s * 10 + 10))
        result = result.concat(stratum.slice(0, strataSize))
      }
    }

    setSample(result.sort((a, b) => a - b))
    setDrawn(true)
  }, [method, sampleSize])

  const sampleMean = sample.length
    ? (sample.reduce((s, x) => s + x, 0) / sample.length).toFixed(2)
    : '—'
  const popMean = (POPULATION.reduce((s, x) => s + x, 0) / POPULATION.length).toFixed(2)

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sampling method
          </label>
          <select
            value={method}
            onChange={(e) => { setMethod(e.target.value); setDrawn(false) }}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-white text-textDark"
          >
            <option value="simple">Simple random</option>
            <option value="systematic">Systematic</option>
            <option value="stratified">Stratified (4 strata)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-textDark mb-1">
            Sample size: <span className="text-primary font-bold">{sampleSize}</span>
          </label>
          <input
            type="range" min={4} max={20} step={method === 'stratified' ? 4 : 1}
            value={sampleSize}
            onChange={(e) => { setSampleSize(Number(e.target.value)); setDrawn(false) }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-textMuted mt-0.5">
            <span>4</span><span>20</span>
          </div>
        </div>
      </div>

      <button
        onClick={drawSample}
        className="mb-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        Draw sample
      </button>

      {/* Population grid */}
      <div className="mb-3">
        <p className="text-xs font-medium text-textMuted mb-1">Population (N = 40)</p>
        <div className="flex flex-wrap gap-1">
          {POPULATION.map((v) => {
            const inSample = sample.includes(v)
            return (
              <span
                key={v}
                className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-medium transition-colors ${
                  inSample
                    ? 'bg-primary text-white'
                    : 'bg-surface text-textMuted border border-border'
                }`}
              >
                {v}
              </span>
            )
          })}
        </div>
      </div>

      {drawn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <div className="font-medium text-blue-900 mb-1">
            Sample drawn (n = {sample.length}): {sample.join(', ')}
          </div>
          <div className="text-blue-800 text-xs">
            Sample mean x̄ = <strong>{sampleMean}</strong> &nbsp;|&nbsp; Population mean μ = <strong>{popMean}</strong>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 mt-2">
        Highlighted cells are your sample. Draw multiple times to see how the sample changes.
      </p>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Random Sampling',
  topicGroup: 'Sampling',
  learningObjective:
    'Distinguish between common sampling methods and explain why random sampling is essential for valid statistical inference.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>sample</strong> is a subset of a population selected for study.
        Because measuring an entire population is usually impractical, we rely on samples.
        For a sample to be useful, it must be <em>representative</em> — reflecting the
        population's true characteristics without systematic bias.
      </p>
      <p>
        <strong>Random sampling</strong> is the gold standard: every member of the population
        has a known, non-zero chance of being selected. This protects against systematic selection
        bias and makes probability-based inference possible.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-2">Key sampling methods</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>Simple random sampling (SRS):</strong> Each member is equally likely to be chosen (e.g., drawing names from a hat).</li>
          <li><strong>Systematic sampling:</strong> Select every k-th member after a random start.</li>
          <li><strong>Stratified sampling:</strong> Divide the population into homogeneous subgroups (strata) and sample randomly from each.</li>
          <li><strong>Cluster sampling:</strong> Randomly select entire groups (clusters), then sample within them.</li>
        </ul>
      </div>
      <p>
        Non-random methods (convenience sampling, voluntary response) introduce bias and
        make statistical inference unreliable.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A political pollster wants to know who will win an election. Calling only people
        listed in an old phone directory is a convenience sample — it misses younger voters
        who rely on mobile phones. A random sample drawn from the voter roll gives every
        registered voter an equal chance and produces far more accurate predictions.
      </p>
      <p className="text-sm text-gray-600">
        The same logic applies to quality control (randomly testing bottles off a production
        line) or medical research (randomly assigning patients to treatment or control groups uses the same principle of randomisation).
      </p>
    </div>
  ),
  formula: {
    main: 'Every member has probability n/N of being included in the sample (SRS)',
    variants: [
      { label: 'Selection probability (SRS)', expression: 'P(selected) = n / N', latex: 'P(\\text{selected}) = \\frac{n}{N}' },
      { label: 'Systematic interval', expression: 'k = N / n', latex: 'k = \\frac{N}{n}' },
    ],
    symbolGuide: [
      { symbol: 'N', meaning: 'Population size' },
      { symbol: 'n', meaning: 'Sample size' },
      { symbol: 'k', meaning: 'Sampling interval for systematic sampling' },
    ],
  },
  whenToUse: [
    'Whenever you need to generalise findings from a sample to a larger population',
    'Before conducting surveys, experiments, or observational studies',
    'When resources prevent measuring the entire population',
  ],
  whenNotToUse: [
    'Simple random sampling may miss small subgroups — use stratified sampling when subgroup representation matters',
    'Cluster sampling introduces more variance — prefer it only when a list of individuals is unavailable',
  ],
  assumptions: [
    'Each sampled observation is independent of the others (especially for SRS)',
    'The sampling frame (list of all population members) is complete and accurate',
    'Sample size is small relative to population size, or sampling is with replacement',
  ],
  workedExample: {
    scenario:
      'A school has 200 students. A researcher wants to survey 20 of them using systematic sampling.',
    steps: [
      { stepNumber: 1, label: 'Calculate the interval', expression: 'k = N/n = 200/20 = 10', result: 'k = 10', explanation: 'Every 10th student will be selected.' },
      { stepNumber: 2, label: 'Choose a random start', expression: 'Random integer in [1, 10] → e.g., 7', result: 'Start = 7', explanation: 'The random start ensures the process is not predictable.' },
      { stepNumber: 3, label: 'Select subsequent units', expression: '7, 17, 27, 37, ..., 197', result: '20 students selected', explanation: 'Adding k = 10 each time gives exactly n = 20 students spread across the list.' },
    ],
    interpretation:
      'Systematic sampling is quick and spread evenly across the list. It approximates SRS unless there is a periodic pattern in the ordering that coincides with the interval k.',
  },
  interpretation:
    'A random sample allows you to make probability-based claims about the population. If your sampling method is biased, no amount of statistical analysis can recover an unbiased estimate.',
  commonMistakes: [
    { mistake: 'Confusing convenience sampling with random sampling', explanation: 'Surveying the first people you encounter is not random — those people may share characteristics that bias your results.' },
    { mistake: 'Ignoring non-response bias', explanation: 'Even with random selection, if certain groups are less likely to respond, your effective sample may be biased.' },
    { mistake: 'Assuming a large sample fixes a biased design', explanation: 'A large convenience sample is still biased. A smaller, properly randomised sample is more valid.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'rs-easy-1', scenario: 'A company has 500 employees.', question: 'In simple random sampling, what is the probability each employee is selected in a sample of 50?', hint: 'P = n/N.', solution: 'P = 50/500 = 0.10 — each employee has a 10% chance of being selected.' },
    ],
    moderate: [
      { id: 'rs-mod-1', scenario: 'A university has 1,200 students across 4 equal-sized faculties. A researcher wants 60 students using stratified sampling.', question: 'How many students should be drawn from each faculty?', hint: 'Proportional allocation: n × (stratum size / N).', solution: 'Each faculty has 300 students (300/1200 = 25%). 25% of 60 = 15 students per faculty.' },
    ],
    challenging: [
      { id: 'rs-chal-1', scenario: 'A researcher uses a volunteer internet survey to study average sleep duration.', question: 'Identify the sampling method and explain at least two sources of bias.', hint: 'Think about who visits the website and who chooses to respond.', solution: 'Voluntary response sampling. Biases: (1) Self-selection — only motivated or strongly opinionated people respond. (2) Coverage bias — people without internet access are excluded. Results likely overrepresent those with strong feelings about sleep.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'rs-kc-1', type: 'multiple-choice',
      question: 'Which sampling method makes every possible sample of size n equally likely to be selected?',
      options: [
        { id: 'a', text: 'Convenience sampling', isCorrect: false, explanation: 'Convenience sampling selects whoever is easiest to reach, not randomly.' },
        { id: 'b', text: 'Voluntary response sampling', isCorrect: false, explanation: 'Voluntary response relies on participants choosing to respond, introducing self-selection bias.' },
        { id: 'c', text: 'Simple random sampling', isCorrect: true, explanation: 'Correct! SRS makes every possible sample of size n equally likely (and so every individual has the same chance, n/N, of being included).' },
        { id: 'd', text: 'Cluster sampling', isCorrect: false, explanation: 'Cluster sampling selects entire groups, so only samples made up of whole clusters are possible — not every possible sample of size n can occur.' },
      ],
      explanation: 'Simple random sampling makes every possible sample of size n equally likely, so each unit has probability n/N of being included.',
      hint: 'Think about which method uses a random mechanism for every individual.',
    },
    {
      id: 'rs-kc-2', type: 'multiple-choice',
      question: 'A researcher surveys 100 customers who voluntarily fill in an online feedback form. What is the main problem?',
      options: [
        { id: 'a', text: 'The sample is too small', isCorrect: false, explanation: 'Sample size is not the primary issue here.' },
        { id: 'b', text: 'Self-selection bias — only those with strong opinions respond', isCorrect: true, explanation: 'Correct! Voluntary response creates self-selection bias — results over-represent extreme opinions.' },
        { id: 'c', text: 'The population is too large', isCorrect: false, explanation: 'Population size alone does not create bias.' },
        { id: 'd', text: 'Stratified sampling was not used', isCorrect: false, explanation: 'The root problem is the non-random, voluntary nature of the selection.' },
      ],
      explanation: 'Voluntary response surveys attract people who feel strongly — their views may not represent the wider population.',
      hint: 'Who is likely to fill in a voluntary feedback form?',
    },
    {
      id: 'rs-kc-3', type: 'multiple-choice',
      question: 'A school selects every 10th student from an alphabetical list. What sampling method is this?',
      options: [
        { id: 'a', text: 'Stratified sampling', isCorrect: false, explanation: 'Stratified sampling divides into subgroups first — no subgroups are mentioned here.' },
        { id: 'b', text: 'Cluster sampling', isCorrect: false, explanation: 'Cluster sampling selects entire groups, not evenly spaced individuals.' },
        { id: 'c', text: 'Systematic sampling', isCorrect: true, explanation: 'Correct! Selecting every k-th unit from an ordered list is systematic sampling.' },
        { id: 'd', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS would assign random numbers to all students, not pick every 10th.' },
      ],
      explanation: 'Systematic sampling: choose a random start and then every k-th unit. Here k = 10.',
      hint: 'Every 10th unit from a list — what pattern does that follow?',
    },
    {
      id: 'rs-kc-4', type: 'multiple-choice',
      question: 'A hospital divides patients into age groups (under 40, 40–60, over 60) and randomly selects 20 from each group. This is:',
      options: [
        { id: 'a', text: 'Cluster sampling', isCorrect: false, explanation: 'Cluster sampling selects entire groups (like wards), not subsamples from each group.' },
        { id: 'b', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS does not pre-define subgroups.' },
        { id: 'c', text: 'Stratified sampling', isCorrect: true, explanation: 'Correct! Age groups are strata; random selection within each stratum is stratified sampling.' },
        { id: 'd', text: 'Systematic sampling', isCorrect: false, explanation: 'Systematic sampling uses a fixed interval, not subgroup-based selection.' },
      ],
      explanation: 'Stratified sampling divides the population into homogeneous subgroups (strata) and randomly samples within each.',
      hint: 'The population is divided into groups, then randomly sampled within each group.',
    },
    {
      id: 'rs-kc-5', type: 'numerical',
      question: 'A population of 600 is sampled systematically with n = 30. What is the sampling interval k?',
      answer: 20,
      tolerance: 0,
      explanation: 'k = N/n = 600/30 = 20.',
      hint: 'k = N ÷ n.',
    },
    {
      id: 'rs-kc-6', type: 'multiple-choice',
      question: 'Which of the following BEST describes a non-probability sampling method?',
      options: [
        { id: 'a', text: 'Drawing names from a hat', isCorrect: false, explanation: 'This is simple random sampling — a probability method.' },
        { id: 'b', text: 'Surveying whoever is in the cafeteria at lunchtime', isCorrect: true, explanation: 'Correct! Convenience sampling selects available people — no known probability of selection.' },
        { id: 'c', text: 'Selecting every 5th customer', isCorrect: false, explanation: 'Selecting every kth unit after a random start is systematic sampling — a probability method.' },
        { id: 'd', text: 'Randomly choosing 3 branches then surveying all staff in those branches', isCorrect: false, explanation: 'That is cluster sampling — a probability method.' },
      ],
      explanation: 'Non-probability methods (convenience, voluntary response) do not give all units a known chance of selection.',
      hint: 'Which option involves no random mechanism at all?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'rs-tf-1', type: 'true-false', question: 'In simple random sampling, every individual in the population has an equal chance of being selected.', isTrue: true, explanation: 'Simple random sampling (SRS) gives each unit an equal probability of selection — this is its defining property.' },
    { id: 'rs-tf-2', type: 'true-false', question: 'Stratified sampling divides the population into clusters and randomly selects entire clusters.', isTrue: false, explanation: 'That describes cluster sampling. Stratified sampling divides the population into strata and samples randomly from WITHIN each stratum.' },
    { id: 'rs-tf-3', type: 'true-false', question: 'Convenience sampling is a type of probability sampling.', isTrue: false, explanation: 'Convenience sampling selects whoever is easily accessible — there is no random mechanism and no known selection probability.' },
    { id: 'rs-tf-4', type: 'true-false', question: 'Systematic sampling selects every kth unit after a random start.', isTrue: true, explanation: 'Systematic sampling: determine sampling interval k = N/n, choose a random start in [1, k], then select every kth unit.' },
    { id: 'rs-tf-5', type: 'true-false', question: 'A larger sample size always eliminates sampling bias.', isTrue: false, explanation: 'Bias arises from the sampling method, not sample size. A biased method with a huge sample still produces biased estimates.' },
    { id: 'rs-tf-6', type: 'true-false', question: 'Cluster sampling is most efficient when clusters are internally heterogeneous.', isTrue: true, explanation: 'Ideally each cluster should resemble the whole population (internally diverse). Homogeneous clusters reduce the efficiency of cluster sampling.' },
    { id: 'rs-tf-7', type: 'true-false', question: 'Voluntary response samples tend to overrepresent people with extreme opinions.', isTrue: true, explanation: 'People with strong views are more motivated to respond voluntarily — creating a systematic bias towards extreme positions.' },
    { id: 'rs-tf-8', type: 'true-false', question: 'Stratified sampling always requires a larger sample than simple random sampling for the same precision.', isTrue: false, explanation: 'Stratified sampling typically requires a SMALLER sample than SRS for the same precision, because within-stratum variance is lower.' },
    { id: 'rs-tf-9', type: 'true-false', question: 'Sampling without replacement is generally more accurate than sampling with replacement for a finite population.', isTrue: true, explanation: 'Without replacement avoids re-selecting units, reducing variance and improving precision for fixed n in finite populations.' },
    { id: 'rs-tf-10', type: 'true-false', question: 'The sampling frame is the list of all units from which the sample is drawn.', isTrue: true, explanation: 'The sampling frame should match the target population. Mismatches (frame errors) create coverage bias.' },
    { id: 'rs-tf-11', type: 'true-false', question: 'Cluster sampling is used when a complete list of all population members is readily available.', isTrue: false, explanation: 'Cluster sampling is used precisely WHEN a complete list is NOT readily available but natural groupings (clusters) exist.' },
    { id: 'rs-tf-12', type: 'true-false', question: 'Non-response bias occurs when those who do not respond differ from those who do.', isTrue: true, explanation: 'If non-respondents have different characteristics than respondents, the achieved sample is not representative.' },
    { id: 'rs-tf-13', type: 'true-false', question: 'In proportionate stratified sampling, the sample size within each stratum is proportional to the stratum\'s size in the population.', isTrue: true, explanation: 'Proportionate allocation: nₕ = n × (Nₕ/N). Larger strata contribute more observations to the sample.' },
    { id: 'rs-tf-14', type: 'true-false', question: 'Simple random sampling always requires the population to be divided into groups first.', isTrue: false, explanation: 'SRS requires only a sampling frame (complete list) — no grouping is needed. Grouping is required for stratified and cluster sampling.' },
    { id: 'rs-tf-15', type: 'true-false', question: 'Undercoverage bias occurs when some population members have no chance of being selected.', isTrue: true, explanation: 'If parts of the population are absent from the sampling frame, they can never be selected, causing systematic undercoverage.' },
    { id: 'rs-tf-16', type: 'true-false', question: 'Systematic sampling can introduce bias if the population has a periodic pattern matching the sampling interval.', isTrue: true, explanation: 'If the population cycles with period k, systematic sampling at interval k always hits the same phase — a well-known source of periodic bias.' },
    { id: 'rs-tf-17', type: 'true-false', question: 'A census measures every member of the population and is therefore always preferable to sampling.', isTrue: false, explanation: 'Censuses are costly, slow, and may introduce more measurement error than a well-designed sample. Sampling is often preferable.' },
    { id: 'rs-tf-18', type: 'true-false', question: 'The goal of random sampling is to produce a sample that is representative of the population.', isTrue: true, explanation: 'Randomness gives each unit a fair chance and, in the long run, produces samples that mirror the population distribution.' },
    { id: 'rs-tf-19', type: 'true-false', question: 'In multistage sampling, random sampling is applied at each stage.', isTrue: true, explanation: 'Multistage sampling applies probability selection at each level (e.g., select counties, then cities, then households).' },
    { id: 'rs-tf-20', type: 'true-false', question: 'Selection bias and sampling error are the same thing.', isTrue: false, explanation: 'Sampling error is random variation due to chance. Selection bias is systematic and results from a flawed sampling procedure.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'rs-mc-6', type: 'multiple-choice', question: 'A researcher surveys every 10th name on an alphabetised class roster. This is:', options: [{ id: 'a', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS would require random selection with no fixed interval.' }, { id: 'b', text: 'Systematic sampling', isCorrect: true, explanation: 'Selecting every kth unit from an ordered list is systematic sampling.' }, { id: 'c', text: 'Cluster sampling', isCorrect: false, explanation: 'Cluster sampling would select whole groups, not every kth individual.' }, { id: 'd', text: 'Convenience sampling', isCorrect: false, explanation: 'Convenience sampling uses availability, not a fixed interval.' }], explanation: 'A fixed interval (every 10th) applied to an ordered list defines systematic sampling.', hint: 'Is there a fixed interval between selected units?' },
    { id: 'rs-mc-7', type: 'multiple-choice', question: 'A school polls students by randomly selecting 3 classrooms and surveying everyone in them. This is:', options: [{ id: 'a', text: 'Stratified sampling', isCorrect: false, explanation: 'Stratified sampling randomly selects individuals from each group, not entire groups.' }, { id: 'b', text: 'Cluster sampling', isCorrect: true, explanation: 'Randomly selecting entire intact groups (classrooms) and surveying all members is cluster sampling.' }, { id: 'c', text: 'Systematic sampling', isCorrect: false, explanation: 'Systematic sampling uses a fixed interval, not whole-group selection.' }, { id: 'd', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS selects individuals at random, not intact groups.' }], explanation: 'Randomly selecting whole clusters (classrooms) and taking all members defines cluster sampling.', hint: 'Are entire groups selected, or individuals within groups?' },
    { id: 'rs-mc-8', type: 'multiple-choice', question: 'A poll asks readers of a magazine to text in their opinions. This is most affected by:', options: [{ id: 'a', text: 'Sampling error', isCorrect: false, explanation: 'Sampling error is random, not the systematic bias from self-selection.' }, { id: 'b', text: 'Voluntary response bias', isCorrect: true, explanation: 'Only highly motivated readers respond, creating a biased sample of strong opinions.' }, { id: 'c', text: 'Measurement error', isCorrect: false, explanation: 'Measurement error relates to how questions are asked, not who chooses to respond.' }, { id: 'd', text: 'Undercoverage', isCorrect: false, explanation: 'Undercoverage is about missing population segments — here the mechanism is self-selection.' }], explanation: 'Self-selected samples systematically over-represent people with strong views — voluntary response bias.', hint: 'Who is most likely to bother texting in a response?' },
    { id: 'rs-mc-9', type: 'multiple-choice', question: 'Why is stratified sampling often more efficient than simple random sampling?', options: [{ id: 'a', text: 'It requires less work to set up', isCorrect: false, explanation: 'Stratified sampling actually requires more setup (defining strata).' }, { id: 'b', text: 'It reduces variability by ensuring the sample reflects known population subgroups', isCorrect: true, explanation: 'Sampling within homogeneous strata reduces within-stratum variance — increasing precision for the same n.' }, { id: 'c', text: 'It eliminates all sampling error', isCorrect: false, explanation: 'No probability sampling method eliminates sampling error completely.' }, { id: 'd', text: 'It avoids non-response bias', isCorrect: false, explanation: 'Stratification does not guarantee response — non-response can still occur within strata.' }], explanation: 'Stratification captures population structure, reducing variance and allowing smaller n for equivalent precision.', hint: 'How does sampling from internally similar groups affect variance?' },
    { id: 'rs-mc-10', type: 'multiple-choice', question: 'A sample of 1000 is drawn from a city of 1,000,000 using SRS. The same method is used to draw 1000 from a town of 50,000. Assume the variable has the same standard deviation in both places. Which sample is more precise?', options: [{ id: 'a', text: 'The city sample — larger population gives more to draw from', isCorrect: false, explanation: 'Precision is about sample size n, not population size N (when n is small relative to N).' }, { id: 'b', text: 'Essentially equally precise — same sample size n', isCorrect: true, explanation: 'Precision depends on n, not N, when the sampling fraction is small. Both samples have SE ≈ σ/√1000 (the town\'s finite population correction is √(49000/49999) ≈ 0.99, a negligible difference).' }, { id: 'c', text: 'The town sample — smaller population reduces variability', isCorrect: false, explanation: 'A smaller population does not inherently reduce variability; the sampling fraction matters via the finite population correction.' }, { id: 'd', text: 'Cannot determine without knowing the variance', isCorrect: false, explanation: 'The question states the standard deviation is the same, and for small sampling fractions SE ≈ σ/√n regardless of population size.' }], explanation: 'When the sampling fraction is small, SE ≈ σ/√n — precision depends on n, not N. Both samples are essentially equally precise.', hint: 'What drives standard error — n or N?' },
    { id: 'rs-mc-11', type: 'multiple-choice', question: 'What is the main advantage of cluster sampling over simple random sampling?', options: [{ id: 'a', text: 'Higher statistical precision', isCorrect: false, explanation: 'Cluster sampling typically has lower precision (higher variance) than SRS for the same n.' }, { id: 'b', text: 'Reduced cost and increased feasibility when a complete sampling frame is unavailable', isCorrect: true, explanation: 'Cluster sampling requires a list of clusters, not all individuals — reducing cost and logistical complexity.' }, { id: 'c', text: 'Elimination of non-response bias', isCorrect: false, explanation: 'Cluster sampling does not prevent non-response.' }, { id: 'd', text: 'Guaranteed representativeness', isCorrect: false, explanation: 'No sampling method guarantees representativeness — it is only achieved in expectation.' }], explanation: 'Cluster sampling trades precision for feasibility and cost reduction — ideal when no complete frame exists.', hint: 'Why would a researcher choose clusters instead of individual random selection?' },
    { id: 'rs-mc-12', type: 'multiple-choice', question: 'A researcher interviews people walking past a shopping centre. This is an example of:', options: [{ id: 'a', text: 'Systematic sampling', isCorrect: false, explanation: 'Systematic sampling uses a fixed interval — not selecting whoever happens by.' }, { id: 'b', text: 'Convenience sampling', isCorrect: true, explanation: 'Selecting whoever is easily accessible (walking by) is convenience sampling.' }, { id: 'c', text: 'Simple random sampling', isCorrect: false, explanation: 'SRS requires a sampling frame and random selection — not incidental contact.' }, { id: 'd', text: 'Stratified sampling', isCorrect: false, explanation: 'Stratified sampling requires defined population strata and random selection within each.' }], explanation: 'Intercepting available passers-by with no random mechanism is textbook convenience sampling.', hint: 'Is there any random mechanism or just whoever is available?' },
    { id: 'rs-mc-13', type: 'multiple-choice', question: 'When would proportionate stratified sampling produce the same results as simple random sampling?', options: [{ id: 'a', text: 'When the strata are all the same size', isCorrect: false, explanation: 'Same-sized strata do not by themselves equate to SRS results.' }, { id: 'b', text: 'When all strata have the same mean (no between-strata differences)', isCorrect: true, explanation: 'Proportionate stratification gains precision only by removing between-strata differences in means. If all strata have the same mean, stratifying provides no extra benefit — results match SRS.' }, { id: 'c', text: 'When there are exactly two strata', isCorrect: false, explanation: 'Two strata still provide efficiency gains if they differ.' }, { id: 'd', text: 'When n > 30', isCorrect: false, explanation: 'Sample size does not determine whether stratification adds value.' }], explanation: 'Stratification gains precision by exploiting between-stratum differences. If strata are identical, there is nothing to gain.', hint: 'What does stratification exploit? If that is absent, what happens?' },
    { id: 'rs-mc-14', type: 'multiple-choice', question: 'A sampling frame that excludes people without internet access would cause:', options: [{ id: 'a', text: 'Non-response bias', isCorrect: false, explanation: 'Non-response bias is when selected people refuse to respond — not when a group is missing from the frame entirely.' }, { id: 'b', text: 'Undercoverage bias', isCorrect: true, explanation: 'People without internet have zero probability of selection — a classic undercoverage problem.' }, { id: 'c', text: 'Measurement error', isCorrect: false, explanation: 'Measurement error relates to how responses are recorded, not who is included in the frame.' }, { id: 'd', text: 'Voluntary response bias', isCorrect: false, explanation: 'Voluntary response requires people to opt in — the issue here is exclusion from the frame.' }], explanation: 'Excluding an entire group from the sampling frame means they cannot be selected — undercoverage bias.', hint: 'What type of bias arises when part of the population has zero probability of selection?' },
    { id: 'rs-mc-15', type: 'multiple-choice', question: 'In an SRS of n=50 from N=500, the sampling fraction is:', options: [{ id: 'a', text: '1%', isCorrect: false, explanation: '1% = 5/500. Here n/N = 50/500 = 10%.' }, { id: 'b', text: '10%', isCorrect: true, explanation: 'Sampling fraction = n/N = 50/500 = 0.10 = 10%.' }, { id: 'c', text: '50%', isCorrect: false, explanation: '50% would require n = 250 from N = 500.' }, { id: 'd', text: '500%', isCorrect: false, explanation: 'Sampling fraction cannot exceed 100%.' }], explanation: 'Sampling fraction = n/N = 50/500 = 10%.', hint: 'Sampling fraction = sample size / population size.' },
  ],
  keyTakeaway:
    'Random sampling is the foundation of statistical inference. Use simple random sampling when you have a complete list; systematic or stratified sampling when the population has structure. Avoid convenience and voluntary-response methods — they introduce bias that no statistical technique can fully correct.',
  memoryTrick: (
    <div className="space-y-3 text-textDark text-sm leading-relaxed">
      <p><strong>"S-C-S-S" — the four main probability methods</strong></p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { letter: 'S', name: 'Simple random', cue: '🎩 Hat draw — everyone equal' },
          { letter: 'C', name: 'Cluster', cue: '🫙 Grab the whole jar (a whole group)' },
          { letter: 'S', name: 'Systematic', cue: '🏭 Every k-th item off the conveyor belt' },
          { letter: 'S', name: 'Stratified', cue: '🎂 Slice the cake first, then pick from each layer' },
        ].map(({ letter, name, cue }) => (
          <div key={name} className="bg-white border border-violet-200 rounded-lg p-2">
            <span className="text-violet-700 font-bold text-lg">{letter}</span>
            <span className="font-semibold ml-1 text-textDark">{name}</span>
            <p className="text-textMuted mt-0.5">{cue}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-textMuted mt-1">Bias shortcut: <strong>no random mechanism = not generalisable.</strong> A large convenience sample is still biased.</p>
    </div>
  ),
  visualization: <RandomSamplingViz />,
  datasetGenerator: false,
}

export default function RandomSampling({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
