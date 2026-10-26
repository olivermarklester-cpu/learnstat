import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

// Dice outcomes — all 6 faces are equally likely
const DICE_LABELS = ['1', '2', '3', '4', '5', '6']
const DICE_VALUES = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6].map((v) =>
  Math.round(v * 10000) / 10000
)

function BasicProbabilityViz() {
  const [scenario, setScenario] = useState('dice')

  const { labels, values, title, xLabel } = useMemo(() => {
    if (scenario === 'dice') {
      return {
        labels: DICE_LABELS,
        values: DICE_VALUES,
        title: 'Fair Die — Probability of Each Outcome',
        xLabel: 'Outcome',
      }
    }
    if (scenario === 'coin') {
      return {
        labels: ['Heads', 'Tails'],
        values: [0.5, 0.5],
        title: 'Fair Coin — Probability of Each Outcome',
        xLabel: 'Outcome',
      }
    }
    // Marbles
    return {
      labels: ['Red', 'Blue'],
      values: [0.3, 0.7],
      title: 'Marble Bag (3 Red, 7 Blue) — Probability',
      xLabel: 'Marble Colour',
    }
  }, [scenario])

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'dice', label: '🎲 Dice' },
          { key: 'coin', label: '🪙 Coin' },
          { key: 'marbles', label: '🔴 Marbles' },
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
        labels={labels}
        values={values}
        title={title}
        xLabel={xLabel}
        yLabel="Probability"
        color="#2563EB"
        height={260}
      />
      <p className="text-xs text-gray-500 mt-2">
        Each bar shows P(outcome). Notice all bars are equal for dice and coin — every outcome is
        equally likely. Probabilities always sum to 1.
      </p>
    </div>
  )
}

