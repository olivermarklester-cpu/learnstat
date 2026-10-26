import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

function ComplementViz() {
  const pA = 0.08
  const pNotA = 1 - pA
  return (
    <div>
      <BarChart
        labels={['P(error)', 'P(no error)']}
        values={[pA, pNotA]}
        title="Claims Processing — Probability of Error vs. No Error"
        xLabel="Outcome"
        yLabel="Probability"
        color="#2563EB"
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">
        P(error) = 0.08 and its complement P(no error) = 0.92. Together they sum to exactly 1.
      </p>
    </div>
  )
}

const content = {
  title: 'The Complement Rule',
  topicGroup: 'Probability',
  learningObjective:
    'Use the complement rule to find the probability of an event NOT occurring.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        If you know how likely something <em>is</em> to happen, the <strong>complement</strong>{' '}
        tells you how likely it is <em>not</em> to happen. Because all outcomes must account for
        the full probability of 1, we have:
      </p>
      <p className="font-medium ml-4">P(not A) = 1 − P(A)</p>
      <p>
        The complement of event A — written Aᶜ or A′ — is everything in the sample space that is{' '}
        <em>not</em> A.
      </p>
      <ul className="space-y-2 ml-4 text-sm">
        <li>If P(A) = 0.30, then P(Aᶜ) = 0.70</li>
        <li>If P(A) = 0.95, then P(Aᶜ) = 0.05</li>
        <li>P(A) + P(Aᶜ) always equals 1.0</li>
      </ul>
      <p className="text-sm text-gray-600">
        The complement rule is one of the most-used shortcuts in probability — it is often much
        easier to calculate "not happening" than to calculate "happening" directly.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A weather app shows a <strong>30% chance of rain</strong>. That means there is a{' '}
        <strong>70% chance of no rain</strong> — the complement. You did not need extra
        information; you just subtracted from 1.
      </p>
      <p className="text-sm text-gray-600">
        Similarly: if a test has a 12% failure rate, the pass rate is 88%. If there is a 5% chance
        of a manufacturing defect, there is a 95% chance of a good product.
      </p>
    </div>
  ),
  formula: {
    main: 'P(Aᶜ) = 1 − P(A)',
    variants: [
      { label: 'Complement rule', expression: 'P(Aᶜ) = 1 − P(A)', latex: 'P(A^{c}) = 1 - P(A)' },
      { label: 'Rearranged', expression: 'P(A) = 1 − P(Aᶜ)', latex: 'P(A) = 1 - P(A^{c})' },
      { label: 'Sum rule', expression: 'P(A) + P(Aᶜ) = 1', latex: 'P(A) + P(A^{c}) = 1' },
    ],
    symbolGuide: [
      { symbol: 'P(A)', meaning: 'Probability of event A occurring' },
      { symbol: 'P(Aᶜ)', meaning: 'Probability of event A NOT occurring (the complement)' },
      { symbol: 'Aᶜ', meaning: "Complement of A — all outcomes where A does NOT happen. Also written A′ or Ā." },
    ],
  },
  whenToUse: [
    'When it is easier to calculate what DOES happen than what does not',
    'To find "at least one" probabilities: P(at least one) = 1 − P(none)',
    'Any time you know P(A) and need P(not A) quickly',
  ],
  whenNotToUse: [
    'When you are looking at more than two mutually exclusive outcomes — the complement covers ALL other outcomes, not just one specific alternative',
    'Do not confuse complement with "the other option" when there are three or more possible events',
  ],
  assumptions: [
    'The event A and its complement Aᶜ must be exhaustive — together they cover the entire sample space',
    'P(A) must be a valid probability (between 0 and 1)',
  ],
  workedExample: {
    scenario:
      'A health insurer processes 400 claims daily. Based on past data, P(claim error) = 0.08. What is P(no error)?',
    steps: [
      {
        stepNumber: 1,
        label: 'Identify P(A)',
        expression: 'P(error) = 0.08',
        result: 'P(A) = 0.08',
        explanation: 'The event A is "claim has an error." Its probability is given as 0.08.',
      },
      {
        stepNumber: 2,
        label: 'Apply the complement rule',
        expression: 'P(Aᶜ) = 1 − P(A) = 1 − 0.08',
        result: 'P(no error) = 0.92',
        explanation:
          'Subtract from 1. If 8% of claims have errors, the remaining 92% do not.',
      },
      {
        stepNumber: 3,
        label: 'Verify the sum',
        expression: 'P(error) + P(no error) = 0.08 + 0.92 = 1.00',
        result: '✓ Sums to 1',
        explanation: 'The two probabilities cover all possible outcomes and sum to exactly 1.',
      },
      {
        stepNumber: 4,
        label: 'Hospital readmission example',
        expression: 'P(readmission within 30 days) = 0.15 → P(no readmission) = 1 − 0.15',
        result: 'P(no readmission) = 0.85',
        explanation:
          'If 15% of patients are readmitted within 30 days, 85% are not. A simple complement.',
      },
    ],
    interpretation:
      '92% of claims are expected to be processed without errors. The complement rule turned a "how often does something go wrong?" question into a "how often does it go right?" answer instantly.',
  },
  interpretation:
    'The complement rule is your quickest tool for finding "not A" probabilities. It always produces a valid probability because P(A) + P(Aᶜ) = 1 by definition.',
  commonMistakes: [
    {
      mistake: 'Subtracting from the wrong base',
      explanation:
        'Always subtract from 1, not from 100 (unless you convert to percent at the end). P(Aᶜ) = 1 − P(A), not 100 − P(A).',
    },
    {
      mistake: 'Using the complement when there are more than two outcomes',
      explanation:
        "The complement of A is everything that is not A — which may include many events. If A = 'rolled a 1', then Aᶜ = {2,3,4,5,6}, not just one other outcome.",
    },
    {
      mistake: 'Confusing complement with "opposite event"',
      explanation:
        "Complementary events together cover the entire sample space. Be careful: 'rolling an even number' and 'rolling an odd number' are complements, but 'rolling a 6' and 'rolling a 1' are not — they don't cover all possibilities.",
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'cr-easy-1',
        scenario: 'The probability that a new drug has a side effect is 0.22.',
        question: 'What is the probability of no side effect?',
        hint: 'Apply P(Aᶜ) = 1 − P(A).',
        solution: 'P(no side effect) = 1 − 0.22 = 0.78.',
      },
      {
        id: 'cr-easy-2',
        scenario: 'P(it does not rain this weekend) = 0.60.',
        question: 'What is P(it rains this weekend)?',
        hint: 'If you know the complement, you can find the original: P(A) = 1 − P(Aᶜ).',
        solution: 'P(rain) = 1 − 0.60 = 0.40.',
      },
    ],
    moderate: [
      {
        id: 'cr-mod-1',
        scenario:
          'A factory produces items where 3% are defective. A quality check selects one item.',
        question:
          'What is P(item is not defective)? If 5 items are selected (with replacement), what is P(none are defective)?',
        hint:
          'First find the complement. For 5 independent items, multiply the complement probability by itself 5 times.',
        solution:
          'P(not defective) = 1 − 0.03 = 0.97. P(none of 5 defective) = 0.97⁵ ≈ 0.859.',
      },
    ],
    challenging: [
      {
        id: 'cr-chal-1',
        scenario:
          'A survey found that 45% of employees use all their annual leave, 30% use more than half, and the rest use half or less.',
        question:
          "What is P(an employee uses LESS than all their leave)? What is P(they use at most half their leave)?",
        hint:
          "For 'less than all leave': use the complement of 'uses all leave.' For 'at most half': find what's left.",
        solution:
          "P(less than all leave) = 1 − 0.45 = 0.55. P(at most half) = 1 − 0.45 − 0.30 = 0.25.",
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cr-kc-1',
      type: 'multiple-choice',
      question: 'P(A) = 0.73. What is P(Aᶜ)?',
      options: [
        { id: 'a', text: '0.73', isCorrect: false, explanation: "That is P(A), not its complement." },
        { id: 'b', text: '0.27', isCorrect: true, explanation: 'Correct! P(Aᶜ) = 1 − 0.73 = 0.27.' },
        { id: 'c', text: '1.73', isCorrect: false, explanation: 'Probabilities cannot exceed 1.' },
        { id: 'd', text: '0.37', isCorrect: false, explanation: 'Check the arithmetic: 1 − 0.73 = 0.27, not 0.37.' },
      ],
      explanation: 'P(Aᶜ) = 1 − P(A) = 1 − 0.73 = 0.27.',
      hint: 'Subtract P(A) from 1.',
    },
    {
      id: 'cr-kc-2',
      type: 'numerical',
      question: 'P(patient has no complications) = 0.88. What is P(patient has complications)?',
      answer: 0.12,
      tolerance: 0.005,
      explanation: 'P(complications) = 1 − P(no complications) = 1 − 0.88 = 0.12.',
      hint: 'Use P(A) = 1 − P(Aᶜ).',
    },
    {
      id: 'cr-kc-3',
      type: 'multiple-choice',
      question: 'Which statement correctly describes the complement of event A?',
      options: [
        { id: 'a', text: 'The event with the highest probability', isCorrect: false, explanation: 'The complement has nothing to do with which event is most likely.' },
        { id: 'b', text: 'All outcomes where A does not occur', isCorrect: true, explanation: 'Correct! Aᶜ contains every outcome in the sample space that is not in A.' },
        { id: 'c', text: 'The event directly opposite to A', isCorrect: false, explanation: 'The complement is not just one "opposite" outcome — it is ALL outcomes where A does not happen.' },
        { id: 'd', text: 'An event with probability 0.5', isCorrect: false, explanation: 'The complement can have any probability from 0 to 1, depending on P(A).' },
      ],
      explanation: 'The complement Aᶜ is the set of all outcomes in the sample space where A does not occur.',
      hint: 'Think about everything that is NOT in A.',
    },
    {
      id: 'cr-kc-4',
      type: 'multiple-choice',
      question: 'A test has a 95% pass rate. Which is the EASIEST way to find the fail rate?',
      options: [
        { id: 'a', text: 'Count all possible fail outcomes', isCorrect: false, explanation: 'Counting outcomes is unnecessary here — the complement rule is faster.' },
        { id: 'b', text: 'Use P(fail) = 1 − P(pass) = 1 − 0.95', isCorrect: true, explanation: 'Correct! The complement rule: P(fail) = 1 − 0.95 = 0.05.' },
        { id: 'c', text: 'Multiply 0.95 by the number of students', isCorrect: false, explanation: 'That gives the count of passes, not the probability of failing.' },
        { id: 'd', text: 'Divide 0.95 by 2', isCorrect: false, explanation: 'There is no reason to divide by 2 here.' },
      ],
      explanation: 'The complement rule instantly gives the fail rate: 1 − 0.95 = 0.05 = 5%.',
      hint: 'Pass and fail are complementary events.',
    },
    {
      id: 'cr-kc-5',
      type: 'multiple-choice',
      question: 'P(A) + P(Aᶜ) = ?',
      options: [
        { id: 'a', text: '0', isCorrect: false, explanation: 'P(A) and P(Aᶜ) are both non-negative and together cover all outcomes.' },
        { id: 'b', text: '0.5', isCorrect: false, explanation: 'Only true if P(A) = P(Aᶜ) = 0.5, which is not always the case.' },
        { id: 'c', text: '1', isCorrect: true, explanation: 'Correct! A and Aᶜ together cover the entire sample space, so their probabilities sum to 1.' },
        { id: 'd', text: 'Depends on P(A)', isCorrect: false, explanation: 'No — regardless of what P(A) is, P(A) + P(Aᶜ) always equals 1.' },
      ],
      explanation: 'A and its complement Aᶜ partition the sample space — together they account for every possible outcome, so their probabilities sum to exactly 1.',
      hint: 'A and Aᶜ together cover everything that can happen.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'comp-tf-1', type: 'true-false', question: 'P(Aᶜ) = 1 − P(A) for any event A.', isTrue: true, explanation: 'The complement rule states P(Aᶜ) = 1 − P(A) because A and Aᶜ together cover the entire sample space.' },
    { id: 'comp-tf-2', type: 'true-false', question: 'If P(A) = 0.7, then P(Aᶜ) = 0.3.', isTrue: true, explanation: '1 − 0.7 = 0.3. The complement rule applies directly.' },
    { id: 'comp-tf-3', type: 'true-false', question: 'P(A) + P(Aᶜ) can sometimes equal more than 1.', isTrue: false, explanation: 'A and Aᶜ are mutually exclusive and exhaustive — their probabilities always sum to exactly 1.' },
    { id: 'comp-tf-4', type: 'true-false', question: 'The complement of "rolling a 6" on a fair die is "rolling a 1, 2, 3, 4, or 5."', isTrue: true, explanation: 'The complement of an event is all outcomes NOT in that event, which here is any face other than 6.' },
    { id: 'comp-tf-5', type: 'true-false', question: 'If P(rain today) = 0.4, then P(no rain today) = 0.6.', isTrue: true, explanation: '"No rain" is the complement of "rain." 1 − 0.4 = 0.6.' },
    { id: 'comp-tf-6', type: 'true-false', question: 'The complement of an event A includes event A itself.', isTrue: false, explanation: 'Aᶜ contains only outcomes NOT in A. A and Aᶜ are mutually exclusive.' },
    { id: 'comp-tf-7', type: 'true-false', question: 'P(Aᶜ) can be negative if P(A) > 1.', isTrue: false, explanation: 'P(A) is always between 0 and 1 inclusive, so P(Aᶜ) = 1 − P(A) is always non-negative.' },
    { id: 'comp-tf-8', type: 'true-false', question: 'Using the complement rule is often easier when "at least one" events are involved.', isTrue: true, explanation: 'P(at least one) = 1 − P(none), which is frequently simpler to compute directly.' },
    { id: 'comp-tf-9', type: 'true-false', question: 'If P(A) = 1, then P(Aᶜ) = 1.', isTrue: false, explanation: 'If P(A) = 1, then P(Aᶜ) = 1 − 1 = 0. A certain event has an impossible complement.' },
    { id: 'comp-tf-10', type: 'true-false', question: 'The complement rule requires A and Aᶜ to be mutually exclusive.', isTrue: true, explanation: 'By definition, A and Aᶜ share no outcomes — they are mutually exclusive AND exhaustive.' },
    { id: 'comp-tf-11', type: 'true-false', question: 'P(Aᶜᶜ) = P(A), i.e., the complement of a complement is the original event.', isTrue: true, explanation: 'Taking the complement twice returns to the original event. (Aᶜ)ᶜ = A.' },
    { id: 'comp-tf-12', type: 'true-false', question: 'If P(A) = 0.5, then A and Aᶜ are equally likely.', isTrue: true, explanation: 'P(Aᶜ) = 1 − 0.5 = 0.5. Both have probability 0.5 — they are equally likely.' },
    { id: 'comp-tf-13', type: 'true-false', question: 'The complement rule only applies to simple events, not compound events.', isTrue: false, explanation: 'The complement rule applies to any event, simple or compound. P(Aᶜ) = 1 − P(A) universally.' },
    { id: 'comp-tf-14', type: 'true-false', question: 'P(at least one head in 3 coin flips) = 1 − P(no heads in 3 flips).', isTrue: true, explanation: '"At least one head" is the complement of "no heads." P = 1 − (0.5)³ = 1 − 0.125 = 0.875.' },
    { id: 'comp-tf-15', type: 'true-false', question: 'The complement of "exactly 2 defects" is "exactly 0 or 1 defects."', isTrue: false, explanation: 'The complement of "exactly 2" is "not exactly 2," which includes 0, 1, 3, 4, … defects — not just 0 or 1.' },
    { id: 'comp-tf-16', type: 'true-false', question: 'If an event A is impossible, its complement must be certain.', isTrue: true, explanation: 'P(A) = 0 → P(Aᶜ) = 1 − 0 = 1. An impossible event has a certain complement.' },
    { id: 'comp-tf-17', type: 'true-false', question: 'You can use the complement rule to find P(A) if you know P(Aᶜ).', isTrue: true, explanation: 'P(A) = 1 − P(Aᶜ). The relationship works in both directions.' },
    { id: 'comp-tf-18', type: 'true-false', question: 'The complement of "drawing a red card" from a standard deck is "drawing a black card."', isTrue: true, explanation: 'A standard deck has only red and black cards. Drawing not-red means drawing black.' },
    { id: 'comp-tf-19', type: 'true-false', question: 'P(A) × P(Aᶜ) = 0 for any event A.', isTrue: false, explanation: 'This product equals 0 only if P(A) = 0 or P(A) = 1. For example, P(A)=0.4 gives 0.4×0.6 = 0.24.' },
    { id: 'comp-tf-20', type: 'true-false', question: 'The complement rule is a special case of the addition rule for mutually exclusive events.', isTrue: true, explanation: 'Since A and Aᶜ are mutually exclusive and P(A ∪ Aᶜ) = 1, the addition rule gives P(A) + P(Aᶜ) = 1, which is exactly the complement rule.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'comp-mc-6', type: 'multiple-choice', question: 'A bag contains 3 red and 7 blue marbles. What is P(not red)?', options: [{ id: 'a', text: '0.3', isCorrect: false, explanation: '0.3 is P(red), not P(not red).' }, { id: 'b', text: '0.7', isCorrect: true, explanation: 'P(not red) = 1 − 0.3 = 0.7.' }, { id: 'c', text: '0.4', isCorrect: false, explanation: 'Incorrect calculation — P(red) = 3/10 = 0.3, so complement = 0.7.' }, { id: 'd', text: '1.0', isCorrect: false, explanation: 'P = 1.0 would mean the event is certain.' }], explanation: 'P(red) = 3/10 = 0.3. P(not red) = 1 − 0.3 = 0.7.', hint: 'Subtract P(red) from 1.' },
    { id: 'comp-mc-7', type: 'multiple-choice', question: 'P(at least one tail in 4 fair coin flips) equals:', options: [{ id: 'a', text: '1 − (0.5)⁴', isCorrect: true, explanation: '"At least one tail" is the complement of "no tails." P(no tails) = (0.5)⁴ = 0.0625, so answer = 0.9375.' }, { id: 'b', text: '4 × 0.5', isCorrect: false, explanation: 'You cannot simply multiply — outcomes overlap.' }, { id: 'c', text: '(0.5)⁴', isCorrect: false, explanation: '(0.5)⁴ is P(no tails), which is the complement of what is asked.' }, { id: 'd', text: '0.5', isCorrect: false, explanation: '0.5 is P(exactly one flip is tails), not at-least-one over 4 flips.' }], explanation: 'Use complement: 1 − P(zero tails) = 1 − (1/2)⁴ = 15/16 ≈ 0.9375.', hint: '"At least one" events are easiest via the complement.' },
    { id: 'comp-mc-8', type: 'multiple-choice', question: 'If P(Aᶜ) = 0.85, what is P(A)?', options: [{ id: 'a', text: '0.85', isCorrect: false, explanation: '0.85 is P(Aᶜ), not P(A).' }, { id: 'b', text: '0.15', isCorrect: true, explanation: 'P(A) = 1 − P(Aᶜ) = 1 − 0.85 = 0.15.' }, { id: 'c', text: '1.85', isCorrect: false, explanation: 'Probabilities cannot exceed 1.' }, { id: 'd', text: '0.5', isCorrect: false, explanation: 'No arithmetic basis for 0.5 here.' }], explanation: 'P(A) = 1 − 0.85 = 0.15.', hint: 'P(A) = 1 − P(Aᶜ).' },
    { id: 'comp-mc-9', type: 'multiple-choice', question: 'Which event is the complement of "rolling a number ≤ 4" on a fair 6-sided die?', options: [{ id: 'a', text: 'Rolling a 4', isCorrect: false, explanation: 'Rolling a 4 is included in ≤4, not its complement.' }, { id: 'b', text: 'Rolling a 5 or 6', isCorrect: true, explanation: 'Outcomes NOT in {1,2,3,4} are {5,6}. P = 2/6 = 1/3.' }, { id: 'c', text: 'Rolling an odd number', isCorrect: false, explanation: 'Odd numbers include 1 and 3, which ARE in {1,2,3,4}.' }, { id: 'd', text: 'Rolling a 1 or 2', isCorrect: false, explanation: '1 and 2 are in the original event ≤4, not its complement.' }], explanation: 'Complement of ≤4 is >4, i.e., {5, 6}.', hint: 'List all outcomes NOT in the original event.' },
    { id: 'comp-mc-10', type: 'multiple-choice', question: 'A student passes each exam with probability 0.9. The probability of failing AT LEAST ONE of 3 independent exams is:', options: [{ id: 'a', text: '0.1', isCorrect: false, explanation: '0.1 is P(fail one exam), not P(fail at least one of three).' }, { id: 'b', text: '0.3', isCorrect: false, explanation: 'You cannot add probabilities of dependent complements this way.' }, { id: 'c', text: '0.271', isCorrect: true, explanation: 'P(fail at least one) = 1 − P(pass all) = 1 − (0.9)³ = 1 − 0.729 = 0.271.' }, { id: 'd', text: '0.001', isCorrect: false, explanation: '0.001 would be P(fail all three) = (0.1)³, not at-least-one.' }], explanation: '1 − (0.9)³ = 1 − 0.729 = 0.271.', hint: 'Use complement: 1 − P(all pass).' },
    { id: 'comp-mc-11', type: 'multiple-choice', question: 'Which statement INCORRECTLY applies the complement rule?', options: [{ id: 'a', text: 'P(not sunny) = 1 − P(sunny)', isCorrect: false, explanation: 'This is a correct application.' }, { id: 'b', text: 'P(A) = 1 − P(Aᶜ)', isCorrect: false, explanation: 'This is a correct rearrangement.' }, { id: 'c', text: 'P(A) + P(B) = 1, therefore B = Aᶜ', isCorrect: true, explanation: 'P(A)+P(B)=1 does not mean B is the complement of A. For example P(A)=0.3, P(B)=0.7 but B could be a completely different event.' }, { id: 'd', text: 'P(at least one event) = 1 − P(no events)', isCorrect: false, explanation: 'This is a valid and common application of the complement rule.' }], explanation: 'Two events summing to probability 1 does NOT make them complements unless they are also mutually exclusive and together exhaustive.', hint: 'Complement requires mutual exclusivity AND exhaustiveness.' },
    { id: 'comp-mc-12', type: 'multiple-choice', question: 'If P(A) = p, what is P((Aᶜ)ᶜ)?', options: [{ id: 'a', text: '1 − p', isCorrect: false, explanation: '1 − p is P(Aᶜ), not P((Aᶜ)ᶜ).' }, { id: 'b', text: 'p', isCorrect: true, explanation: '(Aᶜ)ᶜ = A, so P((Aᶜ)ᶜ) = P(A) = p.' }, { id: 'c', text: '2p − 1', isCorrect: false, explanation: 'No algebraic basis for this.' }, { id: 'd', text: 'p²', isCorrect: false, explanation: 'Complementing twice returns to the original — no squaring occurs.' }], explanation: 'The complement of the complement is the original event.', hint: 'What does complementing twice do?' },
    { id: 'comp-mc-13', type: 'multiple-choice', question: 'In a class, 60% of students play sport and 30% play music. Assuming these are the only two activities, can you use the complement rule to find P(plays neither)?', options: [{ id: 'a', text: 'Yes — P(neither) = 1 − 0.6 − 0.3 = 0.1', isCorrect: false, explanation: 'Only if sport and music are mutually exclusive AND exhaustive. If students can do both, simple subtraction overcounts.' }, { id: 'b', text: 'No — the two events may overlap and are not complements of each other', isCorrect: true, explanation: 'Without knowing the overlap P(sport AND music), you cannot determine P(neither) by simple subtraction.' }, { id: 'c', text: 'Yes — P(neither) = 0.6 × 0.3 = 0.18', isCorrect: false, explanation: 'Multiplying is incorrect here.' }, { id: 'd', text: 'Yes — P(neither) always equals 1 minus the sum of individual probabilities', isCorrect: false, explanation: 'This only holds when the events are mutually exclusive.' }], explanation: 'Without knowing the overlap you cannot apply the complement rule directly. Inclusion-exclusion is needed.', hint: 'Can students do both sport and music simultaneously?' },
    { id: 'comp-mc-14', type: 'multiple-choice', question: 'A fair die is rolled. What is P(not rolling a prime number)? (Primes: 2, 3, 5)', options: [{ id: 'a', text: '1/3', isCorrect: false, explanation: '1/3 would mean only 2 outcomes are not prime. Non-primes on a die: {1, 4, 6} — that is 3 outcomes.' }, { id: 'b', text: '1/2', isCorrect: true, explanation: 'Non-primes: {1, 4, 6} = 3 outcomes out of 6. P(not prime) = 3/6 = 1/2. Alternatively: P(prime) = 3/6 = 0.5, so P(not prime) = 1 − 0.5 = 0.5.' }, { id: 'c', text: '2/3', isCorrect: false, explanation: '2/3 would mean 4 non-prime outcomes, but there are only 3: {1, 4, 6}.' }, { id: 'd', text: '1/6', isCorrect: false, explanation: '1/6 is the probability of rolling any single specific face, not P(not prime).' }], explanation: 'Primes on a die: {2, 3, 5} → P(prime) = 3/6 = 0.5. Non-primes: {1, 4, 6} → P(not prime) = 1 − 0.5 = 0.5 = 1/2.', hint: 'Count non-primes: {1, 4, 6}.' },
    { id: 'comp-mc-15', type: 'multiple-choice', question: 'Why is the complement rule particularly useful for "at least one" problems?', options: [{ id: 'a', text: 'Because P(at least one) always equals 0.5', isCorrect: false, explanation: '"At least one" does not have a fixed value.' }, { id: 'b', text: 'Because P(none) is usually much simpler to compute than enumerating all "at least one" cases', isCorrect: true, explanation: '"At least one" has many sub-cases (exactly 1, exactly 2, …). P(none) is a single calculation, so complement is simpler.' }, { id: 'c', text: 'Because it avoids the need for the multiplication rule', isCorrect: false, explanation: 'You still use multiplication to find P(none) — the complement just combines the cases efficiently.' }, { id: 'd', text: 'Because probabilities of "at least one" events always sum to 1', isCorrect: false, explanation: 'This is not generally true.' }], explanation: 'Enumerating "at least one" requires many cases; computing P(none) is one multiplication chain, making complement the efficient choice.', hint: 'How many sub-cases does "at least one" have vs. "none"?' },
  ],
  keyTakeaway:
    'P(Aᶜ) = 1 − P(A). If you know how likely something is to happen, you instantly know how likely it is NOT to happen — just subtract from 1.',
  visualization: <ComplementViz />,
  datasetGenerator: false,
}

export default function ComplementRule({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
