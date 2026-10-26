import TopicPage from '../../layout/TopicPage'

const content = {
  title: 'Null and Alternative Hypotheses',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Write correct null and alternative hypotheses for a variety of research questions, and explain the role each plays in hypothesis testing.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        Every hypothesis test involves two competing statements about a population parameter:
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm space-y-2">
        <div>
          <p className="font-semibold text-blue-900">Null hypothesis (H₀)</p>
          <p className="text-blue-800">
            The default claim — usually a statement of "no effect," "no difference," or a
            specific parameter value. H₀ is assumed true until evidence refutes it.
          </p>
        </div>
        <div>
          <p className="font-semibold text-blue-900">Alternative hypothesis (H₁ or Hₐ)</p>
          <p className="text-blue-800">
            The research claim — what the investigator is trying to demonstrate. It is
            supported only if there is sufficient evidence against H₀.
          </p>
        </div>
      </div>
      <p>
        The hypotheses must be <strong>mutually exclusive</strong> and together must cover
        all possibilities. H₀ always contains an equality (=, ≤, ≥). H₁ contains an
        inequality (&lt;, &gt;, ≠). For one-tailed tests, H₀ is often written with "=" but is understood
        as ≤ (right-tailed) or ≥ (left-tailed) so the pair covers all possibilities.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">Three forms</p>
        <ul className="space-y-1 text-amber-800 font-mono text-xs">
          <li>Two-tailed:  H₀: μ = μ₀  vs  H₁: μ ≠ μ₀</li>
          <li>Left-tailed: H₀: μ = μ₀  vs  H₁: μ &lt; μ₀</li>
          <li>Right-tailed: H₀: μ = μ₀  vs  H₁: μ &gt; μ₀</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        In a criminal trial, H₀ = "the defendant is innocent" (presumed). H₁ = "the defendant
        is guilty" (what the prosecution is trying to demonstrate). Evidence must be compelling
        to convict (reject H₀). If evidence is weak, the defendant is acquitted — not declared
        innocent, merely "not proven guilty."
      </p>
    </div>
  ),
  formula: {
    main: 'H₀ always contains "=" | H₁ contains "<", ">", or "≠"',
    variants: [
      { label: 'Two-tailed', expression: 'H₀: μ = μ₀   H₁: μ ≠ μ₀', latex: 'H_0: \\mu = \\mu_0 \\quad H_1: \\mu \\neq \\mu_0' },
      { label: 'One-tailed (left)', expression: 'H₀: μ = μ₀   H₁: μ < μ₀', latex: 'H_0: \\mu = \\mu_0 \\quad H_1: \\mu < \\mu_0' },
      { label: 'One-tailed (right)', expression: 'H₀: μ = μ₀   H₁: μ > μ₀', latex: 'H_0: \\mu = \\mu_0 \\quad H_1: \\mu > \\mu_0' },
    ],
    symbolGuide: [
      { symbol: 'H₀', meaning: 'Null hypothesis — the default, assumed-true statement' },
      { symbol: 'H₁ / Hₐ', meaning: 'Alternative hypothesis — the research claim to be tested' },
      { symbol: 'μ₀', meaning: 'The specific population mean value specified in H₀' },
      { symbol: '≠', meaning: 'Not equal — used in two-tailed tests' },
    ],
  },
  whenToUse: [
    'As the very first step in every hypothesis test',
    'When a research question can be framed as a claim about a population parameter',
  ],
  whenNotToUse: [
    'Do not formulate H₁ after seeing the data — that inflates false-positive rates',
    'Avoid vague H₀ statements like "there might be an effect"',
  ],
  assumptions: [
    'The hypotheses are about population parameters, not sample statistics',
    'H₀ and H₁ are mutually exclusive and collectively exhaustive',
    'Hypotheses are set before data collection',
  ],
  workedExample: {
    scenario: 'A researcher wants to find evidence that an energy drink improves reaction time by less than 5 ms on average. Population parameter: μ = mean improvement in reaction time.',
    steps: [
      { stepNumber: 1, label: 'Identify the claim being tested', expression: "Research claim: μ < 5 ms improvement", result: 'This is the research claim (H₁)', explanation: 'The researcher is trying to show that the mean improvement is below 5 ms.' },
      { stepNumber: 2, label: 'State H₀', expression: 'H₀: μ = 5 ms  (or μ ≥ 5 ms)', result: 'H₀: μ ≥ 5', explanation: 'The null is the boundary case — the mean improvement is 5 ms or more.' },
      { stepNumber: 3, label: 'State H₁', expression: 'H₁: μ < 5 ms', result: 'Left-tailed test', explanation: 'The researcher tests whether the true mean improvement is less than 5 ms.' },
    ],
    interpretation:
      'The test is left-tailed. If data show a sample mean improvement well below 5 ms, there is evidence against H₀ and in support of H₁: the true mean improvement is less than 5 ms.',
  },
  interpretation:
    'Well-stated hypotheses make the rest of the test mechanical. Always tie them to a specific population parameter, write H₀ with equality, and choose the direction of H₁ based on the research question — not the data.',
  commonMistakes: [
    { mistake: 'Writing H₁ with "=" instead of inequality', explanation: 'H₁ must always specify a direction or inequality (≠, <, >). Equality belongs in H₀.' },
    { mistake: 'Putting the research claim in H₀', explanation: 'H₀ is the default status quo. The claim you are trying to prove goes in H₁.' },
    { mistake: 'Choosing H₁ after seeing results', explanation: 'This practice inflates false positive rates — it is called "p-hacking." Always specify H₁ before collecting data.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'null-easy-1', scenario: 'A researcher wants to test whether the average salary of graduates is different from $50,000.', question: 'Write H₀ and H₁.', hint: '"Different from" implies a two-tailed test.', solution: 'H₀: μ = $50,000   H₁: μ ≠ $50,000.' },
      { id: 'null-easy-2', scenario: 'A gym claims its new workout programme reduces resting heart rate.', question: 'Write H₀ and H₁ (let μ = mean reduction).', hint: 'Reducing = getting smaller. What direction?', solution: 'H₀: μ = 0 (no reduction)   H₁: μ > 0 (positive reduction). Or equivalently H₀: μ ≤ 0, H₁: μ > 0.' },
    ],
    moderate: [
      { id: 'null-mod-1', scenario: 'An engineer believes a new manufacturing process produces parts with a diameter of less than 5 cm (specification).', question: 'Identify H₀, H₁, and test direction.', hint: 'Less than 5 → left-tailed.', solution: 'H₀: μ = 5 cm   H₁: μ < 5 cm. Left-tailed test.' },
    ],
    challenging: [
      { id: 'null-chal-1', scenario: 'A data analyst sees a positive trend in preliminary data and writes H₁: μ > 10 after peeking.', question: 'Explain the problem and how it should have been done.', hint: 'Think about researcher degrees of freedom and false-positive rates.', solution: 'Writing H₁ after seeing data is p-hacking. It inflates Type I error: the analyst chose the direction because the data pointed that way. H₁ should be set before data collection based on the research question, not the sample.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'null-kc-1', type: 'multiple-choice',
      question: 'Which of the following is a valid null hypothesis?',
      options: [
        { id: 'a', text: 'H₀: μ ≠ 10', isCorrect: false, explanation: 'H₀ must contain equality (=). "≠" belongs in H₁.' },
        { id: 'b', text: 'H₀: μ = 10', isCorrect: true, explanation: 'Correct! H₀ always contains an equality statement.' },
        { id: 'c', text: 'H₀: μ > 10', isCorrect: false, explanation: '">" is an inequality — this belongs in H₁, not H₀.' },
        { id: 'd', text: 'H₀: x̄ = 10', isCorrect: false, explanation: 'Hypotheses are about population parameters (μ), not sample statistics (x̄).' },
      ],
      explanation: 'H₀ must use "=" (or ≤/≥ as the boundary case). H₁ uses <, >, or ≠.',
      hint: 'The null hypothesis always contains an equality.',
    },
    {
      id: 'null-kc-2', type: 'multiple-choice',
      question: 'A researcher wants to test if a coin is biased. What are the hypotheses?',
      options: [
        { id: 'a', text: 'H₀: p = 0.5,  H₁: p > 0.5', isCorrect: false, explanation: 'Testing only for bias in one direction; the researcher should test for any bias.' },
        { id: 'b', text: 'H₀: p = 0.5,  H₁: p ≠ 0.5', isCorrect: true, explanation: 'Correct! Two-tailed test — bias could be heads-heavy or tails-heavy.' },
        { id: 'c', text: 'H₀: p ≠ 0.5,  H₁: p = 0.5', isCorrect: false, explanation: 'These are reversed — H₀ must contain "=".' },
        { id: 'd', text: 'H₀: p = 0.5,  H₁: p < 0.5', isCorrect: false, explanation: 'Only tests for the coin favouring tails, not general bias.' },
      ],
      explanation: '"Is the coin biased?" is a two-tailed question — we test for any deviation from 0.5.',
      hint: 'Biased could mean too many heads OR too many tails.',
    },
    {
      id: 'null-kc-3', type: 'multiple-choice',
      question: 'A doctor believes a new drug lowers cholesterol BELOW 200 mg/dL. What is H₁?',
      options: [
        { id: 'a', text: 'H₁: μ ≠ 200', isCorrect: false, explanation: '≠ would be used if any change (up or down) was of interest. Here we expect a reduction.' },
        { id: 'b', text: 'H₁: μ < 200', isCorrect: true, explanation: 'Correct! The doctor expects cholesterol to be lower than 200, so H₁: μ < 200 (left-tailed).' },
        { id: 'c', text: 'H₁: μ > 200', isCorrect: false, explanation: 'That would mean expecting cholesterol to rise — opposite of the doctor\'s belief.' },
        { id: 'd', text: 'H₁: μ = 200', isCorrect: false, explanation: 'H₁ never contains equality.' },
      ],
      explanation: 'The direction of H₁ matches the direction of the expected effect. "Lowers below" → μ < 200.',
      hint: 'Which direction does "lowers below 200" point?',
    },
    {
      id: 'null-kc-4', type: 'multiple-choice',
      question: 'H₀: μ = 50, H₁: μ ≠ 50. A researcher gets p = 0.03. What do they conclude?',
      options: [
        { id: 'a', text: 'The population mean is definitely not 50', isCorrect: false, explanation: 'We never "prove" H₀ false — we only find evidence inconsistent with it.' },
        { id: 'b', text: 'Reject H₀ — there is evidence the mean differs from 50', isCorrect: true, explanation: 'Correct! p = 0.03 < 0.05 → reject H₀. There is evidence that μ ≠ 50.' },
        { id: 'c', text: 'Accept H₁ — the mean equals 50', isCorrect: false, explanation: 'H₁ says μ ≠ 50 — this reverses H₀ and H₁.' },
        { id: 'd', text: 'Fail to reject H₀ because p is close to 0.05', isCorrect: false, explanation: 'p = 0.03 is less than α = 0.05 — we reject H₀.' },
      ],
      explanation: 'p = 0.03 < α = 0.05 → reject H₀. Conclusion: evidence that μ differs from 50.',
      hint: 'Compare p to α = 0.05.',
    },
    {
      id: 'null-kc-5', type: 'multiple-choice',
      question: 'Why must hypotheses be set BEFORE data collection?',
      options: [
        { id: 'a', text: 'It makes the analysis faster', isCorrect: false, explanation: 'Speed is not the reason.' },
        { id: 'b', text: 'To prevent choosing H₁ based on the data, which inflates false-positive rates', isCorrect: true, explanation: 'Correct! Post-hoc hypothesis selection (HARKing — Hypothesising After Results Known) is a major source of false positives.' },
        { id: 'c', text: 'Because the data has not been collected yet', isCorrect: false, explanation: 'This is trivially true but not the statistical reason.' },
        { id: 'd', text: 'To ensure the p-value is small', isCorrect: false, explanation: 'Pre-specifying hypotheses does not affect p-value size — it protects the validity of the test.' },
      ],
      explanation: 'Pre-specification prevents p-hacking and HARKing. Tests are only valid when H₀, H₁, and α are fixed before seeing results.',
      hint: 'What would a researcher do if they could choose H₁ after seeing the data?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'nah-tf-1', type: 'true-false', question: 'The null hypothesis H₀ always contains an equality (=) sign.', isTrue: true, explanation: 'H₀ always specifies a specific value or equality: H₀: μ = 50, μ₁ = μ₂, etc. The inequality goes in H₁.' },
    { id: 'nah-tf-2', type: 'true-false', question: 'The alternative hypothesis H₁ can use <, >, or ≠ depending on the research question.', isTrue: true, explanation: 'H₁: μ > μ₀ (one-tailed right), H₁: μ < μ₀ (one-tailed left), H₁: μ ≠ μ₀ (two-tailed). The choice reflects the research question.' },
    { id: 'nah-tf-3', type: 'true-false', question: 'You can choose H₀ and H₁ after seeing the data if the pattern is obvious.', isTrue: false, explanation: 'Hypotheses must be stated before data collection. Choosing them after seeing data (HARKing) inflates false positives.' },
    { id: 'nah-tf-4', type: 'true-false', question: 'The null hypothesis represents the "status quo" or "no change" position.', isTrue: true, explanation: 'H₀ embodies the conservative default: no effect, no difference, no change. Evidence must overcome this default to claim otherwise.' },
    { id: 'nah-tf-5', type: 'true-false', question: 'If we fail to reject H₀, we have proven that H₀ is true.', isTrue: false, explanation: 'We never prove H₀. Failing to reject only means insufficient evidence against it — H₀ remains the working assumption, not a proven fact.' },
    { id: 'nah-tf-6', type: 'true-false', question: 'H₁: μ > 100 is a one-tailed (right-tailed) hypothesis.', isTrue: true, explanation: 'H₁: μ > μ₀ tests whether the mean is greater than the null value — a right-tailed test.' },
    { id: 'nah-tf-7', type: 'true-false', question: 'H₀ can contain an inequality, such as H₀: μ > 50.', isTrue: false, explanation: 'H₀ must contain equality: H₀: μ = 50. Inequalities belong in H₁. The test is based on the specific null value.' },
    { id: 'nah-tf-8', type: 'true-false', question: 'The alternative hypothesis is the claim the researcher is trying to find evidence for.', isTrue: true, explanation: 'H₁ is the research hypothesis. Rejecting H₀ in favour of H₁ is the goal of most research studies.' },
    { id: 'nah-tf-9', type: 'true-false', question: 'H₁: μ₁ ≠ μ₂ is a two-tailed alternative for comparing two population means.', isTrue: true, explanation: 'H₁: μ₁ ≠ μ₂ tests for any difference in either direction — a two-tailed test.' },
    { id: 'nah-tf-10', type: 'true-false', question: 'The same data can be used to both formulate and test a hypothesis.', isTrue: false, explanation: 'Using the same data for both formulation and testing (data dredging) invalidates the test and inflates the false-positive rate.' },
    { id: 'nah-tf-11', type: 'true-false', question: 'A composite null hypothesis like H₀: μ ≥ 50 is tested at the boundary value μ = 50.', isTrue: true, explanation: 'Composite null hypotheses (≤ or ≥) are tested at the boundary (equality), which gives the most conservative test.' },
    { id: 'nah-tf-12', type: 'true-false', question: 'Rejecting H₀ at α = 0.05 means there is a 5% chance that H₀ is true.', isTrue: false, explanation: 'Rejecting H₀ at α = 0.05 means: IF H₀ were true, the probability of results this extreme is ≤ 5%. It says nothing about P(H₀ is true).' },
    { id: 'nah-tf-13', type: 'true-false', question: 'The direction of the inequality in H₁ must be supported by theory or prior knowledge before data collection.', isTrue: true, explanation: 'One-tailed hypotheses are only valid when the direction is pre-specified based on theory, not chosen after seeing data.' },
    { id: 'nah-tf-14', type: 'true-false', question: 'H₀ and H₁ must be mutually exclusive and together cover all possibilities.', isTrue: true, explanation: 'H₀ and H₁ partition the parameter space: if H₀: μ = 50, then H₁: μ ≠ 50 covers all other values. They are exhaustive and mutually exclusive.' },
    { id: 'nah-tf-15', type: 'true-false', question: 'A null hypothesis is rejected when the test statistic falls in the rejection region.', isTrue: true, explanation: 'The rejection region is determined by the critical value. If the test statistic exceeds it, we reject H₀.' },
    { id: 'nah-tf-16', type: 'true-false', question: 'You can change H₁ from two-tailed to one-tailed if the initial two-tailed test gives p = 0.08.', isTrue: false, explanation: 'Switching from two-tailed to one-tailed after seeing p = 0.08 (to get p = 0.04) is p-hacking. Tail direction must be pre-specified.' },
    { id: 'nah-tf-17', type: 'true-false', question: 'The null hypothesis for a goodness-of-fit test is that the observed distribution matches the expected distribution.', isTrue: true, explanation: 'H₀ (goodness of fit): the data follow the specified distribution. H₁: the data do not follow it.' },
    { id: 'nah-tf-18', type: 'true-false', question: 'In research, it is always better to use a two-tailed test.', isTrue: false, explanation: 'Two-tailed tests are conservative and appropriate by default. One-tailed tests are valid when the direction is strongly justified by theory before data collection.' },
    { id: 'nah-tf-19', type: 'true-false', question: 'The null hypothesis H₀: p = 0.5 tests whether a coin is fair.', isTrue: true, explanation: 'For a fair coin, p(heads) = 0.5. H₀: p = 0.5 tests this. H₁: p ≠ 0.5 would test for unfairness.' },
    { id: 'nah-tf-20', type: 'true-false', question: 'Both H₀ and H₁ refer to population parameters, not sample statistics.', isTrue: true, explanation: 'Hypotheses are always about population parameters (μ, p, σ, etc.). We use sample statistics to test them.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'nah-mc-6', type: 'multiple-choice', question: 'A researcher believes a new drug lowers blood pressure MORE than the current drug. What is H₁?', options: [{ id: 'a', text: 'H₁: μ_new = μ_old', isCorrect: false, explanation: 'Equality belongs in H₀, not H₁.' }, { id: 'b', text: 'H₁: μ_new < μ_old (lower blood pressure is better)', isCorrect: true, explanation: 'If lower BP is the goal and "new drug lowers more," then H₁: μ_new < μ_old (new drug mean BP is lower).' }, { id: 'c', text: 'H₁: μ_new ≠ μ_old', isCorrect: false, explanation: 'H₁: ≠ is two-tailed. The researcher has a directional belief (new is better), justifying a one-tailed test.' }, { id: 'd', text: 'H₁: μ_new > μ_old', isCorrect: false, explanation: 'H₁: > would mean the new drug raises blood pressure more — opposite of the research belief.' }], explanation: 'The researcher expects the new drug to give lower readings: H₁: μ_new < μ_old.', hint: 'What direction does the researcher expect the effect?' },
    { id: 'nah-mc-7', type: 'multiple-choice', question: 'Which of the following is a valid null hypothesis?', options: [{ id: 'a', text: 'H₀: μ > 100', isCorrect: false, explanation: 'H₀ must contain equality. H₀: μ > 100 uses inequality — not valid.' }, { id: 'b', text: 'H₀: μ = 100', isCorrect: true, explanation: 'H₀ always contains equality (=). H₀: μ = 100 is the correct form.' }, { id: 'c', text: 'H₀: μ ≠ 100', isCorrect: false, explanation: 'H₀ must contain equality. H₀: μ ≠ 100 uses ≠ — this belongs in H₁.' }, { id: 'd', text: 'H₀: μ < 100', isCorrect: false, explanation: 'H₀: μ < 100 uses inequality — not valid for a null hypothesis.' }], explanation: 'H₀ must always use = (or ≥ or ≤ for composite nulls tested at the boundary). The strict equality form is most common.', hint: 'Which option contains an equality sign?' },
    { id: 'nah-mc-8', type: 'multiple-choice', question: 'H₀: μ₁ = μ₂, H₁: μ₁ ≠ μ₂. This is a:', options: [{ id: 'a', text: 'One-tailed right test', isCorrect: false, explanation: 'Right-tailed uses H₁: μ₁ > μ₂.' }, { id: 'b', text: 'Two-tailed test', isCorrect: true, explanation: 'H₁: μ₁ ≠ μ₂ uses ≠ — tests for difference in either direction.' }, { id: 'c', text: 'One-tailed left test', isCorrect: false, explanation: 'Left-tailed uses H₁: μ₁ < μ₂.' }, { id: 'd', text: 'A paired t-test', isCorrect: false, explanation: 'The hypotheses describe what is being tested, not the test type. ≠ indicates two-tailed.' }], explanation: 'H₁: ≠ means two-tailed — we test for any difference in either direction.', hint: 'What symbol in H₁ determines the number of tails?' },
    { id: 'nah-mc-9', type: 'multiple-choice', question: 'A study tests H₀: μ = 200 vs H₁: μ > 200. The data give x̄ = 195. What would the p-value look like?', options: [{ id: 'a', text: 'p < 0.05 — x̄ is far from 200', isCorrect: false, explanation: 'x̄ = 195 < μ₀ = 200 — it is in the WRONG direction for H₁: μ > 200. P-value will be very large.' }, { id: 'b', text: 'p will be large (> 0.5) — data are in the wrong direction for H₁', isCorrect: true, explanation: 'H₁: μ > 200 requires x̄ > μ₀. With x̄ = 195 < 200, the test statistic is negative — p-value for right tail is very large.' }, { id: 'c', text: 'p = exactly 0.5', isCorrect: false, explanation: 'p = 0.5 would occur only if x̄ = μ₀ exactly in a right-tailed test.' }, { id: 'd', text: 'p is undefined when x̄ < μ₀', isCorrect: false, explanation: 'p-values are always defined. Here the z-score is negative, giving a large p-value for the right-tailed test.' }], explanation: 'For H₁: μ > 200, x̄ = 195 gives a negative z-score — the data strongly support H₀, not H₁. p > 0.5.', hint: 'Does x̄ = 195 support the right-tailed H₁: μ > 200?' },
    { id: 'nah-mc-10', type: 'multiple-choice', question: 'What is HARKing?', options: [{ id: 'a', text: 'Hypothesising After Results are Known', isCorrect: true, explanation: 'HARKing = Hypothesising After Results Known. The researcher presents a post-hoc hypothesis as if it were pre-specified — a major threat to research validity.' }, { id: 'b', text: 'A form of hypothesis testing for multiple groups', isCorrect: false, explanation: 'HARKing is not a test — it is a problematic research practice.' }, { id: 'c', text: 'A Bayesian hypothesis framework', isCorrect: false, explanation: 'HARKing is a questionable research practice, not a Bayesian framework.' }, { id: 'd', text: 'A procedure for combining multiple hypotheses', isCorrect: false, explanation: 'That would be meta-analysis or multiple testing correction — not HARKing.' }], explanation: 'HARKing: post-hoc hypothesis = hypothesis formulated after seeing results but reported as pre-specified. Inflates false positives.', hint: 'What do the letters H-A-R-K stand for?' },
    { id: 'nah-mc-11', type: 'multiple-choice', question: 'H₀: p = 0.3 vs H₁: p < 0.3. You observe p̂ = 0.25. In which direction does the evidence point?', options: [{ id: 'a', text: 'Against H₁ — p̂ < p₀ contradicts the null', isCorrect: false, explanation: 'p̂ = 0.25 < p₀ = 0.3 is in the direction OF H₁: p < 0.3. This is evidence against H₀.' }, { id: 'b', text: 'Towards H₁ — p̂ = 0.25 < p₀ = 0.3, consistent with H₁', isCorrect: true, explanation: 'H₁: p < 0.3. Our observation p̂ = 0.25 < 0.3 is in the direction of H₁.' }, { id: 'c', text: 'Against both H₀ and H₁', isCorrect: false, explanation: 'The hypotheses are mutually exclusive and exhaustive — evidence against H₀ is evidence for H₁.' }, { id: 'd', text: 'Cannot tell without computing the p-value', isCorrect: false, explanation: 'The direction is obvious — p̂ < p₀ is in the direction of H₁: p < p₀.' }], explanation: 'p̂ = 0.25 < p₀ = 0.3. This is consistent with H₁: p < 0.3 — the evidence points toward H₁.', hint: 'Compare p̂ to p₀. Does p̂ point in the H₁ direction?' },
    { id: 'nah-mc-12', type: 'multiple-choice', question: 'What does it mean to "reject H₀"?', options: [{ id: 'a', text: 'H₁ is proven to be true', isCorrect: false, explanation: 'Rejecting H₀ provides evidence for H₁ but does not prove it with certainty.' }, { id: 'b', text: 'The data are sufficiently inconsistent with H₀ to conclude it is unlikely under α', isCorrect: true, explanation: 'Rejecting H₀ means: if H₀ were true, the probability of data this extreme is ≤ α. We declare the result statistically significant.' }, { id: 'c', text: 'H₀ is definitely false', isCorrect: false, explanation: 'Statistical testing is probabilistic. Rejecting H₀ can still be a Type I error — when H₀ is true, a test at α = 0.05 rejects 5% of the time.' }, { id: 'd', text: 'The sample size was too small', isCorrect: false, explanation: 'Sample size affects power, not the interpretation of rejecting H₀.' }], explanation: 'Rejecting H₀ means the data are unlikely under H₀ (p ≤ α). It is a probabilistic statement, not a proof.', hint: 'What is the probability-based meaning of rejecting H₀?' },
    { id: 'nah-mc-13', type: 'multiple-choice', question: 'A quality control engineer suspects a machine is producing bolts that are too LONG. What should H₁ be?', options: [{ id: 'a', text: 'H₁: μ = target length', isCorrect: false, explanation: 'Equality belongs in H₀, not H₁.' }, { id: 'b', text: 'H₁: μ > target length', isCorrect: true, explanation: 'The engineer suspects bolts are too long (above target) → H₁: μ > μ₀.' }, { id: 'c', text: 'H₁: μ ≠ target length', isCorrect: false, explanation: 'H₁: ≠ is two-tailed (either too long or too short). The engineer suspects specifically too long → one-tailed is justified.' }, { id: 'd', text: 'H₁: μ < target length', isCorrect: false, explanation: 'H₁: μ < would test for bolts that are too short — opposite of the concern.' }], explanation: 'Suspicion of "too long" → right-tailed test: H₁: μ > target.', hint: 'In which direction does the engineer suspect the machine is off?' },
    { id: 'nah-mc-14', type: 'multiple-choice', question: 'Which pair represents a correctly stated pair of hypotheses?', options: [{ id: 'a', text: 'H₀: μ > 50; H₁: μ ≤ 50', isCorrect: false, explanation: 'H₀ should contain equality. H₀: μ > 50 is incorrect.' }, { id: 'b', text: 'H₀: μ = 50; H₁: μ ≠ 50', isCorrect: true, explanation: 'H₀ has equality (=) and H₁ has inequality (≠). They are mutually exclusive and exhaustive. Correct format.' }, { id: 'c', text: 'H₀: μ ≠ 50; H₁: μ = 50', isCorrect: false, explanation: 'H₀ should have equality — the forms are swapped.' }, { id: 'd', text: 'H₀: μ = 50; H₁: μ = 60', isCorrect: false, explanation: 'H₁ cannot be a specific equality — it must cover a range (inequality).' }], explanation: 'Correct: H₀ uses = and H₁ uses an inequality (≠, <, or >).', hint: 'H₀ must have = and H₁ must have an inequality.' },
    { id: 'nah-mc-15', type: 'multiple-choice', question: 'Why is it important to state H₁ before collecting data?', options: [{ id: 'a', text: 'To guarantee a significant result', isCorrect: false, explanation: 'Pre-specification does not change the data or guarantee significance.' }, { id: 'b', text: 'To prevent choosing the test direction based on the observed result, which inflates Type I error', isCorrect: true, explanation: 'Post-hoc H₁ selection exploits the data — if you can choose any direction after seeing results, you effectively double your Type I error rate.' }, { id: 'c', text: 'Because the data determine which H₁ is correct', isCorrect: false, explanation: 'The hypothesis drives what the test means. If data determine H₁, the test is invalid.' }, { id: 'd', text: 'To make the p-value smaller', isCorrect: false, explanation: 'Pre-specification does not affect the p-value calculation.' }], explanation: 'Pre-specifying H₁ controls the Type I error rate. Post-hoc selection exploits random patterns in data.', hint: 'What happens to the Type I error rate when you choose the direction after seeing data?' },
  ],
  keyTakeaway:
    'H₀ is the default "no effect" claim with equality (=). H₁ is the research claim with an inequality (<, >, ≠). Always set both hypotheses before collecting data. The direction of H₁ determines whether the test is one-tailed or two-tailed.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>"The Null is Null" — H₀ claims nothing interesting happens:</strong></p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs space-y-1">
        <div><span className="font-semibold">H₀ always has =</span> &nbsp;→&nbsp; "no change, no difference, no effect"</div>
        <div><span className="font-semibold">H₁ has &lt;, &gt;, or ≠</span> &nbsp;→&nbsp; "something interesting is happening"</div>
        <div className="mt-2 text-textMuted">Quick direction guide:<br/>
          "differs / changed / different" → ≠ (two-tailed)<br/>
          "increased / higher / greater" → &gt; (right-tailed)<br/>
          "decreased / lower / less" → &lt; (left-tailed)
        </div>
      </div>
      <p className="text-xs text-textMuted">Parameters only! H₀: μ = 50 ✓ &nbsp;|&nbsp; H₀: x̄ = 50 ✗ (x̄ is a statistic, not a parameter)</p>
    </div>
  ),
  visualization: null,
  datasetGenerator: false,
}

export default function NullAndAlternativeHypotheses({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
