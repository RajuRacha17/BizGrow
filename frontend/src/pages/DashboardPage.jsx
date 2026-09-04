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
import { formatINR } from '../utils/formatters'
import '../styles/DashboardPage.css'

export default function DashboardPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1)
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
    { num: '04', label: 'Performance Gap', icon: BarChart2, link: '/performance' },
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
            Here is a simple summary of how your business is performing.
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
            Upload your CSV or Excel sales dataset to view your Business Summary, Health Score, and simple recommended actions.
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
          {/* Your Business Summary Header */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Business Summary</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Here is a simple summary of how your business is performing.</p>
          </div>

          {/* KPI Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
            {/* TOTAL REVENUE */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL REVENUE</span>
                <DollarSign size={18} color="#2563EB" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {summaryData ? formatINR(summaryData.monthlyRevenue) : '₹0'}
              </h3>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginBottom: 4 }}>
                ↑ {summaryData?.revenueGrowth || '12.4%'} from last month
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Money earned from your sales.</span>
            </div>

            {/* TOTAL ORDERS */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL ORDERS</span>
                <ShoppingCart size={18} color="#7C3AED" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {summaryData ? summaryData.totalSales.toLocaleString('en-IN') : '0'}
              </h3>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginBottom: 4 }}>
                ↑ 8.2% from last month
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total number of orders received.</span>
            </div>

            {/* ACTIVE CUSTOMERS */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACTIVE CUSTOMERS</span>
                <Users size={18} color="#10B981" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {summaryData ? summaryData.customerCount.toLocaleString('en-IN') : '0'}
              </h3>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginBottom: 4 }}>
                ↑ 12.5% from last month
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Customers who purchased during this period.</span>
            </div>

            {/* PROFIT MARGIN */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>PROFIT MARGIN</span>
                <TrendingUp size={18} color="#F59E0B" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                {summaryData ? summaryData.profitMargin : '0%'}
              </h3>
              <div style={{ fontSize: 12, color: '#10B981', fontWeight: 600, marginBottom: 4 }}>
                ↑ 3.1% from last month
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Percentage of sales left after business costs.</span>
            </div>
          </div>

          {/* Your Business in Simple Words */}
          <div className="card" style={{ padding: 24, marginBottom: 24, backgroundColor: 'rgba(37,99,235,0.02)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Your Business in Simple Words</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* 1. WHAT IS HAPPENING? */}
              <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>1. WHAT IS HAPPENING?</span>
                <p style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {summaryData?.healthScore >= 75 
                    ? `Your business is doing well. Your current health score is ${summaryData?.healthScore} out of 100.` 
                    : summaryData?.healthScore >= 50 
                    ? `Your business is stable. Your current health score is ${summaryData?.healthScore} out of 100.`
                    : `Your business needs attention. Your health score is ${summaryData?.healthScore} out of 100.`}
                </p>
              </div>

              {/* 2. WHAT IS GOING WELL? */}
              <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>2. WHAT IS GOING WELL?</span>
                <p style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  {summaryData?.positiveFactors?.[0] || 'Sales trajectory is stable and your profit margin is strong.'}
                </p>
              </div>

              {/* 3. WHAT NEEDS ATTENTION? */}
              <div style={{ padding: 14, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'var(--card-bg)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>3. WHAT NEEDS ATTENTION?</span>
                {summaryData?.attentionItems && summaryData.attentionItems.length > 0 ? (
                  <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {summaryData.attentionItems.slice(0, 2).map((att, i) => (
                      <div key={i} style={{ fontSize: 12, color: 'var(--text-main)', lineHeight: 1.4 }}>
                        <strong style={{ color: att.severity === 'HIGH' ? '#EF4444' : '#F59E0B' }}>
                          [{att.severity || 'ATTENTION'}]:
                        </strong> {att.detail}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {summaryData?.negativeFactors?.[0] || 'Some products or sales periods have room for profit optimization.'}
                  </p>
                )}
              </div>

              {/* 4. WHAT SHOULD YOU DO NEXT? */}
              <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--card-bg)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase' }}>4. WHAT SHOULD YOU DO NEXT?</span>
                <p style={{ fontSize: 13, margin: '6px 0 0', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  <Link to="/ai-recommendations" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                    See what you should do first →
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Sales & Target Chart (with INR ₹ labels) */}
          <div className="dashboard-charts-row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div className="card" style={{ padding: 24, flex: '1 1 60%', minWidth: 320 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Monthly Sales & Revenue Growth</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Revenue trends and target benchmarks</p>
                </div>
                <span className="badge badge-info">Live Dataset Sync</span>
              </div>

              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <LineChart data={salesDataState}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      formatter={(val) => [formatINR(val), '']} 
                      contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--border)', color: 'var(--text-main)' }} 
                      itemStyle={{ color: 'var(--text-main)' }}
                      labelStyle={{ color: 'var(--text-main)', fontWeight: 700 }}
                    />
                    <Legend wrapperStyle={{ color: 'var(--text-main)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} name="Revenue (₹)" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="sales" stroke="var(--secondary)" strokeWidth={2} name="Sales" />
                    <Line type="monotone" dataKey="target" stroke="var(--text-light)" strokeDasharray="5 5" name="Target (₹)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Important Things We Found */}
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: '1 1 35%', minWidth: 280 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="var(--secondary)" />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>Important Things We Found</h3>
                </div>
                <Link to="/ai-recommendations" className="dashboard-view-all-link">
                  View All →
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {(analysisObj?.recommendations || []).slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="dashboard-ai-item" style={{ padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{rec.title}</span>
                      <span className="badge badge-info" style={{ fontSize: 10 }}>{rec.upside}</span>
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
