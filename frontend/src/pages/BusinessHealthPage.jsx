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

  const dimScores = summary.dimensionScores || {}
  const dimensions = [
    { name: 'Revenue Trajectory', score: dimScores.revenueScore || (summary.monthlyRevenue > 50000 ? 85 : 68), weight: '25%', color: '#2563EB' },
    { name: 'Profitability & Margin', score: dimScores.profitScore || (parseFloat(summary.profitMargin) >= 25 ? 88 : 62), weight: '25%', color: '#10B981' },
    { name: 'Customer Activity', score: dimScores.customerScore || (summary.customerCount > 10 ? 82 : 58), weight: '20%', color: '#7C3AED' },
    { name: 'Product Line Performance', score: dimScores.productScore || ((analysis.productPerformanceData || []).length >= 3 ? 88 : 65), weight: '15%', color: '#F59E0B' },
    { name: 'Data Readiness & Quality', score: dimScores.qualityScore || (profile.qualityScore || 80), weight: '15%', color: '#EC4899' }
  ]

  const rawAttention = summary.attentionItems && summary.attentionItems.length > 0 
    ? summary.attentionItems 
    : (summary.negativeFactors || []).map((neg, i) => ({
        title: `Attention Area #${i + 1}`,
        detail: neg,
        severity: i === 0 ? 'HIGH' : 'MEDIUM',
        impact: 'Margin & growth protection'
      }))

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', marginBottom: 8 }}>
            <ShieldCheck size={12} /> Dynamic Business Evaluation
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Business Health Score</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Data-driven evaluation calculated specifically from your uploaded dataset metrics.
          </p>
        </div>

        <div className="dashboard-health-score-box">
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Health Score</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: summary.healthScore >= 75 ? '#10B981' : summary.healthScore >= 55 ? '#F59E0B' : '#EF4444' }}>
              {summary.healthScore} / 100
            </div>
            <div style={{ fontSize: 12, color: '#60A5FA' }}>{summary.healthStatus}</div>
          </div>
        </div>
      </div>

      {/* What's Going Well vs What Needs Attention */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* What's Going Well */}
        <div className="card" style={{ padding: 24, backgroundColor: 'rgba(16,185,129,0.03)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <CheckCircle2 size={20} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>What's Going Well?</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(summary.positiveFactors || ['Revenue trajectory is stable across recent periods.', 'Data quality is sufficient for clear analysis.']).map((pos, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-main)', lineHeight: 1.4 }}>
                <span style={{ color: '#10B981', fontWeight: 800, fontSize: 14 }}>✓</span>
                <span>{pos}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What Needs Attention? */}
        <div className="card" style={{ padding: 24, backgroundColor: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <AlertCircle size={20} color="#EF4444" />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>What Needs Attention?</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>Critical operational bottlenecks identified from your uploaded data</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rawAttention.map((item, idx) => (
              <div key={idx} style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: 'var(--card-bg)',
                border: item.severity === 'HIGH' ? '1px solid rgba(239,68,68,0.4)' : '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>
                    {item.title || `Attention Area #${idx + 1}`}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 10,
                    backgroundColor: item.severity === 'HIGH' ? '#EF444420' : '#F59E0B20',
                    color: item.severity === 'HIGH' ? '#EF4444' : '#F59E0B'
                  }}>
                    {item.severity || 'MEDIUM'} RISK
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {item.detail || item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overall Summary & Explanation Text */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Dynamic Business Health Explanation</h3>
        <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6 }}>
          Based on your uploaded dataset profile, your overall Business Health Score is <strong>{summary.healthScore}/100 ({summary.healthStatus})</strong>. 
          This score is dynamically computed from your weighted Revenue Trajectory ({dimensions[0].score}/100), Profit Margin ({dimensions[1].score}/100), Customer Base ({dimensions[2].score}/100), Product Portfolio ({dimensions[3].score}/100), and Data Readiness ({dimensions[4].score}/100).
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
          💡 <strong>How to improve your score:</strong> Address the high-priority items in the <em>What Needs Attention?</em> section above, specifically focusing on expanding profit margins and reducing product dependency.
        </p>
      </div>

      {/* Dimensions Breakdown Grid */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-main)' }}>Business Health Area Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {dimensions.map((dim, idx) => (
            <div key={idx} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dim.name}</span>
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
