import React, { useMemo } from 'react';
import { round } from '../../utils/stats';

/**
 * ZScoreChart component (Interactive SVG Number Line)
 *
 * @param {Object} props
 * @param {number} props.mean - Mean of the distribution
 * @param {number} props.sd - Standard deviation of the distribution
 * @param {number} [props.value] - Raw x value
 * @param {number} [props.zScore] - Pre-computed z-score (computed from value if omitted)
 * @param {number} [props.height=200] - Component height in px
 */
export default function ZScoreChart({
  mean = 0,
  sd = 1,
  value,
  zScore: propZScore,
  height = 200,
}) {
  const currentZ = useMemo(() => {
    if (typeof propZScore === 'number' && isFinite(propZScore)) {
      return propZScore;
    }
    if (typeof value === 'number' && isFinite(value) && typeof sd === 'number' && sd > 0) {
      return (value - mean) / sd;
    }
    return null;
  }, [propZScore, value, mean, sd]);

  const currentValue = useMemo(() => {
    if (typeof value === 'number' && isFinite(value)) {
      return value;
    }
    if (currentZ !== null && typeof mean === 'number' && typeof sd === 'number') {
      return mean + currentZ * sd;
    }
    return null;
  }, [value, currentZ, mean, sd]);

  // SVG layout coordinates
  const svgWidth = 600;
  const svgHeight = 140;
  const padding = { left: 40, right: 40, top: 45, bottom: 45 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const lineY = 65;

  // z range is fixed from -4 to +4
  const minZ = -4;
  const maxZ = 4;

  const getX = (z) => {
    const clampedZ = Math.max(minZ, Math.min(maxZ, z));
    const ratio = (clampedZ - minZ) / (maxZ - minZ);
    return padding.left + ratio * plotWidth;
  };

  // Interpretation text
  const interpretation = useMemo(() => {
    if (currentZ === null) {
      return {
        verbal: 'Enter a value to see its position on the normal scale.',
        direction: '',
      };
    }

    const absZ = Math.abs(currentZ);
    let verbal = '';
    if (absZ < 1) {
      verbal = 'Near the mean (within 1 SD — typical ~68% of data)';
    } else if (absZ < 2) {
      verbal = 'Somewhat away from the mean (1 to 2 SD — ~95% within this range)';
    } else if (absZ < 3) {
      verbal = 'Far from the mean (2 to 3 SD — unusual / rare ~5%)';
    } else {
      verbal = 'Extremely far from the mean (possible outlier / > 3 SD)';
    }

    let direction = 'exactly average';
    if (currentZ < -0.001) {
      direction = 'below average';
    } else if (currentZ > 0.001) {
      direction = 'above average';
    }

    return { verbal, direction };
  }, [currentZ]);

  // Tick marks for -3, -2, -1, 0, 1, 2, 3
  const ticks = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className="w-full flex flex-col items-center select-none" style={{ minHeight: height }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full overflow-visible"
        role="img"
        aria-label="Z-Score distribution number line"
      >
        {/* Shaded Regions */}
        {/* -3 to +3 (99.7% region) */}
        <rect
          x={getX(-3)}
          y={lineY - 20}
          width={getX(3) - getX(-3)}
          height={40}
          fill="#DBEAFE"
          fillOpacity={0.3}
          rx={4}
        />
        {/* -2 to +2 (95% region) */}
        <rect
          x={getX(-2)}
          y={lineY - 20}
          width={getX(2) - getX(-2)}
          height={40}
          fill="#93C5FD"
          fillOpacity={0.35}
          rx={4}
        />
        {/* -1 to +1 (68% region) */}
        <rect
          x={getX(-1)}
          y={lineY - 20}
          width={getX(1) - getX(-1)}
          height={40}
          fill="#3B82F6"
          fillOpacity={0.25}
          rx={4}
        />

        {/* Region Labels */}
        <text
          x={getX(0)}
          y={lineY - 26}
          textAnchor="middle"
          className="fill-blue-700 font-semibold"
          style={{ fontSize: '10px' }}
        >
          68% within ±1σ | 95% within ±2σ | 99.7% within ±3σ
        </text>

        {/* Main Number Line */}
        <line
          x1={padding.left}
          y1={lineY}
          x2={padding.left + plotWidth}
          y2={lineY}
          stroke="#94A3B8"
          strokeWidth={2}
        />

        {/* Ticks and labels */}
        {ticks.map((t) => {
          const x = getX(t);
          const isMean = t === 0;
          const xVal = typeof mean === 'number' && typeof sd === 'number' ? mean + t * sd : null;

          return (
            <g key={t}>
              <line
                x1={x}
                y1={lineY - (isMean ? 14 : 8)}
                x2={x}
                y2={lineY + (isMean ? 14 : 8)}
                stroke={isMean ? '#2563EB' : '#64748B'}
                strokeWidth={isMean ? 2.5 : 1.5}
              />
              <text
                x={x}
                y={lineY + 22}
                textAnchor="middle"
                className={isMean ? 'fill-blue-700 font-bold' : 'fill-slate-600 font-medium'}
                style={{ fontSize: '11px' }}
              >
                {t > 0 ? `+${t}σ` : t === 0 ? '0 (μ)' : `${t}σ`}
              </text>
              {xVal !== null && (
                <text
                  x={x}
                  y={lineY + 34}
                  textAnchor="middle"
                  className="fill-slate-400"
                  style={{ fontSize: '9px' }}
                >
                  {round(xVal, 1)}
                </text>
              )}
            </g>
          );
        })}

        {/* Marker for Current Value */}
        {currentZ !== null && (
          <g className="transition-all duration-300">
            {/* Vertical indicator line */}
            <line
              x1={getX(currentZ)}
              y1={lineY - 32}
              x2={getX(currentZ)}
              y2={lineY + 12}
              stroke="#EA580C"
              strokeWidth={2.5}
            />

            {/* Marker Circle */}
            <circle
              cx={getX(currentZ)}
              cy={lineY}
              r={6}
              fill="#EA580C"
              stroke="#FFFFFF"
              strokeWidth={2}
            />

            {/* Marker Badge on Top */}
            <rect
              x={getX(currentZ) - 45}
              y={lineY - 46}
              width={90}
              height={20}
              fill="#EA580C"
              rx={10}
            />
            <text
              x={getX(currentZ)}
              y={lineY - 33}
              textAnchor="middle"
              className="fill-white font-bold"
              style={{ fontSize: '11px' }}
            >
              {`z = ${round(currentZ, 2)}`}
            </text>
          </g>
        )}
      </svg>

      {/* Verbal Interpretation Banner */}
      <div className="w-full mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Interpretation:</span>
          <span className="text-slate-600">{interpretation.verbal}</span>
        </div>
        {currentZ !== null && (
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`px-2 py-0.5 rounded text-[11px] ${
                currentZ > 0.001
                  ? 'bg-emerald-100 text-emerald-800'
                  : currentZ < -0.001
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentValue !== null ? `x = ${round(currentValue, 2)} (${interpretation.direction})` : interpretation.direction}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
