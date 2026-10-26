/**
 * Formula Lineage — defines the dependency graph between formula-bearing topics.
 *
 * Each node: { id, title, formula, slug, group, parents }
 *   id      — matches topic id in topics.js
 *   title   — short display title
 *   formula — short formula string for display in the map and tooltips
 *   slug    — route slug (used to build /${slug} links)
 *   group   — 'descriptive' | 'sampling' | 'inferential'
 *   parents — array of parent topic ids (topics this formula depends on)
 */

export const LINEAGE = [
  {
    id: 'mean-median-mode',
    title: 'Mean',
    formula: 'x̄ = Σx / n',
    slug: 'mean-median-mode',
    group: 'descriptive',
    parents: [],
  },
  {
    id: 'variance',
    title: 'Variance',
    formula: 's² = Σ(x − x̄)² / (n−1)',
    slug: 'variance',
    group: 'descriptive',
    parents: ['mean-median-mode'],
  },
  {
    id: 'standard-deviation',
    title: 'Standard Deviation',
    formula: 's = √s²',
    slug: 'standard-deviation',
    group: 'descriptive',
    parents: ['variance'],
  },
  {
    id: 'z-score',
    title: 'Z-Score',
    formula: 'z = (x − x̄) / s',
    slug: 'z-score',
    group: 'descriptive',
    parents: ['standard-deviation'],
  },
  {
    id: 'standard-error',
    title: 'Standard Error',
    formula: 'SE = s / √n',
    slug: 'standard-error',
    group: 'sampling',
    parents: ['standard-deviation'],
  },
  {
    id: 'z-test',
    title: 'Z-Test',
    formula: 'z = (x̄ − μ₀) / (σ/√n)',
    slug: 'z-test',
    group: 'inferential',
    parents: ['standard-error'],
  },
  {
    id: 'one-sample-t-test',
    title: 'One-Sample T-Test',
    formula: 't = (x̄ − μ₀) / SE',
    slug: 'one-sample-t-test',
    group: 'inferential',
    parents: ['standard-error'],
  },
  {
    id: 'confidence-intervals',
    title: 'Confidence Interval',
    formula: 'x̄ ± t* × SE',
    slug: 'confidence-intervals',
    group: 'inferential',
    parents: ['standard-error'],
  },
  {
    id: 'paired-samples-t-test',
    title: 'Paired T-Test',
    formula: 't = d̄ / (sd / √n)',
    slug: 'paired-samples-t-test',
    group: 'inferential',
    parents: ['one-sample-t-test'],
  },
  {
    id: 'independent-samples-t-test',
    title: 'Independent T-Test',
    formula: 't = (x̄₁ − x̄₂) / (sp × √(1/n₁+1/n₂))',
    slug: 'independent-samples-t-test',
    group: 'inferential',
    parents: ['standard-deviation'],
  },
  {
    id: 'anova',
    title: 'ANOVA',
    formula: 'F = MS_B / MS_W',
    slug: 'anova',
    group: 'inferential',
    parents: ['variance'],
  },
  {
    id: 'covariance',
    title: 'Covariance',
    formula: 'Cov(x,y) = Σ(xᵢ−x̄)(yᵢ−ȳ) / (n−1)',
    slug: 'covariance',
    group: 'relationships',
    parents: ['mean-median-mode'],
  },
  {
    id: 'correlation',
    title: 'Correlation',
    formula: 'r = Cov(x,y) / (sx × sy)',
    slug: 'correlation',
    group: 'relationships',
    parents: ['covariance', 'standard-deviation'],
  },
  {
    id: 'simple-linear-regression',
    title: 'Simple Linear Regression',
    formula: 'ŷ = b₀ + b₁x',
    slug: 'simple-linear-regression',
    group: 'relationships',
    parents: ['correlation'],
  },
]

/**
 * Returns an ordered array of ancestor nodes from root → immediate parent.
 * Does NOT include the node itself.
 * Deduped: each ancestor appears only once (leftmost/earliest occurrence kept).
 *
 * @param {string} id - topic id
 * @returns {Array} ordered ancestor nodes
 */
export function getAncestors(id) {
  const node = LINEAGE.find((n) => n.id === id)
  if (!node || node.parents.length === 0) return []

  // Walk up the tree collecting ancestors in order, deduped
  const seen = new Set()
  const result = []

  function walk(nodeId) {
    const n = LINEAGE.find((x) => x.id === nodeId)
    if (!n) return
    // First recurse into parents (so root comes first)
    for (const parentId of n.parents) {
      walk(parentId)
    }
    // Then add this node if not already in result
    if (!seen.has(nodeId)) {
      seen.add(nodeId)
      result.push(n)
    }
  }

  for (const parentId of node.parents) {
    walk(parentId)
  }

  return result
}

/**
 * Returns direct children of a topic (nodes that list it as a parent).
 *
 * @param {string} id - topic id
 * @returns {Array} child nodes
 */
export function getChildren(id) {
  return LINEAGE.filter((n) => n.parents.includes(id))
}
