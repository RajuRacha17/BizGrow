import React, { useState } from 'react'
import { Search, UserCheck, Heart, UserX, Star } from 'lucide-react'
import '../styles/CustomerAnalysisPage.css'

const customerList = [
  { id: 'CUST-001', name: 'Acme Corporation', contact: 'Sarah Jenkins', segment: 'Enterprise', clv: '$48,500', sentiment: 'Positive (98%)', status: 'Active' },
  { id: 'CUST-002', name: 'Global Logistics Ltd', contact: 'Michael Chang', segment: 'Mid-Market', clv: '$24,200', sentiment: 'Positive (92%)', status: 'Active' },
  { id: 'CUST-003', name: 'Innovate Tech', contact: 'Alex Rivera', segment: 'Enterprise', clv: '$62,000', sentiment: 'Neutral (74%)', status: 'Needs Review' },
  { id: 'CUST-004', name: 'Nexus Solutions', contact: 'David Kim', segment: 'SMB', clv: '$8,400', sentiment: 'Positive (88%)', status: 'Active' },
  { id: 'CUST-005', name: 'Apex Media Group', contact: 'Elena Rostova', segment: 'Mid-Market', clv: '$18,900', sentiment: 'Negative (42%)', status: 'At Risk' },
]

export default function CustomerAnalysisPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCustomers = customerList.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="customer-page-container">
      {/* Top Metrics Row */}
      <div className="customer-kpi-grid">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Customer Retention Rate</span>
            <UserCheck size={20} color="#10B981" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>94.2%</div>
          <span className="badge badge-success" style={{ marginTop: 6 }}>+2.1% this quarter</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Customer Satisfaction (CSAT)</span>
            <Heart size={20} color="#EC4899" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>4.8 / 5.0</div>
          <span className="badge badge-success" style={{ marginTop: 6 }}>Based on 420 reviews</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>At-Risk Accounts</span>
            <UserX size={20} color="#EF4444" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>12 Accounts</div>
          <span className="badge badge-danger" style={{ marginTop: 6 }}>Requires Action</span>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Avg Customer Lifetime Value</span>
            <Star size={20} color="#F59E0B" />
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>$32,400</div>
          <span className="badge badge-info" style={{ marginTop: 6 }}>+14% YoY</span>
        </div>
      </div>

      {/* Customer Data Table */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Key Account Portfolio</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Segment analysis, CLV projections, and AI sentiment rating</p>
          </div>

          <div style={{ position: 'relative', width: 240 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              className="input-field"
              placeholder="Search client accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, height: 36, fontSize: 13 }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Company Name</th>
              <th>Primary Contact</th>
              <th>Segment</th>
              <th>Projected CLV</th>
              <th>AI Sentiment Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(cust => (
              <tr key={cust.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{cust.id}</td>
                <td style={{ fontWeight: 600 }}>{cust.name}</td>
                <td>{cust.contact}</td>
                <td><span className="badge badge-info">{cust.segment}</span></td>
                <td style={{ fontWeight: 700 }}>{cust.clv}</td>
                <td>{cust.sentiment}</td>
                <td>
                  <span className={`badge ${cust.status === 'Active' ? 'badge-success' : cust.status === 'Needs Review' ? 'badge-warning' : 'badge-danger'}`}>
                    {cust.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
