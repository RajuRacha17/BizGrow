import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Sun, Moon, User, Settings, LogOut, ChevronDown, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react'
import '../styles/Navbar.css'

export default function Navbar({ title, darkMode, onToggleDark }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const initials = userObj?.fullName
    ? userObj.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD'

  const notifications = [
    { id: 1, type: 'alert', text: 'Sales target 87% achieved for Q3', time: '5m ago', icon: CheckCircle, color: '#10B981' },
    { id: 2, type: 'ai', text: 'AI generated 3 new recommendations', time: '1h ago', icon: Sparkles, color: '#7C3AED' },
    { id: 3, type: 'warning', text: 'Low inventory alert for Product SKU-402', time: '3h ago', icon: AlertTriangle, color: '#F59E0B' },
  ]

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
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="navbar-icon-btn"
          >
            <Bell size={18} />
            <span className="navbar-notification-dot" />
          </button>

          {showNotifications && (
            <div className="card navbar-dropdown navbar-notification-dropdown">
              <div className="navbar-dropdown-header">
                <h4 style={{ fontSize: 14, fontWeight: 700 }}>Notifications</h4>
                <span className="badge badge-info">3 New</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {notifications.map(n => {
                  const Icon = n.icon
                  return (
                    <div key={n.id} className="navbar-notification-item">
                      <Icon size={16} color={n.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {n.text}
                        </p>
                        <span style={{ fontSize: 10, color: 'var(--text-light)' }}>{n.time}</span>
                      </div>
                    </div>
                  )
                })}
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
                onClick={() => { setShowProfileMenu(false); navigate('/login') }}
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
