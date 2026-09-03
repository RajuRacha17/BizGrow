import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, User, Settings, LogOut, ChevronDown, CheckCircle, AlertTriangle, Sparkles, Database } from 'lucide-react'
import { authFetch } from '../utils/api'
import '../styles/Navbar.css'

export default function Navbar({ title, darkMode, onToggleDark }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([])
  const navigate = useNavigate()

  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const initials = userObj?.fullName
    ? userObj.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'US'

  const fetchNotifications = () => {
    authFetch('http://localhost:5000/api/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.alerts) {
          setNotifications(data.alerts)
        }
      })
      .catch(err => console.log('Fetch notifications error:', err))
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => n.status === 'UNREAD').length

  return (
    <header className="navbar-header">
      {/* Title */}
      <div>
        <h1 className="navbar-title">{title}</h1>
      </div>

      {/* Right Controls */}
      <div className="navbar-actions">
        {/* Search */}
        <div className="navbar-search-wrapper">
          <Search size={16} className="navbar-search-icon" />
          <input
            className="input-field navbar-search-input"
            type="text"
            placeholder="Search metrics, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          className="navbar-icon-btn"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              fetchNotifications();
            }}
            className="navbar-icon-btn"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="navbar-notification-dot" />}
          </button>

          {showNotifications && (
            <div className="card navbar-dropdown navbar-notification-dropdown" style={{ width: 320, right: 0 }}>
              <div className="navbar-dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700 }}>Notification Menu</h4>
                <span className="badge badge-info">{unreadCount} New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                    No active notifications.
                  </p>
                ) : (
                  notifications.map(n => (
                    <div key={n._id} className="navbar-notification-item" style={{ display: 'flex', gap: 10, padding: 8, borderRadius: 6, backgroundColor: n.status === 'UNREAD' ? 'rgba(37,99,235,0.05)' : 'transparent' }}>
                      {n.metric === 'Data Ingestion' ? (
                        <Database size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                      ) : n.severity === 'HIGH' ? (
                        <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                      ) : (
                        <Sparkles size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
                      )}
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.3, margin: 0 }}>
                          {n.title}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          {n.reason}
                        </p>
                        <span style={{ fontSize: 10, color: 'var(--text-light)' }}>{n.date || 'Just now'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <Link to="/alerts" onClick={() => setShowNotifications(false)} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  View All System Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="navbar-profile-btn"
            title={userObj?.fullName || 'User Profile'}
          >
            <div className="navbar-profile-avatar gradient-bg">{initials}</div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showProfileMenu && (
            <div className="card navbar-dropdown navbar-profile-dropdown">
              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="navbar-menu-item"
              >
                <User size={15} /> Business Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="navbar-menu-item"
              >
                <Settings size={15} /> Account Settings
              </Link>
              <div className="navbar-divider" />
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  setShowProfileMenu(false)
                  navigate('/login')
                }}
                className="navbar-menu-item logout"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
