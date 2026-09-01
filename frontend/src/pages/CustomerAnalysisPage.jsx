import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, UserCheck, ShieldAlert, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function CustomerAnalysisPage() {
  const [customerData, setCustomerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/customers/overview')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.customerData) {
          setCustomerData(data.customerData)
        }
      })
      .catch(err => console.log('Fetch customers error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (!customerData || !customerData.available) {
    return (
      <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <Users size={36} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Customer Analysis Unavailable</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {customerData?.message || 'Customer identifier column (e.g. Customer ID or Client Name) was not detected in the uploaded dataset.'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px' }}>
            <Upload size={16} /> Upload Dataset with Customer Identifiers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)', marginBottom: 8 }}>
            <Users size={12} /> RFM Customer Segmentation
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Customer Portfolio Analysis</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Customer spend behavior, RFM cohort segmentation, and retention risk tracking.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Customers</span>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0', color: '#2563EB' }}>{customerData.totalCustomers}</h3>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Repeat Customer Rate</span>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0', color: '#10B981' }}>{customerData.retentionRate}</h3>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Avg Customer Value</span>
          <h3 style={{ fontSize: 24, fontWeight: 700, margin: '4px 0', color: '#7C3AED' }}>${customerData.avgCustomerValue?.toLocaleString()}</h3>
        </div>
      </div>

      {/* Churn Risk Cohorts Table */}
      {customerData.churnRisks && customerData.churnRisks.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>At-Risk Accounts Tracking</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Customer Name</th>
                  <th style={{ padding: '10px 14px' }}>Risk Level</th>
                  <th style={{ padding: '10px 14px' }}>Total Spend</th>
                  <th style={{ padding: '10px 14px' }}>Detection Reason</th>
                </tr>
              </thead>
              <tbody>
                {customerData.churnRisks.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="badge badge-info" style={{ background: c.riskLevel === 'HIGH' ? '#EF444415' : '#F59E0B15', color: c.riskLevel === 'HIGH' ? '#EF4444' : '#F59E0B' }}>
                        {c.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{c.spend}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{c.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
