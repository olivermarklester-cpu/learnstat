import TopicPage from '../../layout/TopicPage'

const content = {
  title: 'Significance Level',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Define the significance level α, explain what it controls in a hypothesis test, and justify the choice of α for a given context.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>significance level (α)</strong> is the maximum probability of rejecting a
        true null hypothesis that we are willing to accept. It is set <em>before</em> data
        collection and defines the threshold for "surprising enough."
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">What α controls</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>α = Type I error rate:</strong> P(reject H₀ | H₀ is true). Smaller α → fewer false positives.</li>
          <li><strong>α defines the rejection region:</strong> Larger α → larger rejection region → easier to reject H₀ → more false positives but more power.</li>
          <li><strong>α = 0.05 is the most common convention</strong> (a 5% chance of a false positive when H₀ is true). α = 0.01 is used in high-stakes situations.</li>
        </ul>
      </div>
      <p>
        Choosing α is a balance: smaller α reduces false positives but makes it harder to
        detect real effects (reduces power). The right α depends on the cost of each
        type of error.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A security alarm can be set to high sensitivity (triggers easily) or low sensitivity.
        High sensitivity = high α: you catch more real intruders (power) but also get more
        false alarms (Type I errors). Low sensitivity = low α: fewer false alarms, but you
        might miss real threats.
      </p>
      <p className="text-sm text-gray-600">
        Choosing α is choosing how sensitive your alarm is, and it depends on the cost
        of false alarms versus the cost of missing an intruder.
      </p>
    </div>
  ),
  formula: {
    main: 'α = P(Type I error) = P(reject H₀ | H₀ is true)',
    variants: [
      { label: 'Type I error probability', expression: 'α = P(reject H₀ | H₀ true)', latex: '\\alpha = P(\\text{reject } H_0 \\mid H_0 \\text{ true})' },
      { label: 'Rejection rule', expression: 'Reject H₀ if p ≤ α', latex: '\\text{Reject } H_0 \\text{ if } p \\leq \\alpha' },
      { label: 'Common choices', expression: 'α = 0.10 (lenient), 0.05 (standard), 0.01 (strict)', latex: '' },
    ],
    symbolGuide: [
      { symbol: 'α', meaning: 'Significance level — maximum acceptable Type I error probability (read "alpha")' },
      { symbol: 'Type I error', meaning: 'Rejecting H₀ when it is actually true (false positive)' },
      { symbol: 'Type II error (β)', meaning: 'Failing to reject H₀ when H₁ is true (false negative)' },
      { symbol: 'Power = 1−β', meaning: 'Probability of correctly rejecting a false H₀' },
    ],
  },
  whenToUse: [
    'Set α = 0.05 as a default for most research',
    'Use α = 0.01 when false positives are very costly (e.g., drug approval, safety testing)',
    'Use α = 0.10 in exploratory research where missing real effects matters more than false positives',
  ],
  whenNotToUse: [
    'Do not adjust α after seeing the data to make a result significant',
    'Avoid applying corrections like Bonferroni without understanding their effect on power',
  ],
  assumptions: [
    'α is set before data collection — not adjusted post-hoc',
    'The significance level should reflect the real-world costs of Type I and Type II errors',
  ],
  workedExample: {
    scenario:
      'A clinical trial tests a new drug. A Type I error (approving an ineffective drug) is costly, but a Type II error (missing an effective drug) leaves patients without treatment.',
    steps: [
      { stepNumber: 1, label: 'Assess Type I error cost', expression: 'Approving an ineffective drug → patient harm, wasted resources', result: 'Type I error is serious', explanation: 'This argues for a smaller α.' },
      { stepNumber: 2, label: 'Assess Type II error cost', expression: 'Rejecting an effective drug → patients denied beneficial treatment', result: 'Type II error is also serious', explanation: 'This argues against too small an α (to maintain power).' },
      { stepNumber: 3, label: 'Choose α', expression: 'α = 0.05 is standard in clinical research (sometimes 0.01 for pivotal trials)', result: 'α = 0.05', explanation: 'Balance between stringency and power. Can be set lower (0.01) for high-risk decisions.' },
    ],
    interpretation:
      'The chosen α defines how much evidence is needed to conclude the drug works. Too large an α risks approving ineffective drugs; too small risks missing effective ones.',
  },
  interpretation:
    'α is a cost-benefit decision made before seeing the data. It is not a measure of how meaningful a result is — only a threshold for the binary reject/fail-to-reject decision.',
  commonMistakes: [
    { mistake: 'Treating p = 0.05 as "the truth"', explanation: 'α = 0.05 is a convention, not a law. Results just above or below 0.05 are not categorically different.' },
    { mistake: 'Changing α after seeing the data', explanation: 'Post-hoc α adjustment inflates false positive rates — a form of p-hacking.' },
    { mistake: 'Thinking a smaller α is always better', explanation: 'Smaller α reduces Type I errors but increases Type II errors (reduces power). The right α depends on context.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'sig-easy-1', scenario: 'A test gives p = 0.04.', question: 'Do you reject H₀ at α = 0.05? At α = 0.01?', hint: 'Compare p to each α value.', solution: 'At α = 0.05: yes (0.04 ≤ 0.05). At α = 0.01: no (0.04 > 0.01).' },
    ],
    moderate: [
      { id: 'sig-mod-1', scenario: 'A researcher is testing whether a new algorithm reduces server downtime. Missing a real improvement (Type II) costs $500,000; a false alarm (Type I) costs $50,000.', question: 'Should α be set higher or lower than 0.05? Why?', hint: 'Consider which error is more costly.', solution: 'Type I error ($50k) is less costly than Type II ($500k). Therefore use a higher α (e.g., 0.10) to increase power and avoid missing real improvements.' },
    ],
    challenging: [
      { id: 'sig-chal-1', scenario: 'A study with n = 10,000 reports p = 0.04. Another with n = 100 reports p = 0.04.', question: 'Are these results equally meaningful? What should accompany the p-value in both cases?', hint: 'Think about effect size and standard error.', solution: 'Both have p = 0.04, but the large-sample study may detect a trivially small effect that is statistically significant but practically unimportant. Always report effect size (e.g., Cohen\'s d, confidence interval). A statistically significant result with n=10,000 may be practically meaningless.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'sig-kc-1', type: 'multiple-choice',
      question: 'What does α = 0.05 mean in a hypothesis test?',
      options: [
        { id: 'a', text: 'There is a 5% probability that H₀ is true', isCorrect: false, explanation: 'α does not give the probability of H₀ being true — that is a different (Bayesian) concept.' },
        { id: 'b', text: 'There is a 5% chance of rejecting H₀ when it is actually true', isCorrect: true, explanation: 'Correct! α = P(reject H₀ | H₀ true) = 5% probability of a Type I error.' },
        { id: 'c', text: 'There is a 95% probability the result is correct', isCorrect: false, explanation: 'This confuses confidence level with significance level.' },
        { id: 'd', text: 'The effect size is 5%', isCorrect: false, explanation: 'α is a probability threshold, not an effect size.' },
      ],
      explanation: 'α is the Type I error rate — the probability of a false positive.',
      hint: 'α controls false positives (rejecting a true H₀).',
    },
    {
      id: 'sig-kc-2', type: 'multiple-choice',
      question: 'In a high-stakes drug-approval test where approving an ineffective or unsafe drug (a Type I error) could harm thousands, which significance level is most appropriate?',
      options: [
        { id: 'a', text: 'α = 0.10', isCorrect: false, explanation: 'Too lenient — this allows 10% false positives, not usually appropriate for safety testing.' },
        { id: 'b', text: 'α = 0.05', isCorrect: false, explanation: 'Standard, but safety tests often demand more stringency.' },
        { id: 'c', text: 'α = 0.01', isCorrect: true, explanation: 'Correct! In high-stakes safety contexts, false positives are very costly, so a smaller α is appropriate.' },
        { id: 'd', text: 'α does not matter here', isCorrect: false, explanation: 'α always matters — it determines the false-positive rate.' },
      ],
      explanation: 'When a false positive (Type I error) could cause serious harm, use a smaller α like 0.01 to require stronger evidence.',
      hint: 'Higher stakes → smaller α → require more evidence.',
    },
    {
      id: 'sig-kc-3', type: 'multiple-choice',
      question: 'A researcher sets α = 0.05. They run 20 independent hypothesis tests. How many false positives should they expect even if all null hypotheses are true?',
      options: [
        { id: 'a', text: '0', isCorrect: false, explanation: 'With α = 0.05 and 20 tests, we expect 20 × 0.05 = 1 false positive on average.' },
        { id: 'b', text: '1', isCorrect: true, explanation: 'Correct! Expected false positives = 20 × α = 20 × 0.05 = 1.' },
        { id: 'c', text: '5', isCorrect: false, explanation: '5% × 20 = 1, not 5.' },
        { id: 'd', text: '19', isCorrect: false, explanation: 'Expected false positives = n × α = 1, not n − 1.' },
      ],
      explanation: 'α = 0.05 per test. With 20 tests: E(false positives) = 20 × 0.05 = 1. This is why multiple comparisons corrections (e.g., Bonferroni) exist.',
      hint: 'Expected false positives = number of tests × α.',
    },
    {
      id: 'sig-kc-4', type: 'multiple-choice',
      question: 'Which statement about α and β is correct?',
      options: [
        { id: 'a', text: 'Decreasing α automatically decreases β', isCorrect: false, explanation: 'Decreasing α makes the test more conservative, which increases β (harder to reject H₀ even when it is false).' },
        { id: 'b', text: 'Decreasing α increases β for fixed n', isCorrect: true, explanation: 'Correct! Stricter α means the test needs more extreme evidence to reject H₀, reducing power and increasing β.' },
        { id: 'c', text: 'α and β are always equal', isCorrect: false, explanation: 'α and β can be any values; they are not necessarily equal.' },
        { id: 'd', text: 'β = 1 − α', isCorrect: false, explanation: 'β = 1 − Power, not 1 − α.' },
      ],
      explanation: 'α and β trade off: smaller α → harder to reject H₀ → more Type II errors (higher β).',
      hint: 'Stricter threshold to reject H₀ means you need stronger evidence — what happens to β?',
    },
    {
      id: 'sig-kc-5', type: 'multiple-choice',
      question: 'p = 0.049, α = 0.05. Is this "more significant" than p = 0.001?',
      options: [
        { id: 'a', text: 'Yes — 0.049 is just under 0.05, which is the threshold', isCorrect: false, explanation: 'p = 0.001 is actually stronger evidence against H₀ (further from the threshold).' },
        { id: 'b', text: 'No — p = 0.001 represents stronger evidence against H₀', isCorrect: true, explanation: 'Correct! Smaller p = more extreme result under H₀ = stronger evidence against H₀.' },
        { id: 'c', text: 'They are equally significant since both are below 0.05', isCorrect: false, explanation: 'Both would lead to rejection at α = 0.05, but they do not represent equal evidence.' },
        { id: 'd', text: 'You need to know the sample size to compare them', isCorrect: false, explanation: 'The p-value already incorporates n — smaller p = stronger evidence.' },
      ],
      explanation: 'p = 0.001 << p = 0.049. Smaller p → rarer result under H₀ → stronger evidence against H₀.',
      hint: 'Which p-value is further from 1 (the no-evidence side)?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'sl-tf-1', type: 'true-false', question: 'The significance level α is the maximum acceptable probability of a Type I error.', isTrue: true, explanation: 'α = P(reject H₀ | H₀ is true). Setting α = 0.05 means we accept up to a 5% false-positive rate.' },
    { id: 'sl-tf-2', type: 'true-false', question: 'A lower significance level (e.g., α = 0.01) makes it easier to reject H₀.', isTrue: false, explanation: 'Lower α is a more stringent threshold — it makes it HARDER to reject H₀ (fewer false positives but less power).' },
    { id: 'sl-tf-3', type: 'true-false', question: 'The most common default significance level in social and biomedical research is α = 0.05.', isTrue: true, explanation: 'α = 0.05 became the conventional threshold through historical convention (Fisher) and is widely used across disciplines.' },
    { id: 'sl-tf-4', type: 'true-false', question: 'Setting α = 0.05 means you accept a 5% chance of falsely rejecting a true H₀.', isTrue: true, explanation: 'This is exactly the meaning of α: P(Type I error) = α = 0.05.' },
    { id: 'sl-tf-5', type: 'true-false', question: 'The significance level α should be chosen after computing the p-value.', isTrue: false, explanation: 'α must be chosen before data collection. Choosing α after seeing the p-value is p-hacking and invalidates the test.' },
    { id: 'sl-tf-6', type: 'true-false', question: 'A higher α reduces the probability of a Type II error (β).', isTrue: true, explanation: 'Higher α → lower critical threshold → easier to reject H₀ → fewer missed effects → lower β. But higher Type I error.' },
    { id: 'sl-tf-7', type: 'true-false', question: 'If p = 0.049, the result is statistically significant at α = 0.05 but not at α = 0.01.', isTrue: true, explanation: 'p = 0.049 < α = 0.05 → significant at 0.05. But p = 0.049 > α = 0.01 → NOT significant at 0.01.' },
    { id: 'sl-tf-8', type: 'true-false', question: 'α = 0.05 is mathematically proven to be the optimal significance level.', isTrue: false, explanation: 'α = 0.05 is a historical convention, not a mathematically derived optimum. The appropriate α depends on the consequences of errors.' },
    { id: 'sl-tf-9', type: 'true-false', question: 'The significance level and p-value are not the same thing.', isTrue: true, explanation: 'α is a pre-chosen threshold. The p-value is computed from the data. The decision rule is: reject H₀ if p ≤ α.' },
    { id: 'sl-tf-10', type: 'true-false', question: 'In high-stakes medical trials (e.g., approving a drug), α = 0.01 or lower is often preferred to α = 0.05.', isTrue: true, explanation: 'When the cost of a false positive is high (approving an ineffective drug), a stricter α reduces this risk.' },
    { id: 'sl-tf-11', type: 'true-false', question: 'Reducing α from 0.05 to 0.01 with the same data always causes you to change your decision from "reject" to "fail to reject."', isTrue: false, explanation: 'Only if p is between 0.01 and 0.05 does the decision change. If p < 0.01, you reject at both levels.' },
    { id: 'sl-tf-12', type: 'true-false', question: 'Using a very small α (e.g., 0.001) eliminates the possibility of making a statistical error.', isTrue: false, explanation: 'No significance level eliminates errors. α = 0.001 reduces Type I errors but increases Type II errors (missed effects).' },
    { id: 'sl-tf-13', type: 'true-false', question: 'The significance level determines the width of the critical region (rejection region).', isTrue: true, explanation: 'Larger α → wider critical region (lower z*) → easier to reject H₀. Smaller α → narrower critical region → harder to reject.' },
    { id: 'sl-tf-14', type: 'true-false', question: 'A p-value of 0.001 is more statistically significant than a p-value of 0.049, even if both are below α = 0.05.', isTrue: true, explanation: 'p = 0.001 provides much stronger evidence against H₀ than p = 0.049, though both lead to rejection at α = 0.05.' },
    { id: 'sl-tf-15', type: 'true-false', question: 'In exploratory research, a higher α (e.g., 0.10) may be acceptable to avoid missing potentially important findings.', isTrue: true, explanation: 'Exploratory research prioritises sensitivity (not missing effects). A higher α is sometimes appropriate when false positives have lower cost.' },
    { id: 'sl-tf-16', type: 'true-false', question: 'The Bonferroni correction is used to maintain the overall α level when performing multiple tests.', isTrue: true, explanation: 'Multiple testing inflates the family-wise error rate. Bonferroni corrects by dividing α by the number of tests.' },
    { id: 'sl-tf-17', type: 'true-false', question: 'α represents the long-run proportion of true null hypotheses that will be incorrectly rejected.', isTrue: true, explanation: 'Over many hypothesis tests where H₀ is true, α fraction will be incorrectly rejected (Type I errors). α is the long-run false positive rate.' },
    { id: 'sl-tf-18', type: 'true-false', question: 'p-values near the α boundary provide weak evidence either way.', isTrue: true, explanation: 'p = 0.049 vs p = 0.051 are nearly identical in evidential strength. Both provide marginal evidence against H₀.' },
    { id: 'sl-tf-19', type: 'true-false', question: 'When α = 0.05, exactly 5% of the p-values you will ever observe will be below 0.05.', isTrue: false, explanation: '5% of tests where H₀ is TRUE will produce p < 0.05. If many H₀s are false, the proportion of small p-values will be higher.' },
    { id: 'sl-tf-20', type: 'true-false', question: 'The significance level α defines the critical value: higher α → lower critical value → easier to reject H₀.', isTrue: true, explanation: 'For a z-test: higher α → P(Z > z*) = α requires a smaller z* → critical value decreases → easier to exceed → easier to reject.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'sl-mc-6', type: 'multiple-choice', question: 'A researcher uses α = 0.05. The test gives p = 0.08. What is the decision?', options: [{ id: 'a', text: 'Reject H₀ — 0.08 is close to 0.05', isCorrect: false, explanation: 'p = 0.08 > α = 0.05. The threshold is strict — 0.08 does not cross it.' }, { id: 'b', text: 'Fail to reject H₀ — p = 0.08 > α = 0.05', isCorrect: true, explanation: 'p = 0.08 exceeds α = 0.05. We fail to reject H₀ at the 5% significance level.' }, { id: 'c', text: 'Reject H₀ — the effect is probably real', isCorrect: false, explanation: 'Practical intuition cannot override the pre-specified α. p > α → fail to reject.' }, { id: 'd', text: 'Accept H₀', isCorrect: false, explanation: 'We fail to reject H₀ — we never "accept" H₀.' }], explanation: 'p = 0.08 > α = 0.05 → fail to reject H₀.', hint: 'Compare p to α. If p > α, fail to reject.' },
    { id: 'sl-mc-7', type: 'multiple-choice', question: 'Why might a researcher choose α = 0.01 rather than α = 0.05 for a high-stakes drug-approval test?', options: [{ id: 'a', text: 'It produces smaller p-values', isCorrect: false, explanation: 'α does not affect p-values — it affects the decision threshold.' }, { id: 'b', text: 'It reduces the risk of approving an ineffective drug (Type I error)', isCorrect: true, explanation: 'A Type I error in drug approval means approving an ineffective drug. Lower α reduces this risk.' }, { id: 'c', text: 'It is required by law', isCorrect: false, explanation: 'Legal requirements vary by jurisdiction and drug type — α is a statistical choice.' }, { id: 'd', text: 'It gives higher power to detect real effects', isCorrect: false, explanation: 'Lower α actually reduces power (increases β). It does NOT give higher power.' }], explanation: 'In high-stakes decisions, Type I errors are costly. Lower α reduces false positives at the cost of increased β.', hint: 'What type of error involves approving an ineffective drug?' },
    { id: 'sl-mc-8', type: 'multiple-choice', question: 'Increasing α from 0.05 to 0.10 will:', options: [{ id: 'a', text: 'Make it harder to reject H₀', isCorrect: false, explanation: 'Higher α lowers the threshold → easier to reject H₀.' }, { id: 'b', text: 'Increase power (reduce Type II error β) but increase Type I error', isCorrect: true, explanation: 'Higher α → reject H₀ more often → fewer missed real effects (lower β = higher power) + more false positives.' }, { id: 'c', text: 'Have no effect on the test', isCorrect: false, explanation: 'α directly controls the decision threshold.' }, { id: 'd', text: 'Reduce both Type I and Type II errors simultaneously', isCorrect: false, explanation: 'Reducing both requires increasing sample size — changing α involves a trade-off.' }], explanation: 'Higher α: more rejections → more power AND more Type I errors. Trade-off between sensitivity and specificity.', hint: 'What is the trade-off when α increases?' },
    { id: 'sl-mc-9', type: 'multiple-choice', question: 'A test at α = 0.05 yields p = 0.04. If α had been set at 0.01, the conclusion would be:', options: [{ id: 'a', text: 'Reject H₀ — p is still small', isCorrect: false, explanation: 'p = 0.04 > α = 0.01. At the 1% level, we fail to reject.' }, { id: 'b', text: 'Fail to reject H₀ — p = 0.04 > α = 0.01', isCorrect: true, explanation: 'p = 0.04 crosses α = 0.05 but not α = 0.01. Different decisions at different significance levels.' }, { id: 'c', text: 'The same — p does not change with α', isCorrect: false, explanation: 'p does not change, but the decision threshold does. The conclusion changes when p falls between 0.01 and 0.05.' }, { id: 'd', text: 'Stronger evidence — lower α means more confidence', isCorrect: false, explanation: 'Lower α is a stricter standard, not stronger evidence. The evidence (p) is unchanged.' }], explanation: 'p = 0.04 > α = 0.01 → fail to reject at 1%. The same result is significant at 5% but not 1%.', hint: 'Compare p = 0.04 to the new α = 0.01.' },
    { id: 'sl-mc-10', type: 'multiple-choice', question: 'What does it mean to "fail to reject H₀" at α = 0.05?', options: [{ id: 'a', text: 'The probability that H₀ is true is at least 95%', isCorrect: false, explanation: 'This confuses the confidence level with P(H₀ true). These are entirely different.' }, { id: 'b', text: 'The data are not sufficiently extreme to reject H₀ at the 5% threshold', isCorrect: true, explanation: 'p > α = 0.05 means the result is not extreme enough to cross the 5% significance threshold.' }, { id: 'c', text: 'The result is definitely not significant', isCorrect: false, explanation: 'Significance is relative to α. The result is not significant at 5% but might be at 10%.' }, { id: 'd', text: 'H₀ has been proven', isCorrect: false, explanation: 'We never prove H₀. Failing to reject just means insufficient evidence against it.' }], explanation: 'Fail to reject H₀ at α = 0.05: p > 0.05. The evidence is insufficient to reject H₀ at this threshold.', hint: 'What does "failing to reject" actually tell us about H₀?' },
    { id: 'sl-mc-11', type: 'multiple-choice', question: 'A researcher conducts 20 independent tests all with true H₀. With α = 0.05, about how many will be incorrectly rejected?', options: [{ id: 'a', text: '0 — the tests are all true nulls', isCorrect: false, explanation: 'Even when H₀ is true, random variation causes about α × n false positives.' }, { id: 'b', text: '≈1', isCorrect: true, explanation: 'Expected false positives = α × n = 0.05 × 20 = 1. About 1 test will incorrectly reject H₀.' }, { id: 'c', text: '10', isCorrect: false, explanation: '10 = 0.5 × 20 — this would require α = 0.5.' }, { id: 'd', text: '20', isCorrect: false, explanation: '20 would mean all tests reject — astronomically unlikely (0.05²⁰) if all H₀s are true and α = 0.05.' }], explanation: 'Expected Type I errors = α × number of true H₀ tests = 0.05 × 20 = 1.', hint: 'Expected false positives = α × number of tests with true H₀.' },
    { id: 'sl-mc-12', type: 'multiple-choice', question: 'The significance level α and the confidence level (1−α) are related. For α = 0.05, the confidence level is:', options: [{ id: 'a', text: '5%', isCorrect: false, explanation: '5% = α. The confidence level = 1 − α.' }, { id: 'b', text: '95%', isCorrect: true, explanation: 'Confidence level = 1 − α = 1 − 0.05 = 0.95 = 95%.' }, { id: 'c', text: '99%', isCorrect: false, explanation: '99% corresponds to α = 0.01.' }, { id: 'd', text: '50%', isCorrect: false, explanation: '50% would mean α = 0.50 — an extremely lenient threshold.' }], explanation: 'Confidence level = 1 − α. At α = 0.05, confidence = 95%.', hint: 'Confidence level + α = 1.' },
    { id: 'sl-mc-13', type: 'multiple-choice', question: 'Which best describes why p = 0.049 is not meaningfully different from p = 0.051?', options: [{ id: 'a', text: 'Both round to 0.05', isCorrect: false, explanation: 'Rounding is irrelevant — the issue is that the bright-line distinction is arbitrary.' }, { id: 'b', text: 'The distinction between p < α and p > α is arbitrary; both values provide nearly identical evidence', isCorrect: true, explanation: 'p = 0.049 and p = 0.051 represent essentially the same level of evidence against H₀. The 0.05 threshold is a convention, not a magical dividing line.' }, { id: 'c', text: 'Both are statistically insignificant', isCorrect: false, explanation: 'p = 0.049 < α = 0.05 → technically significant. The point is that the bright-line matters less than often assumed.' }, { id: 'd', text: 'Neither has a p-value below 0.01', isCorrect: false, explanation: 'The comparison with 0.01 is irrelevant to the question.' }], explanation: 'The 0.05 cut-off is arbitrary. p = 0.049 and p = 0.051 convey nearly identical evidence — treating them as categorically different is misleading.', hint: 'Is there a fundamental statistical difference between 0.049 and 0.051?' },
    { id: 'sl-mc-14', type: 'multiple-choice', question: 'When testing many related hypotheses simultaneously, what adjustment is needed?', options: [{ id: 'a', text: 'Increase α for each test', isCorrect: false, explanation: 'Increasing α per-test would inflate overall false positives even more.' }, { id: 'b', text: 'Apply a multiple testing correction (e.g., Bonferroni: αᵢ = α/m)', isCorrect: true, explanation: 'Bonferroni correction: divide α by the number of tests m. This controls the family-wise error rate.' }, { id: 'c', text: 'Nothing — multiple tests do not affect α', isCorrect: false, explanation: 'Multiple tests inflate the false positive rate. If m = 20 tests each at α = 0.05, expected false positives = 1.' }, { id: 'd', text: 'Use only a two-tailed test', isCorrect: false, explanation: 'Tail choice is unrelated to multiple testing correction.' }], explanation: 'Multiple testing: expected false positives = α × m. Bonferroni: use αᵢ = α/m per test to control the overall rate.', hint: 'What happens to the overall false positive rate when you run many tests at α = 0.05?' },
    { id: 'sl-mc-15', type: 'multiple-choice', question: 'p = 0.001 at α = 0.05. How should you interpret this?', options: [{ id: 'a', text: 'H₀ is almost certainly false', isCorrect: false, explanation: 'p is not P(H₀ false). p = 0.001 means the data are very unlikely under H₀, but p is not the probability that H₀ is false; H₀ could still be true.' }, { id: 'b', text: 'Reject H₀ — the result is highly statistically significant at α = 0.05', isCorrect: true, explanation: 'p = 0.001 << α = 0.05 → reject H₀. Very strong evidence against H₀.' }, { id: 'c', text: 'There is a 0.1% chance H₀ is true', isCorrect: false, explanation: 'This is the transposed-conditional fallacy. p = P(data | H₀) ≠ P(H₀ | data).' }, { id: 'd', text: 'The effect size is very large', isCorrect: false, explanation: 'p is not a measure of effect size. Effect size and significance are distinct concepts.' }], explanation: 'p = 0.001 << α = 0.05 → reject H₀. Highly significant. Does not imply effect size or H₀ probability.', hint: 'Compare p to α. What does a very small p-value mean?' },
  ],
  keyTakeaway:
    'α is the maximum acceptable probability of a false positive (Type I error). Set α = 0.05 by default, lower (0.01) for high-stakes decisions, higher (0.10) when missing real effects is costlier. Always set α before seeing the data.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Alarm Sensitivity" dial:</strong></p>
      <div className="flex items-center gap-3 bg-white border border-violet-200 rounded-lg p-3 text-xs">
        <div className="text-2xl">🔕</div>
        <div className="flex-1 text-center">
          <div className="font-semibold">α = 0.01</div>
          <div className="text-textMuted">Barely goes off<br/>(few false alarms, miss real fires)</div>
        </div>
        <div className="text-lg text-violet-400">←→</div>
        <div className="flex-1 text-center">
          <div className="font-semibold">α = 0.10</div>
          <div className="text-textMuted">Goes off constantly<br/>(catches real fires, many false alarms)</div>
        </div>
        <div className="text-2xl">🔔</div>
      </div>
      <p className="text-xs text-textMuted">Default: α = 0.05 | High-stakes: α = 0.01 | Exploratory: α = 0.10 | NEVER change after seeing data.</p>
    </div>
  ),
  visualization: null,
  datasetGenerator: false,
}

export default function SignificanceLevel({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
