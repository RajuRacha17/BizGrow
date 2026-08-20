import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Lock, Mail, ArrowRight } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="login-page-wrapper">
      <PublicNavbar />

      <div className="login-container page-fade-in" style={{ padding: '60px 20px' }}>
        <div className="card login-card">
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

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={16} className="login-input-icon" />
                <input
                  className="input-field login-input-padded"
                  type="email"
                  required
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} className="login-input-icon" />
                <input
                  className="input-field login-input-padded"
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

            <button className="btn-primary" type="submit" style={{ padding: '12px', fontSize: 15, marginTop: 4 }}>
              Sign In to Dashboard <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-divider-container">
            <div className="login-divider-line" />
            <span className="login-divider-text">or continue with</span>
          </div>

          <button className="btn-secondary login-google-btn" type="button" onClick={(e) => e.preventDefault()}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 18, height: 18 }} />
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
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
