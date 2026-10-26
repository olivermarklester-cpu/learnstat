import { useState, useRef, useEffect, useCallback } from 'react'

const BUTTONS = [
  // Row 1 — functions
  { label: 'sin',  value: 'sin',  type: 'fn',     wide: false },
  { label: 'cos',  value: 'cos',  type: 'fn',     wide: false },
  { label: 'tan',  value: 'tan',  type: 'fn',     wide: false },
  { label: 'n!',   value: '!',    type: 'fn',     wide: false },
  // Row 2 — functions
  { label: 'log',  value: 'log',  type: 'fn',     wide: false },
  { label: 'ln',   value: 'ln',   type: 'fn',     wide: false },
  { label: '√',    value: '√(',   type: 'fn',     wide: false },
  { label: 'xʸ',   value: '^',    type: 'op',     wide: false },
  // Row 3
  { label: '(',    value: '(',    type: 'paren',  wide: false },
  { label: ')',    value: ')',    type: 'paren',  wide: false },
  { label: 'x²',   value: '^2',   type: 'fn',     wide: false },
  { label: 'AC',   value: 'AC',   type: 'action', wide: false },
  // Row 4 — digits + ops
  { label: '7',    value: '7',    type: 'digit',  wide: false },
  { label: '8',    value: '8',    type: 'digit',  wide: false },
  { label: '9',    value: '9',    type: 'digit',  wide: false },
  { label: '÷',    value: '/',    type: 'op',     wide: false },
  // Row 5
  { label: '4',    value: '4',    type: 'digit',  wide: false },
  { label: '5',    value: '5',    type: 'digit',  wide: false },
  { label: '6',    value: '6',    type: 'digit',  wide: false },
  { label: '×',    value: '*',    type: 'op',     wide: false },
  // Row 6
  { label: '1',    value: '1',    type: 'digit',  wide: false },
  { label: '2',    value: '2',    type: 'digit',  wide: false },
  { label: '3',    value: '3',    type: 'digit',  wide: false },
  { label: '−',    value: '-',    type: 'op',     wide: false },
  // Row 7
  { label: '0',    value: '0',    type: 'digit',  wide: true  },
  { label: '.',    value: '.',    type: 'digit',  wide: false },
  { label: '+',    value: '+',    type: 'op',     wide: false },
  // Row 8 — delete + equals
  { label: '⌫',    value: 'DEL',  type: 'action', wide: false },
  { label: '=',    value: '=',    type: 'equals', wide: true  },
]

// ── math evaluation ───────────────────────────────────────────────────────────

