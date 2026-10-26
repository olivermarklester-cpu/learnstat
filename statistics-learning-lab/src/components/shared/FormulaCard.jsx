import { useState } from 'react'
import MathFormula from './MathFormula'

/**
 * FormulaCard
 *
 * Supports two formula object shapes:
 *
 * Shape A — simple variants list (used by all topic components):
 *   {
 *     main:        string                            (unused, kept for compat)
 *     variants:    [{ label, expression, latex? }]   (latex preferred; expression fallback)
 *     symbolGuide: [{ symbol, meaning }]
 *     notes?:      string
 *   }
 *
 * Shape B — legacy sample/population (kept for FrequencyTables):
 *   {
 *     sample:     { expression, latex?, label }
 *     population: { expression, latex?, label }  (optional)
 *     symbols:    [{ symbol, name, description }]
 *     notes?:     string
 *   }
 */
export default function FormulaCard({ formula, showToggle = true }) {
  const isVariants = Array.isArray(formula?.variants)

  // ── Shape C (side-by-side comparison) ────────────────────────────────────
  if (formula?.comparison && Array.isArray(formula?.pairs)) {
    return <ComparisonCard formula={formula} />
  }

  // ── Shape A (variants) ────────────────────────────────────────────────────
  if (isVariants) {
    return <VariantsCard formula={formula} />
  }

  // ── Shape B (sample / population) ────────────────────────────────────────
  return <SamplePopCard formula={formula} showToggle={showToggle} />
}

// ─── Shape C renderer — side-by-side comparison ───────────────────────────────

function FormulaBlock({ item }) {
  return (
    <div className="flex-1 min-w-0 bg-gray-50 border border-border rounded-xl p-5 flex flex-col items-center gap-3">
      <p className="text-xs font-semibold text-textMuted uppercase tracking-wide text-center">
        {item.label}
      </p>
      <div className="flex items-center justify-center min-h-[4rem]">
        <MathFormula expr={item.latex} display={true} />
      </div>
      {item.note && (
        <p className="text-xs text-textMuted text-center border-t border-border pt-2 w-full">
          {item.note}
        </p>
      )}
    </div>
  )
}

function ComparisonCard({ formula }) {
  const { pairs = [], symbols, notes } = formula
  return (
    <div>
      {/* Header labels */}
      <div className="flex gap-3 mb-2">
        <div className="flex-1 flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-blue-50 border border-blue-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            Sample
          </span>
        </div>
        <div className="flex-1 flex justify-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-[#0D9488] inline-block" />
            Population
          </span>
        </div>
      </div>

      {/* Formula pairs */}
      <div className="flex flex-col gap-3 mb-4">
        {pairs.map((pair, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-3 items-stretch">
            <FormulaBlock item={pair.left} />
            {/* VS divider */}
            <div className="flex items-center justify-center sm:flex-col gap-1 py-1 sm:py-0">
              <div className="hidden sm:block h-full w-px bg-border" />
              <span className="text-xs font-bold text-textMuted bg-white border border-border rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
                vs
              </span>
              <div className="hidden sm:block h-full w-px bg-border" />
            </div>
            <FormulaBlock item={pair.right} />
          </div>
        ))}
      </div>

      {/* Key difference callout */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-900 mb-4 flex gap-2">
        <span className="text-amber-500 flex-shrink-0 mt-0.5">💡</span>
        <span>
          <strong>Key difference:</strong> Sample formulas use lowercase letters (n, x̄, s) and are calculated from your data.
          Population formulas use Greek/capital letters (N, μ, σ) and represent the true values you are trying to estimate.
        </span>
      </div>

      {/* Symbol table */}
      {symbols && symbols.length > 0 && (
        <div className="mb-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-textDark w-20">Symbol</th>
                <th className="text-left py-2 pr-4 font-semibold text-textDark w-40">Meaning</th>
                <th className="text-left py-2 font-semibold text-textDark">Notes</th>
              </tr>
            </thead>
            <tbody>
              {symbols.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold text-primary">{row.symbol}</td>
                  <td className="py-2 pr-4 text-textDark">{row.name}</td>
                  <td className="py-2 text-textMuted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {notes}
        </div>
      )}
    </div>
  )
}

// ─── Shape A renderer ─────────────────────────────────────────────────────────

function VariantsCard({ formula }) {
  const { variants = [], symbolGuide = [], notes } = formula
  const [activeIdx, setActiveIdx] = useState(0)
  const displayed = variants[activeIdx] || variants[0]

  return (
    <div>
      {/* Tab strip — only shown when there are multiple variants */}
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {variants.map((v, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeIdx === i
                  ? 'bg-primary text-white'
                  : 'border border-border text-textDark bg-white hover:bg-gray-50'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* Formula display box */}
      {displayed && (
        <div className="bg-gray-50 rounded-lg px-6 py-8 text-center border border-border mb-4 overflow-x-auto">
          {variants.length === 1 && displayed.label && (
            <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-4">
              {displayed.label}
            </p>
          )}
          {displayed.latex ? (
            <MathFormula
              expr={displayed.latex}
              display={true}
            />
          ) : (
            <p className="text-2xl font-mono text-textDark break-words">
              {displayed.expression}
            </p>
          )}
        </div>
      )}

      {/* Symbol guide */}
      {symbolGuide.length > 0 && (
        <div className="mb-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-textDark w-16">Symbol</th>
                <th className="text-left py-2 font-semibold text-textDark">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {symbolGuide.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold text-primary">{row.symbol}</td>
                  <td className="py-2 text-textDark">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {notes}
        </div>
      )}
    </div>
  )
}

// ─── Shape B renderer ─────────────────────────────────────────────────────────

function SamplePopCard({ formula, showToggle }) {
  const hasBoth = !!(formula?.sample && formula?.population)
  const [active, setActive] = useState('sample')

  if (!formula) return null

  const displayed = hasBoth && showToggle
    ? (active === 'sample' ? formula.sample : formula.population)
    : (formula.sample || formula.population)

  return (
    <div>
      {hasBoth && showToggle && (
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActive('sample')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active === 'sample'
                ? 'bg-primary text-white'
                : 'border border-border text-textDark bg-white hover:bg-gray-50'
            }`}
          >
            Sample
          </button>
          <button
            onClick={() => setActive('population')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              active === 'population'
                ? 'bg-primary text-white'
                : 'border border-border text-textDark bg-white hover:bg-gray-50'
            }`}
          >
            Population
          </button>
        </div>
      )}

      {displayed && (
        <div className="bg-gray-50 rounded-lg px-6 py-8 text-center border border-border mb-4 overflow-x-auto">
          {displayed.label && (
            <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-4">
              {displayed.label}
            </p>
          )}
          {displayed.latex ? (
            <MathFormula
              expr={displayed.latex}
              display={true}
            />
          ) : (
            <p className="text-2xl font-mono text-textDark break-words">{displayed.expression}</p>
          )}
        </div>
      )}

      {formula.symbols && formula.symbols.length > 0 && (
        <div className="mb-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-semibold text-textDark w-16">Symbol</th>
                <th className="text-left py-2 pr-4 font-semibold text-textDark w-40">Meaning</th>
                <th className="text-left py-2 font-semibold text-textDark">Notes</th>
              </tr>
            </thead>
            <tbody>
              {formula.symbols.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold text-primary">{row.symbol}</td>
                  <td className="py-2 pr-4 text-textDark">{row.name}</td>
                  <td className="py-2 text-textMuted">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formula.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {formula.notes}
        </div>
      )}
    </div>
  )
}
