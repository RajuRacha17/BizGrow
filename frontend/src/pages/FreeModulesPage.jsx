import React, { useState } from 'react'
import {
  Search,
  Zap,
  Calculator,
  TrendingUp,
  Target,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Layers
} from 'lucide-react'
import '../styles/FreeModulesPage.css'

const sampleQueries = [
  'How to increase retail store sales during low seasons?',
  'Best strategies to improve profit margin in restaurants',
  'How to reduce customer churn in a service business?',
  'Pricing strategies for high-margin wholesale products',
  'How to calculate customer acquisition cost (CAC)?'
]

const industryOptions = [
  { value: 'General', label: 'General Business / All Sectors' },
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Restaurant', label: 'Restaurant & Food Services' },
  { value: 'Services', label: 'Professional Services & Consulting' },
  { value: 'Manufacturing', label: 'Manufacturing & Wholesale' },
  { value: 'Healthcare', label: 'Healthcare & Wellness' },
  { value: 'SaaS', label: 'SaaS & Technology' }
]

export default function FreeModulesPage() {
  const [activeTab, setActiveTab] = useState('search')

  // Module 1: BizQuery Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchIndustry, setSearchIndustry] = useState('General')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)

  // Module 2: Free Calculator State
  const [calcData, setCalcData] = useState({
    monthlyRevenue: 250000,
    monthlyExpenses: 180000,
    customerCount: 150,
    industryType: 'General'
  })
  const [calcResult, setCalcResult] = useState(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Module 3: Pricing Strategy Generator State
  const [pricingData, setPricingData] = useState({
    productName: 'Business Consulting Service',
    baseCost: 5000,
    marginTarget: 40,
    industryType: 'Services'
  })

  // Module 4: Growth Simulator State
  const [simData, setSimData] = useState({
    baseRevenue: 500000,
    baseProfit: 100000,
    priceIncreasePct: 5,
    retentionIncreasePct: 10,
    costReductionPct: 5
  })

  // Handle Realtime Search Submit
  const handleSearchSubmit = async (queryToSearch = searchQuery) => {
    const q = queryToSearch || searchQuery
    if (!q.trim()) return

    setIsSearching(true)
    setSearchResult(null)

    try {
      const res = await fetch('/api/analytics/realtime-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          industryType: searchIndustry
        })
      })

      const data = await res.json()
      if (data.success && data.searchResult) {
        setSearchResult(data.searchResult)
      } else {
        throw new Error(data.message || 'Search failed')
      }
    } catch (err) {
      console.warn('Backend search API offline, fallback to client synthesis:', err)
      const fallbackResult = {
        query: q,
        industry: searchIndustry,
        directAnswer: `To optimize ${searchIndustry} operations for "${q}", focus on increasing customer lifetime value, reducing variable costs, and implementing tiered pricing.`,
        keyInsights: [
          'High-performing businesses maintain a gross profit margin buffer of at least 35%.',
          'Retaining existing repeat customers drives 40%+ higher profit than acquiring cold traffic.',
          'Reviewing vendor pricing every 90 days prevents margin leakage in ₹.'
        ],
        actionSteps: [
          { step: 1, title: 'Audit High-Margin Products/Services', description: 'Promote top 20% profitable items on homepage/front display.', timeframe: 'Immediate' },
          { step: 2, title: 'Re-engage Inactive Customers', description: 'Send targeted WhatsApp/SMS re-engagement offers with special discounts.', timeframe: '7 Days' },
          { step: 3, title: 'Renegotiate Overhead Expenses', description: 'Cut non-essential software or renegotiate bulk supply rates.', timeframe: '14 Days' }
        ],
        metricsToTrack: [
          { name: 'Gross Margin %', target: '35% - 50%', why: 'Covers operating overhead comfortably' },
          { name: 'Repeat Buyer Rate', target: '30%+', why: 'Drives predictable monthly cash flow' },
          { name: 'Average Basket Value', target: '₹2,500+', why: 'Maximizes revenue per customer visit' }
        ],
        industryBenchmarks: `${searchIndustry} industry average operating margin typically ranges between 18% and 32%.`,
        risksToAvoid: [
          'Discounting heavily without checking unit profitability in ₹',
          'Tying up excess working capital in unsold inventory'
        ],
        relatedQueries: [
          `How to increase average order value in ${searchIndustry}?`,
          `Cost reduction ideas for ${searchIndustry} businesses`,
          `How to automate follow-up sales in ${searchIndustry}?`
        ]
      }
      setSearchResult(fallbackResult)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle Free Calculator Submit
  const handleCalculateHealth = async () => {
    setIsCalculating(true)
    try {
      const res = await fetch('/api/analytics/free-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calcData)
      })
      const data = await res.json()
      if (data.success) {
        setCalcResult(data.calculated)
      }
    } catch (err) {
      const rev = parseFloat(calcData.monthlyRevenue) || 0
      const exp = parseFloat(calcData.monthlyExpenses) || 0
      const cust = parseInt(calcData.customerCount) || 1
      const netProfit = rev - exp
      const profitMargin = rev > 0 ? ((netProfit / rev) * 100).toFixed(1) : '0.0'
      const avgRev = cust > 0 ? (rev / cust).toFixed(0) : '0'
      const pMarginNum = parseFloat(profitMargin)
      const healthScore = Math.min(100, Math.max(15, Math.round(50 + (pMarginNum > 0 ? pMarginNum * 1.2 : 0))))

      setCalcResult({
        monthlyRevenue: rev,
        monthlyExpenses: exp,
        netProfit,
        profitMargin: `${profitMargin}%`,
        avgRevenuePerCustomer: `₹${parseInt(avgRev).toLocaleString('en-IN')}`,
        healthScore,
        industryType: calcData.industryType,
        industryTargetMargin: '25%',
        marginStatus: pMarginNum >= 20 ? 'Above Industry Benchmark' : 'Below Target Margin'
      })
    } finally {
      setIsCalculating(false)
    }
  }

  // Calculate pricing model tiers
  const baseCost = parseFloat(pricingData.baseCost) || 0
  const marginTarget = parseFloat(pricingData.marginTarget) || 30
  const standardPrice = baseCost / (1 - marginTarget / 100)
  const basicPrice = standardPrice * 0.75
  const premiumPrice = standardPrice * 1.6

  // Calculate Simulator values
  const revGainPrice = simData.baseRevenue * (simData.priceIncreasePct / 100)
  const revGainRet = simData.baseRevenue * (simData.retentionIncreasePct / 100) * 0.5
  const projectedRevenue = simData.baseRevenue + revGainPrice + revGainRet
  const costSavings = (simData.baseRevenue - simData.baseProfit) * (simData.costReductionPct / 100)
  const projectedProfit = simData.baseProfit + revGainPrice + revGainRet + costSavings
  const netGain = projectedProfit - simData.baseProfit

  return (
    <div className="free-modules-container">
      {/* Page Header */}
      <div className="free-modules-header">
        <div className="free-header-title-badge">
          <Sparkles size={16} /> FREE AI BUSINESS TOOLKIT
        </div>
        <h1>Real-Time AI Engine & Business Modules</h1>
        <p>
          Ask any business question in plain English, compute instant financial health, simulate growth scenarios, and generate custom pricing strategies.
        </p>

        {/* Module Nav Tabs */}
        <div className="free-modules-tabs">
          <button
            className={`free-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search size={16} />
            <span>BizQuery (Realtime AI Search)</span>
          </button>

          <button
            className={`free-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator size={16} />
            <span>Health & Margin Calculator</span>
          </button>

          <button
            className={`free-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
            onClick={() => setActiveTab('pricing')}
          >
            <Layers size={16} />
            <span>Pricing Strategy Advisor</span>
          </button>

          <button
            className={`free-tab-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <TrendingUp size={16} />
            <span>Growth Simulator</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BIZQUERY REALTIME AI SEARCH */}
      {activeTab === 'search' && (
        <div className="free-module-card">
          <div className="search-engine-hero">
            <h2>
              <Search className="accent-icon" size={24} />
              BizQuery — Google for Business Intelligence
            </h2>
            <p>Type any question about business growth, profit margin, marketing, or cost reduction.</p>

            {/* Search Controls */}
            <div className="search-bar-wrapper">
              <div className="search-input-box">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="e.g. How to increase retail store profit margin during festival season?"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
                />
                <button
                  className="search-btn"
                  onClick={() => handleSearchSubmit()}
                  disabled={isSearching}
                >
                  {isSearching ? 'Analyzing...' : 'Search AI'}
                </button>
              </div>

              {/* Industry Filter Selector */}
              <div className="search-industry-filter">
                <label>Industry Context:</label>
                <select
                  value={searchIndustry}
                  onChange={e => setSearchIndustry(e.target.value)}
                >
                  {industryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="sample-queries-list">
              <span className="sample-label">Popular Searches:</span>
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  className="sample-chip"
                  onClick={() => {
                    setSearchQuery(q)
                    handleSearchSubmit(q)
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Search Loader */}
          {isSearching && (
            <div className="search-loading-box">
              <Sparkles className="spinning-icon" size={32} />
              <p>Analyzing query with Google Gemini AI Engine & synthesizing business solutions...</p>
            </div>
          )}

          {/* Search Results Display */}
          {searchResult && !isSearching && (
            <div className="search-results-container">
              {/* Direct Answer Box */}
              <div className="direct-answer-card">
                <div className="answer-badge">
                  <Zap size={16} /> EXECUTIVE DIRECT ANSWER
                </div>
                <p className="direct-answer-text">{searchResult.directAnswer}</p>
                <div className="answer-meta">
                  <span>Industry: <strong>{searchResult.industry}</strong></span>
                  <span>Benchmark: <strong>{searchResult.industryBenchmarks}</strong></span>
                </div>
              </div>

              <div className="results-grid-2col">
                {/* Key Insights */}
                <div className="result-section-box">
                  <h3><Sparkles size={18} /> Key Business Insights</h3>
                  <ul className="styled-bullet-list">
                    {searchResult.keyInsights?.map((insight, i) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>

                {/* Metrics to Track */}
                <div className="result-section-box">
                  <h3><BarChart3 size={18} /> Metrics You Should Track</h3>
                  <div className="metrics-track-list">
                    {searchResult.metricsToTrack?.map((m, i) => (
                      <div key={i} className="metric-track-item">
                        <div className="m-head">
                          <span className="m-name">{m.name}</span>
                          <span className="m-target">{m.target}</span>
                        </div>
                        <p className="m-why">{m.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Steps Blueprint */}
              <div className="result-section-box full-width">
                <h3><Target size={18} /> Action Plan & Execution Steps</h3>
                <div className="action-steps-grid">
                  {searchResult.actionSteps?.map((step, i) => (
                    <div key={i} className="action-step-card">
                      <div className="step-num-badge">Step {step.step || i + 1}</div>
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                      <span className="step-timeframe">⏱ {step.timeframe}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks to Avoid */}
              {searchResult.risksToAvoid && (
                <div className="risk-warning-box">
                  <ShieldAlert size={20} className="warning-icon" />
                  <div>
                    <h4>Critical Risks to Avoid:</h4>
                    <ul>
                      {searchResult.risksToAvoid.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Follow-up Queries */}
              {searchResult.relatedQueries && (
                <div className="related-queries-box">
                  <h4><HelpCircle size={16} /> Related Business Queries</h4>
                  <div className="related-chips">
                    {searchResult.relatedQueries.map((rq, i) => (
                      <button
                        key={i}
                        className="related-chip"
                        onClick={() => {
                          setSearchQuery(rq)
                          handleSearchSubmit(rq)
                        }}
                      >
                        {rq} <ArrowRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FREE BUSINESS HEALTH & MARGIN CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="free-module-card">
          <h2><Calculator className="accent-icon" size={24} /> Free Business Health & Margin Calculator</h2>
          <p>Instantly evaluate your gross profit margin, net profit, and health score in Indian Rupees (₹).</p>

          <div className="calculator-layout">
            <div className="calc-inputs-form">
              <div className="form-group">
                <label>Industry Type</label>
                <select
                  value={calcData.industryType}
                  onChange={e => setCalcData({ ...calcData, industryType: e.target.value })}
                >
                  {industryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Monthly Revenue (₹)</label>
                <input
                  type="number"
                  value={calcData.monthlyRevenue}
                  onChange={e => setCalcData({ ...calcData, monthlyRevenue: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={calcData.monthlyExpenses}
                  onChange={e => setCalcData({ ...calcData, monthlyExpenses: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Monthly Active Customers / Orders</label>
                <input
                  type="number"
                  value={calcData.customerCount}
                  onChange={e => setCalcData({ ...calcData, customerCount: e.target.value })}
                />
              </div>

              <button className="calc-submit-btn" onClick={handleCalculateHealth}>
                {isCalculating ? 'Computing...' : 'Calculate Health Score'}
              </button>
            </div>

            {/* Calc Output */}
            <div className="calc-output-display">
              {calcResult ? (
                <div className="calc-results-card">
                  <div className="health-score-ring">
                    <div className="score-number">{calcResult.healthScore}</div>
                    <div className="score-label">Health Score / 100</div>
                  </div>

                  <div className="calc-metrics-grid">
                    <div className="calc-metric-box">
                      <span className="cm-label">Net Monthly Profit</span>
                      <span className="cm-val profit">₹{Math.round(calcResult.netProfit).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="calc-metric-box">
                      <span className="cm-label">Profit Margin</span>
                      <span className="cm-val margin">{calcResult.profitMargin}</span>
                    </div>

                    <div className="calc-metric-box">
                      <span className="cm-label">Revenue / Customer</span>
                      <span className="cm-val">{calcResult.avgRevenuePerCustomer}</span>
                    </div>

                    <div className="calc-metric-box">
                      <span className="cm-label">Benchmark Status</span>
                      <span className="cm-val status">{calcResult.marginStatus}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="calc-placeholder">
                  <Calculator size={48} />
                  <p>Click "Calculate Health Score" to view your financial diagnostic summary.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRICING STRATEGY ADVISOR */}
      {activeTab === 'pricing' && (
        <div className="free-module-card">
          <h2><Layers className="accent-icon" size={24} /> Free Competitor & Pricing Strategy Generator</h2>
          <p>Generate a 3-tier pricing model (Basic, Standard, Premium) optimized for your cost structure.</p>

          <div className="pricing-config-grid">
            <div className="form-group">
              <label>Product or Service Name</label>
              <input
                type="text"
                value={pricingData.productName}
                onChange={e => setPricingData({ ...pricingData, productName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Base Cost Per Unit (₹)</label>
              <input
                type="number"
                value={pricingData.baseCost}
                onChange={e => setPricingData({ ...pricingData, baseCost: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Target Margin (%)</label>
              <input
                type="number"
                value={pricingData.marginTarget}
                onChange={e => setPricingData({ ...pricingData, marginTarget: e.target.value })}
              />
            </div>
          </div>

          <div className="pricing-tiers-grid">
            {/* Tier 1: Basic */}
            <div className="pricing-tier-card">
              <div className="tier-badge">ESSENTIAL / BASIC</div>
              <h3>{pricingData.productName} Standard</h3>
              <div className="tier-price">₹{Math.round(basicPrice).toLocaleString('en-IN')}</div>
              <p className="tier-desc">Entry-level pricing to capture price-sensitive customers.</p>
              <ul className="tier-features">
                <li><CheckCircle2 size={14} /> Core feature set</li>
                <li><CheckCircle2 size={14} /> Standard email support</li>
                <li><CheckCircle2 size={14} /> Estimated Margin: {Math.round(marginTarget * 0.75)}%</li>
              </ul>
            </div>

            {/* Tier 2: Standard (Recommended) */}
            <div className="pricing-tier-card featured">
              <div className="tier-badge popular">MOST POPULAR (RECOMMENDED)</div>
              <h3>{pricingData.productName} Pro</h3>
              <div className="tier-price">₹{Math.round(standardPrice).toLocaleString('en-IN')}</div>
              <p className="tier-desc">Optimal balance of high margin and customer conversion.</p>
              <ul className="tier-features">
                <li><CheckCircle2 size={14} /> Full feature suite</li>
                <li><CheckCircle2 size={14} /> Priority phone & chat support</li>
                <li><CheckCircle2 size={14} /> Target Margin: {marginTarget}%</li>
              </ul>
            </div>

            {/* Tier 3: Premium */}
            <div className="pricing-tier-card">
              <div className="tier-badge premium">PREMIUM / VIP</div>
              <h3>{pricingData.productName} Enterprise</h3>
              <div className="tier-price">₹{Math.round(premiumPrice).toLocaleString('en-IN')}</div>
              <p className="tier-desc">Designed for enterprise & high-tier buyers demanding top service.</p>
              <ul className="tier-features">
                <li><CheckCircle2 size={14} /> All features + custom add-ons</li>
                <li><CheckCircle2 size={14} /> Dedicated account manager</li>
                <li><CheckCircle2 size={14} /> Estimated Margin: {Math.round(marginTarget * 1.35)}%</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVENUE GROWTH SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="free-module-card">
          <h2><TrendingUp className="accent-icon" size={24} /> Free Revenue Growth & Scenario Simulator</h2>
          <p>Adjust price increase, retention, and cost control sliders to see real-time projected profit growth in ₹.</p>

          <div className="simulator-container">
            <div className="sim-sliders-card">
              <div className="form-group">
                <label>Current Monthly Revenue: <strong>₹{simData.baseRevenue.toLocaleString('en-IN')}</strong></label>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={simData.baseRevenue}
                  onChange={e => setSimData({ ...simData, baseRevenue: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Price Increase: <strong>+{simData.priceIncreasePct}%</strong></label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={simData.priceIncreasePct}
                  onChange={e => setSimData({ ...simData, priceIncreasePct: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Customer Retention Increase: <strong>+{simData.retentionIncreasePct}%</strong></label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={simData.retentionIncreasePct}
                  onChange={e => setSimData({ ...simData, retentionIncreasePct: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Operating Cost Reduction: <strong>-{simData.costReductionPct}%</strong></label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={simData.costReductionPct}
                  onChange={e => setSimData({ ...simData, costReductionPct: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Sim Projection Results */}
            <div className="sim-results-card">
              <h3>Simulated Monthly Output</h3>

              <div className="sim-metric-row">
                <span>Projected Monthly Revenue:</span>
                <strong className="val-highlight">₹{Math.round(projectedRevenue).toLocaleString('en-IN')}</strong>
              </div>

              <div className="sim-metric-row">
                <span>Projected Monthly Profit:</span>
                <strong className="val-profit">₹{Math.round(projectedProfit).toLocaleString('en-IN')}</strong>
              </div>

              <div className="sim-net-gain-banner">
                <span>Estimated Additional Monthly Cash Flow:</span>
                <h2>+₹{Math.round(netGain).toLocaleString('en-IN')}</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
