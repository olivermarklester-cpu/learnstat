import { useState, useMemo, useCallback, useRef } from 'react'
import TopicPage from '../../layout/TopicPage'
import { round, simpleRegression } from '../../../utils/stats'

// ── Preset scenarios ──────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: 'study',
    label: '📚 Study Hours → Exam Score',
    description: 'More study time tends to mean higher scores. A classic positive relationship.',
    xLabel: 'Study Hours',
    yLabel: 'Exam Score',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [45, 52, 58, 61, 68, 71, 76, 80, 85, 92],
    insight:
      'Each additional study hour is associated with ~5 more exam points. The intercept (~40) represents the baseline score with zero study.',
  },
  {
    id: 'height',
    label: '📏 Height → Weight',
    description: 'Taller people tend to weigh more — a real-world positive correlation.',
    xLabel: 'Height (cm)',
    yLabel: 'Weight (kg)',
    x: [155, 160, 162, 165, 168, 170, 172, 175, 178, 182],
    y: [52, 56, 57, 60, 63, 65, 68, 70, 74, 80],
    insight:
      'For every extra centimetre of height, weight increases by about 0.9 kg. Note how R² shows height explains most but not all weight variation.',
  },
  {
    id: 'ads',
    label: '📺 Ad Spend → Sales',
    description: 'More advertising generally drives more sales — positive but with noise.',
    xLabel: 'Ad Spend ($k)',
    yLabel: 'Sales ($k)',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [14, 17, 22, 28, 30, 34, 40, 43, 48, 52],
    insight:
      'Each $1k in ads correlates with ~$4k in extra sales. The non-zero intercept (~10k) represents baseline sales with no advertising.',
  },
  {
    id: 'temp',
    label: '🌡️ Temperature → Ice Cream Sales',
    description: 'Warmer weather drives ice cream demand — connected to the correlation vs causation lesson.',
    xLabel: 'Temperature (°C)',
    yLabel: 'Ice Cream Sales ($)',
    x: [10, 14, 18, 20, 22, 25, 28, 30, 33, 35],
    y: [80, 120, 180, 220, 250, 310, 380, 430, 490, 540],
    insight:
      'Sales rise steeply with temperature. This dataset also illustrates why correlation ≠ causation — a third variable (season) drives both.',
  },
  {
    id: 'sleep',
    label: '😴 Sleep Deprivation → Reaction Time',
    description: 'More hours without sleep → slower reaction. A strong positive slope.',
    xLabel: 'Hours without sleep',
    yLabel: 'Reaction time (ms)',
    x: [0, 4, 8, 12, 16, 20, 24, 28, 32, 36],
    y: [200, 210, 230, 255, 285, 320, 360, 405, 460, 510],
    insight:
      'Each additional 4 hours without sleep adds roughly 30 ms to reaction time. x measures deprivation, so the slope is positive (more deprivation → worse performance).',
  },
  {
    id: 'weak',
    label: '🎲 Weak / Noisy Relationship',
    description: 'A barely-there positive trend buried in noise. Low R², small slope.',
    xLabel: 'x',
    yLabel: 'y',
    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    y: [12, 8, 15, 10, 18, 11, 20, 9, 22, 14],
    insight:
      'Even with a positive slope, R² is low because the points scatter widely. This is what a "weak linear relationship" looks like in practice.',
  },
]

// ── SVG layout constants ──────────────────────────────────────────────────────

const SVG_W = 280
const SVG_H = 160
const PAD_L = 36
const PAD_R = 12
const PAD_T = 16
const PAD_B = 28
const INNER_W = SVG_W - PAD_L - PAD_R
const INNER_H = SVG_H - PAD_T - PAD_B

function scaleX(v, min, max) {
  return PAD_L + ((v - min) / (max - min)) * INNER_W
}
function scaleY(v, min, max) {
  return PAD_T + INNER_H - ((v - min) / (max - min)) * INNER_H
}

function niceTicks(min, max, targetCount = 5) {
  const range = max - min
  const rough = range / targetCount
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  const step = [1, 2, 5, 10].map(f => f * mag).find(s => s >= rough) || mag
  const ticks = []
  const start = Math.ceil(min / step) * step
  for (let t = start; t <= max + step * 0.01; t += step) ticks.push(parseFloat(t.toPrecision(10)))
  return ticks
}

function AxisLabels({ xLabel, yLabel }) {
  return (
    <>
      <text x={SVG_W / 2} y={SVG_H - 2} textAnchor="middle" fontSize="8" fill="#6b7280">
        {xLabel}
      </text>
      <text
        x="7"
        y={SVG_H / 2}
        textAnchor="middle"
        fontSize="8"
        fill="#6b7280"
        transform={`rotate(-90, 7, ${SVG_H / 2})`}
      >
        {yLabel}
      </text>
    </>
  )
}

