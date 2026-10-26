/**
 * dataGenerator.js
 * Pure data-generation functions — no React dependencies.
 * All generators return number[] rounded to `decimals` decimal places.
 */

import { round, q1, q3, iqr } from './stats.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * If allowNegative is false, maps all values to their absolute value.
 * @param {number[]} data
 * @param {boolean} allowNegative
 * @returns {number[]}
 */
export function applyAllowNegative(data, allowNegative) {
  if (allowNegative) return data;
  return data.map((v) => Math.abs(v));
}

/**
 * Rounds every element in the array to `decimals` decimal places.
 * @param {number[]} data
 * @param {number} decimals
 * @returns {number[]}
 */
export function roundAll(data, decimals) {
  return data.map((v) => round(v, decimals));
}

// ─── Individual Generators ────────────────────────────────────────────────────

/**
 * Generates n values uniformly distributed in [min, max].
 */
export function generateUniform(n, min, max, decimals, allowNegative) {
  const data = Array.from({ length: n }, () => min + Math.random() * (max - min));
  return roundAll(applyAllowNegative(data, allowNegative), decimals);
}

/**
 * Generates n values from a normal distribution using the Box-Muller transform.
 * Values are clamped to [mean - 4*sd, mean + 4*sd].
 */
export function generateNormal(n, mean, sd, decimals, allowNegative) {
  const data = [];
  while (data.length < n) {
    const u1 = Math.random() || 1e-10; // avoid log(0)
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const value = mean + z * sd;
    // Clamp to mean ± 4*sd
    if (value >= mean - 4 * sd && value <= mean + 4 * sd) {
      data.push(value);
    }
  }
  return roundAll(applyAllowNegative(data, allowNegative), decimals);
}

/**
 * Generates n positively skewed values via log-normal, rescaled to [min, max].
 * Most values cluster near min with a long tail toward max.
 */
export function generatePositivelySkewed(n, min, max, decimals, allowNegative) {
  // Generate log-normal raw values (mean=0, sd=1 in log-space)
  const raw = Array.from({ length: n }, () => {
    const u1 = Math.random() || 1e-10;
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return Math.exp(z); // log-normal
  });
  // Rescale to [min, max]
  const rawMin = Math.min(...raw);
  const rawMax = Math.max(...raw);
  const span = rawMax - rawMin || 1;
  const data = raw.map((v) => min + ((v - rawMin) / span) * (max - min));
  return roundAll(applyAllowNegative(data, allowNegative), decimals);
}

/**
 * Generates n negatively skewed values by mirroring positively skewed data
 * around the midpoint of [min, max].
 */
export function generateNegativelySkewed(n, min, max, decimals, allowNegative) {
  const pos = generatePositivelySkewed(n, min, max, 10, allowNegative);
  const midpoint = (min + max) / 2;
  const data = pos.map((v) => 2 * midpoint - v);
  return roundAll(data, decimals);
}

/**
 * Generates n observations from a binomial distribution.
 * Each observation = count of successes across `trials` Bernoulli(p) trials.
 */
export function generateBinomial(n, trials, p, decimals, allowNegative) {
  const data = Array.from({ length: n }, () => {
    let successes = 0;
    for (let i = 0; i < trials; i++) {
      if (Math.random() < p) successes++;
    }
    return successes;
  });
  return roundAll(applyAllowNegative(data, allowNegative), decimals);
}

/**
 * Injects `count` extreme outlier values into data.
 * Lower outliers = Q1 - 3*IQR, upper outliers = Q3 + 3*IQR.
 * Alternates low/high when count > 1.
 * @param {number[]} data
 * @param {number} count
 * @returns {number[]}
 */
export function injectOutliers(data, count = 2) {
  if (!data || data.length === 0) return data;
  const q1v = q1(data);
  const q3v = q3(data);
  const iqrv = iqr(data);
  const lowerOutlier = q1v - 3 * iqrv;
  const upperOutlier = q3v + 3 * iqrv;
  const outliers = [];
  for (let i = 0; i < count; i++) {
    outliers.push(i % 2 === 0 ? upperOutlier : lowerOutlier);
  }
  return [...data, ...outliers];
}

// ─── Master Generator ─────────────────────────────────────────────────────────

/**
 * Master generator function. Routes to the appropriate sub-generator,
 * optionally injects outliers, and returns the final number[].
 *
 * @param {object} config
 * @param {'uniform'|'normal'|'positively-skewed'|'negatively-skewed'|'binomial'} config.distribution
 * @param {number} config.n
 * @param {number} config.min
 * @param {number} config.max
 * @param {number} config.decimals
 * @param {boolean} config.allowNegative
 * @param {boolean} config.includeOutliers
 * @param {number} [config.trials]   — binomial only
 * @param {number} [config.p]        — binomial only
 * @returns {number[]}
 */
export function generate(config) {
  const {
    distribution,
    n,
    min,
    max,
    decimals,
    allowNegative,
    includeOutliers,
    trials = 10,
    p = 0.5,
  } = config;

  let data;
  switch (distribution) {
    case 'normal':
      // For normal, min/max are reinterpreted as mean/sd
      data = generateNormal(n, min, max, decimals, allowNegative);
      break;
    case 'positively-skewed':
      data = generatePositivelySkewed(n, min, max, decimals, allowNegative);
      break;
    case 'negatively-skewed':
      data = generateNegativelySkewed(n, min, max, decimals, allowNegative);
      break;
    case 'binomial':
      data = generateBinomial(n, trials, p, decimals, allowNegative);
      break;
    case 'uniform':
    default:
      data = generateUniform(n, min, max, decimals, allowNegative);
      break;
  }

  if (includeOutliers && data.length >= 4) {
    data = injectOutliers(data, 2);
  }

  return data;
}
