import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

function AdditionRuleViz() {
  const [mode, setMode] = useState('exclusive')

  const exclusive = {
    labels: ['P(Satisfied)', 'P(Highly Satisfied)', 'P(Either)'],
    values: [0.60, 0.25, 0.85],
    title: 'Mutually Exclusive: P(A or B) = P(A) + P(B)',
  }
  const nonExclusive = {
    labels: ['P(Female)', 'P(Management)', 'P(A∩B)', 'P(Female or Mgmt)'],
    values: [0.45, 0.30, 0.15, 0.60],
    title: 'Non-Exclusive: P(A or B) = P(A) + P(B) − P(A and B)',
  }

  const active = mode === 'exclusive' ? exclusive : nonExclusive

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('exclusive')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            mode === 'exclusive'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
          }`}
        >
          Mutually Exclusive
        </button>
        <button
          onClick={() => setMode('non')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
            mode === 'non'
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
          }`}
        >
          Not Mutually Exclusive
        </button>
      </div>
      <BarChart
        labels={active.labels}
        values={active.values}
        title={active.title}
        xLabel="Event"
        yLabel="Probability"
        color="#7C3AED"
        height={240}
      />
      <p className="text-xs text-gray-500 mt-2">
        {mode === 'exclusive'
          ? 'For mutually exclusive events, simply add the probabilities.'
          : 'For non-exclusive events, subtract the overlap P(A and B) to avoid double-counting.'}
      </p>
    </div>
  )
}

