import TopicPage from '../../layout/TopicPage'

/**
 * Variables and Observations — Foundation topic
 * Employee survey scenario: rows = observations, columns = variables
 * Distinguishes quantitative (continuous, discrete) from qualitative
 */

// Worked example table showing 5 employees
const employeeTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Employee ID</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Department</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Salary ($)</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Years Experience</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Satisfaction (1–5)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-primary">E001</td>
          <td className="py-3 px-4">Emergency</td>
          <td className="py-3 px-4 font-mono">85,000</td>
          <td className="py-3 px-4 font-mono">3</td>
          <td className="py-3 px-4 font-mono">4</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-primary">E002</td>
          <td className="py-3 px-4">Cardiology</td>
          <td className="py-3 px-4 font-mono">120,000</td>
          <td className="py-3 px-4 font-mono">12</td>
          <td className="py-3 px-4 font-mono">5</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-primary">E003</td>
          <td className="py-3 px-4">Pediatrics</td>
          <td className="py-3 px-4 font-mono">72,000</td>
          <td className="py-3 px-4 font-mono">1</td>
          <td className="py-3 px-4 font-mono">3</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-primary">E004</td>
          <td className="py-3 px-4">Emergency</td>
          <td className="py-3 px-4 font-mono">95,000</td>
          <td className="py-3 px-4 font-mono">7</td>
          <td className="py-3 px-4 font-mono">4</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-mono text-primary">E005</td>
          <td className="py-3 px-4">Radiology</td>
          <td className="py-3 px-4 font-mono">110,000</td>
          <td className="py-3 px-4 font-mono">9</td>
          <td className="py-3 px-4 font-mono">5</td>
        </tr>
      </tbody>
    </table>
    <p className="text-xs text-textMuted mt-2 italic">Each row = one observation (one employee). Each column = one variable.</p>
  </div>
)

// Variable classification table
const variableClassificationTable = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-100 border-b border-border">
          <th className="text-left py-3 px-4 font-semibold text-textDark">Variable</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Type</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Sub-type</th>
          <th className="text-center py-3 px-4 font-semibold text-textDark">Level of Measurement</th>
          <th className="text-left py-3 px-4 font-semibold text-textDark">Reason</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Employee ID</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Qualitative</td>
          <td className="text-center py-3 px-4">—</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Nominal</td>
          <td className="py-3 px-4 text-textDark">Numbers used as labels; no order, no math</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Department</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Qualitative</td>
          <td className="text-center py-3 px-4">—</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Nominal</td>
          <td className="py-3 px-4 text-textDark">Category names with no natural order</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Salary</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Quantitative</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-info">Continuous</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Ratio</td>
          <td className="py-3 px-4 text-textDark">True zero ($0 = no pay); any value in range</td>
        </tr>
        <tr className="border-b border-border hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Years Experience</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Quantitative</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-warning">Discrete</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-success">Ratio</td>
          <td className="py-3 px-4 text-textDark">Whole numbers only; true zero (0 years = none)</td>
        </tr>
        <tr className="hover:bg-gray-50">
          <td className="py-3 px-4 font-medium text-textDark">Satisfaction (1–5)</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-primary">Qualitative*</td>
          <td className="text-center py-3 px-4">—</td>
          <td className="text-center py-3 px-4 font-mono font-bold text-warning">Ordinal</td>
          <td className="py-3 px-4 text-textDark">Ordered categories; gaps not necessarily equal</td>
        </tr>
      </tbody>
    </table>
    <p className="text-xs text-textMuted mt-2 italic">
      * Satisfaction scores are numbers but represent ordered categories — treat as qualitative (ordinal) unless intervals are validated.
    </p>
  </div>
)

