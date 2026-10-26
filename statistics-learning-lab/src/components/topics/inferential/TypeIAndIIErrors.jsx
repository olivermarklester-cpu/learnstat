import TopicPage from '../../layout/TopicPage'

// ── 2×2 error matrix visual ───────────────────────────────────────────────────

function ErrorMatrix() {
  return (
    <div>
      <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Decision vs reality</p>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-center">
          <thead>
            <tr>
              <th className="border border-border p-2 bg-surface text-textMuted"></th>
              <th className="border border-border p-3 bg-surface font-semibold text-textDark" colSpan={2}>Reality</th>
            </tr>
            <tr>
              <th className="border border-border p-2 bg-surface text-textMuted text-left">Decision</th>
              <th className="border border-border p-2 bg-green-50 text-green-800 font-semibold">H₀ true</th>
              <th className="border border-border p-2 bg-blue-50 text-blue-800 font-semibold">H₀ false (H₁ true)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-border p-2 bg-surface text-textDark font-medium text-left">Reject H₀</td>
              <td className="border border-border p-3 bg-red-50 text-red-800">
                <div className="font-bold">Type I Error</div>
                <div className="text-xs mt-0.5">False Positive</div>
                <div className="text-xs font-mono mt-0.5">P = α</div>
              </td>
              <td className="border border-border p-3 bg-green-100 text-green-800">
                <div className="font-bold">Correct ✓</div>
                <div className="text-xs mt-0.5">True Positive (Power)</div>
                <div className="text-xs font-mono mt-0.5">P = 1 − β</div>
              </td>
            </tr>
            <tr>
              <td className="border border-border p-2 bg-surface text-textDark font-medium text-left">Fail to reject H₀</td>
              <td className="border border-border p-3 bg-green-100 text-green-800">
                <div className="font-bold">Correct ✓</div>
                <div className="text-xs mt-0.5">True Negative</div>
                <div className="text-xs font-mono mt-0.5">P = 1 − α</div>
              </td>
              <td className="border border-border p-3 bg-orange-50 text-orange-800">
                <div className="font-bold">Type II Error</div>
                <div className="text-xs mt-0.5">False Negative</div>
                <div className="text-xs font-mono mt-0.5">P = β</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <strong className="text-red-800">Type I error (α):</strong>
          <span className="text-red-700"> Reject H₀ when H₀ is true. False alarm. Controlled by choosing α.</span>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <strong className="text-orange-800">Type II error (β):</strong>
          <span className="text-orange-700"> Fail to reject H₀ when H₁ is true. Missed effect. Controlled by sample size (power).</span>
        </div>
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Type I and II Errors',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Define Type I and Type II errors, explain the trade-off between them, and describe how to reduce each.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        In hypothesis testing, we can make two types of errors:
      </p>
      <ul className="space-y-2 ml-4 text-sm">
        <li>
          <strong>Type I error (α):</strong> We reject H₀ when H₀ is actually true. This is
          a <em>false positive</em> — we concluded an effect exists when it does not.
          P(Type I) = α (the significance level).
        </li>
        <li>
          <strong>Type II error (β):</strong> We fail to reject H₀ when H₁ is actually true.
          This is a <em>false negative</em> — we missed a real effect.
          P(Type II) = β.
        </li>
      </ul>
      <p>
        <strong>Power = 1 − β</strong> is the probability of correctly rejecting a false H₀
        (detecting a real effect). Higher power is better.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">The trade-off</p>
        <p className="text-amber-800">
          Decreasing α reduces Type I errors but increases Type II errors (harder to reject H₀).
          For a given effect size and variability, the way to reduce both simultaneously is to <strong>increase the sample size</strong>.
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A fire alarm either sounds or stays silent. Reality is either "there is a fire" or
        "there is no fire."
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li><strong>Type I error:</strong> Alarm sounds when there is no fire (false alarm).</li>
        <li><strong>Type II error:</strong> Alarm stays silent during an actual fire (missed alarm).</li>
        <li><strong>Power:</strong> Alarm correctly detects a real fire.</li>
      </ul>
      <p className="text-sm text-gray-600">
        Making the alarm more sensitive (lower threshold) reduces missed fires (Type II) but
        increases false alarms (Type I). You need better smoke detectors (larger sample) to reduce both.
      </p>
    </div>
  ),
  formula: {
    main: 'P(Type I) = α   |   P(Type II) = β   |   Power = 1 − β',
    variants: [
      { label: 'Type I error rate', expression: 'α = P(reject H₀ | H₀ true)', latex: '\\alpha = P(\\text{Reject } H_0 \\mid H_0 \\text{ true})' },
      { label: 'Type II error rate', expression: 'β = P(fail to reject H₀ | H₁ true)', latex: '\\beta = P(\\text{Fail to reject } H_0 \\mid H_1 \\text{ true})' },
      { label: 'Power', expression: 'Power = 1 − β = P(reject H₀ | H₁ true)', latex: '1 - \\beta = P(\\text{Reject } H_0 \\mid H_1 \\text{ true})' },
    ],
    symbolGuide: [
      { symbol: 'α', meaning: 'Significance level = Type I error probability (set by researcher)' },
      { symbol: 'β', meaning: 'Type II error probability — depends on effect size, sample size, and α' },
      { symbol: '1 − β', meaning: 'Power — probability of detecting a true effect' },
      { symbol: 'Effect size', meaning: 'The magnitude of the true difference between H₀ and the true parameter' },
    ],
  },
  whenToUse: [
    'Understand both error types when planning a study — set α and target power (usually 0.80 or 0.90)',
    'When communicating results — explain what a "fail to reject" conclusion could mean (possible Type II error)',
  ],
  whenNotToUse: [
    'Both error types are always present in hypothesis testing — you cannot "avoid" them, only manage their rates',
  ],
  assumptions: [
    'The probability of Type I error is exactly α when H₀ is true and all assumptions are met',
    'Type II error depends on the actual effect size, σ, n, and α',
  ],
  workedExample: {
    scenario:
      'A company claims its new training improves productivity. H₀: no improvement. α = 0.05 is chosen. Sample n = 20 workers are tested.',
    steps: [
      { stepNumber: 1, label: 'Identify Type I error', expression: 'Reject H₀ when training actually does nothing', result: 'Wrongly conclude training works', explanation: 'Probability = α = 0.05 — happens 5% of the time when H₀ is true.' },
      { stepNumber: 2, label: 'Identify Type II error', expression: 'Fail to reject H₀ when training actually improves productivity', result: 'Miss a real improvement', explanation: 'A real effect exists but the sample (n=20) may be too small to detect it.' },
      { stepNumber: 3, label: 'How to improve', expression: 'Increase n → reduces β (increases power)', result: 'e.g., n = 100 gives more power', explanation: 'Larger samples detect smaller effects.' },
    ],
    interpretation:
      'With n = 20, there may be low power to detect a modest productivity improvement. If the test fails to reject H₀, it could be a Type II error. A power analysis before the study would determine the needed sample size.',
  },
  interpretation:
    'Type I errors = false positives (controlled by α). Type II errors = false negatives (controlled by n, effect size). There is always a trade-off — quantify both when planning research.',
  commonMistakes: [
    { mistake: 'Confusing Type I and Type II errors', explanation: 'Mnemonic: Type I = false positive (you "cried wolf" — rejected H₀ wrongly). Type II = false negative (you missed the wolf).' },
    { mistake: 'Thinking only about α, forgetting power', explanation: 'Many published studies are underpowered (high β). A negative result from an underpowered study does not mean no effect.' },
    { mistake: 'Believing you can simultaneously reduce α and β without a larger sample', explanation: 'For fixed n, reducing α (stricter threshold) automatically increases β. The only escape is more data.' },
  ],
  practiceProblems: {
    easy: [
      { id: 't12-easy-1', scenario: 'A drug is tested. H₀: the drug has no side effects. The test incorrectly concludes the drug is harmful.', question: 'What type of error is this?', hint: 'We rejected H₀ (no side effects). Was H₀ actually true?', solution: 'Type I error — we rejected H₀ (concluded harm) when H₀ was true (no harm).' },
    ],
    moderate: [
      { id: 't12-mod-1', scenario: 'A researcher uses α = 0.01 instead of α = 0.05 to reduce false positives.', question: 'What happens to the Type II error rate? What should the researcher also consider?', hint: 'Stricter α → harder to reject H₀.', solution: 'Type II error (β) increases — the test becomes more conservative and may miss real effects. The researcher should also increase n to maintain adequate power.' },
    ],
    challenging: [
      { id: 't12-chal-1', scenario: 'In a criminal trial, Type I = convicting an innocent person; Type II = acquitting a guilty person. The criminal justice system sets a very high evidence threshold.', question: 'Which error is being minimised, and what is the consequence for the other error type?', hint: 'High evidence threshold = strict α.', solution: 'The system minimises Type I errors (convicting the innocent) by requiring very strong evidence (low α). This increases Type II errors (guilty people go free). Society has judged that wrongful conviction is worse than wrongful acquittal.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 't12-kc-1', type: 'multiple-choice',
      question: 'A quality inspector incorrectly passes a defective product. What type of error is this?',
      options: [
        { id: 'a', text: 'Type I error', isCorrect: false, explanation: 'Type I = rejecting H₀ when H₀ is true. Here the inspector failed to reject H₀ (passed the product) when H₁ is true (product is defective).' },
        { id: 'b', text: 'Type II error', isCorrect: true, explanation: 'Correct! The inspector failed to detect the defect (failed to reject H₀) even though H₁ is true.' },
        { id: 'c', text: 'Neither — this is correct behaviour', isCorrect: false, explanation: 'Passing a defective product is an error (false negative).' },
        { id: 'd', text: 'Both types simultaneously', isCorrect: false, explanation: 'Errors are mutually exclusive — you either reject or fail to reject H₀.' },
      ],
      explanation: 'Type II error: fail to reject H₀ (product is fine) when H₁ is true (product is defective).',
      hint: 'The inspector missed the defect — is that a false positive or false negative?',
    },
    {
      id: 't12-kc-2', type: 'multiple-choice',
      question: 'How can a researcher reduce both Type I and Type II errors simultaneously?',
      options: [
        { id: 'a', text: 'Use a larger significance level α', isCorrect: false, explanation: 'Larger α reduces Type II errors but increases Type I errors.' },
        { id: 'b', text: 'Use a smaller significance level α', isCorrect: false, explanation: 'Smaller α reduces Type I errors but increases Type II errors.' },
        { id: 'c', text: 'Increase the sample size', isCorrect: true, explanation: 'Correct! A larger n reduces standard error, making it possible to detect real effects more reliably while maintaining a low α.' },
        { id: 'd', text: 'Use two-tailed tests instead of one-tailed', isCorrect: false, explanation: 'Changing the tail does not reduce both error types.' },
      ],
      explanation: 'Only increasing n (and thus power) allows reduction of both error rates simultaneously.',
      hint: 'Think about what reduces standard error and increases power.',
    },
    {
      id: 't12-kc-3', type: 'multiple-choice',
      question: 'A clinical trial finds a new drug has no effect (p = 0.20, α = 0.05). What type of error might have occurred?',
      options: [
        { id: 'a', text: 'Type I error', isCorrect: false, explanation: 'Type I = false positive (reject a true H₀). Here we failed to reject H₀ — a potential false negative.' },
        { id: 'b', text: 'Type II error', isCorrect: true, explanation: 'Correct! We failed to reject H₀. If the drug actually works, this is a Type II error (false negative).' },
        { id: 'c', text: 'Both Type I and Type II', isCorrect: false, explanation: 'We can only make one type of error per test: either we rejected (possible Type I) or we did not reject (possible Type II).' },
        { id: 'd', text: 'Neither — p = 0.20 means the drug definitely does not work', isCorrect: false, explanation: '"Fail to reject" does not mean H₀ is true. The drug may work but the study may have been underpowered.' },
      ],
      explanation: 'Failing to reject H₀ when H₁ is true is a Type II error. The study might have been underpowered.',
      hint: 'We failed to detect an effect. Is that a false positive or false negative?',
    },
    {
      id: 't12-kc-4', type: 'multiple-choice',
      question: 'Power = 0.80. What does this mean?',
      options: [
        { id: 'a', text: 'There is an 80% chance H₀ is false', isCorrect: false, explanation: 'Power is about detecting an effect, not about H₀ being false.' },
        { id: 'b', text: 'There is an 80% probability of rejecting H₀ when H₁ is true', isCorrect: true, explanation: 'Correct! Power = P(reject H₀ | H₁ true) = 1 − β. Power = 0.80 means β = 0.20.' },
        { id: 'c', text: 'The p-value will be 0.20', isCorrect: false, explanation: 'Power and p-value are different concepts.' },
        { id: 'd', text: 'α = 0.20', isCorrect: false, explanation: 'Power = 1 − β, not 1 − α.' },
      ],
      explanation: 'Power = 1 − β. Power = 0.80 means β = 0.20 — 20% chance of missing a real effect.',
      hint: 'Power = P(correctly detecting a real effect).',
    },
    {
      id: 't12-kc-5', type: 'multiple-choice',
      question: 'Which scenario involves a Type I error?',
      options: [
        { id: 'a', text: 'A fire alarm stays silent during a real fire', isCorrect: false, explanation: 'Silent during a real fire = missed detection = Type II error (false negative).' },
        { id: 'b', text: 'A fire alarm goes off when there is no fire', isCorrect: true, explanation: 'Correct! Alarm triggers (reject H₀) when there is no fire (H₀ is true) = Type I error (false positive).' },
        { id: 'c', text: 'A fire alarm correctly detects a fire', isCorrect: false, explanation: 'Correct detection = Power = 1 − β.' },
        { id: 'd', text: 'A fire alarm is turned off', isCorrect: false, explanation: 'Not an error type — this is not a statistical concept.' },
      ],
      explanation: 'Type I = false positive. Alarm sounds (reject H₀) when there is no fire (H₀ true).',
      hint: 'Type I = false alarm. Which scenario is a false alarm?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 't12-tf-1', type: 'true-false', question: 'A Type I error occurs when you reject a null hypothesis that is actually true.', isTrue: true, explanation: 'Type I error = false positive. H₀ is true but we incorrectly reject it. P(Type I) = α.' },
    { id: 't12-tf-2', type: 'true-false', question: 'A Type II error occurs when you fail to reject a null hypothesis that is actually false.', isTrue: true, explanation: 'Type II error = false negative. H₀ is false (effect is real) but we miss it. P(Type II) = β.' },
    { id: 't12-tf-3', type: 'true-false', question: 'The significance level α directly controls the Type II error rate β.', isTrue: false, explanation: 'α controls Type I error. β (Type II error) depends on effect size, n, and α — but not directly equal to α.' },
    { id: 't12-tf-4', type: 'true-false', question: 'Reducing α from 0.05 to 0.01 increases the probability of a Type II error.', isTrue: true, explanation: 'Stricter α → harder to reject H₀ → more missed real effects → higher β. There is a direct trade-off.' },
    { id: 't12-tf-5', type: 'true-false', question: 'Power = 1 − β.', isTrue: true, explanation: 'Power is the probability of correctly rejecting a false H₀. Power = 1 − P(Type II error) = 1 − β.' },
    { id: 't12-tf-6', type: 'true-false', question: 'A Type I error is more serious than a Type II error in all situations.', isTrue: false, explanation: 'The relative seriousness depends on context. In medical testing, missing a disease (Type II) may be more serious than a false alarm (Type I).' },
    { id: 't12-tf-7', type: 'true-false', question: 'Increasing sample size n reduces both α and β simultaneously.', isTrue: false, explanation: 'n does not change α (which is pre-set by the researcher). At a fixed α, increasing n reduces β (increases power).' },
    { id: 't12-tf-8', type: 'true-false', question: 'Power = 0.80 means there is an 80% chance of correctly detecting a real effect.', isTrue: true, explanation: 'Power = P(reject H₀ | H₀ is false). Power = 0.80 means 80% probability of correctly identifying a true effect.' },
    { id: 't12-tf-9', type: 'true-false', question: 'A fire alarm that never rings commits Type II errors every time there is a real fire.', isTrue: true, explanation: 'Never ringing = never rejecting H₀ = always "failing to detect." Every real fire (H₀ false) is missed — all Type II errors.' },
    { id: 't12-tf-10', type: 'true-false', question: 'If α = 0.05 and power = 0.80, the probability of a Type II error is 0.95.', isTrue: false, explanation: 'Power = 1 − β → β = 1 − 0.80 = 0.20, not 0.95. β is not 1 − α; it is 1 − power.' },
    { id: 't12-tf-11', type: 'true-false', question: 'A sensitive test (high power) is less likely to miss real effects.', isTrue: true, explanation: 'High power = high sensitivity = low β. A powerful test is good at detecting real effects.' },
    { id: 't12-tf-12', type: 'true-false', question: 'The probability of correctly rejecting a false H₀ decreases when effect size increases.', isTrue: false, explanation: 'Larger effect size → easier to detect → higher power → lower β. Power increases with effect size.' },
    { id: 't12-tf-13', type: 'true-false', question: 'Using α = 0.10 instead of 0.05 decreases the risk of a Type II error.', isTrue: true, explanation: 'Higher α → easier to reject H₀ → fewer missed real effects → lower β. But more Type I errors.' },
    { id: 't12-tf-14', type: 'true-false', question: 'α + β = 1.', isTrue: false, explanation: 'α + β ≠ 1 in general. α = P(Type I), β = P(Type II). They can both be small with a large enough sample.' },
    { id: 't12-tf-15', type: 'true-false', question: 'A false negative in a COVID test is an example of a Type II error.', isTrue: true, explanation: 'False negative = person has COVID (H₀: no COVID is false) but tests negative (fail to reject H₀). This is a Type II error.' },
    { id: 't12-tf-16', type: 'true-false', question: 'Power can be increased by increasing α, increasing n, or increasing effect size.', isTrue: true, explanation: 'Power = 1 − β. All three — larger α, larger n, or larger effect — increase power. Researchers typically increase n.' },
    { id: 't12-tf-17', type: 'true-false', question: 'If a study is underpowered, a non-significant result reliably rules out any real effect.', isTrue: false, explanation: 'An underpowered study may miss real effects. Non-significance from low power does NOT rule out the existence of an effect.' },
    { id: 't12-tf-18', type: 'true-false', question: 'The "power of a study" is typically set to 0.80 (80%) as a convention.', isTrue: true, explanation: 'By convention, power ≥ 0.80 is considered adequate. This means β ≤ 0.20 — accepting up to 20% chance of missing a real effect.' },
    { id: 't12-tf-19', type: 'true-false', question: 'For a given effect size and variability, α and β can both be reduced only by collecting more data (larger n).', isTrue: true, explanation: 'For fixed n, lowering α raises β (and vice versa). A larger n reduces SE, so a test can have a smaller α and a smaller β at the same time.' },
    { id: 't12-tf-20', type: 'true-false', question: 'A conviction of an innocent person in court is analogous to a Type II error.', isTrue: false, explanation: 'Convicting an innocent person = rejecting a true H₀ (H₀: innocent) = Type I error (false positive). Acquitting a guilty person = Type II error.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 't12-mc-6', type: 'multiple-choice', question: 'α = 0.05 and the study power = 0.75. What is the Type II error rate β?', options: [{ id: 'a', text: '0.05', isCorrect: false, explanation: '0.05 = α (Type I). Type II = β = 1 − power.' }, { id: 'b', text: '0.25', isCorrect: true, explanation: 'β = 1 − power = 1 − 0.75 = 0.25.' }, { id: 'c', text: '0.70', isCorrect: false, explanation: '0.70 ≠ 1 − 0.75.' }, { id: 'd', text: '0.95', isCorrect: false, explanation: '0.95 = 1 − α, not 1 − power.' }], explanation: 'β = 1 − power = 1 − 0.75 = 0.25.', hint: 'Power = 1 − β → β = 1 − power.' },
    { id: 't12-mc-7', type: 'multiple-choice', question: 'A drug is ineffective but the test concludes it is effective. This is:', options: [{ id: 'a', text: 'A Type II error', isCorrect: false, explanation: 'Type II = failing to detect a real effect. Here a non-effect is detected — that is a false positive.' }, { id: 'b', text: 'A Type I error', isCorrect: true, explanation: 'H₀: drug is ineffective (true). We reject H₀ → false positive → Type I error.' }, { id: 'c', text: 'A correct decision', isCorrect: false, explanation: 'Concluding an ineffective drug is effective is incorrect.' }, { id: 'd', text: 'A power error', isCorrect: false, explanation: '"Power error" is not a standard statistical term.' }], explanation: 'Rejecting a true H₀ (ineffective drug called effective) = Type I error (false positive).', hint: 'H₀: drug is ineffective. Is H₀ true? Did we reject it?' },
    { id: 't12-mc-8', type: 'multiple-choice', question: 'A real difference exists between two groups but the test fails to detect it. This is:', options: [{ id: 'a', text: 'A Type I error', isCorrect: false, explanation: 'Type I = rejecting a true H₀. Here H₀ is false (difference exists) and we fail to reject.' }, { id: 'b', text: 'A Type II error', isCorrect: true, explanation: 'H₀: no difference (false — difference exists). We fail to reject H₀ → missed real effect → Type II error.' }, { id: 'c', text: 'A correct decision', isCorrect: false, explanation: 'Missing a real difference is an error, not a correct decision.' }, { id: 'd', text: 'Acceptable if p = 0.06', isCorrect: false, explanation: 'Whether p = 0.06 is an error depends on α. If α = 0.05, this would be failing to reject a false H₀ = Type II error.' }], explanation: 'Missing a real effect (H₀ false but not rejected) = Type II error (false negative).', hint: 'H₀ is false but we keep it — what type of error is that?' },
    { id: 't12-mc-9', type: 'multiple-choice', question: 'Which of the following would INCREASE statistical power?', options: [{ id: 'a', text: 'Decreasing the sample size', isCorrect: false, explanation: 'Smaller n → less power (harder to detect effects).' }, { id: 'b', text: 'Increasing the sample size', isCorrect: true, explanation: 'Larger n → smaller SE → larger test statistic → higher power → lower β.' }, { id: 'c', text: 'Reducing α from 0.05 to 0.01', isCorrect: false, explanation: 'Stricter α → harder to reject → lower power (higher β).' }, { id: 'd', text: 'Using a smaller effect size', isCorrect: false, explanation: 'Smaller effects are harder to detect → lower power.' }], explanation: 'Increasing n increases power: SE decreases, test statistic grows, making it easier to detect real effects.', hint: 'What reduces SE and increases the test statistic?' },
    { id: 't12-mc-10', type: 'multiple-choice', question: 'A medical screening test that almost never gives a positive result would suffer from:', options: [{ id: 'a', text: 'High Type I errors — too many false alarms', isCorrect: false, explanation: 'A test that rarely gives positives would have few false positives.' }, { id: 'b', text: 'High Type II errors — missing most true positives', isCorrect: true, explanation: 'If the test rarely triggers positive, it misses real diseases → high β (false negatives, Type II errors).' }, { id: 'c', text: 'High power', isCorrect: false, explanation: 'A test that misses most cases has low power, not high.' }, { id: 'd', text: 'No errors', isCorrect: false, explanation: 'Missing real cases is Type II error — definitely making errors.' }], explanation: 'A test that seldom triggers positive → misses real diseases → high β (Type II errors). Low sensitivity/low power.', hint: 'If the test rarely says "positive," what happens to real cases?' },
    { id: 't12-mc-11', type: 'multiple-choice', question: 'In an experiment, the researcher wants β ≤ 0.10. What is the minimum required power?', options: [{ id: 'a', text: '0.10', isCorrect: false, explanation: '0.10 = β. Power = 1 − β = 0.90.' }, { id: 'b', text: '0.90', isCorrect: true, explanation: 'Power = 1 − β ≥ 1 − 0.10 = 0.90. Minimum required power = 90%.' }, { id: 'c', text: '0.05', isCorrect: false, explanation: '0.05 is a typical α, not power.' }, { id: 'd', text: '1.10', isCorrect: false, explanation: 'Power > 1 is impossible.' }], explanation: 'Power = 1 − β. If β ≤ 0.10, then power ≥ 0.90.', hint: 'Power = 1 − β.' },
    { id: 't12-mc-12', type: 'multiple-choice', question: 'A researcher sets α = 0.05 but the study has only 30% power. What is the most concerning implication?', options: [{ id: 'a', text: 'The study will find too many false positives', isCorrect: false, explanation: 'Low power means few significant results — not many false positives.' }, { id: 'b', text: 'The study will miss most real effects (β = 0.70)', isCorrect: true, explanation: 'Power = 0.30 → β = 0.70. A 70% chance of missing real effects. A larger share of the significant findings from such studies may also be false positives.' }, { id: 'c', text: 'α needs to be increased to 0.10', isCorrect: false, explanation: 'Increasing α is not the solution — the problem is insufficient n or small effect size.' }, { id: 'd', text: 'The study cannot be run', isCorrect: false, explanation: 'The study can run, but results should be interpreted cautiously.' }], explanation: 'Power = 0.30 → β = 0.70. A 70% miss rate means most real effects will go undetected.', hint: 'What does β = 0.70 mean for the study\'s ability to detect effects?' },
    { id: 't12-mc-13', type: 'multiple-choice', question: 'For a fixed effect size, which combination minimises both Type I and Type II errors?', options: [{ id: 'a', text: 'Decrease α and keep n the same', isCorrect: false, explanation: 'Decreasing α reduces Type I but increases Type II.' }, { id: 'b', text: 'Increase n and keep α the same', isCorrect: true, explanation: 'Larger n reduces SE, increases test statistics, increases power (lowers β) without changing α.' }, { id: 'c', text: 'Increase α and decrease n', isCorrect: false, explanation: 'Raising α increases the Type I error rate, and a smaller n increases the Type II error rate — this cannot reduce both.' }, { id: 'd', text: 'Nothing can reduce both simultaneously', isCorrect: false, explanation: 'Increasing n reduces β while keeping α fixed — both can be controlled.' }], explanation: 'Only increasing n reduces β while maintaining α. This is the key method for reducing both error types simultaneously.', hint: 'Which change reduces SE and therefore increases power without changing α?' },
    { id: 't12-mc-14', type: 'multiple-choice', question: '"Failing to detect a safety defect in a product" is most analogous to:', options: [{ id: 'a', text: 'Type I error', isCorrect: false, explanation: 'Type I = detecting a non-existent defect (false alarm). Failing to detect a real defect is Type II.' }, { id: 'b', text: 'Type II error', isCorrect: true, explanation: 'H₀: product is safe (FALSE — defect exists). We fail to reject H₀ → missed real defect → Type II error (false negative).' }, { id: 'c', text: 'A correct decision', isCorrect: false, explanation: 'Missing a real safety defect is a dangerous error, not a correct decision.' }, { id: 'd', text: 'High power', isCorrect: false, explanation: 'Failing to detect a real defect indicates LOW power, not high power.' }], explanation: 'H₀: product safe (false). Fail to reject → miss real defect → Type II error.', hint: 'Is H₀ true or false? Did we reject it?' },
    { id: 't12-mc-15', type: 'multiple-choice', question: 'If H₀ is true and we correctly fail to reject it, this is:', options: [{ id: 'a', text: 'Type I error', isCorrect: false, explanation: 'Type I = rejecting a true H₀. Here we correctly KEEP the true H₀.' }, { id: 'b', text: 'A correct decision — true negative', isCorrect: true, explanation: 'H₀ true + fail to reject = correct decision (true negative). P(true negative) = 1 − α.' }, { id: 'c', text: 'Type II error', isCorrect: false, explanation: 'Type II = failing to reject a false H₀. Here H₀ is true.' }, { id: 'd', text: 'Power', isCorrect: false, explanation: 'Power = P(reject H₀ | H₀ false). Here H₀ is true — power is not the relevant concept.' }], explanation: 'H₀ true + fail to reject = true negative. P = 1 − α. The other correct outcome is: H₀ false + reject = power = 1 − β.', hint: 'A correct decision when H₀ is actually true.' },
  ],
  keyTakeaway:
    'Type I error (α) = false positive — rejecting a true H₀. Type II error (β) = false negative — missing a real effect. Power = 1−β. Reducing α increases β. The only way to reduce both simultaneously is to increase sample size.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>The "Crying Wolf" mnemonic:</strong></p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2">
          <div className="font-bold text-red-700">Type I — Cried Wolf 🐺</div>
          <div className="text-textMuted mt-0.5">Said "wolf!" (rejected H₀) when there was none (H₀ true). <strong>False positive.</strong></div>
          <div className="mt-1 text-red-600 font-mono">P = α</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
          <div className="font-bold text-orange-700">Type II — Missed the Wolf 🙈</div>
          <div className="text-textMuted mt-0.5">Said "no wolf" (failed to reject) when wolf was real (H₁ true). <strong>False negative.</strong></div>
          <div className="mt-1 text-orange-600 font-mono">P = β</div>
        </div>
      </div>
      <div className="bg-white border border-violet-200 rounded-lg p-2 text-xs font-mono">
        <div>Power = 1 − β &nbsp;→&nbsp; "probability of catching the wolf"</div>
        <div className="mt-1 text-textMuted">Only way to reduce both α and β: <strong>increase n</strong></div>
      </div>
    </div>
  ),
  visualization: <ErrorMatrix />,
  datasetGenerator: false,
}

export default function TypeIAndIIErrors({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
