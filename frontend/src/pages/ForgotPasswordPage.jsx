import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, X, ArrowLeft, CheckCircle2 } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/LoginPage.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to process request')
      }

      setSubmitted(true)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      <PublicNavbar />

      <div className="login-container page-fade-in" style={{ padding: '60px 20px' }}>
        <div className="card login-card" style={{ position: 'relative', maxWidth: 460 }}>
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

          {/* Brand Logo */}
          <Link to="/" className="login-brand" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <img src="/logo.png" alt="BizGrow Logo" style={{ height: 64, objectFit: 'contain' }} />
          </Link>

          <h2 className="login-title">Forgot Password?</h2>

          {!submitted ? (
            <>
              <p className="login-subtitle">
                Enter the email address associated with your account and we'll send you a link to reset your password.
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

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ padding: '12px', fontSize: 15, marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Sending...' : <>Send Reset Link <ArrowRight size={16} /></>}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link
                  to="/login"
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: 16 }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Check your email</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
                An account for <strong>{email}</strong>, a password reset link has been sent. Please check your inbox and follow the instructions.
              </p>

              <Link
                to="/login"
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
