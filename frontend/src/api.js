const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Token ${options.token}` } : {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed')
  }
  return data
}

export const register = (payload) =>
  request('/auth/register/', { method: 'POST', body: JSON.stringify(payload) })

export const login = (payload) =>
  request('/auth/login/', { method: 'POST', body: JSON.stringify(payload) })

export const getQuestions = (token) => request('/assessment/questions/', { token })

export const submitAssessment = (token, answers) =>
  request('/assessment/submit/', {
    method: 'POST',
    token,
    body: JSON.stringify({ answers }),
  })
