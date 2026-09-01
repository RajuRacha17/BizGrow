import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cpu, Sparkles, AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function AIAnalysisPage() {
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
      .catch(err => console.log('AI Analysis fetch error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Cpu size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>AI Analysis Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload a business dataset to trigger AI pattern detection and diagnostic analysis.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, problems, profile, categoryBreakdown } = analysis

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header */}
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)', marginBottom: 8 }}>
            <Sparkles size={12} /> AI Diagnostic Intelligence
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>AI Analysis & Pattern Detection</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Automated machine-learning interpretation of business performance drivers, anomalies, and risks.
          </p>
        </div>
      </div>

      {/* AI Explanation Box */}
      <div className="card" style={{ padding: 24, marginBottom: 24, backgroundColor: 'rgba(37,99,235,0.03)', border: '1px solid rgba(37,99,235,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Cpu size={20} color="var(--primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Diagnostic Summary</h3>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-main)' }}>
          Analysis of dataset <strong>{analysis.datasetName || 'Uploaded Data'}</strong> ({profile.totalRows} records) indicates an overall Business Health Score of <strong>{summary.healthScore}/100</strong> ({summary.healthStatus}).
          Key revenue driver is lead category <strong>{categoryBreakdown?.[0]?.name || 'Primary Segment'}</strong> generating <strong>${(categoryBreakdown?.[0]?.revenue || 0).toLocaleString()}</strong> with net profit margin of <strong>{summary.profitMargin}</strong>.
        </p>
      </div>

      {/* Grid: Detected Problems & Risk Factors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Problems & Bottlenecks */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <ShieldAlert size={18} color="#EF4444" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Detected Bottlenecks & Risks</h3>
          </div>
          {problems && problems.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {problems.map((p, idx) => (
                <div key={idx} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</span>
                    <span className="badge badge-info" style={{ background: '#EF444415', color: '#EF4444', fontSize: 10 }}>{p.severity}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.evidence}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#10B981' }}>No critical business risk bottlenecks detected in active dataset.</p>
          )}
        </div>

        {/* Growth Drivers & Positive Factors */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} color="#10B981" />
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Positive Growth Drivers</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(summary.positiveFactors || ['Strong historical order stability', 'Healthy data quality profile']).map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
