import React, { useState } from 'react'
import {
  Database,
  Cpu,
  Search,
  BarChart2,
  Lightbulb,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Activity,
  Layers,
  Target,
  TrendingUp
} from 'lucide-react'
import '../styles/TransformationEngine.css'

export default function TransformationEngine() {
  // Step 02 (index 1) is AI Analysis by default
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      num: 'STEP 01',
      title: 'Business Data',
      icon: Database,
      desc: 'Business data is uploaded or connected to the system.'
    },
    {
      num: 'STEP 02',
      title: 'AI Analysis',
      icon: Cpu,
      desc: 'AI analyzes patterns, trends, relationships, and important business metrics.'
    },
    {
      num: 'STEP 03',
      title: 'Problem Detection',
      icon: Search,
      desc: 'Identify unusual patterns, weak areas, and potential business problems.'
    },
    {
      num: 'STEP 04',
      title: 'Performance Gap',
      icon: BarChart2,
      desc: 'Measure the gap between current performance and potential performance.'
    },
    {
      num: 'STEP 05',
      title: 'Personalized Recommendations',
      icon: Lightbulb,
      desc: 'Generate recommendations based on the specific business data.'
    },
    {
      num: 'STEP 06',
      title: 'Business Growth',
      icon: ArrowUpRight,
      desc: 'Turn insights into practical actions that can improve business performance.'
    }
  ]

  // Dynamic detailed content for each step
  const stepDetails = [
    // STEP 01 — Business Data
    {
      eyebrow: 'PHASE 1 OF 6 • BUSINESS DATA',
      heading: '1. Business Data',
      icon: Database,
      copy: 'PBIS starts with your business data, providing the foundation needed to understand performance, identify patterns, and discover opportunities for improvement.',
      points: [
        'Business data collection',
        'CSV or supported data upload',
        'Data preparation and validation',
        'Business metrics and variables'
      ],
      matrixTitle: 'Business Data Input',
      matrixSub: 'Uploaded & connected data source metrics',
      rows: [
        { label: 'Sales Data', metric: 'Historical transaction records', status: 'AVAILABLE', badgeClass: 'te-badge-normal' },
        { label: 'Customer Data', metric: 'User profiles & cohort volume', status: 'AVAILABLE', badgeClass: 'te-badge-normal' },
        { label: 'Product Data', metric: 'Catalog & pricing structure', status: 'AVAILABLE', badgeClass: 'te-badge-normal' },
        { label: 'Transaction Data', metric: 'Payment & subscription logs', status: 'READY', badgeClass: 'te-badge-important' },
        { label: 'Business Metrics', metric: 'Calculated baseline KPI targets', status: 'READY', badgeClass: 'te-badge-important' }
      ],
      footerText: 'Data ingested and prepared for AI analysis processing.'
    },
    // STEP 02 — AI Analysis
    {
      eyebrow: 'PHASE 2 OF 6 • AI-POWERED ANALYSIS',
      heading: '2. AI Business Analysis',
      icon: Cpu,
      copy: 'PBIS analyzes business data across important variables, time periods, customer segments, products, pricing, and performance metrics to identify patterns that may affect business growth.',
      points: [
        'Multi-variable business performance analysis',
        'Trend and pattern detection',
        'Customer and product performance analysis',
        'Identification of important business drivers'
      ],
      matrixTitle: 'AI Diagnostic Matrix',
      matrixSub: 'Automated variable evaluation summary',
      rows: [
        { label: 'Sales Performance', metric: 'Revenue & conversion analysis', status: 'NORMAL', badgeClass: 'te-badge-normal' },
        { label: 'Customer Segment Trend', metric: 'Retention & lifetime value variance', status: 'IMPORTANT', badgeClass: 'te-badge-important' },
        { label: 'Product Performance', metric: 'Margin & inventory velocity bottleneck', status: 'NEEDS ATTENTION', badgeClass: 'te-badge-attention' },
        { label: 'Revenue Pattern', metric: 'Recurring subscription seasonality', status: 'DETECTED', badgeClass: 'te-badge-detected' },
        { label: 'Performance Opportunity', metric: 'Cross-sell cohort optimization potential', status: 'IDENTIFIED', badgeClass: 'te-badge-opportunity' }
      ],
      footerText: 'Sample diagnostic view based on connected dataset variables.'
    },
    // STEP 03 — Problem Detection
    {
      eyebrow: 'PHASE 3 OF 6 • PROBLEM DETECTION',
      heading: '3. Problem Detection',
      icon: Search,
      copy: 'PBIS identifies important patterns, weak areas, unusual changes, and potential business problems that may be affecting performance.',
      points: [
        'Detect performance anomalies',
        'Identify declining business areas',
        'Find weak products or segments',
        'Identify potential business bottlenecks'
      ],
      matrixTitle: 'Business Problem Detection',
      matrixSub: 'Detected anomalies & performance risks',
      rows: [
        { label: 'Sales Trend', metric: 'Quarterly conversion decline signal', status: 'REVIEWED', badgeClass: 'te-badge-normal' },
        { label: 'Product Performance', metric: 'Low-performing product tier SKU-402', status: 'ANALYZED', badgeClass: 'te-badge-important' },
        { label: 'Customer Segment', metric: 'SMB account 21-day inactivity drift', status: 'ANALYZED', badgeClass: 'te-badge-important' },
        { label: 'Revenue Pattern', metric: 'Ad spend CAC divergence on Search', status: 'DETECTED', badgeClass: 'te-badge-detected' },
        { label: 'Business Bottleneck', metric: 'Inventory depletion velocity spike', status: 'IDENTIFIED', badgeClass: 'te-badge-attention' }
      ],
      footerText: 'Anomalies flagged based on business metric pattern shifts.'
    },
    // STEP 04 — Performance Gap
    {
      eyebrow: 'PHASE 4 OF 6 • PERFORMANCE GAP',
      heading: '4. Performance Gap',
      icon: BarChart2,
      copy: 'PBIS compares current business performance with relevant targets, historical performance, or available benchmarks to highlight areas where improvement may be possible.',
      points: [
        'Current vs expected performance',
        'Identify performance gaps',
        'Quantify important differences',
        'Prioritize areas requiring attention'
      ],
      matrixTitle: 'Performance Gap Analysis',
      matrixSub: 'Current vs target potential comparison',
      rows: [
        { label: 'Quarterly Revenue Target', metric: 'Current: $128.4K • Target: $150K', status: '$21.6K GAP', badgeClass: 'te-badge-attention' },
        { label: 'Customer Retention Rate', metric: 'Current: 92% • Target: 95%', status: '3% GAP', badgeClass: 'te-badge-important' },
        { label: 'Product Cross-Sell Rate', metric: 'Current: 14% • Target: 25%', status: '11% GAP', badgeClass: 'te-badge-detected' },
        { label: 'Ad Acquisition Efficiency', metric: 'Current: $240 CAC • Target: $185 CAC', status: '$55 GAP', badgeClass: 'te-badge-attention' },
        { label: 'Staging Server Load', metric: 'Current: 8% CPU • Benchmark: 40%', status: 'SAVINGS GAP', badgeClass: 'te-badge-opportunity' }
      ],
      footerText: 'Illustrative performance gap metrics comparing baseline vs targets.'
    },
    // STEP 05 — Personalized Recommendations
    {
      eyebrow: 'PHASE 5 OF 6 • PERSONALIZED RECOMMENDATIONS',
      heading: '5. Personalized Recommendations',
      icon: Lightbulb,
      copy: 'PBIS converts identified problems and performance gaps into practical recommendations tailored to the specific business data and priorities.',
      points: [
        'Data-driven recommendations',
        'Prioritized action items',
        'Problem-specific suggestions',
        'Practical improvement strategies'
      ],
      matrixTitle: 'Recommended Actions',
      matrixSub: 'Prioritized AI strategic suggestions',
      rows: [
        { label: 'Priority 01: Cross-Sell AI Module', metric: 'Target SaaS Pro accounts with high usage', status: 'HIGH PRIORITY', badgeClass: 'te-badge-attention' },
        { label: 'Priority 02: Re-Engage Inactive SMBs', metric: 'Automate success check-in campaign', status: 'HIGH PRIORITY', badgeClass: 'te-badge-important' },
        { label: 'Priority 03: Reallocate Ad Spend', metric: 'Shift budget from Search to LinkedIn', status: 'MEDIUM PRIORITY', badgeClass: 'te-badge-detected' },
        { label: 'Priority 04: Restock Trigger', metric: 'Automate order trigger for SKU-402', status: 'MEDIUM PRIORITY', badgeClass: 'te-badge-opportunity' },
        { label: 'Priority 05: Server Auto-Scaling', metric: 'Scheduled shutdown of staging nodes', status: 'REVIEW', badgeClass: 'te-badge-normal' }
      ],
      footerText: 'Actions prioritized by estimated upside impact.'
    },
    // STEP 06 — Business Growth
    {
      eyebrow: 'PHASE 6 OF 6 • BUSINESS GROWTH',
      heading: '6. Business Growth',
      icon: ArrowUpRight,
      copy: 'PBIS brings the analysis and recommendations together to highlight practical opportunities for improving business performance and supporting sustainable growth.',
      points: [
        'Growth opportunities',
        'Priority improvement areas',
        'Action-oriented business insights',
        'Continuous performance improvement'
      ],
      matrixTitle: 'Business Growth Opportunities',
      matrixSub: 'Actionable growth & upside vectors',
      rows: [
        { label: 'Revenue Opportunity', metric: '+$14.2K/mo potential expansion', status: 'IDENTIFIED', badgeClass: 'te-badge-opportunity' },
        { label: 'Customer Retention Opportunity', metric: 'Save 45 accounts ($8.4K CLV value)', status: 'IDENTIFIED', badgeClass: 'te-badge-opportunity' },
        { label: 'Marketing Efficiency', metric: '+18% lead volume at lower CAC', status: 'IDENTIFIED', badgeClass: 'te-badge-important' },
        { label: 'Operational Inventory Risk', metric: 'Zero stockout revenue loss during peak', status: 'IDENTIFIED', badgeClass: 'te-badge-normal' },
        { label: 'Cost Optimization', metric: '-$2.8K/mo cloud infrastructure savings', status: 'IDENTIFIED', badgeClass: 'te-badge-detected' }
      ],
      footerText: 'Consolidated growth opportunity vectors generated from business analysis.'
    }
  ]

  const currentDetail = stepDetails[activeStep] || stepDetails[1]
  const DetailIcon = currentDetail.icon || Cpu

  return (
    <section className="te-section" id="transformation-engine">
      <div className="te-container">
        {/* Main Heading */}
        <div className="te-header">
          <div className="te-eyebrow">
            <Sparkles size={14} /> TRANSFORMATION PIPELINE
          </div>
          <h2 className="te-title">
            How PBIS Transforms Raw Data Into Smarter Business Growth
          </h2>
          <p className="te-subtitle">
            From raw business data to prioritized actions, PBIS analyzes business performance, identifies bottlenecks, and recommends practical ways to improve growth.
          </p>
        </div>

        {/* 6-Step Transformation Flow */}
        <div className="te-flow-wrapper">
          <div className="te-flow-line" />
          <div className="te-steps-grid">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isSelected = activeStep === idx

              return (
                <div
                  key={idx}
                  className={`te-step-card ${isSelected ? 'te-step-card-active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                  role="button"
                  tabIndex={0}
                  aria-selected={isSelected}
                  aria-label={`${step.num}: ${step.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveStep(idx)
                    }
                  }}
                >
                  <div className="te-step-top">
                    <span className="te-step-num">{step.num}</span>
                    <div className={`te-icon-box ${isSelected ? 'te-icon-primary' : ''}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="te-step-title">{step.title}</h3>
                  <p className="te-step-desc">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 1B: Interactive Detail Panel */}
        <div className="te-detail-panel card">
          <div className="te-detail-grid">
            {/* Left Side */}
            <div className="te-detail-left">
              <div className="te-phase-badge">
                <Activity size={13} /> {currentDetail.eyebrow}
              </div>
              <h3 className="te-detail-heading">{currentDetail.heading}</h3>
              <p className="te-detail-copy">{currentDetail.copy}</p>

              <div className="te-capabilities-list">
                {currentDetail.points.map((pt, i) => (
                  <div key={i} className="te-capability-item">
                    <div className="te-check-icon">
                      <CheckCircle2 size={16} />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Dynamic Diagnostic Summary Panel */}
            <div className="te-detail-right">
              <div className="te-matrix-card">
                <div className="te-matrix-header">
                  <div className="te-matrix-title-group">
                    <Layers size={18} color="#2563EB" />
                    <div>
                      <h4 className="te-matrix-title">{currentDetail.matrixTitle}</h4>
                      <p className="te-matrix-sub">{currentDetail.matrixSub}</p>
                    </div>
                  </div>
                  <span className="te-matrix-live-pill">
                    <span className="te-dot-pulse" /> Active View
                  </span>
                </div>

                <div className="te-matrix-table">
                  {currentDetail.rows.map((row, idx) => (
                    <div key={idx} className="te-matrix-row">
                      <div className="te-matrix-cell-info">
                        <div className="te-matrix-label">{row.label}</div>
                        <div className="te-matrix-metric">{row.metric}</div>
                      </div>
                      <div className="te-matrix-cell-status">
                        <span className={`te-status-badge ${row.badgeClass}`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="te-matrix-footer">
                  <span>{currentDetail.footerText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
