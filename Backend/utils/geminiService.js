import { GoogleGenAI } from '@google/genai';

/**
 * Generate Structured Gemini AI Business Insights from calculated metrics.
 * NEVER sends raw dataset; only structured calculated numerical metrics.
 * Uses Indian Rupee (₹) and simple business owner language.
 */
export async function generateBusinessInsights(structuredPayload) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  // Deterministic local fallback if no API key is provided
  if (!apiKey || apiKey.trim() === '') {
    return buildLocalFallbackInsights(structuredPayload);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a friendly, simple business advisor explaining business performance to a normal business owner.
Convert the following calculated numerical metrics into structured, simple business insights.

RULES:
1. Do NOT invent or hallucinate any numbers, percentages, or metrics. Use ONLY the provided numbers.
2. Use Indian Rupee (₹) formatting for all monetary amounts (e.g., ₹17,40,934, ₹1,00,000, ₹10,000).
3. Use simple, everyday English. Avoid technical jargon like "Z-Score", "Regression", "Feature Importance", "Operational Optimization", "Strategic Intervention", "Sales Motion".
4. Return ONLY a valid JSON object strictly matching this schema:
{
  "summary": "Simple overall business status summary",
  "businessHealthExplanation": "Explanation of health score in simple words",
  "keyFindings": ["Finding 1", "Finding 2"],
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": [
    {
      "code": "REC-01",
      "title": "Simple Title (e.g. Improve Top Item Sales)",
      "problem": "What we found",
      "evidence": "Numerical evidence in ₹",
      "recommendedAction": "Simple actionable advice",
      "priority": "HIGH",
      "upside": "Estimated benefit in ₹",
      "category": "REVENUE_GROWTH",
      "status": "ACTIVE"
    }
  ],
  "priorityActions": [
    {
      "title": "Simple Action Title",
      "problem": "What we found",
      "evidence": "Numerical evidence in ₹",
      "recommendedAction": "Simple action step",
      "priority": "HIGH",
      "status": "PENDING",
      "dueDate": "Next 14 Days"
    }
  ]
}

DATA PAYLOAD:
${JSON.stringify(structuredPayload, null, 2)}
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    const parsed = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('Gemini API call failed, using deterministic local engine fallback:', error.message);
    return buildLocalFallbackInsights(structuredPayload);
  }
}

function buildLocalFallbackInsights(payload) {
  const healthScore = payload.summary?.healthScore || 70;
  const monthlyRevenue = payload.summary?.monthlyRevenue || 0;
  const profitMargin = payload.summary?.profitMargin || '0%';
  const revFormatted = '₹' + Math.round(monthlyRevenue).toLocaleString('en-IN');

  return {
    summary: `We analyzed ${payload.profile?.totalRows || 'your uploaded'} records. Your business health score is ${healthScore} out of 100 with total revenue of ${revFormatted} and profit margin of ${profitMargin}.`,
    businessHealthExplanation: `Your business is operating at a health score of ${healthScore} out of 100.`,
    keyFindings: payload.summary?.positiveFactors || ['Sales trajectory is stable across recent periods.', 'Your data quality is good.'],
    risks: payload.summary?.negativeFactors || ['Profit margins have room for improvement.'],
    recommendations: payload.recommendations || [],
    priorityActions: (payload.recommendations || []).map(r => ({
      title: r.title,
      problem: r.problem,
      evidence: r.evidence,
      recommendedAction: r.recommendedAction,
      priority: r.priority || 'HIGH',
      status: 'PENDING',
      dueDate: 'Next 14 Days'
    }))
  };
}

/**
 * Realtime AI Business Search Engine ("Google for Business")
 * Answers natural language business queries with structured synthesis, action steps, key metrics, and risk assessment.
 */
