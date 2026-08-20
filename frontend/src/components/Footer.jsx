import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ShieldCheck } from 'lucide-react'
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="pbis-footer">
      <div className="pbis-footer-container">
        <div className="pbis-footer-grid">
          {/* Column 1: PBIS Brand & Description */}
          <div className="pbis-footer-col pbis-footer-col-brand">
            <Link to="/" className="pbis-footer-brand">
              <div className="pbis-footer-brand-icon gradient-bg">
                <TrendingUp size={18} />
              </div>
              <span className="pbis-footer-brand-title">PBIS Analytics</span>
            </Link>

            <p className="pbis-footer-desc">
              PBIS transforms business data into meaningful insights, identifies performance gaps, and provides actionable recommendations to support better business decisions and growth.
            </p>

            <div className="pbis-footer-soc-badge">
              <ShieldCheck size={14} color="#10B981" /> SOC-2 Compliant • Enterprise Grade
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div className="pbis-footer-col">
            <h4 className="pbis-footer-heading">Product</h4>
            <ul className="pbis-footer-links">
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><a href="/#transformation-engine">Transformation Engine</a></li>
              <li><a href="/#diagnostic-advantage">Diagnostic Advantage</a></li>
              <li><a href="/#features">Features & Security</a></li>
              <li><Link to="/dashboard">Live Analytics Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: System & Specs */}
          <div className="pbis-footer-col">
            <h4 className="pbis-footer-heading">System & Specs</h4>
            <ul className="pbis-footer-links">
              <li><a href="/#transformation-engine">AI Analysis Pipeline</a></li>
              <li><Link to="/ai-recommendations">Recommendation Engine</Link></li>
              <li><Link to="/reports">Executive PDF Exporter</Link></li>
              <li><Link to="/settings">API Integration & Keys</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pbis-footer-bottom">
          <p>© 2026 PBIS (Personalized Business Improvement System). All rights reserved.</p>
          <p className="pbis-footer-tagline">Built with purpose to turn business data into better decisions.</p>
        </div>
      </div>
    </footer>
  )
}
