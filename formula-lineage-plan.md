# Formula Lineage — Visual Formula Transformation Plan

## Top-Level Overview

**Goal:** Make it visually clear to learners how statistical formulas *build on and transform from* each other.
Learners currently see each formula in isolation. This plan adds three complementary visual features so a learner can always answer "where did this formula come from?" and "what does it feed into?"

**Scope:** New shared components + a data file defining formula lineage + one new standalone page + a new `npm` dependency for the polished formula map layout. No existing topic page logic is restructured; all additions are additive. The `FormulaBuildUp` block is **open by default**.

**Approach:** Three features, each serving a different moment in the learning journey:
1. **Formula Ancestry Trail** — compact breadcrumb banner on each topic page showing the chain of formulas that led to this one.
2. **Formula Build-Up Block** — open-by-default animated section showing each inherited formula part colour-highlighted, then substituted, one step at a time.
3. **Formula Map Page** — a dedicated `/formula-map` route using **React Flow** (`@xyflow/react`) for a polished, interactive auto-laid-out node graph.

Stack: React 19 + Tailwind 3 + React Router 6. New dependency: `@xyflow/react` (maintained, MIT licensed, no canvas — pure DOM).

---

## Formula Dependency Graph (reference)

```
Mean (x̄)
  └─→ Variance (s²)
        └─→ Standard Deviation (s)
              ├─→ Z-Score (z = (x−x̄)/s)
              │     └─→ Z-Test (z = (x̄−μ₀)/(σ/√n))
              └─→ Standard Error (SE = s/√n)
                    ├─→ One-Sample T-Test (t = (x̄−μ₀)/SE)
                    │     ├─→ Paired T-Test (t = d̄/(sd/√n))
                    │     └─→ Independent T-Test (t = (x̄₁−x̄₂)/(sp×√(1/n₁+1/n₂)))
                    └─→ Confidence Interval (x̄ ± t*×SE)
```

---

## Sub-Tasks

---

### Sub-Task 1 — Install React Flow and Formula Lineage Data File

**Intent:** Add `@xyflow/react` as a dependency and create a single data file that defines which formula topics depend on which. This data drives all three features.

**Expected Outcomes:**
- `@xyflow/react` is listed in `package.json` dependencies and installed.
- A new file `src/data/formulaLineage.js` exists.
- It exports a `LINEAGE` array of node objects: `{ id, title, formula, slug, group, parents }`.
- It exports `getAncestors(topicId)` — returns the ordered chain of ancestor nodes from root to the given topic (not including the topic itself).
- It exports `getChildren(topicId)` — returns direct children of a topic.
- Covers all 10 formula-bearing Phase 1 topics: Mean, Variance, Std Dev, Z-Score, Standard Error, Z-Test, One-Sample T-Test, Paired T-Test, Independent T-Test, Confidence Intervals.

**Todo List:**
- [ ] Run `npm install @xyflow/react` inside `statistics-learning-lab/`
- [ ] Create `src/data/formulaLineage.js`
- [ ] Define `LINEAGE` array — each entry: `{ id, title, formula, slug, group, parents: [] }` using the dependency graph above
- [ ] Implement `getAncestors(id)` — walks parent chain recursively, returns ordered array root-first (deduped)
- [ ] Implement `getChildren(id)` — filters `LINEAGE` for nodes whose `parents` array includes `id`
- [ ] Export all three: `LINEAGE`, `getAncestors`, `getChildren`

**Relevant Context:**
- Topic ids and slugs: `src/data/topics.js`
- Key topic ids (verified against `topics.js`): `mean-median-mode`, `variance`, `standard-deviation`, `z-score`, `standard-error`, `z-test`, `one-sample-t-test`, `paired-samples-t-test`, `independent-samples-t-test`, `confidence-intervals`
- Groups: Descriptive (2), Sampling (4), Inferential (5)

**Status:** [ ] pending

---

### Sub-Task 2 — FormulaAncestryTrail Component

**Intent:** A compact breadcrumb-style banner that appears just above the formula card on any topic page with ancestors. Each ancestor is a clickable pill linking to that topic. The current topic is the highlighted non-linked terminal pill. Answers "where did this formula come from?"

