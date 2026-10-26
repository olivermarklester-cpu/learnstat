/**
 * DatasetGenerator.jsx
 * Full UI panel for generating and managing datasets.
 *
 * Props:
 *   onDataChange(data, stats)  — called whenever data changes
 *   topicId                    — string, used to customise stat display
 *   showStats                  — boolean, whether to render the stats panel
 */

import { useState, useEffect, useRef } from 'react';
import { useDataset } from '../../hooks/useDataset.js';

function ChevronUpIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DISTRIBUTIONS = [
  { value: 'uniform', label: 'Uniform' },
  { value: 'normal', label: 'Approximately Normal' },
  { value: 'positively-skewed', label: 'Positively Skewed' },
  { value: 'negatively-skewed', label: 'Negatively Skewed' },
  { value: 'binomial', label: 'Binomial' },
  { value: 'custom', label: 'Custom Entry' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value }) {
  return (
    <div className="bg-background rounded-lg p-3 text-center">
      <div className="text-xs text-textMuted mb-1">{label}</div>
      <div className="text-sm font-bold text-textDark">
        {value === null || value === undefined ? '—' : String(value)}
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <p className="text-xs font-semibold text-textMuted uppercase tracking-wide mb-3">
      {title}
    </p>
  );
}

function TextInput({ label, id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-textDark mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
    </div>
  );
}

function PrimaryButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-white border border-border text-textDark rounded-lg px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DatasetGenerator({ onDataChange, topicId, showStats = true }) {
  const [configOpen, setConfigOpen] = useState(true);
  const [customText, setCustomText] = useState('');
  const [addValueInput, setAddValueInput] = useState('');
  const [showCalc, setShowCalc] = useState(false);

  const dataset = useDataset();
  const {
    data,
    config,
    isSorted,
    error,
    stats,
    setConfig,
    generate,
    generateNew,
    sortData,
    addValue,
    removeValue,
    clearData,
    copyData,
    downloadCSV,
    setCustomData,
  } = dataset;

  const isCustom = config.distribution === 'custom';
  const isNormal = config.distribution === 'normal';
  const isBinomial = config.distribution === 'binomial';

  // Notify parent whenever data changes
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  useEffect(() => {
    if (onDataChangeRef.current) {
      onDataChangeRef.current(data, stats);
    }
  }, [data, stats]);

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleDistributionChange(e) {
    const value = e.target.value;
    setConfig({ distribution: value });
  }

  function handleAddValue() {
    const num = parseFloat(addValueInput);
    if (!isFinite(num)) return;
    addValue(num);
    setAddValueInput('');
  }

  function handleCustomTextChange(e) {
    setCustomText(e.target.value);
    setCustomData(e.target.value);
  }

  // ── Chips display ────────────────────────────────────────────────────────────

  const MAX_CHIPS = 50;
  const visibleData = data.slice(0, MAX_CHIPS);
  const hiddenCount = data.length - MAX_CHIPS;

  // ── Stats format helper ──────────────────────────────────────────────────────

  function fmt(v) {
    if (v === null || v === undefined) return '—';
    if (typeof v === 'number') return Number(v.toFixed(4)).toString();
    return String(v);
  }

  function fmtMode(modeArr) {
    if (!modeArr || modeArr.length === 0) return '—';
    return modeArr.join(', ');
  }

  function fmtOutliers(outliersArr) {
    if (!outliersArr || outliersArr.length === 0) return 'None';
    return outliersArr.join(', ');
  }

  // ── Mean calculation walkthrough ─────────────────────────────────────────────

  const meanCalc = (() => {
    if (!stats || data.length === 0) return null;
    const s = data.reduce((acc, v) => acc + v, 0);
    return { sum: s, n: data.length, mean: s / data.length };
  })();

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border">
      {/* ── Panel Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-textDark">Dataset Generator</h2>
        <button
          onClick={() => setConfigOpen((o) => !o)}
          className="text-textMuted hover:text-textDark transition-colors"
          aria-label={configOpen ? 'Collapse configuration' : 'Expand configuration'}
        >
          {configOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Configuration Section ─────────────────────────────────────────── */}
      {configOpen && (
        <div className="px-5 py-4 space-y-4 border-b border-border">
          <SectionHeader title="Configuration" />

          {/* Row 1: Distribution */}
          <div>
            <label htmlFor="dg-distribution" className="block text-sm text-textDark mb-1">Distribution</label>
            <select
              id="dg-distribution"
              value={config.distribution}
              onChange={handleDistributionChange}
              className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              {DISTRIBUTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: n and decimals */}
          {!isCustom && (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                id="dg-n"
                label="Number of observations"
                type="number"
                min={3}
                max={200}
                value={config.n}
                onChange={(e) => setConfig({ n: Math.min(200, Math.max(3, parseInt(e.target.value) || 3)) })}
              />
              <TextInput
                id="dg-decimals"
                label="Decimal places"
                type="number"
                min={0}
                max={4}
                value={config.decimals}
                onChange={(e) => setConfig({ decimals: Math.min(4, Math.max(0, parseInt(e.target.value) || 0)) })}
              />
            </div>
          )}

          {/* Row 3: Min/Max or Mean/SD */}
          {!isCustom && !isBinomial && (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                id="dg-min"
                label={isNormal ? 'Mean' : 'Min value'}
                type="number"
                value={config.min}
                onChange={(e) => setConfig({ min: parseFloat(e.target.value) || 0 })}
              />
              <TextInput
                id="dg-max"
                label={isNormal ? 'Std deviation' : 'Max value'}
                type="number"
                value={config.max}
                onChange={(e) => setConfig({ max: parseFloat(e.target.value) || 0 })}
              />
            </div>
          )}

          {/* Row 4: Binomial params */}
          {isBinomial && (
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                id="dg-trials"
                label="Number of trials"
                type="number"
                min={1}
                max={100}
                value={config.trials}
                onChange={(e) => setConfig({ trials: Math.max(1, parseInt(e.target.value) || 1) })}
              />
              <TextInput
                id="dg-p"
                label="Probability of success (0–1)"
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={config.p}
                onChange={(e) => setConfig({ p: Math.min(1, Math.max(0, parseFloat(e.target.value) || 0)) })}
              />
            </div>
          )}

          {/* Row 5: Checkboxes */}
          {!isCustom && (
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeOutliers}
                  onChange={(e) => setConfig({ includeOutliers: e.target.checked })}
                  className="accent-primary"
                />
                Include outliers
              </label>
              <label className="flex items-center gap-2 text-sm text-textDark cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.allowNegative}
                  onChange={(e) => setConfig({ allowNegative: e.target.checked })}
                  className="accent-primary"
                />
                Allow negative numbers
              </label>
            </div>
          )}
        </div>
      )}

      {/* ── Control Buttons ───────────────────────────────────────────────── */}
      <div className="px-5 py-4 space-y-2 border-b border-border">
        {!isCustom && (
          <>
            <div className="flex flex-wrap gap-2">
              <PrimaryButton onClick={generate}>Generate Data</PrimaryButton>
              <PrimaryButton onClick={generateNew}>Generate New Dataset</PrimaryButton>
              <SecondaryButton onClick={sortData} disabled={isSorted || data.length === 0}>
                Sort Data
              </SecondaryButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <SecondaryButton
                onClick={() => {
                  const num = parseFloat(prompt('Enter a value to add:'));
                  if (isFinite(num)) addValue(num);
                }}
              >
                Add a Value
              </SecondaryButton>
              <SecondaryButton onClick={() => removeValue(data.length - 1)} disabled={data.length === 0}>
                Remove Last Value
              </SecondaryButton>
              <SecondaryButton onClick={clearData} disabled={data.length === 0}>
                Clear Data
              </SecondaryButton>
              <SecondaryButton onClick={copyData} disabled={data.length === 0}>
                Copy Data
              </SecondaryButton>
              <SecondaryButton onClick={downloadCSV} disabled={data.length === 0}>
                Download CSV
              </SecondaryButton>
            </div>
          </>
        )}
        {isCustom && (
          <div className="flex flex-wrap gap-2">
            <SecondaryButton onClick={clearData} disabled={data.length === 0}>
              Clear Data
            </SecondaryButton>
            <SecondaryButton onClick={copyData} disabled={data.length === 0}>
              Copy Data
            </SecondaryButton>
            <SecondaryButton onClick={downloadCSV} disabled={data.length === 0}>
              Download CSV
            </SecondaryButton>
          </div>
        )}
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-5 mt-3 px-4 py-2 bg-red-50 border border-red-200 text-danger rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ── Dataset Display ───────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="Dataset" />
          <span className="text-xs text-textMuted">n = {data.length} values</span>
        </div>

        {isCustom ? (
          <textarea
            className="border border-border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
            placeholder="Enter values separated by commas: 5, 7, 7, 9, 12"
            value={customText}
            onChange={handleCustomTextChange}
          />
        ) : data.length === 0 ? (
          <p className="text-sm text-textMuted italic">
            No data yet. Click "Generate Data" to get started.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {visibleData.map((v, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-primary border border-blue-200 rounded-md px-2 py-1 text-sm font-medium"
                >
                  <span className="text-xs text-textMuted mr-1">{i + 1}</span>
                  <span className="font-bold">{v}</span>
                </span>
              ))}
            </div>
            {hiddenCount > 0 && (
              <p className="text-xs text-textMuted mt-2">…and {hiddenCount} more values</p>
            )}
          </>
        )}
      </div>

      {/* ── Statistics Panel ──────────────────────────────────────────────── */}
      {showStats && (
        <div className="px-5 py-4">
          <SectionHeader title="Descriptive Statistics" />

          {!stats ? (
            <p className="text-sm text-textMuted italic">Generate a dataset to see statistics.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                <StatCard label="Count (n)" value={stats.count} />
                <StatCard label="Sum" value={fmt(stats.sum)} />
                <StatCard label="Mean" value={fmt(stats.mean)} />
                <StatCard label="Median" value={fmt(stats.median)} />
                <StatCard label="Mode" value={fmtMode(stats.mode)} />
                <StatCard label="Min" value={fmt(stats.min)} />
                <StatCard label="Max" value={fmt(stats.max)} />
                <StatCard label="Range" value={fmt(stats.range)} />
                <StatCard label="Q1" value={fmt(stats.q1)} />
                <StatCard label="Q3" value={fmt(stats.q3)} />
                <StatCard label="IQR" value={fmt(stats.iqr)} />
                <StatCard label="Variance (Sample)" value={fmt(stats.varianceSample)} />
                <StatCard label="Std Dev (Sample)" value={fmt(stats.stdDevSample)} />
                <StatCard
                  label="Lower Fence"
                  value={stats.outlierFences ? fmt(stats.outlierFences.lower) : '—'}
                />
                <StatCard
                  label="Upper Fence"
                  value={stats.outlierFences ? fmt(stats.outlierFences.upper) : '—'}
                />
                <StatCard label="Outliers" value={fmtOutliers(stats.outliers)} />
              </div>

              {/* Quartile method note */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-textMuted mb-4">
                ℹ️ This app uses the inclusive quartile method (Excel QUARTILE.INC / NumPy
                default). Values may differ slightly from other software or textbook methods.
              </div>

              {/* Show Calculation button */}
              <button
                onClick={() => setShowCalc((s) => !s)}
                className="text-sm text-primary hover:underline font-medium"
              >
                {showCalc ? 'Hide Calculation' : 'Show Calculation'}
              </button>

              {/* Mean calculation walkthrough */}
              {showCalc && meanCalc && (
                <div className="mt-3 bg-background rounded-lg p-4 text-sm text-textDark space-y-2 border border-border">
                  <p className="font-semibold">Mean — Step-by-step</p>
                  <p>
                    <span className="font-medium">Step 1:</span> Add all values together.
                  </p>
                  <p className="font-mono text-xs bg-card rounded px-2 py-1 border border-border overflow-x-auto whitespace-nowrap">
                    {data.join(' + ')} = {Number(meanCalc.sum.toFixed(6))}
                  </p>
                  <p>
                    <span className="font-medium">Step 2:</span> Divide by the number of
                    observations (n = {meanCalc.n}).
                  </p>
                  <p className="font-mono text-xs bg-card rounded px-2 py-1 border border-border">
                    {Number(meanCalc.sum.toFixed(6))} ÷ {meanCalc.n} ={' '}
                    {Number((meanCalc.mean).toFixed(4))}
                  </p>
                  <p>
                    <span className="font-medium">Mean =</span>{' '}
                    <span className="text-primary font-bold">{fmt(stats.mean)}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
