import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, TrendingUp, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function BenchmarkingPage() {
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
      .catch(err => console.log('Benchmarking fetch error:', err))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <BarChart3 size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Benchmarking Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to calculate comparative benchmarks.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, categoryBreakdown, regionalPerformance } = analysis

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <BarChart3 size={12} /> Comparative Analysis
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Internal Benchmarking & Gaps</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Comparative evaluation across category segments, regions, and high-water mark periods.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Category Performance Comparison</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Category Name</th>
                <th style={{ padding: '10px 14px' }}>Revenue ($)</th>
                <th style={{ padding: '10px 14px' }}>Profit ($)</th>
                <th style={{ padding: '10px 14px' }}>Contribution Share</th>
              </tr>
            </thead>
            <tbody>
              {(categoryBreakdown || []).map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{cat.name}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>${cat.revenue.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', color: '#10B981' }}>${cat.profit.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="badge badge-info">{cat.share}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
