import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Calendar, Filter, Upload } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function SalesAnalysisPage() {
  const [analysis, setAnalysis] = useState(null)
  const [timeFilter, setTimeFilter] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) {
          setAnalysis(data.analysis)
        }
      })
      .catch(err => console.log('Sales fetch error:', err))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <ShoppingCart size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Sales Data Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to calculate sales trends and regional breakdowns.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, salesData, regionalPerformance } = analysis
  const filteredSalesData = timeFilter === '30' ? salesData.slice(-1) : timeFilter === '90' ? salesData.slice(-3) : salesData

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <ShoppingCart size={12} /> Financial Analytics
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Sales & Revenue Analysis</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Revenue streams, order volume, average order values, and geographical performance.
          </p>
        </div>

        {/* Date Filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['7', '30', '90', 'ALL'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className="btn-primary"
              style={{
                fontSize: 12,
                padding: '6px 12px',
                background: timeFilter === f ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: timeFilter === f ? '#FFF' : 'var(--text-muted)',
                border: '1px solid var(--border)'
              }}
            >
              {f === 'ALL' ? 'All Time' : `Last ${f} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Filtered Sales & Revenue Trajectory</h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={filteredSalesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-light)" fontSize={12} />
              <YAxis stroke="var(--text-light)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} name="Revenue ($)" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} name="Profit ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
