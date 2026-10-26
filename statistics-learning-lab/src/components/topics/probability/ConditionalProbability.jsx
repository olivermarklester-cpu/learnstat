import { useState } from 'react'
import TopicPage from '../../layout/TopicPage'
import BarChart from '../../charts/BarChart'

// Contingency table for the hospital worked example
// 500 patients: 200 surgery, 300 no surgery
// Surgery + complications: 50, Surgery + no complications: 150
// No surgery + complications: 20, No surgery + no complications: 280

function ContingencyTable() {
  return (
    <div className="overflow-x-auto">
      <table className="text-sm border-collapse w-full max-w-lg">
        <thead>
          <tr>
            <th className="border border-border p-2 text-left bg-surface text-textMuted" />
            <th className="border border-border p-2 text-center bg-surface font-semibold text-textDark">
              Complications
            </th>
            <th className="border border-border p-2 text-center bg-surface font-semibold text-textDark">
              No Complications
            </th>
            <th className="border border-border p-2 text-center bg-primary/10 font-semibold text-primary">
              Row Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-border p-2 font-semibold text-textDark bg-surface">Surgery</td>
            <td className="border border-border p-2 text-center text-textDark">50</td>
            <td className="border border-border p-2 text-center text-textDark">150</td>
            <td className="border border-border p-2 text-center font-semibold text-primary bg-primary/5">200</td>
          </tr>
          <tr>
            <td className="border border-border p-2 font-semibold text-textDark bg-surface">No Surgery</td>
            <td className="border border-border p-2 text-center text-textDark">20</td>
            <td className="border border-border p-2 text-center text-textDark">280</td>
            <td className="border border-border p-2 text-center font-semibold text-primary bg-primary/5">300</td>
          </tr>
          <tr>
            <td className="border border-border p-2 font-semibold text-textDark bg-primary/10 text-primary">
              Column Total
            </td>
            <td className="border border-border p-2 text-center font-semibold text-primary bg-primary/5">70</td>
            <td className="border border-border p-2 text-center font-semibold text-primary bg-primary/5">430</td>
            <td className="border border-border p-2 text-center font-bold text-primary bg-primary/10">500</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ConditionalViz() {
  const [given, setGiven] = useState('surgery')

  const surgeryData = {
    labels: ['P(complications | surgery)', 'P(no complications | surgery)'],
    values: [50 / 200, 150 / 200],
    title: 'Conditional on Surgery (n=200)',
  }
  const noSurgeryData = {
    labels: ['P(complications | no surgery)', 'P(no complications | no surgery)'],
    values: [20 / 300, 280 / 300].map((v) => Math.round(v * 10000) / 10000),
    title: 'Conditional on No Surgery (n=300)',
  }
  const active = given === 'surgery' ? surgeryData : noSurgeryData

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm font-medium text-textDark mb-2">Contingency table (500 patients):</p>
        <ContingencyTable />
      </div>
      <div className="flex gap-2 mb-4 mt-4 flex-wrap">
        {[
          { key: 'surgery', label: 'Given: Surgery' },
          { key: 'noSurgery', label: 'Given: No Surgery' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setGiven(key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
              given === key
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
        xLabel="Outcome"
        yLabel="Probability"
        color="#7C3AED"
        height={220}
      />
      <p className="text-xs text-gray-500 mt-2">
        {given === 'surgery'
          ? 'P(complications | surgery) = 50/200 = 0.25. The sample space is restricted to surgery patients only.'
          : 'P(complications | no surgery) = 20/300 ≈ 0.067. Much lower than in the surgery group.'}
      </p>
    </div>
  )
}

const content = {
  title: 'Conditional Probability',
  topicGroup: 'Probability',
  learningObjective:
    'Calculate conditional probability and explain what P(A|B) means in context.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Conditional probability</strong> — written P(A|B) and read{' '}
        <em>"the probability of A given B"</em> — is the probability of event A{' '}
        <em>given that event B has already occurred</em>. We restrict attention to only those
        outcomes where B happened, then ask how many of those also include A.
      </p>
      <p>The formula:</p>
      <p className="ml-4 font-mono font-medium">P(A|B) = P(A and B) / P(B)</p>
      <p>
        In words: take all the probability mass in B, and find what fraction of it is also in A.
      </p>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-sm font-medium text-purple-900 mb-1">Key insight</p>
        <p className="text-sm text-purple-800">
          Conditioning on B <em>reduces the sample space</em> — you are no longer looking at all
          possible outcomes, just those where B occurred. Within that smaller world, what fraction
          includes A?
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        In a room of 100 people, 40 are doctors. Of those 40 doctors, 10 are female. You randomly
        pick one of the doctors.
      </p>
      <p className="ml-4 text-sm">
        P(female | doctor) = 10/40 = 0.25
      </p>
      <p className="text-sm">
        You are not looking at all 100 people anymore — only the 40 doctors. Among those 40, 10 are
        female. The condition "given doctor" <em>restricts your sample space</em> to 40 people.
      </p>
      <p className="text-sm text-gray-600">
        Notice: P(female) from all 100 people might be different from P(female | doctor). The
        condition changes everything.
      </p>
    </div>
  ),
  formula: {
    main: 'P(A|B) = P(A ∩ B) / P(B)',
    variants: [
      { label: 'Conditional probability', expression: 'P(A|B) = P(A ∩ B) / P(B)', latex: 'P(A|B) = \\frac{P(A \\cap B)}{P(B)}' },
      { label: 'Rearranged (multiplication rule)', expression: 'P(A ∩ B) = P(B) × P(A|B)', latex: 'P(A \\cap B) = P(B) \\times P(A|B)' },
      {
        label: 'From a contingency table',
        expression: 'P(A|B) = (count in A and B) / (count in B)',
        latex: 'P(A|B) = \\frac{\\text{count in A and B}}{\\text{count in B}}',
      },
    ],
    symbolGuide: [
      { symbol: 'P(A|B)', meaning: 'Probability of A given that B has occurred (read "P of A given B")' },
      { symbol: 'P(A ∩ B)', meaning: 'Probability that both A and B occur' },
      { symbol: 'P(B)', meaning: 'Probability of B (the conditioning event) — must be > 0' },
      { symbol: '|', meaning: 'The vertical bar means "given" or "conditional on"' },
    ],
  },
  whenToUse: [
    'When probability depends on a known condition or prior information',
    'When reading from contingency (cross-tabulation) tables',
    'In medical testing: P(disease | positive test) and P(disease | negative test)',
    'In decision trees where each branch represents a condition',
  ],
  whenNotToUse: [
    'When B is impossible — P(A|B) is undefined if P(B) = 0',
    'When the events are independent — in that case P(A|B) = P(A), so the condition adds no information',
  ],
  assumptions: [
    'P(B) > 0 — you cannot condition on an impossible event',
    'The condition B must be a well-defined event in the sample space',
  ],
  workedExample: {
    scenario:
      'Hospital data: 500 patients, 200 had surgery, 300 did not. 50 surgery patients had complications; 20 non-surgery patients had complications.',
    steps: [
      {
        stepNumber: 1,
        label: 'Build the contingency table',
        expression: 'Surgery: 50 complications / 150 none; No surgery: 20 complications / 280 none',
        result: 'Total complications: 70; Total no complications: 430',
        explanation:
          'A 2×2 table organises the joint frequencies. Each cell counts patients in both conditions simultaneously.',
      },
      {
        stepNumber: 2,
        label: 'P(complications | surgery)',
        expression: 'P(C|S) = P(C and S) / P(S) = (50/500) / (200/500)',
        result: 'P(complications | surgery) = 50/200 = 0.25 = 25%',
        explanation:
          'We restrict to surgery patients (n=200) and look at how many had complications (50). 50/200 = 0.25.',
      },
      {
        stepNumber: 3,
        label: 'P(complications | no surgery)',
        expression: 'P(C|Sᶜ) = 20/300',
        result: 'P(complications | no surgery) ≈ 0.067 = 6.7%',
        explanation:
          'Among the 300 non-surgery patients, only 20 had complications. Much lower than the surgery group.',
      },
      {
        stepNumber: 4,
        label: 'Overall (unconditional) P(complications)',
        expression: 'P(C) = 70/500',
        result: 'P(complications) = 0.14 = 14%',
        explanation:
          'Without conditioning, 70 of all 500 patients had complications. Conditioning on surgery status gives a clearer picture.',
      },
      {
        stepNumber: 5,
        label: 'Comparison',
        expression: 'P(C|S) = 0.25 vs. P(C|Sᶜ) = 0.067 vs. P(C) = 0.14',
        result: 'Surgery patients have ~4× higher complication rate than non-surgery patients',
        explanation:
          'The unconditional rate (14%) hides the dramatic difference between the two groups. Conditional probability reveals the true risk.',
      },
    ],
    interpretation:
      'Surgical patients are 3.7× more likely to experience complications (25% vs 6.7%). The unconditional 14% masks this difference. Conditional probability is essential for correct clinical interpretation.',
  },
  interpretation:
    'P(A|B) always gives the probability within the restricted world where B has occurred. It can be higher, lower, or the same as P(A) depending on the relationship between A and B. When P(A|B) = P(A), A and B are independent.',
  commonMistakes: [
    {
      mistake: 'Reversing the condition — confusing P(A|B) with P(B|A)',
      explanation:
        'P(disease | positive test) is very different from P(positive test | disease). The "prosecutor\'s fallacy" is exactly this mistake. Always read the bar: "A given B" vs "B given A."',
    },
    {
      mistake: 'Using the wrong denominator from the contingency table',
      explanation:
        'The denominator in P(A|B) is the total count for B (the row or column total of the conditioning group), not the grand total.',
    },
    {
      mistake: 'Assuming conditional probability equals joint probability',
      explanation:
        'P(A|B) ≠ P(A and B). P(A|B) = P(A and B) / P(B). The joint probability is always ≤ either marginal probability. The conditional probability can be much higher.',
    },
    {
      mistake: 'Treating conditional probability as always less than unconditional',
      explanation:
        'P(A|B) can be greater than, less than, or equal to P(A). If B is a subgroup where A is more common, P(A|B) > P(A).',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'cp-easy-1',
        scenario:
          'In a class of 30 students: 18 passed the final exam. Of those 18, 12 also passed the midterm.',
        question: 'What is P(passed midterm | passed final)?',
        hint: 'The condition restricts you to the 18 students who passed the final.',
        solution: 'P(midterm | final) = 12/18 = 2/3 ≈ 0.667.',
      },
      {
        id: 'cp-easy-2',
        scenario: 'P(A and B) = 0.12, P(B) = 0.30.',
        question: 'What is P(A|B)?',
        hint: 'Apply the formula directly: P(A|B) = P(A and B) / P(B).',
        solution: 'P(A|B) = 0.12 / 0.30 = 0.40.',
      },
    ],
    moderate: [
      {
        id: 'cp-mod-1',
        scenario:
          'A diagnostic test: P(disease) = 0.02. P(positive | disease) = 0.95. P(positive | no disease) = 0.05.',
        question:
          'Of 10,000 people tested, how many true positives and false positives are expected? What fraction of positive tests are true positives?',
        hint:
          'Calculate expected counts for each group (200 with disease, 9800 without), then apply the conditional probabilities.',
        solution:
          'With disease: 200 × 0.95 = 190 true positives. Without disease: 9800 × 0.05 = 490 false positives. Total positives = 680. P(disease | positive) = 190/680 ≈ 0.279 — only 28% of positive tests are true positives.',
      },
    ],
    challenging: [
      {
        id: 'cp-chal-1',
        scenario:
          '800 loan applicants: 480 approved, 320 rejected. Of approved: 60 defaulted. Of rejected: 10 would have defaulted if approved. (Assume these 10 were correctly rejected.)',
        question:
          'What is P(default | approved)? What is P(approved | no default) among the 800 applicants?',
        hint: 'For P(default | approved): look only at approved applicants. For P(approved | no default): restrict to non-defaulters.',
        solution:
          'P(default | approved) = 60/480 = 0.125. Non-defaulters among approved = 480 − 60 = 420. Total non-defaulters = 420 + (320 − 10) = 730. P(approved | no default) = 420/730 ≈ 0.575.',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cp-kc-1',
      type: 'numerical',
      question:
        'P(A and B) = 0.15, P(B) = 0.50. What is P(A|B)?',
      answer: 0.3,
      tolerance: 0.01,
      explanation: 'P(A|B) = P(A and B) / P(B) = 0.15 / 0.50 = 0.30.',
      hint: 'Divide the joint probability by the probability of the condition.',
    },
    {
      id: 'cp-kc-2',
      type: 'multiple-choice',
      question:
        'In a hospital: 300 patients, 120 have diabetes, 40 have both diabetes and hypertension. What is P(hypertension | diabetes)?',
      options: [
        { id: 'a', text: '40/300 ≈ 0.133', isCorrect: false, explanation: 'That is P(diabetes and hypertension) — you need to condition on diabetes (n=120).' },
        { id: 'b', text: '40/120 ≈ 0.333', isCorrect: true, explanation: 'Correct! Restrict to diabetes patients (120). Of those, 40 also have hypertension. P = 40/120 = 1/3.' },
        { id: 'c', text: '120/300 = 0.4', isCorrect: false, explanation: 'That is P(diabetes), not the conditional probability.' },
        { id: 'd', text: '40/260', isCorrect: false, explanation: '260 is the count of non-diabetes patients — not the conditioning group.' },
      ],
      explanation: 'P(hypertension | diabetes) = count(both) / count(diabetes) = 40/120 ≈ 0.333.',
      hint: 'The denominator is the count of the conditioning group (diabetes), not the total.',
    },
    {
      id: 'cp-kc-3',
      type: 'multiple-choice',
      question:
        'P(A|B) = P(A). What does this tell you about events A and B?',
      options: [
        { id: 'a', text: 'A and B are mutually exclusive', isCorrect: false, explanation: 'Mutually exclusive means P(A and B) = 0, which would mean P(A|B) = 0, not P(A).' },
        { id: 'b', text: 'A and B are independent', isCorrect: true, explanation: 'Correct! P(A|B) = P(A) means knowing B provides no information about A — the definition of independence.' },
        { id: 'c', text: 'A and B are complements', isCorrect: false, explanation: 'Complements together make up the full sample space. That is a different relationship.' },
        { id: 'd', text: 'A = B', isCorrect: false, explanation: 'If A = B, then P(A|B) = 1, not P(A).' },
      ],
      explanation: 'When P(A|B) = P(A), conditioning on B does not change the probability of A — the events are independent.',
      hint: 'When does conditioning on B give no new information about A?',
    },
    {
      id: 'cp-kc-4',
      type: 'multiple-choice',
      question: 'P(B|A) and P(A|B) — when are these equal?',
      options: [
        { id: 'a', text: 'Always', isCorrect: false, explanation: 'P(B|A) = P(A and B)/P(A) and P(A|B) = P(A and B)/P(B). They are only equal when P(A) = P(B).' },
        { id: 'b', text: 'Never', isCorrect: false, explanation: 'They can be equal — see below.' },
        { id: 'c', text: 'When P(A) = P(B)', isCorrect: true, explanation: 'Correct! P(B|A) = P(A∩B)/P(A) and P(A|B) = P(A∩B)/P(B). These are equal only when P(A) = P(B).' },
        { id: 'd', text: 'When A and B are mutually exclusive', isCorrect: false, explanation: 'If mutually exclusive: P(B|A) = 0 and P(A|B) = 0 — both zero, which is a special case only.' },
      ],
      explanation: 'P(B|A) = P(A∩B)/P(A) and P(A|B) = P(A∩B)/P(B). These are equal only when the denominators P(A) and P(B) are equal.',
      hint: 'Look at the denominators in each formula.',
    },
    {
      id: 'cp-kc-5',
      type: 'multiple-choice',
      question:
        'Why is conditional probability useful in medical screening?',
      options: [
        { id: 'a', text: 'It removes all uncertainty from diagnosis', isCorrect: false, explanation: 'No statistical method eliminates uncertainty — it helps quantify and interpret it.' },
        { id: 'b', text: 'It allows calculation of P(disease | test result), which is what clinicians actually need', isCorrect: true, explanation: 'Correct! A test gives P(positive | disease). What matters clinically is P(disease | positive) — that requires conditional probability.' },
        { id: 'c', text: 'It makes all test results 100% accurate', isCorrect: false, explanation: 'Conditional probability does not improve test accuracy — it helps interpret the results correctly.' },
        { id: 'd', text: 'It is only used in theoretical statistics, not clinical practice', isCorrect: false, explanation: 'Conditional probability underpins sensitivity, specificity, PPV, and NPV — all clinically essential measures.' },
      ],
      explanation: 'Tests produce P(positive | disease). Clinicians need P(disease | positive). Converting between these requires conditional probability via Bayes\' theorem.',
      hint: 'What question does a doctor actually need answered when a test is positive?',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'cp-tf-1', type: 'true-false', question: 'P(A|B) = P(A and B) / P(B), provided P(B) > 0.', isTrue: true, explanation: 'This is the definition of conditional probability. P(B) must be positive to avoid dividing by zero.' },
    { id: 'cp-tf-2', type: 'true-false', question: 'P(A|B) = P(B|A) is always true.', isTrue: false, explanation: 'P(A|B) and P(B|A) are generally not equal. Confusing them is the base-rate neglect fallacy (prosecutor\'s fallacy).' },
    { id: 'cp-tf-3', type: 'true-false', question: 'Conditioning on event B restricts the sample space to outcomes where B occurred.', isTrue: true, explanation: 'When we know B happened, we only consider the subset of the sample space consistent with B.' },
    { id: 'cp-tf-4', type: 'true-false', question: 'P(A|B) can be greater than P(A).', isTrue: true, explanation: 'Conditioning on B can increase P(A) if B and A are positively associated. P(A|B) > P(A) is perfectly valid.' },
    { id: 'cp-tf-5', type: 'true-false', question: 'If A and B are independent, then P(A|B) = P(A).', isTrue: true, explanation: 'Independence means B provides no information about A — the conditional probability equals the marginal probability.' },
    { id: 'cp-tf-6', type: 'true-false', question: 'P(A|B) + P(Aᶜ|B) = 1 for any event B with P(B) > 0.', isTrue: true, explanation: 'Conditioning on B creates a new probability space where the complement rule still holds: given B, either A occurs or it does not.' },
    { id: 'cp-tf-7', type: 'true-false', question: 'P(A|B) = P(A) if and only if P(B|A) = P(B).', isTrue: true, explanation: 'Both conditions are equivalent definitions of independence. Either one implies the other via Bayes\' theorem.' },
    { id: 'cp-tf-8', type: 'true-false', question: 'A false positive in medical testing occurs when P(disease | positive test) is mistakenly assumed to equal P(positive test | disease).', isTrue: true, explanation: 'Confusing these two conditional probabilities — the prosecutor\'s fallacy — leads to systematic overestimation of disease probability.' },
    { id: 'cp-tf-9', type: 'true-false', question: 'You can compute P(A|B) from a contingency table by dividing the cell count of (A and B) by the row total for B.', isTrue: true, explanation: 'The conditional probability P(A|B) = n(A and B) / n(B), which is the joint cell divided by the B marginal total.' },
    { id: 'cp-tf-10', type: 'true-false', question: 'P(A|B) × P(B) = P(B|A) × P(A).', isTrue: true, explanation: 'Both sides equal P(A and B) by the multiplication rule. This equality is the basis for Bayes\' theorem.' },
    { id: 'cp-tf-11', type: 'true-false', question: 'If P(B) = 0, then P(A|B) is defined as 0.', isTrue: false, explanation: 'P(A|B) is undefined when P(B) = 0, because conditioning on an impossible event has no mathematical meaning.' },
    { id: 'cp-tf-12', type: 'true-false', question: 'Bayes\' theorem allows you to reverse the conditioning: compute P(A|B) from P(B|A).', isTrue: true, explanation: 'Bayes\' theorem: P(A|B) = P(B|A) × P(A) / P(B). It converts one direction of conditioning to the other.' },
    { id: 'cp-tf-13', type: 'true-false', question: 'P(A|B) is always less than or equal to P(A).', isTrue: false, explanation: 'P(A|B) can be greater than, equal to, or less than P(A) depending on the relationship between A and B.' },
    { id: 'cp-tf-14', type: 'true-false', question: 'If P(A|B) = 1, then B is a subset of A.', isTrue: true, explanation: 'P(A|B) = 1 means every outcome in B is also in A — i.e., B ⊆ A.' },
    { id: 'cp-tf-15', type: 'true-false', question: 'The sensitivity of a medical test equals P(positive test | disease).', isTrue: true, explanation: 'Sensitivity is the probability of testing positive given that the disease is present — this is P(positive | disease).' },
    { id: 'cp-tf-16', type: 'true-false', question: 'P(A|B) is always less than P(A and B).', isTrue: false, explanation: 'P(A|B) = P(A∩B)/P(B). If P(B) < 1, then P(A|B) > P(A∩B). Conditioning increases the "relative" probability.' },
    { id: 'cp-tf-17', type: 'true-false', question: 'In a conditional probability problem, the event after the "|" is the one assumed to have occurred.', isTrue: true, explanation: 'P(A|B) is read "probability of A given B." B is the condition — the event assumed to have occurred.' },
    { id: 'cp-tf-18', type: 'true-false', question: 'P(A|B) and P(A∩B) measure the same thing expressed differently.', isTrue: false, explanation: 'P(A∩B) is an unconditional joint probability. P(A|B) is a conditional probability that scales P(A∩B) by 1/P(B).' },
    { id: 'cp-tf-19', type: 'true-false', question: 'The law of total probability states P(A) = P(A|B)×P(B) + P(A|Bᶜ)×P(Bᶜ).', isTrue: true, explanation: 'By partitioning on B: P(A) = P(A∩B) + P(A∩Bᶜ) = P(A|B)P(B) + P(A|Bᶜ)P(Bᶜ). This is the law of total probability.' },
    { id: 'cp-tf-20', type: 'true-false', question: 'Conditional probability is only useful in medical statistics, not other fields.', isTrue: false, explanation: 'Conditional probability is fundamental across finance (credit risk), law (forensic evidence), ML (naive Bayes), engineering (fault trees), and many other fields.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'cp-mc-6', type: 'multiple-choice', question: 'P(A and B) = 0.12, P(B) = 0.4. What is P(A|B)?', options: [{ id: 'a', text: '0.048', isCorrect: false, explanation: '0.048 = 0.12×0.4 — you multiplied instead of dividing.' }, { id: 'b', text: '0.3', isCorrect: true, explanation: 'P(A|B) = P(A∩B)/P(B) = 0.12/0.4 = 0.3.' }, { id: 'c', text: '0.52', isCorrect: false, explanation: '0.52 = 0.4+0.12 — addition has no basis here.' }, { id: 'd', text: '3.33', isCorrect: false, explanation: '3.33 > 1 is impossible for a probability.' }], explanation: 'P(A|B) = 0.12 / 0.4 = 0.3.', hint: 'Divide the joint probability by P(B).' },
    { id: 'cp-mc-7', type: 'multiple-choice', question: 'A contingency table shows 200 people: 80 are women who exercise, 20 are women who do not, 70 are men who exercise, 30 men who do not. P(exercises | woman) = ?', options: [{ id: 'a', text: '80/200', isCorrect: false, explanation: '80/200 = P(woman AND exercises) — not the conditional.' }, { id: 'b', text: '80/100', isCorrect: true, explanation: 'There are 100 women (80+20). Of those, 80 exercise. P = 80/100 = 0.8.' }, { id: 'c', text: '80/150', isCorrect: false, explanation: '150 is total exercisers, not total women.' }, { id: 'd', text: '100/200', isCorrect: false, explanation: '100/200 = P(woman) — not the conditional.' }], explanation: 'P(exercises|woman) = n(woman AND exercises) / n(woman) = 80/100 = 0.8.', hint: 'Restrict to the row for women, then find the fraction who exercise.' },
    { id: 'cp-mc-8', type: 'multiple-choice', question: 'P(B|A) = 0.6, P(A) = 0.5. What is P(A and B)?', options: [{ id: 'a', text: '1.1', isCorrect: false, explanation: '1.1 > 1 is impossible.' }, { id: 'b', text: '0.3', isCorrect: true, explanation: 'P(A∩B) = P(B|A) × P(A) = 0.6 × 0.5 = 0.3.' }, { id: 'c', text: '0.1', isCorrect: false, explanation: '0.1 = 0.6−0.5 — subtraction has no basis.' }, { id: 'd', text: '1.2', isCorrect: false, explanation: '1.2 > 1 is impossible.' }], explanation: 'Multiplication rule: P(A∩B) = P(B|A) × P(A) = 0.6 × 0.5 = 0.3.', hint: 'Use the multiplication rule: P(A∩B) = P(B|A) × P(A).' },
    { id: 'cp-mc-9', type: 'multiple-choice', question: 'Which of these equals P(A|B) by Bayes\' theorem?', options: [{ id: 'a', text: 'P(B|A) × P(B) / P(A)', isCorrect: false, explanation: 'The numerator and denominator are swapped.' }, { id: 'b', text: 'P(B|A) × P(A) / P(B)', isCorrect: true, explanation: 'Bayes\' theorem: P(A|B) = P(B|A)×P(A)/P(B). This is the correct form.' }, { id: 'c', text: 'P(A) / P(B)', isCorrect: false, explanation: 'This omits the likelihood P(B|A).' }, { id: 'd', text: 'P(A and B) × P(B)', isCorrect: false, explanation: 'Multiplying by P(B) removes the conditioning effect rather than applying it.' }], explanation: 'Bayes\' theorem: P(A|B) = P(B|A) × P(A) / P(B).', hint: 'Recall the full form of Bayes\' theorem.' },
    { id: 'cp-mc-10', type: 'multiple-choice', question: 'A disease affects 1% of a population. A test has 90% sensitivity (P(+|disease)) and 95% specificity (P(−|no disease)). P(disease | positive test) ≈ ?', options: [{ id: 'a', text: '90%', isCorrect: false, explanation: 'Sensitivity is P(+|disease), not P(disease|+). Base rate matters enormously.' }, { id: 'b', text: '≈15%', isCorrect: true, explanation: 'Using Bayes: P(disease|+) = (0.9×0.01) / [(0.9×0.01)+(0.05×0.99)] ≈ 0.009/0.0585 ≈ 0.154 ≈ 15%.' }, { id: 'c', text: '50%', isCorrect: false, explanation: '50% ignores the very low base rate of 1%.' }, { id: 'd', text: '1%', isCorrect: false, explanation: '1% is the prior (base rate), not the posterior after a positive test.' }], explanation: 'Low prevalence dominates: even with a good test, most positives in a rare disease are false positives. Bayes gives ≈15%.', hint: 'Apply Bayes\' theorem with prior = 1% disease prevalence.' },
    { id: 'cp-mc-11', type: 'multiple-choice', question: 'P(A|B) = 0.8 and P(B) = 0.5. What is P(A∩B)?', options: [{ id: 'a', text: '1.6', isCorrect: false, explanation: '1.6 > 1 is impossible.' }, { id: 'b', text: '0.4', isCorrect: true, explanation: 'P(A∩B) = P(A|B) × P(B) = 0.8 × 0.5 = 0.4.' }, { id: 'c', text: '0.3', isCorrect: false, explanation: '0.3 = 0.8−0.5 — subtraction is incorrect.' }, { id: 'd', text: '0.8', isCorrect: false, explanation: '0.8 is P(A|B), not P(A∩B).' }], explanation: 'Multiplication rule: P(A∩B) = P(A|B) × P(B) = 0.8 × 0.5 = 0.4.', hint: 'Rearrange the conditional probability formula.' },
    { id: 'cp-mc-12', type: 'multiple-choice', question: 'What does P(A|B) = 0 imply?', options: [{ id: 'a', text: 'P(A) = 0', isCorrect: false, explanation: 'P(A|B) = 0 only means A cannot occur given B — P(A) itself could be positive for other contexts.' }, { id: 'b', text: 'A and B cannot both occur', isCorrect: true, explanation: 'P(A|B) = 0 means P(A∩B) = 0: if B occurs, A cannot also occur. They are mutually exclusive.' }, { id: 'c', text: 'A is impossible', isCorrect: false, explanation: 'A may have positive probability outside of B — it is just impossible given B.' }, { id: 'd', text: 'P(B) = 0', isCorrect: false, explanation: 'We need P(B) > 0 for P(A|B) to be defined. P(B) = 0 is not implied.' }], explanation: 'P(A|B) = 0 → P(A∩B) = 0. B and A are mutually exclusive: knowing B occurred means A cannot occur.', hint: 'If A cannot happen given B, what can you say about their co-occurrence?' },
    { id: 'cp-mc-13', type: 'multiple-choice', question: 'In a class: 40% study maths, 30% study science, 15% study both. P(maths | science student) = ?', options: [{ id: 'a', text: '0.40', isCorrect: false, explanation: '0.40 is the marginal P(maths) — not the conditional given science.' }, { id: 'b', text: '0.50', isCorrect: true, explanation: 'P(maths|science) = P(both)/P(science) = 0.15/0.30 = 0.50.' }, { id: 'c', text: '0.375', isCorrect: false, explanation: '0.375 = 0.15/0.40 — you divided by P(maths) instead of P(science).' }, { id: 'd', text: '0.15', isCorrect: false, explanation: '0.15 is P(both) — the joint probability, not the conditional.' }], explanation: 'P(maths|science) = P(maths∩science) / P(science) = 0.15/0.30 = 0.5.', hint: 'Divide the joint probability by the probability of the conditioning event (science).' },
    { id: 'cp-mc-14', type: 'multiple-choice', question: 'The "prosecutor\'s fallacy" confuses which two probabilities?', options: [{ id: 'a', text: 'P(A) and P(Aᶜ)', isCorrect: false, explanation: 'That would be confusing an event with its complement.' }, { id: 'b', text: 'P(evidence | innocent) and P(innocent | evidence)', isCorrect: true, explanation: 'The prosecutor\'s fallacy equates P(evidence | innocent) with P(innocent | evidence) — two very different quantities.' }, { id: 'c', text: 'P(A) and P(B)', isCorrect: false, explanation: 'Confusing marginal probabilities is not specifically the prosecutor\'s fallacy.' }, { id: 'd', text: 'P(A and B) and P(A or B)', isCorrect: false, explanation: 'That confuses intersection and union, not the conditional direction.' }], explanation: 'The prosecutor\'s fallacy: treating P(rare evidence | innocent) as P(innocent | rare evidence). Bayes\' theorem is required to convert between them.', hint: 'In a courtroom, which probability does the prosecutor present, and which does the jury need?' },
    { id: 'cp-mc-15', type: 'multiple-choice', question: 'P(A) = 0.6, P(B) = 0.5, A and B independent. What is P(A|B)?', options: [{ id: 'a', text: '0.3', isCorrect: false, explanation: '0.3 = P(A∩B) = P(A)×P(B) for independent events — not P(A|B).' }, { id: 'b', text: '0.6', isCorrect: true, explanation: 'For independent events P(A|B) = P(A) = 0.6. Conditioning on B changes nothing.' }, { id: 'c', text: '1.1', isCorrect: false, explanation: '1.1 > 1 is impossible.' }, { id: 'd', text: '0.5', isCorrect: false, explanation: '0.5 is P(B), not P(A|B).' }], explanation: 'Independence: P(A|B) = P(A) = 0.6. The condition B provides no information about A.', hint: 'What does independence mean for conditional probability?' },
  ],
  keyTakeaway:
    'P(A|B) = P(A and B) / P(B). Conditioning on B restricts your sample space to outcomes where B occurred. From a contingency table: divide the joint count by the row or column total for B.',
  visualization: <ConditionalViz />,
  datasetGenerator: false,
}

export default function ConditionalProbability({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
