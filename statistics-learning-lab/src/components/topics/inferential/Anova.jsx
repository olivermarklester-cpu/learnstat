import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, oneWayAnova } from '../../../utils/stats'

// ── Interactive one-way ANOVA calculator ──────────────────────────────────────

const DEFAULT_GROUPS = [
  [72, 75, 78, 74, 76],
  [85, 88, 82, 87, 84],
  [70, 68, 72, 71, 69],
]
const GROUP_LABELS = ['Group A', 'Group B', 'Group C']
const GROUP_COLORS = ['bg-blue-50 border-blue-200', 'bg-purple-50 border-purple-200', 'bg-amber-50 border-amber-200']

function AnovaViz() {
  const [groups, setGroups] = useState(DEFAULT_GROUPS)
  const [alpha, setAlpha] = useState(0.05)

  const result = useMemo(() => oneWayAnova(groups), [groups])
  const F = result ? round(result.F, 4) : '—'
  const p = result ? round(result.p, 4) : '—'
  const reject = typeof p === 'number' && p <= alpha

  function updateGroup(gi, val) {
    const nums = val.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n))
    if (nums.length < 2) return
    setGroups((prev) => prev.map((g, i) => (i === gi ? nums : g)))
  }

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">Enter comma-separated values per group:</p>
      <div className="space-y-2 mb-4">
        {groups.map((g, gi) => (
          <div key={gi} className={`border rounded-lg p-2 ${GROUP_COLORS[gi]}`}>
            <label className="block text-xs font-medium mb-1">{GROUP_LABELS[gi]} (n={g.length}, x̄={round(g.reduce((s,v)=>s+v,0)/g.length,2)})</label>
            <input
              type="text"
              defaultValue={g.join(', ')}
              onBlur={(e) => updateGroup(gi, e.target.value)}
              className="w-full text-xs border border-border rounded px-2 py-1 bg-white outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">α</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white">
            <option value={0.10}>0.10</option>
            <option value={0.05}>0.05</option>
            <option value={0.01}>0.01</option>
          </select>
        </div>
      </div>

      {result && (
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-surface">
                <th className="border border-border p-1.5 text-left text-textMuted">Source</th>
                <th className="border border-border p-1.5 text-textMuted">SS</th>
                <th className="border border-border p-1.5 text-textMuted">df</th>
                <th className="border border-border p-1.5 text-textMuted">MS</th>
                <th className="border border-border p-1.5 text-textMuted">F</th>
                <th className="border border-border p-1.5 text-textMuted">p</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-1.5 font-medium text-blue-700">Between groups</td>
                <td className="border border-border p-1.5 text-center">{round(result.SSB, 2)}</td>
                <td className="border border-border p-1.5 text-center">{result.dfBetween}</td>
                <td className="border border-border p-1.5 text-center">{round(result.MSB, 2)}</td>
                <td className="border border-border p-1.5 text-center font-bold">{F}</td>
                <td className="border border-border p-1.5 text-center">{p}</td>
              </tr>
              <tr>
                <td className="border border-border p-1.5 font-medium text-gray-600">Within groups</td>
                <td className="border border-border p-1.5 text-center">{round(result.SSW, 2)}</td>
                <td className="border border-border p-1.5 text-center">{result.dfWithin}</td>
                <td className="border border-border p-1.5 text-center">{round(result.MSW, 2)}</td>
                <td className="border border-border p-1.5 text-center text-textMuted">—</td>
                <td className="border border-border p-1.5 text-center text-textMuted">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className={`rounded-lg p-2 border text-center text-sm font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {result
          ? (reject ? `Reject H₀ — F=${F}, p=${p} ≤ α=${alpha}. At least one group mean differs.`
                    : `Fail to reject H₀ — F=${F}, p=${p} > α=${alpha}.`)
          : 'Enter at least 2 values per group.'}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'ANOVA',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Explain what one-way ANOVA tests, interpret the F-statistic, and identify when post-hoc tests are needed.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Analysis of Variance (ANOVA)</strong> tests whether the means of <em>three or
        more</em> groups are equal. Comparing groups pairwise with t-tests inflates the Type I
        error rate — ANOVA controls for this by performing a single omnibus test.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Core idea: partitioning variance</p>
        <p className="text-blue-800">
          ANOVA splits total variability into <strong>between-group</strong> variance (signal —
          differences between group means) and <strong>within-group</strong> variance (noise —
          variability inside each group). The F-statistic is their ratio.
        </p>
      </div>
      <p>
        <strong>H₀: μ₁ = μ₂ = μ₃ = … = μₖ</strong> (all group means are equal).<br />
        <strong>H₁:</strong> At least one group mean differs.
      </p>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-amber-900 mb-1">What ANOVA does NOT tell you</p>
        <p className="text-amber-800">
          A significant F only tells you <em>that</em> at least one mean differs — not <em>which</em>
          groups differ. Post-hoc tests (Tukey, Bonferroni) identify specific pairwise differences.
        </p>
      </div>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A teacher compares test scores from three teaching methods (lecture, flipped class,
        problem-based). Instead of three t-tests (A vs B, B vs C, A vs C), ANOVA asks in one
        test: "Do all three methods produce the same average score?" If yes → fail to reject H₀.
        If no → investigate with post-hoc tests to see which method(s) stand out.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'anova',
    title: 'How the ANOVA F-Statistic is built',
    steps: [
      {
        label: 'Between-group variance (MS_B) uses Variance of group means',
        symbolName: 'Var(x̄ᵢ)',
        highlightColor: 'blue',
        from: 'MS_B = SS_B / df_B',
        to: 'MS_B = Σ nᵢ(x̄ᵢ − x̄_grand)² / (k−1)',
        note: 'SS_B is the sum of squared deviations of each group mean from the grand mean, weighted by group size. This is the signal — how spread apart the groups are.',
      },
      {
        label: 'Within-group variance (MS_W) is the average Variance within each group',
        symbolName: 'Var(within)',
        highlightColor: 'orange',
        from: 'MS_W = SS_W / df_W',
        to: 'MS_W = Σ Σ (xᵢⱼ − x̄ᵢ)² / (N−k)',
        note: 'MS_W = SS_W/(N−k) is the pooled variance within the groups — the noise. It is the same concept as sample variance s², but pooled across all k groups.',
      },
      {
        label: 'F-statistic = Signal / Noise',
        symbolName: 'F',
        highlightColor: 'green',
        from: 'F = MS_B / MS_W',
        to: 'F = [Σ nᵢ(x̄ᵢ−x̄)²/(k−1)] / [Σ Σ(xᵢⱼ−x̄ᵢ)²/(N−k)]',
        note: 'If group means are similar (small MS_B) relative to individual variation (large MS_W), F is small (it is about 1 when H₀ is true). A large F means group differences are bigger than random noise.',
      },
    ],
    finalFormula: 'F = MS_B / MS_W',
  },
  formula: {
    main: 'F = MS_Between / MS_Within',
    variants: [
      { label: 'F-statistic', expression: 'F = MS_B / MS_W = (SS_B / df_B) / (SS_W / df_W)', latex: 'F = \\frac{MS_B}{MS_W}' },
      { label: 'SS Between (signal)', expression: 'SS_B = Σ nᵢ (x̄ᵢ − x̄_grand)²', latex: 'SS_B = \\sum n_i (\\bar{x}_i - \\bar{x})^2' },
      { label: 'SS Within (noise)', expression: 'SS_W = Σ Σ (xᵢⱼ − x̄ᵢ)²', latex: 'SS_W = \\sum\\sum (x_{ij} - \\bar{x}_i)^2' },
      { label: 'Degrees of freedom', expression: 'df_B = k−1,  df_W = N−k', latex: 'df_B = k-1,\\; df_W = N-k' },
    ],
    symbolGuide: [
      { symbol: 'k', meaning: 'Number of groups' },
      { symbol: 'N', meaning: 'Total sample size across all groups' },
      { symbol: 'nᵢ', meaning: 'Sample size of group i' },
      { symbol: 'x̄ᵢ', meaning: 'Mean of group i' },
      { symbol: 'x̄_grand', meaning: 'Grand mean (mean of all observations)' },
      { symbol: 'MS_B', meaning: 'Mean square between groups = SS_B / (k−1)' },
      { symbol: 'MS_W', meaning: 'Mean square within groups = SS_W / (N−k)' },
    ],
  },
  whenToUse: [
    'Comparing means across three or more independent groups',
    'Outcome is continuous; grouping variable is categorical',
  ],
  whenNotToUse: [
    'Only two groups — use an independent t-test (simpler and equivalent)',
    'Groups are not independent (repeated measures) — use repeated-measures ANOVA',
    'Data is highly non-normal and n is small — consider Kruskal-Wallis (non-parametric)',
  ],
  assumptions: [
    'Observations within each group are independent',
    'The populations are approximately normally distributed (relaxed for large n)',
    'Equal variances across all groups (homogeneity of variance) — Levene\'s test',
    'Random sampling from the populations',
  ],
  workedExample: {
    scenario:
      '3 groups, each n=5: Group A (72,75,78,74,76), Group B (85,88,82,87,84), Group C (70,68,72,71,69). Test H₀: μ_A = μ_B = μ_C at α = 0.05.',
    steps: [
      { stepNumber: 1, label: 'Group means and grand mean', expression: 'x̄_A=75, x̄_B=85.2, x̄_C=70. Grand mean = 76.73', result: 'Grand mean ≈ 76.73', explanation: 'Average all 15 observations.' },
      { stepNumber: 2, label: 'SS Between', expression: 'SS_B = 5(75−76.73)² + 5(85.2−76.73)² + 5(70−76.73)²', result: 'SS_B ≈ 15.0 + 358.4 + 226.7 ≈ 600.1', explanation: 'Weighted sum of squared deviations of group means from grand mean.' },
      { stepNumber: 3, label: 'SS Within', expression: 'SS_W = Σ within each group: A=20, B=22.8, C=10 → SS_W = 52.8', result: 'SS_W ≈ 52.8, df_W = 12', explanation: 'Sum of squared deviations within each group.' },
      { stepNumber: 4, label: 'F-statistic', expression: 'F = (600.1/2) / (52.8/12) = 300.07 / 4.4', result: 'F ≈ 68.2, p < 0.001', explanation: 'Very large F → reject H₀. At least one group mean differs.' },
    ],
    interpretation:
      'F(2, 12) ≈ 68.2, p < 0.001. Overwhelming evidence that the three group means differ. Post-hoc tests (e.g., Tukey) would identify which specific pairs differ.',
  },
  interpretation:
    'A large F (ratio of between-group to within-group variance) with small p indicates that the group means are not all equal. Follow up with effect size (η²) and post-hoc tests to understand the pattern.',
  commonMistakes: [
    { mistake: 'Running multiple t-tests instead of ANOVA', explanation: 'With 3 groups, 3 t-tests gives α* ≈ 1−(0.95)³ ≈ 0.14, not 0.05. ANOVA keeps the family-wise error rate at α.' },
    { mistake: 'Stopping at the F-test without post-hoc tests', explanation: 'A significant F tells you at least one mean differs — not which. Always follow up with Tukey\'s HSD, Bonferroni, or similar.' },
    { mistake: 'Ignoring the equal-variance assumption', explanation: 'If group SDs differ greatly, use Welch\'s ANOVA (unequal variances). Check with Levene\'s test.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'an-easy-1', scenario: 'ANOVA with k=4 groups, N=40 total.', question: 'What are df_Between and df_Within?', hint: 'df_B = k−1, df_W = N−k.', solution: 'df_B = 3, df_W = 36.' },
    ],
    moderate: [
      { id: 'an-mod-1', scenario: 'SS_B = 120, SS_W = 180, k = 3, N = 21.', question: 'Calculate MS_B, MS_W, and F.', hint: 'MS = SS/df. F = MS_B/MS_W.', solution: 'df_B=2, df_W=18. MS_B=60, MS_W=10. F=6.0. F*(2,18,α=0.05)≈3.55 → reject H₀.' },
    ],
    challenging: [
      { id: 'an-chal-1', scenario: 'An ANOVA gives F(3,40)=4.2, p=0.011. A researcher reports this as proof that Group A has the highest mean.', question: 'What is wrong with this interpretation?', hint: 'What does ANOVA tell you vs. what it does not?', solution: 'ANOVA only tells you at least one mean differs. It says nothing about which group has the highest mean or which pairs differ. Post-hoc tests (Tukey\'s HSD) must be used to identify specific pairwise differences.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'an-kc-1', type: 'multiple-choice',
      question: 'Why use ANOVA instead of multiple t-tests when comparing 3 groups?',
      options: [
        { id: 'a', text: 'ANOVA is always more powerful than t-tests', isCorrect: false, explanation: 'Power is not the reason; the issue is Type I error rate inflation from running multiple tests.' },
        { id: 'b', text: 'Multiple t-tests inflate the family-wise Type I error rate', isCorrect: true, explanation: 'Correct! With k=3 groups and α=0.05, three t-tests give a combined error rate of ~14%, not 5%.' },
        { id: 'c', text: 'ANOVA requires smaller sample sizes', isCorrect: false, explanation: 'Sample size requirements are similar between ANOVA and t-tests.' },
        { id: 'd', text: 'ANOVA works for categorical outcomes; t-tests do not', isCorrect: false, explanation: 'Both ANOVA and t-tests require a continuous outcome variable.' },
      ],
      explanation: 'Multiple t-tests inflate the family-wise error rate. ANOVA performs one omnibus test maintaining α.',
      hint: 'What happens to the overall error rate when you run 3 separate tests?',
    },
    {
      id: 'an-kc-2', type: 'multiple-choice',
      question: 'A significant F-test in ANOVA tells you:',
      options: [
        { id: 'a', text: 'All groups are different from each other', isCorrect: false, explanation: 'It only tells you at least one differs. Some pairs may be equal.' },
        { id: 'b', text: 'At least one group mean differs from the others', isCorrect: true, explanation: 'Correct! ANOVA\'s H₁ is "at least one group mean differs" — not all.' },
        { id: 'c', text: 'The first group has the highest mean', isCorrect: false, explanation: 'ANOVA does not tell you the direction or which group differs.' },
        { id: 'd', text: 'The data violates normality', isCorrect: false, explanation: 'F-statistic significance is about means, not normality violations.' },
      ],
      explanation: 'ANOVA H₁: at least one μ differs. Use post-hoc tests to find which pairs.',
      hint: 'What is H₁ in one-way ANOVA?',
    },
    {
      id: 'an-kc-3', type: 'numerical',
      question: 'k = 3 groups, N = 30 total. What are df_Between and df_Within? (Enter df_Between)',
      answer: 2,
      tolerance: 0,
      explanation: 'df_Between = k − 1 = 3 − 1 = 2. df_Within = N − k = 30 − 3 = 27.',
      hint: 'df_B = k − 1.',
    },
    {
      id: 'an-kc-4', type: 'multiple-choice',
      question: 'The F-statistic is the ratio of:',
      options: [
        { id: 'a', text: 'Sample variance to population variance', isCorrect: false, explanation: 'F is not the ratio of sample to population variance in ANOVA.' },
        { id: 'b', text: 'Mean square between groups to mean square within groups', isCorrect: true, explanation: 'Correct! F = MS_Between / MS_Within = signal / noise.' },
        { id: 'c', text: 'Total SS to within SS', isCorrect: false, explanation: 'F uses mean squares (SS/df), not raw SS values.' },
        { id: 'd', text: 'Between-group variance to total variance', isCorrect: false, explanation: 'SS_Between / SS_Total (a ratio of sums of squares) is η² (effect size), not the F-statistic.' },
      ],
      explanation: 'F = MS_B / MS_W = (between-group mean square) / (within-group mean square) = signal / noise.',
      hint: 'What do the two MS values represent?',
    },
    {
      id: 'an-kc-5', type: 'multiple-choice',
      question: 'SS_B = 200, SS_W = 300, k = 3, N = 18. What is F?',
      options: [
        { id: 'a', text: 'F = 5.0', isCorrect: true, explanation: 'df_B=2, df_W=15. MS_B=100, MS_W=20. F=100/20=5.0. Correct!' },
        { id: 'b', text: 'F = 0.67', isCorrect: false, explanation: '0.67 = SS_B/SS_W (200/300) — a ratio of raw sums of squares, not of mean squares.' },
        { id: 'c', text: 'F = 3.0', isCorrect: false, explanation: 'F = MS_B/MS_W = (200/2)/(300/15) = 100/20 = 5.0.' },
        { id: 'd', text: 'F = 1.5', isCorrect: false, explanation: '1.5 = SS_W/SS_B (300/200) — inverted raw sums of squares, not F. Use mean squares.' },
      ],
      explanation: 'df_B = k−1 = 2. df_W = N−k = 15. MS_B = 200/2 = 100. MS_W = 300/15 = 20. F = 100/20 = 5.',
      hint: 'Calculate MS_B and MS_W first, then F = MS_B / MS_W.',
    },
  ],
  keyTakeaway:
    'ANOVA tests H₀: all group means equal. F = MS_Between / MS_Within. A significant F means at least one mean differs — use post-hoc tests to find which. df_Between = k−1, df_Within = N−k.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The Signal-to-Noise Ratio</p>
      <p className="text-sm text-violet-800">
        F = <strong>Signal / Noise</strong> = MS_Between / MS_Within.
        Think of a radio: a large F means the signal (group differences) drowns out the noise (within-group scatter).
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <div className="font-bold text-blue-800 mb-1">MS_Between (signal)</div>
          <div className="text-blue-700">How spread out are the group means? Big → groups genuinely differ.</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-2">
          <div className="font-bold text-gray-700 mb-1">MS_Within (noise)</div>
          <div className="text-gray-600">How spread out are values within each group? Big → lots of natural variability.</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-violet-100">
              <th className="border border-violet-200 p-1 text-violet-800">Source</th>
              <th className="border border-violet-200 p-1 text-violet-800">df</th>
              <th className="border border-violet-200 p-1 text-violet-800">MS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-violet-200 p-1">Between</td>
              <td className="border border-violet-200 p-1 text-center">k − 1</td>
              <td className="border border-violet-200 p-1 text-center">SS_B / df_B</td>
            </tr>
            <tr>
              <td className="border border-violet-200 p-1">Within</td>
              <td className="border border-violet-200 p-1 text-center">N − k</td>
              <td className="border border-violet-200 p-1 text-center">SS_W / df_W</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ),
  visualization: <AnovaViz />,
  datasetGenerator: false,
}

export default function Anova({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
