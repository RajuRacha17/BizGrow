import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, ArrowRight, Building, User, Mail, Lock } from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import Footer from '../components/Footer'
import '../styles/RegisterPage.css'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="register-page-wrapper">
      <PublicNavbar />

      <div className="register-container page-fade-in" style={{ padding: '60px 20px' }}>
        <div className="card register-card">
          {/* Brand Header */}
          <Link to="/" className="register-brand">
            <div className="register-brand-icon gradient-bg">
              <TrendingUp size={22} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 800 }}>PBIS Analytics</span>
          </Link>

          <h2 className="register-title">Create your account</h2>
          <p className="register-subtitle">Enter your details to launch your analytics workspace.</p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* 1. Business Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Business Name</label>
              <div className="register-input-wrapper">
                <Building size={16} className="register-input-icon" />
                <input
                  className="input-field register-input-padded"
                  type="text"
                  required
                  placeholder="Acme Corp"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
            </div>

            {/* 2. Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full Name</label>
              <div className="register-input-wrapper">
                <User size={16} className="register-input-icon" />
                <input
                  className="input-field register-input-padded"
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* 3. Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</label>
              <div className="register-input-wrapper">
                <Mail size={16} className="register-input-icon" />
                <input
                  className="input-field register-input-padded"
                  type="email"
                  required
                  placeholder="jane@acme.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* 4. Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Password</label>
              <div className="register-input-wrapper">
                <Lock size={16} className="register-input-icon" />
                <input
                  className="input-field register-input-padded"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" style={{ width: '100%', padding: '12px', fontSize: 15, marginTop: 6 }}>
              Register & Launch Dashboard <ArrowRight size={16} />
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
