import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, X } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/RegisterPage.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccessMsg('Account registered successfully! Redirecting to login...')

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to backend server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page-wrapper">
      <PublicNavbar />

      <div className="register-container page-fade-in" style={{ padding: '60px 20px' }}>
        <div className="card register-card" style={{ position: 'relative' }}>
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

          {/* Brand Header Logo */}
          <Link to="/" className="register-brand" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <img src="/logo.png" alt="BizGrow Logo" style={{ height: 64, objectFit: 'contain' }} />
          </Link>

          <h2 className="register-title">Create your account</h2>

          {errorMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#fee2e2', color: '#dc2626', fontSize: 13, marginBottom: 16, border: '1px solid #fca5a5' }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ padding: '10px 14px', borderRadius: 8, backgroundColor: '#dcfce7', color: '#166534', fontSize: 13, marginBottom: 16, border: '1px solid #86efac' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">

            {/* 2. Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
              <div className="register-input-wrapper">
                <input
                  className="input-field"
                  type="text"
                  required
                  placeholder="Enter Your Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* 3. Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <div className="register-input-wrapper">
                <input
                  className="input-field"
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div className="register-input-wrapper">
                <input
                  className="input-field"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 6, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Creating Account...' : <>Register <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Log in here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
