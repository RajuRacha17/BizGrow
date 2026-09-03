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
  TrendingUp,
  ChevronLeft,
  ChevronRight
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

export default function Sidebar({ collapsed, onToggle }) {
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const name = userObj?.fullName || 'User'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'US'

  return (
    <aside className={`sidebar-container ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      {/* Brand Header */}
      <div
        className={`sidebar-header ${collapsed ? 'sidebar-header-center' : 'sidebar-header-start'}`}
        style={{ cursor: 'default' }}
      >
        <div className="sidebar-brand-icon gradient-bg">
          <TrendingUp size={20} />
        </div>
        {!collapsed && (
          <div>
            <h2 className="sidebar-title">
              PBIS
            </h2>
            <p className="sidebar-subtitle">
              AI Business Intelligence
            </p>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Links */}
      <nav className="sidebar-nav" style={{ overflowY: 'auto', flex: 1, paddingBottom: 16 }}>
        {!collapsed && (
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
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ fontSize: 13 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
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

        <Link to="/login" onClick={() => localStorage.removeItem('user')} className="sidebar-logout-btn">
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  )
}