function ScatterWithLine({ x, y, reg, xLabel = 'x', yLabel = 'y', highlightX = null }) {
  if (!x.length) return null

  const xSpan = Math.max(...x) - Math.min(...x) || 1
  const xMin = Math.min(...x) - xSpan * 0.08
  const xMax = Math.max(...x) + xSpan * 0.08

  const allY = [
    ...y,
    ...(reg ? [reg.b0 + reg.b1 * xMin, reg.b0 + reg.b1 * xMax] : []),
  ]
  const ySpan = Math.max(...allY) - Math.min(...allY) || 1
  const yMin = Math.min(...allY) - ySpan * 0.1
  const yMax = Math.max(...allY) + ySpan * 0.1

  const sx = v => scaleX(v, xMin, xMax)
  const sy = v => scaleY(v, yMin, yMax)

  const yTicks = niceTicks(yMin, yMax)
  const xTicks = niceTicks(xMin, xMax)

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ height: 200 }}>
      {/* Grid */}
      {yTicks.map(t => (
        <line key={t} x1={PAD_L} y1={sy(t)} x2={SVG_W - PAD_R} y2={sy(t)} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      {/* Axes */}
      <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
      <line x1={PAD_L} y1={PAD_T + INNER_H} x2={SVG_W - PAD_R} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
      {/* Tick labels */}
      {yTicks.map(t => (
        <text key={t} x={PAD_L - 3} y={sy(t) + 3} textAnchor="end" fontSize="7" fill="#9ca3af">{t}</text>
      ))}
      {xTicks.map(t => (
        <text key={t} x={sx(t)} y={PAD_T + INNER_H + 10} textAnchor="middle" fontSize="7" fill="#9ca3af">{t}</text>
      ))}
      {/* Regression line */}
      {reg && (
        <line
          x1={sx(xMin)} y1={sy(reg.b0 + reg.b1 * xMin)}
          x2={sx(xMax)} y2={sy(reg.b0 + reg.b1 * xMax)}
          stroke="#dc2626" strokeWidth="2" strokeLinecap="round"
        />
      )}
      {/* Residual dashes */}
      {reg && x.map((xi, i) => (
        <line
          key={i}
          x1={sx(xi)} y1={sy(y[i])}
          x2={sx(xi)} y2={sy(reg.b0 + reg.b1 * xi)}
          stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,1.5"
        />
      ))}
      {/* Prediction highlight */}
      {reg && highlightX !== null && highlightX >= xMin && highlightX <= xMax && (() => {
        const hy = reg.b0 + reg.b1 * highlightX
        return (
          <>
            <line x1={sx(highlightX)} y1={sy(yMin)} x2={sx(highlightX)} y2={sy(hy)}
              stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3,2" />
            <line x1={PAD_L} y1={sy(hy)} x2={sx(highlightX)} y2={sy(hy)}
              stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx={sx(highlightX)} cy={sy(hy)} r="5" fill="#7c3aed" opacity="0.9" />
            <text x={sx(highlightX) + 7} y={sy(hy) - 4} fontSize="8" fill="#7c3aed" fontWeight="bold">
              ŷ={round(hy, 1)}
            </text>
          </>
        )
      })()}
      {/* Data points */}
      {x.map((xi, i) => (
        <circle key={i} cx={sx(xi)} cy={sy(y[i])} r="4" fill="#2563eb" opacity="0.75" stroke="white" strokeWidth="1" />
      ))}
      <AxisLabels xLabel={xLabel} yLabel={yLabel} />
    </svg>
  )
}

// ── Stat badges ───────────────────────────────────────────────────────────────

function StatBadges({ reg }) {
  if (!reg) return null
  return (
    <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
        <div className="text-blue-500 font-medium">b₀ (intercept)</div>
        <div className="text-blue-900 font-bold text-sm">{round(reg.b0, 3)}</div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
        <div className="text-purple-500 font-medium">b₁ (slope)</div>
        <div className="text-purple-900 font-bold text-sm">{round(reg.b1, 3)}</div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
        <div className="text-amber-500 font-medium">r</div>
        <div className="text-amber-900 font-bold text-sm">{round(reg.r, 3)}</div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
        <div className="text-green-500 font-medium">R²</div>
        <div className="text-green-900 font-bold text-sm">{round(reg.rSquared, 3)}</div>
      </div>
    </div>
  )
}

function PresetPills({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {PRESETS.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            selected === p.id
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-textMuted border-border hover:border-primary hover:text-primary'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

// ── Tab: Scenarios ────────────────────────────────────────────────────────────

function PresetsTab() {
  const [selected, setSelected] = useState('study')
  const preset = PRESETS.find(p => p.id === selected)
  const reg = useMemo(() => simpleRegression(preset.x, preset.y), [preset])

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">
        Pick a real-world scenario to see how regression looks in context.
      </p>
      <PresetPills selected={selected} onSelect={setSelected} />

      <div className="bg-slate-50 border border-border rounded-lg px-3 py-2 mb-3 text-xs text-textMuted">
        {preset.description}
      </div>

      <ScatterWithLine x={preset.x} y={preset.y} reg={reg} xLabel={preset.xLabel} yLabel={preset.yLabel} />

      {reg && (
        <div className="text-center text-sm font-mono font-semibold text-red-600 my-2">
          ŷ = {round(reg.b0, 2)} + {round(reg.b1, 2)}x
        </div>
      )}

      <StatBadges reg={reg} />

      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">
        <span className="font-semibold">💡 Insight: </span>
        {preset.insight}
      </div>
    </div>
  )
}

// ── Tab: Build Your Own ───────────────────────────────────────────────────────

const INITIAL_POINTS = [
  { x: 1, y: 2.5 }, { x: 2, y: 4.1 }, { x: 3, y: 3.8 },
  { x: 4, y: 6.2 }, { x: 5, y: 5.9 }, { x: 6, y: 7.5 },
]

const BUILD_X_MIN = 0, BUILD_X_MAX = 12
const BUILD_Y_MIN = 0, BUILD_Y_MAX = 14

function BuildTab() {
  const [points, setPoints] = useState(INITIAL_POINTS)
  const [hovering, setHovering] = useState(false)
  const svgRef = useRef(null)

  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)

  const sx = v => PAD_L + ((v - BUILD_X_MIN) / (BUILD_X_MAX - BUILD_X_MIN)) * INNER_W
  const sy = v => PAD_T + INNER_H - ((v - BUILD_Y_MIN) / (BUILD_Y_MAX - BUILD_Y_MIN)) * INNER_H

  const fromSVG = useCallback((clientX, clientY, rect) => {
    const rawX = ((clientX - rect.left) / rect.width * SVG_W - PAD_L) / INNER_W * (BUILD_X_MAX - BUILD_X_MIN) + BUILD_X_MIN
    const rawY = (1 - ((clientY - rect.top) / rect.height * SVG_H - PAD_T) / INNER_H) * (BUILD_Y_MAX - BUILD_Y_MIN) + BUILD_Y_MIN
    return { x: round(rawX, 1), y: round(rawY, 1) }
  }, [])

  const reg = useMemo(() => points.length >= 2 ? simpleRegression(xs, ys) : null, [points])

  const handleSVGClick = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect()
    const { x, y } = fromSVG(e.clientX, e.clientY, rect)
    if (x < BUILD_X_MIN || x > BUILD_X_MAX || y < BUILD_Y_MIN || y > BUILD_Y_MAX) return
    setPoints(prev => [...prev, { x, y }])
  }, [fromSVG])

  const removePoint = useCallback((i, e) => {
    e.stopPropagation()
    setPoints(prev => prev.filter((_, idx) => idx !== i))
  }, [])

  const xTicks = [0, 2, 4, 6, 8, 10, 12]
  const yTicks = [0, 2, 4, 6, 8, 10, 12, 14]

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">
        <strong>Click</strong> anywhere on the chart to add a point.{' '}
        <strong>Click a point</strong> to remove it.
        Watch the regression line and statistics update live.
      </p>

      <div className="relative border border-border rounded-xl overflow-hidden bg-white">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full cursor-crosshair"
          style={{ height: 200 }}
          onClick={handleSVGClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Grid */}
          {yTicks.map(t => (
            <line key={t} x1={PAD_L} y1={sy(t)} x2={SVG_W - PAD_R} y2={sy(t)} stroke="#f3f4f6" strokeWidth="1" />
          ))}
          {/* Axes */}
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
          <line x1={PAD_L} y1={PAD_T + INNER_H} x2={SVG_W - PAD_R} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
          {yTicks.map(t => (
            <text key={t} x={PAD_L - 3} y={sy(t) + 3} textAnchor="end" fontSize="7" fill="#9ca3af">{t}</text>
          ))}
          {xTicks.map(t => (
            <text key={t} x={sx(t)} y={PAD_T + INNER_H + 10} textAnchor="middle" fontSize="7" fill="#9ca3af">{t}</text>
          ))}
          {/* Regression line */}
          {reg && (() => {
            const ly1 = Math.max(BUILD_Y_MIN - 5, Math.min(BUILD_Y_MAX + 5, reg.b0 + reg.b1 * BUILD_X_MIN))
            const ly2 = Math.max(BUILD_Y_MIN - 5, Math.min(BUILD_Y_MAX + 5, reg.b0 + reg.b1 * BUILD_X_MAX))
            return (
              <line x1={sx(BUILD_X_MIN)} y1={sy(ly1)} x2={sx(BUILD_X_MAX)} y2={sy(ly2)}
                stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            )
          })()}
          {/* Residual dashes */}
          {reg && points.map((pt, i) => (
            <line key={i}
              x1={sx(pt.x)} y1={sy(pt.y)}
              x2={sx(pt.x)} y2={sy(reg.b0 + reg.b1 * pt.x)}
              stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,1.5" />
          ))}
          {/* Points */}
          {points.map((pt, i) => (
            <g key={i} onClick={(e) => removePoint(i, e)} style={{ cursor: 'pointer' }}>
              <circle cx={sx(pt.x)} cy={sy(pt.y)} r="6" fill="transparent" />
              <circle cx={sx(pt.x)} cy={sy(pt.y)} r="4" fill="#2563eb" stroke="white" strokeWidth="1.5" opacity="0.85" />
            </g>
          ))}
          <AxisLabels xLabel="x" yLabel="y" />
        </svg>

        {hovering && (
          <div className="absolute top-2 right-2 text-xs text-textMuted bg-white/90 border border-border rounded px-2 py-1">
            Click to add · Click point to remove
          </div>
        )}
      </div>

      {reg ? (
        <div className="text-center text-sm font-mono font-semibold text-red-600 my-2">
          ŷ = {round(reg.b0, 2)} + {round(reg.b1, 2)}x
          <span className="ml-2 text-xs text-textMuted font-sans font-normal">({points.length} points)</span>
        </div>
      ) : (
        <p className="text-center text-xs text-textMuted my-2">Add at least 2 points to fit a line.</p>
      )}

      <StatBadges reg={reg} />

      <div className="mt-3 flex justify-end">
        <button
          onClick={() => setPoints(INITIAL_POINTS)}
          className="text-xs text-textMuted border border-border rounded px-2.5 py-1 hover:bg-gray-50 transition-colors"
        >
          Reset points
        </button>
      </div>
    </div>
  )
}

