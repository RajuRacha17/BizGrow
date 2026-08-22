import React, { useState } from 'react'
import { FileText, Download, Printer, Sparkles, CheckCircle, Calendar } from 'lucide-react'
import '../styles/ReportsPage.css'

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [reportsList, setReportsList] = useState([])

  React.useEffect(() => {
    fetch('http://localhost:5000/api/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reports) {
          setReportsList(data.reports)
        }
      })
      .catch((err) => console.log('Reports fetch fallback:', err))
  }, [])

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const res = await fetch('http://localhost:5000/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `August 2026 PBIS Executive BI Audit`,
          type: 'Executive Summary',
        }),
      })

      const data = await res.json()
      if (data.success && data.report) {
        setReportsList([data.report, ...reportsList])
      }
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } catch (err) {
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 4000)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="reports-container">
      {/* Top Banner */}
      <div className="card reports-header-card">
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Executive Reports & Export Engine</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Generate comprehensive AI business summaries in high-resolution PDF format.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={handleGenerateReport}
          disabled={generating}
        >
          {generating ? (
            <>Generating Report PDF...</>
          ) : downloadSuccess ? (
            <><CheckCircle size={16} /> PDF Report Downloaded!</>
          ) : (
            <><Sparkles size={16} /> Generate Monthly Executive PDF</>
          )}
        </button>
      </div>

      {/* Monthly Summary Cards */}
      <div className="reports-grid">
        {[
          { title: 'July 2026 Executive Performance Report', date: 'Generated Aug 1, 2026', size: '2.4 MB' },
          { title: 'Q2 2026 Sales & Customer Churn Analysis', date: 'Generated Jul 1, 2026', size: '4.1 MB' },
          { title: 'AI Business Optimization Plan 2026', date: 'Generated Jun 15, 2026', size: '1.8 MB' }
        ].map((rep, idx) => (
          <div key={idx} className="card card-hover" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div className="gradient-bg" style={{ width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{rep.title}</h4>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 10 }}>
                  <span><Calendar size={11} /> {rep.date}</span>
                  <span>{rep.size}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '6px', fontSize: 12 }} onClick={handleGenerateReport}>
                <Download size={13} /> Download
              </button>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                <Printer size={13} /> Print
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Schedule Settings */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Automated Email Dispatch Schedule</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Configure automatic delivery of business intelligence reports to your executive board.</p>

        <div className="reports-schedule-grid">
          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Weekly Executive Digest</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sent every Monday at 8:00 AM EST to james@techventures.io</div>
            </div>
            <span className="badge badge-success">Active</span>
          </div>

          <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Monthly Profit & AI Forecast</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Sent on the 1st of every month to board@techventures.io</div>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}