export async function performRealtimeBusinessSearch(query, industryType = 'General', businessContext = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey || apiKey.trim() === '') {
    return buildLocalFallbackSearch(query, industryType, businessContext);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are BizQuery, a world-class AI Business Analyst and Real-Time Search Engine for small and medium businesses (similar to Google for Business Intelligence).
The user is asking a natural language business question.
Industry Context: ${industryType || 'General Business'}
Business Data Context: ${JSON.stringify(businessContext || {})}

User Query: "${query}"

RULES:
1. Provide a direct, plain-English executive answer first.
2. Use Indian Rupee (₹) formatting for monetary amounts when providing financial advice or benchmarks.
3. Include actionable steps, key metrics to track, industry benchmarks, and risk factors.
4. Return ONLY a valid JSON object matching this schema:
{
  "query": "${query}",
  "industry": "${industryType}",
  "directAnswer": "Concise 2-3 sentence executive answer directly addressing the query.",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "actionSteps": [
    {
      "step": 1,
      "title": "Action step title",
      "description": "Clear step-by-step guidance on how to execute this action",
      "timeframe": "Immediate / 7 Days / 30 Days"
    }
  ],
  "metricsToTrack": [
    { "name": "Metric name", "target": "Recommended target value in ₹ or %", "why": "Why this matters" }
  ],
  "industryBenchmarks": "Key industry benchmark reference",
  "risksToAvoid": ["Risk factor 1", "Risk factor 2"],
  "relatedQueries": ["Follow-up query 1?", "Follow-up query 2?", "Follow-up query 3?"]
}
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini Realtime Search error, fallback triggered:', error.message);
    return buildLocalFallbackSearch(query, industryType, businessContext);
  }
}

/**
 * Deterministic local fallback for Realtime AI Business Search
 */
function buildLocalFallbackSearch(query, industryType, businessContext) {
  const qLower = (query || '').toLowerCase();
  
  let directAnswer = `For ${industryType || 'General'} businesses, focusing on core margin optimization, inventory velocity, and customer retention produces the highest ROI.`;
  let actionSteps = [
    { step: 1, title: 'Analyze Customer Retention & Repeat Purchases', description: 'Identify top 20% repeat buyers and offer personalized loyalty incentives.', timeframe: 'Immediate' },
    { step: 2, title: 'Optimize Operating Costs & Margins', description: 'Review variable expenses and negotiate volume discounts with primary suppliers.', timeframe: '7 Days' },
    { step: 3, title: 'Automate Marketing & Follow-ups', description: 'Set up WhatsApp/Email automated follow-ups for inactive customers.', timeframe: '14 Days' }
  ];
  let metricsToTrack = [
    { name: 'Gross Margin %', target: '35% - 50%', why: 'Ensures sufficient buffer for operating overhead' },
    { name: 'Repeat Customer Rate', target: '25% - 40%', why: 'Acquiring new customers costs 5x more than retaining existing ones' },
    { name: 'Average Order Value (AOV)', target: '₹1,500 - ₹5,000', why: 'Direct driver of revenue per transaction' }
  ];

  if (qLower.includes('profit') || qLower.includes('margin') || qLower.includes('cost')) {
    directAnswer = `To improve profit margins in your ${industryType} business, focus on reducing high-cost low-margin inventory items, upselling premium service bundles, and renegotiating vendor pricing.`;
    metricsToTrack[0] = { name: 'Net Profit Margin', target: '15% - 25%', why: 'True bottom-line indicator of business stability' };
  } else if (qLower.includes('customer') || qLower.includes('retention') || qLower.includes('churn')) {
    directAnswer = `Customer retention in ${industryType} relies heavily on post-sale engagement, rapid customer support response, and recurring value offers.`;
    metricsToTrack[1] = { name: 'Customer Lifetime Value (LTV)', target: '3x Customer Acquisition Cost (CAC)', why: 'Ensures profitable unit economics' };
  } else if (qLower.includes('marketing') || qLower.includes('sales') || qLower.includes('growth')) {
    directAnswer = `Accelerating revenue growth requires optimizing conversion rates on existing traffic/footfall before expanding marketing spend.`;
  }

  return {
    query: query || 'General Business Strategy',
    industry: industryType || 'General',
    directAnswer,
    keyInsights: [
      `Targeting high-margin offerings increases net profit faster than boosting top-line sales alone.`,
      `Tracking weekly metrics prevents month-end cash flow surprises.`,
      `Customer satisfaction scores strongly correlate with 30-day repeat purchases.`
    ],
    actionSteps,
    metricsToTrack,
    industryBenchmarks: `${industryType} standard operating margin benchmark is typically 18% - 32%.`,
    risksToAvoid: [
      'Over-discounting products without calculating bottom-line impact in ₹',
      'Ignoring slow-moving inventory tied up in working capital'
    ],
    relatedQueries: [
      `How to increase average order value in ${industryType}?`,
      `Best cost reduction strategies for ${industryType} businesses`,
      `How to set up automated customer retention campaigns?`
    ]
  };
}

/**
 * Generate Industry-Specific Insights
 */
export async function generateIndustrySpecificInsights(structuredPayload, industryType = 'General') {
  const payloadWithIndustry = {
    ...structuredPayload,
    targetIndustry: industryType
  };
  return generateBusinessInsights(payloadWithIndustry);
}

