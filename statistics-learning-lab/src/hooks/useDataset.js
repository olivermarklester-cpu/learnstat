/**
 * useDataset.js
 * React hook for managing dataset state and operations.
 * Uses useReducer for predictable state transitions.
 */

import { useReducer, useMemo, useEffect } from 'react';
import { descriptiveStats } from '../utils/stats.js';
import { generate as generateData } from '../utils/dataGenerator.js';

// ─── Default Config ───────────────────────────────────────────────────────────

export const DEFAULT_CONFIG = {
  distribution: 'uniform',
  n: 20,
  min: 1,
  max: 100,
  decimals: 0,
  allowNegative: false,
  includeOutliers: false,
  trials: 10,
  p: 0.5,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

const initialState = (config) => ({
  data: [],
  config: { ...DEFAULT_CONFIG, ...config },
  isSorted: false,
  error: null,
});

function reducer(state, action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, isSorted: false, error: null };

    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };

    case 'SORT_DATA': {
      const sorted = [...state.data].sort((a, b) => a - b);
      return { ...state, data: sorted, isSorted: true };
    }

    case 'ADD_VALUE':
      return {
        ...state,
        data: [...state.data, action.payload],
        isSorted: false,
        error: null,
      };

    case 'REMOVE_VALUE': {
      const next = [...state.data];
      next.splice(action.payload, 1);
      return { ...state, data: next, isSorted: false };
    }

    case 'CLEAR_DATA':
      return { ...state, data: [], isSorted: false, error: null };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {Partial<typeof DEFAULT_CONFIG>} [initialConfig]
 */
export function useDataset(initialConfig = {}) {
  const [state, dispatch] = useReducer(reducer, initialConfig, initialState);

  // Generate initial dataset on mount
  useEffect(() => {
    const data = generateData({ ...DEFAULT_CONFIG, ...initialConfig });
    dispatch({ type: 'SET_DATA', payload: data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => descriptiveStats(state.data), [state.data]);

  // ── Actions ────────────────────────────────────────────────────────────────

  /** Replace generator config (partial update). */
  function setConfig(partial) {
    dispatch({ type: 'SET_CONFIG', payload: partial });
  }

  /** Generate a fresh dataset using current config. */
  function generate() {
    const data = generateData(state.config);
    dispatch({ type: 'SET_DATA', payload: data });
  }

  /** Alias for generate — UI uses both labels. */
  const generateNew = generate;

  /** Sort data ascending. */
  function sortData() {
    dispatch({ type: 'SORT_DATA' });
  }

  /** Append a single value. */
  function addValue(num) {
    dispatch({ type: 'ADD_VALUE', payload: num });
  }

  /** Remove value at index. */
  function removeValue(index) {
    dispatch({ type: 'REMOVE_VALUE', payload: index });
  }

  /** Clear all data. */
  function clearData() {
    dispatch({ type: 'CLEAR_DATA' });
  }

  /** Copy comma-separated values to clipboard. */
  function copyData() {
    if (state.data.length === 0) return;
    navigator.clipboard.writeText(state.data.join(', ')).catch(() => {});
  }

  /** Download data as a CSV file with a "value" header. */
  function downloadCSV() {
    if (state.data.length === 0) return;
    const csvContent = 'value\n' + state.data.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Parse a comma-or-whitespace-separated string, validate, and set as data.
   * Sets error if any token is not a finite number.
   * @param {string} raw
   */
  function setCustomData(raw) {
    const tokens = raw
      .split(/[,\s]+/)
      .filter((t) => t.trim() !== '');

    if (tokens.length === 0) {
      dispatch({ type: 'CLEAR_DATA' });
      return;
    }

    const parsed = tokens.map((t) => parseFloat(t));
    const invalid = parsed.some((v) => !isFinite(v));

    if (invalid) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Invalid input: all values must be numbers (e.g. 5, 7.5, -3).',
      });
      return;
    }

    dispatch({ type: 'SET_DATA', payload: parsed });
  }

  return {
    data: state.data,
    config: state.config,
    isSorted: state.isSorted,
    error: state.error,
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
  };
}