const content = {
  title: 'The Addition Rule',
  topicGroup: 'Probability',
  learningObjective:
    'Apply the addition rule to find the probability that at least one of two events occurs.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The addition rule finds <strong>P(A or B)</strong> — the probability that at least one of
        two events occurs. There are two versions depending on whether the events can happen at the
        same time.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
        <p className="font-medium text-blue-900">Mutually exclusive events</p>
        <p className="text-sm text-blue-800">
          Two events are <strong>mutually exclusive</strong> (disjoint) if they cannot both happen
          at the same time. P(A and B) = 0.
        </p>
        <p className="text-sm font-mono text-blue-900">P(A or B) = P(A) + P(B)</p>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2">
        <p className="font-medium text-purple-900">Non-mutually exclusive events</p>
        <p className="text-sm text-purple-800">
          If both events can happen simultaneously, their intersection is counted in P(A) and P(B),
          so we must subtract it once to avoid double-counting.
        </p>
        <p className="text-sm font-mono text-purple-900">
          P(A or B) = P(A) + P(B) − P(A and B)
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine a room with employees. Someone asks: "What fraction are female or in management?"
      </p>
      <p className="text-sm">
        If you just add female% + management%, you will <em>double-count</em> people who are both
        female <em>and</em> in management — they appear in both groups. The fix: subtract that
        overlap once.
      </p>
      <p className="text-sm text-gray-600">
        In contrast: "satisfied" and "highly satisfied" are mutually exclusive — a person cannot be
        both at once, so there is no overlap to subtract.
      </p>
    </div>
  ),
  formula: {
    main: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
    variants: [
      {
        label: 'Mutually exclusive (disjoint)',
        expression: 'P(A ∪ B) = P(A) + P(B)   [because P(A ∩ B) = 0]',
        latex: 'P(A \\cup B) = P(A) + P(B)',
      },
      {
        label: 'General addition rule',
        expression: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)',
        latex: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
      },
    ],
    symbolGuide: [
      { symbol: 'P(A ∪ B)', meaning: 'Probability of A OR B (at least one occurs) — read "A union B"' },
      { symbol: 'P(A ∩ B)', meaning: 'Probability of A AND B (both occur simultaneously) — read "A intersect B"' },
      { symbol: '∪', meaning: 'Union — "or" (either one or both)' },
      { symbol: '∩', meaning: 'Intersection — "and" (both at the same time)' },
    ],
  },
  whenToUse: [
    'When you need the probability that at least one of two events occurs',
    'When checking whether two categories overlap in survey or clinical data',
    'When building probability tables from group proportions',
  ],
  whenNotToUse: [
    'When you need P(A and B) — that requires the multiplication rule',
    'When events are not clearly defined or the overlap is unknown',
  ],
  assumptions: [
    'All probabilities are valid (between 0 and 1)',
    'For mutually exclusive form: P(A and B) must truly be 0',
    'For general form: P(A and B) must be known or estimable',
  ],
  workedExample: {
    scenario: 'Two scenarios: (1) employee satisfaction survey, (2) workforce demographics.',
    steps: [
      {
        stepNumber: 1,
        label: 'Mutually exclusive — satisfaction survey',
        expression: 'P(satisfied) = 0.60, P(highly satisfied) = 0.25',
        result: 'P(satisfied OR highly satisfied) = 0.60 + 0.25 = 0.85',
        explanation:
          'A respondent can only choose one category — mutually exclusive. Simply add.',
      },
      {
        stepNumber: 2,
        label: 'Non-exclusive — workforce demographics',
        expression: 'P(female) = 0.45, P(management) = 0.30, P(female AND management) = 0.15',
        result: 'P(female OR management) = 0.45 + 0.30 − 0.15 = 0.60',
        explanation:
          'Female and management can overlap — the 15% who are both are counted in both P(female) and P(management), so subtract once.',
      },
      {
        stepNumber: 3,
        label: 'Verify the subtraction logic',
        expression: '0.45 + 0.30 = 0.75 (before correction); 0.75 − 0.15 = 0.60',
        result: '60% of employees are female, in management, or both',
        explanation:
          'Without the subtraction we would count the 15% overlap twice — getting 0.75 instead of the correct 0.60.',
      },
    ],
    interpretation:
      '85% of employees are either satisfied or highly satisfied. 60% are female, in management, or both — a meaningful difference from the naive sum of 75%.',
  },
  interpretation:
    'The addition rule handles "or" questions. For mutually exclusive events (cannot happen at the same time), just add. For overlapping events, add then subtract the double-counted overlap.',
  commonMistakes: [
    {
      mistake: 'Forgetting to subtract P(A and B) when events can overlap',
      explanation:
        'If two events are not mutually exclusive, you will double-count every outcome where both occur. Always ask: "Can both events happen at the same time?" If yes, subtract the overlap.',
    },
    {
      mistake: 'Assuming events are mutually exclusive when they are not',
      explanation:
        '"Female" and "has a degree" are not mutually exclusive — a person can be both. Check carefully before using the simpler P(A) + P(B) form.',
    },
    {
      mistake: 'Confusing "or" (union) with "and" (intersection)',
      explanation:
        '"A or B" means at least one of A, B occurs. "A and B" means both simultaneously. The addition rule is for "or"; the multiplication rule is for "and."',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'ar-easy-1',
        scenario: 'In a group, P(plays sport) = 0.55 and P(plays music) = 0.30. Assume these are mutually exclusive.',
        question: 'What is P(plays sport or music)?',
        hint: 'Mutually exclusive: just add the probabilities.',
        solution: 'P(sport or music) = 0.55 + 0.30 = 0.85.',
      },
      {
        id: 'ar-easy-2',
        scenario: 'A die is rolled. P(even) = 0.5 and P(odd) = 0.5.',
        question: 'What is P(even or odd)?',
        hint: 'Even and odd are mutually exclusive and exhaustive.',
        solution: 'P(even or odd) = 0.5 + 0.5 = 1.0. These events cover the entire sample space.',
      },
    ],
    moderate: [
      {
        id: 'ar-mod-1',
        scenario:
          'Hospital data: P(patient has diabetes) = 0.18, P(patient has hypertension) = 0.25, P(both) = 0.08.',
        question: 'What is P(patient has diabetes or hypertension)?',
        hint: 'Use the general addition rule — these conditions can occur together.',
        solution: 'P(diabetes or hypertension) = 0.18 + 0.25 − 0.08 = 0.35.',
      },
    ],
    challenging: [
      {
        id: 'ar-chal-1',
        scenario:
          'In a company: 40% of employees have a postgraduate degree, 35% have more than 5 years of experience, and 20% have both.',
        question:
          'What fraction of employees have a postgraduate degree or more than 5 years of experience? What fraction have neither?',
        hint:
          'Apply the general addition rule first, then use the complement for "neither."',
        solution:
          'P(degree or experience) = 0.40 + 0.35 − 0.20 = 0.55. P(neither) = 1 − 0.55 = 0.45.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'ar-kc-1',
      type: 'multiple-choice',
      question:
        'P(A) = 0.4, P(B) = 0.3, P(A and B) = 0. What is P(A or B)?',
      options: [
        { id: 'a', text: '0.1', isCorrect: false, explanation: 'That would be the difference, not the union.' },
        { id: 'b', text: '0.7', isCorrect: true, explanation: 'Correct! P(A and B) = 0 means mutually exclusive: P(A or B) = 0.4 + 0.3 = 0.7.' },
        { id: 'c', text: '0.12', isCorrect: false, explanation: 'That is P(A) × P(B) — the multiplication rule, not addition.' },
        { id: 'd', text: '1.0', isCorrect: false, explanation: 'The probabilities do not sum to 1 unless they are exhaustive.' },
      ],
      explanation: 'When P(A and B) = 0, the events are mutually exclusive. P(A or B) = P(A) + P(B) = 0.7.',
      hint: 'P(A and B) = 0 means the events cannot happen together.',
    },
    {
      id: 'ar-kc-2',
      type: 'numerical',
      question:
        'P(A) = 0.5, P(B) = 0.4, P(A and B) = 0.2. What is P(A or B)?',
      answer: 0.7,
      tolerance: 0.01,
      explanation: 'P(A or B) = P(A) + P(B) − P(A and B) = 0.5 + 0.4 − 0.2 = 0.7.',
      hint: 'Use the general addition rule and subtract the overlap.',
    },
    {
      id: 'ar-kc-3',
      type: 'multiple-choice',
      question: 'Two events are mutually exclusive. P(A) = 0.3 and P(B) = 0.5. What is P(A and B)?',
      options: [
        { id: 'a', text: '0.15', isCorrect: false, explanation: 'That assumes independence (multiplication rule). Mutually exclusive means they cannot both occur.' },
        { id: 'b', text: '0.8', isCorrect: false, explanation: 'That is P(A or B), not P(A and B).' },
        { id: 'c', text: '0', isCorrect: true, explanation: 'Correct! Mutually exclusive means the events cannot happen at the same time, so P(A and B) = 0.' },
        { id: 'd', text: '0.2', isCorrect: false, explanation: 'There is no basis for 0.2 here.' },
      ],
      explanation: 'By definition, mutually exclusive events cannot both occur, so P(A and B) = 0.',
      hint: 'Mutually exclusive = cannot happen simultaneously.',
    },
    {
      id: 'ar-kc-4',
      type: 'multiple-choice',
      question: 'Which pair of events is most likely MUTUALLY EXCLUSIVE?',
      options: [
        { id: 'a', text: 'Being over 40 years old AND having a university degree', isCorrect: false, explanation: 'A person can be both over 40 and have a degree.' },
        { id: 'b', text: 'Drawing a King AND drawing a Heart from a deck', isCorrect: false, explanation: 'The King of Hearts is both a King and a Heart — these overlap.' },
        { id: 'c', text: 'Rolling a 2 AND rolling a 5 on a single die roll', isCorrect: true, explanation: 'Correct! A single die can only land on one number at a time — these are mutually exclusive.' },
        { id: 'd', text: 'Having high blood pressure AND having diabetes', isCorrect: false, explanation: 'Both conditions can occur in the same person.' },
      ],
      explanation: 'A single die roll produces exactly one number — rolling a 2 and rolling a 5 on the same roll is impossible.',
      hint: 'Mutually exclusive means the two events cannot happen at the same time.',
    },
    {
      id: 'ar-kc-5',
      type: 'multiple-choice',
      question: 'Why do we subtract P(A and B) in the general addition rule?',
      options: [
        { id: 'a', text: 'To convert from percentage to proportion', isCorrect: false, explanation: 'Subtraction is not a unit conversion step.' },
        { id: 'b', text: 'To avoid double-counting outcomes in the overlap', isCorrect: true, explanation: 'Correct! Outcomes in A∩B are included in both P(A) and P(B). Subtracting once corrects for this double-count.' },
        { id: 'c', text: 'Because overlapping events are less likely', isCorrect: false, explanation: 'Overlap does not make individual events less likely — it means you have counted some outcomes twice.' },
        { id: 'd', text: 'To make the total sum to 1', isCorrect: false, explanation: 'P(A or B) does not need to equal 1 — the subtraction corrects for double-counting, not for summing to 1.' },
      ],
      explanation: 'Outcomes in A∩B appear in both P(A) and P(B). Adding P(A) + P(B) counts them twice, so we subtract P(A∩B) once to get the correct count.',
      hint: 'Imagine a Venn diagram — what is in the overlapping middle region?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'addr-tf-1', type: 'true-false', question: 'For mutually exclusive events, P(A or B) = P(A) + P(B).', isTrue: true, explanation: 'Mutually exclusive events cannot both occur, so P(A∩B) = 0 and the addition rule simplifies to P(A) + P(B).' },
    { id: 'addr-tf-2', type: 'true-false', question: 'P(A or B) = P(A) + P(B) is always correct regardless of overlap.', isTrue: false, explanation: 'This formula only holds for mutually exclusive events. For overlapping events, P(A∩B) must be subtracted.' },
    { id: 'addr-tf-3', type: 'true-false', question: 'If A and B are mutually exclusive, P(A and B) = 0.', isTrue: true, explanation: 'Mutually exclusive events cannot occur simultaneously — their intersection is empty, so P(A∩B) = 0.' },
    { id: 'addr-tf-4', type: 'true-false', question: 'The general addition rule is P(A or B) = P(A) + P(B) − P(A and B).', isTrue: true, explanation: 'This is the general addition rule, valid for any two events. Subtracting P(A∩B) corrects for double-counting.' },
    { id: 'addr-tf-5', type: 'true-false', question: 'P(A or B) can exceed 1 if both P(A) and P(B) are large.', isTrue: false, explanation: 'Probability is bounded by [0,1]. The subtraction of P(A∩B) in the general addition rule prevents the result from exceeding 1.' },
    { id: 'addr-tf-6', type: 'true-false', question: '"A or B" in probability means at least one of A or B occurs — including both.', isTrue: true, explanation: 'In probability, "or" is inclusive: A or B means A, B, or both.' },
    { id: 'addr-tf-7', type: 'true-false', question: 'If P(A) = 0.5 and P(B) = 0.6, then P(A or B) must be 1.1.', isTrue: false, explanation: '1.1 exceeds 1 and is impossible. P(A or B) = 1.1 − P(A∩B). The overlap reduces the result below 1.' },
    { id: 'addr-tf-8', type: 'true-false', question: 'For overlapping events, P(A or B) < P(A) + P(B).', isTrue: true, explanation: 'Subtracting P(A∩B) > 0 from P(A)+P(B) makes P(A or B) strictly less than P(A)+P(B) when there is overlap.' },
    { id: 'addr-tf-9', type: 'true-false', question: 'If P(A or B) = P(A) + P(B), the events must be independent.', isTrue: false, explanation: 'P(A or B) = P(A) + P(B) implies P(A∩B) = 0, meaning mutually exclusive — not independent. These are different concepts.' },
    { id: 'addr-tf-10', type: 'true-false', question: 'The addition rule can be extended to three events by including all pairwise and triple intersections.', isTrue: true, explanation: 'The inclusion-exclusion principle generalises: P(A∪B∪C) = P(A)+P(B)+P(C)−P(A∩B)−P(A∩C)−P(B∩C)+P(A∩B∩C).' },
    { id: 'addr-tf-11', type: 'true-false', question: 'Mutually exclusive events can also be independent.', isTrue: false, explanation: 'If P(A)>0 and P(B)>0, mutually exclusive events cannot be independent. Knowing A occurred makes B impossible — that changes P(B|A).' },
    { id: 'addr-tf-12', type: 'true-false', question: 'P(A or B) = 1 means A and B together cover all possible outcomes.', isTrue: true, explanation: 'If P(A∪B) = 1, the union of A and B accounts for the entire sample space.' },
    { id: 'addr-tf-13', type: 'true-false', question: 'For a Venn diagram, P(A or B) represents the total shaded area of both circles.', isTrue: true, explanation: 'P(A∪B) corresponds to the entire region covered by either circle, counting the overlap only once.' },
    { id: 'addr-tf-14', type: 'true-false', question: 'If P(A) = 0.4, P(B) = 0.3, and P(A and B) = 0.1, then P(A or B) = 0.6.', isTrue: true, explanation: '0.4 + 0.3 − 0.1 = 0.6. The general addition rule gives 0.6.' },
    { id: 'addr-tf-15', type: 'true-false', question: 'Rolling a 3 and rolling an even number on one die roll are mutually exclusive.', isTrue: true, explanation: '3 is odd. An even result ({2,4,6}) cannot simultaneously be a 3, so these events are mutually exclusive.' },
    { id: 'addr-tf-16', type: 'true-false', question: 'P(A or B) is always greater than or equal to both P(A) and P(B) individually.', isTrue: true, explanation: 'The union always includes at least the outcomes of each individual event, so P(A∪B) ≥ P(A) and P(A∪B) ≥ P(B).' },
    { id: 'addr-tf-17', type: 'true-false', question: 'If P(A or B) = P(A), then B is a subset of A.', isTrue: true, explanation: 'If P(A∪B) = P(A), every outcome in B is already in A — B ⊆ A.' },
    { id: 'addr-tf-18', type: 'true-false', question: 'The addition rule formula P(A)+P(B)−P(A∩B) is only valid when the events come from a discrete sample space.', isTrue: false, explanation: 'The addition rule holds for all events regardless of whether the sample space is discrete or continuous.' },
    { id: 'addr-tf-19', type: 'true-false', question: 'Drawing a heart and drawing a face card from a deck are mutually exclusive events.', isTrue: false, explanation: 'The Jack, Queen, and King of hearts are both hearts AND face cards — so these events overlap.' },
    { id: 'addr-tf-20', type: 'true-false', question: 'For three mutually exclusive events A, B, and C: P(A or B or C) = P(A) + P(B) + P(C).', isTrue: true, explanation: 'When events are mutually exclusive, no pairwise intersections exist, so all intersection terms drop to 0 and probabilities simply add.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'addr-mc-6', type: 'multiple-choice', question: 'P(A) = 0.3, P(B) = 0.5, P(A and B) = 0.2. What is P(A or B)?', options: [{ id: 'a', text: '0.8', isCorrect: false, explanation: '0.8 ignores the subtraction of overlap: 0.3+0.5=0.8, but we must subtract 0.2.' }, { id: 'b', text: '0.6', isCorrect: true, explanation: 'P(A or B) = 0.3 + 0.5 − 0.2 = 0.6.' }, { id: 'c', text: '0.15', isCorrect: false, explanation: '0.15 = P(A)×P(B) — that is joint probability for independent events, not P(A or B).' }, { id: 'd', text: '1.0', isCorrect: false, explanation: '1.0 is not supported by the numbers given.' }], explanation: 'General addition rule: 0.3 + 0.5 − 0.2 = 0.6.', hint: 'Remember to subtract the overlap once.' },
    { id: 'addr-mc-7', type: 'multiple-choice', question: 'Two events are mutually exclusive. P(A) = 0.25, P(B) = 0.40. What is P(A or B)?', options: [{ id: 'a', text: '0.10', isCorrect: false, explanation: '0.10 = P(A)×P(B) — that is for independent events, not P(A or B).' }, { id: 'b', text: '0.65', isCorrect: true, explanation: 'Mutually exclusive: P(A or B) = P(A) + P(B) = 0.25 + 0.40 = 0.65.' }, { id: 'c', text: '0.15', isCorrect: false, explanation: 'No arithmetic basis for 0.15 given these values.' }, { id: 'd', text: '1.0', isCorrect: false, explanation: 'P = 1.0 would mean certainty, which is not the case here.' }], explanation: 'For mutually exclusive events: P(A or B) = P(A) + P(B) = 0.65.', hint: 'For mutually exclusive events, no subtraction is needed.' },
    { id: 'addr-mc-8', type: 'multiple-choice', question: 'In a class of 50: 20 play football, 15 play tennis, 5 play both. How many play at least one sport?', options: [{ id: 'a', text: '35', isCorrect: false, explanation: '35 = 20+15 without subtracting the overlap. Counting both-sport players once gives 35−5=30.' }, { id: 'b', text: '30', isCorrect: true, explanation: '20 + 15 − 5 = 30. Subtracting 5 corrects for those counted in both.' }, { id: 'c', text: '40', isCorrect: false, explanation: '40 overcounts — it adds more than what is available.' }, { id: 'd', text: '25', isCorrect: false, explanation: 'No arithmetic basis for 25 given these counts.' }], explanation: 'By inclusion-exclusion: 20 + 15 − 5 = 30 students play at least one sport.', hint: 'Students playing both are in both the 20 and the 15 — subtract them once.' },
    { id: 'addr-mc-9', type: 'multiple-choice', question: 'If P(A or B) = P(A) + P(B), what can you conclude?', options: [{ id: 'a', text: 'A and B are independent', isCorrect: false, explanation: 'Independence means P(A∩B) = P(A)×P(B), not necessarily 0.' }, { id: 'b', text: 'A and B are mutually exclusive', isCorrect: true, explanation: 'P(A or B) = P(A) + P(B) implies P(A∩B) = 0 — by definition mutually exclusive.' }, { id: 'c', text: 'A and B are complementary', isCorrect: false, explanation: 'Complementary events sum to 1. This is a different relationship.' }, { id: 'd', text: 'A and B are exhaustive', isCorrect: false, explanation: 'Exhaustive means P(A or B) = 1, not that the formula simplifies by dropping the intersection.' }], explanation: 'The simplified addition rule (no subtraction) holds only when P(A∩B) = 0 — mutual exclusivity.', hint: 'What value of P(A∩B) would make the formula simplify this way?' },
    { id: 'addr-mc-10', type: 'multiple-choice', question: 'P(A) = 0.6, P(B) = 0.7. What is the MINIMUM possible value of P(A or B)?', options: [{ id: 'a', text: '0.6', isCorrect: false, explanation: 'P(A or B) ≥ max(P(A), P(B)) = 0.7, so 0.6 is too low.' }, { id: 'b', text: '0.7', isCorrect: true, explanation: 'P(A or B) ≥ max(P(A), P(B)) = 0.7. The minimum is 0.7 (when A ⊂ B).' }, { id: 'c', text: '1.3', isCorrect: false, explanation: '1.3 is the uncorrected sum — this exceeds 1 and is impossible.' }, { id: 'd', text: '0.42', isCorrect: false, explanation: '0.42 = P(A)×P(B) — that is a joint probability, not P(A or B).' }], explanation: 'P(A∪B) ≥ max(P(A),P(B)). Here max = 0.7. The minimum P(A∪B) = 0.7 when B completely contains A.', hint: 'The union must be at least as large as the larger event.' },
    { id: 'addr-mc-11', type: 'multiple-choice', question: 'A card is drawn from a standard deck. P(heart or face card) = ?', options: [{ id: 'a', text: '25/52', isCorrect: false, explanation: 'Hearts=13, face cards=12. Overlap: 3 face-card hearts. 13+12−3=22, not 25.' }, { id: 'b', text: '22/52', isCorrect: true, explanation: 'Hearts=13, face cards=12, both=3 (J♥,Q♥,K♥). 13+12−3=22.' }, { id: 'c', text: '12/52', isCorrect: false, explanation: '12/52 is just P(face card) — hearts are not included.' }, { id: 'd', text: '16/52', isCorrect: false, explanation: 'No arithmetic basis for 16 given these counts.' }], explanation: 'P(heart) + P(face) − P(heart AND face) = 13/52 + 12/52 − 3/52 = 22/52.', hint: 'Count the face cards that are also hearts (J♥, Q♥, K♥).' },
    { id: 'addr-mc-12', type: 'multiple-choice', question: 'Which correctly represents the Venn diagram area for P(A only) — not including B?', options: [{ id: 'a', text: 'P(A) − P(A and B)', isCorrect: true, explanation: 'P(A only) = P(A) − P(A∩B). Removing the overlap from A gives the region exclusive to A.' }, { id: 'b', text: 'P(A) + P(B)', isCorrect: false, explanation: 'This is the uncorrected union, not A only.' }, { id: 'c', text: 'P(A or B)', isCorrect: false, explanation: 'P(A or B) includes B outcomes too — not A only.' }, { id: 'd', text: 'P(A) × P(Bᶜ)', isCorrect: false, explanation: 'Multiplication gives the joint probability of independent events, not the exclusive region of A in a Venn diagram.' }], explanation: 'P(A only) = P(A) − P(A∩B). This is the area of circle A minus the overlapping middle region.', hint: 'Start with all of A and remove the part that overlaps with B.' },
    { id: 'addr-mc-13', type: 'multiple-choice', question: 'P(A) = 0.5, P(B) = 0.5, P(A or B) = 1. What is P(A and B)?', options: [{ id: 'a', text: '0.5', isCorrect: false, explanation: 'P(A∩B) = P(A)+P(B)−P(A∪B) = 0.5+0.5−1 = 0. Not 0.5.' }, { id: 'b', text: '0', isCorrect: true, explanation: 'P(A∩B) = 0.5+0.5−1 = 0. A and B are mutually exclusive and exhaustive (complementary).' }, { id: 'c', text: '1', isCorrect: false, explanation: 'P(A∩B) cannot equal 1 unless A and B are certain events.' }, { id: 'd', text: '0.25', isCorrect: false, explanation: 'No basis for 0.25 from these values.' }], explanation: 'Rearranging: P(A∩B) = P(A)+P(B)−P(A∪B) = 0.5+0.5−1 = 0.', hint: 'Rearrange the addition rule to solve for P(A∩B).' },
    { id: 'addr-mc-14', type: 'multiple-choice', question: 'What does "inclusive or" mean in probability?', options: [{ id: 'a', text: 'Exactly one of A or B occurs, but not both', isCorrect: false, explanation: 'That is the exclusive or (XOR). Standard probability uses inclusive or.' }, { id: 'b', text: 'At least one of A or B occurs — including the possibility that both occur', isCorrect: true, explanation: 'Inclusive or (∪) includes outcomes where both events occur. This is the standard meaning in probability.' }, { id: 'c', text: 'Neither A nor B occurs', isCorrect: false, explanation: 'Neither A nor B is the complement of A∪B.' }, { id: 'd', text: 'Both A and B must occur', isCorrect: false, explanation: 'Both occurring is A∩B — the intersection, not the union.' }], explanation: 'In probability, "or" is inclusive: A∪B = A or B or both.', hint: 'Standard probability "or" is not exclusive.' },
    { id: 'addr-mc-15', type: 'multiple-choice', question: 'Events A and B are mutually exclusive with P(A) = 0.3. If P(A or B) = 0.8, what is P(B)?', options: [{ id: 'a', text: '0.24', isCorrect: false, explanation: '0.24 = P(A)×P(B) — that is for independent events.' }, { id: 'b', text: '0.5', isCorrect: true, explanation: 'Mutually exclusive: P(A or B) = P(A)+P(B) → 0.8 = 0.3+P(B) → P(B) = 0.5.' }, { id: 'c', text: '1.1', isCorrect: false, explanation: '1.1 > 1 — impossible for a probability.' }, { id: 'd', text: '0.3', isCorrect: false, explanation: 'P(B) = P(A) = 0.3 would give P(A or B) = 0.6, not 0.8.' }], explanation: 'P(A)+P(B) = 0.8, so P(B) = 0.8 − 0.3 = 0.5.', hint: 'For mutually exclusive events rearrange: P(B) = P(A or B) − P(A).' },
  ],
  keyTakeaway:
    'P(A or B) = P(A) + P(B) − P(A and B). For mutually exclusive events (no overlap), P(A and B) = 0 and you simply add. For overlapping events, subtract the intersection to avoid double-counting.',
  visualization: <AdditionRuleViz />,
  datasetGenerator: false,
}

export default function AdditionRule({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
