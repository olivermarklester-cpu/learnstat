/**
 * stats.js — Statistics Utility Library
 *
 * Single source of truth for all statistical calculations in the Statistics
 * Learning Lab. Every topic component calls these functions; no topic
 * re-implements math inline.
 *
 * All functions are pure — they do not mutate inputs and have no side effects.
 */

// ─── Helper ──────────────────────────────────────────────────────────────────

/**
 * Rounds a number to the specified number of decimal places.
 * Handles NaN, Infinity, and null gracefully.
 *
 * @param {number} value    - The number to round.
 * @param {number} decimals - Number of decimal places (default 2).
 * @returns {number|null}   - Rounded number, or null for non-finite inputs.
 */
export function round(value, decimals = 2) {
  if (value === null || value === undefined) return null;
  if (!isFinite(value) || isNaN(value)) return null;
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ─── Core Array Utilities ─────────────────────────────────────────────────────

/**
 * Returns a new array sorted in ascending order. Does NOT mutate the input.
 *
 * @param {number[]} arr - Input array.
 * @returns {number[]}   - New sorted array.
 */
export function sortAsc(arr) {
  return [...arr].sort((a, b) => a - b);
}

/**
 * Returns the sum of all values in the array.
 *
 * @param {number[]} arr - Input array.
 * @returns {number}     - Sum of all elements, or 0 for an empty array.
 */
export function sum(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((acc, v) => acc + v, 0);
}

/**
 * Returns the number of elements in the array.
 *
 * @param {number[]} arr - Input array.
 * @returns {number}     - Length of the array.
 */
export function count(arr) {
  if (!arr) return 0;
  return arr.length;
}

// ─── Central Tendency ─────────────────────────────────────────────────────────

/**
 * Computes the arithmetic mean (average) of all values.
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Mean value, or null for empty array.
 */
export function mean(arr) {
  if (!arr || arr.length === 0) return null;
  return sum(arr) / arr.length;
}

/**
 * Computes the median (middle value) of the dataset.
 * Sorts the array first. For odd n, returns the middle element.
 * For even n, returns the average of the two middle elements.
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Median value, or null for empty array.
 */
export function median(arr) {
  if (!arr || arr.length === 0) return null;
  const sorted = sortAsc(arr);
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Computes the mode(s) of the dataset.
 * Returns an empty array if all values are unique (no mode),
 * or an array of the most-frequent value(s) if any frequency > 1.
 * Multiple modes are returned in ascending order.
 *
 * @param {number[]} arr - Input array.
 * @returns {number[]}   - Array of mode value(s), or [] if no mode exists.
 */
export function mode(arr) {
  if (!arr || arr.length === 0) return [];

  // Build frequency map
  const freq = new Map();
  for (const v of arr) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }

  const maxFreq = Math.max(...freq.values());

  // No mode if every value appears only once
  if (maxFreq === 1) return [];

  // Collect all values that share the max frequency, sorted ascending
  return [...freq.entries()]
    .filter(([, f]) => f === maxFreq)
    .map(([v]) => v)
    .sort((a, b) => a - b);
}

// ─── Spread ───────────────────────────────────────────────────────────────────

/**
 * Computes the range (max − min) of the dataset.
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Range value, or null for empty array.
 */
export function range(arr) {
  if (!arr || arr.length === 0) return null;
  const sorted = sortAsc(arr);
  return sorted[sorted.length - 1] - sorted[0];
}

/**
 * Returns the value at the p-th percentile (0–100) using inclusive linear
 * interpolation (equivalent to Excel QUARTILE.INC / numpy percentile default).
 *
 * Method: position = (p / 100) * (n - 1). Interpolate between the values at
 * floor(position) and ceil(position) using the fractional part.
 *
 * @param {number[]} arr - Input array.
 * @param {number}   p   - Percentile in the range [0, 100].
 * @returns {number|null} - Percentile value, or null for empty array.
 */
export function percentile(arr, p) {
  if (!arr || arr.length === 0) return null;
  const sorted = sortAsc(arr);
  const n = sorted.length;
  if (n === 1) return sorted[0];

  const pos = (p / 100) * (n - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  const frac = pos - lo;

  return sorted[lo] + frac * (sorted[hi] - sorted[lo]);
}

/**
 * Computes the first quartile (Q1 / 25th percentile) using inclusive
 * linear interpolation (Excel QUARTILE.INC).
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Q1 value, or null for empty array.
 */
export function q1(arr) {
  return percentile(arr, 25);
}

/**
 * Computes the third quartile (Q3 / 75th percentile) using inclusive
 * linear interpolation (Excel QUARTILE.INC).
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Q3 value, or null for empty array.
 */
export function q3(arr) {
  return percentile(arr, 75);
}

/**
 * Computes the interquartile range (IQR = Q3 − Q1).
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - IQR value, or null for empty array.
 */
export function iqr(arr) {
  if (!arr || arr.length === 0) return null;
  return q3(arr) - q1(arr);
}

/**
 * Computes the sample variance using Bessel's correction (divides by n−1).
 * Returns null for arrays with fewer than 2 elements.
 *
 * @param {number[]} arr - Input array (n ≥ 2).
 * @returns {number|null} - Sample variance, or null if n < 2.
 */
export function varianceSample(arr) {
  if (!arr || arr.length < 2) return null;
  const m = mean(arr);
  const squaredDeviations = arr.map((v) => (v - m) ** 2);
  return sum(squaredDeviations) / (arr.length - 1);
}

/**
 * Computes the population variance (divides by N).
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Population variance, or null for empty array.
 */
export function variancePopulation(arr) {
  if (!arr || arr.length === 0) return null;
  const m = mean(arr);
  const squaredDeviations = arr.map((v) => (v - m) ** 2);
  return sum(squaredDeviations) / arr.length;
}

/**
 * Computes the sample standard deviation (sqrt of sample variance).
 *
 * @param {number[]} arr - Input array (n ≥ 2).
 * @returns {number|null} - Sample standard deviation, or null if n < 2.
 */
export function stdDevSample(arr) {
  const v = varianceSample(arr);
  return v === null ? null : Math.sqrt(v);
}

/**
 * Computes the population standard deviation (sqrt of population variance).
 *
 * @param {number[]} arr - Input array.
 * @returns {number|null} - Population standard deviation, or null for empty array.
 */
export function stdDevPopulation(arr) {
  const v = variancePopulation(arr);
  return v === null ? null : Math.sqrt(v);
}

// ─── Z-Scores ─────────────────────────────────────────────────────────────────

/**
 * Computes the z-score for a single value given a mean and standard deviation.
 * A negative z-score means the value is below the mean.
 *
 * @param {number} x    - The observed value.
 * @param {number} m    - The mean of the distribution.
 * @param {number} sd   - The standard deviation of the distribution.
 * @returns {number|null} - The z-score, or null if sd is 0 or invalid.
 */
export function zScore(x, m, sd) {
  if (!isFinite(sd) || sd === 0) return null;
  return (x - m) / sd;
}

/**
 * Convenience wrapper: computes the z-score of x relative to a dataset.
 * Uses sample SD by default; set useSample=false for population SD.
 *
 * @param {number}   x         - The observed value.
 * @param {number[]} arr       - The reference dataset.
 * @param {boolean}  useSample - If true (default), uses sample SD; else population SD.
 * @returns {number|null}      - The z-score, or null if the dataset is too small.
 */
export function zScoreFromDataset(x, arr, useSample = true) {
  const m = mean(arr);
  const sd = useSample ? stdDevSample(arr) : stdDevPopulation(arr);
  return zScore(x, m, sd);
}

// ─── Outliers ─────────────────────────────────────────────────────────────────

/**
 * Computes the Tukey fences used to identify outliers.
 * lower = Q1 − 1.5 × IQR
 * upper = Q3 + 1.5 × IQR
 *
 * @param {number[]} arr - Input array.
 * @returns {{ lower: number, upper: number }|null} - Fence values, or null for empty array.
 */
export function outlierFences(arr) {
  if (!arr || arr.length === 0) return null;
  const q1v = q1(arr);
  const q3v = q3(arr);
  const iqrv = q3v - q1v;
  return {
    lower: q1v - 1.5 * iqrv,
    upper: q3v + 1.5 * iqrv,
  };
}

/**
 * Returns all values in the array that fall outside the Tukey fences.
 *
 * @param {number[]} arr - Input array.
 * @returns {number[]}   - Array of outlier values (may be empty).
 */
export function identifyOutliers(arr) {
  if (!arr || arr.length === 0) return [];
  const fences = outlierFences(arr);
  return arr.filter((v) => v < fences.lower || v > fences.upper);
}

// ─── Descriptive Stats Bundle ─────────────────────────────────────────────────

/**
 * Computes a complete descriptive statistics summary for the dataset.
 * All numeric values are rounded to 4 decimal places; the display layer
 * can further round to 2 for presentation.
 *
 * @param {number[]} arr - Input array.
 * @returns {object|null} - Object containing all descriptive stats, or null for empty array.
 * @returns {number}  .count
 * @returns {number}  .sum
 * @returns {number}  .mean
 * @returns {number}  .median
 * @returns {number[]} .mode
 * @returns {number}  .min
 * @returns {number}  .max
 * @returns {number}  .range
 * @returns {number}  .q1
 * @returns {number}  .q3
 * @returns {number}  .iqr
 * @returns {number}  .varianceSample
 * @returns {number}  .variancePopulation
 * @returns {number}  .stdDevSample
 * @returns {number}  .stdDevPopulation
 * @returns {{ lower: number, upper: number }} .outlierFences
 * @returns {number[]} .outliers
 */
export function descriptiveStats(arr) {
  if (!arr || arr.length === 0) return null;
  const sorted = sortAsc(arr);
  const r4 = (v) => (v === null ? null : round(v, 4));

  return {
    count: arr.length,
    sum: r4(sum(arr)),
    mean: r4(mean(arr)),
    median: r4(median(arr)),
    mode: mode(arr),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    range: r4(range(arr)),
    q1: r4(q1(arr)),
    q3: r4(q3(arr)),
    iqr: r4(iqr(arr)),
    varianceSample: r4(varianceSample(arr)),
    variancePopulation: r4(variancePopulation(arr)),
    stdDevSample: r4(stdDevSample(arr)),
    stdDevPopulation: r4(stdDevPopulation(arr)),
    outlierFences: outlierFences(arr),
    outliers: identifyOutliers(arr),
  };
}

// ─── Frequency ────────────────────────────────────────────────────────────────

/**
 * Builds a frequency table for the dataset, sorted by value ascending.
 * Each row includes absolute count, relative frequency, and cumulative
 * relative frequency.
 *
 * @param {number[]} arr - Input array.
 * @returns {Array<{ value: number, count: number, relativeFreq: number, cumulativeFreq: number }>}
 */
export function frequencyTable(arr) {
  if (!arr || arr.length === 0) return [];

  const n = arr.length;
  const freq = new Map();
  for (const v of arr) {
    freq.set(v, (freq.get(v) ?? 0) + 1);
  }

  // Sort by value ascending
  const sorted = [...freq.entries()].sort(([a], [b]) => a - b);

  let cumulative = 0;
  return sorted.map(([value, cnt]) => {
    const relativeFreq = cnt / n;
    cumulative += relativeFreq;
    return {
      value,
      count: cnt,
      relativeFreq: round(relativeFreq, 4),
      cumulativeFreq: round(cumulative, 4),
    };
  });
}

// ─── Probability Distributions ────────────────────────────────────────────────

/**
 * Computes the probability density function (PDF) of the normal distribution.
 * f(x) = (1 / (σ√(2π))) × exp(−(x−μ)² / (2σ²))
 *
 * @param {number} x    - The point at which to evaluate the PDF.
 * @param {number} m    - Mean (μ), default 0.
 * @param {number} sd   - Standard deviation (σ), default 1.
 * @returns {number}    - Probability density at x.
 */
export function normalPDF(x, m = 0, sd = 1) {
  if (sd <= 0) return null;
  const z = (x - m) / sd;
  return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
}

/**
 * Computes the cumulative distribution function (CDF) of the normal distribution
 * using the Abramowitz & Stegun rational approximation (Handbook of Mathematical
 * Functions, formula 26.2.17). Accurate to approximately 7 decimal places.
 *
 * The approximation works on the standard normal; we standardise x first.
 * For negative inputs we exploit the symmetry: Φ(−z) = 1 − Φ(z).
 *
 * @param {number} x  - The point at which to evaluate the CDF.
 * @param {number} m  - Mean (μ), default 0.
 * @param {number} sd - Standard deviation (σ), default 1.
 * @returns {number}  - Cumulative probability P(X ≤ x).
 */
export function normalCDF(x, m = 0, sd = 1) {
  if (sd <= 0) return null;

  // Standardise
  const z = (x - m) / sd;

  // Abramowitz & Stegun approximation coefficients (26.2.17)
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t *
    (0.319381530 +
      t *
        (-0.356563782 +
          t *
            (1.781477937 +
              t * (-1.821255978 + t * 1.330274429))));

  const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  const tail = pdf * poly;

  // Apply symmetry for negative z
  return z >= 0 ? 1 - tail : tail;
}

/**
 * Converts a z-score to a p-value for either a one-tailed or two-tailed test.
 * For a two-tailed test: p = 2 × P(Z > |z|).
 * For a one-tailed test: p = P(Z > z) for positive z (right tail).
 *
 * @param {number} z     - The z-score.
 * @param {number} tails - Number of tails: 1 or 2 (default 2).
 * @returns {number}     - The p-value.
 */
export function zToPValue(z, tails = 2) {
  const upperTail = 1 - normalCDF(Math.abs(z));
  return tails === 1 ? upperTail : 2 * upperTail;
}

/**
 * Computes n! (factorial) using log-space summation to handle large n safely.
 * Returns the result as a JavaScript number. For very large n the result will
 * be Infinity, but combination() uses log-space arithmetic to avoid that.
 *
 * @param {number} n - Non-negative integer.
 * @returns {number} - n!
 */
export function factorial(n) {
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Computes the binomial coefficient C(n, k) = n! / (k! × (n−k)!) using
 * log-space arithmetic to avoid overflow for large n.
 *
 * @param {number} n - Total number of trials.
 * @param {number} k - Number of successes.
 * @returns {number} - The binomial coefficient.
 */
export function combination(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  // Use the smaller of k and n-k for efficiency
  const kk = Math.min(k, n - k);

  // Log-space: log(C(n,k)) = Σ log(n-i) - Σ log(i+1) for i in [0, kk)
  let logC = 0;
  for (let i = 0; i < kk; i++) {
    logC += Math.log(n - i) - Math.log(i + 1);
  }
  return Math.round(Math.exp(logC));
}

/**
 * Computes the binomial probability mass function P(X = k).
 * P(X = k) = C(n, k) × p^k × (1−p)^(n−k)
 *
 * @param {number} k - Number of successes (0 ≤ k ≤ n).
 * @param {number} n - Number of trials.
 * @param {number} p - Probability of success on each trial (0 ≤ p ≤ 1).
 * @returns {number} - P(X = k).
 */
export function binomialPMF(k, n, p) {
  if (p < 0 || p > 1 || k < 0 || k > n) return 0;
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Computes the binomial cumulative distribution function P(X ≤ k).
 * Sums the PMF from 0 to k inclusive.
 *
 * @param {number} k - Upper bound for number of successes.
 * @param {number} n - Number of trials.
 * @param {number} p - Probability of success on each trial.
 * @returns {number} - P(X ≤ k).
 */
export function binomialCDF(k, n, p) {
  if (k < 0) return 0;
  if (k >= n) return 1;
  let cdf = 0;
  for (let i = 0; i <= k; i++) {
    cdf += binomialPMF(i, n, p);
  }
  return cdf;
}

// ─── Sampling & Inferential Statistics ───────────────────────────────────────

/**
 * Standard error of the mean: σ / √n (population SD known)
 * or s / √n (sample SD).
 *
 * @param {number} sd - Standard deviation (population σ or sample s).
 * @param {number} n  - Sample size.
 * @returns {number}  - Standard error.
 */
export function standardError(sd, n) {
  if (n <= 0) return null;
  return sd / Math.sqrt(n);
}

/**
 * Margin of error for a confidence interval:
 *   ME = criticalValue × SE
 *
 * @param {number} criticalValue - z* or t* critical value.
 * @param {number} se            - Standard error.
 * @returns {number}             - Margin of error.
 */
export function marginOfError(criticalValue, se) {
  return criticalValue * se;
}

/**
 * Builds a confidence interval [lower, upper] around a point estimate.
 *
 * @param {number} estimate - Point estimate (e.g. sample mean x̄).
 * @param {number} me       - Margin of error.
 * @returns {{ lower: number, upper: number }}
 */
export function confidenceInterval(estimate, me) {
  return { lower: estimate - me, upper: estimate + me };
}

/**
 * z-test statistic for a one-sample test about a population mean
 * when the population standard deviation (σ) is known.
 *
 * z = (x̄ − μ₀) / (σ / √n)
 *
 * @param {number} xbar  - Sample mean.
 * @param {number} mu0   - Hypothesised population mean (null hypothesis).
 * @param {number} sigma - Population standard deviation.
 * @param {number} n     - Sample size.
 * @returns {number}     - z test statistic.
 */
export function zTestStatistic(xbar, mu0, sigma, n) {
  const se = standardError(sigma, n);
  if (!se) return null;
  return (xbar - mu0) / se;
}

/**
 * Approximation of the t-distribution CDF using a normalising
 * transformation (Hill 1970 / Abramowitz & Stegun).
 * Accurate for df ≥ 1.
 *
 * Returns P(T ≤ t) for a t-distribution with `df` degrees of freedom.
 *
 * @param {number} t  - t value.
 * @param {number} df - Degrees of freedom.
 * @returns {number}  - Cumulative probability.
 */
export function tCDF(t, df) {
  if (df <= 0) return null;
  // For large df the t-distribution approaches the normal
  if (df >= 200) return normalCDF(t);

  // Use the regularised incomplete beta function via a series approximation.
  // P(T ≤ t) = 1 − (1/2) × Ix(df/2, 1/2)  where x = df/(df + t²)
  const x = df / (df + t * t);
  const ibeta = regularisedIncompleteBeta(x, df / 2, 0.5);
  const p = 0.5 * ibeta;
  return t >= 0 ? 1 - p : p;
}

/**
 * Regularised incomplete beta function I_x(a, b) using a continued
 * fraction approximation (Lentz method). Accurate for 0 ≤ x ≤ 1.
 *
 * @param {number} x - Input (0 ≤ x ≤ 1).
 * @param {number} a - Shape parameter a > 0.
 * @param {number} b - Shape parameter b > 0.
 * @returns {number}
 */
export function regularisedIncompleteBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  // Use the symmetry relation when x > (a+1)/(a+b+2) for better convergence
  if (x > (a + 1) / (a + b + 2)) {
    return 1 - regularisedIncompleteBeta(1 - x, b, a);
  }
  // Log of the beta function prefix
  const lbeta =
    lgamma(a) + lgamma(b) - lgamma(a + b);
  const prefix = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
  // Lentz continued-fraction evaluation
  return prefix * betaCF(x, a, b);
}

/**
 * Continued fraction part of the incomplete beta function (Lentz method).
 */
function betaCF(x, a, b) {
  const MAXIT = 200;
  const EPS = 3e-7;
  const FPMIN = 1e-30;
  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= MAXIT; m++) {
    // Even step
    let aa = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    // Odd step
    aa = (-(a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < EPS) break;
  }
  return h;
}

/**
 * Log-gamma function using Lanczos approximation.
 * Accurate for z > 0.
 */
export function lgamma(z) {
  const g = 7;
  const c = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  }
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

/**
 * t-distribution p-value.
 * @param {number} t     - t statistic.
 * @param {number} df    - Degrees of freedom.
 * @param {number} tails - 1 or 2.
 * @returns {number}     - p-value.
 */
export function tToPValue(t, df, tails = 2) {
  const upperTail = 1 - tCDF(Math.abs(t), df);
  return tails === 1 ? upperTail : 2 * upperTail;
}

/**
 * One-sample t-test statistic.
 *
 * t = (x̄ − μ₀) / (s / √n)
 *
 * @param {number} xbar - Sample mean.
 * @param {number} mu0  - Hypothesised population mean.
 * @param {number} s    - Sample standard deviation.
 * @param {number} n    - Sample size.
 * @returns {number}    - t statistic.
 */
export function tTestStatistic(xbar, mu0, s, n) {
  const se = standardError(s, n);
  if (!se) return null;
  return (xbar - mu0) / se;
}

/**
 * Pooled standard deviation for an independent-samples t-test.
 * sp = √[ ((n1−1)s1² + (n2−1)s2²) / (n1+n2−2) ]
 */
export function pooledSD(s1, n1, s2, n2) {
  const df = n1 + n2 - 2;
  if (df <= 0) return null;
  return Math.sqrt(((n1 - 1) * s1 * s1 + (n2 - 1) * s2 * s2) / df);
}

/**
 * Independent-samples t-test statistic (equal variance assumed).
 *
 * t = (x̄1 − x̄2) / (sp × √(1/n1 + 1/n2))
 */
export function independentTTest(xbar1, s1, n1, xbar2, s2, n2) {
  const sp = pooledSD(s1, n1, s2, n2);
  if (!sp) return null;
  const se = sp * Math.sqrt(1 / n1 + 1 / n2);
  return { t: (xbar1 - xbar2) / se, df: n1 + n2 - 2 };
}

/**
 * Paired-samples t-test statistic.
 * diffs is an array of (after − before) values for each pair.
 *
 * t = d̄ / (sd / √n),  df = n − 1
 */
export function pairedTTest(diffs) {
  const n = diffs.length;
  if (n < 2) return null;
  const dbar = mean(diffs);
  const sd = stdDevSample(diffs);
  const se = standardError(sd, n);
  return { t: dbar / se, df: n - 1, dbar, sd, se, n };
}

/**
 * Critical z-value for a given two-tailed significance level α.
 * Common values: α=0.05 → z*=1.96, α=0.01 → z*=2.576, α=0.10 → z*=1.645
 *
 * Uses the inverse normal approximation (rational approximation).
 * @param {number} alpha - Significance level (0 < α < 1).
 * @param {number} tails - 1 or 2.
 * @returns {number}     - Critical z-value (positive).
 */
export function zCritical(alpha, tails = 2) {
  const p = tails === 1 ? alpha : alpha / 2;
  return inverseNormalCDF(1 - p);
}

/**
 * Inverse normal CDF (quantile function) using the rational
 * approximation by Peter Acklam.
 * Accurate to about 9 decimal places for p in (0, 1).
 *
 * @param {number} p - Cumulative probability (0 < p < 1).
 * @returns {number} - z such that normalCDF(z) = p.
 */
export function inverseNormalCDF(p) {
  // Rational approximation coefficients
  const a = [-3.969683028665376e+01, 2.209460984245205e+02,
             -2.759285104469687e+02, 1.383577518672690e+02,
             -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02,
             -1.556989798598866e+02, 6.680131188771972e+01,
             -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01,
             -2.400758277161838e+00, -2.549732539343734e+00,
              4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01,
             2.445134137142996e+00, 3.754408661907416e+00];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
          ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
}

// ── Chi-square / ANOVA / Regression / Correlation ─────────────────────────────

/**
 * Chi-square CDF (regularised incomplete gamma function).
 * P(χ² ≤ x) for df degrees of freedom.
 *
 * Uses series expansion for small x and continued-fraction for large x.
 * @param {number} x   - Chi-square statistic (≥ 0).
 * @param {number} df  - Degrees of freedom (positive integer).
 * @returns {number}   - Cumulative probability ∈ [0, 1].
 */
export function chiSquareCDF(x, df) {
  if (x <= 0) return 0;
  return regularisedIncompleteGamma(df / 2, x / 2);
}

/**
 * Regularised lower incomplete gamma P(a, x) = γ(a,x)/Γ(a).
 * Series expansion: good for x < a + 1.
 * Continued-fraction: good for x ≥ a + 1.
 */
function regularisedIncompleteGamma(a, x) {
  if (x < 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) {
    // Series expansion
    let ap = a;
    let del = 1 / a;
    let sum2 = del;
    for (let i = 0; i < 200; i++) {
      ap += 1;
      del *= x / ap;
      sum2 += del;
      if (Math.abs(del) < Math.abs(sum2) * 1e-10) break;
    }
    return sum2 * Math.exp(-x + a * Math.log(x) - lgamma(a));
  }
  // Continued fraction (Lentz's method)
  const fpmin = 1e-300;
  let b = x + 1 - a;
  let c2 = 1 / fpmin;
  let d2 = 1 / b;
  let h = d2;
  for (let i = 1; i <= 200; i++) {
    const an = -i * (i - a);
    b += 2;
    d2 = an * d2 + b;
    if (Math.abs(d2) < fpmin) d2 = fpmin;
    c2 = b + an / c2;
    if (Math.abs(c2) < fpmin) c2 = fpmin;
    d2 = 1 / d2;
    const del2 = d2 * c2;
    h *= del2;
    if (Math.abs(del2 - 1) < 1e-10) break;
  }
  const cf = Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  return 1 - cf; // upper regularised gamma = 1 − P
}

/**
 * Chi-square test statistic for a contingency table.
 * Σ (O − E)² / E
 *
 * @param {number[][]} observed - 2D array of observed counts.
 * @param {number[][]} expected - 2D array of expected counts.
 * @returns {number}
 */
export function chiSquareStat(observed, expected) {
  let chi2 = 0;
  for (let r = 0; r < observed.length; r++) {
    for (let c = 0; c < observed[r].length; c++) {
      const o = observed[r][c];
      const e = expected[r][c];
      if (e > 0) chi2 += (o - e) ** 2 / e;
    }
  }
  return chi2;
}

/**
 * Expected frequencies for a two-way contingency table.
 * E[r][c] = (row total × col total) / grand total
 *
 * @param {number[][]} observed - 2D array.
 * @returns {number[][]}
 */
export function expectedFrequencies(observed) {
  const rowTotals = observed.map((row) => row.reduce((s, v) => s + v, 0));
  const colTotals = observed[0].map((_, c) => observed.reduce((s, row) => s + row[c], 0));
  const grandTotal = rowTotals.reduce((s, v) => s + v, 0);
  return observed.map((row, r) =>
    row.map((_, c) => (rowTotals[r] * colTotals[c]) / grandTotal)
  );
}

/**
 * Chi-square p-value.
 * @param {number} chi2  - Test statistic.
 * @param {number} df    - Degrees of freedom.
 * @returns {number}     - p-value = P(χ² > chi2).
 */
export function chiSquarePValue(chi2, df) {
  return 1 - chiSquareCDF(chi2, df);
}

// ── One-way ANOVA ─────────────────────────────────────────────────────────────

/**
 * One-way ANOVA.
 * @param {number[][]} groups - Array of group data arrays.
 * @returns {{ F, dfBetween, dfWithin, MSB, MSW, SSB, SSW, p }}
 */
export function oneWayAnova(groups) {
  const k = groups.length;
  const ns = groups.map((g) => g.length);
  const N = ns.reduce((s, n) => s + n, 0);
  const means = groups.map((g) => mean(g));
  const grandMean = mean(groups.flat());

  const SSB = means.reduce((s, m, i) => s + ns[i] * (m - grandMean) ** 2, 0);
  const SSW = groups.reduce((s, g, i) => s + g.reduce((ss, x) => ss + (x - means[i]) ** 2, 0), 0);

  const dfBetween = k - 1;
  const dfWithin = N - k;
  if (dfBetween <= 0 || dfWithin <= 0) return null;

  const MSB = SSB / dfBetween;
  const MSW = SSW / dfWithin;
  const F = MSW > 0 ? MSB / MSW : 0;
  const p = fPValue(F, dfBetween, dfWithin);

  return { F, dfBetween, dfWithin, MSB, MSW, SSB, SSW, p };
}

/**
 * F-distribution p-value = P(F > f) using the regularised incomplete beta.
 * Uses the identity: P(F_{d1,d2} > x) = I(d2/(d2+d1*x), d2/2, d1/2)
 */
export function fPValue(f, d1, d2) {
  if (f <= 0) return 1;
  const x = d2 / (d2 + d1 * f);
  return regularisedIncompleteBeta(x, d2 / 2, d1 / 2);
}

// ── Covariance & Pearson correlation ─────────────────────────────────────────

/**
 * Sample covariance of two arrays of equal length.
 * Cov = Σ(xᵢ − x̄)(yᵢ − ȳ) / (n − 1)
 */
export function covariance(x, y) {
  if (x.length !== y.length || x.length < 2) return null;
  const mx = mean(x);
  const my = mean(y);
  return x.reduce((s, xi, i) => s + (xi - mx) * (y[i] - my), 0) / (x.length - 1);
}

/**
 * Pearson correlation coefficient r.
 * r = Cov(x,y) / (sx × sy)
 */
export function pearsonR(x, y) {
  const cov = covariance(x, y);
  if (cov === null) return null;
  const sx = stdDevSample(x);
  const sy = stdDevSample(y);
  if (sx === 0 || sy === 0) return null;
  return cov / (sx * sy);
}

/**
 * t-statistic for testing H₀: ρ = 0.
 * t = r × √(n−2) / √(1−r²),  df = n−2
 */
export function correlationTStat(r, n) {
  if (Math.abs(r) >= 1) return Infinity;
  return (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
}

// ── Simple linear regression (OLS) ───────────────────────────────────────────

/**
 * OLS simple linear regression: ŷ = b0 + b1 × x
 *
 * @param {number[]} x - Predictor values.
 * @param {number[]} y - Response values.
 * @returns {{ b0, b1, rSquared, r, residuals, yHat }}
 */
export function simpleRegression(x, y) {
  if (x.length !== y.length || x.length < 2) return null;
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  const b1 = covariance(x, y) / varianceSample(x);
  const b0 = my - b1 * mx;
  const yHat = x.map((xi) => b0 + b1 * xi);
  const residuals = y.map((yi, i) => yi - yHat[i]);
  const SSRes = residuals.reduce((s, e) => s + e * e, 0);
  const SSTot = y.reduce((s, yi) => s + (yi - my) ** 2, 0);
  const rSquared = SSTot > 0 ? 1 - SSRes / SSTot : 0;
  const r = Math.sign(b1) * Math.sqrt(rSquared);
  return { b0, b1, rSquared, r, residuals, yHat, n, mx, my };
}
