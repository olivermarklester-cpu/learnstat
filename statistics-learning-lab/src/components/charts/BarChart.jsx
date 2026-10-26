import React, { useMemo } from 'react';
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

// Register only required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * BarChart component
 *
 * Generic categorical bar chart for frequency tables, nominal data, and discrete values.
 *
 * @param {Object} props
 * @param {string[]} [props.labels=[]] - Category labels
 * @param {number[]} [props.values=[]] - Bar heights / counts
 * @param {string} [props.title=''] - Chart title
 * @param {string} [props.xLabel=''] - X-axis label
 * @param {string} [props.yLabel='Count'] - Y-axis label
 * @param {string} [props.color='#2563EB'] - Bar fill color
 * @param {number} [props.height=280] - Chart height in px
 * @param {boolean} [props.horizontal=false] - If true, displays as horizontal bar chart
 */
export default function BarChart({
  labels = [],
  values = [],
  title = '',
  xLabel = '',
  yLabel = 'Count',
  color = '#2563EB',
  height = 280,
  horizontal = false,
}) {
  const hasData = useMemo(() => {
    return (
      Array.isArray(labels) &&
      Array.isArray(values) &&
      labels.length > 0 &&
      values.length > 0 &&
      values.some((v) => typeof v === 'number' && !isNaN(v))
    );
  }, [labels, values]);

  const chartData = useMemo(() => {
    if (!hasData) return null;

    return {
      labels: labels.map((l) => String(l)),
      datasets: [
        {
          label: yLabel || 'Count',
          data: values,
          backgroundColor: color,
          borderColor: color,
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 48,
        },
      ],
    };
  }, [hasData, labels, values, yLabel, color]);

  if (!hasData || !chartData) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg text-slate-400 text-sm font-medium"
        style={{ height }}
        role="region"
        aria-label={title || 'Bar Chart'}
      >
        No data yet
      </div>
    );
  }

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
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
          label: (item) => `${item.dataset.label || 'Value'}: ${item.raw}`,
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
        },
        grid: {
          display: horizontal,
          color: '#E2E8F0',
        },
        beginAtZero: horizontal,
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
          display: !horizontal,
          color: '#E2E8F0',
        },
        beginAtZero: !horizontal,
      },
    },
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Bar data={chartData} options={options} aria-label={title || 'Bar chart'} />
    </div>
  );
}
