import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import DashboardPage from '../pages/DashboardPage'
import DataUploadPage from '../pages/DataUploadPage'
import AIAnalysisPage from '../pages/AIAnalysisPage'
import BusinessHealthPage from '../pages/BusinessHealthPage'
import PerformancePage from '../pages/PerformancePage'
import SalesAnalysisPage from '../pages/SalesAnalysisPage'
import CustomerAnalysisPage from '../pages/CustomerAnalysisPage'
import ProductsPage from '../pages/ProductsPage'
import BenchmarkingPage from '../pages/BenchmarkingPage'
import AIRecommendationsPage from '../pages/AIRecommendationsPage'
import ReportsPage from '../pages/ReportsPage'
import AlertsPage from '../pages/AlertsPage'
import SettingsPage from '../pages/SettingsPage'

const routeTitles = {
  '/dashboard': 'AI Business Analytics Dashboard',
  '/upload': 'Data Ingestion & Quality Profiler',
  '/ai-analysis': 'AI Pattern & Risk Diagnostics',
  '/health': 'Business Health Index',
  '/performance': 'Performance & Gap Analysis',
  '/sales': 'Sales Performance & Forecasts',
  '/customers': 'Customer Portfolio & Sentiment',
  '/products': 'Products & Offerings Analysis',
  '/benchmarking': 'Internal Benchmarking & Gaps',
  '/ai-recommendations': 'AI Growth Recommendations & Action Plan',
  '/reports': 'Executive Reports & PDF Exporter',
  '/alerts': 'Real-Time Monitoring & Alerts',
  '/settings': 'System & Business Settings'
}

// Layout wrapper for authenticated dashboard routes
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
            <Route path="/upload" element={<DataUploadPage />} />
            <Route path="/ai-analysis" element={<AIAnalysisPage />} />
            <Route path="/analytics" element={<Navigate to="/ai-analysis" replace />} />
            <Route path="/health" element={<BusinessHealthPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/sales" element={<SalesAnalysisPage />} />
            <Route path="/customers" element={<CustomerAnalysisPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/benchmarking" element={<BenchmarkingPage />} />
            <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
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
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

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
