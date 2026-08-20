import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TrendingUp, ArrowRight, Menu, X } from 'lucide-react'
import '../styles/PublicNavbar.css'

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className={`pbis-pub-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="pbis-pub-nav-container">
        {/* Brand Logo */}
        <Link to="/" className="pbis-pub-brand" onClick={closeMobileMenu}>
          <div className="pbis-pub-brand-icon gradient-bg">
            <TrendingUp size={20} />
          </div>
          <span className="pbis-pub-brand-title">PBIS Analytics</span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="pbis-pub-nav-links">
          <a href="/#top" className="pbis-pub-link">Home</a>
          <a href="/#how-it-works" className="pbis-pub-link">How It Works</a>
          <a href="/#transformation-engine" className="pbis-pub-link">Transformation</a>
          <a href="/#diagnostic-advantage" className="pbis-pub-link">Why PBIS</a>
          <a href="/#features" className="pbis-pub-link">Features</a>
          <Link to="/dashboard" className="pbis-pub-link pbis-pub-link-highlight">
            Dashboard
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="pbis-pub-actions">
          <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: 14 }}>
            Log In
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>
            Get Started Free <ArrowRight size={15} />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="pbis-pub-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="pbis-pub-mobile-menu">
          <nav className="pbis-pub-mobile-nav">
            <a href="/#top" className="pbis-pub-mobile-link" onClick={closeMobileMenu}>Home</a>
            <a href="/#how-it-works" className="pbis-pub-mobile-link" onClick={closeMobileMenu}>How It Works</a>
            <a href="/#transformation-engine" className="pbis-pub-mobile-link" onClick={closeMobileMenu}>Transformation Pipeline</a>
            <a href="/#diagnostic-advantage" className="pbis-pub-mobile-link" onClick={closeMobileMenu}>Why PBIS</a>
            <a href="/#features" className="pbis-pub-mobile-link" onClick={closeMobileMenu}>Features</a>
            <Link to="/dashboard" className="pbis-pub-mobile-link pbis-pub-link-highlight" onClick={closeMobileMenu}>
              Live Dashboard
            </Link>

            <div className="pbis-pub-mobile-ctas">
              <Link to="/login" className="btn-secondary" onClick={closeMobileMenu} style={{ width: '100%', justifyContent: 'center' }}>
                Log In
              </Link>
              <Link to="/register" className="btn-primary" onClick={closeMobileMenu} style={{ width: '100%', justifyContent: 'center' }}>
                Get Started Free <ArrowRight size={16} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
