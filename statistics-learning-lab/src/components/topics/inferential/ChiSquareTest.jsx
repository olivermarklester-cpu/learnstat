import { useState, useMemo } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, chiSquareStat, expectedFrequencies, chiSquarePValue } from '../../../utils/stats'

// ── Interactive Chi-square calculator ─────────────────────────────────────────

const DEFAULT_OBS = [
  [30, 20],
  [10, 40],
]
const COL_LABELS = ['Category A', 'Category B']
const ROW_LABELS = ['Group 1', 'Group 2']

function ChiSquareViz() {
  const [obs, setObs] = useState(DEFAULT_OBS)
  const [alpha, setAlpha] = useState(0.05)

  const exp = useMemo(() => expectedFrequencies(obs), [obs])
  const chi2 = useMemo(() => round(chiSquareStat(obs, exp), 4), [obs, exp])
  const df = (obs.length - 1) * (obs[0].length - 1)
  const p = useMemo(() => round(chiSquarePValue(chi2, df), 4), [chi2, df])
  const reject = p <= alpha

  function updateCell(r, c, val) {
    const n = Math.max(0, Number(val) || 0)
    setObs((prev) => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? n : v)))
    )
  }

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">Edit observed counts in the table:</p>
      <div className="overflow-x-auto mb-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="border border-border p-1.5 text-textMuted"></th>
              {COL_LABELS.map((l) => <th key={l} className="border border-border p-1.5 text-primary font-medium">{l}</th>)}
              <th className="border border-border p-1.5 text-textMuted">Row Total</th>
            </tr>
          </thead>
          <tbody>
            {obs.map((row, r) => {
              const rowTotal = row.reduce((s, v) => s + v, 0)
              return (
                <tr key={r}>
                  <td className="border border-border p-1.5 font-medium text-textMuted">{ROW_LABELS[r]}</td>
                  {row.map((v, c) => (
                    <td key={c} className="border border-border p-0.5">
                      <div>
                        <input type="number" min={0} value={v}
                          onChange={(e) => updateCell(r, c, e.target.value)}
                          className="w-full text-center text-xs border-0 bg-transparent outline-none font-bold" />
                        <div className="text-center text-gray-400 text-xs">E={round(exp[r][c], 1)}</div>
                      </div>
                    </td>
                  ))}
                  <td className="border border-border p-1.5 text-center font-medium text-textDark">{rowTotal}</td>
                </tr>
              )
            })}
            <tr className="bg-surface">
              <td className="border border-border p-1.5 font-medium text-textMuted">Col Total</td>
              {obs[0].map((_, c) => (
                <td key={c} className="border border-border p-1.5 text-center font-medium text-textDark">
                  {obs.reduce((s, row) => s + row[c], 0)}
                </td>
              ))}
              <td className="border border-border p-1.5 text-center font-bold text-textDark">
                {obs.flat().reduce((s, v) => s + v, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-textDark mb-1">α</label>
          <select value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
            className="w-full text-sm border border-border rounded-lg px-2 py-1.5 bg-white">
            <option value={0.10}>0.10</option>
            <option value={0.05}>0.05</option>
            <option value={0.01}>0.01</option>
          </select>
        </div>
        <div className="flex-1 flex items-end pb-1">
          <div className="bg-gray-50 border border-border rounded p-2 text-xs text-textMuted w-full">
            df = (r−1)(c−1) = {df}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="text-blue-600 font-medium">χ² statistic</div>
          <div className="text-blue-900 font-bold text-lg">{chi2}</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
          <div className="text-purple-600 font-medium">df</div>
          <div className="text-purple-900 font-bold text-lg">{df}</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
          <div className="text-amber-600 font-medium">p-value</div>
          <div className="text-amber-900 font-bold text-lg">{p}</div>
        </div>
      </div>

      <div className={`rounded-lg p-2 border text-center text-sm font-semibold ${reject ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
        {reject ? 'Reject H₀ — significant association' : 'Fail to reject H₀ — no significant association'}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Chi-square Test',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Apply the chi-square test of independence to determine whether two categorical variables are associated.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        The <strong>chi-square (χ²) test of independence</strong> tests whether two categorical
        variables are associated or independent. It compares <em>observed</em> cell frequencies
        in a contingency table to the <em>expected</em> frequencies if the variables were
        completely independent.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Two main chi-square tests</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>Test of independence:</strong> Are two categorical variables related? (e.g., gender × preference)</li>
          <li><strong>Goodness-of-fit:</strong> Does the observed distribution match an expected one? (one variable)</li>
        </ul>
      </div>
      <p>
        <strong>H₀:</strong> The two variables are independent (no association).<br />
        <strong>H₁:</strong> The two variables are associated.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine you survey 100 people: their preferred coffee type (espresso / latte) and whether
        they work mornings or evenings. If morning/evening preference were <em>unrelated</em> to
        coffee choice, you would expect proportional splits in every cell. The chi-square test
        measures how far the actual counts deviate from those expected proportions.
      </p>
    </div>
  ),
  formula: {
    main: 'χ² = Σ (O − E)² / E',
    variants: [
      { label: 'Chi-square statistic', expression: 'χ² = Σ (Oᵢⱼ − Eᵢⱼ)² / Eᵢⱼ', latex: '\\chi^2 = \\sum \\frac{(O_{ij} - E_{ij})^2}{E_{ij}}' },
      { label: 'Expected frequency', expression: 'Eᵢⱼ = (Row total × Column total) / Grand total', latex: 'E_{ij} = \\frac{R_i \\times C_j}{N}' },
      { label: 'Degrees of freedom', expression: 'df = (rows − 1) × (columns − 1)', latex: 'df = (r-1)(c-1)' },
    ],
    symbolGuide: [
      { symbol: 'O', meaning: 'Observed count in a cell' },
      { symbol: 'E', meaning: 'Expected count under H₀ (independence)' },
      { symbol: 'df', meaning: 'Degrees of freedom = (rows−1)(cols−1)' },
    ],
  },
  whenToUse: [
    'Both variables are categorical (nominal or ordinal)',
    'Testing independence in a two-way contingency table',
    'Goodness-of-fit: testing whether observed proportions match a theoretical distribution',
  ],
  whenNotToUse: [
    'When expected counts are too small (rule of thumb: any E < 5; Cochran: more than 20% of cells < 5 or any < 1) — use Fisher\'s exact test',
    'For continuous variables — use correlation or regression',
    'For comparing means — use t-tests or ANOVA',
  ],
  assumptions: [
    'Observations are independent',
    'Data are counts (not proportions or percentages)',
    'Expected frequency in each cell ≥ 5 (common rule of thumb; Cochran\'s more lenient rule: at least 80% of cells ≥ 5 and none < 1)',
    'Each observation belongs to exactly one cell',
  ],
  workedExample: {
    scenario:
      'A researcher surveys 100 people: 60 prefer tea, 40 prefer coffee. Among tea drinkers: 30 urban, 30 rural. Among coffee drinkers: 25 urban, 15 rural.',
    steps: [
      { stepNumber: 1, label: 'Build observed table', expression: 'Observed: Urban: tea=30, coffee=25. Rural: tea=30, coffee=15.', result: 'Row totals: Urban=55, Rural=45. Col totals: Tea=60, Coffee=40. N=100.', explanation: 'Arrange counts in a 2×2 table.' },
      { stepNumber: 2, label: 'Calculate expected frequencies', expression: 'E(Urban, Tea) = (55×60)/100 = 33. E(Urban, Coffee) = (55×40)/100 = 22. E(Rural, Tea) = 27. E(Rural, Coffee) = 18.', result: 'E table computed', explanation: 'E = (row total × col total) / grand total.' },
      { stepNumber: 3, label: 'Calculate χ²', expression: 'χ² = (30−33)²/33 + (25−22)²/22 + (30−27)²/27 + (15−18)²/18', result: 'χ² ≈ 0.273 + 0.409 + 0.333 + 0.500 = 1.515', explanation: 'Sum (O−E)²/E across all cells.' },
      { stepNumber: 4, label: 'Decision', expression: 'df=1, χ²=1.515. p ≈ 0.218 > 0.05', result: 'Fail to reject H₀', explanation: 'Insufficient evidence of association between location and drink preference.' },
    ],
    interpretation:
      'χ² = 1.515, df = 1, p ≈ 0.22. No significant association between urban/rural location and tea/coffee preference in this sample.',
  },
  interpretation:
    'A significant chi-square (p ≤ α) indicates the variables are associated — observed counts deviate too much from what independence would predict. A non-significant result does not prove independence; the sample may simply be too small.',
  commonMistakes: [
    { mistake: 'Using percentages instead of counts', explanation: 'Chi-square requires raw counts (frequencies), not percentages or proportions.' },
    { mistake: 'Ignoring the expected frequency assumption', explanation: 'If expected counts are too small (rule of thumb: E < 5), the chi-square approximation breaks down. Use Fisher\'s exact test for small samples.' },
    { mistake: 'Confusing test of independence with goodness-of-fit', explanation: 'Independence: two variables, contingency table. Goodness-of-fit: one variable, comparing to a theoretical distribution. Both use χ² but with different df.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'cs-easy-1', scenario: '2×2 table. Row totals: 50, 50. Col totals: 60, 40. N=100.', question: 'What is E for the top-left cell?', hint: 'E = (row total × col total) / N.', solution: 'E = (50 × 60)/100 = 30.' },
    ],
    moderate: [
      { id: 'cs-mod-1', scenario: 'Observed 2×2: [[20,30],[40,10]]. N=100.', question: 'Calculate χ². Expected: E₁₁=(50×60)/100=30, E₁₂=20, E₂₁=30, E₂₂=20.', hint: 'χ² = Σ(O−E)²/E for each of the 4 cells.', solution: '(20−30)²/30 + (30−20)²/20 + (40−30)²/30 + (10−20)²/20 = 3.33+5+3.33+5 = 16.67. df=1. p < 0.001 → reject H₀.' },
    ],
    challenging: [
      { id: 'cs-chal-1', scenario: 'A 3×2 contingency table (3 age groups × 2 voting choices). χ² = 8.5.', question: 'What is df? Is the result significant at α = 0.05? (χ²* at df=2, α=0.05 ≈ 5.991)', hint: 'df = (rows−1)(cols−1).', solution: 'df = (3−1)(2−1) = 2. χ² = 8.5 > 5.991 → reject H₀ at α=0.05. Significant association between age group and voting choice.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'cs-kc-1', type: 'multiple-choice',
      question: 'What does a significant chi-square test tell you?',
      options: [
        { id: 'a', text: 'The means of two groups differ significantly', isCorrect: false, explanation: 'Chi-square tests categorical association, not means. Use t-tests for means.' },
        { id: 'b', text: 'There is a statistically significant association between two categorical variables', isCorrect: true, explanation: 'Correct! Chi-square tests whether observed counts deviate significantly from what independence would predict.' },
        { id: 'c', text: 'One variable causes the other', isCorrect: false, explanation: 'Chi-square is a test of association, not causation.' },
        { id: 'd', text: 'The variables are normally distributed', isCorrect: false, explanation: 'Chi-square is for categorical data — normality is not relevant.' },
      ],
      explanation: 'Chi-square: significant result → association between the categorical variables. Does not imply causation.',
      hint: 'What type of data does chi-square work with?',
    },
    {
      id: 'cs-kc-2', type: 'numerical',
      question: 'A 2×3 table has df = ?',
      answer: 2,
      tolerance: 0,
      explanation: 'df = (rows−1)(cols−1) = (2−1)(3−1) = 1×2 = 2.',
      hint: 'df = (r−1)(c−1).',
    },
    {
      id: 'cs-kc-3', type: 'multiple-choice',
      question: 'A 2×2 table has row totals 40 and 60, column totals 50 and 50. What is E for the top-left cell?',
      options: [
        { id: 'a', text: '20', isCorrect: true, explanation: 'E = (40×50)/100 = 20. Row total × col total ÷ grand total.' },
        { id: 'b', text: '25', isCorrect: false, explanation: 'E = (row total × col total)/N = (40×50)/100 = 20, not 25.' },
        { id: 'c', text: '40', isCorrect: false, explanation: '40 is the row total, not the expected frequency.' },
        { id: 'd', text: '50', isCorrect: false, explanation: '50 is the column total, not the expected frequency.' },
      ],
      explanation: 'E = (row total × col total) / N = (40 × 50) / 100 = 20.',
      hint: 'E = (row total × col total) / grand total.',
    },
    {
      id: 'cs-kc-4', type: 'multiple-choice',
      question: 'Which condition should trigger using Fisher\'s exact test instead of chi-square?',
      options: [
        { id: 'a', text: 'When n > 100', isCorrect: false, explanation: 'Large samples are fine for chi-square.' },
        { id: 'b', text: 'When expected cell counts are less than 5', isCorrect: true, explanation: 'Correct! Small expected counts violate the chi-square approximation. Fisher\'s exact test handles this.' },
        { id: 'c', text: 'When the variables are ordinal', isCorrect: false, explanation: 'Ordinal variables can still use chi-square — though rank-based tests may be preferred.' },
        { id: 'd', text: 'When df > 1', isCorrect: false, explanation: 'df > 1 (larger tables) is fine for chi-square — the issue is small expected counts, not df.' },
      ],
      explanation: 'Rule of thumb: if expected cell counts are < 5, the chi-square approximation is unreliable — use Fisher\'s exact test (Cochran\'s more lenient rule tolerates up to 20% of cells below 5, but none below 1).',
      hint: 'Chi-square is an approximation — it breaks down in small samples.',
    },
    {
      id: 'cs-kc-5', type: 'multiple-choice',
      question: 'χ² = 0.05, df = 1. What can you conclude?',
      options: [
        { id: 'a', text: 'Reject H₀ — the variables are strongly associated', isCorrect: false, explanation: 'χ² = 0.05 is tiny. The critical value at α=0.05, df=1 is 3.841.' },
        { id: 'b', text: 'Fail to reject H₀ — the observed counts are very close to expected', isCorrect: true, explanation: 'Correct! A tiny χ² means O ≈ E — no evidence against independence.' },
        { id: 'c', text: 'The test is invalid because χ² must be > 1', isCorrect: false, explanation: 'χ² can be any non-negative value. There is no minimum.' },
        { id: 'd', text: 'The sample size is too small', isCorrect: false, explanation: 'A small χ² tells us about closeness of O and E, not about sample size.' },
      ],
      explanation: 'χ²* at df=1, α=0.05 is 3.841. χ² = 0.05 << 3.841 → fail to reject H₀.',
      hint: 'Compare χ² to the critical value. At df=1, α=0.05: χ²* ≈ 3.84.',
    },
  ],
  keyTakeaway:
    'χ² = Σ(O−E)²/E. df = (rows−1)(cols−1). Use for two categorical variables. Expected counts should be ≥ 5 in each cell (rule of thumb). A significant result means association, not causation.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">The "Surprise Score" Mnemonic</p>
      <p className="text-sm text-violet-800">
        χ² measures how <strong>surprised</strong> you should be by the data if the variables
        were independent. Each cell contributes <code>(O−E)²/E</code> — "how far off was this
        cell, relative to what was expected?"
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <div className="font-bold text-blue-800 mb-1">χ² ≈ 0</div>
          <div className="text-blue-700">O ≈ E everywhere → no surprise → independence plausible</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <div className="font-bold text-red-800 mb-1">χ² large</div>
          <div className="text-red-700">O far from E → big surprise → association likely</div>
        </div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-xs text-violet-800">
        <strong>Quick recipe:</strong> (1) Build O table → (2) Calculate E = row×col/N → (3) Sum (O−E)²/E → (4) Compare to χ²* with df = (r−1)(c−1).
      </div>
    </div>
  ),
  visualization: <ChiSquareViz />,
  datasetGenerator: false,
}

export default function ChiSquareTest({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
