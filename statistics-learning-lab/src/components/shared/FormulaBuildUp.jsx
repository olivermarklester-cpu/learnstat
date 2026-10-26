/**
 * FormulaBuildUp
 *
 * Always-open block that shows step-by-step how the current formula is
 * constructed from prior formulas. Each step highlights the inherited part
 * with a colour badge, shows the "before" expression (with the symbol),
 * an arrow, and the "after" expression (with the substitution expanded).
 *
 * Props:
 *   steps  — array of { label, symbolName, highlightColor, from, to, fromLatex?, toLatex?, note }
 *     label         — step heading (e.g. "Substitute Standard Error")
 *     symbolName    — the inherited symbol being expanded (e.g. "SE")
 *     highlightColor — 'blue' | 'orange' | 'green' | 'purple'
 *     from          — formula string before substitution (plain text fallback)
 *     fromLatex     — LaTeX for the "before" expression (preferred)
 *     to            — formula string after substitution (plain text fallback)
 *     toLatex       — LaTeX for the "after" expression (preferred)
 *     note          — plain-text explanation of what was substituted
 *   finalFormula      — string: plain-text full formula (fallback)
 *   finalFormulaLatex — string: LaTeX for the final expanded formula (preferred)
 *   title             — optional string heading
 */

import MathFormula from './MathFormula'

const COLOR_MAP = {
  blue:   { badge: 'bg-blue-100 text-blue-800 border-blue-200',      glow: 'border-blue-300 bg-blue-50' },
  orange: { badge: 'bg-orange-100 text-orange-800 border-orange-200', glow: 'border-orange-300 bg-orange-50' },
  green:  { badge: 'bg-green-100 text-green-800 border-green-200',    glow: 'border-green-300 bg-green-50' },
  purple: { badge: 'bg-purple-100 text-purple-800 border-purple-200', glow: 'border-purple-300 bg-purple-50' },
}

function FormulaChip({ latex, text, highlight }) {
  const cls = `rounded-lg border px-3 py-2 text-sm overflow-x-auto ${
    highlight
      ? highlight
      : 'border-gray-200 bg-gray-50 text-gray-700'
  }`
  return (
    <div className={cls}>
      {latex
        ? <MathFormula expr={latex} display={false} />
        : <code className="font-mono text-sm whitespace-nowrap">{text}</code>
      }
    </div>
  )
}

function StepRow({ step, index }) {
  const colors = COLOR_MAP[step.highlightColor] || COLOR_MAP.blue

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-indigo-100 last:border-0">
      {/* Step header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide w-12 shrink-0">
          Step {index + 1}
        </span>
        <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded border ${colors.badge}`}>
          {step.symbolName}
        </span>
        <span className="text-xs text-gray-500 font-medium">{step.label}</span>
      </div>

      {/* Formula transformation row */}
      <div className="flex items-center gap-2 flex-wrap ml-14">
        <FormulaChip latex={step.fromLatex} text={step.from} />
        <span className="text-gray-400 font-bold text-base select-none">→</span>
        <FormulaChip latex={step.toLatex} text={step.to} highlight={colors.glow} />
      </div>

      {/* Explanation note */}
      {step.note && (
        <p className="ml-14 text-xs text-gray-500 leading-relaxed">
          {step.note}
        </p>
      )}
    </div>
  )
}

export default function FormulaBuildUp({ steps = [], finalFormula, finalFormulaLatex, title = 'How this formula is built' }) {
  if (!steps.length) return null

  return (
    <div className="mb-5 bg-indigo-50 border border-indigo-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-200 bg-indigo-100/60">
        <span className="text-indigo-600 text-base select-none" aria-hidden="true">⬡</span>
        <span className="text-sm font-semibold text-indigo-800">{title}</span>
      </div>

      {/* Steps */}
      <div className="px-4">
        {steps.map((step, i) => (
          <StepRow key={i} step={step} index={i} />
        ))}
      </div>

      {/* Final expanded formula */}
      {(finalFormulaLatex || finalFormula) && (
        <div className="mx-4 mb-4 mt-2 bg-white border border-indigo-100 rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide shrink-0">
            Full expansion
          </span>
          {finalFormulaLatex
            ? <MathFormula expr={finalFormulaLatex} display={false} />
            : <code className="text-sm font-mono font-bold text-gray-800">{finalFormula}</code>
          }
        </div>
      )}
    </div>
  )
}
