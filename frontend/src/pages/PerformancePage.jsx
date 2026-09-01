import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, TrendingUp, BarChart2, ArrowUpRight, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function PerformancePage() {
  const [analysis, setAnalysis] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) {
          setAnalysis(data.analysis)
        }
      })
      .catch(err => console.log('Performance fetch error:', err))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Zap size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Performance Data Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to calculate performance gaps and variance metrics.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, salesData } = analysis
  const bestMonth = salesData && salesData.length > 0 ? [...salesData].sort((a, b) => b.revenue - a.revenue)[0] : null
  const worstMonth = salesData && salesData.length > 0 ? [...salesData].sort((a, b) => a.revenue - b.revenue)[0] : null

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Zap size={12} /> Performance Diagnostics
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Performance & Gap Analysis</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Evaluation of revenue variance, high-water mark periods, and target performance gaps.
          </p>
        </div>
      </div>

      {/* Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Highest Revenue Period</span>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#10B981', margin: '4px 0' }}>
            {bestMonth ? `$${bestMonth.revenue.toLocaleString()}` : '$0'}
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Period: {bestMonth?.month || 'N/A'}</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lowest Revenue Period</span>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#F59E0B', margin: '4px 0' }}>
            {worstMonth ? `$${worstMonth.revenue.toLocaleString()}` : '$0'}
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Period: {worstMonth?.month || 'N/A'}</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Average Order Value (AOV)</span>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#2563EB', margin: '4px 0' }}>
            ${summary.avgOrderValue ? summary.avgOrderValue.toLocaleString() : 0}
          </h3>
          <span style={{ fontSize: 12, color: '#10B981' }}>Calculated from valid dataset rows</span>
        </div>
      </div>
    </div>
  )
}
