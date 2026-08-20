import React from 'react'
import { Check, Minus, Zap, Shield, ArrowRight } from 'lucide-react'
import '../styles/DiagnosticAdvantage.css'

export default function DiagnosticAdvantage() {
  const comparisonRows = [
    {
      capability: 'Primary Output',
      traditional: 'Charts, graphs, reports, and historical metrics',
      pbis: 'Actionable business insights and prioritized recommendations'
    },
    {
      capability: 'Problem Identification',
      traditional: 'Shows what changed or where performance dropped',
      pbis: 'Identifies important patterns and potential drivers behind the problem'
    },
    {
      capability: 'Performance Gap Analysis',
      traditional: 'Often requires manual analysis and comparison',
      pbis: 'Highlights performance gaps and potential improvement opportunities'
    },
    {
      capability: 'Action Guidance',
      traditional: 'Insights usually require additional interpretation',
      pbis: 'Provides prioritized, practical recommendations based on the analysis'
    },
    {
      capability: 'Data Analysis',
      traditional: 'Manual exploration across multiple reports or datasets',
      pbis: 'AI-assisted analysis of multiple business factors'
    },
    {
      capability: 'Time to Insight',
      traditional: 'Can require significant manual analysis',
      pbis: 'Designed to accelerate the path from data to actionable insight'
    }
  ]

  return (
    <section className="da-section" id="diagnostic-advantage">
      <div className="da-container">
        {/* Main Heading */}
        <div className="da-header">
          <div className="da-eyebrow">
            <Zap size={14} /> THE DIAGNOSTIC ADVANTAGE
          </div>
          <h2 className="da-title">
            Why Traditional Dashboards Aren’t Enough
          </h2>
          <p className="da-subtitle">
            Traditional dashboards show what happened. PBIS goes further by helping identify why it happened, where the performance gap exists, and what actions can be taken next.
          </p>
        </div>

        {/* Desktop Comparison Table */}
        <div className="da-table-wrapper card">
          <table className="da-table">
            <thead>
              <tr>
                <th className="da-col-capability">CAPABILITY</th>
                <th className="da-col-traditional">TRADITIONAL BI & DASHBOARDS</th>
                <th className="da-col-pbis">
                  <div className="da-pbis-badge">
                    <Shield size={14} /> PBIS DIAGNOSTIC SYSTEM
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="da-row">
                  <td className="da-cell-capability">{row.capability}</td>
                  <td className="da-cell-traditional">
                    <div className="da-cell-content">
                      <div className="da-icon-minus">
                        <Minus size={16} />
                      </div>
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="da-cell-pbis">
                    <div className="da-cell-content">
                      <div className="da-icon-check">
                        <Check size={16} />
                      </div>
                      <span className="da-pbis-highlight-text">{row.pbis}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Responsive Stacked View */}
        <div className="da-mobile-cards">
          {comparisonRows.map((row, idx) => (
            <div key={idx} className="da-mobile-card card">
              <div className="da-mobile-cap-title">{row.capability}</div>
              <div className="da-mobile-comparison-grid">
                <div className="da-mobile-box da-mobile-trad">
                  <div className="da-mobile-label">Traditional BI</div>
                  <div className="da-mobile-text">
                    <Minus size={14} className="da-icon-minus-sm" />
                    <span>{row.traditional}</span>
                  </div>
                </div>

                <div className="da-mobile-box da-mobile-pbis">
                  <div className="da-mobile-label da-pbis-mobile-label">PBIS System</div>
                  <div className="da-mobile-text">
                    <Check size={14} className="da-icon-check-sm" />
                    <span className="da-pbis-highlight-text">{row.pbis}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
