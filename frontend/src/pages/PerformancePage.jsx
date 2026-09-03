import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, TrendingUp, DollarSign, ShoppingCart, Users, HelpCircle, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import { formatINR } from '../utils/formatters'
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
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to review performance metrics.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const { summary, customerData } = analysis

  const metricsList = [
    {
      title: 'Revenue',
      value: summary.monthlyRevenue ? formatINR(summary.monthlyRevenue) : null,
      explanation: 'How much total money your business generated.',
      icon: DollarSign,
      color: '#2563EB'
    },
    {
      title: 'Profit',
      value: summary.totalProfit ? formatINR(summary.totalProfit) : null,
      explanation: 'How much money remained after costs.',
      icon: TrendingUp,
      color: '#10B981'
    },
    {
      title: 'Completed Orders',
      value: summary.totalSales ? summary.totalSales.toLocaleString() : null,
      explanation: 'Total number of orders processed.',
      icon: ShoppingCart,
      color: '#7C3AED'
    },
    {
      title: 'Active Customers',
      value: customerData?.available ? customerData.totalCustomers : null,
      explanation: 'Number of unique customer accounts in the uploaded file.',
      icon: Users,
      color: '#F59E0B'
    },
    {
      title: 'Revenue Growth Rate',
      value: summary.revenueGrowth || null,
      explanation: 'How your revenue changed compared with previous periods.',
      icon: Zap,
      color: '#EC4899'
    }
  ]

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Zap size={12} /> Business Analyst Evaluation
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Business Performance</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Simple comparison of your core business indicators calculated from your uploaded data.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {metricsList.map((m, idx) => {
          const Icon = m.icon
          return (
            <div key={idx} className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{m.title}</span>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: `${m.color}15`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                </div>

                {m.value ? (
                  <h3 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>
                    {m.value}
                  </h3>
                ) : (
                  <div style={{ padding: '8px 12px', borderRadius: 6, backgroundColor: 'var(--bg)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    Not enough information is available in your uploaded data to calculate this metric.
                  </div>
                )}
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
                {m.explanation}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
