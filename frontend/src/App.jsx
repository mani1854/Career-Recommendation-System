import { useEffect, useMemo, useState } from 'react'
import AuthForm from './components/AuthForm'
import Questionnaire from './components/Questionnaire'
import ResultView from './components/ResultView'
import { getQuestions, login, register, submitAssessment } from './api'

function formatAnswers(questionList, answerMap) {
  const grouped = {}
  questionList.forEach((item) => {
    grouped[item.type] = grouped[item.type] || []
    grouped[item.type].push(answerMap[item.type]?.[item.question])
  })
  return grouped
}

export default function App() {
  const [authMode, setAuthMode] = useState('login')
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
  }))
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth.token) return
    getQuestions(auth.token)
      .then((data) => setQuestions(data.questions))
      .catch((err) => setError(err.message))
  }, [auth.token])

  const missingAnswers = useMemo(() => {
    return questions.some((q) => answers[q.type]?.[q.question] === undefined)
  }, [questions, answers])

  const handleAuth = async (form) => {
    setLoading(true)
    setError('')
    try {
      const api = authMode === 'login' ? login : register
      const payload = authMode === 'login'
        ? { username: form.username, password: form.password }
        : form
      const data = await api(payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      setAuth({ token: data.token, username: data.username })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const setAnswer = (type, question, value) => {
    setAnswers((prev) => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [question]: value,
      },
    }))
  }

  const handleSubmitAssessment = async () => {
    if (missingAnswers) {
      setError('Please answer all questions before submitting.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const groupedAnswers = formatAnswers(questions, answers)
      const assessmentResult = await submitAssessment(auth.token, groupedAnswers)
      setResult(assessmentResult)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setAuth({ token: '', username: '' })
    setResult(null)
    setAnswers({})
    setQuestions([])
  }

  return (
    <main className="layout">
      <header>
        <h1>Career Recommendation System</h1>
        <p>Login/Register, complete the RIASEC questionnaire, and get career suggestions.</p>
      </header>

      {auth.token ? (
        <>
          <div className="toolbar">
            <span>Logged in as <strong>{auth.username}</strong></span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          {result ? (
            <ResultView result={result} />
          ) : (
            <Questionnaire
              questions={questions}
              answers={answers}
              setAnswer={setAnswer}
              onSubmit={handleSubmitAssessment}
              loading={loading}
            />
          )}
        </>
      ) : (
        <>
          <div className="switcher">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          </div>
          <AuthForm mode={authMode} onSubmit={handleAuth} loading={loading} />
        </>
      )}

      {error && <p className="error">{error}</p>}
    </main>
  )
}
