# Statistics Learning Lab — Implementation Plan

## Top-Level Overview

**Goal:** Build a single-page React + Vite web application called "Statistics Learning Lab" that teaches beginners statistics through plain-language explanations, formulas, randomly generated datasets, step-by-step worked examples, visualizations, practice problems, and quizzes.

**Stack:**
- React 18 + Vite (SPA)
- Tailwind CSS (styling)
- Chart.js + react-chartjs-2 (visualizations)
- No backend — all logic runs client-side

**Phases:** The plan covers all three phases of content but implementation begins with Phase 1. The architecture must be modular enough that Phase 2 and Phase 3 topics are added by dropping new topic modules in without restructuring the app shell.

**Scope of Phase 1 (this implementation run):**
- Full app shell, navigation, routing, and design system
- Random dataset generator (shared, reusable component)
- Step-by-step calculation engine (shared utility)
- Phase 1 topic pages: Mean/Median/Mode, IQR, Standard Deviation, Basic Probability, Z-score
- Plus all Foundations topics (navigation placeholders that show full content): Levels of Measurement, Population and Sample, Variables and Observations, Frequency Tables, Data Distributions, Skewness and Outliers
- Shared topic page layout component used by all topics
- Chart components: histogram, box plot, z-score number line, bar chart, bell curve
- Statistics utility library (validated against fixed datasets)
- Session-based progress tracking

---

## Architecture Overview

```
src/
  main.jsx                  — Vite entry point
  App.jsx                   — Root: nav + topic router
  data/
    topics.js               — Topic registry (all 46 topics, phases tagged)
    scenarios.js            — Practice scenario library
  utils/
    stats.js                — All statistical calculation functions
    dataGenerator.js        — Random dataset generator logic
    formatting.js           — Rounding, number display helpers
  hooks/
    useProgress.js          — Session progress state
    useDataset.js           — Dataset state + controls
  components/
    layout/
      Sidebar.jsx           — Left navigation grouped by stage
      TopicPage.jsx         — Standard topic page layout (all 15 sections)
      SectionCard.jsx       — Reusable card wrapper for each section
    shared/
      DatasetGenerator.jsx  — Full dataset generator panel
      StepCalculation.jsx   — Expandable step-by-step calculator
      FormulaCard.jsx       — Formula display with symbol guide
      PracticeProblems.jsx  — Easy / moderate / challenging problems
      KnowledgeCheck.jsx    — Multiple-choice + calculation quiz
      ScenarioCard.jsx      — Single scenario display
    charts/
      HistogramChart.jsx
      BoxPlotChart.jsx
      ZScoreChart.jsx
      BellCurveChart.jsx
      BarChart.jsx
    topics/
      foundations/
        LevelsOfMeasurement.jsx
        PopulationAndSample.jsx
        VariablesAndObservations.jsx
        FrequencyTables.jsx
        DataDistributions.jsx
        SkewnessAndOutliers.jsx
      descriptive/
        MeanMedianMode.jsx
        Range.jsx
        QuartilesAndPercentiles.jsx
        InterquartileRange.jsx
        Variance.jsx
        StandardDeviation.jsx
        ZScore.jsx
        BoxPlot.jsx
        Histogram.jsx
      probability/
        BasicProbability.jsx
        ComplementRule.jsx
        AdditionRule.jsx
        MultiplicationRule.jsx
        IndependentDependentEvents.jsx
        ConditionalProbability.jsx
        BinomialDistribution.jsx
        NormalDistribution.jsx
      sampling/           — Phase 2
      inferential/        — Phase 2
      relationships/      — Phase 3
```

---

## Sub-Task 1 — Project Scaffolding and Design System

**Status:** [ ] pending

**Intent:** Create the Vite + React project, install all dependencies, configure Tailwind, and establish the global design tokens and base component styles. This is the foundation every other sub-task builds on.

**Expected Outcomes:**
- `npm run dev` starts without errors
- Tailwind works with the correct color palette
- A blank app shell renders with the correct font and background

