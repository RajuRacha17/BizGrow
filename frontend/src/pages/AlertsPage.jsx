import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, AlertTriangle, ShieldAlert, CheckCircle2, XCircle, Upload } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchAlerts = () => {
    authFetch('http://localhost:5000/api/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAlerts(data.alerts || [])
        }
      })
      .catch(err => console.log('Fetch alerts error:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAlerts()
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      await authFetch(`http://localhost:5000/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchAlerts()
    } catch (err) {
      console.log('Update alert status error:', err)
    }
  }

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', border: '1px solid rgba(252,165,165,0.3)', marginBottom: 8 }}>
            <Bell size={12} /> Real-Time Monitoring
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Alerts & Business Notifications</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Notifications triggered when revenue trends, profit margins, or dataset uploads require your attention.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Active System Alerts</h3>
        {alerts.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <CheckCircle2 size={36} color="#10B981" style={{ marginBottom: 12 }} />
            <h4 style={{ fontSize: 16, fontWeight: 600 }}>All Systems Nominal</h4>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>No active high-severity alerts detected in active dataset.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {alerts.map((alt) => (
              <div
                key={alt._id}
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  backgroundColor: alt.status === 'DISMISSED' ? 'rgba(0,0,0,0.02)' : 'var(--card-bg)',
                  opacity: alt.status === 'DISMISSED' ? 0.5 : 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 240 }}>
                  <AlertTriangle size={22} color={alt.severity === 'HIGH' ? '#EF4444' : '#F59E0B'} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>{alt.title}</span>
                      <span className="badge badge-info" style={{ background: alt.severity === 'HIGH' ? '#EF444415' : '#F59E0B15', color: alt.severity === 'HIGH' ? '#EF4444' : '#F59E0B', fontSize: 10 }}>
                        {alt.severity}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{alt.reason}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  {alt.status === 'UNREAD' && (
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdateStatus(alt._id, 'READ')}
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    >
                      Mark as Read
                    </button>
                  )}
                  {alt.status !== 'DISMISSED' && (
                    <button
                      className="btn-primary"
                      onClick={() => handleUpdateStatus(alt._id, 'DISMISSED')}
                      style={{ fontSize: 12, padding: '6px 12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
                    >
                      Dismiss Alert
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
