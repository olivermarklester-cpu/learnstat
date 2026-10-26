import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

function IndependenceViz() {
  const [scenario, setScenario] = useState('independent')

  const independent = {
    labels: ['P(6 on 1st die)', 'P(6 on 2nd die)', 'P(both 6s) = product'],
    values: [1 / 6, 1 / 6, (1 / 6) * (1 / 6)].map((v) => Math.round(v * 10000) / 10000),
    title: 'Independent: Die Rolls (with replacement)',
    note: 'P(A) × P(B) = 0.1667 × 0.1667 = 0.0278. First roll has no effect on the second.',
  }
  const dependent = {
    labels: ['P(Ace on 1st)', 'P(Ace on 2nd | Ace 1st)', 'P(both Aces)'],
    values: [4 / 52, 3 / 51, (4 / 52) * (3 / 51)].map((v) => Math.round(v * 10000) / 10000),
    title: 'Dependent: Cards Drawn Without Replacement',
    note: 'After drawing one Ace, only 3 Aces remain in 51 cards — P(2nd Ace) changes.',
  }

  const active = scenario === 'independent' ? independent : dependent

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {[
          { key: 'independent', label: 'Independent (dice)' },
          { key: 'dependent', label: 'Dependent (cards)' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setScenario(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              scenario === key
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
        color="#0891B2"
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">{active.note}</p>
    </div>
  )
}

const content = {
  title: 'Independent & Dependent Events',
  topicGroup: 'Probability',
  learningObjective:
    'Distinguish between independent and dependent events, and explain how dependence affects probability calculations.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        Two events are <strong>independent</strong> if knowing one happened does{' '}
        <em>not change</em> the probability of the other. Two events are{' '}
        <strong>dependent</strong> if knowing one happened <em>does change</em> the probability of
        the other.
      </p>
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 space-y-1">
        <p className="font-medium text-cyan-900">Independent events</p>
        <p className="text-sm text-cyan-800">
          P(B|A) = P(B) — knowing A happened gives no new information about B.
        </p>
        <p className="text-sm text-cyan-800">
          Formal test: A and B are independent if P(A ∩ B) = P(A) × P(B).
        </p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
        <p className="font-medium text-amber-900">Dependent events</p>
        <p className="text-sm text-amber-800">
          P(B|A) ≠ P(B) — knowing A happened <em>changes</em> the probability of B.
        </p>
        <p className="text-sm text-amber-800">
          The multiplication rule must use the conditional probability: P(A ∩ B) = P(A) × P(B|A).
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        <strong>Independent:</strong> A coin has no memory. Whether you got heads on flip 1 does
        not affect the probability of heads on flip 2. P(H on flip 2) = 0.5 regardless.
      </p>
      <p>
        <strong>Dependent:</strong> Imagine a jar with 3 red and 7 blue candies. You eat one red
        candy. Now the jar has only 2 red and 7 blue — the probability of drawing red next time
        has changed from 3/10 to 2/9.
      </p>
      <p className="text-sm text-gray-600">
        "With replacement" → independent. "Without replacement" → dependent.
      </p>
    </div>
  ),
  formula: {
    main: 'Test: A ⊥ B iff P(A ∩ B) = P(A) × P(B)',
    variants: [
      {
        label: 'Independence test',
        expression: 'A and B are independent ⟺ P(A ∩ B) = P(A) × P(B)',
        latex: 'A \\perp B \\iff P(A \\cap B) = P(A) \\times P(B)',
      },
      {
        label: 'Equivalent condition',
        expression: 'A and B are independent ⟺ P(B|A) = P(B)',
        latex: 'A \\perp B \\iff P(B|A) = P(B)',
      },
      {
        label: 'Multiplication rule (independent)',
        expression: 'P(A ∩ B) = P(A) × P(B)',
        latex: 'P(A \\cap B) = P(A) \\times P(B)',
      },
      {
        label: 'Multiplication rule (dependent)',
        expression: 'P(A ∩ B) = P(A) × P(B|A)',
        latex: 'P(A \\cap B) = P(A) \\times P(B|A)',
      },
    ],
    symbolGuide: [
      { symbol: 'P(B|A)', meaning: 'Conditional probability of B given A (read "P of B given A")' },
      { symbol: 'A ⊥ B', meaning: 'Notation for "A and B are independent"' },
      { symbol: '⟺', meaning: 'If and only if — both directions hold' },
      { symbol: 'P(A ∩ B)', meaning: 'Probability that both A and B occur' },
    ],
  },
  whenToUse: [
    'When determining which multiplication rule form to apply (independent or dependent)',
    'When designing experiments — randomisation and independence are core assumptions',
    'When checking whether two risk factors in a dataset are related',
  ],
  whenNotToUse: [
    'Do not assume independence without checking — real-world events often share causes and are dependent',
    'Sampling without replacement from a small population creates dependence',
  ],
  assumptions: [
    'Independence must be verified — either by the study design (random sampling with replacement) or by statistical testing',
    'The formal test P(A ∩ B) = P(A) × P(B) checks independence using known probabilities',
  ],
  workedExample: {
    scenario:
      'Compare two scenarios: rolling a die twice (independent) vs. drawing cards without replacement (dependent).',
    steps: [
      {
        stepNumber: 1,
        label: 'Dice — are the two rolls independent?',
        expression: 'P(6 on roll 1) = 1/6; after rolling, the die is the same',
        result: 'P(6 on roll 2 | 6 on roll 1) = 1/6 = P(6 on roll 2) → INDEPENDENT',
        explanation:
          'The die has no memory. The second roll probability is unchanged by the first result.',
      },
      {
        stepNumber: 2,
        label: 'Dice — verify with the independence test',
        expression: 'P(A ∩ B) = 1/36; P(A) × P(B) = 1/6 × 1/6 = 1/36',
        result: '1/36 = 1/36 ✓ — confirmed independent',
        explanation: 'The product of individual probabilities equals the joint probability.',
      },
      {
        stepNumber: 3,
        label: 'Cards — are draws without replacement independent?',
        expression: 'P(Ace on 1st) = 4/52; after drawing one Ace, P(Ace on 2nd) = 3/51',
        result: 'P(Ace on 2nd | Ace on 1st) = 3/51 ≠ 4/52 → DEPENDENT',
        explanation:
          'Removing one Ace from the deck changes the probability for the next draw.',
      },
      {
        stepNumber: 4,
        label: 'Cards — joint probability using dependent rule',
        expression: 'P(both Aces) = (4/52) × (3/51)',
        result: 'P(both Aces) = 12/2652 ≈ 0.0045',
        explanation:
          'Using the dependent multiplication rule gives the correct joint probability.',
      },
      {
        stepNumber: 5,
        label: 'Hospital room assignment — dependent scenario',
        expression: 'If only 2 isolation rooms remain out of 5 available rooms, P(isolation | 1st patient assigned) affects P(isolation | 2nd patient)',
        result: 'With assignment, room availability changes → dependent',
        explanation:
          'Real-world resource allocation (beds, rooms, equipment) typically creates dependence.',
      },
    ],
    interpretation:
      'Replacing what was drawn keeps events independent. Not replacing changes the composition and creates dependence. Always ask: "Does what happened first change the setup for what comes next?"',
  },
  interpretation:
    'Independence means complete statistical separation — events have no influence on each other. Dependence means a connection exists. Getting this distinction right determines which multiplication formula to use and whether assumptions of standard statistical tests hold.',
  commonMistakes: [
    {
      mistake: 'Confusing mutually exclusive with independent',
      explanation:
        'Mutually exclusive events CANNOT both happen (P(A and B) = 0). Independent events CAN both happen but knowing one does not change the probability of the other. These are different concepts — mutually exclusive events with P > 0 are actually dependent!',
    },
    {
      mistake: 'Assuming all coin flips and dice rolls are always independent',
      explanation:
        'Fair coins and dice are independent when flipped or rolled separately. But if you are counting how many heads out of a fixed number of flips, each flip is not independent of the others if there is a constraint.',
    },
    {
      mistake: 'Forgetting that "without replacement" means dependent',
      explanation:
        '"Without replacement" means you remove what you drew, changing the remaining pool. Always use the conditional probability P(B|A) in the multiplication rule.',
    },
    {
      mistake: 'Claiming events are dependent just because they happen close in time',
      explanation:
        'Temporal proximity does not imply statistical dependence. Two machines in different rooms may fail at similar times without any causal connection.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'ide-easy-1',
        scenario: 'A spinner with 4 equal sections (1–4) is spun twice.',
        question: 'Are the two spins independent or dependent? What is P(landing on 3 both times)?',
        hint: 'Does the first spin change the spinner for the second spin?',
        solution:
          'Independent — the spinner is unchanged by the first spin. P(3 on both) = 1/4 × 1/4 = 1/16 = 0.0625.',
      },
      {
        id: 'ide-easy-2',
        scenario: 'A bag has 5 balls. You draw one, note its colour, and put it back before drawing again.',
        question: 'Are the two draws independent or dependent?',
        hint: 'Does putting the ball back change anything for the second draw?',
        solution:
          'With replacement: independent. The bag composition is exactly the same for both draws.',
      },
    ],
    moderate: [
      {
        id: 'ide-mod-1',
        scenario:
          'A company has 10 employees: 4 are managers and 6 are non-managers. Two are selected for a committee without replacement.',
        question:
          'Are the two selections independent? What is P(both selected are managers)?',
        hint: 'Without replacement — the first selection removes a person from the pool.',
        solution:
          'Dependent (without replacement). P(1st is manager) = 4/10. P(2nd is manager | 1st was manager) = 3/9. P(both managers) = 4/10 × 3/9 = 12/90 ≈ 0.133.',
      },
    ],
    challenging: [
      {
        id: 'ide-chal-1',
        scenario:
          'Medical data shows P(high cholesterol) = 0.25, P(heart disease) = 0.10, and P(high cholesterol and heart disease) = 0.06.',
        question:
          'Are high cholesterol and heart disease statistically independent? Show your working.',
        hint: 'Use the independence test: check if P(A ∩ B) = P(A) × P(B).',
        solution:
          'If independent: P(A) × P(B) = 0.25 × 0.10 = 0.025. Actual P(A ∩ B) = 0.06 ≠ 0.025. Not independent — heart disease is more likely in those with high cholesterol than expected by chance.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ide-kc-1',
      type: 'multiple-choice',
      question: 'Two events A and B are independent. P(A) = 0.4, P(B) = 0.3. What is P(B|A)?',
      options: [
        { id: 'a', text: '0.12', isCorrect: false, explanation: 'That is P(A and B) = P(A) × P(B) for independent events.' },
        { id: 'b', text: '0.3', isCorrect: true, explanation: 'Correct! For independent events, P(B|A) = P(B). Knowing A occurred does not change P(B).' },
        { id: 'c', text: '0.7', isCorrect: false, explanation: 'That is P(Bᶜ) = 1 − 0.3.' },
        { id: 'd', text: '0.4', isCorrect: false, explanation: 'That is P(A), not P(B|A).' },
      ],
      explanation: 'For independent events, P(B|A) = P(B). The occurrence of A provides no information about B.',
      hint: 'Independence means knowing A tells you nothing new about B.',
    },
    {
      id: 'ide-kc-2',
      type: 'multiple-choice',
      question:
        'Which scenario BEST describes dependent events?',
      options: [
        { id: 'a', text: 'Rolling a die and flipping a coin', isCorrect: false, explanation: 'These use different, unrelated objects — completely independent.' },
        { id: 'b', text: 'Drawing two cards without replacement from the same deck', isCorrect: true, explanation: 'Correct! Without replacement, the first draw changes the deck for the second draw — dependent.' },
        { id: 'c', text: 'Two separate random samples from large populations', isCorrect: false, explanation: 'Independent sampling from large populations produces independent results.' },
        { id: 'd', text: 'Flipping the same coin twice', isCorrect: false, explanation: 'A fair coin has no memory — two flips are independent.' },
      ],
      explanation: 'Drawing without replacement changes the population for subsequent draws, making them dependent.',
      hint: 'Which scenario changes the available outcomes after the first event?',
    },
    {
      id: 'ide-kc-3',
      type: 'multiple-choice',
      question:
        'P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.20. Are A and B independent?',
      options: [
        { id: 'a', text: 'Yes, because P(A and B) = P(A) × P(B)', isCorrect: true, explanation: 'Correct! 0.5 × 0.4 = 0.20 = P(A and B). The independence test passes.' },
        { id: 'b', text: 'No, because P(A) ≠ P(B)', isCorrect: false, explanation: 'Independence is not about whether P(A) = P(B). It is about whether P(A ∩ B) = P(A) × P(B).' },
        { id: 'c', text: 'No, because P(A and B) should be 0 for independence', isCorrect: false, explanation: 'P(A and B) = 0 describes mutually exclusive events, not independent events.' },
        { id: 'd', text: 'Cannot determine from given information', isCorrect: false, explanation: 'We have all the information needed: check if P(A ∩ B) = P(A) × P(B).' },
      ],
      explanation: 'Independence test: P(A) × P(B) = 0.5 × 0.4 = 0.20 = P(A ∩ B). The test passes — A and B are independent.',
      hint: 'Calculate P(A) × P(B) and compare to P(A and B).',
    },
    {
      id: 'ide-kc-4',
      type: 'multiple-choice',
      question:
        'Mutually exclusive events with non-zero probabilities are:',
      options: [
        { id: 'a', text: 'Always independent', isCorrect: false, explanation: 'Mutually exclusive events (where knowing A happened tells you B cannot happen) are actually dependent.' },
        { id: 'b', text: 'Always dependent', isCorrect: true, explanation: 'Correct! If A and B are mutually exclusive, P(B|A) = 0 ≠ P(B). Knowing A happened definitely changes P(B). They are dependent.' },
        { id: 'c', text: 'Sometimes independent', isCorrect: false, explanation: 'For mutually exclusive events, P(B|A) is always 0, while P(B) > 0 — so they are always dependent.' },
        { id: 'd', text: 'Neither independent nor dependent', isCorrect: false, explanation: 'Independence and dependence are exhaustive categories — every pair of events is one or the other.' },
      ],
      explanation: 'If A and B are mutually exclusive (P(A and B) = 0), then P(B|A) = 0 while P(B) > 0. Since P(B|A) ≠ P(B), they are dependent — knowing A happened tells you B did not.',
      hint: 'If A and B cannot both happen, does knowing A happened change P(B)?',
    },
    {
      id: 'ide-kc-5',
      type: 'multiple-choice',
      question:
        'Which is the most reliable way to ensure independence between two drawn items?',
      options: [
        { id: 'a', text: 'Use a large sample', isCorrect: false, explanation: 'Larger samples do not guarantee independence — replacement does.' },
        { id: 'b', text: 'Draw with replacement', isCorrect: true, explanation: 'Correct! Replacing each drawn item restores the original composition — each draw is independent of the previous.' },
        { id: 'c', text: 'Sort the population before drawing', isCorrect: false, explanation: 'Sorting does not create independence.' },
        { id: 'd', text: 'Draw from different populations', isCorrect: false, explanation: 'Drawing from different populations helps, but replacement within the same population also achieves independence.' },
      ],
      explanation: 'Replacing each drawn item returns the population to its original state — the probability for the next draw is identical to the first.',
      hint: 'What makes each draw see the same population as the previous draw?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'ide-tf-1', type: 'true-false', question: 'For independent events A and B, P(B|A) = P(B).', isTrue: true, explanation: 'Independence means knowing A occurred provides no information about B — the conditional probability equals the unconditional probability.' },
    { id: 'ide-tf-2', type: 'true-false', question: 'Mutually exclusive events with non-zero probabilities are always independent.', isTrue: false, explanation: 'Mutually exclusive events are actually dependent: knowing A occurred tells you B cannot occur, changing P(B|A) from P(B).' },
    { id: 'ide-tf-3', type: 'true-false', question: 'Drawing cards without replacement creates dependent events.', isTrue: true, explanation: 'Removing a card changes the deck composition, so probabilities of subsequent draws depend on previous ones.' },
    { id: 'ide-tf-4', type: 'true-false', question: 'Drawing cards with replacement creates independent events.', isTrue: true, explanation: 'Returning the card restores the original composition — each draw has the same probability regardless of previous draws.' },
    { id: 'ide-tf-5', type: 'true-false', question: 'If two events are independent, P(A and B) = P(A) + P(B).', isTrue: false, explanation: 'Addition gives P(A or B) for mutually exclusive events. For independence: P(A and B) = P(A) × P(B).' },
    { id: 'ide-tf-6', type: 'true-false', question: 'Rolling a die twice produces independent events.', isTrue: true, explanation: 'The outcome of the first roll has no effect on the second roll — the events are independent.' },
    { id: 'ide-tf-7', type: 'true-false', question: 'If P(A|B) = P(A), we can conclude A and B are independent.', isTrue: true, explanation: 'P(A|B) = P(A) is one of the equivalent definitions of independence — B provides no information about A.' },
    { id: 'ide-tf-8', type: 'true-false', question: 'Two events can be dependent even if they are not causally related.', isTrue: true, explanation: 'Statistical dependence (P(A|B) ≠ P(A)) does not require a causal link — a common cause or coincidence can create dependence.' },
    { id: 'ide-tf-9', type: 'true-false', question: 'If P(A and B) = P(A) × P(B), then A and B are independent by definition.', isTrue: true, explanation: 'This product rule is the formal definition of independence.' },
    { id: 'ide-tf-10', type: 'true-false', question: 'Weather on Monday and Tuesday in the same city are typically independent events.', isTrue: false, explanation: 'Weather on consecutive days is typically dependent — rainy Monday increases the probability of rainy Tuesday.' },
    { id: 'ide-tf-11', type: 'true-false', question: 'If A and B are independent, then Aᶜ and B are also independent.', isTrue: true, explanation: 'If A and B are independent, then any combination of complements (Aᶜ and B, A and Bᶜ, Aᶜ and Bᶜ) also satisfies the independence condition.' },
    { id: 'ide-tf-12', type: 'true-false', question: 'Pairwise independence between A, B, and C implies mutual independence of all three.', isTrue: false, explanation: 'Three events can be pairwise independent without being mutually independent. Mutual independence is a stronger condition.' },
    { id: 'ide-tf-13', type: 'true-false', question: 'For dependent events, P(B|A) ≠ P(B).', isTrue: true, explanation: 'Dependence means knowledge of A changes the probability of B — P(B|A) ≠ P(B) by definition.' },
    { id: 'ide-tf-14', type: 'true-false', question: 'Independence between events implies they cannot occur simultaneously.', isTrue: false, explanation: 'Independent events can absolutely occur together — independence is about information, not physical incompatibility.' },
    { id: 'ide-tf-15', type: 'true-false', question: 'In a large population, the 10% rule says sampling is approximately independent when the sample is less than 10% of the population.', isTrue: true, explanation: 'When n < 10% of N, sampling without replacement is approximately independent — the population composition barely changes.' },
    { id: 'ide-tf-16', type: 'true-false', question: 'If event A causes event B, they must be statistically dependent.', isTrue: true, explanation: 'Causation implies statistical dependence: if A causes B, then knowing A changes P(B).' },
    { id: 'ide-tf-17', type: 'true-false', question: 'P(A|B) can equal P(B|A) even when A and B are dependent.', isTrue: true, explanation: 'This can occur by coincidence — e.g., if P(A) = P(B). Bayes\' theorem shows P(A|B) = P(B|A) × P(A)/P(B), which equals P(B|A) when P(A) = P(B).' },
    { id: 'ide-tf-18', type: 'true-false', question: 'Statistical independence and "no relationship" mean exactly the same thing in all contexts.', isTrue: false, explanation: 'Statistical independence (P(A|B) = P(A)) is a precise mathematical definition. "No relationship" is informal and can have other meanings.' },
    { id: 'ide-tf-19', type: 'true-false', question: 'For three mutually independent events, P(A and B and C) = P(A) × P(B) × P(C).', isTrue: true, explanation: 'Mutual independence extends the multiplication rule to any number of events.' },
    { id: 'ide-tf-20', type: 'true-false', question: 'If drawing without replacement from a very large population, events are nearly independent.', isTrue: true, explanation: 'With a very large N, removing a few items barely changes the proportions — the 10% rule formalises this approximation.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'ide-mc-6', type: 'multiple-choice', question: 'A fair die is rolled twice. Are the two outcomes independent?', options: [{ id: 'a', text: 'No — the second roll depends on the first', isCorrect: false, explanation: 'A physical die has no memory — the second roll is completely unaffected by the first.' }, { id: 'b', text: 'Yes — the outcome of one roll does not affect the other', isCorrect: true, explanation: 'Each die roll is a fresh, independent event. P(2nd roll = x | 1st roll = y) = P(2nd roll = x) for all x, y.' }, { id: 'c', text: 'Only if both rolls give the same number', isCorrect: false, explanation: 'Independence is a property of the process, not the outcomes.' }, { id: 'd', text: 'Only if the die is weighted', isCorrect: false, explanation: 'Bias affects individual probabilities but not independence between rolls.' }], explanation: 'Rolling a die twice produces independent events — past rolls carry no information about future ones.', hint: 'Does the die have a memory of previous outcomes?' },
    { id: 'ide-mc-7', type: 'multiple-choice', question: 'P(A) = 0.4, P(B) = 0.5, P(A and B) = 0.2. Are A and B independent?', options: [{ id: 'a', text: 'No — P(A∩B) should be 0 for independence', isCorrect: false, explanation: 'Independence does not require P(A∩B) = 0. It requires P(A∩B) = P(A)×P(B).' }, { id: 'b', text: 'Yes — P(A∩B) = P(A) × P(B) = 0.2', isCorrect: true, explanation: 'P(A)×P(B) = 0.4×0.5 = 0.2 = P(A∩B). The independence criterion is satisfied.' }, { id: 'c', text: 'Yes — because P(A) + P(B) = 0.9', isCorrect: false, explanation: 'The sum of probabilities has nothing to do with independence.' }, { id: 'd', text: 'Cannot determine without more information', isCorrect: false, explanation: 'You have enough: P(A∩B) = P(A)×P(B) is the test.' }], explanation: 'P(A)×P(B) = 0.4×0.5 = 0.2 = P(A∩B). Independence criterion is met.', hint: 'Check: does P(A∩B) = P(A) × P(B)?' },
    { id: 'ide-mc-8', type: 'multiple-choice', question: 'A bag has 3 red and 7 blue. You draw one, keep it, then draw another. The two draws are:', options: [{ id: 'a', text: 'Independent, because it is random', isCorrect: false, explanation: 'Randomness alone does not create independence. Without replacement, the population changes.' }, { id: 'b', text: 'Dependent, because the first draw changes the bag composition', isCorrect: true, explanation: 'With 9 balls remaining after the first draw, probabilities shift. The events are dependent.' }, { id: 'c', text: 'Independent, because you cannot see what you drew', isCorrect: false, explanation: 'Whether you see the result is irrelevant — the physical composition changes regardless.' }, { id: 'd', text: 'Independent only if you drew blue first', isCorrect: false, explanation: 'Independence is a property of the sampling process, not which colour was drawn.' }], explanation: 'Without replacement, the bag composition changes after the first draw — a defining characteristic of dependent events.', hint: 'Does the first draw change what is left in the bag?' },
    { id: 'ide-mc-9', type: 'multiple-choice', question: 'Which of these is the strongest evidence of dependence between A and B?', options: [{ id: 'a', text: 'P(A) ≠ P(B)', isCorrect: false, explanation: 'Having different individual probabilities says nothing about whether they depend on each other.' }, { id: 'b', text: 'P(A|B) ≠ P(A)', isCorrect: true, explanation: 'If knowing B changes P(A), the events are dependent by definition.' }, { id: 'c', text: 'P(A and B) > 0', isCorrect: false, explanation: 'P(A∩B) > 0 simply means the events can co-occur — independent events can also satisfy this.' }, { id: 'd', text: 'P(A or B) < 1', isCorrect: false, explanation: 'P(A∪B) < 1 just means the events do not cover the whole sample space.' }], explanation: 'P(A|B) ≠ P(A) is the direct mathematical definition of dependence.', hint: 'Dependence means conditioning on one changes the probability of the other.' },
    { id: 'ide-mc-10', type: 'multiple-choice', question: 'You toss a coin 5 times and get 5 heads. What is the probability the 6th toss is heads?', options: [{ id: 'a', text: 'Greater than 0.5 — you are on a streak', isCorrect: false, explanation: 'The "hot hand" fallacy — coins have no memory.' }, { id: 'b', text: '0.5 — each toss is independent', isCorrect: true, explanation: 'A fair coin has no memory. P(heads) = 0.5 regardless of previous outcomes.' }, { id: 'c', text: 'Less than 0.5 — tails is "due"', isCorrect: false, explanation: 'The gambler\'s fallacy — past outcomes do not influence future independent events.' }, { id: 'd', text: '1/32 — depends on the previous 5 tosses', isCorrect: false, explanation: '1/32 is P(6 heads in a row from scratch). The 6th toss alone has P = 0.5.' }], explanation: 'Independent events have no memory. The probability of heads on any fair coin toss is always 0.5.', hint: 'Does a coin remember its previous outcomes?' },
    { id: 'ide-mc-11', type: 'multiple-choice', question: 'P(A) = 0.3, P(B) = 0.6, P(A and B) = 0.3. Are A and B independent?', options: [{ id: 'a', text: 'Yes — P(A∩B) > 0 confirms independence', isCorrect: false, explanation: 'Independence requires P(A∩B) = P(A)×P(B) = 0.18. P(A∩B) = 0.3 ≠ 0.18.' }, { id: 'b', text: 'No — P(A∩B) = 0.3 ≠ P(A) × P(B) = 0.18', isCorrect: true, explanation: 'P(A)×P(B) = 0.18 but P(A∩B) = 0.3. Since 0.3 ≠ 0.18, they are dependent.' }, { id: 'c', text: 'Cannot tell from this information', isCorrect: false, explanation: 'You have everything needed: compare P(A∩B) with P(A)×P(B).' }, { id: 'd', text: 'Yes — because P(A) < P(B)', isCorrect: false, explanation: 'Relative magnitudes of individual probabilities do not determine independence.' }], explanation: 'P(A)×P(B) = 0.3×0.6 = 0.18 ≠ 0.3 = P(A∩B). The events are dependent.', hint: 'Compute P(A)×P(B) and compare it to P(A∩B).' },
    { id: 'ide-mc-12', type: 'multiple-choice', question: 'Which scenario most clearly involves dependent events?', options: [{ id: 'a', text: 'Rolling two different dice simultaneously', isCorrect: false, explanation: 'Two separate dice are independent — each outcome is unaffected by the other.' }, { id: 'b', text: 'Drawing two cards from the same deck without replacement', isCorrect: true, explanation: 'Each draw changes the remaining deck, making subsequent draws depend on earlier ones.' }, { id: 'c', text: 'Flipping two separate coins', isCorrect: false, explanation: 'Separate coins are independent physical objects.' }, { id: 'd', text: 'Choosing a random number and then a second random number', isCorrect: false, explanation: 'Independent random selections from the same range are independent.' }], explanation: 'Without replacement sampling is the classic case of dependent events in probability.', hint: 'Which scenario changes what is available for subsequent selections?' },
    { id: 'ide-mc-13', type: 'multiple-choice', question: 'A medical test is given. P(positive test | disease) = 0.95. Does this mean P(disease | positive test) = 0.95?', options: [{ id: 'a', text: 'Yes — conditional probabilities in opposite directions are always equal', isCorrect: false, explanation: 'P(B|A) and P(A|B) are generally different. They are equal only when P(A) = P(B).' }, { id: 'b', text: 'No — P(disease | positive) depends on the disease prevalence too', isCorrect: true, explanation: 'By Bayes\' theorem, P(disease | positive) involves P(positive | disease), P(disease), and P(positive) — not just one conditional.' }, { id: 'c', text: 'Yes — because the test is 95% accurate', isCorrect: false, explanation: '"Accuracy" and conditional probability in a specific direction are different concepts.' }, { id: 'd', text: 'Only if the disease is common', isCorrect: false, explanation: 'Direction matters for all prevalence levels — the answer is always no without applying Bayes\' theorem.' }], explanation: 'P(A|B) ≠ P(B|A) in general. Converting between directions requires Bayes\' theorem and knowledge of prior probabilities.', hint: 'Are P(test+|disease) and P(disease|test+) the same quantity?' },
    { id: 'ide-mc-14', type: 'multiple-choice', question: 'If events A and B are independent, which equation is TRUE?', options: [{ id: 'a', text: 'P(A and B) = P(A) + P(B)', isCorrect: false, explanation: 'Addition is for unions, not intersections.' }, { id: 'b', text: 'P(A|B) = P(A)', isCorrect: true, explanation: 'Independence literally means conditioning on B does not change P(A).' }, { id: 'c', text: 'P(A and B) = 0', isCorrect: false, explanation: 'P(A∩B) = 0 means mutually exclusive, not independent.' }, { id: 'd', text: 'P(A or B) = 1', isCorrect: false, explanation: 'P(A∪B) = 1 means exhaustive — unrelated to independence.' }], explanation: 'P(A|B) = P(A) is a direct consequence (and definition) of independence.', hint: 'Independence means one event gives no information about the other.' },
    { id: 'ide-mc-15', type: 'multiple-choice', question: 'The 10% Rule says sampling without replacement is approximately independent when:', options: [{ id: 'a', text: 'n > 30', isCorrect: false, explanation: 'n > 30 is the rule of thumb for using the normal approximation, not the 10% rule.' }, { id: 'b', text: 'The sample is less than 10% of the population', isCorrect: true, explanation: 'When n < 0.10 × N, removing sampled items barely changes the population proportions, making draws approximately independent.' }, { id: 'c', text: 'The sample has at least 10 successes', isCorrect: false, explanation: 'That is a condition for the normal approximation to the binomial, not the 10% independence rule.' }, { id: 'd', text: 'The population has at least 10 members', isCorrect: false, explanation: 'A population of 10 is tiny — the 10% rule requires the sample to be small relative to the population.' }], explanation: 'n < 10% of N keeps the sampling approximately independent because population proportions change negligibly.', hint: 'The sample size must be small relative to the population.' },
  ],
  keyTakeaway:
    'Independent events: knowing one does not change the other — P(B|A) = P(B). Dependent events: knowing one does change the other — use P(B|A) in calculations. "With replacement" → independent; "without replacement" → dependent.',
  visualization: <IndependenceViz />,
  datasetGenerator: false,
}

export default function IndependentDependentEvents({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
