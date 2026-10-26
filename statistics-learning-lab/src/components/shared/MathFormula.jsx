/**
 * MathFormula — KaTeX-powered formula renderer
 *
 * Renders a LaTeX string using KaTeX (renderToString) and injects the
 * resulting HTML via dangerouslySetInnerHTML. Falls back to a plain
 * monospace span if KaTeX throws (e.g. unsupported syntax).
 *
 * Props
 * ─────
 *   expr       — LaTeX string (e.g. '\\frac{\\sum x}{n}')
 *   display    — boolean; if true renders in display mode (centred, larger)
 *   className  — extra Tailwind classes on the wrapper span
 */

import katex from 'katex'

export default function MathFormula({ expr, display = false, className = '' }) {
  if (!expr) return null

  let html
  try {
    html = katex.renderToString(expr, {
      displayMode: display,
      throwOnError: false,
      errorColor: '#dc2626',
      // Allow common macros used in statistics
      macros: {
        '\\d': '\\mathrm{d}',
      },
    })
  } catch {
    // Should not reach here (throwOnError: false), but belt-and-suspenders
    return (
      <span className={`font-mono text-textDark ${className}`}>
        {expr}
      </span>
    )
  }

  return (
    <span
      className={`${display ? 'block text-center' : 'inline'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
