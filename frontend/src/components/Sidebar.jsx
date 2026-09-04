import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Cpu,
  Activity,
  Zap,
  Sparkles,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
import '../styles/Sidebar.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Data Upload', icon: Upload },
  { path: '/ai-analysis', label: 'AI Analysis', icon: Cpu, badge: 'AI' },
  { path: '/health', label: 'Business Health', icon: Activity },
  { path: '/performance', label: 'Performance', icon: Zap },
  { path: '/ai-recommendations', label: 'Recommendations', icon: Sparkles },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const name = userObj?.fullName || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US'

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div className="sidebar-mobile-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`sidebar-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Brand Header */}
        <div
          className={`sidebar-header ${collapsed ? 'sidebar-header-center' : 'sidebar-header-start'}`}
          style={{ cursor: 'default', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img 
              src="/bizgrow-logo.png" 
              alt="BizGrow Logo" 
              className="sidebar-brand-img"
              style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 8 }}
            />
            {(!collapsed || mobileOpen) && (
              <div>
                <h2 className="sidebar-title">
                  BizGrow
                </h2>
                <p className="sidebar-subtitle">
                  AI Business Intelligence
                </p>
              </div>
            )}
          </div>

          {/* Close button for mobile drawer */}
          {mobileOpen && (
            <button className="sidebar-mobile-close-btn" onClick={onCloseMobile}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation Links */}
        <nav className="sidebar-nav" style={{ overflowY: 'auto', flex: 1, paddingBottom: 16 }}>
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-section-title">
              Main Menu
            </div>
          )}
          {navItems.map(item => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {(!collapsed || mobileOpen) && <span style={{ fontSize: 13 }}>{item.label}</span>}
                {(!collapsed || mobileOpen) && item.badge && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* User Footer */}
        <div className="sidebar-footer">
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-user-card">
              <div className="sidebar-avatar gradient-bg">{initials}</div>
              <div style={{ overflow: 'hidden' }}>
                <div className="sidebar-user-name" title={name}>
                  {name}
                </div>
                <div className="sidebar-user-role">
                  Active Account
                </div>
              </div>
            </div>
          )}

          <Link to="/login" onClick={() => { localStorage.removeItem('user'); handleLinkClick(); }} className="sidebar-logout-btn">
            <LogOut size={18} />
            {(!collapsed || mobileOpen) && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  )
}
