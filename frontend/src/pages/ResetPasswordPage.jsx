import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, X, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/LoginPage.css'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(true)
  const [invalidMsg, setInvalidMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenValid(false)
        setInvalidMsg('This password reset link is invalid or missing.')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-reset-token/${token}`)
        const data = await response.json()

        if (!response.ok || !data.valid) {
          setTokenValid(false)
          setInvalidMsg(data.message || 'This password reset link is invalid or no longer available.')
        } else {
          setTokenValid(true)
        }
      } catch (err) {
        // In case of backend connection hiccup, allow user to attempt submission
        setTokenValid(true)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Please enter and confirm your new password.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your new password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.message && data.message.includes('invalid or has expired')) {
          setTokenValid(false)
          setInvalidMsg(data.message)
          return
        }
        throw new Error(data.message || 'Failed to reset password')
      }

      setSuccess(true)
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

          {verifying ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <RefreshCw size={32} color="var(--primary)" className="spin" style={{ animation: 'spin 1s linear infinite', marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Verifying password reset link...</p>
            </div>
          ) : !tokenValid ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', backgroundColor: '#fee2e2', color: '#dc2626', marginBottom: 16 }}>
                <AlertTriangle size={32} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Link Invalid or Expired</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
                {invalidMsg || 'This password reset link is invalid or no longer available.'}
              </p>

              <Link
                to="/forgot-password"
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
                Request New Reset Link <ArrowRight size={16} />
              </Link>
            </div>
          ) : success ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', marginBottom: 16 }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Password Reset Successful</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>
                Your password has been updated successfully. You can now log in with your new password.
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
                Back to Login <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <h2 className="login-title">Create New Password</h2>
              <p className="login-subtitle">
                Please enter and confirm your new account password below.
              </p>

              {errorMsg && (
                <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="login-form">
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>New Password</label>
                  <div className="login-input-wrapper">
                    <input
                      className="input-field"
                      type="password"
                      required
                      placeholder="Enter new password (min. 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm New Password</label>
                  <div className="login-input-wrapper">
                    <input
                      className="input-field"
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading}
                  style={{ padding: '12px', fontSize: 15, marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Updating Password...' : <>Reset Password <ArrowRight size={16} /></>}
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
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
