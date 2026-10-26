import { useReducer, useEffect } from 'react'

const STORAGE_KEY = 'stats-lab-progress'

// State shape:
// {
//   statuses: { [topicId]: 'not-started' | 'learning' | 'practicing' | 'completed' },
//   quizAttempts: { [topicId]: [{ score, total, timestamp }] },
//   practiceCounts: { [topicId]: number },
//   recentVisits: string[],  // topicIds, max 5, most recent first
// }

const initialState = {
  statuses: {},
  quizAttempts: {},
  practiceCounts: {},
  recentVisits: [],
}

function loadFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return { ...initialState, ...JSON.parse(raw) }
  } catch {
    // ignore parse errors
  }
  return initialState
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        statuses: { ...state.statuses, [action.topicId]: action.status },
      }
    case 'RECORD_QUIZ': {
      const prev = state.quizAttempts[action.topicId] || []
      return {
        ...state,
        quizAttempts: {
          ...state.quizAttempts,
          [action.topicId]: [
            ...prev,
            { score: action.score, total: action.total, timestamp: Date.now() },
          ],
        },
      }
    }
    case 'RECORD_PRACTICE':
      return {
        ...state,
        practiceCounts: {
          ...state.practiceCounts,
          [action.topicId]: (state.practiceCounts[action.topicId] || 0) + 1,
        },
      }
    case 'RECORD_VISIT': {
      const filtered = (state.recentVisits || []).filter((id) => id !== action.topicId)
      return {
        ...state,
        recentVisits: [action.topicId, ...filtered].slice(0, 5),
      }
    }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export function useProgress() {
  const [state, dispatch] = useReducer(reducer, undefined, loadFromStorage)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // quota errors — silently ignore
    }
  }, [state])

  const getStatus = (topicId) => state.statuses[topicId] || 'not-started'

  const setStatus = (topicId, status) =>
    dispatch({ type: 'SET_STATUS', topicId, status })

  const recordQuizAttempt = (topicId, score, total) =>
    dispatch({ type: 'RECORD_QUIZ', topicId, score, total })

  const recordPracticeAttempt = (topicId) =>
    dispatch({ type: 'RECORD_PRACTICE', topicId })

  const recordVisit = (topicId) =>
    dispatch({ type: 'RECORD_VISIT', topicId })

  const getTopicStats = (topicId) => ({
    quizAttempts: state.quizAttempts[topicId] || [],
    quizScore:
      state.quizAttempts[topicId]?.length
        ? Math.max(...(state.quizAttempts[topicId].map((a) => a.score)))
        : null,
    practiceCount: state.practiceCounts[topicId] || 0,
  })

  const getAllStats = () => {
    const allAttempts = Object.values(state.quizAttempts).flat()
    const totalCorrect = allAttempts.reduce((sum, a) => sum + a.score, 0)
    const totalQuestions = allAttempts.reduce((sum, a) => sum + a.total, 0)
    const totalPractice = Object.values(state.practiceCounts).reduce((sum, n) => sum + n, 0)

    return {
      statuses: { ...state.statuses },
      totalCompleted: Object.values(state.statuses).filter((s) => s === 'completed').length,
      totalLearning: Object.values(state.statuses).filter((s) => s === 'learning').length,
      totalPracticing: Object.values(state.statuses).filter((s) => s === 'practicing').length,
      totalPractice,
      quizAccuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : null,
      recentVisits: state.recentVisits || [],
    }
  }

  const resetAll = () => dispatch({ type: 'RESET' })

  return { getStatus, setStatus, recordQuizAttempt, recordPracticeAttempt, recordVisit, getTopicStats, getAllStats, resetAll }
}
