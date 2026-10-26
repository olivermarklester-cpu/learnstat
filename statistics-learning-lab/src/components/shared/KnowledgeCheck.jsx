import { useState, useCallback } from 'react'
import { useProgressContext } from '../../context/ProgressContext'

/**
 * KnowledgeCheck
 * Props:
 *   questions: [
 *     {
 *       id, type: 'multiple-choice' | 'numerical' | 'true-false',
 *       question: string,
 *       options: [{ id, text, isCorrect, explanation }],  // for MC
 *       answer: number, tolerance: number,                // for numerical
 *       isTrue: boolean, explanation: string,             // for true-false
 *       hint: string,
 *     }
 *   ]
 *   topicId: string
 */

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs text-textMuted mb-1">
        <span>Question {current} of {total}</span>
        <span>{pct}% complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-primary rounded-full h-1.5 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function MCQuestion({ question, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = selected !== null && question.options?.find((o) => o.id === selected)?.isCorrect

  function handleSubmit() {
    if (selected === null) return
    setSubmitted(true)
    onSubmit(isCorrect)
  }

  return (
    <div>
      <p className="text-sm font-semibold text-textDark mb-4 leading-relaxed">{question.question}</p>

      <div className="space-y-2 mb-4">
        {(question.options || []).map((opt) => {
          let borderClass = 'border-border'
          let bgClass = 'bg-white'
          let textClass = 'text-textDark'
          if (submitted) {
            if (opt.isCorrect) {
              borderClass = 'border-success'
              bgClass = 'bg-green-50'
              textClass = 'text-green-800'
            } else if (opt.id === selected && !opt.isCorrect) {
              borderClass = 'border-danger'
              bgClass = 'bg-red-50'
              textClass = 'text-red-800'
            }
          } else if (opt.id === selected) {
            borderClass = 'border-primary'
            bgClass = 'bg-blue-50'
          }

          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${borderClass} ${bgClass} ${submitted ? 'cursor-default' : 'hover:border-primary'}`}
            >
              <input
                type="radio"
                name={`mc-${question.id}`}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => !submitted && setSelected(opt.id)}
                disabled={submitted}
                className="mt-0.5 accent-primary shrink-0"
              />
              <div>
                <span className={`text-sm ${textClass}`}>{opt.text}</span>
                {submitted && opt.explanation && (
                  <p className="text-xs text-textMuted mt-1 leading-relaxed">{opt.explanation}</p>
                )}
                {submitted && opt.isCorrect && (
                  <span className="text-xs font-bold text-success"> ✓ Correct</span>
                )}
                {submitted && opt.id === selected && !opt.isCorrect && (
                  <span className="text-xs font-bold text-danger"> ✗ Incorrect</span>
                )}
              </div>
            </label>
          )
        })}
      </div>

      {/* Overall explanation */}
      {submitted && question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-textDark leading-relaxed mb-3">
          <span className="font-semibold text-blue-700">Explanation: </span>
          {question.explanation}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'}`}>
          {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
        </div>
      )}
    </div>
  )
}


function TrueFalseQuestion({ question, onSubmit }) {
  const [selected, setSelected] = useState(null) // 'true' | 'false'
  const [submitted, setSubmitted] = useState(false)

  const isCorrect = submitted && selected !== null && (selected === 'true') === question.isTrue

  function handleSubmit() {
    if (selected === null) return
    const correct = (selected === 'true') === question.isTrue
    setSubmitted(true)
    onSubmit(correct)
  }

  const options = [
    { id: 'true', text: 'True' },
    { id: 'false', text: 'False' },
  ]

  return (
    <div>
      <p className="text-sm font-semibold text-textDark mb-4 leading-relaxed">{question.question}</p>

      <div className="flex gap-3 mb-4">
        {options.map((opt) => {
          const isThisCorrect = submitted && (opt.id === 'true') === question.isTrue
          const isThisWrong = submitted && opt.id === selected && !isThisCorrect
          let borderClass = 'border-border'
          let bgClass = 'bg-white'
          let textClass = 'text-textDark'
          if (submitted) {
            if (isThisCorrect) { borderClass = 'border-success'; bgClass = 'bg-green-50'; textClass = 'text-green-800' }
            else if (isThisWrong) { borderClass = 'border-danger'; bgClass = 'bg-red-50'; textClass = 'text-red-800' }
          } else if (opt.id === selected) {
            borderClass = 'border-primary'; bgClass = 'bg-blue-50'
          }

          return (
            <label
              key={opt.id}
              className={`flex items-center gap-2 border rounded-lg px-5 py-3 cursor-pointer transition-colors font-medium text-sm ${borderClass} ${bgClass} ${textClass} ${submitted ? 'cursor-default' : 'hover:border-primary'}`}
            >
              <input
                type="radio"
                name={`tf-${question.id}`}
                value={opt.id}
                checked={selected === opt.id}
                onChange={() => !submitted && setSelected(opt.id)}
                disabled={submitted}
                className="accent-primary"
              />
              {opt.text}
            </label>
          )
        })}
      </div>

      {submitted && question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-textDark leading-relaxed mb-3">
          <span className="font-semibold text-blue-700">Explanation: </span>
          {question.explanation}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit Answer
        </button>
      )}

      {submitted && (
        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-100 text-success' : 'bg-red-100 text-danger'}`}>
          {isCorrect ? '✓ Correct!' : `✗ Incorrect — Answer is ${question.isTrue ? 'True' : 'False'}`}
        </div>
      )}
    </div>
  )
}


function NumericalQuestion({ question, onSubmit }) {
  const [inputVal, setInputVal] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const tolerance = question.tolerance ?? 0.01

  function handleCheck() {
    const num = parseFloat(inputVal)
    if (!isFinite(num)) return
    const correct = Math.abs(num - question.answer) <= tolerance
    setIsCorrect(correct)
    setSubmitted(true)
    onSubmit(correct)
  }

  return (
    <div>
      <p className="text-sm font-semibold text-textDark mb-4 leading-relaxed">{question.question}</p>

      {question.hint && (
        <p className="text-xs text-textMuted mb-3 italic">Hint: {question.hint}</p>
      )}

      <div className="flex gap-2 mb-3 items-center">
        <input
          type="number"
          step="any"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          disabled={submitted}
          placeholder="Enter your answer"
          aria-label="Your numerical answer"
          className="border border-border rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50"
          onKeyDown={(e) => e.key === 'Enter' && !submitted && handleCheck()}
        />
        {!submitted && (
          <button
            onClick={handleCheck}
            disabled={inputVal.trim() === ''}
            className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        )}
      </div>

      {submitted && (
        <div className={`rounded-lg p-3 text-sm mb-3 ${isCorrect ? 'bg-green-50 border border-success text-green-800' : 'bg-red-50 border border-danger text-red-800'}`}>
          {isCorrect
            ? `✓ Correct! Your answer: ${inputVal}, Expected: ${question.answer}`
            : `✗ Not quite. Your answer: ${inputVal}, Expected: ${question.answer} (±${tolerance})`}
        </div>
      )}

      {submitted && question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-textDark leading-relaxed">
          <span className="font-semibold text-blue-700">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}

// ─── Score Screen ─────────────────────────────────────────────────────────────

function ScoreScreen({ questions, answers, onRetryWrong, onStartOver }) {
  const correct = answers.filter(Boolean).length
  const total = questions.length
  const pct = Math.round((correct / total) * 100)
  const passed = pct >= 70

  return (
    <div>
      {/* Score summary */}
      <div className={`rounded-xl p-6 text-center mb-6 ${passed ? 'bg-green-50 border border-success' : 'bg-amber-50 border border-warning'}`}>
        <p className={`text-3xl font-bold mb-1 ${passed ? 'text-success' : 'text-warning'}`}>
          {correct} / {total}
        </p>
        <p className={`text-lg font-semibold ${passed ? 'text-green-700' : 'text-amber-700'}`}>
          {pct}% — {passed ? '🎉 Passed!' : 'Keep practicing!'}
        </p>
      </div>

      {/* Review table */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-3 font-semibold text-textDark">#</th>
              <th className="py-2 pr-3 font-semibold text-textDark">Question</th>
              <th className="py-2 font-semibold text-textDark">Result</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={q.id ?? i} className="border-b border-border last:border-0">
                <td className="py-2 pr-3 text-textMuted">{i + 1}</td>
                <td className="py-2 pr-3 text-textDark leading-snug">{q.question}</td>
                <td className="py-2">
                  {answers[i]
                    ? <span className="text-success font-bold">✓</span>
                    : <span className="text-danger font-bold">✗</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {answers.some((a) => !a) && (
          <button
            onClick={onRetryWrong}
            className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry Incorrect Questions
          </button>
        )}
        <button
          onClick={onStartOver}
          className="border border-border text-textDark bg-white rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function KnowledgeCheck({ questions = [], topicId }) {
  const { setStatus, getStatus, recordQuizAttempt } = useProgressContext()

  // quiz questions (may be subset for retry)
  const [quizQuestions, setQuizQuestions] = useState(questions)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [answeredCurrent, setAnsweredCurrent] = useState(false)
  const [finished, setFinished] = useState(false)

  const currentQuestion = quizQuestions[currentIdx]

  const handleAnswer = useCallback(
    (correct) => {
      setAnswers((prev) => [...prev, correct])
      setAnsweredCurrent(true)
    },
    []
  )

  function handleNext() {
    if (currentIdx + 1 >= quizQuestions.length) {
      // Finish quiz
      const finalAnswers = [...answers]
      const correct = finalAnswers.filter(Boolean).length
      const total = quizQuestions.length
      const pct = total > 0 ? Math.round((correct / total) * 100) : 0

      if (topicId) {
        recordQuizAttempt(topicId, correct, total)
        if (pct >= 70) {
          const cur = getStatus(topicId)
          if (cur !== 'completed') setStatus(topicId, 'completed')
        }
      }
      setFinished(true)
    } else {
      setCurrentIdx((i) => i + 1)
      setAnsweredCurrent(false)
    }
  }

  function handleRetryWrong() {
    const wrong = quizQuestions.filter((_, i) => !answers[i])
    setQuizQuestions(wrong)
    setCurrentIdx(0)
    setAnswers([])
    setAnsweredCurrent(false)
    setFinished(false)
  }

  function handleStartOver() {
    setQuizQuestions(questions)
    setCurrentIdx(0)
    setAnswers([])
    setAnsweredCurrent(false)
    setFinished(false)
  }

  if (!quizQuestions.length) {
    return <p className="text-sm text-textMuted italic">No questions available.</p>
  }

  if (finished) {
    return (
      <ScoreScreen
        questions={quizQuestions}
        answers={answers}
        onRetryWrong={handleRetryWrong}
        onStartOver={handleStartOver}
      />
    )
  }

  return (
    <div>
      <ProgressBar current={currentIdx + 1} total={quizQuestions.length} />

      {currentQuestion.type === 'multiple-choice' ? (
        <MCQuestion
          key={currentQuestion.id ?? currentIdx}
          question={currentQuestion}
          onSubmit={handleAnswer}
        />
      ) : currentQuestion.type === 'true-false' ? (
        <TrueFalseQuestion
          key={currentQuestion.id ?? currentIdx}
          question={currentQuestion}
          onSubmit={handleAnswer}
        />
      ) : (
        <NumericalQuestion
          key={currentQuestion.id ?? currentIdx}
          question={currentQuestion}
          onSubmit={handleAnswer}
        />
      )}

      {answeredCurrent && (
        <button
          onClick={handleNext}
          className="mt-4 bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {currentIdx + 1 >= quizQuestions.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}