const content = {
  title: 'Basic Probability',
  topicGroup: 'Probability',
  learningObjective:
    'Calculate basic probabilities using the classical definition, and interpret probability values as proportions between 0 and 1.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        Probability measures how likely an event is to happen. It is always a number between 0 and
        1 (or 0% to 100%):
      </p>
      <ul className="space-y-2 ml-4">
        <li>
          <strong>0</strong> means the event is impossible (probability of rolling a 7 on a
          standard die)
        </li>
        <li>
          <strong>1</strong> means the event is certain (probability of rolling a number 1–6 on a
          standard die)
        </li>
        <li>
          <strong>0.5</strong> means the event has an equal chance of happening or not (probability
          of heads on a fair coin)
        </li>
      </ul>
      <p>
        The <strong>classical definition</strong> of probability:{' '}
        <em>P(Event) = Number of favorable outcomes ÷ Total number of possible outcomes</em>
      </p>
      <p className="text-sm text-gray-600">
        This definition works when all outcomes are equally likely.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine a bag containing <strong>3 red marbles</strong> and <strong>7 blue marbles</strong>{' '}
        (10 total). If you reach in without looking:
      </p>
      <ul className="space-y-1 ml-4 text-sm">
        <li>
          <strong>P(red)</strong> = 3/10 = 0.3 (30%) — 3 of the 10 equally likely outcomes are red
        </li>
        <li>
          <strong>P(blue)</strong> = 7/10 = 0.7 (70%)
        </li>
        <li>
          <strong>P(red) + P(blue)</strong> = 1.0 — all probabilities must add up to 1 (something
          must happen)
        </li>
      </ul>
    </div>
  ),
  formula: {
    main: 'P(A) = n(A) / n(S)',
    variants: [
      { label: 'Classical probability', expression: 'P(A) = n(A) / n(S)', latex: 'P(A) = \\frac{n(A)}{n(S)}' },
      {
        label: 'Empirical (relative frequency)',
        expression: 'P(A) ≈ (number of times A occurred) / (total observations)',
        latex: 'P(A) \\approx \\frac{\\text{times A occurred}}{\\text{total observations}}',
      },
    ],
    symbolGuide: [
      { symbol: 'P(A)', meaning: 'Probability of event A (read "P of A")' },
      { symbol: 'n(A)', meaning: 'Number of favorable outcomes (outcomes where A occurs)' },
      {
        symbol: 'n(S)',
        meaning: 'Total number of equally likely outcomes in the sample space S',
      },
      { symbol: 'S', meaning: 'The sample space — the complete list of all possible outcomes' },
      { symbol: 'Aᶜ', meaning: "Complement of A — all outcomes where A does NOT occur" },
    ],
  },
  whenToUse: [
    'When all outcomes are equally likely (fair dice, coins, well-shuffled cards)',
    'For simple coin tosses, dice rolls, or random draws from a well-mixed group',
    'When estimating probability from observed data (relative frequency / empirical approach)',
  ],
  whenNotToUse: [
    'When outcomes are NOT equally likely (e.g., a loaded die, biased survey sample)',
    'When the sample space is unclear or outcomes are not well-defined',
    'When events are complex — count outcomes carefully before applying the formula',
  ],
  assumptions: [
    'All outcomes in the sample space are equally likely',
    'The sample space is complete — all possible outcomes are listed',
    'Events are well-defined and mutually exclusive within the sample space',
  ],
  workedExample: {
    scenario:
      'A standard deck has 52 cards. Calculate P(Ace), P(Heart), and an empirical probability from hospital data.',
    steps: [
      {
        stepNumber: 1,
        label: 'Dice — P(rolling a 3)',
        expression: 'n(A) = 1, n(S) = 6',
        result: 'P(rolling a 3) = 1/6 ≈ 0.167 = 16.7%',
        explanation:
          'Sample space = {1, 2, 3, 4, 5, 6}. Only one outcome (rolling a 3) is favorable.',
      },
      {
        stepNumber: 2,
        label: 'Dice — P(even number)',
        expression: 'n(B) = 3 {2,4,6}, n(S) = 6',
        result: 'P(even) = 3/6 = 0.5 = 50%',
        explanation: 'Three faces (2, 4, 6) are even — three favorable outcomes out of six total.',
      },
      {
        stepNumber: 3,
        label: 'Cards — P(Ace)',
        expression: 'n(A) = 4 aces, n(S) = 52',
        result: 'P(Ace) = 4/52 = 1/13 ≈ 0.077 = 7.7%',
        explanation: 'There are 4 aces in a 52-card deck — one per suit.',
      },
      {
        stepNumber: 4,
        label: 'Cards — P(Heart)',
        expression: 'n(A) = 13 hearts, n(S) = 52',
        result: 'P(Heart) = 13/52 = 0.25 = 25%',
        explanation: 'There are 13 hearts in a deck of 52 — one quarter of all cards.',
      },
      {
        stepNumber: 5,
        label: 'Hospital — empirical probability',
        expression: '40 waited > 30 min out of 200 patients',
        result: 'P(wait > 30 min) = 40/200 = 0.2 = 20%',
        explanation:
          'This is an empirical estimate based on observed data, not equally likely outcomes.',
      },
    ],
    interpretation:
      'A probability of 0.2 means that if this pattern continues, about 1 in every 5 patients can be expected to wait more than 30 minutes. The closer to 1, the more likely the event.',
  },
  interpretation:
    'A probability of 0.2 means about 1 in 5 times, on average. P = 0 is impossible; P = 1 is certain; P = 0.5 is a coin flip. When outcomes are equally likely, count favorable outcomes and divide by the total.',
  commonMistakes: [
    {
      mistake: 'Expressing probability as a number greater than 1',
      explanation:
        'Probabilities are always between 0 and 1 — never write "the probability is 3." If you get a number above 1, check your count of outcomes.',
    },
    {
      mistake: 'Forgetting that all probabilities in a complete sample space must sum to exactly 1',
      explanation:
        'If you list every possible outcome and add their probabilities, the total must be 1.0. This is a useful check — if your total is not 1, you have missed an outcome or made an arithmetic error.',
    },
    {
      mistake: 'Confusing probability with frequency',
      explanation:
        '"It happened 4 times" is a frequency, not a probability. The probability is 4 ÷ (total trials). Always divide by the total to convert.',
    },
    {
      mistake: 'Assuming equally likely outcomes when they are not',
      explanation:
        'The classical formula only works when all outcomes are equally likely. A loaded die, a biased coin, or a non-random sample — do not apply P = n(A)/n(S) here.',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'bp-easy-1',
        scenario: 'A bag contains 5 green balls and 3 yellow balls.',
        question: 'What is the probability of picking a yellow ball?',
        hint: 'Count the yellow balls (favorable outcomes) and divide by the total number of balls.',
        solution:
          'n(yellow) = 3, n(S) = 3 + 5 = 8. P(yellow) = 3/8 = 0.375 = 37.5%.',
      },
      {
        id: 'bp-easy-2',
        scenario: 'A standard die is rolled once.',
        question: 'What is P(rolling a number less than 3)?',
        hint: 'List the outcomes less than 3: they are 1 and 2.',
        solution:
          'Favorable outcomes = {1, 2}, so n(A) = 2. n(S) = 6. P(< 3) = 2/6 = 1/3 ≈ 0.333.',
      },
    ],
    moderate: [
      {
        id: 'bp-mod-1',
        scenario:
          'A hospital has 150 patients: 30 in emergency, 60 in general wards, 40 in surgical, and 20 in ICU.',
        question:
          'If one patient is chosen at random, what is the probability of choosing someone NOT in the emergency ward?',
        hint: 'Subtract emergency patients from the total, then divide.',
        solution:
          'P(not emergency) = (150 − 30) / 150 = 120/150 = 0.8 = 80%.',
      },
      {
        id: 'bp-mod-2',
        scenario: 'A standard 52-card deck is shuffled.',
        question: 'What is the probability of drawing a face card (Jack, Queen, or King)?',
        hint: 'There are 3 face card ranks × 4 suits = 12 face cards total.',
        solution:
          'P(face card) = 12/52 = 3/13 ≈ 0.231 = 23.1%.',
      },
    ],
    challenging: [
      {
        id: 'bp-chal-1',
        scenario:
          'A quality control inspector checks 500 processed claims. 15 have errors. Three claims are checked randomly with replacement.',
        question: 'What is the probability that all 3 have errors?',
        hint:
          'Find P(error) first, then use the multiplication rule for independent events (with replacement).',
        solution:
          'P(error) = 15/500 = 0.03. With replacement, each draw is independent. P(all 3 errors) = 0.03³ = 0.000027 (about 0.003%).',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'bp-kc-1',
      type: 'multiple-choice',
      question: 'What is the probability of rolling a number greater than 4 on a standard die?',
      options: [
        { id: 'a', text: '1/6', isCorrect: false, explanation: 'Only 1 out of 6 — but there are two values greater than 4.' },
        { id: 'b', text: '2/6', isCorrect: true, explanation: 'Correct! Outcomes {5, 6} are greater than 4. P = 2/6.' },
        { id: 'c', text: '3/6', isCorrect: false, explanation: 'That would be P(> 3), not P(> 4).' },
        { id: 'd', text: '4/6', isCorrect: false, explanation: 'That would include outcomes ≤ 4.' },
      ],
      explanation: 'Outcomes greater than 4 on a standard die: {5, 6} — two outcomes. P = 2/6 = 1/3.',
      hint: 'List all outcomes greater than 4, then count them.',
    },
    {
      id: 'bp-kc-2',
      type: 'multiple-choice',
      question: 'Which of these is NOT a valid probability?',
      options: [
        { id: 'a', text: '0', isCorrect: false, explanation: '0 is valid — it means the event is impossible.' },
        { id: 'b', text: '0.5', isCorrect: false, explanation: '0.5 is valid — it means a 50/50 chance.' },
        { id: 'c', text: '1', isCorrect: false, explanation: '1 is valid — it means the event is certain.' },
        { id: 'd', text: '1.2', isCorrect: true, explanation: 'Correct! Probabilities cannot exceed 1. A value above 1 is impossible.' },
      ],
      explanation: 'Probabilities must be between 0 and 1 (inclusive). Any value outside this range is invalid.',
      hint: 'Remember: 0 ≤ P(A) ≤ 1 always.',
    },
    {
      id: 'bp-kc-3',
      type: 'numerical',
      question: 'A card is drawn from a standard 52-card deck. What is P(King)? Round to 4 decimal places.',
      answer: 0.0769,
      tolerance: 0.001,
      explanation: 'There are 4 kings in a 52-card deck. P(King) = 4/52 = 0.0769.',
      hint: 'How many kings are in a standard deck? Divide by 52.',
    },
    {
      id: 'bp-kc-4',
      type: 'multiple-choice',
      question: 'The probability that it rains today is 0.35. What is the probability it does NOT rain?',
      options: [
        { id: 'a', text: '0.35', isCorrect: false, explanation: 'That is the probability of rain, not no rain.' },
        { id: 'b', text: '0.65', isCorrect: true, explanation: 'Correct! P(no rain) = 1 − 0.35 = 0.65.' },
        { id: 'c', text: '1.35', isCorrect: false, explanation: 'Probabilities cannot exceed 1.' },
        { id: 'd', text: 'Cannot determine', isCorrect: false, explanation: 'We can determine it using the complement rule: 1 − P(rain).' },
      ],
      explanation: 'The complement rule: P(not A) = 1 − P(A). So P(no rain) = 1 − 0.35 = 0.65.',
      hint: 'All probabilities for a complete set of outcomes sum to 1.',
    },
    {
      id: 'bp-kc-5',
      type: 'multiple-choice',
      question:
        'A researcher estimates probability from past data (e.g., "3 out of 10 patients had a complication"). This approach is called:',
      options: [
        { id: 'a', text: 'Classical probability', isCorrect: false, explanation: 'Classical probability assumes equally likely outcomes in a theoretical setting.' },
        { id: 'b', text: 'Subjective probability', isCorrect: false, explanation: 'Subjective probability is based on personal judgment or belief, not data.' },
        { id: 'c', text: 'Empirical probability', isCorrect: true, explanation: 'Correct! Empirical probability is estimated from observed data: P ≈ occurrences / total.' },
        { id: 'd', text: 'Theoretical probability', isCorrect: false, explanation: 'Theoretical probability is derived from theory (like the classical definition), not observation.' },
      ],
      explanation:
        'Empirical (or relative frequency) probability estimates P(A) by observing how often A occurs in real data. It converges on the true probability as sample size grows.',
      hint: 'The word "empirical" means based on observation or experiment.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'bprob-tf-1', type: 'true-false', question: 'A probability of 0 means an event is impossible.', isTrue: true, explanation: 'P(A) = 0 means the event A cannot occur. P(A) = 1 means the event is certain to occur. Valid probabilities range from 0 to 1 inclusive.' },
    { id: 'bprob-tf-2', type: 'true-false', question: 'A probability can be greater than 1.', isTrue: false, explanation: 'Probabilities are always between 0 and 1 (inclusive). A probability greater than 1 is mathematically impossible. If you compute one, check your calculation.' },
    { id: 'bprob-tf-3', type: 'true-false', question: 'The sum of probabilities of all possible outcomes in a sample space must equal 1.', isTrue: true, explanation: 'One of the axioms of probability: the probability of the entire sample space equals 1. This means that some outcome must always occur.' },
    { id: 'bprob-tf-4', type: 'true-false', question: 'P(A) = n(A) / n(S) applies only when all outcomes are equally likely.', isTrue: true, explanation: 'The classical formula P(A) = favourable outcomes / total outcomes assumes equally likely outcomes. If outcomes have different probabilities, you must use their individual probabilities.' },
    { id: 'bprob-tf-5', type: 'true-false', question: 'Rolling a fair six-sided die and getting a 3 has probability 1/3.', isTrue: false, explanation: 'A fair die has 6 equally likely outcomes. P(3) = 1/6, not 1/3. 1/3 would be correct for rolling a 1, 2, or 3 (three outcomes out of six).' },
    { id: 'bprob-tf-6', type: 'true-false', question: 'Theoretical probability is calculated based on logical reasoning without conducting experiments.', isTrue: true, explanation: 'Theoretical probability derives from the logical structure of the problem (e.g., fair coins, fair dice). You reason about what should happen, not what did happen.' },
    { id: 'bprob-tf-7', type: 'true-false', question: 'If you flip a fair coin 10 times and get heads all 10 times, the probability of heads on the 11th flip is still 0.5.', isTrue: true, explanation: 'This tests understanding of the "gambler\'s fallacy." A fair coin has no memory — each flip is independent. P(heads) = 0.5 on every single flip, regardless of previous results.' },
    { id: 'bprob-tf-8', type: 'true-false', question: 'Empirical probability is based on observed frequencies from experiments or data.', isTrue: true, explanation: 'Empirical (relative frequency) probability = number of times event occurred / total trials. As the number of trials increases, empirical probability converges to the true probability (Law of Large Numbers).' },
    { id: 'bprob-tf-9', type: 'true-false', question: 'P(not A) = 1 − P(A) always holds.', isTrue: true, explanation: 'An event either happens or it doesn\'t. P(A) + P(not A) = 1 for any event A. Therefore P(not A) = 1 − P(A). This is the complement rule.' },
    { id: 'bprob-tf-10', type: 'true-false', question: 'If P(A) = 0.6, then A is more likely than not to occur.', isTrue: true, explanation: 'P(A) > 0.5 means the event is more likely to happen than not. P(A) = 0.6 → 60% chance of occurring, 40% chance of not occurring.' },
    { id: 'bprob-tf-11', type: 'true-false', question: 'The sample space includes all impossible outcomes.', isTrue: false, explanation: 'The sample space S is the set of ALL POSSIBLE outcomes of an experiment — not impossible ones. For example, when rolling a die, S = {1, 2, 3, 4, 5, 6}.' },
    { id: 'bprob-tf-12', type: 'true-false', question: 'If P(A) = 0.3, A is an unlikely event.', isTrue: true, explanation: 'P(A) = 0.3 means A occurs 30% of the time — less likely than not (less than 50%). It is relatively unlikely, though not impossible.' },
    { id: 'bprob-tf-13', type: 'true-false', question: 'Long-run relative frequency probability assumes that as the number of trials approaches infinity, observed frequency approaches true probability.', isTrue: true, explanation: 'This is the Law of Large Numbers: as n → ∞, observed frequency → true probability P(A). This justifies using empirical probability from large samples.' },
    { id: 'bprob-tf-14', type: 'true-false', question: 'A probability of 0.5 means the event will happen exactly half the time in any given experiment.', isTrue: false, explanation: 'P(A) = 0.5 means the event is expected to happen 50% of the time in the LONG RUN (many trials). In any short sequence, the actual frequency can differ substantially from 50%.' },
    { id: 'bprob-tf-15', type: 'true-false', question: 'An event with P(A) = 1 is called a certain event.', isTrue: true, explanation: 'If P(A) = 1, the event is guaranteed to happen — it is certain. Every possible outcome is a favorable outcome.' },
    { id: 'bprob-tf-16', type: 'true-false', question: 'The event A = "rolling a 7 on a standard six-sided die" has probability 1/7.', isTrue: false, explanation: 'A standard die only has faces 1–6. Rolling a 7 is impossible: P = 0. There is no 7-face to appear.' },
    { id: 'bprob-tf-17', type: 'true-false', question: 'Subjective probability reflects an individual\'s personal belief or judgment about how likely an event is.', isTrue: true, explanation: 'Subjective probability is used when classical or empirical methods are not applicable (e.g., "I think there is a 70% chance it will rain tomorrow"). It is based on judgment, not formula.' },
    { id: 'bprob-tf-18', type: 'true-false', question: 'If event A and event B together account for all possible outcomes, then P(A) + P(B) = 1.', isTrue: true, explanation: 'If A and B are exhaustive (cover all outcomes) and mutually exclusive (no overlap), then P(A) + P(B) = 1. This is a special case of the axiom that all probabilities sum to 1.' },
    { id: 'bprob-tf-19', type: 'true-false', question: 'Increasing the number of trials in an experiment always makes empirical probability equal to theoretical probability.', isTrue: false, explanation: 'Increasing n makes empirical probability APPROACH theoretical probability (Law of Large Numbers), but they are only exactly equal when n = ∞. For any finite n, there is still variability.' },
    { id: 'bprob-tf-20', type: 'true-false', question: 'P(A) = 0.25 means an event is likely to occur.', isTrue: false, explanation: 'P(A) = 0.25 means the event occurs 25% of the time — 3 out of 4 times it does NOT occur. This is an unlikely event (P < 0.5).' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'bprob-mc-6', type: 'multiple-choice', question: 'A bag contains 3 red, 5 blue, and 2 green marbles. What is P(blue)?', options: [{ id: 'a', text: '5', isCorrect: false, explanation: 'P is a proportion, not a count. P(blue) = 5/10 = 0.5.' }, { id: 'b', text: '0.5', isCorrect: true, explanation: 'P(blue) = 5 / (3+5+2) = 5/10 = 0.5.' }, { id: 'c', text: '0.3', isCorrect: false, explanation: '0.3 = 3/10 = P(red).' }, { id: 'd', text: '0.2', isCorrect: false, explanation: '0.2 = 2/10 = P(green).' }], explanation: 'Total outcomes = 3+5+2 = 10. Favorable for blue = 5. P(blue) = 5/10 = 0.5.', hint: 'P(A) = favorable / total.' },
    { id: 'bprob-mc-7', type: 'multiple-choice', question: 'A fair die is rolled. What is P(rolling an even number)?', options: [{ id: 'a', text: '1/6', isCorrect: false, explanation: '1/6 is the probability of rolling any single face.' }, { id: 'b', text: '1/3', isCorrect: false, explanation: 'Even numbers: 2, 4, 6 — that is 3 out of 6.' }, { id: 'c', text: '1/2', isCorrect: true, explanation: 'Even outcomes: {2, 4, 6} = 3 out of 6. P = 3/6 = 1/2.' }, { id: 'd', text: '2/3', isCorrect: false, explanation: '2/3 would be 4 outcomes out of 6.' }], explanation: 'Even numbers on a die: {2, 4, 6} = 3 outcomes. Total outcomes = 6. P(even) = 3/6 = 1/2.', hint: 'Count even numbers on a die: 2, 4, 6.' },
    { id: 'bprob-mc-8', type: 'multiple-choice', question: 'You flip a coin 100 times and get 53 heads. What is the empirical probability of heads?', options: [{ id: 'a', text: '0.50', isCorrect: false, explanation: '0.50 is the theoretical probability. The empirical probability from this experiment is 53/100.' }, { id: 'b', text: '0.53', isCorrect: true, explanation: 'Empirical P(heads) = observed frequency / total trials = 53/100 = 0.53.' }, { id: 'c', text: '53', isCorrect: false, explanation: 'Probability is a proportion, not a count.' }, { id: 'd', text: '0.47', isCorrect: false, explanation: '0.47 = 47/100 = empirical P(tails), not P(heads).' }], explanation: 'Empirical probability = observed occurrences / total trials = 53/100 = 0.53.', hint: 'Empirical probability = observed count / n.' },
    { id: 'bprob-mc-9', type: 'multiple-choice', question: 'A deck has 52 cards. What is P(drawing an ace)?', options: [{ id: 'a', text: '1/13', isCorrect: true, explanation: '4 aces in 52 cards. P(ace) = 4/52 = 1/13.' }, { id: 'b', text: '1/52', isCorrect: false, explanation: '1/52 is the probability of a specific single card, not any ace.' }, { id: 'c', text: '4/13', isCorrect: false, explanation: '4/13 would mean 16 aces in a 52-card deck — there are only 4.' }, { id: 'd', text: '1/4', isCorrect: false, explanation: '1/4 would mean 13 aces in 52 cards — there are only 4.' }], explanation: 'There are 4 aces (one per suit) in a 52-card deck. P(ace) = 4/52 = 1/13 ≈ 7.7%.', hint: 'How many aces in a deck? How many cards total?' },
    { id: 'bprob-mc-10', type: 'multiple-choice', question: 'P(A) = 0.65. What is P(not A)?', options: [{ id: 'a', text: '0.65', isCorrect: false, explanation: 'P(not A) ≠ P(A). Use complement rule.' }, { id: 'b', text: '0.35', isCorrect: true, explanation: 'P(not A) = 1 − P(A) = 1 − 0.65 = 0.35.' }, { id: 'c', text: '1.65', isCorrect: false, explanation: 'Cannot exceed 1.' }, { id: 'd', text: '0.135', isCorrect: false, explanation: '0.135 is not the complement.' }], explanation: 'Complement rule: P(not A) = 1 − P(A) = 1 − 0.65 = 0.35.', hint: 'P(not A) = 1 − P(A).' },
    { id: 'bprob-mc-11', type: 'multiple-choice', question: 'A weather forecaster says "30% chance of rain." This is an example of:', options: [{ id: 'a', text: 'Theoretical probability', isCorrect: false, explanation: 'Theoretical probability comes from logical analysis of equally likely outcomes.' }, { id: 'b', text: 'Subjective probability', isCorrect: false, explanation: 'Subjective is personal judgment without data models.' }, { id: 'c', text: 'Empirical probability based on historical weather patterns', isCorrect: true, explanation: 'Weather forecasts combine historical data and models to estimate probability from observed frequencies.' }, { id: 'd', text: 'Impossible to classify', isCorrect: false, explanation: 'Weather probability is data-driven empirical probability.' }], explanation: 'Weather probability forecasts are based on observed frequencies of similar weather patterns — empirical probability from historical data and models.', hint: 'Is weather probability based on logic, personal belief, or observed data?' },
    { id: 'bprob-mc-12', type: 'multiple-choice', question: 'If all outcomes in a sample space are equally likely and n(S) = 20, n(A) = 8, what is P(A)?', options: [{ id: 'a', text: '8', isCorrect: false, explanation: 'P is a proportion. P(A) = 8/20.' }, { id: 'b', text: '0.4', isCorrect: true, explanation: 'P(A) = n(A)/n(S) = 8/20 = 0.4.' }, { id: 'c', text: '0.6', isCorrect: false, explanation: '0.6 = 12/20 = P(not A).' }, { id: 'd', text: '20', isCorrect: false, explanation: '20 is the size of the sample space, not P(A).' }], explanation: 'P(A) = n(A) / n(S) = 8/20 = 0.4.', hint: 'P(A) = n(A) / n(S).' },
    { id: 'bprob-mc-13', type: 'multiple-choice', question: 'Which of the following is NOT a valid probability?', options: [{ id: 'a', text: '0', isCorrect: false, explanation: '0 is valid — impossible event.' }, { id: 'b', text: '0.001', isCorrect: false, explanation: 'Very small but valid.' }, { id: 'c', text: '1.1', isCorrect: true, explanation: 'Probabilities cannot exceed 1. 1.1 is invalid.' }, { id: 'd', text: '1', isCorrect: false, explanation: '1 is valid — certain event.' }], explanation: 'Probabilities must be between 0 and 1 inclusive: 0 ≤ P(A) ≤ 1. The value 1.1 exceeds 1, making it an invalid probability.', hint: 'Which value falls outside [0, 1]?' },
    { id: 'bprob-mc-14', type: 'multiple-choice', question: 'A spinner has 4 equal sections: red, blue, green, yellow. What is P(not green)?', options: [{ id: 'a', text: '1/4', isCorrect: false, explanation: '1/4 = P(green). P(not green) = 1 − 1/4.' }, { id: 'b', text: '3/4', isCorrect: true, explanation: 'P(not green) = 1 − P(green) = 1 − 1/4 = 3/4.' }, { id: 'c', text: '2/4', isCorrect: false, explanation: '2/4 = 0.5. Not correct.' }, { id: 'd', text: '0', isCorrect: false, explanation: '0 would mean "not green" is impossible, but 3 other colors exist.' }], explanation: 'P(green) = 1/4 (one of four equal sections). P(not green) = 1 − 1/4 = 3/4.', hint: 'Use the complement rule: P(not green) = 1 − P(green).' },
    { id: 'bprob-mc-15', type: 'multiple-choice', question: 'You roll a die 600 times. About how many times would you expect to roll a 4?', options: [{ id: 'a', text: '4', isCorrect: false, explanation: '4 would be expected if n = 24. For n=600: 600 × 1/6 = 100.' }, { id: 'b', text: '60', isCorrect: false, explanation: '60 would mean P = 60/600 = 0.1, but P(4) = 1/6 ≈ 0.167.' }, { id: 'c', text: '100', isCorrect: true, explanation: 'Expected count = n × P(4) = 600 × 1/6 = 100.' }, { id: 'd', text: '150', isCorrect: false, explanation: '150 = 600/4. But P(4) = 1/6, not 1/4.' }], explanation: 'Expected count = total trials × P(event) = 600 × (1/6) = 100.', hint: 'Expected count = n × P(event).' },
  ],
  keyTakeaway:
    'Probability is a number between 0 and 1 that measures how likely an event is — the closer to 1, the more likely. Use P(A) = n(A) / n(S) when all outcomes are equally likely.',
  visualization: <BasicProbabilityViz />,
  datasetGenerator: false,
}

export default function BasicProbability({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
