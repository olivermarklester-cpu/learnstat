import { useState } from 'react'
import MathFormula from './MathFormula'

/**
 * StepCalculation
 * Props:
 *   steps          — [{ stepNumber, label, expression, result, explanation }]
 *   title          — heading (default: "Step-by-Step Calculation")
 *   interpretation — plain-language interpretation shown at end
 *   defaultOpen    — whether expanded on mount (default: false)
 *
 * Expressions are rendered through MathFormula, which handles both plain
 * Unicode strings and mini-LaTeX tokens (\frac, \sqrt, \bar, etc).
 */
export default function StepCalculation({
  steps = [],
  title = 'Step-by-Step Calculation',
  interpretation,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen)

  // The final step's result is the answer
  const lastStep = steps[steps.length - 1]

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="border border-primary text-primary bg-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 transition-colors mb-3"
        aria-expanded={open}
        aria-label={open ? 'Hide step-by-step calculation' : 'Show step-by-step calculation'}
      >
        {open ? '▲ Hide Calculation' : '▼ Show Calculation'}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="space-y-3">
          {title && (
            <p className="text-sm font-semibold text-textMuted uppercase tracking-wide">{title}</p>
          )}

          {/* Steps */}
          {steps.map((step, i) => {
            const num = step.stepNumber ?? i + 1
            return (
              <div key={i} className="flex gap-3 items-start">
                {/* Step number badge */}
                <div className="shrink-0 w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold">
                  {num}
                </div>

                {/* Step body */}
                <div className="flex-1 min-w-0">
                  {step.label && (
                    <p className="text-sm font-semibold text-textDark mb-1">{step.label}</p>
                  )}
                  {step.expression && (
                    <div className="bg-gray-100 rounded px-4 py-2 text-sm text-textDark overflow-x-auto mb-1">
                      <MathFormula expr={String(step.expression)} />
                    </div>
                  )}
                  {step.result !== undefined && step.result !== null && (
                    <p className="text-sm text-textDark font-semibold flex items-center gap-1 flex-wrap">
                      <span>=</span>
                      <MathFormula expr={String(step.result)} />
                    </p>
                  )}
                  {step.explanation && (
                    <p className="text-xs text-textMuted mt-1 leading-relaxed">{step.explanation}</p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Final answer box */}
          {lastStep?.result !== undefined && lastStep?.result !== null && (
            <div className="bg-teal text-white rounded-xl p-4 text-center text-xl font-bold mt-2">
              <span className="mr-2">Answer:</span>
              <MathFormula expr={String(lastStep.result)} className="text-white" />
            </div>
          )}

          {/* Interpretation box */}
          {interpretation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-textDark leading-relaxed mt-2">
              <span className="font-semibold text-blue-700">Interpretation: </span>
              {interpretation}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
