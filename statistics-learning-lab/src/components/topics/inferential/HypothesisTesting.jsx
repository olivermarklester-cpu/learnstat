import TopicPage from '../../layout/TopicPage'

// ── Flowchart viz ─────────────────────────────────────────────────────────────

function HTFlowchart() {
  return (
    <div className="text-sm">
      <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Hypothesis testing framework</p>
      <div className="space-y-2">
        {[
          { num: '1', label: 'State H₀ and H₁', detail: 'Formulate the null and alternative hypotheses about the population parameter.' },
          { num: '2', label: 'Choose significance level α', detail: 'Typically α = 0.05. This is your threshold for rejecting H₀.' },
          { num: '3', label: 'Select the appropriate test', detail: 'z-test, t-test, chi-square… depending on data type and assumptions.' },
          { num: '4', label: 'Collect data and compute the test statistic', detail: 'Summarise how far your sample result is from what H₀ predicts.' },
          { num: '5', label: 'Find the p-value (or critical value)', detail: 'p-value = probability of seeing a result at least this extreme if H₀ is true.' },
          { num: '6', label: 'Make a decision', detail: 'If p ≤ α: reject H₀ ("statistically significant"). If p > α: fail to reject H₀.' },
          { num: '7', label: 'Interpret in context', detail: 'State what the result means in practical terms — never just "reject" or "fail to reject".' },
        ].map(({ num, label, detail }) => (
          <div key={num} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {num}
            </div>
            <div>
              <div className="font-semibold text-textDark">{label}</div>
              <div className="text-xs text-textMuted">{detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Hypothesis Testing',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Describe the logic and steps of hypothesis testing and explain what it means to reject or fail to reject a null hypothesis.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Hypothesis testing</strong> is a systematic method for making decisions about a
        population parameter using sample data. We begin with a default assumption (the null
        hypothesis) and ask: "Is our sample result surprising enough to cast doubt on that assumption?"
      </p>
      <p>
        The core logic mirrors a courtroom: the null hypothesis is "innocent until proven guilty."
        We require sufficient evidence in the data before rejecting it. The level of evidence
        required is set by the <strong>significance level α</strong> (typically 0.05).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Two possible decisions</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>Reject H₀:</strong> The data provide sufficient evidence against the null hypothesis (p ≤ α). The result is "statistically significant."</li>
          <li><strong>Fail to reject H₀:</strong> The data do not provide sufficient evidence against H₀ (p &gt; α). This is NOT proof that H₀ is true — only that the evidence is weak.</li>
        </ul>
      </div>
      <p>
        Important: statistical significance does not automatically mean practical importance.
        A tiny effect can be statistically significant with a large enough sample.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A drug regulator tests whether a new medication actually works. The null hypothesis is
        "this drug has no effect." Clinical trials collect data; if the p-value is below 0.05,
        there is enough evidence to conclude the drug works — and it gets approved. If not,
        there is insufficient evidence, but that does not prove the drug is useless.
      </p>
      <p className="text-sm text-gray-600">
        Just like a "not guilty" verdict does not mean "innocent," "fail to reject H₀" does
        not mean H₀ is true.
      </p>
    </div>
  ),
  formula: {
    main: 'Decision rule: reject H₀ if p ≤ α',
    variants: [
      { label: 'General test statistic', expression: 'test stat = (observed − expected under H₀) / SE', latex: '\\text{test stat} = \\frac{\\hat{\\theta} - \\theta_0}{SE}' },
      { label: 'Decision rule (p-value approach)', expression: 'Reject H₀ if p-value ≤ α', latex: '\\text{Reject } H_0 \\text{ if } p \\leq \\alpha' },
    ],
    symbolGuide: [
      { symbol: 'H₀', meaning: 'Null hypothesis — the default claim assumed true until evidence refutes it' },
      { symbol: 'H₁ (or Hₐ)', meaning: 'Alternative hypothesis — what we are trying to show' },
      { symbol: 'α', meaning: 'Significance level — probability of incorrectly rejecting a true H₀ (Type I error rate)' },
      { symbol: 'p-value', meaning: 'Probability of observing a result at least as extreme as the sample result, assuming H₀ is true' },
      { symbol: 'SE', meaning: 'Standard error of the estimator' },
    ],
  },
  whenToUse: [
    'When you want to decide whether sample data support a specific claim about a population parameter',
    'In scientific research, quality control, A/B testing, clinical trials',
    'When you need a formal yes/no decision (e.g., "does this drug work?" "is this machine calibrated correctly?")',
  ],
  whenNotToUse: [
    'When estimation (how large is the effect?) matters more than a binary decision — use a CI instead',
    'When no pre-specified hypothesis exists — avoid fishing for significance post-hoc',
    'When the cost of each type of error is not considered — adjust α accordingly',
  ],
  assumptions: [
    'The sample is randomly and independently drawn',
    'The appropriate test is chosen for the data type and sample size',
    'α is set before data collection (not after seeing results)',
  ],
  workedExample: {
    scenario:
      'A machine is supposed to fill bags with 500 g of flour. A quality engineer suspects the machine is underfilling. A sample of 36 bags has x̄ = 497 g, σ = 6 g.',
    steps: [
      { stepNumber: 1, label: 'State hypotheses', expression: 'H₀: μ = 500 g vs H₁: μ < 500 g', result: 'One-tailed (left) test', explanation: 'We suspect underfilling, so H₁ points left.' },
      { stepNumber: 2, label: 'Set α', expression: 'α = 0.05', result: 'α = 0.05', explanation: 'Standard significance level.' },
      { stepNumber: 3, label: 'Calculate test statistic', expression: 'z = (497 − 500)/(6/√36) = −3/1 = −3', result: 'z = −3', explanation: 'SE = 1. The sample mean is 3 SEs below the hypothesised mean.' },
      { stepNumber: 4, label: 'Find p-value', expression: 'p = P(Z < −3) ≈ 0.0013', result: 'p ≈ 0.0013', explanation: 'Very small p-value — this result would almost never occur if μ = 500.' },
      { stepNumber: 5, label: 'Make decision', expression: '0.0013 < 0.05 → reject H₀', result: 'Reject H₀', explanation: 'Sufficient evidence of underfilling.' },
    ],
    interpretation:
      'The engineer concludes there is strong evidence (z = −3, p ≈ 0.001) that the machine is underfilling bags. The machine should be recalibrated.',
  },
  interpretation:
    'Hypothesis testing answers: "Is there sufficient evidence to reject the default assumption?" A low p-value means the data are unlikely under H₀ — but always interpret results in context.',
  commonMistakes: [
    { mistake: '"Fail to reject" means H₀ is true', explanation: 'It only means the evidence is insufficient. H₀ could still be false — perhaps the sample was too small to detect the effect.' },
    { mistake: 'Setting α after seeing the data', explanation: 'Choosing α post-hoc inflates the Type I error rate. Always set α before collecting data.' },
    { mistake: 'Treating statistical significance as practical importance', explanation: 'With large samples, trivially small effects can be statistically significant. Always assess effect size.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'ht-easy-1', scenario: 'A test yields p = 0.03, α = 0.05.', question: 'Do you reject H₀? Why?', hint: 'Compare p to α.', solution: 'Yes — reject H₀. Since p (0.03) ≤ α (0.05), the result is statistically significant.' },
    ],
    moderate: [
      { id: 'ht-mod-1', scenario: 'A new teaching method is trialled. H₀: μ = 70, H₁: μ ≠ 70 (two-tailed). p = 0.08, α = 0.05.', question: 'Decision? Can we conclude the new method is ineffective?', hint: 'Compare p to α, then interpret carefully.', solution: 'Fail to reject H₀ (p = 0.08 > 0.05). We cannot conclude the method differs from the standard. This does not mean it is ineffective — the sample may lack power.' },
    ],
    challenging: [
      { id: 'ht-chal-1', scenario: 'A pharmaceutical company tests two drugs. Trial 1: p = 0.049. Trial 2: p = 0.051 (both vs α = 0.05).', question: 'Critically evaluate the practice of treating these two results as categorically different (significant vs not significant).', hint: 'Think about what the p-values actually mean and the arbitrariness of the cutoff.', solution: 'p = 0.049 and p = 0.051 represent virtually identical evidence against H₀. The bright-line 0.05 cutoff is a convention, not a law of nature. Both results should be reported with effect sizes and confidence intervals. Binary yes/no decisions based on a hair\'s difference in p-values are misleading.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ht-kc-1', type: 'multiple-choice',
      question: 'A hypothesis test gives p = 0.02 with α = 0.05. What is the correct conclusion?',
      options: [
        { id: 'a', text: 'Fail to reject H₀ — the evidence is weak', isCorrect: false, explanation: 'p = 0.02 < 0.05 — the evidence is actually sufficient to reject H₀.' },
        { id: 'b', text: 'Reject H₀ — the result is statistically significant', isCorrect: true, explanation: 'Correct! p (0.02) ≤ α (0.05), so we reject H₀.' },
        { id: 'c', text: 'H₀ is proven to be false', isCorrect: false, explanation: 'Rejecting H₀ does not prove it is false — only that the evidence is inconsistent with it.' },
        { id: 'd', text: 'H₁ is proven to be true', isCorrect: false, explanation: 'Hypothesis tests never prove anything — they assess evidence.' },
      ],
      explanation: 'p ≤ α → reject H₀ (statistically significant). Never "prove" H₀ or H₁.',
      hint: 'Is p smaller than α?',
    },
    {
      id: 'ht-kc-2', type: 'multiple-choice',
      question: 'What does "fail to reject H₀" mean?',
      options: [
        { id: 'a', text: 'H₀ is true', isCorrect: false, explanation: '"Fail to reject" means insufficient evidence, not proof of truth.' },
        { id: 'b', text: 'The data provide insufficient evidence to reject H₀', isCorrect: true, explanation: 'Correct! We cannot rule out H₀ based on this data, but H₀ could still be false.' },
        { id: 'c', text: 'H₁ is false', isCorrect: false, explanation: 'Failing to reject H₀ does not tell us anything definitive about H₁.' },
        { id: 'd', text: 'The test was done incorrectly', isCorrect: false, explanation: '"Fail to reject" is a legitimate and common outcome of hypothesis tests.' },
      ],
      explanation: '"Fail to reject" ≠ "accept H₀". It means the evidence is insufficient.',
      hint: 'Think of a jury returning "not guilty" — not the same as "innocent".',
    },
    {
      id: 'ht-kc-3', type: 'multiple-choice',
      question: 'A company runs an A/B test. p = 0.001, α = 0.05. The conversion rate increased by 0.01%. Should they roll out the new design?',
      options: [
        { id: 'a', text: 'Yes — p < 0.05 means the result is real', isCorrect: false, explanation: 'Statistical significance does not guarantee practical importance. A 0.01% lift may not justify the cost.' },
        { id: 'b', text: 'No — p < 0.05 means the result is wrong', isCorrect: false, explanation: 'p < 0.05 actually supports rejecting H₀ — but statistical significance ≠ practical value.' },
        { id: 'c', text: 'The statistical significance should be evaluated alongside the practical effect size', isCorrect: true, explanation: 'Correct! With large samples even tiny effects become significant. Always ask: "Is 0.01% lift worth anything?"' },
        { id: 'd', text: 'You need to re-run the test with a different α', isCorrect: false, explanation: 'Changing α post-hoc to question the result is p-hacking in reverse.' },
      ],
      explanation: 'Statistical significance ≠ practical importance. With very large samples, trivially small effects can produce tiny p-values.',
      hint: 'p-value tells you about evidence, not about size of effect.',
    },
    {
      id: 'ht-kc-4', type: 'multiple-choice',
      question: 'Which step in hypothesis testing MUST happen before data collection?',
      options: [
        { id: 'a', text: 'Calculating the p-value', isCorrect: false, explanation: 'p-value is calculated from the data — must come after collection.' },
        { id: 'b', text: 'Setting H₀, H₁, and α', isCorrect: true, explanation: 'Correct! Hypotheses and α must be pre-specified to maintain the integrity of the test.' },
        { id: 'c', text: 'Computing the test statistic from the sample', isCorrect: false, explanation: 'The test statistic is computed from the collected data, so it comes after data collection.' },
        { id: 'd', text: 'Interpreting the result in context', isCorrect: false, explanation: 'Interpretation happens after the test.' },
      ],
      explanation: 'Pre-specifying H₀, H₁, and α before data collection is the foundation of valid hypothesis testing.',
      hint: 'What would happen to error rates if you set α after seeing the data?',
    },
    {
      id: 'ht-kc-5', type: 'multiple-choice',
      question: 'p = 0.06, α = 0.05. A colleague says "this is almost significant — let\'s raise α to 0.10." What is wrong with this?',
      options: [
        { id: 'a', text: 'Nothing — α = 0.10 is a valid choice', isCorrect: false, explanation: 'α = 0.10 is valid if chosen before seeing the data. Choosing it after seeing p = 0.06 to force significance is p-hacking.' },
        { id: 'b', text: 'Changing α after seeing the data inflates the Type I error rate', isCorrect: true, explanation: 'Correct! Post-hoc adjustment of α is a form of p-hacking and invalidates the test.' },
        { id: 'c', text: 'α can never be 0.10', isCorrect: false, explanation: 'α = 0.10 is perfectly valid when pre-specified.' },
        { id: 'd', text: 'The p-value would become invalid', isCorrect: false, explanation: 'The p-value remains the same — the problem is the process, not the math.' },
      ],
      explanation: 'α must be set before data collection. Adjusting it post-hoc to achieve significance is p-hacking.',
      hint: 'The colleague is changing the rules after seeing the score.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ht-tf-1', type: 'true-false', question: 'The null hypothesis H₀ is the hypothesis we are trying to prove.', isTrue: false, explanation: 'H₀ is the default "no effect" assumption we attempt to reject. We cannot prove H₀ — we can only fail to reject it.' },
    { id: 'ht-tf-2', type: 'true-false', question: 'Rejecting H₀ proves the alternative hypothesis H₁ is true.', isTrue: false, explanation: 'Rejecting H₀ means the data are inconsistent with H₀ at significance level α. It provides evidence for H₁, but does not prove it.' },
    { id: 'ht-tf-3', type: 'true-false', question: 'The significance level α must be set before data collection.', isTrue: true, explanation: 'Setting α after seeing the data is p-hacking. α must be pre-specified to maintain the validity of the test.' },
    { id: 'ht-tf-4', type: 'true-false', question: 'A p-value of 0.04 at α = 0.05 means we reject H₀.', isTrue: true, explanation: 'p = 0.04 < α = 0.05 → reject H₀. The result is statistically significant.' },
    { id: 'ht-tf-5', type: 'true-false', question: '"Failing to reject H₀" means H₀ is true.', isTrue: false, explanation: 'Failing to reject H₀ means we do not have sufficient evidence against it. H₀ may still be false — we just cannot detect it with this test.' },
    { id: 'ht-tf-6', type: 'true-false', question: 'Statistical significance implies practical significance.', isTrue: false, explanation: 'With a large enough n, even tiny, practically unimportant differences become statistically significant. Always assess effect size too.' },
    { id: 'ht-tf-7', type: 'true-false', question: 'The test statistic measures how far the sample result is from what H₀ predicts.', isTrue: true, explanation: 'Test statistics like z = (x̄ − μ₀)/SE quantify the discrepancy between the observed data and the null hypothesis.' },
    { id: 'ht-tf-8', type: 'true-false', question: 'A very small p-value means the effect is large.', isTrue: false, explanation: 'A small p-value means the result is unlikely under H₀. Effect size (how large the difference is) is a separate question.' },
    { id: 'ht-tf-9', type: 'true-false', question: 'The p-value is the probability that H₀ is true.', isTrue: false, explanation: 'The p-value is P(data this extreme | H₀ is true) — not P(H₀ is true | data). H₀ is either true or false.' },
    { id: 'ht-tf-10', type: 'true-false', question: 'Hypothesis testing can be used for one sample, two samples, and multiple groups.', isTrue: true, explanation: 'One-sample t-test, two-sample t-test, ANOVA — hypothesis testing frameworks exist for all these scenarios.' },
    { id: 'ht-tf-11', type: 'true-false', question: 'Increasing α from 0.05 to 0.10 makes it harder to reject H₀.', isTrue: false, explanation: 'Larger α means a less strict threshold — it becomes EASIER to reject H₀ (more false positives accepted).' },
    { id: 'ht-tf-12', type: 'true-false', question: 'A one-tailed test should be used when you have a prior directional hypothesis.', isTrue: true, explanation: 'One-tailed tests are appropriate when theory or prior knowledge specifies the direction of the effect before data collection.' },
    { id: 'ht-tf-13', type: 'true-false', question: 'Hypothesis testing provides direct probability that the research hypothesis is true.', isTrue: false, explanation: 'Frequentist hypothesis testing only quantifies how unlikely the observed data are under H₀. It does not give P(H₁ is true).' },
    { id: 'ht-tf-14', type: 'true-false', question: 'A test statistic that falls in the rejection region leads to rejecting H₀.', isTrue: true, explanation: 'The rejection region is defined by the critical value(s). For a two-tailed test, if |test stat| ≥ critical value, we reject H₀.' },
    { id: 'ht-tf-15', type: 'true-false', question: 'A two-tailed z-test of H₀: μ = μ₀ at α = 0.05 and the 95% confidence interval for μ always lead to the same conclusion.', isTrue: true, explanation: 'They are equivalent: if μ₀ is outside the 95% CI, the two-tailed z-test rejects H₀ at α = 0.05 — and vice versa.' },
    { id: 'ht-tf-16', type: 'true-false', question: 'P-hacking is the practice of choosing α, the hypothesis, or analysis method after seeing the results.', isTrue: true, explanation: 'P-hacking inflates the false-positive rate. All analytical choices must be pre-specified to maintain α.' },
    { id: 'ht-tf-17', type: 'true-false', question: 'The steps of hypothesis testing should be followed in order — in particular, H₀, H₁, and α are fixed before the data are analysed.', isTrue: true, explanation: 'H₀/H₁ → α → collect data → test statistic/p-value → decision. Deviating from this order (e.g., setting α after) invalidates the test.' },
    { id: 'ht-tf-18', type: 'true-false', question: 'A study with p = 0.051 gives "no evidence" against H₀, while p = 0.049 gives "strong evidence."', isTrue: false, explanation: 'The cut-off is arbitrary. p = 0.051 and p = 0.049 provide nearly identical evidence. Treating α = 0.05 as a bright line is misleading.' },
    { id: 'ht-tf-19', type: 'true-false', question: 'Effect size measures the magnitude of an effect, independent of sample size.', isTrue: true, explanation: 'Cohen\'s d, r², etc. measure how large an effect is. Unlike p-values, they do not depend on n.' },
    { id: 'ht-tf-20', type: 'true-false', question: 'A hypothesis test with α = 0.05 guarantees no more than a 5% chance of making an error.', isTrue: false, explanation: 'α = 0.05 controls only the Type I error rate (false positives) — not the Type II error (false negatives) or overall error rate.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ht-mc-6', type: 'multiple-choice', question: 'A researcher finds p = 0.03 with α = 0.05. What is the correct conclusion?', options: [{ id: 'a', text: 'Fail to reject H₀ — 0.03 is a small number', isCorrect: false, explanation: 'p < α means we reject H₀. Smallness of p relative to α is what matters.' }, { id: 'b', text: 'Reject H₀ — the result is statistically significant', isCorrect: true, explanation: 'p = 0.03 < α = 0.05 → reject H₀. The evidence is inconsistent with H₀ at the 5% level.' }, { id: 'c', text: 'The effect is large', isCorrect: false, explanation: 'p-value tells you statistical significance, not effect size.' }, { id: 'd', text: 'Accept H₀ — 0.03 is not extreme enough', isCorrect: false, explanation: 'p = 0.03 < 0.05 → reject H₀. We never "accept" H₀.' }], explanation: 'p = 0.03 < α = 0.05 → reject H₀. Result is statistically significant.', hint: 'Compare p to α: reject H₀ when p ≤ α.' },
    { id: 'ht-mc-7', type: 'multiple-choice', question: 'The null hypothesis H₀: μ = 50 vs H₁: μ ≠ 50. This is:', options: [{ id: 'a', text: 'A one-tailed test', isCorrect: false, explanation: 'H₁: μ ≠ 50 uses ≠, which is non-directional → two-tailed test.' }, { id: 'b', text: 'A two-tailed test', isCorrect: true, explanation: 'H₁ uses ≠ (not equal), which tests for a difference in either direction — two-tailed.' }, { id: 'c', text: 'A paired test', isCorrect: false, explanation: 'Paired tests compare two related measurements. This is a one-sample test.' }, { id: 'd', text: 'An ANOVA test', isCorrect: false, explanation: 'ANOVA compares three or more group means. This is a simple one-sample hypothesis test.' }], explanation: 'H₁: μ ≠ 50 is non-directional → two-tailed test.' , hint: 'What symbol in H₁ determines one vs two tails?' },
    { id: 'ht-mc-8', type: 'multiple-choice', question: 'A test gives p = 0.001. Which statement is most accurate?', options: [{ id: 'a', text: 'The effect is very large', isCorrect: false, explanation: 'p = 0.001 means highly significant — but significance is not the same as effect size.' }, { id: 'b', text: 'The result is very unlikely if H₀ is true, providing strong evidence against H₀', isCorrect: true, explanation: 'p = 0.001 means such extreme data occur only 0.1% of the time under H₀ — very strong evidence against H₀.' }, { id: 'c', text: 'H₀ has only a 0.1% chance of being true', isCorrect: false, explanation: 'p-value ≠ P(H₀ is true). p = P(data | H₀ true).' }, { id: 'd', text: 'The sample size is large', isCorrect: false, explanation: 'p depends on both effect size and n. Small p alone does not tell us about n.' }], explanation: 'p = P(data this extreme | H₀ true) = 0.001. Very strong evidence against H₀.', hint: 'What does a very small p-value tell you about the data under H₀?' },
    { id: 'ht-mc-9', type: 'multiple-choice', question: 'A study finds a "statistically significant" reduction in blood pressure of 0.5 mmHg (p = 0.001). What is the most important concern?', options: [{ id: 'a', text: 'The p-value is too small to be meaningful', isCorrect: false, explanation: 'p-values do not have a "too small" threshold — the concern here is about effect size.' }, { id: 'b', text: 'Statistical significance does not imply clinical importance — a 0.5 mmHg reduction may be trivial', isCorrect: true, explanation: 'With a very large sample, even tiny effects are statistically significant. A 0.5 mmHg change has no clinical relevance.' }, { id: 'c', text: 'The study should have used a higher α', isCorrect: false, explanation: 'p = 0.001 is well below 0.05 — there is no need to change α.' }, { id: 'd', text: 'The null hypothesis cannot be rejected', isCorrect: false, explanation: 'p = 0.001 < 0.05 → we do reject H₀. The issue is practical, not statistical.' }], explanation: 'Statistical significance ≠ practical significance. With n large enough, even clinically trivial effects become significant.', hint: 'Does statistical significance always translate to real-world importance?' },
    { id: 'ht-mc-10', type: 'multiple-choice', question: 'Which statement about "failing to reject H₀" is correct?', options: [{ id: 'a', text: 'H₀ has been proven true', isCorrect: false, explanation: 'We never prove H₀. We simply lack sufficient evidence to reject it.' }, { id: 'b', text: 'The data are consistent with H₀ but H₀ could still be false', isCorrect: true, explanation: 'Failing to reject means insufficient evidence against H₀ — the effect may exist but be too small or the sample too small to detect.' }, { id: 'c', text: 'The experiment should be repeated', isCorrect: false, explanation: 'Repeating just because you failed to reject H₀ is not appropriate without justification.' }, { id: 'd', text: 'The alternative hypothesis H₁ is false', isCorrect: false, explanation: 'Failing to reject H₀ provides no evidence about H₁\'s truth.' }], explanation: 'Failing to reject H₀ does not establish its truth — absence of evidence ≠ evidence of absence.', hint: 'What does "insufficient evidence" actually mean?' },
    { id: 'ht-mc-11', type: 'multiple-choice', question: 'What is the purpose of the significance level α in hypothesis testing?', options: [{ id: 'a', text: 'To measure the size of the effect', isCorrect: false, explanation: 'Effect size is measured separately (e.g., Cohen\'s d). α sets the decision threshold.' }, { id: 'b', text: 'To set the maximum acceptable probability of a Type I error (false positive)', isCorrect: true, explanation: 'α = P(reject H₀ | H₀ is true). It controls how often we incorrectly declare significance.' }, { id: 'c', text: 'To determine the minimum sample size', isCorrect: false, explanation: 'Sample size calculation involves both α and β (power). α alone does not determine n.' }, { id: 'd', text: 'To define the p-value', isCorrect: false, explanation: 'The p-value is computed from the data. α is a pre-chosen threshold, not the p-value.' }], explanation: 'α sets the tolerance for Type I error — the probability of rejecting a true H₀.', hint: 'What type of error does α control?' },
    { id: 'ht-mc-12', type: 'multiple-choice', question: 'A hypothesis test has p = 0.20. The researcher reports "H₀ is likely true." Is this correct?', options: [{ id: 'a', text: 'Yes — high p-value means H₀ is probably true', isCorrect: false, explanation: 'p = 0.20 means P(data | H₀) = 0.20. It does not mean P(H₀ | data) = 0.80.' }, { id: 'b', text: 'No — p = 0.20 means we lack evidence against H₀, not that H₀ is likely true', isCorrect: true, explanation: 'Failing to reject H₀ does not make it likely. The test may just be underpowered.' }, { id: 'c', text: 'Only if the sample is large', isCorrect: false, explanation: 'The misinterpretation does not depend on sample size.' }, { id: 'd', text: 'Yes — p > 0.05 always confirms H₀', isCorrect: false, explanation: 'p > 0.05 means fail to reject — not confirm.' }], explanation: 'High p-value = weak evidence against H₀. This is not the same as evidence FOR H₀.', hint: 'Is "no evidence against" the same as "evidence for"?' },
    { id: 'ht-mc-13', type: 'multiple-choice', question: 'What is the relationship between a hypothesis test and a confidence interval?', options: [{ id: 'a', text: 'They are unrelated procedures', isCorrect: false, explanation: 'They are mathematically equivalent for the same α and confidence level.' }, { id: 'b', text: 'If μ₀ falls outside the 95% CI, the two-tailed z-test rejects H₀ at α = 0.05', isCorrect: true, explanation: 'CI and hypothesis test are equivalent: rejecting H₀: μ = μ₀ at α = 0.05 is identical to μ₀ being outside the 95% CI.' }, { id: 'c', text: 'Confidence intervals are always wider than hypothesis tests allow', isCorrect: false, explanation: 'This is not a meaningful comparison.' }, { id: 'd', text: 'A confidence interval provides a p-value', isCorrect: false, explanation: 'CIs do not directly provide p-values, though they give equivalent information.' }], explanation: 'The 95% CI and the two-tailed α = 0.05 hypothesis test are equivalent: μ₀ outside CI ↔ reject H₀.', hint: 'What is the connection between CI level and α?' },
    { id: 'ht-mc-14', type: 'multiple-choice', question: 'A researcher changes α from 0.05 to 0.01 after seeing p = 0.03. Why is this problematic?', options: [{ id: 'a', text: 'α = 0.01 is not a valid significance level', isCorrect: false, explanation: 'α = 0.01 is perfectly valid — the problem is changing it after seeing the data.' }, { id: 'b', text: 'Changing α post-hoc is p-hacking and inflates the Type I error rate', isCorrect: true, explanation: 'Pre-specifying α protects the Type I error rate. Changing it after seeing data to avoid significance is manipulative.' }, { id: 'c', text: 'The p-value changes when α changes', isCorrect: false, explanation: 'The p-value is fixed by the data and test statistic. Changing α does not change p.' }, { id: 'd', text: 'This makes the test more conservative, which is always good', isCorrect: false, explanation: 'The issue is not conservatism — it is the post-hoc manipulation of the decision rule.' }], explanation: 'α must be chosen before data collection. Post-hoc changes exploit the data and invalidate the test.', hint: 'Why must α be set before collecting data?' },
    { id: 'ht-mc-15', type: 'multiple-choice', question: 'Which is the correct order of hypothesis testing steps?', options: [{ id: 'a', text: 'Collect data → state H₀ → set α → compute p → decide', isCorrect: false, explanation: 'H₀ and α must be set BEFORE data collection, not after.' }, { id: 'b', text: 'State H₀ and H₁ → set α → collect data → compute test statistic and p → decide', isCorrect: true, explanation: 'This is the correct order. Setting H₀, H₁, and α before data collection is essential.' }, { id: 'c', text: 'Compute p → set α → decide → state H₀', isCorrect: false, explanation: 'Completely backwards — p and α must be computed/set before the decision.' }, { id: 'd', text: 'Set α = 0.05 → collect data → if p < 0.05 claim success', isCorrect: false, explanation: 'Missing the hypotheses specification step and oversimplifying the conclusion.' }], explanation: 'Correct order: H₀, H₁ → α → data → test stat & p → decision.', hint: 'What must come before data collection?' },
  ],
  keyTakeaway:
    'Hypothesis testing: state H₀ and H₁ → set α → collect data → compute test statistic and p-value → reject H₀ if p ≤ α. "Fail to reject" is not proof of H₀. Statistical significance ≠ practical importance.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Criminal Trial" map:</strong></p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs space-y-1">
        {[
          ['H₀', 'Presumed innocent'],
          ['H₁', 'Accused of a crime'],
          ['Evidence (data)', 'Testimony & exhibits'],
          ['α', 'Required standard of proof'],
          ['p ≤ α → Reject H₀', '"Guilty" — conviction'],
          ['p > α → Fail to reject', '"Not guilty" (≠ innocent)'],
        ].map(([left, right]) => (
          <div key={left} className="flex gap-2"><span className="font-mono text-violet-700 w-32 shrink-0">{left}</span><span className="text-textMuted">{right}</span></div>
        ))}
      </div>
      <p className="text-xs text-textMuted">Key: "Not guilty" ≠ "innocent" — "Fail to reject H₀" ≠ "H₀ is true".</p>
    </div>
  ),
  visualization: <HTFlowchart />,
  datasetGenerator: false,
}

export default function HypothesisTesting({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
