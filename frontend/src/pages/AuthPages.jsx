import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field, Input, PageTitle } from '../components/ShopUI'
import { useShop } from '../context/useShop'
import { AuthPageFrame } from './PageFrames'
import { loginApi, registerApi } from '../api/authService'
import { useToast } from '../context/ToastContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useShop()
  const toast = useToast()
  const [form, setForm] = useState({ email: 'guest@shopease.com', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')
      const resp = await loginApi(form.email, form.password)
      login({ token: resp.token, username: resp.username, email: resp.username, role: resp.role })
      toast.show('Logged in successfully', { type: 'success' })
      navigate('/products')
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || 'Login failed'
      setError(msg)
      toast.show(msg, { type: 'error' })
    }
  }

  return (
    <AuthPageFrame
      title="Welcome Back!"
      subtitle="Login to continue"
      sideTitle="Login Page"
      sideDescription="Matches the wireframe pattern with a centered auth card and a soft commerce illustration."
    >
      <PageTitle eyebrow="Authentication" title="Welcome back" description="Use the backend login endpoint conceptually, while the frontend previews the session flow." />
      <form className="form-grid" onSubmit={handleSubmit}>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </Field>
        <div className="button-row form-actions">
          <Button type="submit">Login</Button>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </form>
      {error ? <p className="form-error">{error}</p> : null}
      <p className="form-note">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthPageFrame>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useShop()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (form.password !== form.confirmPassword) {
      const msg = 'Password and confirm password must match.'
      setError(msg)
      toast.show(msg, { type: 'error' })
      return
    }

    try {
      setError('')
      await registerApi(form.name, form.email, form.password)
      register({ name: form.name, email: form.email })
      toast.show('Registration successful', { type: 'success' })
      navigate('/login')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Registration failed'
      setError(msg)
      toast.show(msg, { type: 'error' })
    }
  }

  return (
    <AuthPageFrame
      title="Create Account"
      subtitle="Sign up to get started"
      sideTitle="Register Page"
      sideDescription="Styled to mirror the register wireframe with a clean form, strong hierarchy, and pastel emphasis."
    >
      <PageTitle eyebrow="Authentication" title="Create your account" description="The frontend form mirrors the backend register API fields and role concept." />
      <form className="form-grid" onSubmit={handleSubmit}>
        <Field label="Full Name">
          <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </Field>
        <Field label="Password">
          <Input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        </Field>
        <Field label="Confirm Password">
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            required
          />
        </Field>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="button-row form-actions">
          <Button type="submit">Create Account</Button>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </form>
      <p className="form-note">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </AuthPageFrame>
  )
}
