import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, CheckCircle2, Clock, AlertCircle, ArrowUpRight, ChevronDown, ChevronUp, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [actionItems, setActionItems] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('All')
  const [expandedIndex, setExpandedIndex] = useState(0) // Default first card expanded
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchRecommendations = () => {
    authFetch('http://localhost:5000/api/recommendations')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecommendations(data.recommendations || [])
          setActionItems(data.actionItems || [])
        }
      })
      .catch(err => console.log('Fetch recommendations error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await authFetch(`http://localhost:5000/api/recommendations/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchRecommendations()
    } catch (err) {
      console.log('Update action status error:', err)
    }
  }

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)', marginBottom: 8 }}>
            <Sparkles size={12} /> Strategic Business Guidance
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Personalized Growth Recommendations</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Actionable recommendations and interactive Priority Action Plan based on your uploaded business data.
          </p>
        </div>
      </div>

      {/* Industry Sector Filter & BizQuery Quick Tool Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
        padding: '14px 18px',
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Business Industry Solution:</span>
          <select
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-main)',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            <option value="All">All Business Solutions</option>
            <option value="Retail">Retail & E-commerce</option>
            <option value="Restaurant">Restaurant & Food Services</option>
            <option value="Services">Professional Services & Consulting</option>
            <option value="Manufacturing">Manufacturing & Wholesale</option>
            <option value="Healthcare">Healthcare & Wellness</option>
            <option value="SaaS">SaaS & Technology</option>
          </select>
        </div>
      </div>

      {/* Strategic Recommendations Cards */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommendations & Insights</h3>
        {recommendations.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No recommendations generated yet. Please upload a business dataset first.</p>
            <button className="btn-primary" onClick={() => navigate('/upload')} style={{ marginTop: 12, padding: '10px 20px' }}>
              <Upload size={16} /> Upload Business Data
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recommendations.map((rec, idx) => {
              const isExpanded = expandedIndex === idx

              return (
                <div key={idx} className="card" style={{ padding: 24, border: isExpanded ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedIndex(isExpanded ? null : idx)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="badge badge-info" style={{ background: rec.priority === 'HIGH' ? '#EF444415' : '#F59E0B15', color: rec.priority === 'HIGH' ? '#EF4444' : '#F59E0B', fontWeight: 700 }}>
                        {rec.priority === 'HIGH' ? '🔴 HIGH PRIORITY' : rec.priority === 'MEDIUM' ? '🟠 MEDIUM PRIORITY' : '🟢 LOW PRIORITY'}
                      </span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{rec.title}</h4>
                    </div>

                    <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {isExpanded ? <>Hide Details <ChevronUp size={14} /></> : <>View Details <ChevronDown size={14} /></>}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                      {/* WHAT WE FOUND */}
                      <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>WHAT WE FOUND</span>
                        <p style={{ fontSize: 13, color: 'var(--text-main)', margin: '4px 0 0', lineHeight: 1.4 }}>{rec.problem}</p>
                      </div>

                      {/* WHY IT MATTERS */}
                      <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>WHY IT MATTERS</span>
                        <p style={{ fontSize: 13, color: 'var(--text-main)', margin: '4px 0 0', lineHeight: 1.4 }}>{rec.evidence}</p>
                      </div>

                      {/* POSSIBLE REASON */}
                      <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>POSSIBLE REASON</span>
                        <p style={{ fontSize: 13, color: 'var(--text-main)', margin: '4px 0 0', lineHeight: 1.4 }}>
                          The uploaded data suggests operational overheads or demand shifts may be contributing to this trend.
                        </p>
                      </div>

                      {/* WHAT YOU CAN DO */}
                      <div style={{ padding: 12, borderRadius: 8, backgroundColor: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>WHAT YOU CAN DO</span>
                        <p style={{ fontSize: 13, color: 'var(--text-main)', fontWeight: 600, margin: '4px 0 0', lineHeight: 1.4 }}>{rec.recommendedAction}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Priority Action Plan */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--text-main)' }}>Priority Action Plan (Interactive)</h3>
        {actionItems.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No action plan items recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>#</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Action Item</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Priority</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Timeline</th>
                  <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {actionItems.map((item, idx) => {
                  const isCompleted = item.status === 'COMPLETED';
                  const isInProgress = item.status === 'IN_PROGRESS';

                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: item.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                            color: item.priority === 'HIGH' ? '#EF4444' : '#F59E0B',
                            border: `1px solid ${item.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                          }}
                        >
                          {item.priority}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{item.dueDate}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <select
                          value={item.status}
                          onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 6,
                            border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.4)' : isInProgress ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)'}`,
                            backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.15)' : isInProgress ? 'rgba(59, 130, 246, 0.15)' : 'var(--card-bg)',
                            color: isCompleted ? '#10B981' : isInProgress ? '#3B82F6' : 'var(--text-main)',
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="PENDING" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>Pending</option>
                          <option value="IN_PROGRESS" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>In Progress</option>
                          <option value="COMPLETED" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}>Completed</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
