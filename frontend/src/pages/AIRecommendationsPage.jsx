import React, { useState } from 'react'
import { Sparkles, Target, ShoppingBag, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import '../styles/AIRecommendationsPage.css'

const aiTips = [
  {
    id: 1,
    category: 'Sales Optimization',
    title: 'Cross-Sell AI Analytics Module to SaaS Pro Customers',
    impact: 'High Impact (+$14,200/mo)',
    difficulty: 'Easy (Automated)',
    desc: 'Machine learning algorithms detected that 42% of active SaaS Pro accounts have expanded data teams. Offering an in-app 14-day preview of the AI Analytics Module will increase conversion by 28%.',
    icon: Sparkles,
    color: '#2563EB'
  },
  {
    id: 2,
    category: 'Customer Engagement',
    title: 'Launch Automated Re-Engagement for At-Risk SMB Clients',
    impact: 'High Impact (Save $8,400 CLV)',
    difficulty: 'Medium',
    desc: '12 accounts in the SMB tier have logged zero API queries over the last 21 days. Triggering an automated check-in email sequence with a customer success specialist will reduce churn.',
    icon: Users,
    color: '#7C3AED'
  },
  {
    id: 3,
    category: 'Marketing Strategy',
    title: 'Shift 20% Ad Budget to High-Converting LinkedIn Campaign',
    impact: 'Medium Impact (+18% Leads)',
    difficulty: 'Easy',
    desc: 'LinkedIn Sponsored Content returned a 3.4x higher ROI compared to Google Search Ads over Q2. Reallocating $5,000/mo will reduce Customer Acquisition Cost (CAC) from $240 to $185.',
    icon: Target,
    color: '#10B981'
  },
  {
    id: 4,
    category: 'Inventory & Operations',
    title: 'Automate Restock Order Trigger for SKU-402',
    impact: 'High Impact (Prevent Out-of-Stock)',
    difficulty: 'Automated',
    desc: 'Current stock velocity indicates SKU-402 inventory will drop below safety threshold in 4 days. Enable auto-reorder to prevent $12,000 in lost revenue during peak weekend.',
    icon: ShoppingBag,
    color: '#F59E0B'
  },
  {
    id: 5,
    category: 'Cost Reduction',
    title: 'Consolidate Redundant Cloud Compute Clusters',
    impact: 'Medium Impact (-$2,800/mo)',
    difficulty: 'Medium',
    desc: 'Server utilization logs show staging environments running at < 8% CPU load during non-business hours. Enabling auto-scaling scheduled shutdown saves $2,800 monthly.',
    icon: Zap,
    color: '#EC4899'
  }
]

export default function AIRecommendationsPage() {
  const [applied, setApplied] = useState([])
  const [recommendations, setRecommendations] = useState([])

  React.useEffect(() => {
    fetch('http://localhost:5000/api/recommendations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.recommendations) {
          const formatted = data.recommendations.map((rec) => ({
            id: rec._id,
            category: rec.category,
            title: rec.title,
            impact: `High Impact (${rec.upside})`,
            difficulty: rec.priority === 'HIGH' ? 'Easy (Automated)' : 'Medium',
            desc: rec.description,
            icon: Sparkles,
            color: rec.priority === 'HIGH' ? '#2563EB' : rec.priority === 'MEDIUM' ? '#7C3AED' : '#F59E0B',
            status: rec.status,
          }))
          setRecommendations(formatted)
          const alreadyApplied = data.recommendations
            .filter((r) => r.status === 'APPLIED')
            .map((r) => r._id)
          setApplied(alreadyApplied)
        }
      })
      .catch((err) => console.log('Recommendations fetch fallback:', err))
  }, [])

  const toggleApply = async (id) => {
    const isDone = applied.includes(id)
    const newStatus = isDone ? 'ACTIVE' : 'APPLIED'

    if (isDone) {
      setApplied(applied.filter(item => item !== id))
    } else {
      setApplied([...applied, id])
    }

    try {
      await fetch(`http://localhost:5000/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
    } catch (err) {
      console.log('Update recommendation error:', err)
    }
  }

  return (
    <div className="ai-recommendations-container">
      {/* Header Banner */}
      <div className="card ai-recommendations-hero">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            <Sparkles size={14} /> PBIS Recommendation Engine v2.4
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>AI Strategic Growth Advisor</h2>
          <p style={{ opacity: 0.9, fontSize: 14, marginTop: 4, maxWidth: 600 }}>
            Personalized actionable recommendations generated specifically for your business model using machine learning pattern matching.
          </p>
        </div>

        <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.1)', padding: '16px 24px', borderRadius: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 800 }}>+$25,400/mo</div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Potential Monthly Upside</div>
        </div>
      </div>

      {/* Cards List */}
      <div className="ai-cards-list">
        {(recommendations.length > 0 ? recommendations : aiTips).map(tip => {
          const Icon = tip.icon
          const isDone = applied.includes(tip.id)

          return (
            <div
              key={tip.id}
              className="card card-hover"
              style={{
                padding: 24,
                display: 'flex',
                gap: 20,
                alignItems: 'flex-start',
                borderLeft: `4px solid ${tip.color}`
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: `${tip.color}15`,
                  color: tip.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Icon size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                  <span className="badge badge-info" style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}>{tip.category}</span>
                  <span className="badge badge-success">{tip.impact}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Difficulty: {tip.difficulty}</span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
                  {tip.title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  {tip.desc}
                </p>

                <button
                  className={isDone ? 'btn-secondary' : 'btn-primary'}
                  onClick={() => toggleApply(tip.id)}
                  style={{ fontSize: 13, padding: '8px 16px' }}
                >
                  {isDone ? (
                    <><CheckCircle size={15} color="#10B981" /> Recommendation Applied</>
                  ) : (
                    <>Apply Recommendation <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
