import { useState } from 'react'

export default function AuthForm({ mode, onSubmit, loading }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' })

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(event) => setForm({ ...form, username: event.target.value })}
        required
      />
      {mode === 'register' && (
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
      )}
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        required
      />
      <button disabled={loading}>{loading ? 'Please wait...' : 'Continue'}</button>
    </form>
  )
}
