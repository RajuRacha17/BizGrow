import React, { useState, useEffect } from 'react'
import {
  Building,
  Lock,
  Bell,
  Key,
  CreditCard,
  Save,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Sparkles,
  ShieldAlert,
  Check,
  RefreshCw
} from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/SettingsPage.css'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business')
  const [saved, setSaved] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)

  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [securityMsg, setSecurityMsg] = useState(null)
  const [securityLoading, setSecurityLoading] = useState(false)

  const [notifPrefs, setNotifPrefs] = useState({
    emailAnomalyAlerts: true,
    emailWeeklyDigest: true,
    inAppPopups: true,
    highRiskSMSAlerts: false
  })

  const fetchAlerts = async () => {
    setLoadingAlerts(true)
    try {
      const res = await authFetch('http://localhost:5000/api/alerts')
      const data = await res.json()
      if (data.success && data.alerts) {
        setAlerts(data.alerts)
      }
    } catch (err) {
      console.log('Fetch settings alerts error:', err)
    } finally {
      setLoadingAlerts(false)
    }
  }

  useEffect(() => {
    authFetch('http://localhost:5000/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setBusinessInfo({
            name: data.profile.businessName || '',
            owner: data.profile.fullName || '',
            email: data.profile.email || '',
            phone: data.profile.phone || '',
            address: data.profile.address || '',
            city: data.profile.city || '',
            state: data.profile.state || '',
            zipCode: data.profile.zipCode || ''
          })
        }
      })
      .catch((err) => console.log('Settings fetch fallback:', err))

    fetchAlerts()
  }, [])

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setProfileMsg(null)

    // Validate required fields
    if (
      !businessInfo.name?.trim() ||
      !businessInfo.owner?.trim() ||
      !businessInfo.email?.trim() ||
      !businessInfo.phone?.trim() ||
      !businessInfo.address?.trim() ||
      !businessInfo.city?.trim() ||
      !businessInfo.state?.trim() ||
      !businessInfo.zipCode?.trim()
    ) {
      setProfileMsg({ type: 'error', text: 'All fields are required. Please complete all business profile details.' })
      return
    }

    // Validate Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(businessInfo.email.trim())) {
      setProfileMsg({ type: 'error', text: 'Please enter a valid email address (e.g. example@email.com).' })
      return
    }

    // Validate Phone Number format (at least 7 to 15 digits)
    const phoneDigits = businessInfo.phone.replace(/\D/g, '')
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setProfileMsg({ type: 'error', text: 'Please enter a valid phone number (e.g. +91 98765 43210).' })
      return
    }

    setSavingProfile(true)

    try {
      const res = await authFetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: businessInfo.owner.trim(),
          email: businessInfo.email.trim(),
          businessName: businessInfo.name.trim(),
          phone: businessInfo.phone.trim(),
          address: businessInfo.address.trim(),
          city: businessInfo.city.trim(),
          state: businessInfo.state.trim(),
          zipCode: businessInfo.zipCode.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setProfileMsg({ type: 'success', text: 'Business profile details saved successfully to database!' })
        setTimeout(() => {
          setSaved(false)
          setProfileMsg(null)
        }, 3500)
      } else {
        setProfileMsg({ type: 'error', text: data.message || 'Failed to save profile settings.' })
      }
    } catch (err) {
      console.log('Update settings error:', err)
      setProfileMsg({ type: 'error', text: 'Failed to connect to backend server. Please verify backend server is active.' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSecuritySave = async (e) => {
    e.preventDefault()
    setSecurityMsg(null)

    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'All password fields are required.' })
      return
    }

    if (securityData.newPassword.length < 6) {
      setSecurityMsg({ type: 'error', text: 'New password must be at least 6 characters long.' })
      return
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setSecurityLoading(true)
    try {
      const res = await authFetch('http://localhost:5000/api/auth/update-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        })
      })

      const data = await res.json()

      if (data.success) {
        setSecurityMsg({ type: 'success', text: data.message || 'Password updated successfully!' })
        setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setSecurityMsg({ type: 'error', text: data.message || 'Current password is incorrect. Password was not changed.' })
      }
    } catch (err) {
      console.error('Password update error:', err)
      setSecurityMsg({ type: 'error', text: 'Failed to connect to server. Please try again.' })
    } finally {
      setSecurityLoading(false)
    }
  }

  return (
    <div className="settings-container">
      {/* Tabs Bar */}
      <div className="card settings-tab-bar">
        {[
          { id: 'business', label: 'Business Profile', icon: Building },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
          { id: 'api', label: 'API Keys & Webhooks', icon: Key },
          { id: 'billing', label: 'Subscription & Billing', icon: CreditCard }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`settings-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Settings Panel */}
      <div className="card" style={{ padding: 28 }}>
        {/* TAB 1: Business Profile */}
        {activeTab === 'business' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>Business Profile Information</h3>

            <div className="settings-form-grid">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Company Name <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. Example Company"
                  value={businessInfo.name}
                  onChange={e => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Owner / Account Manager <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. John Doe"
                  value={businessInfo.owner}
                  onChange={e => setBusinessInfo({ ...businessInfo, owner: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Contact Email <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="e.g. example@email.com"
                  value={businessInfo.email}
                  onChange={e => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Phone Number <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="e.g. +91 98765 43210"
                  value={businessInfo.phone}
                  onChange={e => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                  required
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Address <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. 123 Business Way, Suite 100"
                  value={businessInfo.address}
                  onChange={e => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>City <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. Mumbai"
                  value={businessInfo.city}
                  onChange={e => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>State / Province <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. Maharashtra"
                  value={businessInfo.state}
                  onChange={e => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>Postal / Zip Code <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. 400001"
                  value={businessInfo.zipCode}
                  onChange={e => setBusinessInfo({ ...businessInfo, zipCode: e.target.value })}
                  required
                />
              </div>
            </div>

            {profileMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: profileMsg.type === 'error' ? '#FEE2E2' : '#DCFCE7',
                color: profileMsg.type === 'error' ? '#DC2626' : '#166534',
                fontSize: 13,
                fontWeight: 600
              }}>
                {profileMsg.text}
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <button
                className="btn-primary"
                type="submit"
                onClick={handleSave}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <><Save size={16} /> Saving to Database...</>
                ) : saved ? (
                  <><CheckCircle size={16} /> Changes Saved!</>
                ) : (
                  <><Save size={16} /> Save Profile Settings</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Password & Security */}
        {activeTab === 'security' && (
          <form onSubmit={handleSecuritySave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Password & Account Security</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Update your password and secure your BizGrow account credentials.</p>

            {securityMsg && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 8,
                backgroundColor: securityMsg.type === 'error' ? '#FEE2E2' : '#DCFCE7',
                color: securityMsg.type === 'error' ? '#DC2626' : '#166534',
                fontSize: 13,
                fontWeight: 600
              }}>
                {securityMsg.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Current Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={securityData.currentPassword}
                  onChange={e => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Minimum 6 characters"
                  value={securityData.newPassword}
                  onChange={e => setSecurityData({ ...securityData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Confirm New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Re-enter new password"
                  value={securityData.confirmPassword}
                  onChange={e => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={securityLoading} style={{ width: 'fit-content', marginTop: 8 }}>
              <Lock size={16} /> {securityLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* TAB 3: Notifications & System Alerts */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>System & Business Notifications</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  View live system alerts, dataset upload notifications, and manage alert delivery preferences.
                </p>
              </div>

              <button
                className="btn-secondary"
                onClick={fetchAlerts}
                disabled={loadingAlerts}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 12px' }}
              >
                <RefreshCw size={14} className={loadingAlerts ? 'spinning-icon' : ''} /> Refresh Alerts
              </button>
            </div>

            {/* Live System & Business Notifications List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: 16
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                Active System Alerts & Ingestion Logs ({alerts.length})
              </h4>

              {alerts.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center' }}>
                  No active system notifications or alerts currently. Upload a dataset to generate live monitoring logs.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {alerts.map((alt, idx) => {
                    const isHigh = alt.severity === 'HIGH'
                    return (
                      <div
                        key={alt._id || idx}
                        style={{
                          padding: 14,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--card-bg)',
                          border: isHigh ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12
                        }}
                      >
                        {alt.metric === 'Data Ingestion' ? (
                          <FileSpreadsheet size={18} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                        ) : isHigh ? (
                          <ShieldAlert size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                        ) : (
                          <Sparkles size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
                        )}

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                              {alt.title}
                            </span>
                            <span className="badge badge-info" style={{
                              fontSize: 10,
                              fontWeight: 800,
                              background: isHigh ? '#EF444415' : '#2563EB15',
                              color: isHigh ? '#EF4444' : '#2563EB'
                            }}>
                              {alt.severity || 'MEDIUM'} SEVERITY
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                            {alt.reason}
                          </p>
                          <span style={{ fontSize: 10, color: 'var(--text-light)', marginTop: 6, display: 'inline-block' }}>
                            📅 Date: {alt.date || 'Today'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Notification Delivery Preferences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>Notification Delivery Controls</h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={notifPrefs.emailAnomalyAlerts}
                    onChange={e => setNotifPrefs({ ...notifPrefs, emailAnomalyAlerts: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>Email Anomaly Alerts</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Send email when unusual spikes or drops are flagged</div>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 14,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={notifPrefs.inAppPopups}
                    onChange={e => setNotifPrefs({ ...notifPrefs, inAppPopups: e.target.checked })}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>In-App Sound & Dropdown Alerts</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Show live notification badge in top header menu</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: API Keys */}
        {activeTab === 'api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>API Keys & Integration Access</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage secret keys used to feed live data from your CRM or database into PBIS.</p>

            <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Production Live Key</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 2 }}>pbis_live_948a73bc928104f...</div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>Copy Key</button>
            </div>

            <button className="btn-primary" style={{ width: 'fit-content' }}>+ Generate New API Secret Key</button>
          </div>
        )}

        {/* TAB 5: Subscription & Billing */}
        {activeTab === 'billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Current Subscription Plan</h3>
            <div style={{ padding: 20, border: '2px solid #2563EB', borderRadius: 16, background: '#F8FAFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: 6 }}>Active Plan</span>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Pro Business Tier</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Renews automatically on Sept 1, 2026 (₹4,999/mo)</div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 13 }}>Change Plan</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

