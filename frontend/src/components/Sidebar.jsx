import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Users,
  Sparkles,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import '../styles/Sidebar.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/sales', label: 'Sales Analysis', icon: ShoppingCart },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/ai-recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'AI' },
  { path: '/reports', label: 'Reports', icon: FileText },
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
      <Link
        to="/"
        className={`sidebar-header ${collapsed ? 'sidebar-header-center' : 'sidebar-header-start'}`}
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
      </Link>

      {/* Collapse Toggle Button */}
      <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
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
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
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