// ── Tab: Residuals ────────────────────────────────────────────────────────────

function ResidualsTab() {
  const [selected, setSelected] = useState('study')
  const preset = PRESETS.find(p => p.id === selected)
  const reg = useMemo(() => simpleRegression(preset.x, preset.y), [preset])

  const residuals = reg ? reg.residuals : []
  const maxAbsRes = residuals.length ? Math.max(...residuals.map(Math.abs)) : 1
  const fitted = reg ? reg.yHat : []

  const rfXMin = fitted.length ? Math.min(...fitted) - 1 : 0
  const rfXMax = fitted.length ? Math.max(...fitted) + 1 : 10
  const rfYMin = -maxAbsRes * 1.35
  const rfYMax = maxAbsRes * 1.35
  const rfSx = v => scaleX(v, rfXMin, rfXMax)
  const rfSy = v => scaleY(v, rfYMin, rfYMax)

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">
        A <strong>residual</strong> (eᵢ = yᵢ − ŷᵢ) is the gap between the actual point and the
        line. OLS minimises the sum of squared residuals. Ideally they scatter randomly around zero.
      </p>

      <PresetPills selected={selected} onSelect={setSelected} />

      {reg && (
        <>
          {/* Residual bar chart */}
          <p className="text-xs font-semibold text-textDark mb-1">Residuals (eᵢ = yᵢ − ŷᵢ)</p>
          <svg viewBox={`0 0 ${SVG_W} 90`} className="w-full mb-3" style={{ height: 90 }}>
            <line x1={PAD_L} y1={45} x2={SVG_W - PAD_R} y2={45} stroke="#d1d5db" strokeWidth="1" />
            {residuals.map((e, i) => {
              const bw = Math.min(18, INNER_W / residuals.length - 2)
              const bx = PAD_L + (i / residuals.length) * INNER_W + INNER_W / residuals.length / 2 - bw / 2
              const barH = (Math.abs(e) / maxAbsRes) * 38
              const by = e >= 0 ? 45 - barH : 45
              return (
                <g key={i}>
                  <rect x={bx} y={by} width={bw} height={barH}
                    fill={e >= 0 ? '#3b82f6' : '#ef4444'} opacity="0.75" rx="1" />
                  <title>eᵢ = {round(e, 2)}</title>
                </g>
              )
            })}
            <text x={SVG_W - PAD_R} y={43} textAnchor="end" fontSize="7" fill="#9ca3af">+ (over)</text>
            <text x={SVG_W - PAD_R} y={54} textAnchor="end" fontSize="7" fill="#9ca3af">− (under)</text>
            <text x={PAD_L - 2} y={48} textAnchor="end" fontSize="7" fill="#9ca3af">0</text>
          </svg>

          {/* Residuals vs Fitted */}
          <p className="text-xs font-semibold text-textDark mb-1">Residuals vs Fitted values</p>
          <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ height: 180 }}>
            <line x1={PAD_L} y1={rfSy(0)} x2={SVG_W - PAD_R} y2={rfSy(0)}
              stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3" />
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
            <line x1={PAD_L} y1={PAD_T + INNER_H} x2={SVG_W - PAD_R} y2={PAD_T + INNER_H} stroke="#d1d5db" strokeWidth="1" />
            {fitted.map((fv, i) => (
              <circle key={i} cx={rfSx(fv)} cy={rfSy(residuals[i])} r="4"
                fill={residuals[i] >= 0 ? '#3b82f6' : '#ef4444'} opacity="0.75"
                stroke="white" strokeWidth="1" />
            ))}
            <text x={PAD_L - 3} y={rfSy(0) + 3} textAnchor="end" fontSize="7" fill="#9ca3af">0</text>
            <AxisLabels xLabel="Fitted ŷ" yLabel="Residual" />
          </svg>

          {/* Residual table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="px-2 py-1.5 font-semibold text-textMuted">i</th>
                  <th className="px-2 py-1.5 font-semibold text-textMuted">yᵢ</th>
                  <th className="px-2 py-1.5 font-semibold text-textMuted">ŷᵢ</th>
                  <th className="px-2 py-1.5 font-semibold text-textMuted">eᵢ = yᵢ−ŷᵢ</th>
                  <th className="px-2 py-1.5 font-semibold text-textMuted">eᵢ²</th>
                </tr>
              </thead>
              <tbody>
                {preset.y.map((yi, i) => {
                  const yhat = round(reg.yHat[i], 2)
                  const e = round(reg.residuals[i], 2)
                  const e2 = round(reg.residuals[i] ** 2, 2)
                  return (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-2 py-1 text-textMuted">{i + 1}</td>
                      <td className="px-2 py-1">{yi}</td>
                      <td className="px-2 py-1 text-red-600">{yhat}</td>
                      <td className={`px-2 py-1 font-mono ${e >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{e}</td>
                      <td className="px-2 py-1 text-textMuted">{e2}</td>
                    </tr>
                  )
                })}
                <tr className="bg-slate-50 font-semibold">
                  <td colSpan={3} className="px-2 py-1.5 text-right text-textMuted">SS_Res (sum of eᵢ²):</td>
                  <td></td>
                  <td className="px-2 py-1.5 text-textDark">
                    {round(reg.residuals.reduce((s, e) => s + e * e, 0), 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
            <strong>What to look for:</strong> Residuals should scatter randomly around zero with no
            pattern. A U-shape or fan (funnel) pattern suggests the linear model is missing something —
            non-linearity or unequal variance (heteroscedasticity).
          </div>
        </>
      )}
    </div>
  )
}

// ── Tab: Predict ──────────────────────────────────────────────────────────────

function PredictTab() {
  const [selected, setSelected] = useState('study')
  const [predictX, setPredictX] = useState(null)

  const preset = PRESETS.find(p => p.id === selected)
  const reg = useMemo(() => simpleRegression(preset.x, preset.y), [preset])

  const xDataMin = Math.min(...preset.x)
  const xDataMax = Math.max(...preset.x)

  // Derive slider bounds and default only when preset changes
  const sliderMin = round(xDataMin - (xDataMax - xDataMin) * 0.3, 1)
  const sliderMax = round(xDataMax + (xDataMax - xDataMin) * 0.3, 1)
  const defaultX = round((xDataMin + xDataMax) / 2, 1)
  const currentX = predictX !== null ? predictX : defaultX

  const handlePresetChange = (id) => {
    setSelected(id)
    setPredictX(null)
  }

  const predictedY = reg ? round(reg.b0 + reg.b1 * currentX, 2) : '—'
  const isExtrapolating = currentX < xDataMin || currentX > xDataMax

  return (
    <div>
      <p className="text-xs text-textMuted mb-2">
        Use the regression line to predict y for any x value. The{' '}
        <span className="text-violet-700 font-semibold">purple marker</span> shows the prediction on
        the chart. Values <strong>outside the data range</strong> are extrapolation — use with caution.
      </p>

      <PresetPills selected={selected} onSelect={handlePresetChange} />

      {/* Slider */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium text-textDark">
            {preset.xLabel} ={' '}
            <span className="text-primary font-bold">{currentX}</span>
          </label>
          {isExtrapolating && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              ⚠ Extrapolating outside data range
            </span>
          )}
        </div>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={round((sliderMax - sliderMin) / 100, 3)}
          value={currentX}
          onChange={e => setPredictX(round(Number(e.target.value), 1))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-textMuted mt-0.5">
          <span>{sliderMin}</span>
          <span className="text-green-600">← data range: {xDataMin}–{xDataMax} →</span>
          <span>{sliderMax}</span>
        </div>
      </div>

      <ScatterWithLine
        x={preset.x} y={preset.y} reg={reg}
        xLabel={preset.xLabel} yLabel={preset.yLabel}
        highlightX={currentX}
      />

      {reg && (
        <div className={`mt-3 rounded-lg border px-4 py-3 text-sm text-center ${
          isExtrapolating
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-violet-50 border-violet-200 text-violet-900'
        }`}>
          <div className="text-xs text-textMuted mb-1 font-mono">
            ŷ = {round(reg.b0, 2)} + {round(reg.b1, 2)} × {currentX}
          </div>
          <div className="font-bold text-lg">
            Predicted {preset.yLabel} = {predictedY}
          </div>
          {isExtrapolating && (
            <div className="text-xs mt-1 text-amber-700">
              Outside the observed range [{xDataMin}, {xDataMax}] — reliability is unknown.
            </div>
          )}
        </div>
      )}

      <StatBadges reg={reg} />
    </div>
  )
}