**Expected Outcomes:**
- New component `src/components/shared/FormulaAncestryTrail.jsx`.
- Accepts a `topicId` prop.
- Renders nothing if the topic has no ancestors.
- Renders a horizontal scrollable row: `Built from: [Mean] → [Variance] → [Std Dev] → [Z-Score]` where bracketed items are pills; past topics link to their page; current topic is solid blue.
- Wraps gracefully on small screens (`flex-wrap`).
- No new dependencies — uses only Tailwind + `react-router-dom` Link.

**Todo List:**
- [ ] Create `src/components/shared/FormulaAncestryTrail.jsx`
- [ ] Import `getAncestors` from `src/data/formulaLineage.js` and `Link` from `react-router-dom`
- [ ] Accept `topicId` prop; call `getAncestors(topicId)` — return `null` if empty
- [ ] Render a `<div className="mb-4">` wrapper with label "Built from:" in `text-xs font-semibold text-textMuted uppercase tracking-wide mb-2`
- [ ] Render ancestor pills as `<Link to="/${ancestor.slug}">` styled as `text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors`
- [ ] Render `→` separators as `<span className="text-gray-400 text-xs">→</span>`
- [ ] Render current topic as `<span className="text-xs font-medium bg-blue-600 text-white px-2.5 py-1 rounded-full">` (non-link, terminal)
- [ ] Wrap pill row in `<div className="flex items-center flex-wrap gap-1.5">`
- [ ] Export the component

**Relevant Context:**
- Pill styling reference: `ZScore.jsx` lines 31-43
- Link pattern: `Sidebar.jsx` line 2 and line 190-197
- Route shape is `/${slug}` (HashRouter — confirmed in `App.jsx` line 2)

**Status:** [ ] pending

---

### Sub-Task 3 — FormulaBuildUp Component

**Intent:** An **open-by-default** block that shows step-by-step how the current formula is constructed from prior ones. Each step highlights the inherited part in a distinct colour, then shows the substitution. This is the core "formula transformation" visual.

**Expected Outcomes:**
- New component `src/components/shared/FormulaBuildUp.jsx`.
- Accepts `steps` prop: array of `{ label, from, to, highlightColor, note }` where:
  - `from` — the formula expression with the inherited part still as a symbol (e.g. `t = (x̄ − μ₀) / SE`)
  - `to` — the expanded expression (e.g. `t = (x̄ − μ₀) / (s / √n)`)
  - `highlightColor` — `'blue' | 'orange' | 'green' | 'purple'` for the inherited part's colour badge
  - `note` — plain-text explanation of what was substituted
- Accepts optional `title` prop (defaults to `"How this formula is built"`).
- Is **open by default** (no toggle — always visible). The block has a subtle left-border accent style to distinguish it from other sections.
- Each step renders as: coloured badge with inherited symbol name → arrow → expanded form → note in small gray text.
- Uses `MathFormula` for expression rendering.
- A final "Full formula" row shows the complete expanded formula.

**Todo List:**
- [ ] Create `src/components/shared/FormulaBuildUp.jsx`
- [ ] Accept `steps` (array, required) and `title` (string, optional) props
- [ ] Import `MathFormula` from `./MathFormula`
- [ ] Render a card with `bg-indigo-50 border border-indigo-200 rounded-lg p-4` wrapper
- [ ] Render title as `text-sm font-semibold text-indigo-800 mb-3` with a 🔗 or ⬡ icon prefix
- [ ] For each step render a row: left badge showing `highlightColor` (colour token map: blue=`bg-blue-100 text-blue-800`, orange=`bg-orange-100 text-orange-800`, green=`bg-green-100 text-green-800`, purple=`bg-purple-100 text-purple-800`) containing the inherited symbol name; then `<MathFormula expr={step.from} />`; then `→`; then `<MathFormula expr={step.to} />`; then `step.note` in `text-xs text-gray-500 mt-0.5`
- [ ] After all steps, render a "Full expansion:" row in `bg-white border border-indigo-100 rounded p-2` showing the final formula
- [ ] Export the component

**Relevant Context:**
- `MathFormula.jsx` at `src/components/shared/MathFormula.jsx` — import with `import MathFormula from './MathFormula'`
- Do NOT copy the collapse/expand pattern — this component is always open
- Colour tokens available in Tailwind: `bg-blue-100 text-blue-800`, `bg-orange-100 text-orange-800`, `bg-green-100 text-green-800`, `bg-purple-100 text-purple-800`

