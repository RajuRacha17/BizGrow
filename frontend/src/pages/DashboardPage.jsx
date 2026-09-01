import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import KpiCard from '../components/KpiCard'
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Sparkles,
  ArrowRight,
  Zap,
  Activity,
  Upload,
  Database,
  Cpu,
  Search,
  BarChart2,
  Lightbulb,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Download
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { authFetch } from '../utils/api'
import '../styles/DashboardPage.css'

export default function DashboardPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(null)
  const [summaryData, setSummaryData] = useState(null)
  const [analysisObj, setAnalysisObj] = useState(null)
  const [salesDataState, setSalesDataState] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('http://localhost:5000/api/dashboard/summary')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (res.empty) {
            setIsEmpty(true)
          } else {
            setIsEmpty(false)
            setSummaryData(res.data)
            setAnalysisObj(res.analysis)
          }
        }
      })
      .catch((err) => console.log('Dashboard summary error:', err))

    authFetch('http://localhost:5000/api/dashboard/charts')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.salesData) {
          setSalesDataState(res.salesData)
        }
      })
      .catch((err) => console.log('Dashboard charts error:', err))
      .finally(() => setLoading(false))
  }, [])

  const workflowSteps = [
    { num: '01', label: 'Business Data', icon: Database, link: '/upload' },
    { num: '02', label: 'AI Analysis', icon: Cpu, link: '/ai-analysis' },
    { num: '03', label: 'Problem Detection', icon: Search, link: '/performance' },
    { num: '04', label: 'Performance Gap', icon: BarChart2, link: '/benchmarking' },
    { num: '05', label: 'Recommendations', icon: Lightbulb, link: '/ai-recommendations' },
    { num: '06', label: 'Business Growth', icon: TrendingUp, link: '/reports' }
  ]

  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const userName = userObj?.fullName || 'User'

  return (
    <div className="dashboard-container page-fade-in" style={{ padding: '24px 32px' }}>
      {/* 6-Step Interactive PBIS Workflow Banner */}
      <div className="card dashboard-workflow-tracker" style={{ marginBottom: 24 }}>
        <div className="dashboard-wf-header">
          <div className="dashboard-wf-title">
            <Sparkles size={16} color="#2563EB" />
            <span>PBIS End-to-End Analytics Workflow</span>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '6px 14px' }}
            onClick={() => navigate('/upload')}
          >
            <Upload size={14} /> Connect / Upload Data
          </button>
        </div>

        <div className="dashboard-wf-steps">
          {workflowSteps.map((s, idx) => {
            const Icon = s.icon
            const stepNum = idx + 1
            const isActive = activeWorkflowStep === stepNum

            return (
              <div
                key={idx}
                className={`dashboard-wf-step-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActiveWorkflowStep(stepNum)
                  navigate(s.link)
                }}
              >
                <div className="dashboard-wf-step-badge">
                  <Icon size={14} />
                </div>
                <div className="dashboard-wf-step-info">
                  <span className="dashboard-wf-num">STEP {s.num}</span>
                  <span className="dashboard-wf-label">{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top Banner & Health Score */}
      <div className="card dashboard-hero-card" style={{ marginBottom: 24 }}>
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Sparkles size={12} /> AI Intelligence Engine Active
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back, {userName}! 👋</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Here is your real-time business health summary.
          </p>
        </div>

        {/* Business Health Score Gauge */}
        <div className="dashboard-health-score-box">
          <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={48} color={summaryData?.healthScore >= 75 ? "#10B981" : summaryData?.healthScore >= 50 ? "#F59E0B" : "#60A5FA"} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Business Health Score
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: summaryData?.healthScore >= 75 ? "#10B981" : summaryData?.healthScore >= 50 ? "#F59E0B" : "#60A5FA" }}>
              {summaryData ? `${summaryData.healthScore} / 100` : '-- / 100'}
            </div>
            <div style={{ fontSize: 11, color: '#60A5FA' }}>
              {summaryData?.healthStatus || 'Upload data to calculate'}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State when no dataset uploaded */}
      {isEmpty ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', margin: '20px 0' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <FileSpreadsheet size={32} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No Business Data Analyzed Yet</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 24px', lineHeight: 1.6 }}>
            Upload your CSV or Excel sales and operations dataset to generate real-time Business Health Scores, AI recommendations, and financial forecasts.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/upload')} style={{ padding: '12px 24px', fontSize: 15 }}>
              <Upload size={18} /> Upload Business Data
            </button>
            <a href="http://localhost:5000/api/data/sample" download="sample_business_data.csv" className="btn-primary" style={{ padding: '12px 24px', fontSize: 15, background: 'var(--secondary)' }}>
              <Download size={18} /> Download Sample CSV
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards Grid */}
          <div className="dashboard-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: 24 }}>
            <KpiCard
              title="Total Revenue"
              value={summaryData ? `$${summaryData.monthlyRevenue.toLocaleString()}` : "$0"}
              change={summaryData ? summaryData.revenueGrowth : "+0%"}
              isPositive={true}
              icon={DollarSign}
              color="#2563EB"
            />
            <KpiCard
              title="Total Sales"
              value={summaryData ? summaryData.totalSales.toLocaleString() : "0"}
              change="+8.2%"
              isPositive={true}
              icon={ShoppingCart}
              color="#7C3AED"
            />
            <KpiCard
              title="Active Customers"
              value={summaryData ? summaryData.customerCount.toLocaleString() : "0"}
              change="+12.5%"
              isPositive={true}
              icon={Users}
              color="#10B981"
            />
            <KpiCard
              title="Net Profit Margin"
              value={summaryData ? summaryData.profitMargin : "0%"}
              change="+3.1%"
              isPositive={true}
              icon={TrendingUp}
              color="#F59E0B"
            />
          </div>

          {/* Clean Main Analytics Row (Sales Line Chart + AI Recommendations) */}
          <div className="dashboard-charts-row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* Monthly Sales Line & Target Chart */}
            <div className="card" style={{ padding: 24, flex: '1 1 60%', minWidth: 320 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Monthly Sales & Revenue Growth</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Real revenue trends and performance benchmarks</p>
                </div>
                <span className="badge badge-info">Live Dataset Sync</span>
              </div>

              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={salesDataState}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--text-light)" fontSize={12} />
                    <YAxis stroke="var(--text-light)" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} name="Revenue ($)" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="5 5" name="Target ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Recommendations Quick Cards */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: '1 1 35%', minWidth: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#7C3AED" />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>AI Strategic Insights</h3>
                </div>
                <Link to="/ai-recommendations" className="dashboard-view-all-link">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {(analysisObj?.recommendations || []).slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="dashboard-ai-item" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{rec.title}</span>
                      <span className="badge badge-info" style={{ fontSize: 10, background: '#2563EB15', color: '#2563EB' }}>{rec.upside}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{rec.recommendedAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