const content = {
  title: 'Variables and Observations',
  topicGroup: 'Foundations',
  learningObjective:
    'Identify variables and observations in a dataset, and distinguish between quantitative and qualitative variables.',
  explanation:
    'A variable is any characteristic that can differ from one person or thing to another — like age, salary, or department. An observation is one complete record in your dataset — typically one row in a table. For example, if you survey 50 employees, each employee is one observation, and the things you measure about each employee (age, salary, department) are variables.\n\nVariables come in two main types:\n- **Quantitative (numeric):** measured with numbers — can be continuous (any value, like height or salary) or discrete (whole counts, like number of absences)\n- **Qualitative (categorical):** categories or labels — like job title, gender, or department name',
  analogy:
    'Think of a spreadsheet. Every row is an observation (one employee). Every column is a variable (one thing measured about that employee). The cell at the intersection holds one value of that variable for that observation.',
  formula: null,
  whenToUse: [
    'When you first open a dataset — identify what each row and column represents.',
    'Before any analysis — the variable type determines which statistics and charts are appropriate.',
    'When designing a study — decide what variables to measure and what each observation will be.',
  ],
  whenNotToUse: [
    'Not applicable — this is a foundational concept for all data work.',
  ],
  assumptions: [
    'Each row represents one independent observational unit.',
    'Each column measures a single, well-defined characteristic.',
    'Missing values are handled appropriately (not treated as zeros).',
  ],
  workedExample: {
    scenario:
      'An HR analyst exports data on 5 employees. The dataset has 5 rows and 5 columns. Identify the observations, variables, and classify each variable.',
    dataset: null,
    steps: [
      {
        stepNumber: 1,
        label: 'Identify observations (rows)',
        expression: 'Count the rows: 5 employees = 5 observations',
        result: '5 observations',
        explanation: 'Each row is one complete record for one employee. The observational unit is "employee."',
      },
      {
        stepNumber: 2,
        label: 'Identify variables (columns)',
        expression: 'Count the columns: Employee ID, Department, Salary, Years Experience, Satisfaction',
        result: '5 variables',
        explanation: 'Each column measures one characteristic. A variable must have a single definition per column.',
      },
      {
        stepNumber: 3,
        label: 'Classify Employee ID',
        expression: 'Values: E001, E002, E003... — labels, no math possible',
        result: 'Qualitative, Nominal',
        explanation: 'Even though it contains numbers, Employee ID is a label. You cannot average IDs.',
      },
      {
        stepNumber: 4,
        label: 'Classify Department',
        expression: 'Values: Emergency, Cardiology, Pediatrics... — category names',
        result: 'Qualitative, Nominal',
        explanation: 'Departments are categories with no inherent order.',
      },
      {
        stepNumber: 5,
        label: 'Classify Salary',
        expression: 'Values: 85000, 120000, 72000... — any dollar amount, true zero',
        result: 'Quantitative, Continuous, Ratio',
        explanation: 'Salary can take any value in a range (continuous), and $0 means no salary (true zero).',
      },
      {
        stepNumber: 6,
        label: 'Classify Years Experience',
        expression: 'Values: 3, 12, 1, 7, 9 — whole numbers only, true zero',
        result: 'Quantitative, Discrete, Ratio',
        explanation: 'Experience is counted in whole years (discrete), but 0 means none (true zero).',
      },
      {
        stepNumber: 7,
        label: 'Classify Satisfaction (1–5)',
        expression: 'Values: 4, 5, 3, 4, 5 — ordered categories, unequal gaps assumed',
        result: 'Qualitative, Ordinal',
        explanation: 'The numbers represent ordered categories. The gap between 1 and 2 may not equal the gap between 4 and 5.',
      },
    ],
    interpretation:
      'In this dataset: 5 observations (employees), 5 variables. Two variables are nominal (Employee ID, Department), two are ratio continuous/discrete (Salary, Years Experience), and one is ordinal (Satisfaction). This classification tells you: you can calculate mean salary, but not mean department. You can compute median satisfaction, but the mean is debatable.',
  },
  interpretation:
    'Variables describe WHAT you measure; observations describe WHO or WHAT you measured it on. Every dataset has this row/column structure. The variable type (quantitative vs. qualitative, and subtypes) dictates everything that follows: which summary statistics are valid, which charts make sense, which statistical tests apply. Always start by listing your variables and classifying each one.',
  commonMistakes: [
    {
      mistake: 'Confusing observations with variables — variables are columns, observations are rows',
      explanation:
        'In a tidy dataset, each row is one observation (one person, one patient, one day). Each column is one variable. If you transpose the data, you swap their roles. Keep them straight: "n = number of rows" = number of observations.',
    },
    {
      mistake: 'Assuming any number is a quantitative variable — employee ID is a number but it\'s categorical',
      explanation:
        'The data type is about MEANING, not format. Employee ID, zip code, phone number, and ICD-10 codes are all numbers used as labels. They are qualitative (nominal). Ask: "Does it make sense to add/subtract/average these?" If no → qualitative.',
    },
    {
      mistake: 'Forgetting that continuous variables can take any value in a range, while discrete variables are counted in whole numbers',
      explanation:
        'Height, weight, salary, temperature → continuous (any value, including decimals). Number of children, number of visits, number of defects → discrete (integers only). Both are quantitative, but the distinction matters for some statistical methods (e.g., Poisson regression for counts).',
    },
  ],
  practiceProblems: {
    easy: [
      {
        id: 'vo-easy-1',
        scenario:
          'A dataset contains 200 rows and 8 columns. Each row represents one hospital patient. Each column represents one piece of information about that patient (age, gender, diagnosis, etc.).',
        question: 'How many observations are in this dataset? How many variables?',
        hint: 'Rows = observations, columns = variables.',
        solution:
          '200 observations (one per patient/row). 8 variables (one per column).',
      },
      {
        id: 'vo-easy-2',
        scenario:
          'A researcher records the favorite color of 50 people: Red, Blue, Green, Yellow, Purple.',
        question: 'Is "favorite color" a quantitative or qualitative variable?',
        hint: 'Can you do math with colors? Is there a natural order?',
        solution:
          'Qualitative (categorical). Colors are labels with no numeric meaning and no natural order. This is nominal data.',
      },
    ],
    moderate: [
      {
        id: 'vo-mod-1',
        scenario:
          'A study collects: (a) Number of hospital visits in the past year, (b) Blood pressure (systolic), (c) Insurance type (Private, Medicaid, Medicare, Uninsured), (d) Patient ID number.',
        question: 'Classify each as quantitative (continuous/discrete) or qualitative (nominal/ordinal).',
        hint: 'For each: Is it a number that can be measured? If yes, can it be any value (continuous) or only integers (discrete)? If no, is there order?',
        solution:
          '(a) Number of visits → Quantitative, Discrete (counts). (b) Blood pressure → Quantitative, Continuous (any value in range). (c) Insurance type → Qualitative, Nominal (categories, no order). (d) Patient ID → Qualitative, Nominal (label, even though numeric).',
      },
      {
        id: 'vo-mod-2',
        scenario:
          'A dataset has a column "Age Group" with values: "0-17", "18-34", "35-49", "50-64", "65+". The analyst wants to calculate the average age group.',
        question: 'Is calculating a mean appropriate? What type of variable is this?',
        hint: 'Does "0-17" + "18-34" divided by 2 make sense?',
        solution:
          'No, the mean is not appropriate. "Age Group" is an ordinal qualitative variable — the categories have a natural order, but the intervals are not equal (0-17 spans 18 years, 65+ is open-ended). The median or mode is appropriate; the mean is not.',
      },
    ],
    challenging: [
      {
        id: 'vo-chal-1',
        scenario:
          'A hospital records "Length of Stay" in days for each patient. Most patients stay 1–5 days, but a few stay 30+ days. The analyst treats this as continuous and calculates the mean.',
        question: 'Is "Length of Stay" truly continuous? What problems might arise from treating it as continuous?',
        hint: 'Can a patient stay 2.5 days? What about the skew from long stays?',
        solution:
          'Length of Stay is technically discrete (counted in whole days, though sometimes recorded in hours making it closer to continuous). The bigger issue: it is typically highly right-skewed. The mean is pulled upward by the long-stay outliers and may not represent the "typical" stay. The median is often a better measure of center for skewed discrete data like this.',
      },
      {
        id: 'vo-chal-2',
        scenario:
          'A survey asks: "How satisfied are you?" with options: Very Dissatisfied, Dissatisfied, Neutral, Satisfied, Very Satisfied. The analyst codes these as 1, 2, 3, 4, 5 and calculates a mean of 3.4, reporting "average satisfaction is 3.4 out of 5."',
        question: 'What is the variable type? Is the mean of 3.4 meaningful? What would be better?',
        hint: 'Are the gaps between "Dissatisfied" and "Neutral" equal to "Satisfied" and "Very Satisfied"?',
        solution:
          'This is an ordinal qualitative variable. The mean of 3.4 assumes equal intervals between categories, which is not justified. The median (middle category) or mode (most frequent category) is more appropriate. Reporting "the median response was Satisfied" is more honest than "average satisfaction is 3.4."',
      },
    ],
  },
  knowledgeCheck: [
    {
      id: 'vo-kc-1',
      type: 'multiple-choice',
      question: 'In a tidy dataset where each row is one patient and each column is one variable, what does "n = 150" refer to?',
      options: [
        { id: 'a', text: '150 variables', isCorrect: false, explanation: 'n refers to observations (rows), not variables (columns)' },
        { id: 'b', text: '150 patients (observations)', isCorrect: true, explanation: 'n is the number of observations — one per row' },
        { id: 'c', text: '150 data points total', isCorrect: false, explanation: 'Total data points = n × number of variables' },
        { id: 'd', text: '150 columns', isCorrect: false, explanation: 'Columns are variables; n is rows' },
      ],
      explanation:
        'In statistics, n universally denotes the sample size — the number of observations (rows). The number of variables is typically denoted by p or k.',
      hint: 'n = sample size = number of rows = number of observations.',
    },
    {
      id: 'vo-kc-2',
      type: 'multiple-choice',
      question: 'Which of the following is a QUANTITATIVE, CONTINUOUS variable?',
      options: [
        { id: 'a', text: 'Number of children in a family', isCorrect: false, explanation: 'This is a count — quantitative but DISCRETE (integers only)' },
        { id: 'b', text: 'Body temperature in Celsius', isCorrect: true, explanation: 'Temperature can take any value in a range (36.5, 36.51, 36.512...) — continuous' },
        { id: 'c', text: 'Marital status (Single, Married, Divorced)', isCorrect: false, explanation: 'This is qualitative (categorical), nominal' },
        { id: 'd', text: 'Education level (High School, Bachelor\'s, Master\'s, PhD)', isCorrect: false, explanation: 'This is qualitative, ordinal — ordered categories' },
      ],
      explanation:
        'Body temperature is measured on a continuous scale — it can take any real value within a range. The others are either discrete counts or categorical.',
      hint: 'Which variable can take ANY value in an interval, including decimals?',
    },
    {
      id: 'vo-kc-3',
      type: 'multiple-choice',
      question: 'A dataset has a column "Zip Code" with values like 90210, 10001, 60601. What type of variable is this?',
      options: [
        { id: 'a', text: 'Quantitative, continuous', isCorrect: false, explanation: 'Zip codes are not measurements; you cannot average them meaningfully' },
        { id: 'b', text: 'Quantitative, discrete', isCorrect: false, explanation: 'They are integers but not counts or measurements' },
        { id: 'c', text: 'Qualitative, nominal', isCorrect: true, explanation: 'Zip codes are labels for geographic areas — no order, no math' },
        { id: 'd', text: 'Qualitative, ordinal', isCorrect: false, explanation: 'There is no meaningful order to zip codes' },
      ],
      explanation:
        'Zip codes are numeric labels. The number 90210 is not "greater than" 10001 in any meaningful sense. They are categories, making them qualitative (nominal).',
      hint: 'Does it make sense to calculate the average zip code?',
    },
    {
      id: 'vo-kc-4',
      type: 'multiple-choice',
      question: 'What is the key difference between a discrete and a continuous quantitative variable?',
      options: [
        { id: 'a', text: 'Discrete variables are counts; continuous variables are measurements', isCorrect: true, explanation: 'Discrete = integers from counting; continuous = any value from measuring' },
        { id: 'b', text: 'Discrete variables have a true zero; continuous do not', isCorrect: false, explanation: 'Both can have a true zero (e.g., 0 children, 0 kg)' },
        { id: 'c', text: 'Discrete variables are qualitative; continuous are quantitative', isCorrect: false, explanation: 'Both are quantitative (numeric)' },
        { id: 'd', text: 'Continuous variables can be negative; discrete cannot', isCorrect: false, explanation: 'Discrete variables can be negative (e.g., profit/loss in whole dollars)' },
      ],
      explanation:
        'Discrete variables arise from counting (number of visits, defects, children) and take integer values. Continuous variables arise from measuring (height, weight, temperature, time) and can take any value in an interval.',
      hint: 'Think about how the data is generated: counting vs. measuring.',
    },
    {
      id: 'vo-kc-5',
      type: 'multiple-choice',
      question: 'A dataset has 1,000 rows and 20 columns. After cleaning, 50 rows are removed due to missing data. How many observations remain?',
      options: [
        { id: 'a', text: '1,000', isCorrect: false, explanation: '50 rows were removed' },
        { id: 'b', text: '950', isCorrect: true, explanation: '1,000 - 50 = 950 observations (rows) remain' },
        { id: 'c', text: '20', isCorrect: false, explanation: '20 is the number of variables (columns)' },
        { id: 'd', text: '950 × 20 = 19,000', isCorrect: false, explanation: 'That is the number of data cells, not observations' },
      ],
      explanation:
        'Each row is one observation. Removing 50 rows leaves 950 observations. The number of variables (columns) stays at 20.',
      hint: 'Observations = rows. Variables = columns.',
    },
    // ── 20 True / False ──────────────────────────────────────────────────────
    { id: 'vo-tf-1', type: 'true-false', question: 'In a tidy dataset, each row represents one variable and each column represents one observation.', isTrue: false, explanation: 'It is the opposite: in a tidy dataset, each ROW is one observation and each COLUMN is one variable. This layout is the standard structure for statistical analysis.' },
    { id: 'vo-tf-2', type: 'true-false', question: 'Continuous variables can take any value within a range, including decimals.', isTrue: true, explanation: 'Continuous variables arise from measuring (height, weight, temperature). They can take any value within a range — 1.5, 1.51, 1.512, etc. — limited only by measurement precision.' },
    { id: 'vo-tf-3', type: 'true-false', question: 'The number of goals scored in a soccer match is a continuous variable.', isTrue: false, explanation: 'Goals are counted in whole numbers (0, 1, 2, …). You cannot score 2.7 goals. Count data like this is discrete, not continuous.' },
    { id: 'vo-tf-4', type: 'true-false', question: 'A qualitative variable can be encoded as numbers without becoming quantitative.', isTrue: true, explanation: 'Encoding categories as numbers (e.g., 1=Male, 2=Female) does not make the variable quantitative. The numbers are just codes — arithmetic on them is meaningless.' },
    { id: 'vo-tf-5', type: 'true-false', question: 'The variable "number of patients per day" is both quantitative and discrete.', isTrue: true, explanation: 'Patient counts are numbers (quantitative) that can only be whole integers — you cannot have 3.5 patients (discrete). Count data is almost always quantitative and discrete.' },
    { id: 'vo-tf-6', type: 'true-false', question: 'An independent variable is the one that is measured as the outcome.', isTrue: false, explanation: 'The independent variable (predictor) is the one that is manipulated or used to predict. The DEPENDENT variable is the outcome that is measured.' },
    { id: 'vo-tf-7', type: 'true-false', question: 'Gender (Male/Female/Other) is an example of a qualitative variable.', isTrue: true, explanation: 'Gender is a categorical (qualitative) variable. It describes group membership, not a quantity. Whether nominal or ordinal depends on context, but it is qualitative.' },
    { id: 'vo-tf-8', type: 'true-false', question: 'A dataset with 5 variables and 100 observations has 500 total data points.', isTrue: true, explanation: '5 variables × 100 observations = 500 individual data cells. Each cell is one data point (the value of one variable for one observation).' },
    { id: 'vo-tf-9', type: 'true-false', question: 'Discrete variables can only take negative values.', isTrue: false, explanation: 'Discrete variables can take positive, negative, or zero integer values depending on context. The defining property is that they take countable, separated values — not that they are negative.' },
    { id: 'vo-tf-10', type: 'true-false', question: 'A confounding variable is one that influences both the independent and dependent variable.', isTrue: true, explanation: 'A confounder creates a spurious relationship between variables by being correlated with both. For example, age might confound the relationship between exercise and health.' },
    { id: 'vo-tf-11', type: 'true-false', question: 'Height measured in centimeters is a quantitative, continuous variable.', isTrue: true, explanation: 'Height is measured on a continuous scale — it can take any value in a range (e.g., 170.5 cm, 171.2 cm). It is quantitative (numeric) and continuous (any real value possible).' },
    { id: 'vo-tf-12', type: 'true-false', question: 'In statistical analysis, the terms "observation" and "data point" mean the same thing.', isTrue: false, explanation: 'An observation is a single case (e.g., one patient — one row). A data point can refer to the value of one variable for one observation (one cell). They are related but not identical.' },
    { id: 'vo-tf-13', type: 'true-false', question: 'A categorical variable with more than two levels is called a polytomous (or multinomial) variable.', isTrue: true, explanation: 'Binary = 2 categories; polytomous/multinomial = 3 or more categories. For example, blood type (A, B, AB, O) is polytomous nominal.' },
    { id: 'vo-tf-14', type: 'true-false', question: 'Removing an observation (row) from a dataset reduces the number of variables.', isTrue: false, explanation: 'Removing a row removes one observation — the number of variables (columns) stays the same. The number of variables is determined by the structure of the dataset, not the number of cases.' },
    { id: 'vo-tf-15', type: 'true-false', question: 'Body mass index (BMI) is a continuous quantitative variable.', isTrue: true, explanation: 'BMI = weight (kg) / height (m)². It is a continuous measurement that can take any positive real value. It is quantitative and continuous.' },
    { id: 'vo-tf-16', type: 'true-false', question: 'In an experiment, the dependent variable is the one the researcher manipulates.', isTrue: false, explanation: 'In an experiment, the researcher manipulates the INDEPENDENT variable (the treatment or condition) and measures the DEPENDENT variable (the outcome or response).' },
    { id: 'vo-tf-17', type: 'true-false', question: 'All quantitative variables are either discrete or continuous.', isTrue: true, explanation: 'Every quantitative variable is one of two types: discrete (countable, integer values) or continuous (measurable, any real value in a range). There is no third type.' },
    { id: 'vo-tf-18', type: 'true-false', question: 'A variable measured at the ratio level can also be classified as quantitative.', isTrue: true, explanation: 'Ratio-level variables (like weight, height, or count) are always quantitative. The levels of measurement (nominal, ordinal, interval, ratio) and variable types (qualitative, quantitative) overlap: ratio is always quantitative.' },
    { id: 'vo-tf-19', type: 'true-false', question: 'The response variable and the dependent variable are different concepts.', isTrue: false, explanation: '"Response variable" and "dependent variable" are synonyms — both refer to the outcome variable that is measured or predicted. Other synonyms include "outcome variable" and "criterion variable".' },
    { id: 'vo-tf-20', type: 'true-false', question: 'A variable cannot be both qualitative and ordinal.', isTrue: false, explanation: 'Qualitative (categorical) variables can absolutely be ordinal. For example, satisfaction ratings (Low, Medium, High) are qualitative (categories) and ordinal (have a natural order). Ordinal is a subtype of categorical.' },
    // ── 10 Multiple Choice ────────────────────────────────────────────────────
    { id: 'vo-mc-6', type: 'multiple-choice', question: 'A researcher records the following for each patient: ID, age, blood pressure, diagnosis (cancer/no cancer). How many variables are there?', options: [{ id: 'a', text: '1', isCorrect: false, explanation: 'There are multiple columns — each column is one variable.' }, { id: 'b', text: '2', isCorrect: false, explanation: 'Count each distinct piece of information recorded per patient.' }, { id: 'c', text: '4', isCorrect: true, explanation: 'ID, age, blood pressure, and diagnosis — four variables (four columns).' }, { id: 'd', text: 'Depends on the number of patients', isCorrect: false, explanation: 'The number of variables is determined by what you measure (columns), not by how many patients you have (rows).' }], explanation: 'Variables are the characteristics measured for each observation. Here: (1) ID, (2) age, (3) blood pressure, (4) diagnosis = 4 variables. Each would be one column in a dataset.', hint: 'Count the distinct pieces of information recorded per patient.' },
    { id: 'vo-mc-7', type: 'multiple-choice', question: 'Which of the following is an example of a DISCRETE quantitative variable?', options: [{ id: 'a', text: 'Temperature in degrees Fahrenheit', isCorrect: false, explanation: 'Temperature is continuous — it can take decimal values.' }, { id: 'b', text: 'Time to complete a surgery', isCorrect: false, explanation: 'Time is continuous — it can take any positive real value.' }, { id: 'c', text: 'Number of emergency room visits per month', isCorrect: true, explanation: 'Counts of visits are integers (0, 1, 2, …) — discrete quantitative.' }, { id: 'd', text: 'Patient weight in kg', isCorrect: false, explanation: 'Weight is continuous — it can take decimal values.' }], explanation: 'Discrete variables arise from counting — they take integer values. Emergency room visits are counted in whole numbers: you cannot have 3.7 visits. Continuous variables (temperature, time, weight) arise from measuring.', hint: 'Which variable comes from counting rather than measuring?' },
    { id: 'vo-mc-8', type: 'multiple-choice', question: 'In a study, participants are assigned to either a drug group or a placebo group. Group assignment is:', options: [{ id: 'a', text: 'A quantitative continuous variable', isCorrect: false, explanation: 'Group membership is not a quantity.' }, { id: 'b', text: 'A qualitative nominal variable', isCorrect: true, explanation: 'Drug vs. placebo are categories with no meaningful order.' }, { id: 'c', text: 'A quantitative discrete variable', isCorrect: false, explanation: 'You cannot perform arithmetic on group names.' }, { id: 'd', text: 'A qualitative ordinal variable', isCorrect: false, explanation: 'There is no meaningful ordering of drug vs. placebo as treatment types.' }], explanation: 'Group assignment (drug/placebo) is categorical — it describes which group a participant belongs to. The categories have no natural rank or numeric meaning, making this nominal.', hint: 'Can you rank drug as "more" than placebo in a meaningful way?' },
    { id: 'vo-mc-9', type: 'multiple-choice', question: 'A medical dataset has 200 rows and 8 columns. One column is removed due to missing data. How many observations remain?', options: [{ id: 'a', text: '192', isCorrect: false, explanation: '192 would result from removing 8 rows. A column was removed, not a row.' }, { id: 'b', text: '200', isCorrect: true, explanation: 'Removing a column (variable) does not affect the number of rows (observations). Still 200 observations.' }, { id: 'c', text: '7', isCorrect: false, explanation: '7 would be the number of remaining variables (columns), not observations.' }, { id: 'd', text: '1,600', isCorrect: false, explanation: '200 × 8 = 1,600 is the original cell count. The question asks about observations (rows).' }], explanation: 'Removing a variable (column) affects the number of variables but does not change the number of observations (rows). The 200 patients are still 200 observations.', hint: 'Which dimension represents observations: rows or columns?' },
    { id: 'vo-mc-10', type: 'multiple-choice', question: 'What does it mean for a dataset to be "tidy"?', options: [{ id: 'a', text: 'It has no missing values', isCorrect: false, explanation: 'A tidy dataset can still have missing values (NA). Tidiness refers to structure, not completeness.' }, { id: 'b', text: 'Each variable is a column, each observation is a row, each cell holds one value', isCorrect: true, explanation: 'This is Hadley Wickham\'s definition of tidy data — the standard structure for analysis.' }, { id: 'c', text: 'It has been sorted alphabetically', isCorrect: false, explanation: 'Sorting is not required for a tidy dataset.' }, { id: 'd', text: 'It contains only numeric variables', isCorrect: false, explanation: 'Tidy datasets can contain any variable type.' }], explanation: 'A tidy dataset follows three rules: (1) each variable is one column, (2) each observation is one row, (3) each cell contains exactly one value. This structure makes analysis straightforward.', hint: 'Think about the optimal spreadsheet layout for statistical analysis.' },
    { id: 'vo-mc-11', type: 'multiple-choice', question: 'Which of these is a qualitative (categorical) ORDINAL variable?', options: [{ id: 'a', text: 'Patient blood type (A, B, AB, O)', isCorrect: false, explanation: 'Blood type has no natural order — it is nominal.' }, { id: 'b', text: 'Heart rate in beats per minute', isCorrect: false, explanation: 'Heart rate is continuous quantitative.' }, { id: 'c', text: 'Severity of illness (Mild, Moderate, Severe)', isCorrect: true, explanation: 'Severity has a natural order (Mild < Moderate < Severe) but the gaps are not necessarily equal.' }, { id: 'd', text: 'Patient ID number', isCorrect: false, explanation: 'Patient IDs are nominal labels.' }], explanation: 'Ordinal variables have categories that can be meaningfully ranked, but the distances between ranks are not guaranteed to be equal. Severity (Mild, Moderate, Severe) is a clear example.', hint: 'Which variable has categories that can be ranked from least to most?' },
    { id: 'vo-mc-12', type: 'multiple-choice', question: 'A researcher notes that patients with more education tend to exercise more and also tend to be healthier. Education might be a:', options: [{ id: 'a', text: 'Dependent variable', isCorrect: false, explanation: 'The dependent variable is the outcome being studied.' }, { id: 'b', text: 'Confounding variable', isCorrect: true, explanation: 'Education influences both exercise habits (independent variable) and health outcomes (dependent variable), potentially creating a spurious relationship.' }, { id: 'c', text: 'Control variable', isCorrect: false, explanation: 'A control variable is one that is held constant or statistically adjusted for.' }, { id: 'd', text: 'Continuous variable', isCorrect: false, explanation: 'This describes its scale of measurement, not its role in the study design.' }], explanation: 'A confounder is a variable that is related to both the independent and dependent variables, potentially creating the appearance of a relationship that may be spurious. Education confounding exercise-health studies is a classic example.', hint: 'What do you call a variable that influences both sides of the relationship being studied?' },
    { id: 'vo-mc-13', type: 'multiple-choice', question: 'A survey records the annual income of 500 respondents. Income is best classified as:', options: [{ id: 'a', text: 'Qualitative nominal', isCorrect: false, explanation: 'Income is a numeric quantity, not a category.' }, { id: 'b', text: 'Qualitative ordinal', isCorrect: false, explanation: 'While you can rank incomes, income as a dollar amount is numeric and has equal intervals.' }, { id: 'c', text: 'Quantitative discrete', isCorrect: false, explanation: 'Income in dollars can technically be measured to cents — conventionally treated as continuous.' }, { id: 'd', text: 'Quantitative continuous', isCorrect: true, explanation: 'Income can take any non-negative value (including cents), so it is treated as continuous quantitative data.' }], explanation: 'Income is numeric (quantitative) and can take any non-negative real value, making it continuous. While in practice it is recorded in dollar/cent increments, it is conventionally treated as continuous.', hint: 'Is income a category label or a measured quantity? Can it take decimal values?' },
    { id: 'vo-mc-14', type: 'multiple-choice', question: 'In the context of a clinical trial studying a new drug, which is the dependent variable?', options: [{ id: 'a', text: 'The dose of the drug administered', isCorrect: false, explanation: 'The dose is manipulated by the researcher — that is the independent variable.' }, { id: 'b', text: 'The patient\'s blood pressure after treatment', isCorrect: true, explanation: 'Blood pressure after treatment is the outcome being measured — the dependent variable.' }, { id: 'c', text: 'The patient\'s age at enrollment', isCorrect: false, explanation: 'Age is typically a covariate or control variable, not the primary outcome.' }, { id: 'd', text: 'The random assignment to drug vs. placebo', isCorrect: false, explanation: 'Group assignment is the independent variable (the treatment condition).' }], explanation: 'In a clinical trial, the independent variable is the treatment (drug dose, drug vs. placebo). The dependent variable is the outcome measured — here, blood pressure after treatment.', hint: 'Which variable is being measured as the outcome of the treatment?' },
    { id: 'vo-mc-15', type: 'multiple-choice', question: 'How many data cells (values) are in a complete dataset with 300 observations and 12 variables, assuming no missing data?', options: [{ id: 'a', text: '312', isCorrect: false, explanation: '300 + 12 = 312. But cells = rows × columns, not rows + columns.' }, { id: 'b', text: '288', isCorrect: false, explanation: '300 - 12 = 288. Still the wrong operation.' }, { id: 'c', text: '3,600', isCorrect: true, explanation: '300 rows × 12 columns = 3,600 individual data cells.' }, { id: 'd', text: '1,200', isCorrect: false, explanation: 'Not the correct formula. Cells = n × p = 300 × 12 = 3,600.' }], explanation: 'In a rectangular dataset, total cells = number of observations × number of variables. 300 × 12 = 3,600 cells. This represents the total amount of data in the dataset.', hint: 'Total cells = rows × columns.' },
  ],
  keyTakeaway:
    'Variables describe what you measure; observations describe who or what you measured it on. Classify every variable as quantitative (continuous/discrete) or qualitative (nominal/ordinal) — this determines everything that follows.',
  visualization: (
    <div className="space-y-4">
      {employeeTable}
      <h3 className="text-sm font-semibold text-textDark mb-2">Variable Classification</h3>
      {variableClassificationTable}
    </div>
  ),
  datasetGenerator: false,
}

export default function VariablesAndObservations({ topicId }) {
  return <TopicPage content={content} topicId={topicId} />
}