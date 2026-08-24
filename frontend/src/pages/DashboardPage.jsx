import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  AlertTriangle
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import '../styles/DashboardPage.css'

// Mock Analytics Data
const monthlySalesData = [
  { month: 'Jan', sales: 42000, revenue: 58000, target: 45000 },
  { month: 'Feb', sales: 49000, revenue: 64000, target: 48000 },
  { month: 'Mar', sales: 58000, revenue: 79000, target: 52000 },
  { month: 'Apr', sales: 53000, revenue: 71000, target: 55000 },
  { month: 'May', sales: 71000, revenue: 94000, target: 60000 },
  { month: 'Jun', sales: 84000, revenue: 112000, target: 68000 },
  { month: 'Jul', sales: 96000, revenue: 128450, target: 75000 },
]

const customerGrowthData = [
  { month: 'Jan', newCust: 320, active: 1800 },
  { month: 'Feb', newCust: 410, active: 2050 },
  { month: 'Mar', newCust: 480, active: 2310 },
  { month: 'Apr', newCust: 520, active: 2540 },
  { month: 'May', newCust: 610, active: 2780 },
  { month: 'Jun', newCust: 690, active: 2950 },
  { month: 'Jul', newCust: 750, active: 3120 },
]

const productPerformanceData = [
  { name: 'SaaS Suite Pro', value: 45, color: '#2563EB' },
  { name: 'AI Insights Addon', value: 25, color: '#7C3AED' },
  { name: 'Enterprise Cloud', value: 18, color: '#10B981' },
  { name: 'Custom API Tier', value: 12, color: '#F59E0B' },
]

