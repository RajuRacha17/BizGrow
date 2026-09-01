import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Plus, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function AIRecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [actionItems, setActionItems] = useState([])
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
            <Sparkles size={12} /> Strategic AI Guidance
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Personalized Growth Recommendations</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Data-backed strategic recommendations and interactive Priority Action Plan.
          </p>
        </div>
      </div>

      {/* Strategic Recommendations Grid */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>AI Generated Recommendations</h3>
        {recommendations.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No recommendations generated yet. Please upload a dataset first.</p>
            <button className="btn-primary" onClick={() => navigate('/upload')} style={{ marginTop: 12, padding: '10px 20px' }}>
              <Upload size={16} /> Upload Dataset
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span className="badge badge-info" style={{ background: '#2563EB15', color: '#2563EB' }}>{rec.category}</span>
                    <span className="badge badge-info" style={{ background: '#10B98115', color: '#10B981', fontWeight: 700 }}>{rec.upside}</span>
                  </div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{rec.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>{rec.recommendedAction}</p>
                </div>
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
                  <strong>Evidence:</strong> {rec.evidence}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority Action Plan */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Priority Action Plan (Interactive)</h3>
        {actionItems.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No action plan items recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Action Item</th>
                  <th style={{ padding: '10px 14px' }}>Priority</th>
                  <th style={{ padding: '10px 14px' }}>Due Date</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {actionItems.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>{item.title}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span className="badge badge-info" style={{ background: item.priority === 'HIGH' ? '#EF444415' : '#F59E0B15', color: item.priority === 'HIGH' ? '#EF4444' : '#F59E0B' }}>
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
                          border: '1px solid var(--border)',
                          backgroundColor: item.status === 'COMPLETED' ? '#dcfce7' : item.status === 'IN_PROGRESS' ? '#dbeafe' : 'var(--bg)',
                          color: item.status === 'COMPLETED' ? '#166534' : item.status === 'IN_PROGRESS' ? '#1e40af' : 'var(--text-main)',
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
