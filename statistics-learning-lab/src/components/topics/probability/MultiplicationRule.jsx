import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

function MultiplicationRuleViz() {
  const [mode, setMode] = useState('independent')

  const independent = {
    labels: ['P(A)', 'P(B)', 'P(A and B)'],
    values: [0.5, 0.5, 0.25],
    title: 'Independent: P(A and B) = P(A) × P(B)',
  }
  const dependent = {
    labels: ['P(A)', 'P(B|A)', 'P(A and B)'],
    values: [0.2, 0.4, 0.08],
    title: 'Dependent: P(A and B) = P(A) × P(B|A)',
  }

  const active = mode === 'independent' ? independent : dependent

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { key: 'independent', label: 'Independent Events' },
          { key: 'dependent', label: 'Dependent Events' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              mode === key
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <BarChart
        labels={active.labels}
        values={active.values}
        title={active.title}
        xLabel="Event"
        yLabel="Probability"
        color="#059669"
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">
        {mode === 'independent'
          ? 'Two coin flips: P(heads) × P(heads) = 0.5 × 0.5 = 0.25'
          : 'Healthcare: P(condition A) × P(condition B | A) = 0.20 × 0.40 = 0.08'}
      </p>
    </div>
  )
}

const content = {
  title: 'The Multiplication Rule',
  topicGroup: 'Probability',
  learningObjective:
    'Apply the multiplication rule to find the probability that two events both occur.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The multiplication rule finds <strong>P(A and B)</strong> — the probability that{' '}
        <em>both</em> events occur. The rule has two forms depending on whether the events are
        independent.
      </p>
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
        <p className="font-medium text-emerald-900">Independent events</p>
        <p className="text-sm text-emerald-800">
          The outcome of A does not affect the probability of B. Knowing A happened gives no new
          information about B.
        </p>
        <p className="text-sm font-mono text-emerald-900">P(A and B) = P(A) × P(B)</p>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
        <p className="font-medium text-orange-900">Dependent events</p>
        <p className="text-sm text-orange-800">
          The outcome of A changes the probability of B. We use the <em>conditional</em>{' '}
          probability P(B|A) — the probability of B <em>given</em> A has already occurred.
        </p>
        <p className="text-sm font-mono text-orange-900">P(A and B) = P(A) × P(B|A)</p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        <strong>Independent:</strong> Flipping a coin twice. The first flip cannot possibly affect
        the second — the coin has no memory. P(heads twice) = 0.5 × 0.5 = 0.25.
      </p>
      <p>
        <strong>Dependent:</strong> Drawing two cards from a deck <em>without replacement</em>. The
        first draw removes a card, changing the deck composition and therefore the probability for
        the second draw.
      </p>
      <p className="text-sm text-gray-600">
        The key question: "Does knowing the first event happened change the odds of the second?"
      </p>
    </div>
  ),
  formula: {
    main: 'P(A ∩ B) = P(A) × P(B|A)',
    variants: [
      { label: 'Independent events', expression: 'P(A ∩ B) = P(A) × P(B)', latex: 'P(A \\cap B) = P(A) \\times P(B)' },
      {
        label: 'Dependent events (general)',
        expression: 'P(A ∩ B) = P(A) × P(B|A)',
        latex: 'P(A \\cap B) = P(A) \\times P(B|A)',
      },
      {
        label: 'Test for independence',
        expression: 'A and B are independent if P(A ∩ B) = P(A) × P(B)',
        latex: 'A \\perp B \\iff P(A \\cap B) = P(A) \\times P(B)',
      },
    ],
    symbolGuide: [
      { symbol: 'P(A ∩ B)', meaning: 'Probability that both A and B occur (read "A intersect B")' },
      { symbol: 'P(B|A)', meaning: 'Conditional probability of B given that A has occurred (read "B given A")' },
      { symbol: '×', meaning: 'Multiplication — combined probability requires multiplying' },
    ],
  },
  whenToUse: [
    'When you need the probability that two (or more) events ALL occur',
    'In reliability calculations: P(all components work)',
    'For sequential trials where you track combined outcomes',
  ],
  whenNotToUse: [
    'When you need P(A or B) — use the addition rule instead',
    'When dependence between events is unknown — first investigate the relationship',
  ],
  assumptions: [
    'For independent form: events must be genuinely independent (verify this)',
    'For dependent form: P(B|A) must be known or calculable',
    'All individual probabilities must be valid (between 0 and 1)',
  ],
  workedExample: {
    scenario:
      'Two scenarios: (1) two fair coin flips (independent), (2) patients with comorbid conditions (dependent).',
    steps: [
      {
        stepNumber: 1,
        label: 'Independent — two coin flips',
        expression: 'P(heads 1) = 0.5, P(heads 2) = 0.5 (independent)',
        result: 'P(both heads) = 0.5 × 0.5 = 0.25',
        explanation:
          'Coin flips are independent — the first result does not affect the second. Multiply straight across.',
      },
      {
        stepNumber: 2,
        label: 'Independent — extended: three heads in a row',
        expression: 'P(HHH) = 0.5 × 0.5 × 0.5',
        result: 'P(three heads) = 0.125',
        explanation:
          'The multiplication rule extends to any number of independent events. Each additional event multiplies the probability by P(that event).',
      },
      {
        stepNumber: 3,
        label: 'Dependent — comorbid conditions',
        expression: 'P(condition A) = 0.20, P(condition B | condition A) = 0.40',
        result: 'P(both conditions) = 0.20 × 0.40 = 0.08',
        explanation:
          'Condition B is more likely when the patient already has condition A. We use the conditional probability P(B|A) in the multiplication.',
      },
      {
        stepNumber: 4,
        label: 'Compare with if they were independent',
        expression: 'If independent: P(B) alone might be 0.10, giving P(A and B) = 0.20 × 0.10 = 0.02',
        result: 'Dependent: 0.08 vs. independent: 0.02',
        explanation:
          'Dependence here makes both conditions co-occurring 4× more likely than if the conditions were independent.',
      },
    ],
    interpretation:
      'The multiplication rule reveals how probabilities compound. Independent events multiply simply. Dependent events require the conditional probability, which changes based on what is already known.',
  },
  interpretation:
    'P(A and B) is always less than or equal to both P(A) and P(B) individually — having two things occur simultaneously is harder than just one. For independent events, multiply directly; for dependent events, adjust using conditional probability.',
  commonMistakes: [
    {
      mistake: 'Assuming independence when events are dependent',
      explanation:
        'Check whether knowledge of event A actually changes P(B). Drawing cards without replacement, selecting patients from a limited population, or any situation with "without replacement" creates dependence.',
    },
    {
      mistake: 'Using P(B) instead of P(B|A) for dependent events',
      explanation:
        'If events are dependent, P(B) alone is not the right probability to use. You must use P(B|A) — the probability of B given that A has already occurred.',
    },
    {
      mistake: 'Confusing "and" (multiplication) with "or" (addition)',
      explanation:
        '"A and B both occur" uses multiplication. "A or B occurs" uses addition. Mixing these rules gives wrong answers.',
    },
    {
      mistake: 'Forgetting that probabilities compound — the joint probability is always smaller',
      explanation:
        'P(A and B) ≤ P(A) and P(A and B) ≤ P(B). If your calculation gives a joint probability larger than either individual probability, something is wrong.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'mr-easy-1',
        scenario: 'A fair die is rolled twice.',
        question: 'What is P(rolling a 6 on both rolls)?',
        hint: 'Die rolls are independent. Multiply the individual probabilities.',
        solution: 'P(6 on first) = 1/6. P(6 on second) = 1/6. P(both 6) = 1/6 × 1/6 = 1/36 ≈ 0.028.',
      },
      {
        id: 'mr-easy-2',
        scenario: 'P(event A) = 0.7 and P(event B) = 0.4. A and B are independent.',
        question: 'What is P(A and B)?',
        hint: 'Multiply independent probabilities directly.',
        solution: 'P(A and B) = 0.7 × 0.4 = 0.28.',
      },
    ],
    moderate: [
      {
        id: 'mr-mod-1',
        scenario:
          'A drawer has 5 red socks and 3 blue socks. You pick two socks without replacement.',
        question: 'What is the probability that both socks are red?',
        hint: 'The second draw depends on the first (without replacement). Use the dependent form.',
        solution:
          'P(1st red) = 5/8. P(2nd red | 1st red) = 4/7 (one red sock removed). P(both red) = 5/8 × 4/7 = 20/56 ≈ 0.357.',
      },
    ],
    challenging: [
      {
        id: 'mr-chal-1',
        scenario:
          'A system has three independent components, each with P(working) = 0.9. The system works only if all three components work.',
        question: 'What is P(system works)? What is P(at least one component fails)?',
        hint: 'Use the multiplication rule for all three components. Then use the complement for "at least one fails."',
        solution:
          'P(all work) = 0.9 × 0.9 × 0.9 = 0.729. P(at least one fails) = 1 − 0.729 = 0.271.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'mr-kc-1',
      type: 'multiple-choice',
      question:
        'P(A) = 0.6 and P(B) = 0.5. A and B are independent. What is P(A and B)?',
      options: [
        { id: 'a', text: '1.1', isCorrect: false, explanation: 'That is P(A) + P(B) — the addition rule, not multiplication.' },
        { id: 'b', text: '0.3', isCorrect: true, explanation: 'Correct! Independent: P(A and B) = 0.6 × 0.5 = 0.3.' },
        { id: 'c', text: '0.1', isCorrect: false, explanation: 'Check the arithmetic: 0.6 × 0.5 = 0.30.' },
        { id: 'd', text: '0.6', isCorrect: false, explanation: 'That is just P(A). You need to multiply by P(B).' },
      ],
      explanation: 'For independent events: P(A and B) = P(A) × P(B) = 0.6 × 0.5 = 0.3.',
      hint: 'Independent events: just multiply.',
    },
    {
      id: 'mr-kc-2',
      type: 'numerical',
      question:
        'P(disease) = 0.12. P(positive test | disease) = 0.95. What is P(disease AND positive test)?',
      answer: 0.114,
      tolerance: 0.005,
      explanation: 'P(disease and positive test) = P(disease) × P(positive | disease) = 0.12 × 0.95 = 0.114.',
      hint: 'These are dependent events. Use P(A) × P(B|A).',
    },
    {
      id: 'mr-kc-3',
      type: 'multiple-choice',
      question:
        'Which formula is correct for P(A and B) when A and B are DEPENDENT?',
      options: [
        { id: 'a', text: 'P(A) + P(B)', isCorrect: false, explanation: 'That is the addition rule for "or", not "and".' },
        { id: 'b', text: 'P(A) × P(B)', isCorrect: false, explanation: 'That formula only works when A and B are INDEPENDENT.' },
        { id: 'c', text: 'P(A) × P(B|A)', isCorrect: true, explanation: 'Correct! For dependent events, you must use the conditional probability P(B|A).' },
        { id: 'd', text: 'P(A) − P(B)', isCorrect: false, explanation: 'Subtraction is not a probability rule for "and".' },
      ],
      explanation: 'For dependent events, P(A and B) = P(A) × P(B|A), where P(B|A) is the conditional probability of B given A.',
      hint: 'For dependent events, the probability of B changes once we know A occurred.',
    },
    {
      id: 'mr-kc-4',
      type: 'multiple-choice',
      question:
        'A bag has 4 red and 6 blue marbles. Two are drawn WITHOUT replacement. Which probability changes between draws?',
      options: [
        { id: 'a', text: 'P(red) stays 4/10 for both draws', isCorrect: false, explanation: 'After removing one marble, the denominator (total) changes.' },
        { id: 'b', text: 'P(red on 2nd) depends on what was drawn 1st', isCorrect: true, explanation: 'Correct! Without replacement, the composition of the bag changes after the first draw.' },
        { id: 'c', text: 'P(red on 2nd) = 0 after drawing a red first', isCorrect: false, explanation: 'There are still 3 red marbles in the bag after drawing one red.' },
        { id: 'd', text: 'Both draws are independent', isCorrect: false, explanation: 'Drawing without replacement creates dependence — removing a marble changes what remains.' },
      ],
      explanation: 'Without replacement, the first draw changes the bag. If a red was drawn first, P(red on 2nd) = 3/9. If a blue was drawn, P(red on 2nd) = 4/9.',
      hint: 'Without replacement — what changes about the bag after the first draw?',
    },
    {
      id: 'mr-kc-5',
      type: 'multiple-choice',
      question:
        'How do you test whether two events A and B are independent?',
      options: [
        { id: 'a', text: 'Check if P(A) = P(B)', isCorrect: false, explanation: 'Equal individual probabilities do not imply independence.' },
        { id: 'b', text: 'Check if P(A and B) = P(A) × P(B)', isCorrect: true, explanation: 'Correct! If P(A∩B) equals P(A) × P(B), then A and B are independent.' },
        { id: 'c', text: 'Check if P(A or B) = 1', isCorrect: false, explanation: 'P(A or B) = 1 means the events are exhaustive, not necessarily independent.' },
        { id: 'd', text: 'Check if P(A) + P(B) = 1', isCorrect: false, explanation: 'That tests whether A and B are complementary, not independent.' },
      ],
      explanation: 'The formal test: A and B are independent if and only if P(A ∩ B) = P(A) × P(B). If this holds, knowing A occurred tells you nothing new about B.',
      hint: 'Independence means knowing A does not change P(B).',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'multr-tf-1', type: 'true-false', question: 'For independent events, P(A and B) = P(A) × P(B).', isTrue: true, explanation: 'This is the multiplication rule for independent events — the probability of both occurring is the product of their individual probabilities.' },
    { id: 'multr-tf-2', type: 'true-false', question: 'For dependent events, P(A and B) = P(A) × P(B|A).', isTrue: true, explanation: 'For dependent events, the probability of B changes given A has occurred, so we use the conditional probability P(B|A).' },
    { id: 'multr-tf-3', type: 'true-false', question: 'P(A and B) is always equal to P(B and A).', isTrue: true, explanation: 'The intersection is commutative: A∩B = B∩A, so P(A and B) = P(B and A) always.' },
    { id: 'multr-tf-4', type: 'true-false', question: 'Multiplying two probabilities always gives a result larger than each individual probability.', isTrue: false, explanation: 'Since probabilities are between 0 and 1, their product is always ≤ each factor. Joint events are rarer than individual ones.' },
    { id: 'multr-tf-5', type: 'true-false', question: 'If P(A and B) = P(A) × P(B), then A and B must be mutually exclusive.', isTrue: false, explanation: 'P(A and B) = P(A)×P(B) is the definition of independence, not mutual exclusivity. Mutually exclusive events have P(A∩B) = 0.' },
    { id: 'multr-tf-6', type: 'true-false', question: 'Drawing two cards WITHOUT replacement creates dependent events.', isTrue: true, explanation: 'Removing the first card changes the composition of the deck, so the probability of the second draw depends on the first.' },
    { id: 'multr-tf-7', type: 'true-false', question: 'Drawing two cards WITH replacement creates independent events.', isTrue: true, explanation: 'Replacing the first card restores the deck to its original state — the second draw is unaffected by the first.' },
    { id: 'multr-tf-8', type: 'true-false', question: 'P(A and B) = P(B) × P(A|B) is also a valid form of the multiplication rule.', isTrue: true, explanation: 'The rule is symmetric: P(A∩B) = P(A)×P(B|A) = P(B)×P(A|B). Both forms are equivalent.' },
    { id: 'multr-tf-9', type: 'true-false', question: 'If A and B are independent, then P(A|B) = P(A).', isTrue: true, explanation: 'Independence means knowing B provides no information about A — P(A|B) = P(A).' },
    { id: 'multr-tf-10', type: 'true-false', question: 'P(A and B) can exceed P(A) when B has a very high probability.', isTrue: false, explanation: 'P(A∩B) ≤ P(A) always, because the intersection is a subset of A.' },
    { id: 'multr-tf-11', type: 'true-false', question: 'For three independent events: P(A and B and C) = P(A) × P(B) × P(C).', isTrue: true, explanation: 'Independence extends multiplicatively: P(A∩B∩C) = P(A)×P(B)×P(C) when all three are mutually independent.' },
    { id: 'multr-tf-12', type: 'true-false', question: 'If P(A) = 0.5 and P(B) = 0.5 and they are independent, P(A and B) = 0.5.', isTrue: false, explanation: 'P(A and B) = 0.5 × 0.5 = 0.25, not 0.5.' },
    { id: 'multr-tf-13', type: 'true-false', question: 'Mutually exclusive events with non-zero probabilities are never independent.', isTrue: true, explanation: 'For mutually exclusive events, P(A∩B) = 0. For independence, P(A∩B) = P(A)×P(B) > 0. These cannot both be true if P(A),P(B) > 0.' },
    { id: 'multr-tf-14', type: 'true-false', question: 'P(A and B) = 0 means one of the events is impossible.', isTrue: false, explanation: 'P(A∩B) = 0 means the events cannot both occur simultaneously — i.e., they are mutually exclusive. Neither event needs to be impossible.' },
    { id: 'multr-tf-15', type: 'true-false', question: 'The probability of rolling a 6 three times in a row on a fair die is (1/6)³.', isTrue: true, explanation: 'The three rolls are independent. P = (1/6)×(1/6)×(1/6) = 1/216.' },
    { id: 'multr-tf-16', type: 'true-false', question: 'P(A and B) > P(A) is mathematically possible for some events A and B.', isTrue: false, explanation: 'A∩B is always a subset of A, so P(A∩B) ≤ P(A). The joint event cannot be more likely than either individual event.' },
    { id: 'multr-tf-17', type: 'true-false', question: 'The general multiplication rule P(A∩B) = P(A)×P(B|A) is valid for both independent and dependent events.', isTrue: true, explanation: 'For independent events P(B|A) = P(B), so the formula reduces to P(A)×P(B). For dependent events, P(B|A) ≠ P(B). The general form covers both cases.' },
    { id: 'multr-tf-18', type: 'true-false', question: 'If P(B|A) > P(B), then knowing A occurred makes B more likely.', isTrue: true, explanation: 'A positive dependence: conditioning on A increases the probability of B.' },
    { id: 'multr-tf-19', type: 'true-false', question: 'P(A and B and C) = P(A) × P(B|A) × P(C|A and B) for any events A, B, C.', isTrue: true, explanation: 'This is the chain rule of probability — valid for any events regardless of dependence.' },
    { id: 'multr-tf-20', type: 'true-false', question: 'Two events cannot be both independent and have P(A and B) = 0 unless at least one event is impossible.', isTrue: true, explanation: 'If A and B are independent with P(A)>0 and P(B)>0, then P(A∩B) = P(A)×P(B) > 0. For P(A∩B) = 0 to hold, at least one probability must be 0.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'multr-mc-6', type: 'multiple-choice', question: 'P(A) = 0.4, P(B) = 0.3, A and B are independent. What is P(A and B)?', options: [{ id: 'a', text: '0.7', isCorrect: false, explanation: '0.7 = P(A)+P(B) — that is P(A or B) for mutually exclusive events.' }, { id: 'b', text: '0.12', isCorrect: true, explanation: 'P(A and B) = P(A)×P(B) = 0.4×0.3 = 0.12.' }, { id: 'c', text: '0.1', isCorrect: false, explanation: '0.1 = 0.4−0.3 — subtraction has no basis here.' }, { id: 'd', text: '0.4', isCorrect: false, explanation: '0.4 is just P(A), not P(A and B).' }], explanation: 'Independent events: P(A∩B) = 0.4 × 0.3 = 0.12.', hint: 'For independent events, multiply the individual probabilities.' },
    { id: 'multr-mc-7', type: 'multiple-choice', question: 'A bag has 5 red and 5 blue balls. Two balls are drawn WITHOUT replacement. P(both red)?', options: [{ id: 'a', text: '0.25', isCorrect: false, explanation: '0.25 = (0.5)² — this would be correct with replacement, but draws without replacement are dependent.' }, { id: 'b', text: '2/9', isCorrect: true, explanation: 'P(1st red) = 5/10. P(2nd red | 1st red) = 4/9. Product = 20/90 = 2/9.' }, { id: 'c', text: '1/2', isCorrect: false, explanation: '1/2 is P(1st red) alone, not P(both red).' }, { id: 'd', text: '1/4', isCorrect: false, explanation: '1/4 assumes independence (with replacement). Without replacement the second probability changes.' }], explanation: 'P(both red) = (5/10) × (4/9) = 20/90 = 2/9 ≈ 0.222.', hint: 'After drawing one red ball, how many red balls and total balls remain?' },
    { id: 'multr-mc-8', type: 'multiple-choice', question: 'P(A) = 0.6, P(B|A) = 0.5. What is P(A and B)?', options: [{ id: 'a', text: '1.1', isCorrect: false, explanation: '1.1 > 1 is impossible.' }, { id: 'b', text: '0.3', isCorrect: true, explanation: 'P(A and B) = P(A) × P(B|A) = 0.6 × 0.5 = 0.3.' }, { id: 'c', text: '0.1', isCorrect: false, explanation: '0.1 = 0.6−0.5 — subtraction has no basis here.' }, { id: 'd', text: '0.6', isCorrect: false, explanation: '0.6 is just P(A).' }], explanation: 'General multiplication rule: P(A∩B) = P(A) × P(B|A) = 0.6 × 0.5 = 0.3.', hint: 'Apply the general multiplication rule directly.' },
    { id: 'multr-mc-9', type: 'multiple-choice', question: 'Which test correctly identifies independence between A and B?', options: [{ id: 'a', text: 'Check if P(A) = P(B)', isCorrect: false, explanation: 'Equal individual probabilities do not imply independence.' }, { id: 'b', text: 'Check if P(A and B) = P(A) × P(B)', isCorrect: true, explanation: 'By definition, A and B are independent if and only if P(A∩B) = P(A)×P(B).' }, { id: 'c', text: 'Check if P(A or B) = 1', isCorrect: false, explanation: 'P(A∪B) = 1 means exhaustive events, not independent.' }, { id: 'd', text: 'Check if P(A) + P(B) = 1', isCorrect: false, explanation: 'This tests complementarity, not independence.' }], explanation: 'The multiplication rule test for independence: P(A∩B) = P(A)×P(B).', hint: 'What does independence literally mean for joint probability?' },
    { id: 'multr-mc-10', type: 'multiple-choice', question: 'A fair coin is flipped 3 times. What is P(all three heads)?', options: [{ id: 'a', text: '3/8', isCorrect: false, explanation: '3/8 is P(exactly two heads), not three.' }, { id: 'b', text: '1/8', isCorrect: true, explanation: 'P(HHH) = (1/2)³ = 1/8. Each flip is independent.' }, { id: 'c', text: '1/2', isCorrect: false, explanation: '1/2 is P(heads on one flip), not three in a row.' }, { id: 'd', text: '1/4', isCorrect: false, explanation: '1/4 = (1/2)² is P(two heads in a row), not three.' }], explanation: 'Independent flips: (1/2) × (1/2) × (1/2) = 1/8.', hint: 'Multiply the individual probabilities of three independent flips.' },
    { id: 'multr-mc-11', type: 'multiple-choice', question: 'If P(A and B) = 0.15 and P(A) = 0.5, what is P(B|A)?', options: [{ id: 'a', text: '0.075', isCorrect: false, explanation: '0.075 = P(A∩B) × P(A), which reverses the formula.' }, { id: 'b', text: '0.3', isCorrect: true, explanation: 'P(B|A) = P(A∩B) / P(A) = 0.15 / 0.5 = 0.3.' }, { id: 'c', text: '0.65', isCorrect: false, explanation: '0.65 = 0.5+0.15 — addition has no basis here.' }, { id: 'd', text: '0.5', isCorrect: false, explanation: '0.5 is P(A), not the conditional probability.' }], explanation: 'Rearrange the multiplication rule: P(B|A) = P(A∩B) / P(A) = 0.15 / 0.5 = 0.3.', hint: 'Rearrange P(A∩B) = P(A)×P(B|A) to solve for P(B|A).' },
    { id: 'multr-mc-12', type: 'multiple-choice', question: 'P(A) = 0.8, P(B) = 0.8, A and B independent. P(both fail) where "fail" = complement?', options: [{ id: 'a', text: '0.04', isCorrect: true, explanation: 'P(Aᶜ) = 0.2, P(Bᶜ) = 0.2. Independent: P(both fail) = 0.2×0.2 = 0.04.' }, { id: 'b', text: '0.64', isCorrect: false, explanation: '0.64 = P(A)×P(B) — that is P(both succeed).' }, { id: 'c', text: '0.4', isCorrect: false, explanation: '0.4 = P(Aᶜ)+P(Bᶜ) for mutually exclusive, but they overlap here.' }, { id: 'd', text: '0.16', isCorrect: false, explanation: '0.16 = (0.4)² — but P(Aᶜ) = 0.2, not 0.4.' }], explanation: 'P(Aᶜ) = P(Bᶜ) = 0.2. P(both fail) = 0.2 × 0.2 = 0.04.', hint: 'Find the complement probabilities first, then multiply.' },
    { id: 'multr-mc-13', type: 'multiple-choice', question: 'What is the chain rule P(A∩B∩C) for dependent events?', options: [{ id: 'a', text: 'P(A) × P(B) × P(C)', isCorrect: false, explanation: 'This is for independent events only.' }, { id: 'b', text: 'P(A) × P(B|A) × P(C|A∩B)', isCorrect: true, explanation: 'The chain rule for dependent events: multiply P(A), then the conditional P(B|A), then P(C given both A and B).' }, { id: 'c', text: 'P(A) + P(B) + P(C)', isCorrect: false, explanation: 'Addition gives P(A or B or C) (for mutually exclusive events), not P(A and B and C).' }, { id: 'd', text: 'P(C|B) × P(B|A)', isCorrect: false, explanation: 'This misses P(A) and does not give the full joint probability.' }], explanation: 'Chain rule: P(A∩B∩C) = P(A) × P(B|A) × P(C|A∩B). Each factor conditions on all previously occurred events.', hint: 'Each event conditions on all the events that came before it.' },
    { id: 'multr-mc-14', type: 'multiple-choice', question: 'Machine A works with P = 0.9, Machine B independently works with P = 0.8. P(both work)?', options: [{ id: 'a', text: '0.17', isCorrect: false, explanation: '0.17 ≈ 0.9−0.8+something — no arithmetic basis.' }, { id: 'b', text: '0.72', isCorrect: true, explanation: 'P(A and B) = 0.9 × 0.8 = 0.72.' }, { id: 'c', text: '1.7', isCorrect: false, explanation: '1.7 > 1 is impossible.' }, { id: 'd', text: '0.85', isCorrect: false, explanation: '0.85 is the average — not what multiplication gives.' }], explanation: '0.9 × 0.8 = 0.72. Independent events: multiply.', hint: 'Machines are independent — multiply their probabilities.' },
    { id: 'multr-mc-15', type: 'multiple-choice', question: 'P(A) = 0.3, A and B are independent, P(A and B) = 0.12. What is P(B)?', options: [{ id: 'a', text: '0.036', isCorrect: false, explanation: '0.036 = P(A)×P(A and B) — division is needed, not multiplication.' }, { id: 'b', text: '0.4', isCorrect: true, explanation: 'P(B) = P(A∩B) / P(A) = 0.12 / 0.3 = 0.4.' }, { id: 'c', text: '0.42', isCorrect: false, explanation: '0.42 = 0.3+0.12 — addition has no basis here.' }, { id: 'd', text: '2.5', isCorrect: false, explanation: '2.5 > 1 is impossible.' }], explanation: 'Independent: P(B) = P(A∩B) / P(A) = 0.12 / 0.3 = 0.4.', hint: 'Rearrange: P(B) = P(A and B) / P(A).' },
  ],
  keyTakeaway:
    'P(A and B) = P(A) × P(B) for independent events; P(A and B) = P(A) × P(B|A) for dependent events. Multiplying probabilities makes the result smaller — joint events are rarer than individual ones.',
  visualization: <MultiplicationRuleViz />,
  datasetGenerator: false,
}

export default function MultiplicationRule({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
