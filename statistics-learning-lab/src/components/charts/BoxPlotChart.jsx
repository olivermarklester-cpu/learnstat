import React, { useMemo } from 'react';
import {
  q1 as calcQ1,
  q3 as calcQ3,
  median as calcMedian,
  outlierFences,
  identifyOutliers,
  sortAsc,
  round,
} from '../../utils/stats';

/**
 * BoxPlotChart component (Custom SVG Implementation)
 *
 * Supports 1 or 2 side-by-side datasets.
 * Displays min, Q1, median, Q3, max (or non-outlier range + fences), and outliers.
 *
 * @param {Object} props
 * @param {Array<{ label: string, data: number[], color?: string }>} props.datasets
 * @param {string} [props.title]
 * @param {string} [props.xLabel]
 * @param {string} [props.yLabel]
 * @param {number} [props.height=300]
 */
export default function BoxPlotChart({
  datasets = [],
  title = '',
  xLabel = '',
  yLabel = '',
  height = 300,
}) {
  const processedDatasets = useMemo(() => {
    if (!Array.isArray(datasets) || datasets.length === 0) return [];

    return datasets.map((ds, index) => {
      const rawData = Array.isArray(ds.data)
        ? ds.data.filter((v) => typeof v === 'number' && isFinite(v))
        : [];

      if (rawData.length === 0) {
        return {
          label: ds.label || `Dataset ${index + 1}`,
          empty: true,
          color: ds.color || (index === 0 ? '#2563EB' : '#0D9488'),
        };
      }

      const sorted = sortAsc(rawData);
      const minVal = sorted[0];
      const maxVal = sorted[sorted.length - 1];
      const q1Val = calcQ1(sorted);
      const medianVal = calcMedian(sorted);
      const q3Val = calcQ3(sorted);
      const fences = outlierFences(sorted);
      const outliers = identifyOutliers(sorted);

      // Whiskers extend to min/max non-outlier values if there are fences
      let whiskerMin = minVal;
      let whiskerMax = maxVal;
      if (fences) {
        const nonOutliers = sorted.filter((v) => v >= fences.lower && v <= fences.upper);
        if (nonOutliers.length > 0) {
          whiskerMin = nonOutliers[0];
          whiskerMax = nonOutliers[nonOutliers.length - 1];
        }
      }

      return {
        label: ds.label || `Dataset ${index + 1}`,
        empty: false,
        color: ds.color || (index === 0 ? '#2563EB' : '#0D9488'),
        min: minVal,
        max: maxVal,
        q1: q1Val,
        median: medianVal,
        q3: q3Val,
        whiskerMin,
        whiskerMax,
        fences,
        outliers,
        count: sorted.length,
      };
    });
  }, [datasets]);

  // Overall min and max across all datasets for scale calculation
  const { globalMin, globalMax, hasValidData } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let valid = false;

    for (const ds of processedDatasets) {
      if (!ds.empty) {
        valid = true;
        if (ds.min < min) min = ds.min;
        if (ds.max > max) max = ds.max;
      }
    }

    if (!valid) return { globalMin: 0, globalMax: 10, hasValidData: false };

    // Add 10% padding to y-axis range
    if (min === max) {
      min -= 1;
      max += 1;
    } else {
      const padding = (max - min) * 0.1;
      min -= padding;
      max += padding;
    }

    return { globalMin: min, globalMax: max, hasValidData: true };
  }, [processedDatasets]);

  if (!hasValidData || processedDatasets.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-sm font-medium"
        style={{ height }}
        role="region"
        aria-label={title || 'Box Plot'}
      >
        No data yet
      </div>
    );
  }

  // SVG layout dimensions
  const svgWidth = 600;
  const svgHeight = height;
  const padding = { top: title ? 40 : 25, right: 30, bottom: 45, left: 60 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  // Y-value to pixel coordinate (SVG y=0 is top)
  const getY = (val) => {
    if (val === null || val === undefined || isNaN(val)) return 0;
    const ratio = (val - globalMin) / (globalMax - globalMin);
    return padding.top + plotHeight * (1 - ratio);
  };

  // Generate 5 y-axis tick marks
  const numTicks = 5;
  const yTicks = [];
  for (let i = 0; i < numTicks; i++) {
    const val = globalMin + (i * (globalMax - globalMin)) / (numTicks - 1);
    yTicks.push({
      value: round(val, 2),
      y: getY(val),
    });
  }

  const dsCount = processedDatasets.length;
  const colWidth = plotWidth / dsCount;
  const boxWidth = Math.min(80, colWidth * 0.45);

  return (
    <div className="w-full flex flex-col items-center select-none" style={{ height }}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={title || 'Box plot chart'}
      >
        {/* Title */}
        {title && (
          <text
            x={svgWidth / 2}
            y={20}
            textAnchor="middle"
            className="fill-slate-800 text-sm font-semibold"
            style={{ fontSize: '14px', fontWeight: '600' }}
          >
            {title}
          </text>
        )}

        {/* Y Axis Grid lines and labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={padding.left + plotWidth}
              y2={tick.y}
              stroke="#E2E8F0"
              strokeDasharray={i === 0 ? 'none' : '3 3'}
            />
            <text
              x={padding.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-slate-500"
              style={{ fontSize: '11px' }}
            >
              {tick.value}
            </text>
          </g>
        ))}

        {/* Y-axis Label */}
        {yLabel && (
          <text
            x={-(padding.top + plotHeight / 2)}
            y={16}
            transform="rotate(-90)"
            textAnchor="middle"
            className="fill-slate-500"
            style={{ fontSize: '12px' }}
          >
            {yLabel}
          </text>
        )}

        {/* X Axis line */}
        <line
          x1={padding.left}
          y1={padding.top + plotHeight}
          x2={padding.left + plotWidth}
          y2={padding.top + plotHeight}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Datasets Box Plots */}
        {processedDatasets.map((ds, index) => {
          if (ds.empty) return null;

          const centerX = padding.left + colWidth * index + colWidth / 2;
          const yQ1 = getY(ds.q1);
          const yQ3 = getY(ds.q3);
          const yMedian = getY(ds.median);
          const yWhiskerMin = getY(ds.whiskerMin);
          const yWhiskerMax = getY(ds.whiskerMax);

          const boxTop = Math.min(yQ1, yQ3);
          const boxHeight = Math.max(Math.abs(yQ1 - yQ3), 2); // At least 2px height

          const capWidth = boxWidth * 0.4;

          return (
            <g key={index} className="transition-all duration-300">
              {/* Lower whisker line */}
              <line
                x1={centerX}
                y1={yQ1}
                x2={centerX}
                y2={yWhiskerMin}
                stroke={ds.color}
                strokeWidth={1.5}
              />
              {/* Lower whisker cap */}
              <line
                x1={centerX - capWidth / 2}
                y1={yWhiskerMin}
                x2={centerX + capWidth / 2}
                y2={yWhiskerMin}
                stroke={ds.color}
                strokeWidth={1.5}
              />

              {/* Upper whisker line */}
              <line
                x1={centerX}
                y1={yQ3}
                x2={centerX}
                y2={yWhiskerMax}
                stroke={ds.color}
                strokeWidth={1.5}
              />
              {/* Upper whisker cap */}
              <line
                x1={centerX - capWidth / 2}
                y1={yWhiskerMax}
                x2={centerX + capWidth / 2}
                y2={yWhiskerMax}
                stroke={ds.color}
                strokeWidth={1.5}
              />

              {/* IQR Box */}
              <rect
                x={centerX - boxWidth / 2}
                y={boxTop}
                width={boxWidth}
                height={boxHeight}
                fill={ds.color}
                fillOpacity={0.25}
                stroke={ds.color}
                strokeWidth={2}
                rx={3}
              />

              {/* Median Line */}
              <line
                x1={centerX - boxWidth / 2}
                y1={yMedian}
                x2={centerX + boxWidth / 2}
                y2={yMedian}
                stroke={ds.color}
                strokeWidth={3}
              />

              {/* Outliers */}
              {ds.outliers.map((val, outIdx) => {
                const yOut = getY(val);
                return (
                  <circle
                    key={outIdx}
                    cx={centerX}
                    cy={yOut}
                    r={4}
                    fill="#DC2626"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  >
                    <title>{`Outlier: ${val}`}</title>
                  </circle>
                );
              })}

              {/* Dataset Label below axis */}
              <text
                x={centerX}
                y={padding.top + plotHeight + 20}
                textAnchor="middle"
                className="fill-slate-700 font-medium"
                style={{ fontSize: '12px' }}
              >
                {ds.label}
              </text>

              {/* Quick stats badges on hover or inline info */}
              <text
                x={centerX}
                y={padding.top + plotHeight + 35}
                textAnchor="middle"
                className="fill-slate-400"
                style={{ fontSize: '10px' }}
              >
                {`Med: ${round(ds.median, 1)} | IQR: ${round(ds.q3 - ds.q1, 1)}`}
              </text>
            </g>
          );
        })}

        {/* X-axis title if provided */}
        {xLabel && (
          <text
            x={svgWidth / 2}
            y={svgHeight - 2}
            textAnchor="middle"
            className="fill-slate-500"
            style={{ fontSize: '12px' }}
          >
            {xLabel}
          </text>
        )}
      </svg>
    </div>
  );
}