function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN
  if (n === 0 || n === 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function evaluate(expr) {
  // Replace display tokens with JS-evaluable equivalents
  let e = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, String(Math.PI))
    .replace(/\^2/g, '**2')
    .replace(/\^/g, '**')
    .replace(/√\(/g, 'Math.sqrt(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')

  // Handle factorial: number followed by !
  e = e.replace(/(\d+(?:\.\d+)?)!/g, (_, n) => String(factorial(Number(n))))

  // sin/cos/tan take degrees; defined as helpers so nested parentheses evaluate correctly
  const trig = 'const sin = (d) => Math.sin(d * Math.PI / 180), cos = (d) => Math.cos(d * Math.PI / 180), tan = (d) => Math.tan(d * Math.PI / 180); '
  // eslint-disable-next-line no-new-func
  return Function('"use strict"; ' + trig + 'return (' + e + ')')()
}

// ── button style helpers ──────────────────────────────────────────────────────

function btnClass(type) {
  const base =
    'rounded-lg text-sm font-medium transition-colors select-none cursor-pointer ' +
    'flex items-center justify-center h-9 active:scale-95'
  switch (type) {
    case 'digit':   return base + ' bg-white border border-border text-textDark hover:bg-gray-50'
    case 'op':      return base + ' bg-blue-50 border border-blue-200 text-primary hover:bg-blue-100'
    case 'fn':      return base + ' bg-slate-100 border border-border text-textDark hover:bg-slate-200 text-xs'
    case 'paren':   return base + ' bg-slate-100 border border-border text-textMuted hover:bg-slate-200'
    case 'action':  return base + ' bg-red-50 border border-red-200 text-danger hover:bg-red-100'
    case 'equals':  return base + ' bg-primary text-white hover:bg-blue-700 border border-primary'
    default:        return base + ' bg-white border border-border text-textDark hover:bg-gray-50'
  }
}

// ── component ─────────────────────────────────────────────────────────────────

export default function FloatingCalculator() {
  const [open, setOpen]           = useState(false)
  const [expr, setExpr]           = useState('')
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState(false)
  const [pos, setPos]             = useState({ x: null, y: null })
  const [dragging, setDragging]   = useState(false)
  const dragOffset                = useRef({ x: 0, y: 0 })
  const panelRef                  = useRef(null)
  const inputRef                  = useRef(null)

  // Default position: bottom-right corner (set on first open)
  useEffect(() => {
    if (open && pos.x === null) {
      const w = window.innerWidth
      const h = window.innerHeight
      setPos({ x: w - 288 - 16, y: h - 540 - 72 })
    }
  }, [open, pos.x])

  // ── dragging ────────────────────────────────────────────────────────────────

  const onMouseDown = useCallback((e) => {
    if (e.target.closest('button')) return
    setDragging(true)
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e) => {
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 288, e.clientX - dragOffset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 500, e.clientY - dragOffset.current.y)),
      })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  // ── input logic ─────────────────────────────────────────────────────────────

  const append = (val) => {
    setResult(null)
    setError(false)

    if (val === 'AC') {
      setExpr('')
      inputRef.current?.focus()
      return
    }
    if (val === 'DEL') {
      setExpr(prev => prev.slice(0, -1))
      inputRef.current?.focus()
      return
    }

    // functions that open a paren
    if (['sin', 'cos', 'tan', 'log', 'ln'].includes(val)) {
      setExpr(prev => prev + val + '(')
      inputRef.current?.focus()
      return
    }

    setExpr(prev => prev + val)
    inputRef.current?.focus()
  }

  const compute = () => {
    if (!expr.trim()) return
    try {
      const r = evaluate(expr)
      if (!isFinite(r) || isNaN(r)) { setError(true); return }
      const display = Number.isInteger(r) ? String(r) : parseFloat(r.toPrecision(10)).toString()
      setResult(display)
      setError(false)
    } catch {
      setError(true)
    }
  }

  const handleButton = (val) => {
    if (val === '=') { compute(); return }
    append(val)
  }

  // Focus the input whenever the calculator opens
  useEffect(() => {
    if (open) {
      // slight delay so the panel has rendered
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Escape closes the calculator (input already handles Enter)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* FAB toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={
          'fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full shadow-lg ' +
          'flex items-center justify-center transition-all ' +
          (open
            ? 'bg-primary text-white hover:bg-blue-700'
            : 'bg-white border border-border text-textDark hover:bg-gray-50 shadow-md')
        }
        aria-label={open ? 'Close calculator' : 'Open calculator'}
        title={open ? 'Close calculator' : 'Open calculator'}
      >
        {open ? (
          // X icon
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Calculator icon
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7h8M8 12h2m4 0h2M8 17h2m4 0h2" />
          </svg>
        )}
      </button>

      {/* Calculator panel */}
      {open && pos.x !== null && (
        <div
          ref={panelRef}
          onMouseDown={onMouseDown}
          style={{
            position: 'fixed',
            left: pos.x,
            top: pos.y,
            width: 288,
            zIndex: 49,
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
          className="bg-white border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-border">
            <span className="text-xs font-semibold text-textMuted tracking-wide uppercase">
              Scientific Calculator
            </span>
            <span className="text-xs text-textMuted opacity-50">drag to move</span>
          </div>

          {/* Display */}
          <div className="px-3 pt-3 pb-2">
            <div className="bg-slate-50 border border-border rounded-xl px-3 py-2 min-h-[64px] flex flex-col justify-end">
              {/* Previous expression / result label */}
              <div className="text-xs text-textMuted truncate w-full text-right mb-1 h-4">
                {result !== null && !error ? expr : ''}
              </div>
              {/* Editable equation input */}
              {result !== null || error ? (
                // After hitting = show the result as plain text; clicking clears it
                <div
                  className={
                    'text-xl font-mono font-semibold w-full text-right cursor-text ' +
                    (error ? 'text-danger' : 'text-primary')
                  }
                  onClick={() => { setResult(null); setError(false); inputRef.current?.focus() }}
                >
                  {error ? 'Error' : result}
                </div>
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  value={expr}
                  onChange={e => { setExpr(e.target.value); setResult(null); setError(false) }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); compute() }
                  }}
                  onMouseDown={e => e.stopPropagation()}
                  placeholder="0"
                  className={
                    'text-xl font-mono font-semibold w-full text-right bg-transparent outline-none ' +
                    'placeholder:text-textMuted/40 text-textDark caret-primary'
                  }
                  aria-label="Equation input"
                  spellCheck={false}
                  autoComplete="off"
                />
              )}
            </div>
          </div>

          {/* Button grid */}
          <div className="px-3 pb-3 grid grid-cols-4 gap-1.5">
            {BUTTONS.map((btn, i) => (
              <button
                key={i}
                onMouseDown={e => e.stopPropagation()}
                onClick={() => handleButton(btn.value)}
                className={btnClass(btn.type) + (btn.wide ? ' col-span-2' : '')}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Hint */}
          <div className="text-center text-xs text-textMuted opacity-60 pb-2">
            Trig functions use degrees
          </div>
        </div>
      )}
    </>
  )
}