**Status:** [ ] pending

---

### Sub-Task 4 — Wire components into TopicPage and all affected topic files

**Intent:** Integrate `FormulaAncestryTrail` and `FormulaBuildUp` into `TopicPage.jsx` via a new `content` field (`formulaLineage`) so it renders automatically for any topic that provides it — then add `formulaLineage` data to all 8 affected topic files.

**Expected Outcomes:**
- `TopicPage.jsx` renders `<FormulaAncestryTrail>` and `<FormulaBuildUp>` just before the `<FormulaCard>` when `content.formulaLineage` is provided.
- All 8 topic files have a `formulaLineage` field added to their `content` object.
- The 8 affected topics: Standard Deviation, Z-Score, Standard Error, Z-Test, One-Sample T-Test, Paired T-Test, Independent T-Test, Confidence Intervals.

**TopicPage.jsx change:**
In the formula section (around line 184), before `<FormulaCard>`, add:
```jsx
{content.formulaLineage && (
  <>
    <FormulaAncestryTrail topicId={content.formulaLineage.topicId} />
    <FormulaBuildUp steps={content.formulaLineage.steps} title={content.formulaLineage.title} />
  </>
)}
```

**`formulaLineage` field shape per topic (build-up steps):**

| Topic | Ancestry | Build-Up Steps |
|-------|----------|----------------|
| Standard Deviation | Mean → Variance | Step 1: s² (Variance) → s = √s²; Final: s = √[Σ(x−x̄)²/(n−1)] |
| Z-Score | Mean → Variance → Std Dev | Step 1: s (Std Dev) substituted into denominator; Final: z = (x−x̄)/s |
| Standard Error | Mean → Variance → Std Dev | Step 1: s (Std Dev) → SE = s/√n; Final: SE = s/√n |
| Z-Test | Mean → Variance → Std Dev → SE | Step 1: SE (σ/√n) substituted into denominator; Final: z = (x̄−μ₀)/(σ/√n) |
| One-Sample T-Test | Mean → Variance → Std Dev → SE | Step 1: SE substituted into denominator; Final: t = (x̄−μ₀)/(s/√n) |
| Paired T-Test | Mean → Variance → Std Dev → SE → One-Sample T-Test | Step 1: One-sample T-Test structure; Step 2: differences substituted; Final: t = d̄/(sd/√n) |
| Independent T-Test | Mean → Variance → Std Dev | Step 1: Pooled SD (sp); Step 2: Combined SE; Final: t = (x̄₁−x̄₂)/(sp×√(1/n₁+1/n₂)) |
| Confidence Intervals | Mean → Variance → Std Dev → SE | Step 1: SE substituted; Final: x̄ ± t*×SE |

**Todo List:**
- [ ] In `TopicPage.jsx`: import `FormulaAncestryTrail` and `FormulaBuildUp`; add conditional render block just before `<FormulaCard>` using `content.formulaLineage`
- [ ] In `StandardDeviation.jsx`: add `formulaLineage: { topicId: 'standard-deviation', steps: [...] }` to `content`
- [ ] In `ZScore.jsx`: add `formulaLineage` to `content`
- [ ] In `StandardError.jsx`: add `formulaLineage` to `content`
- [ ] In `ZTest.jsx`: add `formulaLineage` to `content`
- [ ] In `OneSampleTTest.jsx`: add `formulaLineage` to `content`
- [ ] In `PairedSamplesTTest.jsx`: add `formulaLineage` to `content`
- [ ] In `IndependentSamplesTTest.jsx`: add `formulaLineage` to `content`
- [ ] In `ConfidenceIntervals.jsx`: add `formulaLineage` to `content`

**Relevant Context:**
- `TopicPage.jsx` formula section: the `<FormulaCard>` is inside a `<SectionCard id="formula">` — insert `formulaLineage` block inside that same SectionCard, before FormulaCard
- Formula section is at position #5 in the TopicPage render order (confirmed by subagent)
- Import paths from TopicPage: `import FormulaAncestryTrail from '../shared/FormulaAncestryTrail'` and `import FormulaBuildUp from '../shared/FormulaBuildUp'`
- All 8 topic files are in `src/components/topics/descriptive/`, `src/components/topics/sampling/`, and `src/components/topics/inferential/`

**Status:** [ ] pending

---

### Sub-Task 5 — Formula Map Page (React Flow)

