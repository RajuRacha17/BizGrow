import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Search, ArrowUpDown, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function ProductsPage() {
  const [analysis, setAnalysis] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analysis) {
          setAnalysis(data.analysis)
        }
      })
      .catch(err => console.log('Products fetch error:', err))
  }, [])

  if (!analysis || !analysis.summary) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Package size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Product Analysis Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Upload your business dataset to calculate product contribution and SKU performance.</p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Business Data
          </button>
        </div>
      </div>
    )
  }

  const products = analysis.productPerformanceData || []
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Package size={12} /> Product Portfolio
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Products & Offerings Analysis</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Revenue, profit contribution, and volume breakdown across product lines.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Product Performance Breakdown</h3>
          <div className="login-input-wrapper" style={{ minWidth: 260 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12 }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px' }}>Product Name</th>
                <th style={{ padding: '10px 14px' }}>Total Revenue</th>
                <th style={{ padding: '10px 14px' }}>Total Profit</th>
                <th style={{ padding: '10px 14px' }}>Revenue Share</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>${p.revenue.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px', color: '#10B981' }}>${p.profit.toLocaleString()}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="badge badge-info">{p.value}%</span>
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
