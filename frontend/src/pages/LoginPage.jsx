import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, X } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      navigate('/dashboard')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to backend server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      <PublicNavbar />

      <div className="login-container page-fade-in" style={{ padding: '60px 20px' }}>
        <div className="card login-card" style={{ position: 'relative' }}>
          {/* Close / Cross Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Close"
            title="Close"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>

          {/* Brand */}
          <Link to="/" className="login-brand">
            <div className="login-brand-icon gradient-bg">
              <TrendingUp size={22} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>PBIS Analytics</span>
          </Link>

          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">
            Sign in to access your business intelligence insights.
          </p>

          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
              <div className="login-input-wrapper">
                <input
                  className="input-field"
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div className="login-input-wrapper">
                <input
                  className="input-field"
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{ textAlign: 'right', marginTop: 6 }}>
                <a href="#forgot" className="login-forgot-link">Forgot password?</a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#2563EB', cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>Remember me on this device</label>
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ padding: '12px', fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing In...' : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Create account
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