// ── Main RegressionViz with tabs ──────────────────────────────────────────────

const TABS = [
  { id: 'presets',   label: '📋 Scenarios' },
  { id: 'build',     label: '✏️ Build Your Own' },
  { id: 'residuals', label: '📊 Residuals' },
  { id: 'predict',   label: '🔮 Predict' },
]

function RegressionViz() {
  const [activeTab, setActiveTab] = useState('presets')

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-border bg-slate-50 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-primary border-b-2 border-primary'
                : 'text-textMuted hover:text-textDark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-3">
        {activeTab === 'presets'   && <PresetsTab />}
        {activeTab === 'build'     && <BuildTab />}
        {activeTab === 'residuals' && <ResidualsTab />}
        {activeTab === 'predict'   && <PredictTab />}
      </div>
    </div>
  )
}

// ── Content ───────────────────────────────────────────────────────────────────

const content = {
  title: 'Simple Linear Regression',
  topicGroup: 'Relationships and Prediction',
  learningObjective:
    'Fit a simple linear regression model, interpret the slope and intercept, and use the model to make predictions.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        <strong>Simple linear regression</strong> models the relationship between one predictor
        variable x and one continuous outcome y as a straight line:
        <code className="mx-1 bg-gray-100 px-1.5 py-0.5 rounded text-xs">ŷ = b₀ + b₁x</code>.
        It finds the line that minimises the sum of squared residuals (OLS — Ordinary Least Squares).
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-1">Key components</p>
        <ul className="space-y-1 text-blue-800">
          <li><strong>b₀ (intercept):</strong> predicted value of y when x = 0</li>
          <li><strong>b₁ (slope):</strong> change in ŷ for each 1-unit increase in x</li>
          <li><strong>ŷ (y-hat):</strong> the predicted (fitted) value of y for a given x</li>
          <li><strong>residual:</strong> eᵢ = yᵢ − ŷᵢ — the prediction error for observation i</li>
        </ul>
      </div>
      <p>
        <strong>R²</strong> measures the goodness of fit: the proportion of total variance in y
        explained by the regression model. R² = 1 − SSResidual/SSTotal.
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        Imagine drawing a "line of best fit" through a scatter plot of height vs weight.
        The slope tells you: "For every extra centimetre in height, weight typically increases
        by b₁ kg." The intercept is the starting point (weight when height = 0 — often
        not meaningful outside the data range). R² tells you how tightly the points cluster
        around that line.
      </p>
    </div>
  ),
  formulaLineage: {
    topicId: 'simple-linear-regression',
    title: 'How Simple Linear Regression is built',
    steps: [
      {
        label: 'Slope uses the Correlation coefficient',
        symbolName: 'r',
        highlightColor: 'blue',
        from: 'b₁ = r × (sy / sx)',
        to: 'b₁ = Cov(x,y) / Var(x) = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²',
        note: 'r encodes the direction and strength of the relationship. Multiplying by sy/sx scales it back into the original units of y.',
      },
      {
        label: 'Intercept uses the Mean of both variables',
        symbolName: 'x̄, ȳ',
        highlightColor: 'orange',
        from: 'b₀ = ȳ − b₁ × x̄',
        to: 'b₀ = mean(y) − b₁ × mean(x)',
        note: 'The regression line always passes through (x̄, ȳ). Once b₁ is known, b₀ positions the line so it runs through that centre point.',
      },
    ],
    finalFormula: 'ŷ = b₀ + b₁x,  where b₁ = Cov(x,y)/Var(x),  b₀ = ȳ − b₁x̄',
  },
  formula: {
    main: 'ŷ = b₀ + b₁x',
    variants: [
      { label: 'Regression equation', expression: 'ŷ = b₀ + b₁x', latex: '\\hat{y} = b_0 + b_1 x' },
      { label: 'Slope', expression: 'b₁ = Cov(x,y) / Var(x) = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²', latex: 'b_1 = \\frac{Cov(x,y)}{s_x^2}' },
      { label: 'Intercept', expression: 'b₀ = ȳ − b₁ × x̄', latex: 'b_0 = \\bar{y} - b_1 \\bar{x}' },
      { label: 'Goodness of fit', expression: 'R² = 1 − SS_Res / SS_Tot = r²', latex: 'R^2 = 1 - \\frac{SS_{Res}}{SS_{Tot}}' },
    ],
    symbolGuide: [
      { symbol: 'b₁', meaning: 'Slope — change in ŷ for a 1-unit increase in x' },
      { symbol: 'b₀', meaning: 'Intercept — predicted y when x = 0' },
      { symbol: 'ŷ', meaning: 'Predicted value of y (read "y-hat")' },
      { symbol: 'eᵢ = yᵢ − ŷᵢ', meaning: 'Residual (prediction error) for observation i' },
      { symbol: 'R²', meaning: 'Coefficient of determination (0–1); proportion of variance in y explained' },
    ],
  },
  whenToUse: [
    'Predicting a continuous outcome y from one continuous predictor x',
    'Quantifying the rate of change in y per unit change in x (the slope)',
    'Describing the linear relationship between two variables',
  ],
  whenNotToUse: [
    'Non-linear relationships — consider polynomial or other non-linear models',
    'Multiple predictors — use multiple regression',
    'Categorical outcomes — use logistic regression',
    'Extrapolating far beyond the range of observed x values — unreliable',
  ],
  assumptions: [
    'Linearity: the relationship between x and y is linear',
    'Independence: residuals are independent',
    'Homoscedasticity: residuals have constant variance across all values of x',
    'Normality: residuals are approximately normally distributed',
  ],
  workedExample: {
    scenario: 'Hours studied (x): [1, 2, 3, 4, 5]. Exam score (y): [55, 60, 65, 70, 75]. Find the regression equation.',
    steps: [
      { stepNumber: 1, label: 'Means', expression: 'x̄ = 3, ȳ = 65', result: 'x̄=3, ȳ=65', explanation: 'Average of each variable.' },
      { stepNumber: 2, label: 'Slope b₁', expression: 'Cov = [(−2)(−10)+(−1)(−5)+(0)(0)+(1)(5)+(2)(10)] / 4 = 50/4 = 12.5. Var(x) = [4+1+0+1+4]/4 = 2.5. b₁ = 12.5/2.5 = 5', result: 'b₁ = 5', explanation: 'Each additional study hour predicts a 5-point score increase.' },
      { stepNumber: 3, label: 'Intercept b₀', expression: 'b₀ = ȳ − b₁ × x̄ = 65 − 5×3 = 65 − 15', result: 'b₀ = 50', explanation: 'At x=0 (no study), predicted score is 50.' },
      { stepNumber: 4, label: 'Prediction', expression: 'ŷ = 50 + 5×6 = 80 (for 6 hours)', result: 'ŷ = 80', explanation: 'R² = 1.0 — perfect fit in this example.' },
    ],
    interpretation: 'ŷ = 50 + 5x. Each extra study hour predicts a 5-point increase in exam score. R² = 1.0 indicates the model perfectly fits this (constructed) data.',
  },
  interpretation:
    'The slope (b₁) is the most interpretable parameter: for each 1-unit increase in x, ŷ changes by b₁ units. R² tells you how well the model fits. Always plot residuals to check assumptions.',
  commonMistakes: [
    { mistake: 'Extrapolating beyond the data range', explanation: 'A model fit on x = 0–10 may be very unreliable at x = 50. The linear pattern may not hold outside the observed range.' },
    { mistake: 'Assuming regression proves causation', explanation: 'A significant slope only means x is linearly associated with y — not that changing x will change y.' },
    { mistake: 'Ignoring residual plots', explanation: 'A good R² does not guarantee assumption validity. Always plot residuals vs fitted values to check linearity and homoscedasticity.' },
  ],
  practiceProblems: {
    easy: [
      { id: 'slr-easy-1', scenario: 'b₀ = 10, b₁ = 3. Predict ŷ when x = 7.', question: 'What is ŷ?', hint: 'ŷ = b₀ + b₁ × x.', solution: 'ŷ = 10 + 3 × 7 = 10 + 21 = 31.' },
    ],
    moderate: [
      { id: 'slr-mod-1', scenario: 'x̄ = 4, ȳ = 20, Cov(x,y) = 8, Var(x) = 4.', question: 'Find b₁ and b₀. Write the regression equation.', hint: 'b₁ = Cov/Var(x). b₀ = ȳ − b₁x̄.', solution: 'b₁ = 8/4 = 2. b₀ = 20 − 2×4 = 12. Equation: ŷ = 12 + 2x.' },
    ],
    challenging: [
      { id: 'slr-chal-1', scenario: 'Regression of salary (y, $thousands) on years of experience (x): ŷ = 35 + 2.5x. R² = 0.72.', question: 'Interpret b₁ and R². Predict salary for 10 years. Is it appropriate to predict for x = 50 years?', hint: 'Think about the meaning of slope and extrapolation.', solution: 'b₁ = 2.5: each additional year of experience is associated with a $2,500 salary increase on average. R² = 0.72: 72% of variance in salary is explained by experience. Prediction at x=10: ŷ = 35 + 2.5×10 = 60 ($60k). x=50 is extrapolation — 50 years of experience is far beyond typical data range; the model may not apply.' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'slr-kc-1', type: 'multiple-choice',
      question: 'b₁ = 3.5 in a regression of weight (y) on height (x). What does this mean?',
      options: [
        { id: 'a', text: 'Weight increases by 3.5 when height decreases by 1', isCorrect: false, explanation: 'Positive b₁ means y increases as x increases.' },
        { id: 'b', text: 'For each 1-unit increase in height, predicted weight increases by 3.5', isCorrect: true, explanation: 'Correct! The slope means: Δŷ = b₁ × Δx = 3.5 × 1 = 3.5.' },
        { id: 'c', text: 'Height explains 3.5% of weight variance', isCorrect: false, explanation: 'That would be related to R², not b₁.' },
        { id: 'd', text: 'The correlation between height and weight is 3.5', isCorrect: false, explanation: 'Correlation (r) is bounded [−1,1]. b₁ is the slope, not r.' },
      ],
      explanation: 'Slope b₁: for each 1-unit increase in x, ŷ changes by b₁ units.',
      hint: 'The slope describes the rate of change.',
    },
    {
      id: 'slr-kc-2', type: 'multiple-choice',
      question: 'R² = 0.81 for a regression model. What does this mean?',
      options: [
        { id: 'a', text: 'The model predicts 81 values correctly', isCorrect: false, explanation: 'R² is a proportion (0–1), not a count of predictions.' },
        { id: 'b', text: '81% of the variance in y is explained by x', isCorrect: true, explanation: 'Correct! R² = 0.81 means 81% of the total variability in y is accounted for by the regression model.' },
        { id: 'c', text: 'The slope is 0.81', isCorrect: false, explanation: 'R² and b₁ are different quantities.' },
        { id: 'd', text: 'The p-value is 0.81', isCorrect: false, explanation: 'R² measures goodness of fit; p-value tests significance.' },
      ],
      explanation: 'R² = proportion of variance in y explained by the model. R² = 0.81 → 81% explained.',
      hint: 'R² measures how much of y\'s variability the model accounts for.',
    },
    {
      id: 'slr-kc-3', type: 'numerical',
      question: 'b₀ = 5, b₁ = 2. What is ŷ when x = 8?',
      answer: 21,
      tolerance: 0,
      explanation: 'ŷ = b₀ + b₁ × x = 5 + 2 × 8 = 5 + 16 = 21.',
      hint: 'ŷ = b₀ + b₁ × x.',
    },
    {
      id: 'slr-kc-4', type: 'multiple-choice',
      question: 'A residual (eᵢ) is calculated as:',
      options: [
        { id: 'a', text: 'ŷᵢ − yᵢ (predicted minus observed)', isCorrect: false, explanation: 'The residual is observed minus predicted: eᵢ = yᵢ − ŷᵢ.' },
        { id: 'b', text: 'yᵢ − ŷᵢ (observed minus predicted)', isCorrect: true, explanation: 'Correct! eᵢ = yᵢ − ŷᵢ. Positive residual = model under-predicted; negative = over-predicted.' },
        { id: 'c', text: 'yᵢ − ȳ (observed minus overall mean)', isCorrect: false, explanation: 'That is the total deviation, not the residual.' },
        { id: 'd', text: 'ŷᵢ − ȳ (predicted minus overall mean)', isCorrect: false, explanation: 'That is the explained deviation, used in calculating R².' },
      ],
      explanation: 'Residual eᵢ = yᵢ − ŷᵢ. It is how far off the model\'s prediction is for each observation.',
      hint: 'Residual = actual − predicted.',
    },
    {
      id: 'slr-kc-5', type: 'multiple-choice',
      question: 'How is b₁ (slope) calculated in OLS regression?',
      options: [
        { id: 'a', text: 'b₁ = Cov(x,y) / Var(x)', isCorrect: true, explanation: 'Correct! b₁ = Cov(x,y) / s²ₓ = [Σ(xᵢ−x̄)(yᵢ−ȳ)] / [Σ(xᵢ−x̄)²].' },
        { id: 'b', text: 'b₁ = Var(y) / Var(x)', isCorrect: false, explanation: 'That is not the OLS formula for slope.' },
        { id: 'c', text: 'b₁ = Cov(x,y) / (sx × sy)', isCorrect: false, explanation: 'That formula gives the Pearson correlation r, not the slope.' },
        { id: 'd', text: 'b₁ = ȳ / x̄', isCorrect: false, explanation: 'That is not a valid regression formula.' },
      ],
      explanation: 'b₁ = Cov(x,y)/Var(x). Note: b₁ = r × (sy/sx).',
      hint: 'Which denominator normalises by the spread of x?',
    },
  ],
  keyTakeaway:
    'ŷ = b₀ + b₁x. b₁ = Cov(x,y)/Var(x) — the slope (change in ŷ per unit x). b₀ = ȳ − b₁x̄ — the intercept. R² = proportion of variance explained. Always check residual plots for assumption violations.',
  memoryTrick: (
    <div className="space-y-3">
      <p className="font-semibold text-violet-900">SLOPE = "Signal Line Of Prediction Error"</p>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-blue-50 border border-blue-200 rounded p-2">
          <div className="font-bold text-blue-800 mb-1">b₁ (slope)</div>
          <div className="text-blue-700">"For every +1 in x, ŷ changes by b₁"<br />Positive → up. Negative → down.</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded p-2">
          <div className="font-bold text-purple-800 mb-1">b₀ (intercept)</div>
          <div className="text-purple-700">Starting point when x = 0.<br />Often not meaningful outside data range.</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <div className="font-bold text-green-800 mb-1">R² (fit)</div>
          <div className="text-green-700">% of y&apos;s variance explained.<br />R² = 0.80 → 80% explained.</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded p-2">
          <div className="font-bold text-amber-800 mb-1">Residual e = y − ŷ</div>
          <div className="text-amber-700">Gap between actual and predicted.<br />OLS minimises Σe².</div>
        </div>
      </div>
      <div className="bg-violet-50 border border-violet-200 rounded p-2 text-xs text-violet-800">
        <strong>Formula chain:</strong> b₁ = Cov(x,y)/Var(x) → b₀ = ȳ − b₁x̄ → ŷ = b₀ + b₁x
      </div>
    </div>
  ),
  visualization: <RegressionViz />,
  datasetGenerator: false,
}

export default function SimpleLinearRegression({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
