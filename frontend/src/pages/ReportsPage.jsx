import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Printer, Sparkles, CheckCircle2, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import { formatINR } from '../utils/formatters'
import '../styles/DashboardPage.css'

export default function ReportsPage() {
  const [analysis, setAnalysis] = useState(null)
  const [reports, setReports] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/reports')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReports(data.reports || [])
          if (data.analysis) setAnalysis(data.analysis)
        }
      })
      .catch(err => console.log('Reports fetch error:', err))
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleGenerateReport = async () => {
    try {
      const res = await authFetch('http://localhost:5000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Executive Business Audit - ${new Date().toLocaleDateString()}` })
      })
      const data = await res.json()
      if (data.success) {
        setReports([data.report, ...reports])
      }
    } catch (err) {
      console.log('Generate report error:', err)
    }
  }

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <FileText size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Report Generation Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to compile executive business reports.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, profile, categoryBreakdown, recommendations } = analysis

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      {/* Header Controls */}
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <FileText size={12} /> Executive Summary
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Executive Business Report</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Simple executive business summary compiled directly from your uploaded dataset.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={handlePrint} style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Printer size={16} /> Print / Export Report
          </button>
          <button className="btn-primary" onClick={handleGenerateReport} style={{ padding: '10px 18px', display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--secondary)' }}>
            <Sparkles size={16} /> Generate New Audit
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="card" style={{ padding: 40, marginBottom: 28, backgroundColor: '#FFF', color: '#0F172A', borderRadius: 12, border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: 20, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1E293B', margin: 0 }}>Executive Business Audit</h1>
            <p style={{ color: '#64748B', fontSize: 13, margin: '4px 0 0' }}>Dataset: {analysis.datasetName || 'Uploaded Business Data'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Date: {new Date().toLocaleDateString()}</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#2563EB', marginTop: 4 }}>Health Score: {summary.healthScore}/100</div>
          </div>
        </div>

        {/* Section 1: Business Summary */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', marginBottom: 8, borderLeft: '4px solid #2563EB', paddingLeft: 10 }}>
            BUSINESS SUMMARY
          </h3>
          <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0 }}>
            Your business is performing with an overall health score of {summary.healthScore} out of 100 ({summary.healthStatus}). Total revenue earned is {formatINR(summary.monthlyRevenue)} across {summary.totalSales} completed orders with a profit margin of {summary.profitMargin}.
          </p>
        </div>

        {/* Section 2: What Is Going Well */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#10B981', marginBottom: 8, borderLeft: '4px solid #10B981', paddingLeft: 10 }}>
            WHAT IS GOING WELL
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(summary.positiveFactors || ['Revenue trajectory is stable across recent periods.', 'Dataset structure is complete and ready for ongoing evaluation.']).map((pos, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#334155' }}>✓ {pos}</div>
            ))}
          </div>
        </div>

        {/* Section 3: What Needs Attention */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#EF4444', marginBottom: 8, borderLeft: '4px solid #EF4444', paddingLeft: 10 }}>
            WHAT NEEDS ATTENTION
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(summary.negativeFactors || ['Profit margin retention needs review.', 'Underperforming product lines require pricing audit.']).map((neg, idx) => (
              <div key={idx} style={{ fontSize: 13, color: '#334155' }}>⚠ {neg}</div>
            ))}
          </div>
        </div>

        {/* Section 4: Recommendations & Priority Action Plan */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2563EB', marginBottom: 8, borderLeft: '4px solid #2563EB', paddingLeft: 10 }}>
            RECOMMENDATIONS & PRIORITY ACTION PLAN
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(recommendations || []).map((rec, idx) => (
              <div key={idx} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1E293B' }}>{idx + 1}. {rec.title} ({rec.priority} Priority)</div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Action: {rec.recommendedAction}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
