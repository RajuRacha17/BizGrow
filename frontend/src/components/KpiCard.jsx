import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import '../styles/KpiCard.css'

export default function KpiCard({ title, value, change, isPositive, icon: Icon, color, subtitle }) {
  return (
    <div className="card card-hover kpi-card">
      <div className="kpi-card-header">
        <div>
          <span className="kpi-card-title">{title}</span>
          <h3 className="kpi-card-value">{value}</h3>
        </div>
        <div
          className="kpi-card-icon-box"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon size={22} />
        </div>
      </div>

      <div className="kpi-card-footer">
        <span className={`badge ${isPositive ? 'badge-success' : 'badge-danger'} kpi-badge-wrapper`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
        <span className="kpi-card-subtitle">
          {subtitle || 'vs last month'}
        </span>
      </div>
    </div>
  )
}
