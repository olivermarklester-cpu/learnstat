import TopicPage from '../../layout/TopicPage'

const content = {
  title: 'Point Estimates',
  topicGroup: 'Inferential Statistics',
  learningObjective:
    'Define a point estimate, distinguish it from a parameter, and identify common point estimators for the mean, proportion, and variance.',
  explanation: (
    <div className="space-y-3 text-textDark leading-relaxed">
      <p>
        A <strong>parameter</strong> is a fixed (but usually unknown) numerical characteristic
        of a population — for example, the population mean μ or the population proportion p.
        Because we rarely have access to the entire population, we estimate parameters using
        sample data.
      </p>
      <p>
        A <strong>point estimate</strong> is a single number calculated from sample data that
        serves as our best guess for a population parameter.
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p className="font-semibold text-blue-900 mb-2">Common point estimators</p>
        <table className="w-full text-blue-800">
          <thead>
            <tr className="border-b border-blue-200">
              <th className="text-left py-1 pr-3">Parameter</th>
              <th className="text-left py-1 pr-3">Symbol</th>
              <th className="text-left py-1">Estimator (statistic)</th>
            </tr>
          </thead>
          <tbody className="space-y-1">
            <tr><td className="py-1 pr-3">Population mean</td><td className="pr-3">μ</td><td>Sample mean x̄</td></tr>
            <tr><td className="py-1 pr-3">Population proportion</td><td className="pr-3">p</td><td>Sample proportion p̂</td></tr>
            <tr><td className="py-1 pr-3">Population variance</td><td className="pr-3">σ²</td><td>Sample variance s²</td></tr>
            <tr><td className="py-1 pr-3">Population SD</td><td className="pr-3">σ</td><td>Sample SD s</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        A good estimator is <strong>unbiased</strong> (its expected value equals the parameter)
        and <strong>efficient</strong> (low variability across samples). The sample mean x̄ is
        an unbiased estimator of μ; the sample variance s² (with n−1 in the denominator) is
        an unbiased estimator of σ².
      </p>
    </div>
  ),
  analogy: (
    <div className="space-y-2 text-textDark leading-relaxed">
      <p>
        A weather station wants to know the average daily temperature for a whole year
        but can only measure 30 days. The average of those 30 days (x̄) is the point
        estimate of the annual average (μ). It is a single number — a best guess.
      </p>
      <p className="text-sm text-gray-600">
        The limitation: a point estimate gives no indication of how uncertain it is. That
        is why we often follow up with a confidence interval — a range that reflects the
        estimate's precision.
      </p>
    </div>
  ),
  formula: {
    main: 'x̄ = Σxᵢ / n',
    variants: [
      { label: 'Sample mean (estimate of μ)', expression: 'x̄ = (Σ xᵢ) / n', latex: '\\bar{x} = \\frac{\\sum x_i}{n}' },
      { label: 'Sample proportion (estimate of p)', expression: 'p̂ = x / n', latex: '\\hat{p} = \\frac{x}{n}' },
      { label: 'Sample variance (unbiased estimate of σ²)', expression: 's² = Σ(xᵢ − x̄)² / (n−1)', latex: 's^{2} = \\frac{\\sum(x_i - \\bar{x})^{2}}{n-1}' },
    ],
    symbolGuide: [
      { symbol: 'x̄', meaning: 'Sample mean — point estimate of μ' },
      { symbol: 'p̂', meaning: 'Sample proportion — point estimate of population proportion p (read "p-hat")' },
      { symbol: 's²', meaning: 'Sample variance — unbiased estimate of σ²' },
      { symbol: 'x', meaning: 'Number of successes in the sample (for proportions)' },
      { symbol: 'n', meaning: 'Sample size' },
    ],
  },
  whenToUse: [
    'When a single best-guess value for a parameter is needed (e.g., reporting the estimated average income)',
    'As the first step before constructing a confidence interval',
    'When communicating results to a non-technical audience who need one clear number',
  ],
  whenNotToUse: [
    'When uncertainty in the estimate must be communicated — use a confidence interval instead',
    'When the estimate is highly sensitive to outliers — consider robust alternatives',
  ],
  assumptions: [
    'The sample is drawn randomly and independently from the population',
    'The sample is representative of the population of interest',
    'The estimator used is appropriate for the parameter being estimated',
  ],
  workedExample: {
    scenario:
      'A researcher surveys 50 university students. 32 say they exercise at least 3 days per week. Their average study hours per day: x̄ = 4.2 hrs, s = 1.5 hrs.',
    steps: [
      { stepNumber: 1, label: 'Point estimate of population mean study hours', expression: 'x̄ = 4.2 hours/day', result: 'Estimated μ = 4.2 hrs/day', explanation: 'The sample mean is the best single estimate of the population mean.' },
      { stepNumber: 2, label: 'Point estimate of population proportion who exercise', expression: 'p̂ = 32/50 = 0.64', result: 'Estimated p = 0.64 (64%)', explanation: '64% of sampled students exercise ≥3 days/week — our best guess for the true proportion.' },
      { stepNumber: 3, label: 'Point estimate of population variance', expression: 's² = 1.5² = 2.25 hrs²', result: 'Estimated σ² = 2.25 hrs²', explanation: 'The sample variance s² (with n−1) is an unbiased estimator of the population variance σ².' },
    ],
    interpretation:
      'Each single number is our best guess for the corresponding population parameter. These are called "point" estimates because they pinpoint one value, not a range.',
  },
  interpretation:
    'Point estimates are simple and intuitive, but they carry uncertainty. A sample of n = 50 gives a rough estimate; a sample of n = 5,000 would give a much more precise one. Pair every point estimate with a confidence interval or standard error to communicate precision.',
  commonMistakes: [
    { mistake: 'Confusing the sample statistic with the population parameter', explanation: 'x̄ is an estimate of μ — not μ itself. Parameters are fixed truths; statistics are sample-based approximations.' },
    { mistake: 'Treating a point estimate as certain', explanation: 'Any point estimate will be slightly wrong. Always quantify uncertainty with an interval or SE.' },
    { mistake: 'Using biased estimators unknowingly', explanation: 'Using n instead of n−1 in the variance formula produces a biased (too small) estimate. Always use s² = Σ(xᵢ−x̄)²/(n−1).' },
  ],
  practiceProblems: {
    easy: [
      { id: 'pe-easy-1', scenario: 'In a sample of 200 customers, 80 bought the premium product.', question: 'What is the point estimate of the population proportion who bought premium?', hint: 'p̂ = x/n.', solution: 'p̂ = 80/200 = 0.40 (40%).' },
    ],
    moderate: [
      { id: 'pe-mod-1', scenario: 'Heights (cm) of 5 students: 162, 170, 168, 175, 165.', question: 'Find the point estimates of μ and σ.', hint: 'x̄ = mean; s = sample SD.', solution: 'x̄ = (162+170+168+175+165)/5 = 840/5 = 168. Σ(xᵢ−168)² = 36+4+0+49+9 = 98, so s² = 98/4 = 24.5 and s = √24.5 ≈ 4.95.' },
    ],
    challenging: [
      { id: 'pe-chal-1', scenario: 'Two researchers independently survey samples of n=100. Both get x̄ = 50 but different standard deviations: s₁ = 5, s₂ = 20.', question: 'Both give the same point estimate of μ. Why might Researcher 1\'s estimate be preferred?', hint: 'Think about standard error.', solution: 'Both point estimates are 50. But Researcher 1 has SE = 5/10 = 0.5 vs SE = 20/10 = 2 for Researcher 2. Researcher 1\'s estimate is far more precise (less variable across hypothetical repeated samples).' },
    ],
  },
  knowledgeCheck: [
    {
      id: 'pe-kc-1', type: 'multiple-choice',
      question: 'Which of the following is a point estimate?',
      options: [
        { id: 'a', text: 'The population mean μ', isCorrect: false, explanation: 'μ is the true population parameter, not an estimate.' },
        { id: 'b', text: 'The sample mean x̄ used to estimate μ', isCorrect: true, explanation: 'Correct! x̄ is a single-value estimate of the unknown parameter μ.' },
        { id: 'c', text: 'A 95% confidence interval [48.2, 51.8]', isCorrect: false, explanation: 'That is an interval estimate, not a point estimate.' },
        { id: 'd', text: 'The population standard deviation σ', isCorrect: false, explanation: 'σ is the true parameter — we estimate it using s.' },
      ],
      explanation: 'A point estimate is a single statistic used to estimate an unknown parameter.',
      hint: 'A "point" estimate gives one number, not a range.',
    },
    {
      id: 'pe-kc-2', type: 'multiple-choice',
      question: 'Why does sample variance use (n−1) in the denominator instead of n?',
      options: [
        { id: 'a', text: 'To make computation easier', isCorrect: false, explanation: 'The reason is mathematical, not computational.' },
        { id: 'b', text: 'To produce an unbiased estimate of the population variance', isCorrect: true, explanation: 'Correct! Dividing by n−1 (Bessel\'s correction) compensates for the bias introduced when estimating σ² from sample data.' },
        { id: 'c', text: 'To produce a larger number', isCorrect: false, explanation: 'While n−1 does give a slightly larger result, that is a consequence of the correction, not the reason.' },
        { id: 'd', text: 'Because sample size is always at least 1', isCorrect: false, explanation: 'The n−1 is Bessel\'s correction for bias, not about minimum sample size.' },
      ],
      explanation: 'Using n−1 (degrees of freedom) corrects for the systematic underestimation of σ² when estimating from a sample.',
      hint: 'Think about bias — does using n give an estimate that is too small on average?',
    },
    {
      id: 'pe-kc-3', type: 'multiple-choice',
      question: 'A sample of 40 voters shows 24 support a policy. What is p̂?',
      options: [
        { id: 'a', text: '0.4', isCorrect: false, explanation: '0.4 = 16/40 (the non-supporters). p̂ = supporters / total.' },
        { id: 'b', text: '0.6', isCorrect: true, explanation: 'Correct! p̂ = 24/40 = 0.60.' },
        { id: 'c', text: '24', isCorrect: false, explanation: 'p̂ is a proportion (between 0 and 1), not a count.' },
        { id: 'd', text: '0.024', isCorrect: false, explanation: 'That would be 24/1000 — check the denominator.' },
      ],
      explanation: 'Sample proportion p̂ = x/n = 24/40 = 0.60.',
      hint: 'p̂ = (number with the characteristic) / (total in sample).',
    },
    {
      id: 'pe-kc-4', type: 'multiple-choice',
      question: 'Why is a point estimate alone insufficient for most statistical conclusions?',
      options: [
        { id: 'a', text: 'It gives too much information', isCorrect: false, explanation: 'A point estimate gives minimal information — just one number.' },
        { id: 'b', text: 'It gives no indication of how uncertain the estimate is', isCorrect: true, explanation: 'Correct! A point estimate could be very close or very far from the true parameter — without SE or a CI we cannot tell.' },
        { id: 'c', text: 'It is always biased', isCorrect: false, explanation: 'Unbiased estimators like x̄ are not biased. The issue is uncertainty, not bias.' },
        { id: 'd', text: 'Computers cannot calculate it', isCorrect: false, explanation: 'Point estimates are straightforward to compute.' },
      ],
      explanation: 'A point estimate gives the best single guess, but provides no information about how far it might be from the true parameter.',
      hint: 'What is missing from a single number?',
    },
    {
      id: 'pe-kc-5', type: 'numerical',
      question: 'In a sample of 120 items, 36 are defective. What is p̂ (to 2 decimal places)?',
      answer: 0.30,
      tolerance: 0.005,
      explanation: 'p̂ = 36/120 = 0.30.',
      hint: 'p̂ = defective count ÷ sample size.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'pe-tf-1', type: 'true-false', question: 'A point estimate is a single value used to estimate a population parameter.', isTrue: true, explanation: 'A point estimate gives one number (e.g., x̄) as the best guess for the population parameter (e.g., μ).' },
    { id: 'pe-tf-2', type: 'true-false', question: 'The sample mean x̄ is always equal to the population mean μ.', isTrue: false, explanation: 'x̄ is an estimate of μ — it varies from sample to sample and is rarely exactly equal to μ.' },
    { id: 'pe-tf-3', type: 'true-false', question: 'The sample proportion p̂ is an unbiased estimator of the population proportion p.', isTrue: true, explanation: 'E(p̂) = p — the sample proportion is centred on the true population proportion.' },
    { id: 'pe-tf-4', type: 'true-false', question: 'Point estimates convey no information about uncertainty.', isTrue: true, explanation: 'A point estimate is a single value with no built-in margin. To convey uncertainty you need a confidence interval or standard error.' },
    { id: 'pe-tf-5', type: 'true-false', question: 'The sample variance s² uses n−1 in the denominator to correct for bias.', isTrue: true, explanation: 'Dividing by n−1 (Bessel\'s correction) makes s² an unbiased estimator of σ². Dividing by n would underestimate σ².' },
    { id: 'pe-tf-6', type: 'true-false', question: 'A larger sample always gives a better point estimate than a smaller sample.', isTrue: false, explanation: 'Larger samples tend to give more precise estimates, but a biased sampling method can give worse estimates regardless of n.' },
    { id: 'pe-tf-7', type: 'true-false', question: 'The hat notation (^) indicates an estimate of a population parameter.', isTrue: true, explanation: 'By convention, a hat symbol denotes a sample statistic used to estimate the corresponding parameter (μ̂ = x̄, p̂, etc.).' },
    { id: 'pe-tf-8', type: 'true-false', question: 'Point estimates and interval estimates provide the same information.', isTrue: false, explanation: 'A point estimate gives a single best guess; an interval estimate provides a range that quantifies uncertainty around that guess.' },
    { id: 'pe-tf-9', type: 'true-false', question: 'The median can be used as a point estimate for the population median.', isTrue: true, explanation: 'The sample median estimates the population median, just as x̄ estimates μ.' },
    { id: 'pe-tf-10', type: 'true-false', question: 'A point estimate is considered efficient if it has the smallest possible variance among all unbiased estimators.', isTrue: true, explanation: 'Efficiency: among all unbiased estimators, the most efficient one has the smallest variance (minimum variance unbiased estimator, MVUE).' },
    { id: 'pe-tf-11', type: 'true-false', question: 'Using a biased estimator is always worse than using an unbiased estimator.', isTrue: false, explanation: 'Some biased estimators have lower mean squared error (MSE = bias² + variance) than unbiased ones, making them preferable in practice.' },
    { id: 'pe-tf-12', type: 'true-false', question: 'A consistent estimator converges to the true parameter as n → ∞.', isTrue: true, explanation: 'Consistency means as n increases, the estimator gets arbitrarily close to the true parameter value.' },
    { id: 'pe-tf-13', type: 'true-false', question: 'If a sample mean x̄ = 75, then the population mean must be 75.', isTrue: false, explanation: 'x̄ = 75 is our best estimate, but μ could be different — point estimates carry sampling error.' },
    { id: 'pe-tf-14', type: 'true-false', question: 'The standard error of x̄ quantifies the precision of the point estimate.', isTrue: true, explanation: 'SE = σ/√n measures how much x̄ typically deviates from μ — smaller SE = more precise point estimate.' },
    { id: 'pe-tf-15', type: 'true-false', question: 'For a proportion, p̂ = 0.6 with n = 10 is a more reliable estimate than p̂ = 0.6 with n = 1000.', isTrue: false, explanation: 'Same p̂ but larger n means smaller SE and a more reliable estimate. n = 1000 is far more reliable.' },
    { id: 'pe-tf-16', type: 'true-false', question: 'A point estimate improves when we collect more representative data, even if n remains the same.', isTrue: true, explanation: 'Better sampling methods (reduced bias, better coverage) improve the quality of point estimates independently of sample size.' },
    { id: 'pe-tf-17', type: 'true-false', question: 'The sample standard deviation s is an unbiased estimator of the population standard deviation σ.', isTrue: false, explanation: 'While s² is unbiased for σ², the square root s is slightly biased for σ (Jensen\'s inequality). The bias is small for large n.' },
    { id: 'pe-tf-18', type: 'true-false', question: 'Multiple point estimates from different random samples of the same population will all be identical.', isTrue: false, explanation: 'Each sample gives a different x̄ due to random variation — this variability is exactly what the sampling distribution captures.' },
    { id: 'pe-tf-19', type: 'true-false', question: 'Point estimates are only valid for numerical data, not categorical data.', isTrue: false, explanation: 'p̂ is a point estimate for categorical (binary) data. Point estimation applies to any measurable population characteristic.' },
    { id: 'pe-tf-20', type: 'true-false', question: 'A point estimate is always contained within the corresponding confidence interval.', isTrue: true, explanation: 'Standard confidence intervals are built around the point estimate (e.g., CI = x̄ ± margin), so x̄ lies inside the interval.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'pe-mc-6', type: 'multiple-choice', question: 'In a sample of 50 people, 35 prefer brand A. What is p̂?', options: [{ id: 'a', text: '0.35', isCorrect: false, explanation: '0.35 = 35/100 — you divided by 100 instead of 50.' }, { id: 'b', text: '0.70', isCorrect: true, explanation: 'p̂ = 35/50 = 0.70.' }, { id: 'c', text: '35', isCorrect: false, explanation: '35 is the count — p̂ is the proportion.' }, { id: 'd', text: '0.65', isCorrect: false, explanation: '0.65 = 1 − 0.35 — incorrect denominator used.' }], explanation: 'p̂ = 35/50 = 0.70.', hint: 'Proportion = count / sample size.' },
    { id: 'pe-mc-7', type: 'multiple-choice', question: 'Why does s² divide by n−1 instead of n?', options: [{ id: 'a', text: 'To make computation easier', isCorrect: false, explanation: 'Dividing by n−1 is actually slightly more complex — the reason is statistical.' }, { id: 'b', text: 'To produce an unbiased estimate of σ²', isCorrect: true, explanation: 'Bessel\'s correction: E(s²) = σ² when dividing by n−1. Dividing by n gives E(s²) = (n−1)σ²/n < σ².' }, { id: 'c', text: 'Because one observation is always missing', isCorrect: false, explanation: 'This misunderstands degrees of freedom — one degree is lost because x̄ is estimated from the same data.' }, { id: 'd', text: 'It is a historical convention with no mathematical basis', isCorrect: false, explanation: 'The n−1 correction has a rigorous mathematical justification based on unbiasedness.' }], explanation: 'n−1 (Bessel\'s correction) makes s² an unbiased estimator: E(s²) = σ².', hint: 'What property does n−1 give to s²?' },
    { id: 'pe-mc-8', type: 'multiple-choice', question: 'A sample mean is said to be "consistent." What does this mean?', options: [{ id: 'a', text: 'It equals μ in every sample', isCorrect: false, explanation: 'That would be "certain" — consistency is about convergence with large n, not equality in every sample.' }, { id: 'b', text: 'It converges to μ as n → ∞', isCorrect: true, explanation: 'A consistent estimator gets arbitrarily close to the true parameter as sample size grows.' }, { id: 'c', text: 'It has no sampling error', isCorrect: false, explanation: 'Sampling error exists for any finite sample.' }, { id: 'd', text: 'It is unbiased', isCorrect: false, explanation: 'Consistency and unbiasedness are different properties. An estimator can be one without the other.' }], explanation: 'Consistency: as n → ∞, the estimator converges in probability to the true parameter value.', hint: 'Consistency is about what happens as sample size grows.' },
    { id: 'pe-mc-9', type: 'multiple-choice', question: 'Which of the following is NOT a commonly used point estimator?', options: [{ id: 'a', text: 'Sample mean x̄ for μ', isCorrect: false, explanation: 'x̄ is the standard point estimator for μ.' }, { id: 'b', text: 'Sample variance s² for σ²', isCorrect: false, explanation: 's² is the standard point estimator for σ².' }, { id: 'c', text: 'Population standard deviation σ for s²', isCorrect: true, explanation: 'σ is a population parameter, not a statistic, so it cannot serve as an estimator. The estimator of σ² is the sample variance s².' }, { id: 'd', text: 'Sample proportion p̂ for p', isCorrect: false, explanation: 'p̂ is the standard point estimator for the population proportion p.' }], explanation: 'Estimators are sample statistics (with hat) estimating parameters (without hat). σ is a parameter, not an estimator.', hint: 'Which option has a population parameter as the estimator?' },
    { id: 'pe-mc-10', type: 'multiple-choice', question: 'The mean squared error (MSE) of an estimator is:', options: [{ id: 'a', text: 'Always equal to the variance of the estimator', isCorrect: false, explanation: 'MSE = Variance + Bias². Equal to variance only when bias = 0.' }, { id: 'b', text: 'Bias² + Variance', isCorrect: true, explanation: 'MSE = E[(θ̂−θ)²] = Var(θ̂) + [Bias(θ̂)]². It combines both sources of estimation error.' }, { id: 'c', text: 'The squared standard error', isCorrect: false, explanation: 'The squared SE equals the variance of the estimator, not the full MSE.' }, { id: 'd', text: 'The average difference between x̄ and μ', isCorrect: false, explanation: 'The average difference (E[x̄−μ]) is the bias. MSE is the average squared difference.' }], explanation: 'MSE = Var(θ̂) + [Bias(θ̂)]². An estimator with small MSE balances both low variance and low bias.', hint: 'MSE combines two sources of error — what are they?' },
    { id: 'pe-mc-11', type: 'multiple-choice', question: 'What is the point estimate for σ²?', options: [{ id: 'a', text: 'x̄', isCorrect: false, explanation: 'x̄ estimates μ, not σ².' }, { id: 'b', text: 's²', isCorrect: true, explanation: 's² = Σ(xᵢ−x̄)²/(n−1) is the sample variance — the standard point estimator of σ².' }, { id: 'c', text: 'p̂', isCorrect: false, explanation: 'p̂ estimates the population proportion p.' }, { id: 'd', text: 'SE', isCorrect: false, explanation: 'SE = s/√n measures precision of x̄ — it does not estimate σ².' }], explanation: 'The sample variance s² is the point estimate for the population variance σ².', hint: 'Which sample statistic has the same units as σ²?' },
    { id: 'pe-mc-12', type: 'multiple-choice', question: 'Which statement best describes the difference between a parameter and a statistic?', options: [{ id: 'a', text: 'Parameters are computed from samples; statistics are fixed population values', isCorrect: false, explanation: 'This is reversed — parameters are fixed population values; statistics are computed from samples.' }, { id: 'b', text: 'Parameters are fixed population values; statistics are computed from samples and vary', isCorrect: true, explanation: 'Parameters (μ, σ, p) are fixed but unknown. Statistics (x̄, s, p̂) are computed from data and vary across samples.' }, { id: 'c', text: 'Both are estimated from samples', isCorrect: false, explanation: 'Parameters exist in the population — they are not computed from a sample, they are what we are trying to estimate.' }, { id: 'd', text: 'Statistics are always larger than parameters', isCorrect: false, explanation: 'No such relationship exists.' }], explanation: 'Parameters: fixed but unknown population values. Statistics: calculated from sample data, used to estimate parameters.', hint: 'Which one is in the population vs. the sample?' },
    { id: 'pe-mc-13', type: 'multiple-choice', question: 'A poll of 500 voters finds 270 support Candidate A. What is the point estimate for the proportion of all voters who support A?', options: [{ id: 'a', text: '270', isCorrect: false, explanation: '270 is a count, not a proportion.' }, { id: 'b', text: '0.54', isCorrect: true, explanation: 'p̂ = 270/500 = 0.54.' }, { id: 'c', text: '0.46', isCorrect: false, explanation: '0.46 = 230/500 — that is the proportion NOT supporting A.' }, { id: 'd', text: '500', isCorrect: false, explanation: '500 is the sample size, not the proportion.' }], explanation: 'p̂ = 270/500 = 0.54. 54% of sampled voters support Candidate A.', hint: 'Proportion = successes / total.' },
    { id: 'pe-mc-14', type: 'multiple-choice', question: 'Two estimators for the same parameter: Estimator A is unbiased with variance 10; Estimator B is slightly biased (bias = 0.5) with variance 2. Which has lower MSE?', options: [{ id: 'a', text: 'A — because it is unbiased', isCorrect: false, explanation: 'MSE_A = 10 + 0² = 10. MSE_B = 2 + 0.25 = 2.25. B has lower MSE despite bias.' }, { id: 'b', text: 'B — lower MSE despite the bias', isCorrect: true, explanation: 'MSE_A = Var(A) + Bias_A² = 10 + 0 = 10. MSE_B = 2 + 0.5² = 2 + 0.25 = 2.25. B wins.' }, { id: 'c', text: 'Equal — they estimate the same parameter', isCorrect: false, explanation: 'MSE values are different: 10 vs 2.25.' }, { id: 'd', text: 'Cannot compare without sample data', isCorrect: false, explanation: 'MSE is a theoretical property — no data needed.' }], explanation: 'MSE_A = 10, MSE_B = 2.25. A biased estimator with lower variance can outperform an unbiased one.', hint: 'Compute MSE = Variance + Bias² for each.' },
    { id: 'pe-mc-15', type: 'multiple-choice', question: 'Which property ensures that as we collect more data, a point estimate gets arbitrarily close to the true parameter?', options: [{ id: 'a', text: 'Unbiasedness', isCorrect: false, explanation: 'Unbiasedness means E(θ̂) = θ for any n — not specifically about convergence as n grows.' }, { id: 'b', text: 'Consistency', isCorrect: true, explanation: 'Consistency: as n → ∞, the probability that |θ̂ − θ| > ε → 0 for any ε > 0.' }, { id: 'c', text: 'Efficiency', isCorrect: false, explanation: 'Efficiency is about having minimum variance among unbiased estimators — not about convergence.' }, { id: 'd', text: 'Sufficiency', isCorrect: false, explanation: 'Sufficiency means the estimator uses all the information in the data about the parameter — different from convergence.' }], explanation: 'Consistency: the estimator converges in probability to the true parameter as n grows. This is about asymptotic behaviour.', hint: 'Which property is explicitly about what happens as n → ∞?' },
  ],
  keyTakeaway:
    'A point estimate uses one sample statistic (e.g., x̄, p̂, s²) as a best guess for the corresponding population parameter (μ, p, σ²). Point estimates are concise but uncertain — always pair them with a measure of precision such as standard error or a confidence interval.',
  memoryTrick: (
    <div className="space-y-2 text-textDark text-sm leading-relaxed">
      <p><strong>"Hat = Estimate" rule:</strong> When you see a hat (^) on a symbol, it is always an estimate of the bare symbol.</p>
      <div className="bg-white border border-violet-200 rounded-lg p-3 text-xs font-mono space-y-1">
        <div>μ (parameter) → x̄ (estimate, pronounced "x bar")</div>
        <div>p (parameter) → p̂ (estimate, pronounced "p hat")</div>
        <div>σ² (parameter) → s² (estimate)</div>
      </div>
      <p><strong>The "Dart Board" reminder:</strong> A point estimate is one dart throw — it's your best single shot at the bullseye (μ). A confidence interval is a range built around that shot to reflect how uncertain it is.</p>
      <p className="text-xs text-textMuted">Remember: n−1, not n, in s² — using n would underestimate the spread (Bessel's correction).</p>
    </div>
  ),
  visualization: null,
  datasetGenerator: false,
}

export default function PointEstimates({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}
