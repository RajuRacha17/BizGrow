import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import '../styles/SalesAnalysisPage.css'

const forecastData = [
  { month: 'Aug (Est)', actual: 128450, forecast: 135000 },
  { month: 'Sep (Est)', actual: null, forecast: 142000 },
  { month: 'Oct (Est)', actual: null, forecast: 154000 },
  { month: 'Nov (Est)', actual: null, forecast: 168000 },
  { month: 'Dec (Est)', actual: null, forecast: 185000 },
]

export default function SalesAnalysisPage() {
  return (
    <div className="sales-page-container">
      {/* Top Overview Cards */}
      <div className="sales-overview-grid">
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Best Performing Product</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>PBIS Enterprise Suite</h3>
          <p style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>Generates 45% of total revenue ($57,800/mo)</p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sales Velocity Rate</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>14.2 Days Deal Cycle</h3>
          <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>-3 days faster than industry benchmark</p>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Q4 Revenue Forecast</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>$507,000 Est.</h3>
          <p style={{ fontSize: 12, color: 'var(--secondary)', marginTop: 4 }}>96.4% confidence score based on AI model</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Predictive 5-Month Revenue Forecast</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>AI-generated trend prediction based on pipeline deal velocity</p>

        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-light)" fontSize={12} />
              <YAxis stroke="var(--text-light)" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="forecast" stroke="#7C3AED" fill="rgba(124, 58, 237, 0.15)" strokeWidth={3} name="AI Projected Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Ranking Grid */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Top Product Ranking & Margins</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product Name</th>
              <th>Units Sold</th>
              <th>Gross Revenue</th>
              <th>Gross Margin</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {[
              { rank: 1, name: 'PBIS Enterprise Suite', units: '340 Units', rev: '$57,800', margin: '78%', trend: '+18.4%' },
              { rank: 2, name: 'AI Insights Addon Module', units: '610 Units', rev: '$32,100', margin: '92%', trend: '+34.2%' },
              { rank: 3, name: 'Custom API Tier Solution', units: '120 Units', rev: '$23,050', margin: '65%', trend: '+6.1%' },
              { rank: 4, name: 'Small Business Starter Package', units: '450 Units', rev: '$15,500', margin: '70%', trend: '+4.0%' }
            ].map(p => (
              <tr key={p.rank}>
                <td style={{ fontWeight: 700 }}>#{p.rank}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.units}</td>
                <td style={{ fontWeight: 700 }}>{p.rev}</td>
                <td><span className="badge badge-success">{p.margin}</span></td>
                <td style={{ color: '#10B981', fontWeight: 600 }}>{p.trend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