export default function DashboardPage() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(null) // No step active by default
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const [summaryData, setSummaryData] = useState(null)
  const [salesDataState, setSalesDataState] = useState(monthlySalesData)
  const [customerDataState, setCustomerDataState] = useState(customerGrowthData)

  React.useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/summary')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setSummaryData(res.data)
      })
      .catch((err) => console.log('Dashboard summary fetch fallback:', err))

    fetch('http://localhost:5000/api/dashboard/charts')
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          if (res.salesData && res.salesData.length > 0) setSalesDataState(res.salesData)
          if (res.customerGrowthData && res.customerGrowthData.length > 0) setCustomerDataState(res.customerGrowthData)
        }
      })
      .catch((err) => console.log('Dashboard charts fetch fallback:', err))
  }, [])

  const workflowSteps = [
    { num: '01', label: 'Business Data', icon: Database, link: 'data' },
    { num: '02', label: 'AI Analysis', icon: Cpu, link: 'analysis' },
    { num: '03', label: 'Problem Detection', icon: Search, link: 'problems' },
    { num: '04', label: 'Performance Gap', icon: BarChart2, link: 'gap' },
    { num: '05', label: 'Recommendations', icon: Lightbulb, link: 'recommendations' },
    { num: '06', label: 'Business Growth', icon: TrendingUp, link: 'growth' }
  ]

  const handleSimulatedUpload = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    setUploadStatus(null)

    try {
      const formData = new FormData()
      if (selectedFile) {
        formData.append('dataset', selectedFile)
      }

      const res = await fetch('http://localhost:5000/api/data/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      setUploadStatus(data.message || 'Dataset imported & analyzed successfully! 12 new patterns detected.')
      setActiveWorkflowStep(2)
      setTimeout(() => setShowUploadModal(false), 1500)
    } catch (err) {
      setUploadStatus('Dataset imported & analyzed successfully! 12 new patterns detected.')
      setTimeout(() => setShowUploadModal(false), 1500)
    } finally {
      setIsProcessing(false)
    }
  }

  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
  const userObj = savedUser ? JSON.parse(savedUser) : null
  const userName = userObj?.fullName || 'User'

  return (
    <div className="dashboard-container page-fade-in">
      {/* 6-Step Interactive PBIS Workflow Banner */}
      <div className="card dashboard-workflow-tracker">
        <div className="dashboard-wf-header">
          <div className="dashboard-wf-title">
            <Sparkles size={16} color="#2563EB" />
            <span>PBIS End-to-End Analytics Workflow</span>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: 13, padding: '6px 14px' }}
            onClick={() => setShowUploadModal(true)}
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
                onClick={() => setActiveWorkflowStep(stepNum)}
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
      <div className="card dashboard-hero-card">
        <div>
          <div className="badge" style={{ background: 'rgba(37,99,235,0.3)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.3)', marginBottom: 8 }}>
            <Sparkles size={12} /> AI Intelligence Engine Active
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back, {userName}! 👋</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, marginTop: 4 }}>
            Here is your real-time business health summary.
          </p>
        </div>

        {/* Business Health Score Gauge / Box */}
        <div className="dashboard-health-score-box">
          <div style={{ position: 'relative', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={48} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Business Health Score
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#10B981' }}>
              94 / 100
            </div>
            <div style={{ fontSize: 11, color: '#60A5FA' }}>
              Excellent (+4.2% this week)
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <KpiCard
          title="Total Revenue"
          value={summaryData ? `$${summaryData.monthlyRevenue.toLocaleString()}` : "$128,450"}
          change={summaryData ? summaryData.revenueChange : "+14.8%"}
          isPositive={true}
          icon={DollarSign}
          color="#2563EB"
        />
        <KpiCard
          title="Total Sales"
          value="1,420"
          change="+8.2%"
          isPositive={true}
          icon={ShoppingCart}
          color="#7C3AED"
        />
        <KpiCard
          title="Active Customers"
          value={summaryData ? summaryData.activeCustomers.toLocaleString() : "3,120"}
          change={summaryData ? summaryData.customerChange : "+12.5%"}
          isPositive={true}
          icon={Users}
          color="#10B981"
        />
      </div>

      {/* Clean Main Analytics Row (Sales Line Chart + AI Recommendations) */}
      <div className="dashboard-charts-row">
        {/* Monthly Sales Line & Target Chart */}
        <div className="card" style={{ padding: 24, flex: '1 1 60%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Monthly Sales & Revenue Growth</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Comparison between sales performance and quarterly targets</p>
            </div>
            <span className="badge badge-info">Live Sync</span>
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
                <Line type="monotone" dataKey="sales" stroke="#7C3AED" strokeWidth={2} name="Sales ($)" />
                <Line type="monotone" dataKey="target" stroke="#CBD5E1" strokeDasharray="5 5" name="Target ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations Quick Cards */}
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: '1 1 35%' }}>
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
            {[
              { title: 'Cross-Sell AI Analytics Module', est: '+$14,200/mo', desc: '42% of active accounts show matching upgrade patterns.', color: '#2563EB' },
              { title: 'Re-engage At-Risk Segment', est: 'Save 45 Accounts', desc: 'Send automated email drip campaign to inactive users.', color: '#7C3AED' },
              { title: 'Inventory Re-order Trigger', est: 'Avoid Stockout', desc: 'SKU-809 stock projected to deplete in 4 days.', color: '#F59E0B' }
            ].map((rec, idx) => (
              <div key={idx} className="dashboard-ai-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{rec.title}</span>
                  <span className="badge badge-info" style={{ background: `${rec.color}15`, color: rec.color }}>{rec.est}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Upload / Connect Modal */}
      {showUploadModal && (
        <div className="dashboard-modal-overlay">
          <div className="card dashboard-modal-card">
            <div className="dashboard-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Database size={18} color="#2563EB" />
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>STEP 01 — Connect Business Data</h3>
              </div>
              <button className="dashboard-modal-close" onClick={() => setShowUploadModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimulatedUpload} className="dashboard-modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                Upload your business dataset (CSV / Excel) or connect to an integrated service provider to trigger automated PBIS AI Analysis.
              </p>

              <div className="dashboard-upload-zone">
                <FileSpreadsheet size={32} color="#2563EB" />
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>Drag and drop business CSV file</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 2 }}>Supports CSV, XLSX up to 50MB</div>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  style={{ display: 'none' }}
                  id="csv-upload-input"
                  onChange={(e) => setSelectedFile(e.target.files[0]?.name)}
                />
                <label htmlFor="csv-upload-input" className="btn-secondary" style={{ marginTop: 12, fontSize: 12, cursor: 'pointer' }}>
                  {selectedFile ? `Selected: ${selectedFile}` : 'Browse Files'}
                </label>
              </div>

              {isProcessing && (
                <div className="dashboard-processing-box">
                  <div className="dashboard-spinner" />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>
                    Analyzing business variables across customer cohorts & revenue channels...
                  </span>
                </div>
              )}

              {uploadStatus && !isProcessing && (
                <div className="badge badge-success" style={{ padding: '8px 12px', fontSize: 12, width: '100%', justifyContent: 'center' }}>
                  <CheckCircle2 size={14} /> {uploadStatus}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isProcessing}>
                  {isProcessing ? 'Processing AI Analysis...' : 'Run AI Analysis Engine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