**Todo List:**
1. Scaffold project: `npm create vite@latest statistics-learning-lab -- --template react`
2. Install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `chart.js`, `react-chartjs-2`
3. Configure `tailwind.config.js` with custom color palette: primary blue `#2563EB`, teal accent `#0D9488`, light background `#F8FAFC`, card white `#FFFFFF`, text dark `#1E293B`
4. Set up `index.css` with Tailwind base directives and global typography (Inter or system font stack, 16px base, 1.6 line-height)
5. Create `src/App.jsx` shell with sidebar + main content area layout (CSS Grid: `260px 1fr`)
6. Create placeholder `src/data/topics.js` registry with all 46 topic stubs (id, title, group, phase, component path, status placeholder)
7. Verify `npm run dev` renders without errors

**Relevant Context:** No existing files. Start from scratch.

---

## Sub-Task 2 — Statistics Utility Library

**Status:** [ ] pending

**Intent:** Build `src/utils/stats.js` — the single source of truth for all statistical calculations. All topic components call these functions; they never re-implement math inline. The file must be validated against fixed test datasets before any topic page uses it.

**Expected Outcomes:**
- Every function returns the correct value for the fixed test datasets listed below
- Population vs. sample formulas are clearly separated
- All functions handle edge cases (empty array, single value, all same values)

