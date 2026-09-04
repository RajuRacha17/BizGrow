import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import PublicNavbar from '../components/PublicNavbar'
import TransformationEngine from '../components/TransformationEngine'
import DiagnosticAdvantage from '../components/DiagnosticAdvantage'
import Footer from '../components/Footer'
import '../styles/LandingPage.css'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    {
      q: 'How does PBIS connect to my existing business data?',
      a: 'PBIS integrates seamlessly via API keys, database connectors, or CSV uploads to automatically aggregate metrics from Shopify, Stripe, Salesforce, or custom databases.'
    },
    {
      q: 'Is my enterprise data secure and compliant?',
      a: 'Yes. PBIS uses bank-grade AES-256 encryption at rest and in transit, with full SOC-2 compliance, role-based access control, and dedicated private server options.'
    },
    {
      q: 'How accurate are the AI business forecasting models?',
      a: 'PBIS models evaluate historical velocity, customer churn signals, and seasonal trends to surface realistic diagnostic insight vectors.'
    }
  ]

  return (
    <div className="landing-container page-fade-in" id="top">
      {/* Universal Sticky SaaS Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-badge">
          <Sparkles size={16} /> Next-Gen AI Business Intelligence
        </div>

        <h1 className="landing-hero-title">
          Transform Raw Business Data into <span className="gradient-text">AI Actionable Growth</span>
        </h1>

        <p className="landing-hero-desc">
          Personalized Business Improvement System (PBIS) delivers real-time sales forecasting, customer sentiment tracking, and automated AI strategy recommendations tailored to your enterprise.
        </p>

        <div className="landing-hero-actions">
          <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 28px', fontSize: 16 }}>
            Explore Live Dashboard Demo <ArrowRight size={18} />
          </Link>
        </div>

        {/* Dashboard Mockup Showcase */}
        <div className="card landing-mockup-card">
          <div className="landing-mockup-inner">
            <div className="landing-mockup-header">
              <div className="landing-mockup-dots">
                <span className="landing-dot-red" />
                <span className="landing-dot-yellow" />
                <span className="landing-dot-green" />
              </div>
              <span className="landing-mockup-url">pbis.analytics.app/dashboard</span>
            </div>

            <div className="landing-mockup-grid">
              {[
                { title: 'Business Health Score', val: '94/100', sub: '+5.2% boost' },
                { title: 'Monthly Revenue', val: '$128,450', sub: '+14.8% vs last mo' },
                { title: 'Active Customers', val: '2,840', sub: '92% retention' },
                { title: 'AI Insights Ready', val: '12 Actionable', sub: 'Updated live' }
              ].map((k, idx) => (
                <div key={idx} className="landing-mockup-item">
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{k.title}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{k.val}</div>
                  <div style={{ fontSize: 11, color: '#10B981', marginTop: 2 }}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="landing-mockup-placeholder">
              <div style={{ textAlign: 'center' }}>
                <BarChart2 size={48} color="#2563EB" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 16, fontWeight: 600 }}>Interactive Analytics Visualizer Ready</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Click "Explore Live Dashboard Demo" to launch the interactive application</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="landing-section" id="how-it-works">
        <h2 className="landing-section-title">PBIS Business Workflow</h2>
        <p className="landing-section-subtitle">Automated intelligence that works seamlessly alongside your team in 3 simple steps.</p>

        <div className="landing-steps-grid">
          {[
            { num: '01', title: '1. Connect Your Data', desc: 'Plug in your sales, CRM, or e-commerce accounts in under 2 minutes with automated sync.' },
            { num: '02', title: '2. AI Engine Analysis', desc: 'Our machine learning models detect churn signals, inventory risks, and cross-sell patterns.' },
            { num: '03', title: '3. Execute & Scale', desc: 'Apply one-click AI strategy recommendations to immediately boost monthly revenue.' }
          ].map((s, idx) => (
            <div key={idx} className="card card-hover landing-step-card">
              <span className="landing-step-number">{s.num}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1 — THE TRANSFORMATION ENGINE */}
      <TransformationEngine />

      {/* SECTION 2 — THE DIAGNOSTIC ADVANTAGE */}
      <DiagnosticAdvantage />

      {/* Features Grid */}
      <section className="landing-section" id="features">
        <h2 className="landing-section-title">Engineered for Smart Decision Making</h2>
        <p className="landing-section-subtitle">Everything you need to analyze, forecast, and optimize your business.</p>

        <div className="landing-features-grid">
          {[
            { icon: Sparkles, title: 'AI Business Advisor', desc: 'Real-time recommendations for marketing, inventory management, and customer engagement.' },
            { icon: BarChart2, title: 'Predictive Analytics', desc: 'Forecast sales revenue trends up to 6 months in advance with accuracy algorithms.' },
            { icon: ShieldCheck, title: 'Enterprise Security', desc: 'Bank-grade encryption, SOC-2 compliance, and role-based access control.' },
            { icon: Zap, title: 'Automated Reports', desc: 'Generate and schedule branded executive PDF summaries directly to your inbox.' },
            { icon: TrendingUp, title: 'Sentiment Tracking', desc: 'Monitor customer reviews, feedback scores, and retention health in one place.' },
            { icon: CheckCircle, title: 'Multi-Industry Templates', desc: 'Pre-built KPI dashboards tailored for Retail, SaaS, E-commerce, and Services.' }
          ].map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className="card card-hover landing-feature-card">
                <div className="landing-feature-icon gradient-bg">
                  <Icon size={24} />
                </div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="landing-section">
        <h2 className="landing-section-title">Frequently Asked Questions</h2>
        <p className="landing-section-subtitle">Have questions? We have answers.</p>

        <div className="faq-grid">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="card faq-card"
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div className="faq-header">
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#2563EB" /> : <ChevronDown size={18} color="var(--text-light)" />}
              </div>
              {openFaq === idx && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Conversion CTA Banner */}
      <section className="landing-section">
        <div className="landing-cta-card card">
          <div className="landing-cta-content">
            <h2 className="landing-cta-title">Ready to Accelerate Your Business Growth?</h2>
            <p className="landing-cta-desc">
              Connect your business data today and receive personalized, AI-driven recommendations designed to improve performance and eliminate operational bottlenecks.
            </p>
            <div className="landing-cta-actions">
              <Link to="/register" className="btn-primary" style={{ padding: '14px 28px', fontSize: 16 }}>
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/dashboard" className="btn-secondary" style={{ padding: '14px 24px', fontSize: 16 }}>
                Explore Live Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Footer */}
      <Footer />
    </div>
  )
}
