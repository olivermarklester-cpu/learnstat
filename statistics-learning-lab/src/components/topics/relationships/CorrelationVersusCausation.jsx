import TopicPage from '../../layout/TopicPage'

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Correlation versus Causation',
  topicGroup: 'Relationships and Prediction',
  learningObjective:
    'Distinguish between correlation and causation, identify common sources of spurious associations, and evaluate causal claims critically.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Correlation</strong> tells you that two variables move together. <strong>Causation</strong> tells
        you that changing one variable <em>directly produces</em> a change in the other. These are fundamentally
        different claims — and one of the most common errors in interpreting data is treating a correlation as
        proof of causation.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Three explanations for a correlation between A and B</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>A causes B</strong> (direct causation)</li>
          <li><strong>B causes A</strong> (reverse causation)</li>
          <li><strong>C causes both A and B</strong> (confounding / lurking variable)</li>
        </ul>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">Classic spurious correlation examples</p>
        <ul className="space-y-1 text-amber-800 text-xs">
          <li>Ice cream sales correlate with drowning rates → confound: hot weather</li>
          <li>Number of firefighters at a fire correlates with damage → confound: fire size</li>
          <li>Shoe size correlates with reading ability in children → confound: age</li>
          <li>Nicolas Cage movies released per year correlates with pool drownings (r ≈ 0.67)</li>
        </ul>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A rooster crows every morning just before sunrise. The rooster does not cause the sun to rise —
        both events are driven by the rotation of the Earth (the real cause). If you silenced the rooster,
        the sun would still rise. Correlation without causation is the rooster problem in data form.
      </p>
    </div>
  ),
  formula: {
    main: 'Correlation ≠ Causation',
    variants: [
      { label: 'Bradford Hill criteria (causal evidence)', expression: 'Strength, Consistency, Temporality, Dose-response, Plausibility, Experiment', latex: '' },
      { label: 'Gold standard for causation', expression: 'Randomised Controlled Trial (RCT) — random assignment eliminates confounders', latex: '' },
    ],
    symbolGuide: [
      { symbol: 'Confounder (C)', meaning: 'A third variable that causes both A and B, creating a spurious correlation' },
      { symbol: 'Reverse causation', meaning: 'B → A rather than A → B' },
      { symbol: 'RCT', meaning: 'Randomised Controlled Trial — the only design that truly isolates causal effect' },
    ],
  },
  whenToUse: [
    'Any time you see a correlation reported — ask: does causation make sense here?',
    'Evaluating media claims like "X causes Y" based only on survey or observational data',
    'Designing studies: to establish causation, randomisation is needed',
  ],
  whenNotToUse: [
    'This is not a statistical test — it is a framework for critical thinking about data interpretation',
  ],
  assumptions: [
    'Observational data alone cannot establish causation — only randomised experiments can',
    'A strong correlation increases the plausibility of a causal link, but is not sufficient evidence',
    'Temporal order (cause must precede effect) is necessary but not sufficient for causation',
  ],
  workedExample: {
    scenario:
      'A study finds a strong positive correlation (r = 0.85) between the number of hospitals in a city and the number of deaths per year.',
    steps: [
      { stepNumber: 1, label: 'Observe the correlation', expression: 'r = +0.85 between hospitals and deaths', result: 'Strong positive correlation', explanation: 'More hospitals → more deaths? That seems backwards.' },
      { stepNumber: 2, label: 'Identify possible explanations', expression: 'Direct causation? Reverse? Confounding?', result: 'Confounding variable suspected', explanation: 'Population size is the confound: larger cities have more hospitals AND more deaths — both driven by city size.' },
      { stepNumber: 3, label: 'Control for the confounder', expression: 'Analyse deaths per 100,000 residents (standardised rate) by hospital density', result: 'After controlling for population: no positive correlation; likely a negative one', explanation: 'More hospitals per capita is associated with better outcomes — the raw correlation was misleading.' },
      { stepNumber: 4, label: 'Conclusion', expression: 'More hospitals do not cause more deaths', result: 'Population size was the confounder', explanation: 'This illustrates why controlling for confounders is essential in observational research.' },
    ],
    interpretation: 'A raw correlation between hospitals and deaths is a textbook confounding example. After controlling for population size, the association reverses. Always ask: what third variable might be causing both?',
  },
  interpretation:
    'Correlation is a necessary but not sufficient condition for causation. To establish causation you need: (1) temporal order (cause before effect), (2) a mechanism, (3) elimination of alternative explanations — ideally through randomised experimentation.',
  commonMistakes: [
    { mistake: '"This study shows X causes Y"', explanation: 'Unless it was an RCT, the study only shows an association. Observational studies control for measured confounders — but unmeasured ones may remain.' },
    { mistake: 'Ignoring reverse causation', explanation: 'Does stress cause poor health, or does poor health cause stress? Both directions are plausible from correlation alone.' },
    { mistake: 'Assuming large correlations mean direct causation', explanation: 'r = 0.99 can be entirely spurious (e.g., years of e-commerce sales correlates with piracy rates globally). Strength of correlation does not indicate causation.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'cvc-easy-1', scenario: 'Children who own more books score higher on reading tests.', question: 'Does this mean that owning books causes better reading? What else might explain this?', hint: 'Think about what factors influence both book ownership and reading ability.', solution: 'Not necessarily. A confounding variable like parental education / socioeconomic status likely affects both book ownership and reading performance. To establish causation, a randomised study (giving random children books) would be needed.' },
    ],
    moderate: [
      { id: 'cvc-mod-1', scenario: 'Countries with more TVs per household have longer life expectancies (r = 0.88).', question: 'Name two alternative explanations besides "TVs cause long life."', hint: 'Think about what wealthy, developed countries share.', solution: '(1) Confound: wealth/GDP — richer countries have more TVs AND better healthcare. (2) Reverse causation is less plausible here, but a more developed healthcare system → longer life + greater purchasing power → more TVs. The key insight: wealth (GDP per capita) drives both variables.' },
    ],
    challenging: [
      { id: 'cvc-chal-1', scenario: 'A pharmaceutical company reports that patients taking Drug X recover 3 days faster. This is based on observational data where patients self-selected to take the drug.', question: 'Why is this not sufficient evidence that Drug X causes faster recovery? What study design would be needed?', hint: 'Think about who chooses to take a drug vs. who does not.', solution: 'Self-selection bias: healthier, more health-conscious patients may be more likely to take the drug — they might recover faster regardless. Those who avoided the drug may be sicker or have comorbidities. The observed correlation is confounded by baseline health. A randomised controlled trial (RCT) — randomly assigning patients to Drug X vs. placebo — would be needed to establish causal efficacy.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cvc-kc-1', type: 'multiple-choice',
      question: 'Ice cream sales and drowning rates are strongly correlated. The most likely explanation is:',
      options: [
        { id: 'a', text: 'Ice cream causes drowning', isCorrect: false, explanation: 'There is no plausible biological mechanism for ice cream causing drowning.' },
        { id: 'b', text: 'Hot weather (summer) causes both ice cream sales and more swimming (→ drowning)', isCorrect: true, explanation: 'Correct! Temperature is the confounding variable driving both ice cream sales and swimming activity.' },
        { id: 'c', text: 'Drowning causes ice cream sales', isCorrect: false, explanation: 'Reverse causation is implausible here.' },
        { id: 'd', text: 'The correlation must be calculated incorrectly', isCorrect: false, explanation: 'The correlation is real — the issue is interpretation, not calculation.' },
      ],
      explanation: 'Hot weather (summer) is a confounding variable: it increases both ice cream consumption and swimming activity (→ more drowning risk).',
      hint: 'What third variable occurs at the same time as both ice cream sales and swimming?',
    },
    {
      id: 'cvc-kc-2', type: 'multiple-choice',
      question: 'What is the gold standard for establishing causation?',
      options: [
        { id: 'a', text: 'A very large observational study with r > 0.9', isCorrect: false, explanation: 'No matter how large, observational studies cannot rule out unmeasured confounders.' },
        { id: 'b', text: 'A randomised controlled trial (RCT)', isCorrect: true, explanation: 'Correct! Random assignment ensures treatment and control groups are comparable on all variables (measured and unmeasured), isolating the causal effect.' },
        { id: 'c', text: 'A study that finds a very low p-value', isCorrect: false, explanation: 'Statistical significance does not imply causation — even p < 0.001 from an observational study cannot establish cause.' },
        { id: 'd', text: 'Finding the same correlation in multiple countries', isCorrect: false, explanation: 'Consistency across studies strengthens a causal claim but is not sufficient — consistent confounders would also show consistent correlations.' },
      ],
      explanation: 'Only randomisation eliminates confounding. RCTs are the gold standard for causal inference.',
      hint: 'What study design removes the influence of confounders through random assignment?',
    },
    {
      id: 'cvc-kc-3', type: 'multiple-choice',
      question: 'A study finds more firefighters at larger fires. Does this mean firefighters cause more fire damage?',
      options: [
        { id: 'a', text: 'Yes — the positive correlation proves it', isCorrect: false, explanation: 'Correlation does not prove causation. Fire size is the confounding variable.' },
        { id: 'b', text: 'No — fire size confounds both: larger fires need more firefighters and cause more damage', isCorrect: true, explanation: 'Correct! Fire size drives both dispatched firefighters and damage. The correlation is spurious.' },
        { id: 'c', text: 'Maybe — we need r² to decide', isCorrect: false, explanation: 'The strength of the correlation is irrelevant for determining causation.' },
        { id: 'd', text: 'We cannot say anything without a p-value', isCorrect: false, explanation: 'Statistical significance is not the issue here — it is causal interpretation.' },
      ],
      explanation: 'Classic confound: fire size causes both more firefighters (dispatched) and more damage. The correlation between firefighters and damage is entirely explained by fire size.',
      hint: 'What third variable explains why large fires have both more firefighters and more damage?',
    },
    {
      id: 'cvc-kc-4', type: 'multiple-choice',
      question: 'Which of the following is necessary (but not sufficient) for A to cause B?',
      options: [
        { id: 'a', text: 'A must occur after B', isCorrect: false, explanation: 'Causes must PRECEDE effects — A must occur before B, not after.' },
        { id: 'b', text: 'A must occur before B (temporal precedence)', isCorrect: true, explanation: 'Correct! Temporal order is necessary: the cause must precede the effect. But it is not sufficient alone — correlation and elimination of alternatives are also needed.' },
        { id: 'c', text: 'r > 0.5 between A and B', isCorrect: false, explanation: 'Even a weak correlation can reflect causation; a strong correlation alone cannot establish it.' },
        { id: 'd', text: 'A must be measured perfectly (no error)', isCorrect: false, explanation: 'Measurement error affects precision but is not a requirement for defining causation.' },
      ],
      explanation: 'Temporal precedence (cause before effect) is necessary but not sufficient. You also need correlation and elimination of confounders.',
      hint: 'Can an effect happen before its cause?',
    },
    {
      id: 'cvc-kc-5', type: 'multiple-choice',
      question: 'A confounding variable is one that:',
      options: [
        { id: 'a', text: 'Is highly correlated with the predictor x', isCorrect: false, explanation: 'A confounder must be related to both x and y — being correlated with x alone is not enough.' },
        { id: 'b', text: 'Is associated with both the predictor x and the outcome y', isCorrect: true, explanation: 'Correct! A confounder affects both the predictor and the outcome, creating a spurious association between them.' },
        { id: 'c', text: 'Is always statistically significant in a regression model', isCorrect: false, explanation: 'A confounder can distort results even if its effect is not detected as significant.' },
        { id: 'd', text: 'Is the same as a dependent variable', isCorrect: false, explanation: 'A confounder is a third variable external to the predictor-outcome pair.' },
      ],
      explanation: 'A confounding variable is associated with both x and y, creating a spurious correlation between them.',
      hint: 'A confounder must have an effect on both variables in the relationship.',
    },
  ],
  keyTakeaway:
    'Correlation ≠ Causation. Three explanations for any correlation: A causes B, B causes A, or a third variable C causes both. Only randomised controlled trials (RCTs) can establish causation. Always ask: what confounders might explain this?',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "3 Suspects" Framework</p>
      <p className="text-sm text-violet-800">
        Whenever you see "A correlates with B", treat it like a detective case with 3 suspects:
      </p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-blue-50 border border-blue-300 rounded p-2">
          <div className="text-2xl mb-1">🔵→🔴</div>
          <div className="font-bold text-blue-800">A causes B</div>
          <div className="text-blue-700">Direct causation</div>
        </div>
        <div className="bg-orange-50 border border-orange-300 rounded p-2">
          <div className="text-2xl mb-1">🔴→🔵</div>
          <div className="font-bold text-orange-800">B causes A</div>
          <div className="text-orange-700">Reverse causation</div>
        </div>
        <div className="bg-purple-50 border border-purple-300 rounded p-2">
          <div className="text-2xl mb-1">⬛→🔵,🔴</div>
          <div className="font-bold text-purple-800">C causes both</div>
          <div className="text-purple-700">Confounding</div>
        </div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-xs text-violet-800">
        <strong>The rooster rule:</strong> Just because A always happens before B (rooster before sunrise) does not mean A causes B. You need a mechanism and an experiment (RCT) to convict.
      </div>
    </div>
  ),
  visualization: (
    <div className="space-y-3 text-sm">
      <p className="font-medium text-textDark">Spot the confound:</p>
      <div className="space-y-2 text-xs">
        {[
          { pair: 'Shoe size ↔ Reading ability', confound: 'Age (older children have bigger feet AND read better)' },
          { pair: 'Churches ↔ Crime rate (by city)', confound: 'Population size (larger cities have more of both)' },
          { pair: 'TV ownership ↔ Life expectancy', confound: 'National wealth / GDP' },
          { pair: 'Coffee consumption ↔ Lung cancer', confound: 'Smoking (coffee drinkers historically smoked more)' },
        ].map(({ pair, confound }) => (
          <div key={pair} className="border border-border rounded p-2 bg-surface">
            <div className="font-medium text-textDark">{pair}</div>
            <div className="text-textMuted mt-0.5">Confound: {confound}</div>
          </div>
        ))}
      </div>
    </div>
  ),
  datasetGenerator: false,
}

export default function CorrelationVersusCausation({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
