import React, { useId, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { mean as calcMean, median as calcMedian, round } from '../../utils/stats';

// Register only required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * HistogramChart component
 *
 * @param {Object} props
 * @param {number[]} props.data - Raw numeric values to bin
 * @param {number} [props.bins=10] - Number of bins (min 3, max 20)
 * @param {string} [props.title] - Chart title
 * @param {string} [props.xLabel] - X-axis label
 * @param {string} [props.yLabel="Frequency"] - Y-axis label
 * @param {boolean} [props.showMean=false] - Draw dashed vertical line at mean
 * @param {boolean} [props.showMedian=false] - Draw dashed vertical line at median
 * @param {string} [props.color="#2563EB"] - Bar fill color
 * @param {number} [props.height=300] - Chart height in px
 */
export default function HistogramChart({
  data = [],
  bins = 10,
  title = '',
  xLabel = '',
  yLabel = 'Frequency',
  showMean = false,
  showMedian = false,
  color = '#2563EB',
  height = 300,
}) {
  const chartInstanceId = useId();

  // Validate and sanitize data
  const validData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((v) => typeof v === 'number' && isFinite(v));
  }, [data]);

  const numBins = Math.max(3, Math.min(20, Math.floor(bins) || 10));

  const { chartData, meanVal, medianVal, binEdges } = useMemo(() => {
    if (validData.length === 0) {
      return { chartData: null, meanVal: null, medianVal: null, binEdges: [] };
    }

    const minVal = Math.min(...validData);
    const maxVal = Math.max(...validData);
    const calculatedMean = calcMean(validData);
    const calculatedMedian = calcMedian(validData);

    // If all values are the same or single element
    if (minVal === maxVal) {
      const label = `${round(minVal, 2)}`;
      return {
        chartData: {
          labels: [label],
          datasets: [
            {
              label: 'Frequency',
              data: [validData.length],
              backgroundColor: color,
              borderColor: '#1D4ED8',
              borderWidth: 1,
              categoryPercentage: 1.0,
              barPercentage: 1.0,
            },
          ],
        },
        meanVal: calculatedMean,
        medianVal: calculatedMedian,
        binEdges: [minVal, maxVal],
      };
    }

    const binWidth = (maxVal - minVal) / numBins;
    const edges = [];
    for (let i = 0; i <= numBins; i++) {
      edges.push(minVal + i * binWidth);
    }

    const counts = new Array(numBins).fill(0);
    for (const val of validData) {
      if (val === maxVal) {
        counts[numBins - 1]++;
      } else {
        const binIndex = Math.floor((val - minVal) / binWidth);
        const clampedIndex = Math.min(Math.max(0, binIndex), numBins - 1);
        counts[clampedIndex]++;
      }
    }

    const labels = [];
    for (let i = 0; i < numBins; i++) {
      const left = round(edges[i], 2);
      const right = round(edges[i + 1], 2);
      labels.push(`${left}–${right}`);
    }

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: 'Frequency',
            data: counts,
            backgroundColor: color,
            borderColor: '#1D4ED8',
            borderWidth: 1,
            categoryPercentage: 1.0,
            barPercentage: 1.0,
          },
        ],
      },
      meanVal: calculatedMean,
      medianVal: calculatedMedian,
      binEdges: edges,
    };
  }, [validData, numBins, color]);

  // Custom plugin to draw mean and median vertical dashed lines
  const customLinesPlugin = useMemo(() => {
    return {
      id: `histogramLines_${chartInstanceId.replace(/[^a-zA-Z0-9]/g, '_')}`,
      afterDraw(chart) {
        if (!showMean && !showMedian) return;
        if (!binEdges || binEdges.length < 2) return;

        const {
          ctx,
          chartArea: { top, bottom, left, right },
        } = chart;

        const minEdge = binEdges[0];
        const maxEdge = binEdges[binEdges.length - 1];
        const span = maxEdge - minEdge;
        if (span <= 0) return;

        const getXCoord = (val) => {
          if (val === null || val === undefined || isNaN(val)) return null;
          const ratio = (val - minEdge) / span;
          return left + ratio * (right - left);
        };

        ctx.save();

        if (showMean && meanVal !== null) {
          const x = getXCoord(meanVal);
          if (x !== null && x >= left && x <= right) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = '#DC2626'; // Red for mean
            ctx.lineWidth = 2;
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#DC2626';
            ctx.font = '11px sans-serif';
            ctx.fillText(`Mean: ${round(meanVal, 2)}`, x + 4, top + 14);
          }
        }

        if (showMedian && medianVal !== null) {
          const x = getXCoord(medianVal);
          if (x !== null && x >= left && x <= right) {
            ctx.beginPath();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = '#059669'; // Green/emerald for median
            ctx.lineWidth = 2;
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#059669';
            ctx.font = '11px sans-serif';
            ctx.fillText(`Median: ${round(medianVal, 2)}`, x + 4, top + 28);
          }
        }

        ctx.restore();
      },
    };
  }, [showMean, showMedian, meanVal, medianVal, binEdges, chartInstanceId]);

  if (!chartData || validData.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-sm font-medium"
        style={{ height }}
        role="region"
        aria-label={title || 'Histogram'}
      >
        No data yet
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
          bottom: 12,
        },
      },
      tooltip: {
        callbacks: {
          title: (items) => `Range: ${items[0]?.label || ''}`,
          label: (item) => `Count: ${item.raw}`,
        },
      },
    },
    scales: {
      x: {
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
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: Boolean(yLabel),
          text: yLabel,
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
          precision: 0,
        },
        grid: {
          color: '#E2E8F0',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Bar
        data={chartData}
        options={options}
        plugins={[customLinesPlugin]}
        aria-label={title || 'Histogram chart'}
      />
    </div>
  );
}