**Todo List:**
1. Implement `mean(arr)` — sum / n, uses all observations
2. Implement `sortAsc(arr)` — returns new sorted array, does not mutate
3. Implement `median(arr)` — sorts first, handles even and odd n
4. Implement `mode(arr)` — returns array (no mode = `[]`, one mode = `[x]`, multi = `[x,y,...]`)
5. Implement `range(arr)` — max minus min
6. Implement `q1(arr)` and `q3(arr)` — use the **inclusive quartile method** (same as Excel QUARTILE.INC / most textbooks): sort the array, then use linear interpolation at the 25th and 75th percentile positions. Document this method choice in a comment and in the UI note.
7. Implement `iqr(arr)` — Q3 minus Q1
8. Implement `varianceSample(arr)` — uses n−1 (Bessel's correction)
9. Implement `variancePopulation(arr)` — uses N
10. Implement `stdDevSample(arr)` — sqrt of sample variance
11. Implement `stdDevPopulation(arr)` — sqrt of population variance
12. Implement `zScore(x, mean, sd)` — (x − mean) / sd, preserves sign
13. Implement `outlierFences(arr)` — lower = Q1 − 1.5×IQR, upper = Q3 + 1.5×IQR
14. Implement `identifyOutliers(arr)` — returns values outside fences
15. Implement `descriptiveStats(arr)` — returns all of the above in one object (count, sum, mean, median, mode, min, max, range, q1, q3, iqr, varianceSample, stdDevSample, outlierFences, outliers)
16. Implement `normalPDF(x, mean, sd)` and `normalCDF(x, mean, sd)` (use numerical approximation — Horner's method or Abramowitz & Stegun) for bell curve and z-score shading
17. Implement `binomialPMF(k, n, p)` and `binomialCDF(k, n, p)` for the binomial distribution topic
18. Validate all functions against these fixed datasets:
    - Dataset A: `[5, 7, 7, 9, 12]` → mean=8, median=7, mode=[7], q1=6, q3=10.5, iqr=4.5, varSample=6.5, stdDevSample≈2.55
    - Dataset B: `[2, 4, 4, 4, 5, 5, 7, 9]` → mean=5, median=4.5, mode=[4], q1=4, q3=6, iqr=2
    - Dataset C: `[10, 20, 30, 40, 50]` → mean=30, median=30, mode=[], q1=15, q3=45, iqr=30

**Relevant Context:** `src/utils/stats.js` is new. The quartile method note must also appear in the UI (see Sub-Task 5).

---

## Sub-Task 3 — Random Dataset Generator

**Status:** [ ] pending

**Intent:** Build the reusable `DatasetGenerator` component and its underlying `src/utils/dataGenerator.js` logic. This panel appears inside every relevant topic tab and drives all live calculations and chart updates.

**Expected Outcomes:**
- User can configure and generate datasets with all specified options
- All controls (sort, add, remove, clear, copy, download CSV) work correctly
- Dataset state is lifted to the parent topic via a callback or shared hook
- `useDataset` hook encapsulates all dataset state and operations

**Todo List:**
1. Create `src/utils/dataGenerator.js` with functions for each distribution:
   - `generateUniform(n, min, max, decimals)` — uniform random in range
   - `generateNormal(n, mean, sd, decimals)` — Box-Muller transform
   - `generatePositivelySkewed(n, min, max, decimals)` — chi-squared approximation or log-normal
   - `generateNegativelySkewed(n, min, max, decimals)` — reflected positive skew
   - `generateBinomial(n, trials, p, decimals)` — sum of Bernoulli trials
   - All generators optionally inject outliers (add 1–3 values at 3–4 × IQR outside fences)
   - All generators respect `allowNegative` flag
2. Create `src/hooks/useDataset.js` — state: `data[]`, `config{}`, `isSorted`; actions: generate, generateNew, sort, addValue, removeValue, clear, copy, downloadCSV
3. Create `src/components/shared/DatasetGenerator.jsx`:
   - Controls panel: n, min, max, decimal places, distribution dropdown, include outliers checkbox, allow negatives checkbox
   - Buttons: Generate Data, Generate New Dataset, Sort Data, Add a Value, Remove a Value, Clear Data, Copy Data, Download CSV, Use Custom Data
   - Dataset display: chips or comma-separated list with index numbers, scrollable if large
   - Auto-triggers `onDataChange` callback whenever data changes
4. `downloadCSV` creates a Blob and triggers download via a hidden anchor element (supported in all modern browsers)
5. "Use Custom Data" opens a textarea where the user pastes comma-separated values; validates that all entries are numbers before accepting

**Relevant Context:** `useDataset` hook is used by every descriptive statistics topic component via props or context.

---

## Sub-Task 4 — App Shell, Sidebar Navigation, and Topic Router

**Status:** [ ] pending

**Intent:** Build the full navigation system, topic registry, and routing logic so every topic has a reachable URL and the sidebar correctly groups and highlights the active topic.

**Expected Outcomes:**
- Sidebar shows all 46 topics grouped into 6 stages
- Phase 2 and Phase 3 topics show a "Coming Soon" badge and are non-navigable
- Active topic is highlighted
- Search field filters the topic list in real time
- Progress badge (Not Started / Learning / Practicing / Completed) appears next to each topic
- Session progress persists across topic navigation within the session

**Todo List:**
1. Install `react-router-dom` v6 for client-side routing
2. Complete `src/data/topics.js` — each entry: `{ id, slug, title, group, groupOrder, phase, component }`. Groups: Foundations, Descriptive Statistics, Probability, Sampling, Inferential Statistics, Relationships and Prediction
3. Create `src/hooks/useProgress.js` — stores progress map in `sessionStorage` keyed by topic id; values: `'not-started' | 'learning' | 'practicing' | 'completed'`
4. Create `src/components/layout/Sidebar.jsx`:
   - Group headers with collapse/expand
   - Topic links with progress badge (color-coded dot)
   - Phase 2/3 topics: muted color + "Soon" pill, `pointer-events: none`
   - Search input at top — filters by title, case-insensitive
5. Create `src/components/layout/TopicRouter.jsx` — maps slug to component, renders `<ComingSoon />` for Phase 2/3, renders `<TopicPage />` wrapper around Phase 1 components
6. Create `src/components/layout/ComingSoon.jsx` — placeholder card listing what will be in that topic with a "Notify me when available" (no-op in Phase 1) button
7. Wire `<App>` to use `<BrowserRouter>` + `<Routes>` with `/:topicSlug` pattern
8. Default route → first Phase 1 topic (Mean, Median, and Mode)

**Relevant Context:** `src/data/topics.js` scaffolded in Sub-Task 1. React Router v6 `useParams` used in `TopicRouter`.

---

## Sub-Task 5 — Shared Topic Page Layout and Section Components

**Status:** [ ] pending

**Intent:** Build `TopicPage.jsx` — the standard 15-section layout that every topic uses. This is the most reused component in the app. Topics pass their content as structured props or a content object; the layout handles rendering, scroll-spy, section anchors, and progress state.

**Expected Outcomes:**
- All 15 sections render in the correct order with consistent styling
- `FormulaCard`, `StepCalculation`, `PracticeProblems`, and `KnowledgeCheck` are standalone components used inside topic pages
- Quartile method note appears in the IQR and Quartiles topic sections

**Todo List:**
1. Create `src/components/layout/TopicPage.jsx`:
   - Accepts `topicId`, `content` object (see below), and `dataset` (optional)
   - Renders sections: Title, Learning Objective, Plain-Language Explanation, Simple Analogy, Formula, Formula Guide, When to Use, When Not to Use, Assumptions, Worked Example, Interpretation, Common Mistakes, Practice Problems, Knowledge Check, Key Takeaway
   - Each section is a `<SectionCard>` with anchor id for scroll navigation
   - Right-side mini table of contents (sticky, desktop only) for jumping between sections
   - Marks topic as `'learning'` in progress when first visited; marks as `'practicing'` when Practice Problems section is scrolled into view
2. Create `src/components/layout/SectionCard.jsx` — white rounded card, section title in teal, collapsible on mobile
3. Create `src/components/shared/FormulaCard.jsx`:
   - Displays formula in a styled code/math block (use Unicode math symbols or KaTeX-lite approach with styled spans)
   - Below formula: table of symbol | meaning | notes
   - Sample vs. population toggle where applicable (e.g., variance shows both formulas)
4. Create `src/components/shared/StepCalculation.jsx`:
   - Collapsed by default; "Show Calculation" button expands
   - Accepts `steps[]` array: each step has `label`, `expression`, `result`, `explanation`
   - Final step always shows the answer in a highlighted box
   - Below answer: plain-language interpretation paragraph
   - "Hide Calculation" button collapses it again
5. Create `src/components/shared/PracticeProblems.jsx`:
   - Three difficulty tabs: Easy, Moderate, Challenging
   - Each problem: scenario text, question, hint (revealed on button click), solution (revealed on button click), step-by-step explanation
   - "Try Another Problem" button cycles to next problem in that difficulty tier
6. Create `src/components/shared/KnowledgeCheck.jsx`:
   - Mix of multiple-choice and numerical-answer questions
   - Multiple-choice: immediate feedback, explains why correct answer is right and why each wrong answer is wrong
   - Numerical: accepts answer within configurable tolerance (default ±0.05 or ±1 last decimal place); never penalizes reasonable rounding
   - Shows score at end; "Retry Incorrect" button
7. Add quartile method note component `<QuartileMethodNote />` — small info card that reads: "This application uses the **inclusive quartile method** (equivalent to Excel's QUARTILE.INC and most introductory textbooks). Other software may use different methods, so quartile values may differ slightly."

**Relevant Context:** Every Phase 1 topic component in Sub-Tasks 6–10 uses `TopicPage` and these shared components.

---

## Sub-Task 6 — Foundations Topics (6 topic pages)

**Status:** [ ] pending

**Intent:** Build all six Foundations topic pages. These topics are conceptual (no heavy computation) so they focus on explanation, analogy, worked example with a table or small dataset, and knowledge check. The dataset generator is used in Frequency Tables and Data Distributions.

**Topics:** Levels of Measurement, Population and Sample, Variables and Observations, Frequency Tables, Data Distributions, Skewness and Outliers

**Expected Outcomes:**
- All 6 topic pages render all 15 sections with accurate content
- Frequency Tables topic auto-generates a frequency table from the dataset generator output
- Data Distributions and Skewness topics include a histogram visualization that updates with the dataset
- All worked examples use the specified realistic scenarios

**Todo List:**
1. `LevelsOfMeasurement.jsx` — covers Nominal, Ordinal, Interval, Ratio with a comparison table; scenarios: hospital department names (nominal), patient satisfaction rating 1–5 (ordinal), temperature in Celsius (interval), salary in dollars (ratio)
2. `PopulationAndSample.jsx` — use hospital staffing scenario; explain census vs. sample; worked example: all 500 nurses in a hospital system (population) vs. 50 randomly selected nurses (sample)
3. `VariablesAndObservations.jsx` — use employee survey scenario; distinguish quantitative (continuous, discrete) from qualitative; rows = observations, columns = variables
4. `FrequencyTables.jsx` — integrate DatasetGenerator; build frequency table (value/count/relative frequency/cumulative frequency) from generated data; bar chart visualization
5. `DataDistributions.jsx` — integrate DatasetGenerator with distribution selector; histogram visualization updates with distribution choice; explain shape vocabulary (symmetric, bell-shaped, skewed, uniform, bimodal)
6. `SkewnessAndOutliers.jsx` — integrate DatasetGenerator; histogram with skew annotation; explain 1.5×IQR outlier rule; show outlier fences; use salary data scenario

**Relevant Context:** Uses `HistogramChart`, `BarChart`, `DatasetGenerator`, `useDataset`, `stats.js` (descriptiveStats, identifyOutliers).

---

## Sub-Task 7 — Descriptive Statistics Topics (Phase 1 subset)

**Status:** [ ] pending

**Intent:** Build the core Phase 1 descriptive statistics topic pages. These are the most calculation-heavy pages in Phase 1 and make full use of the dataset generator, step-by-step calculator, and chart components.

**Phase 1 topics in this group:** Mean/Median/Mode, IQR (which covers Quartiles), Standard Deviation, Range, Variance, Z-score, Box Plot, Histogram

**Expected Outcomes:**
- Dataset generator is fully integrated; all statistics update live as dataset changes
- Step-by-step calculation shows every intermediate step for the current dataset
- Charts update reactively to dataset changes
- Sample vs. population distinction is explicit on Variance and Standard Deviation pages
- Quartile method note appears on IQR and Quartiles pages
- Z-score number line renders correctly for any valid input

**Todo List:**
1. `MeanMedianMode.jsx`:
   - Full 15-section layout
   - Dataset generator integrated
   - Stats panel: count, sum, mean, median, mode (handles multi-mode and no-mode)
   - Step-by-step: mean (add all → count → divide), median (sort → find middle), mode (count frequencies → find max)
   - Visualization: dot plot or bar chart of value frequencies with mean/median marked
   - Scenario: patient waiting times in minutes
   - Worked example fixed dataset: `[5, 7, 7, 9, 12]` (validates against stats.js test values)
   - Common mistakes: not sorting for median, forgetting to include repeated values in mean, assuming mean = median

2. `RangeTopic.jsx` (filename avoids JS reserved word conflict):
   - Simple page; range = max − min
   - Scenario: range of daily patient admissions
   - Warn: range is sensitive to outliers

3. `QuartilesAndPercentiles.jsx`:
   - Explain quartile positions (Q1=25th pct, Q2=50th pct, Q3=75th pct)
   - Include `<QuartileMethodNote />`
   - Scenario: employee performance scores
   - Visualization: sorted dot plot with Q1, Q2, Q3 markers

4. `InterquartileRange.jsx`:
   - IQR = Q3 − Q1; outlier fences
   - `<QuartileMethodNote />`
   - Dataset generator; show fences and flag outliers
   - Scenario: processing times for insurance claims

5. `VarianceTopic.jsx`:
   - Side-by-side sample (n−1) and population (N) formulas
   - FormulaCard with toggle
   - Step-by-step: subtract mean → square differences → sum → divide
   - Scenario: variance in call-center handling times

6. `StandardDeviation.jsx`:
   - Sample vs. population; explain as "average distance from the mean"
   - Step-by-step shows full variance calculation then sqrt
   - Visualization: number line showing mean ± 1 SD, ± 2 SD bands
   - Scenario: salary spread among employees

7. `ZScoreTopic.jsx`:
   - Formula: z = (x − μ) / σ
   - Input: enter any x value; calculate z using dataset's mean and SD
   - `ZScoreChart.jsx`: number line, mark mean at 0, mark x position, shade ±1/±2/±3 SD regions, label "below average / near average / above average"
   - Direction rule: negative z = below mean, positive z = above mean (explicitly stated)
   - Scenario: identifying an unusually high processing time
   - Common mistakes: forgetting sign, using population SD for sample data

8. `BoxPlotTopic.jsx`:
   - Show construction: min, Q1, median, Q3, max, whiskers, outlier dots
   - `BoxPlotChart.jsx`: custom Chart.js implementation
   - `<QuartileMethodNote />`
   - Scenario: comparing waiting times across two hospital departments (two box plots side by side)

9. `HistogramTopic.jsx`:
   - Explain bins/class intervals; explain choosing bin width
   - `HistogramChart.jsx` with adjustable bin count slider (5–20 bins)
   - Scenario: distribution of daily admissions counts

**Relevant Context:** All topics use `TopicPage`, `DatasetGenerator`, `useDataset`, `StepCalculation`, `FormulaCard`, `stats.js`.

---

## Sub-Task 8 — Chart Components

**Status:** [ ] pending

**Intent:** Build all five reusable Chart.js chart components needed for Phase 1. Charts must be responsive, accessible (ARIA labels), and update reactively when data props change.

**Expected Outcomes:**
- Each chart renders correctly for any valid input array
- Charts are responsive (fill container width)
- Axes are labeled; grid lines are subtle; colors match the app palette

**Todo List:**
1. `HistogramChart.jsx` — accepts `data[]` and `bins` count; computes bin edges and frequencies internally; blue bars; x-axis = value ranges; y-axis = frequency; vertical mean line in teal
2. `BoxPlotChart.jsx` — custom Chart.js plugin (use `chartjs-chart-box-and-violin-plot` or draw manually on canvas with `afterDatasetDraw`); shows min, Q1, median, Q3, max as box+whiskers; outliers as dots
3. `ZScoreChart.jsx` — horizontal number line from −4 to +4 SD; shaded regions: ±1 SD (light blue), ±2 SD (lighter), ±3 SD (lightest); vertical line at z=0 (mean); moveable marker at user's z-value; label shows z value and verbal interpretation
4. `BellCurveChart.jsx` — standard normal PDF plotted as a smooth line; shaded area under curve for p-value or probability region; used in Normal Distribution topic (Phase 1 stub) and Z-score
5. `BarChart.jsx` — generic categorical bar chart; used in Frequency Tables and Levels of Measurement; accepts `labels[]` and `values[]`

**Relevant Context:** All charts use `react-chartjs-2`. Register only the Chart.js components actually used (tree-shaking). Use `Chart.register(...)` in each chart file.

---

## Sub-Task 9 — Probability Topics (Phase 1 subset)

**Status:** [ ] pending

**Intent:** Build the Basic Probability topic page and stub pages for the remaining probability topics. Basic Probability is the only one fully built in Phase 1; the others get full-content stubs with Coming Soon badges.

**Phase 1 full build:** Basic Probability
**Phase 1 stubs (full layout, partial content):** Complement Rule, Addition Rule, Multiplication Rule, Independent/Dependent Events, Conditional Probability, Binomial Distribution, Normal Distribution

**Expected Outcomes:**
- Basic Probability page covers all 15 sections with coin/dice/card scenarios
- Probability visualizations: bar chart of outcomes, simple fraction display
- Stubs display the learning objective and plain-language explanation but show a "More content coming in Phase 2" notice

**Todo List:**
1. `BasicProbability.jsx` — full 15-section page:
   - P(Event) = favorable outcomes / total outcomes
   - Scenarios: coin toss (P(heads) = 1/2), dice (P(rolling a 3) = 1/6), cards (P(drawing an ace) = 4/52), hospital scenario (P(patient waits > 30 min) = x/n from dataset)
   - Visualization: `BarChart` showing outcome counts
   - Step-by-step: count favorable → count total → divide → convert to decimal and percentage
   - Common mistakes: forgetting that probabilities must sum to 1, confusing relative frequency with theoretical probability
2. `ComplementRule.jsx` — stub: P(not A) = 1 − P(A); scenario: probability a claim is NOT processed on time
3. `AdditionRule.jsx` — stub: P(A or B) with mutually exclusive and non-exclusive cases
4. `MultiplicationRule.jsx` — stub: P(A and B); independent vs. dependent
5. `IndependentDependentEvents.jsx` — stub
6. `ConditionalProbability.jsx` — stub: P(A|B)
7. `BinomialDistribution.jsx` — stub with formula display; `BellCurveChart` placeholder
8. `NormalDistribution.jsx` — stub with bell curve visualization using `BellCurveChart`; 68-95-99.7 rule

**Relevant Context:** `stats.js` has `binomialPMF`, `normalPDF`, `normalCDF` from Sub-Task 2.

---

## Sub-Task 10 — Progress Tracking and Session State

**Status:** [ ] pending

**Intent:** Implement session-based progress tracking visible in the sidebar and on a Progress Dashboard page. Progress is stored in `sessionStorage` only (no backend) and resets on page reload.

**Expected Outcomes:**
- Each topic shows a colored progress dot in the sidebar
- A `/progress` route shows the dashboard
- Dashboard shows: topics completed count, topics by stage, quiz accuracy (if any quizzes taken), practice questions attempted
- Progress updates automatically as users navigate and interact

**Todo List:**
1. `src/hooks/useProgress.js` — `useReducer`-based hook; persists to `sessionStorage`; actions: `SET_STATUS`, `RECORD_QUIZ_ATTEMPT`, `RECORD_PRACTICE_ATTEMPT`; status values: `not-started`, `learning`, `practicing`, `completed`
2. Wrap app in `ProgressContext` provider so all topic components can update progress without prop drilling
3. Auto-advance to `learning` when a topic is first navigated to
4. Auto-advance to `practicing` when the Practice Problems section is scrolled into view (use `IntersectionObserver`)
5. Mark `completed` when the Knowledge Check is submitted with a passing score (≥70%)
6. Create `src/components/layout/ProgressDashboard.jsx`:
   - Summary cards: "Topics Completed", "Topics In Progress", "Practice Questions Attempted", "Quiz Accuracy"
   - Per-stage progress bars showing completed / total topics
   - Topic list table with status badges
   - Note: "Progress resets when you close or refresh the browser. Sign-in and saved progress will be added in a future version."
7. Add `/progress` route to the router; add "My Progress" link at bottom of sidebar

**Relevant Context:** `useProgress` and `ProgressContext` used by `TopicPage`, `KnowledgeCheck`, `PracticeProblems`, and `Sidebar`.

---

## Sub-Task 11 — Phase 2 and Phase 3 Stub Pages

**Status:** [ ] pending

**Intent:** Register all remaining topics in the router so they have reachable URLs, but render a rich "Coming Soon" placeholder that describes what the topic will cover and shows its position in the learning path.

**Expected Outcomes:**
- All 46 topics are reachable via the sidebar
- Phase 2/3 topics show a detailed Coming Soon card
- The sidebar correctly marks Phase 2/3 topics with "Phase 2" or "Phase 3" badges

**Todo List:**
1. Create a `ComingSoon.jsx` component that accepts `topic` object from the registry and renders:
   - Topic title and learning stage
   - "This topic is coming in Phase [2/3]" notice
   - What the topic will cover (pulled from a `preview` field added to `topics.js`)
   - Prerequisites (links to Phase 1 topics that should be completed first)
   - "Mark as Interested" button (no-op in Phase 1, stores interest in sessionStorage for future use)
2. Add `preview` and `prerequisites` fields to all Phase 2 and Phase 3 entries in `topics.js`
3. Register Phase 2 topics: Sampling Distribution, Standard Error, Central Limit Theorem, Point Estimates, Confidence Intervals, Hypothesis Testing, Null and Alternative Hypotheses, One/Two-tailed Tests, Significance Level, Critical Values, P-values, Type I and II Errors, Z-test, One-sample T-test, Independent-samples T-test, Paired-samples T-test
4. Register Phase 3 topics: Covariance, Correlation, Simple Linear Regression, Correlation vs. Causation, Chi-square Test, ANOVA
5. Ensure sidebar grouping is correct for all 46 topics

---

## Sub-Task 12 — Validation, Polish, and Accessibility

**Status:** [ ] pending

**Intent:** Final pass to validate all calculations against fixed datasets, fix any rendering issues, add accessibility attributes, and ensure the app is usable on mobile.

**Expected Outcomes:**
- All Phase 1 statistics results match the fixed test dataset values from Sub-Task 2
- App passes basic ARIA/accessibility checks (labels, contrast, keyboard navigation)
- Mobile layout (320px–768px) is usable: sidebar collapses to a hamburger menu
- No console errors in production build

**Todo List:**
1. Validate rendered output for all fixed test datasets (Dataset A, B, C from Sub-Task 2) by navigating to each topic and checking displayed values
2. Add `aria-label` to all buttons, chart canvases, and interactive controls
3. Implement collapsible sidebar for mobile: hamburger icon toggles sidebar overlay; topic selection closes it
4. Test responsive layout at 320px, 768px, 1024px, 1440px
5. Add `<meta name="viewport">` and ensure no horizontal scroll on mobile
6. Run `npm run build` and fix any build errors
7. Verify CSV download works in Chrome and Safari
8. Check that "Use Custom Data" textarea correctly rejects non-numeric input with a user-visible error message
9. Verify Knowledge Check numerical tolerance works: entering `7.99` when answer is `8.00` with tolerance `0.05` is accepted
10. Final content review: every formula symbol in every Phase 1 topic is defined in the Formula Guide section

---

## Fixed Validation Datasets (Reference)

These datasets are used to validate calculation accuracy and must be checked at the end of every relevant sub-task:

| Dataset | Values | Mean | Median | Mode | Q1 | Q3 | IQR | Var (sample) | SD (sample) |
|---------|--------|------|--------|------|----|----|-----|-------------|------------|
| A | 5, 7, 7, 9, 12 | 8.0 | 7.0 | [7] | 6.0 | 10.5 | 4.5 | 6.5 | 2.55 |
| B | 2, 4, 4, 4, 5, 5, 7, 9 | 5.0 | 4.5 | [4] | 4.0 | 6.0 | 2.0 | 3.43 | 1.85 |
| C | 10, 20, 30, 40, 50 | 30.0 | 30.0 | [] | 15.0 | 45.0 | 30.0 | 250.0 | 15.81 |

*Q1/Q3 use the inclusive quartile method (Excel QUARTILE.INC / textbook method). SD values rounded to 2 decimal places.*

---

## Design Tokens Reference

| Token | Value |
|-------|-------|
| Primary blue | `#2563EB` |
| Teal accent | `#0D9488` |
| Light background | `#F8FAFC` |
| Card white | `#FFFFFF` |
| Text dark | `#1E293B` |
| Text muted | `#64748B` |
| Success green | `#16A34A` |
| Warning amber | `#D97706` |
| Error red | `#DC2626` |
| Border light | `#E2E8F0` |

---

## Implementation Notes

- **No KaTeX dependency.** Formulas are rendered with styled HTML using Unicode math symbols (×, ÷, √, Σ, μ, σ, x̄). This avoids a heavy dependency for Phase 1. KaTeX can be added in Phase 2 if needed.
- **Chart.js version.** Use Chart.js 4.x with `react-chartjs-2` v5.x. Register only components used in each chart file to avoid bundle bloat.
- **Box plot chart.** The `chartjs-chart-box-and-violin-plot` plugin supports Chart.js 4. If there are compatibility issues, implement the box plot as a custom Canvas drawing using `afterDatasetDraw` on a scatter chart.
- **Rounding rule.** All displayed statistics are rounded to 2 decimal places unless otherwise specified. This rule is stated once in a global app note and once per topic that uses it.
- **sessionStorage vs. localStorage.** Use `sessionStorage` per the spec. Do not use `localStorage` without user consent.
- **React Router.** Use `HashRouter` instead of `BrowserRouter` if the app will be served as a static file without a server rewrite rule. Use `BrowserRouter` if served via Vite dev server or a configured web server.
