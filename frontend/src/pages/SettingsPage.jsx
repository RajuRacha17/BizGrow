import React, { useState } from 'react'
import { Building, Lock, Bell, Key, CreditCard, Save, CheckCircle } from 'lucide-react'
import '../styles/SettingsPage.css'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business')
  const [saved, setSaved] = useState(false)
  const [businessInfo, setBusinessInfo] = useState({
    name: 'TechVentures Inc.',
    owner: 'James Davidson',
    email: 'james@techventures.io',
    phone: '+1 (555) 234-5678',
    industry: 'SaaS & Technology',
    currency: 'USD ($)'
  })

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="settings-container">
      {/* Tabs Bar */}
      <div className="card settings-tab-bar">
        {[
          { id: 'business', label: 'Business Profile', icon: Building },
          { id: 'security', label: 'Password & Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
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
        {activeTab === 'business' && (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Business Profile Information</h3>

            <div className="settings-form-grid">
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Company Name</label>
                <input
                  className="input-field"
                  value={businessInfo.name}
                  onChange={e => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Owner / Account Manager</label>
                <input
                  className="input-field"
                  value={businessInfo.owner}
                  onChange={e => setBusinessInfo({ ...businessInfo, owner: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contact Email</label>
                <input
                  className="input-field"
                  value={businessInfo.email}
                  onChange={e => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Phone Number</label>
                <input
                  className="input-field"
                  value={businessInfo.phone}
                  onChange={e => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Industry Sector</label>
                <select className="input-field" value={businessInfo.industry} onChange={e => setBusinessInfo({ ...businessInfo, industry: e.target.value })}>
                  <option>SaaS & Technology</option>
                  <option>Retail & E-commerce</option>
                  <option>Financial Services</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Default Reporting Currency</label>
                <select className="input-field" value={businessInfo.currency} onChange={e => setBusinessInfo({ ...businessInfo, currency: e.target.value })}>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <button className="btn-primary" type="submit">
                {saved ? <><CheckCircle size={16} /> Changes Saved!</> : <><Save size={16} /> Save Profile Settings</>}
              </button>
            </div>
          </form>
        )}

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

        {activeTab === 'billing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 640 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Current Subscription Plan</h3>
            <div style={{ padding: 20, border: '2px solid #2563EB', borderRadius: 16, background: '#F8FAFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: 6 }}>Active Plan</span>
                <div style={{ fontSize: 20, fontWeight: 800 }}>Pro Business Tier</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Renews automatically on Sept 1, 2026 ($79/mo)</div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 13 }}>Change Plan</button>
            </div>
          </div>
        )}

        {activeTab !== 'business' && activeTab !== 'api' && activeTab !== 'billing' && (
          <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
            Settings section ready. Choose an active tab or update profile settings.
          </div>
        )}
      </div>
    </div>
  )
}
