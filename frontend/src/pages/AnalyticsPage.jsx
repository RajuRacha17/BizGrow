import React, { useState } from 'react'
import { Calendar, Download, Filter, RefreshCw } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import '../styles/AnalyticsPage.css'

const analyticsData = [
  { region: 'North America', sales: 48000, profit: 18000, growth: 14 },
  { region: 'Europe', sales: 36000, profit: 12500, growth: 9 },
  { region: 'Asia Pacific', sales: 29000, profit: 11000, growth: 22 },
  { region: 'Latin America', sales: 15400, profit: 5200, growth: 18 },
  { region: 'Middle East', sales: 12000, profit: 4100, growth: 6 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days')
  const [filterCategory, setFilterCategory] = useState('All Departments')

  return (
    <div className="analytics-container">
      {/* Top Filter Bar */}
      <div className="card analytics-filter-bar">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Calendar size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <select
              className="input-field"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              style={{ paddingLeft: 36, height: 38 }}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter (Q2)</option>
              <option>Year to Date (2026)</option>
            </select>
          </div>

          <div style={{ position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <select
              className="input-field"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{ paddingLeft: 36, height: 38 }}
            >
              <option>All Departments</option>
              <option>Enterprise Sales</option>
              <option>SaaS Self-Serve</option>
              <option>Partner Network</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
          <button className="btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}>
            <Download size={14} /> Export CSV/PDF
          </button>
        </div>
      </div>

      {/* Main Analytics Chart */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Regional Profitability Breakdown</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Revenue vs Net Profit margin by geographic market</p>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="region" stroke="var(--text-light)" fontSize={12} />
              <YAxis stroke="var(--text-light)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="sales" fill="#2563EB" radius={[6, 6, 0, 0]} name="Gross Sales ($)" />
              <Bar dataKey="profit" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Net Profit ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="analytics-grid-3">
        {[
          { title: 'Conversion Rate', val: '4.85%', diff: '+0.6%', note: 'vs last month average' },
          { title: 'Avg Order Value (AOV)', val: '$342.10', diff: '+$24.50', note: 'driven by enterprise bundles' },
          { title: 'Customer Lifetime Value', val: '$4,280', diff: '+11.2%', note: '3-year retention projection' }
        ].map((item, idx) => (
          <div key={idx} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.title}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{item.val}</div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6 }}>
              <span className="badge badge-success">{item.diff}</span>
              <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{item.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
