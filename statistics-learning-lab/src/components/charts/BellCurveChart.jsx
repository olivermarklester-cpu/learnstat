import React, { useId, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { normalPDF, round } from '../../utils/stats';

// Register only required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * BellCurveChart component
 *
 * Plots the standard or custom normal distribution probability density function
 * with optional region shading and SD/z-value markers.
 *
 * @param {Object} props
 * @param {number} [props.mean=0]
 * @param {number} [props.sd=1]
 * @param {number|null} [props.shadeFrom=null] - Left z-boundary for shading
 * @param {number|null} [props.shadeTo=null] - Right z-boundary for shading
 * @param {string} [props.shadeColor='rgba(37,99,235,0.25)']
 * @param {number|null} [props.markerZ=null] - Specific z-value to highlight
 * @param {string} [props.title='']
 * @param {boolean} [props.showSDMarkers=true]
 * @param {number} [props.height=280]
 * @param {string} [props.xLabel='']
 */
export default function BellCurveChart({
  mean = 0,
  sd = 1,
  shadeFrom = null,
  shadeTo = null,
  shadeColor = 'rgba(37, 99, 235, 0.25)',
  markerZ = null,
  title = '',
  showSDMarkers = true,
  height = 280,
  xLabel = '',
}) {
  const chartInstanceId = useId();
  const validSd = typeof sd === 'number' && sd > 0 ? sd : 1;
  const validMean = typeof mean === 'number' && isFinite(mean) ? mean : 0;

  // Generate curve points (using linear x, y objects for LinearScale)
  const { points, xMin, xMax } = useMemo(() => {
    const min = validMean - 4 * validSd;
    const max = validMean + 4 * validSd;
    const numPoints = 200;
    const step = (max - min) / (numPoints - 1);

    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      const x = min + i * step;
      const y = normalPDF(x, validMean, validSd) || 0;
      pts.push({ x, y });
    }

    return { points: pts, xMin: min, xMax: max };
  }, [validMean, validSd]);

  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Probability Density',
          data: points,
          borderColor: '#2563EB',
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.4,
          fill: false,
        },
      ],
    };
  }, [points]);

  // Custom plugin to draw shaded area under the curve and markers
  const customNormalPlugin = useMemo(() => {
    return {
      id: `bellCurvePlugin_${chartInstanceId.replace(/[^a-zA-Z0-9]/g, '_')}`,
      beforeDraw(chart) {
        const {
          ctx,
          scales: { x: xScale, y: yScale },
        } = chart;

        if (!xScale || !yScale) return;

        // 1. Draw Shaded Region between shadeFrom and shadeTo
        if (shadeFrom !== null || shadeTo !== null) {
          const zLeft = shadeFrom !== null ? shadeFrom : -4;
          const zRight = shadeTo !== null ? shadeTo : 4;

          const xLeftVal = validMean + zLeft * validSd;
          const xRightVal = validMean + zRight * validSd;

          const startX = Math.max(xMin, Math.min(xMax, xLeftVal));
          const endX = Math.max(xMin, Math.min(xMax, xRightVal));

          if (startX < endX) {
            ctx.save();
            ctx.beginPath();

            const yBaseline = yScale.getPixelForValue(0);
            const firstPixelX = xScale.getPixelForValue(startX);
            ctx.moveTo(firstPixelX, yBaseline);

            // Trace the curve points within [startX, endX]
            const steps = 60;
            const stepVal = (endX - startX) / steps;
            for (let i = 0; i <= steps; i++) {
              const curX = startX + i * stepVal;
              const curY = normalPDF(curX, validMean, validSd) || 0;
              const px = xScale.getPixelForValue(curX);
              const py = yScale.getPixelForValue(curY);
              ctx.lineTo(px, py);
            }

            const lastPixelX = xScale.getPixelForValue(endX);
            ctx.lineTo(lastPixelX, yBaseline);
            ctx.closePath();

            ctx.fillStyle = shadeColor;
            ctx.fill();
            ctx.restore();
          }
        }
      },
      afterDraw(chart) {
        const {
          ctx,
          chartArea: { top, bottom, left, right },
          scales: { x: xScale },
        } = chart;

        if (!xScale) return;

        ctx.save();

        // 2. Draw SD Markers (-3, -2, -1, 0, 1, 2, 3)
        if (showSDMarkers) {
          const sdOffsets = [-3, -2, -1, 0, 1, 2, 3];
          sdOffsets.forEach((sdMultiplier) => {
            const xVal = validMean + sdMultiplier * validSd;
            const xPx = xScale.getPixelForValue(xVal);

            if (xPx >= left && xPx <= right) {
              const isMean = sdMultiplier === 0;
              ctx.beginPath();
              ctx.setLineDash(isMean ? [4, 4] : [2, 4]);
              ctx.strokeStyle = isMean ? 'rgba(37, 99, 235, 0.6)' : 'rgba(148, 163, 184, 0.4)';
              ctx.lineWidth = isMean ? 1.5 : 1;
              ctx.moveTo(xPx, top);
              ctx.lineTo(xPx, bottom);
              ctx.stroke();
            }
          });
        }

        // 3. Draw markerZ if provided
        if (markerZ !== null && typeof markerZ === 'number' && isFinite(markerZ)) {
          const markerXVal = validMean + markerZ * validSd;
          const markerXPx = xScale.getPixelForValue(markerXVal);

          if (markerXPx >= left && markerXPx <= right) {
            ctx.beginPath();
            ctx.setLineDash([]);
            ctx.strokeStyle = '#EA580C'; // Orange marker
            ctx.lineWidth = 2;
            ctx.moveTo(markerXPx, top);
            ctx.lineTo(markerXPx, bottom);
            ctx.stroke();

            // Marker Badge
            const label = `z = ${round(markerZ, 2)}`;
            ctx.font = 'bold 11px sans-serif';
            const textWidth = ctx.measureText(label).width;
            const badgeW = textWidth + 12;
            const badgeH = 18;
            const badgeX = Math.max(left, Math.min(right - badgeW, markerXPx - badgeW / 2));
            const badgeY = top + 4;

            ctx.fillStyle = '#EA580C';
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
            } else {
              ctx.rect(badgeX, badgeY, badgeW, badgeH);
            }
            ctx.fill();

            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, badgeX + badgeW / 2, badgeY + badgeH / 2);
          }
        }

        ctx.restore();
      },
    };
  }, [
    validMean,
    validSd,
    shadeFrom,
    shadeTo,
    shadeColor,
    markerZ,
    showSDMarkers,
    xMin,
    xMax,
    chartInstanceId,
  ]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: Boolean(title),
        text: title,
        color: '#1E293B',
        font: {
          size: 14,
          weight: '600',
        },
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        callbacks: {
          title: (items) => {
            const x = items[0]?.parsed?.x;
            if (x === undefined) return '';
            const z = (x - validMean) / validSd;
            return `x: ${round(x, 2)} (z = ${round(z, 2)})`;
          },
          label: (item) => `Density: ${round(item.parsed.y, 4)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: xMin,
        max: xMax,
        title: {
          display: Boolean(xLabel),
          text: xLabel,
          color: '#64748B',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#64748B',
          font: {
            size: 11,
          },
          callback: (value) => round(value, 1),
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        title: {
          display: false,
        },
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Line
        data={chartData}
        options={options}
        plugins={[customNormalPlugin]}
        aria-label={title || 'Normal distribution bell curve'}
      />
    </div>
  );
}
