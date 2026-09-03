import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, ShieldCheck, TrendingUp, AlertTriangle, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function BusinessHealthPage() {
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) {
          setAnalysis(data.analysis)
        }
      })
      .catch(err => console.log('Business Health fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Activity size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Business Health Data Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to generate your Business Health Score.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, profile } = analysis

  const dimensions = [
    { name: 'Revenue Trajectory', score: summary.monthlyRevenue > 50000 ? 92 : 75, weight: '25%', color: '#2563EB' },
    { name: 'Profitability & Margin', score: parseFloat(summary.profitMargin) >= 25 ? 88 : 65, weight: '25%', color: '#10B981' },
    { name: 'Customer Activity', score: summary.customerCount > 10 ? 84 : 60, weight: '20%', color: '#7C3AED' },
    { name: 'Product Line Performance', score: (analysis.productPerformanceData || []).length >= 3 ? 90 : 70, weight: '15%', color: '#F59E0B' },
    { name: 'Data Readiness & Quality', score: profile.qualityScore || 85, weight: '15%', color: '#EC4899' }
  ]

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', marginBottom: 8 }}>
            <ShieldCheck size={12} /> Business Analyst Evaluation
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Business Health Index</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Evaluation of your business stability based on your uploaded sales and revenue data.
          </p>
        </div>

        <div className="dashboard-health-score-box">
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Health Score</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#10B981' }}>{summary.healthScore} / 100</div>
            <div style={{ fontSize: 12, color: '#60A5FA' }}>{summary.healthStatus}</div>
          </div>
        </div>
      </div>

      {/* What's Going Well vs What Needs Attention */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24, backgroundColor: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <CheckCircle2 size={20} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What's Going Well?</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(summary.positiveFactors || ['Revenue trajectory is stable across recent periods.', 'Data quality is sufficient for clear analysis.']).map((pos, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-main)' }}>
                <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                <span>{pos}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <AlertCircle size={20} color="#EF4444" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What Needs Attention?</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(summary.negativeFactors || ['Profit margin retention needs review.', 'Certain product lines are contributing below benchmark expectations.']).map((neg, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-main)' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>⚠</span>
                <span>{neg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Summary Card */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Overall Business Analyst Summary</h3>
        <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6 }}>
          Your business is currently in a <strong>{summary.healthStatus.toLowerCase()}</strong> position with an overall rating of <strong>{summary.healthScore}/100</strong>. Continuing to strengthen top revenue drivers while addressing underperforming product lines will help increase long-term profitability.
        </p>
      </div>

      {/* Dimensions Breakdown Grid */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Business Health Area Scores</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {dimensions.map((dim, idx) => (
            <div key={idx} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{dim.name}</span>
                <span style={{ fontWeight: 700, color: dim.color }}>{dim.score} / 100</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: 'var(--border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${dim.score}%`, backgroundColor: dim.color, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
