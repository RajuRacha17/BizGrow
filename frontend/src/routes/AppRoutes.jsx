import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import AnalyticsPage from '../pages/AnalyticsPage'
import CustomerAnalysisPage from '../pages/CustomerAnalysisPage'
import SalesAnalysisPage from '../pages/SalesAnalysisPage'
import ReportsPage from '../pages/ReportsPage'
import AIRecommendationsPage from '../pages/AIRecommendationsPage'
import SettingsPage from '../pages/SettingsPage'

const routeTitles = {
  '/dashboard': 'AI Business Analytics Dashboard',
  '/analytics': 'Deep Dive Analytics',
  '/sales': 'Sales Performance & Forecasts',
  '/customers': 'Customer Portfolio & Sentiment',
  '/ai-recommendations': 'AI Growth Recommendations',
  '/reports': 'Executive Reports & PDF Exporter',
  '/settings': 'System & Business Settings'
}

// Layout wrapper for authenticated dashboard routes
//routes that navigates the differnt pages
function DashboardLayout({ darkMode, onToggleDark }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'PBIS Analytics'

  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  if (!savedUser) {
    return <Navigate to="/login" replace />
  }

  return (
    <div
      className={darkMode ? 'dark-theme' : ''}
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg)'
      }}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar
          title={title}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/sales" element={<SalesAnalysisPage />} />
            <Route path="/customers" element={<CustomerAnalysisPage />} />
            <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <Routes>
      {/* Public Standalone URL Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Dashboard Layout Routes */}
      <Route
        path="/*"
        element={
          <DashboardLayout
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(!darkMode)}
          />
        }
      />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