**Intent:** A dedicated `/formula-map` route showing the full formula lineage as a polished interactive node graph. React Flow handles layout, pan/zoom, and edge routing automatically. Each node is colour-coded by topic group and navigates to the topic on click.

**Expected Outcomes:**
- New page component `src/components/layout/FormulaMap.jsx`.
- Uses `@xyflow/react` with a static node position layout (10 nodes — small enough to hand-position in a clean top-to-bottom flow).
- Nodes display the topic title on top and the short formula string below in monospace.
- Nodes are colour-coded by group: Descriptive = blue (`bg-blue-100 border-blue-400`), Sampling = teal (`bg-teal-100 border-teal-400`), Inferential = purple (`bg-purple-100 border-purple-400`).
- Edges are animated (React Flow `animated: true`) with arrows showing the direction of dependency.
- Clicking a node navigates to `/${slug}` using `useNavigate`.
- Page has a header explaining what the map shows.
- Route `/formula-map` is registered in `App.jsx`.
- Link added to Sidebar footer alongside "My Progress".
- React Flow CSS is imported: `import '@xyflow/react/dist/style.css'`.

**Node layout (hand-positioned, top-to-bottom, px units):**

| Node | Position |
|------|----------|
| Mean | x:300, y:0 |
| Variance | x:300, y:120 |
| Std Dev | x:300, y:240 |
| Z-Score | x:100, y:370 |
| Std Error | x:500, y:370 |
| Z-Test | x:100, y:490 |
| One-Sample T-Test | x:450, y:490 |
| CI | x:650, y:490 |
| Paired T-Test | x:350, y:610 |
| Indep T-Test | x:600, y:610 |

**Todo List:**
- [ ] Create `src/components/layout/FormulaMap.jsx`
- [ ] Import `ReactFlow`, `Background`, `Controls`, `MiniMap` from `@xyflow/react` and `import '@xyflow/react/dist/style.css'`
- [ ] Import `LINEAGE` from `src/data/formulaLineage.js` and `useNavigate` from `react-router-dom`
- [ ] Define a `NODE_POSITIONS` map (id → `{x, y}`) using the table above
- [ ] Build `initialNodes` array from `LINEAGE`: each node gets `id`, `position`, `data: { label: <custom JSX with title + formula> }`, `type: 'default'`, and a `style` object with background/border colour by group
- [ ] Build `initialEdges` array from `LINEAGE`: for each node with parents, create one edge per parent with `animated: true` and `markerEnd: { type: MarkerType.ArrowClosed }`
- [ ] Implement `onNodeClick` handler: `(_, node) => navigate('/' + node.data.slug)`
- [ ] Render `<ReactFlow>` inside a full-height container with `<Background>`, `<Controls>`, and `<MiniMap>`
- [ ] Add a page header above the flow: title "Formula Lineage Map" + subtitle "See how statistical formulas build on each other. Click any node to go to that topic."
- [ ] In `App.jsx`: add `import FormulaMap from './components/layout/FormulaMap'` and `<Route path="/formula-map" element={<FormulaMap />}>`
- [ ] In `Sidebar.jsx` footer: add a second link `<Link to="/formula-map">` with a network/graph icon, styled identically to the "My Progress" link

**Relevant Context:**
- Route registration: `App.jsx` line 39 — add new Route alongside existing `/progress` route
- Sidebar footer: `Sidebar.jsx` lines 217-233 — add the new link in that same footer block
- React Flow requires a parent container with explicit height — use `style={{ height: 'calc(100vh - 120px)' }}` or a full-flex container
- `@xyflow/react` CSS must be imported once; `FormulaMap.jsx` is the right place

**Status:** [ ] pending

---

## Implementation Order

```
Sub-Task 1 (install + data file)
  ├─→ Sub-Task 2 (FormulaAncestryTrail component)
  ├─→ Sub-Task 3 (FormulaBuildUp component)
  │        Both ↓
  └─→ Sub-Task 4 (wire into TopicPage + 8 topic files)
  └─→ Sub-Task 5 (Formula Map page — can run in parallel with Sub-Tasks 2-4 after Sub-Task 1)
```

Sub-Tasks 2, 3, and 5 can all proceed in parallel once Sub-Task 1 is complete.
Sub-Task 4 must wait for Sub-Tasks 2 and 3 to be done.
